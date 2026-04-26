import React, { useState, useEffect } from 'react';
import axios from 'axios';

//COMPONENTS
import Header from '../component/header.jsx';
import SearchBar from '../component/searchBar.jsx';
import CategoryFilter from '../component/categoryFilter.jsx';
import ProductCard from '../component/productCard.jsx';
import CartItem from '../component/cartItem.jsx';

//ICONS
import { GiShoppingCart } from "react-icons/gi";
import { IoCashOutline } from "react-icons/io5";

//SERVICES
import productsData from '../services/productsData.json';
import productCategories from '../services/productCategories.json';

export default function RecordSale() {

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

  //PRODUCTS HANDLE
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.cost_price * item.quantity), 0);


  const handleIncrease = (id) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        if (p.quantity < p.stock_quantity) {
          return { ...p, quantity: p.quantity + 1 };
        } else {
          alert(`Cannot exceed stock for ${p.name}`);
          return p;
        }
      }
      return p;
    }));
  };

  const handleDecrease = (id) => {
    setProducts(products.map(p =>
      p.id === id && p.quantity > 0
        ? { ...p, quantity: p.quantity - 1 } : p
    ));
  };


  //PAYMENT
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountPaid, setAmountPaid] = useState("");
  const addCash = (val) => {
    setAmountPaid(prev => (Number(prev) || 0) + val);
  };

  const changeAmount = amountPaid > totalAmount ? amountPaid - totalAmount : 0;

  return (
    <div>
      <div className="record-sale-page">
        <Header currentPage="Record Sale" />

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

        <div className="record-sale-layout">
          <div className="product-list-container">
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
              ))}
            </div>
          </div>

          <div className="cart-list-container">
            <div className="cart-items-scroll-area">
              {cartItems.map(product => (
                <CartItem
                  key={product.id}
                  product={product}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
              ))}
            </div>

            <div className="cart-transaction-body">
              <div className="cart-header-row">
                <div className="cart-title-wrapper">
                  <GiShoppingCart className="cart-icon-logo" />
                  <span className="cart-title-text">Cart ({cartItems.length})</span>
                </div>
                <button className="clear-cart-btn" onClick={() => setProducts(products.map(p => ({ ...p, quantity: 0 })))}>Clear</button>
              </div>

              <hr className="cart-divider" />

              <div className="payment-method-section">
                <p className="section-label">Payment Method</p>
                <div className="payment-buttons-grid">
                  {['Cash', 'GCash', 'Paymaya'].map(m => (
                    <button
                      key={m}
                      className={`payment-btn ${paymentMethod === m ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(m)}
                    >{m}</button>
                  ))}
                </div>
              </div>

              <div className="amount-paid-section">
                <div className="amount-input-wrapper">
                  <IoCashOutline className="cash-icon" />
                  <input
                    type="number"
                    placeholder="Amount paid"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                </div>
                <div className="quick-cash-grid">
                  {[1, 5, 10, 20, 50, 100, 500].map(val => (
                    <button key={val} onClick={() => addCash(val)}>₱{val}</button>
                  ))}
                </div>
              </div>

              <div className="summary-section">
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="orange-text">₱{totalAmount.toLocaleString()}</span>
                </div>
                <div className="summary-row change ">
                  <span>CHANGE</span>
                  <span className="green-text">₱{changeAmount.toLocaleString()}</span>
                </div>
              </div>

              <button className="complete-sale-btn" disabled={cartItems.length === 0}>
                Complete Sale
              </button>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
}