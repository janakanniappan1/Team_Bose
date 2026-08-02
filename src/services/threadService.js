import { productSupabase, supabase } from '../lib/supabase';

// ============================================================
// threadService — Uses uc_threads (zero conflict prefix)
// ============================================================

export const threadService = {

  getUserThreads: async (userId) => {
    if (!userId) return [];
    try {
      const { data: threads, error } = await productSupabase
        .from('uc_threads')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('last_message_time', { ascending: false });

      if (error) { console.error('[threadService] getUserThreads:', error.message); return []; }
      if (!threads || threads.length === 0) return [];

      // Batch-fetch opponent profiles from DB1 users table
      const opponentIds = [...new Set(
        threads.map(t => t.buyer_id === userId ? t.seller_id : t.buyer_id)
      )];

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
      } catch (e) { console.warn('[threadService] opponent fetch (non-fatal):', e); }

      return threads.map(thread => {
        const isBuyer = thread.buyer_id === userId;
        const opponentId = isBuyer ? thread.seller_id : thread.buyer_id;
        const opponent = usersMap[opponentId] || {
          id: opponentId,
          username: 'User',
          full_name: 'Campus User',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${opponentId}`,
        };
        const unreadCount = isBuyer
          ? (thread.buyer_unread_count || 0)
          : (thread.seller_unread_count || 0);
        return { ...thread, opponent, unreadCount };
      });
    } catch (err) {
      console.error('[threadService] getUserThreads exception:', err);
      return [];
    }
  },

  getOrCreateThread: async ({ buyerId, sellerId, productId = null, productDetails = null }) => {
    const bId = String(buyerId || '').trim();
    const sId = String(sellerId || '').trim();
    if (!bId || !sId) throw new Error('buyerId and sellerId are required.');
    if (bId === sId) throw new Error('You cannot chat with yourself.');

    try {
      // Check if thread already exists
      const { data: existing, error: searchError } = await productSupabase
        .from('uc_threads')
        .select('*')
        .or(`and(buyer_id.eq.${bId},seller_id.eq.${sId}),and(buyer_id.eq.${sId},seller_id.eq.${bId})`)
        .limit(1);

      if (!searchError && existing && existing.length > 0) return existing[0];

      // Create new thread
      const initialMessage = productDetails
        ? `Hi! Is "${productDetails.title}" still available?`
        : "Hi! I'd like to connect regarding your listing.";

      const { data: newThread, error: createError } = await productSupabase
        .from('uc_threads')
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

      // Insert initial message
      await productSupabase.from('uc_messages').insert([{
        thread_id: newThread.id,
        sender_id: bId,
        receiver_id: sId,
        message: initialMessage,
        message_type: productDetails ? 'product_card' : 'text',
        metadata: productDetails ? {
          title: productDetails.title,
          price: productDetails.price,
          image: productDetails.images?.[0] || '',
        } : {},
        is_seen: false,
        is_delivered: true,
      }]);

      return newThread;
    } catch (err) {
      console.error('[threadService] getOrCreateThread:', err);
      throw err;
    }
  },

  resetUnreadCount: async (threadId, userId) => {
    if (!threadId || !userId) return;
    try {
      const { data: thread } = await productSupabase
        .from('uc_threads')
        .select('buyer_id, seller_id')
        .eq('id', threadId)
        .single();

      if (!thread) return;
      const isBuyer = thread.buyer_id === userId;
      await productSupabase
        .from('uc_threads')
        .update(isBuyer ? { buyer_unread_count: 0 } : { seller_unread_count: 0 })
        .eq('id', threadId);
    } catch (err) { console.warn('[threadService] resetUnread:', err); }
  },
};
