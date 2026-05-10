import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GoArrowLeft } from "react-icons/go";

function Header({ currentPage }) {
    const navigate = useNavigate();

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeString = dateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const dateString = dateTime.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="header">
            <div className="header-info-left">
                <GoArrowLeft size={15} onClick={() => navigate(-1)} cursor="pointer" />
                <h3 id="page-name">{currentPage}</h3>
            </div>
            <h3 id="store-name">Tristan Sari Sari Store</h3>
            <div className="header-info-right">
                <h3 id="time">{timeString}</h3>
                <h3 id="date">{dateString}</h3>
            </div>
        </div>
    );
}

export default Header;