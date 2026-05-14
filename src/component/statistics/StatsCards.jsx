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
    },

    {
      title: "TOTAL ORDERS",

      value: stats.totalOrders || 0,

      icon: ShoppingCart,
    },

    {
      title: "AVERAGE ORDER VALUE",

      value: `₱${stats.averageOrderValue?.toLocaleString() || 0}`,

      icon: Wallet,
    },

    {
      title: "ACTIVE PRODUCTS",

      value: stats.activeProducts || 0,

      icon: Package,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="
              bg-white
              rounded-[22px]
              p-5
              border
              border-gray-100
              shadow-sm
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400">{card.title}</p>

                <h2 className="text-3xl font-black mt-4 text-[#0f172a]">{card.value}</h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#fff8f1] flex items-center justify-center">
                <Icon size={22} className="text-[#ff7a00]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
