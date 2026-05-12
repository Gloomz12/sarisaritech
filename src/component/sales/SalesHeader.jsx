import {
  FiShoppingBag,
} from "react-icons/fi";

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

        border
        border-[#f3f4f6]

        px-7
        py-5

        shadow-sm
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

            border
            border-orange-100
          "
        >

          <div
            className="
              absolute

              inset-2.5

              rounded-[18px]

              border
              border-white/70
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