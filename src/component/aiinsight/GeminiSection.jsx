import { useState } from "react";

import { getGeminiInsights } from "../../services/aiInsightService";

export default function GeminiSection() {
  const [insights, setInsights] = useState(() => {
    return localStorage.getItem("gemini_insights") || "Click refresh to generate AI insights.";
  });

  const [loading, setLoading] = useState(false);

  const loadInsights = async () => {
    try {
      setLoading(true);

      const response = await getGeminiInsights();

      console.log("GEMINI RESPONSE:", response);

      const newInsights = response?.insights || "No AI insights available.";

      setInsights(newInsights);

      localStorage.setItem("gemini_insights", newInsights);
    } catch (error) {
      console.error("GEMINI ERROR:", error);

      alert("Unable to generate new AI insights right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="gemini-section"
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
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-bold

              text-gray-900
              dark:text-white
            "
          >
            AI Store Consultant
          </h2>

          <p
            className="
              mt-1

              text-sm

              text-gray-500
              dark:text-slate-400
            "
          >
            Gemini AI-generated recommendations
          </p>

          {/* BUTTON */}

          <button
            onClick={loadInsights}
            disabled={loading}
            className="
              mt-4

              rounded-2xl

              bg-purple-600
              hover:bg-purple-700

              px-5
              py-2.5

              text-sm
              font-semibold
              text-white

              shadow-lg
              shadow-purple-500/20

              transition-all
              duration-300

              hover:scale-[1.02]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? "Generating..." : "Refresh Insights"}
          </button>
        </div>

        {/* ICON */}

        <div
          className="
            flex
            h-16
            w-16
            shrink-0
            items-center
            justify-center

            rounded-3xl

            bg-purple-100
            dark:bg-purple-500/10

            text-3xl
          "
        >
          🤖
        </div>
      </div>

      {/* AI RESPONSE */}

      <div
        className="
          mt-6

          rounded-3xl

          border
          border-purple-500/20

          bg-gradient-to-br
          from-[#5B21B6]
          via-[#6D28D9]
          to-[#4C1D95]

          p-6

          text-white

          shadow-xl
          shadow-purple-900/20
        "
      >
        <h3
          className="
            text-xl
            font-bold
          "
        >
          Gemini AI Analysis
        </h3>

        <p
          className="
            mt-1

            text-sm

            text-purple-100
          "
        >
          Generated from forecast and Apriori analytics
        </p>

        {/* CONTENT */}

        <div
          className="
            mt-6

            min-h-[140px]

            rounded-2xl

            bg-white/5

            p-5

            backdrop-blur-sm
          "
        >
          {loading ? (
            <div className="space-y-3">
              <div
                className="
                  h-4

                  animate-pulse

                  rounded-full

                  bg-white/10
                "
              />

              <div
                className="
                  h-4
                  w-11/12

                  animate-pulse

                  rounded-full

                  bg-white/10
                "
              />

              <div
                className="
                  h-4
                  w-10/12

                  animate-pulse

                  rounded-full

                  bg-white/10
                "
              />

              <div
                className="
                  h-4
                  w-8/12

                  animate-pulse

                  rounded-full

                  bg-white/10
                "
              />
            </div>
          ) : (
            <p
              className="
                whitespace-pre-line

                text-[15px]
                leading-relaxed

                text-white/90
              "
            >
              {insights.replace(/\*\*/g, "").replace(/\\n/g, "\n")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
