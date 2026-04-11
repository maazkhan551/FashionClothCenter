// Navbar.jsx — Apex-style top bar with search + action button

import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/':          { title: 'Dashboard',      sub: 'Overview of your store performance'        },
  '/products':  { title: 'Products',       sub: 'Manage your clothing inventory'            },
  '/customers': { title: 'Customers',      sub: 'View and manage your clients'             },
  '/orders':    { title: 'Orders',         sub: 'Create multi-product orders with payment' },
  '/inventory': { title: 'Inventory',      sub: 'Monitor stock levels and alerts'          },
  '/debits':    { title: 'Customer Dues',  sub: 'Track pending payments and debit records' },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || PAGE_TITLES['/'];

  return (
    <header className="navbar">
      {/* Search bar */}
      <div className="navbar-search">
        <span className="navbar-search-icon">🔍</span>
        <input placeholder="Search anything..." readOnly />
        <span className="navbar-search-kbd">⌘K</span>
      </div>

      {/* Right side actions */}
      <div className="navbar-right">
        <button className="navbar-btn">
          + New Order
        </button>

        <div className="navbar-icon-btn" title="Toggle theme" onClick={()=>{
          
        }}>🌙</div>
        <div className="navbar-icon-btn" title="Settings">🎨</div>

        <div className="navbar-icon-btn" title="Notifications">
          🔔
          <span className="navbar-notif-dot"></span>
        </div>

        <div className="navbar-avatar" title="Admin">AS</div>
      </div>
    </header>
  );
}
