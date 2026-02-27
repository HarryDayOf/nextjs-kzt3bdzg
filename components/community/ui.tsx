/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { mkC } from '../../lib/types';
import type { ForumCategory, ForumTopic, ForumReply, ForumReaction, ForumUserRole } from '../../lib/types';

export const NAVY = '#0f1428';

// ─── HELPERS ────────────────────────────────────────────────────────────────

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const REACTION_EMOJI: Record<string, string> = { like: '👍', helpful: '💡', love: '❤️', congrats: '🎉' };

const BADGE_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  verified_vendor:  { label: 'Verified Vendor', bg: '#e0f2fe', color: '#0369a1' },
  early_member:     { label: 'Early Member',    bg: '#f5f3ff', color: '#7c3aed' },
  top_contributor:  { label: 'Top Contributor', bg: '#fff8e1', color: '#b45309' },
};

const ROLE_BADGE_COLORS: Record<ForumUserRole, { bg: string; color: string }> = {
  vendor: { bg: '#e0f2fe', color: '#0369a1' },
  couple: { bg: '#fdf4ff', color: '#7c3aed' },
};

// ─── HTML SANITIZER ─────────────────────────────────────────────────────────
// Simple allowlist-based sanitizer for markdown-rendered HTML.
// Only allows tags and attributes produced by our own renderMarkdown function.

const ALLOWED_TAGS = new Set(['p', 'h2', 'h3', 'h4', 'strong', 'em', 'code', 'a', 'li', 'br']);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'style', 'target', 'rel']),
  '*': new Set(['style']),
};

function sanitizeHtml(html: string): string {
  // Strip any script/iframe/event handler injections
  let clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\bon\w+\s*=/gi, 'data-removed=');

  // Remove disallowed tags but keep their content
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tagName) => {
    const tag = tagName.toLowerCase();
    if (tag === 'br') return '<br/>';
    if (!ALLOWED_TAGS.has(tag)) return '';
    return match;
  });

  // Ensure href attributes don't use javascript: protocol
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="');

  return clean;
}

// ─── FORUM AVATAR ───────────────────────────────────────────────────────────

export function ForumAvatar({ name, role, size = 36, darkMode = false }: { name: string; role: ForumUserRole; size?: number; darkMode?: boolean }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const bg = role === 'vendor' ? '#0369a1' : '#7c3aed';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size * 0.38, fontWeight: 600, flexShrink: 0, position: 'relative' }}>
      {initials}
    </div>
  );
}

// ─── FORUM ROLE BADGE ───────────────────────────────────────────────────────

export function ForumRoleBadge({ role }: { role: ForumUserRole }) {
  const c = ROLE_BADGE_COLORS[role];
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, backgroundColor: c.bg, color: c.color, textTransform: 'capitalize' }}>
      {role}
    </span>
  );
}

// ─── FORUM USER BADGE ───────────────────────────────────────────────────────

export function ForumBadge({ badge }: { badge: string }) {
  const s = BADGE_STYLES[badge] ?? { label: badge, bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ─── CATEGORY CARD ──────────────────────────────────────────────────────────

export function CategoryCard({ category, darkMode = false, onClick }: { category: ForumCategory; darkMode?: boolean; onClick?: () => void }) {
  const C = mkC(darkMode);
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderLeft: `4px solid ${category.color}`, borderRadius: '10px', padding: '20px', cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 0.15s, transform 0.15s', boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.08)' : 'none', transform: hov ? 'translateY(-1px)' : 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{category.icon}</span>
        <span style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>{category.name}</span>
        {category.visibleTo === 'vendor' && (
          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fff8e1', color: '#b45309', fontWeight: 600 }}>Vendors Only</span>
        )}
      </div>
      <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 12px 0', lineHeight: '1.5' }}>{category.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: C.textMuted }}>
        <span>{category.topicCount} topics</span>
        <span>Last active {timeAgo(category.lastActivity)}</span>
      </div>
    </div>
  );
}

// ─── TOPIC CARD ─────────────────────────────────────────────────────────────

export function TopicCard({ topic, darkMode = false, onClick, showCategory = false, categories }: { topic: ForumTopic; darkMode?: boolean; onClick?: () => void; showCategory?: boolean; categories?: ForumCategory[] }) {
  const C = mkC(darkMode);
  const [hov, setHov] = useState(false);
  const cat = categories?.find(c => c.id === topic.categoryId);
  return (
    <div
      onClick={onClick}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ padding: '16px 20px', backgroundColor: hov ? C.surfaceAlt : 'transparent', cursor: onClick ? 'pointer' : 'default', borderBottom: '1px solid ' + C.borderLight, display: 'flex', alignItems: 'flex-start', gap: '14px', transition: 'background-color 0.1s' }}
    >
      <ForumAvatar name={topic.authorName} role={topic.authorRole} size={38} darkMode={darkMode} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
          {topic.pinned && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fff8e1', color: '#b45309', fontWeight: 700 }}>PINNED</span>}
          {topic.locked && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>LOCKED</span>}
          <span style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? '#93c5fd' : NAVY, lineHeight: '1.3' }}>{topic.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: C.textMuted, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 500, color: C.text }}>{topic.authorName}</span>
          <ForumRoleBadge role={topic.authorRole} />
          {showCategory && cat && (
            <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, backgroundColor: cat.bg, color: cat.color }}>{cat.name}</span>
          )}
          <span>{timeAgo(topic.createdAt)}</span>
        </div>
        {topic.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
            {topic.tags.map(tag => (
              <span key={tag} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: C.borderLight, color: C.textMuted, fontWeight: 500 }}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0, minWidth: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: C.textMuted }}>
          <span title="Replies" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {topic.replyCount}
          </span>
          <span title="Views" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {topic.viewCount}
          </span>
        </div>
        {topic.reactions.length > 0 && (
          <div style={{ display: 'flex', gap: '2px', fontSize: '12px' }}>
            {Object.entries(topic.reactions.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([type, count]) => (
              <span key={type} title={type}>{REACTION_EMOJI[type]} {count}</span>
            ))}
          </div>
        )}
        {topic.lastReplyAt && (
          <span style={{ fontSize: '11px', color: C.textMuted }}>Last reply {timeAgo(topic.lastReplyAt)}</span>
        )}
      </div>
    </div>
  );
}

// ─── REACTION BAR ───────────────────────────────────────────────────────────

export function ReactionBar({ reactions, onReact, currentUserId, darkMode = false }: { reactions: ForumReaction[]; onReact: (type: ForumReaction['type']) => void; currentUserId?: string; darkMode?: boolean }) {
  const C = mkC(darkMode);
  const grouped = reactions.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {} as Record<string, number>);
  const userReacted = new Set(reactions.filter(r => r.userId === currentUserId).map(r => r.type));
  const types: ForumReaction['type'][] = ['like', 'helpful', 'love', 'congrats'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      {types.map(type => {
        const count = grouped[type] || 0;
        const active = userReacted.has(type);
        return (
          <button
            key={type}
            onClick={(e) => { e.stopPropagation(); onReact(type); }}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '16px', border: `1px solid ${active ? (darkMode ? '#60a5fa' : NAVY) : C.border}`, backgroundColor: active ? (darkMode ? 'rgba(96,165,250,0.15)' : 'rgba(15,20,40,0.06)') : 'transparent', cursor: 'pointer', fontSize: '12px', color: active ? (darkMode ? '#93c5fd' : NAVY) : C.textMuted, fontWeight: active ? 600 : 400, transition: 'all 0.15s' }}
          >
            {REACTION_EMOJI[type]} {count > 0 && count}
          </button>
        );
      })}
    </div>
  );
}

// ─── REPLY THREAD ───────────────────────────────────────────────────────────

export function ReplyThread({ reply, darkMode = false, onReact, onReply, onReport, currentUserId, isNested = false }: { reply: ForumReply; darkMode?: boolean; onReact?: (type: ForumReaction['type']) => void; onReply?: () => void; onReport?: () => void; currentUserId?: string; isNested?: boolean }) {
  const C = mkC(darkMode);
  return (
    <div style={{ padding: '16px 0', borderBottom: isNested ? 'none' : '1px solid ' + C.borderLight, marginLeft: isNested ? '52px' : '0', borderLeft: isNested ? `2px solid ${C.border}` : 'none', paddingLeft: isNested ? '16px' : '0' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <ForumAvatar name={reply.authorName} role={reply.authorRole} size={isNested ? 30 : 34} darkMode={darkMode} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{reply.authorName}</span>
            <ForumRoleBadge role={reply.authorRole} />
            <span style={{ fontSize: '12px', color: C.textMuted }}>{timeAgo(reply.createdAt)}</span>
            {reply.status === 'flagged' && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#fff3e0', color: '#e65100', fontWeight: 600 }}>Flagged</span>}
          </div>
          <div style={{ fontSize: '13px', color: C.text, lineHeight: '1.6', marginBottom: '8px' }}>
            <MarkdownPreview content={reply.body} darkMode={darkMode} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onReact && <ReactionBar reactions={reply.reactions} onReact={onReact} currentUserId={currentUserId} darkMode={darkMode} />}
            {onReply && !isNested && (
              <button onClick={onReply} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: C.textMuted, fontWeight: 500, padding: '4px 0' }}>Reply</button>
            )}
            {onReport && (
              <button onClick={onReport} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: C.textMuted, fontWeight: 500, padding: '4px 0' }}>Report</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MARKDOWN PREVIEW ───────────────────────────────────────────────────────

export function MarkdownPreview({ content, darkMode = false }: { content: string; darkMode?: boolean }) {
  const C = mkC(darkMode);
  // Content comes from our own mock data / user-authored markdown only.
  // We sanitize as an extra safety layer.
  const html = sanitizeHtml(renderMarkdown(content, darkMode));
  return <div style={{ fontSize: '13px', lineHeight: '1.7', color: C.text }} dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderMarkdown(text: string, dark: boolean): string {
  const C = mkC(dark);
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // headings
    .replace(/^### (.+)$/gm, `<h4 style="font-size:14px;font-weight:600;margin:16px 0 8px;color:${C.text}">$1</h4>`)
    .replace(/^## (.+)$/gm, `<h3 style="font-size:15px;font-weight:600;margin:16px 0 8px;color:${C.text}">$1</h3>`)
    .replace(/^# (.+)$/gm, `<h2 style="font-size:17px;font-weight:700;margin:16px 0 8px;color:${C.text}">$1</h2>`)
    // bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // inline code
    .replace(/`([^`]+)`/g, `<code style="background:${C.borderLight};padding:2px 5px;border-radius:3px;font-size:12px">$1</code>`)
    // links - only allow http/https
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, `<a href="$2" style="color:${dark ? '#93c5fd' : '#0369a1'};text-decoration:underline" target="_blank" rel="noopener noreferrer">$1</a>`)
    // unordered lists
    .replace(/^- (.+)$/gm, `<li style="margin:2px 0;margin-left:20px;list-style:disc">$1</li>`)
    // ordered lists
    .replace(/^\d+\. (.+)$/gm, `<li style="margin:2px 0;margin-left:20px;list-style:decimal">$1</li>`)
    // paragraphs
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/\n/g, '<br/>');
  html = `<p style="margin:8px 0">${html}</p>`;
  return html;
}

// ─── MARKDOWN EDITOR ────────────────────────────────────────────────────────

export function MarkdownEditor({ value, onChange, placeholder = 'Write something...', darkMode = false, minHeight = 120 }: { value: string; onChange: (v: string) => void; placeholder?: string; darkMode?: boolean; minHeight?: number }) {
  const C = mkC(darkMode);
  const [preview, setPreview] = useState(false);

  const insert = (before: string, after: string) => {
    const ta = document.querySelector('[data-md-editor]') as HTMLTextAreaElement | null;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const newVal = value.slice(0, start) + before + (selected || 'text') + after + value.slice(end);
    onChange(newVal);
  };

  const toolbarBtnStyle = { background: 'none', border: '1px solid ' + C.border, borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: C.textMuted, fontWeight: 600 as const };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => insert('**', '**')} style={toolbarBtnStyle} title="Bold">B</button>
        <button type="button" onClick={() => insert('*', '*')} style={{ ...toolbarBtnStyle, fontStyle: 'italic' }} title="Italic">I</button>
        <button type="button" onClick={() => insert('[', '](url)')} style={toolbarBtnStyle} title="Link">Link</button>
        <button type="button" onClick={() => insert('`', '`')} style={toolbarBtnStyle} title="Code">Code</button>
        <button type="button" onClick={() => insert('\n- ', '')} style={toolbarBtnStyle} title="List">List</button>
        <div style={{ flex: 1 }} />
        <button type="button" onClick={() => setPreview(!preview)} style={{ ...toolbarBtnStyle, backgroundColor: preview ? (darkMode ? 'rgba(96,165,250,0.15)' : 'rgba(15,20,40,0.06)') : 'transparent' }}>
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>
      {preview ? (
        <div style={{ minHeight, padding: '12px', border: '1px solid ' + C.border, borderRadius: '8px', backgroundColor: C.surfaceAlt }}>
          {value ? <MarkdownPreview content={value} darkMode={darkMode} /> : <span style={{ color: C.textMuted, fontSize: '13px' }}>Nothing to preview</span>}
        </div>
      ) : (
        <textarea
          data-md-editor="true"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', minHeight, padding: '12px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, backgroundColor: C.inputBg, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6', boxSizing: 'border-box' }}
        />
      )}
    </div>
  );
}

// ─── FORUM SEARCH ───────────────────────────────────────────────────────────

export function ForumSearch({ value, onChange, placeholder = 'Search topics...', darkMode = false }: { value: string; onChange: (v: string) => void; placeholder?: string; darkMode?: boolean }) {
  const C = mkC(darkMode);
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: '14px', pointerEvents: 'none' }}>&#x2315;</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', paddingLeft: '36px', paddingRight: value ? '32px' : '12px', paddingTop: '9px', paddingBottom: '9px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', backgroundColor: C.inputBg, boxSizing: 'border-box' }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: '16px', padding: '2px' }}>&#xd7;</button>
      )}
    </div>
  );
}

// ─── NOTIFICATION BELL ──────────────────────────────────────────────────────

export function NotificationBell({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(255,255,255,0.7)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {count > 0 && (
        <span style={{ position: 'absolute', top: '-2px', right: '-4px', backgroundColor: '#c62828', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '10px', minWidth: '16px', textAlign: 'center' }}>{count}</span>
      )}
    </button>
  );
}

// ─── FORUM BUTTON ───────────────────────────────────────────────────────────

export function ForumBtn({ label, variant = 'default', onClick, small, disabled, darkMode = false }: { label: string; variant?: 'primary' | 'danger' | 'ghost' | 'default'; onClick?: () => void; small?: boolean; disabled?: boolean; darkMode?: boolean }) {
  const C = mkC(darkMode);
  const styles: Record<string, any> = {
    primary: { backgroundColor: NAVY, color: '#fff', border: `1px solid ${NAVY}` },
    danger: { backgroundColor: '#c62828', color: '#fff', border: '1px solid #c62828' },
    ghost: { backgroundColor: 'transparent', color: C.textMuted, border: `1px solid ${C.border}` },
    default: { backgroundColor: C.surface, color: C.text, border: `1px solid ${C.border}` },
  };
  const s = styles[variant] || styles.default;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...s, padding: small ? '5px 12px' : '8px 18px', borderRadius: '7px', fontSize: small ? '12px' : '13px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontFamily: 'inherit', transition: 'opacity 0.15s' }}
    >
      {label}
    </button>
  );
}
