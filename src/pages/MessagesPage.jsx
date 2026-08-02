import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { chatService } from '../services/chatService';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessages } from '../components/chat/ChatMessages';
import { MessageInput } from '../components/chat/MessageInput';
import { MessageSquare, ArrowLeft, ShieldCheck } from 'lucide-react';

export function MessagesPage({ currentUser, initialThreadId, onGoBack, onOpenProduct }) {
  const {
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
    handleTyping
  } = useChat(currentUser, initialThreadId);

  const [showMobileChat, setShowMobileChat] = useState(!!initialThreadId);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  const handleSelectThread = (threadId) => {
    setActiveThreadId(threadId);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (text) => {
    if (!activeThreadId || !currentUserId || !opponentProfile?.id) return;

    const receiverId = opponentProfile.id;
    const tempId = `temp_${Date.now()}`;

    // Optimistic UI message insert
    const optimisticMsg = {
      id: tempId,
      thread_id: activeThreadId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      message: text,
      message_type: 'text',
      is_seen: false,
      is_delivered: true,
      created_at: new Date().toISOString()
    };

    addOptimisticMessage(optimisticMsg);

    // Send to Supabase DB
    await chatService.sendMessage({
      threadId: activeThreadId,
      senderId: currentUserId,
      receiverId,
      message: text,
      messageType: 'text'
    });
  };

  const handleSendImage = async (imageFile) => {
    if (!activeThreadId || !currentUserId || !opponentProfile?.id) return;

    const imageUrl = await chatService.uploadChatImage(imageFile);
    if (!imageUrl) return;

    const receiverId = opponentProfile.id;

    await chatService.sendMessage({
      threadId: activeThreadId,
      senderId: currentUserId,
      receiverId,
      message: '📷 Photo',
      messageType: 'image',
      imageUrl
    });
  };

  const handleMakeOfferSubmit = async () => {
    if (!offerAmount || !activeThreadId || !currentUserId || !opponentProfile?.id) return;

    await chatService.sendMessage({
      threadId: activeThreadId,
      senderId: currentUserId,
      receiverId: opponentProfile.id,
      message: `Made price offer of ₹${offerAmount}`,
      messageType: 'offer_card',
      metadata: {
        offerAmount,
        status: 'pending'
      }
    });

    setOfferModalOpen(false);
    setOfferAmount('');
  };

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <div className="card glass-panel p-5 max-w-md mx-auto">
          <ShieldCheck size={48} className="text-primary mx-auto mb-3" />
          <h3 className="font-heading mb-2">Login Required</h3>
          <p className="text-muted mb-4">Please log in to access your direct messages and campus inquiries.</p>
          <button className="btn btn-primary mx-auto" onClick={onGoBack}>Back to Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page-container py-3 animate-fade-in">
      <div className="container">
        
        {/* Navigation Bar */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <button className="btn btn-outline btn-sm" onClick={onGoBack}>
            <ArrowLeft size={16} />
            <span>Back to Marketplace</span>
          </button>
          
          <span className="text-muted hide-mobile" style={{ fontSize: '0.82rem' }}>
            🔒 Safe Campus Direct • 100% End-to-End Realtime Messaging
          </span>
        </div>

        {/* Main Workspace Split Card */}
        <div className="chat-split-card card glass-panel shadow-lg overflow-hidden d-flex flex-row" style={{ height: '780px', borderRadius: '16px' }}>
          
          {/* Left Sidebar */}
          <div className={`chat-sidebar-wrapper ${showMobileChat ? 'hide-mobile' : ''}`} style={{ flex: '0 0 340px' }}>
            <ChatSidebar
              threads={threads}
              activeThreadId={activeThreadId}
              onSelectThread={handleSelectThread}
              currentUserId={currentUserId}
              currentUser={currentUser}
            />
          </div>

          {/* Right Main Chat Window */}
          <div className={`chat-window-wrapper flex-1 d-flex flex-column ${!showMobileChat ? 'hide-mobile' : ''}`} style={{ backgroundColor: '#FFFFFF' }}>
            {activeThread && opponentProfile ? (
              <>
                <ChatHeader
                  opponent={opponentProfile}
                  targetPresence={targetPresence}
                  onGoBack={() => setShowMobileChat(false)}
                  onToggleInfo={() => {}}
                  onCall={() => alert(`Connecting call to ${opponentProfile.full_name}...`)}
                />

                <ChatMessages
                  messages={messages}
                  currentUserId={currentUserId}
                  isTargetTyping={isTargetTyping}
                  opponentName={opponentProfile.full_name || opponentProfile.username}
                  hasMore={hasMore}
                  loadMoreMessages={loadMoreMessages}
                  loading={messagesLoading}
                />

                <MessageInput
                  onSendMessage={handleSendMessage}
                  onSendImage={handleSendImage}
                  onTyping={handleTyping}
                  onMakeOffer={() => setOfferModalOpen(true)}
                />
              </>
            ) : (
              /* Instagram Direct Empty Inbox View */
              <div className="flex-1 d-flex flex-column align-items-center justify-content-center p-5 text-center">
                <div 
                  className="mb-3 d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#EEF2FF', color: '#C85A32' }}
                >
                  <MessageSquare size={40} />
                </div>
                <h3 className="font-heading mb-2" style={{ fontSize: '1.4rem' }}>Your Direct Conversations</h3>
                <p className="text-muted mb-4 max-w-sm" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Send private messages and make price offers directly to student buyers and campus sellers.
                </p>
                <button className="btn btn-primary" onClick={onGoBack}>
                  Explore Campus Listings
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Offer Modal */}
      {offerModalOpen && (
        <div className="modal-overlay d-flex align-items-center justify-content-center p-3" style={{ position: 'fixed', inset: 0, zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="card glass-panel p-4 max-w-sm w-100" style={{ borderRadius: '16px' }}>
            <h4 className="font-heading mb-3" style={{ fontSize: '1.1rem' }}>Make Price Offer</h4>
            <div className="form-group mb-3">
              <label className="form-label">Offer Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter your price offer..."
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-end gap-2">
              <button className="btn btn-outline btn-sm" onClick={() => setOfferModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleMakeOfferSubmit}>Submit Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
