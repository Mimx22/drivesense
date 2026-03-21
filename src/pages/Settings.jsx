import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, Shield, User, Bell, 
  Trash2, Moon, Sun, AlertTriangle, Save, CheckCircle2,
  Car, Banknote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAllTrips } from "../services/tripService";
import { useOutletContext } from "react-router-dom";

export default function Settings() {
  const { isDarkMode, setIsDarkMode } = useOutletContext();
  const [isReseting, setIsReseting] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  
  // Fuel Defaults
  const [efficiency, setEfficiency] = useState(localStorage.getItem("drivesense-efficiency") || "15");
  const [fuelPrice, setFuelPrice] = useState(localStorage.getItem("drivesense-price") || "1050");
  const [currency, setCurrency] = useState("NGN");
  const [userName, setUserName] = useState(localStorage.getItem("drivesense-username") || "Alex Driver");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("drivesense-email") || "alex@drivesense.app");

  const handleSaveDefaults = () => {
    localStorage.setItem("drivesense-efficiency", efficiency);
    localStorage.setItem("drivesense-price", fuelPrice);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const handleReset = async () => {
    if (window.confirm("⚠️ Are you sure you want to delete all trip data? This action CANNOT be undone.")) {
      setIsReseting(true);
      const result = await clearAllTrips();
      if (result.success) {
        alert("Database cleared successfully!");
      } else {
        alert("Failed to clear database: " + result.error);
      }
      setIsReseting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F5F5F7] dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
      <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10">
        
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#121214] flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/5">
            <SettingsIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings & Preferences</h1>
            <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-1">Manage your account, appearance, and default vehicle values.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Preferences Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Vehicle & Fuel Preferences */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#121214] rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-white/5"
            >
              <h2 className="text-[16px] font-bold flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                <Car className="w-5 h-5 text-indigo-500" /> Vehicle Defaults
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <label className="text-[12px] font-extrabold uppercase tracking-widest text-gray-400 px-1">Default Efficiency (km/L)</label>
                  <input
                    type="number"
                    step="any"
                    value={efficiency}
                    onChange={(e) => setEfficiency(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1C1C1F] rounded-xl py-3 px-5 text-[14px] font-bold outline-none border-2 border-transparent focus:border-indigo-500/20 transition-all"
                  />
                  <p className="text-[11px] text-gray-400 px-1">How many km your car drives on 1L of fuel.</p>
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-extrabold uppercase tracking-widest text-gray-400 px-1">Default Fuel Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₦</span>
                    <input
                      type="number"
                      step="any"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#1C1C1F] rounded-xl py-3 pl-10 pr-5 text-[14px] font-bold outline-none border-2 border-transparent focus:border-indigo-500/20 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 px-1">Current local price per litre.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-white/5 pt-6">
                <button 
                  onClick={handleSaveDefaults}
                  className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Defaults
                </button>
                <AnimatePresence>
                  {showSavedMsg && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-emerald-500 text-[12px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Saved!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Appearance Preferences */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#121214] rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-white/5"
            >
              <h2 className="text-[16px] font-bold flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                <Moon className="w-5 h-5 text-violet-500" /> Appearance
              </h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1C1C1F] rounded-2xl border border-gray-200 dark:border-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-[#121214] rounded-lg shadow-sm">
                    {isDarkMode ? <Moon className="w-5 h-5 text-amber-300" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold">Theme Setting</h3>
                    <p className="text-[11px] text-gray-500">Toggle between light and dark mode for the application.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#121214] rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-white/5 opacity-50 grayscale pointer-events-none"
            >
              <h2 className="text-[16px] font-bold flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                 <Bell className="w-5 h-5" /> Notifications <span className="text-[10px] bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded ml-2">Coming Soon</span>
              </h2>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold">Email Trip Summaries</span>
                    <div className="w-10 h-5 bg-gray-200 rounded-full"></div>
                 </div>
              </div>
            </motion.div>

          </div>

          {/* Account & Danger Column */}
          <div className="space-y-8">
            {/* Profile Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#121214] dark:bg-emerald-900 overflow-hidden rounded-3xl shadow-xl relative text-white"
            >
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-tr from-emerald-500 to-indigo-500 opacity-20"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-bold border-4 border-[#121214] dark:border-emerald-900 shadow-xl mb-4 uppercase">
                  {userName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={() => {
                    localStorage.setItem("drivesense-username", userName);
                    window.dispatchEvent(new Event("storage"));
                  }}
                  className="bg-transparent text-lg font-bold outline-none border-b border-transparent focus:border-emerald-500/50 transition-colors w-full mb-1"
                />
                <input 
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  onBlur={() => localStorage.setItem("drivesense-email", userEmail)}
                  className="bg-transparent text-[12px] text-white/60 outline-none border-b border-transparent focus:border-emerald-500/50 transition-colors w-full mb-6"
                />
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl border border-white/5">
                  <span>Plan</span>
                  <span className="text-emerald-400">Pro</span>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-[#121214] rounded-3xl p-8 border border-rose-200 dark:border-rose-900/30 overflow-hidden relative shadow-sm"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>
              <h2 className="text-[16px] font-bold flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-6 text-rose-500">
                 <AlertTriangle className="w-5 h-5" /> Danger Zone
              </h2>
              
              <div className="space-y-4">
                <div>
                   <h3 className="text-[14px] font-bold">Clear All Telemetry</h3>
                   <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Permanently delete all logged trips, fuel entries, and Analytics history. This action cannot be reversed.</p>
                </div>
                <button 
                  onClick={handleReset}
                  disabled={isReseting}
                  className="w-full py-3 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 transition-all border border-rose-200 dark:border-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" /> 
                  {isReseting ? "Clearing Database..." : "Delete All Trip Data"}
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
