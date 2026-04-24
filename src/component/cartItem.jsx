import React from 'react';
import { MdDoNotDisturbOn, MdAddCircle } from "react-icons/md";

export default function CartItem({ item, onIncrease, onDecrease }) {
    return (
        <div className="product-card cart-item-override">
            <div className="product-details">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-price">₱{item.price}</p>
                <p className="product-stock">{item.stock} units remaining</p>
            </div>
            
            <div className="product-actions">
                <div className="qty-controls">
                    <MdDoNotDisturbOn 
                        className="qty-btn" 
                        onClick={() => onDecrease(item.id)} 
                    />
                    <span className="qty-count">{item.quantity}</span>
                    <MdAddCircle 
                        className="qty-btn" 
                        onClick={() => onIncrease(item.id)} 
                    />
                </div>
                <p className="product-subtotal">₱{item.price * item.quantity}</p>
            </div>
        </div>
    );
}