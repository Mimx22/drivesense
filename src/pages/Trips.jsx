import { motion } from "framer-motion";
import { Map as MapIcon, Calendar, Navigation, MoreHorizontal } from "lucide-react";

export default function Trips() {
  const sampleTrips = [
    { id: 1, date: "2026-03-20", from: "Victoria Island", to: "Lekki Phase 1", distance: "8.4", time: "24m" },
    { id: 2, date: "2026-03-19", from: "Ikeja City Mall", to: "Maryland", distance: "12.1", time: "38m" },
    { id: 3, date: "2026-03-19", from: "Surulere", to: "Apapa", distance: "15.0", time: "45m" },
  ];

  return (
    <div className="flex-1 overflow-auto bg-[#F5F5F7] dark:bg-[#0A0A0B] transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto p-6 md:p-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white transition-colors">Trip History.</h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium mt-1">Review your recent routes and travel patterns.</p>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {sampleTrips.map((trip, idx) => (
            <motion.div 
              key={trip.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#121214] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group cursor-pointer border border-gray-100 dark:border-white/5"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#1C1C1F] flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <MapIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {trip.from} 
                    <span className="text-gray-300 dark:text-gray-700 font-normal">→</span> 
                    {trip.to}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[12px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {trip.date}
                    </span>
                    <span className="text-[12px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5" /> {trip.distance} km
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 px-2">
                <div className="text-right">
                  <p className="text-[13px] font-bold text-gray-900 dark:text-white">{trip.time}</p>
                  <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Completed</p>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#1C1C1F] rounded-xl transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
