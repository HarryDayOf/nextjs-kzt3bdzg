/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useCommunity } from '../../CommunityContext';
import { TopicCard, ForumSearch, ForumBtn } from '../../../../components/community/ui';

const PAGE_SIZE = 50;

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { currentUser, darkMode, C, categories, topics } = useCommunity();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'replies' | 'views'>('newest');
  const [page, setPage] = useState(1);

  const category = categories.find(c => c.slug === slug);

  const filteredTopics = useMemo(() => {
    if (!category) return [];
    let list = topics.filter(t => t.categoryId === category.id && t.status !== 'deleted');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
    }
    // Pinned always first
    const pinned = list.filter(t => t.pinned);
    const unpinned = list.filter(t => !t.pinned);
    if (sort === 'replies') unpinned.sort((a, b) => b.replyCount - a.replyCount);
    else if (sort === 'views') unpinned.sort((a, b) => b.viewCount - a.viewCount);
    else unpinned.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return [...pinned, ...unpinned];
  }, [category, topics, search, sort]);

  const totalPages = Math.ceil(filteredTopics.length / PAGE_SIZE);
  const paged = filteredTopics.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!category) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: C.textMuted, fontSize: '15px' }}>
        Category not found. <a href="/community" style={{ color: darkMode ? '#93c5fd' : '#0369a1' }}>Back to Community</a>
      </div>
    );
  }

  if (category.visibleTo === 'vendor' && currentUser.role !== 'vendor') {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: C.textMuted, fontSize: '15px' }}>
        This category is only available to vendors. <a href="/community" style={{ color: darkMode ? '#93c5fd' : '#0369a1' }}>Back to Community</a>
      </div>
    );
  }

  const sortBtnStyle = (active: boolean) => ({
    padding: '5px 12px', borderRadius: '6px', border: `1px solid ${active ? (darkMode ? '#60a5fa' : '#0f1428') : C.border}`,
    backgroundColor: active ? (darkMode ? 'rgba(96,165,250,0.15)' : 'rgba(15,20,40,0.06)') : 'transparent',
    color: active ? (darkMode ? '#93c5fd' : '#0f1428') : C.textMuted,
    fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer' as const,
  });

  return (
    <div className="community-pad" style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: C.textMuted, marginBottom: '16px' }}>
        <a href="/community" style={{ color: darkMode ? '#93c5fd' : '#0369a1', textDecoration: 'none' }}>Community</a>
        <span style={{ margin: '0 6px' }}>/</span>
        <span>{category.name}</span>
      </div>

      {/* Category Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontSize: '28px' }}>{category.icon}</span>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>{category.name}</h1>
          <p style={{ fontSize: '13px', color: C.textMuted, margin: '4px 0 0 0' }}>{category.description}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '300px' }}>
          <ForumSearch value={search} onChange={setSearch} placeholder="Search this category..." darkMode={darkMode} />
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => { setSort('newest'); setPage(1); }} style={sortBtnStyle(sort === 'newest')}>Newest</button>
          <button onClick={() => { setSort('replies'); setPage(1); }} style={sortBtnStyle(sort === 'replies')}>Most Replies</button>
          <button onClick={() => { setSort('views'); setPage(1); }} style={sortBtnStyle(sort === 'views')}>Most Views</button>
        </div>
        <div style={{ flex: 1 }} />
        <ForumBtn label="New Topic" variant="primary" small onClick={() => { window.location.href = `/community/new?category=${slug}`; }} darkMode={darkMode} />
      </div>

      {/* Topic List */}
      <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
        {paged.length > 0 ? paged.map(topic => (
          <TopicCard key={topic.id} topic={topic} darkMode={darkMode}
            onClick={() => { window.location.href = `/community/topic/${topic.id}`; }} />
        )) : (
          <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
            No topics yet. Be the first to start a discussion!
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', fontSize: '13px', color: C.textMuted }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid ' + C.border, backgroundColor: C.surface, color: C.text, cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid ' + C.border, backgroundColor: C.surface, color: C.text, cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>Next</button>
        </div>
      )}
    </div>
  );
}
