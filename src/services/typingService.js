import { productSupabase } from '../lib/supabase';

// ============================================================
// typingService — Adopted from Project 2 (chatdemo) pattern
// Adapted for Project 1's schema:
//   typing_status(thread_id UUID, user_id TEXT, typing BOOLEAN, updated_at)
// ============================================================

/**
 * Upsert typing status for a user in a thread.
 * @param {string} threadId - UUID of the chat thread
 * @param {string} userId   - UUID string of the typing user
 * @param {boolean} isTyping - true when typing, false when stopped
 */
export async function setTypingStatus(threadId, userId, isTyping) {
  if (!threadId || !userId) return;
  try {
    await productSupabase.from('typing_status').upsert({
      thread_id: threadId,
      user_id: userId,
      typing: isTyping,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[typingService] setTypingStatus error:', err);
  }
}

/**
 * Fetch current typing status for a specific user in a thread.
 * Returns true only if typing=true AND updated within last 3 seconds.
 */
export async function fetchTypingStatus(threadId, userId) {
  if (!threadId || !userId) return false;
  try {
    const { data, error } = await productSupabase
      .from('typing_status')
      .select('typing, updated_at')
      .eq('thread_id', threadId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return false;
    const updatedAt = new Date(data.updated_at).getTime();
    return data.typing && Date.now() - updatedAt < 3000;
  } catch (err) {
    console.warn('[typingService] fetchTypingStatus error:', err);
    return false;
  }
}

/**
 * Subscribe to typing status changes for a target user in a thread.
 * Calls onTypingChange(boolean) whenever typing changes.
 * Returns an unsubscribe function.
 */
export function subscribeTyping(threadId, targetUserId, onTypingChange) {
  if (!threadId || !targetUserId) return () => {};

  const channel = productSupabase
    .channel(`typing_${threadId}_${targetUserId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'typing_status',
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => {
        if (payload.new && payload.new.user_id === targetUserId) {
          onTypingChange(Boolean(payload.new.typing));
        }
      }
    )
    .subscribe();

  return () => {
    productSupabase.removeChannel(channel);
  };
}

// Backward-compatible named export for existing typingService callers
export const typingService = {
  setTypingStatus,
  fetchTypingStatus,
  subscribeTyping,
};
