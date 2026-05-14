import TransactionCard from "./TransactionCard";

export default function TransactionList({ groupedTransactions }) {
  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, transactions]) => {
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
                  "
              >
                {date}
              </h2>

              <p
                className="
                    mt-1
                    text-[13px]
                    text-gray-400
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
    </div>
  );
}
