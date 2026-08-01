const REVIEWS_STORAGE_KEY = 'uniswap_seller_reviews';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    sellerId: 'user-1',
    reviewerName: 'Priya Sharma',
    reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2 days ago',
    comment: 'Punctual seller! The engineering drawing kit was in pristine condition. Highly recommended!'
  },
  {
    id: 'rev-2',
    sellerId: 'user-1',
    reviewerName: 'Rahul Verma',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '1 week ago',
    comment: 'Smooth campus meet-up near Library Foyer. Great price and negotiable!'
  }
];

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
