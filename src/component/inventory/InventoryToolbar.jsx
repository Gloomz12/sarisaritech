// src/component/inventory/InventoryToolbar.jsx

import { useEffect, useState } from "react";

import {
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Tags,
} from "lucide-react";

export default function InventoryToolbar({
  showAddModal,
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) {
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    if (showAddModal) {
      setOpenFilter(false);
    }
  }, [showAddModal]);
  const [tempCategories, setTempCategories] = useState(
    Array.isArray(selectedCategory) ? selectedCategory : ["All"]
  );
  const [tempSortBy, setTempSortBy] = useState(sortBy);

  useEffect(() => {
    setTempCategories(
      Array.isArray(selectedCategory) ? selectedCategory : ["All"]
    );
  }, [selectedCategory]);

  useEffect(() => {
    setTempSortBy(sortBy);
  }, [sortBy]);

  return (
    <div>
      {/* SEARCH + FILTER */}

      <div className="flex flex-wrap items-center gap-4">
        {/* SEARCH */}

        <div
          className="
            flex
            h-[56px]
            flex-1
            items-center

            rounded-2xl
            border
            border-[#e2e8f0]

            bg-white

            px-5

            transition-all
            duration-200

            hover:border-orange-200
            focus-within:border-orange-300
            focus-within:ring-4
            focus-within:ring-orange-100
          "
        >
          <Search
            size={18}
            className="
              mr-3
              text-[#94a3b8]
            "
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full

              bg-transparent

              text-[15px]
              font-medium
              text-[#0f172a]

              outline-none

              placeholder:font-normal
              placeholder:text-[#94a3b8]
            "
          />
        </div>

        {/* FILTER BUTTON */}

        <div className="relative">
          <button
            onClick={() => setOpenFilter(!openFilter)}
            className={`
              flex
              h-[56px]
              items-center
              gap-3
              rounded-[20px]
              border
              bg-white
              px-6
              text-[14px]
              font-semibold
              shadow-sm
              transition-all
              duration-200

              ${
                openFilter
                  ? `
                    border-orange-300
                    bg-orange-50
                    text-orange-500
                  `
                  : `
                    border-[#e2e8f0]
                    text-[#0f172a]

                    hover:border-orange-200
                    hover:text-orange-500
                  `
              }
            `}
          >
            <Filter size={17} />
            Filter
            {Array.isArray(tempCategories) &&
            tempCategories.length > 0 &&
            !tempCategories.includes("All")
              ? ` (${tempCategories.length})`
              : ""}
            <ChevronDown
              size={15}
              className={`
                transition-transform
                duration-200

                ${openFilter ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* FILTER PANEL */}

          {openFilter && (
            <div
              className="
                  absolute
                  right-0
                  top-[105%]
                  z-[9999]
                  w-[320px]
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-[#eef2f7]
                  bg-white
                  p-6
                  shadow-[0_20px_60px_rgba(15,23,42,0.16)]
                "
            >
              {/* CATEGORIES */}

              <div>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Tags size={15} className="text-orange-500" />

                    <h3
                      className="
                        text-[14px]
                        font-semibold
                        text-[#0f172a]
                      "
                    >
                      Categories
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="
                          flex
                          cursor-pointer
                          items-center
                          gap-3
                        "
                    >
                      <input
                        type="checkbox"
                        checked={
                          Array.isArray(tempCategories) &&
                          tempCategories.includes(category)
                        }
                        onChange={() => {
                          if (category === "All") {
                            setTempCategories(["All"]);
                            return;
                          }
                          let updated = tempCategories.filter(
                            (item) => item !== "All"
                          );
                          if (updated.includes(category)) {
                            updated = updated.filter(
                              (item) => item !== category
                            );
                          } else {
                            updated.push(category);
                          }
                          if (updated.length === 0) {
                            updated = ["All"];
                          }
                          setTempCategories(updated);
                        }}
                        className="
                            h-4
                            w-4
                            text-orange-500
                            focus:ring-orange-500
                          "
                      />

                      <span
                        className="
                            text-[14px]
                            font-medium
                            text-[#334155]
                          "
                      >
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* DIVIDER */}

              <div
                className="
                  my-5
                  border-t
                  border-[#eef2f7]
                "
              />

              {/* SORT */}

              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <SlidersHorizontal size={15} className="text-orange-500" />

                  <h3
                    className="
                      text-[14px]
                      font-semibold
                      text-[#0f172a]
                    "
                  >
                    Sort By
                  </h3>
                </div>

                <select
                  value={tempSortBy}
                  onChange={(e) => setTempSortBy(e.target.value)}
                  className="
                    mt-4
                    h-[50px]
                    w-full

                    rounded-2xl
                    border
                    border-[#e2e8f0]

                    bg-white
                    px-4

                    text-[14px]
                    font-medium
                    text-[#0f172a]

                    outline-none

                    transition-all
                    duration-200

                    hover:border-orange-200
                    focus:border-orange-300
                  "
                >
                  <option value="default">Default</option>

                  <option value="lowest_stock">Lowest Stock</option>

                  <option value="highest_stock">Highest Stock</option>

                  <option value="name_asc">Product Name (A-Z)</option>

                  <option value="name_desc">Product Name (Z-A)</option>
                </select>
              </div>

              {/* BUTTONS */}

              <div className="mt-6 flex gap-3">
                {/* RESET */}

                <button
                  onClick={() => {
                    setSearch("");
                    setTempCategories(["All"]);
                    setTempSortBy("default");
                    setSelectedCategory(["All"]);
                    setSortBy("default");
                  }}
                  className="
                    flex-1

                    rounded-2xl
                    border
                    border-[#e2e8f0]

                    h-[46px]

                    text-[13px]
                    font-semibold
                    text-[#475569]

                    transition-all
                    duration-200

                    hover:bg-[#f8fafc]
                  "
                >
                  Reset
                </button>

                {/* APPLY */}

                <button
                  onClick={() => {
                    setSelectedCategory(
                      Array.isArray(tempCategories) ? tempCategories : ["All"]
                    );
                    setSortBy(tempSortBy);
                    setOpenFilter(false);
                  }}
                  className="
                    flex-1

                    rounded-2xl
                    bg-orange-500

                    h-[46px]

                    text-[13px]
                    font-semibold
                    text-white

                    transition-all
                    duration-200

                    hover:bg-orange-600
                  "
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
