import { useEffect, useState } from "react";

import RestockTable from "./RestockTable";

import { getRestockRecommendations } from "../../services/aiInsightService";

export default function RestockSection() {
  const [loading, setLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const loadRestock = async () => {
    try {
      setLoading(true);

      await getRestockRecommendations();

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("RESTOCK ERROR:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  return (
    <section
      id="restock-section"
      className="
        rounded-3xl

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        p-6

        shadow-sm

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-4

          flex
          items-start
          justify-between
          gap-4
        "
      >
        {/* LEFT */}

        <div>
          <h2
            className="
              text-2xl
              font-bold

              text-gray-900
              dark:text-white
            "
          >
            Restock Recommendations
          </h2>

          <p
            className="
              mt-1

              text-sm

              text-gray-500
              dark:text-slate-400
            "
          >
            AI-powered inventory suggestions
          </p>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {/* REFRESH */}

          <button
            onClick={loadRestock}
            disabled={loading}
            className="
              rounded-2xl

              bg-orange-500

              px-6
              py-3

              text-sm
              font-bold
              text-white

              shadow-lg
              shadow-orange-500/20

              transition-all
              duration-300

              hover:scale-[1.02]
              hover:bg-orange-600

              active:scale-[0.98]

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* TABLE */}

      <RestockTable key={refreshKey} />
    </section>
  );
}
