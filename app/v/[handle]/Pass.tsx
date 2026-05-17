// Presentational "Founding Vendor" pass — a black all-access laminate.
// Written with explicit flexbox so it renders identically in the browser
// and inside `next/og` ImageResponse (Satori only supports flex layout).
import type { FoundingVendor } from '@/lib/foundingVendors';

export const PASS_W = 1080;
export const PASS_H = 1920;

/** Deterministic barcode bar widths from a string. */
function barWidths(seed: string): number[] {
  const out: number[] = [];
  let h = 2166136261;
  for (let i = 0; i < 46; i++) {
    h ^= seed.charCodeAt(i % seed.length) + i;
    h = Math.imul(h, 16777619) >>> 0;
    out.push(3 + (h % 7));
  }
  return out;
}

const GOLD = '#d8b66a';

export function Pass({ vendor, total }: { vendor: FoundingVendor; total: number }) {
  const num = String(vendor.memberNumber).padStart(3, '0');
  const bars = barWidths(vendor.handle);
  const issued = new Date(vendor.joinedAt + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      style={{
        width: PASS_W,
        height: PASS_H,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#08080a',
        color: '#ededf0',
        fontFamily: 'sans-serif',
      }}
    >
      {/* holographic foil edge */}
      <div
        style={{
          display: 'flex',
          height: 16,
          backgroundImage: 'linear-gradient(90deg,#5eead4,#a78bfa,#fcd34d,#5eead4)',
        }}
      />

      {/* laminate frame */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          margin: 30,
          border: '2px solid #232327',
          padding: '60px 58px',
        }}
      >
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 42, fontWeight: 800, letterSpacing: 12 }}>
              DAY OF
            </div>
            <div style={{ display: 'flex', fontSize: 17, letterSpacing: 6, color: '#6b6b73', marginTop: 10 }}>
              EVENT VENDOR NETWORK
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              letterSpacing: 5,
              color: GOLD,
              border: '1px solid #4a3f25',
              padding: '9px 14px',
            }}
          >
            FOUNDING SERIES
          </div>
        </div>

        {/* lanyard notch */}
        <div
          style={{
            display: 'flex',
            alignSelf: 'center',
            marginTop: 40,
            width: 200,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#000',
            border: '1px solid #2a2a2e',
          }}
        />

        <div style={{ display: 'flex', flex: 1 }} />

        {/* member number */}
        <div style={{ display: 'flex', alignSelf: 'center', fontSize: 30, letterSpacing: 14, color: '#7a7a82' }}>
          FOUNDING VENDOR
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: 6 }}>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: GOLD, marginTop: 64, marginRight: 14 }}>
            Nº
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 400,
              fontWeight: 800,
              lineHeight: 1,
              backgroundImage: 'linear-gradient(180deg,#f6e7bd 0%,#d8b66a 55%,#9c7d3a 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {num}
          </div>
        </div>
        <div style={{ display: 'flex', alignSelf: 'center', fontSize: 24, letterSpacing: 4, color: '#6b6b73', marginTop: 6 }}>
          {`OF ${total} EVER ISSUED`}
        </div>

        <div style={{ display: 'flex', flex: 1 }} />

        {/* identity */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 82, fontWeight: 800, lineHeight: 1.04 }}>
            {vendor.name}
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#9a9aa2', marginTop: 16 }}>
            {`${vendor.craft}  ·  ${vendor.city}, ${vendor.state}`}
          </div>
        </div>

        {/* foil divider */}
        <div
          style={{
            display: 'flex',
            height: 2,
            marginTop: 38,
            marginBottom: 30,
            backgroundImage: `linear-gradient(90deg,${GOLD},#3a3a40 55%,#08080a)`,
          }}
        />

        {/* footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 16, letterSpacing: 4, color: '#6b6b73' }}>ISSUED</div>
            <div style={{ display: 'flex', fontSize: 27, marginTop: 6 }}>{issued}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', height: 62, alignItems: 'flex-end' }}>
              {bars.map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    width: w,
                    height: i % 5 === 0 ? 62 : 48,
                    marginLeft: 3,
                    backgroundColor: '#ededf0',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', fontSize: 24, color: '#9a9aa2', marginTop: 12 }}>
              {`dayof.com/v/${vendor.handle}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
