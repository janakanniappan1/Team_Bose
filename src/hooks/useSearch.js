import { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';

export function useSearch(initialQuery = '', initialCategory = 'all') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    setSavedSearches(searchService.getSavedSearches());
  }, []);

  const saveCurrentSearch = () => {
    const updated = searchService.saveSearch({ term: searchQuery, category: selectedCategory });
    setSavedSearches(updated);
  };

  const removeSavedSearch = (id) => {
    const updated = searchService.deleteSavedSearch(id);
    setSavedSearches(updated);
  };

  const renameSavedSearch = (id, newName) => {
    const updated = searchService.renameSavedSearch(id, newName);
    setSavedSearches(updated);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    savedSearches,
    saveCurrentSearch,
    removeSavedSearch,
    renameSavedSearch
  };
}
