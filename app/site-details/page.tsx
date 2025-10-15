"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
      <div>
        <h1>Site Details</h1>
        <p>
          Error: Missing site information. Please go back and select a site.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Site Details</h1>

      {isLoading && <p>Loading site details...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {osmDetails && (
        <div>
          <h2>OSM Information</h2>
          <p>
            <strong>OSM ID:</strong> {osmDetails.type}/{osmDetails.id}
          </p>

          <h3>Metadata</h3>

          {getTagValue(osmDetails.tags, "name") && (
            <p>
              <strong>Name:</strong> {getTagValue(osmDetails.tags, "name")}
            </p>
          )}

          {getTagValue(osmDetails.tags, "phone") && (
            <p>
              <strong>Phone:</strong> {getTagValue(osmDetails.tags, "phone")}
            </p>
          )}

          {getTagValue(osmDetails.tags, "website") && (
            <p>
              <strong>Website:</strong>{" "}
              {getTagValue(osmDetails.tags, "website")}
            </p>
          )}

          {getTagValue(osmDetails.tags, "opening_hours") && (
            <p>
              <strong>Opening Hours:</strong>{" "}
              {getTagValue(osmDetails.tags, "opening_hours")}
            </p>
          )}

          {getTagValue(osmDetails.tags, "wikidata") && (
            <p>
              <strong>Wikidata ID:</strong>{" "}
              {getTagValue(osmDetails.tags, "wikidata")}
            </p>
          )}

          {getTagValue(osmDetails.tags, "wikipedia") && (
            <p>
              <strong>Wikipedia:</strong>{" "}
              {getTagValue(osmDetails.tags, "wikipedia")}
            </p>
          )}

          {getTagValue(osmDetails.tags, "description") && (
            <p>
              <strong>Description:</strong>{" "}
              {getTagValue(osmDetails.tags, "description")}
            </p>
          )}

          {getTagValue(osmDetails.tags, "addr:street") && (
            <p>
              <strong>Address:</strong>{" "}
              {getTagValue(osmDetails.tags, "addr:street")}
              {getTagValue(osmDetails.tags, "addr:housenumber") &&
                ` ${getTagValue(osmDetails.tags, "addr:housenumber")}`}
              {getTagValue(osmDetails.tags, "addr:postcode") &&
                `, ${getTagValue(osmDetails.tags, "addr:postcode")}`}
              {getTagValue(osmDetails.tags, "addr:city") &&
                ` ${getTagValue(osmDetails.tags, "addr:city")}`}
            </p>
          )}

          {/* Show all tags for debugging */}
          <details>
            <summary>All OSM Tags (Debug)</summary>
            <pre>{JSON.stringify(osmDetails.tags, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
