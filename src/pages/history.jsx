import React, { useState, useEffect } from 'react';

// COMPONENTS
import Header from '../component/header.jsx';
import SearchBar from '../component/searchBar.jsx';
import CategoryFilter from '../component/categoryFilter.jsx';
import TransactionItem from '../component/transactionItem.jsx';

// ICONS
import { BsCashStack } from "react-icons/bs";
import { FaCashRegister } from "react-icons/fa";

// API
import api from '../services/api.js';

export default function History() {

  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMethod, setActiveMethod] = useState("All Payments");

  // FETCH DATA
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  // TOTALS
  const totalSales = transactions.reduce((acc, curr) => acc + curr.total_amount, 0);
  const totalCount = transactions.length;

  const formattedSales = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(totalSales);

  // PAYMENT METHODS
  const paymentMethods = ["All Payments", "Cash", "GCash", "Paymaya"];

  // FILTER
  const filteredTransactions = transactions.filter(t => {
    const matchesMethod =
      activeMethod === "All Payments" || t.payment_method === activeMethod;

    const matchesSearch = t.items.some(item =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesMethod && matchesSearch;
  });

  const methodTotal = filteredTransactions.reduce((acc, curr) => acc + curr.total_amount, 0);

  // SORT
  const sortedTransactions = [...filteredTransactions].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );

  // FORMAT TIME
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // GROUP BY DATE
  const groupedTransactions = sortedTransactions.reduce((groups, trans) => {
    const dateStr = new Date(trans.created_at).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }

    groups[dateStr].push(trans);
    return groups;
  }, {});

  return (
    <div className="history-page-container">
      <Header currentPage="History" />

      {/* SUMMARY */}
      <div className="transactions-summary-grid">
        <div className="stat-card">
          <div className="stat-icon sales-bg"><BsCashStack /></div>
          <div className="stat-info">
            <span className="stat-title">TOTAL SALES</span>
            <h2 className="stat-number">{formattedSales}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon trans-bg"><FaCashRegister /></div>
          <div className="stat-info">
            <span className="stat-title">TRANSACTIONS</span>
            <h2 className="stat-number">{totalCount}</h2>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <SearchBar
        value={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* FILTER */}
      <CategoryFilter
        categories={paymentMethods}
        activeCategory={activeMethod}
        onCategoryChange={setActiveMethod}
      />

      {/* FILTER INFO */}
      <div className="filter-stats-container">
        <div className="filter-text-group">
          <h3 className="filter-period-label">Recent Activity</h3>
          <div className="filter-info">
            <span>{filteredTransactions.length} transactions</span>
            <span className="divider-dot">•</span>
            <span className="amount-label">₱{methodTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="transactions-list-scroll">
        {Object.keys(groupedTransactions).map((dateKey) => {
          const dayTransactions = groupedTransactions[dateKey];
          const dayTotal = dayTransactions.reduce((sum, t) => sum + t.total_amount, 0);

          return (
            <div key={dateKey} className="date-group">
              <div className="daily-header">
                <div className="header-info">
                  <h3 className="header-date">{dateKey}</h3>
                  <span className="header-stats">
                    {dayTransactions.length} transactions • ₱{dayTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="day-items">
                {dayTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
