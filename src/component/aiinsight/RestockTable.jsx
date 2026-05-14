import { useEffect, useState } from "react";

import { getRestockRecommendations } from "../../services/aiInsightService";

export default function RestockTable() {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestock();
  }, []);

  const loadRestock = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await getRestockRecommendations();

      console.log("RESTOCK RESPONSE:", response);

      setItems([]);

      setTimeout(() => {
        setItems(response);
      }, 100);
    } catch (error) {
      console.error("RESTOCK ERROR:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div
          className="
          h-28
          rounded-3xl
          bg-gray-100
          animate-pulse
        "
        />

        <div
          className="
          h-28
          rounded-3xl
          bg-gray-100
          animate-pulse
        "
        />

        <div
          className="
          h-28
          rounded-3xl
          bg-gray-100
          animate-pulse
        "
        />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div
        className="
        bg-gray-50
        rounded-3xl
        p-10
        text-center
      "
      >
        <h2
          className="
          text-lg
          font-semibold
          text-gray-700
        "
        >
          No restock recommendations
        </h2>

        <p
          className="
          text-sm
          text-gray-400
          mt-2
        "
        >
          Inventory levels are currently stable.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* REFRESH BUTTON */}
      <div className="flex justify-end -mt-16 mb-5">
        <button
          onClick={loadRestock}
          disabled={loading}
          className="
          px-6
          py-3
          rounded-2xl
          bg-gray-100
          hover:bg-gray-200
          disabled:opacity-50
          text-sm
          font-medium
          transition-all
        "
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="
            bg-white
            border
            border-gray-100
            rounded-3xl
            p-5
            hover:shadow-lg
            transition-all
          "
          >
            <div
              className="
              flex
              flex-col
              xl:flex-row
              xl:items-center
              xl:justify-between
              gap-5
            "
            >
              {/* PRODUCT */}
              <div className="flex items-center gap-4">
                <div
                  className="
                  h-14
                  w-14
                  rounded-2xl
                  bg-orange-100
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
                >
                  📦
                </div>

                <div>
                  <h3
                    className="
                    text-lg
                    font-bold
                    text-gray-900
                  "
                  >
                    {item.product_name}
                  </h3>

                  <p
                    className="
                    text-sm
                    text-gray-400
                    mt-1
                  "
                  >
                    AI inventory recommendation
                  </p>
                </div>
              </div>

              {/* CURRENT STOCK */}
              <div>
                <p
                  className="
                  text-xs
                  uppercase
                  text-gray-400
                  font-semibold
                "
                >
                  Current Stock
                </p>

                <h2
                  className="
                  text-2xl
                  font-bold
                  text-gray-900
                  mt-2
                "
                >
                  {item.current_stock}
                </h2>
              </div>

              {/* PREDICTED DEMAND */}
              <div>
                <p
                  className="
                  text-xs
                  uppercase
                  text-gray-400
                  font-semibold
                "
                >
                  Predicted Demand
                </p>

                <h2
                  className="
                  text-2xl
                  font-bold
                  text-gray-900
                  mt-2
                "
                >
                  {item.predicted_demand}
                </h2>
              </div>

              {/* SUGGESTED ORDER */}
              <div>
                <p
                  className="
                  text-xs
                  uppercase
                  text-gray-400
                  font-semibold
                "
                >
                  Suggested Order
                </p>

                <div className="mt-2">
                  <span
                    className="
                    px-4
                    py-2
                    rounded-2xl
                    bg-green-100
                    text-green-700
                    text-sm
                    font-bold
                  "
                  >
                    +{item.suggested_restock} units
                  </span>
                </div>
              </div>

              {/* PRIORITY */}
              <div>
                <p
                  className="
                  text-xs
                  uppercase
                  text-gray-400
                  font-semibold
                "
                >
                  Priority
                </p>

                <div className="mt-2">
                  <span
                    className={`
                      px-4
                      py-2
                      rounded-2xl
                      text-sm
                      font-bold

                      ${
                        item.priority === "High"
                          ? "bg-red-100 text-red-600"
                          : item.priority === "Medium"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                      }
                    `}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
