// ============================================================
// Sidebar.jsx — Left navigation sidebar
// Uses NavLink from React Router to highlight active links.
// ============================================================

import { NavLink } from 'react-router-dom';

// Simple SVG icon components (inline — no icon library needed)
const Icon = ({ path }) => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const ICONS = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  products:  "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  customers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  orders:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M13 3H9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1z M9 12h6 M9 16h4",
  inventory: "M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18",
};

// Navigation links definition — easy to extend later
const NAV_LINKS = [
  { to: '/',          label: 'Dashboard', icon: ICONS.dashboard  },
  { to: '/products',  label: 'Products',  icon: ICONS.products   },
  { to: '/customers', label: 'Customers', icon: ICONS.customers  },
  { to: '/orders',    label: 'Orders',    icon: ICONS.orders     },
  { to: '/inventory', label: 'Inventory', icon: ICONS.inventory  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand Logo */}
      <div className="sidebar-logo">
        <h1>Fashion Cloth Center</h1>
        <span>Admin Dashboard</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Main Menu</span>

        {NAV_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            // NavLink "end" on "/" prevents it matching all routes
            end={link.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon path={link.icon} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <p>v1.0.0 — Semester Project</p>
      </div>
    </aside>
  );
}
