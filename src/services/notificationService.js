import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { productSupabase } from '../lib/supabase';

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
    const localNotifs = getStoredNotifs();
    try {
      const { data, error } = await productSupabase
        .from('user_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const dbNotifs = data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'message',
          unread: n.unread !== false,
          time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
        }));

        const dbIds = new Set(dbNotifs.map(n => n.id));
        const merged = [...dbNotifs, ...localNotifs.filter(n => !dbIds.has(n.id))];
        localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('[notificationService] Supabase read fallback:', err);
    }
    return localNotifs;
  },

  markAllAsRead: async () => {
    try {
      await productSupabase
        .from('user_notifications')
        .update({ unread: false })
        .eq('unread', true);
    } catch (err) {
      console.warn('[notificationService] Supabase update fallback:', err);
    }

    const current = getStoredNotifs();
    const updated = current.map(n => ({ ...n, unread: false }));
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  clearAllNotifications: async () => {
    try {
      await productSupabase.from('user_notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      console.warn('[notificationService] Supabase clear fallback:', err);
    }
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify([]));
    return [];
  },

  addNotification: async (notif) => {
    const title = notif.title || 'New Message Received 💬';
    const message = notif.message || notif.desc || 'A buyer sent a new message regarding your listing.';
    const notifType = notif.type || 'message';

    // 1. Insert into Supabase user_notifications table
    try {
      await productSupabase.from('user_notifications').insert([{
        username: notif.username || 'Jana K',
        title: title,
        message: message,
        type: notifType,
        unread: true
      }]);
    } catch (err) {
      console.warn('[notificationService] Supabase insert fallback:', err);
    }

    // 2. Insert into LocalStorage
    const current = getStoredNotifs();
    const newNotif = {
      id: `notif-${Date.now()}`,
      unread: true,
      time: 'Just now',
      title: title,
      message: message,
      type: notifType
    };
    const updated = [newNotif, ...current];
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updated));
    return newNotif;
  }
};

