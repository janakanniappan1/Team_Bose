import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

// ============================================================
// useNotifications — Updated to pass user.id (UUID) instead of username
// ============================================================

export function useNotifications(currentUser) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use UUID for notification filtering — falls back gracefully for guests
  const userId = currentUser?.id || currentUser?.authId || null;

  const fetchNotifs = async () => {
    const data = await notificationService.getNotifications(userId);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
    // Poll every 10s (reduced from 3s to lower DB load)
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const markAllRead = async () => {
    const updated = await notificationService.markAllAsRead(userId);
    setNotifications(updated);
  };

  const clearAll = async () => {
    const updated = await notificationService.clearAllNotifications(userId);
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
    addNotification,
    refreshNotifications: fetchNotifs,
  };
}
