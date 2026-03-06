// ============================================================
// Navbar.jsx — Top navigation bar
// Shows page title and admin info. Title changes per route.
// ============================================================

import { useLocation } from 'react-router-dom';

// Map route paths to human-readable page titles
const PAGE_TITLES = {
  '/':          { title: 'Dashboard',  sub: 'Overview of your store performance' },
  '/products':  { title: 'Products',   sub: 'Manage your clothing inventory'      },
  '/customers': { title: 'Customers',  sub: 'View and manage your clients'        },
  '/orders':    { title: 'Orders',     sub: 'Create and track customer orders'    },
  '/inventory': { title: 'Inventory',  sub: 'Monitor stock levels and alerts'     },
};

export default function Navbar() {
  const { pathname } = useLocation();

  // Get title for current route (fallback to Dashboard)
  const page = PAGE_TITLES[pathname] || PAGE_TITLES['/'];

  // Format today's date nicely
  const today = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="navbar">
      {/* Left: Page Title */}
      <div className="navbar-left">
        <h2>{page.title}</h2>
        <p>{page.sub}</p>
      </div>

      {/* Right: Date + Admin Badge */}
      <div className="navbar-right">
        <span className="navbar-date">{today}</span>
        <div className="admin-badge">
          <div className="admin-avatar">A</div>
          <span className="admin-name">Admin</span>
        </div>
      </div>
    </header>
  );
}
