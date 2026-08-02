import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  Clock, 
  Tag, 
  Bell, 
  Star, 
  User, 
  ShieldCheck, 
  Edit3, 
  Download, 
  PlusCircle, 
  ChevronRight, 
  HelpCircle, 
  Lock, 
  Moon, 
  Sun, 
  Globe, 
  Trash2, 
  Check, 
  X,
  FileText,
  AlertCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Search,
  Bookmark
} from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import SellerDashboardTabs from '../Seller/SellerDashboardTabs';
import MessagesView from '../MessagesView';
import WishlistPage from '../Wishlist/WishlistPage';
import SavedSearchesPage from '../Search/SavedSearchesPage';
import RecentlyViewedBar from '../Recent/RecentlyViewedBar';
import ProductStatusBadge from '../Seller/ProductStatusBadge';
import { ProductCard } from '../HomePage';
import { getPurchaseHistory, getOffers, getHelpFAQs } from '../../services/userService';

export default function UserDashboardPage({
  user,
  products = [],
  wishlist = [],
  onToggleWishlist,
  onSelectProduct,
  onGoToSell,
  onEditProfile,
  onDeleteProduct,
  onToggleMarkSold,
  onChangePrice,
  onSignOut,
  savedSearches = [],
  onDeleteSavedSearch,
  onRenameSavedSearch,
  onSearchAgain,
  notifications = [],
  onMarkAllRead,
  onClearAllNotifications
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'profile', 'listings', 'wishlist', 'messages', 'purchases', 'offers', 'notifications', 'reviews', 'saved-searches', 'recent', 'settings', 'help'
  const [purchases, setPurchases] = useState([]);
  const [offers, setOffers] = useState({ sent: [], received: [] });
  const [offerTab, setOfferTab] = useState('sent');
  const [faqs, setFaqs] = useState([]);
  const [notifCategory, setNotifCategory] = useState('all');

  useEffect(() => {
    getPurchaseHistory().then(setPurchases);
    getOffers().then(setOffers);
    getHelpFAQs().then(setFaqs);
  }, [activeTab]);

  const filteredNotifications = notifications.filter(n => {
    if (notifCategory === 'all') return true;
    return n.type === notifCategory;
  });

  // Seller listings for current user
  const myProducts = products.filter((p) => 
    (user?.fullName && p.sellerName === user.fullName) || 
    (user?.username && p.sellerName === user.username) ||
    (user?.id && (p.sellerId === user.id || p.seller_id === user.id)) ||
    p.id.startsWith('my-')
  );

  const pendingListings = myProducts.filter(p => p.status === 'Pending Approval').length;
  const approvedListings = myProducts.filter(p => p.status === 'Approved' || p.status === 'Active' || !p.status).length;
  const soldProducts = myProducts.filter(p => p.status === 'Sold').length;

  return (
    <div className="unified-dashboard-wrapper py-4 animate-fade-in">
      <div className="container">
        
        {/* Main Dashboard Layout: Left Sidebar + Main Content */}
        <div className="dashboard-grid-container">
          
          {/* 1. Left Professional Sidebar */}
          <DashboardSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onSignOut={onSignOut}
            onGoToSell={onGoToSell}
            currentUser={user}
          />

          {/* 2. Main Executive Content Window */}
          <main className="dashboard-content-area">
            
            {/* OVERVIEW / DASHBOARD HOME */}
            {activeTab === 'overview' && (
              <div className="overview-section animate-fade-in">
                
                {/* Executive Welcome Hero Card */}
                <div className="executive-welcome-card card p-4 mb-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={user?.avatar} alt={user?.fullName} className="user-avatar-img lg" style={{ width: '56px', height: '56px' }} />
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h2 className="font-heading" style={{ fontSize: '1.4rem' }}>Welcome back, {user?.fullName || 'Jana K'}!</h2>
                          <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                            <ShieldCheck size={12} /> Verified Student
                          </span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {user?.department || 'Computer Science & Engineering'} • {user?.year || '3rd Year'}
                        </p>
                      </div>
                    </div>

                    <button className="btn btn-secondary btn-lg shadow-sm" onClick={onGoToSell}>
                      <PlusCircle size={18} />
                      <span>Post New Item for Sale</span>
                    </button>
                  </div>
                </div>

                {/* KPI Stat Cards (4-Column Grid) */}
                <div className="kpi-stats-grid mb-4">
                  
                  <div className="kpi-card card p-3 glass-panel">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="kpi-label">Active Listings</span>
                      <span className="kpi-icon-box text-primary background-slate-100">
                        <Package size={18} />
                      </span>
                    </div>
                    <div className="kpi-value">{myProducts.length}</div>
                    <span className="kpi-trend text-secondary">
                      <TrendingUp size={12} /> {approvedListings} Live on Marketplace
                    </span>
                  </div>

                  <div className="kpi-card card p-3 glass-panel">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="kpi-label">Items Sold</span>
                      <span className="kpi-icon-box text-secondary background-secondary-light">
                        <CheckCircle size={18} />
                      </span>
                    </div>
                    <div className="kpi-value text-secondary">{soldProducts}</div>
                    <span className="kpi-subtext text-muted">Successful campus deals</span>
                  </div>

                  <div className="kpi-card card p-3 glass-panel">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="kpi-label">Purchased Items</span>
                      <span className="kpi-icon-box text-amber background-amber-light">
                        <ShoppingBag size={18} />
                      </span>
                    </div>
                    <div className="kpi-value text-amber">{purchases.length}</div>
                    <span className="kpi-subtext text-muted">Bought from peers & staff</span>
                  </div>

                  <div className="kpi-card card p-3 glass-panel">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="kpi-label">Saved Wishlist</span>
                      <span className="kpi-icon-box text-rose background-rose-light">
                        <Heart size={18} />
                      </span>
                    </div>
                    <div className="kpi-value text-rose">{wishlist.length}</div>
                    <span className="kpi-subtext text-muted">Items tracked</span>
                  </div>

                </div>

                {/* Sub Activity Grid (2 Columns) */}
                <div className="grid-2-cols gap-4 mb-4">
                  
                  {/* Active Seller Products Preview */}
                  <div className="card glass-panel p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="section-title" style={{ fontSize: '1.05rem' }}>My Active Products</h3>
                      <button className="btn btn-ghost btn-sm text-primary" onClick={() => setActiveTab('listings')}>
                        View All ({myProducts.length}) <ChevronRight size={14} />
                      </button>
                    </div>

                    {myProducts.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {myProducts.slice(0, 3).map((item) => (
                          <div key={item.id} className="d-flex align-items-center justify-content-between p-2 card background-slate-50 border-slate-200">
                            <div className="d-flex align-items-center gap-2">
                              <img src={item.images[0]} alt={item.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                              <div className="min-w-0">
                                <h4 className="text-truncate font-weight-bold" style={{ fontSize: '0.85rem', maxWidth: '180px' }}>{item.title}</h4>
                                <strong className="text-primary" style={{ fontSize: '0.8rem' }}>₹{item.price}</strong>
                              </div>
                            </div>
                            <ProductStatusBadge status={item.status || 'Approved'} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center p-3" style={{ fontSize: '0.85rem' }}>No active product listings yet.</p>
                    )}
                  </div>

                  {/* Recent Purchase History Preview */}
                  <div className="card glass-panel p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="section-title" style={{ fontSize: '1.05rem' }}>Recent Purchases</h3>
                      <button className="btn btn-ghost btn-sm text-primary" onClick={() => setActiveTab('purchases')}>
                        History ({purchases.length}) <ChevronRight size={14} />
                      </button>
                    </div>

                    {purchases.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {purchases.map((item) => (
                          <div key={item.id} className="d-flex align-items-center justify-content-between p-2 card background-slate-50 border-slate-200">
                            <div className="d-flex align-items-center gap-2">
                              <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                              <div>
                                <h4 className="text-truncate font-weight-bold" style={{ fontSize: '0.85rem', maxWidth: '180px' }}>{item.title}</h4>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{item.sellerName}</span>
                              </div>
                            </div>
                            <strong className="text-primary" style={{ fontSize: '0.85rem' }}>₹{item.price}</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center p-3" style={{ fontSize: '0.85rem' }}>No purchase history recorded.</p>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* MY PROFILE */}
            {activeTab === 'profile' && (
              <div className="profile-section card glass-panel p-4 animate-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <h3 className="section-title">Campus Profile Details</h3>
                  <button className="btn btn-outline-primary btn-sm" onClick={onEditProfile}>
                    <Edit3 size={15} /> Edit Profile
                  </button>
                </div>

                <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
                  <img src={user?.avatar} alt={user?.fullName} className="user-avatar-img lg" style={{ width: '80px', height: '80px' }} />
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h2 className="font-heading">{user?.fullName}</h2>
                      <span className="badge badge-secondary"><ShieldCheck size={14} /> Verified Student</span>
                    </div>
                    <p className="text-muted mt-1">{user?.department} • {user?.year}</p>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Hostel: {user?.hostelBlock}</p>
                  </div>
                </div>

                <div className="grid-2-cols gap-3 text-sm border-top pt-3">
                  <div><strong>Campus Email:</strong> <p>{user?.email || 'jana.student@university.edu'}</p></div>
                  <div><strong>Phone Number:</strong> <p>{user?.phone || '+91 98765 43210'}</p></div>
                  <div><strong>Account Status:</strong> <p className="text-secondary font-weight-bold">🟢 Active & Verified</p></div>
                  <div><strong>Joined Date:</strong> <p>{user?.joinedDate || 'August 2024'}</p></div>
                </div>
              </div>
            )}

            {/* MY LISTINGS */}
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

            {/* WISHLIST */}
            {activeTab === 'wishlist' && (
              <WishlistPage
                wishlistProducts={products.filter((p) => wishlist.includes(p.id))}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onGoToHome={() => setActiveTab('overview')}
              />
            )}

            {/* MESSAGES */}
            {activeTab === 'messages' && (
              <MessagesView
                onSelectProduct={onSelectProduct}
                onGoBack={() => setActiveTab('overview')}
              />
            )}

            {/* PURCHASE HISTORY */}
            {activeTab === 'purchases' && (
              <div className="purchases-section card glass-panel p-4 animate-fade-in">
                <h3 className="section-title mb-3">Purchase History</h3>
                <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>
                  Items bought from verified campus peers and faculty members.
                </p>

                {purchases.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {purchases.map((item) => (
                      <div key={item.id} className="card p-3 background-slate-50 border-slate-200 d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <h4 style={{ fontSize: '0.95rem' }}>{item.title}</h4>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                              Seller: <strong>{item.sellerName}</strong> ({item.sellerRole}) • Purchased {item.purchaseDate}
                            </p>
                            <strong className="text-primary">₹{item.price}</strong>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <button className="btn btn-outline btn-sm" onClick={() => alert('Downloading official receipt PDF...')}>
                            <Download size={14} /> Receipt
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => alert('Opening Review rating modal...')}>
                            <Star size={14} /> Leave Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center p-4">No past purchases recorded.</p>
                )}
              </div>
            )}

            {/* OFFERS MANAGER */}
            {activeTab === 'offers' && (
              <div className="offers-section card glass-panel p-4 animate-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="section-title">Offers & Bids Manager</h3>
                  <div className="d-flex gap-2">
                    <button className={`btn btn-sm ${offerTab === 'sent' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setOfferTab('sent')}>
                      Sent ({offers.sent.length})
                    </button>
                    <button className={`btn btn-sm ${offerTab === 'received' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setOfferTab('received')}>
                      Received ({offers.received.length})
                    </button>
                  </div>
                </div>

                <div className="offers-list d-flex flex-column gap-3">
                  {(offerTab === 'sent' ? offers.sent : offers.received).map((off) => (
                    <div key={off.id} className="card p-3 background-slate-50 d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div>
                        <h4>{off.productTitle}</h4>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                          {offerTab === 'sent' ? `Seller: ${off.sellerName}` : `Buyer: ${off.buyerName}`} • Offered {off.date}
                        </p>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Listed: ₹{off.listedPrice}</span>
                          <strong className="text-primary" style={{ fontSize: '1rem' }}>Bid: ₹{off.offeredPrice}</strong>
                        </div>
                      </div>

                      <span className={`badge ${off.status === 'Accepted' ? 'badge-secondary' : off.status === 'Pending' ? 'badge-amber' : 'badge-slate'}`}>
                        {off.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="notifications-section card glass-panel p-4 animate-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="section-title mb-1">Notifications Hub</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                      Stay updated on price offers, messages, and campus listing status.
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={onMarkAllRead}>
                      <Check size={14} /> Mark All Read
                    </button>
                    <button className="btn btn-ghost btn-sm text-rose" onClick={onClearAllNotifications}>
                      <Trash2 size={14} /> Clear All
                    </button>
                  </div>
                </div>

                <div className="notif-category-pills d-flex gap-2 mb-4 overflow-x-auto pb-2">
                  <button 
                    className={`badge ${notifCategory === 'all' ? 'badge-primary' : 'badge-slate'}`}
                    onClick={() => setNotifCategory('all')}
                    style={{ cursor: 'pointer' }}
                  >
                    All Notifications ({notifications.length})
                  </button>
                  <button 
                    className={`badge ${notifCategory === 'recommendation' ? 'badge-primary' : 'badge-slate'}`}
                    onClick={() => setNotifCategory('recommendation')}
                    style={{ cursor: 'pointer' }}
                  >
                    Offers & Bids
                  </button>
                  <button 
                    className={`badge ${notifCategory === 'message' ? 'badge-primary' : 'badge-slate'}`}
                    onClick={() => setNotifCategory('message')}
                    style={{ cursor: 'pointer' }}
                  >
                    Messages
                  </button>
                  <button 
                    className={`badge ${notifCategory === 'sold' ? 'badge-primary' : 'badge-slate'}`}
                    onClick={() => setNotifCategory('sold')}
                    style={{ cursor: 'pointer' }}
                  >
                    Marketplace & Approvals
                  </button>
                </div>

                {filteredNotifications.length > 0 ? (
                  <div className="notif-feed d-flex flex-column gap-3">
                    {filteredNotifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`card p-3 d-flex align-items-center justify-content-between border-slate-200 ${n.unread ? 'background-primary-light border-primary' : 'background-slate-50'}`}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="notif-icon-box p-2 background-surface border-radius-full">
                            <Bell size={18} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-weight-bold" style={{ fontSize: '0.9rem' }}>{n.title}</h4>
                            <p className="text-muted" style={{ fontSize: '0.82rem' }}>{n.message}</p>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}><Clock size={11} /> {n.time}</span>
                          </div>
                        </div>

                        {n.unread && <span className="badge badge-primary rounded-circle">New</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center p-4">No notifications in this section.</p>
                )}
              </div>
            )}

            {/* REVIEWS & RATINGS */}
            {activeTab === 'reviews' && (
              <div className="reviews-section card glass-panel p-4 animate-fade-in">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h3 className="section-title">Campus Ratings & Feedback</h3>
                  <div className="badge badge-amber font-weight-bold" style={{ fontSize: '1rem' }}>
                    ★ 5.0 Rating (0 Reviews)
                  </div>
                </div>

                <div className="text-center py-4 text-muted">
                  <Star size={32} className="mb-2 text-slate-300" />
                  <p className="mb-0">No campus reviews yet. Complete your first deal to receive feedback!</p>
                </div>
              </div>
            )}

            {/* SAVED SEARCHES */}
            {activeTab === 'saved-searches' && (
              <SavedSearchesPage
                savedSearches={savedSearches}
                onDeleteSavedSearch={onDeleteSavedSearch}
                onRenameSavedSearch={onRenameSavedSearch}
                onSearchAgain={onSearchAgain}
                onGoToHome={() => setActiveTab('overview')}
              />
            )}

            {/* RECENTLY VIEWED */}
            {activeTab === 'recent' && (
              <div className="recent-section card glass-panel p-4">
                <RecentlyViewedBar
                  recentProducts={products.slice(0, 4)}
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                  onSelectProduct={onSelectProduct}
                />
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div className="settings-section card glass-panel p-4 animate-fade-in">
                <h3 className="section-title mb-4">Account Settings & Preferences</h3>
                
                <div className="mb-4">
                  <h4 style={{ fontSize: '0.95rem' }} className="mb-2">Appearance</h4>
                  <label className="d-flex align-items-center gap-2 card p-3 background-slate-50">
                    <Sun size={18} className="text-amber" />
                    <span className="font-weight-bold">Cozy Neutral Retreat (Default)</span>
                    <input type="radio" name="theme" defaultChecked />
                  </label>
                </div>
              </div>
            )}

            {/* HELP & SUPPORT */}
            {activeTab === 'help' && (
              <div className="help-section card glass-panel p-4 animate-fade-in">
                <h3 className="section-title mb-3">Help & Campus Safety Guidelines</h3>
                <div className="d-flex flex-column gap-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="faq-card card p-3 background-slate-50">
                      <h4 style={{ fontSize: '0.95rem' }} className="text-primary mb-1">Q: {faq.q}</h4>
                      <p className="text-muted" style={{ fontSize: '0.85rem' }}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
