/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useCommunity } from './CommunityContext';
import { CategoryCard, TopicCard, ForumSearch, ForumBtn, NAVY } from '../../components/community/ui';

export default function CommunityHome() {
  const { currentUser, darkMode, C, categories, topics } = useCommunity();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const visibleCategories = useMemo(() =>
    categories.filter(c => c.visibleTo === 'all' || c.visibleTo === currentUser.role).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories, currentUser.role]
  );

  const pinnedTopics = useMemo(() =>
    topics.filter(t => t.pinned && t.status === 'active').slice(0, 4),
    [topics]
  );

  const recentTopics = useMemo(() => {
    let list = topics.filter(t => t.status === 'active');
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
    }
    return list.sort((a, b) => new Date(b.lastReplyAt || b.createdAt).getTime() - new Date(a.lastReplyAt || a.createdAt).getTime()).slice(0, 15);
  }, [topics, debouncedSearch]);

  return (
    <div className="community-pad" style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 32px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: C.text, margin: '0 0 8px 0' }}>DayOf Community</h1>
        <p style={{ fontSize: '15px', color: C.textMuted, margin: '0 0 20px 0' }}>Connect with vendors and couples. Share ideas, ask questions, and get inspired.</p>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <ForumSearch value={search} onChange={setSearch} placeholder="Search topics, tags, or keywords..." darkMode={darkMode} />
        </div>
      </div>

      {/* Pinned Topics */}
      {!debouncedSearch && pinnedTopics.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Featured Topics</h2>
          <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
            {pinnedTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} darkMode={darkMode} showCategory categories={categories}
                onClick={() => { window.location.href = `/community/topic/${topic.id}`; }} />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {!debouncedSearch && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Categories</h2>
          <div className="community-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {visibleCategories.map(cat => (
              <CategoryCard key={cat.id} category={cat} darkMode={darkMode}
                onClick={() => { window.location.href = `/community/category/${cat.slug}`; }} />
            ))}
          </div>
        </div>
      )}

      {/* Recent / Search Results */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>
            {debouncedSearch ? `Results for "${debouncedSearch}"` : 'Recent Activity'}
          </h2>
          <ForumBtn label="New Topic" variant="primary" small onClick={() => { window.location.href = '/community/new'; }} darkMode={darkMode} />
        </div>
        <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
          {recentTopics.length > 0 ? recentTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} darkMode={darkMode} showCategory categories={categories}
              onClick={() => { window.location.href = `/community/topic/${topic.id}`; }} />
          )) : (
            <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
              No topics found. {debouncedSearch && 'Try a different search term.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
