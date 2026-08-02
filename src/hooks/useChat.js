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

import { productSupabase } from '../lib/supabase';

export function useChat(currentUser, initialThreadId = null, initialChat = null) {
  // ── Resolve current user ID & Username & Full Name ─────────────
  const currentUserId = currentUser?.id || currentUser?.authId || currentUser?.username || null;
  const currentUsername = currentUser?.username || null;
  const currentFullName = currentUser?.full_name || currentUser?.fullName || null;

  const { threads, setThreads, loading: threadsLoading, refreshThreads } = useThreads(currentUserId, currentUsername, currentFullName);
  const [activeThreadId, setActiveThreadId] = useState(initialThreadId || null);
  const [fetchedActiveThread, setFetchedActiveThread] = useState(initialChat || null);

  // ── Auto-select initial thread ────────────────────────────
  useEffect(() => {
    if (initialThreadId) {
      setActiveThreadId(initialThreadId);
    }
  }, [initialThreadId]);

  useEffect(() => {
    if (initialChat) {
      setFetchedActiveThread(initialChat);
    }
  }, [initialChat]);

  // Fetch thread directly by ID if not yet present in threads list
  useEffect(() => {
    if (!activeThreadId) {
      setFetchedActiveThread(null);
      return;
    }
    const found = threads.find(t => t.id === activeThreadId);
    if (found) {
      setFetchedActiveThread(found);
    } else {
      productSupabase
        .from('uc_threads')
        .select('*')
        .eq('id', activeThreadId)
        .single()
        .then(({ data }) => {
          if (data) setFetchedActiveThread(data);
        });
    }
  }, [activeThreadId, threads]);

  // ── Find active thread object ─────────────────────────────
  const activeThread = threads.find(t => t.id === activeThreadId) || fetchedActiveThread;

  // ── Resolve opponent profile ─────────────────────────────
  const getOpponentProfile = useCallback((thread) => {
    if (!thread || !currentUserId) return null;

    if (thread.opponent && thread.opponent.id && thread.opponent.full_name !== 'Campus User') {
      return thread.opponent;
    }

    const isBuyer = String(thread.buyer_id).toLowerCase() === String(currentUserId).toLowerCase() ||
                    (currentUsername && String(thread.buyer_id).toLowerCase() === String(currentUsername).toLowerCase());
    const opponentId = isBuyer ? thread.seller_id : thread.buyer_id;
    const fallbackName = (isBuyer ? thread.seller_name : thread.buyer_name) || opponentId || 'Campus Student';

    return {
      id: opponentId || null,
      username: opponentId || 'User',
      full_name: (thread.opponent?.full_name && thread.opponent?.full_name !== 'Campus User') ? thread.opponent.full_name : fallbackName,
      avatar_url: thread.opponent?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${opponentId}`,
    };
  }, [currentUserId, currentUsername]);

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
