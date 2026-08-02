import { useState, useEffect } from 'react';
import { useThreads } from './useThreads';
import { useRealtimeMessages } from './useRealtimeMessages';
import { usePresence } from './usePresence';
import { useTyping } from './useTyping';
import { threadService } from '../services/threadService';

export function useChat(currentUser, initialThreadId = null) {
  const currentUserId = currentUser?.id || currentUser?.uuid || null;
  const { threads, setThreads, loading: threadsLoading } = useThreads(currentUserId);
  const [activeThreadId, setActiveThreadId] = useState(initialThreadId);

  // Sync initialThreadId
  useEffect(() => {
    if (initialThreadId) {
      setActiveThreadId(initialThreadId);
    } else if (threads.length > 0 && !activeThreadId) {
      setActiveThreadId(threads[0].id);
    }
  }, [initialThreadId, threads]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0] || null;

  // Resolve opponent user profile
  const opponentProfile = activeThread
    ? (activeThread.buyer_id === currentUserId ? activeThread.seller : activeThread.buyer)
    : null;

  const targetUserId = opponentProfile?.id || null;

  const {
    messages,
    loading: messagesLoading,
    hasMore,
    loadMoreMessages,
    addOptimisticMessage
  } = useRealtimeMessages(activeThreadId, currentUserId);

  const targetPresence = usePresence(currentUserId, targetUserId);
  const { isTargetTyping, handleTyping, stopTyping } = useTyping(activeThreadId, currentUserId, targetUserId);

  // Reset unread count when switching active conversation
  useEffect(() => {
    if (activeThreadId && currentUserId) {
      threadService.resetUnreadCount(activeThreadId, currentUserId);
    }
  }, [activeThreadId, currentUserId]);

  return {
    currentUserId,
    threads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    opponentProfile,
    messages,
    messagesLoading,
    threadsLoading,
    hasMore,
    loadMoreMessages,
    addOptimisticMessage,
    targetPresence,
    isTargetTyping,
    handleTyping,
    stopTyping
  };
}
