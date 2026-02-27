/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useCommunity } from '../../CommunityContext';
import { ForumAvatar, ForumRoleBadge, ForumBadge, MarkdownPreview, MarkdownEditor, ReactionBar, ReplyThread, ForumBtn, timeAgo, NAVY } from '../../../../components/community/ui';
import type { ForumReaction, ForumReply } from '../../../../lib/types';

export default function TopicDetailPage() {
  const params = useParams();
  const topicId = params.id as string;
  const { currentUser, darkMode, C, categories, topics, setTopics, replies, setReplies, allUsers } = useCommunity();

  const topic = topics.find(t => t.id === topicId);
  const category = topic ? categories.find(c => c.id === topic.categoryId) : null;
  const topicReplies = useMemo(() =>
    replies.filter(r => r.topicId === topicId && r.status !== 'deleted').sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [replies, topicId]
  );
  const topLevelReplies = topicReplies.filter(r => !r.parentReplyId);
  const nestedReplies = (parentId: string) => topicReplies.filter(r => r.parentReplyId === parentId);

  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyToText, setReplyToText] = useState('');

  const authorProfile = allUsers.find(u => u.id === topic?.authorId);

  if (!topic) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: C.textMuted, fontSize: '15px' }}>
        Topic not found. <a href="/community" style={{ color: darkMode ? '#93c5fd' : '#0369a1' }}>Back to Community</a>
      </div>
    );
  }

  const handleTopicReaction = (type: ForumReaction['type']) => {
    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t;
      const existing = t.reactions.find(r => r.userId === currentUser.id && r.type === type);
      if (existing) {
        return { ...t, reactions: t.reactions.filter(r => r.id !== existing.id) };
      }
      return { ...t, reactions: [...t.reactions, { id: `fr_${Date.now()}`, userId: currentUser.id, userName: currentUser.name, type, createdAt: new Date().toISOString() }] };
    }));
  };

  const handleReplyReaction = (replyId: string, type: ForumReaction['type']) => {
    setReplies(prev => prev.map(r => {
      if (r.id !== replyId) return r;
      const existing = r.reactions.find(rx => rx.userId === currentUser.id && rx.type === type);
      if (existing) {
        return { ...r, reactions: r.reactions.filter(rx => rx.id !== existing.id) };
      }
      return { ...r, reactions: [...r.reactions, { id: `fr_${Date.now()}`, userId: currentUser.id, userName: currentUser.name, type, createdAt: new Date().toISOString() }] };
    }));
  };

  const submitReply = (parentReplyId: string | null, text: string) => {
    if (!text.trim()) return;
    const newReply: ForumReply = {
      id: `fre_${Date.now()}`,
      topicId,
      parentReplyId,
      body: text.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      reactions: [],
    };
    setReplies(prev => [...prev, newReply]);
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, replyCount: t.replyCount + 1, lastReplyAt: newReply.createdAt, lastReplyBy: currentUser.name } : t));
    if (parentReplyId) { setReplyToText(''); setReplyingTo(null); }
    else { setReplyText(''); }
  };

  return (
    <div className="community-pad" style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: C.textMuted, marginBottom: '20px' }}>
        <a href="/community" style={{ color: darkMode ? '#93c5fd' : '#0369a1', textDecoration: 'none' }}>Community</a>
        <span style={{ margin: '0 6px' }}>/</span>
        {category && (
          <>
            <a href={`/community/category/${category.slug}`} style={{ color: darkMode ? '#93c5fd' : '#0369a1', textDecoration: 'none' }}>{category.name}</a>
            <span style={{ margin: '0 6px' }}>/</span>
          </>
        )}
        <span style={{ color: C.text }}>{topic.title.slice(0, 50)}{topic.title.length > 50 ? '...' : ''}</span>
      </div>

      {/* Topic Header */}
      <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {topic.pinned && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fff8e1', color: '#b45309', fontWeight: 700 }}>PINNED</span>}
          {topic.locked && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>LOCKED</span>}
          {category && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: category.bg, color: category.color, fontWeight: 600 }}>{category.name}</span>}
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: '0 0 12px 0', lineHeight: '1.3' }}>{topic.title}</h1>

        {/* Author info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <a href={`/community/profile/${topic.authorId}`} style={{ textDecoration: 'none' }}>
            <ForumAvatar name={topic.authorName} role={topic.authorRole} size={40} darkMode={darkMode} />
          </a>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <a href={`/community/profile/${topic.authorId}`} style={{ fontSize: '13px', fontWeight: 600, color: C.text, textDecoration: 'none' }}>{topic.authorName}</a>
              <ForumRoleBadge role={topic.authorRole} />
              {authorProfile?.badges.map(b => <ForumBadge key={b} badge={b} />)}
            </div>
            <span style={{ fontSize: '12px', color: C.textMuted }}>{timeAgo(topic.createdAt)}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ marginBottom: '16px' }}>
          <MarkdownPreview content={topic.body} darkMode={darkMode} />
        </div>

        {/* Tags */}
        {topic.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {topic.tags.map(tag => (
              <span key={tag} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: C.borderLight, color: C.textMuted, fontWeight: 500 }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Stats + Reactions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '12px', borderTop: '1px solid ' + C.borderLight }}>
          <ReactionBar reactions={topic.reactions} onReact={handleTopicReaction} currentUserId={currentUser.id} darkMode={darkMode} />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '12px', color: C.textMuted }}>{topic.viewCount} views</span>
          <span style={{ fontSize: '12px', color: C.textMuted }}>{topic.replyCount} replies</span>
        </div>
      </div>

      {/* Replies */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>
          {topicReplies.length} {topicReplies.length === 1 ? 'Reply' : 'Replies'}
        </h2>
        <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '4px 20px' }}>
          {topLevelReplies.length > 0 ? topLevelReplies.map(reply => (
            <div key={reply.id}>
              <ReplyThread
                reply={reply}
                darkMode={darkMode}
                onReact={(type) => handleReplyReaction(reply.id, type)}
                onReply={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                onReport={() => {}}
                currentUserId={currentUser.id}
              />
              {/* Nested replies */}
              {nestedReplies(reply.id).map(nested => (
                <ReplyThread
                  key={nested.id}
                  reply={nested}
                  darkMode={darkMode}
                  onReact={(type) => handleReplyReaction(nested.id, type)}
                  onReport={() => {}}
                  currentUserId={currentUser.id}
                  isNested
                />
              ))}
              {/* Inline reply form */}
              {replyingTo === reply.id && (
                <div style={{ marginLeft: '52px', padding: '12px 0 16px 16px', borderLeft: `2px solid ${C.border}` }}>
                  <MarkdownEditor value={replyToText} onChange={setReplyToText} placeholder={`Reply to ${reply.authorName}...`} darkMode={darkMode} minHeight={80} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <ForumBtn label="Reply" variant="primary" small onClick={() => submitReply(reply.id, replyToText)} disabled={!replyToText.trim()} darkMode={darkMode} />
                    <ForumBtn label="Cancel" variant="ghost" small onClick={() => { setReplyingTo(null); setReplyToText(''); }} darkMode={darkMode} />
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div style={{ padding: '24px 0', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
              No replies yet. Be the first to respond!
            </div>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {!topic.locked ? (
        <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Write a Reply</h3>
          <MarkdownEditor value={replyText} onChange={setReplyText} placeholder="Share your thoughts..." darkMode={darkMode} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <ForumBtn label="Post Reply" variant="primary" onClick={() => submitReply(null, replyText)} disabled={!replyText.trim()} darkMode={darkMode} />
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: C.surfaceAlt, border: '1px solid ' + C.border, borderRadius: '10px', padding: '16px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
          This topic is locked. New replies are not accepted.
        </div>
      )}
    </div>
  );
}
