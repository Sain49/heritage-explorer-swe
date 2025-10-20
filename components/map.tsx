"use client";

import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Minimalist map component with loading and validation
export default function Map() {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const center: [number, number] = [59.3293, 18.0686];

  if (mapError) {
    return (
      <div className="h-96 w-full flex items-center justify-center border border-gray-300">
        <p className="text-gray-700">{mapError}</p>
      </div>
    );
  }

  return (
    <div
      className="h-96 w-full relative overflow-hidden"
      role="img"
      aria-label="Interactive map of heritage sites in Sweden"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <p className="text-gray-700">Loading map...</p>
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
      </MapContainer>
    </div>
  );
}
