import { useOutletContext, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MapComponent from "../components/MapComponent";
import { ArrowLeft, Map as MapIcon, Maximize2, Navigation, Route, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function LiveMap() {
  const { isDarkMode } = useOutletContext();
  const [activeTrip, setActiveTrip] = useState(null);
  const [routePath, setRoutePath] = useState(null);

  useEffect(() => {
    const tripData = localStorage.getItem("drivesense-active-trip");
    if (tripData) {
      try {
        const trip = JSON.parse(tripData);
        setActiveTrip(trip);

        const fetchPath = async () => {
          try {
            const [startLon, startLat] = trip.startCoords;
            const [destLon, destLat] = trip.destCoords;
            const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${destLon},${destLat}?overview=full&geometries=geojson`);
            const data = await res.json();
            if (data.code === "Ok") {
              // Convert GeoJSON [lon, lat] to Leaflet [lat, lon]
              const path = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
              setRoutePath(path);
            }
          } catch (e) {
            console.error("Path fetch error", e);
          }
        };
        fetchPath();
      } catch (e) {
        console.error("Trip parse error", e);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 lg:left-[280px] bg-white dark:bg-[#0A0A0B] z-40 transition-colors duration-500">
      {/* Immersive Map Header */}
      <div className="absolute top-8 left-8 right-8 z-50 pointer-events-none">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 pointer-events-auto"
          >
            <Link 
              to="/" 
              className="w-12 h-12 rounded-2xl bg-white dark:bg-[#121214] flex items-center justify-center shadow-2xl border border-gray-100 dark:border-white/5 hover:scale-110 transition-all text-gray-900 dark:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl">
              <h1 className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Live Fleet Tracking
              </h1>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Lagos Metropolitan Region</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 pointer-events-auto"
          >
            <div className="bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-gray-100 dark:border-white/5 shadow-2xl flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Active Units</span>
                    <span className="text-[14px] font-extrabold text-emerald-500">12 Online</span>
                </div>
                <div className="w-[1px] h-6 bg-gray-200 dark:bg-white/10"></div>
                <Navigation className="w-4 h-4 text-gray-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute bottom-10 right-8 z-50 flex flex-col gap-3">
         <button className="w-12 h-12 rounded-xl bg-white dark:bg-[#121214] shadow-2xl border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500 hover:text-emerald-500 transition-colors">
            <Maximize2 className="w-5 h-5" />
         </button>
      </div>

      {/* Route Analytics Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-10 left-8 z-50 pointer-events-auto"
      >
        <div className="bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl min-w-[320px]">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Route className="w-4 h-4 text-emerald-500" />
            Trip Analytics
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Distance</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activeTrip ? `${activeTrip.distance} km` : '4.2 km'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Avg Speed</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeTrip ? '40 km/h' : '45 km/h'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Duration</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activeTrip ? `${Math.round(activeTrip.duration / 60)} mins` : '18 mins'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Destination</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[100px]">
                  {activeTrip ? activeTrip.destName.split(',')[0] : 'Ikeja'}
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-100 dark:bg-white/5 my-2"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Risk Events</div>
                  <div className="text-sm font-semibold text-amber-600 dark:text-amber-500">
                    {activeTrip ? 'Monitoring...' : '2 Detected'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Screen Map */}
      <div className="w-full h-full grayscale-[0.2] dark:grayscale-[0.5] contrast-[1.1]">
        <MapComponent isDarkMode={isDarkMode} routePath={routePath} activeTrip={activeTrip} />
      </div>
    </div>
  );
}
