import React from 'react';

export function OnlineIndicator({ isOnline, lastSeen, size = 12 }) {
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Offline';
    const date = new Date(timestamp);
    const diffMins = Math.floor((new Date() - date) / (1000 * 60));

    if (diffMins < 1) return 'Active just now';
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    return `Active ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="d-inline-flex align-items-center gap-1">
      <span
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: isOnline ? '#22C55E' : '#94A3B8',
          border: '2px solid #FFFFFF',
          display: 'inline-block',
          boxShadow: isOnline ? '0 0 8px rgba(34, 197, 94, 0.4)' : 'none'
        }}
        title={isOnline ? 'Online now' : formatLastSeen(lastSeen)}
      />
      <span className="text-muted" style={{ fontSize: '0.78rem' }}>
        {isOnline ? 'Active now' : formatLastSeen(lastSeen)}
      </span>
    </div>
  );
}
