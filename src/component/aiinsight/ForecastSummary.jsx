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

      /* TOTAL REVENUE */

      const revenue = forecast.reduce((sum, item) => sum + Number(item.yhat || 0), 0);

      /* DAILY AVG */

      const average = revenue / forecast.length;

      /* BEST DAY */

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

          bg-gray-50
          dark:bg-[#0F172A]

          p-5
        "
      >
        <div
          className="
            h-6
            w-40

            rounded-xl

            bg-gray-200
            dark:bg-[#1E293B]
          "
        />

        <div
          className="
            mt-6

            h-16

            rounded-2xl

            bg-gray-200
            dark:bg-[#1E293B]
          "
        />

        <div
          className="
            mt-6

            space-y-4
          "
        >
          <div
            className="
              h-10

              rounded-xl

              bg-gray-200
              dark:bg-[#1E293B]
            "
          />

          <div
            className="
              h-10

              rounded-xl

              bg-gray-200
              dark:bg-[#1E293B]
            "
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        flex
        min-h-full
        flex-col
        justify-between

        rounded-3xl

        bg-gradient-to-br
        from-[#5B21B6]
        via-[#6D28D9]
        to-[#4C1D95]

        p-5

        text-white

        border
        border-purple-500/20

        shadow-xl
        shadow-purple-900/20
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h3
            className="
              text-xl
              font-bold
            "
          >
            Forecast Summary
          </h3>

          <p
            className="
              mt-1

              text-sm

              text-purple-100
            "
          >
            Next Prediction Overview
          </p>
        </div>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center

            rounded-2xl

            bg-white/10

            text-xl
          "
        >
          📈
        </div>
      </div>

      {/* REVENUE */}

      <div className="mt-6">
        <p
          className="
            text-sm
            text-purple-100
          "
        >
          Predicted Revenue
        </p>

        <h2
          className="
            mt-2

            break-words

            text-4xl
            font-black
          "
        >
          ₱{Math.round(summary.revenue).toLocaleString()}
        </h2>
      </div>

      {/* STATS */}

      <div
        className="
          mt-auto
          space-y-4
          pt-8
        "
      >
        {/* AVG */}

        <div
          className="
            flex
            items-center
            justify-between

            rounded-2xl

            bg-white/5

            p-5

            backdrop-blur-sm
          "
        >
          <div>
            <p
              className="
                text-xs
                uppercase
                tracking-wide

                text-purple-100
              "
            >
              Daily Average
            </p>

            <h3
              className="
                mt-1

                text-2xl
                font-bold
              "
            >
              ₱{Math.round(summary.average).toLocaleString()}
            </h3>
          </div>

          <div className="text-3xl">💰</div>
        </div>

        {/* BEST DAY */}

        <div
          className="
            rounded-2xl

            bg-white/5

            p-5

            backdrop-blur-sm
          "
        >
          <p
            className="
              text-xs
              uppercase
              tracking-wide

              text-purple-100
            "
          >
            Best Day
          </p>

          <h3
            className="
              mt-1

              text-2xl
              font-bold
            "
          >
            {summary.bestDay}
          </h3>
        </div>

        {/* HIGHEST */}

        <div
          className="
            rounded-2xl

            bg-white/5

            p-5

            backdrop-blur-sm
          "
        >
          <p
            className="
              text-xs
              uppercase
              tracking-wide

              text-purple-100
            "
          >
            Highest Sales
          </p>

          <h3
            className="
              mt-1

              text-2xl
              font-bold
            "
          >
            ₱{Math.round(summary.bestSales).toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}
