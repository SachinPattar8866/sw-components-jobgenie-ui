import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard/uploads', label: 'Resume Uploads' },
  { to: '/dashboard/score', label: 'Resume Score' },
  { to: '/dashboard/rewrite', label: 'AI Rewrite' },
  { to: '/dashboard/match', label: 'Job Match' },
  { to: '/dashboard/roadmap', label: 'Career Roadmap' },
  { to: '/dashboard/settings', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside style={{ width: 220, background: '#0f172a', color: '#fff', padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 16 }}>JobGenie</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} style={({ isActive }) => ({
            padding: '8px 12px',
            borderRadius: 6,
            color: isActive ? '#0f172a' : '#cbd5e1',
            background: isActive ? '#60a5fa' : 'transparent',
            textDecoration: 'none'
          })}>
            {it.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
