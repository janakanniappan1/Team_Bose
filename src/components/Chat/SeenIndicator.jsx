import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

export function SeenIndicator({ isSeen, isDelivered }) {
  if (isSeen) {
    return (
      <span title="Seen" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <CheckCheck size={15} style={{ color: '#38BDF8', strokeWidth: 2.5 }} />
      </span>
    );
  }

  if (isDelivered) {
    return (
      <span title="Delivered" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <CheckCheck size={15} style={{ color: 'rgba(255, 255, 255, 0.75)', strokeWidth: 2 }} />
      </span>
    );
  }

  return (
    <span title="Sent" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Check size={15} style={{ color: 'rgba(255, 255, 255, 0.75)', strokeWidth: 2 }} />
    </span>
  );
}
