import { useState, useEffect, useCallback } from 'react';
import { useThreads } from './useThreads';
import { useRealtimeMessages } from './useRealtimeMessages';
import { usePresence } from './usePresence';
import { useTyping } from './useTyping';
import { threadService } from '../services/threadService';

// ============================================================
// useChat — Pure UUID-based orchestrator hook
//
// Wires together:
//   useThreads       → sidebar conversation list
//   useRealtimeMessages → active thread messages
//   usePresence      → online status for all users
//   useTyping        → typing indicator for active thread
//
// Opponent is resolved ONLY by UUID comparison:
//   thread.buyer_id === currentUserId → opponent is seller
//   thread.seller_id === currentUserId → opponent is buyer
//   opponent profile pre-loaded by threadService.getUserThreads()
// ============================================================

export function useChat(currentUser, initialThreadId = null) {
  // ── Resolve current user UUID ────────────────────────────
  // MUST be the UUID from users.id — never fall back to username
  const currentUserId = currentUser?.id || currentUser?.authId || null;

  const { threads, setThreads, loading: threadsLoading, refreshThreads } = useThreads(currentUserId);
  const [activeThreadId, setActiveThreadId] = useState(initialThreadId || null);

  // ── Auto-select initial thread ────────────────────────────
  useEffect(() => {
    if (initialThreadId) {
      setActiveThreadId(initialThreadId);
    } else if (threads.length > 0 && !activeThreadId) {
      // Don't auto-select first thread — let user choose
    }
  }, [initialThreadId, threads]);

  // ── Find active thread object ─────────────────────────────
  const activeThread = threads.find(t => t.id === activeThreadId) || null;

  // ── Resolve opponent profile (pure UUID, pre-loaded by threadService) ──
  const getOpponentProfile = useCallback((thread) => {
    if (!thread || !currentUserId) return null;

    // thread.opponent is already resolved by threadService.getUserThreads()
    if (thread.opponent && thread.opponent.id) {
      return thread.opponent;
    }

    // Fallback: determine from buyer_id/seller_id
    const isBuyer = thread.buyer_id === currentUserId;
    const opponentId = isBuyer ? thread.seller_id : thread.buyer_id;

    return {
      id: opponentId || null,
      username: 'User',
      full_name: 'Campus User',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${opponentId}`,
    };
  }, [currentUserId]);

  const opponentProfile = getOpponentProfile(activeThread);
  const opponentId = opponentProfile?.id || null;

  // ── Messages for active thread ────────────────────────────
  const {
    messages,
    loading: messagesLoading,
    loadingOlder,
    hasMore,
    sending,
    sendMessage,
    loadOlderMessages,
    addOptimisticMessage,
    refreshMessages,
  } = useRealtimeMessages(activeThreadId, currentUserId, opponentId);

  // ── Presence (global map) ─────────────────────────────────
  const { presenceMap, getPresenceForUser } = usePresence(currentUserId);
  const targetPresence = getPresenceForUser(opponentId);

  // ── Typing indicator ──────────────────────────────────────
  const { isTargetTyping, handleTyping, stopTyping } = useTyping(
    activeThreadId,
    currentUserId,
    opponentId
  );

  // ── Reset unread count when switching conversations ───────
  useEffect(() => {
    if (activeThreadId && currentUserId) {
      threadService.resetUnreadCount(activeThreadId, currentUserId);
    }
  }, [activeThreadId, currentUserId]);

  return {
    currentUserId,
    threads,
    setThreads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    opponentProfile,
    messages,
    messagesLoading,
    threadsLoading,
    loadingOlder,
    hasMore,
    sending,
    sendMessage,
    loadOlderMessages,
    addOptimisticMessage,
    refreshMessages,
    presenceMap,
    targetPresence,
    getPresenceForUser,
    isTargetTyping,
    handleTyping,
    stopTyping,
    refreshThreads,
  };
}
