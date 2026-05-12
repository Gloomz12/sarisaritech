import { useEffect, useRef, useState } from "react";

import { MoreVertical } from "lucide-react";

import ProductActionsDropdown from "./ProductActionsDropdown";

export default function InventoryTableRow({
  product,

  onEdit,
  onView,
  onDelete,
}) {
  const [openMenu, setOpenMenu] = useState(false);

  const dropdownRef = useRef(null);

  /* CLOSE OUTSIDE */

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* STATUS */

  const getStatus = () => {
    if (product.stock_quantity === 0) {
      return "Out of Stock";
    }

    if (product.stock_quantity <= product.min_stock_level) {
      return "Low Stock";
    }

    return "In Stock";
  };

  const status = getStatus();

  return (
    <tr
      className="
        border-b
        border-[#eef2f7]
        transition-all
        duration-200
        hover:bg-[#fcfcfd]
      "
    >
      {/* PRODUCT */}

      <td className="py-7 pl-6">
        <div>
          <p
            className="
              text-[16px]
              font-bold
              text-[#0f172a]
            "
          >
            {product.name}
          </p>

          <p
            className="
              mt-1
              text-[14px]
              font-medium
              text-[#64748b]
            "
          >
            {product.category}
          </p>
        </div>
      </td>

      {/* STOCK */}

      <td className="py-7">
        <p
          className={`
            text-[16px]
            font-semibold

            ${
              product.stock_quantity === 0
                ? "text-red-500"
                : product.stock_quantity <= product.min_stock_level
                  ? "text-orange-500"
                  : "text-[#0f172a]"
            }
          `}
        >
          {product.stock_quantity} {product.unit}
        </p>
      </td>

      {/* COST */}

      <td className="py-7">
        <p
          className="
            text-[16px]
            font-semibold
            text-[#0f172a]
          "
        >
          ₱{product.cost_price}
        </p>
      </td>

      {/* SELLING */}

      <td className="py-7">
        <p
          className="
            text-[16px]
            font-semibold
            text-[#0f172a]
          "
        >
          ₱{product.selling_price}
        </p>
      </td>

      {/* STATUS */}

      <td className="py-7">
        <div className="flex justify-center">
          <span
            className={`
              inline-flex
              h-[40px]
              min-w-[130px]
              items-center
              justify-center
              rounded-full
              px-4
              text-[13px]
              font-semibold

              ${
                status === "In Stock"
                  ? `
                    bg-green-100
                    text-green-700
                  `
                  : status === "Low Stock"
                    ? `
                    bg-orange-100
                    text-orange-600
                  `
                    : `
                    bg-red-100
                    text-red-500
                  `
              }
            `}
          >
            {status}
          </span>
        </div>
      </td>

      {/* ACTIONS */}

      <td
        className="
          relative
          overflow-visible
          py-7
        "
      >
        <div
          ref={dropdownRef}
          className="
            relative
            flex
            justify-center
          "
        >
          {/* BUTTON */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              setOpenMenu(!openMenu);
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-[#94a3b8]

              transition-all
              duration-200

              hover:bg-[#f8fafc]
              hover:text-[#0f172a]
            "
          >
            <MoreVertical size={18} />
          </button>

          {/* DROPDOWN */}

          {openMenu && (
            <ProductActionsDropdown
              onEdit={() => {
                setOpenMenu(false);

                onEdit(product);
              }}
              onView={() => {
                setOpenMenu(false);

                onView(product);
              }}
              onDelete={() => {
                setOpenMenu(false);

                onDelete(product);
              }}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
