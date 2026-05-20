import { useEffect, useState } from "react";

import { getRestockRecommendations } from "../../services/aiInsightService";

export default function RestockCard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadRestocks();
  }, []);

  const loadRestocks = async () => {
    try {
      const response = await getRestockRecommendations();

      console.log("RESTOCK CARD RESPONSE:", response);

      const filtered = response.filter((item) => Number(item.suggested_restock) > 0).slice(0, 3);

      setItems(filtered);
    } catch (error) {
      console.error("RESTOCK CARD ERROR:", error);
    }
  };

  return (
    <div
      className="
      bg-white
      text-black
      rounded-2xl
      p-6
      border
      border-gray-100
    "
    >
      <h3 className="font-bold text-xl">Restock Recommendations</h3>

      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="
            flex
            items-center
            justify-between
          "
          >
            <div>
              <p
                className="
                font-semibold
                text-lg
              "
              >
                {item.product_name}
              </p>

              <p
                className="
                text-green-500
                text-sm
                mt-1
                font-medium
              "
              >
                Suggested: +{item.suggested_restock} units
              </p>
            </div>

            <div
              className={`
              px-3
              py-1
              rounded-xl
              text-xs
              font-bold

              ${
                item.priority === "High"
                  ? "bg-red-100 text-red-500"
                  : item.priority === "Medium"
                    ? "bg-orange-100 text-orange-500"
                    : "bg-green-100 text-green-500"
              }
            `}
            >
              {item.priority}
            </div>
          </div>
        ))}

        {!items.length && <p className="text-sm text-gray-400">No restock recommendations.</p>}
      </div>
    </div>
  );
}
