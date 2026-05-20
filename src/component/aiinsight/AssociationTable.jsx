import { useEffect, useState } from "react";

import { getApriori } from "../../services/aiInsightService";

export default function AssociationTable() {
  const [rules, setRules] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApriori();
  }, []);

  const loadApriori = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await getApriori();

      console.log("APRIORI RESPONSE:", response);

      const uniqueRules = [];

      const seen = new Set();

      const aprioriData = response?.rules || [];
      aprioriData.forEach((rule) => {
        const products = rule.products.join(",");

        const recommendations = rule.recommendation.join(",");

        const directKey = `${products}->${recommendations}`;

        const reverseKey = `${recommendations}->${products}`;

        if (!seen.has(directKey) && !seen.has(reverseKey)) {
          seen.add(directKey);

          uniqueRules.push(rule);
        }
      });

      setRules([]);

      setTimeout(() => {
        setRules(uniqueRules);
      }, 100);
    } catch (error) {
      console.error("APRIORI ERROR:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  /* LOADING */

  if (loading) {
    return (
      <div className="space-y-5">
        <div
          className="
            h-40

            animate-pulse

            rounded-3xl

            bg-gray-100
            dark:bg-[#0F172A]
          "
        />

        <div
          className="
            h-40

            animate-pulse

            rounded-3xl

            bg-gray-100
            dark:bg-[#0F172A]
          "
        />
      </div>
    );
  }

  /* EMPTY */

  if (!rules.length) {
    return (
      <div
        className="
          rounded-3xl

          bg-gray-50
          dark:bg-[#0F172A]

          p-10

          text-center
        "
      >
        <h2
          className="
            text-lg
            font-semibold

            text-gray-700
            dark:text-white
          "
        >
          No association rules found
        </h2>

        <p
          className="
            mt-2

            text-sm

            text-gray-400
            dark:text-slate-400
          "
        >
          More transactions are needed for Apriori analysis.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* REFRESH BUTTON */}

      <div className="mb-5 flex justify-end -mt-16">
        <button
          onClick={loadApriori}
          disabled={loading}
          className="
          rounded-2xl

          border
          border-orange-500/20

          bg-orange-500
          hover:bg-orange-600

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

          disabled:opacity-50
        "
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* RULES */}

      <div className="space-y-5">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="
              rounded-3xl

              border
              border-gray-100
              dark:border-[#1F2937]

              bg-white
              dark:bg-[#0F172A]

              p-6

              transition-all

              hover:shadow-lg
            "
          >
            <div
              className="
                flex
                flex-col
                gap-6

                xl:flex-row
                xl:items-center
                xl:justify-between
              "
            >
              {/* PRODUCTS */}

              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase

                    text-gray-400
                    dark:text-slate-500
                  "
                >
                  Frequently Bought Together
                </p>

                <div
                  className="
                    mt-4

                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >
                  {rule.products.map((item) => (
                    <span
                      key={item}
                      className="
                          rounded-2xl

                          bg-purple-100
                          dark:bg-purple-500/10

                          px-5
                          py-3

                          text-base
                          font-semibold

                          text-purple-700
                          dark:text-purple-300
                        "
                    >
                      {item}
                    </span>
                  ))}

                  <span
                    className="
                      text-2xl
                      font-light

                      text-gray-300
                      dark:text-slate-600
                    "
                  >
                    →
                  </span>

                  {rule.recommendation.map((item) => (
                    <span
                      key={item}
                      className="
                          rounded-2xl

                          bg-green-100
                          dark:bg-green-500/10

                          px-5
                          py-3

                          text-base
                          font-semibold

                          text-green-700
                          dark:text-green-300
                        "
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* METRICS */}

              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                "
              >
                {/* MATCH RATE */}

                <div
                  className="
                    min-w-[140px]

                    rounded-2xl

                    bg-gray-50
                    dark:bg-[#111827]

                    px-5
                    py-4
                  "
                >
                  <p
                    className="
                      text-sm
                      font-medium

                      text-gray-400
                      dark:text-slate-500
                    "
                  >
                    Match Rate
                  </p>

                  <h2
                    className="
                      mt-2

                      text-3xl
                      font-black

                      text-gray-900
                      dark:text-white
                    "
                  >
                    {Math.round(rule.support * 100)}%
                  </h2>

                  <p
                    className="
                      mt-2

                      text-xs

                      text-gray-400
                      dark:text-slate-500
                    "
                  >
                    Bought together
                  </p>
                </div>

                {/* BUY CHANCE */}

                <div
                  className="
                    min-w-[140px]

                    rounded-2xl

                    bg-gray-50
                    dark:bg-[#111827]

                    px-5
                    py-4
                  "
                >
                  <p
                    className="
                      text-sm
                      font-medium

                      text-gray-400
                      dark:text-slate-500
                    "
                  >
                    Buy Chance
                  </p>

                  <h2
                    className="
                      mt-2

                      text-3xl
                      font-black

                      text-gray-900
                      dark:text-white
                    "
                  >
                    {Math.round(rule.confidence * 100)}%
                  </h2>

                  <p
                    className="
                      mt-2

                      text-xs

                      text-gray-400
                      dark:text-slate-500
                    "
                  >
                    Chance customer buys both
                  </p>
                </div>

                {/* SALES STRENGTH */}

                <div
                  className="
                    min-w-[140px]

                    rounded-2xl

                    bg-gray-50
                    dark:bg-[#111827]

                    px-5
                    py-4
                  "
                >
                  <p
                    className="
                      text-sm
                      font-medium

                      text-gray-400
                      dark:text-slate-500
                    "
                  >
                    Sales Strength
                  </p>

                  <h2
                    className="
                      mt-2

                      text-3xl
                      font-black

                      text-gray-900
                      dark:text-white
                    "
                  >
                    {rule.lift}
                  </h2>

                  <p
                    className="
                      mt-2

                      text-xs

                      text-gray-400
                      dark:text-slate-500
                    "
                  >
                    Strong product pairing
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
