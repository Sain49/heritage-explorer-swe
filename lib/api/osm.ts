import type { OSMResponse, OSMElement, OSMTag } from "@/types/site";

const OSM_BASE_URL = "https://www.openstreetmap.org/api/0.6";

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
  // look for the element and its tags
  const elementRegex = new RegExp(
    `<${expectedType} id="${expectedId}"([^>]*)>(.*?)</${expectedType}>`,
    "s"
  );
  const elementMatch = xmlText.match(elementRegex);

  if (!elementMatch) {
    return null;
  }

  // extract tags from the element content
  const elementContent = elementMatch[2];
  const tags: OSMTag[] = [];

  // Find all <tag k="..." v="..."> elements
  const tagRegex = /<tag k="([^"]+)" v="([^"]*)"\/?>/g;
  let tagMatch;

  while ((tagMatch = tagRegex.exec(elementContent)) !== null) {
    tags.push({
      k: tagMatch[1],
      v: tagMatch[2],
    });
  }

  return {
    type: expectedType,
    id: expectedId,
    tags: tags.length > 0 ? tags : undefined,
  };
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
