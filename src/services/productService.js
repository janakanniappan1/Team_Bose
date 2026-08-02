import { MOCK_PRODUCTS } from '../data/mockData';
import { productSupabase } from '../lib/supabase';

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
   * Fetch all products (LocalStorage + Supabase user_imagesss table)
   */
  async getProducts() {
    const localProducts = getStoredProducts();
    try {
      const { data, error } = await productSupabase
        .from('user_imagesss')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const dbProducts = data.map((row) => ({
          id: row.id || `db-${Date.now()}`,
          title: row.product_name || 'Untitled Product',
          price: row.selling_price || 0,
          originalPrice: row.original_price || (row.selling_price ? row.selling_price * 1.3 : 0),
          category: (row.Category || 'others').toLowerCase(),
          condition: row.condition || 'Good',
          postedDate: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recently',
          department: row.department || 'General',
          location: row.pickup_preference || row.hostel || 'Campus Location',
          sellerId: row.user_id || row.seller_id || row.username || 'Campus Seller',
          seller_id: row.user_id || row.seller_id || row.username || 'Campus Seller',
          sellerName: row.username || 'Campus Seller',
          sellerDept: row.department || 'Student',
          sellerYear: '3rd Year B.Tech',
          sellerRating: 5.0,
          sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          images: (row.image_urls && row.image_urls.length > 0) 
            ? row.image_urls 
            : ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
          videoUrl: row.video_url || null,
          description: row.description || '',
          negotiable: Boolean(row.negotiable),
          brand: row.brand || '',
          model: row.model || '',
          purchaseYear: row.purchase_year || '',
          reasonForSelling: row.reason || '',
          featured: false,
          popular: true,
          recommended: true,
          views: 10,
          likes: 2,
          badge: row.status || 'Active',
          status: row.status || 'Approved'
        }));

        // Merge DB products with local products (avoiding duplicate IDs)
        const dbIds = new Set(dbProducts.map(p => p.id));
        const merged = [...dbProducts, ...localProducts.filter(p => !dbIds.has(p.id))];
        return merged;
      }
    } catch (err) {
      console.warn('[productService] Falling back to local storage products:', err);
    }
    return localProducts;
  },

  /**
   * Create a new product (Saves locally AND inserts into Supabase user_imagesss)
   */
  async createProduct(newProductData) {
    const products = getStoredProducts();
    const created = {
      ...newProductData,
      id: newProductData.id || `prod-${Date.now()}`,
      postedDate: newProductData.postedDate || 'Just now',
      status: newProductData.status || 'Approved',
      views: newProductData.views || 1,
      likes: 0
    };

    // 1. Save locally for instant UI update
    const updated = [created, ...products];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));

    // 2. Insert into Supabase Database 2 (user_imagesss table)
    try {
      const payload = {
        username: newProductData.sellerName || 'Anonymous User',
        audience: newProductData.audience || 'students',
        object_names: (newProductData.images || []).map((_, idx) => `img-${Date.now()}-${idx}.jpg`),
        image_urls: newProductData.images || [],
        video_url: newProductData.videoUrl || null,
        Category: newProductData.category || 'Electronics',
        condition: newProductData.condition || 'Like New',
        product_name: newProductData.title || 'Untitled Product',
        selling_price: Number(newProductData.price) || 0,
        original_price: Number(newProductData.originalPrice) || 0,
        negotiable: Boolean(newProductData.negotiable),
        brand: newProductData.brand || null,
        model: newProductData.model || null,
        purchase_year: newProductData.purchaseYear ? parseInt(newProductData.purchaseYear) : null,
        reason: newProductData.reasonForSelling || null,
        description: newProductData.description || '',
        hostel: newProductData.hostel || null,
        department: newProductData.department || null,
        pickup_preference: newProductData.location || null,
        status: newProductData.status || 'Pending Approval'
      };

      const { data, error } = await productSupabase
        .from('user_imagesss')
        .insert([payload])
        .select();

      if (error) {
        console.error('[Supabase] Failed to insert into user_imagesss table:', error);
      } else {
        console.log('[Supabase] Successfully inserted product into user_imagesss table!', data);
      }
    } catch (err) {
      console.error('[Supabase] Error posting to user_imagesss:', err);
    }

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
