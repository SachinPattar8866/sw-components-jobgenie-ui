import React from 'react';

export default function Navbar() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #e6eef8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontWeight: 800, color: '#111827' }}>JobGenie</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>🔔</button>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: '#60a5fa' }} />
      </div>
    </header>
  );
}
