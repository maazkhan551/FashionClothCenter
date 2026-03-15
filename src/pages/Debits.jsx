// ============================================================
// Debits.jsx — Customer Dues Tracker
//
// HOW IT WORKS:
// - We derive debit data directly from the orders array.
// - We group orders by customerId.
// - For each customer we calculate:
//     totalDue    = sum of amountDue across all their orders
//     totalBilled = sum of finalTotal across all their orders
//     totalPaid   = sum of amountPaid across all their orders
// - "Clear" status  → totalDue === 0
// - "Partial Due"   → customer has some paid, some due
// - "Due"           → fully unpaid orders
//
// No separate debits array needed — computed from orders state.
//
// Props from App.jsx: orders, customers
// ============================================================

import { useState, useMemo } from 'react';
import Modal from '../components/Modal';
import Table from '../components/Table';
import '../styles/debits.css';

const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`;

// ── Status badge for debit state ─────────────────────────────
const DebitBadge = ({ due, total }) => {
  if (due <= 0)          return <span className="badge badge-green">Clear</span>;
  if (due < total * 0.9) return <span className="badge badge-gold">Partial Due</span>;
  return                        <span className="badge badge-red">Due</span>;
};

// ── Payment badge for individual order ───────────────────────
const PayBadge = ({ status }) => {
  const map = { Paid: 'badge-green', Partial: 'badge-gold', Unpaid: 'badge-red' };
  return <span className={`badge ${map[status] || 'badge-grey'}`}>{status}</span>;
};

// ── Columns for the customer detail modal's order table ──────
const ORDER_DETAIL_COLS = [
  { key: 'date',          label: 'Date',    render: v => <span className="td-muted">{v}</span> },
  { key: 'finalTotal',    label: 'Bill',    render: v => <span className="td-price">{fmt(v)}</span> },
  { key: 'amountPaid',    label: 'Paid',    render: v => <span style={{ color:'var(--green)', fontWeight:500 }}>{fmt(v)}</span> },
  { key: 'amountDue',     label: 'Due',     render: v => v > 0
      ? <span style={{ color:'var(--red)', fontWeight:600 }}>{fmt(v)}</span>
      : <span style={{ color:'var(--green)', opacity:0.6 }}>—</span>
  },
  { key: 'paymentStatus', label: 'Status',  render: v => <PayBadge status={v} /> },
  { key: 'items',         label: 'Products',render: v =>
      <span className="td-muted">
        {Array.isArray(v) ? v.map(i => i.productName).join(', ') : '—'}
      </span>
  },
];

export default function Debits({ orders, customers }) {

  // Search query for filtering customer records
  const [searchQuery, setSearchQuery] = useState('');

  // Which customer's detail modal is open (null = closed)
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ── Build customer debit summaries from orders ────────────
  // useMemo so it only re-calculates when orders or customers change
  const customerSummaries = useMemo(() => {
    // Create a map: customerId → summary object
    const map = {};

    orders.forEach(order => {
      if (!map[order.customerId]) {
        // Find the customer from customers array for their phone number
        const cust = customers.find(c => c.id === order.customerId);
        map[order.customerId] = {
          customerId:   order.customerId,
          customerName: order.customerName,
          phone:        cust?.phone || order.customerPhone || '—',
          totalBilled:  0,
          totalPaid:    0,
          totalDue:     0,
          orderCount:   0,
          lastOrderDate: '',
          orders:       [],
        };
      }

      const s = map[order.customerId];
      s.totalBilled   += order.finalTotal;
      s.totalPaid     += order.amountPaid;
      s.totalDue      += order.amountDue;
      s.orderCount    += 1;
      s.orders.push(order);

      // Track the most recent order date
      if (!s.lastOrderDate || order.date > s.lastOrderDate) {
        s.lastOrderDate = order.date;
      }
    });

    // Convert map to array, sorted: highest due first
    return Object.values(map).sort((a, b) => b.totalDue - a.totalDue);
  }, [orders, customers]);

  // ── Filter by search query (name or phone) ────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customerSummaries;
    return customerSummaries.filter(s =>
      s.customerName.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q)
    );
  }, [customerSummaries, searchQuery]);

  // ── Summary stats for the top cards ──────────────────────
  const totalPendingDue  = customerSummaries.reduce((s, c) => s + c.totalDue, 0);
  const customersWithDue = customerSummaries.filter(c => c.totalDue > 0).length;
  const customersCleared = customerSummaries.filter(c => c.totalDue <= 0).length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1>Customer Dues</h1>
          <p>Track pending balances and debit records for all customers</p>
        </div>
      </div>

      {/* ── Summary Cards ─────────────────────────────────── */}
      <div className="debits-stats-grid">
        <div className="debit-stat-card alert">
          <div className="debit-stat-icon">💳</div>
          <div className="debit-stat-label">Total Pending</div>
          <div className="debit-stat-value">{fmt(totalPendingDue)}</div>
          <div className="debit-stat-sub">Across all customers</div>
        </div>
        <div className="debit-stat-card">
          <div className="debit-stat-icon">⚠️</div>
          <div className="debit-stat-label">Customers with Due</div>
          <div className="debit-stat-value">{customersWithDue}</div>
          <div className="debit-stat-sub">Have pending balance</div>
        </div>
        <div className="debit-stat-card clear">
          <div className="debit-stat-icon">✅</div>
          <div className="debit-stat-label">Cleared Customers</div>
          <div className="debit-stat-value">{customersCleared}</div>
          <div className="debit-stat-sub">No outstanding balance</div>
        </div>
        <div className="debit-stat-card">
          <div className="debit-stat-icon">📋</div>
          <div className="debit-stat-label">Total Orders</div>
          <div className="debit-stat-value">{orders.length}</div>
          <div className="debit-stat-sub">All time</div>
        </div>
      </div>

      {/* ── Main Debit Records Panel ──────────────────────── */}
      <div className="section-block">

        {/* Header with search bar */}
        <div className="debits-panel-header">
          <div>
            <h3>
              Customer Records
              <span className="row-count">{filtered.length}</span>
            </h3>
            <p>Click a customer row to view their full order & payment history</p>
          </div>

          {/* 🔍 Search bar */}
          <div className="debits-search-wrapper">
            <span className="debits-search-icon">🔍</span>
            <input
              type="text"
              className="debits-search-input"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="debits-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >✕</button>
            )}
          </div>
        </div>

        {/* Customer records table */}
        {filtered.length === 0 ? (
          <div className="table-empty">
            <span className="empty-icon">🔍</span>
            <p>No customers found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Total Billed</th>
                  <th>Total Paid</th>
                  <th>Pending Due</th>
                  <th>Last Order</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s.customerId} className={s.totalDue > 0 ? 'debit-row-due' : ''}>
                    <td><span className="td-muted">{idx + 1}</span></td>

                    {/* Customer with initials avatar */}
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="cust-avatar">
                          {s.customerName.split(' ').map(w => w[0]).join('').slice(0,2)}
                        </div>
                        <span className="td-primary">{s.customerName}</span>
                      </div>
                    </td>

                    <td><span className="td-muted">{s.phone}</span></td>
                    <td><span className="td-muted">{s.orderCount}</span></td>
                    <td><span className="td-price">{fmt(s.totalBilled)}</span></td>
                    <td><span style={{ color:'var(--green)', fontWeight:500 }}>{fmt(s.totalPaid)}</span></td>

                    {/* Pending due — highlighted red if > 0 */}
                    <td>
                      {s.totalDue > 0
                        ? <span className="pending-due-amount">{fmt(s.totalDue)}</span>
                        : <span style={{ color:'var(--green)', opacity:0.7 }}>—</span>
                      }
                    </td>

                    <td><span className="td-muted">{s.lastOrderDate}</span></td>
                    <td><DebitBadge due={s.totalDue} total={s.totalBilled} /></td>

                    {/* View Details button */}
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedCustomer(s)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Customer Detail Modal ─────────────────────────── */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`${selectedCustomer.customerName} — Payment History`}
        >
          {/* Customer summary chips inside modal */}
          <div className="modal-customer-chips">
            <div className="modal-chip billed">
              <span>Total Billed</span>
              <strong>{fmt(selectedCustomer.totalBilled)}</strong>
            </div>
            <div className="modal-chip paid">
              <span>Total Paid</span>
              <strong>{fmt(selectedCustomer.totalPaid)}</strong>
            </div>
            <div className={`modal-chip ${selectedCustomer.totalDue > 0 ? 'due' : 'clear'}`}>
              <span>Remaining Due</span>
              <strong>{fmt(selectedCustomer.totalDue)}</strong>
            </div>
          </div>

          <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:14 }}>
            {selectedCustomer.orderCount} order(s) · Phone: {selectedCustomer.phone}
          </p>

          {/* Order breakdown table */}
          <Table
            columns={ORDER_DETAIL_COLS}
            data={selectedCustomer.orders}
            emptyMsg="No orders found."
          />
        </Modal>
      )}
    </div>
  );
}
