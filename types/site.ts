// Nominatim Api types
export type NominatimResult = {
  place_id: number;
  osm_type: "node" | "way" | "relation";
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  class: string; // category (tourism, historic, amenity)
  type: string; // subcategory (museum, castle, church)
  importance: number;

  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    municipality?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };

  // bounding box: [min_lat, max_lat, min_lon, max_lon]
  boundingbox?: string[];
};

// OPENSTREETMAP (OSM) XML Api types
export type OSMTag = {
  k: string; // key (name)
  v: string; // value
};

// OSM element (node/way/relation)
export type OSMElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  tags?: OSMTag[]; // metadata
};

// The full OSM XML Api response
export type OSMResponse = {
  elements: OSMElement[];
};

// WIKIDATA SPARQL Api types
// a single result
export type WikidataBinding = {
  type: string;
  value: string;
  dataType?: string;
};

// sparql response
export type WikidataResponse = {
  results: {
    bindings: {
      [key: string]: WikidataBinding;
    }[];
  };
};

// WikiMedias commons Api types
// image info
export type WikimediaImageInfo = {
  url: string;
  descriptionurl: string;
  width: number;
  height: number;
};

// Wikimedia commons api response
export type WikimediaResponse = {
  query?: {
    pages?: {
      [key: string]: {
        imageinfo?: WikimediaImageInfo[];
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
  contetn_urls?: {
    desktop?: {
      page: string; // link to full article
    };
  };
};
