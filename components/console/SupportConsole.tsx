/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Logo, Btn, GlobalSearchResults, TabIcon, NAVY } from './ui';
import { DashboardTab } from './DashboardTab';
import { TableTab } from './TableTab';
import { DocumentsTab } from './DocumentsTab';
import { UserModal, ListingModal, TransactionModal, ReviewModal, ConversationModal, SendMessageModal } from './modals/EntityModals';
import { ReportsModal, AuditLogModal, ConsoleUsersModal, AlertsConfigModal } from './modals/SystemModals';
import {
  MOCK_USERS, MOCK_LISTINGS, MOCK_TRANSACTIONS, MOCK_REVIEWS,
  MOCK_CONVERSATIONS, MOCK_NOTES, MOCK_AUDIT, MOCK_ALERT_CONFIGS, MOCK_CONSOLE_USERS,
} from '../../lib/mockData';
import { downloadCSV, printTable, mkC, type Role, type Note, type AuditEntry, type KWCategory } from '../../lib/types';

// ─── FILTER + SORT ENGINE ─────────────────────────────────────────────────────
function applyFiltersAndSort(items: any[], search: string, fields: string[], filters: any, sort: string): any[] {
  let out = search ? items.filter(i => fields.some(f => String(i[f] ?? '').toLowerCase().includes(search.toLowerCase()))) : items;
  const f = filters;
  if (f.role) out = out.filter(i => i.role === f.role);
  if (f.status) out = out.filter(i => i.status === f.status);
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

// ─── PAGINATION CONSTANT ──────────────────────────────────────────────────────
const PAGE_SIZE = 50;

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

  // — pagination
  const [page, setPage] = useState(1);

  // — debounced search (fires 300 ms after user stops typing)
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(tabSearch); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [tabSearch]);

  // — dark mode (persisted in localStorage for overnight CS agents)
  const [darkMode, setDarkMode] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('dayof-dark') !== '0' : true);
  useEffect(() => { localStorage.setItem('dayof-dark', darkMode ? '1' : '0'); }, [darkMode]);
  const C = mkC(darkMode);

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

  // — navigation helper (resets pagination on every tab/filter change)
  const changeTab = (t: string, search?: string) => { setTab(t); setTabSearch(search ?? ''); setFilters({}); setSort(''); setConvFilter('all'); setPage(1); };
  const handleSort = (k: string) => { setSort(k); setPage(1); };

  // ─── FILTERED DATA ──────────────────────────────────────────────────────────
  // All filtering uses debouncedSearch so the engine isn't hammered on every keystroke
  const filteredUsers = useMemo(() => applyFiltersAndSort(users, debouncedSearch, ['name', 'email', 'id'], filters, sort), [users, debouncedSearch, filters, sort]);
  const filteredListings = useMemo(() => applyFiltersAndSort(listings, debouncedSearch, ['title', 'vendor', 'id'], filters, sort), [listings, debouncedSearch, filters, sort]);
  const filteredTransactions = useMemo(() => applyFiltersAndSort(transactions, debouncedSearch, ['buyer', 'seller', 'id', 'stripe_id'], filters, sort), [transactions, debouncedSearch, filters, sort]);
  const filteredReviews = useMemo(() => applyFiltersAndSort(reviews, debouncedSearch, ['author', 'target', 'content', 'id'], filters, sort), [reviews, debouncedSearch, filters, sort]);
  const filteredConvs = useMemo(() => {
    let base = convs;
    if (convFilter === 'flagged') base = base.filter(c => c.status === 'flagged');
    else if (convFilter === 'clean') base = base.filter(c => c.status === 'clean');
    else if (convFilter === 'unreviewed') base = base.filter(c => c.status === 'flagged' && !c.reviewed);
    return applyFiltersAndSort(base, debouncedSearch, ['id'], filters, sort);
  }, [convs, convFilter, debouncedSearch, filters, sort]);

  const unrev = convs.filter(c => c.status === 'flagged' && !c.reviewed).length;
  const activeData = { users, listings, transactions, reviews, conversations: convs, alerts: alertConfigs };

  // ─── CURRENT TABLE ITEMS ────────────────────────────────────────────────────
  // Full filtered + sorted arrays (needed for CSV/print and total count)
  const currentItems: Record<string, any[]> = { users: filteredUsers, listings: filteredListings, transactions: filteredTransactions, reviews: filteredReviews, conversations: filteredConvs };

  // ─── PAGINATED SLICE ─────────────────────────────────────────────────────────
  // Only the current page of rows is rendered — keeps DOM lean at 100k+ records
  const pagedItems = useMemo(() => {
    const all = currentItems[tab] ?? [];
    const start = (page - 1) * PAGE_SIZE;
    return all.slice(start, start + PAGE_SIZE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, filteredUsers, filteredListings, filteredTransactions, filteredReviews, filteredConvs, page]);

  // ─── CSV / PRINT ────────────────────────────────────────────────────────────
  const doExportCSV = () => {
    const maps: Record<string, () => any[]> = {
      users: () => filteredUsers.map(u => ({ ID: u.id, Name: u.name, Email: u.email, Role: u.role, Status: u.status, Joined: u.joined, Transactions: u.transactions, RepeatFlags: u.repeatFlags })),
      listings: () => filteredListings.map(l => ({ ID: l.id, Title: l.title, Vendor: l.vendor, Category: l.category, Price: l.price, Status: l.status })),
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
      setUsers(us => us.map(u => u.id === payload.id ? { ...u, status: 'probation' } : u));
      if (selU?.id === payload.id) setSelU((u: any) => ({ ...u, status: 'probation' }));
      addAudit('Set probation', 'user', payload.id, payload.name, 'Status set to probation');
      toast('User set to probation.');
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
    } else if (action === 'approveDoc') {
      const upd = (l: any) => l.id === payload.listingId
        ? { ...l, documents: l.documents?.map((d: any) => d.id === payload.docId ? { ...d, status: 'approved', reviewedBy: user.name, reviewedAt: new Date().toISOString() } : d) }
        : l;
      setListings(ls => ls.map(upd));
      if (selL?.id === payload.listingId) setSelL((l: any) => upd(l));
      addAudit('Approved document', 'listing', payload.listingId, payload.title, `Document approved: ${payload.docLabel}`);
      toast('Document approved.');
    } else if (action === 'rejectDoc') {
      const upd = (l: any) => l.id === payload.listingId
        ? { ...l, documents: l.documents?.map((d: any) => d.id === payload.docId ? { ...d, status: 'rejected', reviewedBy: user.name, reviewedAt: new Date().toISOString() } : d) }
        : l;
      setListings(ls => ls.map(upd));
      if (selL?.id === payload.listingId) setSelL((l: any) => upd(l));
      addAudit('Rejected document', 'listing', payload.listingId, payload.title, `Document rejected: ${payload.docLabel}`);
      toast('Document rejected.');
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
  const pendingDocCount = listings.reduce((sum: number, l: any) => sum + ((l.documents ?? []).filter((d: any) => d.status === 'pending').length), 0);
  const totalDocCount = listings.reduce((sum: number, l: any) => sum + ((l.documents ?? []).length), 0);
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', alert: 0 },
    { id: 'documents', label: 'Documents', alert: pendingDocCount },
    { id: 'users', label: 'Users', alert: 0 },
    { id: 'listings', label: 'Listings', alert: 0 },
    { id: 'transactions', label: 'Transactions', alert: 0 },
    { id: 'reviews', label: 'Reviews', alert: 0 },
    { id: 'conversations', label: 'Conversations', alert: unrev },
  ];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", backgroundColor: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background-color 0.25s' }}>

      {/* TOAST */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, backgroundColor: NAVY, borderRadius: '8px', padding: '12px 20px', fontSize: '13px', color: '#fff', zIndex: 300, boxShadow: '0 8px 24px rgba(15,20,40,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#86efac' }} />{toastMsg}
        </div>
      )}

      {/* HEADER */}
      <header style={{ backgroundColor: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => changeTab('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Logo white darkMode={darkMode} /></button>
          <div style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Support Console</span>
        </div>

        {/* GLOBAL SEARCH */}
        <div className="console-search" style={{ position: 'relative' }} ref={gsRef}>
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
            <button onClick={() => { changeTab('conversations'); setConvFilter('unreviewed'); }} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', backgroundColor: '#c62828', border: 'none', borderRadius: '20px', fontSize: '11px', color: '#fff', cursor: 'pointer', fontWeight: 700, letterSpacing: '0.02em' }}>
              {unrev} unreviewed
            </button>
          )}
          <div className="console-nav-actions" style={{ marginLeft: '4px' }}>
            <button onClick={() => setShowReports(true)} style={{ padding: '6px 12px', background: 'none', border: 'none', fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, borderRadius: '6px' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>Reports</button>
            <button onClick={() => setShowAudit(true)} style={{ padding: '6px 12px', background: 'none', border: 'none', fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, borderRadius: '6px' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>Audit</button>
            {currentRole === 'admin' && (
              <>
                <button onClick={() => setShowConsoleUsers(true)} style={{ padding: '6px 12px', background: 'none', border: 'none', fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, borderRadius: '6px' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>Team</button>
                <button onClick={() => setShowAlerts(true)} style={{ padding: '6px 12px', background: 'none', border: 'none', fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500, borderRadius: '6px' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>Alerts</button>
              </>
            )}
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />
          <button onClick={() => setDarkMode(d => !d)} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} style={{ padding: '5px 7px', background: 'none', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '7px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')} onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}>
            {darkMode
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </button>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 600 }}>{user.name[0]}</div>
          <a href="/" style={{ padding: '6px 12px', background: 'none', border: 'none', fontSize: '12px', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', textDecoration: 'none', fontWeight: 500 }}
            onMouseOver={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')} onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>Roles</a>
        </div>
      </header>

      {/* TAB NAV */}
      <div style={{ backgroundColor: C.surface, borderBottom: '1px solid ' + C.border, padding: '0 28px', display: 'flex', overflowX: 'auto', transition: 'background-color 0.25s' }}>
        {tabs.map(t => {
          const active = tab === t.id;
          const ac = darkMode ? '#e2e8f0' : NAVY;
          const ic = C.textMuted;
          return (
            <button key={t.id} onClick={() => changeTab(t.id)} style={{ padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: active ? ac : ic, borderBottom: active ? `2px solid ${darkMode ? '#60a5fa' : NAVY}` : '2px solid transparent', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
              <TabIcon id={t.id} color={active ? ac : ic} />
              {t.label}
              {t.alert > 0 && <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: '#fdecea', color: '#c62828', fontWeight: 700 }}>{t.alert}</span>}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1 }}>
        {tab === 'dashboard' ? (
          <DashboardTab data={activeData} onNavigate={changeTab} role={currentRole} darkMode={darkMode} />
        ) : tab === 'documents' ? (
          <DocumentsTab listings={listings} darkMode={darkMode} onAction={handleListingAction} onSelectListing={l => setSelL(l)} />
        ) : (
          <div style={{ padding: '0' }}>
            <div className="table-container" style={{ backgroundColor: C.surface, borderRadius: '10px', border: '1px solid ' + C.border, margin: '24px 28px', boxShadow: darkMode ? 'none' : '0 1px 4px rgba(0,0,0,0.04)', transition: 'background-color 0.25s' }}>
              <TableTab
                tab={tab}
                items={pagedItems}
                totalCount={currentItems[tab]?.length ?? 0}
                page={page}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                sort={sort}
                filters={filters}
                setFilters={f => { setFilters(f); setPage(1); }}
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
                setConvFilter={f => { setConvFilter(f); setPage(1); }}
                allConvs={convs}
                darkMode={darkMode}
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: NAVY, padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo white darkMode={darkMode} />
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>Support Console · Internal Use Only</span>
      </footer>

      {/* ENTITY MODALS */}
      {selU && <UserModal user={selU} notes={notes} onClose={() => setSelU(null)} onAction={handleUserAction} onAddNote={() => {}} currentUser={user} darkMode={darkMode} />}
      {selL && <ListingModal listing={selL} notes={notes} onClose={() => setSelL(null)} onAction={handleListingAction} onAddNote={() => {}} currentUser={user} darkMode={darkMode} />}
      {selT && <TransactionModal txn={selT} notes={notes} onClose={() => setSelT(null)} onAction={handleTxnAction} currentUser={user} darkMode={darkMode} />}
      {selR && <ReviewModal review={selR} notes={notes} onClose={() => setSelR(null)} onAction={handleReviewAction} currentUser={user} darkMode={darkMode} />}
      {selC && <ConversationModal conv={selC} notes={notes} onClose={() => setSelC(null)} onAction={handleConvAction} currentUser={user} darkMode={darkMode} />}
      {msgTarget && <SendMessageModal user={msgTarget} onClose={() => setMsgTarget(null)} onSend={(msg: any) => { toast(`Message sent via ${msg.channel}.`); addAudit('Sent message', 'user', msgTarget.id, msgTarget.name, `Sent via ${msg.channel}`); }} darkMode={darkMode} />}

      {/* SYSTEM MODALS */}
      {showReports && <ReportsModal data={activeData} onClose={() => setShowReports(false)} role={currentRole} darkMode={darkMode} />}
      {showAudit && <AuditLogModal audit={audit} onClose={() => setShowAudit(false)} darkMode={darkMode} />}
      {showConsoleUsers && <ConsoleUsersModal consoleUsers={consoleUsers} onClose={() => setShowConsoleUsers(false)} onAction={handleConsoleUserAction} darkMode={darkMode} />}
      {showAlerts && <AlertsConfigModal alertConfigs={alertConfigs} onClose={() => setShowAlerts(false)} onUpdate={(a: any) => setAlertConfigs(cs => cs.map(c => c.id === a.id ? a : c))} darkMode={darkMode} />}
    </div>
  );
}
