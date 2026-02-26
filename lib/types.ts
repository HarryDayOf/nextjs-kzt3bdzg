// ─── ROLES & PERMISSIONS ─────────────────────────────────────────────────────
export type Role = 'admin' | 'cs' | 'moderation' | 'leadership' | 'readonly';

export const ROLE_PERMS: Record<Role, string[]> = {
  admin:      ['view','edit','suspend','refund','delete','notes','assign','export','config','users_manage','bulk'],
  cs:         ['view','edit','notes','assign','refund','export'],
  moderation: ['view','notes','suspend','assign','export'],
  leadership: ['view','export','notes'],
  readonly:   ['view'],
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin', cs: 'Customer Service', moderation: 'Moderation',
  leadership: 'Leadership', readonly: 'Read Only',
};

export function can(role: Role, action: string): boolean {
  return ROLE_PERMS[role]?.includes(action) ?? false;
}

// ─── DARK MODE COLOR PALETTE ─────────────────────────────────────────────────
export function mkC(dark: boolean) {
  return {
    bg:          dark ? '#0f172a' : '#f4f5f7',
    surface:     dark ? '#1e293b' : '#fff',
    surfaceAlt:  dark ? '#182030' : '#fafafa',
    border:      dark ? '#334155' : '#e5e7eb',
    borderLight: dark ? '#243048' : '#f3f4f6',
    text:        dark ? '#e2e8f0' : '#374151',
    textMuted:   dark ? '#94a3b8' : '#9ca3af',
    textFaint:   dark ? '#475569' : '#d1d5db',
    inputBg:     dark ? '#0f172a' : '#fff',
    inputBorder: dark ? '#374151' : '#e5e7eb',
  };
}

// ─── DOCUMENT VERIFICATION ───────────────────────────────────────────────────
export type DocStatus = 'pending' | 'approved' | 'rejected';

export interface VendorDocument {
  id: string;
  type: string;
  label: string;
  url: string;
  status: DocStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// ─── ENTITIES ─────────────────────────────────────────────────────────────────
export interface ConsoleUser {
  id: string; name: string; email: string; role: Role; active: boolean; joined: string; lastLogin: string;
}

export interface User {
  id: string; name: string; email: string; role: 'vendor' | 'couple';
  status: 'active' | 'suspended' | 'pending' | 'probation'; joined: string;
  listings: number; transactions: number; tawk_id: string; revenue: number;
  responseRate?: number; bookingRate?: number; cancellationRate?: number; avgRating?: number;
  repeatFlags?: number;
}

export interface Listing {
  id: string; title: string; vendor: string; vendor_id: string;
  price: number; status: 'active' | 'suspended' | 'pending_review'; category: string; created: string;
  views?: number; inquiries?: number; bookings?: number;
  documents?: VendorDocument[];
}

export interface Transaction {
  id: string; stripe_id: string; buyer: string; buyer_id: string;
  seller: string; seller_id: string; listing: string; listing_id: string;
  amount: number; status: 'completed' | 'disputed' | 'refunded' | 'pending';
  date: string; disputed: boolean;
  dispute_reason?: string; dispute_opened?: string;
}

export interface Review {
  id: string; author: string; author_id: string; target: string; target_id: string;
  listing: string; listing_id: string; rating: number; content: string; date: string; flagged: boolean;
}

export interface Message {
  id: string; sender: string; role: 'vendor' | 'couple'; text: string; ts: string;
}

export interface Conversation {
  id: string; participants: string[]; participant_ids: string[];
  listing: string; listing_id: string; txn_id?: string;
  message_count: number; last_message: string; reviewed: boolean;
  status: 'clean' | 'flagged'; messages: Message[];
}

export interface Note {
  id: string; entity_type: string; entity_id: string;
  author: string; author_role: Role; text: string; ts: string; pinned?: boolean;
}

export interface AuditEntry {
  id: string; actor: string; actor_role: Role; action: string;
  entity_type: string; entity_id: string; entity_label: string;
  detail: string; ts: string;
}

export interface AlertConfig {
  id: string; label: string; enabled: boolean; threshold?: number; channel: 'email' | 'slack' | 'console';
}

// ─── KEYWORDS ─────────────────────────────────────────────────────────────────
export type KWCategory = 'payment' | 'contact' | 'offplatform';
export type KWHit = { word: string; category: KWCategory };

export const KW_CATEGORIES: Record<KWCategory, { label: string; color: string; bg: string; words: string[] }> = {
  payment:     { label:'Payment',      color:'#c62828', bg:'#fdecea', words:['venmo','zelle','cashapp','cash app','paypal','wire transfer','bank transfer','western union','crypto','bitcoin'] },
  contact:     { label:'Contact',      color:'#b45309', bg:'#fff8e1', words:['text me','call me','whatsapp','instagram dm','facebook','@gmail','@yahoo','@icloud','@hotmail','my number','phone number'] },
  offplatform: { label:'Off-Platform', color:'#7c3aed', bg:'#f5f3ff', words:['off the app','off platform','outside the platform','my website','direct booking','book directly','bypass','avoid fees','save on fees','skip the platform'] },
};

export function detectKeywords(text: string): KWHit[] {
  const lower = text.toLowerCase();
  const hits: KWHit[] = [];
  (Object.keys(KW_CATEGORIES) as KWCategory[]).forEach(cat => {
    KW_CATEGORIES[cat].words.forEach(word => {
      if (lower.includes(word) && !hits.find(h => h.word === word)) hits.push({ word, category: cat });
    });
  });
  return hits;
}

export function uniqueHits(hits: KWHit[]): KWHit[] {
  return hits.filter((h, i, arr) => arr.findIndex(x => x.word === h.word) === i);
}

export function riskScore(conv: Conversation): number {
  const hits = uniqueHits(conv.messages.flatMap(m => detectKeywords(m.text)));
  return Math.min(100, hits.length * 18 + (conv.status === 'flagged' ? 20 : 0));
}

export function riskColor(score: number): string {
  return score >= 60 ? '#c62828' : score >= 30 ? '#f57f17' : '#2e7d32';
}

export function riskLabel(score: number): string {
  return score >= 60 ? 'High Risk' : score >= 30 ? 'Medium Risk' : 'Low Risk';
}

// ─── STATUS STYLES ────────────────────────────────────────────────────────────
export const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  active:         { label:'Active',         bg:'#e8f5e9', color:'#2e7d32' },
  suspended:      { label:'Suspended',      bg:'#fdecea', color:'#c62828' },
  pending:        { label:'Pending',        bg:'#fff8e1', color:'#f57f17' },
  pending_review: { label:'Pending Review', bg:'#fff8e1', color:'#f57f17' },
  probation:      { label:'Probation',      bg:'#fff3e0', color:'#e65100' },
  completed:      { label:'Completed',      bg:'#e8f5e9', color:'#2e7d32' },
  disputed:       { label:'Disputed',       bg:'#fdecea', color:'#c62828' },
  refunded:       { label:'Refunded',       bg:'#f3f4f6', color:'#6b7280' },
  flagged:        { label:'Flagged',        bg:'#fff3e0', color:'#e65100' },
  clean:          { label:'Clean',          bg:'#e8f5e9', color:'#2e7d32' },
  verified:       { label:'Verified',       bg:'#e0f2fe', color:'#0369a1' },
  featured:       { label:'Featured',       bg:'#fdf4ff', color:'#7e22ce' },
  new:            { label:'New',            bg:'#f0fdf4', color:'#15803d' },
  standard:       { label:'Standard',       bg:'#f3f4f6', color:'#6b7280' },
  approved:       { label:'Approved',       bg:'#e8f5e9', color:'#2e7d32' },
  rejected:       { label:'Rejected',       bg:'#fdecea', color:'#c62828' },
};

// ─── EXPORTS / PRINT ─────────────────────────────────────────────────────────
export function downloadCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => {
    const v = String(r[k] ?? '').replace(/"/g, '""');
    return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v}"` : v;
  }).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function printTable(title: string, rows: Record<string, unknown>[], columns: { key: string; label: string }[]) {
  const html = `<!DOCTYPE html><html><head><title>${title}</title>
  <style>body{font-family:Georgia,serif;padding:32px;color:#111}h1{font-size:20px;margin-bottom:4px}p.meta{color:#888;font-size:12px;margin-bottom:24px}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#f3f4f6;padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#555;border-bottom:2px solid #e5e7eb}td{padding:8px 12px;border-bottom:1px solid #f3f4f6}tr:nth-child(even)td{background:#fafafa}@media print{body{padding:16px}}</style>
  </head><body><h1>${title}</h1><p class="meta">Generated ${new Date().toLocaleString()} · ${rows.length} records</p>
  <table><thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(r => `<tr>${columns.map(c => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></body></html>`;
  const w = window.open('', '_blank'); if (!w) return;
  w.document.write(html); w.document.close(); w.focus(); setTimeout(() => w.print(), 400);
}
