// ============================================================
// Dashboard.jsx — Overview with stats & recent orders
// Updated: handles new multi-item order structure
// ============================================================

import Card  from '../components/Card';
import Table from '../components/Table';

const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`;

const PayBadge = ({ status }) => {
  const map = { Paid: 'badge-green', Partial: 'badge-gold', Unpaid: 'badge-red' };
  return <span className={`badge ${map[status] || 'badge-grey'}`}>{status}</span>;
};

const ORDER_COLUMNS = [
  { key: 'id',            label: '#',       render: v => <span className="td-muted">#{v}</span> },
  { key: 'customerName',  label: 'Customer',render: v => <span className="td-primary">{v}</span> },
  { key: 'date',          label: 'Date',    render: v => <span className="td-muted">{v}</span> },
  { key: 'finalTotal',    label: 'Bill',    render: v => <span className="td-price">{fmt(v)}</span> },
  { key: 'amountDue',     label: 'Due',     render: v => v > 0
      ? <span style={{ color:'var(--red)', fontWeight:600 }}>{fmt(v)}</span>
      : <span style={{ color:'var(--green)', opacity:0.6 }}>—</span>
  },
  { key: 'paymentStatus', label: 'Payment', render: v => <PayBadge status={v} /> },
];

export default function Dashboard({ products, customers, orders }) {
  const totalProducts  = products.length;
  const totalCustomers = customers.length;
  const totalOrders    = orders.length;
  const lowStock       = products.filter(p => p.stock < 5).length;

  // Total revenue = sum of finalTotal from all orders
  const totalRevenue = orders.reduce((s, o) => s + (o.finalTotal ?? o.total ?? 0), 0);

  // Total pending dues across all orders
  const totalDue = orders.reduce((s, o) => s + (o.amountDue ?? 0), 0);

  const recentOrders = [...orders].slice(0, 6);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1>Overview</h1>
          <p>Welcome back — here's what's happening in your store today.</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        <Card label="Total Products"  value={totalProducts}  sub="Across all categories" icon="👗" />
        <Card label="Total Customers" value={totalCustomers} sub="Registered clients"    icon="👥" />
        <Card label="Total Orders"    value={totalOrders}    sub={`Revenue: ${fmt(totalRevenue)}`} icon="🧾" />
        <Card label="Pending Dues"    value={fmt(totalDue)}  sub="Across all customers"  icon="💳" alert={totalDue > 0} />
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="section-block">
          <div className="section-block-header">
            <div>
              <h3>Recent Orders</h3>
              <p>Last {recentOrders.length} transactions</p>
            </div>
          </div>
          <Table columns={ORDER_COLUMNS} data={recentOrders} emptyMsg="No orders yet." />
        </div>

        {/* Top Products */}
        <div className="section-block">
          <div className="section-block-header">
            <div>
              <h3>Top Products</h3>
              <p>By price — premium items</p>
            </div>
          </div>
          <div className="top-products">
            {[...products]
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
