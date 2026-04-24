import React from 'react';
import { MdDoNotDisturbOn, MdAddCircle } from "react-icons/md";

export default function ProductCard({ product, onIncrease, onDecrease }) {
    return (
        <div className="product-card">
            <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₱{product.price}</p>
                <p className="product-stock">{product.stock} units remaining</p>
            </div>

            <div className="product-actions">
                <div className="qty-controls">
                    <MdDoNotDisturbOn
                        className={`qty-btn ${product.quantity === 0 ? 'disabled' : ''}`}
                        onClick={() => onDecrease(product.id)}
                    />
                    <span className="qty-count">{product.quantity}</span>
                    <MdAddCircle
                        className="qty-btn"
                        onClick={() => onIncrease(product.id)}
                    />
                </div>
                <p className="product-subtotal">₱{product.price * product.quantity}</p>
            </div>
        </div>
    );
}