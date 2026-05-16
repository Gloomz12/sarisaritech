export default function ProductStatusBadge({ status }) {
  return (
    <span
      className={`
        inline-flex

        items-center
        justify-center

        min-w-[120px]

        px-3
        py-1.5

        rounded-full

        text-[13px]
        font-semibold

        transition-all
        duration-300

        ${
          status === "In Stock"
            ? `
              bg-green-100
              dark:bg-green-500/10

              text-green-700
              dark:text-green-400
            `
            : status === "Low Stock"
              ? `
                bg-orange-100
                dark:bg-orange-500/10

                text-orange-700
                dark:text-orange-400
              `
              : `
                bg-red-100
                dark:bg-red-500/10

                text-red-700
                dark:text-red-400
              `
        }
      `}
    >
      {status}
    </span>
  );
}
