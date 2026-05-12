import { FiCheckCircle } from "react-icons/fi";

export default function SaleSuccessAlert() {
  return (
    <div
      className="
        bg-green-50

        border
        border-green-100

        rounded-2xl

        p-4

        flex
        items-center
        gap-3
      "
    >
      <FiCheckCircle
        className="
          text-2xl
          text-green-500
        "
      />

      <div>
        <h1
          className="
            font-black

            text-green-700
          "
        >
          Payment successful!
        </h1>

        <p
          className="
            text-sm
            text-green-600
          "
        >
          Change to return: ₱4
        </p>
      </div>
    </div>
  );
}
