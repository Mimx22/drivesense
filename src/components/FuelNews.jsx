import { useState, useEffect } from "react";
import { Newspaper, ExternalLink, Clock, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FuelNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample static news for when API is not available/configured
  const fallbackNews = [
    {
      id: "1",
      title: "NNPC Ltd Adjusts Petrol Prices Across Nigeria",
      source: "Energy Now",
      time: "2h ago",
      url: "#",
      category: "Market"
    },
    {
      id: "2",
      title: "OPEC+ Maintains Oil Production Cuts to Support Stability",
      source: "Reuters",
      time: "5h ago",
      url: "#",
      category: "Global"
    },
    {
      id: "3",
      title: "New Refinery Operations Expected to Lower Local Fuel Costs",
      source: "BusinessDay",
      time: "8h ago",
      url: "#",
      category: "Production"
    },
    {
      id: "4",
      title: "Electricity Grid Expansion: New Substations Commissioned in Lagos",
      source: "Vanguard",
      time: "12h ago",
      url: "#",
      category: "Energy"
    }
  ];

  useEffect(() => {
    // In a real app, you'd fetch from an API like NewsData.io here
    // For now, we simulate a loading state and then show the curated feed
    const timer = setTimeout(() => {
      setNews(fallbackNews);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-[#121214] rounded-3xl p-6 h-full flex flex-col border border-gray-100 dark:border-white/5 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <Newspaper className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">Market News</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live Updates</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 opacity-30">
             <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
             <p className="text-[11px] font-bold uppercase tracking-widest">Fetching Headlines</p>
          </div>
        ) : (
          news.map((item, idx) => (
            <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="block p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] border border-transparent hover:border-indigo-500/20 hover:bg-white dark:hover:bg-[#1C1C1F] hover:shadow-sm transition-all group"
            >
                <div className="flex items-start justify-between gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest ${
                        item.category === 'Market' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' : 
                        item.category === 'Global' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-900'
                    }`}>
                        {item.category}
                    </span>
                    <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h4 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mt-2 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white">
                    {item.title}
                </h4>
                <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{item.source}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500">
                        <Clock className="w-2.5 h-2.5" />
                        {item.time}
                    </div>
                </div>
            </motion.a>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 dark:border-white/5">
         <button className="w-full py-2 text-[11px] font-bold text-gray-400 hover:text-indigo-500 flex items-center justify-center gap-2 transition-all">
            View All Energy News <ArrowRight className="w-3 h-3" />
         </button>
      </div>
    </div>
  );
}

function ArrowRight(props) {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
