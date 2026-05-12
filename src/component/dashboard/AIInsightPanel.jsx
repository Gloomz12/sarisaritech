import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

const forecastData = [
  { day: "May 10", sales: 30 },
  { day: "May 11", sales: 38 },
  { day: "May 12", sales: 46 },
  { day: "May 13", sales: 49 },
  { day: "May 14", sales: 55 },
  { day: "May 15", sales: 63 },
];

export default function AIInsightPanel() {
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

          <div
            className="
              bg-white/20
              text-white
              text-xs

              px-3
              py-1

              rounded-full
            "
          >
            Preview
          </div>
        </div>

        <button
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
              className="
                bg-green-100
                text-green-600

                px-4
                py-2

                rounded-xl

                text-[18px]
                font-bold
              "
            >
              +20%
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

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
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
              dark:bg-[#1E293B]

              rounded-xl

              px-4
              py-3

              text-gray-500
              dark:text-gray-400

              text-sm
            "
          >
            ℹ️ Coke demand is predicted to increase next week.
          </div>

          <button
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
            <Association color="bg-red-500" item1="Coke" item2="Chips" confidence="82%" />

            <Association color="bg-yellow-500" item1="Coffee" item2="Sugar" confidence="78%" />

            <Association color="bg-orange-500" item1="Noodles" item2="Sardines" confidence="75%" />
          </div>

          <button
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
            <Recommendation
              level="High"
              color="bg-red-100 text-red-500"
              item="Coke"
              suggested="+30 units"
            />

            <Recommendation
              level="Medium"
              color="bg-orange-100 text-orange-500"
              item="Chips"
              suggested="+20 units"
            />

            <Recommendation
              level="Medium"
              color="bg-orange-100 text-orange-500"
              item="Noodles"
              suggested="+25 units"
            />
          </div>

          <button
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
            dark:text-gray-500
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
