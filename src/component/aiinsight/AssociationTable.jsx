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

      setRules([]);

      setTimeout(() => {
        setRules(uniqueRules.slice(0, 5));
      }, 100);
    } catch (error) {
      console.error("APRIORI ERROR:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div
          className="
          h-40
          rounded-3xl
          bg-gray-100
          animate-pulse
        "
        />

        <div
          className="
          h-40
          rounded-3xl
          bg-gray-100
          animate-pulse
        "
        />
      </div>
    );
  }

  if (!rules.length) {
    return (
      <div
        className="
        bg-gray-50
        rounded-3xl
        p-10
        text-center
      "
      >
        <h2
          className="
          text-lg
          font-semibold
          text-gray-700
        "
        >
          No association rules found
        </h2>

        <p
          className="
          text-sm
          text-gray-400
          mt-2
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
      <div className="flex justify-end -mt-16 mb-5">
        <button
          onClick={loadApriori}
          disabled={loading}
          className="
          px-6
          py-3
          rounded-2xl
          bg-gray-100
          hover:bg-gray-200
          disabled:opacity-50
          text-sm
          font-medium
          transition-all
        "
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="space-y-5">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="
            bg-white
            border
            border-gray-100
            rounded-3xl
            p-6
            hover:shadow-lg
            transition-all
          "
          >
            <div
              className="
              flex
              flex-col
              xl:flex-row
              xl:items-center
              xl:justify-between
              gap-6
            "
            >
              {/* PRODUCTS */}
              <div>
                <p
                  className="
                  text-xs
                  uppercase
                  text-gray-400
                  font-semibold
                "
                >
                  Frequently Bought Together
                </p>

                <div
                  className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                  mt-4
                "
                >
                  {rule.products.map((item) => (
                    <span
                      key={item}
                      className="
                        px-5
                        py-3
                        rounded-2xl
                        bg-purple-100
                        text-purple-700
                        text-base
                        font-semibold
                      "
                    >
                      {item}
                    </span>
                  ))}

                  <span
                    className="
                    text-2xl
                    text-gray-300
                    font-light
                  "
                  >
                    →
                  </span>

                  {rule.recommendation.map((item) => (
                    <span
                      key={item}
                      className="
                        px-5
                        py-3
                        rounded-2xl
                        bg-green-100
                        text-green-700
                        text-base
                        font-semibold
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
                  bg-gray-50
                  rounded-2xl
                  px-5
                  py-4
                  min-w-[140px]
                "
                >
                  <p
                    className="
                    text-sm
                    text-gray-400
                    font-medium
                  "
                  >
                    Match Rate
                  </p>

                  <h2
                    className="
                    text-3xl
                    font-black
                    text-gray-900
                    mt-2
                  "
                  >
                    {Math.round(rule.support * 100)}%
                  </h2>

                  <p
                    className="
                    text-xs
                    text-gray-400
                    mt-2
                  "
                  >
                    Bought together
                  </p>
                </div>

                {/* BUY CHANCE */}
                <div
                  className="
                  bg-gray-50
                  rounded-2xl
                  px-5
                  py-4
                  min-w-[140px]
                "
                >
                  <p
                    className="
                    text-sm
                    text-gray-400
                    font-medium
                  "
                  >
                    Buy Chance
                  </p>

                  <h2
                    className="
                    text-3xl
                    font-black
                    text-gray-900
                    mt-2
                  "
                  >
                    {Math.round(rule.confidence * 100)}%
                  </h2>

                  <p
                    className="
                    text-xs
                    text-gray-400
                    mt-2
                  "
                  >
                    Chance customer buys both
                  </p>
                </div>

                {/* SALES STRENGTH */}
                <div
                  className="
                  bg-gray-50
                  rounded-2xl
                  px-5
                  py-4
                  min-w-[140px]
                "
                >
                  <p
                    className="
                    text-sm
                    text-gray-400
                    font-medium
                  "
                  >
                    Sales Strength
                  </p>

                  <h2
                    className="
                    text-3xl
                    font-black
                    text-gray-900
                    mt-2
                  "
                  >
                    {rule.lift}
                  </h2>

                  <p
                    className="
                    text-xs
                    text-gray-400
                    mt-2
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
