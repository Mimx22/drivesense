import { Link, useLocation } from "react-router-dom";
import { 
  Map, Droplet, Activity, Settings, 
  LayoutGrid, Car, Sun, Moon
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Overview", path: "/", icon: LayoutGrid },
  { name: "Live Map", path: "/map", icon: Map },
  { name: "Fuel Logs", path: "/fuel", icon: Droplet },
  { name: "Analytics", path: "/analytics", icon: Activity },
];

export default function Sidebar({ isDarkMode, setIsDarkMode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-[280px] flex-shrink-0 bg-transparent flex flex-col justify-between z-20 h-screen sticky top-0 hidden lg:flex">
      <div>
        <div className="h-[76px] flex items-center px-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center animate-pulse transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Car className="w-5 h-5 text-white fill-white/80" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[18px] tracking-tight text-gray-900 dark:text-white transition-colors">DriveSense</span>
          </div>
        </div>
        
        <div className="px-10 py-12">
          <p className="px-2 text-[10px] font-extrabold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-8 transition-colors">Main Menu</p>
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => {
              const isActive = (currentPath === item.path) || (item.path === "/" && currentPath === "");
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`flex items-center gap-5 px-2 text-[15px] transition-all duration-300 relative group ${
                    isActive 
                      ? "text-gray-900 dark:text-white font-bold" 
                      : "text-gray-400 dark:text-gray-500 font-medium hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? "text-emerald-500 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500 group-hover:scale-110"}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="tracking-wide">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="px-10 pb-12">
        {/* Theme Toggle in Sidebar */}
        <div className="mb-10 px-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-5 w-full text-[14px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#121214] flex items-center justify-center shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-all border border-gray-100 dark:border-white/5">
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </div>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="mb-10 group cursor-pointer px-2 transition-all">
           <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-bold text-gray-800 dark:text-gray-200 transition-colors">Pro Plan</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">Active</span>
           </div>
           <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden transition-colors">
              <div className="bg-emerald-500 w-[65%] h-full rounded-full"></div>
           </div>
           <p className="text-[11px] text-gray-400 mt-3 font-medium">65% of monthly quota</p>
        </div>

        <div className="flex flex-col px-2">
          <Link to="/settings" className="flex items-center gap-5 text-[15px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-all w-full text-left group">
            <Settings className="w-[22px] h-[22px] group-hover:rotate-45 transition-transform duration-500" strokeWidth={2} />
            <span className="tracking-wide">Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
