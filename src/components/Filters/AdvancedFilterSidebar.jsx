import React, { useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Tag, 
  IndianRupee, 
  Check, 
  ShieldCheck, 
  Star, 
  MapPin, 
  GraduationCap,
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { CATEGORIES, DEPARTMENTS, HOSTELS } from '../../data/mockData';

export default function AdvancedFilterSidebar({ 
  filters, 
  setFilters, 
  onResetFilters,
  resultCount = 0,
  isMobileDrawer = false,
  onCloseMobile,
  allProducts = []
}) {

  const categoryCounts = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => {
      let key = String(p.category || 'others').toLowerCase().trim();
      if (key.includes('electr') || key.includes('phone') || key.includes('mobile') || key.includes('gadget')) key = 'electronics';
      else if (key.includes('book') || key.includes('note')) key = 'books';
      else if (key.includes('lab')) key = 'lab';
      else if (key.includes('furnit')) key = 'furniture';
      else if (key.includes('cycl') || key.includes('bike')) key = 'cycles';
      else if (key.includes('hostel')) key = 'hostel';
      else if (key.includes('fash') || key.includes('cloth')) key = 'fashion';
      else if (key.includes('sport')) key = 'sports';
      else if (key.includes('station')) key = 'stationery';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const handleCategoryChange = (catId) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catId ? 'all' : catId
    }));
  };

  const handleConditionToggle = (cond) => {
    setFilters(prev => {
      const current = Array.isArray(prev.condition) ? prev.condition : (prev.condition && prev.condition !== 'All' ? [prev.condition] : []);
      const exists = current.includes(cond);
      const updated = exists ? current.filter(c => c !== cond) : [...current, cond];
      return {
        ...prev,
        condition: updated.length === 0 ? 'All' : updated
      };
    });
  };

  return (
    <aside className={`filter-sidebar-wrapper ${isMobileDrawer ? 'mobile-filter-sheet' : ''}`}>
      
      {/* Filter Sidebar Header */}
      <div className="filter-header-title d-flex align-items-center justify-content-between pb-3 border-bottom mb-4">
        <div className="d-flex align-items-center gap-2">
          <SlidersHorizontal size={20} className="text-primary" />
          <h3 className="filter-main-heading">Filter Products</h3>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            className="btn btn-ghost btn-sm text-muted"
            onClick={onResetFilters}
            title="Reset All Filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          {isMobileDrawer && (
            <button className="btn btn-ghost btn-sm" onClick={onCloseMobile}>
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Selector */}
      <div className="filter-group-box mb-4">
        <h4 className="filter-group-title">
          <Tag size={16} className="text-secondary" />
          <span>Category</span>
        </h4>
        <div className="filter-category-list">
          <button
            className={`filter-category-pill ${filters.category === 'all' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-category-pill ${filters.category === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span className="cat-dot-small" style={{ backgroundColor: cat.color }}></span>
              <span className="flex-1 text-left">{cat.name}</span>
              <span className="cat-count-badge">{categoryCounts[cat.id] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Price Range Slider / Inputs */}
      <div className="filter-group-box mb-4 border-top pt-3">
        <h4 className="filter-group-title">
          <IndianRupee size={16} className="text-amber" />
          <span>Price Range (₹)</span>
        </h4>
        <div className="d-flex align-items-center gap-2 mt-2">
          <input
            type="number"
            className="form-input btn-sm"
            placeholder="Min (₹0)"
            value={filters.minPrice || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
          />
          <span className="text-muted">-</span>
          <input
            type="number"
            className="form-input btn-sm"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          />
        </div>
      </div>

      {/* 3. Condition Checkboxes */}
      <div className="filter-group-box mb-4 border-top pt-3">
        <h4 className="filter-group-title">Condition</h4>
        <div className="filter-checkbox-group mt-2">
          {['Brand New', 'Like New', 'Good'].map((cond) => {
            const isChecked = Array.isArray(filters.condition)
              ? filters.condition.includes(cond)
              : filters.condition === cond;
            return (
              <label key={cond} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleConditionToggle(cond)}
                />
                <span className="custom-checkbox-box"></span>
                <span className="checkbox-text">{cond}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Campus Department Dropdown */}
      <div className="filter-group-box mb-4 border-top pt-3">
        <h4 className="filter-group-title">
          <GraduationCap size={16} className="text-primary" />
          <span>Department</span>
        </h4>
        <select
          className="form-select btn-sm mt-2"
          value={filters.department || 'All'}
          onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((dept, idx) => (
            <option key={idx} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* 5. Hostel Block Selector */}
      <div className="filter-group-box mb-4 border-top pt-3">
        <h4 className="filter-group-title">
          <MapPin size={16} className="text-rose" />
          <span>Hostel / Location</span>
        </h4>
        <select
          className="form-select btn-sm mt-2"
          value={filters.hostel || 'All'}
          onChange={(e) => setFilters(prev => ({ ...prev, hostel: e.target.value }))}
        >
          <option value="All">All Campus Blocks</option>
          {HOSTELS.map((hostel, idx) => (
            <option key={idx} value={hostel}>{hostel}</option>
          ))}
        </select>
      </div>

      {/* 6. Verified & Negotiable Toggles */}
      <div className="filter-group-box mb-4 border-top pt-3">
        <label className="filter-toggle-label mb-2">
          <input
            type="checkbox"
            checked={!!filters.verifiedOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
          />
          <span className="toggle-switch-slider"></span>
          <span className="d-flex align-items-center gap-1 font-weight-600">
            <ShieldCheck size={16} className="text-secondary" /> Verified Sellers Only
          </span>
        </label>

        <label className="filter-toggle-label mt-2">
          <input
            type="checkbox"
            checked={!!filters.negotiableOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, negotiableOnly: e.target.checked }))}
          />
          <span className="toggle-switch-slider"></span>
          <span className="font-weight-600">Price Negotiable Items</span>
        </label>
      </div>

      {/* Result Count Footer */}
      <div className="filter-result-badge text-center p-2 background-slate-100 border-radius-md">
        <span className="text-muted font-weight-600" style={{ fontSize: '0.8rem' }}>
          Matching Results: <strong>{resultCount} items</strong>
        </span>
      </div>

    </aside>
  );
}
