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
        bg-white
        rounded-3xl
        border border-gray-100
        p-6
        shadow-sm
      "
    >
      {/* HEADER */}
      <div
        className="
        flex items-center
        justify-between
        mb-6
      "
      >
        {/* TITLE */}
        <div>
          <h2
            className="
            text-2xl
            font-bold
            text-gray-900
          "
          >
            Forecast Analytics
          </h2>

          <p
            className="
            text-sm
            text-gray-500
            mt-1
          "
          >
            Sales forecasting powered by Prophet AI
          </p>
        </div>

        {/* RANGE BUTTONS */}
        <div
          className="
          flex gap-2
        "
        >
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`
                px-4 py-2
                rounded-xl
                text-sm
                font-medium
                transition-all

                ${
                  selectedRange === range
                    ? `
                      bg-purple-600
                      text-white
                    `
                    : `
                      bg-gray-100
                      text-gray-700
                      hover:bg-gray-200
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
        grid grid-cols-1
        xl:grid-cols-4
        gap-6
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
