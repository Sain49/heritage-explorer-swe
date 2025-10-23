"use client";

import { useState } from "react";
import Link from "next/link";

import type { NominatimResult } from "@/types/site";
import {
  searchByName,
  searchByCategory,
  searchByBoundingBox,
} from "@/lib/api/nominatim";
import { FEATURED_MUSEUMS } from "@/data/featured-museums";
import MapErrorBoundary from "@/components/map-error-boundary";
import Map from "@/components/map";

// popular locations with their bounding boxes
const POPULAR_LOCATIONS = [
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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sites, setSites] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFeaturedMuseumClick = async (museumName: string) => {
    setSearchQuery(museumName);

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchByName(museumName);
      setSites(results);
    } catch (error) {
      console.error("Search failed: ", error);
      setSites([]);
      setError(
        error instanceof Error && error.message.includes("504")
          ? "Search timed out. Try a more specific search or different category."
          : "Search failed. Please try again."
      );
    }

    setIsLoading(false);
  };

  const handleSearch = async () => {
    // don't search
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const categories = [
        "museum",
        "castle",
        "monument",
        "church",
        "ruins",
        "archaeological_site",
      ];

      let results: NominatimResult[];
      if (categories.includes(searchQuery.toLowerCase())) {
        // use Overpass for categories
        results = await searchByCategory(searchQuery.toLowerCase());
      } else {
        // use Nominatim for specific names and combined searches
        results = await searchByName(searchQuery);
      }
      setSites(results);
    } catch (error) {
      console.error("Search failed: ", error);
      setSites([]);
      setError(
        error instanceof Error && error.message.includes("504")
          ? "Search timed out. Try a more specific search or different category."
          : "Search failed. Please try again."
      );
    }

    setIsLoading(false);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSites([]);
    setError(null);
  };

  const handleLocationSearch = async (boundingBox: {
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
      console.error("Location search failed:", error);
      setSites([]);
      // For now, just log the error (no error handling in Stage 1)
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 mt-6">
        Welcome to Heritage Explorer Sweden!
      </h1>

      {/* featured museums and popular locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Featured Museums in Stockholm
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {FEATURED_MUSEUMS.map((museum) => (
              <div key={museum.id}>
                <button
                  onClick={() => handleFeaturedMuseumClick(museum.name)}
                  className="text-blue-600 hover:text-blue-800 text-left focus:outline-none focus:underline"
                >
                  {museum.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Locations</h2>
          <div>
            {POPULAR_LOCATIONS.map((location) => (
              <div key={location.name}>
                <button
                  onClick={() => handleLocationSearch(location.boundingBox)}
                >
                  {location.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search form */}
      <div className="mb-6">
        {/* search input */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-lg mb-2">
            Search heritage sites:
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Vasa Museum, Gripsholm Castle, museum, castle..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 border border-blue-300 bg-blue-300 hover:bg-blue-400 focus:outline-none focus:border-blue-400 disabled:opacity-80"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:border-gray-500"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {/* left column: map */}
          <MapErrorBoundary>
            <Map sites={sites} />
          </MapErrorBoundary>
        </div>
        <div className="flex-1 space-y-4">
          {/* right column results*/}
          {/* search result */}
          <div>
            {isLoading && <p className="text-gray-700">Loading...</p>}

            {error && (
              <div className="p-4 border border-gray-300">
                <p className="text-gray-700">{error}</p>
              </div>
            )}

            <div className="grid gap-4">
              {sites.map((site) => (
                <div key={site.osmId} className="border border-gray-300 p-4">
                  <h3 className="text-lg mb-2 text-gray-900">{site.name}</h3>
                  <p className="text-gray-600 mb-1">
                    <strong className="text-gray-800">Coordinates:</strong>{" "}
                    {site.latitude}, {site.longitude}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    OSM: {site.osmType}/{site.osmId}
                  </p>

                  <Link
                    href={`/site-details?osmId=${site.osmId}&osmType=${site.osmType}`}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                    aria-label={`View details for ${site.name}`}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {!isLoading && sites.length === 0 && searchQuery && (
              <div className="p-4 border border-gray-300">
                <p className="text-gray-700">
                  No sites found. Try a different search!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
