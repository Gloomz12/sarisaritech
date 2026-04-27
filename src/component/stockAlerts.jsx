import React from "react";
import { useNavigate } from 'react-router-dom';

export default function StockAlerts({ items = [] }) {
    const navigate = useNavigate();

    return (
        <div className="alerts-section">
            <div className="alerts-header">
                <p className="alerts-title">Stock Alerts</p>
                <button className="see-all-btn" onClick={() => navigate('/restock')}>See All</button>
            </div>

            <div className="alerts-list">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="alert-card">
                            <h4 className="item-name">{item.name}</h4>
                            <p className="stock-status">
                                Stock Low: <span className="count">{item.stock_quantity} remaining</span>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="alert-card healthy">
                        <p>All stock levels are OK</p>
                    </div>
                )}
            </div>
        </div>
    );
}