import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { productSupabase } from '../lib/supabase';

// ============================================================
// notificationService — Fixed to use user_id UUID for identity
// Self-notification guard now uses UUID comparison, not username
// ============================================================

const NOTIFS_STORAGE_KEY = 'uniswap_notifications';

const getStoredNotifs = () => {
  try {
    const saved = localStorage.getItem(NOTIFS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  } catch {
    return MOCK_NOTIFICATIONS;
  }
};

export const notificationService = {

  getNotifications: async (userId) => {
    // Fetch from Supabase using user_id UUID if available
    if (userId) {
      try {
        const { data, error } = await productSupabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || 'message',
            unread: n.unread !== false,
            time: n.created_at
              ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Recently',
          }));
        }
      } catch (err) {
        console.warn('[notificationService] Supabase read fallback:', err);
      }
    }

    // Fallback to localStorage (filtered by user_id)
    const localNotifs = getStoredNotifs();
    return localNotifs.filter(n => !n.targetUserId || n.targetUserId === userId);
  },

  markAllAsRead: async (userId) => {
    try {
      if (userId) {
        await productSupabase
          .from('user_notifications')
          .update({ unread: false })
          .eq('user_id', userId)
          .eq('unread', true);
      }
    } catch (err) {
      console.warn('[notificationService] Supabase markAllAsRead fallback:', err);
    }

    const current = getStoredNotifs();
    const updated = current.map(n => ({ ...n, unread: false }));
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  clearAllNotifications: async (userId) => {
    try {
      if (userId) {
        await productSupabase
          .from('user_notifications')
          .delete()
          .eq('user_id', userId);
      }
    } catch (err) {
      console.warn('[notificationService] Supabase clear fallback:', err);
    }
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify([]));
    return [];
  },

  /**
   * Insert a notification for the RECEIVER only.
   * Self-notification guard uses UUID comparison — never fires for sender.
   *
   * @param {object} notif
   *   - receiverUserId: UUID of the message receiver
   *   - senderUserId:   UUID of the message sender
   *   - title, message, type
   */
  addNotification: async (notif) => {
    const receiverUserId = notif.receiverUserId || notif.userId;
    const senderUserId = notif.senderUserId;

    // ✅ UUID-based self-notification guard
    if (!receiverUserId) return null;
    if (senderUserId && receiverUserId === senderUserId) {
      return null; // Never notify the sender about their own message
    }

    const title = notif.title || 'New Message Received 💬';
    const message = notif.message || 'You have a new message.';
    const notifType = notif.type || 'message';

    try {
      await productSupabase.from('user_notifications').insert([{
        user_id: receiverUserId,
        username: notif.receiverUsername || 'User',
        title,
        message,
        type: notifType,
        unread: true,
      }]);
    } catch (err) {
      console.warn('[notificationService] Supabase insert fallback:', err);
    }

    // Also persist to localStorage
    const current = getStoredNotifs();
    const newNotif = {
      id: `notif-${Date.now()}`,
      targetUserId: receiverUserId,
      unread: true,
      time: 'Just now',
      title,
      message,
      type: notifType,
    };
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify([newNotif, ...current]));
    return newNotif;
  },
};
