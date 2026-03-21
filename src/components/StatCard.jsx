import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, subtitle, icon: Icon, delay, trend }) {
  const isPositive = trend === "up";
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-4px_rgba(0,0,0,0.08)] transition-shadow relative overflow-hidden group cursor-default"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500 rounded-bl-full -z-10"></div>
      
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-black text-white rounded-[1.2rem] shadow-[0_8px_15px_-3px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" strokeWidth={3} /> : <ArrowDownRight className="w-4 h-4" strokeWidth={3} />}
            <span>{isPositive ? '2.4%' : '1.2%'}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">{title}</h3>
        <p className="text-[2.5rem] leading-none font-extrabold text-gray-900 tracking-tighter">{value}</p>
        <p className="text-sm font-semibold text-gray-400 mt-4 pt-4 flex items-center gap-2">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
