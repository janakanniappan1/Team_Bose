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
  getNotifications: async (userIdentifier = 'User') => {
    const localNotifs = getStoredNotifs();
    const myName = userIdentifier.toLowerCase();
    const myFirstName = userIdentifier.split(' ')[0].toLowerCase();

    try {
      const { data, error } = await productSupabase
        .from('user_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Filter DB notifications for THIS logged in user
        const dbNotifs = data
          .filter((n) => {
            const notifUser = (n.username || '').toLowerCase();
            return notifUser.includes(myFirstName) || notifUser.includes(myName) || myName.includes(notifUser);
          })
          .map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || 'message',
            unread: n.unread !== false,
            time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
          }));

        return dbNotifs;
      }
    } catch (err) {
      console.warn('[notificationService] Supabase read fallback:', err);
    }

    // Filter local storage notifications for THIS logged in user
    return localNotifs.filter((n) => {
      if (!n.targetUser) return true; // general announcements
      const notifUser = n.targetUser.toLowerCase();
      return notifUser.includes(myFirstName) || notifUser.includes(myName);
    });
  },

  markAllAsRead: async (userIdentifier = 'User') => {
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

  clearAllNotifications: async (userIdentifier = 'User') => {
    try {
      await productSupabase.from('user_notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      console.warn('[notificationService] Supabase clear fallback:', err);
    }
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify([]));
    return [];
  },

  addNotification: async (notif) => {
    const targetUsername = notif.username || notif.targetUser || 'Jana K';
    const title = notif.title || 'New Message Received 💬';
    const message = notif.message || notif.desc || 'A buyer sent a new message regarding your listing.';
    const notifType = notif.type || 'message';

    // 1. Insert into Supabase user_notifications table for the RECIPIENT
    try {
      await productSupabase.from('user_notifications').insert([{
        username: targetUsername,
        title: title,
        message: message,
        type: notifType,
        unread: true
      }]);
    } catch (err) {
      console.warn('[notificationService] Supabase insert fallback:', err);
    }

    // 2. Insert into LocalStorage with targetUser field
    const current = getStoredNotifs();
    const newNotif = {
      id: `notif-${Date.now()}`,
      targetUser: targetUsername,
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

