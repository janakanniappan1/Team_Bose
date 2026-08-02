import { useState, useEffect } from 'react';
import { threadService } from '../services/threadService';
import { productSupabase } from '../lib/supabase';

export function useThreads(currentUserId) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setThreads([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Initial fetch
    threadService.getThreads(currentUserId).then((data) => {
      if (isMounted) {
        setThreads(data);
        setLoading(false);
      }
    });

    // Real-time subscription to chat_threads
    const channel = productSupabase
      .channel(`user_threads_${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_threads'
        },
        async () => {
          const updated = await threadService.getThreads(currentUserId);
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
