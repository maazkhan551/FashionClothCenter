// ============================================================
// App.jsx — Root component
// All shared state lives here and is passed as props.
// Updated: added Debits page route
// ============================================================

import { useState }                     from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar   from './components/Sidebar';
import Navbar    from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products  from './pages/Products';
import Customers from './pages/Customers';
import Orders    from './pages/Orders';
import Inventory from './pages/Inventory';
import Debits    from './pages/Debits';

import {
  products  as initialProducts,
  customers as initialCustomers,
  orders    as initialOrders,
} from './data/dummyData';

import './styles/layout.css';
import './styles/table.css';
import './styles/form.css';

export default function App() {
  // ── Single source of truth for all shared data ────────────
  const [products,  setProducts]  = useState(initialProducts);
  const [customers, setCustomers] = useState(initialCustomers);
  const [orders,    setOrders]    = useState(initialOrders);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <Routes>
            <Route path="/" element={
              <Dashboard products={products} customers={customers} orders={orders} />
            }/>
            <Route path="/products" element={
              <Products products={products} setProducts={setProducts} />
            }/>
            <Route path="/customers" element={
              <Customers customers={customers} setCustomers={setCustomers} />
            }/>
            <Route path="/orders" element={
              <Orders
                products={products}
                customers={customers}
                orders={orders}
                setOrders={setOrders}
              />
            }/>
            <Route path="/inventory" element={
              <Inventory products={products} setProducts={setProducts} />
            }/>
            {/* NEW: Debits page — receives orders + customers (read-only, derives data) */}
            <Route path="/debits" element={
              <Debits orders={orders} customers={customers} />
            }/>

            <Route path="*" element={
              <div className="page-wrapper" style={{ textAlign:'center', paddingTop:80 }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'3rem' }}>404</h2>
                <p style={{ color:'var(--text-muted)', marginTop:8 }}>Page not found.</p>
              </div>
            }/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
