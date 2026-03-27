import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
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

// Custom icons for Start, End, and Warning/Risk events
const createStartIcon = (isDarkMode) => L.divIcon({
  className: 'custom-start-marker',
  html: `<div style="
    width: 24px; 
    height: 24px; 
    background-color: #3b82f6; 
    border-radius: 50%; 
    border: 3px solid ${isDarkMode ? '#121214' : '#FFFFFF'};
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    font-family: sans-serif;
  ">S</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createEndIcon = (isDarkMode) => L.divIcon({
  className: 'custom-end-marker',
  html: `<div style="
    width: 24px; 
    height: 24px; 
    background-color: #ef4444; 
    border-radius: 50%; 
    border: 3px solid ${isDarkMode ? '#121214' : '#FFFFFF'};
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    font-family: sans-serif;
  ">E</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createWarningIcon = (isDarkMode) => L.divIcon({
  className: 'custom-warning-marker',
  html: `<div style="
    width: 26px; 
    height: 26px; 
    background-color: #f59e0b; 
    border-radius: 50%; 
    border: 3px solid ${isDarkMode ? '#121214' : '#FFFFFF'};
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  "><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

// Define Risk Events
const riskEvents = [
  { id: 1, position: lagosRoute[4], type: 'Hard Braking', severity: 'Medium Risk' },
  { id: 2, position: lagosRoute[7], type: 'Speeding', severity: 'High Risk' }
];

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

        {/* Start Point Marker */}
        <Marker 
          position={lagosRoute[0]} 
          icon={createStartIcon(isDarkMode)} 
        >
          <Popup className={isDarkMode ? 'dark-popup' : ''}>
            <div className="font-semibold text-[13px] text-gray-900">Trip Started</div>
            <div className="text-[11px] text-gray-500">Ikeja City Mall</div>
          </Popup>
        </Marker>

        {/* End Point Marker */}
        <Marker 
          position={lagosRoute[lagosRoute.length - 1]} 
          icon={createEndIcon(isDarkMode)} 
        >
          <Popup className={isDarkMode ? 'dark-popup' : ''}>
            <div className="font-semibold text-[13px] text-gray-900">Destination</div>
            <div className="text-[11px] text-gray-500">Murtala Muhammed Airport</div>
          </Popup>
        </Marker>

        {/* Risk Event Markers */}
        {riskEvents.map((event) => (
          <Marker 
            key={event.id}
            position={event.position} 
            icon={createWarningIcon(isDarkMode)} 
          >
            <Popup className={isDarkMode ? 'dark-popup' : ''}>
              <div className="font-semibold text-[13px] text-amber-600 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {event.type}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">{event.severity}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
