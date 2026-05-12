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

        bg-[#fffaf5]

        rounded-[14px]

        p-2

        space-y-1.5
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
          "
        >
          TOTAL
        </span>

        <h1
          className="
            text-[18px]
            leading-none

            font-black

            text-orange-500
          "
        >
          ₱{subtotal}
        </h1>
      </div>

      {/* AMOUNT PAID */}

      <div>
        <p
          className="
            text-[9px]
            font-semibold

            text-gray-500

            mb-1
          "
        >
          Amount Paid
        </p>

        <input
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="
            w-full
            h-7

            rounded-[9px]

            border
            border-gray-200

            bg-white

            px-2.5

            outline-none

            font-semibold
            text-[11px]
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
        "
      >
        <span
          className="
            text-[11px]
            font-bold

            text-[#0F172A]
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
          ₱{change >= 0 ? change : 0}
        </h1>
      </div>

      {/* PAYMENT METHOD */}

      <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
    </div>
  );
}
