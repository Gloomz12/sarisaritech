import {
  FiPlus,
  FiMinus,
  FiTrash2,
} from "react-icons/fi";

export default function CartItem({

  item,

  increaseQuantity,
  decreaseQuantity,

}) {

  return (

    <div
      className="
        border
        border-gray-100

        rounded-[15px]

        px-3
        py-2.5

        bg-white
      "
    >

      <div
        className="
          flex
          items-center
          justify-between

          gap-3
        "
      >

        {/* LEFT */}

        <div className="min-w-0 flex-1">

          <h1
            className="
              text-[14px]
              leading-tight

              font-black

              text-[#0F172A]

              truncate
            "
          >
            {item.name}
          </h1>

          <div
            className="
              mt-1

              flex
              items-center
              gap-2
            "
          >

            <p
              className="
                text-[12px]
                font-bold

                text-orange-500
              "
            >
              ₱{item.price}
            </p>

            <span
              className="
                text-[11px]

                text-gray-400
              "
            >
              x{item.quantity}
            </span>

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            items-center

            gap-2
          "
        >

          {/* MINUS */}

          <button

            onClick={() =>
              decreaseQuantity(
                item
              )
            }

            className="
              w-6
              h-6

              rounded-full

              border
              border-gray-200

              flex
              items-center
              justify-center

              text-[11px]

              transition-all
              duration-300

              hover:border-orange-400
            "
          >

            <FiMinus />

          </button>

          {/* QUANTITY */}

          <span
            className="
              w-3

              text-center

              text-[13px]
              font-black

              text-[#0F172A]
            "
          >
            {item.quantity}
          </span>

          {/* PLUS */}

          <button

            onClick={() =>
              increaseQuantity(
                item
              )
            }

            className="
              w-6
              h-6

              rounded-full

              border
              border-orange-500

              text-orange-500

              flex
              items-center
              justify-center

              text-[11px]

              transition-all
              duration-300

              hover:bg-orange-500
              hover:text-white
            "
          >

            <FiPlus />

          </button>

          {/* TOTAL */}

          <h1
            className="
              ml-2

              text-[14px]
              font-black

              text-[#0F172A]

              whitespace-nowrap
            "
          >
            ₱
            {
              item.price *
              item.quantity
            }
          </h1>

          {/* DELETE */}

          <button
            className="
              ml-1

              text-gray-400

              transition-all
              duration-300

              hover:text-red-500
            "
          >

            <FiTrash2 className="text-[13px]" />

          </button>

        </div>

      </div>

    </div>

  );

}