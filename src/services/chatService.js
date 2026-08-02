import { productSupabase } from '../lib/supabase';

// ============================================================
// chatService — Adopted from Project 2 (chatdemo) pattern
// Adapted for Project 1's schema:
//   chat_messages(thread_id, sender_id TEXT, receiver_id TEXT,
//     message, message_type, image_url, metadata JSONB,
//     is_seen, is_delivered, created_at)
// ============================================================

/**
 * Fetch paginated messages for a thread.
 * Returns messages in ascending order (oldest → newest).
 * Pass beforeTimestamp to load older messages (infinite scroll).
 */
export async function getThreadMessages(threadId, limit = 30, beforeTimestamp = null) {
  if (!threadId) return [];

  try {
    let query = productSupabase
      .from('chat_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (beforeTimestamp) {
      query = query.lt('created_at', beforeTimestamp);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[chatService] getThreadMessages error:', error.message);
      return [];
    }
    // Reverse so oldest is first in the array
    return (data || []).reverse();
  } catch (err) {
    console.error('[chatService] getThreadMessages exception:', err);
    return [];
  }
}

/**
 * Send a message to a thread.
 * Updates the thread's last_message and increments receiver's unread count.
 * NEVER uses username strings — only UUIDs for sender_id / receiver_id.
 */
export async function sendChatMessage({
  threadId,
  senderId,
  receiverId,
  message,
  messageType = 'text',
  imageUrl = null,
  metadata = {}
}) {
  if (!threadId || !senderId || !receiverId) {
    throw new Error('sendChatMessage: threadId, senderId, receiverId are all required.');
  }
  if (!message && !imageUrl) {
    throw new Error('sendChatMessage: message or imageUrl is required.');
  }

  const displayMessage = message?.trim() || (messageType === 'image' ? '📷 Photo' : 'Message');

  // 1. Insert into chat_messages
  const { data: newMsg, error: msgError } = await productSupabase
    .from('chat_messages')
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

  // 2. Update thread's last_message and receiver's unread count
  try {
    const { data: thread } = await productSupabase
      .from('chat_threads')
      .select('buyer_id, buyer_unread_count, seller_unread_count')
      .eq('id', threadId)
      .single();

    if (thread) {
      const isSenderBuyer = thread.buyer_id === senderId;
      const updatePayload = {
        last_message: displayMessage,
        last_sender_id: senderId,
        last_message_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Increment the RECEIVER's unread count (not the sender's)
      if (isSenderBuyer) {
        updatePayload.seller_unread_count = (thread.seller_unread_count || 0) + 1;
      } else {
        updatePayload.buyer_unread_count = (thread.buyer_unread_count || 0) + 1;
      }

      await productSupabase
        .from('chat_threads')
        .update(updatePayload)
        .eq('id', threadId);
    }
  } catch (updateErr) {
    console.warn('[chatService] Thread update error (non-fatal):', updateErr);
  }

  return newMsg;
}

/**
 * Upload a chat image to the 'imagies' bucket.
 * Returns the public URL or null on failure.
 */
export async function uploadChatImage(file) {
  if (!file) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `attachments/${fileName}`;

    const { error: uploadError } = await productSupabase.storage
      .from('imagies')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.warn('[chatService] Image upload error:', uploadError.message);
      return null;
    }

    const { data } = productSupabase.storage
      .from('imagies')
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (err) {
    console.error('[chatService] Image upload exception:', err);
    return null;
  }
}

/**
 * Mark all received messages in a thread as seen.
 * Only updates messages where receiver_id matches current user.
 */
export async function markMessagesAsSeen(threadId, currentUserId) {
  if (!threadId || !currentUserId) return;
  try {
    await productSupabase
      .from('chat_messages')
      .update({ is_seen: true })
      .eq('thread_id', threadId)
      .eq('receiver_id', currentUserId)
      .eq('is_seen', false);
  } catch (err) {
    console.warn('[chatService] markMessagesAsSeen error:', err);
  }
}
