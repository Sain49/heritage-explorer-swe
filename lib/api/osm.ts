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
  // correct url based on type
  const url = `${OSM_BASE_URL}/${osmType}/${osmId}`;

  console.log(`Fetching OSM details from: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSM api failed: ${response.status}`);
    }

    // xml as text
    const xmlText = await response.text();

    // parse the xml to extract the element
    const element = parseOSMXml(xmlText, osmType, osmId);

    return element;
  } catch (error) {
    console.error("OSM fetch failed:", error);
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
      return null;
    }

    // Check if the id matches
    const elementId = element["@_id"];
    if (parseInt(elementId) !== expectedId) {
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
    console.error("XML parsing failed:", error);
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
