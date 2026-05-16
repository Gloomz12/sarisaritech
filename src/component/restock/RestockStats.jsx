// RestockStats.jsx

import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function RestockStats({ criticalCount, lowCount, goodCount }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4

        xl:grid-cols-3
      "
    >
      {/* CRITICAL */}

      <div
        className="
          rounded-[26px]

          border
          border-red-100
          dark:border-red-500/10

          bg-[#FFF5F5]
          dark:bg-red-500/5

          px-5
          py-4

          transition-all
          duration-300
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-full

              bg-red-100
              dark:bg-red-500/10
            "
          >
            <ShieldAlert
              className="
                text-red-500
                dark:text-red-400
              "
              size={20}
            />
          </div>

          <div>
            <h2
              className="
                text-[28px]
                leading-none

                font-black

                text-[#0F172A]
                dark:text-white
              "
            >
              {criticalCount}
            </h2>

            <p
              className="
                mt-1

                text-[15px]
                font-medium

                text-slate-700
                dark:text-gray-300
              "
            >
              Critical
            </p>

            <p
              className="
                mt-1.5

                text-[12px]

                text-slate-500
                dark:text-gray-500
              "
            >
              Items need immediate restocking
            </p>
          </div>
        </div>
      </div>

      {/* LOW STOCK */}

      <div
        className="
          rounded-[26px]

          border
          border-yellow-100
          dark:border-yellow-500/10

          bg-[#FFFBEF]
          dark:bg-yellow-500/5

          px-5
          py-4

          transition-all
          duration-300
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-full

              bg-yellow-100
              dark:bg-yellow-500/10
            "
          >
            <AlertTriangle
              className="
                text-yellow-500
                dark:text-yellow-400
              "
              size={20}
            />
          </div>

          <div>
            <h2
              className="
                text-[28px]
                leading-none

                font-black

                text-[#0F172A]
                dark:text-white
              "
            >
              {lowCount}
            </h2>

            <p
              className="
                mt-1

                text-[15px]
                font-medium

                text-slate-700
                dark:text-gray-300
              "
            >
              Low Stock
            </p>

            <p
              className="
                mt-1.5

                text-[12px]

                text-slate-500
                dark:text-gray-500
              "
            >
              Items running low on stock
            </p>
          </div>
        </div>
      </div>

      {/* GOOD */}

      <div
        className="
          rounded-[26px]

          border
          border-green-100
          dark:border-green-500/10

          bg-[#F4FFF7]
          dark:bg-green-500/5

          px-5
          py-4

          transition-all
          duration-300
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-full

              bg-green-100
              dark:bg-green-500/10
            "
          >
            <CheckCircle2
              className="
                text-green-500
                dark:text-green-400
              "
              size={20}
            />
          </div>

          <div>
            <h2
              className="
                text-[28px]
                leading-none

                font-black

                text-[#0F172A]
                dark:text-white
              "
            >
              {goodCount}
            </h2>

            <p
              className="
                mt-1

                text-[15px]
                font-medium

                text-slate-700
                dark:text-gray-300
              "
            >
              Good
            </p>

            <p
              className="
                mt-1.5

                text-[12px]

                text-slate-500
                dark:text-gray-500
              "
            >
              Well-stocked inventory items
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
