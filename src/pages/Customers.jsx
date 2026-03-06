// ============================================================
// Customers.jsx — Manage customer records
// Features: List all customers, Add customer via modal.
// In future: connect to GET/POST /api/customers
// ============================================================

import { useState } from 'react';
import Table  from '../components/Table';
import Modal  from '../components/Modal';
import { customers as initialCustomers } from '../data/dummyData';

const EMPTY_FORM = { name: '', phone: '', address: '' };

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  // Add new customer to local state
  // Later: replace with API call
  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert('Name and phone are required.');
      return;
    }
    const newCustomer = {
      id:      customers.length + 1,
      name:    form.name,
      phone:   form.phone,
      address: form.address || '—',
    };
    setCustomers(prev => [...prev, newCustomer]);
    setModalOpen(false);
  };

  // Table column definitions
  const COLUMNS = [
    { key: 'id',      label: '#',       render: (v) => <span className="td-muted">{v}</span> },
    { key: 'name',    label: 'Name',    render: (v) => (
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Initials avatar */}
          <div style={{
            width:32, height:32, borderRadius:'50%',
            background:'var(--gold-dim)', border:'1px solid var(--gold)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'0.72rem', fontWeight:600, color:'#8a6c14', flexShrink:0,
          }}>
            {v.split(' ').map(w => w[0]).join('').slice(0,2)}
          </div>
          <span className="td-primary">{v}</span>
        </div>
      )},
    { key: 'phone',   label: 'Phone',   render: (v) => <span className="td-muted">{v}</span> },
    { key: 'address', label: 'Address' },
    { key: 'id',      label: 'Actions', render: (_, row) => (
        <div className="td-actions">
          <button className="btn btn-ghost btn-sm"
            onClick={() => alert(`View orders for "${row.name}" — coming soon!`)}>
            Orders
          </button>
          <button className="btn btn-danger btn-sm"
            onClick={() => setCustomers(prev => prev.filter(c => c.id !== row.id))}>
            Remove
          </button>
        </div>
      )},
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>{customers.length} registered clients</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          + Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <div className="section-block">
        <div className="section-block-header">
          <div>
            <h3>
              All Customers
              <span className="row-count">{customers.length}</span>
            </h3>
          </div>
        </div>
        <Table columns={COLUMNS} data={customers} emptyMsg="No customers yet." />
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Customer"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Save Customer</button>
          </>
        }
      >
        <div className="form-grid single">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              name="name" value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ayesha Tariq"
            />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              name="phone" value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 0321-4567890"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              name="address" value={form.address}
              onChange={handleChange}
              placeholder="e.g. House 12, F-7/2, Islamabad"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
