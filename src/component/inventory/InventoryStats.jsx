export default function InventoryStats({
  totalProducts = 0,
  lowStockCount = 0,
  outOfStockCount = 0,
  totalCostValue = 0,
  totalRetailValue = 0,
}) {
  /* FORMAT PESO */

  const formatPeso = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5

        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      {/* TOTAL PRODUCTS */}

      <div
        className="
          rounded-[24px]

          border
          border-gray-100
          dark:border-[#1F2937]

          bg-white

          dark:bg-gradient-to-b
          dark:from-[#111827]
          dark:to-[#0F172A]

          p-4

          shadow-sm

          transition-all
          duration-300
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider

            text-gray-400
            dark:text-gray-500
          "
        >
          Inventory
        </span>

        <p
          className="
            mt-3

            text-sm

            text-gray-500
            dark:text-gray-400
          "
        >
          Total Products
        </p>

        <h1
          className="
            mt-2

            text-4xl
            font-bold

            text-[#0f172a]
            dark:text-white
          "
        >
          {totalProducts}
        </h1>

        <p
          className="
            mt-4

            text-sm

            text-gray-400
            dark:text-gray-500
          "
        >
          Active Products
        </p>
      </div>

      {/* LOW STOCK */}

      <div
        className="
          rounded-[24px]

          border
          border-gray-100
          dark:border-[#1F2937]

          bg-white

          dark:bg-gradient-to-b
          dark:from-[#111827]
          dark:to-[#0F172A]

          p-4

          shadow-sm

          transition-all
          duration-300
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider

            text-gray-400
            dark:text-gray-500
          "
        >
          Alerts
        </span>

        <p
          className="
            mt-3

            text-sm

            text-gray-500
            dark:text-gray-400
          "
        >
          Low Stock
        </p>

        <h1
          className="
            mt-2

            text-4xl
            font-bold

            text-orange-500
          "
        >
          {lowStockCount}
        </h1>

        <span
          className="
            inline-flex

            mt-4

            rounded-full

            bg-orange-100
            dark:bg-orange-500/10

            px-3
            py-1

            text-xs
            font-medium

            text-orange-600
            dark:text-orange-400
          "
        >
          Needs attention
        </span>
      </div>

      {/* OUT OF STOCK */}

      <div
        className="
          rounded-[24px]

          border
          border-gray-100
          dark:border-[#1F2937]

          bg-white

          dark:bg-gradient-to-b
          dark:from-[#111827]
          dark:to-[#0F172A]

          p-4

          shadow-sm

          transition-all
          duration-300
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider

            text-gray-400
            dark:text-gray-500
          "
        >
          Status
        </span>

        <p
          className="
            mt-3

            text-sm

            text-gray-500
            dark:text-gray-400
          "
        >
          Out of Stock
        </p>

        <h1
          className="
            mt-2

            text-4xl
            font-bold

            text-red-500
          "
        >
          {outOfStockCount}
        </h1>

        <span
          className="
            inline-flex

            mt-4

            rounded-full

            bg-red-100
            dark:bg-red-500/10

            px-3
            py-1

            text-xs
            font-medium

            text-red-600
            dark:text-red-400
          "
        >
          Critical
        </span>
      </div>

      {/* INVENTORY VALUE */}

      <div
        className="
          rounded-[24px]

          border
          border-gray-100
          dark:border-[#1F2937]

          bg-white

          dark:bg-gradient-to-b
          dark:from-[#111827]
          dark:to-[#0F172A]

          p-4

          shadow-sm

          transition-all
          duration-300
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider

            text-gray-400
            dark:text-gray-500
          "
        >
          Financial
        </span>

        <p
          className="
            mt-3

            text-sm

            text-gray-500
            dark:text-gray-400
          "
        >
          Total Inventory Value
        </p>

        <h1
          className="
            mt-2

            text-[34px]
            leading-none

            font-bold

            text-green-600
          "
        >
          {formatPeso(totalRetailValue)}
        </h1>

        <div className="mt-5 space-y-2">
          {/* COST VALUE */}

          <div
            className="
              flex
              items-center
              justify-between

              text-sm
            "
          >
            <span
              className="
                text-gray-500
                dark:text-gray-400
              "
            >
              Cost Value
            </span>

            <span
              className="
                font-semibold

                text-[#0f172a]
                dark:text-white
              "
            >
              {formatPeso(totalCostValue)}
            </span>
          </div>

          {/* RETAIL VALUE */}

          <div
            className="
              flex
              items-center
              justify-between

              text-sm
            "
          >
            <span
              className="
                text-gray-500
                dark:text-gray-400
              "
            >
              Retail Value
            </span>

            <span
              className="
                font-semibold

                text-[#0f172a]
                dark:text-white
              "
            >
              {formatPeso(totalRetailValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
