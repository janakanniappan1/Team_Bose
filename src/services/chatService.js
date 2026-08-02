import { productSupabase } from '../lib/supabase';

// ============================================================
// chatService — Uses uc_ prefixed tables (zero conflict)
//   uc_messages(thread_id, sender_id TEXT, receiver_id TEXT,
//     message, message_type, image_url, metadata JSONB,
//     is_seen, is_delivered, created_at)
// ============================================================

export async function getThreadMessages(threadId, limit = 30, beforeTimestamp = null) {
  if (!threadId) return [];
  try {
    let query = productSupabase
      .from('uc_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (beforeTimestamp) query = query.lt('created_at', beforeTimestamp);

    const { data, error } = await query;
    if (error) { console.error('[chatService] getThreadMessages:', error.message); return []; }
    return (data || []).reverse();
  } catch (err) {
    console.error('[chatService] getThreadMessages exception:', err);
    return [];
  }
}

export async function sendChatMessage({
  threadId, senderId, receiverId, message,
  messageType = 'text', imageUrl = null, metadata = {}
}) {
  if (!threadId || !senderId || !receiverId) throw new Error('threadId, senderId, receiverId required.');
  if (!message && !imageUrl) throw new Error('message or imageUrl required.');

  const displayMessage = message?.trim() || (messageType === 'image' ? '📷 Photo' : 'Message');

  const sIdStr = String(senderId);
  const rIdStr = String(receiverId);

  const { data: newMsg, error: msgError } = await productSupabase
    .from('uc_messages')
    .insert([{
      thread_id: threadId,
      sender_id: sIdStr,
      receiver_id: rIdStr,
      message: displayMessage,
      message_type: messageType,
      image_url: imageUrl || null,
      metadata: metadata || {},
      is_seen: false,
      is_delivered: true,
    }])
    .select()
    .single();

  if (msgError) throw msgError;

  // Update thread last_message + receiver unread count
  try {
    const { data: thread } = await productSupabase
      .from('uc_threads')
      .select('buyer_id, buyer_unread_count, seller_unread_count')
      .eq('id', threadId)
      .single();

    if (thread) {
      const isSenderBuyer = String(thread.buyer_id || '').trim().toLowerCase() === String(senderId || '').trim().toLowerCase();
      const update = {
        last_message: displayMessage,
        last_sender_id: sIdStr,
        last_message_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (isSenderBuyer) {
        update.buyer_unread_count = 0;
        update.seller_unread_count = (thread.seller_unread_count || 0) + 1;
      } else {
        update.seller_unread_count = 0;
        update.buyer_unread_count = (thread.buyer_unread_count || 0) + 1;
      }
      await productSupabase.from('uc_threads').update(update).eq('id', threadId);
    }
  } catch (e) { console.warn('[chatService] thread update (non-fatal):', e); }

  return newMsg;
}

export async function uploadChatImage(file) {
  if (!file) return null;
  try {
    const ext = file.name.split('.').pop();
    const path = `attachments/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const { error } = await productSupabase.storage.from('imagies').upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) { console.warn('[chatService] upload error:', error.message); return null; }
    const { data } = productSupabase.storage.from('imagies').getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (err) { console.error('[chatService] upload exception:', err); return null; }
}

export async function markMessagesAsSeen(threadId, currentUserId, userUsername = null, userFullName = null) {
  if (!threadId || !currentUserId) return;
  try {
    const cIdStr = String(currentUserId).trim();
    const cUserStr = String(userUsername || '').trim().toLowerCase();
    const cNameStr = String(userFullName || '').trim().toLowerCase();

    // Mark received messages as seen in uc_messages
    await productSupabase
      .from('uc_messages')
      .update({ is_seen: true })
      .eq('thread_id', threadId)
      .eq('is_seen', false);

    // Reset unread counter to 0 in uc_threads for this user
    const { data: thread } = await productSupabase
      .from('uc_threads')
      .select('buyer_id, seller_id, buyer_unread_count, seller_unread_count')
      .eq('id', threadId)
      .single();

    if (thread) {
      const bIdStr = String(thread.buyer_id || '').trim().toLowerCase();
      const isBuyer = (bIdStr === cIdStr.toLowerCase()) || (cUserStr && bIdStr === cUserStr) || (cNameStr && bIdStr === cNameStr);

      const update = isBuyer ? { buyer_unread_count: 0 } : { seller_unread_count: 0 };
      await productSupabase.from('uc_threads').update(update).eq('id', threadId);
    }
  } catch (err) { console.warn('[chatService] markSeen:', err); }
}
