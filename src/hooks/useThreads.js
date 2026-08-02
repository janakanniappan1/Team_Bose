import { useState, useEffect, useCallback } from 'react';
import { threadService } from '../services/threadService';
import { productSupabase } from '../lib/supabase';

// ============================================================
// useThreads — Adopted from Project 2 (chatdemo) pattern
//
// Features:
//   - Load all threads for current user on mount
//   - Realtime subscription to chat_threads AND chat_messages
//     so sidebar reorders instantly when new messages arrive
//   - Expose refreshThreads for manual refresh
// ============================================================

export function useThreads(currentUserId) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadThreads = useCallback(async () => {
    if (!currentUserId) {
      setThreads([]);
      setLoading(false);
      return;
    }

    try {
      const data = await threadService.getUserThreads(currentUserId);
      setThreads(data);
    } catch (err) {
      console.error('[useThreads] loadThreads error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadThreads();
    if (!currentUserId) return;

    // Subscribe to thread updates (last_message, unread counts, reorder)
    const channel = productSupabase
      .channel(`uc_threads:user:${currentUserId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uc_threads' },
        () => { loadThreads(); }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'uc_messages' },
        () => { loadThreads(); }
      )
      .subscribe();

    return () => {
      productSupabase.removeChannel(channel);
    };
  }, [currentUserId, loadThreads]);

  return {
    threads,
    setThreads,
    loading,
    refreshThreads: loadThreads,
  };
}
