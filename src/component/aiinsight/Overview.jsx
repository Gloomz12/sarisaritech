import { useEffect, useState } from "react";

import { getForecast, getApriori, getRestockRecommendations } from "../../services/aiInsightService";

const defaultCards = [
  {
    title: "Forecast Growth",
    value: "+0%",
    subtitle: "vs last week",
    color: "bg-purple-500",
  },

  {
    title: "Fast Moving",
    value: "0",
    subtitle: "Trending products",
    color: "bg-green-500",
  },

  {
    title: "Associations",
    value: "0",
    subtitle: "Rules found",
    color: "bg-blue-500",
  },

  {
    title: "Stock Alerts",
    value: "0",
    subtitle: "Need restock",
    color: "bg-orange-500",
  },
];

export default function Overview() {
  const [cards, setCards] = useState(defaultCards);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const [forecastData, aprioriData, restockData] = await Promise.all([getForecast(7), getApriori(), getRestockRecommendations()]);

      console.log("FORECAST:", forecastData);

      console.log("APRIORI:", aprioriData);

      console.log("RESTOCK:", restockData);

      /* FORECAST */

      const forecast = forecastData?.forecast || [];

      let growth = 0;

      if (forecast.length >= 2) {
        const first = forecast[0]?.yhat || 0;

        const last = forecast[forecast.length - 1]?.yhat || 0;

        if (first > 0) {
          growth = Math.round(((last - first) / first) * 100);
        }
      }

      /* FAST MOVING */

      const fastMoving = restockData.filter((item) => Number(item.predicted_demand || item.demand || 0) > 20).length;

      /* ASSOCIATIONS */

      const associations = aprioriData.length;

      /* STOCK ALERTS */

      const stockAlerts = restockData.filter((item) => item.priority === "High" || item.priority === "Medium").length;

      setCards([
        {
          title: "Forecast Growth",

          value: `${growth > 0 ? "+" : ""}${growth}%`,

          subtitle: "vs last week",

          color: "bg-purple-500",
        },

        {
          title: "Fast Moving",

          value: fastMoving,

          subtitle: "Trending products",

          color: "bg-green-500",
        },

        {
          title: "Associations",

          value: associations,

          subtitle: "Rules found",

          color: "bg-blue-500",
        },

        {
          title: "Stock Alerts",

          value: stockAlerts,

          subtitle: "Need restock",

          color: "bg-orange-500",
        },
      ]);
    } catch (error) {
      console.error("OVERVIEW ERROR:", error);
    }
  };

  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-4
    "
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            p-5
            shadow-sm
          "
        >
          <div
            className="
              flex
              items-start
              gap-4
            "
          >
            <div
              className={`
                h-12
                w-12
                rounded-2xl
                ${card.color}
              `}
            />

            <div>
              <p
                className="
                  text-xs
                  uppercase
                  font-semibold
                  text-gray-400
                "
              >
                {card.title}
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  text-gray-900
                  mt-2
                "
              >
                {card.value}
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                {card.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
