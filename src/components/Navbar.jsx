// Navbar.jsx — Apex-style top bar with search + action button

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const PAGE_TITLES = {
  '/':          { title: 'Dashboard',      sub: 'Overview of your store performance',       icon: '📊' },
  '/products':  { title: 'Products',       sub: 'Manage your clothing inventory',           icon: '👕' },
  '/customers': { title: 'Customers',      sub: 'View and manage your clients',            icon: '👥' },
  '/orders':    { title: 'Orders',         sub: 'Create multi-product orders with payment', icon: '📦' },
  '/inventory': { title: 'Inventory',      sub: 'Monitor stock levels and alerts',         icon: '📈' },
  '/debits':    { title: 'Customer Dues',  sub: 'Track pending payments and debit records', icon: '💳' },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = PAGE_TITLES[pathname] || PAGE_TITLES['/'];
  const [theme, setTheme] = useState('light');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter pages based on search query
  const filteredPages = Object.entries(PAGE_TITLES).filter(([_, page]) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.sub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageSelect = (path) => {
    navigate(path);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="navbar">
      {/* Search bar with dropdown */}
      <div className="navbar-search-container" ref={searchRef}>
        <div className="navbar-search" onClick={() => setSearchOpen(true)}>
          <span className="navbar-search-icon">🔍</span>
          <input 
            placeholder="Search pages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
          />
          <span className="navbar-search-kbd">⌘K</span>
        </div>

        {/* Search Dropdown */}
        {searchOpen && (
          <div className="navbar-search-dropdown">
            {filteredPages.length === 0 ? (
              <div className="search-empty">
                <span className="search-empty-icon">🔍</span>
                <p>No pages found</p>
              </div>
            ) : (
              <div className="search-results">
                {filteredPages.map(([path, pageInfo]) => (
                  <button
                    key={path}
                    className={`search-result-item ${pathname === path ? 'active' : ''}`}
                    onClick={() => handlePageSelect(path)}
                  >
                    <span className="search-result-icon">{pageInfo.icon}</span>
                    <div className="search-result-content">
                      <div className="search-result-title">{pageInfo.title}</div>
                      <div className="search-result-sub">{pageInfo.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="navbar-right">
        <button className="navbar-btn">
          + New Order
        </button>

        <div className="navbar-icon-btn" title="Toggle theme" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '🔆'}
        </div>
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
