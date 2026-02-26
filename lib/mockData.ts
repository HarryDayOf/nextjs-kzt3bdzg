import type { User, Listing, Transaction, Review, Conversation, Note, AuditEntry, AlertConfig, ConsoleUser, VendorDocument, DocStatus, LoginEntry } from './types';

export const MOCK_CONSOLE_USERS: ConsoleUser[] = [
  { id: 'cu_1', name: 'Harry McLaughlin', email: 'harry@dayof.com', role: 'admin', active: true, joined: '2024-09-01', lastLogin: '2025-02-25T08:30:00Z' },
  { id: 'cu_2', name: 'Genner Castillo', email: 'genner@dayof.com', role: 'cs', active: true, joined: '2024-10-15', lastLogin: '2025-02-25T09:10:00Z' },
  { id: 'cu_3', name: 'Haines', email: 'haines@dayof.com', role: 'leadership', active: true, joined: '2024-09-01', lastLogin: '2025-02-24T14:00:00Z' },
  { id: 'cu_4', name: 'Abhi', email: 'abhi@dayof.com', role: 'admin', active: true, joined: '2024-11-01', lastLogin: '2025-02-23T11:00:00Z' },
  { id: 'cu_5', name: 'Fabeha', email: 'fabeha@dayof.com', role: 'readonly', active: true, joined: '2024-11-01', lastLogin: '2025-02-20T10:00:00Z' },
];

const _consoleActors = ['Harry McLaughlin','Genner Castillo','Haines','Abhi'];
const _consoleRoles: ('admin'|'cs'|'leadership')[] = ['admin','cs','leadership','admin'];

// ─── USER GENERATOR ─────────────────────────────────────────────────────────
const _vendorNames = ['Sarah Chen','Bloom & Co Florals','Magnolia Events','The Sound Co.','Golden Hour Photography','Wildflower Studio','Pine & Petal','Harmony Strings Quartet','Sage Catering Co.','Velvet Touch Florals','Captured Moments','Rosewood Events','Sunlit Films','The Cake Collective','Dapper Day Suits','Sweet Serenade Band','Lucky Star DJ','Enchanted Gardens','Table for Two Catering','Urban Frame Photography','Belle Fleur Design','Rhythm & Vine Band','Twilight Videography','Artisan Cake Studio','Petal & Thorn','Evergreen Coordination','Lush Events Co.','Focal Point Photography','Blue Dahlia Florals','Silver Lining Catering','Amber Light Films','The Hive Collective','Meadow & Moss','Peak Performance DJ','First Dance Studios','Bloom Theory','Copper Kettle Catering','Signature Strings','Vista Photography','Sugarcoat Bakery','Fern & Fig Events','Reverie Films','Ivory & Vine','Bassline Entertainment','Pollen Studio','Rustic Roots Catering','Nova Flash Photography','Petaluma Flowers','Echo Chamber DJ','True Color Films'];
const _coupleFirsts = ['Emma','Liam','Olivia','Noah','Ava','Ethan','Sophia','Jackson','Isabella','Aiden','Mia','Lucas','Charlotte','Mason','Amelia','Logan','Harper','James','Evelyn','Benjamin','Abigail','Elijah','Emily','William','Ella','Michael','Grace','Daniel','Chloe','Henry','Victoria','Sebastian','Lily','Jack','Aria','Owen','Nora','Alexander','Zoey','Carter','Riley','Jayden','Layla','John','Penelope','Luke','Hannah','Mateo','Lillian','David'];
const _coupleLasts = ['Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts'];
const _domains = ['gmail.com','icloud.com','outlook.com','yahoo.com'];
const _vendorDomains = ['.co','.com','.studio','.events'];
const _statuses: User['status'][] = ['active','active','active','active','active','active','active','active','active','active','active','suspended','pending','probation'];
function _uid(i: number) { const h = (n: number) => n.toString(16).padStart(8, '0'); return `${h(i * 2654435761 >>> 0)}-${h(i * 40503 >>> 0).slice(0,4)}-4${h(i * 12345 >>> 0).slice(1,4)}-${h(i * 98765 >>> 0).slice(0,4)}-${h(i * 777 + 42 >>> 0).slice(0,4)}${h(i * 333 >>> 0)}`; }
function _genUsers(): User[] {
  const seed: User[] = [
    { id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', name: 'Sarah Chen', email: 'sarah.chen@bloomday.co', role: 'vendor', status: 'active', joined: '2024-11-01', listings: 3, transactions: 12, tawk_id: 'tawk_6f3a2c1e', revenue: 4600, repeatFlags: 0 },
    { id: 'b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', name: 'Marcus Webb', email: 'marcus.webb@gmail.com', role: 'couple', status: 'active', joined: '2025-01-15', listings: 0, transactions: 2, tawk_id: 'tawk_b2e91d73', revenue: 0, repeatFlags: 0 },
    { id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', name: 'Bloom & Co Florals', email: 'hello@bloomco.com', role: 'vendor', status: 'suspended', joined: '2024-09-10', listings: 7, transactions: 31, tawk_id: 'tawk_a4f78c29', revenue: 18200, repeatFlags: 3 },
    { id: 'c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34', name: 'Jordan & Priya Ellis', email: 'jordan.priya@icloud.com', role: 'couple', status: 'active', joined: '2025-02-01', listings: 0, transactions: 1, tawk_id: 'tawk_c7d45e81', revenue: 0, repeatFlags: 0 },
    { id: 'e9b12f47-7c3d-4e5a-b891-0a6c2f8d4e73', name: 'Magnolia Events', email: 'info@magnoliaevents.com', role: 'vendor', status: 'pending', joined: '2025-02-20', listings: 0, transactions: 0, tawk_id: 'tawk_e9b12f47', revenue: 0, repeatFlags: 0 },
    { id: 'f1a23b45-6c78-9d01-e234-5f67a8b9c0d1', name: 'The Sound Co.', email: 'booking@thesoundco.com', role: 'vendor', status: 'active', joined: '2024-10-05', listings: 4, transactions: 22, tawk_id: 'tawk_f1a23b45', revenue: 12400, repeatFlags: 0 },
  ];
  const extra: User[] = [];
  let vi = 3, ci = 2;
  for (let i = 0; i < 74; i++) {
    const isVendor = i % 3 !== 0;
    const idx = i;
    const id = _uid(i + 100);
    const status = _statuses[idx % _statuses.length];
    const month = 6 + (idx % 9);
    const year = month > 12 ? 2025 : 2024;
    const m = month > 12 ? month - 12 : month;
    const day = 1 + (idx % 28);
    const joined = `${year}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (isVendor) {
      const name = _vendorNames[vi % _vendorNames.length];
      vi++;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '');
      const dom = _vendorDomains[idx % _vendorDomains.length];
      const email = `info@${slug}${dom}`;
      const txns = Math.floor(Math.abs(Math.sin(idx * 3.14) * 40));
      const rev = txns * (800 + (idx % 5) * 400);
      extra.push({ id, name, email, role: 'vendor', status, joined, listings: 1 + (idx % 6), transactions: txns, tawk_id: `tawk_${id.slice(0, 8)}`, revenue: rev, repeatFlags: status === 'suspended' ? 2 + (idx % 3) : status === 'probation' ? 1 : 0 });
    } else {
      const f1 = _coupleFirsts[ci % _coupleFirsts.length];
      const f2 = _coupleFirsts[(ci + 7) % _coupleFirsts.length];
      const last = _coupleLasts[ci % _coupleLasts.length];
      ci++;
      const name = `${f1} & ${f2} ${last}`;
      const email = `${f1.toLowerCase()}.${last.toLowerCase()}@${_domains[idx % _domains.length]}`;
      const txns = Math.floor(Math.abs(Math.sin(idx * 2.71) * 6));
      const coupleStatus = idx % 50 === 0 ? 'suspended' : idx % 60 === 0 ? 'probation' : status === 'pending' ? 'active' : status === 'probation' ? 'active' : status;
      const coupleFlags = coupleStatus === 'suspended' ? 2 + (idx % 2) : coupleStatus === 'probation' ? 1 : idx % 35 === 0 ? 1 : 0;
      extra.push({ id, name, email, role: 'couple', status: coupleStatus, joined, listings: 0, transactions: txns, tawk_id: `tawk_${id.slice(0, 8)}`, revenue: 0, repeatFlags: coupleFlags });
    }
  }
  return [...seed, ...extra];
}

// ─── USER ENRICHMENT (Stripe · Tracking · Duplicate Detection) ──────────────
const _ipPfx = ['98.142.33','172.56.21','74.92.108','206.71.44','152.38.92','45.127.55','68.205.17','99.163.82','184.93.76','71.245.11','203.88.15','147.52.98','64.233.44','159.203.71','92.117.36'];
const _devs = ['Chrome 121 / macOS','Safari / iOS 17','Chrome 120 / Windows 11','Firefox 121 / Ubuntu','Chrome 121 / Android 14','Safari / macOS Sonoma','Edge 121 / Windows 11','Chrome 120 / ChromeOS'];
const _idps: (null | { provider: string; userId: string })[] = [
  { provider: 'google', userId: '104523891234567890' }, null, { provider: 'facebook', userId: '10234567890123456' }, null,
  null, { provider: 'apple', userId: '001234.abc123def456.0789' }, null, { provider: 'google', userId: '115678901234567890' },
];

function _enrichUsers(users: User[]): User[] {
  return users.map((u, i) => {
    const isV = u.role === 'vendor';
    const ip = `${_ipPfx[i % _ipPfx.length]}.${1 + ((i * 7) % 254)}`;
    const s36 = (n: number) => (n >>> 0).toString(36);
    const stripeAcct = isV ? `acct_${s36(i * 2654435761)}${s36(i * 40503)}`.slice(0, 21) : undefined;
    const stripeCust = !isV ? `cus_${s36(i * 1234567891)}${s36(i * 98765)}`.slice(0, 18) : undefined;
    const connected = isV ? u.status !== 'pending' : undefined;
    const dev = _devs[i % _devs.length];
    const idp = _idps[i % _idps.length];
    const fp = `fp_${((i * 0xdeadbeef) >>> 0).toString(16).padStart(8, '0')}${((i * 0xcafebabe) >>> 0).toString(16).padStart(4, '0')}`;
    const histCount = 3 + (i % 3);
    const loginHistory: LoginEntry[] = [];
    for (let hi = 0; hi < histCount; hi++) {
      const d = new Date(2025, 1, 25 - hi * (2 + (i % 5)), 8 + (hi % 12), (i * 7 + hi * 13) % 60);
      loginHistory.push({
        ip: hi === 0 ? ip : `${_ipPfx[(i + hi) % _ipPfx.length]}.${1 + ((i * 3 + hi * 11) % 254)}`,
        ts: d.toISOString().replace(/\.\d+Z$/, 'Z'),
        userAgent: `Mozilla/5.0 (${dev.includes('macOS') ? 'Macintosh; Intel Mac OS X 10_15_7' : dev.includes('Windows') ? 'Windows NT 10.0; Win64; x64' : dev.includes('iOS') ? 'iPhone; CPU iPhone OS 17_0' : dev.includes('Android') ? 'Linux; Android 14' : 'X11; Linux x86_64'})`,
        device: dev,
      });
    }
    return {
      ...u,
      ...(stripeAcct ? { stripeAccountId: stripeAcct, stripeConnected: connected, payoutsEnabled: connected && u.status !== 'suspended', chargesEnabled: connected && u.status !== 'suspended' } : {}),
      ...(stripeCust ? { stripeCustomerId: stripeCust } : {}),
      emailVerified: u.status !== 'pending' && i % 20 !== 0,
      ...(idp ? { identityProviders: [idp] } : {}),
      lastLoginIp: ip, lastLoginAt: loginHistory[0]?.ts, signupIp: ip,
      loginHistory, deviceFingerprint: fp,
    };
  });
}

function _assignDuplicates(users: User[]): void {
  // Create 6 IP clusters — pairs/triples sharing same signup IP (simulates ban evasion, shared household, etc.)
  for (let c = 0; c < 6; c++) {
    const a = 8 + c * 12; const b = a + 4;
    const sharedIp = `98.142.${50 + c}.${200 + c}`;
    [a, b, ...(c % 3 === 0 ? [a + 8] : [])].forEach(idx => {
      if (idx < users.length) {
        users[idx].signupIp = sharedIp;
        users[idx].lastLoginIp = sharedIp;
        if (users[idx].loginHistory?.length) users[idx].loginHistory![0].ip = sharedIp;
      }
    });
  }
  // Create 4 device fingerprint clusters — same device used for multiple accounts
  for (let c = 0; c < 4; c++) {
    const a = 6 + c * 18; const b = a + 6;
    const sharedFp = `fp_dup${String(c).padStart(2, '0')}${((c * 0xabcdef01) >>> 0).toString(16).slice(0, 6)}`;
    [a, b].forEach(idx => { if (idx < users.length) users[idx].deviceFingerprint = sharedFp; });
  }
  // Detect shared IPs and device fingerprints → create DuplicateFlag entries
  const ipMap = new Map<string, number[]>();
  const fpMap = new Map<string, number[]>();
  users.forEach((u, i) => {
    if (u.signupIp) { const a = ipMap.get(u.signupIp) || []; a.push(i); ipMap.set(u.signupIp, a); }
    if (u.deviceFingerprint) { const a = fpMap.get(u.deviceFingerprint) || []; a.push(i); fpMap.set(u.deviceFingerprint, a); }
  });
  const addFlags = (map: Map<string, number[]>, reasonFn: (u: User) => string) => {
    map.forEach(indices => {
      if (indices.length < 2) return;
      indices.forEach(i => {
        const u = users[i]; if (!u.duplicateFlags) u.duplicateFlags = [];
        indices.forEach(j => {
          if (i === j) return;
          const o = users[j];
          const hasBanned = u.status === 'suspended' || o.status === 'suspended';
          if (!u.duplicateFlags!.find(f => f.matchedUserId === o.id && f.reason === reasonFn(u)))
            u.duplicateFlags!.push({ matchedUserId: o.id, matchedUserName: o.name, reason: reasonFn(u), confidence: hasBanned ? 'high' : 'medium', detectedAt: '2025-02-20T10:00:00Z' });
        });
      });
    });
  };
  addFlags(ipMap, (u) => `Shared signup IP: ${u.signupIp}`);
  addFlags(fpMap, (u) => `Same device fingerprint: ${u.deviceFingerprint}`);
}

export const MOCK_USERS: User[] = (() => { const u = _enrichUsers(_genUsers()); _assignDuplicates(u); return u; })();
const _V = MOCK_USERS.filter(u => u.role === 'vendor');
const _CO = MOCK_USERS.filter(u => u.role === 'couple');

// ─── LISTING GENERATOR ──────────────────────────────────────────────────────
const _catTitles: Record<string, string[]> = {
  Photography: ['Full-Day Wedding Photography','Elopement Photography','Engagement Session','Bridal Portraits','Photo Booth Package','Documentary Coverage','Adventure Elopement','Boudoir Session'],
  Florals: ['Garden Floral Package','Luxury Floral Design','Ceremony Arch Florals','Bridal Bouquet Collection','Table Centerpiece Set','Flower Crown Bar','Petal Aisle Runner','Seasonal Wildflower Package'],
  Entertainment: ['DJ + MC Package','Full Band Experience','String Quartet','Solo Acoustic Set','Jazz Trio','Latin Dance Band','Cocktail Hour Duo','Silent Disco Setup'],
  Catering: ['Farm-to-Table Dinner','Cocktail Reception Package','Brunch Wedding Package','BBQ Buffet','Vegan Tasting Menu','Dessert Bar','Late Night Snack Station','Family Style Italian'],
  Videography: ['Cinematic Wedding Film','Highlight Reel Package','Full Ceremony Coverage','Drone Aerial Package','Same-Day Edit','Documentary Style Film','Livestream Package','Super 8 Film Add-on'],
  Planning: ['Full Wedding Planning','Day-of Coordination','Month-of Planning','Elopement Planning','Partial Planning','Rehearsal Coordination','Virtual Planning Package','Destination Wedding Planning'],
  Beauty: ['Bridal Makeup','Hair Styling Package','Bridal Party Package','Trial Session','Airbrush Makeup','Mobile Beauty Suite','Groom Grooming','Touch-Up Service'],
  Rentals: ['Chiavari Chair Set','Linen Package','Lighting Design','Arch & Backdrop Rental','Tableware Collection','Lounge Furniture Set','Tent & Canopy','Dance Floor Rental'],
};
const _cats = Object.keys(_catTitles);
const _docDefs = [
  { type: 'business_license', label: 'Business License' },
  { type: 'insurance_certificate', label: 'Certificate of Insurance' },
  { type: 'dba_assumed_name_filing', label: 'DBA / Assumed Name Filing' },
  { type: 'w9_tax_form', label: 'W-9 Tax Form' },
];
const _docSts: DocStatus[] = ['approved','approved','approved','pending','rejected'];

function _genListings(): Listing[] {
  const seed: Listing[] = [
    { id: 'lst_4Hx9K2mPqR7vYnWd', title: 'Full-Day Wedding Photography', vendor: 'Sarah Chen', vendor_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', price: 3200, status: 'active', category: 'Photography', created: '2024-11-05', views: 412, inquiries: 38, bookings: 12 },
    { id: 'lst_7Tz3J8nLwS1uXkBe', title: 'Garden Floral Package', vendor: 'Bloom & Co Florals', vendor_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', price: 1800, status: 'suspended', category: 'Florals', created: '2024-09-15', views: 188, inquiries: 22, bookings: 7 },
    { id: 'lst_2Rp6F4hQcM9yVjAg', title: 'Luxury Floral Design', vendor: 'Bloom & Co Florals', vendor_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', price: 4500, status: 'active', category: 'Florals', created: '2024-10-01', views: 291, inquiries: 19, bookings: 4 },
    { id: 'lst_9Kd1N7bUoE3wCfHs', title: 'DJ + MC Package', vendor: 'Magnolia Events', vendor_id: 'e9b12f47-7c3d-4e5a-b891-0a6c2f8d4e73', price: 2200, status: 'pending_review', category: 'Entertainment', created: '2025-02-20', views: 0, inquiries: 0, bookings: 0, documents: [
      { id: 'doc_mag_1', type: 'dba_assumed_name_filing', label: 'DBA / Assumed Name Filing', url: 'https://sos.state.tx.us/corp/magnolia-events-dba.pdf', status: 'pending', submittedAt: '2025-02-20T10:30:00Z' },
      { id: 'doc_mag_2', type: 'business_license', label: 'Business License', url: 'https://sos.state.tx.us/corp/magnolia-events-license.pdf', status: 'pending', submittedAt: '2025-02-20T10:31:00Z' },
      { id: 'doc_mag_3', type: 'insurance_certificate', label: 'Certificate of Insurance', url: 'https://sos.state.tx.us/corp/magnolia-events-coi.pdf', status: 'pending', submittedAt: '2025-02-20T10:32:00Z' },
    ] },
    { id: 'lst_5Mv8G2tIpZ6xDrWq', title: 'Elopement Photography', vendor: 'Sarah Chen', vendor_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', price: 1400, status: 'active', category: 'Photography', created: '2024-12-01', views: 203, inquiries: 31, bookings: 9 },
    { id: 'lst_3Qr8H5kNpM2wBjCs', title: 'Full Band Experience', vendor: 'The Sound Co.', vendor_id: 'f1a23b45-6c78-9d01-e234-5f67a8b9c0d1', price: 4800, status: 'active', category: 'Entertainment', created: '2024-10-10', views: 344, inquiries: 41, bookings: 18, documents: [
      { id: 'doc_sc_1', type: 'business_license', label: 'Business License', url: 'https://sos.state.tx.us/corp/soundco-license.pdf', status: 'approved', submittedAt: '2024-10-05T09:00:00Z', reviewedBy: 'Harry McLaughlin', reviewedAt: '2024-10-07T14:00:00Z' },
      { id: 'doc_sc_2', type: 'insurance_certificate', label: 'Certificate of Insurance', url: 'https://sos.state.tx.us/corp/soundco-coi.pdf', status: 'approved', submittedAt: '2024-10-05T09:05:00Z', reviewedBy: 'Harry McLaughlin', reviewedAt: '2024-10-07T14:10:00Z' },
    ] },
  ];
  const extra: Listing[] = [];
  for (let i = 0; i < 74; i++) {
    const v = _V[i % _V.length];
    const cat = _cats[i % _cats.length];
    const titles = _catTitles[cat];
    const titleBase = titles[i % titles.length];
    const dup = Math.floor(i / titles.length);
    const title = dup > 0 ? `${titleBase} #${dup + 1}` : titleBase;
    const status: Listing['status'] = i % 20 === 0 ? 'suspended' : i % 25 === 0 ? 'pending_review' : 'active';
    const hasDocs = status === 'pending_review' || i % 5 === 0;
    const slug = v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const documents: VendorDocument[] | undefined = hasDocs ? _docDefs.slice(0, 2 + (i % 3)).map((d, di) => {
      const ds = _docSts[(i + di) % _docSts.length];
      return {
        id: `doc_g${i}_${di}`, type: d.type, label: d.label,
        url: `https://sos.state.tx.us/corp/${slug}-${d.type}.pdf`,
        status: ds,
        submittedAt: `2025-01-${String(1 + (i % 28)).padStart(2, '0')}T10:${String(i % 60).padStart(2, '0')}:00Z`,
        ...(ds !== 'pending' ? { reviewedBy: i % 2 === 0 ? 'Harry McLaughlin' : 'Genner Castillo', reviewedAt: `2025-01-${String(3 + (i % 26)).padStart(2, '0')}T14:00:00Z` } : {}),
      };
    }) : undefined;
    extra.push({
      id: `lst_g${String(i).padStart(3, '0')}`,
      title, vendor: v.name, vendor_id: v.id,
      price: 600 + ((i * 137) % 5400),
      status, category: cat,
      created: `2024-${String(6 + (i % 7)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
      views: 5 + Math.floor(Math.abs(Math.sin(i * 1.5) * 800)),
      inquiries: Math.floor(Math.abs(Math.sin(i * 2.3) * 50)),
      bookings: Math.floor(Math.abs(Math.sin(i * 3.7) * 20)),
      ...(documents ? { documents } : {}),
    });
  }
  return [...seed, ...extra];
}
export const MOCK_LISTINGS: Listing[] = _genListings();

// ─── TRANSACTION GENERATOR ──────────────────────────────────────────────────
const _disputeReasons = [
  'Vendor failed to deliver as described. Completely different from what was agreed.',
  'No-show on the wedding day. Vendor did not appear and was unreachable.',
  'Quality was significantly lower than what was shown in the portfolio.',
  'Vendor cancelled two days before the event with no notice.',
  'Work was incomplete — only delivered half of what was contracted.',
  'Vendor was unprofessional and rude to guests during the event.',
  'Received damaged items that were unusable for the wedding.',
  'Vendor overcharged beyond the agreed-upon price without authorization.',
  'Services rendered did not match the listing description at all.',
  'Vendor used subcontractor without disclosure or consent.',
  'Late arrival caused significant disruption to the wedding timeline.',
  'Vendor shared our private wedding photos publicly without permission.',
];
const _txnStatuses: Transaction['status'][] = ['completed','completed','completed','completed','completed','completed','completed','completed','completed','completed','completed','disputed','refunded','pending'];

function _genTransactions(): Transaction[] {
  const seed: Transaction[] = [
    { id: 'txn_3Ks9Lx2mPqR7vYnW', stripe_id: 'pi_3OqK2LHj8mTxNpQr1sBv7Ydc', buyer: 'Marcus Webb', buyer_id: 'b2e91d73', seller: 'Sarah Chen', seller_id: '6f3a2c1e', listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', amount: 3200, status: 'completed', date: '2025-01-20', disputed: false },
    { id: 'txn_8Fh4Tz3J7nLwS1uX', stripe_id: 'pi_8FhK9MNj2xRsWpLq4tYv3Bec', buyer: 'Jordan & Priya Ellis', buyer_id: 'c7d45e81', seller: 'Bloom & Co Florals', seller_id: 'a4f78c29', listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', amount: 4500, status: 'disputed', date: '2025-02-10', disputed: true, dispute_reason: 'Vendor failed to deliver as described. Completely different arrangement than agreed.', dispute_opened: '2025-02-12' },
    { id: 'txn_1Rp5F4hQcM9yVjAg', stripe_id: 'pi_1RpN7KLj4mQsXoWr9vBt2Ydh', buyer: 'Marcus Webb', buyer_id: 'b2e91d73', seller: 'Bloom & Co Florals', seller_id: 'a4f78c29', listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', amount: 1800, status: 'refunded', date: '2024-12-15', disputed: false },
    { id: 'txn_6Mv7G2tIpZ4xDrWq', stripe_id: 'pi_6MvK3NHj9xPsRqLt2wYv8Bdf', buyer: 'Jordan & Priya Ellis', buyer_id: 'c7d45e81', seller: 'Sarah Chen', seller_id: '6f3a2c1e', listing: 'Elopement Photography', listing_id: 'lst_5Mv8G2tIpZ6xDrWq', amount: 1400, status: 'pending', date: '2025-02-22', disputed: false },
    { id: 'txn_2Px4Qw8Ry6Tz0Uv', stripe_id: 'pi_2PxL5NKj7mQsRoWt9vBt1Ydh', buyer: 'Marcus Webb', buyer_id: 'b2e91d73', seller: 'The Sound Co.', seller_id: 'f1a23b45', listing: 'Full Band Experience', listing_id: 'lst_3Qr8H5kNpM2wBjCs', amount: 4800, status: 'completed', date: '2025-02-01', disputed: false },
    { id: 'txn_5Lm3Kn7Jo1Ip9Hq', stripe_id: 'pi_5LmK8NHj3mQsRoWt6vBt2Ydh', buyer: 'Jordan & Priya Ellis', buyer_id: 'c7d45e81', seller: 'Bloom & Co Florals', seller_id: 'a4f78c29', listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', amount: 1800, status: 'completed', date: '2025-01-05', disputed: false },
  ];
  const extra: Transaction[] = [];
  for (let i = 0; i < 74; i++) {
    const lst = MOCK_LISTINGS[i % MOCK_LISTINGS.length];
    const seller = _V.find(v => v.id === lst.vendor_id) || _V[i % _V.length];
    const buyer = _CO[i % _CO.length];
    const status = _txnStatuses[i % _txnStatuses.length];
    const isDisputed = status === 'disputed';
    const mo = 1 + (i % 12);
    const yr = mo <= 6 ? 2024 : mo <= 12 ? 2024 : 2025;
    const date = `${yr >= 2025 ? 2025 : 2024}-${String(((i % 8) + 1)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`;
    const h = (n: number) => n.toString(16).padStart(8, '0');
    extra.push({
      id: `txn_g${String(i).padStart(3, '0')}`,
      stripe_id: `pi_${h((i + 50) * 2654435761 >>> 0)}${h((i + 50) * 40503 >>> 0).slice(0, 4)}`,
      buyer: buyer.name, buyer_id: buyer.id.slice(0, 8),
      seller: seller.name, seller_id: seller.id.slice(0, 8),
      listing: lst.title, listing_id: lst.id,
      amount: lst.price || (500 + ((i * 211) % 7500)),
      status, date,
      disputed: isDisputed,
      ...(isDisputed ? { dispute_reason: _disputeReasons[i % _disputeReasons.length], dispute_opened: `${date.slice(0, 8)}${String(Math.min(28, parseInt(date.slice(8)) + 2)).padStart(2, '0')}` } : {}),
    });
  }
  return [...seed, ...extra];
}
export const MOCK_TRANSACTIONS: Transaction[] = _genTransactions();

// ─── REVIEW GENERATOR ───────────────────────────────────────────────────────
const _reviewPool: { rating: number; content: string; flagged: boolean }[] = [
  // 5-star
  { rating: 5, content: 'Absolutely incredible work. Everything exceeded our expectations and then some.', flagged: false },
  { rating: 5, content: 'Best decision we made for our wedding. Professional, creative, and so easy to work with.', flagged: false },
  { rating: 5, content: 'Blown away by the quality. Our guests could not stop raving about it all night.', flagged: false },
  { rating: 5, content: 'Worth every penny. They went above and beyond what we asked for in every way.', flagged: false },
  { rating: 5, content: 'Flawless execution from start to finish. Would hire again in a heartbeat.', flagged: false },
  { rating: 5, content: 'They made our dream wedding come to life. Could not be happier with the result.', flagged: false },
  { rating: 5, content: 'Exceeded all expectations. The attention to detail was remarkable.', flagged: false },
  { rating: 5, content: 'So talented and professional. Every interaction was smooth and stress-free.', flagged: false },
  // 4-star
  { rating: 4, content: 'Great work overall. Minor communication delay but the end result was lovely.', flagged: false },
  { rating: 4, content: 'Really happy with the outcome. Would have liked more variety but solid quality.', flagged: false },
  { rating: 4, content: 'Professional and reliable. A few small details were off but nothing major.', flagged: false },
  { rating: 4, content: 'Good experience overall. Delivery was a day late but the quality made up for it.', flagged: false },
  { rating: 4, content: 'Very impressed with the result. Only reason for 4 stars is the setup ran slightly behind.', flagged: false },
  // 3-star
  { rating: 3, content: 'Decent work but not what I expected based on the portfolio. Average experience.', flagged: false },
  { rating: 3, content: 'It was fine. Nothing special, nothing terrible. Met the basic requirements.', flagged: false },
  { rating: 3, content: 'Mixed feelings. Some things were great, others felt rushed or overlooked.', flagged: false },
  { rating: 3, content: 'Okay quality but the communication could have been much better throughout.', flagged: false },
  // 2-star
  { rating: 2, content: 'Disappointed. The final product did not match what was promised during the consultation.', flagged: false },
  { rating: 2, content: 'Below expectations. Poor communication and the work was not up to portfolio standard.', flagged: false },
  { rating: 2, content: 'Not worth the price. Took forever to respond and the quality was mediocre at best.', flagged: false },
  // 1-star
  { rating: 1, content: 'Complete disaster. They ghosted us two weeks before the wedding. Do not book.', flagged: true },
  { rating: 1, content: 'Worst vendor experience ever. Showed up late, work was terrible, rude to our guests.', flagged: true },
  { rating: 1, content: 'Total scam. They took our money and delivered nothing close to what was agreed upon.', flagged: true },
  { rating: 1, content: 'Absolutely awful. We had to scramble to find a replacement at the last minute.', flagged: false },
  // Flagged (suspicious / inappropriate)
  { rating: 5, content: 'AMAZING BEST VENDOR EVER! Book now! Do not wait! 10 out of 10! Click their link!', flagged: true },
  { rating: 1, content: 'This vendor is a complete fraud and should be shut down permanently.', flagged: true },
  { rating: 5, content: 'My cousin runs this business and they are the best. Hire them please!', flagged: true },
  { rating: 1, content: 'Leaving this review because the vendor left me a bad review first. Petty revenge.', flagged: true },
];

function _genReviews(): Review[] {
  const seed: Review[] = [
    { id: 'rev_2Ks8Lx9mPqR4vYnW', author: 'Marcus Webb', author_id: 'b2e91d73', target: 'Sarah Chen', target_id: '6f3a2c1e', listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', rating: 5, content: 'Absolutely incredible work. Sarah was calm, professional, and the photos exceeded everything we hoped for.', date: '2025-02-01', flagged: false },
    { id: 'rev_9Fh3Tz4J8nLwS7uX', author: 'Jordan & Priya Ellis', author_id: 'c7d45e81', target: 'Bloom & Co Florals', target_id: 'a4f78c29', listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', rating: 1, content: 'They ghosted us two weeks before the wedding. Complete disaster. Do not book.', date: '2025-02-15', flagged: true },
    { id: 'rev_4Rp6F1hQcM8yVjAg', author: 'Marcus Webb', author_id: 'b2e91d73', target: 'Bloom & Co Florals', target_id: 'a4f78c29', listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', rating: 2, content: 'Arrangements were not what was agreed upon. Had to request a refund.', date: '2025-01-02', flagged: false },
    { id: 'rev_7Gh2Ji6Kl0Mn4Op', author: 'Jordan & Priya Ellis', author_id: 'c7d45e81', target: 'The Sound Co.', target_id: 'f1a23b45', listing: 'Full Band Experience', listing_id: 'lst_3Qr8H5kNpM2wBjCs', rating: 5, content: 'Incredible energy all night. The band read the room perfectly. Every guest was on the floor.', date: '2025-02-08', flagged: false },
  ];
  const extra: Review[] = [];
  // Build a weighted pool: ~90% non-flagged reviews
  const _goodReviews = _reviewPool.filter(r => !r.flagged);
  const _badReviews = _reviewPool.filter(r => r.flagged);
  for (let i = 0; i < 76; i++) {
    const lst = MOCK_LISTINGS[i % MOCK_LISTINGS.length];
    const target = _V.find(v => v.id === lst.vendor_id) || _V[i % _V.length];
    const author = _CO[i % _CO.length];
    const tpl = i % 10 === 0 ? _badReviews[i % _badReviews.length] : _goodReviews[i % _goodReviews.length];
    const mo = 1 + (i % 12);
    const day = 1 + (i % 28);
    extra.push({
      id: `rev_g${String(i).padStart(3, '0')}`,
      author: author.name, author_id: author.id.slice(0, 8),
      target: target.name, target_id: target.id.slice(0, 8),
      listing: lst.title, listing_id: lst.id,
      rating: tpl.rating, content: tpl.content,
      date: `2025-${String(mo > 12 ? mo - 12 : mo).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      flagged: tpl.flagged,
    });
  }
  return [...seed, ...extra];
}
export const MOCK_REVIEWS: Review[] = _genReviews();

// ─── CONVERSATION GENERATOR ─────────────────────────────────────────────────
type _MsgT = [0 | 1, string]; // 0=couple, 1=vendor
const _convScripts: { status: 'clean' | 'flagged'; msgs: _MsgT[] }[] = [
  // 0 — Clean: Simple booking inquiry
  { status: 'clean', msgs: [
    [0, "Hi! We love your work. Are you available for a fall wedding?"],
    [1, "Thank you so much! I'd love to be part of your day. What date?"],
    [0, "October 15th at Riverside Gardens, about 120 guests."],
    [1, "I have that date open! The package would be perfect for that venue."],
    [0, "Wonderful, we'd like to move forward with booking."],
    [1, "Great! Go ahead and book through the platform whenever you're ready."],
  ]},
  // 1 — Clean: Pricing negotiation
  { status: 'clean', msgs: [
    [0, "Hi there! We're interested but the price is a bit above our budget."],
    [1, "I totally understand! What budget range are you working with?"],
    [0, "We were hoping to stay under $2,000 if possible."],
    [1, "I can offer a modified package that fits that range. Fewer hours but same quality."],
    [0, "That sounds perfect. Let's do it!"],
    [1, "Awesome! Book the modified package through the platform and we'll finalize details."],
  ]},
  // 2 — Clean: Availability check
  { status: 'clean', msgs: [
    [0, "Quick question — are you available June 21st?"],
    [1, "Let me check... Yes, June 21st is open!"],
    [0, "Amazing! We'll discuss with our planner and get back to you soon."],
    [1, "Sounds good, take your time! I'll hold the date for a week."],
  ]},
  // 3 — Clean: Post-booking follow-up
  { status: 'clean', msgs: [
    [0, "Hi! Just wanted to touch base before the big day. Any prep we should do?"],
    [1, "Great timing! Could you send me your final guest count and any special requests?"],
    [0, "150 guests, and we'd love to incorporate some family traditions."],
    [1, "Love that! Let's schedule a quick call this week to go over everything."],
    [0, "Thursday afternoon works for us!"],
    [1, "Perfect, I'll send a calendar link through the platform. So excited for your day!"],
  ]},
  // 4 — Clean: Customization discussion
  { status: 'clean', msgs: [
    [0, "We love your standard package but can we customize a few things?"],
    [1, "Absolutely! Customization is my favorite part. What did you have in mind?"],
    [0, "We want to add a cocktail hour setup and swap the arch style to something more rustic."],
    [1, "Easy! I'll put together a revised proposal with those changes. Give me a day or two."],
    [0, "Take your time, no rush!"],
    [1, "Proposal sent! Check it out on the platform and let me know your thoughts."],
    [0, "Looks perfect! Booking now."],
  ]},
  // 5 — Clean: Timeline planning
  { status: 'clean', msgs: [
    [0, "Our ceremony starts at 4pm. What time should we plan for you to arrive?"],
    [1, "I'd suggest 2pm to get everything set up with plenty of buffer time."],
    [0, "Works for us. The venue opens at noon if you need earlier access."],
    [1, "Noon would be ideal actually. That way everything is perfect well before guests arrive."],
    [0, "Great, I'll let the venue coordinator know."],
  ]},
  // 6 — Flagged: Vendor pushes Venmo
  { status: 'flagged', msgs: [
    [0, "Hi! Interested in your services for our August wedding."],
    [1, "Would love to work with you! What's your vision?"],
    [0, "Classic elegant style, outdoor ceremony, about 100 guests."],
    [1, "I can absolutely do that! Quick tip — if you want to save on fees, just Venmo me directly and I can give you a 10% discount."],
    [0, "We'd rather keep everything on the platform for protection."],
    [1, "Totally fine! Let's proceed through the platform then."],
  ]},
  // 7 — Flagged: Vendor pushes Zelle
  { status: 'flagged', msgs: [
    [0, "Love your portfolio! Are you available for a spring wedding?"],
    [1, "Thank you! Yes, I have spring dates open. What are you thinking?"],
    [0, "April 20th, intimate gathering of about 60 people."],
    [1, "Perfect size! Do you take Zelle? I can process the deposit faster that way and skip the platform fees."],
    [0, "We prefer to use the booking system here."],
    [1, "No problem at all! Book through the platform whenever you're ready."],
  ]},
  // 8 — Flagged: Vendor shares personal contact
  { status: 'flagged', msgs: [
    [0, "Hi! We'd love to discuss our wedding plans with you."],
    [1, "Exciting! I'd love to chat. Easiest way is to text me at my number or email me at sarah@gmail.com — the platform messaging is slow."],
    [0, "Oh, I think we should keep communication here for now."],
    [1, "Sure thing! Just trying to be responsive. What can I help with?"],
    [0, "We're looking for full-day coverage with a second shooter."],
    [1, "I offer that! Check out the full package details on my listing."],
  ]},
  // 9 — Flagged: Off-platform booking suggestion
  { status: 'flagged', msgs: [
    [0, "We're comparing a few vendors. What sets you apart?"],
    [1, "Great question! I've done over 200 weddings and I offer a unique style."],
    [0, "The pricing looks good. Can we book?"],
    [1, "Absolutely! Actually, if you want to book directly through my website you can avoid fees and I'll throw in a free add-on."],
    [0, "We feel more comfortable booking through Day Of."],
    [1, "Completely understand! The platform booking works great too."],
  ]},
  // 10 — Flagged: CashApp push
  { status: 'flagged', msgs: [
    [0, "Hi! Your work looks amazing. What's the deposit process?"],
    [1, "Thanks! Usually I take a 30% deposit to hold the date."],
    [0, "And that's through the platform?"],
    [1, "You can, but CashApp is way easier and faster. My handle is $VendorName. Saves us both the fees!"],
    [0, "I think we'll stick to the platform."],
    [1, "All good! Just trying to make it easy. Platform works too!"],
  ]},
  // 11 — Flagged: WhatsApp / phone number
  { status: 'flagged', msgs: [
    [0, "We have a lot of details to discuss. Best way to coordinate?"],
    [1, "I find WhatsApp is easiest! Add me and we can go back and forth much faster."],
    [0, "Can we keep it here? It's easier for us to track everything."],
    [1, "Of course! Whatever works for you. Let's start with the basics then."],
    [0, "Great. We're thinking 200 guests, outdoor venue, garden theme."],
    [1, "Beautiful vision! I have some ideas already. Let me pull some references."],
  ]},
  // 12 — Flagged: PayPal mention
  { status: 'flagged', msgs: [
    [0, "We'd like to book your services for our destination wedding."],
    [1, "A destination wedding! How exciting. Where is it?"],
    [0, "Tulum, Mexico. First week of March."],
    [1, "I've worked Tulum before! For international events I usually take PayPal since it's simpler."],
    [0, "Can we do it through the platform instead?"],
    [1, "Sure, that works. Let me adjust the listing for destination pricing."],
  ]},
  // 13 — Flagged: Multiple violations (venmo + book directly + avoid fees)
  { status: 'flagged', msgs: [
    [0, "We're really interested! Can we get started?"],
    [1, "Yes! So here's the thing — if you book directly with me we can avoid fees. Just Venmo me the deposit and we skip the platform entirely."],
    [0, "That doesn't feel right to us. We'd prefer the platform."],
    [1, "I understand your concern but honestly everyone does it. The fees are ridiculous."],
    [0, "We're going to stick with the platform. It gives us buyer protection."],
    [1, "Fair enough. Let's do it through the platform then."],
  ]},
  // 14 — Flagged: Vendor email + off platform
  { status: 'flagged', msgs: [
    [0, "Hi! Interested in the package for our November wedding."],
    [1, "November is gorgeous for weddings! Email me at hello@myvendor.com for a custom quote off the app."],
    [0, "We'd rather get the quote here if that's okay."],
    [1, "No worries! I can put it together here too. How many guests?"],
    [0, "About 180 guests, ballroom reception."],
    [1, "Lovely! I'll have a proposal to you by end of week right here on the platform."],
  ]},
  // 15 — Flagged: COUPLE pushes Venmo to vendor
  { status: 'flagged', msgs: [
    [0, "Hi! We love your work. Can we just Venmo you the deposit directly? It would be faster for us."],
    [1, "Thanks for the interest! I actually prefer to keep everything through the platform for both our protection."],
    [0, "We just figured we could avoid fees that way."],
    [1, "I understand, but the platform handles contracts and insurance. Let's book through here!"],
    [0, "Okay, that makes sense. We'll book through the platform."],
  ]},
  // 16 — Flagged: COUPLE shares personal contact + off platform
  { status: 'flagged', msgs: [
    [0, "Hey! Text me at my number — this app messaging is too slow. We can sort out details faster."],
    [1, "I appreciate that! But I keep all wedding communications on the platform so everything is documented."],
    [0, "Can we at least email? Our address is couple2025@gmail.com."],
    [1, "Let's keep it here for now — it protects us both. What details do you need to discuss?"],
    [0, "Fair enough. We want to customize the package a bit."],
    [1, "Happy to help with that right here! Tell me what you're thinking."],
  ]},
  // 17 — Flagged: COUPLE suggests booking directly
  { status: 'flagged', msgs: [
    [0, "We found your website and we could book directly with you to skip the platform fees. What do you think?"],
    [1, "I appreciate the thought, but I'm committed to working through Day Of. The platform protects both of us."],
    [0, "What if we did a direct booking and just kept the conversation here?"],
    [1, "Sorry, all my bookings go through the platform. It handles contracts, payments, and insurance."],
    [0, "Okay, we understand. Let's proceed through the platform then."],
  ]},
  // 18 — Flagged: COUPLE pushes CashApp
  { status: 'flagged', msgs: [
    [0, "Can we pay through CashApp? We don't love putting our card on random platforms."],
    [1, "The platform uses Stripe which is very secure. I'd recommend going through the booking flow here."],
    [0, "We've just had bad experiences with online payments before."],
    [1, "Totally understand the concern. Stripe is the same processor used by major retailers. Very safe!"],
    [0, "Alright, we'll trust the process. Going to book now."],
  ]},
];

function _genConversations(): Conversation[] {
  const seed: Conversation[] = [
    {
      id: 'conv_A1b2C3d4E5f6G7h8', participants: ['Marcus Webb','Sarah Chen'], participant_ids: ['b2e91d73','6f3a2c1e'],
      listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', txn_id: 'txn_3Ks9Lx2mPqR7vYnW',
      message_count: 6, last_message: '2025-01-18T10:42:00Z', reviewed: false, status: 'clean',
      messages: [
        { id:'m1', sender:'Marcus Webb', role:'couple', text:"Hi Sarah! We love your portfolio. We're getting married June 14th — do you have that date?", ts:'2025-01-10T09:15:00Z' },
        { id:'m2', sender:'Sarah Chen', role:'vendor', text:"Hi Marcus! June 14th is available. I'd love to learn more about your vision.", ts:'2025-01-10T10:02:00Z' },
        { id:'m3', sender:'Marcus Webb', role:'couple', text:"Garden ceremony at Foxcroft Estate, 120 guests. Documentary-style coverage.", ts:'2025-01-10T11:30:00Z' },
        { id:'m4', sender:'Sarah Chen', role:'vendor', text:"Documentary is my approach. I've shot Foxcroft twice — great light in the late afternoon.", ts:'2025-01-11T08:45:00Z' },
        { id:'m5', sender:'Marcus Webb', role:'couple', text:"Perfect, we'd like to move forward.", ts:'2025-01-12T14:20:00Z' },
        { id:'m6', sender:'Sarah Chen', role:'vendor', text:"Sounds great! Proceed through the booking flow and we're all set.", ts:'2025-01-18T10:42:00Z' },
      ],
    },
    {
      id: 'conv_B9c8D7e6F5g4H3i2', participants: ['Jordan & Priya Ellis','Bloom & Co Florals'], participant_ids: ['c7d45e81','a4f78c29'],
      listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', txn_id: 'txn_8Fh4Tz3J7nLwS1uX',
      message_count: 8, last_message: '2025-02-08T14:17:00Z', reviewed: false, status: 'flagged',
      messages: [
        { id:'m1', sender:'Jordan & Priya Ellis', role:'couple', text:"Hello! We love the Luxury Floral Design package.", ts:'2025-01-28T10:00:00Z' },
        { id:'m2', sender:'Bloom & Co Florals', role:'vendor', text:"Hi! 15 centerpieces, ceremony arch, bouquets, boutonnieres for 150 guests.", ts:'2025-01-28T11:15:00Z' },
        { id:'m3', sender:'Jordan & Priya Ellis', role:'couple', text:"Any add-ons for cocktail hour?", ts:'2025-01-29T09:30:00Z' },
        { id:'m4', sender:'Bloom & Co Florals', role:'vendor', text:"Yes — and if you want to save on fees just Venmo me directly, I can give you a better rate.", ts:'2025-02-01T13:45:00Z' },
        { id:'m5', sender:'Jordan & Priya Ellis', role:'couple', text:"We're not comfortable going outside the platform.", ts:'2025-02-02T08:20:00Z' },
        { id:'m6', sender:'Bloom & Co Florals', role:'vendor', text:"Totally fine! Let's proceed through the platform.", ts:'2025-02-02T09:05:00Z' },
        { id:'m7', sender:'Jordan & Priya Ellis', role:'couple', text:"Great, we booked it.", ts:'2025-02-05T11:00:00Z' },
        { id:'m8', sender:'Bloom & Co Florals', role:'vendor', text:"Wonderful! We'll be in touch.", ts:'2025-02-08T14:17:00Z' },
      ],
    },
    {
      id: 'conv_C4d3E2f1G8h7I6j5', participants: ['Marcus Webb','Bloom & Co Florals'], participant_ids: ['b2e91d73','a4f78c29'],
      listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', txn_id: 'txn_1Rp5F4hQcM9yVjAg',
      message_count: 5, last_message: '2024-12-10T09:05:00Z', reviewed: true, status: 'flagged',
      messages: [
        { id:'m1', sender:'Marcus Webb', role:'couple', text:"Hi, interested in the Garden Floral Package.", ts:'2024-12-05T10:00:00Z' },
        { id:'m2', sender:'Bloom & Co Florals', role:'vendor', text:"Email me at hello@bloomco.com — easier to coordinate off platform.", ts:'2024-12-05T11:30:00Z' },
        { id:'m3', sender:'Marcus Webb', role:'couple', text:"Do you take Zelle?", ts:'2024-12-06T09:15:00Z' },
        { id:'m4', sender:'Bloom & Co Florals', role:'vendor', text:"Yes, Zelle works. We can book directly and avoid the platform fees.", ts:'2024-12-07T14:00:00Z' },
        { id:'m5', sender:'Marcus Webb', role:'couple', text:"Actually going to stick to the platform.", ts:'2024-12-10T09:05:00Z' },
      ],
    },
    {
      id: 'conv_D5e4F3g2H1i8J7k6', participants: ['Jordan & Priya Ellis','Sarah Chen'], participant_ids: ['c7d45e81','6f3a2c1e'],
      listing: 'Elopement Photography', listing_id: 'lst_5Mv8G2tIpZ6xDrWq', txn_id: 'txn_6Mv7G2tIpZ4xDrWq',
      message_count: 4, last_message: '2025-02-21T16:30:00Z', reviewed: false, status: 'clean',
      messages: [
        { id:'m1', sender:'Jordan & Priya Ellis', role:'couple', text:"Hi Sarah! Planning a small elopement at Blue Ridge in March — just us and our dog.", ts:'2025-02-18T14:00:00Z' },
        { id:'m2', sender:'Sarah Chen', role:'vendor', text:"That sounds beautiful! My elopement package covers 4 hours, all locations, includes pups!", ts:'2025-02-19T09:20:00Z' },
        { id:'m3', sender:'Jordan & Priya Ellis', role:'couple', text:"Amazing. What time works for a quick call?", ts:'2025-02-20T11:00:00Z' },
        { id:'m4', sender:'Sarah Chen', role:'vendor', text:"Free Thursday after 2pm or Friday morning. Book through the platform!", ts:'2025-02-21T16:30:00Z' },
      ],
    },
  ];
  const extra: Conversation[] = [];
  // Build a weighted selection: ~80% clean conversations
  const _cleanScripts = _convScripts.filter(s => s.status === 'clean');
  const _flaggedScripts = _convScripts.filter(s => s.status === 'flagged');
  for (let i = 0; i < 76; i++) {
    const lst = MOCK_LISTINGS[i % MOCK_LISTINGS.length];
    const vendor = _V.find(v => v.id === lst.vendor_id) || _V[i % _V.length];
    const couple = _CO[i % _CO.length];
    const script = i % 5 === 0 ? _flaggedScripts[i % _flaggedScripts.length] : _cleanScripts[i % _cleanScripts.length];
    const reviewed = script.status === 'flagged' && i % 4 === 0;
    // Find a matching transaction if one exists
    const txn = MOCK_TRANSACTIONS.find(t => t.listing_id === lst.id && t.buyer_id === couple.id.slice(0, 8));
    // Build messages from script template
    const baseDate = new Date(2024, 5 + (i % 9), 1 + (i % 28), 9, 0, 0);
    const messages = script.msgs.map((m, mi) => {
      const ts = new Date(baseDate.getTime() + mi * 3600000 * (4 + (i % 20)));
      return {
        id: `m${mi + 1}`,
        sender: m[0] === 0 ? couple.name : vendor.name,
        role: (m[0] === 0 ? 'couple' : 'vendor') as 'couple' | 'vendor',
        text: m[1],
        ts: ts.toISOString().replace(/\.\d+Z$/, 'Z'),
      };
    });
    const lastMsg = messages[messages.length - 1];
    extra.push({
      id: `conv_g${String(i).padStart(3, '0')}`,
      participants: [couple.name, vendor.name],
      participant_ids: [couple.id.slice(0, 8), vendor.id.slice(0, 8)],
      listing: lst.title, listing_id: lst.id,
      ...(txn ? { txn_id: txn.id } : {}),
      message_count: messages.length,
      last_message: lastMsg.ts,
      reviewed,
      status: script.status,
      messages,
    });
  }
  return [...seed, ...extra];
}
export const MOCK_CONVERSATIONS: Conversation[] = _genConversations();

// ─── NOTES GENERATOR ────────────────────────────────────────────────────────
const _noteTemplates: { entity_type: string; getText: (label: string) => string; pinned: boolean }[] = [
  { entity_type: 'user', getText: (l) => `Suspended ${l} after repeated off-platform solicitation. Third warning issued before action.`, pinned: true },
  { entity_type: 'user', getText: (l) => `${l} reached out claiming misunderstanding. Not reinstating at this time. Escalated to leadership.`, pinned: false },
  { entity_type: 'user', getText: (l) => `Warning sent to ${l} for first off-platform attempt. Documented for future reference.`, pinned: false },
  { entity_type: 'user', getText: (l) => `${l} upgraded to probation after dispute resolution. Monitoring for 30 days.`, pinned: true },
  { entity_type: 'user', getText: (l) => `Vendor ${l} submitted new insurance docs. Pending review.`, pinned: false },
  { entity_type: 'transaction', getText: (l) => `Dispute under investigation for ${l}. Buyer provided photographic evidence. Awaiting vendor response.`, pinned: true },
  { entity_type: 'transaction', getText: (l) => `Refund processed for ${l}. Both parties notified. Case closed.`, pinned: false },
  { entity_type: 'transaction', getText: (l) => `${l} — vendor no-show confirmed by venue coordinator. Full refund initiated.`, pinned: true },
  { entity_type: 'transaction', getText: (l) => `Partial refund of 50% agreed by both parties for ${l}. Awaiting buyer confirmation.`, pinned: false },
  { entity_type: 'review', getText: (l) => `Review flagged for moderation: ${l}. Appears retaliatory — linked to active dispute.`, pinned: true },
  { entity_type: 'review', getText: (l) => `Review by ${l} verified as authentic after investigation. Unflagged.`, pinned: false },
  { entity_type: 'review', getText: (l) => `Suspicious review pattern detected for ${l}. Multiple 5-star reviews from new accounts.`, pinned: true },
  { entity_type: 'conversation', getText: (l) => `Conversation ${l} flagged by keyword detection. Off-platform payment solicitation identified.`, pinned: true },
  { entity_type: 'conversation', getText: (l) => `Reviewed conversation ${l}. Warning sent to vendor. First offense documented.`, pinned: false },
  { entity_type: 'conversation', getText: (l) => `Conversation ${l} reviewed and cleared. False positive from keyword detection.`, pinned: false },
  { entity_type: 'listing', getText: (l) => `Listing ${l} suspended pending document verification. Vendor notified.`, pinned: true },
  { entity_type: 'listing', getText: (l) => `Documents for ${l} approved. Listing reactivated.`, pinned: false },
  { entity_type: 'listing', getText: (l) => `Insurance certificate for ${l} expired. Vendor has 7 days to resubmit.`, pinned: true },
];

function _genNotes(): Note[] {
  const seed: Note[] = [
    { id: 'note_1', entity_type: 'user', entity_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', author: 'Genner Castillo', author_role: 'cs', text: 'Suspended after third off-platform solicitation attempt. Vendor was warned twice before action. Do not reinstate without leadership approval.', ts: '2025-02-10T14:30:00Z', pinned: true },
    { id: 'note_2', entity_type: 'user', entity_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', author: 'Harry McLaughlin', author_role: 'admin', text: 'Vendor reached out directly claiming misunderstanding. Not reinstating at this time. Escalated to Haines for final call.', ts: '2025-02-12T09:15:00Z' },
    { id: 'note_3', entity_type: 'transaction', entity_id: 'txn_8Fh4Tz3J7nLwS1uX', author: 'Genner Castillo', author_role: 'cs', text: 'Both parties contacted. Buyer provided photos showing wrong arrangement. Vendor claims buyer changed scope verbally. Awaiting vendor response by Feb 20.', ts: '2025-02-14T11:00:00Z', pinned: true },
  ];
  const extra: Note[] = [];
  // Generate notes for suspended/probation users
  const flaggedUsers = MOCK_USERS.filter(u => u.status === 'suspended' || u.status === 'probation');
  // Generate notes for disputed transactions
  const disputedTxns = MOCK_TRANSACTIONS.filter(t => t.status === 'disputed' || t.status === 'refunded');
  // Generate notes for flagged reviews
  const flaggedRevs = MOCK_REVIEWS.filter(r => r.flagged);
  // Generate notes for flagged conversations
  const flaggedConvs = MOCK_CONVERSATIONS.filter(c => c.status === 'flagged');
  // Generate notes for pending listings
  const pendingLsts = MOCK_LISTINGS.filter(l => l.status === 'pending_review' || l.status === 'suspended');

  let noteIdx = 0;
  const addNote = (entityType: string, entityId: string, label: string) => {
    const tpl = _noteTemplates.filter(t => t.entity_type === entityType);
    if (!tpl.length) return;
    const t = tpl[noteIdx % tpl.length];
    const actorIdx = noteIdx % _consoleActors.length;
    const day = 1 + (noteIdx % 28);
    const mo = 1 + (noteIdx % 2);
    extra.push({
      id: `note_g${String(noteIdx).padStart(3, '0')}`,
      entity_type: entityType, entity_id: entityId,
      author: _consoleActors[actorIdx], author_role: _consoleRoles[actorIdx],
      text: t.getText(label),
      ts: `2025-${String(mo).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(9 + (noteIdx % 8)).padStart(2, '0')}:${String(noteIdx % 60).padStart(2, '0')}:00Z`,
      pinned: t.pinned,
    });
    noteIdx++;
  };

  flaggedUsers.slice(0, 8).forEach(u => addNote('user', u.id, u.name));
  disputedTxns.slice(0, 8).forEach(t => addNote('transaction', t.id, t.id.slice(0, 12)));
  flaggedRevs.slice(0, 5).forEach(r => addNote('review', r.id, r.author));
  flaggedConvs.slice(0, 5).forEach(c => addNote('conversation', c.id, c.id.slice(0, 12)));
  pendingLsts.slice(0, 5).forEach(l => addNote('listing', l.id, l.title));

  return [...seed, ...extra];
}
export const MOCK_NOTES: Note[] = _genNotes();

// ─── AUDIT GENERATOR ────────────────────────────────────────────────────────
const _auditActions: { action: string; getDetail: (label: string) => string }[] = [
  { action: 'Suspended user', getDetail: (l) => `Policy violation. Status: active → suspended. User: ${l}` },
  { action: 'Reactivated user', getDetail: (l) => `Probation period completed. Status: suspended → active. User: ${l}` },
  { action: 'Added note', getDetail: (l) => `Internal note added for ${l}` },
  { action: 'Opened dispute', getDetail: (l) => `Dispute opened. Funds on hold pending resolution. ${l}` },
  { action: 'Resolved dispute', getDetail: (l) => `Dispute resolved. Refund processed. ${l}` },
  { action: 'Flagged review', getDetail: (l) => `Review flagged for moderation. ${l}` },
  { action: 'Unflagged review', getDetail: (l) => `Review cleared after investigation. ${l}` },
  { action: 'Approved document', getDetail: (l) => `Vendor document approved. ${l}` },
  { action: 'Rejected document', getDetail: (l) => `Vendor document rejected — expired or invalid. ${l}` },
  { action: 'Exported data', getDetail: (l) => `Data export generated for ${l}` },
  { action: 'Set probation', getDetail: (l) => `User placed on probation for 30 days. ${l}` },
  { action: 'Sent warning', getDetail: (l) => `Warning sent for off-platform solicitation. ${l}` },
  { action: 'Reviewed conversation', getDetail: (l) => `Flagged conversation reviewed and action taken. ${l}` },
  { action: 'Suspended listing', getDetail: (l) => `Listing suspended pending review. ${l}` },
  { action: 'Reactivated listing', getDetail: (l) => `Listing reactivated after document approval. ${l}` },
];

function _genAudit(): AuditEntry[] {
  const seed: AuditEntry[] = [
    { id: 'aud_1', actor: 'Genner Castillo', actor_role: 'cs', action: 'Suspended user', entity_type: 'user', entity_id: 'a4f78c29', entity_label: 'Bloom & Co Florals', detail: 'Third policy violation. Status: active → suspended', ts: '2025-02-10T14:28:00Z' },
    { id: 'aud_2', actor: 'Genner Castillo', actor_role: 'cs', action: 'Added note', entity_type: 'user', entity_id: 'a4f78c29', entity_label: 'Bloom & Co Florals', detail: 'Internal note added re: suspension reason', ts: '2025-02-10T14:30:00Z' },
    { id: 'aud_3', actor: 'Harry McLaughlin', actor_role: 'admin', action: 'Added note', entity_type: 'user', entity_id: 'a4f78c29', entity_label: 'Bloom & Co Florals', detail: 'Note re: vendor outreach, escalated to leadership', ts: '2025-02-12T09:15:00Z' },
    { id: 'aud_4', actor: 'Genner Castillo', actor_role: 'cs', action: 'Opened dispute', entity_type: 'transaction', entity_id: 'txn_8Fh4Tz3J7nLwS1uX', entity_label: 'txn_8Fh4Tz3J...', detail: 'Dispute opened. $4,500 on hold pending resolution', ts: '2025-02-12T10:00:00Z' },
    { id: 'aud_5', actor: 'Genner Castillo', actor_role: 'cs', action: 'Added note', entity_type: 'transaction', entity_id: 'txn_8Fh4Tz3J7nLwS1uX', entity_label: 'txn_8Fh4Tz3J...', detail: 'Dispute notes added, awaiting vendor response', ts: '2025-02-14T11:00:00Z' },
    { id: 'aud_6', actor: 'Harry McLaughlin', actor_role: 'admin', action: 'Flagged review', entity_type: 'review', entity_id: 'rev_9Fh3Tz4J8nLwS7uX', entity_label: 'Review by Jordan & Priya Ellis', detail: 'Review flagged for moderation review', ts: '2025-02-16T08:00:00Z' },
  ];
  const extra: AuditEntry[] = [];
  // Generate audit entries across entity types
  const entities: { type: string; id: string; label: string }[] = [];
  // Add suspended/probation users
  MOCK_USERS.filter(u => u.status === 'suspended' || u.status === 'probation').slice(0, 8).forEach(u => entities.push({ type: 'user', id: u.id.slice(0, 8), label: u.name }));
  // Add disputed/refunded transactions
  MOCK_TRANSACTIONS.filter(t => t.status === 'disputed' || t.status === 'refunded').slice(0, 8).forEach(t => entities.push({ type: 'transaction', id: t.id, label: `${t.id.slice(0, 12)}...` }));
  // Add flagged reviews
  MOCK_REVIEWS.filter(r => r.flagged).slice(0, 5).forEach(r => entities.push({ type: 'review', id: r.id, label: `Review by ${r.author}` }));
  // Add flagged conversations
  MOCK_CONVERSATIONS.filter(c => c.status === 'flagged').slice(0, 5).forEach(c => entities.push({ type: 'conversation', id: c.id, label: `${c.id.slice(0, 12)}...` }));
  // Add pending/suspended listings
  MOCK_LISTINGS.filter(l => l.status !== 'active').slice(0, 5).forEach(l => entities.push({ type: 'listing', id: l.id, label: l.title }));

  entities.forEach((ent, i) => {
    const tpl = _auditActions[i % _auditActions.length];
    const actorIdx = i % _consoleActors.length;
    const day = 1 + (i % 28);
    const mo = 1 + (i % 2);
    extra.push({
      id: `aud_g${String(i).padStart(3, '0')}`,
      actor: _consoleActors[actorIdx], actor_role: _consoleRoles[actorIdx],
      action: tpl.action,
      entity_type: ent.type, entity_id: ent.id, entity_label: ent.label,
      detail: tpl.getDetail(ent.label),
      ts: `2025-${String(mo).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(8 + (i % 10)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00Z`,
    });
  });
  return [...seed, ...extra];
}
export const MOCK_AUDIT: AuditEntry[] = _genAudit();

// ─── ALERT CONFIGS ──────────────────────────────────────────────────────────
export const MOCK_ALERT_CONFIGS: AlertConfig[] = [
  { id: 'alt_1', label: 'New dispute opened', enabled: true, channel: 'slack' },
  { id: 'alt_2', label: 'High-risk conversation (score ≥60)', enabled: true, threshold: 60, channel: 'slack' },
  { id: 'alt_3', label: 'Vendor dispute rate >10%', enabled: true, threshold: 10, channel: 'email' },
  { id: 'alt_4', label: 'New flagged review', enabled: true, channel: 'console' },
  { id: 'alt_5', label: 'Vendor in pending >5 days', enabled: false, threshold: 5, channel: 'email' },
  { id: 'alt_6', label: 'Weekly digest report', enabled: true, channel: 'email' },
  { id: 'alt_7', label: 'Listing inactive 90+ days', enabled: false, threshold: 90, channel: 'console' },
];

// ─── WEEKLY CHART DATA ──────────────────────────────────────────────────────
export const MOCK_GMV_WEEKLY = [
  { week: 'Jan 6', gmv: 3200, bookings: 2, disputes: 0 },
  { week: 'Jan 13', gmv: 5800, bookings: 3, disputes: 0 },
  { week: 'Jan 20', gmv: 4200, bookings: 2, disputes: 1 },
  { week: 'Jan 27', gmv: 7600, bookings: 4, disputes: 0 },
  { week: 'Feb 3', gmv: 6100, bookings: 3, disputes: 1 },
  { week: 'Feb 10', gmv: 9400, bookings: 5, disputes: 1 },
  { week: 'Feb 17', gmv: 5900, bookings: 3, disputes: 0 },
  { week: 'Feb 24', gmv: 1400, bookings: 1, disputes: 0 },
];

export const MOCK_SIGNUPS_WEEKLY = [
  { week: 'Jan 6', vendors: 1, couples: 3 },
  { week: 'Jan 13', vendors: 2, couples: 5 },
  { week: 'Jan 20', vendors: 0, couples: 4 },
  { week: 'Jan 27', vendors: 1, couples: 6 },
  { week: 'Feb 3', vendors: 2, couples: 4 },
  { week: 'Feb 10', vendors: 1, couples: 7 },
  { week: 'Feb 17', vendors: 1, couples: 5 },
  { week: 'Feb 24', vendors: 1, couples: 2 },
];
