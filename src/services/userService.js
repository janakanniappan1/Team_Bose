import { MOCK_USER } from '../data/mockData';

const OFFERS_KEY = 'uniswap_stored_offers';

const DEFAULT_OFFERS = {
  sent: [
    {
      id: 'off-1',
      productTitle: 'Casio fx-991EX Calculator',
      listedPrice: 950,
      offeredPrice: 850,
      sellerName: 'Ananya Sharma',
      date: '30 Jan 2026',
      status: 'Accepted'
    },
    {
      id: 'off-2',
      productTitle: 'Hero Sprint 24T Bicycle',
      listedPrice: 3800,
      offeredPrice: 3200,
      sellerName: 'Rohan Verma',
      date: '28 Jan 2026',
      status: 'Counter Offered',
      counterPrice: 3400
    }
  ],
  received: [
    {
      id: 'off-3',
      productTitle: 'Dell UltraSharp 24" Monitor',
      listedPrice: 8500,
      offeredPrice: 7800,
      buyerName: 'Vikram Singh',
      date: '31 Jan 2026',
      status: 'Pending'
    }
  ]
};

const getStoredOffers = () => {
  try {
    const stored = localStorage.getItem(OFFERS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_OFFERS;
  } catch {
    return DEFAULT_OFFERS;
  }
};

export const getUserProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem('uniswap_user');
      resolve(stored ? JSON.parse(stored) : MOCK_USER);
    }, 150);
  });
};

export const updateProfile = async (updatedData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const current = localStorage.getItem('uniswap_user') 
        ? JSON.parse(localStorage.getItem('uniswap_user')) 
        : MOCK_USER;
      const updated = { ...current, ...updatedData };
      localStorage.setItem('uniswap_user', JSON.stringify(updated));
      resolve(updated);
    }, 200);
  });
};

export const getPurchaseHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'pur-1',
          title: 'MacBook Air M1 (2020) 256GB SSD',
          price: 48500,
          purchaseDate: '24 Jan 2026',
          sellerName: 'Dr. Ramesh Kumar',
          sellerRole: 'Verified Faculty',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
          status: 'Completed',
          hasReviewed: true,
          ratingGiven: 5
        },
        {
          id: 'pur-2',
          title: 'Engineering Mathematics Vol 1 & 2 Textbook',
          price: 450,
          purchaseDate: '12 Dec 2025',
          sellerName: 'Priya Patel',
          sellerRole: 'Verified Student',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          status: 'Completed',
          hasReviewed: false
        }
      ]);
    }, 150);
  });
};

export const getOffers = async () => {
  return getStoredOffers();
};

export const addOffer = async (newOffer) => {
  const currentOffers = getStoredOffers();
  const offerItem = {
    id: `off-${Date.now()}`,
    productTitle: newOffer.productTitle || 'Campus Product',
    listedPrice: Number(newOffer.listedPrice) || 0,
    offeredPrice: Number(newOffer.offeredPrice) || Number(newOffer.amount) || 0,
    sellerName: newOffer.sellerName || 'Campus Seller',
    date: 'Just now',
    status: 'Pending'
  };

  const updatedSent = [offerItem, ...currentOffers.sent];
  const updatedAll = { ...currentOffers, sent: updatedSent };
  localStorage.setItem(OFFERS_KEY, JSON.stringify(updatedAll));
  return offerItem;
};

export const getHelpFAQs = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          q: 'How does campus verification work on UniSwap?',
          a: 'UniSwap verifies users through their official campus email ID (@university.edu) and student ID card proof upon registration.'
        },
        {
          q: 'Where do buyers and sellers meet for item exchanges?',
          a: 'We recommend designated safe campus spots such as the Central Library Foyer, SAC Canteen, or Main Gate Security Desk during daylight hours.'
        },
        {
          q: 'Are there any platform listing fees?',
          a: 'No! UniSwap is 100% free for all students and faculty staff.'
        }
      ]);
    }, 150);
  });
};
