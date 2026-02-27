/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Modal, DR, Btn, Badge } from '../ui';
import { mkC, can, type Role, type ForumReport, type ForumTopic } from '../../../lib/types';

// ─── REPORT DETAIL MODAL ────────────────────────────────────────────────────

export function ForumReportModal({ report, onClose, onAction, darkMode, currentRole }: {
  report: ForumReport;
  onClose: () => void;
  onAction: (action: string, report: ForumReport) => void;
  darkMode: boolean;
  currentRole: Role;
}) {
  const C = mkC(darkMode);
  return (
    <Modal title="Forum Report" subtitle={report.id} onClose={onClose} darkMode={darkMode} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <DR label="Status" value={<Badge status={report.status} />} darkMode={darkMode} />
        <DR label="Target Type" value={<span style={{ textTransform: 'capitalize' }}>{report.targetType}</span>} darkMode={darkMode} />
        <DR label="Target ID" value={<span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{report.targetId}</span>} copyValue={report.targetId} darkMode={darkMode} />
        <DR label="Content Preview" value={<span>{report.targetPreview}</span>} darkMode={darkMode} />
        <DR label="Reporter" value={<span>{report.reporterName}</span>} darkMode={darkMode} />
        <DR label="Reason" value={<span style={{ textTransform: 'capitalize' }}>{report.reason.replace('_', ' ')}</span>} darkMode={darkMode} />
        <DR label="Detail" value={<span>{report.detail}</span>} darkMode={darkMode} />
        <DR label="Reported" value={<span>{new Date(report.createdAt).toLocaleString()}</span>} darkMode={darkMode} />
        {report.reviewedBy && (
          <>
            <DR label="Reviewed By" value={<span>{report.reviewedBy}</span>} darkMode={darkMode} />
            <DR label="Reviewed At" value={<span>{report.reviewedAt ? new Date(report.reviewedAt).toLocaleString() : '—'}</span>} darkMode={darkMode} />
          </>
        )}
        {report.resolution && (
          <DR label="Resolution" value={<span>{report.resolution}</span>} darkMode={darkMode} />
        )}
      </div>

      {report.status === 'pending' && can(currentRole, 'forum_moderate') && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid ' + C.border }}>
          <Btn label="Dismiss" variant="default" small onClick={() => onAction('dismiss', report)} darkMode={darkMode} />
          <Btn label="Mark Reviewed" small onClick={() => onAction('review', report)} darkMode={darkMode} />
          {can(currentRole, 'forum_hide') && (
            <Btn label="Hide Content" variant="danger" small onClick={() => onAction('hide', report)} darkMode={darkMode} />
          )}
        </div>
      )}
    </Modal>
  );
}

// ─── TOPIC PREVIEW MODAL ────────────────────────────────────────────────────

export function ForumTopicPreviewModal({ topic, onClose, darkMode }: {
  topic: ForumTopic;
  onClose: () => void;
  darkMode: boolean;
}) {
  const C = mkC(darkMode);
  return (
    <Modal title={topic.title} subtitle={topic.id} onClose={onClose} darkMode={darkMode} extraWide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <DR label="Author" value={<span>{topic.authorName} ({topic.authorRole})</span>} darkMode={darkMode} />
        <DR label="Category" value={<span>{topic.categorySlug}</span>} darkMode={darkMode} />
        <DR label="Status" value={<Badge status={topic.status} />} darkMode={darkMode} />
        <DR label="Created" value={<span>{new Date(topic.createdAt).toLocaleString()}</span>} darkMode={darkMode} />
        <DR label="Replies" value={<span>{topic.replyCount}</span>} darkMode={darkMode} />
        <DR label="Views" value={<span>{topic.viewCount}</span>} darkMode={darkMode} />
        {topic.tags.length > 0 && (
          <DR label="Tags" value={
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {topic.tags.map(tag => (
                <span key={tag} style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: C.borderLight, color: C.textMuted }}>#{tag}</span>
              ))}
            </div>
          } darkMode={darkMode} />
        )}
      </div>
      <div style={{ marginTop: '16px', padding: '16px', backgroundColor: C.surfaceAlt, borderRadius: '8px', fontSize: '13px', color: C.text, lineHeight: '1.6', whiteSpace: 'pre-wrap', maxHeight: '400px', overflow: 'auto' }}>
        {topic.body}
      </div>
    </Modal>
  );
}
