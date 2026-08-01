import React, { useState } from 'react';
import { MapPin, Clock, Eye, ShieldCheck, UserCheck, Tag, IndianRupee } from 'lucide-react';

export default function ProductPreview({ formData, images, audience, currentUser }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const audienceLabel = audience === 'students' 
    ? 'Students Only' 
    : audience === 'staff' 
    ? 'Staff Only' 
    : 'Students & Staff';

  const previewImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="product-preview-container card glass-panel p-4 mb-4 animate-fade-in">
      <div className="preview-banner-badge text-center p-2 mb-4 background-slate-100 border-radius-md">
        <span className="font-weight-bold text-primary" style={{ fontSize: '0.85rem' }}>
          👁️ LIVE PREVIEW — This is how your product listing will appear to buyers.
        </span>
      </div>

      <div className="details-grid">
        
        {/* Gallery */}
        <div className="details-gallery-box card">
          <div className="main-image-wrapper">
            <img 
              src={previewImages[activeImageIndex]} 
              alt={formData.title || 'Product Title'} 
              className="main-gallery-image"
            />
            <span className="badge gallery-condition-badge badge-primary">
              {formData.condition}
            </span>
          </div>

          {previewImages.length > 1 && (
            <div className="gallery-thumbnails-strip">
              {previewImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  className={`gallery-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={imgUrl} alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Card */}
        <div className="details-info-box card glass-panel">
          
          <div className="details-header-meta d-flex align-items-center gap-2 flex-wrap">
            <span className="badge badge-primary">{formData.category.toUpperCase()}</span>
            <span className="badge badge-amber">{audienceLabel}</span>
            <span className="meta-time"><Clock size={14} /> Posted Just now</span>
          </div>

          <h2 className="details-product-title mt-2">{formData.title || 'Product Title Placeholder'}</h2>

          <div className="details-price-box">
            <div className="price-main-wrap">
              <span className="price-main">₹{formData.price || '0'}</span>
              {formData.originalPrice && (
                <span className="price-original">₹{formData.originalPrice}</span>
              )}
            </div>
            {formData.negotiable && (
              <span className="badge badge-amber font-weight-bold">Price Negotiable</span>
            )}
          </div>

          <div className="details-location-bar">
            <MapPin size={18} className="text-rose" />
            <span>{formData.hostel || 'Main Campus'} • {formData.department || 'General'}</span>
          </div>

          {/* Seller Card */}
          <div className="seller-profile-card my-3">
            <div className="seller-avatar-box">
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt="Seller" 
                className="seller-avatar-img"
              />
            </div>
            <div className="flex-1">
              <div className="seller-name-row">
                <h4>{currentUser?.fullName || 'Jana K'}</h4>
                <UserCheck size={16} className="text-secondary" />
              </div>
              <p className="seller-subinfo">{formData.department || 'Computer Science'}</p>
            </div>
          </div>

          {/* Optional Meta */}
          {(formData.brand || formData.model || formData.purchaseYear || formData.reasonForSelling) && (
            <div className="optional-meta-box card p-3 mb-3 background-slate-50">
              <h5 className="mb-2" style={{ fontSize: '0.85rem' }}>Specifications & Details</h5>
              <div className="grid-2-cols gap-2 text-sm" style={{ fontSize: '0.8rem' }}>
                {formData.brand && <div><strong>Brand:</strong> {formData.brand}</div>}
                {formData.model && <div><strong>Model:</strong> {formData.model}</div>}
                {formData.purchaseYear && <div><strong>Year:</strong> {formData.purchaseYear}</div>}
                {formData.reasonForSelling && <div className="grid-col-span-2"><strong>Reason:</strong> {formData.reasonForSelling}</div>}
              </div>
            </div>
          )}

          <div className="details-description-box mt-2">
            <h4>Description</h4>
            <p className="description-text">{formData.description || 'No description provided.'}</p>
          </div>

        </div>

      </div>
    </div>
  );
}
