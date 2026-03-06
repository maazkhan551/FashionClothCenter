// ============================================================
// Dashboard.jsx — Overview page with stats & recent orders
// Data comes from dummyData.js via React state.
// ============================================================

import { useState } from 'react';
import Card   from '../components/Card';
import Table  from '../components/Table';
import { products, customers, orders } from '../data/dummyData';

// Format price in PKR
const fmt = (n) => `Rs. ${n.toLocaleString()}`;

// Status badge helper
const StatusBadge = ({ status }) => {
  const map = {
    Delivered:  'badge-green',
    Shipped:    'badge-blue',
    Processing: 'badge-gold',
    Pending:    'badge-grey',
  };
  return <span className={`badge ${map[status] || 'badge-grey'}`}>{status}</span>;
};

// Columns for the recent orders table
const ORDER_COLUMNS = [
  { key: 'id',           label: '#',        render: (v) => <span className="td-muted">#{v}</span> },
  { key: 'customerName', label: 'Customer',  render: (v) => <span className="td-primary">{v}</span> },
  { key: 'productName',  label: 'Product'  },
  { key: 'quantity',     label: 'Qty',      render: (v) => <span className="td-muted">×{v}</span> },
  { key: 'total',        label: 'Total',    render: (v) => <span className="td-price">{fmt(v)}</span> },
  { key: 'status',       label: 'Status',   render: (v) => <StatusBadge status={v} /> },
];

export default function Dashboard() {
  // In future: replace these with API calls (useEffect + fetch)
  const [productList]  = useState(products);
  const [customerList] = useState(customers);
  const [orderList]    = useState(orders);

  // Calculate stats
  const totalProducts  = productList.length;
  const totalCustomers = customerList.length;
  const totalOrders    = orderList.length;
  const lowStock       = productList.filter(p => p.stock < 5).length;
  const totalRevenue   = orderList.reduce((sum, o) => sum + o.total, 0);

  // Show only last 5 orders on dashboard
  const recentOrders = [...orderList].reverse().slice(0, 6);

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Overview</h1>
          <p>Welcome back — here's what's happening in your store today.</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        <Card
          label="Total Products"
          value={totalProducts}
          sub="Across all categories"
          icon="👗"
        />
        <Card
          label="Total Customers"
          value={totalCustomers}
          sub="Registered clients"
          icon="👥"
        />
        <Card
          label="Total Orders"
          value={totalOrders}
          sub={`Revenue: ${fmt(totalRevenue)}`}
          icon="🧾"
        />
        <Card
          label="Low Stock Items"
          value={lowStock}
          sub="Items with stock below 5"
          icon="⚠️"
          alert={lowStock > 0}
        />
      </div>

      {/* ── Bottom Grid: Recent Orders + Top Products ── */}
      <div className="dashboard-grid">

        {/* Recent Orders Table */}
        <div className="section-block">
          <div className="section-block-header">
            <div>
              <h3>Recent Orders</h3>
              <p>Last {recentOrders.length} transactions</p>
            </div>
          </div>
          <Table
            columns={ORDER_COLUMNS}
            data={recentOrders}
            emptyMsg="No orders yet."
          />
        </div>

        {/* Top Products sidebar panel */}
        <div className="section-block">
          <div className="section-block-header">
            <div>
              <h3>Top Products</h3>
              <p>By price — premium items</p>
            </div>
          </div>
          <div className="top-products">
            {[...productList]
              .sort((a, b) => b.price - a.price)
              .slice(0, 6)
              .map(p => (
                <div key={p.id} className="top-product-item">
                  <div>
                    <div className="tpi-name">{p.name}</div>
                    <div className="tpi-cat">{p.category} · {p.size}</div>
                  </div>
                  <div className="tpi-price">{fmt(p.price)}</div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
