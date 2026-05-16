export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  const methods = ["Cash", "GCash", "Paymaya"];

  return (
    <div
      className="
        grid
        grid-cols-3
        gap-1
      "
    >
      {methods.map((item) => (
        <button
          key={item}
          onClick={() => setPaymentMethod(item)}
          className={`
            h-[30px]

            rounded-[9px]

            border

            text-[10px]
            font-semibold

            transition-all
            duration-300

            ${
              paymentMethod === item
                ? `
                  bg-orange-500
                  border-orange-500
                  text-white

                  shadow-sm
                  shadow-orange-500/20
                `
                : `
                  bg-white
                  dark:bg-[#111827]

                  border-gray-200
                  dark:border-[#374151]

                  text-[#0F172A]
                  dark:text-white

                  hover:border-orange-300
                  dark:hover:border-orange-500/40

                  hover:bg-orange-50
                  dark:hover:bg-orange-500/10
                `
            }
          `}
        >
          {item === "Paymaya" ? "PayMaya" : item}
        </button>
      ))}
    </div>
  );
}
