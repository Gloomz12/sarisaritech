import React from 'react';

export default function SaleBoard({ title, amount, count, topProduct }) {
    return (
        <div className="sales-board-container">
            <p className="board-label">{title}</p>

            <div className="sales-card">
                <div className="sales-data">
                    <div className="data-column">
                        <h2 className="total-sales-amount">₱{amount.toLocaleString()}</h2>
                        <p className="data-label">Total Sales</p>
                    </div>

                    <div className="vertical-divider"></div>

                    <div className="data-column">
                        <h2 className="transaction-count">{count}</h2>
                        <p className="data-label">Transactions</p>
                    </div>
                </div>

                <div className="sales-footer">
                    <div className="top-product">
                        <svg className="trend-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <span>Top: {topProduct || "None"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}