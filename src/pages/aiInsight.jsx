import React, { useState, useEffect } from 'react';

// ICONS
import { WiStars } from "react-icons/wi";
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from "react-icons/hi";
import { MdOutlineInventory2, MdAttachMoney } from "react-icons/md";

// COMPONENTS
import Header from '../component/header.jsx';

// SERVICES
import productsData from '../services/productsData.json';
import transactionHistory from '../services/transactionHistory.json';

export default function AiInsight() {
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState({
        summary: "",
        recommendations: [],
        stats: { totalSales: 0, lowStockCount: 0, topCategory: "" }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            generateMockAnalysis();
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const generateMockAnalysis = () => {
        const lowStock = productsData.filter(p => p.stock_quantity <= p.min_stock_level);
        const totalRev = transactionHistory.reduce((sum, t) => sum + t.total_amount, 0);
        
        const catCounts = {};
        productsData.forEach(p => {
            catCounts[p.category] = (catCounts[p.category] || 0) + 1;
        });
        const topCat = Object.keys(catCounts).reduce((a, b) => catCounts[a] > catCounts[b] ? a : b, "N/A");

        const recs = [];
        
        if (lowStock.length > 0) {
            recs.push({
                type: "warning",
                title: "Stock Depletion Alert",
                text: `Critical: ${lowStock[0].name} and ${lowStock.length - 1} other items are below safety levels.`
            });
        }

        recs.push({
            type: "success",
            title: "Category Dominance",
            text: `Your '${topCat}' section currently has the highest variety. It is driving 24% of your foot traffic.`
        });

        recs.push({
            type: "info",
            title: "Peak Hour Prediction",
            text: "Based on history, your busiest window is 4:00 PM - 6:00 PM. Prepare change (coins) beforehand."
        });

        setInsights({
            summary: `Analysis of ${transactionHistory.length} transactions suggests your store is heavily focused on ${topCat}. Inventory health is currently at ${Math.round(((productsData.length - lowStock.length) / productsData.length) * 100)}%.`,
            recommendations: recs,
            stats: {
                totalSales: totalRev,
                lowStockCount: lowStock.length,
                topCategory: topCat
            }
        });
    };

    if (loading) return (
        <div className="ai-loading-container">
            <div className="ai-loader"></div>
            <p>Consulting Sari-Sari Smart AI...</p>
        </div>
    );

    return (
        <div className="ai-insight-page">
            <Header currentPage="AI Insight" />

            <div className="ai-body">
                <div className="ai-hero">
                    <div className="ai-hero-header">
                        <WiStars className="ai-sparkle" />
                        <h2>AI Store Consultant</h2>
                    </div>
                    <p className="ai-summary">{insights.summary}</p>
                </div>

                <div className="ai-grid">
                    <div className="ai-card stat">
                        <MdAttachMoney className="stat-icon-img cash" />
                        <div className="stat-info">
                            <label>Total Value Sold</label>
                            <h3>₱{insights.stats.totalSales.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="ai-card stat">
                        <MdOutlineInventory2 className="stat-icon-img stock" />
                        <div className="stat-info">
                            <label>Low Stock Items</label>
                            <h3 className={insights.stats.lowStockCount > 0 ? "red-text" : ""}>
                                {insights.stats.lowStockCount}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="ai-section">
                    <h3>Strategic Recommendations</h3>
                    {insights.recommendations.map((rec, i) => (
                        <div key={i} className={`ai-rec-box ${rec.type}`}>
                            <div className="ai-rec-icon">
                                {rec.type === 'warning' ? <HiOutlineTrendingDown /> : <HiOutlineTrendingUp />}
                            </div>
                            <div className="ai-rec-content">
                                <h4>{rec.title}</h4>
                                <p>{rec.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}