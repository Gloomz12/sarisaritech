import { useState } from "react";

export default function PaymentMethod() {
  const [method, setMethod] = useState("Cash");

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
          onClick={() => setMethod(item)}
          className={`
              h-[30px]

              rounded-[9px]

              border

              text-[10px]
              font-semibold

              transition-all
              duration-300

              ${
                method === item
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
          {item}
        </button>
      ))}
    </div>
  );
}
