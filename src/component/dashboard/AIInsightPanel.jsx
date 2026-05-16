import { useEffect, useState } from "react";

import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

import { getForecast, getApriori, getRestockRecommendations } from "../../services/aiInsightService";

export default function AIInsightPanel({ navigateInsight }) {
  const [forecastData, setForecastData] = useState([]);

  const [forecastGrowth, setForecastGrowth] = useState("+0%");

  const [forecastMessage, setForecastMessage] = useState("Demand is expected to increase next week.");

  const [aprioriRules, setAprioriRules] = useState([]);

  const [restocks, setRestocks] = useState([]);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const [forecastResponse, aprioriResponse, restockResponse] = await Promise.all([
        getForecast(),
        getApriori(),
        getRestockRecommendations(),
      ]);

      /* FORECAST */

      const chartData =
        forecastResponse?.forecast?.map((item) => ({
          day: new Date(item.ds).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),

          sales: Math.round(item.yhat),
        })) || [];

      setForecastData(chartData);

      if (chartData.length >= 2) {
        const first = chartData[0]?.sales || 0;

        const last = chartData[chartData.length - 1]?.sales || 0;

        let growth = 0;

        if (first > 0) {
          growth = Math.round(((last - first) / first) * 100);
        }

        setForecastGrowth(`${growth > 0 ? "+" : ""}${growth}%`);

        if (growth >= 0) {
          setForecastMessage("Demand is expected to increase next week.");
        } else {
          setForecastMessage("Demand may slightly decrease next week.");
        }
      }

      /* APRIORI */

      const filteredRules = aprioriResponse?.filter((rule) => rule.products?.length && rule.recommendation?.length)?.slice(0, 3) || [];

      setAprioriRules(filteredRules);

      /* RESTOCK */

      const filteredRestocks = restockResponse?.filter((item) => Number(item.suggested_restock) > 0)?.slice(0, 3) || [];

      setRestocks(filteredRestocks);
    } catch (error) {
      console.error("AI PANEL ERROR:", error);
    }
  };

  return (
    <div
      className="
        rounded-[28px]
        overflow-hidden

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

      <div
        className="
          bg-gradient-to-r
          from-purple-600
          to-blue-500

          px-5
          py-4

          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg">✨</span>

            <h2
              className="
                text-white
                text-[20px]
                font-bold
              "
            >
              AI Store Consultant
            </h2>
          </div>

          <button
            onClick={() => navigateInsight("gemini")}
            className="
              bg-white/20
              hover:bg-white/30

              text-white
              text-xs
              font-medium

              px-3
              py-1

              rounded-full

              transition-all
            "
          >
            Preview
          </button>
        </div>

        <button
          onClick={() => navigateInsight("gemini")}
          className="
            text-white
            text-sm
            font-medium
          "
        >
          View All Insights →
        </button>
      </div>

      {/* BODY */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3

          divide-y
          divide-gray-100
          dark:divide-[#1F2937]

          xl:divide-y-0
          xl:divide-x

          bg-white
          dark:bg-gradient-to-b
          dark:from-[#111827]
          dark:to-[#0F172A]
        "
      >
        {/* FORECAST */}

        <div className="p-5">
          <div className="flex justify-between items-start">
            <h3
              className="
                text-[18px]
                leading-tight
                font-bold

                text-gray-800
                dark:text-white
              "
            >
              Demand Forecast
              <br />
              (Next 7 Days)
            </h3>

            <div
              className={`
                px-4
                py-2

                rounded-xl

                text-[18px]
                font-bold

                ${forecastGrowth.includes("-") ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}
              `}
            >
              {forecastGrowth}
            </div>
          </div>

          {/* GRAPH */}

          <div className="h-[150px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <XAxis
                  dataKey="day"
                  tick={{
                    fontSize: 11,
                    fill: "#9CA3AF",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #374151",
                    backgroundColor: "#111827",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* INFO */}

          <div
            className="
              mt-4

              bg-gray-50
              dark:bg-[#1F2937]

              rounded-xl

              px-4
              py-3

              text-gray-500
              dark:text-gray-300

              text-sm
            "
          >
            ℹ️ {forecastMessage}
          </div>

          <button
            onClick={() => navigateInsight("forecast")}
            className="
              mt-4

              text-blue-500
              text-sm
              font-semibold

              hover:text-blue-600
            "
          >
            View full forecast →
          </button>
        </div>

        {/* APRIORI */}

        <div className="p-5">
          <h3
            className="
              text-[18px]
              leading-tight
              font-bold

              text-gray-800
              dark:text-white
            "
          >
            Frequently Bought Together
            <br />
            (Apriori)
          </h3>

          <div className="space-y-5 mt-6">
            {aprioriRules.map((rule, index) => (
              <Association
                key={index}
                color="bg-purple-500"
                item1={rule.products?.[0]}
                item2={rule.recommendation?.[0]}
                confidence={`${Math.round(Number(rule.confidence || 0) * 100)}%`}
              />
            ))}
          </div>

          <button
            onClick={() => navigateInsight("apriori")}
            className="
              mt-6

              text-blue-500
              text-sm
              font-semibold

              hover:text-blue-600
            "
          >
            View all associations →
          </button>
        </div>

        {/* RESTOCK */}

        <div className="p-5">
          <h3
            className="
              text-[18px]
              font-bold

              text-gray-800
              dark:text-white
            "
          >
            Restock Recommendations
          </h3>

          <div className="space-y-5 mt-6">
            {restocks.map((item, index) => (
              <Recommendation
                key={index}
                level={item.priority || "Medium"}
                color={
                  item.priority === "High"
                    ? "bg-red-100 text-red-500"
                    : item.priority === "Medium"
                      ? "bg-orange-100 text-orange-500"
                      : "bg-green-100 text-green-500"
                }
                item={item.product_name}
                suggested={`+${item.suggested_restock} units`}
              />
            ))}
          </div>

          <button
            onClick={() => navigateInsight("restock")}
            className="
              mt-6

              text-blue-500
              text-sm
              font-semibold

              hover:text-blue-600
            "
          >
            View all recommendations →
          </button>
        </div>
      </div>
    </div>
  );
}

/* APRIORI */

function Association({ color, item1, item2, confidence }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div
          className={`
            w-3
            h-3
            rounded-full
            ${color}
          `}
        />

        <p
          className="
            font-medium
            text-[17px]

            text-gray-900
            dark:text-white
          "
        >
          {item1}
          {" + "}
          {item2}
        </p>
      </div>

      <div className="text-right">
        <p
          className="
            text-xs
            text-gray-400
          "
        >
          Confidence
        </p>

        <p
          className="
            font-bold
            text-blue-500
            text-[18px]
          "
        >
          {confidence}
        </p>
      </div>
    </div>
  );
}

/* RESTOCK */

function Recommendation({ level, color, item, suggested }) {
  return (
    <div className="flex justify-between">
      <div>
        <h4
          className="
            font-bold
            text-[17px]

            text-gray-900
            dark:text-white
          "
        >
          {item}
        </h4>

        <p
          className="
            text-gray-500
            dark:text-gray-400

            text-sm
            mt-1
          "
        >
          Suggested: <span className="text-green-500 font-semibold">{suggested}</span>
        </p>
      </div>

      <div
        className={`
          px-3
          py-1

          rounded-xl

          text-xs
          font-bold

          h-fit

          ${color}
        `}
      >
        {level}
      </div>
    </div>
  );
}
