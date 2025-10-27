import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t-2 border-amber-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-xs text-stone-700 uppercase tracking-wide">
            © 2025 Heritage Explorer. All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-xs">
            <p className="text-stone-600 uppercase tracking-wide">
              Data sourced from Nominatim, OpenStreetMap, Wikidata
            </p>
            <Link
              href="/contact-us"
              className="text-stone-800 hover:text-amber-900 transition-colors uppercase tracking-wide font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
