import { useState, useEffect } from 'react';
import { threadService } from '../services/threadService';
import { productSupabase } from '../lib/supabase';

export function useThreads(currentUserId, currentUser = null) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Initial fetch
    threadService.getThreads(currentUserId, currentUser).then((data) => {
      if (isMounted) {
        setThreads(data);
        setLoading(false);
      }
    });

    // Real-time subscription to chat_threads
    const channel = productSupabase
      .channel(`user_threads_${currentUserId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_threads'
        },
        async () => {
          const updated = await threadService.getThreads(currentUserId, currentUser);
          if (isMounted) {
            setThreads(updated);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      productSupabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return { threads, setThreads, loading };
}
