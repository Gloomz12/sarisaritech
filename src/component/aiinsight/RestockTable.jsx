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
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="
              h-28

              animate-pulse

              rounded-3xl

              bg-gray-100
              dark:bg-[#0F172A]
            "
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div
        className="
          rounded-3xl

          bg-gray-50
          dark:bg-[#0F172A]

          p-10

          text-center
        "
      >
        <h2
          className="
            text-lg
            font-semibold

            text-gray-700
            dark:text-white
          "
        >
          No restock recommendations
        </h2>

        <p
          className="
            mt-2

            text-sm

            text-gray-400
            dark:text-slate-400
          "
        >
          Inventory levels are currently stable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="
            rounded-3xl

            border
            border-gray-100
            dark:border-[#1F2937]

            bg-white
            dark:bg-[#0F172A]

            p-5

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5

              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >
            {/* PRODUCT */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  bg-orange-100
                  dark:bg-orange-500/10

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
                    dark:text-white
                  "
                >
                  {item.product_name}
                </h3>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-400
                    dark:text-slate-400
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
                  font-semibold
                  uppercase

                  text-gray-400
                  dark:text-slate-500
                "
              >
                Current Stock
              </p>

              <h2
                className="
                  mt-2

                  text-2xl
                  font-black

                  text-gray-900
                  dark:text-white
                "
              >
                {item.current_stock}
              </h2>
            </div>

            {/* DEMAND */}

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase

                  text-gray-400
                  dark:text-slate-500
                "
              >
                Predicted Demand
              </p>

              <h2
                className="
                  mt-2

                  text-2xl
                  font-black

                  text-gray-900
                  dark:text-white
                "
              >
                {item.predicted_demand}
              </h2>
            </div>

            {/* SUGGESTED */}

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase

                  text-gray-400
                  dark:text-slate-500
                "
              >
                Suggested Order
              </p>

              <div className="mt-3">
                <span
                  className="
                    rounded-2xl

                    bg-green-100
                    dark:bg-green-500/10

                    px-4
                    py-2

                    text-sm
                    font-bold

                    text-green-700
                    dark:text-green-400
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
                  font-semibold
                  uppercase

                  text-gray-400
                  dark:text-slate-500
                "
              >
                Priority
              </p>

              <div className="mt-3">
                <span
                  className={`
                    rounded-2xl

                    px-4
                    py-2

                    text-sm
                    font-bold

                    ${
                      item.priority === "High"
                        ? `
                          bg-red-100
                          dark:bg-red-500/10

                          text-red-600
                          dark:text-red-400
                        `
                        : item.priority === "Medium"
                          ? `
                            bg-orange-100
                            dark:bg-orange-500/10

                            text-orange-600
                            dark:text-orange-400
                          `
                          : `
                            bg-green-100
                            dark:bg-green-500/10

                            text-green-600
                            dark:text-green-400
                          `
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
  );
}
