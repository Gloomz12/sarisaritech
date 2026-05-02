import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function StockAlerts() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");

            // FILTER LOW STOCK
            const lowStock = res.data.filter(p =>
                p.stock_quantity <= p.min_stock_level
            );

            setItems(lowStock);

        } catch (err) {
            console.error("Stock alert error:", err);
        }
    };

    useEffect(() => {
        fetchProducts();

        const interval = setInterval(fetchProducts, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="alerts-section">
            <div className="alerts-header">
                <p className="alerts-title">Stock Alerts</p>
                <button className="see-all-btn" onClick={() => navigate('/restock')}>
                    See All
                </button>
            </div>

            <div className="alerts-list">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="alert-card">
                            <h4 className="item-name">{item.name}</h4>
                            <p className="stock-status">
                                Stock Low: <span className="count">
                                    {item.stock_quantity} remaining
                                </span>
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