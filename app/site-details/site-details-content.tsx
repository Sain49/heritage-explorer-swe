"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
        <h1 className="text-2xl font-bold mb-4 uppercase tracking-wide text-amber-900 border-amber-900 pb-4">
          Site Details
        </h1>
        <div className="p-6 border-2 border-red-800 bg-red-50">
          <p className="text-red-900 font-medium mb-4">
            Error: Missing site information. Please go back and select a site.
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-amber-900 text-white hover:bg-amber-800 transition-colors uppercase tracking-wide text-sm border border-amber-900">
              Back to Explorer
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-2 items-center mb-6 mt-6">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-amber-900">
            Site Details
          </h1>
        </div>
        <div className="text-right">
          <Link href="/">
            <button className="px-6 py-3 border border-stone-600 text-stone-800 hover:border-amber-900 hover:bg-amber-50 transition-colors uppercase tracking-wide text-sm">
              ← Back to Explorer
            </button>
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-6 animate-pulse border border-stone-400 p-6 bg-stone-50">
          <div className="h-8 bg-stone-300 w-3/4"></div>
          <div className="h-64 bg-stone-300"></div>
          <div className="space-y-3">
            <div className="h-4 bg-stone-300"></div>
            <div className="h-4 bg-stone-300 w-5/6"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-6 border-2 border-red-800 bg-red-50 mb-6">
          <p className="text-red-900 font-medium">{error}</p>
        </div>
      )}

      {osmDetails && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-400 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(auto,max-content)_1fr] gap-x-8 gap-y-1 sm:gap-y-3 sm:items-baseline">
              {getTagValue(osmDetails.tags, "name") && (
                <>
                  <span className="font-medium whitespace-nowrap uppercase tracking-wide text-xs text-stone-700">
                    Name:
                  </span>
                  <span className="text-stone-900 break-words mb-3 sm:mb-0">
                    {getTagValue(osmDetails.tags, "name")}
                  </span>
                </>
              )}

              {getTagValue(osmDetails.tags, "phone") && (
                <>
                  <span className="font-medium whitespace-nowrap uppercase tracking-wide text-xs text-stone-700">
                    Phone:
                  </span>
                  <span className="text-stone-900 break-words mb-3 sm:mb-0">
                    {getTagValue(osmDetails.tags, "phone")}
                  </span>
                </>
              )}

              {getTagValue(osmDetails.tags, "website") && (
                <>
                  <span className="font-medium whitespace-nowrap uppercase tracking-wide text-xs text-stone-700">
                    Website:
                  </span>
                  <a
                    href={getTagValue(osmDetails.tags, "website") || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-900 hover:text-amber-700 transition-colors break-words mb-3 sm:mb-0"
                  >
                    {getTagValue(osmDetails.tags, "website")}
                  </a>
                </>
              )}

              {getTagValue(osmDetails.tags, "opening_hours") && (
                <>
                  <span className="font-medium whitespace-nowrap uppercase tracking-wide text-xs text-stone-700">
                    Opening Hours:
                  </span>
                  <span className="text-stone-900 break-words mb-3 sm:mb-0">
                    {getTagValue(osmDetails.tags, "opening_hours")}
                  </span>
                </>
              )}

              {getTagValue(osmDetails.tags, "description") && (
                <>
                  <span className="font-medium whitespace-nowrap uppercase tracking-wide text-xs text-stone-700">
                    Description:
                  </span>
                  <span className="text-stone-900 break-words mb-3 sm:mb-0">
                    {getTagValue(osmDetails.tags, "description")}
                  </span>
                </>
              )}

              {getTagValue(osmDetails.tags, "addr:street") && (
                <>
                  <span className="font-medium whitespace-nowrap uppercase tracking-wide text-xs text-stone-700">
                    Address:
                  </span>
                  <span className="text-stone-900 break-words mb-3 sm:mb-0">
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
              <p className="text-stone-600 text-sm mt-4 uppercase tracking-wide">
                Loading additional information...
              </p>
            )}
            {wikidataData?.imageUrl && (
              <div className="relative h-64 md:h-96 w-full overflow-hidden mt-6 border border-amber-900">
                <Image
                  src={wikidataData.imageUrl}
                  alt={getTagValue(osmDetails.tags, "name") || "Site image"}
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
