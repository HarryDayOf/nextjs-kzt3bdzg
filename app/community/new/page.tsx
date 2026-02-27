/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCommunity } from '../CommunityContext';
import { MarkdownEditor, ForumBtn, slugify } from '../../../components/community/ui';
import type { ForumTopic } from '../../../lib/types';

export default function NewTopicPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>}>
      <NewTopicForm />
    </Suspense>
  );
}

function NewTopicForm() {
  const searchParams = useSearchParams();
  const defaultCat = searchParams.get('category') || '';
  const { currentUser, darkMode, C, categories, setTopics } = useCommunity();

  const visibleCategories = useMemo(() =>
    categories.filter(c => c.visibleTo === 'all' || c.visibleTo === currentUser.role),
    [categories, currentUser.role]
  );

  const [categorySlug, setCategorySlug] = useState(defaultCat);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!categorySlug) { setError('Please select a category.'); return; }
    if (!title.trim() || title.trim().length < 5) { setError('Title must be at least 5 characters.'); return; }
    if (!body.trim() || body.trim().length < 10) { setError('Body must be at least 10 characters.'); return; }

    const cat = categories.find(c => c.slug === categorySlug);
    if (!cat) { setError('Invalid category.'); return; }

    const newTopic: ForumTopic = {
      id: `ft_${Date.now()}`,
      categoryId: cat.id,
      categorySlug: cat.slug,
      title: title.trim(),
      slug: slugify(title.trim()),
      body: body.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replyCount: 0,
      viewCount: 0,
      lastReplyAt: null,
      lastReplyBy: null,
      pinned: false,
      locked: false,
      status: 'active',
      tags: tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 5),
      reactions: [],
    };

    setTopics(prev => [newTopic, ...prev]);
    window.location.href = `/community/topic/${newTopic.id}`;
  };

  return (
    <div className="community-pad" style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: C.textMuted, marginBottom: '20px' }}>
        <a href="/community" style={{ color: darkMode ? '#93c5fd' : '#0369a1', textDecoration: 'none' }}>Community</a>
        <span style={{ margin: '0 6px' }}>/</span>
        <span>New Topic</span>
      </div>

      <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 20px 0' }}>Create a New Topic</h1>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fdecea', color: '#c62828', fontSize: '13px', marginBottom: '16px' }}>{error}</div>
        )}

        {/* Category */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</label>
          <select
            value={categorySlug}
            onChange={e => setCategorySlug(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, backgroundColor: C.inputBg, outline: 'none' }}
          >
            <option value="">Select a category...</option>
            {visibleCategories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value.slice(0, 200))}
            placeholder="What is your topic about?"
            style={{ width: '100%', padding: '9px 12px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '14px', color: C.text, backgroundColor: C.inputBg, outline: 'none', boxSizing: 'border-box' }}
          />
          <span style={{ fontSize: '11px', color: C.textMuted, marginTop: '4px', display: 'block' }}>{title.length}/200</span>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tags (optional)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="budget, tips, inspiration (comma-separated, max 5)"
            style={{ width: '100%', padding: '9px 12px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, backgroundColor: C.inputBg, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Body */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Body</label>
          <MarkdownEditor value={body} onChange={setBody} placeholder="Write your topic content... (Markdown supported)" darkMode={darkMode} minHeight={200} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <ForumBtn label="Cancel" variant="ghost" onClick={() => { window.location.href = '/community'; }} darkMode={darkMode} />
          <ForumBtn label="Create Topic" variant="primary" onClick={handleSubmit} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}
