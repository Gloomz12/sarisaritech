import React, { useState } from 'react';

export default function RestockProductModal({ isOpen, onClose, product, onRestock }) {
    const [addAmount, setAddAmount] = useState("");

    if (!isOpen || !product) return null;

    const handleSubmit = () => {
        const amount = parseInt(addAmount);
        if (!isNaN(amount) && amount > 0) {
            onRestock(product.id, amount);
            setAddAmount("");
            onClose();
        }
    };

    return (
        <div className="restock-overlay" onClick={onClose}>
            <div className="restock-content" onClick={e => e.stopPropagation()}>
                <div className="restock-header">
                    <h2 className="restock-title">Restock {product.name}</h2>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>

                <div className="restock-body">
                    <p className="current-stock-info">
                        Current stock: <strong>{product.stock_quantity} {product.unit}</strong>
                    </p>
                    
                    <label className="restock-label">Quantity to add *</label>
                    <input 
                        type="number" 
                        className="restock-input"
                        placeholder="Enter quantity to add"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="restock-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="confirm-restock-btn" onClick={handleSubmit}>
                        Add Stock
                    </button>
                </div>
            </div>
        </div>
    );
}