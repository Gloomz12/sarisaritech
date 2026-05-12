import {
  Archive,
  Bell,
  Package,
  PhilippinePeso,
  Ruler,
  Tag,
  X,
} from "lucide-react";

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
        bg-black/40
        p-4
        backdrop-blur-[2px]
      "
    >
      {/* MODAL */}

      <div
        className="
          w-full
          max-w-[720px]
          overflow-hidden
          rounded-[26px]
          bg-white
          shadow-[0_20px_70px_rgba(15,23,42,0.12)]
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
            px-7
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
              "
            >
              Product Details
            </h1>

            <p
              className="
                mt-1
                text-[14px]
                text-[#64748b]
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
            "
          >
            <X size={22} className="text-[#64748b]" />
          </button>
        </div>

        {/* BODY */}

        <div className="grid grid-cols-2 gap-4 p-7">
          <InfoCard
            icon={<Package size={17} />}
            label="Product Name"
            value={product.name}
          />

          <InfoCard
            icon={<Tag size={17} />}
            label="Category"
            value={product.category}
          />

          <InfoCard
            icon={<Ruler size={17} />}
            label="Unit"
            value={product.unit}
          />

          <InfoCard
            icon={<Archive size={17} />}
            label="Current Stock"
            value={`${product.stock_quantity} ${product.unit}`}
          />

          <InfoCard
            icon={<PhilippinePeso size={17} />}
            label="Cost Price"
            value={`₱${product.cost_price}`}
          />

          <InfoCard
            icon={<PhilippinePeso size={17} />}
            label="Selling Price"
            value={`₱${product.selling_price}`}
          />

          <InfoCard
            icon={<Bell size={17} />}
            label="Minimum Stock"
            value={`${product.min_stock_level} ${product.unit}`}
          />

          {/* STATUS */}

          <div
            className="
              rounded-[20px]
              border
              border-[#eef2f7]
              bg-[#fcfcfd]
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
            p-5
          "
        >
          <button
            onClick={onClose}
            className="
              flex
              h-[54px]
              w-full
              items-center
              justify-center

              rounded-[16px]
              bg-orange-500

              text-[15px]
              font-semibold
              text-white

              transition-all
              duration-200

              hover:bg-orange-600
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
        rounded-[20px]
        border
        border-[#eef2f7]
        bg-[#fcfcfd]
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
            "
          >
            {label}
          </p>

          <h2
            className="
              mt-1
              text-[17px]
              font-bold
              text-[#071437]
            "
          >
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}
