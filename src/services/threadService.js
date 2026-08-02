import { productSupabase, supabase } from '../lib/supabase';

// ============================================================
// threadService — Clean UUID-based thread management
//
// DB2 (productSupabase): chat_threads, chat_messages
// DB1 (supabase):        users (for opponent name/avatar lookup)
//
// chat_threads schema:
//   buyer_id TEXT, seller_id TEXT,
//   buyer_unread_count, seller_unread_count,
//   last_message, last_message_time, item_title, item_price, item_image
// ============================================================

/**
 * Fetch all threads for a user (as buyer OR seller).
 * Enriches each thread with:
 *   - opponent: { id, username, full_name, avatar_url }
 *   - unreadCount: number of unseen messages for this user
 */
export const threadService = {

  getUserThreads: async (userId) => {
    if (!userId) return [];

    try {
      // 1. Fetch threads
      const { data: threads, error } = await productSupabase
        .from('chat_threads')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('last_message_time', { ascending: false });

      if (error) {
        console.error('[threadService] getUserThreads error:', error.message);
        return [];
      }
      if (!threads || threads.length === 0) return [];

      // 2. Collect all unique opponent UUIDs
      const opponentIds = [...new Set(
        threads.map(t => t.buyer_id === userId ? t.seller_id : t.buyer_id)
      )];

      // 3. Batch-fetch opponent profiles from DB1 (users table)
      let usersMap = {};
      try {
        const { data: users } = await supabase
          .from('users')
          .select('id, username, full_name')
          .in('id', opponentIds);

        (users || []).forEach(u => {
          usersMap[u.id] = {
            id: u.id,
            username: u.username,
            full_name: u.full_name || u.username,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
          };
        });
      } catch (userFetchErr) {
        console.warn('[threadService] Opponent profile fetch error (non-fatal):', userFetchErr);
      }

      // 4. Enrich threads with opponent profile + unread count
      const enriched = threads.map(thread => {
        const isBuyer = thread.buyer_id === userId;
        const opponentId = isBuyer ? thread.seller_id : thread.buyer_id;
        const opponent = usersMap[opponentId] || {
          id: opponentId,
          username: 'Unknown',
          full_name: 'Unknown User',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
        };
        const unreadCount = isBuyer
          ? (thread.buyer_unread_count || 0)
          : (thread.seller_unread_count || 0);

        return { ...thread, opponent, unreadCount };
      });

      return enriched;
    } catch (err) {
      console.error('[threadService] getUserThreads exception:', err);
      return [];
    }
  },

  /**
   * Find or create a 1-on-1 thread between buyer and seller.
   * Self-chat guard: throws if buyerId === sellerId.
   * Sends an initial product_card message when creating a new thread.
   */
  getOrCreateThread: async ({ buyerId, sellerId, productId = null, productDetails = null }) => {
    const bId = String(buyerId || '').trim();
    const sId = String(sellerId || '').trim();

    if (!bId || !sId) throw new Error('buyerId and sellerId are required.');
    if (bId === sId) throw new Error('You cannot chat with yourself.');

    try {
      // 1. Check if thread already exists (either direction)
      const { data: existing, error: searchError } = await productSupabase
        .from('chat_threads')
        .select('*')
        .or(
          `and(buyer_id.eq.${bId},seller_id.eq.${sId}),and(buyer_id.eq.${sId},seller_id.eq.${bId})`
        )
        .limit(1);

      if (!searchError && existing && existing.length > 0) {
        return existing[0];
      }

      // 2. Create new thread
      const initialMessage = productDetails
        ? `Hi! Is "${productDetails.title}" still available?`
        : "Hi! I'd like to connect regarding your listing.";

      const { data: newThread, error: createError } = await productSupabase
        .from('chat_threads')
        .insert([{
          buyer_id: bId,
          seller_id: sId,
          product_id: productId || null,
          item_title: productDetails?.title || 'Campus Item',
          item_price: Number(productDetails?.price) || 0,
          item_image: productDetails?.images?.[0] || '',
          last_message: initialMessage,
          last_sender_id: bId,
          last_message_time: new Date().toISOString(),
          buyer_unread_count: 0,
          seller_unread_count: 1,
        }])
        .select()
        .single();

      if (createError) throw createError;

      // 3. Insert initial message into chat_messages
      const initialMsgType = productDetails ? 'product_card' : 'text';
      const initialMetadata = productDetails ? {
        title: productDetails.title,
        price: productDetails.price,
        image: productDetails.images?.[0] || '',
      } : {};

      await productSupabase.from('chat_messages').insert([{
        thread_id: newThread.id,
        sender_id: bId,
        receiver_id: sId,
        message: initialMessage,
        message_type: initialMsgType,
        metadata: initialMetadata,
        is_seen: false,
        is_delivered: true,
      }]);

      return newThread;
    } catch (err) {
      console.error('[threadService] getOrCreateThread error:', err);
      throw err;
    }
  },

  /**
   * Reset the unread counter for the current user when they open a conversation.
   */
  resetUnreadCount: async (threadId, userId) => {
    if (!threadId || !userId) return;
    try {
      const { data: thread } = await productSupabase
        .from('chat_threads')
        .select('buyer_id, seller_id')
        .eq('id', threadId)
        .single();

      if (!thread) return;

      const isBuyer = thread.buyer_id === userId;
      const updatePayload = isBuyer
        ? { buyer_unread_count: 0 }
        : { seller_unread_count: 0 };

      await productSupabase
        .from('chat_threads')
        .update(updatePayload)
        .eq('id', threadId);
    } catch (err) {
      console.warn('[threadService] resetUnreadCount error:', err);
    }
  },
};
