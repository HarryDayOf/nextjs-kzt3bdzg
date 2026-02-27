/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from 'react';
import { Btn, Badge, StatCard, MiniBarChart } from './ui';
import { ForumReportModal, ForumTopicPreviewModal } from './modals/CommunityModals';
import { mkC, can, type Role, type ForumReport, type ForumTopic, type ForumReply } from '../../lib/types';
import { MOCK_FORUM_TOPICS, MOCK_FORUM_REPLIES, MOCK_FORUM_WEEKLY, MOCK_COMMUNITY_USERS } from '../../lib/mockData';
import { NAVY } from './ui';

interface Props {
  darkMode: boolean;
  currentRole: Role;
  toast: (msg: string) => void;
  addAudit: (action: string, entity_type: string, entity_id: string, entity_label: string, detail: string) => void;
  user: any;
  forumReports: ForumReport[];
  setForumReports: (fn: (prev: ForumReport[]) => ForumReport[]) => void;
}

export function CommunityModTab({ darkMode, currentRole, toast, addAudit, user, forumReports, setForumReports }: Props) {
  const C = mkC(darkMode);
  const [section, setSection] = useState<'reports' | 'flagged' | 'stats'>('reports');
  const [reportFilter, setReportFilter] = useState('all');
  const [selReport, setSelReport] = useState<ForumReport | null>(null);
  const [previewTopic, setPreviewTopic] = useState<ForumTopic | null>(null);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(MOCK_FORUM_TOPICS);
  const [forumReplies, setForumReplies] = useState<ForumReply[]>(MOCK_FORUM_REPLIES);

  const filteredReports = useMemo(() => {
    if (reportFilter === 'all') return forumReports;
    return forumReports.filter(r => r.status === reportFilter);
  }, [forumReports, reportFilter]);

  const pendingCount = forumReports.filter(r => r.status === 'pending').length;
  const flaggedTopics = forumTopics.filter(t => t.status === 'flagged' || t.status === 'hidden');
  const flaggedReplies = forumReplies.filter(r => r.status === 'flagged' || r.status === 'hidden');
  const activeUsers = MOCK_COMMUNITY_USERS.filter(u => u.status === 'active').length;

  const handleReportAction = (action: string, report: ForumReport) => {
    if (action === 'dismiss') {
      setForumReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'dismissed' as const, reviewedBy: user.name, reviewedAt: new Date().toISOString(), resolution: 'Content does not violate guidelines.' } : r));
      addAudit('Dismissed forum report', 'forum_report', report.id, report.targetPreview.slice(0, 30), 'Report dismissed');
      toast('Report dismissed.');
    } else if (action === 'hide') {
      setForumReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'actioned' as const, reviewedBy: user.name, reviewedAt: new Date().toISOString(), resolution: 'Content hidden for policy violation.' } : r));
      if (report.targetType === 'topic') {
        setForumTopics(prev => prev.map(t => t.id === report.targetId ? { ...t, status: 'hidden' as const } : t));
      } else {
        setForumReplies(prev => prev.map(r => r.id === report.targetId ? { ...r, status: 'hidden' as const } : r));
      }
      addAudit('Hid forum content', 'forum_' + report.targetType, report.targetId, report.targetPreview.slice(0, 30), 'Content hidden via report');
      toast('Content hidden.');
    } else if (action === 'review') {
      setForumReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'reviewed' as const, reviewedBy: user.name, reviewedAt: new Date().toISOString() } : r));
      toast('Report marked as reviewed.');
    }
    setSelReport(null);
  };

  const handleRestoreTopic = (topicId: string) => {
    setForumTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: 'active' as const } : t));
    addAudit('Restored forum topic', 'forum_topic', topicId, topicId, 'Topic restored to active');
    toast('Topic restored.');
  };

  const handleRestoreReply = (replyId: string) => {
    setForumReplies(prev => prev.map(r => r.id === replyId ? { ...r, status: 'active' as const } : r));
    toast('Reply restored.');
  };

  const sectionBtnStyle = (active: boolean) => ({
    padding: '8px 16px', borderRadius: '6px', border: `1px solid ${active ? (darkMode ? '#60a5fa' : NAVY) : C.border}`,
    backgroundColor: active ? (darkMode ? 'rgba(96,165,250,0.15)' : 'rgba(15,20,40,0.06)') : 'transparent',
    color: active ? (darkMode ? '#93c5fd' : NAVY) : C.textMuted,
    fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer' as const,
  });

  const filterBtnStyle = (active: boolean) => ({
    padding: '4px 10px', borderRadius: '4px', border: 'none',
    backgroundColor: active ? (darkMode ? 'rgba(96,165,250,0.15)' : 'rgba(15,20,40,0.06)') : 'transparent',
    color: active ? (darkMode ? '#93c5fd' : NAVY) : C.textMuted,
    fontSize: '11px', fontWeight: active ? 600 : 400, cursor: 'pointer' as const,
  });

  return (
    <div className="dash-pad" style={{ padding: '28px 32px' }}>
      {/* Section Nav */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button onClick={() => setSection('reports')} style={sectionBtnStyle(section === 'reports')}>
          Reports {pendingCount > 0 && <span style={{ marginLeft: '6px', padding: '1px 6px', borderRadius: '10px', backgroundColor: '#fdecea', color: '#c62828', fontSize: '10px', fontWeight: 700 }}>{pendingCount}</span>}
        </button>
        <button onClick={() => setSection('flagged')} style={sectionBtnStyle(section === 'flagged')}>
          Flagged Content ({flaggedTopics.length + flaggedReplies.length})
        </button>
        {can(currentRole, 'view') && (
          <button onClick={() => setSection('stats')} style={sectionBtnStyle(section === 'stats')}>Community Stats</button>
        )}
      </div>

      {/* Reports Queue */}
      {section === 'reports' && (
        <div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
            {['all', 'pending', 'reviewed', 'dismissed', 'actioned'].map(f => (
              <button key={f} onClick={() => setReportFilter(f)} style={filterBtnStyle(reportFilter === f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid ' + C.border }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reporter</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Content</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reason</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? filteredReports.map(report => (
                  <tr key={report.id} onClick={() => setSelReport(report)} style={{ borderBottom: '1px solid ' + C.borderLight, cursor: 'pointer' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = C.surfaceAlt)}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <td style={{ padding: '10px 14px', color: C.text }}>{report.reporterName}</td>
                    <td style={{ padding: '10px 14px', color: C.textMuted, textTransform: 'capitalize' }}>{report.targetType}</td>
                    <td style={{ padding: '10px 14px', color: C.text, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.targetPreview}</td>
                    <td style={{ padding: '10px 14px', color: C.textMuted, textTransform: 'capitalize' }}>{report.reason.replace('_', ' ')}</td>
                    <td style={{ padding: '10px 14px' }}><Badge status={report.status} /></td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: C.textMuted }}>No reports found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Flagged Content */}
      {section === 'flagged' && (
        <div>
          {flaggedTopics.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '10px' }}>Flagged Topics</h3>
              <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
                {flaggedTopics.map(t => (
                  <div key={t.id} style={{ padding: '12px 16px', borderBottom: '1px solid ' + C.borderLight, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{t.title}</div>
                      <div style={{ fontSize: '11px', color: C.textMuted }}>by {t.authorName} &middot; {t.replyCount} replies &middot; <Badge status={t.status} /></div>
                    </div>
                    <Btn label="Preview" small onClick={() => setPreviewTopic(t)} darkMode={darkMode} />
                    {t.status === 'hidden' && can(currentRole, 'forum_moderate') && (
                      <Btn label="Restore" small variant="success" onClick={() => handleRestoreTopic(t.id)} darkMode={darkMode} />
                    )}
                    {t.status === 'flagged' && can(currentRole, 'forum_hide') && (
                      <Btn label="Hide" small variant="danger" onClick={() => {
                        setForumTopics(prev => prev.map(x => x.id === t.id ? { ...x, status: 'hidden' as const } : x));
                        addAudit('Hid forum topic', 'forum_topic', t.id, t.title.slice(0, 30), 'Topic hidden by moderator');
                        toast('Topic hidden.');
                      }} darkMode={darkMode} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {flaggedReplies.length > 0 && (
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '10px' }}>Flagged Replies</h3>
              <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', overflow: 'hidden' }}>
                {flaggedReplies.map(r => {
                  const topic = forumTopics.find(t => t.id === r.topicId);
                  return (
                    <div key={r.id} style={{ padding: '12px 16px', borderBottom: '1px solid ' + C.borderLight, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: C.text }}>{r.body.slice(0, 100)}{r.body.length > 100 ? '...' : ''}</div>
                        <div style={{ fontSize: '11px', color: C.textMuted }}>by {r.authorName} {topic && <>in &ldquo;{topic.title.slice(0, 30)}&rdquo;</>} &middot; <Badge status={r.status} /></div>
                      </div>
                      {r.status === 'hidden' && can(currentRole, 'forum_moderate') && (
                        <Btn label="Restore" small variant="success" onClick={() => handleRestoreReply(r.id)} darkMode={darkMode} />
                      )}
                      {r.status === 'flagged' && can(currentRole, 'forum_hide') && (
                        <Btn label="Hide" small variant="danger" onClick={() => {
                          setForumReplies(prev => prev.map(x => x.id === r.id ? { ...x, status: 'hidden' as const } : x));
                          toast('Reply hidden.');
                        }} darkMode={darkMode} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {flaggedTopics.length === 0 && flaggedReplies.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, fontSize: '13px', backgroundColor: C.surface, borderRadius: '10px', border: '1px solid ' + C.border }}>
              No flagged content. All clear!
            </div>
          )}
        </div>
      )}

      {/* Community Stats */}
      {section === 'stats' && (
        <div>
          <div className="stat-grid-4">
            <StatCard label="Total Topics" value={forumTopics.filter(t => t.status !== 'deleted').length} darkMode={darkMode} />
            <StatCard label="Total Replies" value={forumReplies.filter(r => r.status !== 'deleted').length} darkMode={darkMode} />
            <StatCard label="Active Users" value={activeUsers} darkMode={darkMode} />
            <StatCard label="Pending Reports" value={pendingCount} color={pendingCount > 0 ? '#c62828' : undefined} darkMode={darkMode} />
          </div>
          <div className="panel-grid-2">
            <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Topics Per Week</h3>
              <MiniBarChart data={MOCK_FORUM_WEEKLY} valueKey="topics" label="Topics" color={NAVY} />
            </div>
            <div style={{ backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '10px', padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: C.textMuted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Replies Per Week</h3>
              <MiniBarChart data={MOCK_FORUM_WEEKLY} valueKey="replies" label="Replies" color="#60a5fa" />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selReport && (
        <ForumReportModal report={selReport} onClose={() => setSelReport(null)} onAction={handleReportAction} darkMode={darkMode} currentRole={currentRole} />
      )}
      {previewTopic && (
        <ForumTopicPreviewModal topic={previewTopic} onClose={() => setPreviewTopic(null)} darkMode={darkMode} />
      )}
    </div>
  );
}
