// RestockModal.jsx

import { AlertTriangle, CheckCircle2, Package, ShieldAlert, X } from "lucide-react";

import { getStockStatus } from "../../utils/stockStatus";

export default function RestockModal({ product, quantity, setQuantity, onClose, onConfirm }) {
  if (!product) return null;

  const status = getStockStatus(product.stock, product.minLevel);

  const newStock = Number(product.stock) + Number(quantity || 0);

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        overflow-y-auto

        flex
        items-start
        justify-center

        bg-black/50

        px-4
        py-8

        backdrop-blur-[4px]
      "
    >
      {/* MODAL */}

      <div
        className="
          w-full
          max-w-[560px]

          my-auto

          overflow-hidden

          rounded-[28px]

          border
          border-gray-200
          dark:border-[#1F2937]

          bg-gradient-to-b
          from-white
          to-gray-50

          dark:from-[#111827]
          dark:to-[#0F172A]

          shadow-[0_20px_70px_rgba(0,0,0,0.15)]

          dark:shadow-[0_20px_70px_rgba(0,0,0,0.45)]

          transition-all
          duration-300
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between

            border-b
            border-gray-200
            dark:border-[#1F2937]

            px-6
            py-4
          "
        >
          <div>
            <h1
              className="
                text-[28px]
                font-black

                tracking-[-1px]

                text-gray-900
                dark:text-white
              "
            >
              Restock Product
            </h1>

            <p
              className="
                mt-1

                text-[13px]

                text-gray-500
                dark:text-gray-400
              "
            >
              Update inventory quantity
            </p>
          </div>

          {/* CLOSE */}

          <button
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-full

              transition-all
              duration-200

              hover:bg-black/5
              dark:hover:bg-white/5
            "
          >
            <X
              size={24}
              className="
                text-gray-500
                dark:text-gray-400
              "
            />
          </button>
        </div>

        {/* CONTENT */}

        <div
          className="
            space-y-4

            px-6
            py-5
          "
        >
          {/* PRODUCT */}

          <div
            className="
              rounded-[24px]

              border
              border-gray-200
              dark:border-[#1F2937]

              bg-white
              dark:bg-[#111827]

              p-4
            "
          >
            <div className="flex gap-4">
              {/* ICON */}

              <div
                className="
                  flex
                  h-[70px]
                  w-[70px]
                  items-center
                  justify-center

                  rounded-[20px]

                  bg-orange-50
                  dark:bg-[#1E293B]
                "
              >
                <Package
                  size={28}
                  className="
                    text-orange-500
                    dark:text-gray-300
                  "
                />
              </div>

              {/* INFO */}

              <div className="flex-1">
                <h2
                  className="
                    text-[24px]
                    leading-none

                    font-black

                    tracking-[-1px]

                    text-gray-900
                    dark:text-white
                  "
                >
                  {product.name}
                </h2>

                <p
                  className="
                    mt-1.5

                    text-[13px]

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {product.category}
                </p>

                {/* STATS */}

                <div
                  className="
                    mt-4

                    grid
                    grid-cols-3
                    gap-3
                  "
                >
                  {/* CURRENT */}

                  <div>
                    <p
                      className="
                        text-[11px]

                        text-gray-500
                      "
                    >
                      Current
                    </p>

                    <h3
                      className="
                        mt-1

                        text-[26px]
                        leading-none

                        font-black

                        text-gray-900
                        dark:text-white
                      "
                    >
                      {product.stock}
                    </h3>
                  </div>

                  {/* MIN */}

                  <div>
                    <p
                      className="
                        text-[11px]

                        text-gray-500
                      "
                    >
                      Min Level
                    </p>

                    <h3
                      className="
                        mt-1

                        text-[26px]
                        leading-none

                        font-black

                        text-gray-900
                        dark:text-white
                      "
                    >
                      {product.minLevel}
                    </h3>
                  </div>

                  {/* STATUS */}

                  <div>
                    <p
                      className="
                        text-[11px]

                        text-gray-500
                      "
                    >
                      Status
                    </p>

                    <div className="mt-1.5">
                      {status === "critical" && (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1

                            rounded-full

                            bg-red-500/10

                            px-2.5
                            py-1

                            text-[10px]
                            font-bold
                            uppercase

                            text-red-500
                          "
                        >
                          <ShieldAlert size={12} />
                          Critical
                        </span>
                      )}

                      {status === "low" && (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1

                            rounded-full

                            bg-yellow-500/10

                            px-2.5
                            py-1

                            text-[10px]
                            font-bold
                            uppercase

                            text-yellow-500
                          "
                        >
                          <AlertTriangle size={12} />
                          Low
                        </span>
                      )}

                      {status === "good" && (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1

                            rounded-full

                            bg-green-500/10

                            px-2.5
                            py-1

                            text-[10px]
                            font-bold
                            uppercase

                            text-green-500
                          "
                        >
                          <CheckCircle2 size={12} />
                          Good
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUANTITY */}

          <div>
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <label
                className="
                  text-[15px]
                  font-semibold

                  text-gray-900
                  dark:text-white
                "
              >
                Add Quantity
              </label>

              {/* QUICK ADD */}

              <div className="flex gap-2">
                {[5, 10, 20, 50].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setQuantity(Number(quantity || 0) + amount)}
                    className="
                      rounded-[14px]

                      border
                      border-orange-500/20

                      bg-orange-500/10

                      px-3
                      py-1.5

                      text-[11px]
                      font-bold

                      text-orange-500

                      transition-all

                      hover:bg-orange-500/20
                    "
                  >
                    +{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT */}

            <div
              className="
                mt-3

                flex
                h-[54px]
                items-center
                gap-2

                overflow-hidden

                rounded-[18px]

                border
                border-orange-500/20

                bg-white
                dark:bg-[#111827]

                transition-all

                focus-within:border-orange-400
                focus-within:ring-2
                focus-within:ring-orange-500/20
              "
            >
              {/* ICON */}

              <div
                className="
                  flex
                  h-full
                  w-[52px]
                  items-center
                  justify-center

                  bg-orange-500/10
                "
              >
                <Package
                  size={18}
                  className="
                    text-orange-500
                  "
                />
              </div>

              {/* INPUT */}

              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && quantity && Number(quantity) > 0) {
                    onConfirm();
                  }
                }}
                placeholder="0"
                className="
                  w-full

                  [appearance:textfield]

                  bg-transparent

                  text-[24px]
                  font-black

                  text-gray-900
                  dark:text-white

                  outline-none

                  placeholder:text-gray-400
                  dark:placeholder:text-gray-600
                "
              />
            </div>
          </div>

          {/* PREVIEW */}

          <div
            className="
              rounded-[18px]

              border
              border-green-500/20

              bg-green-500/5

              p-3
            "
          >
            <div
              className="
                grid
                grid-cols-3
                gap-3
              "
            >
              {/* BEFORE */}

              <div>
                <p
                  className="
                    text-[11px]

                    text-gray-500
                  "
                >
                  Before
                </p>

                <h3
                  className="
                    mt-1

                    text-[22px]
                    leading-none

                    font-black

                    text-gray-900
                    dark:text-white
                  "
                >
                  {product.stock}
                </h3>
              </div>

              {/* ADDED */}

              <div>
                <p
                  className="
                    text-[11px]

                    text-gray-500
                  "
                >
                  Added
                </p>

                <h3
                  className="
                    mt-1

                    text-[22px]
                    leading-none

                    font-black

                    text-green-500
                  "
                >
                  +{quantity || 0}
                </h3>
              </div>

              {/* AFTER */}

              <div>
                <p
                  className="
                    text-[11px]

                    text-gray-500
                  "
                >
                  After
                </p>

                <h3
                  className="
                    mt-1

                    text-[22px]
                    leading-none

                    font-black

                    text-gray-900
                    dark:text-white
                  "
                >
                  {newStock}
                </h3>
              </div>
            </div>

            {/* STATUS MESSAGE */}

            {newStock >= product.minLevel && (
              <div
                className="
                  mt-3

                  rounded-[14px]

                  bg-green-500/10

                  px-3
                  py-2

                  text-[11px]
                  font-semibold

                  text-green-600
                  dark:text-green-400
                "
              >
                Stock status will become GOOD after restocking.
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
            grid
            grid-cols-2
            gap-3

            border-t
            border-gray-200
            dark:border-[#1F2937]

            bg-gray-50
            dark:bg-[#0F172A]

            px-6
            py-4
          "
        >
          {/* CANCEL */}

          <button
            onClick={onClose}
            className="
              h-[50px]

              rounded-[18px]

              border
              border-gray-200
              dark:border-[#1F2937]

              bg-white
              dark:bg-[#111827]

              text-[14px]
              font-semibold

              text-gray-700
              dark:text-gray-300

              transition-all

              hover:bg-gray-100
              dark:hover:bg-white/5
            "
          >
            Cancel
          </button>

          {/* CONFIRM */}

          <button
            onClick={onConfirm}
            disabled={!quantity || Number(quantity) <= 0}
            className="
              h-[50px]

              rounded-[18px]

              bg-orange-500

              text-[14px]
              font-semibold
              text-white

              shadow-lg
              shadow-orange-500/20

              transition-all
              duration-200

              hover:bg-orange-600

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Confirm Restock
          </button>
        </div>
      </div>
    </div>
  );
}
