import { useOutletContext, Link } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { ArrowLeft, Map as MapIcon, Maximize2, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function LiveMap() {
  const { isDarkMode } = useOutletContext();

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

      {/* Full Screen Map */}
      <div className="w-full h-full grayscale-[0.2] dark:grayscale-[0.5] contrast-[1.1]">
        <MapComponent isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
