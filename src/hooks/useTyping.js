import { useState, useEffect, useRef } from 'react';
import { typingService } from '../services/typingService';

export function useTyping(threadId, currentUserId, targetUserId = null) {
  const [isTargetTyping, setIsTargetTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Emit typing status with 2s auto-clear timeout
  const handleTyping = () => {
    if (!threadId || !currentUserId) return;

    typingService.setTypingStatus(threadId, currentUserId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      typingService.setTypingStatus(threadId, currentUserId, false);
    }, 2000);
  };

  const stopTyping = () => {
    if (!threadId || !currentUserId) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingService.setTypingStatus(threadId, currentUserId, false);
  };

  // Subscribe to target user's typing in active thread
  useEffect(() => {
    if (!threadId || !targetUserId) {
      setIsTargetTyping(false);
      return;
    }

    const unsubscribe = typingService.subscribeTyping(threadId, targetUserId, (isTyping) => {
      setIsTargetTyping(isTyping);
    });

    return () => {
      unsubscribe();
    };
  }, [threadId, targetUserId]);

  return { isTargetTyping, handleTyping, stopTyping };
}
