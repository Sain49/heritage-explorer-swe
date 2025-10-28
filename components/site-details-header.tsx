// resusable grid layout with title on left, back button on right

import Link from "next/link";

export default function SiteDetailsHeader() {
  return (
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
  );
}
