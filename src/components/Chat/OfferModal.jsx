import React, { useState } from 'react';
import { X, DollarSign, Tag, Send, Sparkles } from 'lucide-react';

export default function OfferModal({ product, onClose, onSubmitOffer }) {
  const [offerAmount, setOfferAmount] = useState(product ? Math.round(product.price * 0.9) : 0);
  const [offerNote, setOfferNote] = useState('');

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (offerAmount > 0 && onSubmitOffer) {
      onSubmitOffer(Number(offerAmount), offerNote);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card glass-panel p-4 animate-scale-up" onClick={(e) => e.stopPropagation()}>
        
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <DollarSign size={22} className="text-primary" />
            <h3>Make Price Offer / Bid</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Product micro banner */}
        <div className="card p-3 mb-4 background-slate-50 d-flex align-items-center gap-3">
          <img src={product.images ? product.images[0] : product.itemImage} alt={product.title} className="share-item-thumb" />
          <div className="flex-1 min-w-0">
            <h4 style={{ fontSize: '0.9rem' }} className="text-truncate">{product.title || product.itemTitle}</h4>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Listed Price: </span>
            <strong className="text-primary">₹{product.price || product.itemPrice}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label font-weight-bold">Your Offer Amount (₹)</label>
            <div className="input-icon-wrapper">
              <input
                type="number"
                className="form-input"
                placeholder="Enter offer price"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                required
              />
            </div>
            <span className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
              Tip: Fair offers near listed price are 85% more likely to be accepted.
            </span>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Note for Seller (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Can collect today evening at SAC / Library Foyer..."
              value={offerNote}
              onChange={(e) => setOfferNote(e.target.value)}
              rows={2}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Submit Offer
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
