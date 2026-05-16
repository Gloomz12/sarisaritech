import { FiAlertTriangle, FiChevronRight } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

export default function StockAlertCard({ alerts = [] }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative
        overflow-hidden

         min-h-[287px]

        bg-white
        dark:bg-[#111827]

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
              w-11
              h-11

              rounded-2xl

              bg-red-500/10

              flex
              items-center
              justify-center

              text-red-500
              text-[18px]
            "
          >
            <FiAlertTriangle />
          </div>

          <div>
            <h3
              className="
                text-[20px]
                leading-none

                font-black

                tracking-[-0.5px]

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
          onClick={() => navigate("/restock")}
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

      <div className="mt-5 space-y-3">
        {alerts.length > 0 ? (
          alerts
            .slice(0, 3)
            .map((alert) => (
              <Alert
                key={alert.id}
                item={alert.name}
                stock={`${alert.stock} units left`}
                danger={alert.level === "critical"}
                percentage={alert.level === "critical" ? "Critical" : alert.level === "low" ? "Low" : "Medium"}
              />
            ))
        ) : (
          <div
            className="
              h-[120px]

              flex
              items-center
              justify-center

              rounded-2xl

              border
              border-dashed
              border-gray-200
              dark:border-white/10

              text-sm

              text-gray-400
            "
          >
            No low stock alerts
          </div>
        )}
      </div>
    </div>
  );
}

function Alert({ item, stock, danger, percentage }) {
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
        py-0.5

        transition-all
      "
    >
      {/* LEFT */}

      <div>
        <p
          className="
            text-[16px]
            font-bold

            text-[#0F172A]
            dark:text-white
          "
        >
          {item}
        </p>

        <p
          className="
            mt-0.5

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
          px-3
          py-1.5

          rounded-full

          text-xs
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
