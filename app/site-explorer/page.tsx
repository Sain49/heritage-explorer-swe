"use client";

import { useState } from "react";

import type { NominatimResult } from "@/types/site";
import { searchByName, searchByCategory } from "@/lib/api/nominatim";
import Link from "next/link";

export default function SiteExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sites, setSites] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Heritage Site Explorer</h1>

      {/* Search form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Search heritage sites</h2>

        {/* search input */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Search:
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
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-400 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-400 text-white hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* result section */}
      <div>
        {sites.length > 0 && (
          <p className="mb-4 text-gray-600">Found {sites.length} sites</p>
        )}

        {isLoading && <p className="text-blue-600">Loading...</p>}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid gap-4">
          {sites.map((site) => (
            <div key={site.osmId} className="border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">{site.name}</h3>
              <p className="text-gray-600 mb-1">
                <strong>Coordinates:</strong> {site.latitude}, {site.longitude}
              </p>
              <p className="text-gray-500 text-sm mb-3">
                <em>
                  OSM: {site.osmType}/{site.osmId}
                </em>
              </p>

              <Link
                href={`/site-details?osmId=${site.osmId}&osmType=${site.osmType}`}
              >
                <button className="px-3 py-1 bg-green-400 text-white text-sm hover:bg-green-600">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>

        {!isLoading && sites.length === 0 && searchQuery && (
          <p className="text-gray-500">
            No sites found. Try a different search!
          </p>
        )}
      </div>
    </div>
  );
}
