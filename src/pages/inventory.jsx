import React, { useState, useEffect, useMemo } from 'react';

// ICONS
import { IoAddOutline } from "react-icons/io5";

// COMPONENTS
import Header from '../component/header.jsx';
import SearchBar from '../component/searchBar.jsx';
import CategoryFilter from '../component/categoryFilter.jsx';
import InventoryCard from '../component/productInventoryCard.jsx';
import EditProductModal from '../component/editProductModal.jsx';
import RestockProductModal from '../component/restockModal.jsx';
import DeleteProductModal from '../component/deleteProductModal.jsx';
import AddProductModal from '../component/addProductModal.jsx';

// SERVICE
import productService from '../services/productService';

export default function Inventory() {

  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRestockOpen, setRestockOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // FETCH
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // CATEGORY
  const categories = ["All", ...new Set(products.map(p => p.category))];

  const getStatus = (product) => {
    if (product.stock_quantity <= product.min_stock_level / 2) return "CRITICAL";
    if (product.stock_quantity <= product.min_stock_level) return "LOW";
    return "OK";
  };

  const statusPriority = { CRITICAL: 1, LOW: 2, OK: 3 };

  const displayProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => statusPriority[getStatus(a)] - statusPriority[getStatus(b)]);
  }, [products, searchQuery, activeCategory]);

  // ADD
  const handleAddProduct = async (newProduct) => {
    try {
      await productService.createProduct(newProduct);
      fetchProducts();
      setAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  // EDIT
  const handleSaveEdit = async (updatedProduct) => {
    await productService.updateProduct(updatedProduct.id, updatedProduct);
    fetchProducts();
    setEditModalOpen(false);
  };

  // RESTOCK
  const handleRestock = async (productId, amountToAdd) => {
    const product = products.find(p => p.id === productId);

    await productService.updateProduct(productId, {
      ...product,
      stock_quantity: product.stock_quantity + parseInt(amountToAdd)
    });

    fetchProducts();
    setRestockOpen(false);
  };

  // DELETE
  const handleConfirmDelete = async (productId) => {
    await productService.deleteProduct(productId);
    fetchProducts();
    setDeleteOpen(false);
  };

  return (
    <div className="inventory-body">
      <Header currentPage="Inventory" />
      
      <SearchBar
        placeholder="Search for products..."
        value={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="inventory-actions-bar">
        <button
          className="action-icon-btn"
          onClick={() => setAddModalOpen(true)}
        >
          <IoAddOutline size={24} />
        </button>
      </div>

      <div className="products-cards-list">
        <div className="inventory-grid">
          {displayProducts.map(product => (
            <InventoryCard 
              key={product.id} 
              product={product} 

              onEdit={(p) => {
                setSelectedProduct(p);
                setEditModalOpen(true);
              }}

              onRestock={(p) => {
                setSelectedProduct(p);
                setRestockOpen(true);
              }}

              onDelete={(p) => {
                setSelectedProduct(p);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddProduct}
        />

        <EditProductModal
          isOpen={isEditModalOpen}
          product={selectedProduct}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        />

        <RestockProductModal
          isOpen={isRestockOpen}
          product={selectedProduct}
          onClose={() => setRestockOpen(false)}
          onRestock={handleRestock}
        />

        <DeleteProductModal
          isOpen={isDeleteOpen}
          onClose={() => setDeleteOpen(false)}
          product={selectedProduct}
          onDelete={handleConfirmDelete}
        />
      </div>
    </div>
  );
}