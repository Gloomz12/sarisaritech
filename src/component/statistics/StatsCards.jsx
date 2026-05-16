import { ShoppingBag, ShoppingCart, Wallet, Package } from "lucide-react";

export default function StatsCards({ stats }) {
  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: "TOTAL SALES",

      value: `₱${stats.totalSales?.toLocaleString() || 0}`,

      icon: ShoppingBag,

      iconBg: `
        bg-orange-100
        dark:bg-orange-500/10
      `,

      iconColor: `
        text-orange-500
      `,
    },

    {
      title: "TOTAL ORDERS",

      value: stats.totalOrders || 0,

      icon: ShoppingCart,

      iconBg: `
        bg-blue-100
        dark:bg-blue-500/10
      `,

      iconColor: `
        text-blue-500
      `,
    },

    {
      title: "AVERAGE ORDER VALUE",

      value: `₱${stats.averageOrderValue?.toLocaleString() || 0}`,

      icon: Wallet,

      iconBg: `
        bg-green-100
        dark:bg-green-500/10
      `,

      iconColor: `
        text-green-500
      `,
    },

    {
      title: "ACTIVE PRODUCTS",

      value: stats.activeProducts || 0,

      icon: Package,

      iconBg: `
        bg-purple-100
        dark:bg-purple-500/10
      `,

      iconColor: `
        text-purple-500
      `,
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4

        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="
              rounded-[24px]

              border
              border-gray-100
              dark:border-[#1F2937]

              bg-white
              dark:bg-[#111827]

              p-5

              shadow-sm

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              {/* LEFT */}

              <div>
                <p
                  className="
                    text-xs
                    font-bold

                    tracking-wide

                    text-gray-400
                    dark:text-slate-500
                  "
                >
                  {card.title}
                </p>

                <h2
                  className="
                    mt-4

                    text-3xl
                    font-black

                    text-[#0f172a]
                    dark:text-white
                  "
                >
                  {card.value}
                </h2>
              </div>

              {/* ICON */}

              <div
                className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  ${card.iconBg}
                `}
              >
                <Icon size={22} className={card.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
