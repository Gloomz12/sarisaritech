import { ShoppingCart, PackagePlus, Receipt } from "lucide-react";

export default function StatsCards({ totalSales, totalTransactions, totalRestocks }) {
  return (
    <div
      className="
        grid
        gap-3

        md:grid-cols-3
      "
    >
      {/* SALES REVENUE */}

      <Card
        title="DAY SALES"
        value={`₱${Number(totalSales || 0).toFixed(2)}`}
        subtitle="Revenue Generated"
        icon={<ShoppingCart size={22} />}
        iconBg="
          bg-green-100
          dark:bg-green-500/10
        "
        iconColor="
          text-green-600
          dark:text-green-400
        "
      />

      {/* INVENTORY */}

      <Card
        title="INVENTORY UPDATES"
        value={totalRestocks || 0}
        subtitle="Restocks + Adjustments"
        icon={<PackagePlus size={26} />}
        iconBg="
          bg-orange-100
          dark:bg-orange-500/10
        "
        iconColor="
          text-orange-500
          dark:text-orange-400
        "
      />

      {/* SALES COUNT */}

      <Card
        title="COMPLETED SALES"
        value={totalTransactions || 0}
        subtitle="Successful Transactions"
        icon={<Receipt size={26} />}
        iconBg="
          bg-yellow-100
          dark:bg-yellow-500/10
        "
        iconColor="
          text-yellow-600
          dark:text-yellow-400
        "
      />
    </div>
  );
}

// CARD COMPONENT

function Card({ title, value, subtitle, icon, iconBg, iconColor }) {
  return (
    <div
      className="
        flex
        items-center
        gap-4

        rounded-[24px]

        border
        border-[#edf2f7]
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        px-4
        py-4

        shadow-sm

        transition-all
        duration-300
      "
    >
      {/* ICON */}

      <div
        className={`
          flex
          h-[56px]
          w-[56px]

          items-center
          justify-center

          rounded-[18px]

          ${iconBg}
          ${iconColor}
        `}
      >
        {icon}
      </div>

      {/* CONTENT */}

      <div>
        <p
          className="
            text-[13px]
            font-bold
            uppercase
            tracking-wide

            text-[#98a2b3]
            dark:text-slate-500
          "
        >
          {title}
        </p>

        <h2
          className="
            mt-1

            text-[24px]
            font-black

            leading-none

            text-[#071437]
            dark:text-white
          "
        >
          {value}
        </h2>

        <p
          className="
            mt-2

            text-[14px]

            text-[#98a2b3]
            dark:text-slate-400
          "
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
