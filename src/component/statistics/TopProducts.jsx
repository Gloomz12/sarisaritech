export default function TopProducts({ products }) {
  return (
    <div
      className="
        rounded-[26px]

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        p-6

        shadow-sm

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-6

          flex
          items-center
          justify-between
        "
      >
        <div>
          <h2
            className="
              text-lg
              font-black

              text-gray-900
              dark:text-white
            "
          >
            Top Products
          </h2>

          <p
            className="
              text-sm

              text-gray-500
              dark:text-slate-400
            "
          >
            Best selling products
          </p>
        </div>
      </div>

      {/* PRODUCTS */}

      <div className="space-y-5">
        {products.map((product, index) => (
          <div
            key={index}
            className="
                flex
                items-center
                justify-between
              "
          >
            {/* LEFT */}

            <div
              className="
                  flex
                  items-center
                  gap-4
                "
            >
              {/* NUMBER */}

              <div
                className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-xl

                    bg-orange-50
                    dark:bg-orange-500/10

                    text-sm
                    font-bold

                    text-orange-500
                  "
              >
                {index + 1}
              </div>

              {/* INFO */}

              <div>
                <h3
                  className="
                      font-semibold

                      text-gray-900
                      dark:text-white
                    "
                >
                  {product.name}
                </h3>

                <p
                  className="
                      text-xs

                      text-gray-400
                      dark:text-slate-500
                    "
                >
                  {product.category}
                </p>
              </div>
            </div>

            {/* SALES */}

            <h3
              className="
                  font-black

                  text-orange-500
                "
            >
              ₱{product.sales}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
