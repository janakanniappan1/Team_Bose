import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} className="toast-icon-success" />,
    error: <AlertCircle size={20} className="toast-icon-error" />,
    info: <Info size={20} className="toast-icon-info" />
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'} animate-slide-up`}>
      <div className="toast-content">
        {icons[toast.type || 'info']}
        <span>{toast.message}</span>
      </div>
      <button onClick={onClose} className="toast-close-btn" aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}
