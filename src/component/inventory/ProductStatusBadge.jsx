export default function ProductStatusBadge({ status }) {
  return (
    <span
      className={`
        px-3
        py-1

        rounded-full
        text-sm
        font-medium

        ${
          status === "In Stock"
            ? "bg-green-100 text-green-700"
            : status === "Low Stock"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700"
        }
      `}
    >
      {status}
    </span>
  );
}
