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
