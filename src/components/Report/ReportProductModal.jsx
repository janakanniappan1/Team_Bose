import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { productService } from '../../services/productService';

export default function ReportProductModal({ product, onClose }) {
  const [selectedReason, setSelectedReason] = useState('Spam');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const REPORT_REASONS = [
    { id: 'Spam', label: 'Spam or Misleading Ad', desc: 'Commercial spam, repetitive listings, or deceptive titles.' },
    { id: 'Duplicate', label: 'Duplicate Listing', desc: 'Identical item already posted multiple times.' },
    { id: 'Fake Product', label: 'Fake / Counterfeit Product', desc: 'Not authentic, broken item disguised as working.' },
    { id: 'Wrong Category', label: 'Wrong Category / Department', desc: 'Item posted under wrong category.' },
    { id: 'Scam', label: 'Suspicious Scam / Advance Money Request', desc: 'Seller asking for prepayment before meeting.' },
    { id: 'Other', label: 'Other Safety Concern', desc: 'Inappropriate content or policy violation.' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await productService.reportProduct(product.id, { reason: selectedReason, notes });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card glass-panel p-4 animate-scale-up" onClick={(e) => e.stopPropagation()}>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2 text-rose">
            <ShieldAlert size={22} />
            <h3>Report Listing</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
              Reporting item: <strong>"{product.title}"</strong>. Help keep our campus marketplace safe.
            </p>

            <div className="report-reasons-list mb-4">
              {REPORT_REASONS.map((reason) => (
                <label key={reason.id} className="report-reason-card card p-3 mb-2">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={() => setSelectedReason(reason.id)}
                  />
                  <div className="ml-2">
                    <strong>{reason.label}</strong>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>{reason.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Additional Details (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Provide extra details for campus moderation team..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary bg-rose" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-4 animate-fade-in">
            <CheckCircle size={56} className="text-secondary mb-3 mx-auto" />
            <h3>Report Received</h3>
            <p className="text-muted mb-4 max-w-sm mx-auto">
              Thank you for helping protect student safety. Our campus moderation team will inspect this listing within 2 hours.
            </p>
            <button className="btn btn-secondary w-full" onClick={onClose}>
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
