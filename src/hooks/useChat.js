import { useState, useEffect } from 'react';
import { useThreads } from './useThreads';
import { useRealtimeMessages } from './useRealtimeMessages';
import { usePresence } from './usePresence';
import { useTyping } from './useTyping';
import { threadService } from '../services/threadService';

export function useChat(currentUser, initialThreadId = null) {
  const currentUserId = currentUser?.id || currentUser?.uuid || currentUser?.username || 'user-guest';
  const myName = (currentUser?.fullName || currentUser?.username || 'User').toLowerCase().trim();
  const myFirstName = myName.split(' ')[0];

  const { threads, setThreads, loading: threadsLoading } = useThreads(currentUserId, currentUser);
  const [activeThreadId, setActiveThreadId] = useState(initialThreadId);

  // Sync initialThreadId
  useEffect(() => {
    if (initialThreadId) {
      setActiveThreadId(initialThreadId);
    } else if (threads.length > 0 && !activeThreadId) {
      setActiveThreadId(threads[0].id);
    }
  }, [initialThreadId, threads]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0] || null;

  // Robust opponent profile resolution (works with UUIDs and username sessions)
  const getOpponentProfile = (thread) => {
    if (!thread) return null;
    if (thread.seller && thread.buyer && (thread.seller.id || thread.buyer.id)) {
      return thread.buyer_id === currentUserId ? thread.seller : thread.buyer;
    }

    const sellerName = thread.sellerName || thread.seller_name || 'Jana';
    const buyerName = thread.buyerName || thread.buyer_name || 'Rizwan Ahamed';

    const isSellerMe = sellerName.toLowerCase().includes(myFirstName) || (thread.seller_id && thread.seller_id === currentUserId);

    let contactName = isSellerMe ? buyerName : sellerName;
    if (contactName.toLowerCase().includes(myFirstName)) {
      contactName = myFirstName.includes('jana') ? 'Rizwan Ahamed' : 'Jana';
    }

    const avatar = isSellerMe 
      ? (thread.buyerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80')
      : (thread.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80');

    return {
      id: isSellerMe ? (thread.buyer_id || 'buyer-1') : (thread.seller_id || 'seller-1'),
      full_name: contactName,
      username: contactName.toLowerCase().replace(/\s+/g, '_'),
      avatar_url: avatar
    };
  };

  const opponentProfile = getOpponentProfile(activeThread);
  const targetUserId = opponentProfile?.id || null;

  const {
    messages,
    loading: messagesLoading,
    hasMore,
    loadMoreMessages,
    addOptimisticMessage
  } = useRealtimeMessages(activeThreadId, currentUserId);

  const targetPresence = usePresence(currentUserId, targetUserId);
  const { isTargetTyping, handleTyping, stopTyping } = useTyping(activeThreadId, currentUserId, targetUserId);

  // Reset unread count when switching active conversation
  useEffect(() => {
    if (activeThreadId && currentUserId) {
      threadService.resetUnreadCount(activeThreadId, currentUserId);
    }
  }, [activeThreadId, currentUserId]);

  return {
    currentUserId,
    threads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    opponentProfile,
    messages,
    messagesLoading,
    threadsLoading,
    hasMore,
    loadMoreMessages,
    addOptimisticMessage,
    targetPresence,
    isTargetTyping,
    handleTyping,
    stopTyping
  };
}
