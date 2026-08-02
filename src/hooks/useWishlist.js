import { useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist([]);
    if (wishlistService && typeof wishlistService.clearWishlist === 'function') {
      wishlistService.clearWishlist();
    }
  }, []);

  const toggleWishlist = (productId) => {
    const { wishlist: updated, isAdded } = wishlistService.toggleWishlist(productId);
    setWishlist(updated);
    return { wishlist: updated, isAdded };
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlistService.removeProductFromWishlist(productId);
    setWishlist(updated);
    return updated;
  };

  const isWishlisted = (productId) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    isWishlisted,
    removeFromWishlist
  };
}
