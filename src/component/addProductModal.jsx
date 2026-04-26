import React, { useState } from 'react';

export default function AddProductModal({ isOpen, onClose, onAdd, categories }) {
    const [formData, setFormData] = useState({
        name: "",
        category: categories[1] || "",
        selling_price: "",
        cost_price: "",
        stock_quantity: "",
        min_stock_level: "",
        unit: "pc"
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            ...formData,
            id: Date.now(), 
            selling_price: parseFloat(formData.selling_price),
            cost_price: parseFloat(formData.cost_price),
            stock_quantity: parseInt(formData.stock_quantity),
            min_stock_level: parseInt(formData.min_stock_level)
        };
        onAdd(newProduct);
        onClose();
        setFormData({ name: "", category: categories[1], selling_price: "", cost_price: "", stock_quantity: "", min_stock_level: "", unit: "pc" });
    };

    return (
        <div className="add-product-overlay" onClick={onClose}>
            <div className="add-product-content" onClick={e => e.stopPropagation()}>
                <div className="add-product-header">
                    <h2 className="add-product-title">Add New Product</h2>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="add-product-body">
                        <div className="input-group">
                            <label>Product Name *</label>
                            <input type="text" name="name" className="add-modal-input" required value={formData.name} onChange={handleChange} placeholder="e.g. Argentina Corned Beef" />
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Category</label>
                                <select name="category" className="add-modal-input" value={formData.category} onChange={handleChange}>
                                    {categories.filter(c => c !== "All").map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Unit</label>
                                <input type="text" name="unit" className="add-modal-input" value={formData.unit} onChange={handleChange} placeholder="pc, can, pack" />
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Cost Price</label>
                                <input type="number" name="cost_price" className="add-modal-input" required value={formData.cost_price} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Selling Price</label>
                                <input type="number" name="selling_price" className="add-modal-input" required value={formData.selling_price} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Initial Stock</label>
                                <input type="number" name="stock_quantity" className="add-modal-input" required value={formData.stock_quantity} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Min. Stock Level</label>
                                <input type="number" name="min_stock_level" className="add-modal-input" required value={formData.min_stock_level} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="add-product-actions">
                        <button type="button" className="add-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="add-confirm-btn">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
}