import { X } from "lucide-react";

export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-[2px]
      "
    >
      <div
        className="
          w-full
          max-w-[520px]
          rounded-[30px]
          bg-white
          p-8
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="
                text-[28px]
                font-bold
                text-[#0f172a]
              "
            >
              {product.name}
            </h2>

            <p
              className="
                mt-1
                text-[15px]
                text-[#64748b]
              "
            >
              {product.category}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[#f8fafc]
              text-[#64748b]
              transition
              hover:bg-red-50
              hover:text-red-500
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-8 space-y-5">
          <div className="flex justify-between">
            <span className="text-[#64748b]">Current Stock</span>

            <span className="font-semibold">{product.stock} units</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#64748b]">Cost Price</span>

            <span className="font-semibold">₱{product.cost}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#64748b]">Selling Price</span>

            <span className="font-semibold">₱{product.selling}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#64748b]">Status</span>

            <span className="font-semibold">{product.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
