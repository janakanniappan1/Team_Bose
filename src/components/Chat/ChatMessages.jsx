import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Loader2 } from 'lucide-react';

export function ChatMessages({
  messages,
  currentUserId,
  isTargetTyping,
  opponentName,
  hasMore,
  loadMoreMessages,
  loading
}) {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTargetTyping]);

  // Handle infinite scroll up
  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0 && hasMore) {
      loadMoreMessages();
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 d-flex align-items-center justify-content-center p-4">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="chat-messages-body p-4 flex-1 overflow-auto"
      style={{
        backgroundColor: '#F8FAFC',
        backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mb-3">
          <button className="btn btn-ghost btn-sm text-muted" onClick={loadMoreMessages}>
            Load Previous Messages
          </button>
        </div>
      )}

      {/* Date Badge */}
      <div className="text-center my-3">
        <span className="badge badge-secondary shadow-sm px-3 py-1 text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
          Today
        </span>
      </div>

      {/* Messages Stream */}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isMe={msg.sender_id === currentUserId}
        />
      ))}

      {/* Typing Indicator */}
      {isTargetTyping && <TypingIndicator userName={opponentName} />}

      <div ref={bottomRef} />
    </div>
  );
}
