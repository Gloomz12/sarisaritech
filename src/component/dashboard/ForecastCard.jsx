import { useEffect, useState } from "react";

import { getForecast } from "../../services/aiInsightService";

export default function ForecastCard() {
  const [growth, setGrowth] = useState("+0%");

  const [message, setMessage] = useState("Loading forecast...");

  const [projectedSales, setProjectedSales] = useState(0);

  const [isPositive, setIsPositive] = useState(true);

  const [loading, setLoading] = useState(true);

  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      setLoading(true);

      const response = await getForecast();

      const forecast = response?.forecast || [];

      // INVALID DATA

      if (!Array.isArray(forecast) || forecast.length < 2) {
        setHasData(false);

        setMessage("No forecast data available.");

        return;
      }

      setHasData(true);

      // FORECAST VALUES

      const values = forecast.map((item) => Number(item?.yhat || 0));

      // CURRENT WEEK AVG

      const midpoint = Math.floor(values.length / 2);

      const currentWeek = values.slice(0, midpoint);

      const nextWeek = values.slice(midpoint);

      const currentAvg = currentWeek.reduce((sum, value) => sum + value, 0) / currentWeek.length;

      const nextAvg = nextWeek.reduce((sum, value) => sum + value, 0) / nextWeek.length;

      // GROWTH %

      let growthPercent = 0;

      if (currentAvg > 0) {
        growthPercent = Math.round(((nextAvg - currentAvg) / currentAvg) * 100);
      }

      // TOTAL PROJECTED SALES

      const totalProjected = nextWeek.reduce((sum, value) => sum + value, 0);

      // STATES

      setProjectedSales(totalProjected);

      setGrowth(`${growthPercent > 0 ? "+" : ""}${growthPercent}%`);

      setIsPositive(growthPercent >= 0);

      // DYNAMIC MESSAGE

      if (growthPercent >= 15) {
        setMessage("Strong sales growth expected next week.");
      } else if (growthPercent >= 5) {
        setMessage("Demand is expected to increase next week.");
      } else if (growthPercent > -5) {
        setMessage("Demand is expected to remain stable.");
      } else {
        setMessage("Demand may slightly decrease next week.");
      }
    } catch (error) {
      console.error("FORECAST CARD ERROR:", error);

      setHasData(false);

      setMessage("Failed to load forecast.");
    } finally {
      setLoading(false);
    }
  };

  // LOADING

  if (loading) {
    return (
      <div
        className="
          rounded-[24px]

          border
          border-gray-100
          dark:border-[#1F2937]

          bg-white
          dark:bg-[#111827]

          p-6

          shadow-sm

          animate-pulse
        "
      >
        <div
          className="
            h-5
            w-40

            rounded-lg

            bg-gray-200
            dark:bg-slate-700
          "
        />

        <div
          className="
            mt-6

            h-10
            w-24

            rounded-lg

            bg-gray-200
            dark:bg-slate-700
          "
        />

        <div
          className="
            mt-4

            h-4
            w-full

            rounded-lg

            bg-gray-200
            dark:bg-slate-700
          "
        />
      </div>
    );
  }

  return (
    <div
      className="
        relative
        overflow-hidden

        rounded-[24px]

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        p-6

        shadow-sm

        transition-all
        duration-300
      "
    >
      {/* GLOW */}

      <div
        className={`
          absolute
          top-0
          right-0

          h-32
          w-32

          rounded-full

          blur-3xl

          ${
            isPositive
              ? `
                bg-green-400/10
              `
              : `
                bg-red-400/10
              `
          }
        `}
      />

      {/* HEADER */}

      <div
        className="
          relative
          z-10

          flex
          items-start
          justify-between
        "
      >
        <div>
          <h3
            className="
              text-lg
              font-black

              text-[#0F172A]
              dark:text-white
            "
          >
            AI Sales Forecast
          </h3>

          <p
            className="
              mt-1

              text-sm

              text-gray-500
              dark:text-slate-400
            "
          >
            Next 7 days projection
          </p>
        </div>

        {/* BADGE */}

        <div
          className={`
            rounded-2xl

            px-4
            py-2

            text-lg
            font-black

            ${
              isPositive
                ? `
                  bg-green-100
                  text-green-600

                  dark:bg-green-500/10
                  dark:text-green-400
                `
                : `
                  bg-red-100
                  text-red-600

                  dark:bg-red-500/10
                  dark:text-red-400
                `
            }
          `}
        >
          {growth}
        </div>
      </div>

      {/* PROJECTED SALES */}

      {hasData && (
        <div className="relative z-10 mt-8">
          <p
            className="
              text-sm

              text-gray-500
              dark:text-slate-400
            "
          >
            Projected Sales
          </p>

          <h2
            className="
              mt-2

              text-4xl
              font-black

              tracking-[-1px]

              text-[#0F172A]
              dark:text-white
            "
          >
            ₱{Math.round(projectedSales).toLocaleString()}
          </h2>
        </div>
      )}

      {/* MESSAGE */}

      {hasData && (
        <div
          className="
            relative
            z-10

            mt-6

            rounded-2xl

            bg-[#f8fafc]
            dark:bg-[#0F172A]

            px-4
            py-4
          "
        >
          <p
            className="
              text-sm
              font-medium

              leading-relaxed

              text-gray-600
              dark:text-slate-300
            "
          >
            {message}
          </p>
        </div>
      )}

      {/* EMPTY STATE */}

      {!hasData && !loading && (
        <div
          className="
            relative
            z-10

            mt-10

            rounded-2xl

            border
            border-dashed
            border-slate-700

            px-4
            py-10

            text-center
            text-sm

            text-slate-400
          "
        >
          No forecast data available yet.
        </div>
      )}
    </div>
  );
}
