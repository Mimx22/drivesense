import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { 
  Map, Droplet, Activity, Settings, 
  Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Navigation, Zap, LayoutGrid, Car, Sun, Moon, Info, Trash2, AlertCircle
} from "lucide-react";
import MapComponent from "../components/MapComponent";
import FuelNews from "../components/FuelNews";
import { motion } from "framer-motion";

// Helper for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { isDarkMode, setIsDarkMode } = useOutletContext();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "trips"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const [userName, setUserName] = useState(localStorage.getItem("drivesense-username") || "Alex Driver");

  useEffect(() => {
    fetchTrips();
    
    // Listen for profile name changes from Settings
    const handleStorageChange = () => {
      setUserName(localStorage.getItem("drivesense-username") || "Alex Driver");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Calculate stats from trips
  const stats = {
    totalDistance: trips.reduce((acc, trip) => acc + (trip.distance || 0), 0),
    totalFuel: trips.reduce((acc, trip) => acc + (trip.fuelUsed || 0), 0),
    totalCost: trips.reduce((acc, trip) => acc + (trip.cost || 0), 0),
  };

  const avgEfficiency = stats.totalFuel > 0 ? (stats.totalDistance / stats.totalFuel).toFixed(1) : "0.0";

  const isConfigPlaceholder = 
    db.app?.options?.apiKey === "YOUR_KEY" || 
    db.app?.options?.apiKey?.includes("...") || 
    db.app?.options?.projectId?.includes("xxx");

  const kpis = [
    { label: "Total Distance", value: stats.totalDistance.toLocaleString(), unit: "km", trend: "+12.5%", isPositive: true, icon: Navigation },
    { label: "Fuel Consumed", value: stats.totalFuel.toLocaleString(), unit: "L", trend: "-4.2%", isPositive: true, icon: Droplet },
    { label: "Avg. Efficiency", value: avgEfficiency, unit: "km/L", trend: "+1.1%", isPositive: true, icon: Zap },
    { label: "Weekly Cost", value: `₦${(stats.totalCost / 1000).toFixed(1)}k`, unit: "", trend: "+5.4%", isPositive: false, icon: Activity },
  ];

  const navItems = [
    { name: "Overview", path: "/", icon: LayoutGrid },
    { name: "Live Map", path: "/trips", icon: Map },
    { name: "Fuel Logs", path: "/fuel", icon: Droplet },
    { name: "Analytics", path: "/analytics", icon: Activity },
  ];  return (
    <div className="flex-1 overflow-auto bg-[#F5F5F7] dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-300 transition-colors duration-500">
      {/* Search Header */}
      <header className="h-[76px] flex items-center justify-between px-6 md:px-12 sticky top-0 bg-[#F5F5F7]/80 dark:bg-[#0A0A0B]/80 backdrop-blur-md z-30 transition-colors duration-500">
          <div className="flex items-center gap-4">
             {/* Left - Breadcrumb Structure */}
             <div className="flex items-center gap-2.5 text-[13px] font-medium text-gray-500 dark:text-gray-400">
                <div className="w-7 h-7 bg-gray-50 dark:bg-[#121214] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1A1A1E] transition-colors">
                   <LayoutGrid className="w-[14px] h-[14px] text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-gray-300 dark:text-gray-700">/</span>
                <span className="text-gray-900 dark:text-white bg-gray-50 dark:bg-[#121214] px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm dark:shadow-none font-semibold transition-colors">
                  Dashboard Overview
                </span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Center - Structured Search */}
            <div className="relative group hidden lg:block mr-2">
              <Search className="w-[14px] h-[14px] absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources, trips..." 
                className="w-72 bg-gray-50 dark:bg-[#121214] hover:bg-white dark:hover:bg-[#18181B] focus:bg-white dark:focus:bg-[#18181B] border border-transparent focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-sm rounded-xl py-2 pl-9 pr-14 text-[13px] font-medium text-gray-900 dark:text-gray-100 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                 <kbd className="px-1.5 py-0.5 rounded-[4px] bg-white dark:bg-[#1C1C1F] border border-gray-200 dark:border-transparent text-[10px] font-bold text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors">⌘</kbd>
                 <kbd className="px-1.5 py-0.5 rounded-[4px] bg-white dark:bg-[#1C1C1F] border border-gray-200 dark:border-transparent text-[10px] font-bold text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors">K</kbd>
              </div>
            </div>
            
            {/* Right - Profile & Actions Container */}
            <div className="flex items-center gap-1 bg-gray-50/80 dark:bg-[#121214] p-1 rounded-2xl border border-gray-100/80 dark:border-transparent transition-colors">
              {/* Theme Toggle Button */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-transparent hover:bg-white dark:hover:bg-[#1C1C1F] hover:shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all relative"
              >
                {isDarkMode ? <Sun className="w-[16px] h-[16px]" /> : <Moon className="w-[16px] h-[16px]" />}
              </button>

              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-transparent hover:bg-white dark:hover:bg-[#1C1C1F] hover:shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all relative">
                <Bell className="w-[16px] h-[16px]" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full dark:border-2 dark:border-[#121214]"></span>
              </button>
              
              <div className="w-[1px] h-5 bg-gray-200 dark:bg-gray-800 mx-1 transition-colors"></div>
              
              <button className="flex items-center gap-3 hover:bg-white dark:hover:bg-[#1C1C1F] p-1 pr-3 rounded-xl transition-all hover:shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold shadow-inner uppercase">
                    {userName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                 </div>
                 <div className="hidden sm:block text-left">
                    <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-none mb-0.5 transition-colors">{userName}</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none transition-colors">Workspace</p>
                 </div>
                 <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 ml-1 hidden sm:block transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 z-0">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="max-w-[1400px] mx-auto space-y-8 pb-10"
          >
            {/* Header Area */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {isConfigPlaceholder ? "⚠️ Configuration Check Required" : "System Online & Recording"}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white transition-colors duration-500">Real-time Telemetry.</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white dark:bg-[#121214] rounded-xl p-1 shadow-sm dark:shadow-none transition-colors duration-500 border border-gray-100 dark:border-white/5">
                  <button className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-gray-100 dark:bg-[#1C1C1F] text-gray-900 dark:text-white transition-all cursor-pointer">Today</button>
                  <button className="px-4 py-2 text-[12px] font-semibold rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1A1A1E] transition-all cursor-pointer">7d</button>
                  <button className="px-4 py-2 text-[12px] font-semibold rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1A1A1E] transition-all cursor-pointer">30d</button>
                </div>
              </div>
            </motion.div>

            {loading && !isConfigPlaceholder ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-[160px] bg-white dark:bg-[#121214] rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : isConfigPlaceholder ? (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl p-8 text-amber-800 dark:text-amber-200">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Firebase Configuration Incomplete
                </h3>
                <p className="text-sm opacity-90 leading-relaxed mb-4">
                  The dashboard is currently using <strong>example placeholders</strong>. To see your real data, please replace the current values in 
                  <code className="mx-1 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 flex-inline rounded font-mono text-[12px]">src/firebaseConfig.js</code> 
                  with your real API Key and Project ID.
                </p>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl text-[12px] font-medium border border-amber-200/50 dark:border-amber-500/10">
                   <strong>Goal:</strong> Ensure <code className="text-rose-500">apiKey</code> starts with <code className="text-emerald-500">AIza...</code> and does not contain "<code className="text-rose-500">xxx</code>".
                </div>
              </div>
            ) : (
                /* KPIs Grid */
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                      <motion.div 
                        key={kpi.label}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white dark:bg-[#121214] rounded-3xl p-6 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-[160px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer"
                      >
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none hidden dark:block"></div>
                        <div className="flex justify-between items-start relative z-10">
                          <div className="flex items-center gap-2 group/info">
                            <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{kpi.label}</p>
                            <div className="relative">
                               <Info className="w-3 h-3 text-gray-300 dark:text-gray-700 cursor-help" />
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover/info:opacity-100 pointer-events-none transition-all shadow-xl z-50">
                                  {kpi.label === "Total Distance" && "Sum of all logged trip distances in kilometers."}
                                  {kpi.label === "Fuel Consumed" && "Total amount of fuel used across all recorded trips."}
                                  {kpi.label === "Avg. Efficiency" && "Calculated as Total Distance ÷ Total Fuel Used (km/L)."}
                                  {kpi.label === "Weekly Cost" && "Sum of all fuel expenses logged in the system."}
                               </div>
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-[#1C1C1E] rounded-xl group-hover:scale-110 group-hover:bg-gray-100 dark:group-hover:bg-[#252528] transition-all duration-300">
                            <Icon className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" strokeWidth={2} />
                          </div>
                        </div>
                        
                        <div className="mt-auto flex items-end justify-between relative z-10">
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-[34px] leading-none font-bold tracking-tighter text-gray-900 dark:text-white transition-colors">{kpi.value}</h3>
                            <span className="text-[14px] text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">{kpi.unit}</span>
                          </div>
                          
                          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors ${kpi.isPositive ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'}`}>
                            {kpi.isPositive ? <TrendingUp className="w-3 h-3" strokeWidth={3} /> : <TrendingDown className="w-3 h-3" strokeWidth={3} />}
                            {kpi.trend}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
            )}

            {/* Bottom Section: Map & News */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Map Column */}
              <div className="lg:col-span-2 bg-white dark:bg-[#121214] rounded-3xl overflow-hidden flex flex-col h-[520px] relative group transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <div className="h-16 flex items-center justify-between px-8 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-sm absolute top-0 w-full z-20 transition-colors duration-500">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg transition-colors">
                      <Map className="w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-colors" />
                    </div>
                    <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white transition-colors">Live Regional Tracking</h2>
                  </div>
                  <Link 
                    to="/map" 
                    className="text-[12px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm dark:shadow-none"
                  >
                    Expand Map <span className="text-[14px]">↗</span>
                  </Link>
                </div>
                
                <div className="flex-1 w-full h-full relative z-0 bg-gray-100 dark:bg-[#0A0A0B] transition-colors duration-500">
                  <MapComponent isDarkMode={isDarkMode} />
                </div>
              </div>

              {/* News Column */}
              <div className="h-[520px]">
                <FuelNews />
              </div>
            </motion.div>

          </motion.div>
        </main>
      </div>
  );
}
