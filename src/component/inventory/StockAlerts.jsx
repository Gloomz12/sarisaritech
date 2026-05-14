import { useNavigate } from "react-router-dom";

export default function StockAlerts({ lowStock = [] }) {
  const navigate = useNavigate();

  /* SORT */

  const sortedAlerts = [...lowStock]

    .sort((a, b) => {
      if (a.stock_quantity === 0 && b.stock_quantity !== 0) {
        return -1;
      }

      if (b.stock_quantity === 0 && a.stock_quantity !== 0) {
        return 1;
      }

      return a.stock_quantity - b.stock_quantity;
    })

    .slice(0, 3);

  return (
    <div
      className="
        flex
        min-h-[unset]
        flex-col
        justify-between

        rounded-[26px]
        border
        border-[#eef2f7]
        bg-white
        p-5

        shadow-[0_6px_24px_rgba(15,23,42,0.04)]
      "
    >
      {/* TOP */}

      <div>
        {/* HEADER */}

        <div
          className="
            flex
            items-start
            justify-between
          "
        >
          <div>
            <h2
              className="
                text-[18px]
                font-black
                tracking-[-0.5px]
                text-[#0f172a]
              "
            >
              Low Stock Alerts
            </h2>

            <p
              className="
                mt-1
                text-[13px]
                text-[#64748b]
              "
            >
              Products needing attention
            </p>
          </div>

          <button
            onClick={() => navigate("/restock")}
            className="
              text-[13px]
              font-semibold
              text-orange-500

              transition-all
              duration-200

              hover:text-orange-600
            "
          >
            See All →
          </button>
        </div>

        {/* ALERTS */}

        <div className="mt-5 space-y-3">
          {sortedAlerts.map((item) => (
            <div
              key={item.id}
              className="
                  flex
                  items-center
                  justify-between

                  rounded-2xl
                  border
                  border-[#f8fafc]

                  px-4
                  py-3

                  transition-all
                  duration-200

                  hover:border-orange-100
                  hover:bg-orange-50/30
                "
            >
              {/* LEFT */}

              <div
                className="
                    flex
                    items-center
                    gap-3
                  "
              >
                {/* DOT */}

                <div
                  className={`
                      h-2.5
                      w-2.5
                      rounded-full

                      ${item.stock_quantity === 0 ? "bg-red-400" : "bg-orange-400"}
                    `}
                />

                {/* INFO */}

                <div>
                  <p
                    className="
                        text-[15px]
                        font-bold
                        text-[#0f172a]
                      "
                  >
                    {item.name}
                  </p>

                  <p
                    className="
                        mt-0.5
                        text-[13px]
                        text-[#64748b]
                      "
                  >
                    {item.category}
                  </p>
                </div>
              </div>

              {/* RIGHT */}

              <div
                className={`
                    rounded-full
                    px-3.5
                    py-1.5

                    text-[13px]
                    font-bold

                    ${
                      item.stock_quantity === 0
                        ? `
                          bg-red-100
                          text-red-500
                        `
                        : `
                          bg-orange-100
                          text-orange-600
                        `
                    }
                  `}
              >
                {item.stock_quantity} left
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM */}

      <div className="mt-6">
        {/* MORE */}

        {lowStock.length > 3 && (
          <button
            onClick={() => navigate("/restock")}
            className="
              w-full

              rounded-2xl
              border
              border-dashed
              border-[#e2e8f0]

              py-3

              text-[13px]
              font-semibold
              text-[#64748b]

              transition-all
              duration-200

              hover:border-orange-200
              hover:bg-orange-50/40
              hover:text-orange-500
            "
          >
            +{lowStock.length - 3} more items
          </button>
        )}

        {/* SUMMARY */}

        <div
          className="
            mt-4
            rounded-2xl
            bg-[#f8fafc]
            px-4
            py-3
          "
        >
          <p
            className="
              text-[13px]
              font-medium
              text-[#64748b]
            "
          >
            <span className="font-bold text-[#0f172a]">{lowStock.length}</span> products currently need restocking
          </p>
        </div>
      </div>
    </div>
  );
}
