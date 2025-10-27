// 404 Not Found page
// shown when route doesn't exist

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* 404 heading */}
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>

      {/* Error message */}
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">
        Page Not Found
      </h2>

      <p className="text-gray-500 mb-8 text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      {/* Button to go back home */}
      <Link href="/">
        <button className="px-6 py-3 bg-blue-400 text-white hover:bg-blue-500 transition-colors">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
