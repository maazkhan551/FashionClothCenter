// ============================================================
// Card.jsx — Reusable stat card for Dashboard
// Props: label, value, sub, icon (emoji), alert (bool)
// ============================================================

export default function Card({ label, value, sub, icon, alert = false }) {
  return (
    <div className={`stat-card ${alert ? 'alert' : ''}`}>
      {/* Icon */}
      <div className="stat-icon">{icon}</div>

      {/* Label (small uppercase text) */}
      <div className="stat-label">{label}</div>

      {/* Big number value */}
      <div className="stat-value">{value}</div>

      {/* Optional sub-text below the number */}
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
