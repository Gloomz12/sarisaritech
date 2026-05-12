// QuickCashButtons.jsx

export default function QuickCashButtons({
  amountPaid,
  setAmountPaid,
}) {

  const amounts = [
    5,
    10,
    20,
    50,
    100,
    500,
  ];

  const handleAddAmount = (
    value
  ) => {

    setAmountPaid(
      Number(amountPaid || 0) +
      value
    );

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

          onClick={() =>
            handleAddAmount(
              amount
            )
          }

          className="
            h-8

            rounded-[10px]

            border
            border-gray-200

            bg-white

            text-[11px]
            font-bold

            text-[#0F172A]

            hover:bg-orange-50

            transition
          "
        >
          ₱{amount}
        </button>

      ))}

    </div>

  );

}