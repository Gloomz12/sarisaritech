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
        bg-white
        shadow-[0_1px_2px_rgba(16,24,40,0.04)]
      "
    >
      {/* TABLE */}

      <div
        className="
          min-h-[720px]
          px-6
          overflow-visible
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

          <thead className="bg-white">
            <tr className="border-b border-[#eef2f7]">
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
          flex-wrap
          items-center
          justify-between
          gap-4
          border-t
          border-[#eef2f7]
          px-7
          py-5
        "
      >
        {/* INFO */}

        <p
          className="
            text-[14px]
            font-medium
            text-[#64748b]
          "
        >
          Showing <span className="font-bold text-[#0f172a]">{products.length === 0 ? 0 : startIndex + 1}</span> to{" "}
          <span className="font-bold text-[#0f172a]">{Math.min(endIndex, products.length)}</span> of{" "}
          <span className="font-bold text-[#0f172a]">{products.length}</span> products
        </p>

        {/* PAGINATION */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {/* PREVIOUS */}

          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-2xl
              border
              border-[#e2e8f0]
              bg-white
              px-4
              text-[14px]
              font-semibold
              text-[#475569]

              transition-all
              duration-200

              hover:border-orange-200
              hover:text-orange-500

              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronLeft size={17} />
            Previous
          </button>

          {/* PAGE */}

          <div
            className="
              rounded-2xl
              bg-[#f8fafc]
              px-5
              py-3
              text-[14px]
              font-semibold
              text-[#475569]
            "
          >
            Page <span className="text-[#0f172a]">{currentPage}</span> of <span className="text-[#0f172a]">{totalPages || 1}</span>
          </div>

          {/* NEXT */}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-2xl
              border
              border-[#e2e8f0]
              bg-white
              px-4
              text-[14px]
              font-semibold
              text-[#475569]

              transition-all
              duration-200

              hover:border-orange-200
              hover:text-orange-500

              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Next
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
