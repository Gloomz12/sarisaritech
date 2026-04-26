import React, { useState } from 'react';
import { IoReceiptOutline, IoPhonePortraitOutline, IoWalletOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";

export default function TransactionItem({ transaction, formatTime }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getIcon = (method) => {
        if (method === 'GCash') return <IoPhonePortraitOutline />;
        if (method === 'Paymaya' || method === 'Bank Transfer') return <IoWalletOutline />;
        return <IoReceiptOutline />;
    };

    return (
        <div className={`transaction-item-container ${isExpanded ? 'expanded' : ''}`}>
            <div className="transaction-item-card" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="trans-left-section">
                    <div className={`trans-icon-box ${transaction.payment_method.toLowerCase()}`}>
                        {getIcon(transaction.payment_method)}
                    </div>
                    <div className="trans-meta">
                        <span className="trans-time">{formatTime(transaction.created_at)}</span>
                        <span className="trans-item-count">
                            {transaction.items.length} {transaction.items.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </div>

                <div className="trans-right-section">
                    <span className="trans-amount">₱{transaction.total_amount.toLocaleString()}</span>
                    <span className="trans-method-label">{transaction.payment_method}</span>
                </div>
            </div>

            {isExpanded && (
                <div className="transaction-details-drawer">
                    <div className="details-content">
                        {transaction.items.map((item, idx) => (
                            <div key={idx} className="product-detail-row">
                                <span className="detail-name">{item.product_name}</span>
                                <span className="detail-qty">x{item.quantity}</span>
                                <span className="detail-subtotal">₱{item.subtotal.toLocaleString()}</span>
                            </div>
                        ))}
                        
                        <div className="details-footer-total">
                            <span className="footer-label">Total</span>
                            <span className="footer-amount">₱{transaction.total_amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}