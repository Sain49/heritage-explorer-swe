"use client";

import { useState } from "react";
import { searchHeritageSites } from "@/lib/api/visitSweden";
import type { SimplifiedHeritageSite } from "@/types/visitSweden";
import Image from "next/image";
import Link from "next/link";

export default function SiteExplorer() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [sites, setSites] = useState<SimplifiedHeritageSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0); // store total number of result

  const handleSearch = async () => {
    setIsLoading(true);

    const result = await searchHeritageSites({
      keyword: keyword || undefined,
      location: location || undefined,
      limit: 20,
    });

    setSites(result.sites);
    setTotalResults(result.total);

    setIsLoading(false);
  };

  const handleReset = () => {
    setKeyword("");
    setLocation("");
    setSites([]);
    setTotalResults(0);
  };

  return (
    <div>
      <h1>Heritage Site Explorer</h1>

      {/* Search form */}
      <div>
        <h2>Search heritage sites</h2>
        {/* keyword input */}
        <div>
          <label htmlFor="keyword">Keyword:</label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="museum, castle, church..."
          />
        </div>

        {/* location input */}
        <div>
          <label htmlFor="location">Location (region)</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="stockholm, gotland, dalarna..."
          />
        </div>

        {/* buttons */}
        <div>
          <button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>

          <button onClick={handleReset}>Reset</button>
        </div>
      </div>

      {/* result section */}
      <div>
        {totalResults > 0 && <p>Found {totalResults} hertiage sites</p>}

        {isLoading && <p>Loading...</p>}

        {sites.map((site) => (
          <div key={site.id}>
            <h3>{site.name}</h3>

            {site.imageUrl && (
              <Image
                src={site.imageUrl}
                alt={site.name}
                width={300}
                height={200}
              />
            )}

            <p>
              <strong>Category</strong> {site.category}
            </p>

            {site.description && (
              <p>
                <strong>Description:</strong> {site.description}
              </p>
            )}

            {site.city && (
              <p>
                <strong>City:</strong> {site.city}
              </p>
            )}
            {site.region && (
              <p>
                <strong>Region:</strong> {site.region}
              </p>
            )}
            {site.address && (
              <p>
                <strong>Address:</strong> {site.address}
              </p>
            )}

            {site.websiteUrl && (
              <p>
                <Link
                  href={site.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                </Link>
              </p>
            )}

            <hr />
          </div>
        ))}

        {!isLoading && sites.length === 0 && totalResults === 0 && (
          <p>No sites found. Try searching again!</p>
        )}
      </div>
    </div>
  );
}
