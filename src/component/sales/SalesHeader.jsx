import { FiShoppingBag } from "react-icons/fi";

export default function SalesHeader() {
  return (
    <div
      className="
        relative
        overflow-hidden

        rounded-[28px]

        bg-gradient-to-br
        from-white
        to-[#fffaf5]

        dark:from-[#111827]
        dark:to-[#0F172A]

        border
        border-[#f3f4f6]
        dark:border-[#1F2937]

        px-7
        py-5

        shadow-sm

        transition-all
        duration-300
      "
    >
      {/* GLOW */}

      <div
        className="
          absolute
          -top-14
          -right-14

          w-[150px]
          h-[150px]

          rounded-full

          bg-orange-100/30
          dark:bg-orange-500/10

          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between
        "
      >
        {/* LEFT */}

        <div>
          {/* TITLE */}

          <h2
            className="
              text-[48px]
              leading-[0.95]

              tracking-[-2px]

              font-black

              text-[#071437]
              dark:text-white
            "
          >
            Record Sales
          </h2>

          {/* SUBTITLE */}

          <p
            className="
              mt-3

              max-w-[780px]

              text-[16px]
              leading-relaxed

              text-gray-500
              dark:text-gray-400

              font-medium

              whitespace-nowrap
            "
          >
            Process customer purchases, manage checkout, and complete transactions faster.
          </p>
        </div>

        {/* RIGHT ICON */}

        <div
          className="
            hidden
            xl:flex

            relative

            items-center
            justify-center

            w-[84px]
            h-[84px]

            rounded-[24px]

            bg-gradient-to-br
            from-orange-50
            to-[#fff4e8]

            dark:from-orange-500/10
            dark:to-orange-500/5

            border
            border-orange-100
            dark:border-orange-500/10
          "
        >
          <div
            className="
              absolute

              inset-2.5

              rounded-[18px]

              border
              border-white/70
              dark:border-white/5
            "
          />

          <FiShoppingBag
            className="
              relative
              z-10

              text-[34px]

              text-orange-500
            "
          />
        </div>
      </div>
    </div>
  );
}
