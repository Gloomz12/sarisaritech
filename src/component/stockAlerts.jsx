import React from "react";
import { useNavigate } from 'react-router-dom';

const stockAlerts = [
    { id: 1, name: 'Item A', remaining: 5 },
    { id: 2, name: 'Item B', remaining: 3 },
    { id: 3, name: 'Item C', remaining: 2 },
];

export default function StockAlerts() {
    const navigate = useNavigate();

    return (
        <div className="alerts-section">
            <div className="alerts-header">
                <p className="alerts-title">Stock Alerts</p>
                <button className="see-all-btn" onClick={() => navigate('/restock')}>See All</button>
            </div>

            <div className="alerts-list">
                {stockAlerts.map((item) => (
                    <div key={item.id} className="alert-card">
                        <h4 className="item-name">{item.name}</h4>
                        <p className="stock-status">
                            Stock Low: <span className="count">{item.remaining} remaining</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}