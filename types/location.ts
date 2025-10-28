// type definitions for geographic locations and bounding boxes

// geographic bounding box (rectangular area)
export type BoundingBox = {
  minLat: number; // Minimum latitude (south)
  maxLat: number; // Maximum latitude (north)
  minLon: number; // Minimum longitude (west)
  maxLon: number; // Maximum longitude (east)
};

// popular location with name and geographic boundaries
export type PopularLocation = {
  name: string;
  boundingBox: BoundingBox;
};

// coordinate point (single location)
export type Coordinates = {
  latitude: number;
  longitude: number;
};
