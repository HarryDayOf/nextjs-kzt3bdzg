// ─── FOUNDING VENDOR PROGRAM ─────────────────────────────────────────────────
// In-memory placeholder store for the "Founding Vendor" launch loop.
// A founding vendor gets a low member number, a shareable AAA-pass image,
// and a set of invite codes. When someone claims a code, the new vendor is
// attributed back to the inviter — that closes the recruiting loop.

export interface InviteCode {
  code: string;
  claimedByHandle: string | null;
  claimedAt: string | null;
}

export interface FoundingVendor {
  handle: string;
  name: string;
  craft: string;
  city: string;
  state: string;
  memberNumber: number;
  joinedAt: string;
  invitedByHandle: string | null;
  inviteCodes: InviteCode[];
}

/** Total founding spots. Scarcity is the point — keep it small. */
export const FOUNDING_CAP = 250;

/** How many invites each founding vendor gets to hand out. */
export const INVITES_PER_VENDOR = 3;

// ─── DETERMINISTIC HELPERS ───────────────────────────────────────────────────
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

/** Stable invite code from a seed, e.g. DAYOF-7K2Q. */
function makeCode(seed: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let h = hash(seed);
  let out = '';
  for (let i = 0; i < 4; i++) {
    out += alphabet[h % alphabet.length];
    h = Math.floor(h / alphabet.length) + hash(seed + i);
  }
  return `DAYOF-${out}`;
}

function seedInvites(handle: string): InviteCode[] {
  return Array.from({ length: INVITES_PER_VENDOR }, (_, i) => ({
    code: makeCode(`${handle}:${i}`),
    claimedByHandle: null,
    claimedAt: null,
  }));
}

// ─── SEED DATA (placeholder) ─────────────────────────────────────────────────
const SEED: Omit<FoundingVendor, 'inviteCodes'>[] = [
  { handle: 'bloom-and-co-florals', name: 'Bloom & Co Florals', craft: 'Florals', city: 'Charleston', state: 'SC', memberNumber: 1, joinedAt: '2026-04-02', invitedByHandle: null },
  { handle: 'golden-hour-photography', name: 'Golden Hour Photography', craft: 'Photography', city: 'Austin', state: 'TX', memberNumber: 7, joinedAt: '2026-04-05', invitedByHandle: 'bloom-and-co-florals' },
  { handle: 'the-sound-co', name: 'The Sound Co.', craft: 'DJ', city: 'Nashville', state: 'TN', memberNumber: 12, joinedAt: '2026-04-09', invitedByHandle: 'bloom-and-co-florals' },
  { handle: 'sage-catering-co', name: 'Sage Catering Co.', craft: 'Catering', city: 'Portland', state: 'OR', memberNumber: 19, joinedAt: '2026-04-14', invitedByHandle: 'golden-hour-photography' },
  { handle: 'harmony-strings-quartet', name: 'Harmony Strings Quartet', craft: 'Live Music', city: 'Boston', state: 'MA', memberNumber: 24, joinedAt: '2026-04-21', invitedByHandle: 'the-sound-co' },
  { handle: 'rosewood-events', name: 'Rosewood Events', craft: 'Planning', city: 'Los Angeles', state: 'CA', memberNumber: 31, joinedAt: '2026-05-01', invitedByHandle: 'golden-hour-photography' },
];

// Module-level store. Mutations persist for the life of the server instance —
// fine for a scaffold/demo; swap for a real DB before launch.
const vendors: FoundingVendor[] = SEED.map(v => ({ ...v, inviteCodes: seedInvites(v.handle) }));

// ─── ACCESSORS ───────────────────────────────────────────────────────────────
export function getVendor(handle: string): FoundingVendor | undefined {
  return vendors.find(v => v.handle === handle);
}

export function listVendors(): FoundingVendor[] {
  return [...vendors].sort((a, b) => a.memberNumber - b.memberNumber);
}

export function claimedCount(): number {
  return vendors.length;
}

export function nextMemberNumber(): number {
  return Math.max(0, ...vendors.map(v => v.memberNumber)) + 1;
}

/** How many of a vendor's invites have been claimed (recruiting attribution). */
export function recruitCount(handle: string): number {
  return vendors.filter(v => v.invitedByHandle === handle).length;
}

export function findInvite(code: string): { owner: FoundingVendor; invite: InviteCode } | null {
  const normalized = code.trim().toUpperCase();
  for (const owner of vendors) {
    const invite = owner.inviteCodes.find(c => c.code === normalized);
    if (invite) return { owner, invite };
  }
  return null;
}

export interface ClaimResult {
  ok: boolean;
  vendor?: FoundingVendor;
  error?: string;
}

/** Redeem an invite code and create a new founding vendor attributed to the inviter. */
export function claimInvite(input: {
  code: string;
  name: string;
  craft: string;
  city: string;
  state: string;
}): ClaimResult {
  const name = input.name.trim();
  if (!name) return { ok: false, error: 'Enter your business name.' };

  const match = findInvite(input.code);
  if (!match) return { ok: false, error: 'That invite code is not valid.' };
  if (match.invite.claimedByHandle) return { ok: false, error: 'That invite code has already been used.' };
  if (claimedCount() >= FOUNDING_CAP) return { ok: false, error: 'All founding spots have been claimed.' };

  let handle = slugify(name);
  if (!handle) return { ok: false, error: 'Enter a valid business name.' };
  if (getVendor(handle)) handle = `${handle}-${nextMemberNumber()}`;

  const vendor: FoundingVendor = {
    handle,
    name,
    craft: input.craft.trim() || 'Vendor',
    city: input.city.trim() || '—',
    state: input.state.trim().toUpperCase().slice(0, 2),
    memberNumber: nextMemberNumber(),
    joinedAt: new Date().toISOString().slice(0, 10),
    invitedByHandle: match.owner.handle,
    inviteCodes: seedInvites(handle),
  };
  vendors.push(vendor);

  match.invite.claimedByHandle = handle;
  match.invite.claimedAt = vendor.joinedAt;

  return { ok: true, vendor };
}
