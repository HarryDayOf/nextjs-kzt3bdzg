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

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* ACTIVE ALERTS */}
      {isLeadership && activeAlerts.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Active Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeAlerts.map((a, i) => {
              const style = alertColors[a.level];
              return (
                <div key={i} onClick={() => onNavigate(a.tab)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', backgroundColor: style.bg, border: `1px solid ${style.border}`, borderRadius: '8px', cursor: 'pointer' }}
                  onMouseOver={e => (e.currentTarget.style.opacity = '0.85')} onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
                  <span>{style.icon}</span>
                  <span style={{ fontSize: '13px', color: style.color, fontWeight: 500, flex: 1 }}>{a.msg}</span>
                  <span style={{ fontSize: '12px', color: style.color, opacity: 0.6 }}>View →</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOP STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <StatCard label="Total GMV" value={`$${totalGMV.toLocaleString()}`} sub="Completed transactions" trend={{ dir: 'up', val: '12% vs last month' }} onClick={() => onNavigate('transactions')} />
        <StatCard label="Active Vendors" value={activeVendors} sub={`${pendingVendors} pending approval`} onClick={() => onNavigate('users')} />
        <StatCard label="Dispute Rate" value={`${disputeRate}%`} sub={`${disputed.length} open disputes`} color={parseFloat(disputeRate) > 5 ? '#c62828' : undefined} trend={{ dir: parseFloat(disputeRate) > 5 ? 'up' : 'down', val: '2.1% vs last month' }} onClick={() => onNavigate('transactions')} />
        <StatCard label="Flagged Convs" value={flaggedConvs.length} sub={`${unreviewedConvs.length} unreviewed`} color={unreviewedConvs.length > 0 ? '#e65100' : undefined} onClick={() => onNavigate('conversations')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <StatCard label="Active Listings" value={activeListings} sub={`${pendingListings} pending review`} onClick={() => onNavigate('listings')} />
        <StatCard label="Suspended Users" value={suspendedUsers} color={suspendedUsers > 0 ? '#c62828' : undefined} onClick={() => onNavigate('users')} />
        <StatCard label="Avg Rating" value={reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) + ' ★' : '—'} sub={`${reviews.length} total reviews`} onClick={() => onNavigate('reviews')} />
        <StatCard label="High Risk Convs" value={highRiskConvs.length} color={highRiskConvs.length > 0 ? '#c62828' : undefined} sub="Score ≥ 60" onClick={() => onNavigate('conversations')} />
      </div>

      {/* CHARTS */}
      {isLeadership && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <MiniBarChart data={MOCK_GMV_WEEKLY} valueKey="gmv" label="Weekly GMV ($)" color={NAVY} />
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <StackedBarChart data={MOCK_SIGNUPS_WEEKLY} keys={['vendors', 'couples']} colors={[NAVY, '#60a5fa']} label="Weekly Signups" />
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
          <MiniBarChart data={MOCK_GMV_WEEKLY} valueKey="disputes" label="Disputes per Week" color="#c62828" />
        </div>
      </div>}

      {/* BOTTOM PANELS */}
      {isLeadership && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

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

      </div>}
    </div>
  );
}
