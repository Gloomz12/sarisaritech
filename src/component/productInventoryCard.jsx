import react from "react";

//ICONS
import { LuPencilLine } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { GiCardboardBoxClosed } from "react-icons/gi";

export default function InventoryCard({ product, onEdit, onRestock, onDelete}) {
    const { name, category, selling_price, stock_quantity, min_stock_level } = product;

    let statusText = "OK";
    let statusColor = "status-ok";

    if (stock_quantity <= min_stock_level / 2) {
        statusText = "CRITICAL";
        statusColor = "status-critical";
    } else if (stock_quantity <= min_stock_level) {
        statusText = "LOW";
        statusColor = "status-low";
    }

    return (
        <div className="inventory-card">
            <div className="card-header">
                <div className="title-group">
                    <h3 className="inv-product-name">{name}</h3>
                    <p className="inv-category-name">{category}</p>
                </div>
                <div className={`status-badge ${statusColor}`}>
                    <span className="dot"></span>
                    {statusText}
                </div>
            </div>

            <div className="metrics-grid">
                <div className="metric-item">
                    <label>Price</label>
                    <p>₱{selling_price}</p>
                </div>
                <div className="metric-item">
                    <label>Stock</label>
                    <p>{stock_quantity} units</p>
                </div>
                <div className="metric-item">
                    <label>Min Level</label>
                    <p>{min_stock_level}</p>
                </div>
            </div>

            <div className="action-row">

                <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(product)}>
                    <LuPencilLine /> Edit
                </button>

                <button
                    className="action-btn restock-btn"
                    onClick={() => onRestock(product)}>
                    <GiCardboardBoxClosed /> Restock
                </button>

                <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(product)}>
                    <FaRegTrashAlt /> Delete
                </button>

            </div>
        </div>
    );
}