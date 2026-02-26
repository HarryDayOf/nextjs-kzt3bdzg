/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Badge, IdChip, KWChip, SortBtn, FilterPanel, Btn, CopyBtn, NAVY } from './ui';
import { detectKeywords, uniqueHits, riskScore, riskColor, downloadCSV, printTable, mkC, type KWHit } from '../../lib/types';

interface TableTabProps {
  tab: string;
  items: any[];
  // Pagination
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  sort: string;
  filters: any;
  setFilters: (f: any) => void;
  onSort: (k: string) => void;
  onSelect: (item: any) => void;
  onExportCSV: () => void;
  onPrint: () => void;
  tabSearch: string;
  setTabSearch: (s: string) => void;
  // Conversations-specific
  convFilter?: string;
  setConvFilter?: (f: string) => void;
  allConvs?: any[];
  darkMode?: boolean;
}

export function TableTab({ tab, items, totalCount, page, pageSize, onPageChange, sort, filters, setFilters, onSort, onSelect, onExportCSV, onPrint, tabSearch, setTabSearch, convFilter, setConvFilter, allConvs, darkMode }: TableTabProps) {
  const C = mkC(darkMode ?? false);
  const linkColor = darkMode ? '#60a5fa' : NAVY;
  const flagBg = darkMode ? '#1e1a10' : '#fffbf5';

  const th: React.CSSProperties = { textAlign: 'left', fontSize: '11px', fontWeight: 600, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid ' + C.borderLight, whiteSpace: 'nowrap', backgroundColor: C.surfaceAlt, padding: 0 };
  const td: React.CSSProperties = { padding: '11px 16px', borderBottom: '1px solid ' + C.borderLight, fontSize: '13px', color: C.text, verticalAlign: 'middle' };

  function SH({ label, sortKey }: { label: string; sortKey: string }) {
    return <th style={th}><SortBtn label={label} sortKey={sortKey} current={sort} onSort={onSort} /></th>;
  }

  const flagged = allConvs?.filter(c => c.status === 'flagged').length ?? 0;
  const unrev = allConvs?.filter(c => c.status === 'flagged' && !c.reviewed).length ?? 0;
  const clean = allConvs?.filter(c => c.status === 'clean').length ?? 0;
  const lastPage = Math.ceil(totalCount / pageSize);

  return (
    <div>
      {/* TOOLBAR */}
      <div style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', borderBottom: '1px solid ' + C.borderLight, backgroundColor: C.surface }}>
        {tab === 'conversations' ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            {([['all', 'All', allConvs?.length ?? 0], ['flagged', 'Flagged', flagged], ['unreviewed', 'Needs Review', unrev], ['clean', 'Clean', clean]] as [string, string, number][]).map(([val, label, count]) => (
              <button key={val} onClick={() => { setConvFilter?.(val); setTabSearch(''); }} style={{ padding: '6px 12px', backgroundColor: convFilter === val ? (darkMode ? '#3b82f6' : NAVY) : C.surface, border: '1px solid ' + C.border, borderRadius: '8px', fontSize: '12px', color: convFilter === val ? '#fff' : C.textMuted, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                {label}<span style={{ opacity: 0.65, fontSize: '11px' }}>{count}</span>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: '14px' }}>⌕</span>
            <input style={{ paddingLeft: '30px', paddingRight: tabSearch ? '28px' : '12px', paddingTop: '8px', paddingBottom: '8px', width: '240px', backgroundColor: C.inputBg, border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none' }} placeholder={`Search ${tab}...`} value={tabSearch} onChange={e => setTabSearch(e.target.value)} />
            {tabSearch && <button onClick={() => setTabSearch('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '14px' }}>×</button>}
          </div>
        )}
        {tab === 'conversations' && (
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: '14px' }}>⌕</span>
            <input style={{ paddingLeft: '30px', paddingTop: '8px', paddingBottom: '8px', width: '200px', backgroundColor: C.inputBg, border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '12px', color: C.text, outline: 'none' }} placeholder="Search..." value={tabSearch} onChange={e => setTabSearch(e.target.value)} />
          </div>
        )}
        <FilterPanel filters={filters} setFilters={setFilters} tab={tab} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: C.textMuted }}>{totalCount.toLocaleString()} {totalCount === 1 ? 'result' : 'results'}</span>
          <Btn small label="⬇ CSV" onClick={onExportCSV} />
          <Btn small label="🖨 Print" onClick={onPrint} />
        </div>
      </div>

      {/* TABLE */}
      <div style={{ backgroundColor: C.surface, overflowX: 'auto' }}>
        {tab === 'users' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><SH label="Name" sortKey="name" /><SH label="Email" sortKey="email" /><SH label="Role" sortKey="role" /><SH label="Status" sortKey="status" /><SH label="Joined" sortKey="joined" /><SH label="Txns" sortKey="transactions" /><th style={{ ...th, padding: '10px 16px' }}>Flags</th><th style={{ ...th, padding: '10px 16px' }} /></tr></thead>
            <tbody>{items.map((u: any) => (
              <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(u)} onMouseOver={e => (e.currentTarget.style.backgroundColor = C.surfaceAlt)} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <td style={td}><div style={{ fontWeight: 500, color: linkColor }}>{u.name}</div><div style={{ fontSize: '10px', color: C.textMuted, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '3px' }}>{u.id.slice(0, 8)}...<CopyBtn value={u.id} size={10} /></div></td>
                <td style={td}><span style={{ color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{u.email}<CopyBtn value={u.email} size={11} /></span></td>
                <td style={td}><span style={{ fontSize: '11px', color: C.textMuted, backgroundColor: C.surfaceAlt, padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{u.role}</span></td>
                <td style={td}><Badge status={u.status} /></td>
                <td style={td}><span style={{ color: C.textMuted, fontSize: '12px' }}>{u.joined}</span></td>
                <td style={td}>{u.transactions}</td>
                <td style={td}>{(u.repeatFlags ?? 0) > 0 && <span style={{ color: '#c62828', fontWeight: 700, fontSize: '12px' }}>{u.repeatFlags} ⚠</span>}</td>
                <td style={td}><span style={{ color: C.textFaint, fontSize: '12px' }}>›</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {tab === 'listings' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><SH label="Title" sortKey="title" /><SH label="Vendor" sortKey="vendor" /><SH label="Category" sortKey="category" /><SH label="Price" sortKey="price" /><SH label="Status" sortKey="status" /><SH label="Views" sortKey="views" /><SH label="Booking Rate" sortKey="bookings" /><th style={{ ...th, padding: '10px 16px' }} /></tr></thead>
            <tbody>{items.map((l: any) => {
              const ctr = (l.inquiries ?? 0) > 0 ? Math.round((l.bookings / l.inquiries) * 100) : 0;
              return (
                <tr key={l.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(l)} onMouseOver={e => (e.currentTarget.style.backgroundColor = C.surfaceAlt)} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={td}><div style={{ fontWeight: 500, color: linkColor }}>{l.title}</div><div style={{ fontSize: '10px', color: C.textMuted, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '3px' }}>{l.id}<CopyBtn value={l.id} size={10} /></div></td>
                  <td style={td}><span style={{ color: C.textMuted }}>{l.vendor}</span></td>
                  <td style={td}><span style={{ fontSize: '11px', color: C.textMuted, backgroundColor: C.surfaceAlt, padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{l.category}</span></td>
                  <td style={td}><span style={{ fontWeight: 500 }}>${l.price.toLocaleString()}</span></td>
                  <td style={td}><Badge status={l.status} /></td>
                  <td style={td}><span style={{ color: C.textMuted }}>{l.views ?? 0}</span></td>
                  <td style={td}><span style={{ color: ctr < 20 ? '#c62828' : '#2e7d32', fontWeight: ctr < 20 ? 600 : 400 }}>{ctr}%</span></td>
                  <td style={td}><span style={{ color: C.textFaint, fontSize: '12px' }}>›</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        )}

        {tab === 'transactions' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><SH label="ID" sortKey="id" /><SH label="Buyer" sortKey="buyer" /><SH label="Seller" sortKey="seller" /><SH label="Amount" sortKey="amount" /><SH label="Status" sortKey="status" /><SH label="Date" sortKey="date" /><th style={{ ...th, padding: '10px 16px' }}>Disputed</th><th style={{ ...th, padding: '10px 16px' }} /></tr></thead>
            <tbody>{items.map((t: any) => (
              <tr key={t.id} style={{ cursor: 'pointer', backgroundColor: t.disputed ? flagBg : 'transparent' }} onClick={() => onSelect(t)} onMouseOver={e => (e.currentTarget.style.backgroundColor = C.surfaceAlt)} onMouseOut={e => (e.currentTarget.style.backgroundColor = t.disputed ? flagBg : 'transparent')}>
                <td style={td}><IdChip value={t.id.slice(0, 14) + '...'} /></td>
                <td style={td}><span style={{ fontWeight: 500, color: linkColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{t.buyer}<CopyBtn value={t.buyer} size={11} /></span></td>
                <td style={td}><span style={{ color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{t.seller}<CopyBtn value={t.seller} size={11} /></span></td>
                <td style={td}><span style={{ fontWeight: 600, color: linkColor }}>${t.amount.toLocaleString()}</span></td>
                <td style={td}><Badge status={t.status} /></td>
                <td style={td}><span style={{ color: C.textMuted, fontSize: '12px' }}>{t.date}</span></td>
                <td style={td}>{t.disputed && <span style={{ color: '#c62828', fontWeight: 700 }}>⚠ Yes</span>}</td>
                <td style={td}><span style={{ color: C.textFaint, fontSize: '12px' }}>›</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {tab === 'reviews' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><SH label="Author" sortKey="author" /><SH label="About" sortKey="target" /><SH label="Rating" sortKey="rating" /><th style={th}><SortBtn label="Preview" sortKey="content" current={sort} onSort={onSort} /></th><SH label="Date" sortKey="date" /><th style={{ ...th, padding: '10px 16px' }}>Flagged</th><th style={{ ...th, padding: '10px 16px' }} /></tr></thead>
            <tbody>{items.map((r: any) => (
              <tr key={r.id} style={{ cursor: 'pointer', backgroundColor: r.flagged ? flagBg : 'transparent' }} onClick={() => onSelect(r)} onMouseOver={e => (e.currentTarget.style.backgroundColor = C.surfaceAlt)} onMouseOut={e => (e.currentTarget.style.backgroundColor = r.flagged ? flagBg : 'transparent')}>
                <td style={td}><span style={{ fontWeight: 500, color: linkColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{r.author}<CopyBtn value={r.author} size={11} /></span></td>
                <td style={td}><span style={{ color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{r.target}<CopyBtn value={r.target} size={11} /></span></td>
                <td style={td}><span style={{ color: r.rating >= 4 ? '#2e7d32' : '#c62828', letterSpacing: '1px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></td>
                <td style={{ ...td, maxWidth: '200px' }}><span style={{ color: C.textMuted, fontSize: '12px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.content}</span></td>
                <td style={td}><span style={{ color: C.textMuted, fontSize: '12px' }}>{r.date}</span></td>
                <td style={td}>{r.flagged && <Badge status="flagged" />}</td>
                <td style={td}><span style={{ color: C.textFaint, fontSize: '12px' }}>›</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {tab === 'conversations' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><SH label="Participants" sortKey="participants" /><SH label="Listing" sortKey="listing" /><SH label="Msgs" sortKey="message_count" /><SH label="Last Activity" sortKey="last_message" /><th style={{ ...th, padding: '10px 16px' }}>Risk</th><th style={{ ...th, padding: '10px 16px' }}>Keywords</th><SH label="Status" sortKey="status" /><th style={{ ...th, padding: '10px 16px' }} /></tr></thead>
            <tbody>{items.map((c: any) => {
              const ch = uniqueHits(c.messages.flatMap((m: any) => detectKeywords(m.text)));
              const score = riskScore(c);
              const rc = riskColor(score);
              const unrevBg = c.status === 'flagged' && !c.reviewed ? flagBg : 'transparent';
              return (
                <tr key={c.id} style={{ cursor: 'pointer', backgroundColor: unrevBg }} onClick={() => onSelect(c)} onMouseOver={e => (e.currentTarget.style.backgroundColor = C.surfaceAlt)} onMouseOut={e => (e.currentTarget.style.backgroundColor = unrevBg)}>
                  <td style={td}><div style={{ fontWeight: 500, color: linkColor, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '3px' }}>{c.participants[0]}<CopyBtn value={c.participants[0]} size={10} /></div><div style={{ color: C.textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>{c.participants[1]}<CopyBtn value={c.participants[1]} size={10} /></div></td>
                  <td style={{ ...td, maxWidth: '150px' }}><span style={{ color: C.textMuted, fontSize: '12px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.listing}</span></td>
                  <td style={td}><span style={{ color: C.textMuted }}>{c.message_count}</span></td>
                  <td style={td}><span style={{ color: C.textMuted, fontSize: '12px' }}>{new Date(c.last_message).toLocaleDateString()}</span></td>
                  <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '40px', height: '5px', backgroundColor: C.borderLight, borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: `${score}%`, height: '100%', backgroundColor: rc, borderRadius: '3px' }} /></div><span style={{ fontSize: '11px', color: rc, fontWeight: 600 }}>{score}</span></div></td>
                  <td style={td}>{ch.length > 0 ? <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>{ch.slice(0, 2).map((h: KWHit) => <KWChip key={h.word} word={h.word} category={h.category} />)}{ch.length > 2 && <span style={{ fontSize: '11px', color: C.textMuted }}>+{ch.length - 2}</span>}</div> : <span style={{ color: C.textFaint, fontSize: '12px' }}>None</span>}</td>
                  <td style={td}><Badge status={c.status} /></td>
                  <td style={td}>{c.reviewed && <span style={{ fontSize: '11px', color: '#2e7d32', fontWeight: 600 }}>✓</span>}</td>
                </tr>
              );
            })}</tbody>
          </table>
        )}

        {items.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: C.textMuted, fontSize: '14px' }}>No results match your filters.</div>
        )}
      </div>

      {/* PAGINATION FOOTER */}
      {totalCount > 0 && (
        <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid ' + C.borderLight, backgroundColor: C.surfaceAlt }}>
          <span style={{ fontSize: '12px', color: C.textMuted }}>
            {totalCount === 0
              ? 'No results'
              : `Showing ${((page - 1) * pageSize + 1).toLocaleString()}–${Math.min(page * pageSize, totalCount).toLocaleString()} of ${totalCount.toLocaleString()}`}
          </span>

          {totalCount > pageSize && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => onPageChange(1)}
                disabled={page <= 1}
                style={{ padding: '4px 8px', border: '1px solid ' + C.border, borderRadius: '6px', backgroundColor: page <= 1 ? C.surfaceAlt : C.surface, color: page <= 1 ? C.textFaint : C.text, cursor: page <= 1 ? 'default' : 'pointer', fontSize: '12px' }}>
                «
              </button>
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                style={{ padding: '4px 10px', border: '1px solid ' + C.border, borderRadius: '6px', backgroundColor: page <= 1 ? C.surfaceAlt : C.surface, color: page <= 1 ? C.textFaint : C.text, cursor: page <= 1 ? 'default' : 'pointer', fontSize: '12px', fontWeight: 500 }}>
                ‹ Prev
              </button>
              <span style={{ fontSize: '12px', color: C.textMuted, padding: '0 10px', whiteSpace: 'nowrap' }}>
                Page {page} of {lastPage.toLocaleString()}
              </span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= lastPage}
                style={{ padding: '4px 10px', border: '1px solid ' + C.border, borderRadius: '6px', backgroundColor: page >= lastPage ? C.surfaceAlt : C.surface, color: page >= lastPage ? C.textFaint : C.text, cursor: page >= lastPage ? 'default' : 'pointer', fontSize: '12px', fontWeight: 500 }}>
                Next ›
              </button>
              <button
                onClick={() => onPageChange(lastPage)}
                disabled={page >= lastPage}
                style={{ padding: '4px 8px', border: '1px solid ' + C.border, borderRadius: '6px', backgroundColor: page >= lastPage ? C.surfaceAlt : C.surface, color: page >= lastPage ? C.textFaint : C.text, cursor: page >= lastPage ? 'default' : 'pointer', fontSize: '12px' }}>
                »
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
