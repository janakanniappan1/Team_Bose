import { MOCK_USER } from '../data/mockData';

const OFFERS_KEY = 'uniswap_stored_offers';

const DEFAULT_OFFERS = {
  sent: [],
  received: []
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
      resolve([]);
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
