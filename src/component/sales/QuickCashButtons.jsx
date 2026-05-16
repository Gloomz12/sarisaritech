export default function QuickCashButtons({ amountPaid, setAmountPaid }) {
  const amounts = [5, 10, 20, 50, 100, 500];

  const handleAddAmount = (value) => {
    setAmountPaid(Number(amountPaid || 0) + value);
  };

  return (
    <div
      className="
        grid
        grid-cols-3
        gap-1.5
      "
    >
      {amounts.map((amount) => (
        <button
          key={amount}
          onClick={() => handleAddAmount(amount)}
          className="
            h-8

            rounded-[10px]

            border
            border-gray-200
            dark:border-[#374151]

            bg-white
            dark:bg-[#111827]

            text-[11px]
            font-bold

            text-[#0F172A]
            dark:text-white

            hover:bg-orange-50
            dark:hover:bg-orange-500/10

            hover:border-orange-300

            transition-all
            duration-300
          "
        >
          ₱{amount}
        </button>
      ))}
    </div>
  );
}
