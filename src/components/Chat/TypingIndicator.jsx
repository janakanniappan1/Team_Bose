import React from 'react';

export function TypingIndicator({ userName = '' }) {
  return (
    <div className="d-flex align-items-center gap-2 py-2 px-3 mb-2 animate-fade-in" style={{ width: 'fit-content' }}>
      <div 
        className="d-flex align-items-center gap-1 px-3 py-2 border-radius-lg shadow-sm"
        style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0' }}
      >
        <span className="dot-pulse" style={{ width: '6px', height: '6px', backgroundColor: '#64748B', borderRadius: '50%' }}></span>
        <span className="dot-pulse delay-1" style={{ width: '6px', height: '6px', backgroundColor: '#64748B', borderRadius: '50%' }}></span>
        <span className="dot-pulse delay-2" style={{ width: '6px', height: '6px', backgroundColor: '#64748B', borderRadius: '50%' }}></span>
      </div>
      <span className="text-muted" style={{ fontSize: '0.78rem', fontStyle: 'italic' }}>
        {userName ? `${userName} is typing...` : 'Typing...'}
      </span>
    </div>
  );
}
