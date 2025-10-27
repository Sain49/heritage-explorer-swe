// 404 Not Found page
// shown when route doesn't exist

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-stone-50">
      <div className="border-2 border-stone-400 p-12 text-center max-w-2xl">
        {/* 404 heading */}
        <h1 className="text-8xl font-bold text-amber-900 mb-6 uppercase tracking-wider">
          404
        </h1>

        {/* Error message */}
        <h2 className="text-xl font-semibold text-stone-900 mb-4 uppercase tracking-wide">
          Page Not Found
        </h2>

        <p className="text-stone-700 mb-8 leading-relaxed">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        {/* Button to go back home */}
        <Link href="/">
          <button className="px-8 py-4 bg-amber-900 text-white border border-amber-900 hover:bg-amber-800 hover:border-amber-800 transition-colors uppercase tracking-wide text-sm font-medium">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
