'use client';
import Link from 'next/link';

const NAVY = '#0f1428';

const ROLES = [
  {
    id: 'admin',
    name: 'Harry McLaughlin',
    title: 'Admin',
    description: 'Full access — all tabs, actions, team management, alerts config',
    color: '#c62828',
    bg: '#fdecea',
  },
  {
    id: 'cs',
    name: 'Genner Castillo',
    title: 'Customer Service',
    description: 'View, edit, notes, flag, export — no config or team management',
    color: '#0369a1',
    bg: '#e0f2fe',
  },
  {
    id: 'moderation',
    name: 'Moderation Team',
    title: 'Moderation',
    description: 'View, notes, suspend, flag, export — focused on content safety',
    color: '#e65100',
    bg: '#fff3e0',
  },
  {
    id: 'leadership',
    name: 'Haines',
    title: 'Leadership',
    description: 'View and export only — full visibility, no write access',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    id: 'readonly',
    name: 'Fabeha',
    title: 'Read Only',
    description: 'View only — no actions, no exports, observation mode',
    color: '#6b7280',
    bg: '#f3f4f6',
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      {/* Logo */}
      <div style={{ marginBottom: '6px' }}>
        <img
          src="https://sharetribe-assets.imgix.net/6946b9c5-eb75-4105-96e3-02ce6e1ddbbc/raw/15/781e7fee18323cc7395dc735bc1101c241e8b4?auto=format&fit=clip&h=36&w=370&s=5ac7e310f770da782ab7346d2870acf4"
          alt="Day Of"
          style={{ height: '28px', width: 'auto' }}
        />
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '40px' }}>
        Support Console
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '36px', maxWidth: '680px', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '17px', fontWeight: 700, color: NAVY, marginBottom: '6px' }}>Select a role to preview</div>
        <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '28px' }}>
          Each role shows a different permission level. No login required for this demo.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ROLES.map(role => (
            <Link key={role.id} href={`/demo/${role.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s', backgroundColor: '#fff' }}
                onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: role.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: role.color }}>{role.name[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: NAVY }}>{role.name}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: role.color, backgroundColor: role.bg, padding: '2px 8px', borderRadius: '20px' }}>{role.title}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{role.description}</div>
                </div>
                <div style={{ fontSize: '18px', color: '#d1d5db' }}>›</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '24px', fontSize: '11px', color: '#d1d5db' }}>
        Day Of · Internal Use Only · Demo Mode
      </div>
    </div>
  );
}
