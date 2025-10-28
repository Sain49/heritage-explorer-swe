import { useState, useEffect } from "react";
import type { OSMElement, WikidataImageData } from "@/types/site";
import { fetchOSMDetails, getTagValue } from "@/lib/api/osm";
import { fetchWikidataImage } from "@/lib/api/wikidata";

export function useSiteDetails(
  osmId: string | null,
  osmType: "node" | "way" | "relation" | null
) {
  // OSM details state
  const [osmDetails, setOsmDetails] = useState<OSMElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wikidata state (separate loading since it's optional)
  const [wikidataData, setWikidataData] = useState<WikidataImageData | null>(
    null
  );
  const [wikidataLoading, setWikidataLoading] = useState(false);

  useEffect(() => {
    // Only fetch if we have valid parameters
    if (!osmId || !osmType) {
      return;
    }

    const parsedId = parseInt(osmId);

    // Validate Id is a positive number
    if (isNaN(parsedId) || parsedId <= 0) {
      setError("Please select a valid site.");
      return;
    }

    loadSiteDetails(parsedId, osmType);
  }, [osmId, osmType]);

  const loadSiteDetails = async (
    id: number,
    type: "node" | "way" | "relation"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const details = await fetchOSMDetails(id, type);

      // Check if OSM returned data
      if (!details) {
        setError("Site details not found. The site may no longer exist.");
        setIsLoading(false);
        return;
      }

      setOsmDetails(details);

      // try to fetch Wikidata image (optional, don't fail if it errors)
      const wikidataId = getTagValue(details.tags, "wikidata");

      if (wikidataId) {
        setWikidataLoading(true);

        try {
          const imageData = await fetchWikidataImage(wikidataId);
          setWikidataData(imageData);
        } catch (wikidataError) {
          // Log but don't show error to user (Wikidata is optional)
          console.error("Failed to load Wikidata information:", wikidataError);
        } finally {
          setWikidataLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to load site details:", error);
      setError("Failed to load site details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    osmDetails,
    isLoading,
    error,
    wikidataData,
    wikidataLoading,
  };
}
