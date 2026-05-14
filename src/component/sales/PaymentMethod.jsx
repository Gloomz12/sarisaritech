// PaymentMethod.jsx

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
                `
                : `
                  bg-white
                  border-gray-200
                  text-[#0F172A]
                  hover:border-orange-300
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
