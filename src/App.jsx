// ============================================================
// App.jsx — Root component
// Sets up React Router with the admin layout shell.
// All pages share the same Sidebar + Navbar layout.
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout components
import Sidebar from './components/Sidebar';
import Navbar  from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import Products  from './pages/Products';
import Customers from './pages/Customers';
import Orders    from './pages/Orders';
import Inventory from './pages/Inventory';

// Global styles
import './styles/layout.css';
import './styles/table.css';
import './styles/form.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        {/* ── Left Sidebar (fixed, always visible) ── */}
        <Sidebar />

        {/* ── Right Side: Navbar + Page Content ── */}
        <div className="main-content">

          {/* Top Navbar (fixed, changes title per route) */}
          <Navbar />

          {/* Page Router — each route renders a different page */}
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/products"  element={<Products  />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders"    element={<Orders    />} />
            <Route path="/inventory" element={<Inventory />} />

            {/* 404 fallback */}
            <Route path="*" element={
              <div className="page-wrapper" style={{ textAlign:'center', paddingTop:80 }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'3rem' }}>404</h2>
                <p style={{ color:'var(--text-muted)', marginTop:8 }}>Page not found.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
