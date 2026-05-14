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
          rounded-[24px]
          border
          border-red-100
          bg-[#FFF5F5]

          px-5
          py-4
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
            "
          >
            <ShieldAlert className="text-red-500" size={20} />
          </div>

          <div>
            <h2
              className="
                text-[28px]
                leading-none
                font-black
                text-[#0F172A]
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
              "
            >
              Critical
            </p>

            <p
              className="
                mt-1.5
                text-[12px]
                text-slate-500
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
          rounded-[24px]
          border
          border-yellow-100
          bg-[#FFFBEF]

          px-5
          py-4
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
            "
          >
            <AlertTriangle className="text-yellow-500" size={20} />
          </div>

          <div>
            <h2
              className="
                text-[28px]
                leading-none
                font-black
                text-[#0F172A]
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
              "
            >
              Low Stock
            </p>

            <p
              className="
                mt-1.5
                text-[12px]
                text-slate-500
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
          rounded-[24px]
          border
          border-green-100
          bg-[#F4FFF7]

          px-5
          py-4
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
            "
          >
            <CheckCircle2 className="text-green-500" size={20} />
          </div>

          <div>
            <h2
              className="
                text-[28px]
                leading-none
                font-black
                text-[#0F172A]
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
              "
            >
              Good
            </p>

            <p
              className="
                mt-1.5
                text-[12px]
                text-slate-500
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
