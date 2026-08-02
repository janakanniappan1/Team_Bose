import { productSupabase } from '../lib/supabase';

// ============================================================
// presenceService — Adopted from Project 2 (chatdemo) pattern
// Adapted for Project 1's schema:
//   user_presence(user_id TEXT, is_online BOOLEAN, last_seen TIMESTAMPTZ)
// ============================================================

/**
 * Mark a user as online (upsert).
 */
export async function setUserOnline(userId) {
  if (!userId) return;
  try {
    await productSupabase.from('user_presence').upsert({
      user_id: userId,
      is_online: true,
      last_seen: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[presenceService] setUserOnline error:', err);
  }
}

/**
 * Mark a user as offline (upsert).
 */
export async function setUserOffline(userId) {
  if (!userId) return;
  try {
    await productSupabase.from('user_presence').upsert({
      user_id: userId,
      is_online: false,
      last_seen: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[presenceService] setUserOffline error:', err);
  }
}

/**
 * Fetch presence records for all users.
 * Returns a map: { [userId]: { is_online, last_seen } }
 */
export async function fetchAllPresence() {
  try {
    const { data, error } = await productSupabase
      .from('user_presence')
      .select('user_id, is_online, last_seen');

    if (error) {
      console.error('[presenceService] fetchAllPresence error:', error.message);
      return {};
    }

    const presenceMap = {};
    (data || []).forEach(row => {
      presenceMap[row.user_id] = {
        is_online: row.is_online,
        last_seen: row.last_seen,
      };
    });
    return presenceMap;
  } catch (err) {
    console.error('[presenceService] fetchAllPresence exception:', err);
    return {};
  }
}

/**
 * Subscribe to real-time presence changes for a specific user.
 * Calls onPresenceChange({ is_online, last_seen }) whenever their row changes.
 * Returns an unsubscribe function.
 */
export function subscribeUserPresence(targetUserId, onPresenceChange) {
  if (!targetUserId) return () => {};

  // Initial fetch for the target user
  productSupabase
    .from('user_presence')
    .select('user_id, is_online, last_seen')
    .eq('user_id', targetUserId)
    .single()
    .then(({ data }) => {
      if (data) onPresenceChange(data);
    });

  // Realtime subscription
  const channel = productSupabase
    .channel(`presence_${targetUserId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_presence',
        filter: `user_id=eq.${targetUserId}`,
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

// Keep backward-compatible named export for existing presenceService callers
export const presenceService = {
  setUserOnline,
  setUserOffline,
  subscribeUserPresence,
  fetchAllPresence,
};
