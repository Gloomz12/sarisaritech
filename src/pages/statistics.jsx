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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  const [stats, setStats] = useState(null);

  const [salesData, setSalesData] = useState([]);

  const [categories, setCategories] = useState([]);

  const [topProducts, setTopProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  /* FETCH */

  useEffect(() => {
    // CUSTOM RANGE

    if (range === "custom") {
      if (startDate && endDate) {
        fetchAnalytics();
      }

      return;
    }

    // NORMAL RANGES

    fetchAnalytics();
  }, [range, startDate, endDate]);

  /* QUERY */

  const buildQuery = () => {
    if (range === "custom" && startDate && endDate) {
      return `range=custom&start_date=${startDate}&end_date=${endDate}`;
    }

    return `range=${range}`;
  };

  /* APPLY CUSTOM */

  const applyCustomRange = () => {
    if (!tempStartDate || !tempEndDate) return;

    setStartDate(tempStartDate);

    setEndDate(tempEndDate);

    setRange("custom");
  };

  /* FETCH ANALYTICS */

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const query = buildQuery();

      console.log("Analytics Query:", query);

      const [overviewRes, trendRes, categoryRes, productsRes] = await Promise.all([
        api.get(`/analytics/overview?${query}`),

        api.get(`/analytics/sales-trend?${query}`),

        api.get(`/analytics/categories?${query}`),

        api.get(`/analytics/top-products?${query}`),
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

  /* LOADING */

  if (loading) {
    return (
      <div
        className="
          min-h-screen

          bg-[#f5f6fa]
          dark:bg-[#020817]

          p-5
        "
      >
        <div className="animate-pulse space-y-5">
          <div
            className="
              h-32

              rounded-[28px]

              bg-gray-200
              dark:bg-[#111827]
            "
          />

          <div
            className="
              grid
              grid-cols-1
              gap-4

              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-28

                  rounded-[24px]

                  bg-gray-200
                  dark:bg-[#111827]
                "
              />
            ))}
          </div>

          <div
            className="
              h-[220px]

              rounded-[28px]

              bg-gray-200
              dark:bg-[#111827]
            "
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen

        space-y-5

        bg-[#f5f6fa]
        dark:bg-[#020817]

        p-0.5
        pb-10

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

      <div
        className="
          relative
          isolate
          overflow-hidden

          rounded-[30px]

          border
          border-orange-100
          dark:border-[#1F2937]

          bg-gradient-to-br
          from-[#fffaf3]
          to-[#fff7ed]

          dark:from-[#111827]
          dark:to-[#0F172A]

          p-6

          shadow-sm

          transition-all
          duration-300
        "
      >
        {/* GLOW */}

        <div
          className="
            absolute
            top-0
            right-0

            h-[180px]
            w-[180px]

            rounded-full

            bg-orange-100/20
            dark:bg-orange-500/10

            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10

            flex
            items-center
            justify-between
          "
        >
          {/* LEFT */}

          <div>
            <h1
              className="
                text-[42px]
                leading-[0.95]

                font-black

                tracking-[-2px]

                text-[#071437]
                dark:text-white
              "
            >
              Statistics
            </h1>

            <p
              className="
                mt-3

                text-[15px]

                text-gray-600
                dark:text-slate-400
              "
            >
              Track sales performance and store growth.
            </p>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center

              rounded-[24px]

              border
              border-orange-100
              dark:border-orange-500/20

              bg-white
              dark:bg-[#111827]

              shadow-sm
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-[18px]

                bg-[#fff7ed]
                dark:bg-[#0F172A]

                text-[28px]
              "
            >
              📊
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}

      <StatsFilters
        range={range}
        setRange={setRange}
        startDate={tempStartDate}
        setStartDate={setTempStartDate}
        endDate={tempEndDate}
        setEndDate={setTempEndDate}
        appliedStartDate={startDate}
        appliedEndDate={endDate}
        onApply={applyCustomRange}
      />

      {/* STATS */}

      <StatsCards stats={stats} />

      {/* CHART */}

      <SalesChart salesData={salesData} range={range} />

      {/* SUMMARY */}

      <AnalyticsSummary stats={stats} salesData={salesData} />

      {/* BOTTOM */}

      <div
        className="
          grid
          grid-cols-1
          gap-5

          xl:grid-cols-2
        "
      >
        <CategoryDistribution categories={categories} />

        <TopProducts products={topProducts} />
      </div>
    </div>
  );
}
