import React, { useState, useEffect } from 'react';
import axios from 'axios';

//ICONS
import { IoAdd } from "react-icons/io5";
import { BsBoxSeam } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { VscHistory } from "react-icons/vsc";
import { GrAnalytics } from "react-icons/gr";
import { WiStars } from "react-icons/wi";

//COMPONENTS
import HeaderDashboard from '../component/headerDashboard.jsx';
import LargeButton from '../component/largePageButton.jsx';
import SaleBoard from '../component/saleBoard.jsx';
import StockAlerts from '../component/stockAlerts.jsx';


export default function Dashboard() {
    return (
        <div>
            <HeaderDashboard />
            <div className="dashboard-contents" style={{ padding: '10px 30px' }}>
                <div className="dashboard-buttons">
                    { /* Record Sale button */}
                    <LargeButton pageIcon={<IoAdd size={30} />} pageName="Record Sale" variant="record-sale-btn" isFullWidth={true} path="/record-sale" />
                    <div className="page-buttons-row">
                        { /* Inventory button */}
                        <LargeButton pageIcon={<BsBoxSeam />} pageName="Inventory" variant="page-btn" isFullWidth={false} path="/inventory" />
                        { /* Restock button */}
                        <LargeButton pageIcon={<AiOutlineShoppingCart />} pageName="Restock" variant="page-btn" isFullWidth={false} path="/restock" />
                    </div>
                    <div className="page-buttons-row">
                        { /* History button */}
                        <LargeButton pageIcon={<VscHistory />} pageName="History" variant="page-btn" isFullWidth={false} path="/history" />
                        { /* Analytics button */}
                        <LargeButton pageIcon={<GrAnalytics />} pageName="Analytics" variant="page-btn" isFullWidth={false} path="/analytics" />
                    </div>
                    { /* AI Insight button */}
                    <LargeButton pageIcon={<WiStars size={50} />} pageName="AI Insight" variant="ai-insights-btn" isFullWidth={true} path="/ai-insight" />
                </div>

                {/* Sales Boards */}
                <div className="current-sale">
                    {SaleBoard("Today's Sales")}
                </div>

                <div className="weekly-sale">
                    {SaleBoard("This Week's Sales")}
                </div>


                {/* Stock Alerts */}
                <StockAlerts />
            </div>
        </div>
    );
}