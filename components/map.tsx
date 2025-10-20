"use client";

import { MapContainer, TileLayer } from "react-leaflet"; // main map components from react-leaflet
import "leaflet/dist/leaflet.css"; // Leaflet's CSS for the map (required)

export default function Map() {
  return (
    <div style={{ height: "400px", width: "100%" }}>
      {" "}
      <MapContainer
        center={[59.3293, 18.0686]} // Stockholm (latitude, longitude)
        zoom={10} // starting zoom level
        style={{ height: "100%", width: "100%" }} // make the map fill the div
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Free map tiles from OpenStreetMap
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Required credit
        />
      </MapContainer>
    </div>
  );
}
