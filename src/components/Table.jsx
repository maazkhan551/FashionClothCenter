// ============================================================
// Table.jsx — Reusable table component
// Props:
//   columns  — array of { key, label, render? }
//   data     — array of row objects
//   emptyMsg — string shown when no rows
// ============================================================

import '../styles/table.css';

export default function Table({ columns, data, emptyMsg = 'No records found.' }) {
  return (
    <div className="table-wrapper">
      <table>
        {/* Table Head */}
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length === 0 ? (
            // Empty state row
            <tr>
              <td colSpan={columns.length}>
                <div className="table-empty">
                  <span className="empty-icon">📋</span>
                  <p>{emptyMsg}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex}>
                {columns.map(col => (
                  <td key={col.key}>
                    {/* If a custom render function is given, use it; otherwise show raw value */}
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
