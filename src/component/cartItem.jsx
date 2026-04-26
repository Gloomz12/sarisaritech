import React from 'react';
import { MdDoNotDisturbOn, MdAddCircle } from "react-icons/md";

export default function CartItem({ product, onIncrease, onDecrease }) {
    return (
        <div className="product-card cart-item-override">
            <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₱{product.selling_price}</p>
                <p className="product-stock">{product.stock_quantity} units remaining</p>
            </div>

            <div className="product-actions">
                <div className="qty-controls">
                    <MdDoNotDisturbOn className="qty-btn" onClick={() => onDecrease(product.id)} />

                    <span className="qty-count">{product.quantity}</span>

                    <MdAddCircle
                        className={`qty-btn ${product.quantity >= product.stock_quantity ? 'disabled' : ''}`}
                        onClick={() => onIncrease(product.id)}
                    />

                </div>
                <p className="product-subtotal">₱{product.selling_price * product.quantity}</p>
            </div>

        </div>
    );
}