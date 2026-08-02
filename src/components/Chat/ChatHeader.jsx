import React from 'react';
import { ArrowLeft, Phone, Info, ShieldCheck } from 'lucide-react';
import { OnlineIndicator } from './OnlineIndicator';

export function ChatHeader({ opponent, targetPresence, onGoBack, onToggleInfo, onCall }) {
  const opponentName = opponent?.full_name || opponent?.username || 'Campus Student';
  const opponentAvatar = opponent?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  const isOnline = targetPresence?.is_online;
  const lastSeen = targetPresence?.last_seen;

  return (
    <div className="chat-header p-3 border-bottom bg-white d-flex align-items-center justify-content-between shadow-sm" style={{ minHeight: '68px' }}>
      
      {/* Left: Back Button & User Info */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-ghost btn-sm icon-btn hide-desktop" onClick={onGoBack} title="Back to Conversations">
          <ArrowLeft size={20} />
        </button>

        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <img
              src={opponentAvatar}
              alt={opponentName}
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="font-heading m-0" style={{ fontSize: '1.05rem', fontWeight: '700' }}>
                {opponentName}
              </h4>
              <span className="badge badge-primary d-inline-flex align-items-center gap-1" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                <ShieldCheck size={12} /> Verified
              </span>
            </div>
            <OnlineIndicator isOnline={isOnline} lastSeen={lastSeen} size={10} />
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-outline btn-sm icon-btn" onClick={onCall} title="Call Seller">
          <Phone size={18} />
        </button>
        <button className="btn btn-ghost btn-sm icon-btn" onClick={onToggleInfo} title="Toggle Details">
          <Info size={18} />
        </button>
      </div>

    </div>
  );
}
