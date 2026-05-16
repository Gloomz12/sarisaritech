import { useState } from "react";

import ForecastChart from "./ForecastChart";

import ForecastSummary from "./ForecastSummary";

const ranges = ["7 Days", "30 Days", "90 Days"];

export default function ForecastSection() {
  const [selectedRange, setSelectedRange] = useState("7 Days");

  return (
    <section
      id="forecast-section"
      className="
        rounded-3xl

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
      {/* HEADER */}

      <div
        className="
          mb-6

          flex
          items-center
          justify-between
          gap-4

          flex-wrap
        "
      >
        {/* TITLE */}

        <div>
          <h2
            className="
              text-2xl
              font-bold

              text-gray-900
              dark:text-white
            "
          >
            Forecast Analytics
          </h2>

          <p
            className="
              mt-1

              text-sm

              text-gray-500
              dark:text-slate-400
            "
          >
            Sales forecasting powered by Prophet AI
          </p>
        </div>

        {/* RANGE BUTTONS */}

        <div
          className="
            flex
            gap-2
          "
        >
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`
                rounded-xl

                px-4
                py-2

                text-sm
                font-semibold

                transition-all
                duration-300

                ${
                  selectedRange === range
                    ? `
                      bg-purple-600
                      text-white
                      shadow-lg
                      shadow-purple-500/20
                    `
                    : `
                      bg-gray-100
                      dark:bg-[#0F172A]

                      text-gray-700
                      dark:text-slate-300

                      hover:bg-gray-200
                      dark:hover:bg-[#1E293B]
                    `
                }
              `}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}

      <div
        className="
          grid
          grid-cols-1
          gap-6

          xl:grid-cols-4
        "
      >
        {/* CHART */}

        <div
          className="
            xl:col-span-3
          "
        >
          <ForecastChart selectedRange={selectedRange} />
        </div>

        {/* SUMMARY */}

        <ForecastSummary selectedRange={selectedRange} />
      </div>
    </section>
  );
}
