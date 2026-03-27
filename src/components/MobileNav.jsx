import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Map, Droplet, Activity, Settings } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", path: "/", icon: LayoutGrid },
  { name: "Map", path: "/map", icon: Map },
  { name: "Fuel", path: "/fuel", icon: Droplet },
  { name: "Stats", path: "/analytics", icon: Activity },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function MobileNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="lg:hidden fixed bottom-0 w-full bg-white/90 dark:bg-[#121214]/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 z-50 pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const isActive = (currentPath === item.path) || (item.path === "/" && currentPath === "");
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className="flex flex-col items-center justify-center w-16 h-full gap-1 relative"
            >
              <div className={`relative p-1 rounded-xl transition-all duration-300 ${isActive ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`}>
                {isActive && (
                  <motion.div 
                    layoutId="mobileNavIndicator"
                    className="absolute inset-0 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  />
                )}
                <Icon className="w-[20px] h-[20px] relative z-10" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  );
}
