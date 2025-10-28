// global loading state
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Loading spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-900"></div>

      {/* Loading text */}
      <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
  );
}
