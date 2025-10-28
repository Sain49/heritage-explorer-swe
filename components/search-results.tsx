import type { NominatimResult } from "@/types/site";
import SiteCard from "./site-card";

interface SearchResultsProps {
  sites: NominatimResult[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  onReset: () => void;
}

export default function SearchResults({
  sites,
  isLoading,
  error,
  searchQuery,
  onReset,
}: SearchResultsProps) {
  // Loading state: show skeleton
  if (isLoading) {
    return (
      <div className="border border-stone-400 p-6 bg-stone-50">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-stone-300 w-3/4"></div>
          <div className="h-4 bg-stone-300 w-1/2"></div>
        </div>
      </div>
    );
  }

  // Error state: show error message
  if (error) {
    return (
      <div className="p-6 border-2 border-red-800 bg-red-50">
        <p className="text-red-900 font-medium">{error}</p>
      </div>
    );
  }

  // Empty state: show "no results" message
  if (!isLoading && sites.length === 0 && searchQuery) {
    return (
      <div className="p-8 border-2 border-stone-400 text-center bg-stone-50">
        <h3 className="text-lg font-semibold text-stone-900 mb-2 uppercase tracking-wide">
          No Sites Found
        </h3>
        <p className="text-stone-700 mb-6">
          Try searching for a different location or category
        </p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-amber-900 text-white hover:bg-amber-800 transition-colors uppercase tracking-wide text-sm border border-amber-900"
        >
          Clear Search
        </button>
      </div>
    );
  }

  // Results state: show list of sites
  return (
    <div className="space-y-3">
      {sites.map((site) => (
        <SiteCard key={site.osmId} site={site} />
      ))}
    </div>
  );
}
