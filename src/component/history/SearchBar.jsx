import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="relative">
      <Search
        size={14}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2

          text-gray-400
          dark:text-slate-500
        "
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search transactions (product, amount, payment method)..."
        className="
          h-[48px]
          w-full

          rounded-[18px]

          border
          border-gray-200
          dark:border-[#1F2937]

          bg-white
          dark:bg-[#111827]

          pl-11
          pr-4

          text-[14px]

          text-[#0F172A]
          dark:text-white

          placeholder:text-gray-400
          dark:placeholder:text-slate-500

          outline-none

          transition-all
          duration-300

          focus:border-orange-400
          dark:focus:border-orange-500

          focus:ring-4
          focus:ring-orange-100
          dark:focus:ring-orange-500/10
        "
      />
    </div>
  );
}
