import QuickActions from "../component/dashboard/QuickActions";
import DashboardLayout from "../component/dashboard/DashboardLayout";
import AIInsightPanel from "../component/dashboard/AIInsightPanel";
import StatsCard from "../component/dashboard/StatsCard";
import StockAlertCard from "../component/dashboard/StockAlertCard";

export default function Dashboard() {

  return (

    <div className="space-y-4">

      {/* RECORD SALE */}

      <button
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
        "
      >

        <StatsCard
          title="Today's Sales"
          value="₱2,450.00"
          subtitle="28 Transactions"
          growth="+18.6%"
          top="Top: Coke (15 units)"
        />

        <StatsCard
          title="This Week's Sales"
          value="₱17,850.00"
          subtitle="210 Transactions"
          growth="+15.2%"
          top="Top: Noodles (80 units)"
        />

        <StockAlertCard />

      </div>

    </div>
  );
}