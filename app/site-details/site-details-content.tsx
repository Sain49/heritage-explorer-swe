"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getTagValue } from "@/lib/api/osm";
import { useSiteDetails } from "@/lib/hooks/use-site-details";
import { formatAddress } from "@/lib/utils/format-address";
import SiteDetailsHeader from "@/components/site-details-header";
import SiteDetailsField from "@/components/site-details-field";
import ErrorMessage from "@/components/error-message";
import LoadingSkeleton from "@/components/loading-skeleton";

export default function SiteDetails() {
  const searchParams = useSearchParams();

  // get parameters from URL
  const osmId = searchParams.get("osmId");
  const osmType = searchParams.get("osmType") as
    | "node"
    | "way"
    | "relation"
    | null;

  // custom hook: fetch site details
  const { osmDetails, isLoading, error, wikidataData, wikidataLoading } =
    useSiteDetails(osmId, osmType);

  // check for missing or invalid parameters
  if (!osmId || !osmType) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 uppercase tracking-wide text-amber-900 border-amber-900 pb-4">
          Site Details
        </h1>
        <ErrorMessage message="Error: Missing site information. Please go back and select a site.">
          <Link href="/">
            <button className="px-6 py-3 bg-amber-900 text-white hover:bg-amber-800 transition-colors uppercase tracking-wide text-sm border border-amber-900">
              Back to Explorer
            </button>
          </Link>
        </ErrorMessage>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <SiteDetailsHeader />

      {isLoading && <LoadingSkeleton />}

      {error && <ErrorMessage message={error} />}

      {osmDetails && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-400 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(auto,max-content)_1fr] gap-x-8 gap-y-1 sm:gap-y-3 sm:items-baseline">
              {getTagValue(osmDetails.tags, "name") && (
                <SiteDetailsField label="Name">
                  {getTagValue(osmDetails.tags, "name")}
                </SiteDetailsField>
              )}

              {getTagValue(osmDetails.tags, "phone") && (
                <SiteDetailsField label="Phone">
                  {getTagValue(osmDetails.tags, "phone")}
                </SiteDetailsField>
              )}

              {getTagValue(osmDetails.tags, "website") && (
                <SiteDetailsField label="Website">
                  <a
                    href={getTagValue(osmDetails.tags, "website") || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-900 hover:text-amber-700 transition-colors"
                  >
                    {getTagValue(osmDetails.tags, "website")}
                  </a>
                </SiteDetailsField>
              )}

              {getTagValue(osmDetails.tags, "opening_hours") && (
                <SiteDetailsField label="Opening Hours">
                  {getTagValue(osmDetails.tags, "opening_hours")}
                </SiteDetailsField>
              )}

              {getTagValue(osmDetails.tags, "description") && (
                <SiteDetailsField label="Description">
                  {getTagValue(osmDetails.tags, "description")}
                </SiteDetailsField>
              )}

              {formatAddress(osmDetails.tags) && (
                <SiteDetailsField label="Address">
                  {formatAddress(osmDetails.tags)}
                </SiteDetailsField>
              )}
            </div>

            {/* Show loading state for Wikidata */}
            {wikidataLoading && (
              <p className="text-stone-600 text-sm mt-4 uppercase tracking-wide">
                Loading additional information...
              </p>
            )}

            {/* Show Wikidata image if available */}
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
