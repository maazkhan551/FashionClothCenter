// ============================================================
// Orders.jsx — Create and view orders
// Features:
//   - Select customer & product from dropdowns
//   - Enter quantity → auto-calculate price
//   - Add to cart (local React state)
//   - View cart with running total
//   - Place order → saves to orders list
// In future: POST /api/orders with cart data
// ============================================================

import { useState } from 'react';
import Table  from '../components/Table';
import {
  products  as productData,
  customers as customerData,
  orders    as initialOrders,
} from '../data/dummyData';

const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`;

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

// Columns for the orders history table
const HISTORY_COLS = [
  { key: 'id',           label: '#',       render: (v) => <span className="td-muted">#{v}</span> },
  { key: 'customerName', label: 'Customer', render: (v) => <span className="td-primary">{v}</span> },
  { key: 'productName',  label: 'Product'  },
  { key: 'quantity',     label: 'Qty',     render: (v) => <span className="td-muted">×{v}</span> },
  { key: 'total',        label: 'Total',   render: (v) => <span className="td-price">{fmt(v)}</span> },
  { key: 'date',         label: 'Date',    render: (v) => <span className="td-muted">{v}</span> },
  { key: 'status',       label: 'Status',  render: (v) => <StatusBadge status={v} /> },
];

export default function Orders() {
  const [customers] = useState(customerData);
  const [products]  = useState(productData);

  // Existing orders history
  const [orders, setOrders] = useState(initialOrders);

  // Current order form selections
  const [selectedCustomerId, setCustomerId] = useState('');
  const [selectedProductId,  setProductId]  = useState('');
  const [quantity,           setQuantity]   = useState(1);

  // Cart: array of { productId, productName, quantity, unitPrice, subtotal }
  const [cart, setCart] = useState([]);

  // Find selected objects
  const selectedCustomer = customers.find(c => c.id === Number(selectedCustomerId));
  const selectedProduct  = products.find(p => p.id === Number(selectedProductId));

  // Preview price for current selection
  const previewTotal = selectedProduct ? selectedProduct.price * quantity : 0;

  // Cart grand total
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Add item to cart
  const addToCart = () => {
    if (!selectedCustomer || !selectedProduct) {
      alert('Please select a customer and a product.');
      return;
    }
    if (quantity < 1) {
      alert('Quantity must be at least 1.');
      return;
    }
    if (quantity > selectedProduct.stock) {
      alert(`Only ${selectedProduct.stock} units available in stock.`);
      return;
    }

    const newItem = {
      cartId:      Date.now(), // unique key for React list
      productId:   selectedProduct.id,
      productName: selectedProduct.name,
      unitPrice:   selectedProduct.price,
      quantity:    Number(quantity),
      subtotal:    selectedProduct.price * Number(quantity),
    };

    setCart(prev => [...prev, newItem]);

    // Reset product/qty selection (keep customer)
    setProductId('');
    setQuantity(1);
  };

  // Remove item from cart
  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Place order — saves all cart items as orders in state
  // Later: POST each item (or the whole cart) to /api/orders
  const placeOrder = () => {
    if (!selectedCustomer) { alert('Please select a customer.'); return; }
    if (cart.length === 0)  { alert('Cart is empty.'); return; }

    const today = new Date().toISOString().split('T')[0];
    let nextId  = orders.length + 1;

    const newOrders = cart.map(item => ({
      id:           nextId++,
      customerId:   selectedCustomer.id,
      customerName: selectedCustomer.name,
      productId:    item.productId,
      productName:  item.productName,
      quantity:     item.quantity,
      unitPrice:    item.unitPrice,
      total:        item.subtotal,
      date:         today,
      status:       'Pending',
    }));

    setOrders(prev => [...newOrders, ...prev]);
    setCart([]);
    setCustomerId('');
    setProductId('');
    setQuantity(1);
    alert('✅ Order placed successfully!');
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Create new orders and view order history</p>
        </div>
      </div>

      {/* ── Order Creation Form ── */}
      <div className="order-form-card">
        <h3>Create New Order</h3>

        <div className="form-grid">
          {/* Customer Select */}
          <div className="form-group">
            <label>Select Customer *</label>
            <select
              value={selectedCustomerId}
              onChange={e => setCustomerId(e.target.value)}
            >
              <option value="">— Choose customer —</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Product Select */}
          <div className="form-group">
            <label>Select Product *</label>
            <select
              value={selectedProductId}
              onChange={e => setProductId(e.target.value)}
            >
              <option value="">— Choose product —</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {fmt(p.price)} ({p.stock} left)
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number" min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
          </div>

          {/* Preview total */}
          <div className="form-group" style={{ justifyContent:'flex-end' }}>
            <label>Line Total</label>
            <div style={{
              padding:'10px 14px', border:'1px solid var(--border)',
              borderRadius:8, fontFamily:'var(--font-display)',
              fontSize:'1rem', fontWeight:600, color:'var(--gold)',
              background:'var(--surface)',
            }}>
              {previewTotal > 0 ? fmt(previewTotal) : '—'}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div style={{ marginTop:18 }}>
          <button className="btn btn-primary" onClick={addToCart}>
            + Add to Cart
          </button>
        </div>
      </div>

      {/* ── Cart ── */}
      {cart.length > 0 && (
        <div className="cart-wrapper">
          <div className="section-block-header" style={{ padding:'16px 22px' }}>
            <div>
              <h3>Cart — {selectedCustomer?.name || '...'}</h3>
              <p>{cart.length} item(s)</p>
            </div>
            <button className="btn btn-primary" onClick={placeOrder}>
              ✓ Place Order
            </button>
          </div>

          {/* Cart Items */}
          {cart.map(item => (
            <div key={item.cartId} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.productName}</div>
                <div className="cart-item-meta">
                  {fmt(item.unitPrice)} × {item.quantity} units
                </div>
              </div>
              <div className="cart-item-price">{fmt(item.subtotal)}</div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item.cartId)}
              >
                ✕
              </button>
            </div>
          ))}

          {/* Grand Total */}
          <div className="cart-total-bar">
            <span className="cart-total-label">Grand Total</span>
            <span className="cart-total-amount">{fmt(cartTotal)}</span>
          </div>
        </div>
      )}

      {/* ── Orders History ── */}
      <div className="section-block" style={{ marginTop:28 }}>
        <div className="section-block-header">
          <div>
            <h3>
              Order History
              <span className="row-count">{orders.length}</span>
            </h3>
          </div>
        </div>
        <Table
          columns={HISTORY_COLS}
          data={orders}
          emptyMsg="No orders yet."
        />
      </div>
    </div>
  );
}
