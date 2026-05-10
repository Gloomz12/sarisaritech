import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Auth from "./pages/Auth.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Inventory from "./pages/Inventory.jsx";
import RecordSale from "./pages/RecordSale.jsx";
import Restock from "./pages/Restock.jsx";
import Statistics from "./pages/Statistics.jsx";
import History from "./pages/History.jsx";
import AiInsight from "./pages/AiInsight.jsx";
import Settings from "./pages/Settings.jsx";

import MainLayout from "./layouts/MainLayout.jsx";

import ProtectedRoute from "./component/auth/ProtectedRoute.jsx";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* AUTH */}

        <Route
          path="/login"
          element={<Auth />}
        />

        <Route
          path="/register"
          element={<Auth />}
        />

        {/* MAIN DASHBOARD LAYOUT */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/record-sale"
            element={<RecordSale />}
          />

          <Route
            path="/restock"
            element={<Restock />}
          />

          <Route
            path="/statistics"
            element={<Statistics />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/ai-insight"
            element={<AiInsight />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

        {/* UNKNOWN */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}