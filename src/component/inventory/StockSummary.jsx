import { Package, ShoppingCart, Wallet } from "lucide-react";

export default function StockSummary({ totalProducts, totalInventoryValue }) {
  return (
    <div
      className="
        rounded-[28px]
        border
        border-[#eef2f7]
        bg-white
        p-6
        shadow-[0_10px_35px_rgba(15,23,42,0.04)]
      "
    >
      {/* HEADER */}
      <div>
        <h2
          className="
            text-[20px]
            font-black
            tracking-[-0.5px]
            text-[#0f172a]
          "
        >
          Restock Summary
        </h2>

        <p
          className="
            mt-2
            text-[14px]
            text-[#94a3b8]
          "
        >
          This Month
        </p>
      </div>

      {/* SUMMARY LIST */}
      <div className="mt-6 space-y-3">
        {/* ITEM */}
        <SummaryItem
          icon={<Package size={20} className="text-orange-500" />}
          title="Total Products"
          subtitle="Need Restock"
          value={totalProducts}
        />

        {/* ITEM */}
        <SummaryItem
          icon={<ShoppingCart size={20} className="text-orange-500" />}
          title="Total Units"
          subtitle="Across all products"
          value="156"
        />

        {/* ITEM */}
        <SummaryItem
          icon={<Wallet size={20} className="text-orange-500" />}
          title="Est. Cost"
          subtitle="Estimated amount"
          value={`₱${totalInventoryValue}`}
        />
      </div>

      {/* BUTTON */}
      <button
        className="
          mt-5
          flex
          h-[54px]
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          border
          border-orange-200
          bg-white
          text-[16px]
          font-semibold
          text-orange-500
          transition-all
          duration-200
          hover:bg-orange-50
          active:scale-[0.99]
        "
      >
        View Restock List
        <span>→</span>
      </button>
    </div>
  );
}

/* REUSABLE */

function SummaryItem({ icon, title, subtitle, value }) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-[#f1f5f9]
        px-4
        py-4
        transition-all
        duration-200
        hover:border-orange-100
        hover:bg-orange-50/20
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* ICON */}
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#fff7ed]
          "
        >
          {icon}
        </div>

        {/* TEXT */}
        <div>
          <p
            className="
              text-[15px]
              font-bold
              leading-none
              text-[#0f172a]
            "
          >
            {title}
          </p>

          <p
            className="
              mt-1
              text-[13px]
              text-[#64748b]
            "
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* VALUE */}
      <div
        className="
          min-w-[90px]
          text-right
        "
      >
        <p
          className="
            text-[24px]
            font-black
            tracking-[-1px]
            text-[#0f172a]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}
