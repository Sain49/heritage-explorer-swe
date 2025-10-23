"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import type { NominatimResult } from "@/types/site";

// Fix for Leaflet default marker icons in Next.js: Leaflet's default icon path resolution
// conflicts with Next.js's static asset handling, so we delete the default getter and set custom paths
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

export default function Map({ sites }: { sites: NominatimResult[] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const center: [number, number] = [59.3293, 18.0686];

  // add validation for sites with valid coordinates
  const validSites = sites.filter((site) => {
    // check if coordinates exist and are valid numbers
    const hasValidLat =
      typeof site.latitude === "number" &&
      !isNaN(site.latitude) &&
      site.latitude >= -90 &&
      site.latitude <= 90;
    const hasValidLng =
      typeof site.longitude === "number" &&
      !isNaN(site.longitude) &&
      site.longitude >= -180 &&
      site.longitude <= 180;
    // Check if name exists
    const hasName =
      site.name && typeof site.name === "string" && site.name.trim().length > 0;

    return hasValidLat && hasValidLng && hasName;
  });

  if (mapError) {
    return (
      <div className="h-96 w-full flex items-center justify-center border border-red-200 bg-red-50 rounded-lg">
        <div className="text-center">
          <span className="text-red-500 text-2xl mb-2 block">❌</span>
          <p className="text-red-700 font-medium">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-96 w-full relative overflow-hidden border border-gray-200 shadow-sm"
      role="img"
      aria-label="Interactive map of heritage sites in Sweden"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10 transition-opacity duration-300">
          <div className="text-center">
            <div className="animate-pulse text-gray-400 mb-2">🗺️</div>
            <p className="text-gray-700 font-medium">Loading map...</p>
          </div>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={10}
        className="h-full w-full"
        whenReady={() => setIsLoading(false)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          eventHandlers={{
            tileerror: () =>
              setMapError("Failed to load map tiles. Check your internet."),
          }}
        />
        {validSites.length > 0 &&
          validSites.map((site) => (
            <Marker key={site.osmId} position={[site.latitude, site.longitude]}>
              <Popup>{site.name}</Popup>
            </Marker>
          ))}
      </MapContainer>
      {sites.length > 0 && validSites.length === 0 && (
        <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-lg shadow-md border border-gray-200 z-20 transition-all duration-200">
          <div className="flex items-center space-x-2">
            <span className="text-amber-500">⚠️</span>
            <p className="text-sm text-gray-700 font-medium">
              No valid sites to display on map
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Try searching for a different location
          </p>
        </div>
      )}
    </div>
  );
}
