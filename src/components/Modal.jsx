// ============================================================
// Modal.jsx — Reusable modal dialog
// Props:
//   isOpen   — boolean, controls visibility
//   onClose  — function called when modal closes
//   title    — modal heading string
//   children — modal body content (form, etc.)
//   footer   — optional JSX for footer buttons
// ============================================================

import { useEffect } from 'react';
import '../styles/form.css';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    // Clicking the dark overlay closes the modal
    <div className="modal-overlay" onClick={onClose}>

      {/* Clicking inside the box does NOT close it */}
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} title="Close">✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer (optional — pass buttons as JSX) */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
