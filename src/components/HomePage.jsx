import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  Eye, 
  MapPin, 
  Clock, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  PlusCircle,
  Laptop,
  BookOpen,
  FlaskConical,
  Armchair,
  Bike,
  Home,
  Shirt,
  Trophy,
  PenTool,
  Grid,
  Scale,
  MessageSquare
} from 'lucide-react';
import { CATEGORIES, MOCK_PRODUCTS } from '../data/mockData';
import RecentlyViewedBar from './Recent/RecentlyViewedBar';
import { productService } from '../services/productService';

export default function HomePage({ 
  products = MOCK_PRODUCTS,
  onSelectProduct, 
  onGoToSell, 
  wishlist = [], 
  onToggleWishlist,
  onSelectCategory,
  onStartChat,
  onToggleCompare,
  compareList = []
}) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    setRecentlyViewed(productService.getRecentlyViewed());
  }, []);

  const categoryIcons = {
    Laptop: <Laptop size={24} />,
    BookOpen: <BookOpen size={24} />,
    FlaskConical: <FlaskConical size={24} />,
    Armchair: <Armchair size={24} />,
    Bike: <Bike size={24} />,
    Home: <Home size={24} />,
    Shirt: <Shirt size={24} />,
    Trophy: <Trophy size={24} />,
    PenTool: <PenTool size={24} />,
    Grid: <Grid size={24} />
  };

  const featuredProducts = products.filter((p) => p.featured || p.badge === 'Just Listed');
  const popularProducts = products.filter((p) => p.popular || p.price < 2000);
  const recommendedProducts = products.filter((p) => p.recommended || p.category === 'electronics');

  return (
    <div className="home-page-container animate-fade-in">
      
      {/* 1. Hero Banner Section */}
      <section className="hero-banner-section">
        <div className="container">
          <div className="hero-banner-card card glass-panel">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={16} className="text-secondary" />
                <span>Exclusively for Students & Faculty</span>
              </div>
              
              <h1 className="hero-title">
                Buy and Sell <span className="text-highlight-blue">Within Your Campus</span>
              </h1>
              
              <p className="hero-subheading">
                Trusted marketplace for students and staff. Get affordable textbooks, lab equipment, cycles, and hostel items directly from verified seniors and peers.
              </p>

              <div className="hero-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => onSelectCategory('all')}
                >
                  <span>Browse Marketplace</span>
                </button>
                <button className="btn btn-secondary btn-lg" onClick={onGoToSell}>
                  <PlusCircle size={20} />
                  <span>Sell Product</span>
                </button>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <strong>1,200+</strong>
                  <span>Active Listings</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <strong>100%</strong>
                  <span>Verified Campus Users</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <strong>₹0</strong>
                  <span>Zero Commission Fees</span>
                </div>
              </div>
            </div>

            <div className="hero-illustration">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                alt="Campus Marketplace Trading" 
                className="hero-img"
              />
              <div className="floating-badge badge-deal">
                <Flame size={18} className="text-amber" />
                <div>
                  <strong>CLRS Cormen Algo</strong>
                  <span>₹650 • CS Department</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Categories Strip */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Explore Categories</h2>
              <p className="section-subtitle">Find gear sorted specifically for college life</p>
            </div>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => onSelectCategory(cat.id)}
              >
                <div 
                  className="category-icon-wrapper" 
                  style={{ backgroundColor: cat.bg, color: cat.color }}
                >
                  {categoryIcons[cat.icon]}
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-count">{cat.count} items</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Carousel */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div className="title-with-badge">
              <Sparkles className="text-amber" size={22} />
              <h2 className="section-title">Featured Campus Deals</h2>
            </div>
            <span className="scroll-hint hide-mobile">Scroll horizontally →</span>
          </div>

          <div className="horizontal-scroll">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onStartChat={onStartChat}
                onToggleCompare={onToggleCompare}
                isCompared={compareList.some(p => p.id === product.id)}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Near Your Hostel Section */}
      <section className="popular-section my-4">
        <div className="container">
          <div className="section-header mb-3">
            <div className="title-with-badge">
              <Flame className="text-rose" size={22} />
              <h2 className="section-title">Popular Near Your Hostel</h2>
            </div>
          </div>

          <div className="grid-responsive">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onStartChat={onStartChat}
                onToggleCompare={onToggleCompare}
                isCompared={compareList.some(p => p.id === product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recommended For You AI Section */}
      <section className="recommended-section my-4">
        <div className="container">
          <div className="recommended-card card glass-panel p-4 mb-4">
            <div className="section-header mb-4">
              <div className="title-with-badge">
                <div className="ai-sparkle-icon">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="section-title">Recommended For You</h2>
                  <p className="section-subtitle">Smart AI matches based on your CS Department & B.Tech 3rd Year profile</p>
                </div>
              </div>
            </div>

            <div className="grid-responsive">
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onSelectProduct={onSelectProduct}
                  onStartChat={onStartChat}
                  onToggleCompare={onToggleCompare}
                  isCompared={compareList.some(p => p.id === product.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recently Viewed Products Section */}
      <RecentlyViewedBar
        recentProducts={recentlyViewed}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        onSelectProduct={onSelectProduct}
      />

    </div>
  );
}

{/* Reusable Product Card Component */}
export function ProductCard({ 
  product, 
  isWishlisted, 
  onToggleWishlist, 
  onSelectProduct, 
  onStartChat,
  onToggleCompare,
  isCompared = false,
  compact 
}) {
  const isSold = product.status === 'Sold';
  const isStaffSeller = product.sellerName?.toLowerCase().includes('prof') || product.sellerName?.toLowerCase().includes('dr.');
  const audienceLabel = product.audience === 'students' 
    ? 'Students Only' 
    : product.audience === 'staff' 
    ? 'Staff Only' 
    : 'Students & Staff';

  return (
    <div className={`product-card card ${compact ? 'compact-card' : ''} ${isSold ? 'sold-card' : ''}`}>
      
      {/* Product Image Stage */}
      <div className="product-image-container" onClick={() => onSelectProduct(product)}>
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="product-img" 
          loading="lazy"
        />
        
        {/* Condition Badge */}
        <span className={`badge product-condition-badge ${
          product.condition === 'Brand New' ? 'badge-secondary' :
          product.condition === 'Like New' ? 'badge-primary' : 'badge-slate'
        }`}>
          {product.condition}
        </span>

        {/* SOLD Overlay */}
        {isSold && (
          <div className="sold-overlay-badge animate-scale-up">
            <span>SOLD</span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#64748B'} />
        </button>

        {/* Badge Tag */}
        {product.badge && (
          <span className="product-tag-badge">{product.badge}</span>
        )}
      </div>

      {/* Product Card Body */}
      <div className="product-card-body">
        
        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="product-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
          {product.negotiable && (
            <span className="badge badge-amber negotiable-badge">Negotiable</span>
          )}
        </div>

        <h3 className="product-title" onClick={() => onSelectProduct(product)} title={product.title}>
          {product.title}
        </h3>

        {/* Seller Info & Audience Badges */}
        <div className="product-seller-info flex-wrap">
          <img src={product.sellerAvatar} alt={product.sellerName} className="seller-micro-avatar" />
          <span className="seller-name">{product.sellerName}</span>
          <span className={`badge ${isStaffSeller ? 'badge-secondary' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
            {isStaffSeller ? 'Verified Staff' : 'Verified Student'}
          </span>
          <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>{audienceLabel}</span>
        </div>

        <div className="product-footer-meta border-bottom pb-2 mb-2">
          <span className="meta-item"><MapPin size={13} /> {product.location.split('(')[0]}</span>
          <span className="meta-item"><Clock size={13} /> {product.postedDate}</span>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2 mt-auto">
          <button 
            className="btn btn-outline-primary btn-sm flex-1"
            onClick={() => onSelectProduct(product)}
          >
            <Eye size={14} /> Details
          </button>

          {!isSold && onStartChat && (
            <button 
              className="btn btn-secondary btn-sm icon-circle-btn"
              onClick={() => onStartChat(product)}
              title="Chat with Seller"
            >
              <MessageSquare size={14} />
            </button>
          )}

          {onToggleCompare && (
            <button 
              className={`btn btn-sm icon-circle-btn ${isCompared ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onToggleCompare(product)}
              title="Compare Product"
            >
              <Scale size={14} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
