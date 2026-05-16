import QuickCashButtons from "./QuickCashButtons";
import PaymentMethod from "./PaymentMethod";

export default function PaymentSection({
  subtotal,

  amountPaid,

  setAmountPaid,

  paymentMethod,

  setPaymentMethod,
}) {
  const change = Number(amountPaid || 0) - Number(subtotal || 0);

  return (
    <div
      className="
        border
        border-orange-100
        dark:border-orange-500/10

        bg-[#fffaf5]
        dark:bg-[#1F2937]

        rounded-[16px]

        p-3

        space-y-2

        transition-all
        duration-300
      "
    >
      {/* TOTAL */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <span
          className="
            text-[12px]
            font-black

            text-[#0F172A]
            dark:text-white
          "
        >
          TOTAL
        </span>

        <h1
          className="
            text-[20px]
            leading-none

            font-black

            text-orange-500
          "
        >
          ₱{subtotal.toFixed(2)}
        </h1>
      </div>

      {/* AMOUNT PAID */}

      <div>
        <p
          className="
            mb-1

            text-[10px]
            font-semibold

            text-gray-500
            dark:text-gray-400
          "
        >
          Amount Paid
        </p>

        <input
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          placeholder="Enter payment amount"
          className="
            w-full
            h-9

            rounded-[10px]

            border
            border-gray-200
            dark:border-[#374151]

            bg-white
            dark:bg-[#111827]

            px-3

            outline-none

            font-semibold
            text-[12px]

            text-[#0F172A]
            dark:text-white

            placeholder:text-gray-400
            dark:placeholder:text-gray-500

            transition-all

            focus:border-orange-300
            focus:ring-2
            focus:ring-orange-100
          "
        />
      </div>

      {/* QUICK CASH */}

      <QuickCashButtons amountPaid={amountPaid} setAmountPaid={setAmountPaid} />

      {/* CHANGE */}

      <div
        className="
          flex
          items-center
          justify-between

          rounded-[10px]

          bg-white
          dark:bg-[#111827]

          border
          border-green-100
          dark:border-green-500/10

          px-3
          py-2

          transition-all
          duration-300
        "
      >
        <span
          className="
            text-[11px]
            font-bold

            text-[#0F172A]
            dark:text-white
          "
        >
          CHANGE
        </span>

        <h1
          className="
            text-[16px]

            font-black

            text-green-500
          "
        >
          ₱{change >= 0 ? change.toFixed(2) : "0.00"}
        </h1>
      </div>

      {/* PAYMENT METHOD */}

      <div className="pt-1">
        <p
          className="
            mb-1.5

            text-[10px]
            font-semibold

            text-gray-500
            dark:text-gray-400
          "
        >
          Payment Method
        </p>

        <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
      </div>
    </div>
  );
}
