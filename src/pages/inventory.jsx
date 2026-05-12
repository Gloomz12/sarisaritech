// src/pages/Inventory.jsx

import { useEffect, useState } from "react";

import axios from "axios";

import InventoryStats from "../component/inventory/InventoryStats";
import InventoryToolbar from "../component/inventory/InventoryToolbar";
import ProductInventoryTable from "../component/inventory/ProductInventoryTable";
import StockAlerts from "../component/inventory/StockAlerts";
import StockSummary from "../component/inventory/StockSummary";

import AddProductModal from "../component/inventory/AddProductModal";
import EditProductModal from "../component/inventory/EditProductModal";
import ViewProductModal from "../component/inventory/ViewProductModal";

export default function Inventory() {
  /* MODALS */

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  /* PRODUCTS */

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  /* SEARCH */

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  /* SORT */

  const [sortBy, setSortBy] = useState("default");

  /* FETCH PRODUCTS */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://127.0.0.1:8000/api/products/");

      const backendProducts = response.data.map((product) => ({
        id: product.id,

        name: product.name,

        category: product.category,

        stock_quantity: Number(product.stock_quantity),

        cost_price: Number(product.cost_price),

        selling_price: Number(product.selling_price),

        min_stock_level: Number(product.min_stock_level),

        unit: product.unit,
      }));

      setProducts(backendProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* VIEW */

  const handleViewProduct = (product) => {
    setSelectedProduct(product);

    setShowViewModal(true);
  };

  /* EDIT */

  const handleEditProduct = (product) => {
    setSelectedProduct(product);

    setShowEditModal(true);
  };

  /* DELETE */

  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(`Delete ${product.name}?`);

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${product.id}/`);

      fetchProducts();
    } catch (error) {
      console.log(error);

      alert("Failed to delete product");
    }
  };

  /* PROCESS PRODUCTS */

  const processedProducts = products.map((product) => {
    let status = "In Stock";

    if (product.stock_quantity === 0) {
      status = "Out of Stock";
    } else if (product.stock_quantity <= product.min_stock_level) {
      status = "Low Stock";
    }

    return {
      ...product,

      value: product.stock_quantity * product.selling_price,

      status,
    };
  });

  /* DASHBOARD */

  const totalProducts = processedProducts.length;

  const lowStockCount = processedProducts.filter(
    (product) => product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_level
  ).length;

  const outOfStockCount = processedProducts.filter(
    (product) => product.stock_quantity === 0
  ).length;

  const totalCostValue = processedProducts.reduce((total, product) => {
    return total + product.cost_price * product.stock_quantity;
  }, 0);

  const totalRetailValue = processedProducts.reduce((total, product) => {
    return total + product.selling_price * product.stock_quantity;
  }, 0);

  /* CATEGORIES */

  const categories = ["All", ...new Set(processedProducts.map((product) => product.category))];

  /* FILTER PRODUCTS */

  const filteredProducts = processedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory.includes("All")
      ? true
      : selectedCategory.includes(product.category);

    return matchesSearch && matchesCategory;
  });

  /* SORT PRODUCTS */

  const sortedProducts = [...filteredProducts];

  if (sortBy === "lowest_stock") {
    sortedProducts.sort((a, b) => a.stock_quantity - b.stock_quantity);
  }

  if (sortBy === "highest_stock") {
    sortedProducts.sort((a, b) => b.stock_quantity - a.stock_quantity);
  }

  if (sortBy === "name_asc") {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortBy === "name_desc") {
    sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  /* DEFAULT SORT */

  if (sortBy === "default") {
    sortedProducts.sort((a, b) => {
      const statusOrder = {
        "Out of Stock": 0,

        "Low Stock": 1,

        "In Stock": 2,
      };

      return statusOrder[a.status] - statusOrder[b.status];
    });
  }

  /* LOW STOCK ALERTS */

  const lowStockProducts = processedProducts

    .filter(
      (product) => product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_level
    )

    .sort((a, b) => a.stock_quantity - b.stock_quantity)

    .slice(0, 3);

  return (
    <div className="space-y-5 bg-[#f8fafc]">
      {/* ADD */}

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} refreshProducts={fetchProducts} />
      )}

      {/* EDIT */}

      {showEditModal && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          refreshProducts={fetchProducts}
        />
      )}

      {/* VIEW */}

      {showViewModal && (
        <ViewProductModal product={selectedProduct} onClose={() => setShowViewModal(false)} />
      )}

      {/* HERO */}

      <div
        className="
    relative
    overflow-hidden

    rounded-[30px]

    bg-gradient-to-br
    from-white
    to-[#fffaf5]

    border
    border-[#f3f4f6]

    px-8
    py-6

    shadow-sm
  "
      >
        {/* GLOW */}

        <div
          className="
      absolute
      -top-16
      -right-16

      w-[180px]
      h-[180px]

      rounded-full

      bg-orange-100/20

      blur-3xl
    "
        />

        <div
          className="
      relative
      z-10

      flex
      items-center
      justify-between
      gap-6
    "
        >
          {/* LEFT */}

          <div>
            <h1
              className="
          text-[54px]
          leading-[0.9]

          tracking-[-2px]

          font-black

          text-[#071437]
        "
            >
              Inventory
            </h1>

            <p
              className="
          mt-2

          text-[15px]

          text-gray-500
          font-medium
        "
            >
              Manage your store products and monitor stock levels efficiently.
            </p>
          </div>

          {/* BUTTON */}

          <button
            onClick={() => setShowAddModal(true)}
            className="
        h-[52px]

        rounded-2xl

        bg-orange-500

        px-7

        text-[14px]
        font-semibold
        text-white

        transition-all
        duration-300

        hover:bg-orange-600
        hover:shadow-lg

        active:scale-[0.98]
      "
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* STATS */}

      <InventoryStats
        totalProducts={totalProducts}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
        totalCostValue={totalCostValue}
        totalRetailValue={totalRetailValue}
      />

      {/* MAIN */}

      <div
        className="
          grid
          grid-cols-1
          gap-5

          xl:grid-cols-[minmax(0,1fr)_320px]
        "
      >
        {/* LEFT */}

        <div
          className="
            overflow-visible
            rounded-[28px]
            bg-white
            p-6

            shadow-[0_4px_20px_rgba(15,23,42,0.04)]
          "
        >
          <InventoryToolbar
            showAddModal={showAddModal}
            search={search}
            setSearch={setSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <div className="mt-5">
            {loading ? (
              <div
                className="
                  py-10
                  text-center
                  text-gray-500
                "
              >
                Loading products...
              </div>
            ) : (
              <ProductInventoryTable
                products={sortedProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onView={handleViewProduct}
              />
            )}
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            sticky
            top-5

            flex
            h-fit
            flex-col
            gap-4
          "
        >
          <StockAlerts lowStock={lowStockProducts} />

          <StockSummary
            totalProducts={processedProducts.length}
            lowStock={lowStockCount}
            outOfStock={outOfStockCount}
            totalInventoryValue={totalRetailValue}
          />
        </div>
      </div>
    </div>
  );
}
