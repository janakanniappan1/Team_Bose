import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2, 
  Edit3, 
  DollarSign, 
  CheckSquare, 
  Users, 
  MessageSquare,
  AlertCircle,
  PlusCircle,
  Tag
} from 'lucide-react';
import ProductStatusBadge from './ProductStatusBadge';
import EmptyState from '../EmptyState/EmptyState';

export default function SellerDashboardTabs({ 
  products = [], 
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleMarkSold,
  onChangePrice,
  onGoToSell
}) {
  const [activeTab, setActiveTab] = useState('approved'); // 'pending', 'approved', 'rejected'
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  // Filter listings by seller status
  const pendingProducts = products.filter(p => p.status === 'Pending Approval');
  const approvedProducts = products.filter(p => p.status === 'Approved' || p.status === 'Active' || p.status === 'Sold' || !p.status);
  const rejectedProducts = products.filter(p => p.status === 'Rejected' || p.status === 'Cancelled');

  const handleSavePrice = (productId) => {
    if (newPrice && onChangePrice) {
      onChangePrice(productId, Number(newPrice));
    }
    setEditingPriceId(null);
    setNewPrice('');
  };

  const getActiveTabProducts = () => {
    if (activeTab === 'pending') return pendingProducts;
    if (activeTab === 'rejected') return rejectedProducts;
    return approvedProducts;
  };

  const displayedProducts = getActiveTabProducts();

  return (
    <div className="seller-dashboard-container animate-fade-in">
      
      {/* Top Header Card */}
      <div className="seller-dashboard-header card glass-panel p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="section-title">My Seller Dashboard</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Manage your campus ad listings, check approval status, and update item availability.
            </p>
          </div>

          <button className="btn btn-secondary" onClick={onGoToSell}>
            <PlusCircle size={18} />
            <span>Post New Listing</span>
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="seller-tabs-bar d-flex gap-2 mt-4 border-top pt-3">
          <button 
            className={`seller-tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            <CheckCircle size={16} className="text-secondary" />
            <span>Approved & Active</span>
            <span className="badge badge-secondary">{approvedProducts.length}</span>
          </button>

          <button 
            className={`seller-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={16} className="text-amber" />
            <span>Pending Approval</span>
            <span className="badge badge-amber">{pendingProducts.length}</span>
          </button>

          <button 
            className={`seller-tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            <XCircle size={16} className="text-rose" />
            <span>Rejected / Needs Revision</span>
            <span className="badge badge-rose">{rejectedProducts.length}</span>
          </button>
        </div>
      </div>

      {/* Seller Product Cards Grid */}
      {displayedProducts.length > 0 ? (
        <div className="seller-listings-grid grid-responsive">
          {displayedProducts.map((product) => (
            <SellerListingCard
              key={product.id}
              product={product}
              activeTab={activeTab}
              onSelectProduct={onSelectProduct}
              onEditProduct={onEditProduct}
              onDeleteProduct={onDeleteProduct}
              onToggleMarkSold={onToggleMarkSold}
              editingPriceId={editingPriceId}
              setEditingPriceId={setEditingPriceId}
              newPrice={newPrice}
              setNewPrice={setNewPrice}
              onSavePrice={handleSavePrice}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="listings"
          title={`No ${activeTab.toUpperCase()} Listings`}
          message={`You currently don't have any items in the ${activeTab} section.`}
          actionLabel="Post New Item for Sale"
          onAction={onGoToSell}
        />
      )}

    </div>
  );
}

{/* Individual Seller Listing Card Component */}
function SellerListingCard({
  product,
  activeTab,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleMarkSold,
  editingPriceId,
  setEditingPriceId,
  newPrice,
  setNewPrice,
  onSavePrice
}) {
  const isSold = product.status === 'Sold';
  const audienceBadgeLabel = product.audience === 'students' 
    ? 'Students Only' 
    : product.audience === 'staff' 
    ? 'Staff Only' 
    : 'Students & Staff';

  return (
    <div className={`seller-listing-card card ${isSold ? 'sold-card' : ''}`}>
      
      {/* Image Stage */}
      <div className="seller-card-image-box" onClick={() => onSelectProduct(product)}>
        <img src={product.images[0]} alt={product.title} className="seller-card-img" />
        
        <div className="seller-card-top-badges">
          <ProductStatusBadge status={product.status || 'Approved'} />
          <span className="badge badge-amber">{audienceBadgeLabel}</span>
        </div>

        {isSold && (
          <div className="sold-overlay-badge animate-scale-up">
            <span>SOLD</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="seller-card-body p-3">
        <div className="d-flex justify-content-between align-items-baseline mb-2">
          {editingPriceId === product.id ? (
            <div className="d-flex align-items-center gap-1">
              <span className="text-primary font-weight-bold">₹</span>
              <input
                type="number"
                className="form-input btn-sm"
                style={{ width: '90px' }}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                autoFocus
              />
              <button className="btn btn-primary btn-sm" onClick={() => onSavePrice(product.id)}>
                Save
              </button>
            </div>
          ) : (
            <span className="seller-card-price text-primary font-weight-bold" style={{ fontSize: '1.2rem' }}>
              ₹{product.price}
            </span>
          )}
          <span className="badge badge-slate text-uppercase">{product.category}</span>
        </div>

        <h3 className="seller-card-title text-truncate mb-2" onClick={() => onSelectProduct(product)} style={{ fontSize: '0.95rem' }}>
          {product.title}
        </h3>

        {/* Rejection Reason Placeholder */}
        {activeTab === 'rejected' && (
          <div className="rejection-reason-box card p-2 mb-2 background-rose-light text-rose border-rose" style={{ fontSize: '0.75rem' }}>
            <AlertCircle size={12} className="inline-icon" /> <strong>Reason:</strong> Clear photo required. Please re-upload sharper image of product condition.
          </div>
        )}

        <div className="seller-card-meta border-top pt-2 mt-2 d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
          <span><Eye size={12} /> {product.views || 48} Views</span>
          <span><MessageSquare size={12} /> {product.interestedBuyers || 3} Interested</span>
          <span>{product.postedDate || 'Recent'}</span>
        </div>

        {/* Dynamic Action Buttons per Tab */}
        <div className="seller-card-actions border-top pt-2 mt-2 d-flex flex-wrap gap-2">
          {activeTab === 'pending' && (
            <>
              <button className="btn btn-outline btn-sm flex-1" onClick={() => onEditProduct && onEditProduct(product)}>
                <Edit3 size={13} /> Edit
              </button>
              <button className="btn btn-ghost btn-sm text-rose" onClick={() => onDeleteProduct(product)}>
                <Trash2 size={13} /> Delete
              </button>
            </>
          )}

          {activeTab === 'approved' && (
            <>
              <button className="btn btn-outline-primary btn-sm flex-1" onClick={() => onSelectProduct(product)}>
                <Eye size={13} /> View
              </button>
              <button 
                className={`btn btn-sm ${isSold ? 'btn-outline' : 'btn-secondary'}`}
                onClick={() => onToggleMarkSold(product.id)}
              >
                <CheckSquare size={13} /> {isSold ? 'Mark Active' : 'Mark Sold'}
              </button>
              <button 
                className="btn btn-ghost btn-sm text-muted"
                onClick={() => {
                  setEditingPriceId(product.id);
                  setNewPrice(product.price);
                }}
                title="Change Price"
              >
                <DollarSign size={13} /> Price
              </button>
              <button className="btn btn-ghost btn-sm text-rose" onClick={() => onDeleteProduct(product)} title="Remove Listing">
                <Trash2 size={13} />
              </button>
            </>
          )}

          {activeTab === 'rejected' && (
            <>
              <button className="btn btn-primary btn-sm flex-1" onClick={() => onEditProduct && onEditProduct(product)}>
                <Edit3 size={13} /> Edit & Resubmit
              </button>
              <button className="btn btn-ghost btn-sm text-rose" onClick={() => onDeleteProduct(product)}>
                <Trash2 size={13} /> Delete
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
