/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Badge, Btn, CopyBtn, NAVY } from './ui';
import { mkC } from '../../lib/types';

export function DocumentsTab({ listings, darkMode, onAction, onSelectListing }: {
  listings: any[];
  darkMode?: boolean;
  onAction: (action: string, payload: any) => void;
  onSelectListing: (listing: any) => void;
}) {
  const C = mkC(darkMode ?? false);
  const linkColor = darkMode ? '#60a5fa' : NAVY;
  const [filter, setFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');

  // Flatten all documents with their parent listing context
  const allDocs: { doc: any; listing: any }[] = [];
  listings.forEach(l => {
    (l.documents ?? []).forEach((d: any) => {
      allDocs.push({ doc: d, listing: l });
    });
  });

  const filtered = filter === 'all' ? allDocs : allDocs.filter(({ doc }) => doc.status === filter);
  const pendingCount = allDocs.filter(({ doc }) => doc.status === 'pending').length;
  const approvedCount = allDocs.filter(({ doc }) => doc.status === 'approved').length;
  const rejectedCount = allDocs.filter(({ doc }) => doc.status === 'rejected').length;

  const filters: { key: typeof filter; label: string; count: number }[] = [
    { key: 'pending', label: 'Pending Review', count: pendingCount },
    { key: 'approved', label: 'Approved', count: approvedCount },
    { key: 'rejected', label: 'Rejected', count: rejectedCount },
    { key: 'all', label: 'All', count: allDocs.length },
  ];

  return (
    <div style={{ padding: '24px 28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: C.text }}>Document Verification</div>
          <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>Review vendor business documents before listings go live</div>
        </div>
        {pendingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: darkMode ? '#2a1215' : '#fdecea', border: `1px solid ${darkMode ? '#7f1d1d' : '#fca5a5'}`, borderRadius: '20px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#c62828' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: darkMode ? '#fca5a5' : '#c62828' }}>{pendingCount} pending review</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {filters.map(f => {
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding: '7px 14px', borderRadius: '8px', border: `1px solid ${active ? (darkMode ? '#475569' : NAVY) : C.border}`, backgroundColor: active ? (darkMode ? '#334155' : NAVY) : C.surface, color: active ? (darkMode ? '#e2e8f0' : '#fff') : C.textMuted, fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {f.label}
              <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: active ? 'rgba(255,255,255,0.2)' : C.surfaceAlt, fontWeight: 700 }}>{f.count}</span>
            </button>
          );
        })}
      </div>

      {/* Document Cards */}
      {filtered.length === 0 ? (
        <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>
            {filter === 'pending' ? '✅' : '📄'}
          </div>
          <div style={{ fontSize: '14px', color: C.textMuted, fontWeight: 500 }}>
            {filter === 'pending' ? 'No documents pending review' : `No ${filter} documents`}
          </div>
          <div style={{ fontSize: '12px', color: C.textFaint, marginTop: '4px' }}>
            {filter === 'pending' ? 'All vendor documents have been reviewed.' : 'Try a different filter.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(({ doc, listing }) => (
            <div key={doc.id} style={{ backgroundColor: C.surface, border: `1px solid ${doc.status === 'pending' ? (darkMode ? '#854d0e' : '#fcd34d') : C.border}`, borderRadius: '10px', overflow: 'hidden', transition: 'background-color 0.25s' }}>

              {/* Card Top: Listing context + Status */}
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid ' + C.borderLight }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '22px' }}>{doc.type.includes('dba') ? '📋' : doc.type === 'business_license' ? '📄' : '🛡️'}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>{doc.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <button onClick={() => onSelectListing(listing)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '12px', color: linkColor, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                        {listing.title}
                      </button>
                      <span style={{ fontSize: '11px', color: C.textMuted }}>by {listing.vendor}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Badge status={doc.status} />
                </div>
              </div>

              {/* Card Body: File info + Actions */}
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>File</div>
                    <div style={{ fontSize: '12px', color: C.text, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>{doc.url.split('/').pop()}<CopyBtn value={doc.url} size={11} /></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Submitted</div>
                    <div style={{ fontSize: '12px', color: C.text }}>{new Date(doc.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  {doc.reviewedBy && (
                    <div>
                      <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Reviewed by</div>
                      <div style={{ fontSize: '12px', color: C.text }}>{doc.reviewedBy} · {new Date(doc.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: C.surfaceAlt, border: '1px solid ' + C.border, borderRadius: '7px', fontSize: '12px', color: linkColor, fontWeight: 500, textDecoration: 'none' }}>
                    View File ↗
                  </a>
                  {doc.status === 'pending' && (
                    <>
                      <Btn variant="success" label="Approve" small onClick={() => onAction('approveDoc', { listingId: listing.id, docId: doc.id, title: listing.title, docLabel: doc.label })} />
                      <Btn variant="danger" label="Reject" small onClick={() => onAction('rejectDoc', { listingId: listing.id, docId: doc.id, title: listing.title, docLabel: doc.label })} />
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
