import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function MainLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync theme with document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle local storage for theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem("drivesense-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);

  const handleThemeChange = (newVal) => {
    setIsDarkMode(newVal);
    localStorage.setItem("drivesense-theme", newVal ? "dark" : "light");
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 overflow-x-hidden">
      {/* Sidebar is now persistent and always on screen */}
      <Sidebar isDarkMode={isDarkMode} setIsDarkMode={handleThemeChange} />
      
      {/* Content Area */}
      <main className="flex-1 relative overflow-auto h-screen custom-scrollbar pb-24 lg:pb-0">
        {/* We pass isDarkMode down to the Outlet context if needed by children */}
        <Outlet context={{ isDarkMode, setIsDarkMode: handleThemeChange }} />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
