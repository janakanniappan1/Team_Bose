import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export function useNotifications(currentUser) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    const userIdentifier = currentUser?.fullName || currentUser?.username || 'User';
    const data = await notificationService.getNotifications(userIdentifier);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 3000);
    return () => clearInterval(interval);
  }, [currentUser?.fullName, currentUser?.username]);

  const markAllRead = async () => {
    const userIdentifier = currentUser?.fullName || currentUser?.username || 'User';
    const updated = await notificationService.markAllAsRead(userIdentifier);
    setNotifications(updated);
  };

  const clearAll = async () => {
    const userIdentifier = currentUser?.fullName || currentUser?.username || 'User';
    const updated = await notificationService.clearAllNotifications(userIdentifier);
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

