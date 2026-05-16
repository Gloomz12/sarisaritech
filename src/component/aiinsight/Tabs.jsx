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

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div
      className="
        rounded-3xl

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        p-3

        shadow-sm

        transition-all
        duration-300
      "
    >
      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
              rounded-2xl

              px-6
              py-3

              text-sm
              font-semibold

              transition-all
              duration-300

              ${
                activeTab === tab.value
                  ? `
                    bg-purple-600
                    text-white

                    shadow-lg
                    shadow-purple-500/20
                  `
                  : `
                    bg-gray-100
                    dark:bg-[#0F172A]

                    text-gray-600
                    dark:text-slate-300

                    hover:bg-gray-200
                    dark:hover:bg-[#1E293B]
                  `
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
}
