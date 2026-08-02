import { useState, useEffect } from 'react';
import { presenceService } from '../services/presenceService';

export function usePresence(currentUserId, targetUserId = null) {
  const [targetPresence, setTargetPresence] = useState({ is_online: false, last_seen: null });

  // 1. Manage current user online/offline status
  useEffect(() => {
    if (!currentUserId) return;

    presenceService.setUserOnline(currentUserId);

    const handleFocus = () => presenceService.setUserOnline(currentUserId);
    const handleBlur = () => presenceService.setUserOffline(currentUserId);
    const handleUnload = () => presenceService.setUserOffline(currentUserId);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      presenceService.setUserOffline(currentUserId);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [currentUserId]);

  // 2. Subscribe to target user presence
  useEffect(() => {
    if (!targetUserId) return;

    const unsubscribe = presenceService.subscribeUserPresence(targetUserId, (presenceData) => {
      setTargetPresence(presenceData);
    });

    return () => {
      unsubscribe();
    };
  }, [targetUserId]);

  return targetPresence;
}
