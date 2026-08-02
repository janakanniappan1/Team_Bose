import { productService } from './productService';

const SAVED_SEARCHES_KEY = 'uniswap_saved_searches';

export const searchService = {
  getLiveSuggestions: async (query, productsList = null) => {
    if (!query || query.trim().length === 0) {
      return { suggestions: [], matchingProducts: [] };
    }

    const q = query.toLowerCase().trim();

    const popularTerms = [
      { term: 'Laptop', category: 'electronics', popular: true },
      { term: 'Calculator', category: 'electronics', popular: true },
      { term: 'Books', category: 'books', popular: true },
      { term: 'Cycle', category: 'cycles', popular: true },
      { term: 'Study Table', category: 'furniture', popular: false },
      { term: 'Lab Coat', category: 'lab', popular: false },
      { term: 'Badminton Racket', category: 'sports', popular: true }
    ];

    const matchedTerms = popularTerms.filter(t => t.term.toLowerCase().includes(q));

    const products = productsList || await productService.getProducts();

    const matchedProducts = products.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.department && p.department.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    ).slice(0, 4);

    return {
      suggestions: matchedTerms,
      matchingProducts: matchedProducts
    };
  },

  getSavedSearches: () => {
    try {
      const saved = localStorage.getItem(SAVED_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error reading saved searches:', err);
      return [];
    }
  },

  saveSearch: (searchObj) => {
    try {
      const searches = searchService.getSavedSearches();
      const newEntry = {
        id: `s-${Date.now()}`,
        term: searchObj.term || 'All Products',
        category: searchObj.category || 'all',
        maxPrice: searchObj.maxPrice || 10000,
        date: 'Just now'
      };
      const updated = [newEntry, ...searches.filter(s => s.term !== searchObj.term)];
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('Error saving search:', err);
      return [];
    }
  },

  deleteSavedSearch: (id) => {
    try {
      const searches = searchService.getSavedSearches();
      const updated = searches.filter(s => s.id !== id);
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('Error deleting saved search:', err);
      return [];
    }
  },

  renameSavedSearch: (id, newName) => {
    try {
      const searches = searchService.getSavedSearches();
      const updated = searches.map(s => s.id === id ? { ...s, term: newName } : s);
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('Error renaming saved search:', err);
      return [];
    }
  }
};
