import type {
  APIResponse,
  SearchParams,
  SimplifiedHeritageSite,
  HeritageSite,
  MultiLanguageText,
  ImageObject,
} from "@/types/visitSweden";

// Constants
const BASE_URL = "https://data.visitsweden.com/store/search";
const DEFAULT_LIMIT = 20;

// the Api uses a special query language (Solr), due to this need to combine filters into one string
// example: "public:true AND rdfType:http\://schema.org/Place AND museum AND dcterms_spatial:*stockholm*"
function buildSearchQuery(params: SearchParams): string {
  let query = "public:true";

  // add type filter
  const typeFilter = params.type || "Place";
  const encodedType = `http\\://schema.org/${typeFilter}`;
  query += ` AND rdfType:${encodedType}`;

  // add keyword search
  if (params.location && params.keyword?.trim()) {
    query += ` AND ${params.keyword.trim()}`;
  }

  // add location filter
  if (params.location && params.location.trim()) {
    query += ` AND dcterms_spatial:*${params.location.trim()}*`;
  }

  return query;
}

// create the complete url for the api
function buildApiUrl(params: SearchParams): string {
  const query = buildSearchQuery(params);
  const limit = params.limit || DEFAULT_LIMIT;
  const offset = params.offset || 0;

  const urlParams = new URLSearchParams({
    type: "solr",
    query: query,
    limit: limit.toString(),
    offset: offset.toString(),
    rdFormat: "application/ld+json", // Json-ld format based on Visit Sweden api
  });

  // combine base url with params
  return `${BASE_URL}?${urlParams.toString()}`;
}

// extract the English text or fall back to Swedish or first in the array or empty string
function extractText(
  field: string | MultiLanguageText[] | undefined,
  preferredLanguage = "en"
): string {
  if (typeof field === "string") {
    return field;
  }

  if (Array.isArray(field)) {
    // English
    const preferred = field.find(
      (item) => item["@language"] === preferredLanguage
    );
    if (preferred) {
      return preferred["@value"];
    }

    // Swedish
    const swedish = field.find((i) => i["@language"] === "sv");
    if (swedish) {
      return swedish["@value"];
    }

    // if neither, return the first one
    if (field.length > 0) {
      return field[0]["@value"];
    }
  }

  return "";
}

// get image url
function extractImageUrl(
  image: string | ImageObject | ImageObject[] | undefined
): string | null {
  // simple url string
  if (typeof image === "string") {
    return image;
  }

  // is an array then get the first oen
  if (Array.isArray(image)) {
    if (image.length > 0) {
      return image[0]["@id"] || image[0]["schema:contentUrl"] || null;
    }
  }

  // is an object
  if (typeof image === "object" && !Array.isArray(image)) {
    return image["@id"] || image["schema:contentUrl"] || null;
  }

  return null;
}

// get the region name from the region url
function extractRegion(spatial: { "@id": string } | undefined): string | null {
  if (!spatial || !spatial["@id"]) {
    return null;
  }

  // example: "http://data.visitsweden.com/region/stockholm" -> "stockholm"
  const parts = spatial["@id"].split("/");
  return parts[parts.length - 1] || null;
}

// get category name
function extractCategory(site: HeritageSite): string {
  // if there's a more specific type like museum
  if (site["schema:additionalType"]) {
    const additionalType = site["schema:additionalType"]["@id"];
    const parts = additionalType.split("/");
    const category = parts[parts.length - 1];
    return category || "Place";
  }

  // otherwise use the main type
  const mainType = site["@type"];
  if (mainType.includes(":")) {
    return mainType.split(":")[1];
  }

  return mainType;
}

// converts api data to a simpler format
function transformHeritageSite(site: HeritageSite): SimplifiedHeritageSite {
  return {
    id: site["@id"],
    name: extractText(site["schema:name"]),
    description: extractText(site["schema:description"], "en"),
    descriptionSwedish: extractText(site["schema:description"], "sv"),
    imageUrl: extractImageUrl(site["schema:image"]),
    latitude: site["schema:geo"]?.["schema:latitude"] || null,
    longitude: site["schema:geo"]?.["schema:longitude"] || null,
    address: site["schema:address"]?.["schema:streetAddress"] || null,
    city: site["schema:address"]?.["schema:addressLocality"] || null,
    region: extractRegion(site["dcterms:spatial"]),
    websiteUrl:
      typeof site["schema:url"] === "string"
        ? site["schema:url"]
        : site["schema:url"]?.["@id"] || null,
    category: extractCategory(site),
    phone: site["schema:telephone"] || null,
  };
}

// main function to search for heritage sites
export async function searchHeritageSites(params: SearchParams = {}): Promise<{
  sites: SimplifiedHeritageSite[];
  total: number;
  offset: number;
  limit: number;
}> {
  const url = buildApiUrl(params);

  console.log("fetching from: ", url); // for dubugging

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data: APIResponse = await response.json();

  const sites = data.results.map((entry) =>
    transformHeritageSite(entry.resource)
  );

  return {
    sites,
    total: data.hits,
    offset: data.offset,
    limit: data.limit,
  };
}

// search by keyword only
export async function searchByKeyword(keyword: string, limit = DEFAULT_LIMIT) {
  return searchHeritageSites({ keyword, limit });
}

// search by location only
export async function searchByLocation(
  location: string,
  limit = DEFAULT_LIMIT
) {
  return searchHeritageSites({ location, limit });
}

// get all sites paginated
export async function getAllHeritageSites(limit = DEFAULT_LIMIT, offset = 0) {
  return searchHeritageSites({ limit, offset });
}
