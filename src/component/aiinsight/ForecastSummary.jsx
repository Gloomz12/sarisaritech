import { useEffect, useState } from "react";

import { getForecast } from "../../services/aiInsightService";

export default function ForecastSummary({ selectedRange }) {
  const [summary, setSummary] = useState({
    revenue: 0,

    average: 0,

    bestDay: "-",

    bestSales: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [selectedRange]);

  const loadSummary = async () => {
    try {
      setLoading(true);

      const daysMap = {
        "7 Days": 7,

        "30 Days": 30,

        "90 Days": 90,
      };

      const response = await getForecast(daysMap[selectedRange]);

      const forecast = response?.forecast || [];

      if (!forecast.length) {
        return;
      }

      // TOTAL REVENUE
      const revenue = forecast.reduce(
        (sum, item) => sum + Number(item.yhat || 0),

        0
      );

      // DAILY AVG
      const average = revenue / forecast.length;

      // BEST DAY
      const best = forecast.reduce((prev, current) => (prev.yhat > current.yhat ? prev : current));

      setSummary({
        revenue,

        average,

        bestDay: new Date(best.ds).toLocaleDateString("en-US", {
          weekday: "long",
        }),

        bestSales: best.yhat,
      });
    } catch (error) {
      console.error("SUMMARY ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-2xl p-5 animate-pulse">
        <div className="h-6 w-40 rounded-xl bg-gray-200" />

        <div className="h-16 rounded-2xl bg-gray-200 mt-6" />

        <div className="space-y-4 mt-6">
          <div className="h-10 rounded-xl bg-gray-200" />

          <div className="h-10 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="
      bg-gradient-to-br
      from-purple-600
      to-violet-500
      rounded-2xl
      p-5
      text-white
      shadow-lg
      flex flex-col
      justify-between
      min-h-full
    "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Forecast Summary</h3>

          <p className="text-purple-100 text-sm mt-1">Next Prediction Overview</p>
        </div>

        <div
          className="
          h-12
          w-12
          rounded-2xl
          bg-white/20
          flex
          items-center
          justify-center
          text-xl
        "
        >
          📈
        </div>
      </div>

      {/* REVENUE */}
      <div className="mt-6">
        <p className="text-sm text-purple-100">Predicted Revenue</p>

        <h2 className="text-4xl font-black mt-2 break-words">₱{Math.round(summary.revenue).toLocaleString()}</h2>
      </div>

      {/* STATS */}
      <div className="mt-auto pt-8 space-y-4">
        {/* AVG */}
        <div
          className="
          bg-white/10
          rounded-2xl
          p-5
          flex
          items-center
          justify-between
        "
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-purple-100">Daily Average</p>

            <h3 className="text-2xl font-bold mt-1">₱{Math.round(summary.average).toLocaleString()}</h3>
          </div>

          <div className="text-3xl">💰</div>
        </div>

        {/* BEST DAY */}
        <div className="bg-white/10 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-purple-100">Best Day</p>

          <h3 className="text-2xl font-bold mt-1">{summary.bestDay}</h3>
        </div>

        {/* HIGHEST */}
        <div className="bg-white/10 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-purple-100">Highest Sales</p>

          <h3 className="text-2xl font-bold mt-1">₱{Math.round(summary.bestSales).toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
}
