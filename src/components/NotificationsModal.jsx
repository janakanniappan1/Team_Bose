import React from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  MessageSquare, 
  TrendingDown, 
  Sparkles, 
  Clock, 
  Check 
} from 'lucide-react';


export default function NotificationsModal({ isOpen, onClose, notifications, onMarkAllRead }) {
  if (!isOpen) return null;

  const notifIcons = {
    sold: <CheckCircle size={20} className="text-secondary" />,
    message: <MessageSquare size={20} className="text-primary" />,
    price_drop: <TrendingDown size={20} className="text-rose" />,
    recommendation: <Sparkles size={20} className="text-amber" />
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content notif-drawer-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notif-header">
          <div className="d-flex align-items-center gap-2">
            <Bell size={20} className="text-primary" />
            <h3>Campus Notifications</h3>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-ghost text-primary" onClick={onMarkAllRead}>
              <Check size={14} /> Mark all read
            </button>
            <button className="btn btn-sm btn-ghost" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="notif-list">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`notif-item ${notif.unread ? 'unread' : ''}`}
            >
              <div className="notif-icon-circle">
                {notifIcons[notif.type] || <Bell size={18} />}
              </div>

              <div className="notif-body">
                <h4 className="notif-title">{notif.title}</h4>
                <p className="notif-msg">{notif.message}</p>
                <span className="notif-time"><Clock size={12} /> {notif.time}</span>
              </div>

              {notif.unread && <span className="unread-dot"></span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
