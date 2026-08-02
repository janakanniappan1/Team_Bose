import React from 'react';
import { SeenIndicator } from './SeenIndicator';
import { ShoppingBag, Tag, ExternalLink } from 'lucide-react';

export function MessageBubble({ message, isMe, onOpenProduct }) {
  if (!message) return null;

  const formattedTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isImage = message.message_type === 'image' || !!message.image_url;
  const isProductCard = message.message_type === 'product_card' && message.metadata;
  const isOfferCard = message.message_type === 'offer_card' && message.metadata;

  return (
    <div className={`d-flex flex-column mb-3 ${isMe ? 'align-items-end' : 'align-items-start'}`}>
      
      <div
        className={`message-bubble shadow-sm p-3 border-radius-lg ${
          isMe ? 'user-bubble' : 'seller-bubble'
        }`}
        style={{
          maxWidth: '78%',
          backgroundColor: isMe ? '#C85A32' : '#FFFFFF', // Terracotta for current user, White for opponent
          color: isMe ? '#FFFFFF' : '#1E293B',
          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          border: isMe ? 'none' : '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Photo Message */}
        {isImage && (
          <div className="mb-2 overflow-hidden border-radius-md" style={{ maxHeight: '280px' }}>
            <img
              src={message.image_url}
              alt="Attachment"
              style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Shared Product Card */}
        {isProductCard && (
          <div 
            className="product-share-card p-2 mb-2 border-radius-md d-flex align-items-center gap-2 cursor-pointer"
            style={{ backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)' }}
            onClick={() => onOpenProduct && onOpenProduct(message.metadata)}
          >
            {message.metadata.image && (
              <img src={message.metadata.image} alt={message.metadata.title} style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
            )}
            <div className="flex-1 overflow-hidden">
              <span className="badge badge-secondary d-inline-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.65rem' }}>
                <ShoppingBag size={10} /> Shared Listing
              </span>
              <h6 className="m-0 text-truncate" style={{ fontSize: '0.85rem', color: isMe ? '#FFF' : '#0F172A' }}>{message.metadata.title}</h6>
              <strong style={{ fontSize: '0.85rem', color: isMe ? '#FEF08A' : '#C85A32' }}>₹{message.metadata.price}</strong>
            </div>
            <ExternalLink size={14} style={{ opacity: 0.8 }} />
          </div>
        )}

        {/* Offer Card */}
        {isOfferCard && (
          <div 
            className="offer-share-card p-3 mb-2 border-radius-md text-center"
            style={{ backgroundColor: isMe ? 'rgba(255,255,255,0.18)' : '#FFFBEB', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            <span className="badge badge-amber mb-2 d-inline-flex align-items-center gap-1">
              <Tag size={12} /> Special Price Offer
            </span>
            <h5 className="m-0" style={{ fontSize: '1.2rem', color: isMe ? '#FFF' : '#B45309' }}>
              ₹{message.metadata.offerAmount}
            </h5>
            {message.metadata.note && (
              <p className="m-0 mt-1" style={{ fontSize: '0.78rem', fontStyle: 'italic', opacity: 0.9 }}>"{message.metadata.note}"</p>
            )}
          </div>
        )}

        {/* Text Message Body */}
        {message.message && (
          <p className="m-0" style={{ fontSize: '0.92rem', lineHeight: '1.45', wordBreak: 'break-word' }}>
            {message.message}
          </p>
        )}

        {/* Timestamp & Status Checkmarks */}
        <div className="d-flex align-items-center justify-content-end gap-1 mt-1" style={{ fontSize: '0.68rem', opacity: 0.85 }}>
          <span>{formattedTime(message.created_at)}</span>
          {isMe && <SeenIndicator isSeen={message.is_seen} isDelivered={message.is_delivered} />}
        </div>
      </div>

    </div>
  );
}
