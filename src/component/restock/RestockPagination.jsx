import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RestockPagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="rounded-xl border border-slate-200 p-3 disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`h-10 w-10 rounded-xl text-sm font-semibold ${
            currentPage === index + 1 ? "bg-orange-500 text-white" : "border border-slate-200 bg-white"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="rounded-xl border border-slate-200 p-3 disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
