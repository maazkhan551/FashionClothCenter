// ============================================================
// Products.jsx — Manage fashion products
// Features: View all products, Add product via modal form.
// In future: connect form submit to POST /api/products
// ============================================================

import { useState } from 'react';
import Table  from '../components/Table';
import Modal  from '../components/Modal';
import { products as initialProducts } from '../data/dummyData';

const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`;

// Blank form template (reused for reset)
const EMPTY_FORM = {
  name: '', category: '', size: '', color: '', price: '', stock: '',
};

const CATEGORIES = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function Products() {
  // Product list stored in local state
  // Later: fetch from GET /api/products in useEffect
  const [products, setProducts] = useState(initialProducts);

  // Modal open/close state
  const [isModalOpen, setModalOpen] = useState(false);

  // Form data state
  const [form, setForm] = useState(EMPTY_FORM);

  // Handle input changes — works for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Open modal & reset form
  const openModal = () => {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  // Submit: add new product to local state
  // Later: replace with await fetch('/api/products', { method: 'POST', body: ... })
  const handleSubmit = () => {
    if (!form.name || !form.price || !form.stock) {
      alert('Please fill in Name, Price, and Stock.');
      return;
    }
    const newProduct = {
      id:       products.length + 1,
      name:     form.name,
      category: form.category || 'Uncategorized',
      size:     form.size     || '—',
      color:    form.color    || '—',
      price:    Number(form.price),
      stock:    Number(form.stock),
    };
    setProducts(prev => [...prev, newProduct]);
    setModalOpen(false);
  };

  // Table column definitions
  const COLUMNS = [
    { key: 'name',     label: 'Product',  render: (v) => <span className="td-primary">{v}</span> },
    { key: 'category', label: 'Category' },
    { key: 'size',     label: 'Size' },
    { key: 'color',    label: 'Color',    render: (v) => (
        <span style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:10, height:10, borderRadius:'50%', background:'#ccc', display:'inline-block' }}/>
          {v}
        </span>
      )},
    { key: 'price',    label: 'Price',    render: (v) => <span className="td-price">{fmt(v)}</span> },
    { key: 'stock',    label: 'Stock',    render: (v) => (
        <span className={`badge ${v < 5 ? 'badge-red' : v < 10 ? 'badge-gold' : 'badge-green'}`}>
          {v} units
        </span>
      )},
    { key: 'id',       label: 'Actions',  render: (_, row) => (
        <div className="td-actions">
          <button className="btn btn-ghost btn-sm"
            onClick={() => alert(`Edit "${row.name}" — feature coming soon!`)}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm"
            onClick={() => setProducts(prev => prev.filter(p => p.id !== row.id))}>
            Delete
          </button>
        </div>
      )},
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} items in your catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="section-block">
        <div className="section-block-header">
          <div>
            <h3>
              All Products
              <span className="row-count">{products.length}</span>
            </h3>
          </div>
        </div>
        <Table columns={COLUMNS} data={products} emptyMsg="No products added yet. Click 'Add Product' to start." />
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Product"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Save Product</button>
          </>
        }
      >
        <div className="form-grid">
          {/* Product Name */}
          <div className="form-group full">
            <label>Product Name *</label>
            <input
              name="name" value={form.name}
              onChange={handleChange}
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
              name="color" value={form.color}
              onChange={handleChange}
              placeholder="e.g. Midnight Blue"
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (Rs.) *</label>
            <input
              name="price" type="number" min="0" value={form.price}
              onChange={handleChange}
              placeholder="e.g. 8500"
            />
          </div>

          {/* Stock */}
          <div className="form-group">
            <label>Stock (Units) *</label>
            <input
              name="stock" type="number" min="0" value={form.stock}
              onChange={handleChange}
              placeholder="e.g. 12"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
