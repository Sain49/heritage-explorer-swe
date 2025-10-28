// type definitions for search functionality

import type { NominatimResult } from "./site";
import type { BoundingBox } from "./location";

// search state
export type SearchState = {
  query: string; // current search query
  results: NominatimResult[];
  isLoading: boolean;
  error: string | null;
};

// valid search categories for Overpass API
export type SearchCategory =
  | "museum"
  | "castle"
  | "monument"
  | "church"
  | "ruins"
  | "archaeological_site";

// search filter options
export type SearchFilters = {
  category?: SearchCategory;
  location?: string;
  boundingBox?: BoundingBox;
};

// search function parameters
export type SearchParams = {
  query: string;
  category?: SearchCategory;
  boundingBox?: BoundingBox;
};

// search hook return type
export type UseSearchReturn = {
  searchQuery: string;
  sites: NominatimResult[];
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  search: () => Promise<void>;
  searchFeaturedMuseum: (museumName: string) => Promise<void>;
  searchByLocation: (boundingBox: BoundingBox) => Promise<void>;
  reset: () => void;
};
