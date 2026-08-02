// Abstracted Wishlist Service - Real-Time Ready (Firebase / Backend Placeholder)

const WISHLIST_KEY = 'uniswap_user_wishlist';

export const wishlistService = {
  /**
   * Get user's saved wishlist product IDs
   */
  getWishlist() {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Toggle wishlist status for a product ID
   */
  toggleWishlist(productId) {
    const wishlist = this.getWishlist();
    let updated;
    let isAdded = false;

    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
      isAdded = true;
    }

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    return { wishlist: updated, isAdded };
  }
};
