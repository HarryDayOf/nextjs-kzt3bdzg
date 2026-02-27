/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { STATUS_STYLES, type KWHit, type KeywordConfig, type Role, ROLE_LABELS, mkC } from '../../lib/types';

// ─── COLORS ───────────────────────────────────────────────────────────────────
export const NAVY = '#0f1428';
export const NAVY_LIGHT = '#1e2a4a';

// ─── TAB ICONS ────────────────────────────────────────────────────────────────
export function TabIcon({ id, color = 'currentColor' }: { id: string; color?: string }) {
  const props = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (id === 'dashboard') return (
    <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  );
  if (id === 'users') return (
    <svg {...props}><circle cx="9" cy="7" r="4"/><path d="M2 21v-1a7 7 0 0 1 14 0v1"/><path d="M19 8v6m3-3h-6" strokeLinecap="round"/></svg>
  );
  if (id === 'listings') return (
    <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
  );
  if (id === 'transactions') return (
    <svg {...props}><path d="M7 16V4m0 0L3 8m4-4 4 4"/><path d="M17 8v12m0 0 4-4m-4 4-4-4"/></svg>
  );
  if (id === 'reviews') return (
    <svg {...props}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
  );
  if (id === 'documents') return (
    <svg {...props}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/><path d="M13 3v6h6"/></svg>
  );
  if (id === 'conversations') return (
    <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  );
  if (id === 'settings') return (
    <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  );
  if (id === 'community') return (
    <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
  return null;
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { label: status, bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ─── ROLE BADGE ───────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<Role, { bg: string; color: string }> = {
  admin:      { bg: '#fdecea', color: '#c62828' },
  cs:         { bg: '#e0f2fe', color: '#0369a1' },
  moderation: { bg: '#fff3e0', color: '#e65100' },
  leadership: { bg: '#f5f3ff', color: '#7c3aed' },
  readonly:   { bg: '#f3f4f6', color: '#6b7280' },
};
export function RoleBadge({ role }: { role: Role }) {
  const c = ROLE_COLORS[role];
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: c.bg, color: c.color }}>
      {ROLE_LABELS[role]}
    </span>
  );
}

// ─── COPY BUTTON ─────────────────────────────────────────────────────────────
export function CopyBtn({ value, size = 13 }: { value: string; size?: number }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} title={copied ? 'Copied!' : 'Copy to clipboard'}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: copied ? '#2e7d32' : '#6b7280', flexShrink: 0, transition: 'color 0.15s' }}
      onMouseOver={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = '#374151'; }}
      onMouseOut={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; }}>
      {copied
        ? <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      }
    </button>
  );
}

// ─── ID CHIP ──────────────────────────────────────────────────────────────────
export function IdChip({ value }: { value: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 7px', borderRadius: '4px' }}>
      {value}<CopyBtn value={value} size={11} />
    </span>
  );
}

// ─── KEYWORD CHIP ─────────────────────────────────────────────────────────────
export function KWChip({ word, category, kwConfig }: { word: string; category: string; kwConfig?: KeywordConfig }) {
  const cat = kwConfig?.categories.find(c => c.id === category);
  const color = cat?.color ?? '#6b7280';
  const bg = cat?.bg ?? '#f3f4f6';
  return <span style={{ fontFamily: 'monospace', fontSize: '11px', color, backgroundColor: bg, padding: '2px 8px', borderRadius: '4px', fontWeight: 600, border: `1px solid ${color}30` }}>{word}</span>;
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
const BTN_VARIANTS: Record<string, { bg: string; border: string; color: string }> = {
  default: { bg: '#f9fafb', border: '#e5e7eb', color: '#374151' },
  primary: { bg: NAVY, border: NAVY, color: '#fff' },
  danger:  { bg: '#fdecea', border: '#fca5a5', color: '#c62828' },
  success: { bg: '#e8f5e9', border: '#86efac', color: '#2e7d32' },
  warning: { bg: '#fff8e1', border: '#fcd34d', color: '#b45309' },
  ghost:   { bg: 'transparent', border: 'transparent', color: '#6b7280' },
};
const BTN_VARIANTS_DARK: Record<string, { bg: string; border: string; color: string }> = {
  default: { bg: '#334155', border: '#475569', color: '#e2e8f0' },
  primary: { bg: '#3b82f6', border: '#3b82f6', color: '#fff' },
  danger:  { bg: '#2a1215', border: '#7f1d1d', color: '#fca5a5' },
  success: { bg: '#0a2415', border: '#166534', color: '#86efac' },
  warning: { bg: '#2a1f05', border: '#854d0e', color: '#fcd34d' },
  ghost:   { bg: 'transparent', border: 'transparent', color: '#94a3b8' },
};
export function Btn({ label, variant = 'default', onClick, small, disabled, icon, darkMode }: { label: string; variant?: string; onClick: () => void; small?: boolean; disabled?: boolean; icon?: string; darkMode?: boolean }) {
  const palette = darkMode ? BTN_VARIANTS_DARK : BTN_VARIANTS;
  const v = palette[variant] ?? palette.default;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: small ? '5px 10px' : '8px 16px', backgroundColor: disabled ? '#f3f4f6' : v.bg, border: `1px solid ${disabled ? '#e5e7eb' : v.border}`, borderRadius: '8px', color: disabled ? '#9ca3af' : v.color, fontSize: small ? '12px' : '13px', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 500, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ title, subtitle, children, onClose, wide, extraWide, darkMode }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void; wide?: boolean; extraWide?: boolean; darkMode?: boolean }) {
  const C = mkC(darkMode ?? false);
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(15,20,40,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ backgroundColor: C.surface, borderRadius: '12px', boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(15,20,40,0.2)', padding: '32px', width: extraWide ? '960px' : wide ? '760px' : '580px', maxWidth: '97vw', maxHeight: '92vh', overflowY: 'auto' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 600, color: C.text, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>{title}<CopyBtn value={title} size={15} /></div>
            {subtitle && <div style={{ fontSize: '12px', color: C.textMuted, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>{subtitle}<CopyBtn value={subtitle} size={11} /></div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '22px', lineHeight: 1, paddingLeft: '16px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── DETAIL ROW ───────────────────────────────────────────────────────────────
export function DR({ label, value, copyValue, darkMode }: { label: string; value: React.ReactNode; copyValue?: string; darkMode?: boolean }) {
  const C = mkC(darkMode ?? false);
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid ' + C.borderLight, alignItems: 'flex-start' }}>
      <span style={{ color: C.textMuted, fontSize: '12px', minWidth: '160px', fontWeight: 500, paddingTop: '1px' }}>{label}</span>
      <span style={{ color: C.text, fontSize: '13px', flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
        {value}
        {copyValue && <CopyBtn value={copyValue} size={12} />}
      </span>
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
export function Logo({ white, darkMode }: { white?: boolean; darkMode?: boolean }) {
  if (white && darkMode) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.02em', fontStyle: 'italic' }}>Day<span style={{ fontWeight: 400 }}>Of</span></span>
      </div>
    );
  }
  const img = (
    <img
      src="https://sharetribe-assets.imgix.net/6946b9c5-eb75-4105-96e3-02ce6e1ddbbc/raw/15/781e7fee18323cc7395dc735bc1101c241e8b4?auto=format&fit=clip&h=36&w=370&s=5ac7e310f770da782ab7346d2870acf4"
      alt="Day Of"
      style={{ height: '24px', width: 'auto', display: 'block' }}
    />
  );
  if (white) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '6px', padding: '4px 10px' }}>
        {img}
      </div>
    );
  }
  return <div style={{ display: 'inline-flex', alignItems: 'center' }}>{img}</div>;
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color, trend, onClick, darkMode }: { label: string; value: string | number; sub?: string; color?: string; trend?: { dir: 'up' | 'down'; val: string }; onClick?: () => void; darkMode?: boolean }) {
  const C = mkC(darkMode ?? false);
  return (
    <div onClick={onClick} style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '18px 20px', cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 0.15s, background-color 0.25s' }}
      onMouseOver={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.boxShadow = darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)'; }}
      onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
      <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div style={{ fontSize: '26px', fontWeight: 700, color: color || (darkMode ? '#e2e8f0' : NAVY) }}>{value}</div>
        {trend && <span style={{ fontSize: '12px', fontWeight: 600, color: trend.dir === 'up' ? '#2e7d32' : '#c62828' }}>{trend.dir === 'up' ? '↑' : '↓'} {trend.val}</span>}
      </div>
      {sub && <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

// ─── SORT BUTTON ──────────────────────────────────────────────────────────────
export function SortBtn({ label, sortKey, current, onSort }: { label: string; sortKey: string; current: string; onSort: (k: string) => void }) {
  const active = current === sortKey || current === '-' + sortKey;
  const desc = current === '-' + sortKey;
  return (
    <button onClick={() => onSort(active && !desc ? '-' + sortKey : sortKey)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: active ? NAVY : '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 16px', whiteSpace: 'nowrap' }}>
      {label}{active && <span style={{ fontSize: '10px' }}>{desc ? '▼' : '▲'}</span>}
    </button>
  );
}

// ─── NOTES PANEL ─────────────────────────────────────────────────────────────
export function NotesPanel({ entityType, entityId, notes, onAddNote, currentUser, darkMode }: { entityType: string; entityId: string; notes: any[]; onAddNote: (text: string) => void; currentUser: any; darkMode?: boolean }) {
  const C = mkC(darkMode ?? false);
  const [text, setText] = useState('');
  const relevant = notes.filter(n => n.entity_type === entityType && n.entity_id === entityId);
  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        Internal Notes <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 400 }}>— visible to console team only</span>
      </div>
      {relevant.length === 0 && <div style={{ color: C.textMuted, fontSize: '13px', padding: '12px', backgroundColor: C.surfaceAlt, borderRadius: '8px', marginBottom: '12px' }}>No notes yet.</div>}
      {relevant.map(n => (
        <div key={n.id} style={{ backgroundColor: n.pinned ? (darkMode ? '#422006' : '#fffbeb') : C.surfaceAlt, border: `1px solid ${n.pinned ? (darkMode ? '#854d0e' : '#fcd34d') : C.borderLight}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{n.author}</span>
              <RoleBadge role={n.author_role} />
              {n.pinned && <span style={{ fontSize: '10px', color: '#b45309', fontWeight: 700 }}>PINNED</span>}
            </div>
            <span style={{ fontSize: '11px', color: C.textMuted }}>{new Date(n.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
          </div>
          <div style={{ fontSize: '13px', color: C.text, lineHeight: 1.6 }}>{n.text}</div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Add an internal note..."
          style={{ flex: 1, padding: '10px 12px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, backgroundColor: C.inputBg, resize: 'vertical', minHeight: '72px', outline: 'none', fontFamily: 'inherit' }} />
        <Btn label="Add Note" variant="primary" onClick={() => { if (text.trim()) { onAddNote(text.trim()); setText(''); } }} darkMode={darkMode} />
      </div>
    </div>
  );
}

// ─── KEYWORD HIGHLIGHT ────────────────────────────────────────────────────────
export function highlightKeywords(text: string, kwConfig?: KeywordConfig): React.ReactNode {
  if (!kwConfig) return text;
  // Collect all match regions
  const regions: { start: number; end: number; color: string; bg: string }[] = [];
  for (const rule of kwConfig.rules) {
    if (!rule.enabled) continue;
    const cat = kwConfig.categories.find(c => c.id === rule.categoryId);
    if (!cat?.enabled) continue;
    if (rule.type === 'exact') {
      const lower = text.toLowerCase();
      const pattern = rule.pattern.toLowerCase();
      let pos = 0;
      while (pos < lower.length) {
        const idx = lower.indexOf(pattern, pos);
        if (idx === -1) break;
        regions.push({ start: idx, end: idx + pattern.length, color: cat.color, bg: cat.bg });
        pos = idx + pattern.length;
      }
    } else {
      try {
        const re = new RegExp(rule.pattern, 'gi');
        let match;
        while ((match = re.exec(text)) !== null) {
          regions.push({ start: match.index, end: match.index + match[0].length, color: cat.color, bg: cat.bg });
          if (!match[0].length) break;
        }
      } catch { /* skip invalid regex */ }
    }
  }
  if (!regions.length) return text;
  // Sort by start position, merge overlaps
  regions.sort((a, b) => a.start - b.start);
  const merged: typeof regions = [];
  for (const r of regions) {
    const last = merged[merged.length - 1];
    if (last && r.start <= last.end) { last.end = Math.max(last.end, r.end); }
    else merged.push({ ...r });
  }
  // Build React nodes
  const parts: React.ReactNode[] = [];
  let pos = 0;
  merged.forEach((r, i) => {
    if (r.start > pos) parts.push(text.slice(pos, r.start));
    parts.push(<mark key={i} style={{ backgroundColor: r.bg, color: r.color, fontWeight: 700, borderRadius: '3px', padding: '0 2px' }}>{text.slice(r.start, r.end)}</mark>);
    pos = r.end;
  });
  if (pos < text.length) parts.push(text.slice(pos));
  return <>{parts}</>;
}

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
export function FilterPanel({ filters, setFilters, tab, darkMode, kwConfig }: { filters: any; setFilters: (f: any) => void; tab: string; darkMode?: boolean; kwConfig?: KeywordConfig }) {
  const C = mkC(darkMode ?? false);
  const [open, setOpen] = useState(false);
  const f = filters;
  const set = (k: string, v: any) => setFilters({ ...f, [k]: v });
  const hasActive = Object.entries(f).some(([k, v]) => k !== 'sort' && v !== '' && v !== null && v !== undefined);
  const activeCount = Object.entries(f).filter(([k, v]) => k !== 'sort' && v !== '' && v !== null && v !== undefined).length;

  const inp = (k: string, placeholder: string, type = 'text') => (
    <input type={type} placeholder={placeholder} value={f[k] || ''} onChange={e => set(k, e.target.value)}
      style={{ padding: '7px 10px', border: '1px solid ' + C.inputBorder, borderRadius: '7px', fontSize: '12px', color: C.text, outline: 'none', width: '100%', backgroundColor: C.inputBg, boxSizing: 'border-box' }} />
  );
  const sel = (k: string, opts: [string, string][]) => (
    <select value={f[k] || ''} onChange={e => set(k, e.target.value)}
      style={{ padding: '7px 10px', border: '1px solid ' + C.inputBorder, borderRadius: '7px', fontSize: '12px', color: C.text, outline: 'none', width: '100%', backgroundColor: C.inputBg }}>
      <option value=''>All</option>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
  const label = (text: string) => <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{text}</div>;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: hasActive ? (darkMode ? '#3b82f6' : NAVY) : C.surface, border: `1px solid ${hasActive ? (darkMode ? '#3b82f6' : NAVY) : C.border}`, borderRadius: '8px', fontSize: '13px', color: hasActive ? '#fff' : C.text, cursor: 'pointer', fontWeight: 500 }}>
        ⊟ Filters {hasActive && <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '10px', padding: '1px 6px', fontSize: '11px', fontWeight: 700 }}>{activeCount}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '44px', left: 0, backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)', padding: '20px', zIndex: 50, minWidth: '340px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filters</span>
            <button onClick={() => { setFilters({ sort: f.sort }); setOpen(false); }} style={{ fontSize: '12px', color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
          </div>
          {tab === 'users' && <><div>{label('Role')}{sel('role', [['vendor','Vendor'],['couple','Couple']])}</div><div>{label('Status')}{sel('status', [['active','Active'],['suspended','Suspended'],['pending','Pending'],['probation','Probation']])}</div><div>{label('Tier')}{sel('tier', [['verified','Verified'],['featured','Featured'],['new','New'],['probation','Probation'],['standard','Standard']])}</div><div>{label('Min Transactions')}{inp('min_txns','0','number')}</div><div>{label('Joined After')}{inp('joined_after','YYYY-MM-DD','date')}</div><div>{label('Joined Before')}{inp('joined_before','YYYY-MM-DD','date')}</div><div style={{gridColumn:'1/-1'}}>{label('Repeat Flags ≥')}{inp('min_flags','0','number')}</div></>}
          {tab === 'listings' && <><div>{label('Status')}{sel('status', [['active','Active'],['suspended','Suspended'],['pending_review','Pending Review']])}</div><div>{label('Category')}{sel('category', [['Photography','Photography'],['Florals','Florals'],['Entertainment','Entertainment']])}</div><div>{label('Min Price ($)')}{inp('min_price','0','number')}</div><div>{label('Max Price ($)')}{inp('max_price','99999','number')}</div></>}
          {tab === 'transactions' && <><div>{label('Status')}{sel('status', [['completed','Completed'],['disputed','Disputed'],['refunded','Refunded'],['pending','Pending']])}</div><div>{label('Disputed')}{sel('disputed', [['yes','Disputed only'],['no','Non-disputed']])}</div><div>{label('Date After')}{inp('date_after','YYYY-MM-DD','date')}</div><div>{label('Date Before')}{inp('date_before','YYYY-MM-DD','date')}</div><div>{label('Min Amount ($)')}{inp('min_amount','0','number')}</div><div>{label('Max Amount ($)')}{inp('max_amount','99999','number')}</div><div style={{gridColumn:'1/-1'}}>{label('Seller')}{inp('seller','Filter by seller name')}</div><div style={{gridColumn:'1/-1'}}>{label('Buyer')}{inp('buyer','Filter by buyer name')}</div></>}
          {tab === 'reviews' && <><div>{label('Flagged')}{sel('flagged', [['yes','Flagged only'],['no','Not flagged']])}</div><div>{label('Min Rating')}{sel('min_rating', [['1','1+'],['2','2+'],['3','3+'],['4','4+'],['5','5 only']])}</div><div>{label('Max Rating')}{sel('max_rating', [['1','1 only'],['2','2 or less'],['3','3 or less'],['4','4 or less']])}</div><div>{label('Date After')}{inp('date_after','YYYY-MM-DD','date')}</div></>}
          {tab === 'conversations' && <><div>{label('Status')}{sel('status', [['flagged','Flagged'],['clean','Clean']])}</div><div>{label('Reviewed')}{sel('reviewed', [['yes','Reviewed'],['no','Unreviewed']])}</div><div>{label('Keyword Type')}{sel('kw_category', (kwConfig?.categories.filter(c => c.enabled) ?? []).map(c => [c.id, c.label] as [string, string]))}</div></>}
          <div style={{ gridColumn: '1/-1', paddingTop: '8px', borderTop: '1px solid ' + C.borderLight, display: 'flex', justifyContent: 'flex-end' }}>
            <Btn label="Apply" variant="primary" onClick={() => setOpen(false)} small darkMode={darkMode} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
export function MiniBarChart({ data, valueKey, label, color = NAVY }: { data: any[]; valueKey: string; label: string; color?: string }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '100%', height: `${max > 0 ? Math.max(4, (d[valueKey] / max) * 72) : 4}px`, backgroundColor: color, borderRadius: '3px 3px 0 0', opacity: i === data.length - 1 ? 0.5 : 1, transition: 'height 0.3s' }} title={`${d.week}: ${d[valueKey]}`} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, fontSize: '9px', color: '#d1d5db', textAlign: 'center', overflow: 'hidden' }}>{d.week.replace('Jan ', 'J').replace('Feb ', 'F')}</div>
        ))}
      </div>
    </div>
  );
}

// ─── STACKED BAR CHART ────────────────────────────────────────────────────────
export function StackedBarChart({ data, keys, colors, label }: { data: any[]; keys: string[]; colors: string[]; label: string }) {
  const maxVal = Math.max(...data.map(d => keys.reduce((s, k) => s + (d[k] || 0), 0)));
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
        {data.map((d, i) => {
          const total = keys.reduce((s, k) => s + (d[k] || 0), 0);
          const barH = maxVal > 0 ? Math.max(4, (total / maxVal) * 72) : 4;
          return (
            <div key={i} style={{ flex: 1, height: `${barH}px`, display: 'flex', flexDirection: 'column', borderRadius: '3px 3px 0 0', overflow: 'hidden' }}>
              {keys.map((k, ki) => (
                <div key={k} style={{ flex: d[k] || 0, backgroundColor: colors[ki], minHeight: d[k] > 0 ? '2px' : '0' }} />
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, fontSize: '9px', color: '#d1d5db', textAlign: 'center', overflow: 'hidden' }}>{d.week.replace('Jan ', 'J').replace('Feb ', 'F')}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        {keys.map((k, ki) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: colors[ki] }} />
            <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'capitalize' }}>{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GLOBAL SEARCH RESULTS ────────────────────────────────────────────────────
export function GlobalSearchResults({ query, data, onNavigate }: { query: string; data: any; onNavigate: (tab: string, item: any) => void }) {
  if (!query.trim()) return null;
  const q = query.toLowerCase();
  const matchU = data.users.filter((u: any) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q));
  const matchL = data.listings.filter((l: any) => l.title.toLowerCase().includes(q) || l.vendor.toLowerCase().includes(q) || l.id.toLowerCase().includes(q));
  const matchT = data.transactions.filter((t: any) => t.buyer.toLowerCase().includes(q) || t.seller.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.stripe_id.toLowerCase().includes(q));
  const matchR = data.reviews.filter((r: any) => r.author.toLowerCase().includes(q) || r.target.toLowerCase().includes(q) || r.content.toLowerCase().includes(q));
  const matchC = data.conversations.filter((c: any) => c.participants.some((p: string) => p.toLowerCase().includes(q)) || c.listing.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  const total = matchU.length + matchL.length + matchT.length + matchR.length + matchC.length;

  if (!total) return (
    <div style={{ position: 'absolute', top: '46px', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '24px', zIndex: 60, textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
      No results for "{query}"
    </div>
  );

  function Section({ label, items, tab, renderItem }: { label: string; items: any[]; tab: string; renderItem: (i: any) => React.ReactNode }) {
    if (!items.length) return null;
    return (
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px 6px' }}>{label} · {items.length}</div>
        {items.slice(0, 4).map((item: any, idx: number) => (
          <div key={idx} onClick={() => onNavigate(tab, item)} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }} onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f9fafb')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', top: '46px', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '12px', zIndex: 60, maxHeight: '480px', overflowY: 'auto' }}>
      <div style={{ fontSize: '12px', color: '#9ca3af', padding: '0 12px 10px', borderBottom: '1px solid #f3f4f6', marginBottom: '8px' }}>{total} result{total !== 1 ? 's' : ''} for "{query}"</div>
      <Section label="Users" items={matchU} tab="users" renderItem={u => <><div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>{u.name[0]}</div><div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{u.name}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{u.email} · {u.role}</div></div><Badge status={u.status} /></>} />
      <Section label="Listings" items={matchL} tab="listings" renderItem={l => <><div style={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>📋</div><div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{l.title}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{l.vendor} · ${l.price.toLocaleString()}</div></div><Badge status={l.status} /></>} />
      <Section label="Transactions" items={matchT} tab="transactions" renderItem={t => <><div style={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>💳</div><div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{t.buyer} → {t.seller}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>${t.amount.toLocaleString()} · {t.date}</div></div><Badge status={t.status} /></>} />
      <Section label="Reviews" items={matchR} tab="reviews" renderItem={r => <><div style={{ fontSize: '14px', flexShrink: 0 }}>{'★'.repeat(r.rating)}</div><div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{r.author} → {r.target}</div><div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{r.content}</div></div></>} />
      <Section label="Conversations" items={matchC} tab="conversations" renderItem={c => <><div style={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: c.status === 'flagged' ? '#fdecea' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{c.status === 'flagged' ? '⚠' : '💬'}</div><div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{c.participants.join(' + ')}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{c.listing}</div></div><Badge status={c.status} /></>} />
    </div>
  );
}
