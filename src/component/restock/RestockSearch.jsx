// RestockSearch.jsx

import { Search } from "lucide-react";

export default function RestockSearch({
  search,
  setSearch,

  filter,
  setFilter,

  criticalCount,
  lowCount,
  goodCount,
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3

        lg:flex-row
      "
    >
      {/* SEARCH */}

      <div
        className="
          relative
          flex-1
        "
      >
        <Search
          className="
            absolute
            left-4
            top-1/2

            -translate-y-1/2

            text-slate-400
            dark:text-gray-500
          "
          size={18}
        />

        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            h-14
            w-full

            rounded-[20px]

            border
            border-slate-200
            dark:border-[#1F2937]

            bg-white
            dark:bg-[#111827]

            pl-12
            pr-4

            text-[15px]

            text-slate-700
            dark:text-white

            outline-none

            transition-all

            placeholder:text-slate-400
            dark:placeholder:text-gray-500

            hover:border-orange-200
            dark:hover:border-orange-500/20

            focus:border-orange-300
            focus:ring-4
            focus:ring-orange-100
          "
        />
      </div>

      {/* FILTER */}

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="
          h-[54px]
          min-w-[170px]

          rounded-[18px]

          border
          border-slate-200
          dark:border-[#1F2937]

          bg-white
          dark:bg-[#111827]

          px-4

          text-[14px]
          font-semibold

          text-slate-700
          dark:text-white

          outline-none

          transition-all

          hover:border-orange-200
          dark:hover:border-orange-500/20

          focus:border-orange-300
          focus:ring-4
          focus:ring-orange-100
        "
      >
        <option value="All">⚪ All</option>

        <option value="Critical">🔴 Critical ({criticalCount})</option>

        <option value="Low">🟡 Low ({lowCount})</option>

        <option value="Good">🟢 Good ({goodCount})</option>
      </select>
    </div>
  );
}
