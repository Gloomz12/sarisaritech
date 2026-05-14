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

      // KEEP OLD INSIGHTS
      alert("Unable to generate new AI insights right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="gemini-section"
      className="
      bg-white
      rounded-3xl
      border
      border-gray-100
      p-6
      shadow-sm
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
          <h2 className="text-2xl font-bold text-gray-900">AI Store Consultant</h2>

          <p className="text-sm text-gray-500 mt-1">Gemini AI-generated recommendations</p>

          {/* REFRESH BUTTON */}
          <button
            onClick={loadInsights}
            disabled={loading}
            className="
            mt-4
            px-4
            py-2
            rounded-2xl
            bg-purple-600
            hover:bg-purple-700
            disabled:opacity-60
            disabled:cursor-not-allowed
            text-white
            text-sm
            font-medium
            transition-all
            duration-200
          "
          >
            {loading ? "Generating..." : "Refresh Insights"}
          </button>
        </div>

        <div
          className="
          h-14
          w-14
          rounded-3xl
          bg-purple-100
          flex
          items-center
          justify-center
          text-2xl
          shrink-0
        "
        >
          🤖
        </div>
      </div>

      {/* AI RESPONSE */}
      <div
        className="
        mt-6
        bg-gradient-to-r
        from-purple-600
        to-violet-500
        rounded-3xl
        p-6
        text-white
      "
      >
        <h3 className="text-xl font-semibold">Gemini AI Analysis</h3>

        <p className="text-purple-100 text-sm mt-1">Generated from forecast and Apriori analytics</p>

        <div
          className="
          mt-6
          bg-white/10
          rounded-2xl
          p-5
          backdrop-blur-sm
          min-h-[120px]
        "
        >
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-white/20 animate-pulse" />

              <div className="h-4 rounded-full bg-white/20 animate-pulse w-11/12" />

              <div className="h-4 rounded-full bg-white/20 animate-pulse w-10/12" />

              <div className="h-4 rounded-full bg-white/20 animate-pulse w-8/12" />
            </div>
          ) : (
            <p
              className="
              text-sm
              leading-relaxed
              whitespace-pre-line
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
