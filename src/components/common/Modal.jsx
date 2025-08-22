import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '80%', maxWidth: 800, background: '#fff', borderRadius: 8, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{title}</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}
