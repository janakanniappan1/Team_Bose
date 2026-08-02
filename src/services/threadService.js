import { productSupabase } from '../lib/supabase';
import { chatService } from './chatService';

export const threadService = {
  /**
   * Fetch all conversations for the authenticated user (Supports UUID and username sessions)
   */
  /**
   * Fetch all conversations for the authenticated user by User ID
   */
  getThreads: async (currentUserId, currentUser = null) => {
    const userId = currentUserId || currentUser?.id || currentUser?.username;
    if (!userId) return [];

    try {
      // 1. Fetch threads where user is buyer or seller
      const { data, error } = await productSupabase
        .from('chat_threads')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('last_message_time', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('[threadService] ID threads fetch error:', err);
    }

    // Fallback to chatService getChatThreads for smooth dual-user support
    return await chatService.getChatThreads(currentUser);
  },

  /**
   * Find existing thread or create a new 1-on-1 buyer/seller thread by User ID
   */
  getOrCreateThread: async ({ buyerId, sellerId, productId = null, productDetails = null }) => {
    const bId = String(buyerId || '');
    const sId = String(sellerId || '');

    if (!bId || !sId) throw new Error('buyerId and sellerId are required to start a conversation.');
    
    // Self-chat guard
    if (bId === sId) {
      throw new Error('You cannot chat with yourself.');
    }

    try {
      // 1. Check if thread already exists by User IDs and Product Title
      let query = productSupabase
        .from('chat_threads')
        .select('*')
        .or(`and(buyer_id.eq.${bId},seller_id.eq.${sId}),and(buyer_id.eq.${sId},seller_id.eq.${bId})`);

      if (productDetails?.title) {
        query = query.eq('item_title', productDetails.title);
      }

      const { data: existingThreads, error: searchError } = await query;

      if (!searchError && existingThreads && existingThreads.length > 0) {
        return existingThreads[0];
      }

      // 2. Insert new thread if not found
      const initialMessage = productDetails 
        ? `Hi! Is "${productDetails.title}" still available for purchase?`
        : `Hi! I'd like to start a conversation regarding your listing.`;

      const { data: newThread, error: createError } = await productSupabase
        .from('chat_threads')
        .insert([{
          buyer_id: bId,
          seller_id: sId,
          product_id: productId,
          seller_name: productDetails?.sellerName || 'Seller',
          buyer_name: 'Buyer',
          item_title: productDetails?.title || 'Campus Item',
          item_price: Number(productDetails?.price) || 0,
          item_image: (productDetails?.images && productDetails.images[0]) ? productDetails.images[0] : '',
          last_message: initialMessage,
          last_sender_id: bId,
          last_message_time: new Date().toISOString(),
          buyer_unread_count: 0,
          seller_unread_count: 1
        }])
        .select()
        .single();

      if (createError) throw createError;

      // 3. Create initial message in chat_messages
      await productSupabase.from('chat_messages').insert([{
        thread_id: newThread.id,
        sender_id: bId,
        receiver_id: sId,
        message: initialMessage,
        message_type: productDetails ? 'product_card' : 'text',
        metadata: productDetails ? {
          title: productDetails.title,
          price: productDetails.price,
          image: productDetails.images ? productDetails.images[0] : ''
        } : {}
      }]);

      return newThread;
    } catch (err) {
      console.error('[threadService] Error starting chat:', err);
      throw err;
    }
  },

  /**
   * Reset unread counter when user opens conversation
   */
  resetUnreadCount: async (threadId, currentUserId) => {
    if (!threadId || !currentUserId) return;
    try {
      const { data: thread } = await productSupabase
        .from('chat_threads')
        .select('buyer_id, seller_id')
        .eq('id', threadId)
        .single();

      if (!thread) return;

      const isBuyer = thread.buyer_id === currentUserId;
      const updatePayload = isBuyer ? { buyer_unread_count: 0 } : { seller_unread_count: 0 };

      await productSupabase
        .from('chat_threads')
        .update(updatePayload)
        .eq('id', threadId);
    } catch (err) {
      console.warn('[threadService] Reset unread count error:', err);
    }
  }
};
