import { POPULAR_LOCATIONS } from "@/data/popular-locations";

interface PopularLocationsProps {
  onLocationClick: (boundingBox: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  }) => void;
}

export default function PopularLocations({
  onLocationClick,
}: PopularLocationsProps) {
  return (
    <div className="border border-stone-600 p-5 bg-stone-50">
      <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide text-stone-800">
        Popular Locations
      </h2>

      <div className="space-y-2">
        {POPULAR_LOCATIONS.map((location) => (
          <div key={location.name}>
            <button
              onClick={() => onLocationClick(location.boundingBox)}
              className="text-stone-800 hover:text-stone-500 text-left focus:outline-none focus:text-stone-600 transition-colors duration-200 text-sm"
              aria-label={`Search for heritage sites in ${location.name}`}
            >
              {location.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
