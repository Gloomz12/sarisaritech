import React, { useState, useEffect } from 'react';

// COMPONENTS
import Header from '../component/header.jsx';
import SearchBar from '../component/searchBar.jsx';
import StockSummary from '../component/stockSummary.jsx';
import RestockProductModal from '../component/restockModal.jsx';
import RestockCard from '../component/restockCard.jsx';

// SERVICE
import productService from '../services/productService';

export default function Restock() {

  const getStatus = (product) => {
    if (product.stock_quantity <= product.min_stock_level / 2) return "CRITICAL";
    if (product.stock_quantity <= product.min_stock_level) return "LOW";
    return "OK";
  };

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isRestockOpen, setRestockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    const priority = { CRITICAL: 1, LOW: 2, OK: 3 };
    return priority[getStatus(a)] - priority[getStatus(b)];
  });

  const filteredAndSorted = sortedProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestockClick = (product) => {
    setSelectedProduct(product);
    setRestockOpen(true);
  };

  // RESTOCK ACTION
  const handleRestockAction = async (productId, amountToAdd) => {
    try {
      await productService.restockProduct(productId, parseInt(amountToAdd));
      await fetchProducts();
      setRestockOpen(false);
    } catch (err) {
      console.error(err);
      alert("Restock failed");
    }
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