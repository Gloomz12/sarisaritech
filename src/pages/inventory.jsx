import React, { useState, useEffect } from 'react';
import axios from 'axios';

//ICONS
import { CiFolderOn } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";

//COMPONENTS
import Header from '../component/header.jsx';
import SearchBar from '../component/searchBar.jsx';
import CategoryFilter from '../component/categoryFilter.jsx';
import InventoryCard from '../component/productInventoryCard.jsx';
import EditProductModal from '../component/editProductModal.jsx';
import RestockProductModal from '../component/restockModal.jsx';
import DeleteProductModal from '../component/deleteProductModal.jsx';
import AddProductModal from '../component/addProductModal.jsx';
//import CategoryManageModal from '../component/categoryManageModal.jsx';


//SERVICES
import productsData from '../services/productsData.json';
import productCategories from '../services/productCategories.json';


export default function Inventory() {

  //PRODUCT LIST
  const [products, setProducts] = useState(
    productsData.map(item => ({ ...item, quantity: 0 }))
  );


  //SEARCH FILTER
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = products.filter(p => p.quantity > 0);


  //CATEGORY FILTER
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...productCategories.map(cat => cat.name)];
  const handleFilter = (cat) => console.log("Filtering by:", cat);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });


  //SORTING BY STOCK STATUS
  const getStatus = (product) => {
    if (product.stock_quantity <= product.min_stock_level / 2) return "CRITICAL";
    if (product.stock_quantity <= product.min_stock_level) return "LOW";
    return "OK";
  };

  const statusPriority = { "CRITICAL": 1, "LOW": 2, "OK": 3 };

  const sortedProducts = [...productsData].sort((a, b) => {
    return statusPriority[getStatus(a)] - statusPriority[getStatus(b)];
  });

  const displayProducts = [...filteredProducts].sort((a, b) => {
    return statusPriority[getStatus(a)] - statusPriority[getStatus(b)];
  });

  //EDIT CATEGORIES
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  //ADD NEW PRODUCTS
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    setAddModalOpen(false);
  };

  //EDIT PRODUCT MODAL
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleSave = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditModalOpen(false);
  };

  //RESTOCK PRODUCT MODAL
  const [isRestockOpen, setRestockOpen] = useState(false);

  const handleRestockClick = (product) => {
    setSelectedProduct(product);
    setRestockOpen(true);
  };

  const handleRestock = (productId, amountToAdd) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const newStock = product.stock_quantity + parseInt(amountToAdd);

          return {
            ...product,
            stock_quantity: newStock
          };
        }
        return product;
      })
    );
    setRestockOpen(false);
    console.log(`Restocked ID: ${productId} with ${amountToAdd} units.`);
  };

  //DELETE PRODUCT MODAL
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setDeleteOpen(false);
    console.log("Deleted product:", productId);
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
        
        {/*   
        <button
          className="action-icon-btn"
          onClick={() => setCategoryModalOpen(true)}
          title="Manage Categories"
        >
          <CiFolderOn />
        </button>
        */}

        <button
          className="action-icon-btn"
          onClick={() => setAddModalOpen(true)}
          title="Add New Product"
        >
          <IoAddOutline />
        </button>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddProduct}
          categories={categories}
        />

      </div>


      <div className="products-cards-list">
        <div className="inventory-grid">
          {displayProducts.map(product => (
            <InventoryCard key={product.id} product={product} onEdit={handleEditClick} onRestock={handleRestockClick} onDelete={handleDeleteClick} />
          ))}
        </div>


        {/*MODALS */}
        <EditProductModal
          isOpen={isEditModalOpen}
          product={selectedProduct}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSave}
          categories={categories}
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