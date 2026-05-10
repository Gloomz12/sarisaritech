import {
  FiTrendingUp,
} from "react-icons/fi";

export default function StatsCard({
  title,
  value,
  subtitle,
  growth,
  top,
}) {

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

              text-orange-500

              mt-5
            "
          >
            {value}
          </h2>

        </div>

        {/* ICON */}

        <div
          className="
            w-14
            h-14

            rounded-2xl

            bg-orange-500/10

            flex
            items-center
            justify-center

            text-orange-500
            text-[24px]
          "
        >
          <FiTrendingUp />
        </div>

      </div>

      {/* SUBTITLE */}

      <p
        className="
          mt-6

          text-[18px]
          font-semibold

          text-[#0F172A]
          dark:text-white
        "
      >
        {subtitle}
      </p>

      {/* GROWTH */}

      <div className="mt-5">

        <span
          className="
            inline-flex
            items-center

            px-4
            py-2

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

      {/* FOOTER */}

      <div
        className="
          border-t
          border-gray-100
          dark:border-white/5

          mt-6
          pt-5
        "
      >

        <p
          className="
            text-[15px]
            font-semibold

            text-green-600
            dark:text-green-400
          "
        >
          {top}
        </p>

      </div>

    </div>
  );
}