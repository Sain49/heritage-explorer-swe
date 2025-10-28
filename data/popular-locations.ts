export interface PopularLocation {
  name: string;
  boundingBox: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

export const POPULAR_LOCATIONS: PopularLocation[] = [
  {
    name: "Stockholm",
    boundingBox: { minLat: 59.2, maxLat: 59.5, minLon: 17.8, maxLon: 18.2 },
  },
  {
    name: "Gotland",
    boundingBox: { minLat: 56.9, maxLat: 58.0, minLon: 18.0, maxLon: 19.0 },
  },
  {
    name: "Norrbotten",
    boundingBox: { minLat: 65.0, maxLat: 69.0, minLon: 16.0, maxLon: 25.0 },
  },
  {
    name: "Dalarna",
    boundingBox: { minLat: 59.5, maxLat: 62.5, minLon: 12.0, maxLon: 16.0 },
  },
  {
    name: "Västra Götaland",
    boundingBox: { minLat: 57.0, maxLat: 59.0, minLon: 11.0, maxLon: 14.5 },
  },
];
