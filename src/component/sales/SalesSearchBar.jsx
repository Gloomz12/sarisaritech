import { FiSearch, FiFilter, FiCheck } from "react-icons/fi";

import { useState } from "react";

export default function SalesSearchBar({
  search,
  setSearch,

  selectedFilter,
  setSelectedFilter,
}) {
  const [showFilter, setShowFilter] = useState(false);

  const filters = ["All Products", "Low Stock", "Out of Stock", "Favorites", "Best Sellers", "High Price"];

  return (
    <div
      className="
        flex
        gap-2
      "
    >
      {/* SEARCH */}

      <div
        className="
          flex-1
          h-11

          rounded-[18px]

          border
          border-gray-200
          dark:border-[#1F2937]

          bg-white
          dark:bg-[#111827]

          px-3

          flex
          items-center
          gap-2

          transition-all
          duration-300
        "
      >
        <FiSearch
          className="
            text-[17px]

            text-gray-400
            dark:text-gray-500
          "
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="
            Search for products...
          "
          className="
            flex-1

            bg-transparent

            outline-none

            text-[13px]
            font-medium

            text-[#0F172A]
            dark:text-white

            placeholder:text-gray-400
            dark:placeholder:text-gray-500
          "
        />
      </div>

      {/* FILTER */}

      <div className="relative">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="
            h-11
            px-4

            rounded-[18px]

            border
            border-gray-200
            dark:border-[#1F2937]

            bg-white
            dark:bg-[#111827]

            text-[#0F172A]
            dark:text-white

            flex
            items-center
            gap-2

            text-[13px]
            font-semibold

            transition-all
            duration-300

            hover:border-orange-300
            dark:hover:border-orange-500/40
          "
        >
          <FiFilter className="text-[15px]" />
          Filter
        </button>

        {/* DROPDOWN */}

        {showFilter && (
          <div
            className="
              absolute
              right-0
              top-[48px]

              w-[210px]

              bg-white
              dark:bg-[#111827]

              border
              border-gray-200
              dark:border-[#1F2937]

              rounded-[16px]

              shadow-xl

              p-2

              z-50
            "
          >
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSelectedFilter(item);

                  setShowFilter(false);
                }}
                className="
                  w-full

                  px-3
                  py-2

                  rounded-[10px]

                  flex
                  items-center
                  justify-between

                  text-left

                  text-[13px]
                  font-medium

                  text-[#0F172A]
                  dark:text-white

                  hover:bg-orange-50
                  dark:hover:bg-orange-500/10

                  hover:text-orange-500

                  transition-all
                "
              >
                {item}

                {selectedFilter === item && <FiCheck />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
