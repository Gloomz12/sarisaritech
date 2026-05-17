export default function CategoryDistribution({ categories }) {
  // SORT HIGHEST TO LOWEST
  const sortedCategories = [...categories].sort((a, b) => b.percent - a.percent);

  return (
    <div
      className="
        rounded-[26px]

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        p-6

        shadow-sm

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

      <div className="mb-6">
        <h2
          className="
            text-lg
            font-black

            text-gray-900
            dark:text-white
          "
        >
          Sales by Category
        </h2>

        <p
          className="
            mt-1

            text-sm

            text-gray-500
            dark:text-slate-400
          "
        >
          Distribution of sales by product category
        </p>
      </div>

      {/* CONTENT */}

      <div className="space-y-5">
        {sortedCategories.map((item, index) => (
          <div key={index}>
            <div
              className="
                mb-2

                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  text-sm
                  font-medium

                  text-gray-700
                  dark:text-slate-300
                "
              >
                {item.name}
              </span>

              <span
                className="
                  text-sm
                  font-bold

                  text-gray-900
                  dark:text-white
                "
              >
                {item.percent}%
              </span>
            </div>

            {/* PROGRESS */}

            <div
              className="
                h-3
                w-full

                overflow-hidden

                rounded-full

                bg-gray-100
                dark:bg-[#0F172A]
              "
            >
              <div
                className="
                  h-full

                  rounded-full

                  bg-orange-500
                "
                style={{
                  width: `${item.percent}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
