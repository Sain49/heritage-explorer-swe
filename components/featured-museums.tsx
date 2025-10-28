import { FEATURED_MUSEUMS } from "@/data/featured-museums";

interface FeaturedMuseumsProps {
  onMuseumClick: (museumName: string) => void;
}

export default function FeaturedMuseums({
  onMuseumClick,
}: FeaturedMuseumsProps) {
  return (
    <div className="border border-amber-900 p-5 bg-amber-50">
      <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide text-amber-900">
        Featured Museums in Stockholm
      </h2>

      <div className="space-y-2">
        {FEATURED_MUSEUMS.map((museum) => (
          <div key={museum.id}>
            <button
              onClick={() => onMuseumClick(museum.name)}
              className="text-amber-900 hover:text-amber-600 text-left focus:outline-none focus:text-amber-700 transition-colors duration-200 text-sm"
            >
              {museum.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
