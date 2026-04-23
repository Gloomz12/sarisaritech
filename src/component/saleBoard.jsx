import React from 'react';

export default function SaleBoard( boardLabel ) {
    return (
        <div class="sales-board-container">
            <p class="board-label"> {boardLabel} </p>

            <div class="sales-card">
                <div class="sales-data">
                    <div class="data-column">
                        <h2 class="total-sales-amount">₱350.00</h2>
                        <p class="data-label">Total Sales</p>
                    </div>

                    <div class="vertical-divider"></div>

                    <div class="data-column">
                        <h2 class="transaction-count">20</h2>
                        <p class="data-label">Transactions</p>
                    </div>
                </div>

                <div class="sales-footer">
                    <div class="top-product">
                        <svg class="trend-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <span>Top: Pepsi 1.5L</span>
                    </div>
                </div>
            </div>
        </div>
    );
}