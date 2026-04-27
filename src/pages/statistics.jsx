import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

// COMPONENTS 
import TimeFilter from '../component/timeFilter.jsx';
import Header from '../component/header.jsx';

// SERVICES (Only pulling TransactionHistory now)
import TransactionHistory from '../services/transactionHistory.json';

// ICONS
import { TbPresentationAnalyticsFilled, TbShoppingCartFilled  } from "react-icons/tb";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function Statistics() {
  const [timeRange, setTimeRange] = useState('1week');

  const analytics = useMemo(() => {
    const now = new Date();
    let currentStart, prevStart;
    let buckets = [];
    let getBucketKey;


    if (timeRange === '1day') {
      currentStart = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      prevStart = new Date(currentStart.getTime() - (24 * 60 * 60 * 1000));
      for (let i = 0; i < 12; i++) {
        const bucketTime = new Date(currentStart.getTime() + (i * 2 * 60 * 60 * 1000));
        let hr = bucketTime.getHours();
        buckets.push({
          key: i.toString(),
          label: `${hr % 12 || 12}${hr >= 12 ? 'PM' : 'AM'}`,
          amount: 0
        });
      }
      getBucketKey = (date) => Math.floor((date.getTime() - currentStart.getTime()) / (2 * 60 * 60 * 1000)).toString();
    }
    else if (timeRange === '1week' || timeRange === '1month') {
      const days = timeRange === '1week' ? 7 : 30;
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
      prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((days * 2) - 1));
      for (let i = 0; i < days; i++) {
        const d = new Date(currentStart.getFullYear(), currentStart.getMonth(), currentStart.getDate() + i);
        buckets.push({
          key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
          label: d.getDate().toString(),
          amount: 0
        });
      }
      getBucketKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }
    else {
      const months = timeRange === '6months' ? 6 : 12;
      currentStart = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
      prevStart = new Date(now.getFullYear(), now.getMonth() - ((months * 2) - 1), 1);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 0; i < months; i++) {
        const d = new Date(currentStart.getFullYear(), currentStart.getMonth() + i, 1);
        buckets.push({
          key: `${d.getFullYear()}-${d.getMonth()}`,
          label: monthNames[d.getMonth()],
          amount: 0
        });
      }
      getBucketKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;
    }

    const bucketMap = {};
    buckets.forEach(b => bucketMap[b.key] = b);

    let currentTotal = 0;
    let prevTotal = 0;
    let overallTotal = 0;
    let currentTransactions = [];
    const productStats = {};
    const categoryTotals = {};

    TransactionHistory.forEach(tx => {
      const txDate = new Date(tx.created_at);
      const amt = tx.total_amount;

      if (txDate >= currentStart && txDate <= now) {
        currentTotal += amt;
        currentTransactions.push(amt);

        const key = getBucketKey(txDate);
        if (bucketMap[key]) bucketMap[key].amount += amt;

        tx.items.forEach(item => {
          const catName = (item.category && item.category.trim() !== "") ? item.category.trim() : "Uncategorized";
          categoryTotals[catName] = (categoryTotals[catName] || 0) + item.subtotal;
          overallTotal += item.subtotal;

          const productName = item.product_name;
          if (!productStats[productName]) {
            productStats[productName] = { name: productName, sold: 0, revenue: 0 };
          }
          productStats[productName].sold += item.quantity;
          productStats[productName].revenue += item.subtotal;
        });
      }
      else if (txDate >= prevStart && txDate < currentStart) {
        prevTotal += amt;
      }
    });

    const categoryList = Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        percentage: overallTotal > 0 ? Math.round((value / overallTotal) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value); // Highest sales first

    const trend = prevTotal === 0 ? (currentTotal > 0 ? 100 : 0) : ((currentTotal - prevTotal) / prevTotal) * 100;

    const topProductsList = Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      cards: {
        total: currentTotal.toLocaleString(),
        avg: currentTransactions.length ? Math.round(currentTotal / currentTransactions.length).toLocaleString() : "0",
        trend: trend.toFixed(1),
        best: Math.max(...buckets.map(b => b.amount), 0).toLocaleString(),
        active: currentTransactions.length
      },
      chart: {
        labels: buckets.map(b => b.label),
        datasets: [{
          data: buckets.map(b => b.amount),
          backgroundColor: '#ff6b35',
          borderRadius: 6,
          barThickness: 12,
        }]
      },
      categories: categoryList,
      topProducts: topProductsList
    };
  }, [timeRange]);

  return (
    <div className="statistics-body">
      <Header currentPage="Statistics" />
      <div className='time'><TimeFilter onFilterChange={setTimeRange} /></div>

      <div className="stats-container">
        <div className="stats-grid">
          <div className="stat-box">
            <div className="icon sales-icon">₱</div>
            <div className="content">
              <p className="label">Total Sales</p>
              <h2 className="value">₱{analytics.cards.total}</h2>
            </div>
          </div>
          <div className="stat-box">
            <TbPresentationAnalyticsFilled className="icon avg-icon" />
            <div className="content">
              <p className="label">Average</p>
              <h2 className="value">₱{analytics.cards.avg}</h2>
            </div>
          </div>
        </div>

        <div className="trend-box">
          <div className="trend-left">
            <div className={`trend-arrow ${parseFloat(analytics.cards.trend) < 0 ? 'down' : 'up'} icon`}>
              {parseFloat(analytics.cards.trend) < 0 ? '↘' : '↗'}
            </div>
            <div className="trend-texts">
              <p style={{ fontWeight: 'bold', margin: 0 }}>Growth Trend</p>
              <p className="label">vs previous period</p>
            </div>
          </div>
          <h2 className={`trend-val ${parseFloat(analytics.cards.trend) < 0 ? 'neg' : 'pos'}`}>
            {parseFloat(analytics.cards.trend) > 0 ? '+' : ''}{analytics.cards.trend}%
          </h2>
        </div>

        <div className="chart-section">
          <p className="chart-title">Sales Overview</p>
          <div className="chart-scroll-wrapper">
            <div className="chart-inner-container" style={{
              width: analytics.chart.labels.length > 7 ? `${analytics.chart.labels.length * 50}px` : '100%'
            }}>
              <Bar
                data={analytics.chart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: '#f3f4f6' } }
                  }
                }}
              />
            </div>
          </div>
          {analytics.chart.labels.length > 7 && (
            <p className="scroll-hint">← Swipe to see more →</p>
          )}
        </div>

        <div className="bottom-metrics">
          <div className="metric">
            <h3 className="m-val">₱{analytics.cards.avg}</h3>
            <p className="m-label">Average</p>
          </div>
          <div className="metric">
            <h3 className="m-val">₱{analytics.cards.best}</h3>
            <p className="m-label">Best Period</p>
          </div>
          <div className="metric">
            <h3 className="m-val">{analytics.cards.active}</h3>
            <p className="m-label">Active</p>
          </div>
        </div>

        <div className="category-section">
          <p className="chart-title">Sales by Category</p>
          <div className="category-list">
            {analytics.categories.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '20px' }}>No sales data available for this period.</p>
            ) : (
              analytics.categories.map((cat, index) => (
                <div key={index} className="category-item">
                  <div className="category-info">
                    <div className="cat-name-group">
                      <span className={`cat-dot dot-${index % 5}`}></span>
                      <span className="cat-name">{cat.name}</span>
                    </div>
                    <span className="cat-percentage">{cat.percentage}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className={`progress-fill fill-${index % 5}`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                  <p className="cat-value">₱{cat.value.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="top-products-section">
        <div className="section-header">
          <p className="chart-title">Top Products</p>
          <TbShoppingCartFilled className="section-icon" />
        </div>

        <div className="products-list">
          {analytics.topProducts.map((product, index) => (
            <div key={index} className="product-item">
              <div className="product-rank">
                <span className={`rank-badge rank-${index + 1}`}>#{index + 1}</span>
              </div>

              <div className="product-details">
                <div className="product-info-main">
                  <p className="p-name">{product.name}</p>
                  <p className="p-sold">{product.sold} sold</p>
                </div>
                <div className="product-price-info">
                  <h3 className="p-revenue">₱{product.revenue.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}