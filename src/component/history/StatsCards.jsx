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
        "
        iconColor="
          text-green-600
        "
      />

      {/* INVENTORY */}

      <Card
        title="INVENTORY UPDATES"
        value={totalRestocks || 0}
        subtitle="
          Restocks + Adjustments
        "
        icon={<PackagePlus size={26} />}
        iconBg="
          bg-orange-100
        "
        iconColor="
          text-orange-500
        "
      />

      {/* SALES COUNT */}

      <Card
        title="
          COMPLETED SALES
        "
        value={totalTransactions || 0}
        subtitle="
          Successful Transactions
        "
        icon={<Receipt size={26} />}
        iconBg="
          bg-yellow-100
        "
        iconColor="
          text-yellow-600
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

        rounded-[22px]

        border
        border-[#edf2f7]

        bg-white

        px-3
        py-3

        shadow-sm
      "
    >
      {/* ICON */}

      <div
        className={`
          flex
          h-[52px]
          w-[52px]

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
            text-[14px]
            font-bold
            uppercase
            tracking-wide

            text-[#98a2b3]
          "
        >
          {title}
        </p>

        <h2
          className="
            mt-1

            text-[22px]
            font-black

            leading-none

            text-[#071437]
          "
        >
          {value}
        </h2>

        <p
          className="
            mt-2

            text-[14px]

            text-[#98a2b3]
          "
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
