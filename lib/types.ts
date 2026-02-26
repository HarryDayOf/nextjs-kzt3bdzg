// ─── ROLES & PERMISSIONS ──────────────────────────────────────────────────────
export type Role = 'admin' | 'cs' | 'moderation' | 'leadership' | 'readonly';

export const ROLE_PERMS: Record<Role, string[]> = {
  admin:      ['view', 'notes', 'flag', 'export', 'config'],
  cs:         ['view', 'notes', 'flag', 'export'],
  moderation: ['view', 'notes', 'flag', 'export'],
  leadership: ['view', 'export'],
  readonly:   ['view'],
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin', cs: 'Customer Service', moderation: 'Moderation',
  leadership: 'Leadership', readonly: 'Read Only',
};

export function can(role: Role, action: string): boolean {
  return ROLE_PERMS[role]?.includes(action) ?? false;
}

// ─── ENTITIES ─────────────────────────────────────────────────────────────────
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

// ─── KEYWORDS ─────────────────────────────────────────────────────────────────
export type KWCategory = 'payment' | 'contact' | 'offplatform';
export type KWHit = { word: string; category: KWCategory };

export const KW_CATEGORIES: Record<KWCategory, { label: string; color: string; bg: string; words: string[] }> = {
  payment:     { label: 'Payment',      color: '#c62828', bg: '#fdecea', words: ['venmo', 'zelle', 'cashapp', 'cash app', 'paypal', 'wire transfer', 'bank transfer', 'western union', 'crypto', 'bitcoin'] },
  contact:     { label: 'Contact',      color: '#b45309', bg: '#fff8e1', words: ['text me', 'call me', 'whatsapp', 'instagram dm', 'facebook', '@gmail', '@yahoo', '@icloud', '@hotmail', 'my number', 'phone number'] },
  offplatform: { label: 'Off-Platform', color: '#7c3aed', bg: '#f5f3ff', words: ['off the app', 'off platform', 'outside the platform', 'my website', 'direct booking', 'book directly', 'bypass', 'avoid fees', 'save on fees', 'skip the platform'] },
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
  active:   { label: 'Active',   bg: '#e8f5e9', color: '#2e7d32' },
  flagged:  { label: 'Flagged',  bg: '#fff3e0', color: '#e65100' },
  clean:    { label: 'Clean',    bg: '#e8f5e9', color: '#2e7d32' },
  reviewed: { label: 'Reviewed', bg: '#e0f2fe', color: '#0369a1' },
};

// ─── CSV EXPORT ───────────────────────────────────────────────────────────────
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
