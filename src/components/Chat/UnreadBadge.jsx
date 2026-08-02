import React from 'react';

export function UnreadBadge({ count }) {
  if (!count || count <= 0) return null;

  return (
    <span
      className="badge shadow-sm"
      style={{
        backgroundColor: '#C85A32', // Terracotta Theme
        color: '#FFFFFF',
        borderRadius: '12px',
        padding: '0.2rem 0.55rem',
        fontSize: '0.72rem',
        fontWeight: '700',
        letterSpacing: '0.3px'
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
