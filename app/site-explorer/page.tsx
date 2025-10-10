"use client";

import { useState } from "react";
import { searchHeritageSites } from "@/lib/api/visitSweden";
import type { SimplifiedHeritageSite } from "@/types/visitSweden";

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
            placeholder="museum, castle, church.."
          />
        </div>
      </div>
    </div>
  );
}
