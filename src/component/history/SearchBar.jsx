import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search transactions (product, amount, payment method)..."
        className="h-[48px] w-full rounded-[18px] border border-gray-200 bg-white pl-11 pr-4 text-[14px] outline-none transition focus:border-orange-400"
      />
    </div>
  );
}
