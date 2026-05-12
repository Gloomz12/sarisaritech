import React, { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../component/dashboard/Sidebar";
import HeaderDashboard from "../component/dashboard/HeaderDashboard";

export default function MainLayout() {
  const [darkMode, setDarkMode] = useState(false);

  /* LOAD SAVED THEME */

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);

      document.documentElement.classList.add("dark");
    }
  }, []);

  /* SAVE THEME */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");

      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");

      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden

        bg-[#f5f7fb]
        dark:bg-[#020817]

        transition-all
        duration-300
      "
    >
      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <div
        className="
          flex-1
          flex
          flex-col
          overflow-hidden
        "
      >
        {/* HEADER */}

        <HeaderDashboard />

        {/* PAGE */}

        <div
          className="
            flex-1
            overflow-y-auto

            px-7
            py-6
          "
        >
          <Outlet
            context={{
              darkMode,
              setDarkMode,
            }}
          />
        </div>
      </div>
    </div>
  );
}
