/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { CommunityProvider, useCommunity } from './CommunityContext';
import { ForumAvatar, NotificationBell, NAVY } from '../../components/community/ui';
import { MOCK_COMMUNITY_USERS } from '../../lib/mockData';

function CommunityHeader() {
  const { currentUser, setCurrentUser, darkMode, setDarkMode, C, unreadCount } = useCommunity();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const vendors = MOCK_COMMUNITY_USERS.filter(u => u.role === 'vendor' && u.status === 'active').slice(0, 5);
  const couples = MOCK_COMMUNITY_USERS.filter(u => u.role === 'couple' && u.status === 'active').slice(0, 5);

  return (
    <header style={{ backgroundColor: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <a href="/community" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>DayOf</span>
        </a>
        <div style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Community</span>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '12px' }}>
          {[
            { href: '/community', label: 'Home' },
            { href: '/community/new', label: 'New Topic' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{ padding: '6px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 500, borderRadius: '6px' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >{link.label}</a>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a href="/community/notifications">
          <NotificationBell count={unreadCount} onClick={() => {}} />
        </a>
        <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <button onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} style={{ padding: '5px 7px', background: 'none', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '7px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {darkMode
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <ForumAvatar name={currentUser.name} role={currentUser.role} size={30} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name.split(' ')[0]}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {userMenuOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: C.surface, border: '1px solid ' + C.border, borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 100, minWidth: '220px', padding: '8px 0' }}>
              <div style={{ padding: '8px 14px', fontSize: '10px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Switch User (Demo)</div>
              <div style={{ padding: '4px 14px', fontSize: '10px', fontWeight: 600, color: C.textMuted, marginTop: '4px' }}>Vendors</div>
              {vendors.map(u => (
                <button key={u.id} onClick={() => { setCurrentUser(u); setUserMenuOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '6px 14px', background: u.id === currentUser.id ? C.surfaceAlt : 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ForumAvatar name={u.name} role={u.role} size={22} />
                  <span>{u.name}</span>
                </button>
              ))}
              <div style={{ padding: '4px 14px', fontSize: '10px', fontWeight: 600, color: C.textMuted, marginTop: '4px' }}>Couples</div>
              {couples.map(u => (
                <button key={u.id} onClick={() => { setCurrentUser(u); setUserMenuOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '6px 14px', background: u.id === currentUser.id ? C.surfaceAlt : 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ForumAvatar name={u.name} role={u.role} size={22} />
                  <span>{u.name}</span>
                </button>
              ))}
              <div style={{ borderTop: '1px solid ' + C.border, marginTop: '4px', paddingTop: '4px' }}>
                <a href={`/community/profile/${currentUser.id}`} onClick={() => setUserMenuOpen(false)}
                  style={{ display: 'block', padding: '6px 14px', fontSize: '12px', color: C.textMuted, textDecoration: 'none' }}>
                  View Profile
                </a>
                <a href="/" style={{ display: 'block', padding: '6px 14px', fontSize: '12px', color: C.textMuted, textDecoration: 'none' }}>
                  Back to Console
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function CommunityFooter() {
  return (
    <footer style={{ backgroundColor: NAVY, padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>DayOf</span>
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>Community Forum</span>
    </footer>
  );
}

function CommunityShell({ children }: { children: React.ReactNode }) {
  const { C } = useCommunity();
  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", backgroundColor: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background-color 0.25s' }}>
      <CommunityHeader />
      <div style={{ flex: 1 }}>{children}</div>
      <CommunityFooter />
    </div>
  );
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommunityProvider>
      <CommunityShell>{children}</CommunityShell>
    </CommunityProvider>
  );
}
