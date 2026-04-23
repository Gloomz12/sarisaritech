import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LargeButton({ pageIcon, pageName, variant, isFullWidth, path }) {
    const navigate = useNavigate();
    const buttonClass = `large-button ${variant} ${isFullWidth ? 'btn-full' : 'btn-half'}`;

    return (
        <button className={buttonClass} onClick={() => navigate(path)}>
            <span className="button-icon" style={{ fontSize: '1.2rem' }}>
                {pageIcon}
            </span>
            <h1 id="large-button-text">{pageName}</h1>
        </button>
    );
}