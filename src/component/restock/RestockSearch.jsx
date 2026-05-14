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
    <div className="flex gap-3">
      {/* SEARCH */}

      <div className="relative flex-1">
        <Search
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
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
            bg-white

            pl-12
            pr-4

            text-[15px]
            text-slate-700

            outline-none

            transition-all
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
    min-w-[150px]

    rounded-[18px]

    border
    border-slate-200

    bg-white

    px-4

    text-[14px]
    font-semibold
    text-slate-700

    outline-none

    transition-all

    hover:border-orange-200

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
