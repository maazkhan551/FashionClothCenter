// ============================================================
// Orders.jsx — Multi-product orders with discount & payment
//
// HOW IT WORKS:
// 1. Admin selects a customer
// 2. Admin adds multiple product rows, each with:
//    product, quantity, fixed-Rs discount
// 3. Bill summary auto-calculates in real time
// 4. Admin chooses payment status:
//    - Paid    → amountDue = 0
//    - Partial → admin enters amountPaid → due = finalTotal - amountPaid
//    - Unpaid  → amountPaid = 0, amountDue = finalTotal
// 5. Order saved to shared App.jsx state
//    → Dashboard, Inventory, Debits all update automatically
//
// Props from App.jsx: products, customers, orders, setOrders
// ============================================================

import { useState } from 'react';
import Table from '../components/Table';
import '../styles/orders.css';

const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`;

// ── Payment status badge ──────────────────────────────────────
const PayBadge = ({ status }) => {
  const map = { Paid: 'badge-green', Partial: 'badge-gold', Unpaid: 'badge-red' };
  return <span className={`badge ${map[status] || 'badge-grey'}`}>{status}</span>;
};

// ── Order history table columns (new structure) ───────────────
const HISTORY_COLS = [
  { key: 'id',            label: '#',       render: (v)    => <span className="td-muted">#{v}</span> },
  { key: 'customerName',  label: 'Customer',render: (v)    => <span className="td-primary">{v}</span> },
  { key: 'date',          label: 'Date',    render: (v)    => <span className="td-muted">{v}</span> },
  { key: 'items',         label: 'Items',   render: (v)    => <span className="td-muted">{Array.isArray(v) ? v.length : 1} item(s)</span> },
  { key: 'finalTotal',    label: 'Bill',    render: (v)    => <span className="td-price">{fmt(v)}</span> },
  { key: 'amountPaid',    label: 'Paid',    render: (v)    => <span style={{ color:'var(--green)', fontWeight:500 }}>{fmt(v)}</span> },
  { key: 'amountDue',     label: 'Due',     render: (v)    => v > 0
      ? <span style={{ color:'var(--red)', fontWeight:600 }}>{fmt(v)}</span>
      : <span style={{ color:'var(--green)', opacity:0.6 }}>—</span>
  },
  { key: 'paymentStatus', label: 'Payment', render: (v)    => <PayBadge status={v} /> },
];

// ── Blank product row template ────────────────────────────────
// Each row = one product line inside an order
const blankRow = () => ({
  rowId:       Date.now() + Math.random(),
  productId:   '',
  productName: '',
  unitPrice:   0,
  quantity:    1,
  discount:    0,
  itemTotal:   0,
});

// ═════════════════════════════════════════════════════════════
export default function Orders({ products, customers, orders, setOrders }) {

  const [customerId,     setCustomerId]     = useState('');
  const [rows,           setRows]           = useState([blankRow()]);
  const [paymentStatus,  setPaymentStatus]  = useState('Paid');
  const [amountPaid,     setAmountPaid]     = useState('');

  // ── Auto-calculated totals ────────────────────────────────
  const subtotal      = rows.reduce((s, r) => s + r.unitPrice * Number(r.quantity || 1), 0);
  const totalDiscount = rows.reduce((s, r) => s + Number(r.discount || 0), 0);
  const finalTotal    = Math.max(0, subtotal - totalDiscount);

  // How much is being paid right now
  const calcPaid = () => {
    if (paymentStatus === 'Paid')   return finalTotal;
    if (paymentStatus === 'Unpaid') return 0;
    return Math.min(Math.max(Number(amountPaid) || 0, 0), finalTotal);
  };
  const calcDue = () => finalTotal - calcPaid();

  // ── Update one field in one row ───────────────────────────
  const updateRow = (rowId, field, value) => {
    setRows(prev => prev.map(row => {
      if (row.rowId !== rowId) return row;
      const updated = { ...row, [field]: value };

      // Auto-fill unit price when product is selected
      if (field === 'productId') {
        const p = products.find(p => p.id === Number(value));
        updated.productName = p ? p.name    : '';
        updated.unitPrice   = p ? p.price   : 0;
      }

      // Recalculate item total
      const price    = Number(field === 'unitPrice' ? value : updated.unitPrice) || 0;
      const qty      = Number(field === 'quantity'  ? value : updated.quantity)  || 1;
      const rawTotal = price * qty;
      const disc     = Math.min(
        Number(field === 'discount' ? value : updated.discount) || 0,
        rawTotal  // discount can never exceed item total
      );
      updated.discount  = disc;
      updated.itemTotal = rawTotal - disc;
      return updated;
    }));
  };

  const addRow    = ()    => setRows(prev => [...prev, blankRow()]);
  const removeRow = (id)  => { if (rows.length > 1) setRows(prev => prev.filter(r => r.rowId !== id)); };

  // ── Place Order ───────────────────────────────────────────
  const placeOrder = () => {
    const customer = customers.find(c => c.id === Number(customerId));
    if (!customer) { alert('Please select a customer.'); return; }

    for (const row of rows) {
      if (!row.productId) { alert('Each product row must have a product selected.'); return; }
      if (Number(row.quantity) < 1) { alert(`Quantity must be at least 1 for "${row.productName}".`); return; }
    }

    if (finalTotal <= 0) { alert('Order total must be greater than 0.'); return; }

    if (paymentStatus === 'Partial') {
      const p = Number(amountPaid);
      if (!p || p <= 0)      { alert('Enter the amount paid for a partial payment.');   return; }
      if (p >= finalTotal)   { alert('For a full payment, please select "Fully Paid".'); return; }
    }

    const paid = calcPaid();
    const due  = calcDue();

    // Build the order — later: POST to /api/orders
    const newOrder = {
      id:            Date.now(),
      customerId:    customer.id,
      customerName:  customer.name,
      customerPhone: customer.phone,
      date:          new Date().toISOString().split('T')[0],
      items:         rows.map(r => ({
        productId:   Number(r.productId),
        productName: r.productName,
        unitPrice:   r.unitPrice,
        quantity:    Number(r.quantity),
        discount:    Number(r.discount) || 0,
        itemTotal:   r.itemTotal,
      })),
      subtotal,
      totalDiscount,
      finalTotal,
      paymentStatus,
      amountPaid: paid,
      amountDue:  due,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Reset form
    setCustomerId('');
    setRows([blankRow()]);
    setPaymentStatus('Paid');
    setAmountPaid('');

    alert(`✅ Order placed!\n${due > 0 ? `Remaining due: ${fmt(due)}` : 'Order is fully paid.'}`);
  };

  const selectedCustomer = customers.find(c => c.id === Number(customerId));

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Create multi-product orders with discounts and payment tracking</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ORDER CREATION FORM
      ══════════════════════════════════════════ */}
      <div className="order-form-card">
        <h3>Create New Order</h3>

        {/* Customer selector */}
        <div style={{ marginBottom: 24 }}>
          <div className="form-group">
            <label>Select Customer *</label>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)}
              style={{ maxWidth: 380 }}>
              <option value="">— Choose customer —</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Product Rows ──────────────────────── */}
        <div className="order-items-section">

          {/* Column header row */}
          <div className="order-items-header">
            <span>Product</span>
            <span>Unit Price</span>
            <span>Qty</span>
            <span>Discount (Rs.)</span>
            <span>Item Total</span>
            <span></span>
          </div>

          {rows.map(row => (
            <div key={row.rowId} className="order-item-row">

              {/* Product */}
              <select
                value={row.productId}
                onChange={e => updateRow(row.rowId, 'productId', e.target.value)}
                className="order-row-select"
              >
                <option value="">— Select product —</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.stock} left)
                  </option>
                ))}
              </select>

              {/* Unit Price (read-only auto-fill) */}
              <div className="order-price-display">
                {row.unitPrice > 0 ? fmt(row.unitPrice) : '—'}
              </div>

              {/* Quantity */}
              <input
                className="order-row-input"
                type="number" min="1"
                value={row.quantity}
                onChange={e => updateRow(row.rowId, 'quantity', e.target.value)}
              />

              {/* Discount */}
              <input
                className="order-row-input"
                type="number" min="0"
                value={row.discount || ''}
                placeholder="0"
                onChange={e => updateRow(row.rowId, 'discount', e.target.value)}
              />

              {/* Item Total */}
              <div className={`order-item-total ${row.itemTotal > 0 ? 'has-value' : ''}`}>
                {row.itemTotal > 0 ? fmt(row.itemTotal) : '—'}
              </div>

              {/* Remove button */}
              <button
                className="btn btn-danger btn-xs order-remove-btn"
                onClick={() => removeRow(row.rowId)}
                disabled={rows.length === 1}
                title="Remove row"
              >✕</button>
            </div>
          ))}

          <div className="order-add-row">
            <button className="btn btn-ghost btn-sm" onClick={addRow}>
              + Add Another Product
            </button>
          </div>
        </div>

        {/* ── Bill Summary ──────────────────────── */}
        <div className="bill-summary">
          <h4 className="bill-summary-title">Bill Summary</h4>
          <div className="bill-summary-rows">
            <div className="bill-row">
              <span>Subtotal ({rows.filter(r=>r.productId).length} item{rows.filter(r=>r.productId).length !== 1 ? 's' : ''})</span>
              <span>{fmt(subtotal)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="bill-row discount">
                <span>Total Discount</span>
                <span>− {fmt(totalDiscount)}</span>
              </div>
            )}
            <div className="bill-row total">
              <span>Final Payable Amount</span>
              <span>{fmt(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* ── Payment Status Section ────────────── */}
        <div className="payment-section">
          <h4 className="payment-section-title">Payment Method</h4>

          <div className="payment-toggle-group">
            {[
              { key: 'Paid',    label: '✓ Fully Paid' },
              { key: 'Partial', label: '◑ Partial Payment' },
              { key: 'Unpaid',  label: '✕ Unpaid / Due' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`payment-toggle-btn ${paymentStatus === key ? 'active-' + key.toLowerCase() : ''}`}
                onClick={() => { setPaymentStatus(key); setAmountPaid(''); }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Partial payment amount input */}
          {paymentStatus === 'Partial' && (
            <div className="partial-input-row">
              <div className="form-group">
                <label>Amount Being Paid Now (Rs.) *</label>
                <input
                  type="number" min="1" max={finalTotal - 1}
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  placeholder={`Between 1 and ${fmt(finalTotal - 1)}`}
                />
              </div>
              <div className="form-group">
                <label>Remaining Due After Payment</label>
                <div className="remaining-due-display">
                  {amountPaid && Number(amountPaid) > 0
                    ? fmt(Math.max(0, finalTotal - Number(amountPaid)))
                    : fmt(finalTotal)
                  }
                </div>
              </div>
            </div>
          )}

          {/* Summary chips */}
          <div className="payment-chips">
            <div className="payment-chip paid">
              <span>Paying Now</span>
              <strong>{fmt(calcPaid())}</strong>
            </div>
            <div className="payment-chip due">
              <span>Remaining Due</span>
              <strong>{fmt(calcDue())}</strong>
            </div>
          </div>
        </div>

        {/* Submit row */}
        <div className="order-submit-row">
          {selectedCustomer && (
            <span className="order-customer-display">
              Customer: <strong>{selectedCustomer.name}</strong>
            </span>
          )}
          <button className="btn btn-primary" onClick={placeOrder}>
            ✓ Place Order
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ORDER HISTORY
      ══════════════════════════════════════════ */}
      <div className="section-block" style={{ marginTop: 28 }}>
        <div className="section-block-header">
          <div>
            <h3>Order History <span className="row-count">{orders.length}</span></h3>
            <p>All placed orders with payment status</p>
          </div>
        </div>
        <Table
          columns={HISTORY_COLS}
          data={orders}
          emptyMsg="No orders yet. Create one above."
        />
      </div>
    </div>
  );
}
