'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const USERS = [
  { email: 'harry@dayofweddings.com',  password: 'changeme', name: 'Harry',  role: 'admin' },
  { email: 'haines@ayofweddings.com', password: 'changeme', name: 'Haines', role: 'admin' },
  { email: 'abhi@ayofweddings.com',   password: 'changeme', name: 'Abhi',   role: 'admin' },
  { email: 'genner@ayofweddings.com', password: 'changeme', name: 'Genner', role: 'support' },
];

function DayOfLogo() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '26px', color: '#0f1428', letterSpacing: '-0.02em' }}>
      Day
      <span style={{ position: 'relative', display: 'inline-block' }}>
        O
        <span style={{ position: 'absolute', top: '1px', right: '-5px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0f1428', display: 'inline-block' }} />
      </span>
      <span style={{ marginLeft: '10px' }}>f</span>
    </div>
  );
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      sessionStorage.setItem('dayof_user', JSON.stringify(user));
      window.location.href = '/dashboard';
    } else {
      setError('Invalid email or password.');
    }
  };
  

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 24px rgba(15,20,40,0.08)', border: '1px solid #e5e7eb', padding: '40px', width: '380px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <DayOfLogo />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Support Console</div>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#0f1428', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#0f1428', boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ marginBottom: '16px', padding: '10px 14px', backgroundColor: '#fdecea', borderRadius: '8px', fontSize: '13px', color: '#c62828' }}>{error}</div>}
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0f1428', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}