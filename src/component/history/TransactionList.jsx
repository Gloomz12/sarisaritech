import { useState } from "react";

import TransactionCard from "./TransactionCard";

export default function TransactionList({ groupedTransactions }) {
  const entries = Object.entries(groupedTransactions);

  const [visibleCount, setVisibleCount] = useState(1);

  const visibleTransactions = entries.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {visibleTransactions.map(([date, transactions]) => {
        const total = transactions.reduce((sum, transaction) => sum + (transaction.total || 0), 0);

        return (
          <div key={date}>
            {/* DATE HEADER */}

            <div className="mb-3">
              <h2
                className="
                    text-[18px]
                    font-extrabold

                    text-[#172033]
                    dark:text-white
                  "
              >
                {date}
              </h2>

              <p
                className="
                    mt-1

                    text-[13px]

                    text-gray-400
                    dark:text-slate-500
                  "
              >
                {transactions.length} transactions
                {total > 0 && ` • ₱${total.toFixed(2)}`}
              </p>
            </div>

            {/* LIST */}

            <div className="space-y-2.5">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        );
      })}

      {/* LOAD MORE */}

      {visibleCount < entries.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            className="
              px-5
              py-2.5

              rounded-2xl

              bg-blue-500
              hover:bg-blue-600

              text-white
              text-sm
              font-semibold

              transition-all
              duration-300
            "
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}
