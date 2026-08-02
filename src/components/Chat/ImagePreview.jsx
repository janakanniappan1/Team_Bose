import React from 'react';
import { X, Send } from 'lucide-react';

export function ImagePreview({ imageFile, onCancel, onSend }) {
  if (!imageFile) return null;

  const imageUrl = URL.createObjectURL(imageFile);

  return (
    <div 
      className="modal-overlay d-flex align-items-center justify-content-center p-3"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050
      }}
    >
      <div className="card glass-panel p-4" style={{ maxWidth: '480px', width: '100%', borderRadius: '16px' }}>
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
          <h4 className="font-heading m-0" style={{ fontSize: '1.1rem' }}>Preview Attachment</h4>
          <button className="btn btn-ghost btn-sm icon-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="text-center bg-slate-900 border-radius-lg p-2 mb-3" style={{ maxHeight: '320px', overflow: 'hidden' }}>
          <img 
            src={imageUrl} 
            alt="Preview" 
            style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} 
          />
        </div>

        <div className="d-flex align-items-center justify-content-end gap-2">
          <button className="btn btn-outline btn-sm" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={onSend}>
            <Send size={15} />
            <span>Send Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
