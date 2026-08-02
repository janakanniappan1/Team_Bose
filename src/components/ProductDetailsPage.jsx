import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Check,
  UserCheck,
  Scale,
  ShieldAlert,
  Maximize2
} from 'lucide-react';

import { ProductCard } from './HomePage';
import { productService } from '../services/productService';
import ShareProductModal from './Share/ShareProductModal';
import ReportProductModal from './Report/ReportProductModal';
import ImageZoomModal from './ImageZoomModal';

export default function ProductDetailsPage({ 
  product, 
  onBack, 
  isWishlisted, 
  onToggleWishlist, 
  onStartChat, 
  onSelectProduct,
  onToggleCompare,
  isCompared = false,
  allProducts = []
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);

  useEffect(() => {
    if (product) {
      productService.trackRecentlyViewed(product);
    }
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'];

  const relatedProducts = allProducts.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.department === product.department)
  ).slice(0, 4);

  const isSold = product.status === 'Sold';
  const isStaffSeller = product.sellerName?.toLowerCase().includes('prof') || product.sellerName?.toLowerCase().includes('dr.');
  const audienceLabel = product.audience === 'students' 
    ? 'Students Only' 
    : product.audience === 'staff' 
    ? 'Staff Only' 
    : 'Students & Staff';

  return (
    <div className="product-details-container animate-fade-in py-4">
      <div className="container">
        
        {/* Back & Quick Actions Top Bar */}
        <div className="details-top-bar">
          <button className="btn btn-outline btn-sm" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back to Marketplace</span>
          </button>
          
          <div className="details-share-actions">
            <button 
              className={`btn btn-sm ${isCompared ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => onToggleCompare && onToggleCompare(product)}
              title="Compare up to 3 products"
            >
              <Scale size={16} />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button className="btn btn-ghost btn-sm" onClick={() => setShowShareModal(true)}>
              <Share2 size={16} />
              <span>Share Item</span>
            </button>

            <button className="btn btn-ghost btn-sm text-rose" onClick={() => setShowReportModal(true)}>
              <ShieldAlert size={16} />
              <span>Report</span>
            </button>

            <button 
              className={`btn btn-sm ${isWishlisted ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onToggleWishlist(product.id)}
            >
              <Heart size={16} fill={isWishlisted ? '#FFFFFF' : 'none'} />
              <span>{isWishlisted ? 'Wishlisted' : 'Save to Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="details-grid">
          
          {/* Left: Product Image Gallery */}
          <div className="details-gallery-box card">
            <div className="main-image-wrapper cursor-pointer" onClick={() => setShowZoomModal(true)} title="Click to View Fullscreen & Zoom Photo">
              <img 
                src={images[activeImageIndex]} 
                alt={product.title} 
                className="main-gallery-image"
              />
              <span className="badge badge-slate position-absolute bottom-2 right-2 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem', zIndex: 5 }}>
                <Maximize2 size={12} /> Click to Zoom
              </span>
              <span className={`badge gallery-condition-badge ${
                product.condition === 'Brand New' ? 'badge-secondary' : 'badge-primary'
              }`}>
                {product.condition}
              </span>

              {isSold && (
                <div className="sold-overlay-badge animate-scale-up">
                  <span>SOLD OUT</span>
                </div>
              )}
            </div>

            {/* Thumbnail Switcher */}
            {images.length > 1 && (
              <div className="gallery-thumbnails-strip">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    className={`gallery-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Action Card */}
          <div className="details-info-box card glass-panel">
            
            <div className="details-header-meta d-flex align-items-center gap-2 flex-wrap">
              <span className="badge badge-primary">{product.category.toUpperCase()}</span>
              <span className="badge badge-amber">{audienceLabel}</span>
              <span className="meta-time"><Clock size={14} /> Posted {product.postedDate}</span>
              <span className="meta-views"><Eye size={14} /> {product.views || 140} Views</span>
            </div>

            <h1 className="details-product-title mt-2">{product.title}</h1>

            <div className="details-price-box">
              <div className="price-main-wrap">
                <span className="price-main">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="price-original">₹{product.originalPrice}</span>
                )}
              </div>
              {product.negotiable && (
                <span className="badge badge-amber font-weight-bold">Price Negotiable</span>
              )}
            </div>

            <div className="details-location-bar">
              <MapPin size={18} className="text-rose" />
              <span>{product.location} • {product.department}</span>
            </div>

            <div className="details-divider"></div>

            {/* Verified Seller Card */}
            <div className="seller-profile-card">
              <div className="seller-avatar-box">
                <img 
                  src={product.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                  alt={product.sellerName} 
                  className="seller-avatar-img"
                />
                <span className="online-indicator"></span>
              </div>
              <div className="flex-1">
                <div className="seller-name-row">
                  <h4>{product.sellerName}</h4>
                  <span className={`badge ${isStaffSeller ? 'badge-secondary' : 'badge-primary'}`}>
                    {isStaffSeller ? 'Verified Staff' : 'Verified Student'}
                  </span>
                </div>
                <p className="seller-subinfo">{product.sellerDept} ({product.sellerYear})</p>
                <div className="seller-rating-row">
                  <Star size={14} className="text-amber" fill="#F59E0B" />
                  <strong>{product.sellerRating || 4.9}</strong>
                  <span className="text-muted">• Verified Campus Member</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isSold ? (
              <div className="card p-3 text-center background-slate-100 border-dashed text-muted my-3">
                <strong className="text-rose font-weight-bold">THIS PRODUCT HAS BEEN SOLD</strong>
                <p style={{ fontSize: '0.8rem' }}>New offers and chat inquiries are closed for sold items.</p>
              </div>
            ) : (
              <div className="details-action-buttons">
                <button 
                  className="btn btn-secondary btn-lg w-full"
                  onClick={() => onStartChat(product)}
                >
                  <MessageSquare size={20} />
                  <span>Chat / Make Offer</span>
                </button>

                <button 
                  className="btn btn-outline btn-lg w-full"
                  onClick={() => setShowCallModal(true)}
                >
                  <Phone size={20} />
                  <span>Show Phone Number</span>
                </button>
              </div>
            )}

            {/* Item Description */}
            <div className="details-description-box mt-4">
              <h4>Description</h4>
              <p className="description-text">{product.description}</p>
            </div>

            {/* Campus Safety Notice */}
            <div className="safety-notice-card">
              <ShieldCheck size={20} className="text-secondary" />
              <div>
                <strong>Safe Handover Pledge</strong>
                <p className="text-muted">Meet in public campus areas (SAC, Library Foyer, Canteen). Verify item functionality before making payment.</p>
              </div>
            </div>

          </div>

        </div>

        {/* Similar Items Section */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section mt-5">
            <div className="section-header mb-3">
              <h2 className="section-title">Similar Items from {product.department}</h2>
            </div>
            <div className="grid-responsive">
              {relatedProducts.map((relProd) => (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Call Seller Modal */}
      {showCallModal && (
        <div className="modal-overlay" onClick={() => setShowCallModal(false)}>
          <div className="modal-content p-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header d-flex justify-content-between align-items-center mb-3">
              <h3>Seller Contact Information</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCallModal(false)}>✕</button>
            </div>

            <div className="seller-contact-details text-center py-3">
              <img src={product.sellerAvatar} alt="Seller" className="user-avatar-img lg mx-auto mb-2" />
              <h4>{product.sellerName}</h4>
              <p className="text-muted mb-3">{product.sellerDept} ({product.sellerYear})</p>

              <div className="contact-box card p-3 mb-3 bg-subtle">
                <p className="text-sm text-muted mb-1">Phone Number / WhatsApp</p>
                <h3 className="text-primary">{product.sellerPhone || '+91 98765 43210'}</h3>
              </div>

              <div className="d-flex gap-2">
                <a 
                  href={`tel:${product.sellerPhone}`} 
                  className="btn btn-primary w-full"
                >
                  <Phone size={18} /> Call Now
                </a>
                <button 
                  className="btn btn-secondary w-full" 
                  onClick={() => { setShowCallModal(false); onStartChat(product); }}
                >
                  <MessageSquare size={18} /> Open Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareProductModal 
          product={product} 
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportProductModal 
          product={product} 
          onClose={() => setShowReportModal(false)} 
        />
      )}

      {/* Image Zoom Modal */}
      {showZoomModal && (
        <ImageZoomModal
          images={images}
          initialIndex={activeImageIndex}
          title={product.title}
          onClose={() => setShowZoomModal(false)}
        />
      )}

    </div>
  );
}
