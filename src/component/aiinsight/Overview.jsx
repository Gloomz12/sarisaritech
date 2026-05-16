import { useEffect, useState } from "react";

import { getForecast, getApriori, getRestockRecommendations } from "../../services/aiInsightService";

const defaultCards = [
  {
    title: "Forecast Growth",

    value: "+0%",

    subtitle: "vs last week",

    color: "from-purple-500 to-violet-500",
  },

  {
    title: "Fast Moving",

    value: "0",

    subtitle: "Trending products",

    color: "from-green-500 to-emerald-500",
  },

  {
    title: "Associations",

    value: "0",

    subtitle: "Rules found",

    color: "from-blue-500 to-cyan-500",
  },

  {
    title: "Stock Alerts",

    value: "0",

    subtitle: "Need restock",

    color: "from-orange-500 to-amber-500",
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

          color: "from-purple-500 to-violet-500",
        },

        {
          title: "Fast Moving",

          value: fastMoving,

          subtitle: "Trending products",

          color: "from-green-500 to-emerald-500",
        },

        {
          title: "Associations",

          value: associations,

          subtitle: "Rules found",

          color: "from-blue-500 to-cyan-500",
        },

        {
          title: "Stock Alerts",

          value: stockAlerts,

          subtitle: "Need restock",

          color: "from-orange-500 to-amber-500",
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
        gap-4

        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      {cards.map((card, index) => (
        <div
          key={index}
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

              hover:-translate-y-1
              hover:shadow-lg
            "
        >
          <div
            className="
                flex
                items-start
                gap-4
              "
          >
            {/* ICON */}

            <div
              className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-br

                  ${card.color}
                `}
            />

            {/* CONTENT */}

            <div>
              <p
                className="
                    text-xs
                    font-bold
                    uppercase

                    tracking-wide

                    text-gray-400
                    dark:text-slate-500
                  "
              >
                {card.title}
              </p>

              <h2
                className="
                    mt-2

                    text-3xl
                    font-black

                    text-gray-900
                    dark:text-white
                  "
              >
                {card.value}
              </h2>

              <p
                className="
                    mt-1

                    text-sm

                    text-gray-500
                    dark:text-slate-400
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
