import React from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  MessageSquare, 
  TrendingDown, 
  Sparkles, 
  Clock, 
  Check,
  Trash2
} from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose, notifications, onMarkAllRead, onDeleteNotification }) {
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
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <Bell size={32} className="mb-2 text-slate-300 mx-auto" />
              <p className="mb-0">No notifications yet!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`notif-item ${notif.unread ? 'unread' : ''} d-flex align-items-center justify-content-between`}
              >
                <div className="d-flex align-items-center gap-3 flex-1 min-w-0">
                  <div className="notif-icon-circle">
                    {notifIcons[notif.type] || <Bell size={18} />}
                  </div>

                  <div className="notif-body flex-1 min-w-0">
                    <h4 className="notif-title text-truncate">{notif.title}</h4>
                    <p className="notif-msg text-truncate mb-1">{notif.message}</p>
                    <span className="notif-time"><Clock size={12} /> {notif.time}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {notif.unread && <span className="unread-dot"></span>}
                  {onDeleteNotification && (
                    <button
                      className="btn btn-sm btn-ghost text-muted p-1"
                      title="Remove notification"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification(notif.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
