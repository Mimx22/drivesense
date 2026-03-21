import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";
import Fuel from "./pages/Fuel";
import Analytics from "./pages/Analytics";
import LiveMap from "./pages/LiveMap";
import Settings from "./pages/Settings";

// A simple Error Boundary to catch silent crashes has been moved to prevent HMR issues

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/fuel" element={<Fuel />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
