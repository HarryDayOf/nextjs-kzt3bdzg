/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCommunity } from '../CommunityContext';
import { ForumBtn, timeAgo } from '../../../components/community/ui';

const NOTIF_ICONS: Record<string, string> = {
  reply_to_topic: '💬',
  reply_to_reply: '↩️',
  reaction: '👍',
  mention: '@',
  topic_pinned: '📌',
  moderation: '🛡️',
};

export default function NotificationsPage() {
  const { currentUser, darkMode, C, notifications, setNotifications } = useCommunity();

  const myNotifs = notifications
    .filter(n => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="community-pad" style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: 0 }}>Notifications</h1>
        {myNotifs.some(n => !n.read) && (
          <ForumBtn label="Mark all read" variant="ghost" small onClick={markAllRead} darkMode={darkMode} />
        )}
      </div>

      <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
        {myNotifs.length > 0 ? myNotifs.map(n => (
          <div
            key={n.id}
            onClick={() => { markRead(n.id); window.location.href = `/community/topic/${n.linkTopicId}`; }}
            style={{ padding: '14px 20px', borderBottom: '1px solid ' + C.borderLight, cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', backgroundColor: n.read ? 'transparent' : (darkMode ? 'rgba(96,165,250,0.06)' : 'rgba(15,20,40,0.02)'), transition: 'background-color 0.1s' }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{NOTIF_ICONS[n.type] || '🔔'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: n.read ? 400 : 600, color: C.text, lineHeight: '1.4' }}>{n.title}</div>
              <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>{n.body}</div>
              <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>{timeAgo(n.createdAt)}</div>
            </div>
            {!n.read && (
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0369a1', flexShrink: 0, marginTop: '6px' }} />
            )}
          </div>
        )) : (
          <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}
