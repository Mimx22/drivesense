import { Bell, Search, UserCircle, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState(localStorage.getItem("drivesense-username") || "Alex Driver");

  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem("drivesense-username") || "Alex Driver");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return (
    <header className="bg-white/80 backdrop-blur-xl h-[90px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 w-full transition-all">
      <div className="flex items-center gap-4 hidden md:flex w-96">
        <div className="relative w-full group">
           <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
           <input 
             type="text" 
             placeholder="Search trips, locations..." 
             className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-black border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
           />
        </div>
      </div>
      
      {/* Mobile Title */}
      <h1 className="text-2xl font-extrabold tracking-tight md:hidden">DriveSense.</h1>

      <div className="flex items-center gap-8 ml-auto">
        <div className="flex items-center gap-2">
          <button className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all relative group">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-black rounded-full"></span>
          </button>
          <button className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all group">
            <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[15px] font-extrabold text-gray-900 group-hover:text-black">{userName}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">Admin</p>
          </div>
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold shadow-[0_4px_15px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform uppercase">
            {userName.split(" ").map(n => n[0]).join("").substring(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}
