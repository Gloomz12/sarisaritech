import { useState } from "react";

import { ChevronDown, ChevronUp, Banknote, Smartphone, PackagePlus } from "lucide-react";

export default function TransactionCard({ transaction }) {
  const [expanded, setExpanded] = useState(false);

  // PAYMENT METHOD STYLES

  const paymentStyles = {
    Cash: {
      iconBg: `
        bg-green-100
        dark:bg-green-500/10
      `,

      iconColor: `
        text-green-600
        dark:text-green-400
      `,

      badgeBg: `
        bg-orange-100
        dark:bg-orange-500/10
      `,

      badgeColor: `
        text-orange-600
        dark:text-orange-400
      `,

      icon: <Banknote size={16} />,
    },

    GCash: {
      iconBg: `
        bg-blue-100
        dark:bg-blue-500/10
      `,

      iconColor: `
        text-blue-600
        dark:text-blue-400
      `,

      badgeBg: `
        bg-blue-100
        dark:bg-blue-500/10
      `,

      badgeColor: `
        text-blue-600
        dark:text-blue-400
      `,

      icon: <Smartphone size={16} />,
    },

    Paymaya: {
      iconBg: `
        bg-emerald-100
        dark:bg-emerald-500/10
      `,

      iconColor: `
        text-emerald-600
        dark:text-emerald-400
      `,

      badgeBg: `
        bg-emerald-100
        dark:bg-emerald-500/10
      `,

      badgeColor: `
        text-emerald-700
        dark:text-emerald-400
      `,

      icon: <Smartphone size={16} />,
    },
  };

  const style = paymentStyles[transaction.payment_method] || paymentStyles.Cash;

  const isRestock = transaction.type === "restock";

  const isAdjustment = transaction.type === "adjustment";

  return (
    <div
      className="
        overflow-hidden

        rounded-[20px]

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        shadow-sm

        transition-all
        duration-300

        hover:shadow-md
      "
    >
      {/* HEADER */}

      <div
        onClick={() => setExpanded(!expanded)}
        className="
          flex
          cursor-pointer
          items-center
          justify-between

          px-4
          py-3
        "
      >
        {/* LEFT */}

        <div className="flex items-center gap-3">
          {/* ICON */}

          <div
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-xl

              ${
                isRestock || isAdjustment
                  ? `
                    bg-orange-100
                    dark:bg-orange-500/10

                    text-orange-500
                    dark:text-orange-400
                  `
                  : `
                    ${style.iconBg}
                    ${style.iconColor}
                  `
              }
            `}
          >
            {isRestock || isAdjustment ? <PackagePlus size={16} /> : style.icon}
          </div>

          {/* TEXT */}

          <div>
            <h2
              className="
                text-[16px]
                font-bold

                text-[#172033]
                dark:text-white
              "
            >
              {transaction.time}
            </h2>

            {isRestock || isAdjustment ? (
              <p
                className="
                  mt-0.5

                  text-[13px]

                  text-gray-600
                  dark:text-slate-400
                "
              >
                <span
                  className="
                    font-semibold

                    text-orange-500
                    dark:text-orange-400
                  "
                >
                  {transaction.quantity > 0 ? `+${Math.abs(transaction.quantity)}` : `-${Math.abs(transaction.quantity)}`}
                </span>{" "}
                {transaction.product_name} {isAdjustment ? "Adjusted" : "Restocked"}
              </p>
            ) : (
              <p
                className="
                  mt-0.5

                  text-[12px]

                  text-gray-400
                  dark:text-slate-500
                "
              >
                {transaction.items_count} items
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3">
          <div className="text-right">
            {isRestock || isAdjustment ? (
              <>
                <h2
                  className="
                    text-[15px]
                    font-extrabold
                    leading-none

                    text-orange-500
                    dark:text-orange-400
                  "
                >
                  {transaction.quantity > 0 ? `+${Math.abs(transaction.quantity)}` : `-${Math.abs(transaction.quantity)}`} Stock
                </h2>

                <div className="mt-1">
                  <span
                    className={`
                      rounded-md

                      px-2
                      py-[3px]

                      text-[10px]
                      font-semibold

                      ${
                        isAdjustment
                          ? `
                            bg-blue-100
                            dark:bg-blue-500/10

                            text-blue-600
                            dark:text-blue-400
                          `
                          : `
                            bg-orange-100
                            dark:bg-orange-500/10

                            text-orange-600
                            dark:text-orange-400
                          `
                      }
                    `}
                  >
                    {isAdjustment ? "Adjustment" : "Restock"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <h2
                  className="
                    text-[18px]
                    font-extrabold
                    leading-none

                    text-orange-500
                    dark:text-orange-400
                  "
                >
                  ₱{transaction.total}
                </h2>

                <div className="mt-1">
                  <span
                    className={`
                      rounded-md

                      px-2
                      py-[3px]

                      text-[10px]
                      font-semibold

                      ${style.badgeBg}
                      ${style.badgeColor}
                    `}
                  >
                    {transaction.payment_method === "Paymaya" ? "PayMaya" : transaction.payment_method}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* CHEVRON */}

          <div
            className="
              text-gray-500
              dark:text-slate-500
            "
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* EXPANDED */}

      {expanded && (
        <div
          className="
            border-t
            border-gray-100
            dark:border-[#1F2937]

            px-4
            pb-4
          "
        >
          {isRestock || isAdjustment ? (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <span
                  className="
                    text-[13px]

                    text-gray-500
                    dark:text-slate-500
                  "
                >
                  Product
                </span>

                <span
                  className="
                    text-[13px]
                    font-semibold

                    text-gray-700
                    dark:text-white
                  "
                >
                  {transaction.product_name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="
                    text-[13px]

                    text-gray-500
                    dark:text-slate-500
                  "
                >
                  {isAdjustment ? "Adjusted Quantity" : "Added Quantity"}
                </span>

                <span
                  className="
                    text-[13px]
                    font-semibold

                    text-orange-500
                    dark:text-orange-400
                  "
                >
                  {transaction.quantity > 0 ? `+${Math.abs(transaction.quantity)}` : `-${Math.abs(transaction.quantity)}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="
                    text-[13px]

                    text-gray-500
                    dark:text-slate-500
                  "
                >
                  Previous Stock
                </span>

                <span
                  className="
                    text-[13px]
                    font-semibold

                    text-gray-700
                    dark:text-white
                  "
                >
                  {transaction.previous_stock}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="
                    text-[13px]

                    text-gray-500
                    dark:text-slate-500
                  "
                >
                  New Stock
                </span>

                <span
                  className="
                    text-[13px]
                    font-semibold

                    text-green-600
                    dark:text-green-400
                  "
                >
                  {transaction.new_stock}
                </span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="mt-3 w-full">
                <thead>
                  <tr
                    className="
                      text-left
                      text-[10px]
                      uppercase
                      tracking-wide

                      text-gray-400
                      dark:text-slate-500
                    "
                  >
                    <th className="pb-2 font-semibold">Product</th>

                    <th
                      className="
                        pb-2
                        text-center
                        font-semibold
                      "
                    >
                      Qty
                    </th>

                    <th
                      className="
                        pb-2
                        text-right
                        font-semibold
                      "
                    >
                      Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transaction.items.map((item, index) => (
                    <tr
                      key={index}
                      className="
                        border-t
                        border-gray-50
                        dark:border-[#1F2937]
                      "
                    >
                      <td
                        className="
                          py-2

                          text-[12px]

                          text-gray-700
                          dark:text-slate-300
                        "
                      >
                        {item.name}
                      </td>

                      <td
                        className="
                          py-2
                          text-center

                          text-[12px]
                          font-semibold

                          text-gray-600
                          dark:text-slate-400
                        "
                      >
                        x{item.qty}
                      </td>

                      <td
                        className="
                          py-2
                          text-right

                          text-[12px]
                          font-semibold

                          text-gray-700
                          dark:text-white
                        "
                      >
                        ₱{item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTAL */}

              <div
                className="
                  mt-3

                  flex
                  items-center
                  justify-between

                  border-t
                  border-gray-100
                  dark:border-[#1F2937]

                  pt-3
                "
              >
                <span
                  className="
                    text-[13px]
                    font-semibold

                    text-gray-700
                    dark:text-slate-300
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-[18px]
                    font-extrabold

                    text-orange-500
                    dark:text-orange-400
                  "
                >
                  ₱{transaction.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
