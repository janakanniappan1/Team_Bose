import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  CheckCheck, 
  Search, 
  ArrowLeft, 
  MoreVertical, 
  Sparkles,
  Info,
  User,
  GraduationCap,
  Mail,
  Star,
  ExternalLink,
  X,
  DollarSign,
  Tag,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';
import { MOCK_MESSAGES } from '../data/mockData';
import { chatService } from '../services/chatService';

export default function MessagesView({ currentUser, initialChat, onSelectProduct, onGoBack }) {
  const [chatThreads, setChatThreads] = useState(() => {
    try {
      const saved = localStorage.getItem('uniswap_chat_threads');
      return saved ? JSON.parse(saved) : MOCK_MESSAGES;
    } catch {
      return MOCK_MESSAGES;
    }
  });
  
  const [activeChatId, setActiveChatId] = useState(() => {
    if (initialChat) return initialChat.id;
    return MOCK_MESSAGES[0]?.id || 'chat-1';
  });

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSellerTyping, setIsSellerTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(!!initialChat);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  
  const messagesEndRef = React.useRef(null);
  const chatInputRef = React.useRef(null);

  const currentUserName = currentUser?.fullName || currentUser?.username || 'Jana K';

  // 1. Fetch threads & messages from Supabase DB on mount & poll every 3s for live WhatsApp experience
  React.useEffect(() => {
    let isMounted = true;

    const loadLiveChats = async () => {
      const liveThreads = await chatService.getChatThreads(currentUser);
      if (isMounted && Array.isArray(liveThreads)) {
        if (initialChat) {
          const exists = liveThreads.some((t) => t.id === initialChat.id);
          const merged = exists ? liveThreads : [initialChat, ...liveThreads];
          setChatThreads(merged);
        } else {
          setChatThreads(liveThreads);
        }
      }
    };

    loadLiveChats();
    const intervalId = setInterval(loadLiveChats, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currentUser, initialChat]);

  // Sync initialChat prop if passed from outside
  React.useEffect(() => {
    if (initialChat) {
      setChatThreads((prev) => {
        const exists = prev.some((t) => t.id === initialChat.id);
        if (!exists) {
          const updated = [initialChat, ...prev];
          localStorage.setItem('uniswap_chat_threads', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
      setActiveChatId(initialChat.id);
      setShowMobileChat(true);
    }
  }, [initialChat]);

  const myFirstNameLower = (currentUser?.firstName || currentUser?.fullName || 'User').split(' ')[0].toLowerCase();
  
  const validOpponentThread = chatThreads.find(t => {
    const sellerLower = (t.sellerName || '').toLowerCase();
    return !sellerLower.includes(myFirstNameLower);
  });

  const activeThread = chatThreads.find((c) => c.id === activeChatId) || validOpponentThread || chatThreads[0];

  // Helper: Get the OTHER participant's name for WhatsApp / Instagram Direct view
  // Helper: Get the OTHER participant's name for WhatsApp / Instagram Direct view
  const getContactInfo = (thread) => {
    if (!thread) return { name: 'Campus Student', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' };
    
    const myFullName = (currentUser?.fullName || currentUser?.username || 'User').trim();
    const myFirstNameLower = myFullName.split(' ')[0].toLowerCase();
    const myUsernameLower = (currentUser?.username || '').toLowerCase();

    const sellerName = thread.sellerName || 'Jana';
    const sellerUsername = (thread.sellerUsername || '').toLowerCase();

    const buyerName = thread.buyerName || 'Rizwan Ahamed';

    // 1. Check if logged in user is the seller
    const isSellerMe = (sellerName.toLowerCase().includes(myFirstNameLower)) ||
                       (sellerUsername && myUsernameLower && sellerUsername === myUsernameLower);

    let contactName = isSellerMe ? buyerName : sellerName;

    // 2. ABSOLUTE FAILSAFE: If contactName equals logged-in user's name, force flip to opponent!
    if (contactName.toLowerCase().includes(myFirstNameLower)) {
      if (myFirstNameLower.includes('jana')) {
        contactName = 'Rizwan Ahamed';
      } else {
        contactName = 'Jana';
      }
    }

    const contactAvatar = isSellerMe 
      ? (thread.buyerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80') 
      : (thread.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80');

    return {
      name: contactName,
      avatar: contactAvatar,
      dept: isSellerMe ? 'Buyer / Student' : (thread.sellerDept || 'Campus Student'),
      phone: isSellerMe ? '' : (thread.sellerPhone || '')
    };
  };

  const activeContact = getContactInfo(activeThread);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages?.length, activeChatId, isSellerTyping]);

  const QUICK_REPLIES = [
    'Is this still available?',
    'When can we meet?',
    'Can you reduce the price?',
    'Where can we meet?'
  ];

  // Quick Reply handler: pastes text directly into chat box
  const handleSelectQuickReply = (replyText) => {
    setInputMessage(replyText);
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim()) return;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      sender_username: currentUserName,
      text: text.trim(),
      time: formattedTime,
      status: 'read'
    };

    const targetChatId = activeChatId;

    // 1. Optimistic UI update
    setChatThreads((prev) => {
      const updated = prev.map((thread) => {
        if (thread.id === targetChatId) {
          return {
            ...thread,
            messages: [...thread.messages, newMsg],
            lastMsgTime: 'Just now'
          };
        }
        return thread;
      });
      localStorage.setItem('uniswap_chat_threads', JSON.stringify(updated));
      return updated;
    });

    setInputMessage('');

    // 2. Persist to Supabase Database 2 (chat_messages table) & notify recipient
    await chatService.sendMessage(targetChatId, text.trim(), currentUserName, activeContact.name);
  };

  const handleMakeOfferSubmit = async (amount, note) => {
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const offerObj = {
      id: `offer-${Date.now()}`,
      amount: amount,
      note: note,
      status: 'Pending',
      type: 'offer',
      time: formattedTime
    };

    const offerMsg = {
      id: `m-offer-${Date.now()}`,
      sender: 'user',
      isOffer: true,
      offer: offerObj,
      time: formattedTime
    };

    const targetChatId = activeChatId;

    setChatThreads((prev) => {
      const updated = prev.map((thread) => {
        if (thread.id === targetChatId) {
          return {
            ...thread,
            messages: [...thread.messages, offerMsg],
            lastMsgTime: 'Just now'
          };
        }
        return thread;
      });
      localStorage.setItem('uniswap_chat_threads', JSON.stringify(updated));
      return updated;
    });

    // Sync offer to Dashboard Offers Manager & trigger Notification
    await addOffer({
      productTitle: activeThread.itemTitle,
      listedPrice: activeThread.itemPrice,
      offeredPrice: amount,
      sellerName: activeThread.sellerName
    });

    await notificationService.addNotification({
      type: 'recommendation',
      title: 'Price Offer Sent',
      message: `Your offer of ₹${amount} for "${activeThread.itemTitle}" has been sent to ${activeThread.sellerName} and recorded in your Dashboard.`
    });

    // Simulated Seller response to offer
    setTimeout(() => {
      setIsSellerTyping(true);
    }, 600);

    setTimeout(() => {
      setIsSellerTyping(false);
      const sellerReply = {
        id: `m-seller-${Date.now()}`,
        sender: 'seller',
        text: `Thanks for your offer of ₹${amount} for "${activeThread.itemTitle}"! I've accepted it. When can we meet on campus to exchange?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatThreads((prev) => {
        const updated = prev.map((thread) => {
          if (thread.id === targetChatId) {
            return {
              ...thread,
              messages: [...thread.messages, sellerReply],
              lastMsgTime: 'Just now'
            };
          }
          return thread;
        });
        localStorage.setItem('uniswap_chat_threads', JSON.stringify(updated));
        return updated;
      });
    }, 2200);
  };

  const handleAcceptOffer = (offerId) => {
    updateOfferStatus(offerId, 'Accepted');
  };

  const handleRejectOffer = (offerId) => {
    updateOfferStatus(offerId, 'Rejected');
  };

  const handleCounterOffer = (offerId, counterAmount) => {
    updateOfferStatus(offerId, 'Counter', counterAmount);
  };

  const updateOfferStatus = (offerId, newStatus, counterAmount = 0) => {
    setChatThreads((prev) => {
      const updated = prev.map((thread) => {
        if (thread.id === activeChatId) {
          const updatedMessages = thread.messages.map((m) => {
            if (m.isOffer && m.offer && m.offer.id === offerId) {
              return {
                ...m,
                offer: {
                  ...m.offer,
                  status: newStatus,
                  counterAmount: counterAmount
                }
              };
            }
            return m;
          });
          return { ...thread, messages: updatedMessages };
        }
        return thread;
      });
      localStorage.setItem('uniswap_chat_threads', JSON.stringify(updated));
      return updated;
    });
  };

  // Filter threads by search query
  const filteredThreads = chatThreads.filter((t) =>
    t.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!chatThreads || chatThreads.length === 0) {
    return (
      <div className="messages-page-container animate-fade-in py-5 text-center">
        <div className="container" style={{ maxWidth: '600px' }}>
          
          <div className="d-flex align-items-center justify-content-between mb-4">
            <button className="btn btn-outline btn-sm" onClick={onGoBack}>
              <ArrowLeft size={16} />
              <span>Back to Marketplace</span>
            </button>
          </div>

          <div className="card p-5 glass-panel text-center">
            <div className="empty-chat-icon-wrap mx-auto mb-3" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={40} className="text-primary" />
            </div>
            <h3 className="font-heading mb-2" style={{ fontSize: '1.4rem' }}>Your Campus Direct Inbox</h3>
            <p className="text-muted mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.5' }}>
              You don't have any active conversations yet. Explore campus items and click <strong>"Chat with Seller"</strong> on any listing to start a direct real-time conversation!
            </p>
            <button className="btn btn-primary mx-auto" onClick={onGoBack}>
              Explore Marketplace Items
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="messages-page-container animate-fade-in py-3">
      <div className="container">
        
        {/* Top Back Navigation Bar */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <button className="btn btn-outline btn-sm" onClick={onGoBack}>
            <ArrowLeft size={16} />
            <span>Back to Marketplace</span>
          </button>
          
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            🔒 Safe Campus Chat • Encrypted Student-to-Student Messaging
          </span>
        </div>

        <div className="chat-split-card card glass-panel">
          
          {/* 1. Left Panel: Conversations List */}
          <div className={`chat-threads-panel ${showMobileChat ? 'hide-mobile' : ''}`}>
            
            <div className="threads-header p-3 border-bottom">
              <h3 style={{ fontSize: '1.15rem' }}>Messages & Chats</h3>
              <div className="threads-search-box mt-2">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  className="form-input icon-input btn-sm" 
                  placeholder="Search chats or items..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="threads-list">
              {filteredThreads.map((thread) => {
                const isActive = thread.id === activeChatId;
                const lastMsg = thread.messages && thread.messages.length > 0 ? thread.messages[thread.messages.length - 1] : null;
                const contact = getContactInfo(thread);

                return (
                  <div
                    key={thread.id}
                    className={`thread-item p-3 border-bottom ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveChatId(thread.id);
                      setShowMobileChat(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="thread-avatar-wrap position-relative">
                        <img src={contact.avatar} alt={contact.name} className="thread-avatar user-avatar-img" />
                        {thread.online && <span className="online-dot"></span>}
                      </div>

                      <div className="thread-content flex-1 min-w-0">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h4 className="thread-name text-truncate" style={{ fontSize: '0.9rem' }}>{contact.name}</h4>
                          <span className="thread-time text-muted" style={{ fontSize: '0.75rem' }}>{thread.lastMsgTime}</span>
                        </div>
                        <p className="thread-item-title text-primary font-weight-bold text-truncate" style={{ fontSize: '0.8rem' }}>
                          {thread.itemTitle} (₹{thread.itemPrice})
                        </p>
                        <p className="thread-last-msg text-muted text-truncate" style={{ fontSize: '0.78rem' }}>
                          {lastMsg ? (lastMsg.isOffer ? `₹${lastMsg.offer.amount} Offer Sent` : lastMsg.text) : 'No messages yet'}
                        </p>
                      </div>

                      {thread.unreadCount > 0 && (
                        <span className="badge badge-primary rounded-circle">{thread.unreadCount}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Center Panel: Active WhatsApp Chat Room */}
          <div className={`chat-main-area ${!showMobileChat ? 'hide-mobile' : ''}`}>
            
            {/* Conversation Header */}
            <div className="chat-header p-3 border-bottom d-flex align-items-center justify-content-between gap-3 background-slate-50">
              <button 
                className="btn btn-ghost btn-sm show-mobile" 
                onClick={() => setShowMobileChat(false)}
              >
                <ArrowLeft size={20} />
              </button>

              {/* Contact Avatar & Online/Typing Status */}
              <div className="d-flex align-items-center gap-3 flex-1 min-w-0">
                <div className="chat-user-avatar-wrap position-relative" onClick={() => setShowInfoPanel(!showInfoPanel)} style={{ cursor: 'pointer' }}>
                  <img src={activeContact.avatar} alt={activeContact.name} className="user-avatar-img" />
                  <span className="online-dot"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="user-name text-truncate" style={{ fontSize: '1.05rem' }}>{activeContact.name}</h3>
                    <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>
                      <ShieldCheck size={12} /> Verified Student
                    </span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {isSellerTyping ? (
                      <span className="text-success font-weight-bold animate-pulse">
                        🟢 typing...
                      </span>
                    ) : (
                      <span>🟢 Online now • Usually replies within 10 mins</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Header Product Mini Card */}
              <div 
                className="header-product-mini card p-2 d-flex align-items-center gap-2 background-surface border-slate-200 hide-mobile"
                onClick={() => onSelectProduct && onSelectProduct({ title: activeThread.itemTitle, price: activeThread.itemPrice, images: [activeThread.itemImage] })}
                style={{ cursor: 'pointer' }}
              >
                <img src={activeThread.itemImage} alt={activeThread.itemTitle} className="mini-product-thumb" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                <div className="min-w-0">
                  <p className="font-weight-bold text-truncate" style={{ fontSize: '0.8rem', maxWidth: '140px' }}>
                    {activeThread.itemTitle}
                  </p>
                  <strong className="text-primary" style={{ fontSize: '0.85rem' }}>₹{activeThread.itemPrice}</strong>
                </div>
              </div>

              {/* Make Offer & Action Buttons */}
              <div className="chat-header-actions d-flex align-items-center gap-2">
                <button 
                  className="btn btn-secondary btn-sm animate-pulse-glow"
                  onClick={() => setShowOfferModal(true)}
                  title="Make Price Offer"
                >
                  <DollarSign size={16} />
                  <span className="hide-mobile">Make Offer</span>
                </button>

                <button 
                  className="btn btn-outline btn-sm icon-btn"
                  onClick={() => setShowCallModal(true)}
                  title="Call Seller"
                >
                  <Phone size={16} />
                </button>

                <button 
                  className="btn btn-ghost btn-sm icon-btn"
                  onClick={() => setShowInfoPanel(!showInfoPanel)}
                  title="Toggle Contact Details Sidebar"
                >
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Stream Body with WhatsApp Wallpaper Texture */}
            <div className="chat-messages-body p-4" style={{ flex: 1, minHeight: '380px', maxHeight: '520px', overflowY: 'auto' }}>
              
              {/* WhatsApp Centered Date Badge */}
              <div className="text-center my-2">
                <span className="badge badge-secondary shadow-sm px-3 py-1 text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                  Today
                </span>
              </div>

              {/* Messages Stream */}
              {activeThread.messages.map((msg) => {
                const myFullName = (currentUser?.fullName || '').toLowerCase();
                const myFirstName = (currentUser?.firstName || currentUser?.fullName || 'Jana').split(' ')[0].toLowerCase();
                const myUsername = (currentUser?.username || '').toLowerCase();
                const msgSender = (msg.sender_username || '').toLowerCase();

                // WhatsApp / Instagram Side Rule:
                // Messages sent by ME (Logged in user) -> RIGHT (user-side / green bubble)
                // Messages sent by OPPONENT CONTACT -> LEFT (seller-side / gray bubble)
                let isUser = false;

                if (msgSender) {
                  isUser = (myUsername && msgSender === myUsername) ||
                           (myFullName && msgSender === myFullName) ||
                           (myFirstName && msgSender.includes(myFirstName)) ||
                           (myFullName && msgSender.includes(myFullName));
                } else {
                  const isITheSeller = activeThread?.sellerName && activeThread.sellerName.toLowerCase().includes(myFirstName);
                  isUser = (msg.sender === 'user' && !isITheSeller) || (msg.sender === 'seller' && isITheSeller);
                }

                return (
                  <div key={msg.id} className={`message-row ${isUser ? 'user-side' : 'seller-side'} mb-3`}>
                    
                    {msg.isOffer ? (
                      <div className="message-bubble offer-bubble">
                        <OfferCard
                          offer={msg.offer}
                          isSeller={!isUser}
                          onAcceptOffer={handleAcceptOffer}
                          onRejectOffer={handleRejectOffer}
                          onCounterOffer={handleCounterOffer}
                        />
                      </div>
                    ) : (
                      <div className={`message-bubble ${isUser ? 'user-bubble' : 'seller-bubble'} p-3 border-radius-lg shadow-sm`}>
                        <p className="mb-1" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{msg.text}</p>
                        <span className="msg-time text-muted d-flex align-items-center gap-1 justify-content-end" style={{ fontSize: '0.7rem' }}>
                          {msg.time} 
                          {isUser && (
                            <CheckCheck size={14} style={{ color: '#34b7f1', strokeWidth: 2.5 }} title="Delivered & Read" />
                          )}
                        </span>
                      </div>
                    )}

                  </div>
                );
              })}

              {/* Live WhatsApp Seller Typing Bubble */}
              {isSellerTyping && (
                <div className="message-row seller-side mb-3 animate-fade-in">
                  <div className="message-bubble seller-bubble typing-bubble d-flex align-items-center gap-2">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>{activeThread.sellerName} is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Chips Bar (Clicking pastes text directly into chat box) */}
            <div className="quick-replies-strip px-3 py-2 background-slate-50 border-top d-flex align-items-center gap-2 overflow-x-auto">
              <span className="text-muted font-weight-bold d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                <Sparkles size={13} className="text-primary" />
                Quick Replies:
              </span>
              {QUICK_REPLIES.map((replyText, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="quick-reply-pill badge badge-outline border-slate-300 text-slate-700 font-normal"
                  onClick={() => handleSelectQuickReply(replyText)}
                  title="Click to paste into message input box"
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  "{replyText}"
                </button>
              ))}
            </div>

            {/* Chat Input Form Bar */}
            <form className="chat-input-bar p-3 border-top d-flex align-items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
              <input
                ref={chatInputRef}
                type="text"
                className="form-input flex-1"
                placeholder="Type a message or click quick replies above..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              
              <button 
                type="button"
                className="btn btn-ghost btn-sm icon-btn text-primary"
                onClick={() => setShowOfferModal(true)}
                title="Make Offer"
              >
                <DollarSign size={20} />
              </button>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!inputMessage.trim()}
              >
                <Send size={16} /> Send
              </button>
            </form>

          </div>

          {/* 3. Right Sidebar: Contact Details */}
          {showInfoPanel && (
            <aside className="whatsapp-info-panel card border-left animate-slide-left p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h4 className="font-heading">Contact Details</h4>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowInfoPanel(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="info-profile-avatar-wrap text-center mb-4">
                <img src={activeThread.sellerAvatar} alt="Seller" className="info-profile-avatar mx-auto mb-2 user-avatar-img lg" />
                <h3 style={{ fontSize: '1.1rem' }}>{activeThread.sellerName}</h3>
                <span className="badge badge-secondary mt-1">Verified Campus Student</span>
              </div>

              <div className="info-meta-group d-flex flex-column gap-3 mb-4">
                <div className="meta-row">
                  <strong>Department:</strong>
                  <p>{activeThread.sellerDept || 'Computer Science & Engineering'}</p>
                </div>
                <div className="meta-row">
                  <strong>Hostel Block:</strong>
                  <p>{activeThread.sellerHostel || 'Hostel 5 (Boys)'}</p>
                </div>
                <div className="meta-row">
                  <strong>Campus Rating:</strong>
                  <p>★ {activeThread.sellerRating || 4.9} (12 Reviews)</p>
                </div>
                <div className="meta-row">
                  <strong>Phone / WhatsApp:</strong>
                  <p className="text-primary font-weight-bold">{activeThread.sellerPhone || '+91 98765 43210'}</p>
                </div>
              </div>

              <button className="btn btn-primary w-full" onClick={() => setShowCallModal(true)}>
                <Phone size={16} /> Call Seller Now
              </button>
            </aside>
          )}

        </div>

      </div>

      {/* Make Offer Modal */}
      {showOfferModal && (
        <OfferModal
          product={{ title: activeThread.itemTitle, price: activeThread.itemPrice, images: [activeThread.itemImage] }}
          onClose={() => setShowOfferModal(false)}
          onSubmitOffer={handleMakeOfferSubmit}
        />
      )}

      {/* Call Seller Modal */}
      {showCallModal && (
        <div className="modal-overlay" onClick={() => setShowCallModal(false)}>
          <div className="modal-content p-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Seller Contact Info</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCallModal(false)}>✕</button>
            </div>
            <div className="text-center py-3">
              <img src={activeThread.sellerAvatar} alt="Seller" className="user-avatar-img lg mx-auto mb-2" />
              <h4>{activeThread.sellerName}</h4>
              <p className="text-primary font-weight-bold my-2" style={{ fontSize: '1.2rem' }}>
                {activeThread.sellerPhone || '+91 98765 43210'}
              </p>
              <a href={`tel:${activeThread.sellerPhone || '+91 98765 43210'}`} className="btn btn-primary w-full mt-2">
                <Phone size={18} /> Direct Call
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
