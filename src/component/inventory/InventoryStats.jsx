// src/component/inventory/InventoryStats.jsx

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
          rounded-3xl
          border
          border-gray-100
          bg-white
          p-5
          shadow-sm
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider
            text-gray-400
          "
        >
          Inventory
        </span>

        <p
          className="
            mt-5
            text-sm
            text-gray-500
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
          "
        >
          {totalProducts}
        </h1>

        <p
          className="
            mt-4
            text-sm
            text-gray-400
          "
        >
          Active Products
        </p>
      </div>

      {/* LOW STOCK */}

      <div
        className="
          rounded-3xl
          border
          border-gray-100
          bg-white
          p-5
          shadow-sm
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider
            text-gray-400
          "
        >
          Alerts
        </span>

        <p
          className="
            mt-5
            text-sm
            text-gray-500
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
            px-3
            py-1
            rounded-full
            bg-orange-100
            text-orange-600
            text-xs
            font-medium
          "
        >
          Needs attention
        </span>
      </div>

      {/* OUT OF STOCK */}

      <div
        className="
          rounded-3xl
          border
          border-gray-100
          bg-white
          p-5
          shadow-sm
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider
            text-gray-400
          "
        >
          Status
        </span>

        <p
          className="
            mt-5
            text-sm
            text-gray-500
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
            px-3
            py-1
            rounded-full
            bg-red-100
            text-red-600
            text-xs
            font-medium
          "
        >
          Critical
        </span>
      </div>

      {/* INVENTORY VALUE */}

      <div
        className="
          rounded-3xl
          border
          border-gray-100
          bg-white
          p-5
          shadow-sm
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider
            text-gray-400
          "
        >
          Financial
        </span>

        <p
          className="
            mt-5
            text-sm
            text-gray-500
          "
        >
          Total Inventory Value
        </p>

        <h1
          className="
            text-[34px]
            leading-none
            font-bold
            text-green-600
            mt-2
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
            <span className="text-gray-500">Cost Value</span>

            <span className="font-semibold">{formatPeso(totalCostValue)}</span>
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
            <span className="text-gray-500">Retail Value</span>

            <span className="font-semibold">
              {formatPeso(totalRetailValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
