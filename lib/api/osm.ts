import type {
  OSMElement,
  OSMNode,
  OSMWay,
  OSMRelation,
  OSMTag,
} from "@/types/site";
import { XMLParser } from "fast-xml-parser";

const OSM_BASE_URL = "https://www.openstreetmap.org/api/0.6";

const parser = new XMLParser({ ignoreAttributes: false });

type ParsedTag = {
  "@_k": string;
  "@_v": string;
};

// fetch OSM element details by Id and type
export async function fetchOSMDetails(
  osmId: number,
  osmType: "node" | "way" | "relation"
): Promise<OSMElement | null> {
  // validate osmId is a positive number
  if (!osmId || osmId <= 0 || !Number.isInteger(osmId)) {
    console.error("Invalid OSM ID:", osmId);
    return null;
  }

  // validate osmType is one of the allowed values
  const validTypes = ["node", "way", "relation"];
  if (!validTypes.includes(osmType)) {
    console.error("Invalid OSM type:", osmType);
    return null;
  }

  // correct url based on type
  const url = `${OSM_BASE_URL}/${osmType}/${osmId}`;

  console.log(`Fetching OSM details from: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`OSM element not found: ${osmType}/${osmId}`);
        return null;
      } else if (response.status === 410) {
        console.error(`OSM element has been deleted: ${osmType}/${osmId}`);
        return null;
      } else {
        console.error(
          `OSM API error: ${response.status} ${response.statusText}`
        );
        throw new Error(`OSM API failed with status ${response.status}`);
      }
    }

    // xml as text
    const xmlText = await response.text();

    // validate if there is XML content
    if (!xmlText || xmlText.trim().length === 0) {
      console.error("Received empty response from OSM Api");
      return null;
    }

    // parse the xml to extract the element
    const element = parseOSMXml(xmlText, osmType, osmId);

    // log parsing failed
    if (!element) {
      console.error(
        `Failed to parse OSM element ${osmType}/${osmId} from XML response`
      );
    }

    return element;
  } catch (error) {
    console.error(
      `Failed to fetch OSM details for ${osmType}/${osmId}:`,
      error
    );
    throw error;
  }
}

// Helper function to parse OSM xml and extract tags
function parseOSMXml(
  xmlText: string,
  expectedType: "node" | "way" | "relation",
  expectedId: number
): OSMElement | null {
  try {
    const parsed = parser.parse(xmlText);

    // Access the element under osm[expectedType]
    const element = parsed.osm?.[expectedType];

    if (!element) {
      console.error(`Element type "${expectedType}" not found in XML response`);
      return null;
    }

    // Check if the id matches
    const elementId = element["@_id"];
    if (parseInt(elementId) !== expectedId) {
      console.error(`ID mismatch: expected ${expectedId}, got ${elementId}`);
      return null;
    }

    // Extract tags
    let tags: OSMTag[] | undefined;
    if (element.tag) {
      const tagArray = Array.isArray(element.tag) ? element.tag : [element.tag];
      tags = tagArray.map((tag: ParsedTag) => ({
        k: tag["@_k"],
        v: tag["@_v"],
      }));
    }

    // build the element based on type
    const baseElement = {
      type: expectedType,
      id: expectedId,
      tags,
    };

    if (expectedType === "node") {
      const lat = parseFloat(element["@_lat"]);
      const lon = parseFloat(element["@_lon"]);
      if (isNaN(lat) || isNaN(lon)) {
        console.error(
          `Invalid coordinates for node ${expectedId}: lat=${element["@_lat"]}, lon=${element["@_lon"]}`
        );
        return null; // invalid coordinates
      }
      return {
        ...baseElement,
        lat,
        lon,
      } as OSMNode;
    }

    return baseElement as OSMWay | OSMRelation;
  } catch (error) {
    console.error("XML parsing failed for OSM data:", error);
    return null;
  }
}

// Helper function to extract specific tag values
export function getTagValue(
  tags: OSMTag[] | undefined,
  key: string
): string | null {
  if (!tags) return null;

  const tag = tags.find((t) => t.k === key);
  return tag ? tag.v : null;
}
