export default function MyRoute() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Route</h1>

      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Plan Your Heritage Journey
        </h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">Coming soon!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border border-gray-200">
            <h3 className="font-semibold mb-2 text-gray-800">Create Routes</h3>
            <p className="text-sm text-gray-600">
              Build custom itineraries connecting heritage sites
            </p>
          </div>

          <div className="p-6 border border-gray-200">
            <h3 className="font-semibold mb-2 text-gray-800">Save Favorites</h3>
            <p className="text-sm text-gray-600">
              Keep track of sites you want to visit
            </p>
          </div>

          <div className="p-6 border border-gray-200">
            <h3 className="font-semibold mb-2 text-gray-800">Get Directions</h3>
            <p className="text-sm text-gray-600">
              Navigate between heritage locations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
