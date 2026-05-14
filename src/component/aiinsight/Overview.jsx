const cards = [
  {
    title: "Forecast Growth",
    value: "+20%",
    subtitle: "vs last week",
    color: "bg-purple-500",
  },

  {
    title: "Fast Moving",
    value: "5",
    subtitle: "Trending products",
    color: "bg-green-500",
  },

  {
    title: "Associations",
    value: "12",
    subtitle: "Rules found",
    color: "bg-blue-500",
  },

  {
    title: "Stock Alerts",
    value: "3",
    subtitle: "Need restock",
    color: "bg-orange-500",
  },
];

export default function Overview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 rounded-2xl ${card.color}`} />

            <div>
              <p className="text-xs uppercase font-semibold text-gray-400">{card.title}</p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">{card.value}</h2>

              <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
