// RestockPagination.jsx

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RestockPagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div
      className="
        flex
        items-center
        justify-end
        gap-2
      "
    >
      {/* PREV */}

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="
          flex
          h-11
          w-11

          items-center
          justify-center

          rounded-2xl

          border
          border-slate-200
          dark:border-[#1F2937]

          bg-white
          dark:bg-[#111827]

          text-slate-600
          dark:text-gray-300

          transition-all
          duration-200

          hover:border-orange-300
          dark:hover:border-orange-500/20

          hover:text-orange-500

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft size={18} />
      </button>

      {/* PAGES */}

      {Array.from({
        length: totalPages,
      }).map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`
            h-11
            w-11

            rounded-2xl

            text-sm
            font-semibold

            transition-all
            duration-200

            ${
              currentPage === index + 1
                ? `
                  bg-orange-500
                  text-white

                  shadow-lg
                  shadow-orange-500/20
                `
                : `
                  border
                  border-slate-200
                  dark:border-[#1F2937]

                  bg-white
                  dark:bg-[#111827]

                  text-slate-700
                  dark:text-white

                  hover:border-orange-300
                  dark:hover:border-orange-500/20

                  hover:text-orange-500
                `
            }
          `}
        >
          {index + 1}
        </button>
      ))}

      {/* NEXT */}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="
          flex
          h-11
          w-11

          items-center
          justify-center

          rounded-2xl

          border
          border-slate-200
          dark:border-[#1F2937]

          bg-white
          dark:bg-[#111827]

          text-slate-600
          dark:text-gray-300

          transition-all
          duration-200

          hover:border-orange-300
          dark:hover:border-orange-500/20

          hover:text-orange-500

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
