import React, { useState } from 'react';

export default function TimeFilter({onFilterChange}) {
    const filterOptions = [
        { id: '1day', label: '1 Day', subtext: 'By 1 hours' },
        { id: '1week', label: '1 Week', subtext: 'By day' },
        { id: '1month', label: '1 Month', subtext: 'By day' },
        { id: '6months', label: '6 Months', subtext: 'By month' },
        { id: '1year', label: '1 Year', subtext: 'By month' },
    ];

    const [activeFilter, setActiveFilter] = useState('1week');

    const handleSelect = (id) => {
        setActiveFilter(id);
        if (onFilterChange) onFilterChange(id);
    };

    return (
        <div className="filter-container">
            {filterOptions.map((option) => (
                <button
                    key={option.id}
                    className={`filter-button ${activeFilter === option.id ? 'active' : ''}`}
                    onClick={() => handleSelect(option.id)}
                >
                    <span className="filter-label">{option.label}</span>
                    <span className="filter-subtext">{option.subtext}</span>
                </button>
            ))}
        </div>
    );
};

