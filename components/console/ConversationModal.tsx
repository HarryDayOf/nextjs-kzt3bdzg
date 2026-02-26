'use client';
import { useState } from 'react';

import { detectKeywords, uniqueHits, riskScore, riskColor, riskLabel, type Role, type Note } from '../../lib/types';
import { highlightKeywords, NAVY, Btn, Badge, KWChip, NotesPanel } from './ui';
import type { Conversation } from '../../lib/types';

export function ConversationModal({ conv, notes, currentUser, onClose, onMarkReviewed, onFlag, onAddNote, canAct }: {
  conv: Conversation;
  notes: Note[];
  currentUser: { name: string; role: Role };
  onClose: () => void;
  onMarkReviewed: () => void;
  onFlag: () => void;
  onAddNote: (text: string) => void;
  canAct: boolean;
}) {
  const [tab, setTab] = useState<'thread' | 'notes'>('thread');
  const score = riskScore(conv);
  const kws = uniqueHits(conv.messages.flatMap(m => detectKeywords(m.text)));

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,20,40,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '680px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: NAVY }}>{conv.participants.join(' + ')}</span>
              <Badge status={conv.status} />
              {conv.reviewed && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>✓ Reviewed</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{conv.listing} · {conv.message_count} messages</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: riskColor(score) }}>{score}</span>
              <span style={{ fontSize: '12px', color: riskColor(score), fontWeight: 600 }}>{riskLabel(score)}</span>
              {kws.map(kw => <KWChip key={kw.word} kw={kw} />)}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#9ca3af', lineHeight: 1 }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6', padding: '0 24px' }}>
          {(['thread', 'notes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize',
                color: tab === t ? NAVY : '#9ca3af', borderBottom: tab === t ? `2px solid ${NAVY}` : '2px solid transparent' }}>
              {t}{t === 'notes' && notes.length > 0 ? ` (${notes.length})` : ''}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {tab === 'thread' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {conv.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: msg.role === 'vendor' ? 'row' : 'row-reverse', gap: '10px', alignItems: 'flex-end' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: msg.role === 'vendor' ? NAVY : '#e5e7eb', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: msg.role === 'vendor' ? '#fff' : '#374151' }}>
                    {msg.sender[0]}
                  </div>
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px', textAlign: msg.role === 'vendor' ? 'left' : 'right' }}>
                      {msg.sender} · {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '13px', lineHeight: 1.5,
                      backgroundColor: msg.role === 'vendor' ? '#f3f4f6' : '#e0f2fe',
                      color: '#111' }}
                      dangerouslySetInnerHTML={{ __html: highlightKeywords(msg.text) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'notes' && (
            <NotesPanel notes={notes} onAdd={canAct ? onAddNote : undefined} currentUser={currentUser} />
          )}
        </div>

        {/* Footer actions */}
        {canAct && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {conv.status === 'clean' && (
              <Btn variant="default" size="sm" onClick={onFlag}>Flag Conversation</Btn>
            )}
            {!conv.reviewed && conv.status === 'flagged' && (
              <Btn variant="primary" size="sm" onClick={onMarkReviewed}>Mark Reviewed</Btn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
