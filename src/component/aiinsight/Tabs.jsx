const tabs = ["Forecast", "Apriori", "Restock", "AI Insights"];

export default function Tabs() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-2 flex flex-wrap gap-2 shadow-sm">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`
            px-5 py-3 rounded-xl text-sm font-medium transition-all
            ${index === 0 ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
