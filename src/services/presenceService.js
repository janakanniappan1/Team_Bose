import { productSupabase } from '../lib/supabase';

// ============================================================
// presenceService — Uses uc_presence table
// ============================================================

export async function setUserOnline(userId) {
  if (!userId) return;
  try {
    await productSupabase.from('uc_presence').upsert({
      user_id: userId, is_online: true, last_seen: new Date().toISOString(),
    });
  } catch (err) { console.warn('[presenceService] setOnline:', err); }
}

export async function setUserOffline(userId) {
  if (!userId) return;
  try {
    await productSupabase.from('uc_presence').upsert({
      user_id: userId, is_online: false, last_seen: new Date().toISOString(),
    });
  } catch (err) { console.warn('[presenceService] setOffline:', err); }
}

export async function fetchAllPresence() {
  try {
    const { data, error } = await productSupabase
      .from('uc_presence')
      .select('user_id, is_online, last_seen');
    if (error) { console.error('[presenceService] fetchAll:', error.message); return {}; }
    const map = {};
    (data || []).forEach(r => { map[r.user_id] = { is_online: r.is_online, last_seen: r.last_seen }; });
    return map;
  } catch (err) { console.error('[presenceService] fetchAll exception:', err); return {}; }
}

export function subscribeUserPresence(targetUserId, onPresenceChange) {
  if (!targetUserId) return () => {};

  productSupabase
    .from('uc_presence')
    .select('user_id, is_online, last_seen')
    .eq('user_id', targetUserId)
    .single()
    .then(({ data }) => { if (data) onPresenceChange(data); });

  const channel = productSupabase
    .channel(`uc_presence_${targetUserId}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'uc_presence',
      filter: `user_id=eq.${targetUserId}`,
    }, (payload) => { if (payload.new) onPresenceChange(payload.new); })
    .subscribe();

  return () => productSupabase.removeChannel(channel);
}

export const presenceService = { setUserOnline, setUserOffline, fetchAllPresence, subscribeUserPresence };
