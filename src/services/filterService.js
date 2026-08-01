// Abstracted Filter & Sort Service - Real-Time Ready

export const filterService = {
  /**
   * Filter product list based on advanced multi-criteria filter state
   */
  filterProducts(products, filters) {
    if (!products) return [];

    return products.filter((product) => {
      // 1. Search Query Keyword
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        const matchesDept = product.department?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDept) return false;
      }

      // 2. Category Filter
      if (filters.category && filters.category !== 'all') {
        if (product.category !== filters.category) return false;
      }

      // 3. Price Range Filter
      if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice > 0) {
        if (product.price < filters.minPrice) return false;
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice > 0) {
        if (product.price > filters.maxPrice) return false;
      }

      // 4. Condition Filter (Array or Single string)
      if (filters.condition && filters.condition !== 'All') {
        if (Array.isArray(filters.condition) && filters.condition.length > 0) {
          if (!filters.condition.includes(product.condition)) return false;
        } else if (typeof filters.condition === 'string') {
          if (product.condition !== filters.condition) return false;
        }
      }

      // 5. Department Filter
      if (filters.department && filters.department !== 'All') {
        if (!product.department?.toLowerCase().includes(filters.department.toLowerCase())) return false;
      }

      // 6. Hostel / Location Filter
      if (filters.hostel && filters.hostel !== 'All') {
        if (!product.location?.toLowerCase().includes(filters.hostel.toLowerCase())) return false;
      }

      // 7. Verified Seller Filter
      if (filters.verifiedOnly) {
        if (!product.sellerRating || product.sellerRating < 4.5) return false;
      }

      // 8. Negotiable Filter
      if (filters.negotiableOnly) {
        if (!product.negotiable) return false;
      }

      // 9. Seller Rating Filter
      if (filters.minRating && filters.minRating > 0) {
        if ((product.sellerRating || 0) < filters.minRating) return false;
      }

      return true;
    });
  },

  /**
   * Sort products by selected option
   */
  sortProducts(products, sortBy) {
    if (!products) return [];
    const list = [...products];

    switch (sortBy) {
      case 'newest':
        return list.sort((a, b) => (b.id > a.id ? 1 : -1));
      case 'oldest':
        return list.sort((a, b) => (a.id > b.id ? 1 : -1));
      case 'price_asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return list.sort((a, b) => b.price - a.price);
      case 'popular':
        return list.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'most_viewed':
        return list.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'rating':
        return list.sort((a, b) => (b.sellerRating || 0) - (a.sellerRating || 0));
      default:
        return list;
    }
  }
};
