'use client';
import { useState } from 'react';

// ─── KEYWORD FLAGS ───────────────────────────────────────────────────────────
const FLAG_KEYWORDS = ['venmo', 'zelle', 'cashapp', 'cash app', 'paypal', 'off the app', 'off platform', 'text me', 'call me', 'my website', 'direct booking', 'book directly', 'bypass', 'outside the platform', '@gmail', '@yahoo', '@icloud', 'whatsapp', 'instagram dm'];

function detectFlags(text: string): string[] {
  const lower = text.toLowerCase();
  return FLAG_KEYWORDS.filter(k => lower.includes(k));
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', name: 'Sarah Chen', email: 'sarah.chen@bloomday.co', role: 'vendor', status: 'active', joined: '2024-11-01', listings: 3, transactions: 12, tawk_id: 'tawk_6f3a2c1e' },
  { id: 'b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', name: 'Marcus Webb', email: 'marcus.webb@gmail.com', role: 'couple', status: 'active', joined: '2025-01-15', listings: 0, transactions: 2, tawk_id: 'tawk_b2e91d73' },
  { id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', name: 'Bloom & Co Florals', email: 'hello@bloomco.com', role: 'vendor', status: 'suspended', joined: '2024-09-10', listings: 7, transactions: 31, tawk_id: 'tawk_a4f78c29' },
  { id: 'c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34', name: 'Jordan & Priya Ellis', email: 'jordan.priya@icloud.com', role: 'couple', status: 'active', joined: '2025-02-01', listings: 0, transactions: 1, tawk_id: 'tawk_c7d45e81' },
  { id: 'e9b12f47-7c3d-4e5a-b891-0a6c2f8d4e73', name: 'Magnolia Events', email: 'info@magnoliaevents.com', role: 'vendor', status: 'pending', joined: '2025-02-20', listings: 0, transactions: 0, tawk_id: 'tawk_e9b12f47' },
];

const MOCK_LISTINGS = [
  { id: 'lst_4Hx9K2mPqR7vYnWd', title: 'Full-Day Wedding Photography', vendor: 'Sarah Chen', vendor_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', price: 3200, status: 'active', category: 'Photography', created: '2024-11-05' },
  { id: 'lst_7Tz3J8nLwS1uXkBe', title: 'Garden Floral Package', vendor: 'Bloom & Co Florals', vendor_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', price: 1800, status: 'suspended', category: 'Florals', created: '2024-09-15' },
  { id: 'lst_2Rp6F4hQcM9yVjAg', title: 'Luxury Floral Design', vendor: 'Bloom & Co Florals', vendor_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', price: 4500, status: 'active', category: 'Florals', created: '2024-10-01' },
  { id: 'lst_9Kd1N7bUoE3wCfHs', title: 'DJ + MC Package', vendor: 'Magnolia Events', vendor_id: 'e9b12f47-7c3d-4e5a-b891-0a6c2f8d4e73', price: 2200, status: 'pending_review', category: 'Entertainment', created: '2025-02-20' },
  { id: 'lst_5Mv8G2tIpZ6xDrWq', title: 'Elopement Photography', vendor: 'Sarah Chen', vendor_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', price: 1400, status: 'active', category: 'Photography', created: '2024-12-01' },
];

const MOCK_TRANSACTIONS = [
  { id: 'txn_3Ks9Lx2mPqR7vYnW', stripe_id: 'pi_3OqK2LHj8mTxNpQr1sBv7Ydc', buyer: 'Marcus Webb', buyer_id: 'b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', seller: 'Sarah Chen', seller_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', amount: 3200, status: 'completed', date: '2025-01-20', disputed: false },
  { id: 'txn_8Fh4Tz3J7nLwS1uX', stripe_id: 'pi_8FhK9MNj2xRsWpLq4tYv3Bec', buyer: 'Jordan & Priya Ellis', buyer_id: 'c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34', seller: 'Bloom & Co Florals', seller_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', amount: 4500, status: 'disputed', date: '2025-02-10', disputed: true },
  { id: 'txn_1Rp5F4hQcM9yVjAg', stripe_id: 'pi_1RpN7KLj4mQsXoWr9vBt2Ydh', buyer: 'Marcus Webb', buyer_id: 'b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', seller: 'Bloom & Co Florals', seller_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', amount: 1800, status: 'refunded', date: '2024-12-15', disputed: false },
  { id: 'txn_6Mv7G2tIpZ4xDrWq', stripe_id: 'pi_6MvK3NHj9xPsRqLt2wYv8Bdf', buyer: 'Jordan & Priya Ellis', buyer_id: 'c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34', seller: 'Sarah Chen', seller_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', listing: 'Elopement Photography', listing_id: 'lst_5Mv8G2tIpZ6xDrWq', amount: 1400, status: 'pending', date: '2025-02-22', disputed: false },
];

const MOCK_REVIEWS = [
  { id: 'rev_2Ks8Lx9mPqR4vYnW', author: 'Marcus Webb', author_id: 'b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', target: 'Sarah Chen', target_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', rating: 5, content: 'Absolutely incredible work. Sarah was calm, professional, and the photos exceeded everything we hoped for.', date: '2025-02-01', flagged: false },
  { id: 'rev_9Fh3Tz4J8nLwS7uX', author: 'Jordan & Priya Ellis', author_id: 'c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34', target: 'Bloom & Co Florals', target_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', rating: 1, content: 'They ghosted us two weeks before the wedding. Complete disaster. Do not book.', date: '2025-02-15', flagged: true },
  { id: 'rev_4Rp6F1hQcM8yVjAg', author: 'Marcus Webb', author_id: 'b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', target: 'Bloom & Co Florals', target_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', rating: 2, content: 'Arrangements were not what was agreed upon. Had to request a refund.', date: '2025-01-02', flagged: false },
];

const MOCK_CONVERSATIONS = [
  { id: 'conv_A1b2C3d4E5f6G7h8', participants: ['Marcus Webb', 'Sarah Chen'], participant_ids: ['b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04'], listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', message_count: 14, last_message: '2025-01-18T10:42:00Z', last_snippet: "Sounds great, can't wait to meet you both!", flag_hits: [], status: 'clean' },
  { id: 'conv_B9c8D7e6F5g4H3i2', participants: ['Jordan & Priya Ellis', 'Bloom & Co Florals'], participant_ids: ['c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34', 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96'], listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', message_count: 31, last_message: '2025-02-08T14:17:00Z', last_snippet: "If you want to save on fees just Venmo me directly, way easier.", flag_hits: ['venmo'], status: 'flagged' },
  { id: 'conv_C4d3E2f1G8h7I6j5', participants: ['Marcus Webb', 'Bloom & Co Florals'], participant_ids: ['b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96'], listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', message_count: 9, last_message: '2024-12-10T09:05:00Z', last_snippet: "Here's my personal email sarah@bloomco.com, easier to coordinate off platform.", flag_hits: ['off platform', '@gmail'], status: 'flagged' },
  { id: 'conv_D5e4F3g2H1i8J7k6', participants: ['Jordan & Priya Ellis', 'Sarah Chen'], participant_ids: ['c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34', '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04'], listing: 'Elopement Photography', listing_id: 'lst_5Mv8G2tIpZ6xDrWq', message_count: 6, last_message: '2025-02-21T16:30:00Z', last_snippet: "What time works for a quick call to go over the shot list?", flag_hits: [], status: 'clean' },
];

const INIT_TICKETS: any[] = [
  { id: 'tkt_001', title: 'Vendor soliciting off-platform payment', priority: 'high', status: 'open', assignee: null, created: '2025-02-08', linked: { type: 'conversation', id: 'conv_B9c8D7e6F5g4H3i2', label: 'conv_B9c8D7e6F5g4H3i2' }, notes: 'Bloom & Co asked couple to pay via Venmo. Screenshot captured. Pending review.' },
  { id: 'tkt_002', title: 'Disputed transaction — no delivery', priority: 'high', status: 'open', assignee: null, created: '2025-02-11', linked: { type: 'transaction', id: 'txn_8Fh4Tz3J7nLwS1uX', label: 'txn_8Fh4Tz3J7nLwS1uX' }, notes: 'Jordan & Priya filed dispute. Vendor unresponsive for 3 days.' },
  { id: 'tkt_003', title: 'Fraudulent review suspected', priority: 'medium', status: 'in_review', assignee: 'Genner', created: '2025-02-16', linked: { type: 'review', id: 'rev_9Fh3Tz4J8nLwS7uX', label: 'rev_9Fh3Tz4J8nLwS7uX' }, notes: 'Review flagged. Vendor claims they fulfilled the order. Waiting on documentation from both parties.' },
  { id: 'tkt_004', title: 'Vendor attempting off-platform redirect', priority: 'medium', status: 'resolved', assignee: 'Genner', created: '2024-12-11', linked: { type: 'conversation', id: 'conv_C4d3E2f1G8h7I6j5', label: 'conv_C4d3E2f1G8h7I6j5' }, notes: 'Warning issued. Vendor acknowledged policy. Monitoring.' },
];

// ─── STATUS / PRIORITY MAPS ──────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  active:         { label: 'Active',         bg: '#e8f5e9', color: '#2e7d32' },
  suspended:      { label: 'Suspended',      bg: '#fdecea', color: '#c62828' },
  pending:        { label: 'Pending',        bg: '#fff8e1', color: '#f57f17' },
  pending_review: { label: 'Pending Review', bg: '#fff8e1', color: '#f57f17' },
  completed:      { label: 'Completed',      bg: '#e8f5e9', color: '#2e7d32' },
  disputed:       { label: 'Disputed',       bg: '#fdecea', color: '#c62828' },
  refunded:       { label: 'Refunded',       bg: '#f3f4f6', color: '#6b7280' },
  flagged:        { label: 'Flagged',        bg: '#fff3e0', color: '#e65100' },
  clean:          { label: 'Clean',          bg: '#e8f5e9', color: '#2e7d32' },
  open:           { label: 'Open',           bg: '#fdecea', color: '#c62828' },
  in_review:      { label: 'In Review',      bg: '#fff8e1', color: '#f57f17' },
  resolved:       { label: 'Resolved',       bg: '#f3f4f6', color: '#6b7280' },
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  high:   { label: 'High',   color: '#c62828' },
  medium: { label: 'Medium', color: '#f57f17' },
  low:    { label: 'Low',    color: '#2e7d32' },
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const s = STATUS_MAP[status] || { label: status, bg: '#f3f4f6', color: '#6b7280' };
  return <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
}

function PriorityDot({ priority }: { priority: string }) {
  const p = PRIORITY_MAP[priority] || { label: priority, color: '#6b7280' };
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: p.color, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: p.color, display: 'inline-block' }} />{p.label}</span>;
}

function IdChip({ value }: { value: string }) {
  return <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.02em' }}>{value}</span>;
}

function KeywordChip({ word }: { word: string }) {
  return <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c62828', backgroundColor: '#fdecea', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{word}</span>;
}

function Modal({ title, subtitle, children, onClose, wide }: any) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,20,40,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 20px 60px rgba(15,20,40,0.18)', padding: '32px', width: wide ? '720px' : '580px', maxWidth: '95vw', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e: any) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 600, color: '#0f1428', marginBottom: '2px' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '22px', lineHeight: 1, paddingLeft: '16px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'flex-start' }}>
      <span style={{ color: '#9ca3af', fontSize: '12px', minWidth: '150px', fontWeight: 500, paddingTop: '1px' }}>{label}</span>
      <span style={{ color: '#1f2937', fontSize: '13px', flex: 1 }}>{value}</span>
    </div>
  );
}

function ActionBtn({ label, variant = 'default', onClick }: { label: string; variant?: string; onClick: () => void }) {
  const variants: Record<string, any> = {
    default: { bg: '#f9fafb', border: '#e5e7eb', color: '#374151' },
    primary: { bg: '#0f1428', border: '#0f1428', color: '#fff' },
    danger:  { bg: '#fdecea', border: '#fca5a5', color: '#c62828' },
    success: { bg: '#e8f5e9', border: '#86efac', color: '#2e7d32' },
    warning: { bg: '#fff8e1', border: '#fcd34d', color: '#b45309' },
  };
  const v = variants[variant];
  return <button onClick={onClick} style={{ padding: '8px 16px', backgroundColor: v.bg, border: `1px solid ${v.border}`, borderRadius: '8px', color: v.color, fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>{label}</button>;
}

function DayOfLogo({ white }: { white?: boolean }) {
  const c = white ? '#fff' : '#0f1428';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '20px', color: c, letterSpacing: '-0.02em' }}>
      Day<span style={{ position: 'relative', display: 'inline-block' }}>O<span style={{ position: 'absolute', top: '1px', right: '-4px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: c, display: 'inline-block' }} /></span><span style={{ marginLeft: '9px' }}>f</span>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SupportConsole({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [tickets, setTickets] = useState(INIT_TICKETS);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketLinkedTo, setNewTicketLinkedTo] = useState<any>(null);

  // new ticket form state
  const [ntTitle, setNtTitle] = useState('');
  const [ntPriority, setNtPriority] = useState('medium');
  const [ntNotes, setNtNotes] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleLogout = () => { sessionStorage.removeItem('dayof_user'); window.location.href = '/'; };
  const filter = (items: any[], fields: string[]) => search ? items.filter(i => fields.some(f => (i[f] ?? '').toString().toLowerCase().includes(search.toLowerCase()))) : items;

  const flaggedConvs = conversations.filter(c => c.status === 'flagged');
  const openTickets = tickets.filter(t => t.status === 'open').length;

  const openNewTicket = (linked?: any) => {
    setNewTicketLinkedTo(linked || null);
    setNtTitle('');
    setNtPriority('medium');
    setNtNotes('');
    setShowNewTicket(true);
  };

  const createTicket = () => {
    if (!ntTitle.trim()) return;
    const t = {
      id: 'tkt_' + Math.random().toString(36).slice(2, 6).padStart(3, '0'),
      title: ntTitle,
      priority: ntPriority,
      status: 'open',
      assignee: null,
      created: new Date().toISOString().slice(0, 10),
      linked: newTicketLinkedTo,
      notes: ntNotes,
    };
    setTickets([t, ...tickets]);
    setShowNewTicket(false);
    showToast('Ticket created.');
  };

  const tabs = [
    { id: 'users', label: 'Users', count: users.length, alert: 0 },
    { id: 'listings', label: 'Listings', count: listings.length, alert: 0 },
    { id: 'transactions', label: 'Transactions', count: transactions.length, alert: 0 },
    { id: 'reviews', label: 'Reviews', count: reviews.length, alert: 0 },
    { id: 'conversations', label: 'Conversations', count: conversations.length, alert: flaggedConvs.length },
    { id: 'tickets', label: 'Tickets', count: tickets.length, alert: openTickets },
  ];

  const th: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap', backgroundColor: '#fafafa' };
  const td: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid #f9fafb', fontSize: '13px', color: '#374151', verticalAlign: 'middle' };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, backgroundColor: '#0f1428', borderRadius: '8px', padding: '12px 20px', fontSize: '13px', color: '#fff', zIndex: 300, boxShadow: '0 8px 24px rgba(15,20,40,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#86efac' }} />{toast}
        </div>
      )}

      {/* HEADER */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <DayOfLogo />
          <div style={{ height: '18px', width: '1px', backgroundColor: '#e5e7eb' }} />
          <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Support Console</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {flaggedConvs.length > 0 && (
            <button onClick={() => { setActiveTab('conversations'); setSearch('flagged'); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', backgroundColor: '#fdecea', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '12px', color: '#c62828', cursor: 'pointer', fontWeight: 600 }}>
              ⚠ {flaggedConvs.length} flagged {flaggedConvs.length === 1 ? 'conversation' : 'conversations'}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f1428', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 600 }}>{user.name[0]}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f1428' }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'capitalize' }}>{user.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding: '6px 14px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', color: '#6b7280', cursor: 'pointer' }}>Sign out</button>
        </div>
      </header>

      {/* TABS */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setSearch(''); }} style={{ padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: activeTab === t.id ? '#0f1428' : '#9ca3af', borderBottom: activeTab === t.id ? '2px solid #0f1428' : '2px solid transparent', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            {t.label}
            <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '10px', backgroundColor: activeTab === t.id ? '#0f1428' : '#f3f4f6', color: activeTab === t.id ? '#fff' : '#9ca3af', fontWeight: 600 }}>{t.count}</span>
            {t.alert > 0 && <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '10px', backgroundColor: '#fdecea', color: '#c62828', fontWeight: 700 }}>{t.alert}</span>}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <main style={{ padding: '28px 32px' }}>
        {activeTab !== 'tickets' && (
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '16px' }}>⌕</span>
              <input style={{ paddingLeft: '36px', paddingRight: '14px', paddingTop: '9px', paddingBottom: '9px', width: '300px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', color: '#374151', outline: 'none' }} placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '13px' }}>Clear</button>}
            {activeTab === 'tickets' && <ActionBtn variant="primary" label="+ New Ticket" onClick={() => openNewTicket()} />}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'open', 'in_review', 'resolved'].map(s => (
                <button key={s} onClick={() => setSearch(s === 'all' ? '' : s)} style={{ padding: '6px 14px', backgroundColor: search === (s === 'all' ? '' : s) ? '#0f1428' : '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', color: search === (s === 'all' ? '' : s) ? '#fff' : '#6b7280', cursor: 'pointer', fontWeight: 500, textTransform: 'capitalize' }}>{s === 'all' ? 'All' : STATUS_MAP[s]?.label || s}</button>
              ))}
            </div>
            <ActionBtn variant="primary" label="+ New Ticket" onClick={() => openNewTicket()} />
          </div>
        )}

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          {/* USERS */}
          {activeTab === 'users' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['User ID', 'Name', 'Email', 'Role', 'Status', 'Joined', 'Txns'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(users, ['name', 'email', 'id']).map(u => (
                <tr key={u.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')} onClick={() => setSelectedUser(u)}>
                  <td style={td}><IdChip value={u.id.slice(0, 8) + '...'} /></td>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{u.name}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{u.email}</span></td>
                  <td style={td}><span style={{ fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{u.role}</span></td>
                  <td style={td}><Badge status={u.status} /></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{u.joined}</span></td>
                  <td style={td}>{u.transactions}</td>
                </tr>
              ))}</tbody>
            </table>
          )}

          {/* LISTINGS */}
          {activeTab === 'listings' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Listing ID', 'Title', 'Vendor', 'Category', 'Price', 'Status'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(listings, ['title', 'vendor', 'id']).map(l => (
                <tr key={l.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')} onClick={() => setSelectedListing(l)}>
                  <td style={td}><IdChip value={l.id} /></td>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{l.title}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{l.vendor}</span></td>
                  <td style={td}><span style={{ fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{l.category}</span></td>
                  <td style={td}><span style={{ fontWeight: 500 }}>${l.price.toLocaleString()}</span></td>
                  <td style={td}><Badge status={l.status} /></td>
                </tr>
              ))}</tbody>
            </table>
          )}

          {/* TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Txn ID', 'Stripe ID', 'Buyer', 'Seller', 'Amount', 'Status', 'Date'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(transactions, ['buyer', 'seller', 'id', 'stripe_id']).map(t => (
                <tr key={t.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')} onClick={() => setSelectedTransaction(t)}>
                  <td style={td}><IdChip value={t.id} /></td>
                  <td style={td}><IdChip value={t.stripe_id.slice(0, 20) + '...'} /></td>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{t.buyer}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{t.seller}</span></td>
                  <td style={td}><span style={{ fontWeight: 500 }}>${t.amount.toLocaleString()}</span></td>
                  <td style={td}><Badge status={t.status} /></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{t.date}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Review ID', 'Author', 'About', 'Rating', 'Preview', 'Date', ''].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(reviews, ['author', 'target', 'content', 'id']).map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')} onClick={() => setSelectedReview(r)}>
                  <td style={td}><IdChip value={r.id} /></td>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{r.author}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{r.target}</span></td>
                  <td style={td}><span style={{ color: r.rating >= 4 ? '#2e7d32' : r.rating >= 3 ? '#b45309' : '#c62828', letterSpacing: '1px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></td>
                  <td style={{ ...td, maxWidth: '220px' }}><span style={{ color: '#9ca3af', fontSize: '12px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.content}</span></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{r.date}</span></td>
                  <td style={td}>{r.flagged && <Badge status="flagged" />}</td>
                </tr>
              ))}</tbody>
            </table>
          )}

          {/* CONVERSATIONS */}
          {activeTab === 'conversations' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Conv ID', 'Participants', 'Listing', 'Messages', 'Last Activity', 'Keywords Detected', 'Status'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(conversations, ['id', 'participants', 'listing', 'status', 'flag_hits']).map(c => (
                <tr key={c.id} style={{ cursor: 'pointer', backgroundColor: c.status === 'flagged' ? '#fffbf5' : 'transparent' }} onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor = c.status === 'flagged' ? '#fffbf5' : 'transparent')} onClick={() => setSelectedConv(c)}>
                  <td style={td}><IdChip value={c.id.slice(0, 16) + '...'} /></td>
                  <td style={td}><div style={{ fontWeight: 500, color: '#0f1428', fontSize: '13px' }}>{c.participants[0]}</div><div style={{ color: '#9ca3af', fontSize: '12px' }}>{c.participants[1]}</div></td>
                  <td style={{ ...td, maxWidth: '160px' }}><span style={{ color: '#6b7280', fontSize: '12px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.listing}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{c.message_count}</span></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{new Date(c.last_message).toLocaleDateString()}</span></td>
                  <td style={td}>
                    {c.flag_hits.length > 0
                      ? <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{c.flag_hits.map((k: string) => <KeywordChip key={k} word={k} />)}</div>
                      : <span style={{ color: '#d1d5db', fontSize: '12px' }}>None</span>}
                  </td>
                  <td style={td}><Badge status={c.status} /></td>
                </tr>
              ))}</tbody>
            </table>
          )}

          {/* TICKETS */}
          {activeTab === 'tickets' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Ticket ID', 'Title', 'Priority', 'Status', 'Linked To', 'Assignee', 'Created'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(tickets, ['id', 'title', 'status', 'assignee', 'priority']).map(t => (
                <tr key={t.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')} onClick={() => setSelectedTicket(t)}>
                  <td style={td}><IdChip value={t.id} /></td>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{t.title}</span></td>
                  <td style={td}><PriorityDot priority={t.priority} /></td>
                  <td style={td}><Badge status={t.status} /></td>
                  <td style={td}>{t.linked ? <IdChip value={t.linked.label.slice(0, 20) + (t.linked.label.length > 20 ? '...' : '')} /> : <span style={{ color: '#d1d5db', fontSize: '12px' }}>None</span>}</td>
                  <td style={td}><span style={{ color: t.assignee ? '#374151' : '#d1d5db', fontSize: '12px' }}>{t.assignee || 'Unassigned'}</span></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{t.created}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </main>

      {/* ── MODALS ── */}

      {selectedUser && (
        <Modal title={selectedUser.name} subtitle={selectedUser.id} onClose={() => setSelectedUser(null)}>
          <DetailRow label="User ID" value={<IdChip value={selectedUser.id} />} />
          <DetailRow label="Tawk.to ID" value={<IdChip value={selectedUser.tawk_id} />} />
          <DetailRow label="Email" value={selectedUser.email} />
          <DetailRow label="Role" value={selectedUser.role} />
          <DetailRow label="Status" value={<Badge status={selectedUser.status} />} />
          <DetailRow label="Joined" value={selectedUser.joined} />
          <DetailRow label="Transactions" value={selectedUser.transactions} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
            <ActionBtn variant="primary" label="Edit Profile" onClick={() => showToast('Edit profile → Sharetribe API')} />
            <ActionBtn variant={selectedUser.status === 'suspended' ? 'success' : 'danger'} label={selectedUser.status === 'suspended' ? 'Unsuspend' : 'Suspend'} onClick={() => { const next = selectedUser.status === 'suspended' ? 'active' : 'suspended'; setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: next } : u)); setSelectedUser({ ...selectedUser, status: next }); showToast(`User ${next}.`); }} />
            <ActionBtn label="Open in Tawk.to" onClick={() => showToast('Opening Tawk.to → ' + selectedUser.tawk_id)} />
            <ActionBtn label="View Conversations" onClick={() => { setSelectedUser(null); setActiveTab('conversations'); setSearch(selectedUser.name); }} />
            <ActionBtn variant="warning" label="Open Ticket" onClick={() => { setSelectedUser(null); openNewTicket({ type: 'user', id: selectedUser.id, label: selectedUser.id }); }} />
          </div>
        </Modal>
      )}

      {selectedListing && (
        <Modal title={selectedListing.title} subtitle={selectedListing.id} onClose={() => setSelectedListing(null)}>
          <DetailRow label="Listing ID" value={<IdChip value={selectedListing.id} />} />
          <DetailRow label="Vendor ID" value={<IdChip value={selectedListing.vendor_id} />} />
          <DetailRow label="Vendor" value={selectedListing.vendor} />
          <DetailRow label="Category" value={selectedListing.category} />
          <DetailRow label="Price" value={`$${selectedListing.price.toLocaleString()}`} />
          <DetailRow label="Status" value={<Badge status={selectedListing.status} />} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
            <ActionBtn variant="primary" label="Edit Listing" onClick={() => showToast('Edit → Sharetribe API')} />
            <ActionBtn variant="success" label="Approve" onClick={() => { setListings(listings.map(l => l.id === selectedListing.id ? { ...l, status: 'active' } : l)); setSelectedListing({ ...selectedListing, status: 'active' }); showToast('Approved.'); }} />
            <ActionBtn variant={selectedListing.status === 'suspended' ? 'success' : 'danger'} label={selectedListing.status === 'suspended' ? 'Unsuspend' : 'Suspend'} onClick={() => { const next = selectedListing.status === 'suspended' ? 'active' : 'suspended'; setListings(listings.map(l => l.id === selectedListing.id ? { ...l, status: next } : l)); setSelectedListing({ ...selectedListing, status: next }); showToast(`Listing ${next}.`); }} />
            <ActionBtn variant="warning" label="Open Ticket" onClick={() => { setSelectedListing(null); openNewTicket({ type: 'listing', id: selectedListing.id, label: selectedListing.id }); }} />
          </div>
        </Modal>
      )}

      {selectedTransaction && (
        <Modal title={'Transaction · ' + selectedTransaction.id} subtitle={selectedTransaction.stripe_id} onClose={() => setSelectedTransaction(null)}>
          <DetailRow label="Transaction ID" value={<IdChip value={selectedTransaction.id} />} />
          <DetailRow label="Stripe Payment ID" value={<IdChip value={selectedTransaction.stripe_id} />} />
          <DetailRow label="Buyer" value={selectedTransaction.buyer} />
          <DetailRow label="Seller" value={selectedTransaction.seller} />
          <DetailRow label="Amount" value={`$${selectedTransaction.amount.toLocaleString()}`} />
          <DetailRow label="Status" value={<Badge status={selectedTransaction.status} />} />
          <DetailRow label="Date" value={selectedTransaction.date} />
          <DetailRow label="Dispute" value={selectedTransaction.disputed ? <Badge status="disputed" /> : 'None'} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
            <ActionBtn variant="primary" label="View in Stripe" onClick={() => showToast('Opening Stripe → ' + selectedTransaction.stripe_id)} />
            <ActionBtn variant="danger" label="Issue Refund" onClick={() => { setTransactions(transactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'refunded' } : t)); setSelectedTransaction({ ...selectedTransaction, status: 'refunded' }); showToast('Refund issued.'); }} />
            <ActionBtn variant="success" label="Resolve Dispute" onClick={() => { setTransactions(transactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'completed', disputed: false } : t)); setSelectedTransaction({ ...selectedTransaction, status: 'completed', disputed: false }); showToast('Dispute resolved.'); }} />
            <ActionBtn variant="warning" label="Open Ticket" onClick={() => { setSelectedTransaction(null); openNewTicket({ type: 'transaction', id: selectedTransaction.id, label: selectedTransaction.id }); }} />
          </div>
        </Modal>
      )}

      {selectedReview && (
        <Modal title={'Review by ' + selectedReview.author} subtitle={selectedReview.id} onClose={() => setSelectedReview(null)}>
          <DetailRow label="Review ID" value={<IdChip value={selectedReview.id} />} />
          <DetailRow label="Author ID" value={<IdChip value={selectedReview.author_id} />} />
          <DetailRow label="Target" value={selectedReview.target} />
          <DetailRow label="Rating" value={<span style={{ color: selectedReview.rating >= 4 ? '#2e7d32' : '#c62828' }}>{'★'.repeat(selectedReview.rating)}{'☆'.repeat(5 - selectedReview.rating)}</span>} />
          <DetailRow label="Flagged" value={selectedReview.flagged ? <Badge status="flagged" /> : 'No'} />
          <div style={{ margin: '16px 0', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', color: '#374151', lineHeight: 1.7, border: '1px solid #f3f4f6' }}>{selectedReview.content}</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ActionBtn variant={selectedReview.flagged ? 'default' : 'warning'} label={selectedReview.flagged ? 'Unflag' : 'Flag'} onClick={() => { setReviews(reviews.map(r => r.id === selectedReview.id ? { ...r, flagged: !r.flagged } : r)); setSelectedReview({ ...selectedReview, flagged: !selectedReview.flagged }); showToast('Updated.'); }} />
            <ActionBtn variant="danger" label="Remove" onClick={() => { setReviews(reviews.filter(r => r.id !== selectedReview.id)); setSelectedReview(null); showToast('Review removed.'); }} />
            <ActionBtn variant="warning" label="Open Ticket" onClick={() => { setSelectedReview(null); openNewTicket({ type: 'review', id: selectedReview.id, label: selectedReview.id }); }} />
          </div>
        </Modal>
      )}

      {selectedConv && (
        <Modal title={'Conversation'} subtitle={selectedConv.id} onClose={() => setSelectedConv(null)} wide>
          {selectedConv.status === 'flagged' && (
            <div style={{ backgroundColor: '#fdecea', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: '#c62828', fontSize: '16px' }}>⚠</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#c62828', marginBottom: '4px' }}>Off-platform solicitation detected</div>
                <div style={{ fontSize: '12px', color: '#c62828' }}>Keywords flagged: {selectedConv.flag_hits.map((k: string) => <KeywordChip key={k} word={k} />)}</div>
              </div>
            </div>
          )}
          <DetailRow label="Conv ID" value={<IdChip value={selectedConv.id} />} />
          <DetailRow label="Participants" value={selectedConv.participants.join(' + ')} />
          <DetailRow label="Listing" value={selectedConv.listing} />
          <DetailRow label="Listing ID" value={<IdChip value={selectedConv.listing_id} />} />
          <DetailRow label="Messages" value={selectedConv.message_count} />
          <DetailRow label="Last Activity" value={new Date(selectedConv.last_message).toLocaleString()} />
          <DetailRow label="Status" value={<Badge status={selectedConv.status} />} />
          <div style={{ margin: '16px 0', padding: '14px 16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Last Message Preview</div>
            <div style={{ fontSize: '13px', color: '#374151', fontStyle: 'italic' }}>"{selectedConv.last_snippet}"</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ActionBtn variant="primary" label="View Full Thread" onClick={() => showToast('Full thread → Sharetribe API')} />
            <ActionBtn label="Warn Participants" onClick={() => showToast('Warning sent to both parties.')} />
            <ActionBtn variant="danger" label="Suspend Vendor" onClick={() => showToast('Vendor suspended.')} />
            <ActionBtn variant="warning" label="Open Ticket" onClick={() => { setSelectedConv(null); openNewTicket({ type: 'conversation', id: selectedConv.id, label: selectedConv.id }); }} />
          </div>
        </Modal>
      )}

      {selectedTicket && (
        <Modal title={selectedTicket.title} subtitle={selectedTicket.id} onClose={() => setSelectedTicket(null)}>
          <DetailRow label="Ticket ID" value={<IdChip value={selectedTicket.id} />} />
          <DetailRow label="Priority" value={<PriorityDot priority={selectedTicket.priority} />} />
          <DetailRow label="Status" value={<Badge status={selectedTicket.status} />} />
          <DetailRow label="Assignee" value={selectedTicket.assignee || <span style={{ color: '#d1d5db' }}>Unassigned</span>} />
          <DetailRow label="Created" value={selectedTicket.created} />
          {selectedTicket.linked && <DetailRow label="Linked To" value={<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '11px', color: '#9ca3af', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>{selectedTicket.linked.type}</span><IdChip value={selectedTicket.linked.label} /></span>} />}
          {selectedTicket.notes && (
            <div style={{ margin: '16px 0', padding: '14px 16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes</div>
              <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{selectedTicket.notes}</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ActionBtn variant="primary" label="Claim (Assign to Me)" onClick={() => { setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, assignee: user.name } : t)); setSelectedTicket({ ...selectedTicket, assignee: user.name }); showToast('Ticket claimed.'); }} />
            {selectedTicket.status !== 'in_review' && <ActionBtn label="Mark In Review" onClick={() => { setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'in_review' } : t)); setSelectedTicket({ ...selectedTicket, status: 'in_review' }); showToast('Status updated.'); }} />}
            {selectedTicket.status !== 'resolved' && <ActionBtn variant="success" label="Resolve" onClick={() => { setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'resolved' } : t)); setSelectedTicket({ ...selectedTicket, status: 'resolved' }); showToast('Ticket resolved.'); }} />}
            <ActionBtn variant="danger" label="Close Ticket" onClick={() => { setTickets(tickets.filter(t => t.id !== selectedTicket.id)); setSelectedTicket(null); showToast('Ticket closed.'); }} />
          </div>
        </Modal>
      )}

      {/* NEW TICKET MODAL */}
      {showNewTicket && (
        <Modal title="New Support Ticket" onClose={() => setShowNewTicket(false)}>
          {newTicketLinkedTo && (
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Linked to</span>
              <span style={{ fontSize: '11px', color: '#9ca3af', backgroundColor: '#fff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', textTransform: 'capitalize' }}>{newTicketLinkedTo.type}</span>
              <IdChip value={newTicketLinkedTo.label} />
            </div>
          )}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Title</label>
            <input value={ntTitle} onChange={e => setNtTitle(e.target.value)} placeholder="Brief description of the issue" style={{ width: '100%', padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', color: '#0f1428', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Priority</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['high', 'medium', 'low'].map(p => (
                <button key={p} onClick={() => setNtPriority(p)} style={{ padding: '7px 18px', border: `1px solid ${ntPriority === p ? PRIORITY_MAP[p].color : '#e5e7eb'}`, borderRadius: '8px', backgroundColor: ntPriority === p ? PRIORITY_MAP[p].color + '18' : '#fff', color: ntPriority === p ? PRIORITY_MAP[p].color : '#6b7280', fontSize: '13px', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Notes</label>
            <textarea value={ntNotes} onChange={e => setNtNotes(e.target.value)} rows={4} placeholder="Context, what happened, what action is needed..." style={{ width: '100%', padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', color: '#374151', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <ActionBtn variant="primary" label="Create Ticket" onClick={createTicket} />
            <ActionBtn label="Cancel" onClick={() => setShowNewTicket(false)} />
          </div>
        </Modal>
      )}

      <footer style={{ backgroundColor: '#0f1428', padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '40px' }}>
        <DayOfLogo white />
        <span style={{ color: '#4b5563', fontSize: '12px' }}>Support Console · Internal Use Only</span>
      </footer>
    </div>
  );
}