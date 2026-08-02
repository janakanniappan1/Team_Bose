import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { productSupabase } from '../lib/supabase';

// ============================================================
// useNotifications — Realtime-enabled with individual delete support
// ============================================================

export function useNotifications(currentUser) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use UUID for notification filtering — falls back gracefully for guests
  const userId = currentUser?.id || currentUser?.authId || currentUser?.username || null;

  const fetchNotifs = async () => {
    const data = await notificationService.getNotifications(userId);
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();

    if (!userId) return;

    // Realtime subscription for instant notification delivery when User 1 messages User 2
    const channel = productSupabase
      .channel(`public:user_notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications'
        },
        () => {
          fetchNotifs();
        }
      )
      .subscribe();

    return () => {
      productSupabase.removeChannel(channel);
    };
  }, [userId]);

  const markAllRead = async () => {
    const updated = await notificationService.markAllAsRead(userId);
    setNotifications(updated);
  };

  const clearAll = async () => {
    const updated = await notificationService.clearAllNotifications(userId);
    setNotifications(updated);
  };

  const deleteNotification = async (notifId) => {
    const updated = await notificationService.deleteNotification(notifId, userId);
    setNotifications(updated);
  };

  const addNotification = async (notif) => {
    await notificationService.addNotification(notif);
    await fetchNotifs();
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    clearAll,
    deleteNotification,
    addNotification,
    refreshNotifications: fetchNotifs,
  };
}
