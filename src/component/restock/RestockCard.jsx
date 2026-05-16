// RestockCard.jsx

import { Package2, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

import { getStockStatus } from "../../utils/stockStatus";

export default function RestockCard({ product, onRestock }) {
  const status = getStockStatus(product.stock, product.minLevel);

  const badgeStyles =
    status === "critical"
      ? `
        bg-red-100
        dark:bg-red-500/10

        text-red-500
        dark:text-red-400
      `
      : status === "low"
        ? `
          bg-yellow-100
          dark:bg-yellow-500/10

          text-yellow-700
          dark:text-yellow-400
        `
        : `
          bg-green-100
          dark:bg-green-500/10

          text-green-600
          dark:text-green-400
        `;

  return (
    <div
      className="
        relative
        overflow-hidden

        flex
        h-full
        flex-col

        rounded-[24px]

        border
        border-slate-200
        dark:border-[#1F2937]

        bg-white
        dark:bg-gradient-to-b
        dark:from-[#111827]
        dark:to-[#0F172A]

        p-4

        shadow-sm

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-lg
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
              h-11
              w-11
              shrink-0
              items-center
              justify-center

              rounded-2xl

              bg-slate-100
              dark:bg-[#1E293B]
            "
          >
            <Package2
              size={18}
              className="
                text-slate-500
                dark:text-gray-300
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
                dark:text-white
              "
            >
              {product.name}
            </h2>

            <p
              className="
                mt-0.5

                text-[13px]

                text-slate-500
                dark:text-gray-400
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
            className={`
              mt-1

              text-[16px]
              font-black

              ${
                status === "critical"
                  ? `
                    text-red-500
                  `
                  : status === "low"
                    ? `
                      text-yellow-500
                    `
                    : `
                      text-green-500
                    `
              }
            `}
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
              dark:text-white
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
              gap-1

              min-w-[82px]
              h-[28px]

              rounded-full

              px-2.5

              text-[9px]
              font-bold
              uppercase

              ${badgeStyles}
            `}
          >
            {status === "critical" && <ShieldAlert size={11} />}

            {status === "low" && <AlertTriangle size={11} />}

            {status === "good" && <CheckCircle2 size={11} />}

            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
