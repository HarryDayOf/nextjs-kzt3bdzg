/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Modal, DR, Btn, Badge, IdChip, RoleBadge, KWChip, NotesPanel, highlightKeywords, CopyBtn, NAVY } from '../ui';
import { detectKeywords, uniqueHits, riskScore, riskColor, riskLabel, mkC, type KWHit, type Role, type KeywordConfig } from '../../../lib/types';

// ─── USER MODAL ───────────────────────────────────────────────────────────────
export function UserModal({ user, notes, onClose, onAction, onAddNote, currentUser, darkMode }: any) {
  const C = mkC(darkMode ?? false);
  const [tab, setTab] = useState<'info' | 'stripe' | 'security' | 'notes'>('info');
  const tabActive = darkMode ? '#e2e8f0' : NAVY;
  const tabBorder = darkMode ? '#60a5fa' : NAVY;
  const dupeCount = (user.duplicateFlags ?? []).length;
  const mono = { fontFamily: 'monospace', fontSize: '11px', color: C.textMuted } as const;

  return (
    <Modal title={user.name} subtitle={user.id} onClose={onClose} wide darkMode={darkMode}>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid ' + C.borderLight }}>
        {(['info', 'stripe', 'security', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${tabBorder}` : '2px solid transparent', fontSize: '13px', color: tab === t ? tabActive : C.textMuted, cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px', position: 'relative' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === user.id).length})` : t === 'stripe' ? 'Stripe' : t === 'security' ? 'Security' : t}
            {t === 'security' && dupeCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '-2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#c62828', color: '#fff', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dupeCount}</span>}
          </button>
        ))}
      </div>

      {/* ── INFO TAB ── */}
      {tab === 'info' && <>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Badge status={user.status} />
          {(user.repeatFlags ?? 0) >= 2 && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, backgroundColor: darkMode ? '#2a1215' : '#fdecea', color: darkMode ? '#fca5a5' : '#c62828' }}>⚠ {user.repeatFlags} policy flags</span>}
          {dupeCount > 0 && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, backgroundColor: darkMode ? '#2a1a05' : '#fff3e0', color: darkMode ? '#fcd34d' : '#e65100', cursor: 'pointer' }} onClick={() => setTab('security')}>🔍 {dupeCount} duplicate flag{dupeCount > 1 ? 's' : ''}</span>}
        </div>
        <DR label="User ID" value={<span style={mono}>{user.id}</span>} copyValue={user.id} darkMode={darkMode} />
        <DR label="Tawk.to ID" value={<span style={mono}>{user.tawk_id}</span>} copyValue={user.tawk_id} darkMode={darkMode} />
        <DR label="Email" value={<>{user.email} {user.emailVerified ? <span style={{ color: '#2e7d32', fontSize: '11px', fontWeight: 600 }}>✓ verified</span> : <span style={{ color: '#c62828', fontSize: '11px', fontWeight: 600 }}>✗ unverified</span>}</>} copyValue={user.email} darkMode={darkMode} />
        <DR label="Role" value={user.role} darkMode={darkMode} />
        <DR label="Joined" value={user.joined} darkMode={darkMode} />
        <DR label="Transactions" value={String(user.transactions)} darkMode={darkMode} />
        {user.role === 'vendor' && <DR label="Lifetime Revenue" value={`$${(user.revenue ?? 0).toLocaleString()}`} darkMode={darkMode} />}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Btn variant="primary" label="Edit Profile" onClick={() => onAction('edit', user)} darkMode={darkMode} />
          <Btn variant={user.status === 'suspended' ? 'success' : 'danger'} label={user.status === 'suspended' ? 'Unsuspend' : 'Suspend'} onClick={() => onAction('toggleSuspend', user)} darkMode={darkMode} />
          {user.status !== 'probation' && <Btn variant="warning" label="Set Probation" onClick={() => onAction('probation', user)} darkMode={darkMode} />}
          <Btn label="Open in Tawk.to" onClick={() => onAction('tawk', user)} darkMode={darkMode} />
          <Btn label="View Conversations" onClick={() => onAction('viewConvs', user)} darkMode={darkMode} />
          <Btn label="Send Message" onClick={() => onAction('message', user)} darkMode={darkMode} />
        </div>
      </>}

      {/* ── STRIPE TAB ── */}
      {tab === 'stripe' && <>
        {user.role === 'vendor' ? <>
          <DR label="Stripe Account ID" value={user.stripeAccountId ? <span style={mono}>{user.stripeAccountId}</span> : <span style={{ color: C.textMuted, fontStyle: 'italic' }}>Not connected</span>} copyValue={user.stripeAccountId} darkMode={darkMode} />
          <DR label="Connected" value={user.stripeConnected ? <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓ Connected</span> : <span style={{ color: '#c62828', fontWeight: 600 }}>✗ Not connected</span>} darkMode={darkMode} />
          <DR label="Payouts" value={user.payoutsEnabled ? <span style={{ color: '#2e7d32' }}>✓ Enabled</span> : <span style={{ color: '#c62828' }}>✗ Disabled</span>} darkMode={darkMode} />
          <DR label="Charges" value={user.chargesEnabled ? <span style={{ color: '#2e7d32' }}>✓ Enabled</span> : <span style={{ color: '#c62828' }}>✗ Disabled</span>} darkMode={darkMode} />
          {user.status === 'suspended' && user.stripeConnected && (
            <div style={{ marginTop: '12px', padding: '12px 16px', backgroundColor: darkMode ? '#2a1215' : '#fdecea', border: `1px solid ${darkMode ? '#7f1d1d' : '#fca5a5'}`, borderRadius: '8px', fontSize: '12px', color: darkMode ? '#fca5a5' : '#c62828' }}>
              ⚠ Payouts and charges disabled due to account suspension
            </div>
          )}
        </> : <>
          <DR label="Stripe Customer ID" value={user.stripeCustomerId ? <span style={mono}>{user.stripeCustomerId}</span> : <span style={{ color: C.textMuted, fontStyle: 'italic' }}>Not set up</span>} copyValue={user.stripeCustomerId} darkMode={darkMode} />
        </>}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Btn variant="primary" label="Open in Stripe Dashboard" onClick={() => onAction('stripe', user)} darkMode={darkMode} />
          {user.role === 'vendor' && !user.stripeConnected && <Btn label="Send Onboarding Link" onClick={() => onAction('stripeInvite', user)} darkMode={darkMode} />}
          {user.role === 'vendor' && user.stripeConnected && <Btn label="View Payouts" onClick={() => onAction('stripePayouts', user)} darkMode={darkMode} />}
        </div>
      </>}

      {/* ── SECURITY TAB ── */}
      {tab === 'security' && <>
        {/* Duplicate flags */}
        {dupeCount > 0 && (
          <div style={{ marginBottom: '16px', padding: '14px 16px', backgroundColor: darkMode ? '#2a1a05' : '#fff3e0', border: `1px solid ${darkMode ? '#854d0e' : '#fbbf24'}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#fcd34d' : '#b45309', marginBottom: '10px' }}>🔍 Potential Duplicate Account{dupeCount > 1 ? 's' : ''} Detected</div>
            {(user.duplicateFlags ?? []).map((f: any, i: number) => (
              <div key={i} style={{ padding: '8px 12px', backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '6px', marginBottom: i < dupeCount - 1 ? '6px' : '0', border: '1px solid ' + C.borderLight }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{f.matchedUserName}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', backgroundColor: f.confidence === 'high' ? (darkMode ? '#2a1215' : '#fdecea') : (darkMode ? '#2a1a05' : '#fff8e1'), color: f.confidence === 'high' ? (darkMode ? '#fca5a5' : '#c62828') : (darkMode ? '#fcd34d' : '#b45309'), textTransform: 'uppercase' }}>{f.confidence}</span>
                </div>
                <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '4px', fontFamily: 'monospace' }}>{f.reason}</div>
              </div>
            ))}
          </div>
        )}

        <DR label="Email Verified" value={user.emailVerified ? <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓ Verified</span> : <span style={{ color: '#c62828', fontWeight: 600 }}>✗ Not verified</span>} darkMode={darkMode} />
        <DR label="Identity Providers" value={user.identityProviders?.length ? user.identityProviders.map((p: any) => <span key={p.provider} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', backgroundColor: darkMode ? '#1e3a5f' : '#e0f2fe', color: darkMode ? '#93c5fd' : '#0369a1', marginRight: '4px', fontWeight: 500 }}>{p.provider}</span>) : <span style={{ color: C.textMuted, fontStyle: 'italic' }}>Email / password only</span>} darkMode={darkMode} />
        <DR label="Signup IP" value={<span style={mono}>{user.signupIp ?? '—'}</span>} copyValue={user.signupIp} darkMode={darkMode} />
        <DR label="Last Login IP" value={<span style={mono}>{user.lastLoginIp ?? '—'}</span>} copyValue={user.lastLoginIp} darkMode={darkMode} />
        <DR label="Last Login" value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'} darkMode={darkMode} />
        <DR label="Device Fingerprint" value={<span style={mono}>{user.deviceFingerprint ?? '—'}</span>} copyValue={user.deviceFingerprint} darkMode={darkMode} />

        {/* Login History */}
        {(user.loginHistory?.length ?? 0) > 0 && <>
          <div style={{ fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '20px', marginBottom: '8px' }}>Login History</div>
          <div style={{ borderRadius: '8px', border: '1px solid ' + C.border, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: C.surfaceAlt }}>
                  {['Date', 'IP Address', 'Device'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid ' + C.border }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(user.loginHistory ?? []).slice(0, 10).map((entry: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid ' + C.borderLight }}>
                    <td style={{ padding: '7px 12px', color: C.text }}>{new Date(entry.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                    <td style={{ padding: '7px 12px' }}><span style={mono}>{entry.ip}</span> <CopyBtn value={entry.ip} size={10} /></td>
                    <td style={{ padding: '7px 12px', color: C.textMuted }}>{entry.device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}
      </>}

      {/* ── NOTES TAB ── */}
      {tab === 'notes' && (
        <NotesPanel entityType="user" entityId={user.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'user', entityId: user.id, text })} currentUser={currentUser} darkMode={darkMode} />
      )}
    </Modal>
  );
}

// ─── LISTING MODAL ────────────────────────────────────────────────────────────
export function ListingModal({ listing, notes, onClose, onAction, onAddNote, currentUser, darkMode }: any) {
  const C = mkC(darkMode ?? false);
  const [tab, setTab] = useState<'info' | 'documents' | 'notes'>('info');
  const pendingDocs = (listing.documents ?? []).filter((d: any) => d.status === 'pending').length;
  const tabActive = darkMode ? '#e2e8f0' : NAVY;
  const tabBorder = darkMode ? '#60a5fa' : NAVY;

  return (
    <Modal title={listing.title} subtitle={listing.id} onClose={onClose} wide darkMode={darkMode}>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid ' + C.borderLight }}>
        {(['info', 'documents', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${tabBorder}` : '2px solid transparent', fontSize: '13px', color: tab === t ? tabActive : C.textMuted, cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px', position: 'relative' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === listing.id).length})` : t === 'documents' ? 'Documents' : t}
            {t === 'documents' && pendingDocs > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#c62828', color: '#fff', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingDocs}</span>}
          </button>
        ))}
      </div>
      {tab === 'info' && <>
        <DR label="Listing ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px', color: C.textMuted }}>{listing.id}</span>} copyValue={listing.id} darkMode={darkMode} />
        <DR label="Vendor" value={listing.vendor} copyValue={listing.vendor} darkMode={darkMode} />
        <DR label="Category" value={listing.category} darkMode={darkMode} />
        <DR label="Price" value={`$${listing.price.toLocaleString()}`} darkMode={darkMode} />
        <DR label="Status" value={<Badge status={listing.status} />} darkMode={darkMode} />
        <DR label="Created" value={listing.created} darkMode={darkMode} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Btn variant="primary" label="Edit Listing" onClick={() => onAction('edit', listing)} darkMode={darkMode} />
          <Btn variant="success" label="Approve" onClick={() => onAction('approve', listing)} darkMode={darkMode} />
          <Btn variant={listing.status === 'suspended' ? 'success' : 'danger'} label={listing.status === 'suspended' ? 'Unsuspend' : 'Suspend'} onClick={() => onAction('toggleSuspend', listing)} darkMode={darkMode} />
          <Btn label="Suppress from Search" onClick={() => onAction('suppress', listing)} darkMode={darkMode} />
        </div>
      </>}
      {tab === 'documents' && (
        <div>
          {(!listing.documents || listing.documents.length === 0) ? (
            <div style={{ color: C.textMuted, fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>
              No documents have been submitted for this listing.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {listing.documents.map((doc: any) => (
                <div key={doc.id} style={{ border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surfaceAlt, borderBottom: '1px solid ' + C.borderLight }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{doc.type.includes('dba') ? '📋' : doc.type === 'business_license' ? '📄' : '🛡️'}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{doc.label}</div>
                        <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '1px' }}>
                          Submitted {new Date(doc.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {doc.reviewedBy && <> · Reviewed by {doc.reviewedBy}</>}
                        </div>
                      </div>
                    </div>
                    <Badge status={doc.status} />
                  </div>

                  <div style={{ padding: '24px', backgroundColor: darkMode ? C.bg : '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '120px' }}>
                    <div style={{ fontSize: '36px' }}>{doc.url.endsWith('.pdf') ? '📄' : '📎'}</div>
                    <div style={{ fontSize: '13px', color: C.textMuted, fontWeight: 500 }}>{doc.label}</div>
                    <div style={{ fontSize: '11px', color: C.textMuted, fontFamily: 'monospace', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.url.split('/').pop()}</div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: darkMode ? '#3b82f6' : NAVY, borderRadius: '8px', fontSize: '12px', color: '#fff', fontWeight: 500, textDecoration: 'none', marginTop: '4px' }}>
                      Open Document ↗
                    </a>
                  </div>

                  {doc.status === 'pending' && (
                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid ' + C.borderLight, backgroundColor: C.surfaceAlt }}>
                      <Btn variant="success" label="✓ Approve Document" onClick={() => onAction('approveDoc', { listingId: listing.id, docId: doc.id, title: listing.title, docLabel: doc.label })} darkMode={darkMode} />
                      <Btn variant="danger" label="✗ Reject Document" onClick={() => onAction('rejectDoc', { listingId: listing.id, docId: doc.id, title: listing.title, docLabel: doc.label })} darkMode={darkMode} />
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: C.textMuted }}>Review required before listing goes live</span>
                    </div>
                  )}
                  {doc.status !== 'pending' && doc.reviewedAt && (
                    <div style={{ padding: '10px 16px', fontSize: '11px', color: doc.status === 'approved' ? '#2e7d32' : '#c62828', borderTop: '1px solid ' + C.borderLight, backgroundColor: C.surfaceAlt }}>
                      {doc.status === 'approved' ? '✓ Approved' : '✗ Rejected'} on {new Date(doc.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by {doc.reviewedBy}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === 'notes' && <NotesPanel entityType="listing" entityId={listing.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'listing', entityId: listing.id, text })} currentUser={currentUser} darkMode={darkMode} />}
    </Modal>
  );
}

// ─── TRANSACTION MODAL ────────────────────────────────────────────────────────
export function TransactionModal({ txn, notes, onClose, onAction, currentUser, darkMode }: any) {
  const C = mkC(darkMode ?? false);
  const [tab, setTab] = useState<'info' | 'dispute' | 'notes'>('info');
  const tabActive = darkMode ? '#e2e8f0' : NAVY;
  const tabBorder = darkMode ? '#60a5fa' : NAVY;

  return (
    <Modal title={`Transaction · ${txn.id.slice(0, 20)}...`} subtitle={txn.stripe_id} onClose={onClose} wide darkMode={darkMode}>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid ' + C.borderLight }}>
        {(['info', ...(txn.disputed ? ['dispute'] : []), 'notes'] as const).map((t: any) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${tabBorder}` : '2px solid transparent', fontSize: '13px', color: tab === t ? tabActive : C.textMuted, cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === txn.id).length})` : t}
          </button>
        ))}
      </div>
      {tab === 'info' && <>
        <DR label="Transaction ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px', color: C.textMuted }}>{txn.id}</span>} copyValue={txn.id} darkMode={darkMode} />
        <DR label="Stripe Payment ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px', color: C.textMuted }}>{txn.stripe_id}</span>} copyValue={txn.stripe_id} darkMode={darkMode} />
        <DR label="Buyer" value={txn.buyer} copyValue={txn.buyer} darkMode={darkMode} />
        <DR label="Seller" value={txn.seller} copyValue={txn.seller} darkMode={darkMode} />
        <DR label="Listing" value={txn.listing} copyValue={txn.listing} darkMode={darkMode} />
        <DR label="Amount" value={<span style={{ fontWeight: 700, fontSize: '15px' }}>${txn.amount.toLocaleString()}</span>} darkMode={darkMode} />
        <DR label="Status" value={<Badge status={txn.status} />} darkMode={darkMode} />
        <DR label="Date" value={txn.date} darkMode={darkMode} />
        <DR label="Dispute" value={txn.disputed ? <Badge status="disputed" /> : 'None'} darkMode={darkMode} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Btn variant="primary" label="View in Stripe" onClick={() => onAction('stripe', txn)} darkMode={darkMode} />
          <Btn variant="danger" label="Issue Refund" onClick={() => onAction('refund', txn)} darkMode={darkMode} />
          <Btn variant="warning" label="Partial Refund" onClick={() => onAction('partialRefund', txn)} darkMode={darkMode} />
          <Btn variant="success" label="Resolve Dispute" onClick={() => onAction('resolveDispute', txn)} darkMode={darkMode} />
          <Btn label="Hold Payout" onClick={() => onAction('holdPayout', txn)} darkMode={darkMode} />
        </div>
      </>}
      {tab === 'dispute' && (
        <div>
          <div style={{ backgroundColor: darkMode ? '#2a1215' : '#fdecea', border: `1px solid ${darkMode ? '#7f1d1d' : '#fca5a5'}`, borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#fca5a5' : '#c62828', marginBottom: '8px' }}>⚠ Active Dispute</div>
            <div style={{ fontSize: '13px', color: C.text, lineHeight: 1.6, marginBottom: '8px' }}><strong>Reason:</strong> {txn.dispute_reason}</div>
            <div style={{ fontSize: '12px', color: C.textMuted }}>Opened: {txn.dispute_opened}</div>
          </div>
          <DR label="Amount at Risk" value={<span style={{ fontWeight: 700, color: '#c62828' }}>${txn.amount.toLocaleString()}</span>} darkMode={darkMode} />
          <DR label="Buyer" value={txn.buyer} copyValue={txn.buyer} darkMode={darkMode} />
          <DR label="Seller" value={txn.seller} copyValue={txn.seller} darkMode={darkMode} />
          <div style={{ marginTop: '16px', padding: '14px', backgroundColor: C.surfaceAlt, borderRadius: '8px', border: '1px solid ' + C.borderLight }}>
            <div style={{ fontSize: '12px', color: C.textMuted, fontWeight: 600, marginBottom: '8px' }}>RESOLUTION OPTIONS</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Btn variant="success" label="Resolve — Favor Buyer (Full Refund)" onClick={() => onAction('refund', txn)} darkMode={darkMode} />
              <Btn variant="warning" label="Resolve — Split (Partial Refund)" onClick={() => onAction('partialRefund', txn)} darkMode={darkMode} />
              <Btn variant="danger" label="Resolve — Favor Vendor" onClick={() => onAction('resolveDispute', txn)} darkMode={darkMode} />
            </div>
          </div>
        </div>
      )}
      {tab === 'notes' && <NotesPanel entityType="transaction" entityId={txn.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'transaction', entityId: txn.id, text })} currentUser={currentUser} darkMode={darkMode} />}
    </Modal>
  );
}

// ─── REVIEW MODAL ─────────────────────────────────────────────────────────────
export function ReviewModal({ review, notes, onClose, onAction, currentUser, darkMode }: any) {
  const C = mkC(darkMode ?? false);
  const [tab, setTab] = useState<'info' | 'notes'>('info');
  const tabActive = darkMode ? '#e2e8f0' : NAVY;
  const tabBorder = darkMode ? '#60a5fa' : NAVY;

  return (
    <Modal title={`Review by ${review.author}`} subtitle={review.id} onClose={onClose} darkMode={darkMode}>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid ' + C.borderLight }}>
        {(['info', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${tabBorder}` : '2px solid transparent', fontSize: '13px', color: tab === t ? tabActive : C.textMuted, cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === review.id).length})` : t}
          </button>
        ))}
      </div>
      {tab === 'info' && <>
        <DR label="Author" value={review.author} copyValue={review.author} darkMode={darkMode} />
        <DR label="Target" value={review.target} copyValue={review.target} darkMode={darkMode} />
        <DR label="Listing" value={review.listing} copyValue={review.listing} darkMode={darkMode} />
        <DR label="Rating" value={<span style={{ color: review.rating >= 4 ? '#2e7d32' : '#c62828', fontWeight: 600, fontSize: '16px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>} darkMode={darkMode} />
        <DR label="Date" value={review.date} darkMode={darkMode} />
        <DR label="Flagged" value={review.flagged ? <Badge status="flagged" /> : 'No'} darkMode={darkMode} />
        <div style={{ margin: '16px 0', padding: '16px', backgroundColor: C.surfaceAlt, borderRadius: '8px', fontSize: '14px', color: C.text, lineHeight: 1.7, border: '1px solid ' + C.borderLight }}>{review.content}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Btn variant={review.flagged ? 'default' : 'warning'} label={review.flagged ? 'Unflag' : 'Flag'} onClick={() => onAction('toggleFlag', review)} darkMode={darkMode} />
          <Btn variant="danger" label="Remove Review" onClick={() => onAction('delete', review)} darkMode={darkMode} />
          <Btn label="View Author" onClick={() => onAction('viewAuthor', review)} darkMode={darkMode} />
        </div>
      </>}
      {tab === 'notes' && <NotesPanel entityType="review" entityId={review.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'review', entityId: review.id, text })} currentUser={currentUser} darkMode={darkMode} />}
    </Modal>
  );
}

// ─── CONVERSATION MODAL ───────────────────────────────────────────────────────
export function ConversationModal({ conv, notes, onClose, onAction, currentUser, darkMode, kwConfig }: any) {
  const C = mkC(darkMode ?? false);
  const [tab, setTab] = useState<'thread' | 'notes'>('thread');
  const allHits = kwConfig ? conv.messages.flatMap((m: any) => detectKeywords(m.text, kwConfig)) : [];
  const hits = uniqueHits(allHits);
  const score = kwConfig ? riskScore(conv, kwConfig) : 0;
  const rc = kwConfig ? riskColor(score, kwConfig) : '#2e7d32';
  const rl = kwConfig ? riskLabel(score, kwConfig) : 'Low Risk';
  const tabActive = darkMode ? '#e2e8f0' : NAVY;
  const tabBorder = darkMode ? '#60a5fa' : NAVY;

  return (
    <Modal title="Conversation Thread" subtitle={conv.id} onClose={onClose} wide darkMode={darkMode}>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid ' + C.borderLight }}>
        {(['thread', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${tabBorder}` : '2px solid transparent', fontSize: '13px', color: tab === t ? tabActive : C.textMuted, cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === conv.id).length})` : t}
          </button>
        ))}
      </div>

      {tab === 'thread' && <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {[['Participants', conv.participants.join(' + ')], ['Listing', conv.listing], ['Transaction', conv.txn_id ?? '—']].map(([l, v]) => (
            <div key={l} style={{ backgroundColor: C.surfaceAlt, borderRadius: '8px', padding: '10px 14px', border: '1px solid ' + C.borderLight }}>
              <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
              <div style={{ fontSize: '12px', color: C.text, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>{v}{v !== '—' && <CopyBtn value={v as string} size={11} />}</div>
            </div>
          ))}
        </div>

        {conv.status === 'flagged' && (
          <div style={{ backgroundColor: darkMode ? '#2a1215' : '#fdecea', border: `1px solid ${darkMode ? '#7f1d1d' : '#fca5a5'}`, borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#fca5a5' : '#c62828' }}>⚠ Policy violation detected</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: rc, fontWeight: 700 }}>{rl}</span>
                <div style={{ width: '60px', height: '5px', backgroundColor: C.borderLight, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${score}%`, height: '100%', backgroundColor: rc, borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '11px', color: rc, fontWeight: 700 }}>{score}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {hits.map((h: KWHit) => <KWChip key={h.word} word={h.word} category={h.category} kwConfig={kwConfig} />)}
            </div>
          </div>
        )}

        <div style={{ backgroundColor: C.surfaceAlt, borderRadius: '10px', border: '1px solid ' + C.borderLight, padding: '16px', marginBottom: '16px', maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {conv.messages.map((msg: any) => {
            const isV = msg.role === 'vendor';
            const mh = kwConfig ? detectKeywords(msg.text, kwConfig) : [];
            const fl = mh.length > 0;
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isV ? 'flex-end' : 'flex-start' }}>
                <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: C.textMuted }}>{msg.sender}</span>
                  {' · '}{new Date(msg.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </div>
                <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: isV ? '12px 4px 12px 12px' : '4px 12px 12px 12px', backgroundColor: fl ? (darkMode ? '#2a1215' : '#fdecea') : isV ? NAVY : C.surface, border: fl ? `1px solid ${darkMode ? '#7f1d1d' : '#fca5a5'}` : isV ? 'none' : '1px solid ' + C.border, color: fl ? C.text : isV ? '#fff' : C.text, fontSize: '13px', lineHeight: 1.6 }}>
                  {highlightKeywords(msg.text, kwConfig)}
                </div>
                {fl && <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>{mh.map((h: KWHit) => <KWChip key={h.word} word={h.word} category={h.category} kwConfig={kwConfig} />)}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!conv.reviewed && <Btn variant="success" label="Mark Reviewed" onClick={() => onAction('markReviewed', conv)} darkMode={darkMode} />}
          <Btn label="View Vendor" onClick={() => onAction('viewVendor', conv)} darkMode={darkMode} />
          <Btn label="View Couple" onClick={() => onAction('viewCouple', conv)} darkMode={darkMode} />
          {conv.txn_id && <Btn label="View Transaction" onClick={() => onAction('viewTransaction', conv)} darkMode={darkMode} />}
          {conv.status === 'flagged' && <>
            <Btn variant="danger" label="Suspend Vendor" onClick={() => onAction('suspendVendor', conv)} darkMode={darkMode} />
            <Btn variant="danger" label="Suspend Couple" onClick={() => onAction('suspendCouple', conv)} darkMode={darkMode} />
            <Btn variant="warning" label="Warn Vendor" onClick={() => onAction('policyWarning', conv)} darkMode={darkMode} />
            <Btn variant="warning" label="Warn Couple" onClick={() => onAction('warnCouple', conv)} darkMode={darkMode} />
          </>}
        </div>
      </>}

      {tab === 'notes' && <NotesPanel entityType="conversation" entityId={conv.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'conversation', entityId: conv.id, text })} currentUser={currentUser} darkMode={darkMode} />}
    </Modal>
  );
}

// ─── SEND MESSAGE MODAL ───────────────────────────────────────────────────────
export function SendMessageModal({ user, onClose, onSend, darkMode }: any) {
  const C = mkC(darkMode ?? false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [channel, setChannel] = useState<'email' | 'inapp'>('email');
  return (
    <Modal title={`Message ${user.name}`} onClose={onClose} darkMode={darkMode}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Channel</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {([['email', 'Email'], ['inapp', 'In-App']] as const).map(([val, lbl]) => (
            <button key={val} onClick={() => setChannel(val)} style={{ padding: '6px 14px', borderRadius: '8px', border: `1px solid ${channel === val ? (darkMode ? '#3b82f6' : NAVY) : C.border}`, backgroundColor: channel === val ? (darkMode ? '#3b82f6' : NAVY) : C.surface, color: channel === val ? '#fff' : C.textMuted, fontSize: '13px', cursor: 'pointer', fontWeight: channel === val ? 600 : 400 }}>{lbl}</button>
          ))}
        </div>
      </div>
      {channel === 'email' && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</div>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject" style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, backgroundColor: C.inputBg, outline: 'none', boxSizing: 'border-box' }} />
        </div>
      )}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</div>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message..." style={{ width: '100%', padding: '10px 12px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, backgroundColor: C.inputBg, minHeight: '120px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Btn variant="primary" label="Send" onClick={() => { if (body.trim()) { onSend({ channel, subject, body }); onClose(); } }} darkMode={darkMode} />
        <Btn label="Cancel" onClick={onClose} darkMode={darkMode} />
      </div>
    </Modal>
  );
}
