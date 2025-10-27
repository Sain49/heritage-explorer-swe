"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import type { OSMElement } from "@/types/site";
import { fetchOSMDetails, getTagValue } from "@/lib/api/osm";
import { fetchWikidataImage } from "@/lib/api/wikidata";
import { WikidataImageData } from "@/types/site";

export default function SiteDetails() {
  const searchParams = useSearchParams();
  const [osmDetails, setOsmDetails] = useState<OSMElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wikidataData, setWikidataData] = useState<WikidataImageData | null>(
    null
  );
  const [wikidataLoading, setWikidataLoading] = useState(false);

  // Get parameters from url
  const osmId = searchParams.get("osmId");
  const osmType = searchParams.get("osmType") as
    | "node"
    | "way"
    | "relation"
    | null;

  useEffect(() => {
    // validate osmId is a valid positive number
    if (osmId && osmType) {
      const parsedId = parseInt(osmId);

      // Check if it's a valid positive number
      if (isNaN(parsedId) || parsedId <= 0) {
        setError("Invalid site Id. Please select a valid site.");
        return;
      }

      loadSiteDetails(parsedId, osmType);
    }
  }, [osmId, osmType]);

  const loadSiteDetails = async (
    id: number,
    type: "node" | "way" | "relation"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const details = await fetchOSMDetails(id, type);

      // if OSM returns null
      if (!details) {
        setError("Site details not found. The site may no longer exist.");
        setIsLoading(false);
        return;
      }

      setOsmDetails(details);

      // fetch Wikidata data with separate error handling
      // if Wikidata fails we still show OSM data
      if (getTagValue(details.tags, "wikidata")) {
        const wikidataId = getTagValue(details.tags, "wikidata");

        // show loading state for Wikidata fetch
        setWikidataLoading(true);

        try {
          const imageData = await fetchWikidataImage(wikidataId!);
          setWikidataData(imageData);
        } catch (wikidataError) {
          // log error
          console.error("Failed to load Wikidata information:", wikidataError);
          // don't set the main error state, just skip Wikidata
        } finally {
          setWikidataLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to load site details:", error);
      setError("Failed to load site details. Please try again.");
    }

    setIsLoading(false);
  };

  // check for missing or invalid parameters
  if (!osmId || !osmType) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Site Details</h1>
        <p className="text-red-600">
          Error: Missing site information. Please go back and select a site.
        </p>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
            Back to Explorer
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/">
          <button className="mb-4 px-4 py-2 bg-gray-400 text-white hover:bg-gray-600">
            ← Back to Explorer
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Site Details</h1>
      </div>

      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 w-3/4"></div>
          <div className="h-64 bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200"></div>
            <div className="h-4 bg-gray-200 w-5/6"></div>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {osmDetails && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-4">
            <div className="grid grid-cols-[minmax(auto,max-content)_1fr] gap-x-8 gap-y-3">
              {getTagValue(osmDetails.tags, "name") && (
                <>
                  <span className="font-medium whitespace-nowrap">Name:</span>
                  <span>{getTagValue(osmDetails.tags, "name")}</span>
                </>
              )}

              {getTagValue(osmDetails.tags, "phone") && (
                <>
                  <span className="font-medium whitespace-nowrap">Phone:</span>
                  <span>{getTagValue(osmDetails.tags, "phone")}</span>
                </>
              )}

              {getTagValue(osmDetails.tags, "website") && (
                <>
                  <span className="font-medium whitespace-nowrap">
                    Website:
                  </span>
                  <a
                    href={getTagValue(osmDetails.tags, "website") || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {getTagValue(osmDetails.tags, "website")}
                  </a>
                </>
              )}

              {getTagValue(osmDetails.tags, "opening_hours") && (
                <>
                  <span className="font-medium whitespace-nowrap">
                    Opening Hours:
                  </span>
                  <span>{getTagValue(osmDetails.tags, "opening_hours")}</span>
                </>
              )}

              {getTagValue(osmDetails.tags, "description") && (
                <>
                  <span className="font-medium whitespace-nowrap">
                    Description:
                  </span>
                  <span>{getTagValue(osmDetails.tags, "description")}</span>
                </>
              )}

              {getTagValue(osmDetails.tags, "addr:street") && (
                <>
                  <span className="font-medium whitespace-nowrap">
                    Address:
                  </span>
                  <span>
                    {getTagValue(osmDetails.tags, "addr:street")}
                    {getTagValue(osmDetails.tags, "addr:housenumber") &&
                      ` ${getTagValue(osmDetails.tags, "addr:housenumber")}`}
                    {getTagValue(osmDetails.tags, "addr:postcode") &&
                      `, ${getTagValue(osmDetails.tags, "addr:postcode")}`}
                    {getTagValue(osmDetails.tags, "addr:city") &&
                      ` ${getTagValue(osmDetails.tags, "addr:city")}`}
                  </span>
                </>
              )}
            </div>

            {/* show loading state for Wikidata */}
            {wikidataLoading && (
              <p className="text-gray-500 text-sm mt-4">
                Loading additional information...
              </p>
            )}

            {wikidataData?.imageUrl && (
              <div className="relative h-64 md:h-96 w-full overflow-hidden mt-4 border border-gray-200">
                <img
                  src={wikidataData.imageUrl}
                  alt={getTagValue(osmDetails.tags, "name") || "Site image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
