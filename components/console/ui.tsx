/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { STATUS_STYLES, KW_CATEGORIES, type KWCategory, type KWHit, type Role, ROLE_LABELS } from '../../lib/types';

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
  if (id === 'conversations') return (
    <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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

// ─── ID CHIP ──────────────────────────────────────────────────────────────────
export function IdChip({ value }: { value: string }) {
  return <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 7px', borderRadius: '4px' }}>{value}</span>;
}

// ─── KEYWORD CHIP ─────────────────────────────────────────────────────────────
export function KWChip({ word, category }: { word: string; category: KWCategory }) {
  const cat = KW_CATEGORIES[category];
  return <span style={{ fontFamily: 'monospace', fontSize: '11px', color: cat.color, backgroundColor: cat.bg, padding: '2px 8px', borderRadius: '4px', fontWeight: 600, border: `1px solid ${cat.color}30` }}>{word}</span>;
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
export function Btn({ label, variant = 'default', onClick, small, disabled, icon }: { label: string; variant?: string; onClick: () => void; small?: boolean; disabled?: boolean; icon?: string }) {
  const v = BTN_VARIANTS[variant] ?? BTN_VARIANTS.default;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: small ? '5px 10px' : '8px 16px', backgroundColor: disabled ? '#f3f4f6' : v.bg, border: `1px solid ${disabled ? '#e5e7eb' : v.border}`, borderRadius: '8px', color: disabled ? '#9ca3af' : v.color, fontSize: small ? '12px' : '13px', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 500, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ title, subtitle, children, onClose, wide, extraWide }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void; wide?: boolean; extraWide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,20,40,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 20px 60px rgba(15,20,40,0.2)', padding: '32px', width: extraWide ? '960px' : wide ? '760px' : '580px', maxWidth: '97vw', maxHeight: '92vh', overflowY: 'auto' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 600, color: NAVY, marginBottom: '2px' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '22px', lineHeight: 1, paddingLeft: '16px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── DETAIL ROW ───────────────────────────────────────────────────────────────
export function DR({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'flex-start' }}>
      <span style={{ color: '#9ca3af', fontSize: '12px', minWidth: '160px', fontWeight: 500, paddingTop: '1px' }}>{label}</span>
      <span style={{ color: '#1f2937', fontSize: '13px', flex: 1 }}>{value}</span>
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
export function Logo({ white }: { white?: boolean }) {
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
export function StatCard({ label, value, sub, color, trend, onClick }: { label: string; value: string | number; sub?: string; color?: string; trend?: { dir: 'up' | 'down'; val: string }; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '18px 20px', cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 0.15s' }}
      onMouseOver={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
      onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div style={{ fontSize: '26px', fontWeight: 700, color: color || NAVY }}>{value}</div>
        {trend && <span style={{ fontSize: '12px', fontWeight: 600, color: trend.dir === 'up' ? '#2e7d32' : '#c62828' }}>{trend.dir === 'up' ? '↑' : '↓'} {trend.val}</span>}
      </div>
      {sub && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{sub}</div>}
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
export function NotesPanel({ entityType, entityId, notes, onAddNote, currentUser }: { entityType: string; entityId: string; notes: any[]; onAddNote: (text: string) => void; currentUser: any }) {
  const [text, setText] = useState('');
  const relevant = notes.filter(n => n.entity_type === entityType && n.entity_id === entityId);
  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        📝 Internal Notes <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400 }}>— visible to console team only</span>
      </div>
      {relevant.length === 0 && <div style={{ color: '#9ca3af', fontSize: '13px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>No notes yet.</div>}
      {relevant.map(n => (
        <div key={n.id} style={{ backgroundColor: n.pinned ? '#fffbeb' : '#f9fafb', border: `1px solid ${n.pinned ? '#fcd34d' : '#f3f4f6'}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: NAVY }}>{n.author}</span>
              <RoleBadge role={n.author_role} />
              {n.pinned && <span style={{ fontSize: '10px', color: '#b45309', fontWeight: 700 }}>📌 PINNED</span>}
            </div>
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(n.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{n.text}</div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Add an internal note..."
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', color: '#374151', resize: 'vertical', minHeight: '72px', outline: 'none', fontFamily: 'inherit' }} />
        <Btn label="Add Note" variant="primary" onClick={() => { if (text.trim()) { onAddNote(text.trim()); setText(''); } }} />
      </div>
    </div>
  );
}

// ─── KEYWORD HIGHLIGHT ────────────────────────────────────────────────────────
export function highlightKeywords(text: string): React.ReactNode {
  let parts: React.ReactNode[] = [text];
  (Object.keys(KW_CATEGORIES) as KWCategory[]).forEach(cat => {
    const data = KW_CATEGORIES[cat];
    parts = parts.flatMap(node => {
      if (typeof node !== 'string') return [node];
      const result: React.ReactNode[] = []; let rem = node;
      data.words.forEach(word => {
        const idx = rem.toLowerCase().indexOf(word);
        if (idx !== -1) {
          if (idx > 0) result.push(rem.slice(0, idx));
          result.push(<mark key={word + idx} style={{ backgroundColor: data.bg, color: data.color, fontWeight: 700, borderRadius: '3px', padding: '0 2px' }}>{rem.slice(idx, idx + word.length)}</mark>);
          rem = rem.slice(idx + word.length);
        }
      });
      result.push(rem); return result;
    });
  });
  return <>{parts}</>;
}

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
export function FilterPanel({ filters, setFilters, tab }: { filters: any; setFilters: (f: any) => void; tab: string }) {
  const [open, setOpen] = useState(false);
  const f = filters;
  const set = (k: string, v: any) => setFilters({ ...f, [k]: v });
  const hasActive = Object.entries(f).some(([k, v]) => k !== 'sort' && v !== '' && v !== null && v !== undefined);
  const activeCount = Object.entries(f).filter(([k, v]) => k !== 'sort' && v !== '' && v !== null && v !== undefined).length;

  const inp = (k: string, placeholder: string, type = 'text') => (
    <input type={type} placeholder={placeholder} value={f[k] || ''} onChange={e => set(k, e.target.value)}
      style={{ padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '12px', color: '#374151', outline: 'none', width: '100%', backgroundColor: '#fff', boxSizing: 'border-box' }} />
  );
  const sel = (k: string, opts: [string, string][]) => (
    <select value={f[k] || ''} onChange={e => set(k, e.target.value)}
      style={{ padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '12px', color: '#374151', outline: 'none', width: '100%', backgroundColor: '#fff' }}>
      <option value=''>All</option>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
  const label = (text: string) => <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{text}</div>;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: hasActive ? NAVY : '#fff', border: `1px solid ${hasActive ? NAVY : '#e5e7eb'}`, borderRadius: '8px', fontSize: '13px', color: hasActive ? '#fff' : '#374151', cursor: 'pointer', fontWeight: 500 }}>
        ⊟ Filters {hasActive && <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '10px', padding: '1px 6px', fontSize: '11px', fontWeight: 700 }}>{activeCount}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '44px', left: 0, backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '20px', zIndex: 50, minWidth: '340px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filters</span>
            <button onClick={() => { setFilters({ sort: f.sort }); setOpen(false); }} style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
          </div>
          {tab === 'users' && <><div>{label('Role')}{sel('role', [['vendor','Vendor'],['couple','Couple']])}</div><div>{label('Status')}{sel('status', [['active','Active'],['suspended','Suspended'],['pending','Pending'],['probation','Probation']])}</div><div>{label('Tier')}{sel('tier', [['verified','Verified'],['featured','Featured'],['new','New'],['probation','Probation'],['standard','Standard']])}</div><div>{label('Min Transactions')}{inp('min_txns','0','number')}</div><div>{label('Joined After')}{inp('joined_after','YYYY-MM-DD','date')}</div><div>{label('Joined Before')}{inp('joined_before','YYYY-MM-DD','date')}</div><div style={{gridColumn:'1/-1'}}>{label('Repeat Flags ≥')}{inp('min_flags','0','number')}</div></>}
          {tab === 'listings' && <><div>{label('Status')}{sel('status', [['active','Active'],['suspended','Suspended'],['pending_review','Pending Review']])}</div><div>{label('Category')}{sel('category', [['Photography','Photography'],['Florals','Florals'],['Entertainment','Entertainment']])}</div><div>{label('Min Price ($)')}{inp('min_price','0','number')}</div><div>{label('Max Price ($)')}{inp('max_price','99999','number')}</div><div>{label('Min Views')}{inp('min_views','0','number')}</div></>}
          {tab === 'transactions' && <><div>{label('Status')}{sel('status', [['completed','Completed'],['disputed','Disputed'],['refunded','Refunded'],['pending','Pending']])}</div><div>{label('Disputed')}{sel('disputed', [['yes','Disputed only'],['no','Non-disputed']])}</div><div>{label('Date After')}{inp('date_after','YYYY-MM-DD','date')}</div><div>{label('Date Before')}{inp('date_before','YYYY-MM-DD','date')}</div><div>{label('Min Amount ($)')}{inp('min_amount','0','number')}</div><div>{label('Max Amount ($)')}{inp('max_amount','99999','number')}</div><div style={{gridColumn:'1/-1'}}>{label('Seller')}{inp('seller','Filter by seller name')}</div><div style={{gridColumn:'1/-1'}}>{label('Buyer')}{inp('buyer','Filter by buyer name')}</div></>}
          {tab === 'reviews' && <><div>{label('Flagged')}{sel('flagged', [['yes','Flagged only'],['no','Not flagged']])}</div><div>{label('Min Rating')}{sel('min_rating', [['1','1+'],['2','2+'],['3','3+'],['4','4+'],['5','5 only']])}</div><div>{label('Max Rating')}{sel('max_rating', [['1','1 only'],['2','2 or less'],['3','3 or less'],['4','4 or less']])}</div><div>{label('Date After')}{inp('date_after','YYYY-MM-DD','date')}</div></>}
          {tab === 'conversations' && <><div>{label('Status')}{sel('status', [['flagged','Flagged'],['clean','Clean']])}</div><div>{label('Reviewed')}{sel('reviewed', [['yes','Reviewed'],['no','Unreviewed']])}</div><div>{label('Keyword Type')}{sel('kw_category', [['payment','Payment'],['contact','Contact'],['offplatform','Off-Platform']])}</div></>}
          <div style={{ gridColumn: '1/-1', paddingTop: '8px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
            <Btn label="Apply" variant="primary" onClick={() => setOpen(false)} small />
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
