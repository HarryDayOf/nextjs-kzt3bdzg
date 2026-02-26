/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo, useRef } from 'react';
import { Logo, Btn, GlobalSearchResults, NAVY } from './ui';
import { DashboardTab } from './DashboardTab';
import { TableTab } from './TableTab';
import { UserModal, ListingModal, TransactionModal, ReviewModal, ConversationModal, SendMessageModal } from './modals/EntityModals';
import { ReportsModal, AuditLogModal, ConsoleUsersModal, AlertsConfigModal } from './modals/SystemModals';
import {
  MOCK_USERS, MOCK_LISTINGS, MOCK_TRANSACTIONS, MOCK_REVIEWS,
  MOCK_CONVERSATIONS, MOCK_NOTES, MOCK_AUDIT, MOCK_ALERT_CONFIGS, MOCK_CONSOLE_USERS,
} from '../../lib/mockData';
import { downloadCSV, printTable, type Role, type Note, type AuditEntry, type KWCategory } from '../../lib/types';

// ─── FILTER + SORT ENGINE ─────────────────────────────────────────────────────
function applyFiltersAndSort(items: any[], search: string, fields: string[], filters: any, sort: string): any[] {
  let out = search ? items.filter(i => fields.some(f => String(i[f] ?? '').toLowerCase().includes(search.toLowerCase()))) : items;
  const f = filters;
  if (f.role) out = out.filter(i => i.role === f.role);
  if (f.status) out = out.filter(i => i.status === f.status);
  if (f.tier) out = out.filter(i => i.tier === f.tier);
  if (f.joined_after) out = out.filter(i => i.joined >= f.joined_after);
  if (f.joined_before) out = out.filter(i => i.joined <= f.joined_before);
  if (f.min_txns) out = out.filter(i => i.transactions >= Number(f.min_txns));
  if (f.min_flags) out = out.filter(i => (i.repeatFlags ?? 0) >= Number(f.min_flags));
  if (f.category) out = out.filter(i => i.category === f.category);
  if (f.min_price) out = out.filter(i => i.price >= Number(f.min_price));
  if (f.max_price) out = out.filter(i => i.price <= Number(f.max_price));
  if (f.min_views) out = out.filter(i => (i.views ?? 0) >= Number(f.min_views));
  if (f.disputed === 'yes') out = out.filter(i => i.disputed);
  if (f.disputed === 'no') out = out.filter(i => !i.disputed);
  if (f.date_after) out = out.filter(i => (i.date || i.last_message || '') >= f.date_after);
  if (f.date_before) out = out.filter(i => (i.date || i.last_message || '') <= f.date_before);
  if (f.min_amount) out = out.filter(i => i.amount >= Number(f.min_amount));
  if (f.max_amount) out = out.filter(i => i.amount <= Number(f.max_amount));
  if (f.seller) out = out.filter(i => i.seller?.toLowerCase().includes(f.seller.toLowerCase()));
  if (f.buyer) out = out.filter(i => i.buyer?.toLowerCase().includes(f.buyer.toLowerCase()));
  if (f.flagged === 'yes') out = out.filter(i => i.flagged);
  if (f.flagged === 'no') out = out.filter(i => !i.flagged);
  if (f.min_rating) out = out.filter(i => i.rating >= Number(f.min_rating));
  if (f.max_rating) out = out.filter(i => i.rating <= Number(f.max_rating));
  if (f.reviewed === 'yes') out = out.filter(i => i.reviewed);
  if (f.reviewed === 'no') out = out.filter(i => !i.reviewed);
  if (f.kw_category) out = out.filter(i => i.messages?.some((m: any) => {
    const lower = m.text.toLowerCase();
    const kwCat = f.kw_category as KWCategory;
    const kwWords = { payment: ['venmo','zelle','cashapp','paypal','wire transfer','crypto','bitcoin'], contact: ['text me','call me','whatsapp','instagram dm','facebook','@gmail','@yahoo'], offplatform: ['off the app','off platform','my website','direct booking','book directly','bypass','avoid fees'] };
    return kwWords[kwCat]?.some((w: string) => lower.includes(w));
  }));
  if (sort) {
    const desc = sort.startsWith('-');
    const key = desc ? sort.slice(1) : sort;
    out = [...out].sort((a, b) => {
      const av = a[key] ?? ''; const bv = b[key] ?? '';
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return desc ? -cmp : cmp;
    });
  }
  return out;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SupportConsole({ user }: { user: any }) {
  // — auth
  const currentRole: Role = user.role ?? 'cs';

  // — navigation
  const [tab, setTab] = useState('dashboard');
  const [tabSearch, setTabSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [sort, setSort] = useState('');
  const [convFilter, setConvFilter] = useState('all');

  // — global search
  const [globalSearch, setGlobalSearch] = useState('');
  const [gsOpen, setGsOpen] = useState(false);
  const gsRef = useRef<HTMLDivElement>(null);

  // — data state
  const [users, setUsers] = useState<any[]>(MOCK_USERS);
  const [listings, setListings] = useState<any[]>(MOCK_LISTINGS);
  const [transactions, setTransactions] = useState<any[]>(MOCK_TRANSACTIONS);
  const [reviews, setReviews] = useState<any[]>(MOCK_REVIEWS);
  const [convs, setConvs] = useState<any[]>(MOCK_CONVERSATIONS);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [audit, setAudit] = useState<AuditEntry[]>(MOCK_AUDIT);
  const [alertConfigs, setAlertConfigs] = useState<any[]>(MOCK_ALERT_CONFIGS);
  const [consoleUsers, setConsoleUsers] = useState<any[]>(MOCK_CONSOLE_USERS);

  // — selected entity modals
  const [selU, setSelU] = useState<any>(null);
  const [selL, setSelL] = useState<any>(null);
  const [selT, setSelT] = useState<any>(null);
  const [selR, setSelR] = useState<any>(null);
  const [selC, setSelC] = useState<any>(null);
  const [msgTarget, setMsgTarget] = useState<any>(null);

  // — system modals
  const [showReports, setShowReports] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [showConsoleUsers, setShowConsoleUsers] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  // — toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3200); };

  // — audit logging
  const addAudit = (action: string, entity_type: string, entity_id: string, entity_label: string, detail: string) => {
    const entry: AuditEntry = { id: `aud_${Date.now()}`, actor: user.name, actor_role: currentRole, action, entity_type, entity_id, entity_label, detail, ts: new Date().toISOString() };
    setAudit(prev => [entry, ...prev]);
  };

  // — note adding
  const addNote = (entityType: string, entityId: string, entityLabel: string, text: string) => {
    const note: Note = { id: `note_${Date.now()}`, entity_type: entityType, entity_id: entityId, author: user.name, author_role: currentRole, text, ts: new Date().toISOString() };
    setNotes(prev => [...prev, note]);
    addAudit('Added note', entityType, entityId, entityLabel, 'Internal note added');
    toast('Note saved.');
  };

  // — navigation helper
  const changeTab = (t: string, search?: string) => { setTab(t); setTabSearch(search ?? ''); setFilters({}); setSort(''); setConvFilter('all'); };
  const handleSort = (k: string) => setSort(k);

  // ─── FILTERED DATA ──────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => applyFiltersAndSort(users, tabSearch, ['name', 'email', 'id'], filters, sort), [users, tabSearch, filters, sort]);
  const filteredListings = useMemo(() => applyFiltersAndSort(listings, tabSearch, ['title', 'vendor', 'id'], filters, sort), [listings, tabSearch, filters, sort]);
  const filteredTransactions = useMemo(() => applyFiltersAndSort(transactions, tabSearch, ['buyer', 'seller', 'id', 'stripe_id'], filters, sort), [transactions, tabSearch, filters, sort]);
  const filteredReviews = useMemo(() => applyFiltersAndSort(reviews, tabSearch, ['author', 'target', 'content', 'id'], filters, sort), [reviews, tabSearch, filters, sort]);
  const filteredConvs = useMemo(() => {
    let base = convs;
    if (convFilter === 'flagged') base = base.filter(c => c.status === 'flagged');
    else if (convFilter === 'clean') base = base.filter(c => c.status === 'clean');
    else if (convFilter === 'unreviewed') base = base.filter(c => c.status === 'flagged' && !c.reviewed);
    return applyFiltersAndSort(base, tabSearch, ['id'], filters, sort);
  }, [convs, convFilter, tabSearch, filters, sort]);

  const unrev = convs.filter(c => c.status === 'flagged' && !c.reviewed).length;
  const activeData = { users, listings, transactions, reviews, conversations: convs, alerts: alertConfigs };

  // ─── CURRENT TABLE ITEMS ────────────────────────────────────────────────────
  const currentItems: Record<string, any[]> = { users: filteredUsers, listings: filteredListings, transactions: filteredTransactions, reviews: filteredReviews, conversations: filteredConvs };

  // ─── CSV / PRINT ────────────────────────────────────────────────────────────
  const doExportCSV = () => {
    const maps: Record<string, () => any[]> = {
      users: () => filteredUsers.map(u => ({ ID: u.id, Name: u.name, Email: u.email, Role: u.role, Status: u.status, Tier: u.tier, Joined: u.joined, Transactions: u.transactions, RepeatFlags: u.repeatFlags })),
      listings: () => filteredListings.map(l => ({ ID: l.id, Title: l.title, Vendor: l.vendor, Category: l.category, Price: l.price, Status: l.status, Views: l.views, Bookings: l.bookings })),
      transactions: () => filteredTransactions.map(t => ({ ID: t.id, StripeID: t.stripe_id, Buyer: t.buyer, Seller: t.seller, Amount: t.amount, Status: t.status, Date: t.date, Disputed: t.disputed ? 'Yes' : 'No' })),
      reviews: () => filteredReviews.map(r => ({ ID: r.id, Author: r.author, Target: r.target, Rating: r.rating, Content: r.content, Date: r.date, Flagged: r.flagged ? 'Yes' : 'No' })),
      conversations: () => filteredConvs.map(c => ({ ID: c.id, P1: c.participants[0], P2: c.participants[1], Listing: c.listing, Status: c.status, Reviewed: c.reviewed ? 'Yes' : 'No' })),
    };
    if (maps[tab]) downloadCSV(maps[tab](), `dayof-${tab}.csv`);
  };
  const doPrint = () => {
    const maps: Record<string, [any[], { key: string; label: string }[]]> = {
      users: [filteredUsers, [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' }]],
      listings: [filteredListings, [{ key: 'title', label: 'Title' }, { key: 'vendor', label: 'Vendor' }, { key: 'price', label: 'Price' }, { key: 'status', label: 'Status' }]],
      transactions: [filteredTransactions, [{ key: 'buyer', label: 'Buyer' }, { key: 'seller', label: 'Seller' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }, { key: 'date', label: 'Date' }]],
      reviews: [filteredReviews, [{ key: 'author', label: 'Author' }, { key: 'target', label: 'Target' }, { key: 'rating', label: 'Rating' }, { key: 'content', label: 'Content' }, { key: 'date', label: 'Date' }]],
      conversations: [filteredConvs, [{ key: 'id', label: 'ID' }, { key: 'participants', label: 'Participants' }, { key: 'listing', label: 'Listing' }, { key: 'status', label: 'Status' }]],
    };
    if (maps[tab]) printTable(`Day Of — ${tab}`, maps[tab][0] as any[], maps[tab][1] as any[]);
  };

  // ─── ENTITY ACTIONS ─────────────────────────────────────────────────────────
  const handleUserAction = (action: string, payload: any) => {
    if (action === 'toggleSuspend') {
      const newStatus = payload.status === 'suspended' ? 'active' : 'suspended';
      setUsers(us => us.map(u => u.id === payload.id ? { ...u, status: newStatus } : u));
      if (selU?.id === payload.id) setSelU((u: any) => ({ ...u, status: newStatus }));
      addAudit(newStatus === 'suspended' ? 'Suspended user' : 'Unsuspended user', 'user', payload.id, payload.name, `Status: ${payload.status} → ${newStatus}`);
      toast(`User ${newStatus}.`);
    } else if (action === 'probation') {
      setUsers(us => us.map(u => u.id === payload.id ? { ...u, status: 'probation', tier: 'probation' } : u));
      if (selU?.id === payload.id) setSelU((u: any) => ({ ...u, status: 'probation', tier: 'probation' }));
      addAudit('Set probation', 'user', payload.id, payload.name, 'Status set to probation');
      toast('User set to probation.');
    } else if (action === 'setTier') {
      setUsers(us => us.map(u => u.id === payload.id ? { ...u, tier: payload.tier } : u));
      if (selU?.id === payload.id) setSelU((u: any) => ({ ...u, tier: payload.tier }));
      addAudit('Updated vendor tier', 'user', payload.id, 'Vendor', `Tier → ${payload.tier}`);
      toast(`Tier set to ${payload.tier}.`);
    } else if (action === 'addNote') {
      addNote(payload.entityType, payload.entityId, selU?.name ?? '', payload.text);
    } else if (action === 'viewConvs') {
      setSelU(null); changeTab('conversations', payload.name);
    } else if (action === 'message') {
      setMsgTarget(payload);
    } else if (action === 'tawk') {
      toast(`Opening Tawk.to → ${payload.tawk_id}`);
    } else if (action === 'edit') {
      toast('Edit → Sharetribe API (Abhi)');
    }
  };

  const handleListingAction = (action: string, payload: any) => {
    if (action === 'toggleSuspend') {
      const newStatus = payload.status === 'suspended' ? 'active' : 'suspended';
      setListings(ls => ls.map(l => l.id === payload.id ? { ...l, status: newStatus } : l));
      if (selL?.id === payload.id) setSelL((l: any) => ({ ...l, status: newStatus }));
      addAudit(newStatus === 'suspended' ? 'Suspended listing' : 'Unsuspended listing', 'listing', payload.id, payload.title, `Status → ${newStatus}`);
      toast(`Listing ${newStatus}.`);
    } else if (action === 'approve') {
      setListings(ls => ls.map(l => l.id === payload.id ? { ...l, status: 'active' } : l));
      if (selL?.id === payload.id) setSelL((l: any) => ({ ...l, status: 'active' }));
      addAudit('Approved listing', 'listing', payload.id, payload.title, 'Status → active');
      toast('Listing approved.');
    } else if (action === 'addNote') {
      addNote(payload.entityType, payload.entityId, selL?.title ?? '', payload.text);
    } else if (action === 'suppress') {
      toast('Listing suppressed from search.');
      addAudit('Suppressed listing', 'listing', payload.id, payload.title, 'Removed from search results');
    } else if (action === 'edit') {
      toast('Edit → Sharetribe API (Abhi)');
    }
  };

  const handleTxnAction = (action: string, payload: any) => {
    if (action === 'refund') {
      setTransactions(ts => ts.map(t => t.id === payload.id ? { ...t, status: 'refunded', disputed: false } : t));
      if (selT?.id === payload.id) setSelT((t: any) => ({ ...t, status: 'refunded', disputed: false }));
      addAudit('Issued refund', 'transaction', payload.id, payload.id.slice(0, 14), `Full refund — $${payload.amount}`);
      toast('Refund issued.');
    } else if (action === 'partialRefund') {
      toast('Partial refund modal → Stripe API (Abhi)');
    } else if (action === 'resolveDispute') {
      setTransactions(ts => ts.map(t => t.id === payload.id ? { ...t, status: 'completed', disputed: false } : t));
      if (selT?.id === payload.id) setSelT((t: any) => ({ ...t, status: 'completed', disputed: false }));
      addAudit('Resolved dispute', 'transaction', payload.id, payload.id.slice(0, 14), 'Dispute resolved — favor vendor');
      toast('Dispute resolved.');
    } else if (action === 'holdPayout') {
      toast('Payout held → Stripe API (Abhi)');
      addAudit('Held payout', 'transaction', payload.id, payload.id.slice(0, 14), 'Payout hold placed');
    } else if (action === 'stripe') {
      toast(`Opening Stripe → ${payload.stripe_id}`);
    } else if (action === 'addNote') {
      addNote(payload.entityType, payload.entityId, payload.entityId.slice(0, 14), payload.text);
    }
  };

  const handleReviewAction = (action: string, payload: any) => {
    if (action === 'toggleFlag') {
      setReviews(rs => rs.map(r => r.id === payload.id ? { ...r, flagged: !r.flagged } : r));
      if (selR?.id === payload.id) setSelR((r: any) => ({ ...r, flagged: !r.flagged }));
      addAudit(payload.flagged ? 'Unflagged review' : 'Flagged review', 'review', payload.id, `Review by ${payload.author}`, '');
      toast('Updated.');
    } else if (action === 'delete') {
      setReviews(rs => rs.filter(r => r.id !== payload.id));
      setSelR(null);
      addAudit('Removed review', 'review', payload.id, `Review by ${payload.author}`, 'Review deleted from platform');
      toast('Review removed.');
    } else if (action === 'addNote') {
      addNote(payload.entityType, payload.entityId, `Review by ${selR?.author}`, payload.text);
    } else if (action === 'viewAuthor') {
      setSelR(null); changeTab('users'); setTabSearch(payload.author);
    }
  };

  const handleConvAction = (action: string, payload: any) => {
    if (action === 'markReviewed') {
      setConvs(cs => cs.map(c => c.id === payload.id ? { ...c, reviewed: true } : c));
      setSelC(null);
      addAudit('Marked conversation reviewed', 'conversation', payload.id, payload.id.slice(0, 14), 'Flagged conversation marked as reviewed');
      toast('Marked as reviewed.');
    } else if (action === 'suspendVendor') {
      toast('Vendor suspended from conversation view.');
    } else if (action === 'policyWarning') {
      toast('Policy warning sent to vendor.');
      addAudit('Sent policy warning', 'conversation', payload.id, payload.id.slice(0, 14), 'Policy violation warning sent to vendor');
    } else if (action === 'viewVendor') {
      setSelC(null); changeTab('users'); setTabSearch(payload.participants[1]);
    } else if (action === 'viewTransaction') {
      setSelC(null); changeTab('transactions'); setTabSearch(payload.txn_id);
    } else if (action === 'addNote') {
      addNote(payload.entityType, payload.entityId, payload.entityId.slice(0, 14), payload.text);
    }
  };

  // ─── CONSOLE USER ACTIONS ───────────────────────────────────────────────────
  const handleConsoleUserAction = (action: string, payload: any) => {
    if (action === 'changeRole') {
      setConsoleUsers(us => us.map(u => u.id === payload.id ? { ...u, role: payload.role } : u));
      addAudit('Changed console role', 'user', payload.id, payload.id, `Role → ${payload.role}`);
      toast('Role updated.');
    } else if (action === 'revoke') {
      setConsoleUsers(us => us.filter(u => u.id !== payload.id));
      addAudit('Revoked console access', 'user', payload.id, payload.name, 'Console access revoked');
      toast('Access revoked.');
    } else if (action === 'add') {
      const newUser = { id: `cu_${Date.now()}`, name: payload.name, email: payload.email, role: payload.role, active: true, joined: new Date().toISOString().slice(0, 10), lastLogin: '—' };
      setConsoleUsers(us => [...us, newUser]);
      addAudit('Added console user', 'user', newUser.id, payload.name, `Added with role: ${payload.role}`);
      toast('Console user added.');
    }
  };

  // ─── TABS CONFIG ────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '⬛', alert: 0 },
    { id: 'users', label: 'Users', icon: '👤', count: users.length, alert: 0 },
    { id: 'listings', label: 'Listings', icon: '📋', count: listings.length, alert: 0 },
    { id: 'transactions', label: 'Transactions', icon: '💳', count: transactions.length, alert: 0 },
    { id: 'reviews', label: 'Reviews', icon: '★', count: reviews.length, alert: 0 },
    { id: 'conversations', label: 'Conversations', icon: '💬', count: convs.length, alert: unrev },
  ];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", backgroundColor: '#f4f5f7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* TOAST */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, backgroundColor: NAVY, borderRadius: '8px', padding: '12px 20px', fontSize: '13px', color: '#fff', zIndex: 300, boxShadow: '0 8px 24px rgba(15,20,40,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#86efac' }} />{toastMsg}
        </div>
      )}

      {/* HEADER */}
      <header style={{ backgroundColor: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Logo white />
          <div style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Support Console</span>
        </div>

        {/* GLOBAL SEARCH */}
        <div style={{ flex: 1, maxWidth: '440px', margin: '0 32px', position: 'relative' }} ref={gsRef}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>⌕</span>
          <input
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '14px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
            placeholder="Search everything..."
            value={globalSearch}
            onChange={e => { setGlobalSearch(e.target.value); setGsOpen(true); }}
            onFocus={() => setGsOpen(true)}
            onBlur={() => setTimeout(() => setGsOpen(false), 200)}
          />
          {gsOpen && globalSearch && (
            <GlobalSearchResults query={globalSearch} data={activeData} onNavigate={(t, item) => {
              changeTab(t); setGsOpen(false); setGlobalSearch('');
              const setters: Record<string, (v: any) => void> = { users: setSelU, listings: setSelL, transactions: setSelT, reviews: setSelR, conversations: setSelC };
              setters[t]?.(item);
            }} />
          )}
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {unrev > 0 && (
            <button onClick={() => { changeTab('conversations'); setConvFilter('unreviewed'); }} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 11px', backgroundColor: '#c62828', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
              ⚠ {unrev}
            </button>
          )}
          <button onClick={() => setShowReports(true)} style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px', color: '#fff', cursor: 'pointer' }}>📊 Reports</button>
          <button onClick={() => setShowAudit(true)} style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px', color: '#fff', cursor: 'pointer' }}>📋 Audit</button>
          {currentRole === 'admin' && (
            <>
              <button onClick={() => setShowConsoleUsers(true)} style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px', color: '#fff', cursor: 'pointer' }}>👥 Team</button>
              <button onClick={() => setShowAlerts(true)} style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px', color: '#fff', cursor: 'pointer' }}>🔔 Alerts</button>
            </>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 600 }}>{user.name[0]}</div>
            <div style={{ display: 'none' }}><div style={{ fontSize: '12px', fontWeight: 500, color: '#fff' }}>{user.name}</div></div>
          </div>
          <a href="/" style={{ padding: '5px 10px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>← Roles</a>
        </div>
      </header>

      {/* TAB NAV */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 28px', display: 'flex', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => changeTab(t.id)} style={{ padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: tab === t.id ? NAVY : '#9ca3af', borderBottom: tab === t.id ? `2px solid ${NAVY}` : '2px solid transparent', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '12px' }}>{t.icon}</span>
            {t.label}
            {'count' in t && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: tab === t.id ? NAVY : '#f3f4f6', color: tab === t.id ? '#fff' : '#9ca3af', fontWeight: 600 }}>{t.count}</span>}
            {t.alert > 0 && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: '#fdecea', color: '#c62828', fontWeight: 700 }}>{t.alert}</span>}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1 }}>
        {tab === 'dashboard' ? (
          <DashboardTab data={activeData} onNavigate={changeTab} role={currentRole} />
        ) : (
          <div style={{ padding: '0' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', margin: '24px 28px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <TableTab
                tab={tab}
                items={currentItems[tab] ?? []}
                sort={sort}
                filters={filters}
                setFilters={f => { setFilters(f); }}
                onSort={handleSort}
                onSelect={item => {
                  if (tab === 'users') setSelU(item);
                  else if (tab === 'listings') setSelL(item);
                  else if (tab === 'transactions') setSelT(item);
                  else if (tab === 'reviews') setSelR(item);
                  else if (tab === 'conversations') setSelC(item);
                }}
                onExportCSV={doExportCSV}
                onPrint={doPrint}
                tabSearch={tabSearch}
                setTabSearch={setTabSearch}
                convFilter={convFilter}
                setConvFilter={setConvFilter}
                allConvs={convs}
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: NAVY, padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo white />
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>Support Console · Internal Use Only</span>
      </footer>

      {/* ENTITY MODALS */}
      {selU && <UserModal user={selU} notes={notes} onClose={() => setSelU(null)} onAction={handleUserAction} onAddNote={() => {}} currentUser={user} />}
      {selL && <ListingModal listing={selL} notes={notes} onClose={() => setSelL(null)} onAction={handleListingAction} onAddNote={() => {}} currentUser={user} />}
      {selT && <TransactionModal txn={selT} notes={notes} onClose={() => setSelT(null)} onAction={handleTxnAction} currentUser={user} />}
      {selR && <ReviewModal review={selR} notes={notes} onClose={() => setSelR(null)} onAction={handleReviewAction} currentUser={user} />}
      {selC && <ConversationModal conv={selC} notes={notes} onClose={() => setSelC(null)} onAction={handleConvAction} currentUser={user} />}
      {msgTarget && <SendMessageModal user={msgTarget} onClose={() => setMsgTarget(null)} onSend={(msg: any) => { toast(`Message sent via ${msg.channel}.`); addAudit('Sent message', 'user', msgTarget.id, msgTarget.name, `Sent via ${msg.channel}`); }} />}

      {/* SYSTEM MODALS */}
      {showReports && <ReportsModal data={activeData} onClose={() => setShowReports(false)} />}
      {showAudit && <AuditLogModal audit={audit} onClose={() => setShowAudit(false)} />}
      {showConsoleUsers && <ConsoleUsersModal consoleUsers={consoleUsers} onClose={() => setShowConsoleUsers(false)} onAction={handleConsoleUserAction} />}
      {showAlerts && <AlertsConfigModal alertConfigs={alertConfigs} onClose={() => setShowAlerts(false)} onUpdate={(a: any) => setAlertConfigs(cs => cs.map(c => c.id === a.id ? a : c))} />}
    </div>
  );
}
