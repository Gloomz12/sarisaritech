const tabs = [
  {
    name: "Forecast",
    value: "forecast",
  },

  {
    name: "Apriori",
    value: "apriori",
  },

  {
    name: "Restock",
    value: "restock",
  },

  {
    name: "AI Insights",
    value: "gemini",
  },
];

export default function Tabs({
  activeTab,

  setActiveTab,
}) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      border border-gray-100
      p-3
      flex flex-wrap
      gap-3
      shadow-sm
    "
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`
            px-6 py-3
            rounded-2xl
            text-sm
            font-semibold
            transition-all
            duration-200

            ${
              activeTab === tab.value
                ? `
                  bg-purple-100
                  text-purple-700
                  shadow-sm
                `
                : `
                  text-gray-500
                  hover:bg-gray-100
                `
            }
          `}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
