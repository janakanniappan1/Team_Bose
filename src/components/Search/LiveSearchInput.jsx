import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Flame, Sparkles, Tag, ArrowRight, Clock } from 'lucide-react';
import { searchService } from '../../services/searchService';

export default function LiveSearchInput({ 
  searchQuery = '', 
  onSelectSuggestion,
  onSearchSubmit
}) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Sync prop changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Fetch live suggestions on input change
  useEffect(() => {
    let isMounted = true;
    if (inputValue && inputValue.trim().length > 0) {
      searchService.getLiveSuggestions(inputValue).then(({ suggestions, matchingProducts }) => {
        if (isMounted) {
          setSuggestions(suggestions);
          setMatchingProducts(matchingProducts);
          setShowDropdown(true);
        }
      });
    } else {
      setSuggestions([]);
      setMatchingProducts([]);
      setShowDropdown(false);
    }
    return () => { isMounted = false; };
  }, [inputValue]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (onSearchSubmit) {
      onSearchSubmit(inputValue);
    }
  };

  const handleSuggestionClick = (term, product) => {
    setInputValue(term);
    setShowDropdown(false);
    if (onSelectSuggestion) {
      onSelectSuggestion(term, product);
    } else if (onSearchSubmit) {
      onSearchSubmit(term);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query || !text) return text || '';
    const parts = String(text).split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="search-highlight">{part}</mark>
          ) : part
        )}
      </span>
    );
  };

  return (
    <div className="live-search-container" ref={dropdownRef}>
      <form className="navbar-search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search books, electronics, cycles, calculators..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => inputValue && setShowDropdown(true)}
          />
          
          {inputValue && (
            <button 
              type="button" 
              className="clear-search-btn" 
              onClick={() => { setInputValue(''); setShowDropdown(false); }}
            >
              <X size={16} />
            </button>
          )}

          <button 
            type="submit"
            className="search-submit-icon-btn"
            title="Search Products"
          >
            <Search className="search-icon" size={18} />
          </button>
        </div>
      </form>

      {/* Floating Suggestions Dropdown */}
      {showDropdown && (suggestions.length > 0 || matchingProducts.length > 0) && (
        <div className="search-suggestions-dropdown card glass-panel animate-slide-down">
          
          {/* Keyword Suggestions Section */}
          {suggestions.length > 0 && (
            <div className="suggestion-section">
              <div className="suggestion-section-title">
                <Sparkles size={14} className="text-secondary" />
                <span>Popular Search Terms</span>
              </div>
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item.term)}
                >
                  <Search size={14} className="text-muted" />
                  <span className="suggestion-text">
                    {highlightMatch(item.term, inputValue)}
                  </span>
                  {item.popular && (
                    <span className="badge badge-amber btn-sm">
                      <Flame size={10} /> Popular
                    </span>
                  )}
                  <span className="badge badge-slate text-uppercase">{item.category}</span>
                </div>
              ))}
            </div>
          )}

          {/* Matching Products Section */}
          {matchingProducts.length > 0 && (
            <div className="suggestion-section border-top pt-2 mt-2">
              <div className="suggestion-section-title">
                <Tag size={14} className="text-primary" />
                <span>Matching Campus Items</span>
              </div>
              {matchingProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="suggestion-product-item"
                  onClick={() => handleSuggestionClick(prod.title, prod)}
                >
                  <img src={prod.images[0]} alt={prod.title} className="suggestion-thumb" />
                  <div className="flex-1 min-w-0">
                    <h5 className="suggestion-prod-title">
                      {highlightMatch(prod.title, inputValue)}
                    </h5>
                    <span className="suggestion-prod-sub">{prod.department} • {prod.condition}</span>
                  </div>
                  <strong className="text-primary">₹{prod.price}</strong>
                </div>
              ))}
            </div>
          )}

          <button 
            type="button"
            className="suggestion-footer-btn w-full text-center py-2"
            onClick={handleSubmit}
          >
            <span>See all results for "{inputValue}"</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
