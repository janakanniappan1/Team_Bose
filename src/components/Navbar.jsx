import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  MessageSquare, 
  Bell, 
  PlusCircle, 
  User, 
  GraduationCap, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  Package,
  Settings,
  ShieldCheck,
  Scale,
  Bookmark,
  LogIn
} from 'lucide-react';
import LiveSearchInput from './Search/LiveSearchInput';

export default function Navbar({ 
  activeView, 
  setActiveView, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  wishlistCount,
  unreadNotifsCount,
  currentUser,
  isLoggedIn = true,
  onSignOut,
  onOpenNotifications,
  compareCount = 0,
  onOpenCompare
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-header glass-panel sticky-top">
      <div className="container navbar-container">
        
        {/* Left: Brand Logo */}
        <div className="navbar-brand-group" onClick={() => setActiveView('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-icon">
            <GraduationCap size={26} color="#FFFFFF" />
          </div>
          <div className="brand-logo-text">
            <span className="brand-name">Uni<span className="brand-highlight">Swap</span></span>
            <span className="brand-tagline">Campus Marketplace</span>
          </div>
        </div>

        {/* Center: Live Auto-Suggestion Search Bar */}
        <LiveSearchInput
          searchQuery={searchQuery}
          onSelectSuggestion={(term) => {
            setSearchQuery(term);
            setActiveView('search');
            window.scrollTo(0, 0);
          }}
          onSearchSubmit={(term) => {
            setSearchQuery(term);
            setActiveView('search');
            window.scrollTo(0, 0);
          }}
        />

        {/* Right: Action Navigation */}
        <nav className="navbar-actions hide-mobile">
          
          <button 
            className={`nav-action-btn ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
          >
            <span>Home</span>
          </button>

          {/* Notifications Trigger */}
          <button 
            className="nav-action-btn icon-badge-btn"
            onClick={onOpenNotifications}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotifsCount > 0 && (
              <span className="nav-badge badge-danger">{unreadNotifsCount}</span>
            )}
            <span className="nav-label-mobile">Alerts</span>
          </button>

          {/* Product Comparison Trigger */}
          {compareCount > 0 && (
            <button 
              className="nav-action-btn icon-badge-btn text-primary"
              onClick={onOpenCompare}
              title="Compare Products"
            >
              <Scale size={20} />
              <span className="nav-badge badge-primary">{compareCount}</span>
              <span className="nav-label-mobile">Compare</span>
            </button>
          )}

          {/* Dedicated Wishlist View Trigger */}
          <button 
            className={`nav-action-btn icon-badge-btn ${activeView === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveView('wishlist')}
            title="Saved Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="nav-badge badge-primary">{wishlistCount}</span>
            )}
            <span className="nav-label-mobile">Wishlist</span>
          </button>

          {/* Chat Messages */}
          <button 
            className={`nav-action-btn icon-badge-btn ${activeView === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveView('messages')}
            title="Messages"
          >
            <MessageSquare size={20} />
            <span className="nav-badge badge-success">1</span>
            <span className="nav-label-mobile">Messages</span>
          </button>

          {/* Sell Button */}
          <button 
            className="btn btn-secondary btn-sell animate-pulse-glow"
            onClick={() => setActiveView('sell')}
          >
            <PlusCircle size={18} />
            <span>SELL</span>
          </button>

          {/* User Profile Dropdown or Sign In Button */}
          {isLoggedIn ? (
            <div className="profile-dropdown-wrapper">
              <button 
                className="user-profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                  alt="User Profile" 
                  className="user-avatar-img"
                />
                <span className="user-name-short hide-tablet">{currentUser?.fullName || currentUser?.firstName || 'Student'}</span>
                <ChevronDown size={14} className="dropdown-arrow" />
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown-menu animate-slide-up">
                  <div className="dropdown-user-info">
                    <p className="user-full-name">{currentUser?.fullName || 'Jana K'}</p>
                    <p className="user-dept">{currentUser?.department || 'Computer Science'}</p>
                    <span className="badge badge-secondary" style={{ marginTop: '4px' }}>
                      <ShieldCheck size={12} /> Verified Student
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { setActiveView('profile'); setShowProfileMenu(false); }}>
                    <User size={16} /> My Profile
                  </button>
                  <button className="dropdown-item" onClick={() => { setActiveView('profile'); setShowProfileMenu(false); }}>
                    <Package size={16} /> My Listings
                  </button>
                  <button className="dropdown-item" onClick={() => { setActiveView('wishlist'); setShowProfileMenu(false); }}>
                    <Heart size={16} /> My Saved Wishlist ({wishlistCount})
                  </button>
                  <button className="dropdown-item" onClick={() => { setActiveView('saved-searches'); setShowProfileMenu(false); }}>
                    <Bookmark size={16} /> Saved Searches
                  </button>
                  <button className="dropdown-item" onClick={() => { setActiveView('messages'); setShowProfileMenu(false); }}>
                    <MessageSquare size={16} /> Chat Messages
                  </button>
                  <button className="dropdown-item" onClick={() => { setActiveView('register'); setShowProfileMenu(false); }}>
                    <Settings size={16} /> Edit Profile Info
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger" onClick={() => { setShowProfileMenu(false); if (onSignOut) onSignOut(); }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setActiveView('login')}>
              <LogIn size={16} /> Sign In
            </button>
          )}

        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content animate-slide-down" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-user-header">
              <img src={currentUser?.avatar} alt="Avatar" className="user-avatar-img lg" />
              <div>
                <h4>{currentUser?.fullName}</h4>
                <p className="text-muted">{currentUser?.department}</p>
              </div>
            </div>
            <div className="drawer-links">
              <button onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}>
                Home Marketplace
              </button>
              <button onClick={() => { setActiveView('sell'); setMobileMenuOpen(false); }} className="highlight-green">
                <PlusCircle size={18} /> Sell Product
              </button>
              <button onClick={() => { setActiveView('wishlist'); setMobileMenuOpen(false); }}>
                <Heart size={18} /> My Saved Wishlist ({wishlistCount})
              </button>
              <button onClick={() => { setActiveView('saved-searches'); setMobileMenuOpen(false); }}>
                <Bookmark size={18} /> Saved Searches
              </button>
              <button onClick={() => { setActiveView('profile'); setMobileMenuOpen(false); }}>
                <User size={18} /> My Profile & Listings
              </button>
              <button onClick={() => { setActiveView('messages'); setMobileMenuOpen(false); }}>
                <MessageSquare size={18} /> Chat Messages
              </button>
              <button onClick={() => { onOpenNotifications(); setMobileMenuOpen(false); }}>
                <Bell size={18} /> Notifications
              </button>
              <button onClick={() => { setActiveView('register'); setMobileMenuOpen(false); }}>
                <Settings size={18} /> Complete/Edit Profile
              </button>
              <button onClick={() => { setMobileMenuOpen(false); if (onSignOut) onSignOut(); }} className="text-danger">
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
