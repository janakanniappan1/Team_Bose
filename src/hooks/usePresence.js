import { useState, useEffect, useCallback } from 'react';
import {
  setUserOnline,
  setUserOffline,
  fetchAllPresence,
  subscribeUserPresence,
} from '../services/presenceService';
import { productSupabase } from '../lib/supabase';

// ============================================================
// usePresence — Adopted from Project 2 (chatdemo) pattern
//
// Features:
//   - Marks current user online on mount, offline on unmount
//   - 30-second heartbeat to keep presence fresh
//   - Window focus/blur and beforeunload event handlers
//   - Realtime subscription for ALL presence changes → presenceMap
//   - getPresenceForUser(userId) helper for components
// ============================================================

export function usePresence(currentUserId) {
  const [presenceMap, setPresenceMap] = useState({});

  const loadPresence = useCallback(async () => {
    const data = await fetchAllPresence();
    setPresenceMap(data);
  }, []);

  useEffect(() => {
    // Load initial presence for all users
    loadPresence();

    if (!currentUserId) return;

    // Mark current user online immediately
    setUserOnline(currentUserId);

    // 30-second heartbeat to maintain online status
    const heartbeatInterval = setInterval(() => {
      setUserOnline(currentUserId);
    }, 30000);

    // Window focus/blur: set online when window gets focus, offline when hidden
    const handleFocus = () => setUserOnline(currentUserId);
    const handleBlur  = () => setUserOffline(currentUserId);
    const handleUnload = () => setUserOffline(currentUserId);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);

    // Realtime subscription for ALL presence changes
    const channel = productSupabase
      .channel('presence:all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_presence' },
        (payload) => {
          const row = payload.new;
          if (row && row.user_id) {
            setPresenceMap(prev => ({
              ...prev,
              [row.user_id]: {
                is_online: row.is_online,
                last_seen: row.last_seen,
              },
            }));
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
      setUserOffline(currentUserId);
      productSupabase.removeChannel(channel);
    };
  }, [currentUserId, loadPresence]);

  /**
   * Get presence data for a specific user.
   * Returns { is_online: boolean, last_seen: string | null }
   */
  const getPresenceForUser = useCallback((userId) => {
    if (!userId) return { is_online: false, last_seen: null };
    return presenceMap[userId] || { is_online: false, last_seen: null };
  }, [presenceMap]);

  return {
    presenceMap,
    getPresenceForUser,
    refreshPresence: loadPresence,
  };
}
