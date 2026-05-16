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

      const filtered = response.filter((rule) => rule.products?.length && rule.recommendation?.length).slice(0, 3);

      setRules(filtered);
    } catch (error) {
      console.error("APRIORI CARD ERROR:", error);
    }
  };

  return (
    <div
      className="
      bg-white
      text-black
      rounded-2xl
      p-6
      border
      border-gray-100
    "
    >
      <h3 className="font-bold text-xl">Frequently Bought Together</h3>

      <div className="mt-6 space-y-4">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="
            flex
            items-center
            justify-between
          "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                w-3
                h-3
                rounded-full
                bg-purple-500
              "
              />

              <p className="font-medium text-lg">
                {rule.products?.[0]}
                {" + "}
                {rule.recommendation?.[0]}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">Buy Chance</p>

              <p
                className="
                text-blue-500
                font-bold
                text-lg
              "
              >
                {Math.round(Number(rule.confidence || 0) * 100)}%
              </p>
            </div>
          </div>
        ))}

        {!rules.length && <p className="text-sm text-gray-400">No association rules found.</p>}
      </div>
    </div>
  );
}
