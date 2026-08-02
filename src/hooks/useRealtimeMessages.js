import { useState, useEffect, useCallback, useRef } from 'react';
import { getThreadMessages, sendChatMessage, markMessagesAsSeen } from '../services/chatService';
import { productSupabase } from '../lib/supabase';

// ============================================================
// useRealtimeMessages — Adopted from Project 2 (chatdemo)
//
// Features:
//   - Load 30 messages on init (paginated)
//   - Optimistic UI: message appears instantly, replaced by real msg
//   - Realtime INSERT subscription (filtered by thread_id — critical!)
//   - Realtime UPDATE subscription (for seen/delivered status)
//   - Auto mark-as-seen when receiver opens thread
//   - Infinite scroll: load older messages
//   - Duplicate prevention via ID and isOptimistic matching
// ============================================================

export function useRealtimeMessages(threadId, currentUserId, receiverId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sending, setSending] = useState(false);

  // Keep ref to avoid stale closures in realtime callbacks
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // ── Load initial messages ─────────────────────────────────
  const loadInitialMessages = useCallback(async () => {
    if (!threadId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getThreadMessages(threadId, 30);
      setMessages(data);
      setHasMore(data.length === 30);

      // Auto mark received messages as seen
      if (currentUserId) {
        await markMessagesAsSeen(threadId, currentUserId);
      }
    } catch (err) {
      console.error('[useRealtimeMessages] loadInitialMessages error:', err);
    } finally {
      setLoading(false);
    }
  }, [threadId, currentUserId]);

  // ── Load older messages (infinite scroll upward) ──────────
  const loadOlderMessages = useCallback(async () => {
    if (!threadId || loadingOlder || !hasMore || messages.length === 0) return;

    setLoadingOlder(true);
    try {
      const oldestTimestamp = messages[0].created_at;
      const olderData = await getThreadMessages(threadId, 30, oldestTimestamp);

      if (olderData.length < 30) setHasMore(false);

      setMessages(prev => {
        // Deduplicate
        const existingIds = new Set(prev.map(m => m.id));
        const newOlder = olderData.filter(m => !existingIds.has(m.id));
        return [...newOlder, ...prev];
      });
    } catch (err) {
      console.error('[useRealtimeMessages] loadOlderMessages error:', err);
    } finally {
      setLoadingOlder(false);
    }
  }, [threadId, loadingOlder, hasMore, messages]);

  // ── Optimistic UI: add a temporary message ─────────────────
  const addOptimisticMessage = useCallback((tempMsg) => {
    setMessages(prev => {
      const exists = prev.some(m => m.id === tempMsg.id);
      if (exists) return prev;
      return [...prev, tempMsg];
    });
  }, []);

  // ── Replace optimistic message with real DB message ────────
  const confirmOptimisticMessage = useCallback((tempId, realMsg) => {
    setMessages(prev =>
      prev.map(m => (m.id === tempId ? { ...realMsg, isOptimistic: false } : m))
    );
  }, []);

  // ── Mark optimistic message as failed ─────────────────────
  const failOptimisticMessage = useCallback((tempId) => {
    setMessages(prev =>
      prev.map(m => (m.id === tempId ? { ...m, isFailed: true } : m))
    );
  }, []);

  // ── Send message with optimistic UI ──────────────────────
  const handleSendMessage = useCallback(async (text, messageType = 'text', extraPayload = {}) => {
    if (!threadId || !currentUserId || !receiverId) return;
    if (messageType === 'text' && !text?.trim()) return;

    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const tempMessage = {
      id: tempId,
      thread_id: threadId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      message: text?.trim() || (messageType === 'image' ? '📷 Photo' : 'Message'),
      message_type: messageType,
      image_url: extraPayload.imageUrl || null,
      metadata: extraPayload.metadata || {},
      is_seen: false,
      is_delivered: true,
      created_at: new Date().toISOString(),
      isOptimistic: true,
    };

    addOptimisticMessage(tempMessage);
    setSending(true);

    try {
      const sentMessage = await sendChatMessage({
        threadId,
        senderId: currentUserId,
        receiverId,
        message: text,
        messageType,
        imageUrl: extraPayload.imageUrl || null,
        metadata: extraPayload.metadata || {},
      });

      confirmOptimisticMessage(tempId, sentMessage);
    } catch (err) {
      console.error('[useRealtimeMessages] sendMessage error:', err);
      failOptimisticMessage(tempId);
    } finally {
      setSending(false);
    }
  }, [threadId, currentUserId, receiverId, addOptimisticMessage, confirmOptimisticMessage, failOptimisticMessage]);

  // ── Realtime subscriptions ────────────────────────────────
  useEffect(() => {
    loadInitialMessages();
    if (!threadId) return;

    let isMounted = true;

    // Subscribe to NEW messages in THIS thread only (thread_id filter is critical)
    const channel = productSupabase
      .channel(`realtime:uc_messages:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'uc_messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          if (!newMsg || !isMounted) return;

          setMessages(prev => {
            // Replace optimistic message if it matches (same sender + message content)
            const optimisticIdx = prev.findIndex(
              m => m.isOptimistic &&
                   m.sender_id === newMsg.sender_id &&
                   m.message === newMsg.message &&
                   m.message_type === newMsg.message_type
            );
            if (optimisticIdx !== -1) {
              const updated = [...prev];
              updated[optimisticIdx] = { ...newMsg, isOptimistic: false };
              return updated;
            }

            // Check for exact duplicate by ID
            if (prev.some(m => m.id === newMsg.id)) return prev;

            // It's a genuinely new message from the other user
            return [...prev, newMsg];
          });

          // If receiver is currently viewing, mark as seen immediately
          if (newMsg.receiver_id === currentUserId) {
            markMessagesAsSeen(threadId, currentUserId);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'uc_messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const updatedMsg = payload.new;
          if (!updatedMsg || !isMounted) return;

          setMessages(prev =>
            prev.map(m => (m.id === updatedMsg.id ? { ...m, ...updatedMsg } : m))
          );
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      productSupabase.removeChannel(channel);
    };
  }, [threadId, currentUserId, loadInitialMessages]);

  return {
    messages,
    loading,
    loadingOlder,
    hasMore,
    sending,
    sendMessage: handleSendMessage,
    loadOlderMessages,
    addOptimisticMessage,
    refreshMessages: loadInitialMessages,
  };
}
