import { useEffect, useState } from "react";

import { getApriori } from "../../services/aiInsightService";

export default function AprioriCard() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    loadApriori();
  }, []);

  const loadApriori = async () => {
    try {
      const response = await getApriori();

      const uniqueRules = [];

      const seen = new Set();

      response.forEach((rule) => {
        const products = rule.products.join(",");

        const recommendations = rule.recommendation.join(",");

        const directKey = `${products}->${recommendations}`;

        const reverseKey = `${recommendations}->${products}`;

        if (!seen.has(directKey) && !seen.has(reverseKey)) {
          seen.add(directKey);

          uniqueRules.push(rule);
        }
      });

      setRules(uniqueRules.filter((rule) => rule.products?.length && rule.recommendation?.length).slice(0, 3));
    } catch (error) {
      console.error("APRIORI CARD ERROR:", error);
    }
  };

  return (
    <div
      className="
        rounded-3xl

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#0F172A]

        overflow-hidden
      "
    >
      {/* HEADER */}

      <div className="p-6 border-b border-gray-100 dark:border-[#1F2937]">
        <h3
          className="
            text-2xl
            font-bold

            text-gray-900
            dark:text-white
          "
        >
          Apriori Analysis
        </h3>

        <p
          className="
            mt-1

            text-sm

            text-gray-500
            dark:text-slate-400
          "
        >
          Frequently bought together products
        </p>
      </div>

      {/* RULES */}

      <div className="divide-y divide-gray-100 dark:divide-[#1F2937]">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="
              p-6

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

                    text-blue-500
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
        ))}

        {!rules.length && (
          <div className="p-10 text-center">
            <p
              className="
                text-sm

                text-gray-400
                dark:text-slate-500
              "
            >
              No association rules found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
