export default function TransactionFilters({
  filter,
  setFilter,

  range,
  setRange,
}) {
  const filters = ["All", "Sales", "Restocks", "Adjustments", "Cash", "GCash", "Paymaya"];

  const ranges = ["Today", "Week", "Month"];

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        flex-wrap
      "
    >
      {/* LEFT FILTERS */}

      <div
        className="
          flex
          gap-2
          overflow-x-auto
          scrollbar-hide
        "
      >
        {filters.map((item) => {
          const isActive = filter?.toLowerCase()?.trim() === item?.toLowerCase()?.trim();

          return (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`
                whitespace-nowrap

                rounded-[18px]

                px-4
                py-2.5

                text-[14px]
                font-semibold

                transition-all
                duration-200

                ${
                  isActive
                    ? `
                      bg-orange-500
                      text-white
                      shadow-sm
                    `
                    : `
                      border
                      border-gray-200

                      bg-white
                      text-gray-600

                      hover:bg-gray-50
                    `
                }
              `}
            >
              {item === "Paymaya" ? "PayMaya" : item}
            </button>
          );
        })}
      </div>

      {/* RIGHT RANGE FILTER */}

      <div
        className="
          flex
          items-center
          gap-1

          rounded-full

          border
          border-gray-200

          bg-white

          p-1
        "
      >
        {ranges.map((item) => {
          const active = range === item;

          return (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`
                rounded-full

                px-4
                py-2

                text-[13px]
                font-semibold

                transition-all
                duration-200

                ${
                  active
                    ? `
                      bg-orange-500
                      text-white
                    `
                    : `
                      text-gray-500
                      hover:bg-gray-100
                    `
                }
              `}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
