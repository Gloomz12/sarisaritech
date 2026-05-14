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

      // TOTAL REVENUE
      const totalRevenue = forecast.reduce(
        (sum, item) => sum + Number(item.yhat || 0),

        0
      );

      // BEST DAY
      const best = forecast.reduce((prev, current) => (prev.yhat > current.yhat ? prev : current));

      // GROWTH
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

  if (loading) {
    return (
      <div
        className="
        bg-white
        rounded-3xl
        border border-gray-100
        p-5
        shadow-sm
        animate-pulse
      "
      >
        <div
          className="
          grid grid-cols-1 md:grid-cols-3
          gap-4 mb-6
        "
        >
          <div className="h-24 rounded-2xl bg-gray-100" />

          <div className="h-24 rounded-2xl bg-gray-100" />

          <div className="h-24 rounded-2xl bg-gray-100" />
        </div>

        <div className="h-[420px] rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div
      className="
      bg-white
      rounded-3xl
      border border-gray-100
      p-5
      shadow-sm
    "
    >
      {/* TOP STATS */}
      <div
        className="
        grid grid-cols-1 md:grid-cols-3
        gap-4 mb-6
      "
      >
        {/* GROWTH */}
        <div
          className="
          bg-purple-50
          rounded-2xl
          p-4
        "
        >
          <p
            className="
            text-sm
            text-purple-600
            font-medium
          "
          >
            Forecast Growth
          </p>

          <h2
            className="
            text-3xl
            font-bold
            text-purple-700
            mt-2
          "
          >
            {stats.growth >= 0 ? "+" : ""}
            {stats.growth}%
          </h2>
        </div>

        {/* REVENUE */}
        <div
          className="
          bg-green-50
          rounded-2xl
          p-4
        "
        >
          <p
            className="
            text-sm
            text-green-600
            font-medium
          "
          >
            Predicted Revenue
          </p>

          <h2
            className="
            text-3xl
            font-bold
            text-green-700
            mt-2
          "
          >
            ₱{Math.round(stats.revenue).toLocaleString()}
          </h2>
        </div>

        {/* BEST DAY */}
        <div
          className="
          bg-orange-50
          rounded-2xl
          p-4
        "
        >
          <p
            className="
            text-sm
            text-orange-600
            font-medium
          "
          >
            Best Day
          </p>

          <h2
            className="
            text-3xl
            font-bold
            text-orange-700
            mt-2
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

            {/* X AXIS */}
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
              tick={{
                fontSize: 12,
              }}
            />

            {/* Y AXIS */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
              }}
            />

            {/* TOOLTIP */}
            <Tooltip
              formatter={(value, name) => [`₱${Number(value).toLocaleString()}`, name]}
              contentStyle={{
                borderRadius: "18px",

                border: "none",

                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />

            {/* LEGEND */}
            <Legend />

            {/* ACTUAL */}
            <Line type="monotone" dataKey="actual" name="Actual Sales" stroke="#7c3aed" strokeWidth={3} dot={false} activeDot={false} />

            {/* PREDICTED */}
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted Sales"
              stroke="#c084fc"
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
