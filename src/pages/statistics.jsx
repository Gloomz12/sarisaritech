import { useEffect, useState } from "react";

import api from "../services/api";

import StatsFilters from "../component/statistics/StatsFilters";
import StatsCards from "../component/statistics/StatsCards";
import SalesChart from "../component/statistics/SalesChart";
import AnalyticsSummary from "../component/statistics/AnalyticsSummary";
import CategoryDistribution from "../component/statistics/CategoryDistribution";
import TopProducts from "../component/statistics/TopProducts";

export default function Statistics() {
  const [range, setRange] = useState("7days");

  const [stats, setStats] = useState(null);

  const [salesData, setSalesData] = useState([]);

  const [categories, setCategories] = useState([]);

  const [topProducts, setTopProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [overviewRes, trendRes, categoryRes, productsRes] = await Promise.all([
        api.get(`/analytics/overview?range=${range}`),

        api.get(`/analytics/sales-trend?range=${range}`),

        api.get(`/analytics/categories?range=${range}`),

        api.get(`/analytics/top-products?range=${range}`),
      ]);

      setStats(overviewRes.data);

      setSalesData(trendRes.data);

      setCategories(categoryRes.data);

      setTopProducts(productsRes.data);
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5">
        <div className="animate-pulse space-y-5">
          <div className="h-32 rounded-[24px] bg-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 rounded-[20px] bg-gray-200" />
            ))}
          </div>

          <div className="h-[220px] rounded-[24px] bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-0.5 pb-10 space-y-5 bg-[#f5f6fa] min-h-screen">
      {/* HEADER */}

      <div className="bg-[#fff8f1] border border-orange-100 rounded-[24px] p-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a]">Statistics</h1>

          <p className="text-gray-600 mt-1 text-sm">Track sales performance and store growth.</p>
        </div>

        <div className="w-16 h-16 rounded-[20px] bg-white border border-orange-100 flex items-center justify-center shadow-sm">
          <div className="w-11 h-11 rounded-[14px] bg-[#fff8f1] flex items-center justify-center text-2xl">📊</div>
        </div>
      </div>

      {/* FILTERS */}

      <StatsFilters range={range} setRange={setRange} />

      {/* STATS */}

      <StatsCards stats={stats} />

      {/* CHART */}

      <SalesChart salesData={salesData} />

      {/* SUMMARY */}

      <AnalyticsSummary stats={stats} salesData={salesData} />

      {/* BOTTOM GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <CategoryDistribution categories={categories} />

        <TopProducts products={topProducts} />
      </div>
    </div>
  );
}
