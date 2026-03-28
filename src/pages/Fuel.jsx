import { useState, useEffect } from "react";
import { addTrip } from "../services/tripService";
import { db } from "../firebaseConfig";
import { Droplet, Activity, Navigation, CheckCircle2, AlertCircle, ArrowLeft, Fuel as FuelIcon, Gauge, Banknote, Wind, MapPin, Search, Loader2, Info, Crosshair } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { smartFuelEngine } from "../utils/smartFuelEngine";

export default function Fuel() {
  const { isDarkMode } = useOutletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState({ start: [], dest: [] });
  const [showDropdown, setShowDropdown] = useState({ start: false, dest: false });
  const [coords, setCoords] = useState({ start: null, dest: null });

  // Use device GPS + Photon reverse geocode to fill Start Point
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}&limit=1`);
          const data = await res.json();
          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const props = feature.properties;
            const name = [props.name, props.street, props.city].filter(Boolean).join(', ');
            setForm(prev => ({ ...prev, start: name }));
            setCoords(prev => ({ ...prev, start: [longitude, latitude] }));
          } else {
            setForm(prev => ({ ...prev, start: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
            setCoords(prev => ({ ...prev, start: [longitude, latitude] }));
          }
        } catch (e) {
          console.error('Reverse geocode failed:', e);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert("Could not get your location. Please allow location access and try again.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const [form, setForm] = useState({
    mode: "distance", // "distance" or "fuel"
    start: "",
    destination: "",
    distance: "",
    litres: "",
    kmPerLitre: localStorage.getItem("drivesense-efficiency") || "15",
    fuelPrice: localStorage.getItem("drivesense-price") || "1050",
    traffic: "medium",
    acOn: false
  });

  // Photon Search logic (Free Autocomplete)
  const searchLocation = async (query, type) => {
    const formKey = type === 'dest' ? 'destination' : type;
    setForm(prev => ({ ...prev, [formKey]: query }));
    
    if (query.length < 3) {
      setSearchResults(prev => ({ ...prev, [type]: [] }));
      return;
    }

    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSearchResults(prev => ({ ...prev, [type]: data.features }));
      setShowDropdown(prev => ({ ...prev, [type]: true }));
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleSelectPlace = (feature, type) => {
    const name = feature.properties.name + (feature.properties.city ? `, ${feature.properties.city}` : "");
    const lonLat = feature.geometry.coordinates;
    const formKey = type === 'dest' ? 'destination' : type;
    
    setForm(prev => ({ ...prev, [formKey]: name }));
    setCoords(prev => ({ ...prev, [type]: lonLat }));
    setShowDropdown(prev => ({ ...prev, [type]: false }));
  };

  // Auto-calculate route when coordinates change
  useEffect(() => {
    if (coords.start && coords.dest) {
      calculateMetrics();
    }
  }, [coords]);

  const calculateMetrics = async () => {
    setIsCalculatingRoute(true);
    try {
      const [startLon, startLat] = coords.start;
      const [destLon, destLat] = coords.dest;
      
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${destLon},${destLat}?overview=false`);
      const data = await res.json();
      
      if (data.code === "Ok") {
        const distanceInKm = data.routes[0].distance / 1000;
        const durationInSec = data.routes[0].duration;
        
        setForm(prev => ({
          ...prev,
          distance: distanceInKm.toFixed(2)
        }));

        // Keep global trip state synced for the Map Page
        localStorage.setItem("drivesense-active-trip", JSON.stringify({
          startCoords: [startLon, startLat],
          destCoords: [destLon, destLat],
          startName: form.start,
          destName: form.destination,
          distance: distanceInKm.toFixed(1),
          duration: durationInSec
        }));
      }
    } catch (err) {
      console.error("Routing failed:", err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleResetForm = () => {
    setForm(prev => ({
      ...prev,
      start: "",
      destination: "",
      distance: "",
      litres: ""
    }));
  };

  // Persist efficiency and price settings
  useEffect(() => {
    localStorage.setItem("drivesense-efficiency", form.kmPerLitre);
    localStorage.setItem("drivesense-price", form.fuelPrice);
  }, [form.kmPerLitre, form.fuelPrice]);

  // Real-time calculation result
  const engineResult = smartFuelEngine({
    mode: form.mode,
    distance: Number(form.distance) || 0,
    litres: Number(form.litres) || 0,
    kmPerLitre: Number(form.kmPerLitre) || 15,
    fuelPrice: Number(form.fuelPrice) || 1050,
    traffic: form.traffic,
    acOn: form.acOn
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Save the precisely calculated results from the engine
    const result = await addTrip({
      ...engineResult,
      mode: form.mode,
      traffic: form.traffic,
      acOn: form.acOn,
      date: new Date().toISOString()
    });

    if (result.success) {
      setShowSuccess(true);
      setForm(prev => ({ ...prev, distance: "", litres: "" }));
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      if (result.error?.includes("permission")) {
        setError("Firebase Permission Error: Please ensure your Firestore Rules are set to 'Test Mode' or allow writes.");
      } else {
        setError("Failed to save smart trip. Please check your connection.");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto p-6 md:p-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <Link to="/" className="w-10 h-10 rounded-full bg-white dark:bg-[#121214] flex items-center justify-center shadow-sm hover:shadow-md transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tighter">Log Fuel.</h1>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium mt-1">Record your latest trip telemetry & expenses.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#121214] rounded-[40px] p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-transparent"
          >
            {(import.meta.env.VITE_FIREBASE_API_KEY === undefined || db.app?.options?.apiKey?.includes("...") || db.app?.options?.projectId?.includes("xxx")) && (
              <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-200 dark:border-amber-500/20 shadow-sm">
                <p className="text-amber-800 dark:text-amber-300 text-[13px] font-bold flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4" /> Action Required: Setup Firebase
                </p>
                <p className="text-amber-700/80 dark:text-amber-400/80 text-[12px] leading-relaxed">
                  Your project is currently using <strong>example placeholders</strong>. Please update <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">src/firebaseConfig.js</code> with your actual Firebase credentials.
                </p>
              </div>
            )}
            <div className="flex flex-col gap-10">
              {/* Mode Toggle */}
              <div className="bg-gray-50 dark:bg-[#0A0A0B] p-2 rounded-2xl flex relative overflow-hidden">
                <motion.div 
                  initial={false}
                  animate={{ x: form.mode === "distance" ? 0 : "100%" }}
                  className="absolute left-2 top-2 bottom-2 w-[calc(50%-8px)] bg-white dark:bg-[#1C1C1F] rounded-xl shadow-sm z-0"
                />
                <button 
                  type="button"
                  onClick={() => setForm({ ...form, mode: "distance" })}
                  className={`flex-1 py-3 text-[13px] font-bold z-10 transition-colors ${form.mode === "distance" ? "text-emerald-500" : "text-gray-400"}`}
                >
                  Distance Mode
                </button>
                <button 
                  type="button"
                  onClick={() => setForm({ ...form, mode: "fuel" })}
                  className={`flex-1 py-3 text-[13px] font-bold z-10 transition-colors ${form.mode === "fuel" ? "text-emerald-500" : "text-gray-400"}`}
                >
                  Fuel Mode
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Route Section */}
                {form.mode === "distance" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col md:flex-row gap-4 relative">
                      {/* Start Point */}
                      <div className="flex-1 space-y-3 relative">
                        <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-1">Start Point</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2">
                            <MapPin className="w-5 h-5 text-emerald-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search or use current location..."
                            className="w-full bg-gray-50 dark:bg-[#1C1C1F] rounded-3xl py-5 pl-16 pr-14 text-[14px] font-bold outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all shadow-sm"
                            value={form.start}
                            onChange={(e) => searchLocation(e.target.value, 'start')}
                            onFocus={() => form.start.length > 2 && setShowDropdown(p => ({ ...p, start: true }))}
                            onBlur={() => setTimeout(() => setShowDropdown(p => ({ ...p, start: false })), 200)}
                          />
                          {/* Current Location Button */}
                          <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            disabled={isLocating}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-500 transition-colors disabled:opacity-50"
                            title="Use my current location"
                          >
                            {isLocating
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Crosshair className="w-4 h-4" />}
                          </button>
                        </div>
                        <AnimatePresence>
                          {showDropdown.start && searchResults.start.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute z-[100] left-0 right-0 top-full mt-2 bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden max-h-60 overflow-y-auto"
                            >
                              {searchResults.start.map((res, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => handleSelectPlace(res, 'start')}
                                  className="w-full text-left px-6 py-4 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                                >
                                  <p className="text-[13px] font-bold text-gray-700 dark:text-gray-200 truncate">{res.properties.name}</p>
                                  <p className="text-[11px] text-gray-400 truncate">{res.properties.city}, {res.properties.country}</p>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Destination */}
                      <div className="flex-1 space-y-3 relative">
                        <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-1">Destination</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2">
                            <MapPin className="w-5 h-5 text-rose-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="Where to?"
                            className="w-full bg-gray-50 dark:bg-[#1C1C1F] rounded-3xl py-5 pl-16 pr-8 text-[14px] font-bold outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all shadow-sm"
                            value={form.destination}
                            onChange={(e) => searchLocation(e.target.value, 'dest')}
                            onFocus={() => form.destination.length > 2 && setShowDropdown(p => ({ ...p, dest: true }))}
                            onBlur={() => setTimeout(() => setShowDropdown(p => ({ ...p, dest: false })), 200)}
                          />
                        </div>
                        <AnimatePresence>
                          {showDropdown.dest && searchResults.dest.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute z-[100] left-0 right-0 top-full mt-2 bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden max-h-60 overflow-y-auto"
                            >
                              {searchResults.dest.map((res, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => handleSelectPlace(res, 'dest')}
                                  className="w-full text-left px-6 py-4 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                                >
                                  <p className="text-[13px] font-bold text-gray-700 dark:text-gray-200 truncate">{res.properties.name}</p>
                                  <p className="text-[11px] text-gray-400 truncate">{res.properties.city}, {res.properties.country}</p>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Primary Input */}
                  {form.mode === "distance" ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-600">Adjusted Distance (km)</label>
                        <div className="group/hint relative">
                          <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700 cursor-help" />
                          <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover/hint:opacity-100 pointer-events-none transition-all shadow-xl z-50 leading-relaxed">
                            <strong>"Adjusted Distance"</strong> is the actual road distance calculated by our smart routing engine (not just a straight line), giving you the most accurate fuel estimate.
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2">
                          <Navigation className={`w-5 h-5 ${isCalculatingRoute ? 'text-emerald-500 animate-pulse' : 'text-gray-300'} transition-colors`} />
                        </div>
                        <input
                          required
                          type="number"
                          placeholder={isCalculatingRoute ? "Calculating..." : "Distance in km"}
                          className={`w-full bg-gray-50 dark:bg-[#1C1C1F] rounded-3xl py-5 pl-16 pr-8 text-[15px] font-bold outline-none border-2 border-transparent transition-all ${form.start && form.destination ? 'bg-emerald-500/5 border-emerald-500/10' : ''}`}
                          onChange={(e) => setForm({ ...form, distance: e.target.value })}
                          value={form.distance}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-1">Fuel Bought (Liters)</label>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2">
                          <FuelIcon className="w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 10"
                          className="w-full bg-gray-50 dark:bg-[#1C1C1F] rounded-3xl py-5 pl-16 pr-8 text-[15px] font-bold outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all"
                          onChange={(e) => setForm({ ...form, litres: e.target.value })}
                          value={form.litres}
                        />
                      </div>
                    </div>
                  )}

                  {/* Efficiency Base */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-600">Distance per Litre (km/L)</label>
                      <div className="group/hint relative">
                        <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover/hint:opacity-100 pointer-events-none transition-all shadow-xl z-50 leading-relaxed">
                          Enter how many <strong>kilometers</strong> your car can drive on <strong>1 Litre</strong> of fuel. For example, 15 means your car goes 15km per 1L.
                        </div>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2">
                        <Gauge className="w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                      <input
                        required
                        type="number"
                        placeholder="e.g. 15"
                        className="w-full bg-gray-50 dark:bg-[#1C1C1F] rounded-3xl py-5 pl-16 pr-8 text-[15px] font-bold outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all"
                        onChange={(e) => setForm({ ...form, kmPerLitre: e.target.value })}
                        value={form.kmPerLitre}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Fuel Price */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-1">Fuel Price (₦/L)</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₦</div>
                      <input
                        required
                        type="number"
                        className="w-full bg-gray-50 dark:bg-[#1C1C1F] rounded-3xl py-5 pl-16 pr-8 text-[15px] font-bold outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all"
                        onChange={(e) => setForm({ ...form, fuelPrice: e.target.value })}
                        value={form.fuelPrice}
                      />
                    </div>
                  </div>

                  {/* AC Switch */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-1">Comfort Settings</label>
                    <button 
                      type="button"
                      onClick={() => setForm({ ...form, acOn: !form.acOn })}
                      className={`w-full flex items-center justify-between bg-gray-50 dark:bg-[#1C1C1F] rounded-3xl py-4 px-8 border-2 transition-all ${form.acOn ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-transparent'}`}
                    >
                      <div className="flex items-center gap-4">
                        <Wind className={`w-5 h-5 ${form.acOn ? 'text-emerald-500' : 'text-gray-300'}`} />
                        <span className="text-[14px] font-bold">Air Conditioning</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${form.acOn ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.acOn ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Traffic Selection */}
                <div className="space-y-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-1">Traffic Conditions</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setForm({ ...form, traffic: level })}
                        className={`py-4 rounded-2xl text-[12px] font-bold uppercase tracking-wider transition-all border-2 ${
                          form.traffic === level 
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                            : 'bg-gray-50 dark:bg-[#1C1C1F] text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-[#252528]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting || (!form.distance && !form.litres)}
                  className="w-full bg-gray-900 dark:bg-emerald-500 hover:bg-black dark:hover:bg-emerald-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white font-bold py-6 rounded-3xl text-[16px] shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Calculate & Save Trip
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {showSuccess && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center font-bold text-emerald-500 text-[14px]">
                        Smart trip saved successfully! 🎉
                     </motion.div>
                  )}
                </AnimatePresence>

                {/* View on Map Link */}
                <AnimatePresence>
                  {form.start && form.destination && coords.start && coords.dest && !isCalculatingRoute && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <Link 
                        to="/map"
                        className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-500 font-bold py-4 rounded-3xl text-[14px] transition-all flex items-center justify-center gap-2 border border-amber-500/20"
                      >
                        <MapPin className="w-4 h-4" /> See Route on Map
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* Tips / Info Column */}
          <div className="space-y-8">
             <motion.div 
               key={form.mode + form.traffic + form.acOn}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-emerald-500 p-10 rounded-[40px] text-white shadow-[0_25px_60px_rgba(16,185,129,0.2)]"
             >
                <div className="flex items-center gap-3 mb-8 opacity-60">
                   <Activity className="w-5 h-5" />
                   <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Smart Estimation Result</span>
                </div>
                
                <div className="space-y-8">
                   <div className="flex justify-between items-end border-b border-white/10 pb-6">
                      <span className="text-[14px] font-medium opacity-60">Calculated Distance</span>
                      <span className="text-3xl font-bold tracking-tighter">{engineResult.distance} <span className="text-sm opacity-60">km</span></span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/10 pb-6">
                      <span className="text-[14px] font-medium opacity-60">Fuel Required</span>
                      <span className="text-3xl font-bold tracking-tighter">{engineResult.fuelUsed} <span className="text-sm opacity-60">L</span></span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/10 pb-6">
                      <span className="text-[14px] font-medium opacity-60">Estimated Cost</span>
                      <span className="text-3xl font-bold tracking-tighter">₦{engineResult.cost.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-[14px] font-medium opacity-60">Adjusted Efficiency</span>
                      <span className="text-3xl font-bold tracking-tighter">{engineResult.efficiency} <span className="text-sm opacity-60">km/L</span></span>
                   </div>
                </div>

                <div className="mt-12 flex items-center gap-3 p-4 bg-black/10 rounded-2xl">
                   <AlertCircle className="w-4 h-4 opacity-40" />
                   <p className="text-[11px] font-medium text-white/60 leading-relaxed">
                      Factors applied: {form.traffic === 'high' ? 'High Traffic (0.75x)' : form.traffic === 'medium' ? 'Med Traffic (0.9x)' : 'Low Traffic (1.0x)'} 
                      {form.acOn ? ' & AC Load (0.95x)' : ''}.
                   </p>
                </div>
             </motion.div>

             <div className="bg-white dark:bg-[#121214] p-8 rounded-[40px] border border-gray-100 dark:border-white/5">
                <h3 className="text-[15px] font-bold mb-4">Adaptive Factors</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-[13px] font-medium text-gray-500">
                      <span>Traffic Impact</span>
                      <span className="text-emerald-500 font-bold">{form.traffic === 'high' ? '-25%' : form.traffic === 'medium' ? '-10%' : 'None'}</span>
                   </div>
                   <div className="flex items-center justify-between text-[13px] font-medium text-gray-500">
                      <span>AC Consumption</span>
                      <span className="text-emerald-500 font-bold">{form.acOn ? '-5.2%' : 'None'}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
