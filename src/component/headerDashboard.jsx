import React, { useState, useEffect } from "react";

function HeaderDashboard() {
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
      <img src="/images/sarisaritechLogo.png" alt="logo" />
      <h3 id="store-name">Tristan Sari Sari Store</h3>
      <div className="header-info-right">
        <h3 id="time">{timeString}</h3>
        <h3 id="date">{dateString}</h3>
      </div>
    </div>
  );
}

export default HeaderDashboard;