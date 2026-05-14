// RestockCard.jsx

import { Package2 } from "lucide-react";

import { getStockStatus } from "../../utils/stockStatus";

export default function RestockCard({ product, onRestock }) {
  const status = getStockStatus(product.stock, product.minLevel);

  const badgeColor =
    status === "critical" ? "bg-red-100 text-red-500" : status === "low" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-600";

  return (
    <div
      className="
        relative
        overflow-hidden

        flex
        h-full
        flex-col

        rounded-[22px]

        border
        border-slate-200

        bg-white

        p-4

        shadow-sm

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-md
      "
    >
      {/* TOP ACCENT */}

      <div
        className={`
          absolute
          left-0
          top-0

          h-1
          w-full

          ${status === "critical" ? "bg-red-400" : status === "low" ? "bg-yellow-400" : "bg-green-400"}
        `}
      />

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          {/* ICON */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center

              rounded-2xl

              bg-slate-100
            "
          >
            <Package2
              size={16}
              className="
                text-slate-500
              "
            />
          </div>

          {/* INFO */}

          <div
            className="
              flex
              min-h-[58px]
              flex-col
            "
          >
            <h2
              className="
                max-w-[150px]

                text-[14px]
                leading-snug

                font-bold

                text-[#0F172A]
              "
            >
              {product.name}
            </h2>

            <p
              className="
                mt-0.5

                text-[13px]
                text-slate-500
              "
            >
              {product.category}
            </p>
          </div>
        </div>

        {/* BUTTON */}

        <button
          onClick={() => onRestock(product)}
          className="
            shrink-0

            rounded-xl

            bg-orange-500

            px-3.5
            py-2

            text-[12px]
            font-semibold
            text-white

            shadow-sm

            transition-all

            hover:bg-orange-600
          "
        >
          Restock
        </button>
      </div>

      {/* DETAILS */}

      <div
        className="
          mt-5

          grid
          grid-cols-3
          items-end

          gap-3
        "
      >
        {/* STOCK */}

        <div>
          <p
            className="
              text-[9px]
              uppercase
              tracking-wide

              text-slate-400
            "
          >
            Stock
          </p>

          <h3
            className="
              mt-1

              text-[16px]
              font-black

              text-[#0F172A]
            "
          >
            {product.stock}
          </h3>
        </div>

        {/* MIN LEVEL */}

        <div>
          <p
            className="
              text-[9px]
              uppercase
              tracking-wide

              text-slate-400
            "
          >
            Min Level
          </p>

          <h3
            className="
              mt-1

              text-[16px]
              font-black

              text-[#0F172A]
            "
          >
            {product.minLevel}
          </h3>
        </div>

        {/* STATUS */}

        <div
          className="
            flex
            justify-end
          "
        >
          <span
            className={`
              inline-flex
              items-center
              justify-center

              min-w-[74px]
              h-[26px]

              rounded-full

              px-2.5

              text-[9px]
              font-bold
              uppercase

              ${badgeColor}
            `}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
