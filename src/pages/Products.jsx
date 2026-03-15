// ============================================================
// Products.jsx — Product card grid with images
// ✅ Receives products + setProducts as props from App.jsx
// ============================================================

import { useState } from 'react';
import Modal from '../components/Modal';
import '../styles/products.css';

// Format price in PKR
const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`;

// Fallback placeholder when no image is provided or image fails to load
const PLACEHOLDER = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=500&fit=crop&q=60';

const CATEGORIES = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const ALL        = 'All';

const EMPTY_FORM = {
  name: '', category: '', size: '', color: '',
  price: '', stock: '', image: '',
};

// Returns badge class + label based on stock count
function getStockInfo(stock) {
  if (stock === 0) return { cls: 'badge-red',  label: 'Out of Stock' };
  if (stock < 5)  return { cls: 'badge-gold',  label: 'Low Stock'    };
  return              { cls: 'badge-green', label: 'In Stock'     };
}

// ── Single Product Card ──────────────────────────────────────
function ProductCard({ product, onDelete }) {
  const stock = getStockInfo(product.stock);

  return (
    <div className="product-card">
      {/* Image area */}
      <div className="product-card-image">
        <img
          src={product.image || PLACEHOLDER}
          alt={product.name}
          onError={e => { e.target.src = PLACEHOLDER; }}  /* fallback on broken URL */
          loading="lazy"
        />

        {/* Category chip overlaid on image */}
        <span className="product-card-category">{product.category}</span>

        {/* Stock status badge overlaid on image */}
        <div className="product-card-stock-badge">
          <span className={`badge ${stock.cls}`}>{stock.label}</span>
        </div>
      </div>

      {/* Card content */}
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>

        {/* Meta details */}
        <div className="product-card-meta">
          <div className="product-card-meta-row">
            <span className="product-card-meta-label">Size</span>
            <span className="product-card-meta-value">{product.size}</span>
          </div>
          <div className="product-card-meta-row">
            <span className="product-card-meta-label">Color</span>
            <span className="product-card-meta-value">
              <span className="color-dot" />
              {product.color}
            </span>
          </div>
        </div>

        <div className="product-card-divider" />

        {/* Price + stock count */}
        <div className="product-card-price-row">
          <span className="product-card-price">{fmt(product.price)}</span>
          <span className="product-card-stock-count">{product.stock} units</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="product-card-actions">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => alert(`Edit "${product.name}" — coming soon!`)}
        >
          ✏ Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(product.id)}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

// ── Main Products Page ───────────────────────────────────────
export default function Products({ products, setProducts }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);

  // Active category filter — "All" shows everything
  const [activeCategory, setActiveCategory] = useState(ALL);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  // Add product to shared App-level state
  // Later: replace body with await fetch('/api/products', { method:'POST', ... })
  const handleSubmit = () => {
    if (!form.name || !form.price || !form.stock) {
      alert('Please fill in Name, Price, and Stock.');
      return;
    }
    const newProduct = {
      id:       Date.now(),
      name:     form.name,
      category: form.category || 'Uncategorized',
      size:     form.size     || '—',
      color:    form.color    || '—',
      price:    Number(form.price),
      stock:    Number(form.stock),
      // If admin leaves image blank, fallback is handled in ProductCard
      image:    form.image.trim() || '',
    };
    setProducts(prev => [...prev, newProduct]);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Build unique category list for filter pills
  const categories = [ALL, ...new Set(products.map(p => p.category))];

  // Filter products by selected category
  const filtered = activeCategory === ALL
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="page-wrapper">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} items in your catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          + Add Product
        </button>
      </div>

      {/* ── Toolbar: category filter ── */}
      <div className="products-toolbar">
        <div className="products-filter-group">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== ALL && (
                <span style={{ marginLeft:4, opacity:0.6 }}>
                  ({products.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
          Showing {filtered.length} of {products.length}
        </span>
      </div>

      {/* ── Product Card Grid ── */}
      <div className="products-grid">
        {filtered.length === 0 ? (
          <div className="products-empty">
            <span>👗</span>
            <p>No products found. Click "Add Product" to get started.</p>
          </div>
        ) : (
          filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* ── Add Product Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Product"
        footer={
          <>
            <button className="btn btn-ghost"   onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Save Product</button>
          </>
        }
      >
        <div className="form-grid">
          {/* Name */}
          <div className="form-group full">
            <label>Product Name *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Silk Evening Gown"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Size */}
          <div className="form-group">
            <label>Size</label>
            <select name="size" value={form.size} onChange={handleChange}>
              <option value="">Select size</option>
              {SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Color */}
          <div className="form-group">
            <label>Color</label>
            <input
              name="color" value={form.color} onChange={handleChange}
              placeholder="e.g. Midnight Blue"
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (Rs.) *</label>
            <input
              name="price" type="number" min="0" value={form.price} onChange={handleChange}
              placeholder="e.g. 8500"
            />
          </div>

          {/* Stock */}
          <div className="form-group">
            <label>Stock (Units) *</label>
            <input
              name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
              placeholder="e.g. 12"
            />
          </div>

          {/* Image URL */}
          <div className="form-group full">
            <label>Product Image URL <span style={{fontWeight:400,color:'var(--text-muted)'}}>(optional)</span></label>
            <input
              name="image" value={form.image} onChange={handleChange}
              placeholder="https://example.com/image.jpg  — leave blank for placeholder"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
