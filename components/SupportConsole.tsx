/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';

const KEYWORD_CATEGORIES = {
  payment:     { label: 'Payment',      color: '#c62828', bg: '#fdecea', words: ['venmo','zelle','cashapp','cash app','paypal','wire transfer','bank transfer','western union','crypto','bitcoin'] },
  contact:     { label: 'Contact',      color: '#b45309', bg: '#fff8e1', words: ['text me','call me','whatsapp','instagram dm','facebook','@gmail','@yahoo','@icloud','@hotmail','my number','phone number'] },
  offplatform: { label: 'Off-Platform', color: '#7c3aed', bg: '#f5f3ff', words: ['off the app','off platform','outside the platform','my website','direct booking','book directly','bypass','avoid fees','save on fees','skip the platform'] },
} as const;

type KWCategory = keyof typeof KEYWORD_CATEGORIES;
type KWHit = { word: string; category: KWCategory };

function detectKeywords(text: string): KWHit[] {
  const lower = text.toLowerCase();
  const hits: KWHit[] = [];
  (Object.keys(KEYWORD_CATEGORIES) as KWCategory[]).forEach(cat => {
    KEYWORD_CATEGORIES[cat].words.forEach((word: string) => {
      if (lower.includes(word) && !hits.find(h => h.word === word)) hits.push({ word, category: cat });
    });
  });
  return hits;
}

function uniqueHits(hits: KWHit[]): KWHit[] {
  return hits.filter((h, i, arr) => arr.findIndex(x => x.word === h.word) === i);
}

function highlightKeywords(text: string): React.ReactNode {
  let parts: React.ReactNode[] = [text];
  (Object.keys(KEYWORD_CATEGORIES) as KWCategory[]).forEach(cat => {
    const data = KEYWORD_CATEGORIES[cat];
    parts = parts.flatMap(node => {
      if (typeof node !== 'string') return [node];
      const result: React.ReactNode[] = [];
      let rem = node;
      data.words.forEach((word: string) => {
        const idx = rem.toLowerCase().indexOf(word);
        if (idx !== -1) {
          if (idx > 0) result.push(rem.slice(0, idx));
          result.push(<mark key={word+idx} style={{ backgroundColor: data.bg, color: data.color, fontWeight: 700, borderRadius: '3px', padding: '0 2px' }}>{rem.slice(idx, idx+word.length)}</mark>);
          rem = rem.slice(idx + word.length);
        }
      });
      result.push(rem);
      return result;
    });
  });
  return <>{parts}</>;
}

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

const MOCK_CONVERSATIONS: any[] = [
  {
    id: 'conv_A1b2C3d4E5f6G7h8', participants: ['Marcus Webb','Sarah Chen'], participant_ids: ['b2e91d73','6f3a2c1e'], listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', txn_id: 'txn_3Ks9Lx2mPqR7vYnW', message_count: 6, last_message: '2025-01-18T10:42:00Z', reviewed: false, status: 'clean',
    messages: [
      { id:'m1', sender:'Marcus Webb', role:'couple', text:"Hi Sarah! We came across your portfolio and love your style. We're getting married June 14th — do you have that date?", ts:'2025-01-10T09:15:00Z' },
      { id:'m2', sender:'Sarah Chen', role:'vendor', text:"Hi Marcus! Congratulations! June 14th is available. I'd love to learn more about your vision.", ts:'2025-01-10T10:02:00Z' },
      { id:'m3', sender:'Marcus Webb', role:'couple', text:"Garden ceremony at Foxcroft Estate, 120 guests. We want candid documentary-style coverage.", ts:'2025-01-10T11:30:00Z' },
      { id:'m4', sender:'Sarah Chen', role:'vendor', text:"Documentary is absolutely my approach. I've shot Foxcroft twice — great light in the late afternoon.", ts:'2025-01-11T08:45:00Z' },
      { id:'m5', sender:'Marcus Webb', role:'couple', text:"Perfect, we'd like to move forward. How do we book through the platform?", ts:'2025-01-12T14:20:00Z' },
      { id:'m6', sender:'Sarah Chen', role:'vendor', text:"Sounds great! Just proceed through the booking flow on the listing and we're all set.", ts:'2025-01-18T10:42:00Z' },
    ],
  },
  {
    id: 'conv_B9c8D7e6F5g4H3i2', participants: ['Jordan & Priya Ellis','Bloom & Co Florals'], participant_ids: ['c7d45e81','a4f78c29'], listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', txn_id: 'txn_8Fh4Tz3J7nLwS1uX', message_count: 8, last_message: '2025-02-08T14:17:00Z', reviewed: false, status: 'flagged',
    messages: [
      { id:'m1', sender:'Jordan & Priya Ellis', role:'couple', text:"Hello! We love the Luxury Floral Design package. What's included for 150 guests?", ts:'2025-01-28T10:00:00Z' },
      { id:'m2', sender:'Bloom & Co Florals', role:'vendor', text:"Hi! For 150 guests: 15 centerpieces, full ceremony arch, bridal bouquets, and boutonnieres.", ts:'2025-01-28T11:15:00Z' },
      { id:'m3', sender:'Jordan & Priya Ellis', role:'couple', text:"That sounds perfect. Any add-ons for cocktail hour florals?", ts:'2025-01-29T09:30:00Z' },
      { id:'m4', sender:'Bloom & Co Florals', role:'vendor', text:"Yes we can add cocktail hour for an additional fee. Actually if you want to save on fees just Venmo me directly — I can give you a better rate.", ts:'2025-02-01T13:45:00Z' },
      { id:'m5', sender:'Jordan & Priya Ellis', role:'couple', text:"We're not comfortable going outside the platform. Can we keep everything through Day Of?", ts:'2025-02-02T08:20:00Z' },
      { id:'m6', sender:'Bloom & Co Florals', role:'vendor', text:"Totally fine! Let's proceed through the platform then.", ts:'2025-02-02T09:05:00Z' },
      { id:'m7', sender:'Jordan & Priya Ellis', role:'couple', text:"Great, we booked it. Looking forward to working with you!", ts:'2025-02-05T11:00:00Z' },
      { id:'m8', sender:'Bloom & Co Florals', role:'vendor', text:"Wonderful! We'll be in touch closer to the date.", ts:'2025-02-08T14:17:00Z' },
    ],
  },
  {
    id: 'conv_C4d3E2f1G8h7I6j5', participants: ['Marcus Webb','Bloom & Co Florals'], participant_ids: ['b2e91d73','a4f78c29'], listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', txn_id: 'txn_1Rp5F4hQcM9yVjAg', message_count: 5, last_message: '2024-12-10T09:05:00Z', reviewed: true, status: 'flagged',
    messages: [
      { id:'m1', sender:'Marcus Webb', role:'couple', text:"Hi, interested in the Garden Floral Package for our November wedding.", ts:'2024-12-05T10:00:00Z' },
      { id:'m2', sender:'Bloom & Co Florals', role:'vendor', text:"Hi Marcus! Here's my personal email hello@bloomco.com — easier to coordinate off platform and I can send a custom quote directly.", ts:'2024-12-05T11:30:00Z' },
      { id:'m3', sender:'Marcus Webb', role:'couple', text:"Sure. Also, do you take Zelle? Easier for us.", ts:'2024-12-06T09:15:00Z' },
      { id:'m4', sender:'Bloom & Co Florals', role:'vendor', text:"Yes, Zelle works fine! My number is on the email. We can book directly and avoid the platform fees.", ts:'2024-12-07T14:00:00Z' },
      { id:'m5', sender:'Marcus Webb', role:'couple', text:"Actually we're going to stick to the platform. Not comfortable going outside it.", ts:'2024-12-10T09:05:00Z' },
    ],
  },
  {
    id: 'conv_D5e4F3g2H1i8J7k6', participants: ['Jordan & Priya Ellis','Sarah Chen'], participant_ids: ['c7d45e81','6f3a2c1e'], listing: 'Elopement Photography', listing_id: 'lst_5Mv8G2tIpZ6xDrWq', txn_id: 'txn_6Mv7G2tIpZ4xDrWq', message_count: 4, last_message: '2025-02-21T16:30:00Z', reviewed: false, status: 'clean',
    messages: [
      { id:'m1', sender:'Jordan & Priya Ellis', role:'couple', text:"Hi Sarah! Planning a small elopement at Blue Ridge in March. Just the two of us and our dog. Does your package cover that?", ts:'2025-02-18T14:00:00Z' },
      { id:'m2', sender:'Sarah Chen', role:'vendor', text:"That sounds absolutely beautiful! Yes, my elopement package is perfect — 4 hours, all locations, includes your pup!", ts:'2025-02-19T09:20:00Z' },
      { id:'m3', sender:'Jordan & Priya Ellis', role:'couple', text:"Amazing. What time works for a quick call to go over the shot list?", ts:'2025-02-20T11:00:00Z' },
      { id:'m4', sender:'Sarah Chen', role:'vendor', text:"Free Thursday after 2pm or Friday morning. Book through the platform and we'll go from there!", ts:'2025-02-21T16:30:00Z' },
    ],
  },
];

const STATUS_MAP: Record<string,{label:string;bg:string;color:string}> = {
  active:         { label:'Active',         bg:'#e8f5e9', color:'#2e7d32' },
  suspended:      { label:'Suspended',      bg:'#fdecea', color:'#c62828' },
  pending:        { label:'Pending',        bg:'#fff8e1', color:'#f57f17' },
  pending_review: { label:'Pending Review', bg:'#fff8e1', color:'#f57f17' },
  completed:      { label:'Completed',      bg:'#e8f5e9', color:'#2e7d32' },
  disputed:       { label:'Disputed',       bg:'#fdecea', color:'#c62828' },
  refunded:       { label:'Refunded',       bg:'#f3f4f6', color:'#6b7280' },
  flagged:        { label:'Flagged',        bg:'#fff3e0', color:'#e65100' },
  clean:          { label:'Clean',          bg:'#e8f5e9', color:'#2e7d32' },
};

function Badge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: '#f3f4f6', color: '#6b7280' };
  return <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, backgroundColor:s.bg, color:s.color }}>{s.label}</span>;
}
function IdChip({ value }: { value: string }) {
  return <span style={{ fontFamily:'monospace', fontSize:'11px', color:'#6b7280', backgroundColor:'#f3f4f6', padding:'2px 7px', borderRadius:'4px' }}>{value}</span>;
}
function KWChip({ word, category }: { word: string; category: KWCategory }) {
  const cat = KEYWORD_CATEGORIES[category];
  return <span style={{ fontFamily:'monospace', fontSize:'11px', color:cat.color, backgroundColor:cat.bg, padding:'2px 8px', borderRadius:'4px', fontWeight:600, border:`1px solid ${cat.color}30` }}>{word}</span>;
}
function Modal({ title, subtitle, children, onClose, wide }: { title:string; subtitle?:string; children:React.ReactNode; onClose:()=>void; wide?:boolean }) {
  return (
    <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(15,20,40,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }} onClick={onClose}>
      <div style={{ backgroundColor:'#fff', borderRadius:'12px', boxShadow:'0 20px 60px rgba(15,20,40,0.2)', padding:'32px', width:wide?'760px':'580px', maxWidth:'96vw', maxHeight:'90vh', overflowY:'auto' }} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' }}>
          <div>
            <div style={{ fontSize:'17px', fontWeight:600, color:'#0f1428', marginBottom:'2px' }}>{title}</div>
            {subtitle && <div style={{ fontSize:'12px', color:'#9ca3af', fontFamily:'monospace' }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:'22px', lineHeight:1, paddingLeft:'16px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function DR({ label, value }: { label:string; value:React.ReactNode }) {
  return (
    <div style={{ display:'flex', gap:'16px', padding:'10px 0', borderBottom:'1px solid #f3f4f6', alignItems:'flex-start' }}>
      <span style={{ color:'#9ca3af', fontSize:'12px', minWidth:'150px', fontWeight:500, paddingTop:'1px' }}>{label}</span>
      <span style={{ color:'#1f2937', fontSize:'13px', flex:1 }}>{value}</span>
    </div>
  );
}
function Btn({ label, variant='default', onClick }: { label:string; variant?:string; onClick:()=>void }) {
  const vs: Record<string,any> = {
    default:{ bg:'#f9fafb', border:'#e5e7eb', color:'#374151' },
    primary:{ bg:'#0f1428', border:'#0f1428', color:'#fff' },
    danger: { bg:'#fdecea', border:'#fca5a5', color:'#c62828' },
    success:{ bg:'#e8f5e9', border:'#86efac', color:'#2e7d32' },
    warning:{ bg:'#fff8e1', border:'#fcd34d', color:'#b45309' },
  };
  const v = vs[variant] ?? vs.default;
  return <button onClick={onClick} style={{ padding:'8px 16px', backgroundColor:v.bg, border:`1px solid ${v.border}`, borderRadius:'8px', color:v.color, fontSize:'13px', cursor:'pointer', fontWeight:500 }}>{label}</button>;
}
function Logo({ white }: { white?:boolean }) {
  const c = white?'#fff':'#0f1428';
  return <div style={{ display:'inline-flex', alignItems:'baseline', fontFamily:'Georgia,serif', fontWeight:700, fontSize:'20px', color:c, letterSpacing:'-0.02em' }}>Day<span style={{ position:'relative', display:'inline-block' }}>O<span style={{ position:'absolute', top:'1px', right:'-4px', width:'5px', height:'5px', borderRadius:'50%', backgroundColor:c, display:'inline-block' }} /></span><span style={{ marginLeft:'9px' }}>f</span></div>;
}

function ConvModal({ conv, onClose, onReviewed, toast, setTab, setSearch }: any) {
  const allHits = conv.messages.flatMap((m: any) => detectKeywords(m.text));
  const hits = uniqueHits(allHits);
  const risk = Math.min(100, hits.length*18 + (conv.status==='flagged'?20:0));
  const rc = risk>=60?'#c62828':risk>=30?'#f57f17':'#2e7d32';
  const rl = risk>=60?'High Risk':risk>=30?'Medium Risk':'Low Risk';
  return (
    <Modal title="Conversation Thread" subtitle={conv.id} onClose={onClose} wide>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'20px' }}>
        {([['Participants', conv.participants.join(' + ')],['Listing',conv.listing],['Transaction',conv.txn_id??'—']] as [string,string][]).map(([l,v])=>(
          <div key={l} style={{ backgroundColor:'#f9fafb', borderRadius:'8px', padding:'10px 14px', border:'1px solid #f3f4f6' }}>
            <div style={{ fontSize:'11px', color:'#9ca3af', fontWeight:600, marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
            <div style={{ fontSize:'13px', color:'#0f1428', fontWeight:500 }}>{v}</div>
          </div>
        ))}
      </div>
      {conv.status==='flagged'&&(
        <div style={{ backgroundColor:'#fdecea', border:'1px solid #fca5a5', borderRadius:'8px', padding:'14px 16px', marginBottom:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
            <div style={{ fontSize:'13px', fontWeight:600, color:'#c62828' }}>⚠ Policy violation detected</div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <span style={{ fontSize:'11px', color:rc, fontWeight:700 }}>{rl}</span>
              <div style={{ width:'80px', height:'6px', backgroundColor:'#f3f4f6', borderRadius:'3px', overflow:'hidden' }}>
                <div style={{ width:`${risk}%`, height:'100%', backgroundColor:rc, borderRadius:'3px' }} />
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'10px' }}>
            {hits.map((h:KWHit)=><KWChip key={h.word} word={h.word} category={h.category}/>)}
          </div>
          <div style={{ display:'flex', gap:'12px' }}>
            {(Object.keys(KEYWORD_CATEGORIES) as KWCategory[]).map(key=>(
              <span key={key} style={{ fontSize:'11px', color:KEYWORD_CATEGORIES[key].color, display:'flex', alignItems:'center', gap:'4px' }}>
                <span style={{ width:8, height:8, borderRadius:'2px', backgroundColor:KEYWORD_CATEGORIES[key].bg, border:`1px solid ${KEYWORD_CATEGORIES[key].color}`, display:'inline-block' }} />
                {KEYWORD_CATEGORIES[key].label}
              </span>
            ))}
          </div>
        </div>
      )}
      <div style={{ backgroundColor:'#f9fafb', borderRadius:'10px', border:'1px solid #f3f4f6', padding:'16px', marginBottom:'20px', maxHeight:'340px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'12px' }}>
        {conv.messages.map((msg: any)=>{
          const isV = msg.role==='vendor';
          const mh = detectKeywords(msg.text);
          const flagged = mh.length>0;
          return (
            <div key={msg.id} style={{ display:'flex', flexDirection:'column', alignItems:isV?'flex-end':'flex-start' }}>
              <div style={{ fontSize:'11px', color:'#9ca3af', marginBottom:'3px', paddingLeft:isV?0:'4px', paddingRight:isV?'4px':0 }}>
                <span style={{ fontWeight:600, color:'#6b7280' }}>{msg.sender}</span>
                {' · '}{new Date(msg.ts).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
              </div>
              <div style={{ maxWidth:'75%', padding:'10px 14px', borderRadius:isV?'12px 4px 12px 12px':'4px 12px 12px 12px', backgroundColor:flagged?'#fdecea':isV?'#0f1428':'#fff', border:flagged?'1px solid #fca5a5':isV?'none':'1px solid #e5e7eb', color:flagged?'#1f2937':isV?'#fff':'#1f2937', fontSize:'13px', lineHeight:1.6, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
                {highlightKeywords(msg.text)}
              </div>
              {flagged&&<div style={{ display:'flex', gap:'4px', marginTop:'4px', flexWrap:'wrap' }}>{mh.map((h:KWHit)=><KWChip key={h.word} word={h.word} category={h.category}/>)}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
        {!conv.reviewed&&<Btn variant="success" label="Mark Reviewed" onClick={()=>{onReviewed(conv.id);toast('Marked as reviewed.');onClose();}}/>}
        <Btn label="View User" onClick={()=>{onClose();setTab('users');setSearch(conv.participants[1]);}}/>
        {conv.txn_id&&<Btn label="View Transaction" onClick={()=>{onClose();setTab('transactions');setSearch(conv.txn_id);}}/>}
        {conv.status==='flagged'&&<Btn variant="danger" label="Suspend Vendor" onClick={()=>toast('Vendor suspended.')}/>}
        {conv.status==='flagged'&&<Btn variant="warning" label="Send Policy Warning" onClick={()=>toast('Policy warning sent.')}/>}
      </div>
    </Modal>
  );
}

export default function SupportConsole({ user }: { user: any }) {
  const [tab, setTab] = useState('users');
  const [search, setSearch] = useState('');
  const [toastMsg, setToast] = useState<string|null>(null);
  const [users, setUsers] = useState<any[]>(MOCK_USERS);
  const [listings, setListings] = useState<any[]>(MOCK_LISTINGS);
  const [transactions, setTransactions] = useState<any[]>(MOCK_TRANSACTIONS);
  const [reviews, setReviews] = useState<any[]>(MOCK_REVIEWS);
  const [convs, setConvs] = useState<any[]>(MOCK_CONVERSATIONS);
  const [cFilter, setCFilter] = useState('all');
  const [selU, setSelU] = useState<any>(null);
  const [selL, setSelL] = useState<any>(null);
  const [selT, setSelT] = useState<any>(null);
  const [selR, setSelR] = useState<any>(null);
  const [selC, setSelC] = useState<any>(null);

  const toast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(null),3200); };
  const logout = () => { sessionStorage.removeItem('dayof_user'); window.location.href='/'; };
  const fi = (items: any[], fields: string[]) => search ? items.filter(i=>fields.some(f=>String(i[f]??'').toLowerCase().includes(search.toLowerCase()))) : items;

  const flagged = convs.filter(c=>c.status==='flagged').length;
  const unrev = convs.filter(c=>c.status==='flagged'&&!c.reviewed).length;
  const markRev = (id: string) => setConvs(cs=>cs.map(c=>c.id===id?{...c,reviewed:true}:c));

  const filtC = convs.filter(c=>{
    const mf = cFilter==='all'?true:cFilter==='flagged'?c.status==='flagged':cFilter==='clean'?c.status==='clean':!c.reviewed&&c.status==='flagged';
    const ms = search?c.participants.some((p:string)=>p.toLowerCase().includes(search.toLowerCase()))||c.listing.toLowerCase().includes(search.toLowerCase()):true;
    return mf&&ms;
  });

  const tabs = [
    {id:'users',label:'Users',count:users.length,alert:0},
    {id:'listings',label:'Listings',count:listings.length,alert:0},
    {id:'transactions',label:'Transactions',count:transactions.length,alert:0},
    {id:'reviews',label:'Reviews',count:reviews.length,alert:0},
    {id:'conversations',label:'Conversations',count:convs.length,alert:unrev},
  ];

  const th: React.CSSProperties = { padding:'10px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'#9ca3af', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #f3f4f6', whiteSpace:'nowrap', backgroundColor:'#fafafa' };
  const td: React.CSSProperties = { padding:'12px 16px', borderBottom:'1px solid #f9fafb', fontSize:'13px', color:'#374151', verticalAlign:'middle' };

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,sans-serif", backgroundColor:'#f9fafb', minHeight:'100vh' }}>
      {toastMsg&&<div style={{ position:'fixed', top:20, right:20, backgroundColor:'#0f1428', borderRadius:'8px', padding:'12px 20px', fontSize:'13px', color:'#fff', zIndex:300, boxShadow:'0 8px 24px rgba(15,20,40,0.2)', display:'flex', alignItems:'center', gap:'10px' }}><span style={{ width:6,height:6,borderRadius:'50%',backgroundColor:'#86efac' }}/>{toastMsg}</div>}

      <header style={{ backgroundColor:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 32px', height:'58px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
          <Logo/>
          <div style={{ height:'18px', width:'1px', backgroundColor:'#e5e7eb' }}/>
          <span style={{ fontSize:'11px', color:'#9ca3af', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>Support Console</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          {unrev>0&&<button onClick={()=>{setTab('conversations');setCFilter('unreviewed');}} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'5px 12px', backgroundColor:'#fdecea', border:'1px solid #fca5a5', borderRadius:'8px', fontSize:'12px', color:'#c62828', cursor:'pointer', fontWeight:600 }}>⚠ {unrev} unreviewed {unrev===1?'flag':'flags'}</button>}
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', backgroundColor:'#0f1428', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'12px', fontWeight:600 }}>{user.name[0]}</div>
            <div><div style={{ fontSize:'13px', fontWeight:500, color:'#0f1428' }}>{user.name}</div><div style={{ fontSize:'11px', color:'#9ca3af', textTransform:'capitalize' }}>{user.role}</div></div>
          </div>
          <button onClick={logout} style={{ padding:'6px 14px', backgroundColor:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'12px', color:'#6b7280', cursor:'pointer' }}>Sign out</button>
        </div>
      </header>

      <div style={{ backgroundColor:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 32px', display:'flex' }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setSearch('');setCFilter('all');}} style={{ padding:'14px 18px', background:'none', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:500, color:tab===t.id?'#0f1428':'#9ca3af', borderBottom:tab===t.id?'2px solid #0f1428':'2px solid transparent', marginBottom:'-1px', display:'flex', alignItems:'center', gap:'7px' }}>
            {t.label}
            <span style={{ fontSize:'11px', padding:'1px 7px', borderRadius:'10px', backgroundColor:tab===t.id?'#0f1428':'#f3f4f6', color:tab===t.id?'#fff':'#9ca3af', fontWeight:600 }}>{t.count}</span>
            {t.alert>0&&<span style={{ fontSize:'11px', padding:'1px 6px', borderRadius:'10px', backgroundColor:'#fdecea', color:'#c62828', fontWeight:700 }}>{t.alert}</span>}
          </button>
        ))}
      </div>

      <main style={{ padding:'28px 32px' }}>
        {tab!=='conversations'&&(
          <div style={{ marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'16px' }}>⌕</span>
              <input style={{ paddingLeft:'36px', paddingRight:'14px', paddingTop:'9px', paddingBottom:'9px', width:'300px', backgroundColor:'#fff', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'13px', color:'#374151', outline:'none' }} placeholder={`Search ${tab}...`} value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            {search&&<button onClick={()=>setSearch('')} style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:'13px' }}>Clear</button>}
          </div>
        )}
        {tab==='conversations'&&(
          <div style={{ marginBottom:'20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
            <div style={{ display:'flex', gap:'6px' }}>
              {([['all','All',convs.length],['flagged','Flagged',flagged],['unreviewed','Needs Review',unrev],['clean','Clean',convs.filter(c=>c.status==='clean').length]] as [string,string,number][]).map(([val,label,count])=>(
                <button key={val} onClick={()=>{setCFilter(val);setSearch('');}} style={{ padding:'6px 14px', backgroundColor:cFilter===val?'#0f1428':'#fff', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'12px', color:cFilter===val?'#fff':'#6b7280', cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:'6px' }}>{label}<span style={{ fontSize:'11px', opacity:0.7 }}>{count}</span></button>
              ))}
            </div>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'14px' }}>⌕</span>
              <input style={{ paddingLeft:'30px', paddingRight:'12px', paddingTop:'7px', paddingBottom:'7px', width:'220px', backgroundColor:'#fff', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'12px', color:'#374151', outline:'none' }} placeholder="Search participants..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
          </div>
        )}

        <div style={{ backgroundColor:'#fff', borderRadius:'12px', border:'1px solid #e5e7eb', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>

          {tab==='users'&&<table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['User ID','Name','Email','Role','Status','Joined','Txns'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>{fi(users,['name','email','id']).map((u:any)=>(
              <tr key={u.id} style={{ cursor:'pointer' }} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')} onClick={()=>setSelU(u)}>
                <td style={td}><IdChip value={u.id.slice(0,8)+'...'}/></td>
                <td style={td}><span style={{ fontWeight:500, color:'#0f1428' }}>{u.name}</span></td>
                <td style={td}><span style={{ color:'#6b7280' }}>{u.email}</span></td>
                <td style={td}><span style={{ fontSize:'11px', color:'#6b7280', backgroundColor:'#f3f4f6', padding:'2px 8px', borderRadius:'4px', fontWeight:500 }}>{u.role}</span></td>
                <td style={td}><Badge status={u.status}/></td>
                <td style={td}><span style={{ color:'#9ca3af', fontSize:'12px' }}>{u.joined}</span></td>
                <td style={td}>{u.transactions}</td>
              </tr>
            ))}</tbody>
          </table>}

          {tab==='listings'&&<table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Listing ID','Title','Vendor','Category','Price','Status'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>{fi(listings,['title','vendor','id']).map((l:any)=>(
              <tr key={l.id} style={{ cursor:'pointer' }} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')} onClick={()=>setSelL(l)}>
                <td style={td}><IdChip value={l.id}/></td>
                <td style={td}><span style={{ fontWeight:500, color:'#0f1428' }}>{l.title}</span></td>
                <td style={td}><span style={{ color:'#6b7280' }}>{l.vendor}</span></td>
                <td style={td}><span style={{ fontSize:'11px', color:'#6b7280', backgroundColor:'#f3f4f6', padding:'2px 8px', borderRadius:'4px', fontWeight:500 }}>{l.category}</span></td>
                <td style={td}><span style={{ fontWeight:500 }}>${l.price.toLocaleString()}</span></td>
                <td style={td}><Badge status={l.status}/></td>
              </tr>
            ))}</tbody>
          </table>}

          {tab==='transactions'&&<table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Txn ID','Stripe ID','Buyer','Seller','Amount','Status','Date'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>{fi(transactions,['buyer','seller','id','stripe_id']).map((t:any)=>(
              <tr key={t.id} style={{ cursor:'pointer' }} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')} onClick={()=>setSelT(t)}>
                <td style={td}><IdChip value={t.id}/></td>
                <td style={td}><IdChip value={t.stripe_id.slice(0,20)+'...'}/></td>
                <td style={td}><span style={{ fontWeight:500, color:'#0f1428' }}>{t.buyer}</span></td>
                <td style={td}><span style={{ color:'#6b7280' }}>{t.seller}</span></td>
                <td style={td}><span style={{ fontWeight:500 }}>${t.amount.toLocaleString()}</span></td>
                <td style={td}><Badge status={t.status}/></td>
                <td style={td}><span style={{ color:'#9ca3af', fontSize:'12px' }}>{t.date}</span></td>
              </tr>
            ))}</tbody>
          </table>}

          {tab==='reviews'&&<table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Review ID','Author','About','Rating','Preview','Date',''].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>{fi(reviews,['author','target','content','id']).map((r:any)=>(
              <tr key={r.id} style={{ cursor:'pointer' }} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')} onClick={()=>setSelR(r)}>
                <td style={td}><IdChip value={r.id}/></td>
                <td style={td}><span style={{ fontWeight:500, color:'#0f1428' }}>{r.author}</span></td>
                <td style={td}><span style={{ color:'#6b7280' }}>{r.target}</span></td>
                <td style={td}><span style={{ color:r.rating>=4?'#2e7d32':r.rating>=3?'#b45309':'#c62828', letterSpacing:'1px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span></td>
                <td style={{ ...td, maxWidth:'220px' }}><span style={{ color:'#9ca3af', fontSize:'12px', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.content}</span></td>
                <td style={td}><span style={{ color:'#9ca3af', fontSize:'12px' }}>{r.date}</span></td>
                <td style={td}>{r.flagged&&<Badge status="flagged"/>}</td>
              </tr>
            ))}</tbody>
          </table>}

          {tab==='conversations'&&<table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Conv ID','Participants','Listing','Msgs','Last Activity','Risk','Keywords','Status',''].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>{filtC.map((c:any)=>{
              const ch = uniqueHits(c.messages.flatMap((m:any)=>detectKeywords(m.text)));
              const risk = Math.min(100, ch.length*18+(c.status==='flagged'?20:0));
              const rc = risk>=60?'#c62828':risk>=30?'#f57f17':'#2e7d32';
              return (
                <tr key={c.id} style={{ cursor:'pointer', backgroundColor:c.status==='flagged'&&!c.reviewed?'#fffbf5':'transparent' }} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor=c.status==='flagged'&&!c.reviewed?'#fffbf5':'transparent')} onClick={()=>setSelC(c)}>
                  <td style={td}><IdChip value={c.id.slice(0,14)+'...'}/></td>
                  <td style={td}><div style={{ fontWeight:500, color:'#0f1428', fontSize:'13px' }}>{c.participants[0]}</div><div style={{ color:'#9ca3af', fontSize:'12px' }}>{c.participants[1]}</div></td>
                  <td style={{ ...td, maxWidth:'150px' }}><span style={{ color:'#6b7280', fontSize:'12px', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.listing}</span></td>
                  <td style={td}><span style={{ color:'#6b7280' }}>{c.message_count}</span></td>
                  <td style={td}><span style={{ color:'#9ca3af', fontSize:'12px' }}>{new Date(c.last_message).toLocaleDateString()}</span></td>
                  <td style={td}><div style={{ display:'flex', alignItems:'center', gap:'6px' }}><div style={{ width:'44px', height:'5px', backgroundColor:'#f3f4f6', borderRadius:'3px', overflow:'hidden' }}><div style={{ width:`${risk}%`, height:'100%', backgroundColor:rc, borderRadius:'3px' }}/></div><span style={{ fontSize:'11px', color:rc, fontWeight:600 }}>{risk}</span></div></td>
                  <td style={td}>{ch.length>0?<div style={{ display:'flex', gap:'3px', flexWrap:'wrap' }}>{ch.slice(0,3).map((h:KWHit)=><KWChip key={h.word} word={h.word} category={h.category}/>)}{ch.length>3&&<span style={{ fontSize:'11px', color:'#9ca3af' }}>+{ch.length-3}</span>}</div>:<span style={{ color:'#d1d5db', fontSize:'12px' }}>None</span>}</td>
                  <td style={td}><Badge status={c.status}/></td>
                  <td style={td}>{c.reviewed&&<span style={{ fontSize:'11px', color:'#2e7d32', fontWeight:600 }}>✓ Reviewed</span>}</td>
                </tr>
              );
            })}</tbody>
          </table>}
        </div>
      </main>

      {selU&&<Modal title={selU.name} subtitle={selU.id} onClose={()=>setSelU(null)}>
        <DR label="User ID" value={<IdChip value={selU.id}/>}/>
        <DR label="Tawk.to ID" value={<IdChip value={selU.tawk_id}/>}/>
        <DR label="Email" value={selU.email}/>
        <DR label="Role" value={selU.role}/>
        <DR label="Status" value={<Badge status={selU.status}/>}/>
        <DR label="Joined" value={selU.joined}/>
        <DR label="Transactions" value={String(selU.transactions)}/>
        <div style={{ display:'flex', gap:'8px', marginTop:'24px', flexWrap:'wrap' }}>
          <Btn variant="primary" label="Edit Profile" onClick={()=>toast('Edit profile → Sharetribe API')}/>
          <Btn variant={selU.status==='suspended'?'success':'danger'} label={selU.status==='suspended'?'Unsuspend':'Suspend'} onClick={()=>{const n=selU.status==='suspended'?'active':'suspended';setUsers(users.map(u=>u.id===selU.id?{...u,status:n}:u));setSelU({...selU,status:n});toast(`User ${n}.`);}}/>
          <Btn label="Open in Tawk.to" onClick={()=>toast('Opening Tawk.to → '+selU.tawk_id)}/>
          <Btn label="View Conversations" onClick={()=>{setSelU(null);setTab('conversations');setSearch(selU.name);}}/>
        </div>
      </Modal>}

      {selL&&<Modal title={selL.title} subtitle={selL.id} onClose={()=>setSelL(null)}>
        <DR label="Listing ID" value={<IdChip value={selL.id}/>}/>
        <DR label="Vendor ID" value={<IdChip value={selL.vendor_id}/>}/>
        <DR label="Vendor" value={selL.vendor}/>
        <DR label="Category" value={selL.category}/>
        <DR label="Price" value={`$${selL.price.toLocaleString()}`}/>
        <DR label="Status" value={<Badge status={selL.status}/>}/>
        <div style={{ display:'flex', gap:'8px', marginTop:'24px', flexWrap:'wrap' }}>
          <Btn variant="primary" label="Edit Listing" onClick={()=>toast('Edit → Sharetribe API')}/>
          <Btn variant="success" label="Approve" onClick={()=>{setListings(listings.map(l=>l.id===selL.id?{...l,status:'active'}:l));setSelL({...selL,status:'active'});toast('Approved.');}}/>
          <Btn variant={selL.status==='suspended'?'success':'danger'} label={selL.status==='suspended'?'Unsuspend':'Suspend'} onClick={()=>{const n=selL.status==='suspended'?'active':'suspended';setListings(listings.map(l=>l.id===selL.id?{...l,status:n}:l));setSelL({...selL,status:n});toast(`Listing ${n}.`);}}/>
        </div>
      </Modal>}

      {selT&&<Modal title={'Transaction · '+selT.id} subtitle={selT.stripe_id} onClose={()=>setSelT(null)}>
        <DR label="Transaction ID" value={<IdChip value={selT.id}/>}/>
        <DR label="Stripe Payment ID" value={<IdChip value={selT.stripe_id}/>}/>
        <DR label="Buyer" value={selT.buyer}/>
        <DR label="Seller" value={selT.seller}/>
        <DR label="Amount" value={`$${selT.amount.toLocaleString()}`}/>
        <DR label="Status" value={<Badge status={selT.status}/>}/>
        <DR label="Date" value={selT.date}/>
        <DR label="Dispute" value={selT.disputed?<Badge status="disputed"/>:'None'}/>
        <div style={{ display:'flex', gap:'8px', marginTop:'24px', flexWrap:'wrap' }}>
          <Btn variant="primary" label="View in Stripe" onClick={()=>toast('Opening Stripe → '+selT.stripe_id)}/>
          <Btn variant="danger" label="Issue Refund" onClick={()=>{setTransactions(transactions.map(t=>t.id===selT.id?{...t,status:'refunded'}:t));setSelT({...selT,status:'refunded'});toast('Refund issued.');}}/>
          <Btn variant="success" label="Resolve Dispute" onClick={()=>{setTransactions(transactions.map(t=>t.id===selT.id?{...t,status:'completed',disputed:false}:t));setSelT({...selT,status:'completed',disputed:false});toast('Dispute resolved.');}}/>
        </div>
      </Modal>}

      {selR&&<Modal title={'Review by '+selR.author} subtitle={selR.id} onClose={()=>setSelR(null)}>
        <DR label="Review ID" value={<IdChip value={selR.id}/>}/>
        <DR label="Author ID" value={<IdChip value={selR.author_id}/>}/>
        <DR label="Target" value={selR.target}/>
        <DR label="Rating" value={<span style={{ color:selR.rating>=4?'#2e7d32':'#c62828' }}>{'★'.repeat(selR.rating)}{'☆'.repeat(5-selR.rating)}</span>}/>
        <DR label="Flagged" value={selR.flagged?<Badge status="flagged"/>:'No'}/>
        <div style={{ margin:'16px 0', padding:'16px', backgroundColor:'#f9fafb', borderRadius:'8px', fontSize:'14px', color:'#374151', lineHeight:1.7, border:'1px solid #f3f4f6' }}>{selR.content}</div>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <Btn variant={selR.flagged?'default':'warning'} label={selR.flagged?'Unflag':'Flag'} onClick={()=>{setReviews(reviews.map(r=>r.id===selR.id?{...r,flagged:!r.flagged}:r));setSelR({...selR,flagged:!selR.flagged});toast('Updated.');}}/>
          <Btn variant="danger" label="Remove" onClick={()=>{setReviews(reviews.filter(r=>r.id!==selR.id));setSelR(null);toast('Review removed.');}}/>
        </div>
      </Modal>}

      {selC&&<ConvModal conv={selC} onClose={()=>setSelC(null)} onReviewed={markRev} toast={toast} setTab={setTab} setSearch={setSearch}/>}

      <footer style={{ backgroundColor:'#0f1428', padding:'22px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'40px' }}>
        <Logo white/>
        <span style={{ color:'#4b5563', fontSize:'12px' }}>Support Console · Internal Use Only</span>
      </footer>
    </div>
  );
}
