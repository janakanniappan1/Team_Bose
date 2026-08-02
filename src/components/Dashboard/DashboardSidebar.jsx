import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Package, 
  Heart, 
  MessageSquare, 
  ShoppingBag, 
  Tag, 
  Bell, 
  Star, 
  Bookmark, 
  Clock, 
  Settings, 
  HelpCircle, 
  LogOut,
  PlusCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function DashboardSidebar({ 
  activeTab, 
  onSelectTab, 
  onSignOut,
  onGoToSell,
  currentUser,
  unreadMessages = 0,
  unreadNotifs = 0
}) {
  const MAIN_NAV = [
    { id: 'overview', label: 'Dashboard Home', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'My Campus Profile', icon: <User size={18} /> },
    { id: 'listings', label: 'My Item Listings', icon: <Package size={18} /> },
    { id: 'wishlist', label: 'Saved Wishlist', icon: <Heart size={18} /> },
    { id: 'purchases', label: 'Purchase History', icon: <ShoppingBag size={18} /> },
    { id: 'offers', label: 'Price Offers & Bids', icon: <Tag size={18} /> }
  ];

  const UTILITY_NAV = [
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, badge: unreadNotifs },
    { id: 'reviews', label: 'Reviews & Ratings', icon: <Star size={18} /> },
    { id: 'saved-searches', label: 'Saved Searches', icon: <Bookmark size={18} /> },
    { id: 'recent', label: 'Recently Viewed', icon: <Clock size={18} /> },
    { id: 'settings', label: 'Settings & Privacy', icon: <Settings size={18} /> },
    { id: 'help', label: 'Help & Safety', icon: <HelpCircle size={18} /> }
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="pro-sidebar card glass-panel hide-mobile animate-fade-in">
        
        {/* User Quick Micro Header */}
        <div className="pro-sidebar-user p-3 border-bottom d-flex align-items-center gap-3 background-slate-50">
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
            alt="Avatar" 
            className="user-avatar-img"
            style={{ width: '42px', height: '42px' }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-truncate font-weight-bold" style={{ fontSize: '0.9rem' }}>
              {currentUser?.fullName || 'Jana K'}
            </h4>
            <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>
              <ShieldCheck size={10} /> Verified Student
            </span>
          </div>
        </div>

        {/* Sell CTA Banner in Sidebar */}
        <div className="p-3 border-bottom">
          <button className="btn btn-secondary w-full d-flex align-items-center justify-content-center gap-2" onClick={onGoToSell}>
            <PlusCircle size={16} />
            <span className="font-weight-bold">Post New Item</span>
          </button>
        </div>

        {/* Main Nav Items */}
        <div className="pro-sidebar-menu p-2">
          <span className="pro-nav-section-title px-2 text-uppercase text-muted font-weight-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            Main Hub
          </span>
          <nav className="d-flex flex-column gap-1 mt-1 mb-3">
            {MAIN_NAV.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`pro-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="nav-badge-pill">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <span className="pro-nav-section-title px-2 text-uppercase text-muted font-weight-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            Account & Preferences
          </span>
          <nav className="d-flex flex-column gap-1 mt-1 mb-2">
            {UTILITY_NAV.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`pro-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="nav-badge-pill">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-top pt-2 mt-2">
            <button className="pro-nav-item text-rose hover-rose w-full" onClick={onSignOut}>
              <span className="nav-icon"><LogOut size={18} /></span>
              <span className="nav-label">Sign Out</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile Bottom Navigation Bar (Shown ONLY on mobile <768px) */}
      <nav className="mobile-bottom-bar show-mobile glass-panel p-2 d-flex justify-content-around align-items-center position-fixed bottom-0 start-0 end-0 z-index-top border-top background-surface">
        <button className={`bottom-bar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => onSelectTab('overview')}>
          <LayoutDashboard size={20} />
          <span>Hub</span>
        </button>

        <button className={`bottom-bar-item ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => onSelectTab('listings')}>
          <Package size={20} />
          <span>Listings</span>
        </button>

        <button className="fab-sell-btn btn btn-secondary" onClick={onGoToSell} title="Post Product for Sale">
          <PlusCircle size={24} />
        </button>

        <button className={`bottom-bar-item ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => onSelectTab('wishlist')}>
          <Heart size={20} />
          <span>Wishlist</span>
        </button>

        <button className={`bottom-bar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => onSelectTab('profile')}>
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
}
