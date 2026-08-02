import React from 'react';
import { UnreadBadge } from './UnreadBadge';

export function ConversationCard({ thread, currentUserId, currentUser, isActive, onClick }) {
  if (!thread) return null;

  const isBuyer = String(thread.buyer_id).toLowerCase() === String(currentUserId).toLowerCase();
  const opponent = thread.opponent;
  const unreadCount = thread.unreadCount !== undefined ? thread.unreadCount : (isBuyer ? thread.buyer_unread_count : thread.seller_unread_count);

  const opponentName = opponent?.full_name || opponent?.username || (isBuyer ? (thread.seller_name || 'Seller') : (thread.buyer_name || 'Buyer'));
  const opponentAvatar = opponent?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${opponentName}`;

  const lastSenderStr = String(thread.last_sender_id || '').trim().toLowerCase();
  const uIdStr = String(currentUserId || '').trim().toLowerCase();
  const uUserStr = String(currentUser?.username || '').trim().toLowerCase();
  const uNameStr = String(currentUser?.full_name || currentUser?.fullName || '').trim().toLowerCase();

  const isLastSenderMe = lastSenderStr && (
    lastSenderStr === uIdStr ||
    (uUserStr && lastSenderStr === uUserStr) ||
    (uNameStr && lastSenderStr === uNameStr)
  );

  const messageSnippet = thread.last_message
    ? (isLastSenderMe ? `You: ${thread.last_message}` : thread.last_message)
    : 'Start conversation...';

  const formattedTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className={`conversation-card border-bottom p-3 cursor-pointer transition-all ${
        isActive ? 'active-chat-card' : ''
      }`}
      style={{
        backgroundColor: isActive ? 'var(--primary-light, #EEF2FF)' : 'transparent',
        borderLeft: isActive ? '4px solid #C85A32' : '4px solid transparent'
      }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* Avatar with Online Dot */}
        <div className="position-relative" style={{ minWidth: '48px' }}>
          <img
            src={opponentAvatar}
            alt={opponentName}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          {thread.is_online && (
            <span
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                border: '2px solid #FFFFFF'
              }}
            />
          )}
        </div>

        {/* Info & Last Msg */}
        <div className="flex-1 overflow-hidden">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <h5 className="font-heading m-0 text-truncate" style={{ fontSize: '0.95rem', fontWeight: '600' }}>
              {opponentName}
            </h5>
            <span className="text-muted" style={{ fontSize: '0.72rem' }}>
              {formattedTime(thread.last_message_time)}
            </span>
          </div>

          <div className="d-flex align-items-center justify-content-between">
            <p className="text-muted m-0 text-truncate" style={{ fontSize: '0.82rem', maxWidth: '170px' }}>
              {messageSnippet}
            </p>
            <UnreadBadge count={unreadCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
