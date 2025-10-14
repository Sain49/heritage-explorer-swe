"use client";

import { useState } from "react";

import type { NominatimResult } from "@/types/site";
import { searchByName, searchByCategory } from "@/lib/api/nominatim";

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
        // Use Overpass for categories
        results = await searchByCategory(searchQuery.toLowerCase());
      } else {
        // Use Nominatim for specific names and combined searches
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
    <div>
      <h1>Heritage Site Explorer</h1>

      {/* Search form */}
      <div>
        <h2>Search heritage sites</h2>
        {/* search input */}
        <div>
          <label htmlFor="search">Search:</label>
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
          />
        </div>
      </div>

      {/* location input
        <div>
          <label htmlFor="location">Location (region)</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="stockholm, gotland, dalarna..."
          />
        </div> */}

      {/* buttons */}
      <div>
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>

        <button onClick={handleReset}>Reset</button>
      </div>

      {/* result section */}
      <div>
        {sites.length > 0 && <p>Found {sites.length} sites</p>}

        {isLoading && <p>Loading...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {sites.map((site) => (
          <div key={site.place_id}>
            <h3>{site.name || "Unknown Site"}</h3>

            <p>
              <strong>Category:</strong> {site.type}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {site.address?.city || site.address?.city || "Sweden"}
            </p>

            <hr />
          </div>
        ))}

        {!isLoading && sites.length === 0 && searchQuery && (
          <p>No sites found. Try a different search!</p>
        )}
      </div>
    </div>
  );
}
