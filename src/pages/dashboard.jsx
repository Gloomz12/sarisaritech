import React, { useMemo } from 'react';

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

// MOCK DATA
import productsData from '../services/productsData.json';
import transactionHistory from '../services/transactionHistory.json';

export default function Dashboard() {
    
    const stats = useMemo(() => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        const calculateData = (txList) => {
            const amount = txList.reduce((sum, t) => sum + t.total_amount, 0);
            const count = txList.length;
            
            const itemCounts = {};
            txList.forEach(t => {
                t.items.forEach(item => {
                    itemCounts[item.product_name] = (itemCounts[item.product_name] || 0) + item.quantity;
                });
            });
            
            const topProduct = Object.keys(itemCounts).reduce((a, b) => 
                itemCounts[a] > itemCounts[b] ? a : b, "N/A"
            );

            return { amount, count, topProduct };
        };

        // Filter Transactions
        const todayTxs = transactionHistory.filter(t => t.created_at.startsWith(todayStr));
        const weeklyTxs = transactionHistory;

        return {
            today: calculateData(todayTxs),
            weekly: calculateData(weeklyTxs),
            lowStock: productsData.filter(p => p.stock_quantity <= p.min_stock_level)
        };
    }, []);

    return (
        <div>
            <HeaderDashboard />
            <div className="dashboard-contents" style={{ padding: '10px 30px' }}>
                <div className="dashboard-buttons">
                    <LargeButton pageIcon={<IoAdd size={30} />} pageName="Record Sale" variant="record-sale-btn" isFullWidth={true} path="/record-sale" />
                    
                    <div className="page-buttons-row">
                        <LargeButton pageIcon={<BsBoxSeam />} pageName="Inventory" variant="page-btn" isFullWidth={false} path="/inventory" />
                        <LargeButton pageIcon={<AiOutlineShoppingCart />} pageName="Restock" variant="page-btn" isFullWidth={false} path="/restock" />
                    </div>

                    <div className="page-buttons-row">
                        <LargeButton pageIcon={<VscHistory />} pageName="History" variant="page-btn" isFullWidth={false} path="/history" />
                        <LargeButton pageIcon={<GrAnalytics />} pageName="Statistics" variant="page-btn" isFullWidth={false} path="/statistics" />
                    </div>

                    <LargeButton pageIcon={<WiStars size={50} />} pageName="AI Insight" variant="ai-insights-btn" isFullWidth={true} path="/ai-insight" />
                </div>

                <div className="current-sale">
                    <SaleBoard 
                        title="Today's Sales" 
                        amount={stats.today.amount} 
                        count={stats.today.count}
                        topProduct={stats.today.topProduct}
                    />
                </div>

                <div className="weekly-sale">
                    <SaleBoard 
                        title="This Week's Sales" 
                        amount={stats.weekly.amount} 
                        count={stats.weekly.count}
                        topProduct={stats.weekly.topProduct}
                    />
                </div>

                <StockAlerts items={stats.lowStock} />
            </div>
        </div>
    );
}