/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Modal, Btn, Badge, IdChip, RoleBadge, StatCard, KWChip, NAVY } from '../ui';
import { detectKeywords, uniqueHits, type KWHit, downloadCSV, printTable } from '../../../lib/types';

// ─── REPORTS MODAL ────────────────────────────────────────────────────────────
export function ReportsModal({ data, onClose }: { data: any; onClose: () => void }) {
  const [active, setActive] = useState('overview');

  const completed = data.transactions.filter((t: any) => t.status === 'completed');
  const disputed = data.transactions.filter((t: any) => t.disputed);
  const totalGMV = completed.reduce((s: number, t: any) => s + t.amount, 0);
  const suspended = data.users.filter((u: any) => u.status === 'suspended');
  const flaggedConvs = data.conversations.filter((c: any) => c.status === 'flagged');
  const unreviewedConvs = flaggedConvs.filter((c: any) => !c.reviewed);

  const reports = [
    { id: 'overview', label: '📊 Platform Overview' },
    { id: 'transactions', label: '💳 Transactions' },
    { id: 'flags', label: '⚠ Flagged Conversations' },
    { id: 'users', label: '👤 Users' },
    { id: 'vendors', label: '🏪 Vendor Performance' },
  ];

  return (
    <Modal title="Reports" onClose={onClose} extraWide>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* SIDEBAR */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          {reports.map(r => (
            <button key={r.id} onClick={() => setActive(r.id)} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', backgroundColor: active === r.id ? '#f3f4f6' : 'transparent', border: 'none', borderRadius: '8px', fontSize: '13px', color: active === r.id ? NAVY : '#6b7280', cursor: 'pointer', fontWeight: active === r.id ? 600 : 400, marginBottom: '2px' }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, borderLeft: '1px solid #f3f4f6', paddingLeft: '24px', minWidth: 0 }}>

          {active === 'overview' && (
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>Platform Overview</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <StatCard label="Total Revenue" value={`$${totalGMV.toLocaleString()}`} sub="Completed transactions" />
                <StatCard label="Active Users" value={data.users.filter((u: any) => u.status === 'active').length} sub={`of ${data.users.length} total`} />
                <StatCard label="Active Listings" value={data.listings.filter((l: any) => l.status === 'active').length} sub={`of ${data.listings.length} total`} />
                <StatCard label="Disputed" value={disputed.length} color={disputed.length > 0 ? '#c62828' : undefined} sub={`$${disputed.reduce((s: number, t: any) => s + t.amount, 0).toLocaleString()} at risk`} />
                <StatCard label="Suspended Users" value={suspended.length} color={suspended.length > 0 ? '#c62828' : undefined} />
                <StatCard label="Flagged Convs" value={flaggedConvs.length} color={flaggedConvs.length > 0 ? '#e65100' : undefined} sub={`${unreviewedConvs.length} unreviewed`} />
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px 16px', border: '1px solid #f3f4f6' }}>
                Generated {new Date().toLocaleString()} · Mock data — Abhi wires live Sharetribe API
              </div>
            </div>
          )}

          {active === 'transactions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: NAVY }}>Transaction Report</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Btn small label="⬇ CSV" onClick={() => downloadCSV(data.transactions.map((t: any) => ({ ID: t.id, 'Stripe ID': t.stripe_id, Buyer: t.buyer, Seller: t.seller, Amount: t.amount, Status: t.status, Date: t.date, Disputed: t.disputed ? 'Yes' : 'No' })), 'dayof-transactions.csv')} />
                  <Btn small label="🖨 Print" onClick={() => printTable('Transaction Report', data.transactions, [{ key: 'id', label: 'ID' }, { key: 'buyer', label: 'Buyer' }, { key: 'seller', label: 'Seller' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }, { key: 'date', label: 'Date' }])} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <StatCard label="Total Volume" value={`$${data.transactions.reduce((s: number, t: any) => s + t.amount, 0).toLocaleString()}`} />
                <StatCard label="Completed" value={completed.length} />
                <StatCard label="Disputed" value={disputed.length} color="#c62828" />
                <StatCard label="Refunded" value={data.transactions.filter((t: any) => t.status === 'refunded').length} color="#b45309" />
              </div>
              <ReportTable rows={data.transactions} columns={[{ key: 'id', label: 'ID', render: (v: string) => <IdChip value={v.slice(0, 14) + '...'} /> }, { key: 'buyer', label: 'Buyer' }, { key: 'seller', label: 'Seller' }, { key: 'amount', label: 'Amount', render: (v: number) => <strong>${v.toLocaleString()}</strong> }, { key: 'status', label: 'Status', render: (v: string) => <Badge status={v} /> }, { key: 'date', label: 'Date' }, { key: 'disputed', label: 'Disputed', render: (v: boolean) => v ? <span style={{ color: '#c62828', fontWeight: 700 }}>⚠</span> : null }]} />
            </div>
          )}

          {active === 'flags' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: NAVY }}>Flagged Conversations</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Btn small label="⬇ CSV" onClick={() => downloadCSV(flaggedConvs.map((c: any) => ({ ID: c.id, 'P1': c.participants[0], 'P2': c.participants[1], Listing: c.listing, Reviewed: c.reviewed ? 'Yes' : 'No' })), 'dayof-flags.csv')} />
                  <Btn small label="🖨 Print" onClick={() => printTable('Flagged Conversations', flaggedConvs, [{ key: 'id', label: 'ID' }, { key: 'participants', label: 'Participants' }, { key: 'listing', label: 'Listing' }, { key: 'reviewed', label: 'Reviewed' }])} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <StatCard label="Total Flagged" value={flaggedConvs.length} color="#e65100" />
                <StatCard label="Unreviewed" value={unreviewedConvs.length} color={unreviewedConvs.length > 0 ? '#c62828' : undefined} />
                <StatCard label="Reviewed" value={flaggedConvs.filter((c: any) => c.reviewed).length} color="#2e7d32" />
              </div>
              {flaggedConvs.map((c: any) => {
                const hits = uniqueHits(c.messages.flatMap((m: any) => detectKeywords(m.text)));
                return (
                  <div key={c.id} style={{ border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px 16px', marginBottom: '10px', backgroundColor: '#fffbf9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div><div style={{ fontWeight: 600, color: NAVY, fontSize: '13px' }}>{c.participants.join(' + ')}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{c.listing}</div></div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>{c.reviewed && <span style={{ fontSize: '11px', color: '#2e7d32', fontWeight: 600 }}>✓ Reviewed</span>}<Badge status="flagged" /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{hits.map((h: KWHit) => <KWChip key={h.word} word={h.word} category={h.category} />)}</div>
                  </div>
                );
              })}
            </div>
          )}

          {active === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: NAVY }}>User Report</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Btn small label="⬇ CSV" onClick={() => downloadCSV(data.users.map((u: any) => ({ ID: u.id, Name: u.name, Email: u.email, Role: u.role, Status: u.status, Tier: u.tier, Joined: u.joined, Transactions: u.transactions })), 'dayof-users.csv')} />
                  <Btn small label="🖨 Print" onClick={() => printTable('User Report', data.users, [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' }])} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <StatCard label="Total" value={data.users.length} />
                <StatCard label="Vendors" value={data.users.filter((u: any) => u.role === 'vendor').length} />
                <StatCard label="Couples" value={data.users.filter((u: any) => u.role === 'couple').length} />
                <StatCard label="Suspended" value={suspended.length} color={suspended.length > 0 ? '#c62828' : undefined} />
              </div>
              <ReportTable rows={data.users} columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status', render: (v: string) => <Badge status={v} /> }, { key: 'tier', label: 'Tier', render: (v: string) => v ? <Badge status={v} /> : null }, { key: 'joined', label: 'Joined' }, { key: 'transactions', label: 'Txns' }]} />
            </div>
          )}

          {active === 'vendors' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: NAVY }}>Vendor Performance</div>
                <Btn small label="⬇ CSV" onClick={() => downloadCSV(data.users.filter((u: any) => u.role === 'vendor').map((u: any) => ({ Name: u.name, Status: u.status, Tier: u.tier, 'Response Rate': u.responseRate + '%', 'Booking Rate': u.bookingRate + '%', 'Cancellation Rate': u.cancellationRate + '%', 'Avg Rating': u.avgRating, 'Repeat Flags': u.repeatFlags, Revenue: '$' + u.revenue })), 'dayof-vendor-performance.csv')} />
              </div>
              <ReportTable rows={data.users.filter((u: any) => u.role === 'vendor')} columns={[
                { key: 'name', label: 'Vendor' },
                { key: 'status', label: 'Status', render: (v: string) => <Badge status={v} /> },
                { key: 'tier', label: 'Tier', render: (v: string) => v ? <Badge status={v} /> : null },
                { key: 'responseRate', label: 'Response', render: (v: number) => <span style={{ color: v < 70 ? '#c62828' : '#2e7d32', fontWeight: 600 }}>{v}%</span> },
                { key: 'bookingRate', label: 'Booking', render: (v: number) => `${v}%` },
                { key: 'cancellationRate', label: 'Cancel', render: (v: number) => <span style={{ color: v > 10 ? '#c62828' : '#374151', fontWeight: v > 10 ? 600 : 400 }}>{v}%</span> },
                { key: 'avgRating', label: 'Rating', render: (v: number) => v ? <span style={{ color: v < 3 ? '#c62828' : '#374151' }}>{v.toFixed(1)} ★</span> : '—' },
                { key: 'repeatFlags', label: 'Flags', render: (v: number) => v > 0 ? <span style={{ color: '#c62828', fontWeight: 700 }}>{v}</span> : '0' },
                { key: 'revenue', label: 'Revenue', render: (v: number) => `$${(v || 0).toLocaleString()}` },
              ]} />
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
}

// ─── REUSABLE REPORT TABLE ────────────────────────────────────────────────────
function ReportTable({ rows, columns }: { rows: any[]; columns: { key: string; label: string; render?: (v: any, row?: any) => React.ReactNode }[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ backgroundColor: '#fafafa' }}>
            {columns.map(c => <th key={c.key} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '10px', color: '#9ca3af', fontWeight: 600, borderBottom: '1px solid #f3f4f6', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
              {columns.map(c => <td key={c.key} style={{ padding: '8px 12px', color: '#374151', verticalAlign: 'middle' }}>{c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── AUDIT LOG MODAL ──────────────────────────────────────────────────────────
export function AuditLogModal({ audit, onClose }: { audit: any[]; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterType, setFilterType] = useState('');

  const filtered = audit.filter(e => {
    const ms = !search || e.actor.toLowerCase().includes(search.toLowerCase()) || e.action.toLowerCase().includes(search.toLowerCase()) || e.entity_label.toLowerCase().includes(search.toLowerCase()) || e.detail.toLowerCase().includes(search.toLowerCase());
    const mr = !filterRole || e.actor_role === filterRole;
    const mt = !filterType || e.entity_type === filterType;
    return ms && mr && mt;
  });

  return (
    <Modal title="Audit Log" subtitle="All console actions — append only" onClose={onClose} extraWide>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions, actors, entities..." style={{ flex: 1, minWidth: '200px', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', outline: 'none' }}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option><option value="cs">CS</option><option value="moderation">Moderation</option><option value="leadership">Leadership</option>
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', outline: 'none' }}>
          <option value="">All Types</option>
          <option value="user">User</option><option value="transaction">Transaction</option><option value="review">Review</option><option value="conversation">Conversation</option>
        </select>
        <Btn small label="⬇ Export" onClick={() => downloadCSV(filtered.map(e => ({ Time: e.ts, Actor: e.actor, Role: e.actor_role, Action: e.action, Entity: e.entity_label, Detail: e.detail })), 'dayof-audit.csv')} />
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>{filtered.length} entries</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {filtered.map(e => (
          <div key={e.id} style={{ display: 'flex', gap: '14px', padding: '10px 14px', backgroundColor: '#f9fafb', borderRadius: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', whiteSpace: 'nowrap', paddingTop: '1px', minWidth: '130px' }}>{new Date(e.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
            <div style={{ minWidth: '110px' }}><RoleBadge role={e.actor_role} /></div>
            <div style={{ minWidth: '120px', fontSize: '12px', fontWeight: 600, color: '#374151' }}>{e.actor}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{e.action}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{e.entity_label} — {e.detail}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No entries match your filters.</div>}
      </div>
    </Modal>
  );
}

// ─── CONSOLE USERS MODAL ──────────────────────────────────────────────────────
export function ConsoleUsersModal({ consoleUsers, onClose, onAction }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'cs' | 'moderation' | 'leadership' | 'readonly'>('cs');

  return (
    <Modal title="Console Access" subtitle="Team members with console access" onClose={onClose} wide>
      <div style={{ marginBottom: '20px' }}>
        {consoleUsers.map((u: any) => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>{u.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY }}>{u.name}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>{u.email} · Last login: {new Date(u.lastLogin).toLocaleDateString()}</div>
            </div>
            <RoleBadge role={u.role} />
            <select defaultValue={u.role} onChange={e => onAction('changeRole', { id: u.id, role: e.target.value })} style={{ padding: '5px 10px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '12px', outline: 'none' }}>
              <option value="admin">Admin</option><option value="cs">CS</option><option value="moderation">Moderation</option><option value="leadership">Leadership</option><option value="readonly">Read Only</option>
            </select>
            {u.role !== 'admin' && <Btn small variant="danger" label="Revoke" onClick={() => onAction('revoke', u)} />}
          </div>
        ))}
      </div>
      {!showAdd ? (
        <Btn label="+ Add Console User" variant="primary" onClick={() => setShowAdd(true)} />
      ) : (
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', border: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, marginBottom: '12px' }}>Add Console User</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
            <select value={newRole} onChange={e => setNewRole(e.target.value as any)} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
              <option value="cs">Customer Service</option><option value="moderation">Moderation</option><option value="leadership">Leadership</option><option value="readonly">Read Only</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Btn label="Add User" variant="primary" onClick={() => { if (newName && newEmail) { onAction('add', { name: newName, email: newEmail, role: newRole }); setShowAdd(false); setNewName(''); setNewEmail(''); } }} />
            <Btn label="Cancel" onClick={() => setShowAdd(false)} />
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── ALERTS CONFIG MODAL ─────────────────────────────────────────────────────
export function AlertsConfigModal({ alertConfigs, onClose, onUpdate }: any) {
  return (
    <Modal title="Alert Configuration" subtitle="Configure when and how the team gets notified" onClose={onClose} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginBottom: '16px' }}>
        {alertConfigs.map((a: any) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '6px', border: '1px solid #f3f4f6' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{a.label}</div>
              {a.threshold !== undefined && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Threshold: {a.threshold}</div>}
            </div>
            <select value={a.channel} onChange={e => onUpdate({ ...a, channel: e.target.value })} style={{ padding: '5px 10px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '12px', outline: 'none', backgroundColor: '#fff' }}>
              <option value="slack">Slack</option><option value="email">Email</option><option value="console">Console only</option>
            </select>
            <button onClick={() => onUpdate({ ...a, enabled: !a.enabled })} style={{ width: '40px', height: '22px', borderRadius: '11px', backgroundColor: a.enabled ? NAVY : '#e5e7eb', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '3px', left: a.enabled ? '21px' : '3px', transition: 'left 0.2s' }} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px 16px', border: '1px solid #f3f4f6' }}>
        Slack and email delivery will be wired up once webhooks are configured. Console alerts are live now.
      </div>
    </Modal>
  );
}
