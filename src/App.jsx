import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import Dashboard from "./pages/dashboard.jsx";
import Inventory from "./pages/inventory.jsx";
import RecordSale from "./pages/recordSale.jsx";
import Restock from "./pages/restock.jsx";
import Analytics from "./pages/analytics.jsx";
import History from "./pages/history.jsx";
import AiInsight from "./pages/aiInsight";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/record-sale" element={<RecordSale />} />
          <Route path="/restock" element={<Restock />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route path="/ai-insight" element={<AiInsight />} />
        </Routes>
      </BrowserRouter>
  );
}
