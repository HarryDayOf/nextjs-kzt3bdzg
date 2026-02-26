'use client';
import { useState } from 'react';
import { NAVY, Btn, RoleBadge } from './ui';
import { downloadCSV } from '../../lib/types';
import type { AuditEntry } from '../../lib/types';

export function AuditLogModal({ entries, onClose }: { entries: AuditEntry[]; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = entries.filter(e =>
    !search || [e.actor, e.action, e.entity_label, e.detail].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,20,40,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '760px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: NAVY }}>Audit Log</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{entries.length} entries</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Btn variant="default" size="sm" onClick={() => downloadCSV(filtered as any, 'audit-log.csv')}>Export CSV</Btn>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#9ca3af', lineHeight: 1 }}>×</button>
          </div>
        </div>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search log..."
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                {['Time', 'Actor', 'Role', 'Action', 'Entity', 'Detail'].map(h => (
                  <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 16px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{new Date(e.ts).toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', fontWeight: 500, color: NAVY }}>{e.actor}</td>
                  <td style={{ padding: '10px 16px' }}><RoleBadge role={e.actor_role} /></td>
                  <td style={{ padding: '10px 16px', color: '#374151' }}>{e.action.replace(/_/g, ' ')}</td>
                  <td style={{ padding: '10px 16px', color: '#374151' }}>{e.entity_label}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '13px' }}>No entries found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
