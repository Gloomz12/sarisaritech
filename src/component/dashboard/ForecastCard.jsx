import { useEffect, useState } from "react";

import { getForecast } from "../../services/aiInsightService";

export default function ForecastCard() {
  const [growth, setGrowth] = useState("+0%");

  const [message, setMessage] = useState("Loading forecast...");

  const [isPositive, setIsPositive] = useState(true);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      const response = await getForecast();

      const forecast = response?.forecast || [];

      if (!Array.isArray(forecast) || forecast.length < 2) {
        return;
      }

      const first = Number(forecast[0]?.yhat || 0);

      const last = Number(forecast[forecast.length - 1]?.yhat || 0);

      let growthPercent = 0;

      if (first > 0) {
        growthPercent = Math.round(((last - first) / first) * 100);
      }

      setGrowth(`${growthPercent > 0 ? "+" : ""}${growthPercent}%`);

      setIsPositive(growthPercent >= 0);

      if (growthPercent >= 0) {
        setMessage("Demand is expected to increase next week.");
      } else {
        setMessage("Demand may slightly decrease next week.");
      }
    } catch (error) {
      console.error("FORECAST CARD ERROR:", error);
    }
  };

  return (
    <div
      className="
      bg-white
      text-black
      rounded-2xl
      p-6
      border
      border-gray-100
    "
    >
      <h3 className="font-bold text-xl">Demand Forecast</h3>

      <p
        className={`
          mt-4
          text-3xl
          font-bold

          ${isPositive ? "text-green-500" : "text-red-500"}
        `}
      >
        {growth}
      </p>

      <p className="mt-2 text-gray-500">{message}</p>
    </div>
  );
}
