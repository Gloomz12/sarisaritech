const filters = [
  {
    label: "7 Days",
    value: "7days",
  },

  {
    label: "30 Days",
    value: "30days",
  },

  {
    label: "3 Months",
    value: "3months",
  },

  {
    label: "1 Year",
    value: "1year",
  },
];

export default function StatsFilters({ range, setRange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((item) => (
        <button
          key={item.value}
          onClick={() => setRange(item.value)}
          className={`
            px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200

            ${
              range === item.value
                ? `
                  bg-[#ff7a00]
                  text-white
                  border-[#ff7a00]
                  shadow-sm
                `
                : `
                  bg-[#ffffffcc]
                  text-gray-700
                  border-gray-100
                  shadow-sm
                  hover:border-orange-200
                `
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
