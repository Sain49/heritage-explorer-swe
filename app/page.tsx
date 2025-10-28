"use client";

import dynamic from "next/dynamic";
import MapErrorBoundary from "@/components/map-error-boundary";
import FeaturedMuseums from "@/components/featured-museums";
import PopularLocations from "@/components/popular-locations";
import SearchForm from "@/components/search-form";
import SearchResults from "@/components/search-results";
import Pagination from "@/components/pagination";
import { useSearch } from "@/lib/hooks/use-search";
import { usePagination } from "@/lib/hooks/use-pagination";

// dynamically import Map (client-side only, no SSR)
const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  // custom hook: manages all search state and logic
  const {
    searchQuery,
    sites,
    isLoading,
    error,
    setSearchQuery,
    search,
    searchFeaturedMuseum,
    searchByLocation,
    reset,
  } = useSearch();

  // custom hook: manages pagination state and logic
  const {
    currentPage,
    totalPages,
    paginatedItems: currentSites,
    nextPage,
    prevPage,
    resetPage,
  } = usePagination(sites, 10);

  // when search results change, reset to page 1
  const handleSearch = () => {
    search();
    resetPage();
  };

  const handleFeaturedMuseumClick = (museumName: string) => {
    searchFeaturedMuseum(museumName);
    resetPage();
  };

  const handleLocationClick = (boundingBox: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  }) => {
    searchByLocation(boundingBox);
    resetPage();
  };

  const handleReset = () => {
    reset();
    resetPage();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 mt-6 uppercase tracking-wide text-amber-900 border-amber-900 pb-4">
        Heritage Explorer Sweden
      </h1>

      {/* Featured museums and popular locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FeaturedMuseums onMuseumClick={handleFeaturedMuseumClick} />
        <PopularLocations onLocationClick={handleLocationClick} />
      </div>

      {/* Search form */}
      <SearchForm
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Map and Results */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column: Map */}
        <div className="flex-1">
          <MapErrorBoundary>
            <Map sites={sites} />
          </MapErrorBoundary>
        </div>

        {/* Right column: Search results */}
        <div className="flex-1 space-y-6">
          <SearchResults
            sites={currentSites}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
            onReset={handleReset}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
}
