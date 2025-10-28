import Link from "next/link";
import type { NominatimResult } from "@/types/site";

interface SiteCardProps {
  site: NominatimResult;
}

export default function SiteCard({ site }: SiteCardProps) {
  return (
    <div className="border border-stone-300 p-4 bg-white hover:border-amber-900 transition-colors duration-200">
      <h3 className="text-base font-semibold mb-3 text-stone-900">
        {site.name}
      </h3>

      <div className="flex gap-2 mb-3 text-xs">
        <span className="px-2 py-1 bg-amber-100 text-amber-900 uppercase tracking-wide border border-amber-900">
          {site.type}
        </span>
        <span className="px-2 py-1 border border-stone-400 text-stone-700 uppercase tracking-wide">
          {site.class}
        </span>
      </div>

      <Link
        href={`/site-details?osmId=${site.osmId}&osmType=${site.osmType}`}
        className="inline-block px-4 py-2 bg-amber-900 text-white text-sm uppercase tracking-wide hover:bg-amber-800 focus:outline-none focus:bg-amber-800 transition-colors duration-200 border border-amber-900"
        aria-label={`View details for ${site.name}`}
      >
        View Details →
      </Link>
    </div>
  );
}
