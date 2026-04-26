import React, { useState, useEffect } from 'react';
import axios from 'axios';

//COMPONENTS
import Header from '../component/header.jsx';
import SearchBar from '../component/searchBar.jsx';
import StockSummary from '../component/stockSummary.jsx';
import RestockProductModal from '../component/restockModal.jsx';
import RestockCard from '../component/restockCard.jsx';

//SERVICES
import productsData from '../services/productsData.json';


export default function Restock() {

  //STOCK SUMMARY
  const getStatus = (product) => {
    if (product.stock_quantity <= product.min_stock_level / 2) return "CRITICAL";
    if (product.stock_quantity <= product.min_stock_level) return "LOW";
    return "OK";
  };

  //PRODUCT LIST
  const [products, setProducts] = useState(
    productsData.map(item => ({ ...item, quantity: 0 }))
  );

  //SEARCH FILTER
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = products.filter(p => p.quantity > 0);

  //SORTING
  const sortedProducts = [...products].sort((a, b) => {
    const priority = { CRITICAL: 1, LOW: 2, OK: 3 };
    return priority[getStatus(a)] - priority[getStatus(b)];
  });

  const filteredAndSorted = sortedProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //RESTOCK
  const [isRestockOpen, setRestockOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleRestockClick = (product) => {
    setSelectedProduct(product);
    setRestockOpen(true);
  };


  const handleRestockAction = (productId, amountToAdd) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
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

  return (
    <div>
      <Header currentPage="Restock" />

      <StockSummary products={products} getStatus={getStatus} />

      <SearchBar
        placeholder="Search for products..."
        value={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="restock-grid">
        {filteredAndSorted.map(product => (
          <RestockCard
            key={product.id}
            product={product}
            getStatus={getStatus}
            onRestock={handleRestockClick}
          />
        ))}
      </div>

      <RestockProductModal
        isOpen={isRestockOpen}
        product={selectedProduct}
        onClose={() => setRestockOpen(false)}
        onRestock={handleRestockAction}
      />
    </div>
  );
}