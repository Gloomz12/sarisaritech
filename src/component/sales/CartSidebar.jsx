import { FiShoppingCart, FiCheckCircle } from "react-icons/fi";

import CartItem from "./CartItem";
import PaymentSection from "./PaymentSection";

export default function CartSidebar({
  cart,

  clearCart,
  subtotal,
  increaseQuantity,
  decreaseQuantity,
  onCompleteSale,
  loading,
  amountPaid,
  setAmountPaid,
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <div
      className="
        bg-white
        dark:bg-[#111827]

        border
        border-gray-200
        dark:border-[#1F2937]

        rounded-[24px]

        p-3

        h-full
        overflow-hidden

        flex
        flex-col

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between

          shrink-0
        "
      >
        <h1
          className="
            text-[16px]
            font-black

            tracking-[-1px]

            text-[#0F172A]
            dark:text-white
          "
        >
          Cart ({cart.length})
        </h1>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="
              text-[13px]

              text-orange-500
              font-bold

              hover:text-orange-600

              transition-all
            "
          >
            Clear
          </button>
        )}
      </div>

      {/* EMPTY */}

      {cart.length === 0 ? (
        <div
          className="
            flex-1

            flex
            flex-col
            items-center
            justify-center
          "
        >
          <div
            className="
              w-12
              h-12

              rounded-full

              bg-orange-100
              dark:bg-orange-500/10

              flex
              items-center
              justify-center
            "
          >
            <FiShoppingCart
              className="
                text-[22px]
                text-orange-500
              "
            />
          </div>

          <h1
            className="
              mt-4

              text-[16px]
              font-black

              text-[#0F172A]
              dark:text-white
            "
          >
            Your cart is empty
          </h1>

          <p
            className="
              mt-1.5

              text-[13px]

              text-gray-500
              dark:text-gray-400

              text-center
            "
          >
            Add products to begin sale
          </p>
        </div>
      ) : (
        <div
          className="
            flex
            flex-col
            flex-1

            mt-3

            min-h-0
            overflow-hidden
          "
        >
          {/* CART ITEMS */}

          <div
            className="
              flex-1
              min-h-0

              overflow-y-auto

              pr-1
              pb-2

              space-y-2
            "
          >
            {cart.map((item) => (
              <CartItem key={item.id} item={item} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} />
            ))}
          </div>

          {/* PAYMENT */}

          <div
            className="
              pt-2.5
              mt-2.5

              border-t
              border-gray-100
              dark:border-[#1F2937]

              space-y-2

              shrink-0
            "
          >
            <PaymentSection
              subtotal={subtotal}
              amountPaid={amountPaid}
              setAmountPaid={setAmountPaid}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            {/* COMPLETE SALE */}

            <button
              onClick={onCompleteSale}
              disabled={cart.length === 0 || loading}
              className="
                w-full
                h-11

                rounded-[16px]

                bg-orange-500
                hover:bg-orange-600

                disabled:opacity-50

                text-white
                font-semibold
                text-[13px]

                transition-all
                duration-300

                active:scale-[0.98]

                shadow-lg
                shadow-orange-500/20

                hover:shadow-orange-500/40

                flex
                items-center
                justify-center
                gap-2
              "
            >
              <FiCheckCircle className="text-[15px]" />

              {loading ? "Processing..." : "Complete Sale"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
