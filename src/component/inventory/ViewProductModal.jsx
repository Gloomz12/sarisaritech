import { Archive, Bell, Package, PhilippinePeso, Ruler, Tag, X } from "lucide-react";

export default function ViewProductModal({ product, onClose }) {
  if (!product) return null;

  let status = "In Stock";

  if (product.stock_quantity === 0) {
    status = "Out of Stock";
  } else if (product.stock_quantity <= product.min_stock_level) {
    status = "Low Stock";
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/60

        p-5

        backdrop-blur-[4px]
      "
    >
      {/* MODAL */}

      <div
        className="
          w-full
          max-w-[620px]

          overflow-hidden

          rounded-[28px]

          bg-white

          dark:bg-gradient-to-b
          dark:from-[#111827]
          dark:to-[#0F172A]

          border
          border-gray-100
          dark:border-[#1F2937]

          shadow-[0_20px_70px_rgba(15,23,42,0.12)]

          transition-all
          duration-300
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-start
            justify-between

            border-b
            border-[#eef2f7]
            dark:border-[#1F2937]

            px-6
            py-5
          "
        >
          <div>
            <h1
              className="
                text-[30px]
                font-black

                tracking-[-1px]

                text-[#071437]
                dark:text-white
              "
            >
              Product Details
            </h1>

            <p
              className="
                mt-1

                text-[14px]

                text-[#64748b]
                dark:text-gray-400
              "
            >
              View inventory information
            </p>
          </div>

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
              dark:hover:bg-white/5
            "
          >
            <X
              size={22}
              className="
                text-[#64748b]
                dark:text-gray-400
              "
            />
          </button>
        </div>

        {/* BODY */}

        <div
          className="
            grid
            grid-cols-2

            gap-3

            p-6
          "
        >
          <InfoCard icon={<Package size={17} />} label="Product Name" value={product.name} />

          <InfoCard icon={<Tag size={17} />} label="Category" value={product.category} />

          <InfoCard icon={<Ruler size={17} />} label="Unit" value={product.unit} />

          <InfoCard icon={<Archive size={17} />} label="Current Stock" value={`${product.stock_quantity} ${product.unit}`} />

          <InfoCard icon={<PhilippinePeso size={17} />} label="Cost Price" value={`₱${product.cost_price}`} />

          <InfoCard icon={<PhilippinePeso size={17} />} label="Selling Price" value={`₱${product.selling_price}`} />

          <InfoCard icon={<Bell size={17} />} label="Minimum Stock" value={`${product.min_stock_level} ${product.unit}`} />

          {/* STATUS */}

          <div
            className="
              rounded-[18px]

              border
              border-[#eef2f7]
              dark:border-[#1F2937]

              bg-[#fcfcfd]
              dark:bg-[#111827]

              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-2xl

                  bg-[#fff7ed]
                  dark:bg-orange-500/10

                  text-orange-500
                "
              >
                <Archive size={17} />
              </div>

              <div>
                <p
                  className="
                    text-[12px]
                    font-medium

                    text-[#64748b]
                    dark:text-gray-400
                  "
                >
                  Stock Status
                </p>

                <div className="mt-2">
                  <span
                    className={`
                      inline-flex

                      rounded-full

                      px-3
                      py-1.5

                      text-[12px]
                      font-semibold

                      ${
                        status === "In Stock"
                          ? `
                            bg-green-100
                            text-green-700
                          `
                          : status === "Low Stock"
                            ? `
                            bg-orange-100
                            text-orange-600
                          `
                            : `
                            bg-red-100
                            text-red-500
                          `
                      }
                    `}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
            border-t
            border-[#eef2f7]
            dark:border-[#1F2937]

            p-5
          "
        >
          <button
            onClick={onClose}
            className="
              flex
              h-[52px]
              w-full

              items-center
              justify-center

              rounded-[16px]

              bg-orange-500

              text-[15px]
              font-semibold
              text-white

              shadow-lg
              shadow-orange-500/20

              transition-all
              duration-200

              hover:bg-orange-600
              hover:shadow-orange-500/40
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* INFO CARD */

function InfoCard({ icon, label, value }) {
  return (
    <div
      className="
        rounded-[18px]

        border
        border-[#eef2f7]
        dark:border-[#1F2937]

        bg-[#fcfcfd]
        dark:bg-[#111827]

        p-4

        transition-all
        duration-300
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        {/* ICON */}

        <div
          className="
            flex
            h-11
            w-11

            items-center
            justify-center

            rounded-2xl

            bg-[#fff7ed]
            dark:bg-orange-500/10

            text-orange-500
          "
        >
          {icon}
        </div>

        {/* CONTENT */}

        <div>
          <p
            className="
              text-[12px]
              font-medium

              text-[#64748b]
              dark:text-gray-400
            "
          >
            {label}
          </p>

          <h2
            className="
              mt-1

              text-[16px]
              font-bold

              text-[#071437]
              dark:text-white
            "
          >
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}
