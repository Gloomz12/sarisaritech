import React from "react";
import { CiSearch } from "react-icons/ci";

export default function SearchBar({ placeholder, value, onSearchChange }) {
    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <CiSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input-field"
                    placeholder={placeholder || "Search..."}
                    value={value}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}