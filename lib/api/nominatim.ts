import type { NominatimResult } from "@/types/site";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const OVERPASS_BASE_URL = "https://overpass-api.de/api/interpreter";

const USER_AGENT = "HeritageExplorerSwe/1.0 (Educational Project)";

// api responses
interface NominatimApiItem {
  osm_id: number;
  osm_type: string;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  class: string;
  type: string;
  boundingbox?: string[];
}

interface OverpassApiElement {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { [key: string]: string };
}

type TagMapping = {
  key: string;
  value: string;
};

// helper func: delay between requests due to nominatim limits requests to 1
// request per second
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// search function
export async function searchByName(query: string): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    format: "json",
    q: query,
    limit: "20",
    addressdetails: "1",
    countrycodes: "se",
  });

  const url = `${NOMINATIM_BASE_URL}/search?${params.toString()}`;
  console.log(`Searching for: "${query}"`);
  console.log(`Searching for: "${url}"`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT, // required
      },
    });

    if (!response.ok) {
      throw new Error(`Api failed: ${response.status}`);
    }

    const apiResults = await response.json();
    const results: NominatimResult[] = apiResults.map(
      (item: NominatimApiItem) => ({
        osmId: item.osm_id,
        osmType: item.osm_type,
        name: item.name || item.display_name.split(",")[0],
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        class: item.class,
        type: item.type,
        boundingbox: item.boundingbox,
      })
    );

    // filter to only heritage sites
    const heritageSites = results.filter(isHeritageSite);

    console.log(`Filtered to ${heritageSites.length} heritage sites`);

    await delay(1000); // wait 1 second before next request (nominatim rule)

    return heritageSites;
  } catch (error) {
    console.error("search failed: ", error);
    throw error;
  }
}

// category-based searches using Overpass API
export async function searchByCategory(
  category: string
): Promise<NominatimResult[]> {
  let query = "";

  // Map categories to OSM tags
  const tagMappings: Record<string, TagMapping> = {
    museum: { key: "tourism", value: "museum" },
    castle: { key: "historic", value: "castle" },
    monument: { key: "historic", value: "monument" },
    church: { key: "amenity", value: "place_of_worship" },
    ruins: { key: "historic", value: "ruins" },
    archaeological_site: { key: "historic", value: "archaeological_site" },
  };

  const tag = tagMappings[category];
  if (!tag) {
    throw new Error(`Unsupported category: ${category}`);
  }

  // build Overpass query
  query = `
    [out:json][timeout:60];
    area["ISO3166-1"="SE"];
    (
      node["${tag.key}"="${tag.value}"](area);
      way["${tag.key}"="${tag.value}"](area);
      relation["${tag.key}"="${tag.value}"](area);
    );
    out center 20;
  `;

  console.log(`Overpass query for ${category}:`, query.trim());

  try {
    const response = await fetch(OVERPASS_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API failed: ${response.status}`);
    }

    const data = await response.json();

    const results: NominatimResult[] = data.elements.map(
      (element: OverpassApiElement) => ({
        osmId: element.id,
        osmType: element.type,
        name: element.tags?.name || `Unknown ${category}`,
        latitude: element.lat || element.center?.lat,
        longitude: element.lon || element.center?.lon,
        class: tag.key,
        type: tag.value,
      })
    );

    console.log(`Found ${results.length} ${category} sites`);

    await delay(1000);

    return results;
  } catch (error) {
    console.error("Overpass search failed: ", error);
    throw error;
  }
}

// filters by class and type
function isHeritageSite(result: NominatimResult): boolean {
  // List of relevant classes
  const validClasses = [
    "tourism",
    "historic",
    "amenity", // some cultural centers
    "building", // if it's a specific heritage building
  ];

  // list of relevant types
  const validTypes = [
    "museum",
    "castle",
    "monument",
    "memorial",
    "archaeological_site",
    "ruins",
    "attraction",
    "viewpoint",
    "artwork",
    "fort",
    "manor",
    "city_gate",
    "tower",
    "church",
    "cathedral",
    "chapel",
    "monastery",
    "place_of_worship",
    "palace",
    "fortress",
    "abbey",
    "convent",
    "temple",
    "shrine",
    "mosque",
    "synagogue",
    "heritage",
    "historic",
    "landmark",
  ];

  // reject useless types
  const invalidTypes = [
    "yes",
    "house",
    "residential",
    "apartments",
    "restaurant",
    "fast_food",
  ];

  // check if it's a heritage site
  const hasValidClass = validClasses.includes(result.class);
  const hasValidType = validTypes.includes(result.type);
  const hasInvalidType = invalidTypes.includes(result.type);

  return (hasValidClass || hasValidType) && !hasInvalidType;
}
