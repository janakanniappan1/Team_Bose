import { productSupabase } from '../lib/supabase';

export const typingService = {
  /**
   * Update typing status for a user in a thread
   */
  setTypingStatus: async (threadId, userId, isTyping) => {
    if (!threadId || !userId) return;
    try {
      await productSupabase
        .from('typing_status')
        .upsert({
          thread_id: threadId,
          user_id: userId,
          typing: isTyping,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('[typingService] Update status error:', err);
    }
  },

  /**
   * Subscribe to typing status of opponent in active conversation thread
   */
  subscribeTyping: (threadId, targetUserId, onTypingChange) => {
    if (!threadId || !targetUserId) return () => {};

    const channel = productSupabase
      .channel(`typing_${threadId}_${targetUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `thread_id=eq.${threadId}`
        },
        (payload) => {
          if (payload.new && payload.new.user_id === targetUserId) {
            onTypingChange(payload.new.typing);
          }
        }
      )
      .subscribe();

    return () => {
      productSupabase.removeChannel(channel);
    };
  }
};
