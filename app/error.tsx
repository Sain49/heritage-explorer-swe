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
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* Error icon/heading */}
      <div className="text-6xl mb-4">⚠️</div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Something went wrong!
      </h1>

      <p className="text-gray-600 mb-6 text-center max-w-md">
        An unexpected error occurred. Please try again.
      </p>

      {/* Show error message in development for debugging */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl">
          <p className="text-sm text-red-800 font-mono">{error.message}</p>
        </div>
      )}

      <div className="flex gap-4">
        {/* try again button - calls reset() function */}
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-400 text-white hover:bg-blue-500 transition-colors"
        >
          Try Again
        </button>

        {/* Go home button */}
        <Link href="/">
          <button className="px-6 py-3 bg-gray-400 text-white hover:bg-gray-500 transition-colors">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
