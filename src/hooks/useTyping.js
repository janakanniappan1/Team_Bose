import { useState, useEffect, useRef, useCallback } from 'react';
import {
  setTypingStatus,
  fetchTypingStatus,
  subscribeTyping,
} from '../services/typingService';

// ============================================================
// useTyping — Adopted from Project 2 (chatdemo) pattern
//
// Features:
//   - sendTypingNotification(): emit typing=true to DB
//   - 2-second auto-clear timeout (user stops typing → typing=false)
//   - Realtime subscription to opponent's typing status
//   - Initial typing status fetch on mount
// ============================================================

export function useTyping(threadId, currentUserId, opponentId) {
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // ── Emit typing event to DB (with auto-clear) ─────────────
  const sendTypingNotification = useCallback(() => {
    if (!threadId || !currentUserId) return;

    // Emit typing = true
    setTypingStatus(threadId, currentUserId, true);

    // Clear any existing auto-clear timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto clear after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(threadId, currentUserId, false);
    }, 2000);
  }, [threadId, currentUserId]);

  // Alias for MessagesPage compatibility
  const handleTyping = sendTypingNotification;

  const stopTyping = useCallback(() => {
    if (!threadId || !currentUserId) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTypingStatus(threadId, currentUserId, false);
  }, [threadId, currentUserId]);

  // ── Subscribe to opponent's typing status ─────────────────
  useEffect(() => {
    if (!threadId || !opponentId) {
      setIsOpponentTyping(false);
      return;
    }

    // Initial check for opponent typing
    fetchTypingStatus(threadId, opponentId).then(setIsOpponentTyping);

    // Realtime subscription
    const unsubscribe = subscribeTyping(threadId, opponentId, (isTyping) => {
      setIsOpponentTyping(isTyping);
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      unsubscribe();
    };
  }, [threadId, opponentId]);

  return {
    isOpponentTyping,
    isTargetTyping: isOpponentTyping, // Alias for MessagesPage compatibility
    sendTypingNotification,
    handleTyping,
    stopTyping,
  };
}
