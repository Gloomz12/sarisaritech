import {React , useState} from "react";

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
    return (
        <div className="category-scroll-container">
            {categories.map((cat, index) => (
                <button
                    key={index}
                    className={`category-item ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => onCategoryChange(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}