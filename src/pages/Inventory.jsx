// ============================================================
// Inventory.jsx — Monitor stock levels
// ✅ Receives products + setProducts as props from App.jsx
//    so stock adjustments here reflect on Products & Dashboard.
// ============================================================

import Table from '../components/Table';

const fmt = (n) => `Rs. ${n.toLocaleString()}`;

function getStatus(stock) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'badge-red'   };
  if (stock < 5)  return { label: 'Low Stock',    cls: 'badge-red'   };
  return              { label: 'Available',       cls: 'badge-green' };
}

function StockBar({ stock }) {
  const pct = Math.min((stock / 20) * 100, 100);
  const cls = stock === 0 ? 'low' : stock < 5 ? 'low' : stock < 10 ? 'medium' : 'high';
  return (
    <div className="stock-bar">
      <div className={`stock-bar-fill ${cls}`} style={{ width:`${pct}%` }} />
    </div>
  );
}

export default function Inventory({ products, setProducts }) {
  // Adjust stock count up or down; minimum 0
  const adjustStock = (id, delta) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)
    );
  };

  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock   = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const available  = products.filter(p => p.stock >= 5).length;

  const COLUMNS = [
    { key: 'name',     label: 'Product',  render: (v) => <span className="td-primary">{v}</span> },
    { key: 'category', label: 'Category' },
    { key: 'price',    label: 'Price',    render: (v) => <span className="td-price">{fmt(v)}</span> },
    { key: 'stock',    label: 'Stock',    render: (v, row) => (
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button className="btn btn-ghost btn-sm" style={{ padding:'2px 8px', fontWeight:700 }}
              onClick={() => adjustStock(row.id, -1)}>−</button>
            <span style={{ minWidth:28, textAlign:'center', fontWeight:600 }}>{v}</span>
            <button className="btn btn-ghost btn-sm" style={{ padding:'2px 8px', fontWeight:700 }}
              onClick={() => adjustStock(row.id, +1)}>+</button>
          </div>
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
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>Monitor and adjust stock levels for all products</p>
        </div>
      </div>

      {/* Summary Pills */}
      <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap' }}>
        {[
          { count: available,  label: 'Items Available', cls: 'badge-green', icon: '✓' },
          { count: lowStock,   label: 'Low Stock',       cls: 'badge-red',   icon: '⚠' },
          { count: outOfStock, label: 'Out of Stock',    cls: 'badge-red',   icon: '✕' },
        ].map(({ count, label, cls, icon }) => (
          <div key={label} style={{
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:10, padding:'14px 22px',
            boxShadow:'0 1px 3px rgba(0,0,0,0.06)',
            display:'flex', alignItems:'center', gap:12,
          }}>
            <span className={`badge ${cls}`} style={{ fontSize:'0.8rem', padding:'5px 14px' }}>
              {icon} {count}
            </span>
            <span style={{ fontSize:'0.82rem', color:'#666259' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="section-block">
        <div className="section-block-header">
          <div>
            <h3>Stock Levels <span className="row-count">{products.length} products</span></h3>
            <p>Use + / − buttons to manually adjust stock quantities</p>
          </div>
        </div>
        <Table columns={COLUMNS} data={products} emptyMsg="No products in inventory." />
      </div>
    </div>
  );
}


