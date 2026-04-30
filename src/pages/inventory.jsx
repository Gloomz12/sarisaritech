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

// API
import api from '../services/api';

export default function Inventory() {

  // PRODUCTS FROM DATABASE
  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRestockOpen, setRestockOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // DYNAMIC CATEGORIES 
  const categories = ["All", ...new Set(products.map(p => p.category))];

  const getStatus = (product) => {
    if (product.stock_quantity <= product.min_stock_level / 2) return "CRITICAL";
    if (product.stock_quantity <= product.min_stock_level) return "LOW";
    return "OK";
  };

  const statusPriority = { "CRITICAL": 1, "LOW": 2, "OK": 3 };

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
    console.log("SENDING:", newProduct); 

    await api.post('/products', newProduct);

    console.log("SUCCESS ADD");

    fetchProducts();
    setAddModalOpen(false);

  } catch (err) {
    console.error("ADD ERROR:", err.response?.data || err.message);
    alert("Error adding product. Check console.");
  }
  };

  // EDIT 
  const handleSaveEdit = async (updatedProduct) => {
    await api.put(`/products/${updatedProduct.id}`, updatedProduct);
    fetchProducts();
    setEditModalOpen(false);
  };

  // RESTOCK 
  const handleRestock = async (productId, amountToAdd) => {
    const product = products.find(p => p.id === productId);

    await api.put(`/products/${productId}`, {
      ...product,
      stock_quantity: product.stock_quantity + parseInt(amountToAdd)
    });

    fetchProducts();
    setRestockOpen(false);
  };

  // DELETE
  const handleConfirmDelete = async (productId) => {
    await api.delete(`/products/${productId}`);
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
          title="Add New Product"
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