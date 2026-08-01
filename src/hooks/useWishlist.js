import { useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => wishlistService.getWishlist());

  useEffect(() => {
    setWishlist(wishlistService.getWishlist());
  }, []);

  const toggleWishlist = (productId) => {
    const { wishlist: updated, isAdded } = wishlistService.toggleWishlist(productId);
    setWishlist(updated);
    return { wishlist: updated, isAdded };
  };

  const isWishlisted = (productId) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    isWishlisted
  };
}
