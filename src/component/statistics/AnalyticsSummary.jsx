export default function AnalyticsSummary({ stats, salesData = [] }) {
  if (!stats) {
    return null;
  }

  // AVERAGE DAILY SALES

  const averageDailySales = salesData.length > 0 ? salesData.reduce((sum, item) => sum + item.sales, 0) / salesData.length : 0;

  // BEST DAY SALES

  const bestDaySales = salesData.length > 0 ? Math.max(...salesData.map((item) => item.sales)) : 0;

  const items = [
    {
      value: `₱${averageDailySales.toFixed(0)}`,
      label: "AVERAGE DAILY SALES",
    },

    {
      value: `₱${bestDaySales.toFixed(0)}`,
      label: "BEST DAY SALES",
    },

    {
      value: stats.activeProducts || 0,
      label: "ACTIVE PRODUCTS",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-1

        overflow-hidden

        rounded-[26px]

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        shadow-sm

        transition-all
        duration-300

        md:grid-cols-3
      "
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="
            border-b
            border-gray-100
            dark:border-[#1F2937]

            p-6
            text-center

            last:border-b-0

            md:border-b-0
            md:border-r

            md:last:border-r-0
          "
        >
          <h2
            className="
              text-3xl
              font-black

              text-[#0f172a]
              dark:text-white
            "
          >
            {item.value}
          </h2>

          <p
            className="
              mt-2

              text-xs
              font-semibold

              tracking-wide

              text-gray-400
              dark:text-slate-500
            "
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
