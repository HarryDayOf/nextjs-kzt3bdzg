import Link from 'next/link';
import { listVendors, claimedCount, recruitCount, FOUNDING_CAP } from '@/lib/foundingVendors';

export const dynamic = 'force-dynamic';

const GOLD = '#d8b66a';
const BG = '#08080a';
const BORDER = '#232327';
const MUTED = '#8a8a92';

// The Founding Wall — public roster of every founding vendor. Social proof
// destination for the shareable passes.
export default function FoundingWall() {
  const vendors = listVendors();
  const claimed = claimedCount();

  return (
    <main style={{ minHeight: '100vh', background: BG, color: '#ededf0', padding: '0 0 80px' }}>
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0 8px' }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 9 }}>DAY OF</div>
          <h1 style={{ fontSize: 15, letterSpacing: 4, color: GOLD, margin: '14px 0 6px', fontWeight: 600 }}>
            THE FOUNDING WALL
          </h1>
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
            {claimed} of {FOUNDING_CAP} founding vendors. When the spots are gone, they&apos;re gone.
          </p>
        </div>

        <div style={{ marginTop: 28, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
          {vendors.map((v, i) => (
            <Link
              key={v.handle}
              href={`/v/${v.handle}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 18px',
                borderTop: i === 0 ? 'none' : `1px solid ${BORDER}`,
                textDecoration: 'none',
                color: '#ededf0',
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: GOLD,
                  minWidth: 64,
                  fontFamily: 'monospace',
                }}
              >
                Nº{String(v.memberNumber).padStart(3, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                  {v.craft} · {v.city}, {v.state}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: GOLD }}>{recruitCount(v.handle)}</div>
                <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1 }}>RECRUITED</div>
              </div>
            </Link>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#4a4a52', fontSize: 11, marginTop: 28 }}>
          Get in early. Each founding vendor carries invites — find one and ask.
        </p>
      </div>
    </main>
  );
}
