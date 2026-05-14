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
    <div className="bg-white rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-3">
      {items.map((item, index) => (
        <div key={index} className="p-6 text-center border-b md:border-b-0 md:border-r last:border-r-0 border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900">{item.value}</h2>

          <p className="text-xs mt-2 font-semibold text-gray-400">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
