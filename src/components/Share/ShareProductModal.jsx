import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Mail, QrCode } from 'lucide-react';

export default function ShareProductModal({ product, onClose }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!product) return null;

  const currentUrl = window.location.href;
  const shareText = `Check out "${product.title}" for ₹${product.price} on UniSwap Campus Marketplace!`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${currentUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Campus Deal: ${product.title}`)}&body=${encodeURIComponent(`${shareText}\n\nLink: ${currentUrl}`)}`;

  // SVG QR Code generator string
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card glass-panel p-4 animate-scale-up" onClick={(e) => e.stopPropagation()}>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <Share2 size={20} className="text-primary" />
            <h3>Share Product Listing</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Product Micro Summary */}
        <div className="share-item-summary card p-3 mb-4 background-slate-50 d-flex align-items-center gap-3">
          <img src={product.images[0]} alt={product.title} className="share-item-thumb" />
          <div className="flex-1 min-w-0">
            <h4 style={{ fontSize: '0.95rem' }} className="text-truncate">{product.title}</h4>
            <span className="text-primary font-weight-bold">₹{product.price}</span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}> • {product.department}</span>
          </div>
        </div>

        {/* Copy Link Action Bar */}
        <div className="form-group mb-4">
          <label className="form-label">Product Link</label>
          <div className="input-icon-wrapper">
            <input 
              type="text" 
              readOnly 
              className="form-input" 
              value={currentUrl} 
            />
            <button 
              type="button" 
              className="btn btn-primary btn-sm copy-link-btn"
              onClick={handleCopy}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="share-social-grid mb-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="share-social-btn whatsapp-share">
            <MessageCircle size={22} />
            <span>WhatsApp</span>
          </a>

          <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="share-social-btn telegram-share">
            <Send size={22} />
            <span>Telegram</span>
          </a>

          <a href={emailUrl} className="share-social-btn email-share">
            <Mail size={22} />
            <span>Email</span>
          </a>

          <button type="button" className="share-social-btn qr-share" onClick={() => setShowQR(!showQR)}>
            <QrCode size={22} />
            <span>{showQR ? 'Hide QR' : 'QR Code'}</span>
          </button>
        </div>

        {/* QR Code Section */}
        {showQR && (
          <div className="qr-code-box text-center p-3 card background-slate-50 animate-slide-up mb-3">
            <img src={qrSvgUrl} alt="Product QR Code" className="qr-code-img mx-auto mb-2" />
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Scan QR Code with phone camera to open listing</p>
          </div>
        )}

      </div>
    </div>
  );
}
