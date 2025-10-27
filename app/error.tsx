"use client";

// Error boundary
// catches errors in pages

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // log the error to console for debugging
  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-stone-50">
      <div className="border-2 border-red-800 p-12 text-center max-w-2xl bg-white">
        {/* Error icon/heading */}
        <div className="text-6xl mb-6">⚠️</div>

        <h1 className="text-2xl font-bold text-red-900 mb-4 uppercase tracking-wide">
          Something Went Wrong
        </h1>

        <p className="text-stone-700 mb-8 leading-relaxed">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>

        {/* Show error message in development for debugging */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-800 max-w-2xl text-left">
            <p className="text-xs text-red-900 font-mono uppercase tracking-wide mb-2">
              Debug Info:
            </p>
            <p className="text-sm text-red-800 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* try again button - calls reset() function */}
          <button
            onClick={reset}
            className="px-8 py-4 bg-amber-900 text-white border border-amber-900 hover:bg-amber-800 hover:border-amber-800 transition-colors uppercase tracking-wide text-sm font-medium"
          >
            Try Again
          </button>

          {/* Go home button */}
          <Link href="/">
            <button className="px-8 py-4 border border-stone-600 bg-white text-stone-800 hover:border-stone-800 hover:bg-stone-100 transition-colors uppercase tracking-wide text-sm font-medium">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
