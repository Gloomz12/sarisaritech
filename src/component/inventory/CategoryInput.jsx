import React, { useState, useEffect } from "react";

export default function CategoryInput({ categories, setCategories, value, onChange }) {
    const [inputValue, setInputValue] = useState(value || "");

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const handleAdd = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        const exists = categories.some(
            c => c.toLowerCase() === trimmed.toLowerCase()
        );

        if (!exists) {
            const updated = [...categories, trimmed];
            setCategories(updated);
            localStorage.setItem("categories", JSON.stringify(updated));
        }

        onChange(trimmed);
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                list="category-list"
                placeholder="Type or select category"
                onChange={(e) => {
                    setInputValue(e.target.value);
                    onChange(e.target.value);
                }}
            />

            <datalist id="category-list">
                {categories.map((cat, i) => (
                    <option key={i} value={cat} />
                ))}
            </datalist>

            <button type="button" onClick={handleAdd}>
                Add
            </button>
        </div>
    );
}