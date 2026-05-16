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

  {
    label: "Custom",
    value: "custom",
  },
];

export default function StatsFilters({
  range,
  setRange,

  startDate,
  setStartDate,

  endDate,
  setEndDate,

  appliedStartDate,
  appliedEndDate,

  onApply,

  darkMode,
}) {
  return (
    <div className="space-y-4">
      {/* FILTER BUTTONS */}

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setRange(item.value)}
            className={`
              rounded-xl
              border

              px-5
              py-2.5

              text-sm
              font-semibold

              transition-all
              duration-200

              ${
                range === item.value
                  ? `
                    border-[#ff7a00]
                    bg-[#ff7a00]
                    text-white
                    shadow-sm
                  `
                  : `
                    border-gray-100
                    dark:border-[#1F2937]

                    bg-white
                    dark:bg-[#111827]

                    text-gray-700
                    dark:text-slate-300

                    hover:border-orange-200
                    dark:hover:border-orange-400/30
                  `
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CUSTOM RANGE */}

      {range === "custom" && (
        <div
          className="
            flex
            flex-wrap
            items-end
            gap-4

            rounded-[24px]

            border
            border-orange-100
            dark:border-[#1F2937]

            bg-white
            dark:bg-[#111827]

            p-5

            shadow-sm

            transition-all
            duration-300
          "
        >
          {/* START DATE */}

          <div className="flex flex-col">
            <label
              className="
                mb-1.5

                text-xs
                font-medium

                text-gray-500
                dark:text-slate-400
              "
            >
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              className="
                rounded-xl

                border
                border-gray-200
                dark:border-[#1F2937]

                bg-white
                dark:bg-[#0F172A]

                px-4
                py-2.5

                text-sm

                text-[#0F172A]
                dark:text-white

                outline-none

                transition-all
                duration-200

                focus:border-orange-300
                focus:ring-2
                focus:ring-orange-200
                dark:focus:ring-orange-500/20
              "
            />
          </div>

          {/* END DATE */}

          <div className="flex flex-col">
            <label
              className="
                mb-1.5

                text-xs
                font-medium

                text-gray-500
                dark:text-slate-400
              "
            >
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              min={startDate}
              className="
                rounded-xl

                border
                border-gray-200
                dark:border-[#1F2937]

                bg-white
                dark:bg-[#0F172A]

                px-4
                py-2.5

                text-sm

                text-[#0F172A]
                dark:text-white

                outline-none

                transition-all
                duration-200

                focus:border-orange-300
                focus:ring-2
                focus:ring-orange-200
                dark:focus:ring-orange-500/20
              "
            />
          </div>

          {/* APPLY BUTTON */}

          <button
            onClick={onApply}
            disabled={!startDate || !endDate}
            className="
              rounded-xl

              bg-[#ff7a00]

              px-5
              py-2.5

              text-sm
              font-semibold
              text-white

              transition-all
              duration-200

              hover:bg-[#ea6f00]

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Apply
          </button>

          {/* APPLIED INFO */}

          {range === "custom" && appliedStartDate && appliedEndDate && (
            <div
              className="
                rounded-xl

                bg-orange-50
                dark:bg-orange-500/10

                px-4
                py-2.5

                text-xs
                font-medium

                text-orange-600
                dark:text-orange-300
              "
            >
              Showing analytics from <span className="font-bold">{new Date(appliedStartDate).toLocaleDateString()}</span> to{" "}
              <span className="font-bold">{new Date(appliedEndDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
