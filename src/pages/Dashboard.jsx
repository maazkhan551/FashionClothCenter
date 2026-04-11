// ============================================================
// Dashboard.jsx — Apex-style with Recharts charts
// Library added: recharts (run npm install after extracting)
// All functionality unchanged — same props from App.jsx.
// ============================================================

import {
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const fmt      = (n) => `Rs. ${Number(n).toLocaleString()}`;
const fmtShort = (n) => {
  if (n >= 100000) return `Rs.${(n/100000).toFixed(1)}L`;
  if (n >= 1000)   return `Rs.${(n/1000).toFixed(0)}k`;
  return `Rs.${n}`;
};

// ── Coloured initials avatar ──────────────────────────────────
function Avatar({ name, size = 32 }) {
  const initials = (name || 'A').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const PALETTE  = ['#16a34a','#2563eb','#7c3aed','#db2777','#ea580c','#0891b2','#0d9488'];
  const bg       = PALETTE[(name || '').charCodeAt(0) % PALETTE.length];
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background:bg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:size*0.3, fontWeight:700, color:'#fff', flexShrink:0,
    }}>{initials}</div>
  );
}

// ── Payment badge ─────────────────────────────────────────────
const PayBadge = ({ status }) => {
  const map = { Paid:'badge-green', Partial:'badge-gold', Unpaid:'badge-red' };
  return <span className={`badge ${map[status] || 'badge-grey'}`}>{status}</span>;
};

// ── Mini sparkline for stat cards ────────────────────────────
function Sparkline({ data, color }) {
  const id = `sp${color.replace(/[^a-z0-9]/gi,'')}`;
  return (
    <ResponsiveContainer width="100%" height={56}>
      <AreaChart data={data} margin={{ top:0, right:0, left:0, bottom:0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.2}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
          fill={`url(#${id})`} dot={false} isAnimationActive={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Monthly revenue area chart ────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function RevenueChart({ orders }) {
  const data = MONTHS.map((m, i) => ({
    month: m,
    revenue: orders
      .filter(o => new Date(o.date).getMonth() === i)
      .reduce((s, o) => s + (o.finalTotal ?? 0), 0),
  }));
  return (
    <ResponsiveContainer width="100%" height={210}>
      <AreaChart data={data} margin={{ top:10, right:10, left:0, bottom:0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
        <YAxis tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
          tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false} width={38}/>
        <Tooltip formatter={v => [fmt(v),'Revenue']}
          contentStyle={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, fontSize:12 }}
          cursor={{ stroke:'#e5e7eb' }}/>
        <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2}
          fill="url(#revGrad)" dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Fixed sparkline trend data ────────────────────────────────
const T_UP   = [3,4,3,5,4,6,7].map(v=>({v}));
const T_FLAT = [5,4,5,4,6,5,6].map(v=>({v}));
const T_DOWN = [7,6,5,6,4,5,3].map(v=>({v}));
const T_WARN = [2,4,3,5,3,4,5].map(v=>({v}));

// ── Recent activity (static) ──────────────────────────────────
const ACTIVITY = [
  { icon:'🛍️', title:'New order placed',       desc:'Ayesha Tariq purchased Silk Evening Gown',  time:'2 min ago'  },
  { icon:'👤', title:'New customer registered', desc:'Maryam Noor created an account',            time:'15 min ago' },
  { icon:'💳', title:'Payment received',        desc:'Rs. 22,000 received from Sana Iqbal',        time:'1 hr ago'   },
  { icon:'📦', title:'Low stock alert',         desc:'Pleated Midi Skirt — only 2 units left',    time:'2 hrs ago'  },
  { icon:'✅', title:'Order delivered',         desc:'Order #7 successfully delivered to Hira Baig', time:'3 hrs ago'},
  { icon:'🛍️', title:'New order placed',       desc:'Sara Chaudhry purchased Satin Cargo Pants', time:'5 hrs ago'  },
];

// ═════════════════════════════════════════════════════════════
export default function Dashboard({ products, customers, orders }) {

  const totalProducts  = products.length;
  const totalCustomers = customers.length;
  const totalOrders    = orders.length;
  const lowStock       = products.filter(p => p.stock < 5).length;
  const totalRevenue   = orders.reduce((s,o) => s + (o.finalTotal ?? 0), 0);
  const totalDue       = orders.reduce((s,o) => s + (o.amountDue   ?? 0), 0);
  const recentOrders   = [...orders].slice(0, 6);

  return (
    <div className="page-wrapper">

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin. Here's what's happening with your business today.</p>
        </div>
      </div>

      {/* ══════════════════════════════════
          STAT CARDS  (4 across)
      ══════════════════════════════════ */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">{fmtShort(totalRevenue)}</div>
              <div className="stat-change up">↑ +12.5% vs last month</div>
            </div>
            <div className="stat-icon-box">💰</div>
          </div>
          <div className="stat-sparkline"><Sparkline data={T_UP} color="#16a34a"/></div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-label">Total Customers</div>
              <div className="stat-value">{totalCustomers}</div>
              <div className="stat-change up">↑ +8.2% vs last month</div>
            </div>
            <div className="stat-icon-box">👥</div>
          </div>
          <div className="stat-sparkline"><Sparkline data={T_FLAT} color="#2563eb"/></div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-label">Total Orders</div>
              <div className="stat-value">{totalOrders}</div>
              <div className="stat-change down">↓ -3.1% vs last month</div>
            </div>
            <div className="stat-icon-box">🧾</div>
          </div>
          <div className="stat-sparkline"><Sparkline data={T_DOWN} color="#dc2626"/></div>
        </div>

        <div className={`stat-card ${totalDue > 0 ? 'alert' : ''}`}>
          <div className="stat-card-top">
            <div>
              <div className="stat-label">Pending Dues</div>
              <div className="stat-value">{fmtShort(totalDue)}</div>
              <div className={`stat-change ${totalDue > 0 ? 'warn' : 'up'}`}>
                {totalDue > 0 ? '⚠ Customers have balance' : '✓ All payments cleared'}
              </div>
            </div>
            <div className="stat-icon-box">💳</div>
          </div>
          <div className="stat-sparkline">
            <Sparkline data={T_WARN} color={totalDue > 0 ? '#ea580c' : '#16a34a'}/>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════
          REVENUE CHART + TOP PRODUCTS
      ══════════════════════════════════ */}
      <div className="dashboard-grid" style={{ marginBottom: 18 }}>

        <div className="section-block">
          <div className="section-block-header">
            <div>
              <h3>Revenue Overview</h3>
              <p>Monthly performance for the current year</p>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {['Revenue','Orders','Profit'].map((t,i) => (
                <span key={t} style={{
                  padding:'4px 10px', borderRadius:6, cursor:'pointer',
                  fontSize:'0.74rem', fontWeight:500,
                  background: i===0 ? 'rgba(22,163,74,0.1)' : 'transparent',
                  color:       i===0 ? '#16a34a' : '#6b7280',
                  border:'1px solid', borderColor: i===0 ? 'rgba(22,163,74,0.22)' : '#e5e7eb',
                }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ padding:'16px 16px 8px' }}>
            <RevenueChart orders={orders}/>
          </div>
        </div>

        <div className="section-block">
          <div className="section-block-header">
            <div><h3>Top Products</h3><p>By price — premium items</p></div>
          </div>
          {[...products].sort((a,b) => b.price-a.price).slice(0,6).map(p => (
            <div key={p.id} className="top-product-item">
              <div>
                <div className="tpi-name">{p.name}</div>
                <div className="tpi-cat">{p.category} · Size {p.size}</div>
              </div>
              <div className="tpi-price">{fmt(p.price)}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ══════════════════════════════════
          RECENT ORDERS + ACTIVITY FEED
      ══════════════════════════════════ */}
      <div className="dashboard-grid">

        {/* Recent orders with initials avatars */}
        <div className="section-block">
          <div className="section-block-header">
            <div><h3>Recent Orders</h3><p>Latest transactions from your store</p></div>
            <span style={{ fontSize:'0.78rem', color:'#16a34a', fontWeight:500, cursor:'pointer' }}>View all ↗</span>
          </div>

          {/* Table header */}
          <div style={{
            display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr',
            padding:'9px 22px', borderBottom:'1px solid #f3f4f6',
            fontSize:'0.68rem', fontWeight:700, color:'#9ca3af',
            textTransform:'uppercase', letterSpacing:'0.08em', background:'#f9fafb',
          }}>
            <span>Customer</span><span>Bill</span><span>Due</span><span>Payment</span>
          </div>

          {recentOrders.map(order => (
            <div key={order.id}
              style={{
                display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr',
                padding:'12px 22px', borderBottom:'1px solid #f9fafb',
                alignItems:'center', cursor:'default',
                transition:'background 0.12s',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
              onMouseLeave={e=>e.currentTarget.style.background=''}
            >
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Avatar name={order.customerName}/>
                <div>
                  <div style={{ fontSize:'0.84rem', fontWeight:500, color:'#111827' }}>{order.customerName}</div>
                  <div style={{ fontSize:'0.71rem', color:'#9ca3af' }}>{order.date}</div>
                </div>
              </div>
              <div style={{ fontSize:'0.85rem', fontWeight:600, color:'#111827' }}>{fmt(order.finalTotal??0)}</div>
              <div style={{ fontSize:'0.84rem', fontWeight:600, color: order.amountDue>0?'#dc2626':'#16a34a' }}>
                {order.amountDue>0 ? fmt(order.amountDue) : '—'}
              </div>
              <PayBadge status={order.paymentStatus}/>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <div className="section-block">
          <div className="section-block-header">
            <div><h3>Recent Activity</h3><p>Latest events from your store</p></div>
            <span style={{ fontSize:'0.78rem', color:'#16a34a', fontWeight:500, cursor:'pointer' }}>View all ↗</span>
          </div>
          {ACTIVITY.map((item, i) => (
            <div key={i} style={{
              display:'flex', gap:12, padding:'12px 22px',
              borderBottom: i < ACTIVITY.length-1 ? '1px solid #f9fafb' : 'none',
              alignItems:'flex-start',
              transition:'background 0.12s', cursor:'default',
            }}
            onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
            onMouseLeave={e=>e.currentTarget.style.background=''}
            >
              <div style={{
                width:34, height:34, borderRadius:8,
                background:'#f3f4f6', display:'flex',
                alignItems:'center', justifyContent:'center',
                fontSize:'0.9rem', flexShrink:0,
              }}>{item.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'0.83rem', fontWeight:500, color:'#111827' }}>{item.title}</div>
                <div style={{ fontSize:'0.73rem', color:'#6b7280', marginTop:1 }}>{item.desc}</div>
              </div>
              <div style={{ fontSize:'0.69rem', color:'#9ca3af', whiteSpace:'nowrap', flexShrink:0, marginTop:2 }}>{item.time}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
