import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

export function useChats(initialChat = null) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(initialChat);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    chatService.getChatThreads().then((threads) => {
      if (isMounted) {
        setChats(threads);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const sendMessage = async (chatId, messageText) => {
    const updated = await chatService.sendMessage(chatId, messageText);
    setChats(updated);
    if (activeChat && activeChat.id === chatId) {
      const updatedActive = updated.find((c) => c.id === chatId);
      setActiveChat(updatedActive);
    }
  };

  const startChatWithSeller = async (product, currentUser = null) => {
    const thread = await chatService.createChatWithSeller(product, currentUser);
    setActiveChat(thread);
    return thread;
  };

  return {
    chats,
    activeChat,
    setActiveChat,
    loading,
    sendMessage,
    startChatWithSeller
  };
}
