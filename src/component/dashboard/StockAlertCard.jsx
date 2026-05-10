import {
  FiAlertTriangle,
  FiChevronRight,
} from "react-icons/fi";

export default function StockAlertCard() {

  return (

    <div
      className="
        relative
        overflow-hidden

        min-h-[260px]

        bg-white
        dark:bg-[#0F172A]

        border
        border-gray-100
        dark:border-white/5

        rounded-[26px]

        p-5

        shadow-sm
        hover:shadow-lg

        transition-all
        duration-300
      "
    >

      {/* TOP BORDER */}

        <div
          className="
            absolute
            top-0
            left-0

            w-full
            h-[2px]

            bg-gradient-to-r
            from-[#8B5CF6]
            via-[#6366F1]
            to-[#3B82F6]

            opacity-80
          "
        />

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
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
              w-12
              h-12

              rounded-2xl

              bg-red-500/10

              flex
              items-center
              justify-center

              text-red-500
              text-[20px]
            "
          >
            <FiAlertTriangle />
          </div>

          <div>

            <h3
              className="
                text-[22px]
                leading-none

                font-black

                tracking-[-1px]

                text-[#0F172A]
                dark:text-white
              "
            >
              Stock Alerts
            </h3>

            <p
              className="
                mt-1

                text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              Low inventory products
            </p>

          </div>

        </div>

        {/* BUTTON */}

        <button
          className="
            flex
            items-center
            gap-1

            text-orange-500
            hover:text-orange-600

            text-sm
            font-semibold

            transition-all
          "
        >
          See All
          <FiChevronRight />
        </button>

      </div>

      {/* ALERTS */}

      <div className="mt-6 space-y-3">

        <Alert
          item="Coke"
          stock="20 units left"
          danger
          percentage="Critical"
        />

        <Alert
          item="Chips"
          stock="35 units left"
          percentage="Low"
        />

        <Alert
          item="Noodles"
          stock="42 units left"
          percentage="Medium"
        />

      </div>

    </div>
  );
}

function Alert({
  item,
  stock,
  danger,
  percentage,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between

        rounded-2xl

        border
        border-gray-100
        dark:border-white/5

        bg-[#fafafa]
        dark:bg-[#111827]

        px-4
        py-3

        transition-all
      "
    >

      {/* LEFT */}

      <div>

        <p
          className="
            text-[17px]
            font-bold

            text-[#0F172A]
            dark:text-white
          "
        >
          {item}
        </p>

        <p
          className="
            mt-1

            text-sm

            text-gray-500
            dark:text-gray-400
          "
        >
          {stock}
        </p>

      </div>

      {/* RIGHT */}

      <div
        className={`
          px-4
          py-2

          rounded-full

          text-sm
          font-bold

          ${
            danger
              ? `
                bg-red-500/10
                text-red-500
              `
              : `
                bg-orange-500/10
                text-orange-500
              `
          }
        `}
      >
        {percentage}
      </div>

    </div>

  );
}