import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import QuickActions from "../component/dashboard/QuickActions";
import DashboardLayout from "../component/dashboard/DashboardLayout";
import AIInsightPanel from "../component/dashboard/AIInsightPanel";
import StatsCard from "../component/dashboard/StatsCard";
import StockAlertCard from "../component/dashboard/StockAlertCard";

import { getDashboardStats } from "../services/dashboardService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  /* FETCH DASHBOARD */

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardStats();

      setStats(data);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {/* RECORD SALE */}

      <button
        onClick={() => navigate("/record-sale")}
        className="
          w-full
          h-14

          rounded-2xl

          bg-orange-500
          hover:bg-orange-600

          text-white
          font-semibold
          text-base

          shadow-sm
          hover:shadow-lg
          hover:-translate-y-[2px]

          transition-all
          duration-300
        "
      >
        + Record Sale
      </button>

      {/* QUICK ACTIONS */}

      <QuickActions />

      {/* HERO SECTION */}

      <DashboardLayout />

      {/* AI PANEL */}

      <AIInsightPanel />

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-4
          items-start
        "
      >
        {/* TODAY SALES */}

        <StatsCard
          title="Today's Sales"
          value={`₱${stats?.today?.sales?.toLocaleString() || 0}`}
          subtitle={`${stats?.today?.transactions || 0} Transactions`}
          growth={`${stats?.today?.growth || 0}%`}
          average={`₱${stats?.today?.average_sale || 0}`}
          top={`Top: ${stats?.today?.top_product || "None"} (${stats?.today?.top_quantity || 0} units)`}
        />

        {/* WEEK SALES */}

        <StatsCard
          title="This Week's Sales"
          value={`₱${stats?.week?.sales?.toLocaleString() || 0}`}
          subtitle={`${stats?.week?.transactions || 0} Transactions`}
          growth={`${stats?.week?.growth || 0}%`}
          average={`₱${stats?.week?.average_sale || 0}`}
          top={`${stats?.week?.top_product || "None"} (${stats?.week?.top_quantity || 0} units)`}
        />

        {/* STOCK ALERTS */}

        <StockAlertCard alerts={stats?.stock_alerts || []} />
      </div>
    </div>
  );
}
