import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { productSupabase } from '../lib/supabase';

export function useRealtimeMessages(threadId, currentUserId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const threadIdRef = useRef(threadId);

  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);

  useEffect(() => {
    if (!threadId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    // Initial fetch of latest 30 messages
    chatService.getMessages(threadId, 30).then((data) => {
      if (isMounted) {
        setMessages(data);
        setLoading(false);
        setHasMore(data.length >= 30);
        // Mark received unread messages as seen
        if (currentUserId) {
          chatService.markMessagesAsSeen(threadId, currentUserId);
        }
      }
    });

    // Supabase Realtime channel subscription for instant zero-refresh message delivery
    const channel = productSupabase
      .channel(`messages_${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `thread_id=eq.${threadId}`
        },
        (payload) => {
          if (payload.new && isMounted) {
            setMessages((prev) => {
              // Deduplicate if already inserted optimistically
              const exists = prev.some((m) => m.id === payload.new.id);
              if (exists) return prev;
              return [...prev, payload.new];
            });

            if (currentUserId && payload.new.receiver_id === currentUserId) {
              chatService.markMessagesAsSeen(threadId, currentUserId);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `thread_id=eq.${threadId}`
        },
        (payload) => {
          if (payload.new && isMounted) {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      productSupabase.removeChannel(channel);
    };
  }, [threadId, currentUserId]);

  // Load older messages (Infinite Scroll)
  const loadMoreMessages = async () => {
    if (!threadId || loading || !hasMore || messages.length === 0) return;
    const oldestTimestamp = messages[0].created_at;
    const olderMsgs = await chatService.getMessages(threadId, 30, oldestTimestamp);
    if (olderMsgs.length < 30) setHasMore(false);
    setMessages((prev) => [...olderMsgs, ...prev]);
  };

  // Optimistic UI append
  const addOptimisticMessage = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  return { messages, loading, hasMore, loadMoreMessages, addOptimisticMessage };
}
