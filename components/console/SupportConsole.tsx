'use client';
import { useState, useMemo } from 'react';
import { NAVY, NAVY_LIGHT, Btn, Badge, Logo } from './ui';
import { NotesPanel } from './ui';
import { ConversationModal } from './ConversationModal';
import { AuditLogModal } from './AuditLogModal';
import {
  detectKeywords, uniqueHits, riskScore, riskColor, riskLabel,
  can, type Role, type Note, type AuditEntry,
} from '../../lib/types';
import {
  MOCK_CONVERSATIONS, MOCK_NOTES, MOCK_AUDIT,
} from '../../lib/mockData';
import type { Conversation } from '../../lib/types';

type ConvFilter = 'all' | 'flagged' | 'unreviewed' | 'clean';

export default function SupportConsole({ user }: { user: { name: string; role: Role } }) {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [audit, setAudit] = useState<AuditEntry[]>(MOCK_AUDIT);
  const [filter, setFilter] = useState<ConvFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [showAudit, setShowAudit] = useState(false);
  const [toast, setToast] = useState('');

  const addAudit = (action: string, entity_id: string, entity_label: string, detail: string) => {
    const entry: AuditEntry = {
      id: 'a_' + Date.now(), actor: user.name, actor_role: user.role,
      action, entity_type: 'conversation', entity_id, entity_label, detail,
      ts: new Date().toISOString(),
    };
    setAudit(p => [entry, ...p]);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const filtered = useMemo(() => {
    let list = conversations;
    if (search) list = list.filter(c =>
      c.participants.some(p => p.toLowerCase().includes(search.toLowerCase())) ||
      c.listing.toLowerCase().includes(search.toLowerCase())
    );
    if (filter === 'flagged') list = list.filter(c => c.status === 'flagged');
    if (filter === 'unreviewed') list = list.filter(c => !c.reviewed && c.status === 'flagged');
    if (filter === 'clean') list = list.filter(c => c.status === 'clean');
    return [...list].sort((a, b) => riskScore(b) - riskScore(a));
  }, [conversations, filter, search]);

  const unreviewedCount = conversations.filter(c => !c.reviewed && c.status === 'flagged').length;

  const handleMarkReviewed = (id: string) => {
    setConversations(p => p.map(c => c.id === id ? { ...c, reviewed: true } : c));
    const conv = conversations.find(c => c.id === id);
    if (conv) addAudit('mark_reviewed', id, conv.participants.join(' + '), 'Marked as reviewed');
    showToast('Marked as reviewed');
  };

  const handleFlag = (id: string) => {
    setConversations(p => p.map(c => c.id === id ? { ...c, status: 'flagged' } : c));
    const conv = conversations.find(c => c.id === id);
    if (conv) addAudit('flag', id, conv.participants.join(' + '), 'Manually flagged');
    showToast('Conversation flagged');
  };

  const handleAddNote = (entity_id: string, text: string) => {
    const note: Note = {
      id: 'n_' + Date.now(), entity_type: 'conversation', entity_id,
      author: user.name, author_role: user.role, text, ts: new Date().toISOString(),
    };
    setNotes(p => [note, ...p]);
    const conv = conversations.find(c => c.id === entity_id);
    if (conv) addAudit('add_note', entity_id, conv.participants.join(' + '), 'Added note');
  };

  const SHARETRIBE_URL = 'https://flex-console.sharetribe.com';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: NAVY, padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Logo white />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href={`${SHARETRIBE_URL}/users`} target="_blank" rel="noreferrer"
            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Users ↗</a>
          <a href={`${SHARETRIBE_URL}/listings`} target="_blank" rel="noreferrer"
            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Listings ↗</a>
          <a href={`${SHARETRIBE_URL}/transactions`} target="_blank" rel="noreferrer"
            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Transactions ↗</a>
          {can(user.role, 'export') && (
            <Btn size="sm" variant="ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => setShowAudit(true)}>Audit Log</Btn>
          )}
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: NAVY_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 600 }}>
              {user.name[0]}
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, maxWidth: '960px', margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: NAVY }}>Conversation Monitor</h1>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
              {conversations.length} total · {unreviewedCount} need review
            </p>
          </div>
        </div>

        {/* Filters + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search participants or listing..."
            style={{ flex: 1, padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
          />
          {(['all', 'flagged', 'unreviewed', 'clean'] as ConvFilter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '1px solid', textTransform: 'capitalize',
                backgroundColor: filter === f ? NAVY : '#fff',
                borderColor: filter === f ? NAVY : '#e5e7eb',
                color: filter === f ? '#fff' : '#6b7280',
              }}>
              {f === 'unreviewed' ? `Needs Review${unreviewedCount ? ` (${unreviewedCount})` : ''}` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(conv => {
            const score = riskScore(conv);
            const kws = uniqueHits(conv.messages.flatMap(m => detectKeywords(m.text)));
            const convNotes = notes.filter(n => n.entity_id === conv.id);
            return (
              <div key={conv.id}
                onClick={() => setSelected(conv)}
                style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px 20px', cursor: 'pointer', transition: 'border-color 0.15s',
                  borderLeft: `4px solid ${riskColor(score)}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = NAVY)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: NAVY }}>{conv.participants.join(' + ')}</span>
                      <Badge status={conv.status} />
                      {conv.reviewed && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>✓ Reviewed</span>}
                      {convNotes.length > 0 && <span style={{ fontSize: '11px', color: '#6b7280' }}>📝 {convNotes.length}</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{conv.listing}</div>
                    <div style={{ fontSize: '13px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.last_message}
                    </div>
                    {kws.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                        {kws.map(kw => (
                          <span key={kw.word} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                            backgroundColor: kw.category === 'payment' ? '#fdecea' : kw.category === 'contact' ? '#fff8e1' : '#f5f3ff',
                            color: kw.category === 'payment' ? '#c62828' : kw.category === 'contact' ? '#b45309' : '#7c3aed',
                            fontWeight: 600 }}>
                            {kw.word}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: riskColor(score) }}>{score}</div>
                    <div style={{ fontSize: '11px', color: riskColor(score), fontWeight: 600 }}>{riskLabel(score)}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{conv.message_count} msgs</div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', fontSize: '14px' }}>
              No conversations match this filter.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selected && (
        <ConversationModal
          conv={selected}
          notes={notes.filter(n => n.entity_id === selected.id)}
          currentUser={user}
          onClose={() => setSelected(null)}
          onMarkReviewed={() => { handleMarkReviewed(selected.id); setSelected(null); }}
          onFlag={() => handleFlag(selected.id)}
          onAddNote={(text) => handleAddNote(selected.id, text)}
          canAct={can(user.role, 'notes')}
        />
      )}
      {showAudit && <AuditLogModal entries={audit} onClose={() => setShowAudit(false)} />}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#111', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
          {toast}
        </div>
      )}
    </div>
  );
}
