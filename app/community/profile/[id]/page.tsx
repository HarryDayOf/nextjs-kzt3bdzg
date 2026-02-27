/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useCommunity } from '../../CommunityContext';
import { ForumAvatar, ForumRoleBadge, ForumBadge, TopicCard, timeAgo, NAVY } from '../../../../components/community/ui';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { darkMode, C, allUsers, topics, replies, categories } = useCommunity();
  const [tab, setTab] = useState<'topics' | 'replies'>('topics');

  const user = allUsers.find(u => u.id === userId);

  const userTopics = useMemo(() =>
    topics.filter(t => t.authorId === userId && t.status !== 'deleted').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [topics, userId]
  );

  const userReplies = useMemo(() =>
    replies.filter(r => r.authorId === userId && r.status !== 'deleted').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [replies, userId]
  );

  if (!user) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: C.textMuted, fontSize: '15px' }}>
        User not found. <a href="/community" style={{ color: darkMode ? '#93c5fd' : '#0369a1' }}>Back to Community</a>
      </div>
    );
  }

  const tabBtnStyle = (active: boolean) => ({
    padding: '10px 20px', borderBottom: active ? `2px solid ${darkMode ? '#60a5fa' : NAVY}` : '2px solid transparent',
    background: 'none', border: 'none', borderBottomStyle: 'solid' as const,
    cursor: 'pointer' as const, fontSize: '13px', fontWeight: active ? 600 : 400,
    color: active ? (darkMode ? '#e2e8f0' : NAVY) : C.textMuted,
  });

  return (
    <div className="community-pad" style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: C.textMuted, marginBottom: '20px' }}>
        <a href="/community" style={{ color: darkMode ? '#93c5fd' : '#0369a1', textDecoration: 'none' }}>Community</a>
        <span style={{ margin: '0 6px' }}>/</span>
        <span>{user.name}</span>
      </div>

      {/* Profile Header */}
      <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <ForumAvatar name={user.name} role={user.role} size={64} darkMode={darkMode} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: 0 }}>{user.name}</h1>
              <ForumRoleBadge role={user.role} />
              {user.badges.map(b => <ForumBadge key={b} badge={b} />)}
            </div>
            {user.bio && <p style={{ fontSize: '13px', color: C.textMuted, margin: '4px 0 8px 0', lineHeight: '1.5' }}>{user.bio}</p>}
            <span style={{ fontSize: '12px', color: C.textMuted }}>Joined {timeAgo(user.joinedAt)}</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid ' + C.borderLight }}>
          {[
            { label: 'Topics', value: user.postCount },
            { label: 'Replies', value: user.replyCount },
            { label: 'Reactions Received', value: user.reactionCount },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: C.text }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid ' + C.border, marginBottom: '16px' }}>
        <button onClick={() => setTab('topics')} style={tabBtnStyle(tab === 'topics')}>Topics ({userTopics.length})</button>
        <button onClick={() => setTab('replies')} style={tabBtnStyle(tab === 'replies')}>Replies ({userReplies.length})</button>
      </div>

      {/* Content */}
      {tab === 'topics' ? (
        <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
          {userTopics.length > 0 ? userTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} darkMode={darkMode} showCategory categories={categories}
              onClick={() => { window.location.href = `/community/topic/${topic.id}`; }} />
          )) : (
            <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>No topics yet.</div>
          )}
        </div>
      ) : (
        <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
          {userReplies.length > 0 ? userReplies.map(reply => {
            const topic = topics.find(t => t.id === reply.topicId);
            return (
              <div key={reply.id}
                onClick={() => { if (topic) window.location.href = `/community/topic/${topic.id}`; }}
                style={{ padding: '14px 20px', borderBottom: '1px solid ' + C.borderLight, cursor: 'pointer' }}>
                {topic && <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '4px' }}>In: {topic.title}</div>}
                <div style={{ fontSize: '13px', color: C.text, lineHeight: '1.5' }}>{reply.body.slice(0, 150)}{reply.body.length > 150 ? '...' : ''}</div>
                <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>{timeAgo(reply.createdAt)}</div>
              </div>
            );
          }) : (
            <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>No replies yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
