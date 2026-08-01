import { MOCK_NOTIFICATIONS } from '../data/mockData';

const NOTIFS_STORAGE_KEY = 'uniswap_notifications';

const getStoredNotifs = () => {
  try {
    const saved = localStorage.getItem(NOTIFS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  } catch (err) {
    return MOCK_NOTIFICATIONS;
  }
};

export const notificationService = {
  getNotifications: async () => {
    return getStoredNotifs();
  },

  markAllAsRead: async () => {
    const current = getStoredNotifs();
    const updated = current.map(n => ({ ...n, unread: false }));
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  clearAllNotifications: async () => {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify([]));
    return [];
  },

  addNotification: async (notif) => {
    const current = getStoredNotifs();
    const newNotif = {
      id: `notif-${Date.now()}`,
      unread: true,
      time: 'Just now',
      title: notif.title || 'Marketplace Alert',
      message: notif.message || notif.desc || 'New marketplace activity.',
      type: notif.type || 'message'
    };
    const updated = [newNotif, ...current];
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updated));
    return newNotif;
  }
};
