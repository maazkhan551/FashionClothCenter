// ============================================================
// Sidebar.jsx — Left navigation sidebar
// Updated: added Debits page link
// ============================================================

import { NavLink } from 'react-router-dom';

const Icon = ({ path, path2 }) => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
    {path2 && <path d={path2} />}
  </svg>
);

const ICONS = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  products:  "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  customers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  orders:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M13 3H9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1z M9 12h6 M9 16h4",
  inventory: "M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18",
  debits:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
};

// Single-path icons need the SVG path as a string.
// For the debits icon we'll use a wallet/credit concept.
const ICONS_SVG = {
  debits: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
};

const NAV_LINKS = [
  { to: '/',          label: 'Dashboard',    icon: ICONS.dashboard  },
  { to: '/products',  label: 'Products',     icon: ICONS.products   },
  { to: '/customers', label: 'Customers',    icon: ICONS.customers  },
  { to: '/orders',    label: 'Orders',       icon: ICONS.orders     },
  { to: '/inventory', label: 'Inventory',    icon: ICONS.inventory  },
  { to: '/debits',    label: 'Customer Dues',icon: ICONS_SVG.debits },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Fashion Cloth Center</h1>
        <span>Admin Dashboard</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Main Menu</span>
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon path={link.icon} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>v2.0.0 — Semester Project</p>
      </div>
    </aside>
  );
}
