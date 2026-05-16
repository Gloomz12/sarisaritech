import { useEffect, useState } from "react";

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart } from "recharts";

import { getForecast } from "../../services/aiInsightService";

export default function ForecastChart({ selectedRange }) {
  const [forecastData, setForecastData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    growth: 0,
    revenue: 0,
    bestDay: "-",
  });

  const darkMode = document.documentElement.classList.contains("dark");

  useEffect(() => {
    loadForecast();
  }, [selectedRange]);

  const loadForecast = async () => {
    try {
      setLoading(true);

      const daysMap = {
        "7 Days": 7,
        "30 Days": 30,
        "90 Days": 90,
      };

      const response = await getForecast(daysMap[selectedRange]);

      console.log("FORECAST RESPONSE:", response);

      const forecast = response?.forecast || [];

      if (!forecast.length) {
        return;
      }

      const splitIndex = Math.floor(forecast.length / 2);

      const formatted = forecast.map((item, index) => ({
        day: new Date(item.ds).toLocaleDateString("en-US", {
          weekday: "short",
        }),

        actual: index <= splitIndex ? item.yhat : null,

        predicted: index >= splitIndex ? item.yhat : null,

        sales: item.yhat,
      }));

      setForecastData(formatted);

      /* TOTAL REVENUE */

      const totalRevenue = forecast.reduce(
        (sum, item) => sum + Number(item.yhat || 0),

        0
      );

      /* BEST DAY */

      const best = forecast.reduce((prev, current) => (prev.yhat > current.yhat ? prev : current));

      /* GROWTH */

      const first = forecast[0]?.yhat || 0;

      const last = forecast[forecast.length - 1]?.yhat || 0;

      let growthPercent = 0;

      if (first > 0) {
        growthPercent = Math.round(((last - first) / first) * 100);
      }

      setStats({
        growth: growthPercent,

        revenue: totalRevenue,

        bestDay: new Date(best.ds).toLocaleDateString("en-US", {
          weekday: "long",
        }),
      });
    } catch (error) {
      console.error("FORECAST ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  /* LOADING */

  if (loading) {
    return (
      <div
        className="
          animate-pulse

          rounded-3xl

          border
          border-gray-100
          dark:border-[#1F2937]

          bg-white
          dark:bg-[#111827]

          p-5

          shadow-sm
        "
      >
        <div
          className="
            mb-6

            grid
            grid-cols-1
            gap-4

            md:grid-cols-3
          "
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                h-24

                rounded-2xl

                bg-gray-100
                dark:bg-[#0F172A]
              "
            />
          ))}
        </div>

        <div
          className="
            h-[420px]

            rounded-2xl

            bg-gray-100
            dark:bg-[#0F172A]
          "
        />
      </div>
    );
  }

  return (
    <div
      className="
        rounded-3xl

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        p-5

        shadow-sm

        transition-all
        duration-300
      "
    >
      {/* TOP STATS */}

      <div
        className="
          mb-6

          grid
          grid-cols-1
          gap-4

          md:grid-cols-3
        "
      >
        {/* GROWTH */}

        <div
          className="
            rounded-2xl

            bg-purple-50
            dark:bg-purple-500/10

            p-4
          "
        >
          <p
            className="
              text-sm
              font-medium

              text-purple-600
              dark:text-purple-300
            "
          >
            Forecast Growth
          </p>

          <h2
            className="
              mt-2

              text-3xl
              font-bold

              text-purple-700
              dark:text-purple-200
            "
          >
            {stats.growth >= 0 ? "+" : ""}
            {stats.growth}%
          </h2>
        </div>

        {/* REVENUE */}

        <div
          className="
            rounded-2xl

            bg-green-50
            dark:bg-green-500/10

            p-4
          "
        >
          <p
            className="
              text-sm
              font-medium

              text-green-600
              dark:text-green-300
            "
          >
            Predicted Revenue
          </p>

          <h2
            className="
              mt-2

              text-3xl
              font-bold

              text-green-700
              dark:text-green-200
            "
          >
            ₱{Math.round(stats.revenue).toLocaleString()}
          </h2>
        </div>

        {/* BEST DAY */}

        <div
          className="
            rounded-2xl

            bg-orange-50
            dark:bg-orange-500/10

            p-4
          "
        >
          <p
            className="
              text-sm
              font-medium

              text-orange-600
              dark:text-orange-300
            "
          >
            Best Day
          </p>

          <h2
            className="
              mt-2

              text-3xl
              font-bold

              text-orange-700
              dark:text-orange-200
            "
          >
            {stats.bestDay}
          </h2>
        </div>
      </div>

      {/* CHART */}

      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={forecastData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            {/* GRID */}

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} />

            {/* X AXIS */}

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
              tick={{
                fontSize: 12,

                fill: darkMode ? "#94A3B8" : "#64748b",
              }}
            />

            {/* Y AXIS */}

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,

                fill: darkMode ? "#94A3B8" : "#64748b",
              }}
            />

            {/* TOOLTIP */}

            <Tooltip
              formatter={(value, name) => [`₱${Number(value).toLocaleString()}`, name]}
              cursor={{
                stroke: "#a855f7",
                strokeWidth: 2,
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",

                borderRadius: "18px",

                border: darkMode ? "1px solid #1F2937" : "1px solid #e5e7eb",

                color: darkMode ? "#ffffff" : "#0f172a",

                boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(15,23,42,0.08)",
              }}
              labelStyle={{
                color: darkMode ? "#cbd5e1" : "#64748b",

                fontWeight: 600,
              }}
              itemStyle={{
                color: "#a855f7",
                fontWeight: 700,
              }}
            />

            {/* LEGEND */}

            <Legend />

            {/* ACTUAL */}

            <Line type="monotone" dataKey="actual" name="Actual Sales" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={false} />

            {/* PREDICTED */}

            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted Sales"
              stroke="#C084FC"
              strokeWidth={3}
              strokeDasharray="8 8"
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
