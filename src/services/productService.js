import { MOCK_PRODUCTS } from '../data/mockData';

const PRODUCTS_KEY = 'uniswap_stored_products';
const RECENTLY_VIEWED_KEY = 'uniswap_recently_viewed';

const getStoredProducts = () => {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // fallback
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS));
  return MOCK_PRODUCTS;
};

export const productService = {
  /**
   * Fetch all products (LocalStorage backed for persistence)
   */
  async getProducts() {
    return getStoredProducts();
  },

  /**
   * Create a new product (Appends to top of products list)
   */
  async createProduct(newProductData) {
    const products = getStoredProducts();
    const created = {
      ...newProductData,
      id: newProductData.id || `prod-${Date.now()}`,
      postedDate: newProductData.postedDate || 'Just now',
      status: newProductData.status || 'Approved', // Auto-approved for seller active listing display!
      views: newProductData.views || 1,
      likes: 0
    };
    const updated = [created, ...products];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    return created;
  },

  /**
   * Delete a product by ID
   */
  async deleteProduct(productId) {
    const products = getStoredProducts();
    const updated = products.filter((p) => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    return true;
  },

  /**
   * Toggle Mark as Sold / Mark Active status
   */
  async toggleMarkSold(productId) {
    const products = getStoredProducts();
    let updatedProduct = null;
    const updated = products.map((p) => {
      if (p.id === productId) {
        const newStatus = p.status === 'Sold' ? 'Approved' : 'Sold';
        updatedProduct = { ...p, status: newStatus };
        return updatedProduct;
      }
      return p;
    });
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    return updatedProduct;
  },

  /**
   * Update product price
   */
  async updatePrice(productId, newPrice) {
    const products = getStoredProducts();
    let updatedProduct = null;
    const updated = products.map((p) => {
      if (p.id === productId) {
        updatedProduct = { ...p, price: Number(newPrice) };
        return updatedProduct;
      }
      return p;
    });
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    return updatedProduct;
  },

  /**
   * Track product view & add to recently viewed list (max 15 items)
   */
  trackRecentlyViewed(product) {
    if (!product || !product.id) return;
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let list = stored ? JSON.parse(stored) : [];
      list = [product, ...list.filter(p => p.id !== product.id)].slice(0, 15);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
      return list;
    } catch {
      return [];
    }
  },

  /**
   * Get list of recently viewed products
   */
  getRecentlyViewed() {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Submit product abuse report
   */
  async reportProduct(productId, reportData) {
    console.log(`[Report Submitted] Product: ${productId}`, reportData);
    return {
      success: true,
      message: 'Report submitted successfully. Our campus moderation team will review this item within 2 hours.'
    };
  }
};
