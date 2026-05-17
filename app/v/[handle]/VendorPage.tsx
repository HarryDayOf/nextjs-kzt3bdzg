'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FoundingVendor } from '@/lib/foundingVendors';
import { Pass, PASS_W, PASS_H } from './Pass';
import { claimAction } from './actions';

interface InviteView {
  code: string;
  claimed: boolean;
  claimedByName: string | null;
}

interface Props {
  vendor: FoundingVendor;
  inviterName: string | null;
  invites: InviteView[];
  recruited: number;
  claimed: number;
  cap: number;
  prefillCode: string;
}

const GOLD = '#d8b66a';
const BG = '#08080a';
const CARD = '#121214';
const BORDER = '#232327';
const MUTED = '#8a8a92';

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  letterSpacing: 3,
  textTransform: 'uppercase',
  color: MUTED,
  margin: '0 0 14px',
  fontWeight: 600,
};

export default function VendorPage({
  vendor,
  inviterName,
  invites,
  recruited,
  claimed,
  cap,
  prefillCode,
}: Props) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const [toast, setToast] = useState<string | null>(null);
  const [origin, setOrigin] = useState('dayof.com');

  useEffect(() => {
    setOrigin(window.location.host || 'dayof.com');
    const fit = () => {
      const w = previewRef.current?.clientWidth ?? 360;
      setScale(Math.min(w, 400) / PASS_W);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout((flash as any)._t);
    (flash as any)._t = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://dayof.com'}/v/${vendor.handle}`;
  const openInvites = invites.filter(i => !i.claimed).length;
  const caption =
    `Just joined Day Of as Founding Vendor Nº${String(vendor.memberNumber).padStart(3, '0')} ` +
    `— only ${cap} founding spots, ever.` +
    (openInvites > 0
      ? ` I've got ${openInvites} invite${openInvites === 1 ? '' : 's'} left for vendors I actually rate. DM me.`
      : '') +
    ` → ${profileUrl}`;

  const copy = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        flash(`${label} copied`);
      } catch {
        flash('Could not copy — long-press to copy manually');
      }
    },
    [flash],
  );

  const fetchPassBlob = useCallback(async () => {
    const res = await fetch(`/v/${vendor.handle}/pass`);
    if (!res.ok) throw new Error('pass render failed');
    return res.blob();
  }, [vendor.handle]);

  const saveBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dayof-pass-${vendor.handle}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [busy, setBusy] = useState(false);

  const share = useCallback(async () => {
    setBusy(true);
    try {
      const blob = await fetchPassBlob();
      const file = new File([blob], `dayof-pass-${vendor.handle}.png`, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], text: caption });
      } else {
        saveBlob(blob);
        flash('Pass saved to your device — open Instagram → Story → pick it from your camera roll');
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') flash('Share failed — try Download instead');
    } finally {
      setBusy(false);
    }
  }, [caption, fetchPassBlob, flash, vendor.handle]);

  const download = useCallback(async () => {
    setBusy(true);
    try {
      saveBlob(await fetchPassBlob());
      flash('Pass downloaded');
    } catch {
      flash('Download failed');
    } finally {
      setBusy(false);
    }
  }, [fetchPassBlob, flash]);

  // ─── claim form ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({ name: '', craft: '', city: '', state: '', code: prefillCode });
  const [claimErr, setClaimErr] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimErr(null);
    setClaiming(true);
    const res = await claimAction(form);
    setClaiming(false);
    if (res.ok && res.handle) {
      router.push(`/v/${res.handle}`);
    } else {
      setClaimErr(res.error ?? 'Something went wrong.');
    }
  };

  const spotsLeft = cap - claimed;

  return (
    <main style={{ minHeight: '100vh', background: BG, color: '#ededf0', padding: '0 0 80px' }}>
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1c1c20',
            border: `1px solid ${BORDER}`,
            color: '#ededf0',
            padding: '10px 18px',
            borderRadius: 8,
            fontSize: 13,
            zIndex: 50,
            maxWidth: '90vw',
            textAlign: 'center',
          }}
        >
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>
        {/* masthead */}
        <div style={{ textAlign: 'center', padding: '40px 0 8px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 8 }}>DAY OF</div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: MUTED, marginTop: 6 }}>
            FOUNDING VENDOR PROGRAM · {spotsLeft} OF {cap} SPOTS LEFT
          </div>
        </div>

        {/* pass preview */}
        <div ref={previewRef} style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 8px' }}>
          <div
            style={{
              width: PASS_W * scale,
              height: PASS_H * scale,
              boxShadow: '0 30px 80px -30px rgba(216,182,106,0.35)',
            }}
          >
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: PASS_W, height: PASS_H }}>
              <Pass vendor={vendor} total={cap} />
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: MUTED, fontSize: 13, margin: '6px 0 22px' }}>
          {vendor.name} · Founding Vendor Nº{String(vendor.memberNumber).padStart(3, '0')}
          {inviterName ? ` · invited by ${inviterName}` : ''}
        </p>

        {/* share actions */}
        <button onClick={share} disabled={busy} style={primaryBtn}>
          {busy ? 'Preparing pass…' : 'Share to Instagram Story'}
        </button>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button onClick={download} disabled={busy} style={ghostBtn}>
            Download pass
          </button>
          <button onClick={() => copy(profileUrl, 'Profile link')} style={ghostBtn}>
            Copy link
          </button>
        </div>

        {/* caption */}
        <div style={{ ...card, marginTop: 24 }}>
          <p style={sectionTitle}>Story caption</p>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: '#cfcfd6', margin: '0 0 14px' }}>{caption}</p>
          <button onClick={() => copy(caption, 'Caption')} style={ghostBtn}>
            Copy caption
          </button>
        </div>

        {/* invite codes */}
        <div style={{ ...card, marginTop: 16 }}>
          <p style={sectionTitle}>Your invite codes</p>
          <p style={{ fontSize: 13, color: MUTED, margin: '0 0 14px', lineHeight: 1.5 }}>
            Hand these to vendors you rate. You&apos;ve recruited{' '}
            <strong style={{ color: GOLD }}>{recruited}</strong>{' '}
            {recruited === 1 ? 'vendor' : 'vendors'} so far.
          </p>
          {invites.map(inv => (
            <div
              key={inv.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 0',
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 15, letterSpacing: 1 }}>{inv.code}</div>
                <div style={{ fontSize: 11, color: inv.claimed ? MUTED : GOLD, marginTop: 3 }}>
                  {inv.claimed ? `Claimed by ${inv.claimedByName}` : 'Open'}
                </div>
              </div>
              {inv.claimed ? (
                <span style={{ fontSize: 12, color: MUTED }}>—</span>
              ) : (
                <button
                  onClick={() => copy(`${profileUrl}?invite=${inv.code}`, 'Invite link')}
                  style={{ ...ghostBtn, width: 'auto', padding: '7px 12px', fontSize: 12 }}
                >
                  Copy invite link
                </button>
              )}
            </div>
          ))}
        </div>

        {/* claim a spot */}
        <div style={{ ...card, marginTop: 16, borderColor: '#3a3220' }}>
          <p style={{ ...sectionTitle, color: GOLD }}>Got an invite code? Claim your spot</p>
          <p style={{ fontSize: 13, color: MUTED, margin: '0 0 16px', lineHeight: 1.5 }}>
            Founding numbers are issued in order — claim now and yours is Nº
            {String(claimed + 1).padStart(3, '0')}.
          </p>
          <form onSubmit={submitClaim}>
            <input style={input} placeholder="Business name" value={form.name} onChange={set('name')} required />
            <input style={input} placeholder="Craft (e.g. Florals, DJ, Photography)" value={form.craft} onChange={set('craft')} />
            <div style={{ display: 'flex', gap: 10 }}>
              <input style={{ ...input, flex: 2 }} placeholder="City" value={form.city} onChange={set('city')} />
              <input style={{ ...input, flex: 1 }} placeholder="ST" maxLength={2} value={form.state} onChange={set('state')} />
            </div>
            <input
              style={{ ...input, fontFamily: 'monospace', letterSpacing: 1 }}
              placeholder="DAYOF-XXXX"
              value={form.code}
              onChange={set('code')}
              required
            />
            {claimErr && <p style={{ color: '#f87171', fontSize: 13, margin: '4px 0 12px' }}>{claimErr}</p>}
            <button type="submit" disabled={claiming} style={{ ...primaryBtn, marginTop: 4 }}>
              {claiming ? 'Claiming…' : 'Claim founding spot'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#4a4a52', fontSize: 11, marginTop: 28 }}>
          {origin} · Founding Vendor Program
        </p>
      </div>
    </main>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: 18,
};

const primaryBtn: React.CSSProperties = {
  width: '100%',
  background: GOLD,
  color: '#0a0a0a',
  border: 'none',
  borderRadius: 10,
  padding: '14px 16px',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
};

const ghostBtn: React.CSSProperties = {
  flex: 1,
  width: '100%',
  background: 'transparent',
  color: '#ededf0',
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const input: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: BG,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: '11px 12px',
  fontSize: 14,
  color: '#ededf0',
  marginBottom: 10,
  outline: 'none',
};
