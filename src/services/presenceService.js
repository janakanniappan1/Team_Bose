import { productSupabase } from '../lib/supabase';

export const presenceService = {
  /**
   * Set user online status in user_presence table
   */
  setUserOnline: async (userId) => {
    if (!userId) return;
    try {
      await productSupabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          is_online: true,
          last_seen: new Date().toISOString()
        });
    } catch (err) {
      console.warn('[presenceService] Online status error:', err);
    }
  },

  /**
   * Set user offline status in user_presence table
   */
  setUserOffline: async (userId) => {
    if (!userId) return;
    try {
      await productSupabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          is_online: false,
          last_seen: new Date().toISOString()
        });
    } catch (err) {
      console.warn('[presenceService] Offline status error:', err);
    }
  },

  /**
   * Subscribe to real-time online/offline presence changes for a given user
   */
  subscribeUserPresence: (targetUserId, onPresenceChange) => {
    if (!targetUserId) return () => {};

    // Initial fetch
    productSupabase
      .from('user_presence')
      .select('*')
      .eq('user_id', targetUserId)
      .single()
      .then(({ data }) => {
        if (data) onPresenceChange(data);
      });

    // Realtime channel subscription
    const channel = productSupabase
      .channel(`presence_${targetUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `user_id=eq.${targetUserId}`
        },
        (payload) => {
          if (payload.new) {
            onPresenceChange(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      productSupabase.removeChannel(channel);
    };
  }
};
