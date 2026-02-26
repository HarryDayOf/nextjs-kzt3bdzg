/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Modal, DR, Btn, Badge, IdChip, RoleBadge, KWChip, NotesPanel, highlightKeywords, NAVY } from '../ui';
import { detectKeywords, uniqueHits, riskScore, riskColor, riskLabel, type KWHit, type Role } from '../../../lib/types';

// ─── USER MODAL ───────────────────────────────────────────────────────────────
export function UserModal({ user, notes, onClose, onAction, onAddNote, currentUser }: any) {
  const [tab, setTab] = useState<'info' | 'history' | 'notes'>('info');

  return (
    <Modal title={user.name} subtitle={user.id} onClose={onClose} wide>
      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
        {(['info', 'history', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${NAVY}` : '2px solid transparent', fontSize: '13px', color: tab === t ? NAVY : '#9ca3af', cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === user.id).length})` : t}
          </button>
        ))}
      </div>

      {tab === 'info' && <>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Badge status={user.status} />
          {(user.repeatFlags ?? 0) >= 2 && <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, backgroundColor: '#fdecea', color: '#c62828' }}>⚠ {user.repeatFlags} policy flags</span>}
        </div>
        <DR label="User ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>{user.id}</span>} />
        <DR label="Tawk.to ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>{user.tawk_id}</span>} />
        <DR label="Email" value={user.email} />
        <DR label="Role" value={user.role} />
        <DR label="Joined" value={user.joined} />
        <DR label="Transactions" value={String(user.transactions)} />
        {user.role === 'vendor' && <>
          <DR label="Lifetime Revenue" value={`$${(user.revenue ?? 0).toLocaleString()}`} />
          <DR label="Response Rate" value={<span style={{ color: (user.responseRate ?? 0) < 70 ? '#c62828' : '#2e7d32', fontWeight: 600 }}>{user.responseRate ?? 0}%</span>} />
          <DR label="Booking Rate" value={`${user.bookingRate ?? 0}%`} />
          <DR label="Cancellation Rate" value={<span style={{ color: (user.cancellationRate ?? 0) > 10 ? '#c62828' : '#374151', fontWeight: 600 }}>{user.cancellationRate ?? 0}%</span>} />
          <DR label="Avg Rating" value={user.avgRating ? `${user.avgRating.toFixed(1)} ★` : '—'} />
        </>}


        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Btn variant="primary" label="Edit Profile" onClick={() => onAction('edit', user)} />
          <Btn variant={user.status === 'suspended' ? 'success' : 'danger'} label={user.status === 'suspended' ? 'Unsuspend' : 'Suspend'} onClick={() => onAction('toggleSuspend', user)} />
          {user.status !== 'probation' && user.role === 'vendor' && <Btn variant="warning" label="Set Probation" onClick={() => onAction('probation', user)} />}
          <Btn label="Open in Tawk.to" onClick={() => onAction('tawk', user)} />
          <Btn label="View Conversations" onClick={() => onAction('viewConvs', user)} />
          <Btn label="Send Message" onClick={() => onAction('message', user)} />
        </div>
      </>}

      {tab === 'history' && (
        <div>
          <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>Full activity history for this user — transactions, reviews, conversations.</div>
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', border: '1px solid #f3f4f6', color: '#9ca3af', fontSize: '13px', textAlign: 'center' }}>
            Activity history will pull live from Sharetribe API. Wired up by Abhi.
          </div>
        </div>
      )}

      {tab === 'notes' && (
        <NotesPanel entityType="user" entityId={user.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'user', entityId: user.id, text })} currentUser={currentUser} />
      )}
    </Modal>
  );
}

// ─── LISTING MODAL ────────────────────────────────────────────────────────────
export function ListingModal({ listing, notes, onClose, onAction, onAddNote, currentUser }: any) {
  const [tab, setTab] = useState<'info' | 'documents' | 'notes'>('info');
  const ctr = listing.inquiries > 0 ? ((listing.bookings / listing.inquiries) * 100).toFixed(0) : '0';
  const pendingDocs = (listing.documents ?? []).filter((d: any) => d.status === 'pending').length;
  return (
    <Modal title={listing.title} subtitle={listing.id} onClose={onClose} wide>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
        {(['info', 'documents', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${NAVY}` : '2px solid transparent', fontSize: '13px', color: tab === t ? NAVY : '#9ca3af', cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px', position: 'relative' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === listing.id).length})` : t === 'documents' ? 'Documents' : t}
            {t === 'documents' && pendingDocs > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#c62828', color: '#fff', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingDocs}</span>}
          </button>
        ))}
      </div>
      {tab === 'info' && <>
        <DR label="Listing ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>{listing.id}</span>} />
        <DR label="Vendor" value={listing.vendor} />
        <DR label="Category" value={listing.category} />
        <DR label="Price" value={`$${listing.price.toLocaleString()}`} />
        <DR label="Status" value={<Badge status={listing.status} />} />
        <DR label="Created" value={listing.created} />
        <DR label="Views" value={String(listing.views ?? 0)} />
        <DR label="Inquiries" value={String(listing.inquiries ?? 0)} />
        <DR label="Bookings" value={String(listing.bookings ?? 0)} />
        <DR label="Inquiry → Booking" value={<span style={{ fontWeight: 600, color: parseInt(ctr) < 20 ? '#c62828' : '#2e7d32' }}>{ctr}%</span>} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Btn variant="primary" label="Edit Listing" onClick={() => onAction('edit', listing)} />
          <Btn variant="success" label="Approve" onClick={() => onAction('approve', listing)} />
          <Btn variant={listing.status === 'suspended' ? 'success' : 'danger'} label={listing.status === 'suspended' ? 'Unsuspend' : 'Suspend'} onClick={() => onAction('toggleSuspend', listing)} />
          <Btn label="Suppress from Search" onClick={() => onAction('suppress', listing)} />
        </div>
      </>}
      {tab === 'documents' && (
        <div>
          {(!listing.documents || listing.documents.length === 0) ? (
            <div style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>
              No documents have been submitted for this listing.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {listing.documents.map((doc: any) => (
                <div key={doc.id} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                  {/* Doc Header */}
                  <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{doc.type.includes('dba') ? '📋' : doc.type === 'business_license' ? '📄' : '🛡️'}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY }}>{doc.label}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>
                          Submitted {new Date(doc.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {doc.reviewedBy && <> · Reviewed by {doc.reviewedBy}</>}
                        </div>
                      </div>
                    </div>
                    <Badge status={doc.status} />
                  </div>

                  {/* Document Preview */}
                  <div style={{ padding: '24px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '120px' }}>
                    <div style={{ fontSize: '36px' }}>{doc.url.endsWith('.pdf') ? '📄' : '📎'}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{doc.label}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.url.split('/').pop()}</div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: NAVY, borderRadius: '8px', fontSize: '12px', color: '#fff', fontWeight: 500, textDecoration: 'none', marginTop: '4px' }}>
                      Open Document ↗
                    </a>
                  </div>

                  {/* Approve / Reject actions for pending docs */}
                  {doc.status === 'pending' && (
                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                      <Btn variant="success" label="✓ Approve Document" onClick={() => onAction('approveDoc', { listingId: listing.id, docId: doc.id, title: listing.title, docLabel: doc.label })} />
                      <Btn variant="danger" label="✗ Reject Document" onClick={() => onAction('rejectDoc', { listingId: listing.id, docId: doc.id, title: listing.title, docLabel: doc.label })} />
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#9ca3af' }}>Review required before listing goes live</span>
                    </div>
                  )}
                  {doc.status !== 'pending' && doc.reviewedAt && (
                    <div style={{ padding: '10px 16px', fontSize: '11px', color: doc.status === 'approved' ? '#2e7d32' : '#c62828', borderTop: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                      {doc.status === 'approved' ? '✓ Approved' : '✗ Rejected'} on {new Date(doc.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by {doc.reviewedBy}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === 'notes' && <NotesPanel entityType="listing" entityId={listing.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'listing', entityId: listing.id, text })} currentUser={currentUser} />}
    </Modal>
  );
}

// ─── TRANSACTION MODAL ────────────────────────────────────────────────────────
export function TransactionModal({ txn, notes, onClose, onAction, currentUser }: any) {
  const [tab, setTab] = useState<'info' | 'dispute' | 'notes'>('info');
  return (
    <Modal title={`Transaction · ${txn.id.slice(0, 20)}...`} subtitle={txn.stripe_id} onClose={onClose} wide>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
        {(['info', ...(txn.disputed ? ['dispute'] : []), 'notes'] as const).map((t: any) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${NAVY}` : '2px solid transparent', fontSize: '13px', color: tab === t ? NAVY : '#9ca3af', cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === txn.id).length})` : t}
          </button>
        ))}
      </div>
      {tab === 'info' && <>
        <DR label="Transaction ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>{txn.id}</span>} />
        <DR label="Stripe Payment ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>{txn.stripe_id}</span>} />
        <DR label="Buyer" value={txn.buyer} />
        <DR label="Seller" value={txn.seller} />
        <DR label="Listing" value={txn.listing} />
        <DR label="Amount" value={<span style={{ fontWeight: 700, fontSize: '15px' }}>${txn.amount.toLocaleString()}</span>} />
        <DR label="Status" value={<Badge status={txn.status} />} />
        <DR label="Date" value={txn.date} />
        <DR label="Dispute" value={txn.disputed ? <Badge status="disputed" /> : 'None'} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Btn variant="primary" label="View in Stripe" onClick={() => onAction('stripe', txn)} />
          <Btn variant="danger" label="Issue Refund" onClick={() => onAction('refund', txn)} />
          <Btn variant="warning" label="Partial Refund" onClick={() => onAction('partialRefund', txn)} />
          <Btn variant="success" label="Resolve Dispute" onClick={() => onAction('resolveDispute', txn)} />
          <Btn label="Hold Payout" onClick={() => onAction('holdPayout', txn)} />
        </div>
      </>}
      {tab === 'dispute' && (
        <div>
          <div style={{ backgroundColor: '#fdecea', border: '1px solid #fca5a5', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#c62828', marginBottom: '8px' }}>⚠ Active Dispute</div>
            <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, marginBottom: '8px' }}><strong>Reason:</strong> {txn.dispute_reason}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Opened: {txn.dispute_opened}</div>
          </div>
          <DR label="Amount at Risk" value={<span style={{ fontWeight: 700, color: '#c62828' }}>${txn.amount.toLocaleString()}</span>} />
          <DR label="Buyer" value={txn.buyer} />
          <DR label="Seller" value={txn.seller} />
          <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, marginBottom: '8px' }}>RESOLUTION OPTIONS</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Btn variant="success" label="Resolve — Favor Buyer (Full Refund)" onClick={() => onAction('refund', txn)} />
              <Btn variant="warning" label="Resolve — Split (Partial Refund)" onClick={() => onAction('partialRefund', txn)} />
              <Btn variant="danger" label="Resolve — Favor Vendor" onClick={() => onAction('resolveDispute', txn)} />
            </div>
          </div>
        </div>
      )}
      {tab === 'notes' && <NotesPanel entityType="transaction" entityId={txn.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'transaction', entityId: txn.id, text })} currentUser={currentUser} />}
    </Modal>
  );
}

// ─── REVIEW MODAL ─────────────────────────────────────────────────────────────
export function ReviewModal({ review, notes, onClose, onAction, currentUser }: any) {
  const [tab, setTab] = useState<'info' | 'notes'>('info');
  return (
    <Modal title={`Review by ${review.author}`} subtitle={review.id} onClose={onClose}>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
        {(['info', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${NAVY}` : '2px solid transparent', fontSize: '13px', color: tab === t ? NAVY : '#9ca3af', cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === review.id).length})` : t}
          </button>
        ))}
      </div>
      {tab === 'info' && <>
        <DR label="Author" value={review.author} />
        <DR label="Target" value={review.target} />
        <DR label="Listing" value={review.listing} />
        <DR label="Rating" value={<span style={{ color: review.rating >= 4 ? '#2e7d32' : '#c62828', fontWeight: 600, fontSize: '16px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>} />
        <DR label="Date" value={review.date} />
        <DR label="Flagged" value={review.flagged ? <Badge status="flagged" /> : 'No'} />
        <div style={{ margin: '16px 0', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', color: '#374151', lineHeight: 1.7, border: '1px solid #f3f4f6' }}>{review.content}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Btn variant={review.flagged ? 'default' : 'warning'} label={review.flagged ? 'Unflag' : 'Flag'} onClick={() => onAction('toggleFlag', review)} />
          <Btn variant="danger" label="Remove Review" onClick={() => onAction('delete', review)} />
          <Btn label="View Author" onClick={() => onAction('viewAuthor', review)} />
        </div>
      </>}
      {tab === 'notes' && <NotesPanel entityType="review" entityId={review.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'review', entityId: review.id, text })} currentUser={currentUser} />}
    </Modal>
  );
}

// ─── CONVERSATION MODAL ───────────────────────────────────────────────────────
export function ConversationModal({ conv, notes, onClose, onAction, currentUser }: any) {
  const [tab, setTab] = useState<'thread' | 'notes'>('thread');
  const allHits = conv.messages.flatMap((m: any) => detectKeywords(m.text));
  const hits = uniqueHits(allHits);
  const score = riskScore(conv);
  const rc = riskColor(score);
  const rl = riskLabel(score);

  return (
    <Modal title="Conversation Thread" subtitle={conv.id} onClose={onClose} wide>
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
        {(['thread', 'notes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${NAVY}` : '2px solid transparent', fontSize: '13px', color: tab === t ? NAVY : '#9ca3af', cursor: 'pointer', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize', marginBottom: '-1px' }}>
            {t === 'notes' ? `Notes (${notes.filter((n: any) => n.entity_id === conv.id).length})` : t}
          </button>
        ))}
      </div>

      {tab === 'thread' && <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {[['Participants', conv.participants.join(' + ')], ['Listing', conv.listing], ['Transaction', conv.txn_id ?? '—']].map(([l, v]) => (
            <div key={l} style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px 14px', border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
              <div style={{ fontSize: '12px', color: NAVY, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>

        {conv.status === 'flagged' && (
          <div style={{ backgroundColor: '#fdecea', border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#c62828' }}>⚠ Policy violation detected</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: rc, fontWeight: 700 }}>{rl}</span>
                <div style={{ width: '60px', height: '5px', backgroundColor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${score}%`, height: '100%', backgroundColor: rc, borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '11px', color: rc, fontWeight: 700 }}>{score}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {hits.map((h: KWHit) => <KWChip key={h.word} word={h.word} category={h.category} />)}
            </div>
          </div>
        )}

        <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6', padding: '16px', marginBottom: '16px', maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {conv.messages.map((msg: any) => {
            const isV = msg.role === 'vendor';
            const mh = detectKeywords(msg.text);
            const fl = mh.length > 0;
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isV ? 'flex-end' : 'flex-start' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: '#6b7280' }}>{msg.sender}</span>
                  {' · '}{new Date(msg.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </div>
                <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: isV ? '12px 4px 12px 12px' : '4px 12px 12px 12px', backgroundColor: fl ? '#fdecea' : isV ? NAVY : '#fff', border: fl ? '1px solid #fca5a5' : isV ? 'none' : '1px solid #e5e7eb', color: fl ? '#1f2937' : isV ? '#fff' : '#1f2937', fontSize: '13px', lineHeight: 1.6 }}>
                  {highlightKeywords(msg.text)}
                </div>
                {fl && <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>{mh.map((h: KWHit) => <KWChip key={h.word} word={h.word} category={h.category} />)}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!conv.reviewed && <Btn variant="success" label="Mark Reviewed" onClick={() => onAction('markReviewed', conv)} />}
          <Btn label="View Vendor" onClick={() => onAction('viewVendor', conv)} />
          {conv.txn_id && <Btn label="View Transaction" onClick={() => onAction('viewTransaction', conv)} />}
          {conv.status === 'flagged' && <Btn variant="danger" label="Suspend Vendor" onClick={() => onAction('suspendVendor', conv)} />}
          {conv.status === 'flagged' && <Btn variant="warning" label="Send Policy Warning" onClick={() => onAction('policyWarning', conv)} />}
        </div>
      </>}

      {tab === 'notes' && <NotesPanel entityType="conversation" entityId={conv.id} notes={notes} onAddNote={(text) => onAction('addNote', { entityType: 'conversation', entityId: conv.id, text })} currentUser={currentUser} />}
    </Modal>
  );
}

// ─── SEND MESSAGE MODAL ───────────────────────────────────────────────────────
export function SendMessageModal({ user, onClose, onSend }: any) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [channel, setChannel] = useState<'email' | 'inapp'>('email');
  return (
    <Modal title={`Message ${user.name}`} onClose={onClose}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Channel</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {([['email', 'Email'], ['inapp', 'In-App']] as const).map(([val, lbl]) => (
            <button key={val} onClick={() => setChannel(val)} style={{ padding: '6px 14px', borderRadius: '8px', border: `1px solid ${channel === val ? NAVY : '#e5e7eb'}`, backgroundColor: channel === val ? NAVY : '#fff', color: channel === val ? '#fff' : '#6b7280', fontSize: '13px', cursor: 'pointer', fontWeight: channel === val ? 600 : 400 }}>{lbl}</button>
          ))}
        </div>
      </div>
      {channel === 'email' && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</div>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      )}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</div>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', minHeight: '120px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Btn variant="primary" label="Send" onClick={() => { if (body.trim()) { onSend({ channel, subject, body }); onClose(); } }} />
        <Btn label="Cancel" onClick={onClose} />
      </div>
    </Modal>
  );
}
