// Nominatim Api types
export type NominatimResult = {
  // essential for (OSM XML API)
  osmId: number;
  osmType: "node" | "way" | "relation";

  name: string;
  class: string;
  type: string;

  latitude: number;
  longitude: number;

  // bounding box: [min_lat, max_lat, min_lon, max_lon] for map
  boundingbox?: string[];
};

// OPENSTREETMAP (OSM) XML Api types
export type OSMTag = {
  k: string; // key (name)
  v: string; // value
};

// OSM element (node/way/relation)
export type OSMNode = {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags?: OSMTag[];
};

export type OSMWay = {
  type: "way";
  id: number;
  tags?: OSMTag[];
};

export type OSMRelation = {
  type: "relation";
  id: number;
  tags?: OSMTag[];
};

export type OSMElement = OSMNode | OSMWay | OSMRelation;

// The full OSM XML Api response
export type OSMResponse = {
  elements: OSMElement[];
};

// WIKIDATA SPARQL Api types
// a single result
export type WikidataBinding = {
  image?: { type: string; value: string };
  description?: { type: string; value: string };
};

// sparql response
export type WikidataResponse = {
  results: {
    bindings: WikidataBinding[]; // array of results from the query
  };
};

// WikiMedias commons Api types
// image info
export type WikidataImageData = {
  imageUrl: string | null;
  description: string | null;
};

// Wikimedia commons api response
export type WikimediaResponse = {
  query?: {
    pages?: {
      [key: string]: {
        imageinfo?: WikidataImageData[];
      };
    };
  };
};

// Wikipedia REST api types
export type WikipediaSummary = {
  title: string;
  extract: string; // short description
  extract_html?: string; // description with html formatting
  thumbnail?: {
    source: string; // image url
    width: number;
    height: number;
  };
  content_urls?: {
    desktop?: {
      page: string; // link to full article
    };
  };
};

// unified site type
export type Site = {
  // Basic Information
  id: string;
  name: string; // Site name (Vasa Museum)
  description: string; // Full description
  category: string; // Type (museum, castle, church)

  // Location Data
  latitude: number; // decimal latitude
  longitude: number; // decimal longitude
  address: string | null; // Street address
  city: string | null; // city
  postcode: string | null; // postal code
  country: string | null; // country

  // more content
  imageUrl: string | null; // main image URL (from Wikidata or Wikipedia)
  imageAlt: string | null; // Image alt text for accessibility
  websiteUrl: string | null; // Official website
  phone: string | null; // Phone number
  openingHours: string | null; // Opening hours text

  // External references
  wikidataId: string | null; // Wikidata QID ("Q901371")
  wikipediaUrl: string | null; // Wikipedia article url
  osmId: number; // OpenStreetMap Id
  osmType: "node" | "way" | "relation"; // OSM object type

  // Metadata
  importance?: number; // Search relevance score (from Nominatim)
  lastUpdated?: string; // ISO date string
};

// search parameters type
export type SiteSearchParams = {
  query?: string; // free-text search ("Vasa Museum")
  category?: string; // filter by type (museum, castle, etc.)
  location?: string; // filter by location (Stockholm, Göteborg, etc.)
  limit?: number; // max number of results (default: 10)
  boundingBox?: {
    // geographic area to search within
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
};

// api response wrapper type
export type SiteResponse = {
  sites: Site[]; // array of sites found
  total: number; // total count (for pagination)
  query: string; // search query used
  timestamp: string; // when this search was performed
};
