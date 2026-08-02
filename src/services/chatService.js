import { productSupabase } from '../lib/supabase';

export const chatService = {
  /**
   * Fetch paginated messages for a thread (30 messages per batch)
   */
  getMessages: async (threadId, limit = 30, beforeTimestamp = null) => {
    if (!threadId) return [];
    try {
      let query = productSupabase
        .from('chat_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (beforeTimestamp) {
        query = query.lt('created_at', beforeTimestamp);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('[chatService] Fetch messages error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('[chatService] Exception:', err);
      return [];
    }
  },

  /**
   * Send a new realtime message
   */
  sendMessage: async ({
    threadId,
    senderId,
    receiverId,
    message,
    messageType = 'text',
    imageUrl = null,
    metadata = {}
  }) => {
    if (!threadId || !senderId || !receiverId || (!message && !imageUrl)) {
      throw new Error('Missing required message parameters.');
    }

    try {
      // 1. Insert message into chat_messages
      const { data: newMsg, error: msgError } = await productSupabase
        .from('chat_messages')
        .insert([{
          thread_id: threadId,
          sender_id: senderId,
          receiver_id: receiverId,
          message: message || (messageType === 'image' ? '📷 Photo' : 'Message'),
          message_type: messageType,
          image_url: imageUrl,
          metadata,
          is_seen: false,
          is_delivered: true
        }])
        .select()
        .single();

      if (msgError) throw msgError;

      // 2. Fetch current thread to determine if sender is buyer or seller
      const { data: thread } = await productSupabase
        .from('chat_threads')
        .select('buyer_id, buyer_unread_count, seller_unread_count')
        .eq('id', threadId)
        .single();

      if (thread) {
        const isSenderBuyer = thread.buyer_id === senderId;
        const updatePayload = {
          last_message: message || (messageType === 'image' ? '📷 Photo' : 'Message'),
          last_sender_id: senderId,
          last_message_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

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

      return newMsg;
    } catch (err) {
      console.error('[chatService] Send message error:', err);
      throw err;
    }
  },

  /**
   * Upload chat attachment image to Supabase Storage bucket 'chat-attachments'
   */
  uploadChatImage: async (file) => {
    if (!file) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `attachments/${fileName}`;

      const { error: uploadError } = await productSupabase.storage
        .from('imagies')
        .upload(filePath, file);

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
  },

  /**
   * Mark all unread received messages in a thread as seen
   */
  markMessagesAsSeen: async (threadId, receiverId) => {
    if (!threadId || !receiverId) return;
    try {
      await productSupabase
        .from('chat_messages')
        .update({ is_seen: true })
        .eq('thread_id', threadId)
        .eq('receiver_id', receiverId)
        .eq('is_seen', false);
    } catch (err) {
      console.warn('[chatService] Mark seen error:', err);
    }
  }
};
