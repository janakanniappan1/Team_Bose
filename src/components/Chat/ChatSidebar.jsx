import React, { useState, useMemo } from 'react';
import { Search, MessageSquare, Edit3 } from 'lucide-react';
import { ConversationCard } from './ConversationCard';

export function ChatSidebar({ threads, activeThreadId, onSelectThread, currentUserId, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return threads;
    return threads.filter((t) => {
      const opponent = t.opponent;
      const opponentName = (opponent?.full_name || opponent?.username || t.seller_name || t.buyer_name || '').toLowerCase();
      const itemTitle = (t.item_title || '').toLowerCase();

      return opponentName.includes(query) || itemTitle.includes(query);
    });
  }, [threads, searchQuery]);

  const totalUnread = useMemo(() => {
    return threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
  }, [threads]);

  return (
    <div className="chat-sidebar border-right bg-white d-flex flex-column h-100 w-100">
      
      {/* Top Header */}
      <div className="px-3 border-bottom d-flex align-items-center justify-content-between" style={{ height: '64px', minHeight: '64px', maxHeight: '64px', flex: '0 0 64px', overflow: 'hidden' }}>
        <div className="d-flex align-items-center gap-2">
          <img
            src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt="Profile"
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ overflow: 'hidden', maxWidth: '200px' }}>
            <h4 className="font-heading m-0 text-truncate" style={{ fontSize: '0.95rem', fontWeight: '700' }}>
              {currentUser?.full_name || currentUser?.fullName || currentUser?.username || 'Messages'}
            </h4>
            <span className="text-muted text-truncate d-block" style={{ fontSize: '0.75rem' }}>
              {totalUnread > 0 ? `${totalUnread} unread messages` : 'Direct Messages'}
            </span>
          </div>
        </div>

        <button className="btn btn-ghost btn-sm icon-btn" title="New Message">
          <Edit3 size={18} />
        </button>
      </div>

      {/* Instant Search Box */}
      <div className="p-3 border-bottom">
        <div className="threads-search-box position-relative">
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
          <input
            type="text"
            className="form-input btn-sm w-100"
            style={{ paddingLeft: '36px', borderRadius: '20px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
            placeholder="Search conversations or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="chat-threads-scroll">
        {filteredThreads.length === 0 ? (
          <div className="p-4 text-center text-muted">
            <MessageSquare size={32} className="mb-2 text-slate" />
            <p className="m-0" style={{ fontSize: '0.85rem' }}>No conversations found</p>
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <ConversationCard
              key={thread.id}
              thread={thread}
              currentUserId={currentUserId}
              currentUser={currentUser}
              isActive={thread.id === activeThreadId}
              onClick={() => onSelectThread(thread.id)}
            />
          ))
        )}
      </div>

    </div>
  );
}
