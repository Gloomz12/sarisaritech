import { useMemo, useState, useEffect } from "react";

import RestockLayout from "../component/restock/RestockLayout";

import RestockStats from "../component/restock/RestockStats";
import RestockSearch from "../component/restock/RestockSearch";
import RestockGrid from "../component/restock/RestockGrid";
import RestockPagination from "../component/restock/RestockPagination";
import RestockModal from "../component/restock/RestockModal";

import { getStockStatus } from "../utils/stockStatus";

import productService from "../services/productService";

const ITEMS_PER_PAGE = 12;

export default function Restock() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  /* MODAL */

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState("");

  /* FETCH PRODUCTS */

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();

      const formatted = data.map((item) => ({
        id: item.id,

        name: item.name,

        category: item.category,

        stock: item.stock_quantity,

        minLevel: item.min_stock_level,
      }));

      setProducts(formatted);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* FILTERED PRODUCTS */

  const processedProducts = useMemo(() => {
    let filtered = [...products];

    /* SEARCH */

    if (search) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
    }

    /* FILTER */

    if (filter !== "All") {
      filtered = filtered.filter((product) => getStockStatus(product.stock, product.minLevel) === filter.toLowerCase());
    }

    /* SORT PRIORITY */

    const statusPriority = {
      critical: 0,
      low: 1,
      good: 2,
    };

    filtered.sort((a, b) => {
      const statusA = getStockStatus(a.stock, a.minLevel);

      const statusB = getStockStatus(b.stock, b.minLevel);

      return statusPriority[statusA] - statusPriority[statusB];
    });

    return filtered;
  }, [products, search, filter]);

  /* PAGINATION */

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,

    currentPage * ITEMS_PER_PAGE
  );

  /* STATS */

  const criticalCount = products.filter((p) => getStockStatus(p.stock, p.minLevel) === "critical").length;

  const lowCount = products.filter((p) => getStockStatus(p.stock, p.minLevel) === "low").length;

  const goodCount = products.filter((p) => getStockStatus(p.stock, p.minLevel) === "good").length;

  /* OPEN MODAL */

  const handleOpenModal = (product) => {
    setSelectedProduct(product);

    setQuantity("");
  };

  /* CLOSE MODAL */

  const handleCloseModal = () => {
    setSelectedProduct(null);

    setQuantity("");
  };

  /* CONFIRM RESTOCK */

  const handleConfirmRestock = async () => {
    try {
      await productService.restockProduct(selectedProduct.id, Number(quantity));

      await fetchProducts();

      handleCloseModal();
    } catch (error) {
      console.error("FULL ERROR:", error);

      console.error("ERROR RESPONSE:", error.response);

      console.error("ERROR DATA:", error.response?.data);
    }
  };

  return (
    <>
      <RestockLayout>
        <div
          className="
            w-full
            space-y-5

            transition-all
            duration-300
          "
        >
          {/* HERO */}

          <div
            className="
              relative
              overflow-hidden

              flex
              items-center
              justify-between

              w-full

              rounded-[30px]
              isolate

              border
              border-[#F1E4D2]
              dark:border-[#1F2937]

              bg-gradient-to-br
              from-white
              to-[#fffaf5]

              dark:from-[#111827]
              dark:to-[#0F172A]

              px-8
              py-6

              transition-all
              duration-300
            "
          >
            {/* GLOW */}

            <div
              className="
                absolute

                top-0
                right-0

                w-[180px]
                h-[180px]

                rounded-full

                bg-orange-100/10
                dark:bg-orange-500/10

                blur-3xl

                pointer-events-none
              "
            />

            {/* LEFT */}

            <div className="relative z-10">
              <h1
                className="
                  text-[54px]
                  leading-[0.9]

                  tracking-[-2px]

                  font-black

                  text-[#071437]
                  dark:text-white
                "
              >
                Restock
              </h1>

              <p
                className="
                  mt-2

                  max-w-[650px]

                  text-[15px]

                  text-slate-500
                  dark:text-gray-400

                  font-medium
                "
              >
                Monitor stock levels and restock items to keep your store running smoothly.
              </p>
            </div>

            {/* RIGHT ICON */}

            <div
              className="
                relative
                z-10

                flex
                h-[82px]
                w-[82px]

                items-center
                justify-center

                rounded-[24px]

                border
                border-orange-100
                dark:border-orange-500/20

                bg-white
                dark:bg-[#111827]
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="
                  h-9
                  w-9

                  text-orange-500
                "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                />

                <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05" />

                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22.08V12" />
              </svg>
            </div>
          </div>

          {/* STATS */}

          <RestockStats criticalCount={criticalCount} lowCount={lowCount} goodCount={goodCount} />

          {/* SEARCH */}

          <RestockSearch
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            criticalCount={criticalCount}
            lowCount={lowCount}
            goodCount={goodCount}
          />

          {/* CONTENT AREA */}

          <div
            className="
              flex
              min-h-[520px]
              flex-col
              justify-between
            "
          >
            {/* GRID */}

            <RestockGrid products={paginatedProducts} onRestock={handleOpenModal} />

            {/* PAGINATION */}

            <div className="pt-6">
              <RestockPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        </div>
      </RestockLayout>

      {/* MODAL */}

      <RestockModal
        product={selectedProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRestock}
      />
    </>
  );
}
