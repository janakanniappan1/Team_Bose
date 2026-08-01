import React from 'react';
import { Search, Heart, MessageSquare, Bell, Package, Scale, Sparkles } from 'lucide-react';

export default function EmptyState({ 
  type = 'search', 
  title, 
  message, 
  actionLabel, 
  onAction 
}) {
  const getIcon = () => {
    switch (type) {
      case 'wishlist':
        return <Heart size={54} className="text-muted mb-3" />;
      case 'search':
        return <Search size={54} className="text-muted mb-3" />;
      case 'messages':
        return <MessageSquare size={54} className="text-muted mb-3" />;
      case 'notifications':
        return <Bell size={54} className="text-muted mb-3" />;
      case 'listings':
        return <Package size={54} className="text-muted mb-3" />;
      case 'compare':
        return <Scale size={54} className="text-muted mb-3" />;
      default:
        return <Sparkles size={54} className="text-muted mb-3" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'wishlist': return 'Your Wishlist is Empty';
      case 'search': return 'No Matching Products Found';
      case 'messages': return 'No Conversations Yet';
      case 'notifications': return 'No Alerts at the Moment';
      case 'listings': return 'You Haven’t Listed Any Products';
      case 'compare': return 'No Items Selected for Comparison';
      default: return 'No Content Found';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'wishlist': return 'Explore campus listings and tap the heart icon to save your favorite books, electronics, and hostel items!';
      case 'search': return 'Try tweaking your search keywords, clearing price range filters, or switching to another category.';
      case 'messages': return 'Click on any product listing and tap "Chat with Seller" to start a campus trade discussion!';
      case 'notifications': return 'We will notify you here when buyers contact you or wishlisted prices drop.';
      case 'listings': return 'Have old textbooks, calculators, or hostel gear? Post your first item in under 2 minutes!';
      case 'compare': return 'Select up to 3 products from the marketplace grid to compare specifications and prices side-by-side.';
      default: return 'Check back later for fresh updates.';
    }
  };

  return (
    <div className="empty-state-card card text-center p-5 my-4 animate-fade-in glass-panel">
      <div className="empty-state-icon-wrap mx-auto">
        {getIcon()}
      </div>
      <h3 className="empty-state-title mt-2">{title || getDefaultTitle()}</h3>
      <p className="empty-state-desc text-muted max-w-md mx-auto mt-2">
        {message || getDefaultMessage()}
      </p>

      {actionLabel && onAction && (
        <button className="btn btn-primary mt-4" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
