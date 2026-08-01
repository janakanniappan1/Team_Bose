import { MOCK_MESSAGES } from '../data/mockData';

const CHATS_STORAGE_KEY = 'uniswap_chat_threads';

export const chatService = {
  getChatThreads: async () => {
    try {
      const saved = localStorage.getItem(CHATS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_MESSAGES;
    } catch (err) {
      console.error('Error fetching chat threads:', err);
      return MOCK_MESSAGES;
    }
  },

  sendMessage: async (chatId, messageText) => {
    try {
      const threads = await chatService.getChatThreads();
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  },

  createChatWithSeller: async (product) => {
    try {
      const threads = await chatService.getChatThreads();
      const existing = threads.find(t => t.itemTitle === product.title && t.sellerName === product.sellerName);
      if (existing) return existing;

      const newThread = {
        id: `chat-${product.id}-${Date.now()}`,
        sellerName: product.sellerName,
        sellerAvatar: product.sellerAvatar,
        itemTitle: product.title,
        itemPrice: product.price,
        itemImage: product.images[0],
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

      const updated = [newThread, ...threads];
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updated));
      return newThread;
    } catch (err) {
      console.error('Error creating chat thread:', err);
      throw err;
    }
  }
};
