import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    const data = await notificationService.getNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 3000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
  };

  const clearAll = async () => {
    const updated = await notificationService.clearAllNotifications();
    setNotifications(updated);
  };

  const addNotification = async (notif) => {
    await notificationService.addNotification(notif);
    await fetchNotifs();
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    clearAll,
    addNotification,
    refreshNotifications: fetchNotifs
  };
}
