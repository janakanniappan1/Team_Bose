import { MOCK_PRODUCTS } from '../data/mockData';

const SAVED_SEARCHES_KEY = 'uniswap_saved_searches';

export const searchService = {
  getLiveSuggestions: async (query) => {
    if (!query || query.trim().length === 0) {
      return { suggestions: [], matchingProducts: [] };
    }

    const q = query.toLowerCase().trim();

    const popularTerms = [
      { term: 'Laptop', category: 'electronics', popular: true },
      { term: 'Calculator FX-991EX', category: 'calculators', popular: true },
      { term: 'Engineering Drawing Board', category: 'stationery', popular: false },
      { term: 'CLRS Cormen Algorithms', category: 'textbooks', popular: true },
      { term: 'Gear Bicycle', category: 'cycles', popular: true },
      { term: 'Hostel Study Table', category: 'furniture', popular: false },
      { term: 'Lab Coat Medium', category: 'lab-equipment', popular: false },
      { term: 'Badminton Racket Yonex', category: 'sports', popular: true }
    ];

    const matchedTerms = popularTerms.filter(t => t.term.toLowerCase().includes(q));

    const matchedProducts = MOCK_PRODUCTS.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      suggestions: matchedTerms,
      matchingProducts: matchedProducts
    };
  },

  getSavedSearches: () => {
    try {
      const saved = localStorage.getItem(SAVED_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [
        { id: 's1', term: 'Calculator FX-991EX', category: 'calculators', date: '2 days ago' },
        { id: 's2', term: 'Engineering Chemistry Book', category: 'textbooks', date: '5 days ago' }
      ];
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
