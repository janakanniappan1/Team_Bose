import { productSupabase } from '../lib/supabase';

// ============================================================
// typingService — Uses uc_typing table
// ============================================================

export async function setTypingStatus(threadId, userId, isTyping) {
  if (!threadId || !userId) return;
  try {
    await productSupabase.from('uc_typing').upsert({
      thread_id: threadId, user_id: userId,
      typing: isTyping, updated_at: new Date().toISOString(),
    });
  } catch (err) { console.warn('[typingService] setTyping:', err); }
}

export async function fetchTypingStatus(threadId, userId) {
  if (!threadId || !userId) return false;
  try {
    const { data, error } = await productSupabase
      .from('uc_typing')
      .select('typing, updated_at')
      .eq('thread_id', threadId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error || !data) return false;
    const updatedAt = new Date(data.updated_at).getTime();
    return data.typing && Date.now() - updatedAt < 3000;
  } catch (err) { console.warn('[typingService] fetchTyping:', err); return false; }
}

export function subscribeTyping(threadId, targetUserId, onTypingChange) {
  if (!threadId || !targetUserId) return () => {};

  const channel = productSupabase
    .channel(`uc_typing_${threadId}_${targetUserId}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'uc_typing',
      filter: `thread_id=eq.${threadId}`,
    }, (payload) => {
      if (payload.new && payload.new.user_id === targetUserId) {
        onTypingChange(Boolean(payload.new.typing));
      }
    })
    .subscribe();

  return () => productSupabase.removeChannel(channel);
}

export const typingService = { setTypingStatus, fetchTypingStatus, subscribeTyping };
