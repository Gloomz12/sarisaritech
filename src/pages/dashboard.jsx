import React, { useState, useEffect } from 'react';
import api from '../services/api';

// ICONS
import { IoAdd } from "react-icons/io5";
import { BsBoxSeam } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { VscHistory } from "react-icons/vsc";
import { GrAnalytics } from "react-icons/gr";
import { WiStars } from "react-icons/wi";

// COMPONENTS
import HeaderDashboard from '../component/headerDashboard.jsx';
import LargeButton from '../component/largePageButton.jsx';
import SaleBoard from '../component/saleBoard.jsx';
import StockAlerts from '../component/stockAlerts.jsx';

export default function Dashboard() {

    const [transactions, setTransactions] = useState([]);

    // FETCH DATA FROM BACKEND
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/transactions");
                setTransactions(res.data);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            }
        };

        fetchData();
    }, []);

    // TODAY FILTER
    const today = new Date();

    const todayTransactions = transactions.filter(t => {
        const d = new Date(t.created_at);
        return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
        );
    });

    const todaySales = todayTransactions.reduce(
        (sum, t) => sum + t.total_amount,
        0
    );

    const todayCount = todayTransactions.length;

    // WEEK FILTER
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const weeklyTransactions = transactions.filter(t => {
        const date = new Date(t.created_at);
        return date >= weekAgo && date <= now;
    });

    const weeklySales = weeklyTransactions.reduce(
        (sum, t) => sum + t.total_amount,
        0
    );

    const weeklyCount = weeklyTransactions.length;

    // TOP PRODUCT
    const productMap = {};

    transactions.forEach(t => {
        t.items.forEach(item => {
            if (!productMap[item.product_name]) {
                productMap[item.product_name] = 0;
            }
            productMap[item.product_name] += item.quantity;
        });
    });

    const topProductEntry = Object.entries(productMap).sort((a, b) => b[1] - a[1])[0];
    const topProduct = topProductEntry ? topProductEntry[0] : "No data";

    return (
        <div>
            <HeaderDashboard />

            <div className="dashboard-contents" style={{ padding: '10px 30px' }}>

                {/* BUTTONS */}
                <div className="dashboard-buttons">
                    <LargeButton pageIcon={<IoAdd size={30} />} pageName="Record Sale" variant="record-sale-btn" isFullWidth={true} path="/record-sale" />

                    <div className="page-buttons-row">
                        <LargeButton pageIcon={<BsBoxSeam />} pageName="Inventory" variant="page-btn" isFullWidth={false} path="/inventory" />
                        <LargeButton pageIcon={<AiOutlineShoppingCart />} pageName="Restock" variant="page-btn" isFullWidth={false} path="/restock" />
                    </div>

                    <div className="page-buttons-row">
                        <LargeButton pageIcon={<VscHistory />} pageName="History" variant="page-btn" isFullWidth={false} path="/history" />
                        <LargeButton pageIcon={<GrAnalytics />} pageName="Analytics" variant="page-btn" isFullWidth={false} path="/analytics" />
                    </div>

                    <LargeButton pageIcon={<WiStars size={50} />} pageName="AI Insight" variant="ai-insights-btn" isFullWidth={true} path="/ai-insight" />
                </div>

                {/* TODAY SALES */}
                <div className="current-sale">
                    <SaleBoard
                        boardLabel="Today's Sales"
                        totalSales={todaySales}
                        totalCount={todayCount}
                        topProduct={topProduct}
                    />
                </div>

                {/* WEEKLY SALES */}
                <div className="weekly-sale">
                    <SaleBoard
                        boardLabel="This Week's Sales"
                        totalSales={weeklySales}
                        totalCount={weeklyCount}
                        topProduct={topProduct}
                    />
                </div>

                {/* STOCK ALERTS */}
                <StockAlerts />
            </div>
        </div>
    );
}