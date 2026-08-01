import React, { useState } from 'react';
import { Tag, Check, X, ArrowRightLeft, DollarSign, Clock } from 'lucide-react';

export default function OfferCard({ 
  offer, 
  isSeller, 
  onAcceptOffer, 
  onRejectOffer, 
  onCounterOffer 
}) {
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');

  if (!offer) return null;

  const handleSendCounter = () => {
    if (counterAmount && onCounterOffer) {
      onCounterOffer(offer.id, Number(counterAmount));
      setShowCounterInput(false);
      setCounterAmount('');
    }
  };

  const getCardThemeClass = () => {
    if (offer.status === 'Accepted') return 'offer-card-accepted background-secondary-light border-secondary';
    if (offer.status === 'Rejected') return 'offer-card-rejected background-rose-light border-rose';
    if (offer.status === 'Counter') return 'offer-card-counter background-amber-light border-amber';
    return 'offer-card-pending background-slate-50 border-primary';
  };

  return (
    <div className={`offer-card card p-3 my-2 animate-slide-up ${getCardThemeClass()}`}>
      
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-1">
          <Tag size={16} className="text-primary" />
          <strong style={{ fontSize: '0.85rem' }}>
            {offer.type === 'counter' ? 'Seller Counter Offer' : 'Price Offer / Bid'}
          </strong>
        </div>
        <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>{offer.time || 'Just now'}</span>
      </div>

      {/* Offer Price Row */}
      <div className="offer-amount-row text-center py-2 mb-2 background-surface border-radius-md">
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Offered Price: </span>
        <strong className="text-primary font-weight-bold" style={{ fontSize: '1.3rem' }}>
          ₹{offer.amount}
        </strong>
      </div>

      {offer.note && (
        <p className="offer-note text-muted mb-2" style={{ fontSize: '0.8rem', italic: 'true' }}>
          "{offer.note}"
        </p>
      )}

      {/* Status Badges */}
      {offer.status === 'Accepted' && (
        <div className="offer-status-banner text-secondary text-center font-weight-bold p-1 border-radius-sm" style={{ fontSize: '0.85rem' }}>
          <Check size={16} className="inline-icon" /> OFFER ACCEPTED — Deal Agreed!
        </div>
      )}

      {offer.status === 'Rejected' && (
        <div className="offer-status-banner text-rose text-center font-weight-bold p-1 border-radius-sm" style={{ fontSize: '0.85rem' }}>
          <X size={16} className="inline-icon" /> Offer Declined
        </div>
      )}

      {offer.status === 'Counter' && (
        <div className="offer-status-banner text-amber text-center font-weight-bold p-1 border-radius-sm" style={{ fontSize: '0.85rem' }}>
          <ArrowRightLeft size={14} className="inline-icon" /> Counter Offer Sent: ₹{offer.counterAmount}
        </div>
      )}

      {/* Action Buttons for Seller when pending */}
      {offer.status === 'Pending' && isSeller && (
        <div className="offer-actions border-top pt-2 mt-2 d-flex gap-2">
          <button 
            className="btn btn-secondary btn-sm flex-1"
            onClick={() => onAcceptOffer && onAcceptOffer(offer.id)}
          >
            <Check size={14} /> Accept ₹{offer.amount}
          </button>

          <button 
            className="btn btn-outline btn-sm text-amber"
            onClick={() => setShowCounterInput(!showCounterInput)}
          >
            <ArrowRightLeft size={14} /> Counter
          </button>

          <button 
            className="btn btn-ghost btn-sm text-rose"
            onClick={() => onRejectOffer && onRejectOffer(offer.id)}
          >
            <X size={14} /> Decline
          </button>
        </div>
      )}

      {/* Counter Amount Input */}
      {showCounterInput && (
        <div className="counter-input-row border-top pt-2 mt-2 d-flex align-items-center gap-2">
          <input
            type="number"
            className="form-input btn-sm flex-1"
            placeholder="Counter price ₹"
            value={counterAmount}
            onChange={(e) => setCounterAmount(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" onClick={handleSendCounter}>
            Send
          </button>
        </div>
      )}

    </div>
  );
}
