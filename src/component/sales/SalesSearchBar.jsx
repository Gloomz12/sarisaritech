// SalesSearchBar.jsx

import {
  FiSearch,
  FiFilter,
  FiCheck,
} from "react-icons/fi";

import { useState } from "react";

export default function SalesSearchBar({

  search,
  setSearch,

  selectedFilter,
  setSelectedFilter,

}) {

  const [showFilter, setShowFilter] =
    useState(false);

  const filters = [

    "All Products",

    "Low Stock",

    "Out of Stock",

    "Favorites",

    "Best Sellers",

    "High Price",

  ];

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

          bg-white

          px-3

          flex
          items-center
          gap-2
        "
      >

        <FiSearch
          className="
            text-[17px]
            text-gray-400
          "
        />

        <input
          type="text"

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          placeholder="
            Search for products...
          "

          className="
            flex-1

            bg-transparent

            outline-none

            text-[13px]
            font-medium

            placeholder:text-gray-400
          "
        />

      </div>

      {/* FILTER */}

      <div className="relative">

        <button

          onClick={() =>
            setShowFilter(
              !showFilter
            )
          }

          className="
            h-11
            px-4

            rounded-[18px]

            border
            border-gray-200

            bg-white

            flex
            items-center
            gap-2

            text-[13px]
            font-semibold

            transition-all
            duration-300

            hover:border-orange-300
          "
        >

          <FiFilter className="text-[15px]" />

          Filter

        </button>

        {/* DROPDOWN */}

        {

          showFilter && (

            <div
              className="
                absolute
                right-0
                top-[48px]

                w-[210px]

                bg-white

                border
                border-gray-200

                rounded-[16px]

                shadow-xl

                p-2

                z-50
              "
            >

              {

                filters.map((item) => (

                  <button

                    key={item}

                    onClick={() => {

                      setSelectedFilter(
                        item
                      );

                      setShowFilter(
                        false
                      );

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

                      hover:bg-orange-50
                      hover:text-orange-500

                      transition-all
                    "
                  >

                    {item}

                    {

                      selectedFilter ===
                        item && (

                        <FiCheck />

                      )

                    }

                  </button>

                ))

              }

            </div>

          )

        }

      </div>

    </div>

  );

}