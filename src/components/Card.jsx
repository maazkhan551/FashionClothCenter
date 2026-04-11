// Card.jsx — Updated stat card (used on non-dashboard pages if needed)
export default function Card({ label, value, sub, icon, alert = false }) {
  return (
    <div className={`stat-card ${alert ? 'alert' : ''}`}>
      <div className="stat-card-top">
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          {sub && <div className="stat-change">{sub}</div>}
        </div>
        <div className="stat-icon-box">{icon}</div>
      </div>
    </div>
  );
}
