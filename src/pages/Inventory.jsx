// ============================================================
// Inventory.jsx — Monitor stock levels
// Shows all products with visual stock indicators.
// Status rules:
//   stock < 5  → "Low Stock" (red)
//   otherwise  → "Available" (green)
// In future: this page can also handle stock adjustments via API
// ============================================================

import { useState } from 'react';
import Table from '../components/Table';
import { products as initialProducts } from '../data/dummyData';

const fmt = (n) => `Rs. ${n.toLocaleString()}`;

// Determine status label and badge class from stock count
function getStatus(stock) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'badge-red' };
  if (stock < 5)  return { label: 'Low Stock',    cls: 'badge-red' };
  return              { label: 'Available',       cls: 'badge-green' };
}

// Stock bar visual: shows fill % capped at 20 units = 100%
function StockBar({ stock }) {
  const max  = 20;
  const pct  = Math.min((stock / max) * 100, 100);
  const cls  = stock === 0 ? 'low' : stock < 5 ? 'low' : stock < 10 ? 'medium' : 'high';
  return (
    <div className="stock-bar">
      <div className={`stock-bar-fill ${cls}`} style={{ width:`${pct}%` }} />
    </div>
  );
}

export default function Inventory() {
  const [products, setProducts] = useState(initialProducts);

  // Manual stock update (quick +/- controls)
  const adjustStock = (id, delta) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  // Summary counts
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock   = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const available  = products.filter(p => p.stock >= 5).length;

  // Table columns
  const COLUMNS = [
    { key: 'name',     label: 'Product',  render: (v) => <span className="td-primary">{v}</span> },
    { key: 'category', label: 'Category' },
    { key: 'price',    label: 'Price',    render: (v) => <span className="td-price">{fmt(v)}</span> },
    { key: 'stock',    label: 'Stock',    render: (v, row) => (
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {/* Adjust buttons */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding:'2px 8px', fontWeight:700 }}
              onClick={() => adjustStock(row.id, -1)}
            >−</button>
            <span style={{ minWidth:28, textAlign:'center', fontWeight:600 }}>{v}</span>
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding:'2px 8px', fontWeight:700 }}
              onClick={() => adjustStock(row.id, +1)}
            >+</button>
          </div>
          {/* Visual bar */}
          <StockBar stock={v} />
        </div>
      )},
    { key: 'stock',    label: 'Status',   render: (v) => {
        const s = getStatus(v);
        return <span className={`badge ${s.cls}`}>{s.label}</span>;
      }},
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>Monitor and adjust stock levels for all products</p>
        </div>
      </div>

      {/* Summary Pills */}
      <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap' }}>
        <div style={{
          background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:10, padding:'14px 22px',
          boxShadow:'0 1px 3px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:12,
        }}>
          <span className="badge badge-green" style={{ fontSize:'0.8rem', padding:'5px 14px' }}>
            ✓ {available}
          </span>
          <span style={{ fontSize:'0.82rem', color:'#666259' }}>Items Available</span>
        </div>

        <div style={{
          background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:10, padding:'14px 22px',
          boxShadow:'0 1px 3px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:12,
        }}>
          <span className="badge badge-red" style={{ fontSize:'0.8rem', padding:'5px 14px' }}>
            ⚠ {lowStock}
          </span>
          <span style={{ fontSize:'0.82rem', color:'#666259' }}>Low Stock</span>
        </div>

        <div style={{
          background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:10, padding:'14px 22px',
          boxShadow:'0 1px 3px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:12,
        }}>
          <span className="badge badge-red" style={{ fontSize:'0.8rem', padding:'5px 14px' }}>
            ✕ {outOfStock}
          </span>
          <span style={{ fontSize:'0.82rem', color:'#666259' }}>Out of Stock</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="section-block">
        <div className="section-block-header">
          <div>
            <h3>
              Stock Levels
              <span className="row-count">{products.length} products</span>
            </h3>
            <p>Use + / − buttons to manually adjust stock quantities</p>
          </div>
        </div>
        <Table
          columns={COLUMNS}
          data={products}
          emptyMsg="No products in inventory."
        />
      </div>
    </div>
  );
}


