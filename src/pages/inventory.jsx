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

// SERVICES
import productsData from '../services/productsData.json';
import productCategories from '../services/productCategories.json';

export default function Inventory() {
  const [products, setProducts] = useState(() => {
    const savedData = localStorage.getItem('sarisari_inventory');
    return savedData ? JSON.parse(savedData) : productsData;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRestockOpen, setRestockOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sarisari_inventory', JSON.stringify(products));
  }, [products]);

  const categories = ["All", ...productCategories.map(cat => cat.name)];

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


  const handleAddProduct = (newProduct) => {
    const productWithDefaults = {
        ...newProduct,
        id: newProduct.id || `p${Date.now()}`,
        quantity: 0 
    };
    setProducts(prev => [productWithDefaults, ...prev]);
    setAddModalOpen(false);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedProduct) => {
    setProducts(prev => 
        prev.map(p => p.id === updatedProduct.id ? { ...updatedProduct } : p)
    );
    setEditModalOpen(false);
  };

  const handleRestockClick = (product) => {
    setSelectedProduct(product);
    setRestockOpen(true);
  };

  const handleRestock = (productId, amountToAdd) => {
    setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            stock_quantity: product.stock_quantity + parseInt(amountToAdd)
          };
        }
        return product;
      })
    );
    setRestockOpen(false);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
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
                onEdit={handleEditClick} 
                onRestock={handleRestockClick} 
                onDelete={handleDeleteClick} 
            />
          ))}
        </div>

        
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddProduct}
          categories={categories.filter(c => c !== "All")}
        />

        <EditProductModal
          isOpen={isEditModalOpen}
          product={selectedProduct}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          categories={categories.filter(c => c !== "All")}
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