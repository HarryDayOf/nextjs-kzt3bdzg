'use client';
import { useState } from 'react';
import type { Note, Role, KWHit } from '../../lib/types';
import { ROLE_LABELS, KW_CATEGORIES, STATUS_STYLES } from '../../lib/types';

export const NAVY = '#0f1428';
export const NAVY_LIGHT = '#1e2a4a';

// ─── LOGO ──────────────────────────────────────────────────────────────────────
export function Logo({ white }: { white?: boolean }) {
  const c = white ? '#fff' : NAVY;
  return (
    <span style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: '22px', color: c, letterSpacing: '-0.02em' }}>
      Day<span style={{ fontStyle: 'italic' }}>of</span>
    </span>
  );
}

// ─── BUTTON ────────────────────────────────────────────────────────────────────
type BtnVariant = 'default' | 'primary' | 'danger' | 'ghost';
export function Btn({ children, onClick, variant = 'default', size = 'md', style, disabled }: {
  children: React.ReactNode; onClick?: () => void; variant?: BtnVariant;
  size?: 'sm' | 'md'; style?: React.CSSProperties; disabled?: boolean;
}) {
  const styles: Record<BtnVariant, React.CSSProperties> = {
    default:  { background: '#fff',  border: '1px solid #e5e7eb', color: '#374151' },
    primary:  { background: NAVY,    border: `1px solid ${NAVY}`,  color: '#fff' },
    danger:   { background: '#fdecea', border: '1px solid #f87171', color: '#c62828' },
    ghost:    { background: 'none',  border: '1px solid transparent', color: '#374151' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], padding: size === 'sm' ? '6px 12px' : '9px 16px', borderRadius: '8px',
        fontSize: size === 'sm' ? '12px' : '13px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, ...style }}>
      {children}
    </button>
  );
}

// ─── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { label: status, bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '99px',
      backgroundColor: s.bg, color: s.color, fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ─── ROLE BADGE ────────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<Role, { bg: string; color: string }> = {
  admin:      { bg: '#fdf4ff', color: '#7e22ce' },
  cs:         { bg: '#e0f2fe', color: '#0369a1' },
  moderation: { bg: '#fff8e1', color: '#b45309' },
  leadership: { bg: '#f0fdf4', color: '#15803d' },
  readonly:   { bg: '#f3f4f6', color: '#6b7280' },
};
export function RoleBadge({ role }: { role: Role }) {
  const c = ROLE_COLORS[role] ?? { bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '99px',
      backgroundColor: c.bg, color: c.color, fontSize: '11px', fontWeight: 600 }}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

// ─── KW CHIP ───────────────────────────────────────────────────────────────────
export function KWChip({ kw }: { kw: KWHit }) {
  const cat = KW_CATEGORIES[kw.category];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '4px',
      backgroundColor: cat.bg, color: cat.color, fontSize: '11px', fontWeight: 600 }}>
      {kw.word}
    </span>
  );
}

// ─── NOTES PANEL ───────────────────────────────────────────────────────────────
export function NotesPanel({ notes, onAdd, currentUser }: {
  notes: Note[]; onAdd?: (text: string) => void; currentUser: { name: string; role: Role };
}) {
  const [text, setText] = useState('');
  return (
    <div>
      {onAdd && (
        <div style={{ marginBottom: '16px' }}>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            placeholder="Add internal note..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <Btn variant="primary" size="sm" disabled={!text.trim()} onClick={() => { onAdd(text.trim()); setText(''); }}>
              Add Note
            </Btn>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notes.length === 0 && <p style={{ fontSize: '13px', color: '#9ca3af' }}>No notes yet.</p>}
        {notes.map(n => (
          <div key={n.id} style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px 14px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: NAVY }}>{n.author}</span>
              <RoleBadge role={n.author_role} />
              <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: 'auto' }}>{new Date(n.ts).toLocaleString()}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HIGHLIGHT KEYWORDS ────────────────────────────────────────────────────────
export function highlightKeywords(text: string): string {
  let result = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  Object.values(KW_CATEGORIES).forEach(({ words, color, bg }) => {
    words.forEach(word => {
      const re = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(re, `<mark style="background:${bg};color:${color};padding:1px 3px;border-radius:3px;font-weight:600">$1</mark>`);
    });
  });
  return result;
}
