import React from 'react';
import { IoCubeOutline } from "react-icons/io5";

export default function RestockCard({ product, getStatus, onRestock }) {
    const status = getStatus(product);

    return (
        <div className={`restock-card ${status.toLowerCase()}`}>
            <div className="card-accent-bar"></div>
            
            <div className="card-main-content">
                <div className="product-identity">
                    <div className="product-icon-bg">
                        <IoCubeOutline />
                    </div>
                    <div className="name-section">
                        <h3>{product.name}</h3>
                        <span className="category-tag">{product.category}</span>
                    </div>
                </div>

                <div className="stock-stats">
                    <div className="stat-box">
                        <span className="stat-label">Stock</span>
                        <span className="stat-value">{product.stock_quantity} <small>{product.unit}</small></span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-label">Min. Level</span>
                        <span className="stat-value">{product.min_stock_level}</span>
                    </div>
                </div>

                <div className="status-indicator">
                    <span className={`status-pill ${status.toLowerCase()}`}>
                        {status}
                    </span>
                </div>

                <button className="restock-action-btn" onClick={() => onRestock(product)}>
                    Restock
                </button>
            </div>
        </div>
    );
}