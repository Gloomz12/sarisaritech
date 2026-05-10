import React, { useState, useEffect } from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function EditProductModal({ isOpen, onClose, product, onSave, categories = [] }) {

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        selling_price: "",
        cost_price: "",
        stock_quantity: "",
        min_stock_level: "",
        unit: "pc"
    });

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                unit: product.unit || "pc"
            });
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Edit Product</h2>
                    <IoMdCloseCircleOutline className="close-x" size={30} onClick={onClose} />
                </div>

                <div className="modal-body">

                    <label>Product Name *</label>
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                    />

                    <label>Category</label>
                    <div className="category-selection">
                        {categories
                            .filter(c => c !== "All")
                            .map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`cat-pill ${formData.category === cat ? 'active' : ''}`}
                                    onClick={() =>
                                        setFormData(prev => ({ ...prev, category: cat }))
                                    }
                                >
                                    {cat}
                                </button>
                        ))}
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>Selling Price *</label>
                            <input 
                                name="selling_price" 
                                type="number" 
                                value={formData.selling_price} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Cost Price</label>
                            <input 
                                name="cost_price" 
                                type="number" 
                                value={formData.cost_price} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>Stock Quantity *</label>
                            <input 
                                name="stock_quantity" 
                                type="number" 
                                value={formData.stock_quantity} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Min Stock Level *</label>
                            <input 
                                name="min_stock_level" 
                                type="number" 
                                value={formData.min_stock_level} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <label>Unit</label>
                    <input 
                        name="unit" 
                        placeholder="e.g., can, pack, pc" 
                        value={formData.unit} 
                        onChange={handleChange} 
                    />
                </div>

                <button 
                    className="save-btn" 
                    onClick={() => onSave(formData)}
                >
                    Save Changes
                </button>

            </div>
        </div>
    );
}