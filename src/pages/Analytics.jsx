import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  TrendingUp, BarChart3, PieChart, 
  ArrowUpRight, ArrowDownRight, 
  Calendar, Zap, Droplet
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Analytics() {
  const { isDarkMode } = useOutletContext();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "trips"));
        setTrips(querySnapshot.docs.map(doc => doc.data()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const totalDist = trips.reduce((acc, t) => acc + (t.distance || 0), 0);
  const totalFuel = trips.reduce((acc, t) => acc + (t.fuelUsed || 0), 0);
  const totalCost = trips.reduce((acc, t) => acc + (t.cost || 0), 0);
  const avgEff = totalFuel > 0 ? (totalDist / totalFuel).toFixed(2) : "0.00";

  return (
    <div className="flex-1 overflow-auto bg-[#F5F5F7] dark:bg-[#0A0A0B] transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">Analytics Engine.</h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium mt-1">Deep-dive into your fleet's efficiency and cost metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white dark:bg-[#121214] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm"
           >
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                    <Zap className="w-5 h-5 text-emerald-500" />
                 </div>
                 <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Efficiency Score</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{avgEff} <span className="text-lg text-gray-400 font-medium">km/L</span></h3>
              <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold">
                 <ArrowUpRight className="w-4 h-4" /> +2.4% vs last month
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white dark:bg-[#121214] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm"
           >
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                 </div>
                 <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Total Spend</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">₦{(totalCost/1000).toFixed(1)}k</h3>
              <div className="mt-4 flex items-center gap-2 text-rose-500 text-[12px] font-bold">
                 <ArrowUpRight className="w-4 h-4" /> +12% increase
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white dark:bg-[#121214] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm"
           >
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
                    <Droplet className="w-5 h-5 text-rose-500" />
                 </div>
                 <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Fuel Index</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{totalFuel.toLocaleString()} <span className="text-lg text-gray-400 font-medium">L</span></h3>
              <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold">
                 <ArrowDownRight className="w-4 h-4" /> -5.1% consumption
              </div>
           </motion.div>
        </div>

        {/* Chart Sections (Simulated with Premium UI) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-[#121214] p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm min-h-[400px]">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fuel Trends</h3>
                    <p className="text-[13px] text-gray-400 font-medium">Monthly efficiency progression</p>
                 </div>
                 <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <button className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-white dark:bg-[#1C1C1F] shadow-sm">6M</button>
                    <button className="px-3 py-1.5 text-[11px] font-bold text-gray-500">1Y</button>
                 </div>
              </div>
              
              {/* Simulated SVG Chart */}
              <div className="w-full h-48 mt-12 relative">
                 <svg viewBox="0 0 400 100" className="w-full h-full">
                    <defs>
                       <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: 'rgb(16, 185, 129)', stopOpacity: 0.2 }} />
                          <stop offset="100%" style={{ stopColor: 'rgb(16, 185, 129)', stopOpacity: 0 }} />
                       </linearGradient>
                    </defs>
                    <path 
                       d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20" 
                       fill="none" 
                       stroke="rgb(16, 185, 129)" 
                       strokeWidth="3" 
                       strokeLinecap="round"
                    />
                    <path 
                       d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20 V100 H0 Z" 
                       fill="url(#grad)"
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-end justify-between px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-40">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-[#121214] p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cost Distribution</h3>
              <p className="text-[13px] text-gray-400 font-medium mb-10">Breakdown by fuel station / source</p>
              
              <div className="space-y-6">
                 {[
                   { name: "Total NNPCL", value: 65, color: "bg-emerald-500" },
                   { name: "Total Mobil", value: 25, color: "bg-indigo-500" },
                   { name: "Miscellaneous", value: 10, color: "bg-gray-300 dark:bg-gray-700" }
                 ].map(item => (
                   <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-[13px] font-bold">
                         <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                         <span className="text-gray-900 dark:text-white">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-[#1C1C1F] h-2 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.value}%` }}
                           transition={{ duration: 1, delay: 0.5 }}
                           className={`${item.color} h-full rounded-full`}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
