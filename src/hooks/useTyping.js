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
  const lastEmitRef = useRef(0);

  // ── Emit typing event to DB (throttled to 2s, auto-clear 2.5s) ──
  const sendTypingNotification = useCallback(() => {
    if (!threadId || !currentUserId) return;

    const now = Date.now();
    if (now - lastEmitRef.current > 2000) {
      lastEmitRef.current = now;
      setTypingStatus(threadId, currentUserId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(threadId, currentUserId, false);
      lastEmitRef.current = 0;
    }, 2500);
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
