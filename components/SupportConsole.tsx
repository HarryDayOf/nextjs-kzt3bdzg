'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_USERS = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@example.com', role: 'vendor', status: 'active', joined: '2024-11-01', listings: 3, transactions: 12 },
  { id: 'u2', name: 'Marcus Webb', email: 'marcus@example.com', role: 'couple', status: 'active', joined: '2025-01-15', listings: 0, transactions: 2 },
  { id: 'u3', name: 'Bloom & Co Florals', email: 'hello@bloomco.com', role: 'vendor', status: 'suspended', joined: '2024-09-10', listings: 7, transactions: 31 },
  { id: 'u4', name: 'Jordan & Priya Ellis', email: 'jp@example.com', role: 'couple', status: 'active', joined: '2025-02-01', listings: 0, transactions: 1 },
  { id: 'u5', name: 'Magnolia Events', email: 'info@magnoliaevents.com', role: 'vendor', status: 'pending', joined: '2025-02-20', listings: 0, transactions: 0 },
];
const MOCK_LISTINGS = [
  { id: 'l1', title: 'Full-Day Wedding Photography', vendor: 'Sarah Chen', price: 3200, status: 'active', category: 'Photography', created: '2024-11-05' },
  { id: 'l2', title: 'Garden Floral Package', vendor: 'Bloom & Co Florals', price: 1800, status: 'suspended', category: 'Florals', created: '2024-09-15' },
  { id: 'l3', title: 'Luxury Floral Design', vendor: 'Bloom & Co Florals', price: 4500, status: 'active', category: 'Florals', created: '2024-10-01' },
  { id: 'l4', title: 'DJ + MC Package', vendor: 'Magnolia Events', price: 2200, status: 'pending_review', category: 'Entertainment', created: '2025-02-20' },
  { id: 'l5', title: 'Elopement Photography', vendor: 'Sarah Chen', price: 1400, status: 'active', category: 'Photography', created: '2024-12-01' },
];
const MOCK_TRANSACTIONS = [
  { id: 't1', buyer: 'Marcus Webb', seller: 'Sarah Chen', listing: 'Full-Day Wedding Photography', amount: 3200, status: 'completed', date: '2025-01-20', disputed: false },
  { id: 't2', buyer: 'Jordan & Priya Ellis', seller: 'Bloom & Co Florals', listing: 'Luxury Floral Design', amount: 4500, status: 'disputed', date: '2025-02-10', disputed: true },
  { id: 't3', buyer: 'Marcus Webb', seller: 'Bloom & Co Florals', listing: 'Garden Floral Package', amount: 1800, status: 'refunded', date: '2024-12-15', disputed: false },
  { id: 't4', buyer: 'Jordan & Priya Ellis', seller: 'Sarah Chen', listing: 'Elopement Photography', amount: 1400, status: 'pending', date: '2025-02-22', disputed: false },
];
const MOCK_REVIEWS = [
  { id: 'r1', author: 'Marcus Webb', target: 'Sarah Chen', listing: 'Full-Day Wedding Photography', rating: 5, content: 'Absolutely incredible work. Sarah was calm, professional, and the photos exceeded everything we hoped for.', date: '2025-02-01', flagged: false },
  { id: 'r2', author: 'Jordan & Priya Ellis', target: 'Bloom & Co Florals', listing: 'Luxury Floral Design', rating: 1, content: 'They ghosted us two weeks before the wedding. Complete disaster. Do not book.', date: '2025-02-15', flagged: true },
  { id: 'r3', author: 'Marcus Webb', target: 'Bloom & Co Florals', listing: 'Garden Floral Package', rating: 2, content: 'Arrangements were not what was agreed upon. Had to request a refund.', date: '2025-01-02', flagged: false },
];

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  active:         { label: 'Active',         bg: '#e8f5e9', color: '#2e7d32' },
  suspended:      { label: 'Suspended',      bg: '#fdecea', color: '#c62828' },
  pending:        { label: 'Pending',        bg: '#fff8e1', color: '#f57f17' },
  pending_review: { label: 'Pending Review', bg: '#fff8e1', color: '#f57f17' },
  completed:      { label: 'Completed',      bg: '#e8f5e9', color: '#2e7d32' },
  disputed:       { label: 'Disputed',       bg: '#fdecea', color: '#c62828' },
  refunded:       { label: 'Refunded',       bg: '#f3f4f6', color: '#6b7280' },
  flagged:        { label: 'Flagged',        bg: '#fff3e0', color: '#e65100' },
};

function Badge({ status }: { status: string }) {
  const s = STATUS_MAP[status] || { label: status, bg: '#f3f4f6', color: '#6b7280' };
  return <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
}

function Modal({ title, subtitle, children, onClose }: any) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,20,40,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 20px 60px rgba(15,20,40,0.18)', padding: '32px', minWidth: '500px', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e: any) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 600, color: '#0f1428', marginBottom: '2px' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '12px', color: '#9ca3af' }}>{subtitle}</div>}
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
    <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
      <span style={{ color: '#9ca3af', fontSize: '12px', minWidth: '130px', fontWeight: 500 }}>{label}</span>
      <span style={{ color: '#1f2937', fontSize: '13px' }}>{value}</span>
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
      Day
      <span style={{ position: 'relative', display: 'inline-block' }}>O<span style={{ position: 'absolute', top: '1px', right: '-4px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: c, display: 'inline-block' }} /></span>
      <span style={{ marginLeft: '9px' }}>f</span>
    </div>
  );
}

export default function SupportConsole({ user }: { user: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleLogout = () => { sessionStorage.removeItem('dayof_user'); router.push('/'); };
  const filter = (items: any[], fields: string[]) => search ? items.filter(i => fields.some(f => i[f]?.toLowerCase().includes(search.toLowerCase()))) : items;

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'listings', label: 'Listings', count: listings.length },
    { id: 'transactions', label: 'Transactions', count: transactions.length },
    { id: 'reviews', label: 'Reviews', count: reviews.length },
  ];

  const th: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap', backgroundColor: '#fafafa' };
  const td: React.CSSProperties = { padding: '13px 16px', borderBottom: '1px solid #f9fafb', fontSize: '13px', color: '#374151', verticalAlign: 'middle' };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, backgroundColor: '#0f1428', borderRadius: '8px', padding: '12px 20px', fontSize: '13px', color: '#fff', zIndex: 200, boxShadow: '0 8px 24px rgba(15,20,40,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#86efac' }} />{toast}
        </div>
      )}

      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <DayOfLogo />
          <div style={{ height: '18px', width: '1px', backgroundColor: '#e5e7eb' }} />
          <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Support Console</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setSearch(''); }} style={{ padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: activeTab === t.id ? '#0f1428' : '#9ca3af', borderBottom: activeTab === t.id ? '2px solid #0f1428' : '2px solid transparent', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {t.label}
            <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '10px', backgroundColor: activeTab === t.id ? '#0f1428' : '#f3f4f6', color: activeTab === t.id ? '#fff' : '#9ca3af', fontWeight: 600 }}>{t.count}</span>
          </button>
        ))}
      </div>

      <main style={{ padding: '28px 32px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '16px' }}>⌕</span>
            <input style={{ paddingLeft: '36px', paddingRight: '14px', paddingTop: '9px', paddingBottom: '9px', width: '300px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', color: '#374151', outline: 'none' }} placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '13px' }}>Clear</button>}
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {activeTab === 'users' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Name','Email','Role','Status','Joined','Listings','Txns'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(users, ['name','email']).map(u => (
                <tr key={u.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor='transparent')} onClick={() => setSelectedUser(u)}>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{u.name}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{u.email}</span></td>
                  <td style={td}><span style={{ fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{u.role}</span></td>
                  <td style={td}><Badge status={u.status} /></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{u.joined}</span></td>
                  <td style={td}>{u.listings}</td>
                  <td style={td}>{u.transactions}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {activeTab === 'listings' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Title','Vendor','Category','Price','Status','Created'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(listings, ['title','vendor','category']).map(l => (
                <tr key={l.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor='transparent')} onClick={() => setSelectedListing(l)}>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{l.title}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{l.vendor}</span></td>
                  <td style={td}><span style={{ fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{l.category}</span></td>
                  <td style={td}><span style={{ fontWeight: 500 }}>${l.price.toLocaleString()}</span></td>
                  <td style={td}><Badge status={l.status} /></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{l.created}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {activeTab === 'transactions' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Buyer','Seller','Listing','Amount','Status','Date',''].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(transactions, ['buyer','seller','listing']).map(t => (
                <tr key={t.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor='transparent')} onClick={() => setSelectedTransaction(t)}>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{t.buyer}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{t.seller}</span></td>
                  <td style={td}><span style={{ color: '#6b7280', fontSize: '12px' }}>{t.listing}</span></td>
                  <td style={td}><span style={{ fontWeight: 500 }}>${t.amount.toLocaleString()}</span></td>
                  <td style={td}><Badge status={t.status} /></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{t.date}</span></td>
                  <td style={td}>{t.disputed && <Badge status="flagged" />}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {activeTab === 'reviews' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Author','About','Rating','Preview','Date',''].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{filter(reviews, ['author','target','content']).map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onMouseOver={e => (e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e => (e.currentTarget.style.backgroundColor='transparent')} onClick={() => setSelectedReview(r)}>
                  <td style={td}><span style={{ fontWeight: 500, color: '#0f1428' }}>{r.author}</span></td>
                  <td style={td}><span style={{ color: '#6b7280' }}>{r.target}</span></td>
                  <td style={td}><span style={{ color: r.rating >= 4 ? '#2e7d32' : r.rating >= 3 ? '#b45309' : '#c62828', letterSpacing: '1px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span></td>
                  <td style={{ ...td, maxWidth: '240px' }}><span style={{ color: '#9ca3af', fontSize: '12px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.content}</span></td>
                  <td style={td}><span style={{ color: '#9ca3af', fontSize: '12px' }}>{r.date}</span></td>
                  <td style={td}>{r.flagged && <Badge status="flagged" />}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </main>

      {selectedUser && (
        <Modal title={selectedUser.name} subtitle={`User · ${selectedUser.id}`} onClose={() => setSelectedUser(null)}>
          <DetailRow label="Email" value={selectedUser.email} />
          <DetailRow label="Role" value={selectedUser.role} />
          <DetailRow label="Status" value={<Badge status={selectedUser.status} />} />
          <DetailRow label="Joined" value={selectedUser.joined} />
          <DetailRow label="Listings" value={selectedUser.listings} />
          <DetailRow label="Transactions" value={selectedUser.transactions} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
            <ActionBtn variant="primary" label="Edit Profile" onClick={() => showToast('Edit profile → Sharetribe API')} />
            <ActionBtn variant={selectedUser.status === 'suspended' ? 'success' : 'danger'} label={selectedUser.status === 'suspended' ? 'Unsuspend' : 'Suspend'} onClick={() => { const next = selectedUser.status === 'suspended' ? 'active' : 'suspended'; setUsers(users.map(u => u.id === selectedUser.id ? {...u, status: next} : u)); setSelectedUser({...selectedUser, status: next}); showToast(`User ${next}.`); }} />
            <ActionBtn label="Reset Password" onClick={() => showToast('Password reset email sent.')} />
            <ActionBtn label="Impersonate" onClick={() => showToast('Impersonation → Sharetribe API')} />
            <ActionBtn label="View Transactions" onClick={() => { setSelectedUser(null); setActiveTab('transactions'); setSearch(selectedUser.name); }} />
          </div>
        </Modal>
      )}
      {selectedListing && (
        <Modal title={selectedListing.title} subtitle={`Listing · ${selectedListing.id}`} onClose={() => setSelectedListing(null)}>
          <DetailRow label="Vendor" value={selectedListing.vendor} />
          <DetailRow label="Category" value={selectedListing.category} />
          <DetailRow label="Price" value={`$${selectedListing.price.toLocaleString()}`} />
          <DetailRow label="Status" value={<Badge status={selectedListing.status} />} />
          <DetailRow label="Created" value={selectedListing.created} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
            <ActionBtn variant="primary" label="Edit Listing" onClick={() => showToast('Edit listing → Sharetribe API')} />
            <ActionBtn variant="success" label="Approve" onClick={() => { setListings(listings.map(l => l.id === selectedListing.id ? {...l, status: 'active'} : l)); setSelectedListing({...selectedListing, status: 'active'}); showToast('Listing approved.'); }} />
            <ActionBtn variant={selectedListing.status === 'suspended' ? 'success' : 'danger'} label={selectedListing.status === 'suspended' ? 'Unsuspend' : 'Suspend'} onClick={() => { const next = selectedListing.status === 'suspended' ? 'active' : 'suspended'; setListings(listings.map(l => l.id === selectedListing.id ? {...l, status: next} : l)); setSelectedListing({...selectedListing, status: next}); showToast(`Listing ${next}.`); }} />
            <ActionBtn variant="warning" label="Flag for Review" onClick={() => showToast('Listing flagged.')} />
          </div>
        </Modal>
      )}
      {selectedTransaction && (
        <Modal title={`Transaction · ${selectedTransaction.id.toUpperCase()}`} subtitle={selectedTransaction.listing} onClose={() => setSelectedTransaction(null)}>
          <DetailRow label="Buyer" value={selectedTransaction.buyer} />
          <DetailRow label="Seller" value={selectedTransaction.seller} />
          <DetailRow label="Amount" value={`$${selectedTransaction.amount.toLocaleString()}`} />
          <DetailRow label="Status" value={<Badge status={selectedTransaction.status} />} />
          <DetailRow label="Date" value={selectedTransaction.date} />
          <DetailRow label="Dispute" value={selectedTransaction.disputed ? <Badge status="disputed" /> : 'None'} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
            <ActionBtn variant="primary" label="View Full Details" onClick={() => showToast('Full details → Sharetribe API')} />
            <ActionBtn variant="danger" label="Issue Refund" onClick={() => { setTransactions(transactions.map(t => t.id === selectedTransaction.id ? {...t, status: 'refunded'} : t)); setSelectedTransaction({...selectedTransaction, status: 'refunded'}); showToast('Refund issued.'); }} />
            <ActionBtn variant="success" label="Resolve Dispute" onClick={() => { setTransactions(transactions.map(t => t.id === selectedTransaction.id ? {...t, status: 'completed', disputed: false} : t)); setSelectedTransaction({...selectedTransaction, status: 'completed', disputed: false}); showToast('Dispute resolved.'); }} />
            <ActionBtn label="View Messages" onClick={() => showToast('Message thread → Sharetribe API')} />
          </div>
        </Modal>
      )}
      {selectedReview && (
        <Modal title={`Review by ${selectedReview.author}`} subtitle={`About ${selectedReview.target} · ${selectedReview.date}`} onClose={() => setSelectedReview(null)}>
          <DetailRow label="Listing" value={selectedReview.listing} />
          <DetailRow label="Rating" value={<span style={{ color: selectedReview.rating >= 4 ? '#2e7d32' : selectedReview.rating >= 3 ? '#b45309' : '#c62828' }}>{'★'.repeat(selectedReview.rating)}{'☆'.repeat(5-selectedReview.rating)} ({selectedReview.rating}/5)</span>} />
          <DetailRow label="Flagged" value={selectedReview.flagged ? <Badge status="flagged" /> : 'No'} />
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', color: '#374151', lineHeight: 1.7, border: '1px solid #f3f4f6' }}>{selectedReview.content}</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
            <ActionBtn variant={selectedReview.flagged ? 'default' : 'warning'} label={selectedReview.flagged ? 'Unflag' : 'Flag Review'} onClick={() => { setReviews(reviews.map(r => r.id === selectedReview.id ? {...r, flagged: !r.flagged} : r)); setSelectedReview({...selectedReview, flagged: !selectedReview.flagged}); showToast(`Review ${selectedReview.flagged ? 'unflagged' : 'flagged'}.`); }} />
            <ActionBtn variant="danger" label="Remove Review" onClick={() => { setReviews(reviews.filter(r => r.id !== selectedReview.id)); setSelectedReview(null); showToast('Review removed.'); }} />
            <ActionBtn variant="primary" label="Platform Response" onClick={() => showToast('Platform response → Sharetribe API')} />
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