import { MOCK_MESSAGES } from '../data/mockData';
import { productSupabase } from '../lib/supabase';
import { notificationService } from './notificationService';

const CHATS_STORAGE_KEY = 'uniswap_chat_threads';

export const chatService = {
  /**
   * Fetch all chat threads & message history (Supabase DB + Local Storage)
   */
  getChatThreads: async () => {
    try {
      // 1. Fetch threads from Supabase
      const { data: threadsData, error: threadsError } = await productSupabase
        .from('chat_threads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!threadsError && threadsData && threadsData.length > 0) {
        // Fetch all messages for these threads
        const threadIds = threadsData.map(t => t.id);
        const { data: msgsData } = await productSupabase
          .from('chat_messages')
          .select('*')
          .in('thread_id', threadIds)
          .order('created_at', { ascending: true });

        const formatted = threadsData.map((t) => {
          const threadMsgs = (msgsData || [])
            .filter((m) => m.thread_id === t.id)
            .map((m) => ({
              id: m.id,
              sender: m.sender,
              text: m.text,
              time: m.sent_time || new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

          return {
            id: t.id,
            sellerName: t.seller_name,
            sellerDept: t.seller_dept || 'Campus Member',
            sellerPhone: t.seller_phone || '',
            sellerAvatar: t.seller_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
            itemTitle: t.item_title,
            itemPrice: t.item_price,
            itemImage: t.item_image,
            online: t.is_online !== false,
            lastMsgTime: t.last_msg_time || 'Recently',
            unreadCount: t.unread_count || 0,
            messages: threadMsgs.length > 0 ? threadMsgs : [
              { id: `init-${t.id}`, sender: 'seller', text: `Hi! Thanks for reaching out regarding "${t.item_title}".`, time: 'Just now' }
            ]
          };
        });

        // Save local backup & return
        localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn('[chatService] Falling back to local storage for chats:', err);
    }

    // Fallback to local storage or mock messages
    try {
      const saved = localStorage.getItem(CHATS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_MESSAGES;
    } catch {
      return MOCK_MESSAGES;
    }
  },

  /**
   * Send a new message in a thread (Persists to Supabase chat_messages)
   */
  sendMessage: async (chatId, messageText) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      // 1. Insert message into Supabase chat_messages table
      await productSupabase.from('chat_messages').insert([{
        thread_id: chatId.includes('-') && chatId.length > 30 ? chatId : null,
        sender: 'user',
        text: messageText,
        sent_time: timeStr
      }]);

      // 2. Update last message time on thread
      if (chatId.includes('-') && chatId.length > 30) {
        await productSupabase
          .from('chat_threads')
          .update({ last_msg_time: 'Just now' })
          .eq('id', chatId);
      }
    } catch (err) {
      console.warn('[chatService] Supabase send error, updating locally:', err);
    }

    // Update local storage thread
    const threads = await chatService.getChatThreads();
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageText,
      time: timeStr
    };
    
    const updated = threads.map(t => {
      if (t.id === chatId) {
        return {
          ...t,
          lastMsgTime: 'Just now',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Start a new chat with a seller (Persists to Supabase chat_threads)
   */
  createChatWithSeller: async (product) => {
    try {
      const threads = await chatService.getChatThreads();
      const existing = threads.find(t => t.itemTitle === product.title && t.sellerName === product.sellerName);
      if (existing) return existing;

      // 1. Create thread in Supabase
      const { data: newThreadData, error } = await productSupabase
        .from('chat_threads')
        .insert([{
          seller_name: product.sellerName || 'Campus Seller',
          seller_avatar: product.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          seller_dept: product.sellerDept || 'Student',
          seller_phone: product.sellerPhone || '',
          buyer_name: 'Jana K',
          item_title: product.title || 'Campus Item',
          item_price: Number(product.price) || 0,
          item_image: (product.images && product.images[0]) ? product.images[0] : '',
          is_online: true,
          unread_count: 0,
          last_msg_time: 'Just now'
        }])
        .select();

      if (!error && newThreadData && newThreadData[0]) {
        const threadId = newThreadData[0].id;
        const initialText = `Hi ${product.sellerName}! Is "${product.title}" still available for pickup?`;

        // Insert initial message
        await productSupabase.from('chat_messages').insert([{
          thread_id: threadId,
          sender: 'user',
          text: initialText,
          sent_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        // Add notification for new chat conversation
        await notificationService.addNotification({
          title: `New Message with ${product.sellerName} 💬`,
          message: `Conversation started regarding "${product.title}". Message history saved.`,
          type: 'message'
        });
      }
    } catch (err) {
      console.warn('[chatService] Error creating chat in Supabase:', err);
    }

    // Local fallback creation
    const threads = await chatService.getChatThreads();
    const newThread = {
      id: `chat-${product.id}-${Date.now()}`,
      sellerName: product.sellerName,
      sellerAvatar: product.sellerAvatar,
      itemTitle: product.title,
      itemPrice: product.price,
      itemImage: product.images ? product.images[0] : '',
      online: true,
      lastMsgTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          sender: 'user',
          text: `Hi ${product.sellerName}! Is "${product.title}" still available for pickup?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    // Add local notification
    await notificationService.addNotification({
      title: `New Message with ${product.sellerName} 💬`,
      message: `Conversation started regarding "${product.title}". Message history saved.`,
      type: 'message'
    });

    const updated = [newThread, ...threads];
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updated));
    return newThread;
  }
};

