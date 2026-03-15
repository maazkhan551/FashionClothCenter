// ============================================================
// Navbar.jsx — Top navigation bar
// Updated: added Debits page title
// ============================================================

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

  const today = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>{page.title}</h2>
        <p>{page.sub}</p>
      </div>
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
