import { productSupabase } from '../lib/supabase';
import { chatService } from './chatService';

export const threadService = {
  /**
   * Fetch all conversations for the authenticated user (Supports UUID and username sessions)
   */
  getThreads: async (currentUserId, currentUser = null) => {
    try {
      if (currentUserId && (currentUserId.includes('-') || currentUserId.length > 20)) {
        const { data, error } = await productSupabase
          .from('chat_threads')
          .select(`
            *,
            buyer:profiles!chat_threads_buyer_id_fkey(*),
            seller:profiles!chat_threads_seller_id_fkey(*)
          `)
          .or(`buyer_id.eq.${currentUserId},seller_id.eq.${currentUserId}`)
          .order('last_message_time', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[threadService] UUID threads fetch error:', err);
    }

    // Fallback to chatService getChatThreads for smooth dual-user support
    return await chatService.getChatThreads(currentUser);
  },

  /**
   * Find existing thread or create a new 1-on-1 buyer/seller thread
   */
  getOrCreateThread: async ({ buyerId, sellerId, productId = null, productDetails = null }) => {
    if (!buyerId || !sellerId) throw new Error('buyerId and sellerId are required to start a conversation.');
    
    // Self-chat guard
    if (buyerId === sellerId) {
      throw new Error('You cannot start a conversation with yourself.');
    }

    try {
      // 1. Check if thread already exists
      let query = productSupabase
        .from('chat_threads')
        .select('*')
        .or(`and(buyer_id.eq.${buyerId},seller_id.eq.${sellerId}),and(buyer_id.eq.${sellerId},seller_id.eq.${buyerId})`);

      if (productId) {
        query = query.eq('product_id', productId);
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
          buyer_id: buyerId,
          seller_id: sellerId,
          product_id: productId,
          last_message: initialMessage,
          last_sender_id: buyerId,
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
        sender_id: buyerId,
        receiver_id: sellerId,
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
