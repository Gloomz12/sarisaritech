import { Pencil, Eye, Trash2 } from "lucide-react";

export default function ProductActionsDropdown({ onEdit, onView, onRestock, onDelete }) {
  return (
    <div
      className="
        absolute
        right-0
        top-12

        z-50

        w-[220px]

        overflow-hidden

        rounded-2xl

        border
        border-[#eef2f7]
        dark:border-[#1F2937]

        bg-white

        dark:bg-gradient-to-b
        dark:from-[#111827]
        dark:to-[#0F172A]

        shadow-[0_12px_40px_rgba(15,23,42,0.12)]

        backdrop-blur-xl

        transition-all
        duration-300
      "
    >
      {/* EDIT */}

      <button
        onClick={onEdit}
        className="
          flex
          w-full

          items-center
          gap-3

          px-4
          py-3

          text-left

          text-[14px]
          font-medium

          text-[#0f172a]
          dark:text-white

          transition-all
          duration-200

          hover:bg-[#f8fafc]
          dark:hover:bg-white/5

          hover:text-orange-500
        "
      >
        <Pencil size={16} />
        Edit Product
      </button>

      {/* VIEW */}

      <button
        onClick={onView}
        className="
          flex
          w-full

          items-center
          gap-3

          px-4
          py-3

          text-left

          text-[14px]
          font-medium

          text-[#0f172a]
          dark:text-white

          transition-all
          duration-200

          hover:bg-[#f8fafc]
          dark:hover:bg-white/5

          hover:text-orange-500
        "
      >
        <Eye size={16} />
        View Details
      </button>

      {/* RESTOCK */}

      {onRestock && (
        <button
          onClick={onRestock}
          className="
            flex
            w-full

            items-center
            gap-3

            px-4
            py-3

            text-left

            text-[14px]
            font-medium

            text-[#0f172a]
            dark:text-white

            transition-all
            duration-200

            hover:bg-[#f8fafc]
            dark:hover:bg-white/5

            hover:text-orange-500
          "
        >
          ↻ Restock Product
        </button>
      )}

      {/* DIVIDER */}

      <div
        className="
          border-t
          border-[#eef2f7]
          dark:border-[#1F2937]
        "
      />

      {/* DELETE */}

      <button
        onClick={onDelete}
        className="
          flex
          w-full

          items-center
          gap-3

          px-4
          py-3

          text-left

          text-[14px]
          font-medium

          text-red-500

          transition-all
          duration-200

          hover:bg-red-50
          dark:hover:bg-red-500/10
        "
      >
        <Trash2 size={16} />
        Delete Product
      </button>
    </div>
  );
}
