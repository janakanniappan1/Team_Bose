import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  Bookmark, 
  Check, 
  Grid, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { ProductCard } from '../HomePage';
import AdvancedFilterSidebar from '../Filters/AdvancedFilterSidebar';
import EmptyState from '../EmptyState/EmptyState';
import RecentlyViewedBar from '../Recent/RecentlyViewedBar';
import { filterService } from '../../services/filterService';
import { searchService } from '../../services/searchService';
import { productService } from '../../services/productService';

export default function SearchResultsPage({ 
  products = [],
  searchQuery = '',
  setSearchQuery,
  selectedCategory = 'all',
  setSelectedCategory,
  onSelectProduct,
  wishlist = [],
  onToggleWishlist,
  onStartChat,
  onToggleCompare,
  compareList = [],
  onGoToHome
}) {
  const [filters, setFilters] = useState({
    category: selectedCategory,
    searchQuery: searchQuery,
    minPrice: 0,
    maxPrice: 10000,
    condition: 'All',
    department: 'All',
    hostel: 'All',
    verifiedOnly: false,
    negotiableOnly: false,
    minRating: 0
  });

  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false);
  const [isSavedSearch, setIsSavedSearch] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Sync props when user performs new search or category selection
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: selectedCategory,
      searchQuery: searchQuery
    }));
  }, [selectedCategory, searchQuery]);

  // Load recently viewed
  useEffect(() => {
    setRecentlyViewed(productService.getRecentlyViewed());
  }, []);

  // Filter & Sort
  const rawFiltered = filterService.filterProducts(products, filters);
  const filteredProducts = filterService.sortProducts(rawFiltered, sortBy);

  const handleResetAllFilters = () => {
    setFilters({
      category: 'all',
      searchQuery: '',
      minPrice: 0,
      maxPrice: 10000,
      condition: 'All',
      department: 'All',
      hostel: 'All',
      verifiedOnly: false,
      negotiableOnly: false,
      minRating: 0
    });
    if (setSelectedCategory) setSelectedCategory('all');
    if (setSearchQuery) setSearchQuery('');
  };

  const handleSaveSearch = () => {
    searchService.saveSearch({
      term: searchQuery || selectedCategory,
      category: filters.category,
      maxPrice: filters.maxPrice
    });
    setIsSavedSearch(true);
    setTimeout(() => setIsSavedSearch(false), 2500);
  };

  const searchTitleText = searchQuery || (selectedCategory !== 'all' ? selectedCategory : 'All Products');

  return (
    <div className="search-results-page-container animate-fade-in py-4">
      <div className="container">
        
        {/* Amazon-style Top Results Banner Header */}
        <div className="amazon-search-header-bar d-flex align-items-center justify-content-between flex-wrap gap-2 pb-3 mb-3 border-bottom">
          <div className="amazon-result-meta">
            <span className="search-result-count-label text-slate-700">
              1-{filteredProducts.length} of over {products.length * 15} results for{' '}
              <strong className="text-primary font-weight-bold" style={{ fontSize: '1.15rem' }}>
                "{searchTitleText}"
              </strong>
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button 
              className={`btn btn-sm ${isSavedSearch ? 'btn-secondary' : 'btn-outline'}`}
              onClick={handleSaveSearch}
            >
              {isSavedSearch ? <Check size={14} /> : <Bookmark size={14} />}
              <span>{isSavedSearch ? 'Search Saved' : 'Save Search'}</span>
            </button>

            <button className="btn btn-ghost btn-sm text-muted" onClick={onGoToHome}>
              <ArrowLeft size={14} /> Back to Home
            </button>
          </div>
        </div>

        {/* Search Page Grid Layout (Amazon/OLX Split Filter Sidebar + Product Grid) */}
        <div className="marketplace-layout-grid">
          
          {/* Desktop Left Filter Sidebar */}
          <div className="hide-mobile">
            <AdvancedFilterSidebar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetAllFilters}
              resultCount={filteredProducts.length}
            />
          </div>

          {/* Right Main Grid Section */}
          <div className="marketplace-main-content">
            
            {/* Header Control Strip */}
            <div className="section-header border-bottom pb-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h2 className="section-title" style={{ fontSize: '1.35rem' }}>
                  Results
                </h2>
                <p className="section-subtitle text-muted">
                  Check each product page for student contact options, price details, and hostel pickup location.
                </p>
              </div>

              <div className="d-flex align-items-center gap-3">
                {/* Mobile Filter Button */}
                <button 
                  className="btn btn-outline btn-sm show-mobile"
                  onClick={() => setShowMobileFilterDrawer(true)}
                >
                  <Filter size={16} />
                  <span>Filter ({filteredProducts.length})</span>
                </button>

                {/* Sort Dropdown Selector */}
                <div className="sort-dropdown-box d-flex align-items-center gap-2">
                  <ArrowUpDown size={15} className="text-muted" />
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>Sort by:</span>
                  <select
                    className="form-select btn-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="popular">Avg. Customer Review</option>
                    <option value="oldest">Newest Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {(filters.category !== 'all' || filters.condition !== 'All' || filters.verifiedOnly || filters.searchQuery) && (
              <div className="applied-filter-chips d-flex align-items-center gap-2 flex-wrap mb-4">
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Active Filters:</span>
                {filters.category !== 'all' && (
                  <span className="badge badge-primary">
                    Category: {filters.category}
                    <button onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}>×</button>
                  </span>
                )}
                {filters.searchQuery && (
                  <span className="badge badge-amber">
                    Keyword: "{filters.searchQuery}"
                    <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}>×</button>
                  </span>
                )}
                {filters.verifiedOnly && (
                  <span className="badge badge-secondary">
                    Verified Sellers Only
                    <button onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: false }))}>×</button>
                  </span>
                )}
                <button className="btn btn-ghost btn-sm text-rose" onClick={handleResetAllFilters}>
                  <RotateCcw size={12} /> Clear All
                </button>
              </div>
            )}

            {/* Products Grid or Empty State */}
            {filteredProducts.length > 0 ? (
              <div className="grid-responsive">
                {filteredProducts.map((product) => (
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
            ) : (
              <EmptyState
                type="search"
                title="No Products Match Your Search"
                message={`We couldn't find any campus items matching "${searchQuery || filters.category}".`}
                actionLabel="Clear Filters & Return Home"
                onAction={handleResetAllFilters}
              />
            )}

          </div>

        </div>

        {/* Recently Viewed Bar */}
        <RecentlyViewedBar
          recentProducts={recentlyViewed}
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          onSelectProduct={onSelectProduct}
        />

      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilterDrawer && (
        <div className="modal-overlay" onClick={() => setShowMobileFilterDrawer(false)}>
          <div className="modal-content p-4" onClick={(e) => e.stopPropagation()}>
            <AdvancedFilterSidebar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetAllFilters}
              resultCount={filteredProducts.length}
              isMobileDrawer={true}
              onCloseMobile={() => setShowMobileFilterDrawer(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
