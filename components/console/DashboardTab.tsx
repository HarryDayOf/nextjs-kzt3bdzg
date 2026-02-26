/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { StatCard, MiniBarChart, StackedBarChart, NAVY } from './ui';
import { riskScore, riskColor } from '../../lib/types';
import { MOCK_GMV_WEEKLY, MOCK_SIGNUPS_WEEKLY } from '../../lib/mockData';

export function DashboardTab({ data, onNavigate, role }: { data: any; onNavigate: (tab: string, filter?: string) => void; role?: string }) {
  const isLeadership = role === 'admin' || role === 'leadership';
  const { users, listings, transactions, reviews, conversations, alerts } = data;

  const completed = transactions.filter((t: any) => t.status === 'completed');
  const disputed = transactions.filter((t: any) => t.disputed);
  const totalGMV = completed.reduce((s: number, t: any) => s + t.amount, 0);
  const activeVendors = users.filter((u: any) => u.role === 'vendor' && u.status === 'active').length;
  const pendingVendors = users.filter((u: any) => u.status === 'pending').length;
  const suspendedUsers = users.filter((u: any) => u.status === 'suspended').length;
  const flaggedConvs = conversations.filter((c: any) => c.status === 'flagged');
  const unreviewedConvs = flaggedConvs.filter((c: any) => !c.reviewed);
  const flaggedReviews = reviews.filter((r: any) => r.flagged);
  const activeListings = listings.filter((l: any) => l.status === 'active').length;
  const pendingListings = listings.filter((l: any) => l.status === 'pending_review').length;
  const repeatOffenders = users.filter((u: any) => (u.repeatFlags ?? 0) >= 2);
  const disputeRate = transactions.length > 0 ? ((disputed.length / transactions.length) * 100).toFixed(1) : '0';

  const activeAlerts = [
    disputed.length > 0 && { level: 'critical', msg: `${disputed.length} open dispute${disputed.length > 1 ? 's' : ''} — $${disputed.reduce((s: number, t: any) => s + t.amount, 0).toLocaleString()} at risk`, tab: 'transactions' },
    unreviewedConvs.length > 0 && { level: 'warning', msg: `${unreviewedConvs.length} flagged conversation${unreviewedConvs.length > 1 ? 's' : ''} unreviewed`, tab: 'conversations' },
    pendingVendors > 0 && { level: 'info', msg: `${pendingVendors} vendor application${pendingVendors > 1 ? 's' : ''} pending review`, tab: 'users' },
    flaggedReviews.length > 0 && { level: 'warning', msg: `${flaggedReviews.length} flagged review${flaggedReviews.length > 1 ? 's' : ''} need moderation`, tab: 'reviews' },
    repeatOffenders.length > 0 && { level: 'critical', msg: `${repeatOffenders.length} repeat offender${repeatOffenders.length > 1 ? 's' : ''} detected`, tab: 'users' },
  ].filter(Boolean) as { level: string; msg: string; tab: string }[];

  const alertColors: Record<string, { bg: string; border: string; color: string; icon: string }> = {
    critical: { bg: '#fdecea', border: '#fca5a5', color: '#c62828', icon: '🔴' },
    warning:  { bg: '#fff8e1', border: '#fcd34d', color: '#b45309', icon: '🟡' },
    info:     { bg: '#e0f2fe', border: '#7dd3fc', color: '#0369a1', icon: '🔵' },
  };

  const highRiskConvs = conversations.filter((c: any) => riskScore(c) >= 60);

  // Moderation queue — items needing action
  const queue: { label: string; detail: string; level: string; tab: string }[] = [
    ...unreviewedConvs.map((c: any) => ({ label: `Flagged conversation`, detail: `${c.participants?.[0]} & ${c.participants?.[1]} · ${c.listing ?? ''}`, level: 'critical', tab: 'conversations' })),
    ...flaggedReviews.map((r: any) => ({ label: `Flagged review`, detail: `by ${r.author} · ${r.rating}★ — "${r.content?.slice(0, 60)}${r.content?.length > 60 ? '…' : ''}"`, level: 'warning', tab: 'reviews' })),
    ...repeatOffenders.map((u: any) => ({ label: `Repeat offender`, detail: `${u.name} · ${u.email} · ${u.repeatFlags} flags`, level: 'critical', tab: 'users' })),
    ...(pendingListings > 0 ? [{ label: `${pendingListings} listing${pendingListings > 1 ? 's' : ''} pending review`, detail: 'Awaiting approval before going live', level: 'info', tab: 'listings' }] : []),
  ];

  const queueColors: Record<string, { dot: string; label: string; bg: string }> = {
    critical: { dot: '#c62828', label: '#c62828', bg: '#fdecea' },
    warning:  { dot: '#b45309', label: '#b45309', bg: '#fff8e1' },
    info:     { dot: '#0369a1', label: '#0369a1', bg: '#e0f2fe' },
  };

  if (!isLeadership) {
    return (
      <div className="dash-pad">

        {/* MODERATION STATS */}
        <div className="stat-grid-4">
          <StatCard label="Unreviewed Flags" value={unreviewedConvs.length} color={unreviewedConvs.length > 0 ? '#c62828' : undefined} sub={`${flaggedConvs.length} total flagged`} onClick={() => onNavigate('conversations')} />
          <StatCard label="High Risk Convs" value={highRiskConvs.length} color={highRiskConvs.length > 0 ? '#c62828' : undefined} sub="Score ≥ 60" onClick={() => onNavigate('conversations')} />
          <StatCard label="Flagged Reviews" value={flaggedReviews.length} color={flaggedReviews.length > 0 ? '#b45309' : undefined} sub="Need moderation" onClick={() => onNavigate('reviews')} />
          <StatCard label="Repeat Offenders" value={repeatOffenders.length} color={repeatOffenders.length > 0 ? '#c62828' : undefined} sub="≥2 policy flags" onClick={() => onNavigate('users')} />
        </div>

        {/* NEEDS ATTENTION QUEUE */}
        <div className="panel-grid-21">
          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Needs Attention
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400 }}>{queue.length} item{queue.length !== 1 ? 's' : ''}</span>
            </div>
            {queue.length === 0
              ? <div style={{ color: '#9ca3af', fontSize: '13px', padding: '12px 0' }}>All clear — nothing needs attention.</div>
              : queue.map((item, i) => {
                  const c = queueColors[item.level];
                  return (
                    <div key={i} onClick={() => onNavigate(item.tab)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: i < queue.length - 1 ? '1px solid #f3f4f6' : 'none', cursor: 'pointer' }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c.dot, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: c.label }}>{item.label}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#d1d5db', flexShrink: 0 }}>View →</span>
                    </div>
                  );
                })
            }
          </div>

          {/* SUSPENDED USERS */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Suspended Users
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400 }}>{suspendedUsers} total</span>
            </div>
            {users.filter((u: any) => u.status === 'suspended').length === 0
              ? <div style={{ color: '#9ca3af', fontSize: '13px' }}>None currently suspended.</div>
              : users.filter((u: any) => u.status === 'suspended').map((u: any) => (
                <div key={u.id} onClick={() => onNavigate('users')} style={{ padding: '9px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{u.role} · {u.email}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-pad">

      {/* ACTIVE ALERTS */}
      {activeAlerts.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '2px' }}>Alerts</span>
          {activeAlerts.map((a, i) => {
            const s = alertColors[a.level];
            return (
              <button key={i} onClick={() => onNavigate(a.tab)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: '20px', cursor: 'pointer', fontSize: '12px', color: s.color, fontWeight: 500 }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.8')} onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
                <span style={{ fontSize: '8px' }}>●</span>{a.msg}
              </button>
            );
          })}
        </div>
      )}

      {/* TOP STATS */}
      <div className="stat-grid-4">
        <StatCard label="Total GMV" value={`$${totalGMV.toLocaleString()}`} sub="Completed transactions" trend={{ dir: 'up', val: '12% vs last month' }} onClick={() => onNavigate('transactions')} />
        <StatCard label="Active Vendors" value={activeVendors} sub={`${pendingVendors} pending approval`} onClick={() => onNavigate('users')} />
        <StatCard label="Dispute Rate" value={`${disputeRate}%`} sub={`${disputed.length} open disputes`} color={parseFloat(disputeRate) > 5 ? '#c62828' : undefined} trend={{ dir: parseFloat(disputeRate) > 5 ? 'up' : 'down', val: '2.1% vs last month' }} onClick={() => onNavigate('transactions')} />
        <StatCard label="Flagged Convs" value={flaggedConvs.length} sub={`${unreviewedConvs.length} unreviewed`} color={unreviewedConvs.length > 0 ? '#e65100' : undefined} onClick={() => onNavigate('conversations')} />
      </div>

      <div className="stat-grid-4">
        <StatCard label="Active Listings" value={activeListings} sub={`${pendingListings} pending review`} onClick={() => onNavigate('listings')} />
        <StatCard label="Suspended Users" value={suspendedUsers} color={suspendedUsers > 0 ? '#c62828' : undefined} onClick={() => onNavigate('users')} />
        <StatCard label="Avg Rating" value={reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) + ' ★' : '—'} sub={`${reviews.length} total reviews`} onClick={() => onNavigate('reviews')} />
        <StatCard label="High Risk Convs" value={highRiskConvs.length} color={highRiskConvs.length > 0 ? '#c62828' : undefined} sub="Score ≥ 60" onClick={() => onNavigate('conversations')} />
      </div>

      {/* CHARTS */}
      <div className="stat-grid-3">
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <MiniBarChart data={MOCK_GMV_WEEKLY} valueKey="gmv" label="Weekly GMV ($)" color={NAVY} />
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <StackedBarChart data={MOCK_SIGNUPS_WEEKLY} keys={['vendors', 'couples']} colors={[NAVY, '#60a5fa']} label="Weekly Signups" />
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <MiniBarChart data={MOCK_GMV_WEEKLY} valueKey="disputes" label="Disputes per Week" color="#c62828" />
        </div>
      </div>

      {/* BOTTOM PANELS */}
      <div className="panel-grid-2">

        {/* REPEAT OFFENDERS */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Repeat Offenders
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400 }}>≥2 policy flags</span>
          </div>
          {repeatOffenders.length === 0
            ? <div style={{ color: '#9ca3af', fontSize: '13px' }}>No repeat offenders.</div>
            : repeatOffenders.map((u: any) => (
              <div key={u.id} onClick={() => onNavigate('users')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{u.email}</div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#c62828', backgroundColor: '#fdecea', padding: '2px 8px', borderRadius: '20px' }}>{u.repeatFlags} flags</span>
              </div>
            ))
          }
        </div>

        {/* VENDOR PERFORMANCE SNAPSHOT */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, marginBottom: '14px' }}>Vendor Performance Snapshot</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>{['Vendor', 'Response', 'Booking', 'Cancel', 'Rating'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '8px' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.filter((u: any) => u.role === 'vendor').map((u: any) => (
                <tr key={u.id} onClick={() => onNavigate('users')} style={{ cursor: 'pointer', borderTop: '1px solid #f9fafb' }}>
                  <td style={{ padding: '8px 0', fontWeight: 500, color: NAVY }}>{u.name.length > 16 ? u.name.slice(0, 16) + '...' : u.name}</td>
                  <td style={{ padding: '8px 0', color: (u.responseRate ?? 0) < 70 ? '#c62828' : '#2e7d32' }}>{u.responseRate ?? 0}%</td>
                  <td style={{ padding: '8px 0', color: '#374151' }}>{u.bookingRate ?? 0}%</td>
                  <td style={{ padding: '8px 0', color: (u.cancellationRate ?? 0) > 10 ? '#c62828' : '#374151' }}>{u.cancellationRate ?? 0}%</td>
                  <td style={{ padding: '8px 0', color: (u.avgRating ?? 0) < 3 ? '#c62828' : '#374151' }}>{u.avgRating ? u.avgRating.toFixed(1) + ' ★' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
