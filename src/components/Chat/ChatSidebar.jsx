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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
      
      {/* 1. Jana_133 Box at Top */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: '64px', minHeight: '64px', flex: '0 0 64px', width: '100%', padding: '0 16px', borderBottom: '1px solid #e2e8f0', boxSizing: 'border-box', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1, minWidth: 0 }}>
          <img
            src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt="Profile"
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <h4 className="font-heading m-0 text-truncate" style={{ fontSize: '0.95rem', fontWeight: '700', lineHeight: 1.2, color: '#1e293b' }}>
              {currentUser?.full_name || currentUser?.fullName || currentUser?.username || 'Messages'}
            </h4>
            <span className="text-muted text-truncate" style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
              {totalUnread > 0 ? `${totalUnread} unread messages` : 'Direct Messages'}
            </span>
          </div>
        </div>

        <button className="btn btn-ghost btn-sm icon-btn" style={{ flexShrink: 0 }} title="New Message">
          <Edit3 size={18} />
        </button>
      </div>

      {/* 2. Search Input Directly BELOW Jana_133 Box */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', flex: '0 0 auto', boxSizing: 'border-box', backgroundColor: '#ffffff' }}>
        <div className="threads-search-box position-relative w-100">
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
          <input
            type="text"
            className="form-input btn-sm w-100"
            style={{ paddingLeft: '36px', borderRadius: '20px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', boxSizing: 'border-box', width: '100%' }}
            placeholder="Search conversations or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Contacts of Previous Chats from Database Directly BELOW Search */}
      <div className="chat-threads-scroll" style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0%', minHeight: 0, overflowY: 'auto', width: '100%', boxSizing: 'border-box' }}>
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
