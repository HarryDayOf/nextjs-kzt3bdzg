'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ROLES = ['admin', 'cs', 'moderation', 'leadership', 'readonly'] as const;

export default function Home() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('admin');
  const router = useRouter();

  const login = () => {
    if (!name.trim()) return;
    sessionStorage.setItem('dayof_user', JSON.stringify({ id: 'u_dev', name, role }));
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1428' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', width: '340px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
        <img src="/images/dayof-logo.png" alt="Day Of" style={{ height: '32px', marginBottom: '28px', filter: 'none' }} />
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()}
            style={{ width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}
            style={{ width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff' }}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button onClick={login}
          style={{ width: '100%', padding: '12px', background: '#0f1428', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          Enter Console
        </button>
      </div>
    </div>
  );
}
