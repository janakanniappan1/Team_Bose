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

  const { data: newMsg, error: msgError } = await productSupabase
    .from('uc_messages')
    .insert([{
      thread_id: threadId,
      sender_id: senderId,
      receiver_id: receiverId,
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
      const isSenderBuyer = thread.buyer_id === senderId;
      const update = {
        last_message: displayMessage,
        last_sender_id: senderId,
        last_message_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (isSenderBuyer) {
        update.seller_unread_count = (thread.seller_unread_count || 0) + 1;
      } else {
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

export async function markMessagesAsSeen(threadId, currentUserId) {
  if (!threadId || !currentUserId) return;
  try {
    await productSupabase
      .from('uc_messages')
      .update({ is_seen: true })
      .eq('thread_id', threadId)
      .eq('receiver_id', currentUserId)
      .eq('is_seen', false);
  } catch (err) { console.warn('[chatService] markSeen:', err); }
}
