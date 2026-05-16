import { FiMinus, FiPlus, FiStar } from "react-icons/fi";

export default function ProductCard({
  product,

  quantity,

  increaseQuantity,
  decreaseQuantity,

  toggleFavorite,
}) {
  return (
    <div
      className="
        bg-white
        dark:bg-[#111827]

        border
        border-gray-200
        dark:border-[#1F2937]

        rounded-[18px]

        p-2.5

        transition-all
        duration-300

        hover:shadow-md
        hover:-translate-y-1

        dark:hover:border-orange-500/20

        flex
        flex-col

        h-[160px]
      "
    >
      {/* TOP */}

      <div
        className="
          relative
        "
      >
        {/* FAVORITE */}

        <button
          onClick={() => toggleFavorite(product.id)}
          className="
            absolute
            top-0
            right-0

            w-6
            h-6

            flex
            items-center
            justify-center
          "
        >
          <FiStar
            className={`
              text-[15px]

              transition-all
              duration-300

              ${
                product.favorite
                  ? `
                    fill-orange-400
                    text-orange-400
                  `
                  : `
                    text-gray-400
                    dark:text-gray-500
                  `
              }
            `}
          />
        </button>

        {/* PRODUCT INFO */}

        <div
          className="
            pr-7

            flex
            flex-col

            h-[78px]
          "
        >
          {/* NAME */}

          <h1
            title={product.name}
            className="
              text-[14px]
              leading-snug

              font-black

              text-[#0F172A]
              dark:text-white

              line-clamp-2

              h-[38px]

              overflow-hidden
            "
          >
            {product.name}
          </h1>

          {/* PRICE */}

          <p
            className="
              mt-1.5

              text-[13px]
              font-black

              text-orange-500
            "
          >
            ₱{product.price}
          </p>

          {/* STOCK */}

          <p
            className="
              mt-auto

              text-[11px]
              leading-relaxed

              text-gray-400
              dark:text-gray-500
            "
          >
            {product.stock} units remaining
          </p>
        </div>
      </div>

      {/* CONTROLS */}

      <div
        className="
          mt-auto

          pt-1

          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            justify-between

            w-[115px]
          "
        >
          {/* MINUS */}

          <button
            onClick={() => decreaseQuantity(product)}
            className="
              w-8
              h-8

              rounded-full

              border
              border-gray-200
              dark:border-[#374151]

              text-[#0F172A]
              dark:text-white

              flex
              items-center
              justify-center

              transition-all
              duration-300

              hover:border-orange-400
              dark:hover:border-orange-400

              dark:bg-[#1F2937]
            "
          >
            <FiMinus className="text-[14px]" />
          </button>

          {/* QUANTITY */}

          <span
            className="
              w-5

              text-center

              text-[15px]
              font-black

              text-[#0F172A]
              dark:text-white
            "
          >
            {quantity}
          </span>

          {/* PLUS */}

          <button
            onClick={() => increaseQuantity(product)}
            className="
              w-8
              h-8

              rounded-full

              border
              border-orange-500

              text-orange-500

              flex
              items-center
              justify-center

              transition-all
              duration-300

              hover:bg-orange-500
              hover:text-white

              dark:bg-orange-500/10
            "
          >
            <FiPlus className="text-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
