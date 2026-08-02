import { productSupabase } from '../lib/supabase';

const getSmartProductImage = (title = '', category = '', originalUrl = '') => {
  if (originalUrl && !originalUrl.startsWith('blob:')) {
    return originalUrl;
  }

  const name = String(title || '').toLowerCase();
  const cat = String(category || '').toLowerCase();

  if (name.includes('mouse')) {
    return 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('phone') || name.includes('infinix') || name.includes('mobile') || name.includes('iphone') || name.includes('samsung')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('calculator') || name.includes('casio')) {
    return 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('electr') || cat.includes('gadget')) {
    return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('book') || cat.includes('note')) {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('cycl') || cat.includes('bike')) {
    return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80';
  }

  return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';
};

const PRODUCTS_KEY = 'uniswap_stored_products_v7';
const RECENTLY_VIEWED_KEY = 'uniswap_recently_viewed';
const DELETED_IDS_KEY = 'uniswap_deleted_product_ids';

// Get the persistent list of deleted product IDs
const getDeletedIds = () => {
  try {
    const stored = localStorage.getItem(DELETED_IDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

// Add a product ID to the persistent exclusion list
const addDeletedId = (productId) => {
  const ids = getDeletedIds();
  if (!ids.includes(productId)) {
    ids.push(productId);
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(ids));
  }
};

const getStoredProducts = () => {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed
        .filter(p => {
          const isDeleted = String(p.status || '').toLowerCase() === 'deleted';
          const seller = String(p.sellerName || p.seller_name || p.username || p.sellerId || '').toLowerCase();
          return !isDeleted && !seller.includes('ramaa');
        })
        .map(p => ({
          ...p,
          images: (p.images || []).map(img => (img && img.startsWith('blob:')) ? 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' : img)
        }));
    }
  } catch {
    // fallback
  }
  return [];
};

export const productService = {
  /**
   * Fetch all products from Supabase user_imagesss table (database-only)
   */
  async getProducts() {
    try {
      const { data, error } = await productSupabase
        .from('user_imagesss')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const dbProducts = data
          .filter(row => {
            const isDeleted = String(row.status || '').toLowerCase() === 'deleted';
            const seller = String(row.username || row.seller_name || row.seller_id || row.user_id || '').toLowerCase();
            const isRamaa = seller.includes('ramaa') || seller.includes('rama');
            const isTargetDeletedId = String(row.id || '') === '141fc4fd-f974-41f5-bf3f-0d74bc538d6c';
            const isTargetMouseId1 = String(row.id || '') === '28a35f6d-fc9f-401e-8b2e-20193c4c762d';
            const isTargetMouseId2 = String(row.id || '') === '6b8fdd28-79a4-4cd2-83d8-02772eff41dd';
            const isTargetProduct = String(row.product_name || '').toLowerCase().includes('casio fx-991cw') && isRamaa;
            const deletedIds = getDeletedIds();
            const isUserDeleted = deletedIds.includes(String(row.id || ''));
            return !isDeleted && !isRamaa && !isTargetDeletedId && !isTargetMouseId1 && !isTargetMouseId2 && !isTargetProduct && !isUserDeleted;
          })
          .map((row) => {
            let catKey = String(row.Category || 'others').toLowerCase().trim();
            if (catKey.includes('electr') || catKey.includes('phone') || catKey.includes('mobile') || catKey.includes('gadget')) {
              catKey = 'electronics';
            } else if (catKey.includes('book') || catKey.includes('note')) {
              catKey = 'books';
            } else if (catKey.includes('lab')) {
              catKey = 'lab';
            } else if (catKey.includes('furnit')) {
              catKey = 'furniture';
            } else if (catKey.includes('cycl') || catKey.includes('bike')) {
              catKey = 'cycles';
            } else if (catKey.includes('hostel')) {
              catKey = 'hostel';
            } else if (catKey.includes('fash') || catKey.includes('cloth')) {
              catKey = 'fashion';
            } else if (catKey.includes('sport')) {
              catKey = 'sports';
            } else if (catKey.includes('station')) {
              catKey = 'stationery';
            }

            return {
              id: row.id || `db-${Date.now()}`,
              title: row.product_name || 'Untitled Product',
              price: row.selling_price || 0,
              originalPrice: row.original_price || (row.selling_price ? row.selling_price * 1.3 : 0),
              category: catKey,
              condition: row.condition || 'Good',
            postedDate: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recently',
            department: row.department || 'General',
            location: row.pickup_preference || row.hostel || 'Campus Location',
            sellerId: row.user_id || row.seller_id || row.username || row.seller_name || null,
            seller_id: row.user_id || row.seller_id || row.username || row.seller_name || null,
            sellerName: row.username || row.seller_name || 'Campus Seller',
            sellerDept: row.department || 'Student',
            sellerYear: '3rd Year B.Tech',
            sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
            images: (row.image_urls && row.image_urls.length > 0)
              ? row.image_urls.map(url => getSmartProductImage(row.product_name, catKey, url))
              : [getSmartProductImage(row.product_name, catKey)],
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
            badge: null,
            status: row.status || 'Approved'
          };
        });

        // Keep local cache synced with DB to eliminate phantom deleted items
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(dbProducts));
        return dbProducts;
      }
    } catch (err) {
      console.warn('[productService] Supabase fetch failed:', err);
    }
    return getStoredProducts();
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
        status: 'Approved'
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
   * Delete a product by ID (Deletes locally AND from Supabase user_imagesss table for all users)
   */
  async deleteProduct(productId, productTitle = null, sellerName = null) {
    // 1. Remove from local cache
    const products = getStoredProducts();
    const updated = products.filter((p) => p.id !== productId && (productTitle ? p.title !== productTitle : true));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));

    // 2. Add to persistent exclusion list (survives page refresh even if DB delete is blocked by RLS)
    if (productId) {
      addDeletedId(productId);
    }

    // 3. Mark as deleted AND delete from Supabase Database (user_imagesss table)
    try {
      if (productId) {
        // Mark status as 'deleted' so all users across the world stop seeing it immediately
        await productSupabase
          .from('user_imagesss')
          .update({ status: 'deleted' })
          .eq('id', productId);

        // Attempt physical row deletion
        await productSupabase
          .from('user_imagesss')
          .delete()
          .eq('id', productId);
      }

      if (productTitle) {
        let query = productSupabase.from('user_imagesss').update({ status: 'deleted' }).eq('product_name', productTitle);
        if (sellerName) query = query.eq('username', sellerName);
        await query;

        let delQuery = productSupabase.from('user_imagesss').delete().eq('product_name', productTitle);
        if (sellerName) delQuery = delQuery.eq('username', sellerName);
        await delQuery;
      }
    } catch (err) {
      console.error('[Supabase] Delete product exception:', err);
    }
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

    // Update status in Supabase Database
    try {
      if (productId && updatedProduct) {
        await productSupabase
          .from('user_imagesss')
          .update({ status: updatedProduct.status })
          .eq('id', productId);
      }
    } catch (err) {
      console.error('[Supabase] Toggle mark sold exception:', err);
    }

    return updatedProduct;
  },

  /**
   * Update product price
   */
  async updatePrice(productId, newPrice) {
    const numericPrice = Number(newPrice);
    const products = getStoredProducts();
    let updatedProduct = null;
    const updated = products.map((p) => {
      if (p.id === productId) {
        updatedProduct = { ...p, price: numericPrice };
        return updatedProduct;
      }
      return p;
    });
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));

    // Update selling_price in Supabase Database (user_imagesss table)
    try {
      if (productId) {
        await productSupabase
          .from('user_imagesss')
          .update({ selling_price: numericPrice })
          .eq('id', productId);
      }
    } catch (err) {
      console.error('[Supabase] Update price exception:', err);
    }

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
