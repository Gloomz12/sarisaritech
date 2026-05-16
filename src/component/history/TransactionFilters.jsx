import { CalendarDays } from "lucide-react";

export default function TransactionFilters({
  filter,
  setFilter,

  range,
  setRange,

  customRange,
  setCustomRange,
}) {
  const filters = ["All", "Sales", "Restocks", "Adjustments", "Cash", "GCash", "Paymaya"];

  const ranges = ["Today", "Week", "Month", "Custom"];

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
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
                      dark:border-[#1F2937]

                      bg-white
                      dark:bg-[#111827]

                      text-gray-600
                      dark:text-slate-300

                      hover:bg-gray-50
                      dark:hover:bg-[#1E293B]
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
          flex-wrap
          items-center
          gap-2
        "
      >
        {/* RANGE BUTTONS */}

        <div
          className="
            flex
            items-center
            gap-1

            rounded-full

            border
            border-gray-200
            dark:border-[#1F2937]

            bg-white
            dark:bg-[#111827]

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
                        dark:text-slate-400

                        hover:bg-gray-100
                        dark:hover:bg-[#1E293B]
                      `
                  }
                `}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* CUSTOM DATE RANGE */}

        {range === "Custom" && (
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2

              rounded-2xl

              border
              border-gray-200
              dark:border-[#1F2937]

              bg-white
              dark:bg-[#111827]

              px-3
              py-2
            "
          >
            {/* ICON */}

            <CalendarDays
              size={18}
              className="
                text-orange-500
              "
            />

            {/* START DATE */}

            <input
              type="date"
              value={customRange.start}
              onChange={(e) =>
                setCustomRange({
                  ...customRange,

                  start: e.target.value,
                })
              }
              className="
                rounded-xl

                border
                border-gray-200
                dark:border-[#1F2937]

                bg-white
                dark:bg-[#0F172A]

                px-2.5
                py-1.5

                text-sm

                text-gray-700
                dark:text-slate-200

                outline-none

                focus:border-orange-500
              "
            />

            {/* TO */}

            <span
              className="
                text-sm
                font-medium

                text-gray-400
              "
            >
              to
            </span>

            {/* END DATE */}

            <input
              type="date"
              value={customRange.end}
              onChange={(e) =>
                setCustomRange({
                  ...customRange,

                  end: e.target.value,
                })
              }
              className="
                rounded-xl

                border
                border-gray-200
                dark:border-[#1F2937]

                bg-white
                dark:bg-[#0F172A]

                px-2.5
                py-1.5

                text-sm

                text-gray-700
                dark:text-slate-200

                outline-none

                focus:border-orange-500
              "
            />
          </div>
        )}
      </div>
    </div>
  );
}
