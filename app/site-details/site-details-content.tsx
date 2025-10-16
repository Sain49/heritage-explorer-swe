"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import type { OSMElement } from "@/types/site";
import { fetchOSMDetails, getTagValue } from "@/lib/api/osm";

export default function SiteDetails() {
  const searchParams = useSearchParams();
  const [osmDetails, setOsmDetails] = useState<OSMElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get parameters from URL
  const osmId = searchParams.get("osmId");
  const osmType = searchParams.get("osmType") as
    | "node"
    | "way"
    | "relation"
    | null;

  useEffect(() => {
    // Only fetch if we have both parameters
    if (osmId && osmType) {
      loadSiteDetails(parseInt(osmId), osmType);
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
      setOsmDetails(details);
    } catch (error) {
      console.error("Failed to load site details:", error);
      setError("Failed to load site details. Please try again.");
    }

    setIsLoading(false);
  };

  // show error if missing parameters
  if (!osmId || !osmType) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Site Details</h1>
        <p className="text-red-600">
          Error: Missing site information. Please go back and select a site.
        </p>
        <Link href="/site-explorer">
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
        <Link href="/site-explorer">
          <button className="mb-4 px-4 py-2 bg-gray-400 text-white hover:bg-gray-600">
            ← Back to Explorer
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Site Details</h1>
      </div>

      {isLoading && (
        <p className="text-blue-600 mb-4">Loading site details...</p>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {osmDetails && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4">
            <h2 className="text-xl font-semibold mb-3">OSM Information</h2>
            <p className="text-gray-700">
              <strong>OSM ID:</strong> {osmDetails.type}/{osmDetails.id}
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">Metadata</h3>

            <div className="grid gap-3">
              {getTagValue(osmDetails.tags, "name") && (
                <div className="flex">
                  <span className="font-medium w-32">Name:</span>
                  <span>{getTagValue(osmDetails.tags, "name")}</span>
                </div>
              )}

              {getTagValue(osmDetails.tags, "phone") && (
                <div className="flex">
                  <span className="font-medium w-32">Phone:</span>
                  <span>{getTagValue(osmDetails.tags, "phone")}</span>
                </div>
              )}

              {getTagValue(osmDetails.tags, "website") && (
                <div className="flex">
                  <span className="font-medium w-32">Website:</span>
                  <a
                    href={getTagValue(osmDetails.tags, "website") || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {getTagValue(osmDetails.tags, "website")}
                  </a>
                </div>
              )}

              {getTagValue(osmDetails.tags, "opening_hours") && (
                <div className="flex">
                  <span className="font-medium w-32">Opening Hours:</span>
                  <span>{getTagValue(osmDetails.tags, "opening_hours")}</span>
                </div>
              )}

              {getTagValue(osmDetails.tags, "wikidata") && (
                <div className="flex">
                  <span className="font-medium w-32">Wikidata ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1">
                    {getTagValue(osmDetails.tags, "wikidata")}
                  </span>
                </div>
              )}

              {getTagValue(osmDetails.tags, "wikipedia") && (
                <div className="flex">
                  <span className="font-medium w-32">Wikipedia:</span>
                  <span>{getTagValue(osmDetails.tags, "wikipedia")}</span>
                </div>
              )}

              {getTagValue(osmDetails.tags, "description") && (
                <div className="flex">
                  <span className="font-medium w-32">Description:</span>
                  <span>{getTagValue(osmDetails.tags, "description")}</span>
                </div>
              )}

              {getTagValue(osmDetails.tags, "addr:street") && (
                <div className="flex">
                  <span className="font-medium w-32">Address:</span>
                  <span>
                    {getTagValue(osmDetails.tags, "addr:street")}
                    {getTagValue(osmDetails.tags, "addr:housenumber") &&
                      ` ${getTagValue(osmDetails.tags, "addr:housenumber")}`}
                    {getTagValue(osmDetails.tags, "addr:postcode") &&
                      `, ${getTagValue(osmDetails.tags, "addr:postcode")}`}
                    {getTagValue(osmDetails.tags, "addr:city") &&
                      ` ${getTagValue(osmDetails.tags, "addr:city")}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
