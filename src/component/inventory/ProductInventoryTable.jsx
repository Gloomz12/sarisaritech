import { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import InventoryTableRow from "./InventoryTableRow";

export default function ProductInventoryTable({
  products,

  onEdit,

  onDelete,

  onView,
}) {
  /* ITEMS PER PAGE */

  const ITEMS_PER_PAGE = 10;

  /* PAGE STATE */

  const [currentPage, setCurrentPage] = useState(1);

  /* PAGINATION */

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentProducts = products.slice(startIndex, endIndex);

  /* PAGE CONTROLS */

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      className="
        overflow-visible

        rounded-[26px]

        border
        border-[#eef2f7]
        dark:border-[#1F2937]

        bg-white

        dark:bg-gradient-to-b
        dark:from-[#111827]
        dark:to-[#0F172A]

        shadow-[0_1px_2px_rgba(16,24,40,0.04)]

        transition-all
        duration-300
      "
    >
      {/* TABLE */}

      <div
        className="
          min-h-[500px]

          overflow-visible

          px-6
        "
      >
        <table
          className="
            w-full

            table-fixed

            border-collapse
          "
        >
          {/* HEADER */}

          <thead
            className="
              bg-white
              dark:bg-transparent
            "
          >
            <tr
              className="
                border-b
                border-[#eef2f7]
                dark:border-[#1F2937]
              "
            >
              {/* PRODUCT */}

              <th
                className="
                  w-[30%]

                  py-5
                  pl-5

                  text-left

                  text-[14px]
                  font-semibold

                  text-[#64748b]
                  dark:text-gray-400
                "
              >
                Product
              </th>

              {/* STOCK */}

              <th
                className="
                  w-[14%]

                  py-5

                  text-left

                  text-[14px]
                  font-semibold

                  text-[#64748b]
                  dark:text-gray-400
                "
              >
                Stock
              </th>

              {/* COST */}

              <th
                className="
                  w-[12%]

                  py-5

                  text-left

                  text-[14px]
                  font-semibold

                  text-[#64748b]
                  dark:text-gray-400
                "
              >
                Cost
              </th>

              {/* SELLING */}

              <th
                className="
                  w-[12%]

                  py-5

                  text-left

                  text-[14px]
                  font-semibold

                  text-[#64748b]
                  dark:text-gray-400
                "
              >
                Selling
              </th>

              {/* STATUS */}

              <th
                className="
                  w-[18%]

                  py-5

                  text-center

                  text-[14px]
                  font-semibold

                  text-[#64748b]
                  dark:text-gray-400
                "
              >
                Status
              </th>

              {/* ACTIONS */}

              <th
                className="
                  w-[8%]

                  py-5

                  text-center

                  text-[14px]
                  font-semibold

                  text-[#64748b]
                  dark:text-gray-400
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* BODY */}

          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <InventoryTableRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} onView={onView} />
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="
                    py-20

                    text-center

                    text-[15px]
                    font-medium

                    text-[#94a3b8]
                    dark:text-gray-500
                  "
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}

      <div
        className="
          flex
          items-center
          justify-between

          border-t
          border-[#eef2f7]
          dark:border-[#1F2937]

          px-6
          py-5
        "
      >
        {/* INFO */}

        <p
          className="
            text-[13px]
            font-medium

            text-[#64748b]
            dark:text-gray-400
          "
        >
          Showing{" "}
          <span
            className="
              font-bold

              text-[#0f172a]
              dark:text-white
            "
          >
            {products.length === 0 ? 0 : startIndex + 1}
          </span>{" "}
          to{" "}
          <span
            className="
              font-bold

              text-[#0f172a]
              dark:text-white
            "
          >
            {Math.min(endIndex, products.length)}
          </span>{" "}
          of{" "}
          <span
            className="
              font-bold

              text-[#0f172a]
              dark:text-white
            "
          >
            {products.length}
          </span>
        </p>

        {/* PAGINATION */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {/* PREV */}

          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="
              flex
              h-12
              w-12

              items-center
              justify-center

              rounded-2xl

              border
              border-[#e2e8f0]
              dark:border-[#374151]

              bg-white
              dark:bg-[#111827]

              text-[#475569]
              dark:text-gray-300

              transition-all
              duration-200

              hover:border-orange-200
              dark:hover:border-orange-500/20

              hover:text-orange-500

              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronLeft size={18} />
          </button>

          {/* PAGE NUMBERS */}

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => {
              const page = index + 1;

              const active = currentPage === page;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    h-12
                    w-12

                    rounded-2xl

                    text-[14px]
                    font-semibold

                    transition-all
                    duration-200

                    ${
                      active
                        ? `
                          bg-orange-500
                          text-white
                          shadow-sm
                        `
                        : `
                          border
                          border-[#e2e8f0]
                          dark:border-[#374151]

                          bg-white
                          dark:bg-[#111827]

                          text-[#0f172a]
                          dark:text-white

                          hover:border-orange-200
                          dark:hover:border-orange-500/20

                          hover:text-orange-500
                        `
                    }
                  `}
                >
                  {page}
                </button>
              );
            }
          )}

          {/* NEXT */}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="
              flex
              h-12
              w-12

              items-center
              justify-center

              rounded-2xl

              border
              border-[#e2e8f0]
              dark:border-[#374151]

              bg-white
              dark:bg-[#111827]

              text-[#475569]
              dark:text-gray-300

              transition-all
              duration-200

              hover:border-orange-200
              dark:hover:border-orange-500/20

              hover:text-orange-500

              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
