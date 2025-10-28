import { useState } from "react";
import type { NominatimResult } from "@/types/site";
import {
  searchByName,
  searchByCategory,
  searchByBoundingBox,
} from "@/lib/api/nominatim";

// List of valid categories for Overpass API
const VALID_CATEGORIES = [
  "museum",
  "castle",
  "monument",
  "church",
  "ruins",
  "archaeological_site",
];

export function useSearch() {
  // user input
  const [searchQuery, setSearchQuery] = useState("");

  // the list of heritage sites found
  const [sites, setSites] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    console.error("Search failed:", error);
    setSites([]);

    // check if it's a timeout error (504)
    if (error instanceof Error && error.message.includes("504")) {
      setError(
        "Search timed out. Try a more specific search or different category."
      );
    } else {
      setError("Search failed. Please try again.");
    }
  };

  // search by text (name or category)
  const search = async () => {
    // don't search if query is empty
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let results: NominatimResult[];

      // if query is a category (use Overpass API)
      if (VALID_CATEGORIES.includes(searchQuery.toLowerCase())) {
        results = await searchByCategory(searchQuery.toLowerCase());
      } else {
        // search by name (use Nominatim API)
        results = await searchByName(searchQuery);
      }

      setSites(results);
    } catch (error) {
      handleError(error);
    } finally {
      // always stop loading, whether success or error
      setIsLoading(false);
    }
  };

  // search by featured museum name
  const searchFeaturedMuseum = async (museumName: string) => {
    setSearchQuery(museumName);
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchByName(museumName);
      setSites(results);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // search by bounding box (geographic area)
  const searchByLocation = async (boundingBox: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchByBoundingBox(boundingBox);
      setSites(results);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // reset everything to initial state
  const reset = () => {
    setSearchQuery("");
    setSites([]);
    setError(null);
  };

  return {
    // state
    searchQuery,
    sites,
    isLoading,
    error,

    // actions
    setSearchQuery,
    search,
    searchFeaturedMuseum,
    searchByLocation,
    reset,
  };
}
