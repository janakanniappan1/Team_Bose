import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { productSupabase } from '../lib/supabase';

export function useRealtimeMessages(threadId, currentUserId) {
  const [messages, setMessages] = useState(() => {
    if (!threadId) return [];
    try {
      const saved = localStorage.getItem(`uniswap_msgs_${threadId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Load and merge messages from Supabase DB
  useEffect(() => {
    if (!threadId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    // Initial load from localStorage
    try {
      const saved = localStorage.getItem(`uniswap_msgs_${threadId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch (e) {
      console.warn('[useRealtimeMessages] local cache read error:', e);
    }

    // Fetch latest messages from Supabase DB
    chatService.getMessages(threadId, 50).then((data) => {
      if (isMounted) {
        setMessages((prev) => {
          const combined = [...prev, ...(data || [])];
          const uniqueMap = new Map();
          combined.forEach((msg) => {
            const key = msg.id || `${msg.sender_id || msg.sender}_${msg.message || msg.text}_${msg.created_at || msg.time}`;
            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, msg);
            }
          });
          const result = Array.from(uniqueMap.values());
          try {
            localStorage.setItem(`uniswap_msgs_${threadId}`, JSON.stringify(result));
          } catch {}
          return result;
        });

        setLoading(false);
        setHasMore((data || []).length >= 50);

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
          table: 'chat_messages'
        },
        (payload) => {
          if (payload.new && isMounted) {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === payload.new.id || (m.message === payload.new.message && m.sender_id === payload.new.sender_id));
              if (exists) return prev;
              const updated = [...prev, payload.new];
              try {
                localStorage.setItem(`uniswap_msgs_${threadId}`, JSON.stringify(updated));
              } catch {}
              return updated;
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
          table: 'chat_messages'
        },
        (payload) => {
          if (payload.new && isMounted) {
            setMessages((prev) => {
              const updated = prev.map((m) => (m.id === payload.new.id ? payload.new : m));
              try {
                localStorage.setItem(`uniswap_msgs_${threadId}`, JSON.stringify(updated));
              } catch {}
              return updated;
            });
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
    setMessages((prev) => {
      const combined = [...olderMsgs, ...prev];
      const uniqueMap = new Map();
      combined.forEach((m) => uniqueMap.set(m.id, m));
      return Array.from(uniqueMap.values());
    });
  };

  // Optimistic UI append (Permanent insert)
  const addOptimisticMessage = (newMsg) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === newMsg.id || (m.message === newMsg.message && m.sender_id === newMsg.sender_id));
      if (exists) return prev;
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem(`uniswap_msgs_${threadId}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return { messages, loading, hasMore, loadMoreMessages, addOptimisticMessage };
}
