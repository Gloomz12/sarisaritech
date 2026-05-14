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

  // MODAL

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState("");

  // FETCH PRODUCTS

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

  // FILTERED PRODUCTS

  const processedProducts = useMemo(() => {
    let filtered = [...products];

    // SEARCH

    if (search) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
    }

    // FILTER

    if (filter !== "All") {
      filtered = filtered.filter((product) => getStockStatus(product.stock, product.minLevel) === filter.toLowerCase());
    }

    // SORT PRIORITY

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

  // PAGINATION

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,

    currentPage * ITEMS_PER_PAGE
  );

  // STATS

  const criticalCount = products.filter((p) => getStockStatus(p.stock, p.minLevel) === "critical").length;

  const lowCount = products.filter((p) => getStockStatus(p.stock, p.minLevel) === "low").length;

  const goodCount = products.filter((p) => getStockStatus(p.stock, p.minLevel) === "good").length;

  // OPEN MODAL

  const handleOpenModal = (product) => {
    setSelectedProduct(product);

    setQuantity("");
  };

  // CLOSE MODAL

  const handleCloseModal = () => {
    setSelectedProduct(null);

    setQuantity("");
  };

  // CONFIRM RESTOCK

  const handleConfirmRestock = async () => {
    try {
      console.log("SELECTED PRODUCT:", selectedProduct);

      console.log("QUANTITY:", quantity);

      const response = await productService.restockProduct(selectedProduct.id, Number(quantity));

      console.log("RESTOCK SUCCESS:", response);

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
        <div className="w-full space-y-4">
          {/* HERO */}

          <div
            className="
    flex
    items-center
    justify-between
    w-full
    rounded-[26px]
    border
    border-[#F1E4D2]
    bg-white
    px-7
    py-5
  "
          >
            {/* LEFT */}
            <div>
              <h1
                className="
        text-[44px]
        leading-none
        tracking-[-2px]
        font-black
        text-[#0F172A]
      "
              >
                Restock
              </h1>

              <p
                className="
        mt-1.5
        text-[15px]
        text-slate-500
      "
              >
                Monitor stock levels and restock items to keep your store running smoothly.
              </p>
            </div>

            {/* RIGHT ICON */}
            <div
              className="
      flex
      h-[68px]
      w-[68px]
      items-center
      justify-center
      rounded-[22px]
      border
      border-[#F1E4D2]
      bg-white
    "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-8 w-8 text-orange-500"
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

          {/* MAIN */}

          <div
            className="
              rounded-[32px]
              border
              border-slate-200
              bg-white
              p-6
              space-y-5
            "
          >
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
