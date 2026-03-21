import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// A realistic sample route in Lagos, Nigeria
const lagosRoute = [
  [6.5244, 3.3792],
  [6.5250, 3.3785],
  [6.5260, 3.3770],
  [6.5275, 3.3755],
  [6.5285, 3.3740],
  [6.5295, 3.3720],
  [6.5310, 3.3705],
  [6.5330, 3.3700],
  [6.5360, 3.3680],
  [6.5400, 3.3650],
];

// Custom glowing dot icon for the "vehicle" or tracker
const createVehicleIcon = (isDarkMode) => L.divIcon({
  className: 'custom-vehicle-marker',
  html: `<div style="
    width: 16px; 
    height: 16px; 
    background-color: #10b981; 
    border-radius: 50%; 
    border: 3px solid ${isDarkMode ? '#121214' : '#FFFFFF'};
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
    transition: all 0.3s ease;
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

export default function MapComponent({ isDarkMode = false }) {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

  // Animate the vehicle along the route
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPositionIndex((prev) => (prev + 1) % lagosRoute.length);
    }, 1500); // moves every 1.5 seconds smoothly
    return () => clearInterval(interval);
  }, []);

  // Choose the beautiful CartoDB map themes
  const mapStyle = isDarkMode 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const routeColor = isDarkMode ? '#3f3f46' : '#d4d4d8'; // subtle grey path

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[6.5300, 3.3740]} 
        zoom={15} 
        style={{ width: '100%', height: '100%', zIndex: 0, background: isDarkMode ? '#0A0A0B' : '#F5F5F7' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer key={mapStyle} url={mapStyle} />
        
        {/* The Route Path */}
        <Polyline 
          positions={lagosRoute} 
          color={routeColor}
          weight={4}
          opacity={0.7}
          dashArray="6, 8"
        />

        {/* The Moving Vehicle */}
        <Marker 
          position={lagosRoute[currentPositionIndex]} 
          icon={createVehicleIcon(isDarkMode)} 
        />
      </MapContainer>
    </div>
  );
}
