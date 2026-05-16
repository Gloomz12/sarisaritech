import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SalesChart({ salesData = [], range, darkMode }) {
  /* ====================================
   * TREND LABEL
   * ==================================== */

  const trendLabel =
    range === "1year"
      ? "Monthly total sales over the selected period"
      : range === "3months"
        ? "Weekly total sales over the selected period"
        : "Daily total sales over the selected period";

  /* ====================================
   * FORMAT DATA
   * ==================================== */

  const formattedData = salesData.map((item) => {
    // YEARLY

    if (range === "1year") {
      return {
        ...item,

        date: item.date,
      };
    }

    const parsedDate = item.date ? new Date(item.date) : null;

    // INVALID DATE

    if (!parsedDate || isNaN(parsedDate)) {
      return {
        ...item,

        date: "",
      };
    }

    // 3 MONTHS = WEEKLY

    if (range === "3months") {
      return {
        ...item,

        date: parsedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    }

    // 7 DAYS

    if (range === "7days") {
      return {
        ...item,

        date: parsedDate.toLocaleDateString("en-US", {
          weekday: "short",
        }),
      };
    }

    // DEFAULT DAILY

    return {
      ...item,

      date: parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });

  /* ====================================
   * BAR SIZE
   * ==================================== */

  const maxBarSize = range === "1year" ? 48 : range === "3months" ? 42 : 60;

  /* ====================================
   * BAR GAP
   * ==================================== */

  const barGap = range === "1year" ? "18%" : range === "3months" ? "12%" : "8%";

  return (
    <div
      className="
        rounded-[24px]

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
      {/* HEADER */}

      <div className="mb-5">
        <h2
          className="
            text-2xl
            font-black

            text-[#0f172a]
            dark:text-white
          "
        >
          Growth Trend
        </h2>

        <p
          className="
            mt-1
            text-sm

            text-gray-500
            dark:text-slate-400
          "
        >
          {trendLabel}
        </p>
      </div>

      {/* CHART */}

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            barCategoryGap={barGap}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            {/* GRID */}

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#f3f4f6"} />

            {/* X AXIS */}

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={range === "1year" ? 10 : 20}
              interval="preserveStartEnd"
              tick={{
                fontSize: 12,

                fill: darkMode ? "#94a3b8" : "#6b7280",
              }}
            />

            {/* Y AXIS */}

            <YAxis
              width={70}
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,

                fill: darkMode ? "#94a3b8" : "#6b7280",
              }}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `₱${(value / 1000000).toFixed(1)}M`;
                }

                if (value >= 1000) {
                  return `₱${(value / 1000).toFixed(0)}k`;
                }

                return `₱${value}`;
              }}
            />

            {/* TOOLTIP */}

            <Tooltip
              cursor={{
                fill: darkMode ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.08)",
              }}
              contentStyle={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",

                borderRadius: "14px",

                border: darkMode ? "1px solid #1e293b" : "1px solid #f3f4f6",

                boxShadow: darkMode ? "0 8px 24px rgba(0,0,0,0.35)" : "0 4px 12px rgba(0,0,0,0.06)",

                color: darkMode ? "#ffffff" : "#0f172a",
              }}
              labelStyle={{
                color: darkMode ? "#cbd5e1" : "#64748b",

                fontWeight: 600,
              }}
              itemStyle={{
                color: "#f97316",
                fontWeight: 700,
              }}
              formatter={(value) => [`₱${Number(value).toLocaleString()}`, "Sales"]}
            />

            {/* BAR */}

            <Bar dataKey="sales" fill="#ff7a00" radius={[10, 10, 0, 0]} maxBarSize={maxBarSize} animationDuration={500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
