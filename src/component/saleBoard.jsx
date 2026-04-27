import React from 'react';

export default function SaleBoard({ boardLabel, totalSales, totalCount, topProduct }) {
    return (
        <div className="sales-board-container">
            <p className="board-label">{boardLabel}</p>

            <div className="sales-card">
                <div className="sales-data">
                    <div className="data-column">
                        <h2 className="total-sales-amount">
                            ₱{(totalSales || 0).toLocaleString()}
                        </h2>
                        <p className="data-label">Total Sales</p>
                    </div>

                    <div className="vertical-divider"></div>

                    <div className="data-column">
                        <h2 className="transaction-count">
                            {totalCount || 0}
                        </h2>
                        <p className="data-label">Transactions</p>
                    </div>
                </div>

                <div className="sales-footer">
                    <div className="top-product">
                        <span>
                            Top: {topProduct || "No data"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}