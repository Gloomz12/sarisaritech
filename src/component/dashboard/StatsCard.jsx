import { FiTrendingUp } from "react-icons/fi";

export default function StatsCard({ title, value, subtitle, growth, top, average }) {
  return (
    <div
      className="
        relative
        overflow-hidden

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
          from-[#F97316]
          via-[#FB923C]
          to-[#FDBA74]

          opacity-80
        "
      />

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
        "
      >
        <div>
          <p
            className="
              text-[15px]
              font-semibold

              text-gray-500
              dark:text-gray-400
            "
          >
            {title}
          </p>

          <h2
            className="
              text-[36px]
              leading-none

              font-black

              tracking-[-2px]

              mt-4

              text-orange-500
            "
          >
            {value}
          </h2>
        </div>

        {/* ICON */}

        <div
          className="
            w-12
            h-12

            rounded-2xl

            bg-orange-500/10

            flex
            items-center
            justify-center

            text-orange-500
            text-[20px]
          "
        >
          <FiTrendingUp />
        </div>
      </div>

      {/* SUBTITLE */}

      <div
        className="
          mt-7

          flex
          items-center
          justify-between
        "
      >
        <p
          className="
            text-[16px]
            font-semibold

            text-[#0F172A]
            dark:text-white
          "
        >
          {subtitle}
        </p>

        {/* GROWTH */}

        <span
          className="
            inline-flex
            items-center

            px-3
            py-1.5

            rounded-full

            bg-green-500/10

            text-green-500
            dark:text-green-400

            text-sm
            font-bold
          "
        >
          {growth}
        </span>
      </div>

      {/* AVERAGE SALE */}

      <div className="mt-4">
        <p
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          Average Sale:
          <span
            className="
              ml-1
              font-bold

              text-[#0F172A]
              dark:text-white
            "
          >
            {average}
          </span>
        </p>
      </div>

      {/* FOOTER */}

      <div
        className="
          border-t
          border-gray-100
          dark:border-white/5

          mt-7
          pt-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            flex-wrap
          "
        >
          <span
            className="
              text-xs
              font-semibold

              uppercase
              tracking-wide

              text-gray-400
            "
          >
            Best Seller
          </span>

          <div
            className="
              px-3
              py-1.5

              rounded-full

              bg-green-500/10

              text-green-600
              dark:text-green-400

              text-sm
              font-bold
            "
          >
            {top}
          </div>
        </div>
      </div>
    </div>
  );
}
