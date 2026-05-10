import React from 'react';

export default function DeleteProductModal({ isOpen, onClose, product, onDelete }) {
    if (!isOpen || !product) return null;

    return (
        <div className="delete-overlay" onClick={onClose}>
            <div className="delete-dialog" onClick={e => e.stopPropagation()}>
                <div className="delete-header">
                    <h3>Delete Product</h3>
                    <p>Are you sure you want to delete "{product.name}"?</p>
                </div>

                <div className="delete-actions">
                    <button className="delete-cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="delete-confirm-btn" onClick={() => onDelete(product.id)}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}