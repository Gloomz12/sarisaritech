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

        flex
        items-center
        justify-center

        bg-black/40

        p-4

        backdrop-blur-[2px]
      "
    >
      {/* MODAL */}

      <div
        className="
          w-full
          max-w-[560px]

          overflow-hidden

          rounded-[28px]

          bg-white

          shadow-[0_20px_70px_rgba(15,23,42,0.12)]
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between

            border-b
            border-[#eef2f7]

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

                text-[#071437]
              "
            >
              Restock Product
            </h1>

            <p
              className="
                mt-1

                text-[13px]
                text-[#64748b]
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

              hover:bg-[#f8fafc]
            "
          >
            <X
              size={24}
              className="
                text-[#64748b]
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
              border-[#e2e8f0]

              bg-[#fcfcfd]

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

                  bg-[#f1f5f9]
                "
              >
                <Package
                  size={28}
                  className="
                    text-slate-500
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

                    text-[#071437]
                  "
                >
                  {product.name}
                </h2>

                <p
                  className="
                    mt-1.5

                    text-[13px]
                    text-[#64748b]
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
                        text-[#94a3b8]
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

                        text-[#071437]
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
                        text-[#94a3b8]
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

                        text-[#071437]
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
                        text-[#94a3b8]
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

                            bg-red-100

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

                            bg-yellow-100

                            px-2.5
                            py-1

                            text-[10px]
                            font-bold
                            uppercase

                            text-yellow-700
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

                            bg-green-100

                            px-2.5
                            py-1

                            text-[10px]
                            font-bold
                            uppercase

                            text-green-600
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

                  text-[#071437]
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
                        border-[#F4D7B5]

                        bg-orange-50

                        px-3
                        py-1.5

                        text-[11px]
                        font-bold

                        text-orange-500

                        transition-all

                        hover:bg-orange-100
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
                border-[#F4D7B5]

                bg-white

                transition-all

                focus-within:border-orange-300
                focus-within:ring-2
                focus-within:ring-orange-100
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

                  bg-[#fff7ed]
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

                  text-[#071437]

                  outline-none

                  placeholder:text-[#cbd5e1]
                "
              />
            </div>
          </div>

          {/* PREVIEW */}

          <div
            className="
              rounded-[18px]

              border
              border-green-100

              bg-[#f7fff9]

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
                    text-[#94a3b8]
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

                    text-[#071437]
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
                    text-[#94a3b8]
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

                    text-green-600
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
                    text-[#94a3b8]
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

                    text-[#071437]
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

                  bg-green-100

                  px-3
                  py-2

                  text-[11px]
                  font-semibold

                  text-green-700
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
            border-[#eef2f7]

            bg-white

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
              border-[#dbe2ea]

              bg-white

              text-[14px]
              font-semibold

              text-[#475569]

              transition-all

              hover:bg-[#f8fafc]
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
