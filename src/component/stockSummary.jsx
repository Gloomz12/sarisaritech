import React from 'react';
import { IoCheckmarkCircleOutline, IoWarningOutline, IoAlertCircleOutline } from "react-icons/io5";


export default function StockSummary({ products, getStatus }) {

    const counts = products.reduce((acc, product) => {
        const status = getStatus(product);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, { OK: 0, LOW: 0, CRITICAL: 0 });

    return (
        <div className="summary-section-wrapper">
            <div className="stock-summary-container">
                <div className="summary-card critical">
                    <div className="icon-wrapper"><IoAlertCircleOutline /></div>
                    <div className="summary-info">
                        <span className="summary-number">{counts.CRITICAL}</span>
                        <span className="summary-label">Critical</span>
                    </div>
                </div>

                <div className="summary-card low">
                    <div className="icon-wrapper"><IoWarningOutline /></div>
                    <div className="summary-info">
                        <span className="summary-number">{counts.LOW}</span>
                        <span className="summary-label">Low Stock</span>
                    </div>
                </div>

                <div className="summary-card good">
                    <div className="icon-wrapper"><IoCheckmarkCircleOutline /></div>
                    <div className="summary-info">
                        <span className="summary-number">{counts.OK}</span>
                        <span className="summary-label">Good</span>
                    </div>
                </div>
            </div>
        </div>
    );
}