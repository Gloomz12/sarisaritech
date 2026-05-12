import { Pencil, Eye, Trash2 } from "lucide-react";

export default function ProductActionsDropdown({
  onEdit,
  onView,
  onRestock,
  onDelete,
}) {
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
        bg-white
        shadow-[0_12px_40px_rgba(15,23,42,0.12)]
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
          transition
          hover:bg-[#f8fafc]
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
          transition
          hover:bg-[#f8fafc]
        "
      >
        <Eye size={16} />
        View Details
      </button>

      {/* DIVIDER */}
      <div className="border-t border-[#eef2f7]" />

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
          transition
          hover:bg-red-50
        "
      >
        <Trash2 size={16} />
        Delete Product
      </button>
    </div>
  );
}
