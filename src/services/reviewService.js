const REVIEWS_STORAGE_KEY = 'uniswap_seller_reviews';

const INITIAL_REVIEWS = [];

export const reviewService = {
  getReviewsForSeller: async (sellerId) => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews = saved ? JSON.parse(saved) : INITIAL_REVIEWS;
      return reviews.filter(r => !sellerId || r.sellerId === sellerId);
    } catch (err) {
      console.error('Error fetching seller reviews:', err);
      return INITIAL_REVIEWS;
    }
  },

  addReview: async (reviewData) => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews = saved ? JSON.parse(saved) : INITIAL_REVIEWS;
      const newReview = {
        id: `rev-${Date.now()}`,
        date: 'Just now',
        ...reviewData
      };
      const updated = [newReview, ...reviews];
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      return newReview;
    } catch (err) {
      console.error('Error adding review:', err);
      throw err;
    }
  }
};
