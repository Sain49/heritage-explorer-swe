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

// OpenStreetMap (OSM) XML Api types
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

// WikiData SPARQL Api types
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
