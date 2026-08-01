import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  ShoppingBag, 
  MessageSquare, 
  Settings, 
  Star, 
  Calendar, 
  MapPin, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Eye, 
  ShieldCheck, 
  PlusCircle,
  Sliders
} from 'lucide-react';
import { ProductCard } from './HomePage';
import SellerDashboardTabs from './Seller/SellerDashboardTabs';

export default function UserProfilePage({ 
  user, 
  products = [], 
  wishlist = [], 
  onToggleWishlist, 
  onSelectProduct, 
  onGoToSell, 
  onEditProfile,
  onDeleteProduct,
  onToggleMarkSold,
  onChangePrice
}) {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'wishlist', 'settings'

  const myProducts = products.filter((p) => 
    p.sellerName === user?.fullName || 
    p.sellerName === 'Jana K' || 
    p.id.startsWith('prod-') ||
    p.id.startsWith('my-')
  );

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="user-profile-container animate-fade-in py-4">
      <div className="container">
        
        {/* Profile Banner & Header Card */}
        <div className="profile-header-card card glass-panel mb-4">
          <div className="profile-banner-bg"></div>
          
          <div className="profile-header-content p-4">
            <div className="profile-avatar-container">
              <img src={user?.avatar} alt={user?.fullName} className="profile-large-avatar" />
              <span className="profile-verified-badge" title="Verified Campus Student">
                <ShieldCheck size={20} color="#FFFFFF" />
              </span>
            </div>

            <div className="profile-main-meta">
              <div className="profile-name-row d-flex align-items-center gap-2">
                <h2>{user?.fullName}</h2>
                <span className="badge badge-secondary">{user?.role}</span>
              </div>
              <p className="profile-dept-text text-muted">{user?.department} • {user?.year}</p>
              
              <div className="profile-stats-pills mt-2 d-flex gap-3 flex-wrap text-muted" style={{ fontSize: '0.85rem' }}>
                <span className="pill-item"><MapPin size={14} /> {user?.hostelBlock}</span>
                <span className="pill-item"><Calendar size={14} /> Joined {user?.joinedDate}</span>
                <span className="pill-item text-amber"><Star size={14} fill="#F59E0B" /> {user?.rating} Rating</span>
              </div>
            </div>

            <div className="profile-edit-action">
              <button className="btn btn-outline-primary" onClick={onEditProfile}>
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="profile-subnav-bar px-4 py-2 border-top d-flex gap-3">
            <button 
              className={`nav-action-btn ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <Package size={18} />
              <span>Seller Dashboard ({myProducts.length})</span>
            </button>

            <button 
              className={`nav-action-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <Heart size={18} />
              <span>Saved Wishlist ({wishlistedProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'listings' && (
          <SellerDashboardTabs
            products={myProducts}
            onSelectProduct={onSelectProduct}
            onEditProduct={() => onGoToSell()}
            onDeleteProduct={onDeleteProduct}
            onToggleMarkSold={onToggleMarkSold}
            onChangePrice={onChangePrice}
            onGoToSell={onGoToSell}
          />
        )}

        {activeTab === 'wishlist' && (
          <div className="wishlist-profile-view card glass-panel p-4">
            <h3 className="section-title mb-3">Saved Wishlist Items</h3>
            {wishlistedProducts.length > 0 ? (
              <div className="grid-responsive">
                {wishlistedProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isWishlisted={true}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted p-4 text-center">No saved items in your wishlist.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
