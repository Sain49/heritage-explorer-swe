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

import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/map"), { ssr: false });

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(sites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSites = sites.slice(startIndex, endIndex);

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

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSites([]);
    setError(null);
    setCurrentPage(1); // reset to first page
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 mt-6 uppercase tracking-wide text-amber-900 border-b border-amber-900 pb-4">
        Heritage Explorer Sweden
      </h1>

      {/* featured museums and popular locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-amber-900 p-5 bg-amber-50">
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide text-amber-900">
            Featured Museums in Stockholm
          </h2>

          <div className="space-y-2">
            {FEATURED_MUSEUMS.map((museum) => (
              <div key={museum.id}>
                <button
                  onClick={() => handleFeaturedMuseumClick(museum.name)}
                  className="text-amber-900 hover:text-amber-600 text-left focus:outline-none focus:text-amber-700 transition-colors duration-200 text-sm"
                >
                  {museum.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-stone-600 p-5 bg-stone-50">
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide text-stone-800">
            Popular Locations
          </h2>
          <div className="space-y-2">
            {POPULAR_LOCATIONS.map((location) => (
              <div key={location.name}>
                <button
                  onClick={() => handleLocationSearch(location.boundingBox)}
                  className="text-stone-800 hover:text-stone-500 text-left focus:outline-none focus:text-stone-600 transition-colors duration-200 text-sm"
                  aria-label={`Search for heritage sites in ${location.name}`}
                >
                  {location.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search form */}
      <div className="mb-6 border border-stone-700 p-5 bg-stone-50">
        {/* search input */}
        <div className="mb-4">
          <label
            htmlFor="search"
            className="block text-sm font-medium mb-2 uppercase tracking-wide text-stone-800"
          >
            Search heritage sites
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
            className="w-full px-4 py-3 border border-stone-400 bg-white focus:outline-none focus:border-stone-800 transition-colors duration-200"
          />
        </div>

        {/* buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 border border-amber-900 bg-amber-900 text-white hover:bg-amber-800 hover:border-amber-800 focus:outline-none focus:bg-amber-800 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors duration-200 uppercase tracking-wide text-sm font-medium"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 border border-stone-600 bg-white text-stone-800 hover:border-stone-800 hover:bg-stone-100 focus:outline-none focus:border-stone-800 transition-colors duration-200 uppercase tracking-wide text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* left column: map */}
          <MapErrorBoundary>
            <Map sites={sites} />
          </MapErrorBoundary>
        </div>
        <div className="flex-1 space-y-6">
          {/* right column search results*/}
          <div>
            {isLoading && (
              <div className="border border-stone-400 p-6 bg-stone-50">
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-stone-300 w-3/4"></div>
                  <div className="h-4 bg-stone-300 w-1/2"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-6 border-2 border-red-800 bg-red-50">
                <p className="text-red-900 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {currentSites.map((site) => (
                <div
                  key={site.osmId}
                  className="border border-stone-300 p-4 bg-white hover:border-amber-900 transition-colors duration-200"
                >
                  <h3 className="text-base font-semibold mb-3 text-stone-900">
                    {site.name}
                  </h3>
                  <div className="flex gap-2 mb-3 text-xs">
                    <span className="px-2 py-1 bg-amber-100 text-amber-900 uppercase tracking-wide border border-amber-900">
                      {site.type}
                    </span>
                    <span className="px-2 py-1 border border-stone-400 text-stone-700 uppercase tracking-wide">
                      {site.class}
                    </span>
                  </div>
                  <Link
                    href={`/site-details?osmId=${site.osmId}&osmType=${site.osmType}`}
                    className="inline-block px-4 py-2 bg-amber-900 text-white text-sm uppercase tracking-wide hover:bg-amber-800 focus:outline-none focus:bg-amber-800 transition-colors duration-200 border border-amber-900"
                    aria-label={`View details for ${site.name}`}
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>

            {!isLoading && sites.length === 0 && searchQuery && (
              <div className="p-8 border-2 border-stone-400 text-center bg-stone-50">
                <h3 className="text-lg font-semibold text-stone-900 mb-2 uppercase tracking-wide">
                  No Sites Found
                </h3>
                <p className="text-stone-700 mb-6">
                  Try searching for a different location or category
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-amber-900 text-white hover:bg-amber-800 transition-colors uppercase tracking-wide text-sm border border-amber-900"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-stone-400">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-stone-400 hover:border-amber-900 hover:bg-amber-50 focus:outline-none focus:border-amber-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 uppercase tracking-wide text-sm text-stone-800"
              >
                ← Previous
              </button>

              <span className="text-sm text-stone-800 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-stone-400 hover:border-amber-900 hover:bg-amber-50 focus:outline-none focus:border-amber-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 uppercase tracking-wide text-sm text-stone-800"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
