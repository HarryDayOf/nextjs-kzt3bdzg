/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo, useRef } from 'react';

// ─── KEYWORD CATEGORIES ───────────────────────────────────────────────────────
const KEYWORD_CATEGORIES = {
  payment:     { label:'Payment',      color:'#c62828', bg:'#fdecea', words:['venmo','zelle','cashapp','cash app','paypal','wire transfer','bank transfer','western union','crypto','bitcoin'] },
  contact:     { label:'Contact',      color:'#b45309', bg:'#fff8e1', words:['text me','call me','whatsapp','instagram dm','facebook','@gmail','@yahoo','@icloud','@hotmail','my number','phone number'] },
  offplatform: { label:'Off-Platform', color:'#7c3aed', bg:'#f5f3ff', words:['off the app','off platform','outside the platform','my website','direct booking','book directly','bypass','avoid fees','save on fees','skip the platform'] },
} as const;
type KWCategory = keyof typeof KEYWORD_CATEGORIES;
type KWHit = { word:string; category:KWCategory };

function detectKeywords(text:string):KWHit[]{
  const lower=text.toLowerCase(); const hits:KWHit[]=[];
  (Object.keys(KEYWORD_CATEGORIES) as KWCategory[]).forEach(cat=>{
    KEYWORD_CATEGORIES[cat].words.forEach((word:string)=>{
      if(lower.includes(word)&&!hits.find(h=>h.word===word)) hits.push({word,category:cat});
    });
  });
  return hits;
}
function uniqueHits(hits:KWHit[]):KWHit[]{ return hits.filter((h,i,arr)=>arr.findIndex(x=>x.word===h.word)===i); }
function highlightKeywords(text:string):React.ReactNode{
  let parts:React.ReactNode[]=[text];
  (Object.keys(KEYWORD_CATEGORIES) as KWCategory[]).forEach(cat=>{
    const data=KEYWORD_CATEGORIES[cat];
    parts=parts.flatMap(node=>{
      if(typeof node!=='string') return [node];
      const result:React.ReactNode[]=[]; let rem=node;
      data.words.forEach((word:string)=>{
        const idx=rem.toLowerCase().indexOf(word);
        if(idx!==-1){
          if(idx>0) result.push(rem.slice(0,idx));
          result.push(<mark key={word+idx} style={{backgroundColor:data.bg,color:data.color,fontWeight:700,borderRadius:'3px',padding:'0 2px'}}>{rem.slice(idx,idx+word.length)}</mark>);
          rem=rem.slice(idx+word.length);
        }
      });
      result.push(rem); return result;
    });
  });
  return <>{parts}</>;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USERS:any[] = [
  {id:'6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04',name:'Sarah Chen',email:'sarah.chen@bloomday.co',role:'vendor',status:'active',joined:'2024-11-01',listings:3,transactions:12,tawk_id:'tawk_6f3a2c1e',revenue:4600},
  {id:'b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28',name:'Marcus Webb',email:'marcus.webb@gmail.com',role:'couple',status:'active',joined:'2025-01-15',listings:0,transactions:2,tawk_id:'tawk_b2e91d73',revenue:0},
  {id:'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96',name:'Bloom & Co Florals',email:'hello@bloomco.com',role:'vendor',status:'suspended',joined:'2024-09-10',listings:7,transactions:31,tawk_id:'tawk_a4f78c29',revenue:18200},
  {id:'c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34',name:'Jordan & Priya Ellis',email:'jordan.priya@icloud.com',role:'couple',status:'active',joined:'2025-02-01',listings:0,transactions:1,tawk_id:'tawk_c7d45e81',revenue:0},
  {id:'e9b12f47-7c3d-4e5a-b891-0a6c2f8d4e73',name:'Magnolia Events',email:'info@magnoliaevents.com',role:'vendor',status:'pending',joined:'2025-02-20',listings:0,transactions:0,tawk_id:'tawk_e9b12f47',revenue:0},
];
const MOCK_LISTINGS:any[] = [
  {id:'lst_4Hx9K2mPqR7vYnWd',title:'Full-Day Wedding Photography',vendor:'Sarah Chen',vendor_id:'6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04',price:3200,status:'active',category:'Photography',created:'2024-11-05'},
  {id:'lst_7Tz3J8nLwS1uXkBe',title:'Garden Floral Package',vendor:'Bloom & Co Florals',vendor_id:'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96',price:1800,status:'suspended',category:'Florals',created:'2024-09-15'},
  {id:'lst_2Rp6F4hQcM9yVjAg',title:'Luxury Floral Design',vendor:'Bloom & Co Florals',vendor_id:'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96',price:4500,status:'active',category:'Florals',created:'2024-10-01'},
  {id:'lst_9Kd1N7bUoE3wCfHs',title:'DJ + MC Package',vendor:'Magnolia Events',vendor_id:'e9b12f47-7c3d-4e5a-b891-0a6c2f8d4e73',price:2200,status:'pending_review',category:'Entertainment',created:'2025-02-20'},
  {id:'lst_5Mv8G2tIpZ6xDrWq',title:'Elopement Photography',vendor:'Sarah Chen',vendor_id:'6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04',price:1400,status:'active',category:'Photography',created:'2024-12-01'},
];
const MOCK_TRANSACTIONS:any[] = [
  {id:'txn_3Ks9Lx2mPqR7vYnW',stripe_id:'pi_3OqK2LHj8mTxNpQr1sBv7Ydc',buyer:'Marcus Webb',buyer_id:'b2e91d73',seller:'Sarah Chen',seller_id:'6f3a2c1e',listing:'Full-Day Wedding Photography',listing_id:'lst_4Hx9K2mPqR7vYnWd',amount:3200,status:'completed',date:'2025-01-20',disputed:false},
  {id:'txn_8Fh4Tz3J7nLwS1uX',stripe_id:'pi_8FhK9MNj2xRsWpLq4tYv3Bec',buyer:'Jordan & Priya Ellis',buyer_id:'c7d45e81',seller:'Bloom & Co Florals',seller_id:'a4f78c29',listing:'Luxury Floral Design',listing_id:'lst_2Rp6F4hQcM9yVjAg',amount:4500,status:'disputed',date:'2025-02-10',disputed:true},
  {id:'txn_1Rp5F4hQcM9yVjAg',stripe_id:'pi_1RpN7KLj4mQsXoWr9vBt2Ydh',buyer:'Marcus Webb',buyer_id:'b2e91d73',seller:'Bloom & Co Florals',seller_id:'a4f78c29',listing:'Garden Floral Package',listing_id:'lst_7Tz3J8nLwS1uXkBe',amount:1800,status:'refunded',date:'2024-12-15',disputed:false},
  {id:'txn_6Mv7G2tIpZ4xDrWq',stripe_id:'pi_6MvK3NHj9xPsRqLt2wYv8Bdf',buyer:'Jordan & Priya Ellis',buyer_id:'c7d45e81',seller:'Sarah Chen',seller_id:'6f3a2c1e',listing:'Elopement Photography',listing_id:'lst_5Mv8G2tIpZ6xDrWq',amount:1400,status:'pending',date:'2025-02-22',disputed:false},
  {id:'txn_2Px4Qw8Ry6Tz0Uv',stripe_id:'pi_2PxL5NKj7mQsRoWt9vBt1Ydh',buyer:'Marcus Webb',buyer_id:'b2e91d73',seller:'Sarah Chen',seller_id:'6f3a2c1e',listing:'Elopement Photography',listing_id:'lst_5Mv8G2tIpZ6xDrWq',amount:1400,status:'completed',date:'2025-02-01',disputed:false},
  {id:'txn_5Lm3Kn7Jo1Ip9Hq',stripe_id:'pi_5LmK8NHj3mQsRoWt6vBt2Ydh',buyer:'Jordan & Priya Ellis',buyer_id:'c7d45e81',seller:'Bloom & Co Florals',seller_id:'a4f78c29',listing:'Garden Floral Package',listing_id:'lst_7Tz3J8nLwS1uXkBe',amount:1800,status:'completed',date:'2025-01-05',disputed:false},
];
const MOCK_REVIEWS:any[] = [
  {id:'rev_2Ks8Lx9mPqR4vYnW',author:'Marcus Webb',author_id:'b2e91d73',target:'Sarah Chen',target_id:'6f3a2c1e',listing:'Full-Day Wedding Photography',listing_id:'lst_4Hx9K2mPqR7vYnWd',rating:5,content:'Absolutely incredible work. Sarah was calm, professional, and the photos exceeded everything we hoped for.',date:'2025-02-01',flagged:false},
  {id:'rev_9Fh3Tz4J8nLwS7uX',author:'Jordan & Priya Ellis',author_id:'c7d45e81',target:'Bloom & Co Florals',target_id:'a4f78c29',listing:'Luxury Floral Design',listing_id:'lst_2Rp6F4hQcM9yVjAg',rating:1,content:'They ghosted us two weeks before the wedding. Complete disaster. Do not book.',date:'2025-02-15',flagged:true},
  {id:'rev_4Rp6F1hQcM8yVjAg',author:'Marcus Webb',author_id:'b2e91d73',target:'Bloom & Co Florals',target_id:'a4f78c29',listing:'Garden Floral Package',listing_id:'lst_7Tz3J8nLwS1uXkBe',rating:2,content:'Arrangements were not what was agreed upon. Had to request a refund.',date:'2025-01-02',flagged:false},
];
const MOCK_CONVERSATIONS:any[] = [
  {id:'conv_A1b2C3d4E5f6G7h8',participants:['Marcus Webb','Sarah Chen'],listing:'Full-Day Wedding Photography',listing_id:'lst_4Hx9K2mPqR7vYnWd',txn_id:'txn_3Ks9Lx2mPqR7vYnW',message_count:6,last_message:'2025-01-18T10:42:00Z',reviewed:false,status:'clean',messages:[
    {id:'m1',sender:'Marcus Webb',role:'couple',text:"Hi Sarah! We came across your portfolio and love your style. We're getting married June 14th — do you have that date?",ts:'2025-01-10T09:15:00Z'},
    {id:'m2',sender:'Sarah Chen',role:'vendor',text:"Hi Marcus! Congratulations! June 14th is available. I'd love to learn more about your vision.",ts:'2025-01-10T10:02:00Z'},
    {id:'m3',sender:'Marcus Webb',role:'couple',text:"Garden ceremony at Foxcroft Estate, 120 guests. We want candid documentary-style coverage.",ts:'2025-01-10T11:30:00Z'},
    {id:'m4',sender:'Sarah Chen',role:'vendor',text:"Documentary is absolutely my approach. I've shot Foxcroft twice — great light in the late afternoon.",ts:'2025-01-11T08:45:00Z'},
    {id:'m5',sender:'Marcus Webb',role:'couple',text:"Perfect, we'd like to move forward. How do we book through the platform?",ts:'2025-01-12T14:20:00Z'},
    {id:'m6',sender:'Sarah Chen',role:'vendor',text:"Sounds great! Just proceed through the booking flow on the listing and we're all set.",ts:'2025-01-18T10:42:00Z'},
  ]},
  {id:'conv_B9c8D7e6F5g4H3i2',participants:['Jordan & Priya Ellis','Bloom & Co Florals'],listing:'Luxury Floral Design',listing_id:'lst_2Rp6F4hQcM9yVjAg',txn_id:'txn_8Fh4Tz3J7nLwS1uX',message_count:8,last_message:'2025-02-08T14:17:00Z',reviewed:false,status:'flagged',messages:[
    {id:'m1',sender:'Jordan & Priya Ellis',role:'couple',text:"Hello! We love the Luxury Floral Design package. What's included for 150 guests?",ts:'2025-01-28T10:00:00Z'},
    {id:'m2',sender:'Bloom & Co Florals',role:'vendor',text:"Hi! For 150 guests: 15 centerpieces, full ceremony arch, bridal bouquets, and boutonnieres.",ts:'2025-01-28T11:15:00Z'},
    {id:'m3',sender:'Jordan & Priya Ellis',role:'couple',text:"Any add-ons for cocktail hour florals?",ts:'2025-01-29T09:30:00Z'},
    {id:'m4',sender:'Bloom & Co Florals',role:'vendor',text:"Yes — and actually if you want to save on fees just Venmo me directly, I can give you a better rate.",ts:'2025-02-01T13:45:00Z'},
    {id:'m5',sender:'Jordan & Priya Ellis',role:'couple',text:"We're not comfortable going outside the platform. Can we keep everything through Day Of?",ts:'2025-02-02T08:20:00Z'},
    {id:'m6',sender:'Bloom & Co Florals',role:'vendor',text:"Totally fine! Let's proceed through the platform.",ts:'2025-02-02T09:05:00Z'},
    {id:'m7',sender:'Jordan & Priya Ellis',role:'couple',text:"Great, we booked it.",ts:'2025-02-05T11:00:00Z'},
    {id:'m8',sender:'Bloom & Co Florals',role:'vendor',text:"Wonderful! We'll be in touch.",ts:'2025-02-08T14:17:00Z'},
  ]},
  {id:'conv_C4d3E2f1G8h7I6j5',participants:['Marcus Webb','Bloom & Co Florals'],listing:'Garden Floral Package',listing_id:'lst_7Tz3J8nLwS1uXkBe',txn_id:'txn_1Rp5F4hQcM9yVjAg',message_count:5,last_message:'2024-12-10T09:05:00Z',reviewed:true,status:'flagged',messages:[
    {id:'m1',sender:'Marcus Webb',role:'couple',text:"Hi, interested in the Garden Floral Package.",ts:'2024-12-05T10:00:00Z'},
    {id:'m2',sender:'Bloom & Co Florals',role:'vendor',text:"Hi Marcus! Email me at hello@bloomco.com — easier to coordinate off platform.",ts:'2024-12-05T11:30:00Z'},
    {id:'m3',sender:'Marcus Webb',role:'couple',text:"Sure. Do you take Zelle?",ts:'2024-12-06T09:15:00Z'},
    {id:'m4',sender:'Bloom & Co Florals',role:'vendor',text:"Yes, Zelle works! We can book directly and avoid the platform fees.",ts:'2024-12-07T14:00:00Z'},
    {id:'m5',sender:'Marcus Webb',role:'couple',text:"Actually going to stick to the platform.",ts:'2024-12-10T09:05:00Z'},
  ]},
  {id:'conv_D5e4F3g2H1i8J7k6',participants:['Jordan & Priya Ellis','Sarah Chen'],listing:'Elopement Photography',listing_id:'lst_5Mv8G2tIpZ6xDrWq',txn_id:'txn_6Mv7G2tIpZ4xDrWq',message_count:4,last_message:'2025-02-21T16:30:00Z',reviewed:false,status:'clean',messages:[
    {id:'m1',sender:'Jordan & Priya Ellis',role:'couple',text:"Hi Sarah! Planning a small elopement at Blue Ridge in March — just us and our dog.",ts:'2025-02-18T14:00:00Z'},
    {id:'m2',sender:'Sarah Chen',role:'vendor',text:"That sounds beautiful! My elopement package covers 4 hours, all locations, includes pups!",ts:'2025-02-19T09:20:00Z'},
    {id:'m3',sender:'Jordan & Priya Ellis',role:'couple',text:"Amazing. What time works for a quick call to go over the shot list?",ts:'2025-02-20T11:00:00Z'},
    {id:'m4',sender:'Sarah Chen',role:'vendor',text:"Free Thursday after 2pm or Friday morning. Book through the platform!",ts:'2025-02-21T16:30:00Z'},
  ]},
];

// ─── STATUS / STYLE MAPS ──────────────────────────────────────────────────────
const SM:Record<string,{label:string;bg:string;color:string}> = {
  active:{label:'Active',bg:'#e8f5e9',color:'#2e7d32'},suspended:{label:'Suspended',bg:'#fdecea',color:'#c62828'},
  pending:{label:'Pending',bg:'#fff8e1',color:'#f57f17'},pending_review:{label:'Pending Review',bg:'#fff8e1',color:'#f57f17'},
  completed:{label:'Completed',bg:'#e8f5e9',color:'#2e7d32'},disputed:{label:'Disputed',bg:'#fdecea',color:'#c62828'},
  refunded:{label:'Refunded',bg:'#f3f4f6',color:'#6b7280'},flagged:{label:'Flagged',bg:'#fff3e0',color:'#e65100'},
  clean:{label:'Clean',bg:'#e8f5e9',color:'#2e7d32'},
};

// ─── EXPORT HELPERS ───────────────────────────────────────────────────────────
function downloadCSV(rows:any[], filename:string){
  if(!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map(r=>keys.map(k=>{
    const v = String(r[k]??'').replace(/"/g,'""');
    return v.includes(',')||v.includes('"')||v.includes('\n')?`"${v}"`:v;
  }).join(','))].join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
}

function printTable(title:string, rows:any[], columns:{key:string;label:string}[]){
  const html = `<!DOCTYPE html><html><head><title>${title}</title>
  <style>body{font-family:Georgia,serif;padding:32px;color:#111}h1{font-size:20px;margin-bottom:4px}p.meta{color:#888;font-size:12px;margin-bottom:24px}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#f3f4f6;padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#555;border-bottom:2px solid #e5e7eb}td{padding:8px 12px;border-bottom:1px solid #f3f4f6}tr:nth-child(even)td{background:#fafafa}@media print{body{padding:16px}}</style>
  </head><body>
  <h1>${title}</h1><p class="meta">Generated ${new Date().toLocaleString()} · ${rows.length} records</p>
  <table><thead><tr>${columns.map(c=>`<th>${c.label}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(r=>`<tr>${columns.map(c=>`<td>${r[c.key]??''}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></body></html>`;
  const w = window.open('','_blank'); if(!w) return;
  w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(),400);
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
function Badge({status}:{status:string}){
  const s=SM[status]??{label:status,bg:'#f3f4f6',color:'#6b7280'};
  return <span style={{display:'inline-block',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,backgroundColor:s.bg,color:s.color}}>{s.label}</span>;
}
function IdChip({value}:{value:string}){
  return <span style={{fontFamily:'monospace',fontSize:'11px',color:'#6b7280',backgroundColor:'#f3f4f6',padding:'2px 7px',borderRadius:'4px'}}>{value}</span>;
}
function KWChip({word,category}:{word:string;category:KWCategory}){
  const cat=KEYWORD_CATEGORIES[category];
  return <span style={{fontFamily:'monospace',fontSize:'11px',color:cat.color,backgroundColor:cat.bg,padding:'2px 8px',borderRadius:'4px',fontWeight:600,border:`1px solid ${cat.color}30`}}>{word}</span>;
}
function Btn({label,variant='default',onClick,small}:{label:string;variant?:string;onClick:()=>void;small?:boolean}){
  const vs:Record<string,any>={
    default:{bg:'#f9fafb',border:'#e5e7eb',color:'#374151'},
    primary:{bg:'#0f1428',border:'#0f1428',color:'#fff'},
    danger:{bg:'#fdecea',border:'#fca5a5',color:'#c62828'},
    success:{bg:'#e8f5e9',border:'#86efac',color:'#2e7d32'},
    warning:{bg:'#fff8e1',border:'#fcd34d',color:'#b45309'},
    ghost:{bg:'transparent',border:'transparent',color:'#6b7280'},
  };
  const v=vs[variant]??vs.default;
  return <button onClick={onClick} style={{padding:small?'5px 10px':'8px 16px',backgroundColor:v.bg,border:`1px solid ${v.border}`,borderRadius:'8px',color:v.color,fontSize:small?'12px':'13px',cursor:'pointer',fontWeight:500,whiteSpace:'nowrap'}}>{label}</button>;
}
function Logo({white}:{white?:boolean}){
  const c=white?'#fff':'#0f1428';
  return <div style={{display:'inline-flex',alignItems:'baseline',fontFamily:'Georgia,serif',fontWeight:700,fontSize:'20px',color:c,letterSpacing:'-0.02em'}}>Day<span style={{position:'relative',display:'inline-block'}}>O<span style={{position:'absolute',top:'1px',right:'-4px',width:'5px',height:'5px',borderRadius:'50%',backgroundColor:c,display:'inline-block'}}/></span><span style={{marginLeft:'9px'}}>f</span></div>;
}
function Modal({title,subtitle,children,onClose,wide,extraWide}:{title:string;subtitle?:string;children:React.ReactNode;onClose:()=>void;wide?:boolean;extraWide?:boolean}){
  return(
    <div style={{position:'fixed',inset:0,backgroundColor:'rgba(15,20,40,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}} onClick={onClose}>
      <div style={{backgroundColor:'#fff',borderRadius:'12px',boxShadow:'0 20px 60px rgba(15,20,40,0.2)',padding:'32px',width:extraWide?'960px':wide?'760px':'580px',maxWidth:'97vw',maxHeight:'92vh',overflowY:'auto'}} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px'}}>
          <div>
            <div style={{fontSize:'17px',fontWeight:600,color:'#0f1428',marginBottom:'2px'}}>{title}</div>
            {subtitle&&<div style={{fontSize:'12px',color:'#9ca3af',fontFamily:'monospace'}}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#9ca3af',cursor:'pointer',fontSize:'22px',lineHeight:1,paddingLeft:'16px'}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function DR({label,value}:{label:string;value:React.ReactNode}){
  return(
    <div style={{display:'flex',gap:'16px',padding:'10px 0',borderBottom:'1px solid #f3f4f6',alignItems:'flex-start'}}>
      <span style={{color:'#9ca3af',fontSize:'12px',minWidth:'150px',fontWeight:500,paddingTop:'1px'}}>{label}</span>
      <span style={{color:'#1f2937',fontSize:'13px',flex:1}}>{value}</span>
    </div>
  );
}

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
function FilterPanel({filters,setFilters,tab}:{filters:any;setFilters:(f:any)=>void;tab:string}){
  const [open,setOpen]=useState(false);
  const f=filters;
  const set=(k:string,v:any)=>setFilters({...f,[k]:v});
  const hasActive=Object.entries(f).some(([k,v])=>k!=='sort'&&v!==''&&v!==null&&v!==undefined);

  const inp=(k:string,placeholder:string,type='text')=>(
    <input type={type} placeholder={placeholder} value={f[k]||''} onChange={e=>set(k,e.target.value)}
      style={{padding:'7px 10px',border:'1px solid #e5e7eb',borderRadius:'7px',fontSize:'12px',color:'#374151',outline:'none',width:'100%',backgroundColor:'#fff'}}/>
  );
  const sel=(k:string,opts:[string,string][])=>(
    <select value={f[k]||''} onChange={e=>set(k,e.target.value)}
      style={{padding:'7px 10px',border:'1px solid #e5e7eb',borderRadius:'7px',fontSize:'12px',color:'#374151',outline:'none',width:'100%',backgroundColor:'#fff'}}>
      <option value=''>All</option>
      {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
    </select>
  );

  return(
    <div style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)} style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 14px',backgroundColor:hasActive?'#0f1428':'#fff',border:'1px solid '+(hasActive?'#0f1428':'#e5e7eb'),borderRadius:'8px',fontSize:'13px',color:hasActive?'#fff':'#374151',cursor:'pointer',fontWeight:500}}>
        <span>⊟</span> Filters {hasActive&&<span style={{backgroundColor:'rgba(255,255,255,0.25)',borderRadius:'10px',padding:'1px 6px',fontSize:'11px',fontWeight:700}}>{Object.entries(f).filter(([k,v])=>k!=='sort'&&v!==''&&v!==null&&v!==undefined).length}</span>}
      </button>
      {open&&(
        <div style={{position:'absolute',top:'44px',left:0,backgroundColor:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',boxShadow:'0 8px 32px rgba(0,0,0,0.12)',padding:'20px',zIndex:50,minWidth:'320px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          <div style={{gridColumn:'1/-1',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
            <span style={{fontSize:'12px',fontWeight:600,color:'#374151',textTransform:'uppercase',letterSpacing:'0.06em'}}>Filters</span>
            <button onClick={()=>{setFilters({sort:f.sort});setOpen(false);}} style={{fontSize:'12px',color:'#9ca3af',background:'none',border:'none',cursor:'pointer'}}>Clear all</button>
          </div>
          {(tab==='users')&&<>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>ROLE</div>{sel('role',[['vendor','Vendor'],['couple','Couple']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>STATUS</div>{sel('status',[['active','Active'],['suspended','Suspended'],['pending','Pending']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>JOINED AFTER</div>{inp('joined_after','YYYY-MM-DD','date')}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>JOINED BEFORE</div>{inp('joined_before','YYYY-MM-DD','date')}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>MIN TRANSACTIONS</div>{inp('min_txns','0','number')}</div>
          </>}
          {(tab==='listings')&&<>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>STATUS</div>{sel('status',[['active','Active'],['suspended','Suspended'],['pending_review','Pending Review']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>CATEGORY</div>{sel('category',[['Photography','Photography'],['Florals','Florals'],['Entertainment','Entertainment']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>MIN PRICE ($)</div>{inp('min_price','0','number')}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>MAX PRICE ($)</div>{inp('max_price','99999','number')}</div>
          </>}
          {(tab==='transactions')&&<>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>STATUS</div>{sel('status',[['completed','Completed'],['disputed','Disputed'],['refunded','Refunded'],['pending','Pending']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>DISPUTED</div>{sel('disputed',[['yes','Disputed only'],['no','Non-disputed']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>DATE AFTER</div>{inp('date_after','YYYY-MM-DD','date')}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>DATE BEFORE</div>{inp('date_before','YYYY-MM-DD','date')}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>MIN AMOUNT ($)</div>{inp('min_amount','0','number')}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>MAX AMOUNT ($)</div>{inp('max_amount','99999','number')}</div>
            <div style={{gridColumn:'1/-1'}}><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>SELLER</div>{inp('seller','Filter by seller name')}</div>
            <div style={{gridColumn:'1/-1'}}><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>BUYER</div>{inp('buyer','Filter by buyer name')}</div>
          </>}
          {(tab==='reviews')&&<>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>FLAGGED</div>{sel('flagged',[['yes','Flagged only'],['no','Not flagged']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>MIN RATING</div>{sel('min_rating',[['1','1+'],['2','2+'],['3','3+'],['4','4+'],['5','5 only']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>MAX RATING</div>{sel('max_rating',[['1','1 only'],['2','2 or less'],['3','3 or less'],['4','4 or less'],['5','Any']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>DATE AFTER</div>{inp('date_after','YYYY-MM-DD','date')}</div>
          </>}
          {(tab==='conversations')&&<>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>STATUS</div>{sel('status',[['flagged','Flagged'],['clean','Clean']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>REVIEWED</div>{sel('reviewed',[['yes','Reviewed'],['no','Unreviewed']])}</div>
            <div><div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',fontWeight:600}}>KEYWORD TYPE</div>{sel('kw_category',[['payment','Payment'],['contact','Contact'],['offplatform','Off-Platform']])}</div>
          </>}
          <div style={{gridColumn:'1/-1',paddingTop:'8px',borderTop:'1px solid #f3f4f6',display:'flex',justifyContent:'flex-end'}}>
            <Btn label="Apply" variant="primary" onClick={()=>setOpen(false)} small/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SORT CONTROL ─────────────────────────────────────────────────────────────
function SortBtn({label,sortKey,current,onSort}:{label:string;sortKey:string;current:string;onSort:(k:string)=>void}){
  const active=current===sortKey||current==='-'+sortKey;
  const desc=current==='-'+sortKey;
  return(
    <button onClick={()=>onSort(active&&!desc?'-'+sortKey:sortKey)} style={{display:'inline-flex',alignItems:'center',gap:'3px',background:'none',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:600,color:active?'#0f1428':'#9ca3af',letterSpacing:'0.06em',textTransform:'uppercase',padding:'10px 16px',whiteSpace:'nowrap'}}>
      {label}{active&&<span style={{fontSize:'10px'}}>{desc?'▼':'▲'}</span>}
    </button>
  );
}

// ─── GLOBAL SEARCH RESULTS ────────────────────────────────────────────────────
function GlobalSearchResults({query,data,onNavigate}:{query:string;data:any;onNavigate:(tab:string,item:any)=>void}){
  if(!query.trim()) return null;
  const q=query.toLowerCase();
  const matchU=data.users.filter((u:any)=>u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)||u.id.toLowerCase().includes(q));
  const matchL=data.listings.filter((l:any)=>l.title.toLowerCase().includes(q)||l.vendor.toLowerCase().includes(q)||l.id.toLowerCase().includes(q));
  const matchT=data.transactions.filter((t:any)=>t.buyer.toLowerCase().includes(q)||t.seller.toLowerCase().includes(q)||t.id.toLowerCase().includes(q)||t.stripe_id.toLowerCase().includes(q));
  const matchR=data.reviews.filter((r:any)=>r.author.toLowerCase().includes(q)||r.target.toLowerCase().includes(q)||r.content.toLowerCase().includes(q));
  const matchC=data.conversations.filter((c:any)=>c.participants.some((p:string)=>p.toLowerCase().includes(q))||c.listing.toLowerCase().includes(q)||c.id.toLowerCase().includes(q));
  const total=matchU.length+matchL.length+matchT.length+matchR.length+matchC.length;
  if(!total) return(
    <div style={{position:'absolute',top:'46px',left:0,right:0,backgroundColor:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',boxShadow:'0 8px 32px rgba(0,0,0,0.12)',padding:'24px',zIndex:60,textAlign:'center',color:'#9ca3af',fontSize:'13px'}}>
      No results for "{query}"
    </div>
  );
  const Section=({label,items,tab,renderItem}:{label:string;items:any[];tab:string;renderItem:(i:any)=>React.ReactNode})=>{
    if(!items.length) return null;
    return(
      <div style={{marginBottom:'12px'}}>
        <div style={{fontSize:'10px',fontWeight:700,color:'#9ca3af',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0 12px 6px'}}>{label} · {items.length}</div>
        {items.slice(0,4).map((item:any,idx:number)=>(
          <div key={idx} onClick={()=>onNavigate(tab,item)} style={{padding:'8px 12px',cursor:'pointer',borderRadius:'6px',display:'flex',alignItems:'center',gap:'10px'}} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#f9fafb')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  };
  return(
    <div style={{position:'absolute',top:'46px',left:0,right:0,backgroundColor:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',boxShadow:'0 8px 32px rgba(0,0,0,0.12)',padding:'12px',zIndex:60,maxHeight:'480px',overflowY:'auto'}}>
      <div style={{fontSize:'12px',color:'#9ca3af',padding:'0 12px 10px',borderBottom:'1px solid #f3f4f6',marginBottom:'10px'}}>{total} result{total!==1?'s':''} for "{query}"</div>
      <Section label="Users" items={matchU} tab="users" renderItem={u=><><div style={{width:28,height:28,borderRadius:'50%',backgroundColor:'#0f1428',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'11px',fontWeight:600,flexShrink:0}}>{u.name[0]}</div><div><div style={{fontSize:'13px',fontWeight:500,color:'#0f1428'}}>{u.name}</div><div style={{fontSize:'11px',color:'#9ca3af'}}>{u.email} · {u.role}</div></div><Badge status={u.status}/></>}/>
      <Section label="Listings" items={matchL} tab="listings" renderItem={l=><><div style={{width:28,height:28,borderRadius:'6px',backgroundColor:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>📋</div><div><div style={{fontSize:'13px',fontWeight:500,color:'#0f1428'}}>{l.title}</div><div style={{fontSize:'11px',color:'#9ca3af'}}>{l.vendor} · ${l.price.toLocaleString()}</div></div><Badge status={l.status}/></>}/>
      <Section label="Transactions" items={matchT} tab="transactions" renderItem={t=><><div style={{width:28,height:28,borderRadius:'6px',backgroundColor:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>💳</div><div><div style={{fontSize:'13px',fontWeight:500,color:'#0f1428'}}>{t.buyer} → {t.seller}</div><div style={{fontSize:'11px',color:'#9ca3af'}}>${t.amount.toLocaleString()} · {t.date}</div></div><Badge status={t.status}/></>}/>
      <Section label="Reviews" items={matchR} tab="reviews" renderItem={r=><><div style={{fontSize:'14px',flexShrink:0}}>{'★'.repeat(r.rating)}</div><div><div style={{fontSize:'13px',fontWeight:500,color:'#0f1428'}}>{r.author} → {r.target}</div><div style={{fontSize:'11px',color:'#9ca3af',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'300px'}}>{r.content}</div></div></>}/>
      <Section label="Conversations" items={matchC} tab="conversations" renderItem={c=><><div style={{width:28,height:28,borderRadius:'6px',backgroundColor:c.status==='flagged'?'#fdecea':'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>{c.status==='flagged'?'⚠':'💬'}</div><div><div style={{fontSize:'13px',fontWeight:500,color:'#0f1428'}}>{c.participants.join(' + ')}</div><div style={{fontSize:'11px',color:'#9ca3af'}}>{c.listing}</div></div><Badge status={c.status}/></>}/>
    </div>
  );
}

// ─── REPORTS PANEL ────────────────────────────────────────────────────────────
function ReportsModal({data,onClose}:{data:any;onClose:()=>void}){
  const [active,setActive]=useState('overview');

  const totalRevenue=data.transactions.filter((t:any)=>t.status==='completed').reduce((s:number,t:any)=>s+t.amount,0);
  const disputed=data.transactions.filter((t:any)=>t.disputed);
  const suspended=data.users.filter((u:any)=>u.status==='suspended');
  const flaggedConvs=data.conversations.filter((c:any)=>c.status==='flagged');
  const unreviewedConvs=flaggedConvs.filter((c:any)=>!c.reviewed);

  const reports=[
    {id:'overview',label:'Platform Overview'},
    {id:'transactions',label:'Transaction Report'},
    {id:'flags',label:'Flagged Conversations'},
    {id:'users',label:'User Report'},
  ];

  const exportReport=(id:string)=>{
    if(id==='transactions') downloadCSV(data.transactions.map((t:any)=>({ID:t.id,'Stripe ID':t.stripe_id,Buyer:t.buyer,Seller:t.seller,Amount:t.amount,Status:t.status,Date:t.date,Disputed:t.disputed?'Yes':'No'})),'dayof-transactions.csv');
    if(id==='flags') downloadCSV(flaggedConvs.map((c:any)=>({ID:c.id,'Participant 1':c.participants[0],'Participant 2':c.participants[1],Listing:c.listing,Status:c.status,Reviewed:c.reviewed?'Yes':'No','Last Message':c.last_message})),'dayof-flagged-conversations.csv');
    if(id==='users') downloadCSV(data.users.map((u:any)=>({ID:u.id,Name:u.name,Email:u.email,Role:u.role,Status:u.status,Joined:u.joined,Transactions:u.transactions})),'dayof-users.csv');
  };

  const printReport=(id:string)=>{
    if(id==='transactions') printTable('Transaction Report',data.transactions,[{key:'id',label:'ID'},{key:'buyer',label:'Buyer'},{key:'seller',label:'Seller'},{key:'amount',label:'Amount'},{key:'status',label:'Status'},{key:'date',label:'Date'}]);
    if(id==='flags') printTable('Flagged Conversations Report',flaggedConvs,[{key:'id',label:'ID'},{key:'participants',label:'Participants'},{key:'listing',label:'Listing'},{key:'status',label:'Status'},{key:'reviewed',label:'Reviewed'}]);
    if(id==='users') printTable('User Report',data.users,[{key:'id',label:'ID'},{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'role',label:'Role'},{key:'status',label:'Status'},{key:'joined',label:'Joined'}]);
  };

  const StatCard=({label,value,sub,color}:{label:string;value:string|number;sub?:string;color?:string})=>(
    <div style={{backgroundColor:'#f9fafb',border:'1px solid #f3f4f6',borderRadius:'10px',padding:'16px 20px'}}>
      <div style={{fontSize:'11px',color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'6px'}}>{label}</div>
      <div style={{fontSize:'24px',fontWeight:700,color:color||'#0f1428',marginBottom:'2px'}}>{value}</div>
      {sub&&<div style={{fontSize:'12px',color:'#9ca3af'}}>{sub}</div>}
    </div>
  );

  return(
    <Modal title="Reports" onClose={onClose} extraWide>
      <div style={{display:'flex',gap:'24px'}}>
        <div style={{width:'180px',flexShrink:0}}>
          {reports.map(r=>(
            <button key={r.id} onClick={()=>setActive(r.id)} style={{width:'100%',textAlign:'left',padding:'10px 14px',backgroundColor:active===r.id?'#f3f4f6':'transparent',border:'none',borderRadius:'8px',fontSize:'13px',color:active===r.id?'#0f1428':'#6b7280',cursor:'pointer',fontWeight:active===r.id?600:400,marginBottom:'2px'}}>
              {r.label}
            </button>
          ))}
        </div>
        <div style={{flex:1,borderLeft:'1px solid #f3f4f6',paddingLeft:'24px'}}>

          {active==='overview'&&(
            <div>
              <div style={{fontSize:'15px',fontWeight:600,color:'#0f1428',marginBottom:'16px'}}>Platform Overview</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
                <StatCard label="Total Revenue" value={'$'+totalRevenue.toLocaleString()} sub="Completed transactions"/>
                <StatCard label="Active Users" value={data.users.filter((u:any)=>u.status==='active').length} sub={`of ${data.users.length} total`}/>
                <StatCard label="Active Listings" value={data.listings.filter((l:any)=>l.status==='active').length} sub={`of ${data.listings.length} total`}/>
                <StatCard label="Disputed Transactions" value={disputed.length} color={disputed.length>0?'#c62828':undefined} sub={`$`+disputed.reduce((s:number,t:any)=>s+t.amount,0).toLocaleString()+' at risk'}/>
                <StatCard label="Suspended Users" value={suspended.length} color={suspended.length>0?'#c62828':undefined}/>
                <StatCard label="Flagged Conversations" value={flaggedConvs.length} color={flaggedConvs.length>0?'#e65100':undefined} sub={`${unreviewedConvs.length} unreviewed`}/>
              </div>
              <div style={{fontSize:'13px',color:'#6b7280',backgroundColor:'#f9fafb',borderRadius:'8px',padding:'14px 16px',border:'1px solid #f3f4f6'}}>
                Generated {new Date().toLocaleString()} · Data is mock — Abhi will wire up live Sharetribe API calls.
              </div>
            </div>
          )}

          {active==='transactions'&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={{fontSize:'15px',fontWeight:600,color:'#0f1428'}}>Transaction Report</div>
                <div style={{display:'flex',gap:'8px'}}>
                  <Btn small label="⬇ CSV" variant="default" onClick={()=>exportReport('transactions')}/>
                  <Btn small label="🖨 Print / PDF" variant="default" onClick={()=>printReport('transactions')}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'20px'}}>
                <StatCard label="Total Volume" value={'$'+data.transactions.reduce((s:number,t:any)=>s+t.amount,0).toLocaleString()}/>
                <StatCard label="Completed" value={data.transactions.filter((t:any)=>t.status==='completed').length}/>
                <StatCard label="Disputed" value={data.transactions.filter((t:any)=>t.disputed).length} color="#c62828"/>
                <StatCard label="Refunded" value={data.transactions.filter((t:any)=>t.status==='refunded').length} color="#b45309"/>
              </div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                <thead><tr style={{backgroundColor:'#fafafa'}}>{['ID','Buyer','Seller','Amount','Status','Date','Disputed'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',fontSize:'11px',fontWeight:600,color:'#9ca3af',borderBottom:'1px solid #f3f4f6',textTransform:'uppercase',letterSpacing:'0.04em'}}>{h}</th>)}</tr></thead>
                <tbody>{data.transactions.map((t:any)=>(
                  <tr key={t.id} style={{borderBottom:'1px solid #f9fafb'}}>
                    <td style={{padding:'8px 12px'}}><IdChip value={t.id.slice(0,12)+'...'}/></td>
                    <td style={{padding:'8px 12px',fontWeight:500,color:'#0f1428'}}>{t.buyer}</td>
                    <td style={{padding:'8px 12px',color:'#6b7280'}}>{t.seller}</td>
                    <td style={{padding:'8px 12px',fontWeight:600}}>${t.amount.toLocaleString()}</td>
                    <td style={{padding:'8px 12px'}}><Badge status={t.status}/></td>
                    <td style={{padding:'8px 12px',color:'#9ca3af'}}>{t.date}</td>
                    <td style={{padding:'8px 12px'}}>{t.disputed&&<span style={{color:'#c62828',fontWeight:600,fontSize:'11px'}}>⚠ Yes</span>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          {active==='flags'&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={{fontSize:'15px',fontWeight:600,color:'#0f1428'}}>Flagged Conversations</div>
                <div style={{display:'flex',gap:'8px'}}>
                  <Btn small label="⬇ CSV" variant="default" onClick={()=>exportReport('flags')}/>
                  <Btn small label="🖨 Print / PDF" variant="default" onClick={()=>printReport('flags')}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'20px'}}>
                <StatCard label="Total Flagged" value={flaggedConvs.length} color="#e65100"/>
                <StatCard label="Unreviewed" value={unreviewedConvs.length} color={unreviewedConvs.length>0?'#c62828':undefined}/>
                <StatCard label="Reviewed" value={flaggedConvs.filter((c:any)=>c.reviewed).length} color="#2e7d32"/>
              </div>
              {flaggedConvs.map((c:any)=>{
                const hits=uniqueHits(c.messages.flatMap((m:any)=>detectKeywords(m.text)));
                return(
                  <div key={c.id} style={{border:'1px solid #fca5a5',borderRadius:'8px',padding:'14px 16px',marginBottom:'10px',backgroundColor:'#fffbf9'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                      <div>
                        <div style={{fontWeight:600,color:'#0f1428',fontSize:'13px'}}>{c.participants.join(' + ')}</div>
                        <div style={{fontSize:'11px',color:'#9ca3af'}}>{c.listing} · <IdChip value={c.id}/></div>
                      </div>
                      <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                        {c.reviewed&&<span style={{fontSize:'11px',color:'#2e7d32',fontWeight:600}}>✓ Reviewed</span>}
                        <Badge status="flagged"/>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                      {hits.map((h:KWHit)=><KWChip key={h.word} word={h.word} category={h.category}/>)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {active==='users'&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <div style={{fontSize:'15px',fontWeight:600,color:'#0f1428'}}>User Report</div>
                <div style={{display:'flex',gap:'8px'}}>
                  <Btn small label="⬇ CSV" variant="default" onClick={()=>exportReport('users')}/>
                  <Btn small label="🖨 Print / PDF" variant="default" onClick={()=>printReport('users')}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'20px'}}>
                <StatCard label="Total Users" value={data.users.length}/>
                <StatCard label="Vendors" value={data.users.filter((u:any)=>u.role==='vendor').length}/>
                <StatCard label="Couples" value={data.users.filter((u:any)=>u.role==='couple').length}/>
                <StatCard label="Suspended" value={suspended.length} color={suspended.length>0?'#c62828':undefined}/>
              </div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                <thead><tr style={{backgroundColor:'#fafafa'}}>{['Name','Email','Role','Status','Joined','Txns'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',fontSize:'11px',fontWeight:600,color:'#9ca3af',borderBottom:'1px solid #f3f4f6',textTransform:'uppercase',letterSpacing:'0.04em'}}>{h}</th>)}</tr></thead>
                <tbody>{data.users.map((u:any)=>(
                  <tr key={u.id} style={{borderBottom:'1px solid #f9fafb'}}>
                    <td style={{padding:'8px 12px',fontWeight:500,color:'#0f1428'}}>{u.name}</td>
                    <td style={{padding:'8px 12px',color:'#6b7280'}}>{u.email}</td>
                    <td style={{padding:'8px 12px'}}><span style={{fontSize:'11px',color:'#6b7280',backgroundColor:'#f3f4f6',padding:'2px 8px',borderRadius:'4px'}}>{u.role}</span></td>
                    <td style={{padding:'8px 12px'}}><Badge status={u.status}/></td>
                    <td style={{padding:'8px 12px',color:'#9ca3af'}}>{u.joined}</td>
                    <td style={{padding:'8px 12px'}}>{u.transactions}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
}

// ─── CONVERSATION MODAL ───────────────────────────────────────────────────────
function ConvModal({conv,onClose,onReviewed,toast,setTab,setSearch}:any){
  const allHits=conv.messages.flatMap((m:any)=>detectKeywords(m.text));
  const hits=uniqueHits(allHits);
  const risk=Math.min(100,hits.length*18+(conv.status==='flagged'?20:0));
  const rc=risk>=60?'#c62828':risk>=30?'#f57f17':'#2e7d32';
  const rl=risk>=60?'High Risk':risk>=30?'Medium Risk':'Low Risk';
  return(
    <Modal title="Conversation Thread" subtitle={conv.id} onClose={onClose} wide>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'20px'}}>
        {([['Participants',conv.participants.join(' + ')],['Listing',conv.listing],['Transaction',conv.txn_id??'—']] as [string,string][]).map(([l,v])=>(
          <div key={l} style={{backgroundColor:'#f9fafb',borderRadius:'8px',padding:'10px 14px',border:'1px solid #f3f4f6'}}>
            <div style={{fontSize:'11px',color:'#9ca3af',fontWeight:600,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{l}</div>
            <div style={{fontSize:'13px',color:'#0f1428',fontWeight:500}}>{v}</div>
          </div>
        ))}
      </div>
      {conv.status==='flagged'&&(
        <div style={{backgroundColor:'#fdecea',border:'1px solid #fca5a5',borderRadius:'8px',padding:'14px 16px',marginBottom:'20px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <div style={{fontSize:'13px',fontWeight:600,color:'#c62828'}}>⚠ Policy violation detected</div>
            <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
              <span style={{fontSize:'11px',color:rc,fontWeight:700}}>{rl}</span>
              <div style={{width:'80px',height:'6px',backgroundColor:'#f3f4f6',borderRadius:'3px',overflow:'hidden'}}><div style={{width:`${risk}%`,height:'100%',backgroundColor:rc,borderRadius:'3px'}}/></div>
            </div>
          </div>
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'8px'}}>{hits.map((h:KWHit)=><KWChip key={h.word} word={h.word} category={h.category}/>)}</div>
        </div>
      )}
      <div style={{backgroundColor:'#f9fafb',borderRadius:'10px',border:'1px solid #f3f4f6',padding:'16px',marginBottom:'20px',maxHeight:'340px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'12px'}}>
        {conv.messages.map((msg:any)=>{
          const isV=msg.role==='vendor';
          const mh=detectKeywords(msg.text);
          const fl=mh.length>0;
          return(
            <div key={msg.id} style={{display:'flex',flexDirection:'column',alignItems:isV?'flex-end':'flex-start'}}>
              <div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'3px',paddingLeft:isV?0:'4px',paddingRight:isV?'4px':0}}>
                <span style={{fontWeight:600,color:'#6b7280'}}>{msg.sender}</span>
                {' · '}{new Date(msg.ts).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
              </div>
              <div style={{maxWidth:'75%',padding:'10px 14px',borderRadius:isV?'12px 4px 12px 12px':'4px 12px 12px 12px',backgroundColor:fl?'#fdecea':isV?'#0f1428':'#fff',border:fl?'1px solid #fca5a5':isV?'none':'1px solid #e5e7eb',color:fl?'#1f2937':isV?'#fff':'#1f2937',fontSize:'13px',lineHeight:1.6,boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
                {highlightKeywords(msg.text)}
              </div>
              {fl&&<div style={{display:'flex',gap:'4px',marginTop:'4px',flexWrap:'wrap'}}>{mh.map((h:KWHit)=><KWChip key={h.word} word={h.word} category={h.category}/>)}</div>}
            </div>
          );
        })}
      </div>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
        {!conv.reviewed&&<Btn variant="success" label="Mark Reviewed" onClick={()=>{onReviewed(conv.id);toast('Marked as reviewed.');onClose();}}/>}
        <Btn label="View User" onClick={()=>{onClose();setTab('users');setSearch(conv.participants[1]);}}/>
        {conv.txn_id&&<Btn label="View Transaction" onClick={()=>{onClose();setTab('transactions');setSearch(conv.txn_id);}}/>}
        {conv.status==='flagged'&&<Btn variant="danger" label="Suspend Vendor" onClick={()=>toast('Vendor suspended.')}/>}
        {conv.status==='flagged'&&<Btn variant="warning" label="Send Policy Warning" onClick={()=>toast('Policy warning sent.')}/>}
      </div>
    </Modal>
  );
}

// ─── APPLY FILTERS + SORT ─────────────────────────────────────────────────────
function applyFiltersAndSort(items:any[],search:string,fields:string[],filters:any,sort:string):any[]{
  let out=search?items.filter(i=>fields.some(f=>String(i[f]??'').toLowerCase().includes(search.toLowerCase()))):items;
  const f=filters;
  if(f.role) out=out.filter(i=>i.role===f.role);
  if(f.status) out=out.filter(i=>i.status===f.status);
  if(f.joined_after) out=out.filter(i=>i.joined>=f.joined_after);
  if(f.joined_before) out=out.filter(i=>i.joined<=f.joined_before);
  if(f.min_txns) out=out.filter(i=>i.transactions>=Number(f.min_txns));
  if(f.category) out=out.filter(i=>i.category===f.category);
  if(f.min_price) out=out.filter(i=>i.price>=Number(f.min_price));
  if(f.max_price) out=out.filter(i=>i.price<=Number(f.max_price));
  if(f.disputed==='yes') out=out.filter(i=>i.disputed);
  if(f.disputed==='no') out=out.filter(i=>!i.disputed);
  if(f.date_after) out=out.filter(i=>(i.date||i.last_message||'')>=f.date_after);
  if(f.date_before) out=out.filter(i=>(i.date||i.last_message||'')<=f.date_before);
  if(f.min_amount) out=out.filter(i=>i.amount>=Number(f.min_amount));
  if(f.max_amount) out=out.filter(i=>i.amount<=Number(f.max_amount));
  if(f.seller) out=out.filter(i=>i.seller?.toLowerCase().includes(f.seller.toLowerCase()));
  if(f.buyer) out=out.filter(i=>i.buyer?.toLowerCase().includes(f.buyer.toLowerCase()));
  if(f.flagged==='yes') out=out.filter(i=>i.flagged);
  if(f.flagged==='no') out=out.filter(i=>!i.flagged);
  if(f.min_rating) out=out.filter(i=>i.rating>=Number(f.min_rating));
  if(f.max_rating) out=out.filter(i=>i.rating<=Number(f.max_rating));
  if(f.reviewed==='yes') out=out.filter(i=>i.reviewed);
  if(f.reviewed==='no') out=out.filter(i=>!i.reviewed);
  if(f.kw_category) out=out.filter(i=>i.messages?.some((m:any)=>detectKeywords(m.text).some((h:KWHit)=>h.category===f.kw_category)));
  if(sort){
    const desc=sort.startsWith('-');
    const key=desc?sort.slice(1):sort;
    out=[...out].sort((a,b)=>{
      const av=a[key]??''; const bv=b[key]??'';
      const cmp=typeof av==='number'?av-bv:String(av).localeCompare(String(bv));
      return desc?-cmp:cmp;
    });
  }
  return out;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SupportConsole({user}:{user:any}){
  const [tab,setTab]=useState('users');
  const [globalSearch,setGlobalSearch]=useState('');
  const [gsOpen,setGsOpen]=useState(false);
  const [tabSearch,setTabSearch]=useState('');
  const [filters,setFilters]=useState<any>({});
  const [sort,setSort]=useState('');
  const [convFilter,setConvFilter]=useState('all');
  const [showReports,setShowReports]=useState(false);
  const [toastMsg,setToast]=useState<string|null>(null);
  const [users,setUsers]=useState<any[]>(MOCK_USERS);
  const [listings,setListings]=useState<any[]>(MOCK_LISTINGS);
  const [transactions,setTransactions]=useState<any[]>(MOCK_TRANSACTIONS);
  const [reviews,setReviews]=useState<any[]>(MOCK_REVIEWS);
  const [convs,setConvs]=useState<any[]>(MOCK_CONVERSATIONS);
  const [selU,setSelU]=useState<any>(null);
  const [selL,setSelL]=useState<any>(null);
  const [selT,setSelT]=useState<any>(null);
  const [selR,setSelR]=useState<any>(null);
  const [selC,setSelC]=useState<any>(null);
  const gsRef=useRef<HTMLDivElement>(null);

  const toast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(null),3200);};
  const logout=()=>{sessionStorage.removeItem('dayof_user');window.location.href='/';};

  const changeTab=(t:string)=>{setTab(t);setTabSearch('');setFilters({});setSort('');setConvFilter('all');};
  const handleSort=(k:string)=>setSort(k);

  const flagged=convs.filter(c=>c.status==='flagged').length;
  const unrev=convs.filter(c=>c.status==='flagged'&&!c.reviewed).length;
  const markRev=(id:string)=>setConvs(cs=>cs.map(c=>c.id===id?{...c,reviewed:true}:c));

  const filteredUsers=useMemo(()=>applyFiltersAndSort(users,tabSearch,['name','email','id'],filters,sort),[users,tabSearch,filters,sort]);
  const filteredListings=useMemo(()=>applyFiltersAndSort(listings,tabSearch,['title','vendor','id'],filters,sort),[listings,tabSearch,filters,sort]);
  const filteredTransactions=useMemo(()=>applyFiltersAndSort(transactions,tabSearch,['buyer','seller','id','stripe_id'],filters,sort),[transactions,tabSearch,filters,sort]);
  const filteredReviews=useMemo(()=>applyFiltersAndSort(reviews,tabSearch,['author','target','content','id'],filters,sort),[reviews,tabSearch,filters,sort]);
  const filteredConvs=useMemo(()=>{
    let base=convs;
    if(convFilter==='flagged') base=base.filter(c=>c.status==='flagged');
    else if(convFilter==='clean') base=base.filter(c=>c.status==='clean');
    else if(convFilter==='unreviewed') base=base.filter(c=>c.status==='flagged'&&!c.reviewed);
    return applyFiltersAndSort(base,tabSearch,['id'],filters,sort);
  },[convs,convFilter,tabSearch,filters,sort]);

  const activeData={users,listings,transactions,reviews,conversations:convs};

  const doExportCSV=()=>{
    if(tab==='users') downloadCSV(filteredUsers.map(u=>({ID:u.id,Name:u.name,Email:u.email,Role:u.role,Status:u.status,Joined:u.joined,Transactions:u.transactions})),'dayof-users.csv');
    if(tab==='listings') downloadCSV(filteredListings.map(l=>({ID:l.id,Title:l.title,Vendor:l.vendor,Category:l.category,Price:l.price,Status:l.status,Created:l.created})),'dayof-listings.csv');
    if(tab==='transactions') downloadCSV(filteredTransactions.map(t=>({ID:t.id,'Stripe ID':t.stripe_id,Buyer:t.buyer,Seller:t.seller,Amount:t.amount,Status:t.status,Date:t.date,Disputed:t.disputed?'Yes':'No'})),'dayof-transactions.csv');
    if(tab==='reviews') downloadCSV(filteredReviews.map(r=>({ID:r.id,Author:r.author,Target:r.target,Rating:r.rating,Content:r.content,Date:r.date,Flagged:r.flagged?'Yes':'No'})),'dayof-reviews.csv');
    if(tab==='conversations') downloadCSV(filteredConvs.map(c=>({ID:c.id,'Participant 1':c.participants[0],'Participant 2':c.participants[1],Listing:c.listing,Status:c.status,Reviewed:c.reviewed?'Yes':'No','Messages':c.message_count,'Last Message':c.last_message})),'dayof-conversations.csv');
  };

  const doPrint=()=>{
    if(tab==='users') printTable('Users',filteredUsers,[{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'role',label:'Role'},{key:'status',label:'Status'},{key:'joined',label:'Joined'},{key:'transactions',label:'Txns'}]);
    if(tab==='listings') printTable('Listings',filteredListings,[{key:'title',label:'Title'},{key:'vendor',label:'Vendor'},{key:'category',label:'Category'},{key:'price',label:'Price'},{key:'status',label:'Status'}]);
    if(tab==='transactions') printTable('Transactions',filteredTransactions,[{key:'buyer',label:'Buyer'},{key:'seller',label:'Seller'},{key:'amount',label:'Amount'},{key:'status',label:'Status'},{key:'date',label:'Date'},{key:'disputed',label:'Disputed'}]);
    if(tab==='reviews') printTable('Reviews',filteredReviews,[{key:'author',label:'Author'},{key:'target',label:'Target'},{key:'rating',label:'Rating'},{key:'content',label:'Content'},{key:'date',label:'Date'}]);
    if(tab==='conversations') printTable('Conversations',filteredConvs,[{key:'id',label:'ID'},{key:'participants',label:'Participants'},{key:'listing',label:'Listing'},{key:'status',label:'Status'},{key:'reviewed',label:'Reviewed'}]);
  };

  const tabs=[
    {id:'users',label:'Users',count:users.length,alert:0},
    {id:'listings',label:'Listings',count:listings.length,alert:0},
    {id:'transactions',label:'Transactions',count:transactions.length,alert:0},
    {id:'reviews',label:'Reviews',count:reviews.length,alert:0},
    {id:'conversations',label:'Conversations',count:convs.length,alert:unrev},
  ];

  const th:React.CSSProperties={textAlign:'left',fontSize:'11px',fontWeight:600,color:'#9ca3af',letterSpacing:'0.06em',textTransform:'uppercase',borderBottom:'1px solid #f3f4f6',whiteSpace:'nowrap',backgroundColor:'#fafafa',padding:0};
  const td:React.CSSProperties={padding:'11px 16px',borderBottom:'1px solid #f9fafb',fontSize:'13px',color:'#374151',verticalAlign:'middle'};

  const SH=({label,sortKey}:{label:string;sortKey:string})=>(
    <th style={th}><SortBtn label={label} sortKey={sortKey} current={sort} onSort={handleSort}/></th>
  );

  return(
    <div style={{fontFamily:"'Inter',-apple-system,sans-serif",backgroundColor:'#f9fafb',minHeight:'100vh'}}>
      {toastMsg&&<div style={{position:'fixed',top:20,right:20,backgroundColor:'#0f1428',borderRadius:'8px',padding:'12px 20px',fontSize:'13px',color:'#fff',zIndex:300,boxShadow:'0 8px 24px rgba(15,20,40,0.2)',display:'flex',alignItems:'center',gap:'10px'}}><span style={{width:6,height:6,borderRadius:'50%',backgroundColor:'#86efac'}}/>{toastMsg}</div>}

      {/* HEADER */}
      <header style={{backgroundColor:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 32px',height:'58px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50}}>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <Logo/>
          <div style={{height:'18px',width:'1px',backgroundColor:'#e5e7eb'}}/>
          <span style={{fontSize:'11px',color:'#9ca3af',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase'}}>Support Console</span>
        </div>
        {/* GLOBAL SEARCH */}
        <div style={{flex:1,maxWidth:'420px',margin:'0 32px',position:'relative'}} ref={gsRef}>
          <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:'15px'}}>⌕</span>
          <input
            style={{width:'100%',paddingLeft:'36px',paddingRight:'14px',paddingTop:'8px',paddingBottom:'8px',backgroundColor:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'13px',color:'#374151',outline:'none',boxSizing:'border-box'}}
            placeholder="Search everything — users, listings, transactions..."
            value={globalSearch}
            onChange={e=>{setGlobalSearch(e.target.value);setGsOpen(true);}}
            onFocus={()=>setGsOpen(true)}
            onBlur={()=>setTimeout(()=>setGsOpen(false),200)}
          />
          {gsOpen&&globalSearch&&<GlobalSearchResults query={globalSearch} data={activeData} onNavigate={(t,item)=>{changeTab(t);setGsOpen(false);setGlobalSearch('');if(t==='users') setSelU(item);else if(t==='listings') setSelL(item);else if(t==='transactions') setSelT(item);else if(t==='reviews') setSelR(item);else if(t==='conversations') setSelC(item);}}/>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          {unrev>0&&<button onClick={()=>{changeTab('conversations');setConvFilter('unreviewed');}} style={{display:'flex',alignItems:'center',gap:'6px',padding:'5px 12px',backgroundColor:'#fdecea',border:'1px solid #fca5a5',borderRadius:'8px',fontSize:'12px',color:'#c62828',cursor:'pointer',fontWeight:600}}>⚠ {unrev} unreviewed</button>}
          <Btn label="📊 Reports" variant="default" onClick={()=>setShowReports(true)} small/>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'30px',height:'30px',borderRadius:'50%',backgroundColor:'#0f1428',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px',fontWeight:600}}>{user.name[0]}</div>
            <div><div style={{fontSize:'13px',fontWeight:500,color:'#0f1428'}}>{user.name}</div><div style={{fontSize:'11px',color:'#9ca3af',textTransform:'capitalize'}}>{user.role}</div></div>
          </div>
          <button onClick={logout} style={{padding:'6px 12px',backgroundColor:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'12px',color:'#6b7280',cursor:'pointer'}}>Sign out</button>
        </div>
      </header>

      {/* TAB NAV */}
      <div style={{backgroundColor:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 32px',display:'flex'}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>changeTab(t.id)} style={{padding:'13px 18px',background:'none',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:500,color:tab===t.id?'#0f1428':'#9ca3af',borderBottom:tab===t.id?'2px solid #0f1428':'2px solid transparent',marginBottom:'-1px',display:'flex',alignItems:'center',gap:'6px'}}>
            {t.label}
            <span style={{fontSize:'11px',padding:'1px 7px',borderRadius:'10px',backgroundColor:tab===t.id?'#0f1428':'#f3f4f6',color:tab===t.id?'#fff':'#9ca3af',fontWeight:600}}>{t.count}</span>
            {t.alert>0&&<span style={{fontSize:'11px',padding:'1px 6px',borderRadius:'10px',backgroundColor:'#fdecea',color:'#c62828',fontWeight:700}}>{t.alert}</span>}
          </button>
        ))}
      </div>

      <main style={{padding:'24px 32px'}}>
        {/* TOOLBAR */}
        <div style={{marginBottom:'16px',display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
          {tab==='conversations'?(
            <div style={{display:'flex',gap:'6px'}}>
              {([['all','All',convs.length],['flagged','Flagged',flagged],['unreviewed','Needs Review',unrev],['clean','Clean',convs.filter(c=>c.status==='clean').length]] as [string,string,number][]).map(([val,label,count])=>(
                <button key={val} onClick={()=>{setConvFilter(val);setTabSearch('');}} style={{padding:'6px 13px',backgroundColor:convFilter===val?'#0f1428':'#fff',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'12px',color:convFilter===val?'#fff':'#6b7280',cursor:'pointer',fontWeight:500,display:'flex',alignItems:'center',gap:'5px'}}>{label}<span style={{opacity:0.7,fontSize:'11px'}}>{count}</span></button>
              ))}
            </div>
          ):(
            <div style={{position:'relative'}}>
              <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:'14px'}}>⌕</span>
              <input style={{paddingLeft:'30px',paddingRight:'12px',paddingTop:'8px',paddingBottom:'8px',width:'240px',backgroundColor:'#fff',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'13px',color:'#374151',outline:'none'}} placeholder={`Search ${tab}...`} value={tabSearch} onChange={e=>setTabSearch(e.target.value)}/>
              {tabSearch&&<button onClick={()=>setTabSearch('')} style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#9ca3af',cursor:'pointer',fontSize:'14px'}}>×</button>}
            </div>
          )}
          {tab==='conversations'&&(
            <div style={{position:'relative'}}>
              <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:'14px'}}>⌕</span>
              <input style={{paddingLeft:'30px',paddingRight:'12px',paddingTop:'8px',paddingBottom:'8px',width:'200px',backgroundColor:'#fff',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'12px',color:'#374151',outline:'none'}} placeholder="Search..." value={tabSearch} onChange={e=>setTabSearch(e.target.value)}/>
            </div>
          )}
          <FilterPanel filters={filters} setFilters={setFilters} tab={tab}/>
          <div style={{marginLeft:'auto',display:'flex',gap:'8px',alignItems:'center'}}>
            <span style={{fontSize:'12px',color:'#9ca3af'}}>
              {tab==='users'?filteredUsers.length:tab==='listings'?filteredListings.length:tab==='transactions'?filteredTransactions.length:tab==='reviews'?filteredReviews.length:filteredConvs.length} results
            </span>
            <Btn small label="⬇ CSV" variant="default" onClick={doExportCSV}/>
            <Btn small label="🖨 Print" variant="default" onClick={doPrint}/>
          </div>
        </div>

        {/* TABLE */}
        <div style={{backgroundColor:'#fff',borderRadius:'12px',border:'1px solid #e5e7eb',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>

          {tab==='users'&&<table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><SH label="Name" sortKey="name"/><SH label="Email" sortKey="email"/><th style={th}><SortBtn label="Role" sortKey="role" current={sort} onSort={handleSort}/></th><SH label="Status" sortKey="status"/><SH label="Joined" sortKey="joined"/><SH label="Txns" sortKey="transactions"/><th style={{...th,padding:'10px 16px'}}/></tr></thead>
            <tbody>{filteredUsers.map((u:any)=>(
              <tr key={u.id} style={{cursor:'pointer'}} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')} onClick={()=>setSelU(u)}>
                <td style={td}><div style={{fontWeight:500,color:'#0f1428'}}>{u.name}</div><div style={{fontSize:'11px',color:'#9ca3af',fontFamily:'monospace'}}>{u.id.slice(0,8)}...</div></td>
                <td style={td}><span style={{color:'#6b7280'}}>{u.email}</span></td>
                <td style={td}><span style={{fontSize:'11px',color:'#6b7280',backgroundColor:'#f3f4f6',padding:'2px 8px',borderRadius:'4px',fontWeight:500}}>{u.role}</span></td>
                <td style={td}><Badge status={u.status}/></td>
                <td style={td}><span style={{color:'#9ca3af',fontSize:'12px'}}>{u.joined}</span></td>
                <td style={td}>{u.transactions}</td>
                <td style={td}><span style={{color:'#d1d5db',fontSize:'12px'}}>›</span></td>
              </tr>
            ))}</tbody>
          </table>}

          {tab==='listings'&&<table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><SH label="Title" sortKey="title"/><SH label="Vendor" sortKey="vendor"/><SH label="Category" sortKey="category"/><SH label="Price" sortKey="price"/><SH label="Status" sortKey="status"/><SH label="Created" sortKey="created"/><th style={{...th,padding:'10px 16px'}}/></tr></thead>
            <tbody>{filteredListings.map((l:any)=>(
              <tr key={l.id} style={{cursor:'pointer'}} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')} onClick={()=>setSelL(l)}>
                <td style={td}><div style={{fontWeight:500,color:'#0f1428'}}>{l.title}</div><div style={{fontSize:'11px',color:'#9ca3af',fontFamily:'monospace'}}>{l.id}</div></td>
                <td style={td}><span style={{color:'#6b7280'}}>{l.vendor}</span></td>
                <td style={td}><span style={{fontSize:'11px',color:'#6b7280',backgroundColor:'#f3f4f6',padding:'2px 8px',borderRadius:'4px',fontWeight:500}}>{l.category}</span></td>
                <td style={td}><span style={{fontWeight:500}}>${l.price.toLocaleString()}</span></td>
                <td style={td}><Badge status={l.status}/></td>
                <td style={td}><span style={{color:'#9ca3af',fontSize:'12px'}}>{l.created}</span></td>
                <td style={td}><span style={{color:'#d1d5db',fontSize:'12px'}}>›</span></td>
              </tr>
            ))}</tbody>
          </table>}

          {tab==='transactions'&&<table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><SH label="ID" sortKey="id"/><SH label="Buyer" sortKey="buyer"/><SH label="Seller" sortKey="seller"/><SH label="Amount" sortKey="amount"/><SH label="Status" sortKey="status"/><SH label="Date" sortKey="date"/><th style={{...th,padding:'10px 16px'}}>Disputed</th><th style={{...th,padding:'10px 16px'}}/></tr></thead>
            <tbody>{filteredTransactions.map((t:any)=>(
              <tr key={t.id} style={{cursor:'pointer'}} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')} onClick={()=>setSelT(t)}>
                <td style={td}><span style={{fontFamily:'monospace',fontSize:'11px',color:'#6b7280',backgroundColor:'#f3f4f6',padding:'2px 7px',borderRadius:'4px'}}>{t.id.slice(0,12)}...</span></td>
                <td style={td}><span style={{fontWeight:500,color:'#0f1428'}}>{t.buyer}</span></td>
                <td style={td}><span style={{color:'#6b7280'}}>{t.seller}</span></td>
                <td style={td}><span style={{fontWeight:600,color:'#0f1428'}}>${t.amount.toLocaleString()}</span></td>
                <td style={td}><Badge status={t.status}/></td>
                <td style={td}><span style={{color:'#9ca3af',fontSize:'12px'}}>{t.date}</span></td>
                <td style={td}>{t.disputed&&<span style={{color:'#c62828',fontWeight:600,fontSize:'12px'}}>⚠</span>}</td>
                <td style={td}><span style={{color:'#d1d5db',fontSize:'12px'}}>›</span></td>
              </tr>
            ))}</tbody>
          </table>}

          {tab==='reviews'&&<table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><SH label="Author" sortKey="author"/><SH label="About" sortKey="target"/><SH label="Rating" sortKey="rating"/><th style={th}><SortBtn label="Preview" sortKey="content" current={sort} onSort={handleSort}/></th><SH label="Date" sortKey="date"/><th style={{...th,padding:'10px 16px'}}>Flagged</th><th style={{...th,padding:'10px 16px'}}/></tr></thead>
            <tbody>{filteredReviews.map((r:any)=>(
              <tr key={r.id} style={{cursor:'pointer'}} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor='transparent')} onClick={()=>setSelR(r)}>
                <td style={td}><span style={{fontWeight:500,color:'#0f1428'}}>{r.author}</span></td>
                <td style={td}><span style={{color:'#6b7280'}}>{r.target}</span></td>
                <td style={td}><span style={{color:r.rating>=4?'#2e7d32':r.rating>=3?'#b45309':'#c62828',letterSpacing:'1px'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span></td>
                <td style={{...td,maxWidth:'200px'}}><span style={{color:'#9ca3af',fontSize:'12px',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.content}</span></td>
                <td style={td}><span style={{color:'#9ca3af',fontSize:'12px'}}>{r.date}</span></td>
                <td style={td}>{r.flagged&&<Badge status="flagged"/>}</td>
                <td style={td}><span style={{color:'#d1d5db',fontSize:'12px'}}>›</span></td>
              </tr>
            ))}</tbody>
          </table>}

          {tab==='conversations'&&<table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><SH label="Participants" sortKey="participants"/><SH label="Listing" sortKey="listing"/><SH label="Msgs" sortKey="message_count"/><SH label="Last Activity" sortKey="last_message"/><th style={{...th,padding:'10px 16px'}}>Risk</th><th style={{...th,padding:'10px 16px'}}>Keywords</th><SH label="Status" sortKey="status"/><th style={{...th,padding:'10px 16px'}}/></tr></thead>
            <tbody>{filteredConvs.map((c:any)=>{
              const ch=uniqueHits(c.messages.flatMap((m:any)=>detectKeywords(m.text)));
              const risk=Math.min(100,ch.length*18+(c.status==='flagged'?20:0));
              const rc=risk>=60?'#c62828':risk>=30?'#f57f17':'#2e7d32';
              return(
                <tr key={c.id} style={{cursor:'pointer',backgroundColor:c.status==='flagged'&&!c.reviewed?'#fffbf5':'transparent'}} onMouseOver={e=>(e.currentTarget.style.backgroundColor='#fafafa')} onMouseOut={e=>(e.currentTarget.style.backgroundColor=c.status==='flagged'&&!c.reviewed?'#fffbf5':'transparent')} onClick={()=>setSelC(c)}>
                  <td style={td}><div style={{fontWeight:500,color:'#0f1428',fontSize:'13px'}}>{c.participants[0]}</div><div style={{color:'#9ca3af',fontSize:'12px'}}>{c.participants[1]}</div></td>
                  <td style={{...td,maxWidth:'150px'}}><span style={{color:'#6b7280',fontSize:'12px',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.listing}</span></td>
                  <td style={td}><span style={{color:'#6b7280'}}>{c.message_count}</span></td>
                  <td style={td}><span style={{color:'#9ca3af',fontSize:'12px'}}>{new Date(c.last_message).toLocaleDateString()}</span></td>
                  <td style={td}><div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'40px',height:'5px',backgroundColor:'#f3f4f6',borderRadius:'3px',overflow:'hidden'}}><div style={{width:`${risk}%`,height:'100%',backgroundColor:rc,borderRadius:'3px'}}/></div><span style={{fontSize:'11px',color:rc,fontWeight:600}}>{risk}</span></div></td>
                  <td style={td}>{ch.length>0?<div style={{display:'flex',gap:'3px',flexWrap:'wrap'}}>{ch.slice(0,2).map((h:KWHit)=><KWChip key={h.word} word={h.word} category={h.category}/>)}{ch.length>2&&<span style={{fontSize:'11px',color:'#9ca3af'}}>+{ch.length-2}</span>}</div>:<span style={{color:'#d1d5db',fontSize:'12px'}}>None</span>}</td>
                  <td style={td}><Badge status={c.status}/></td>
                  <td style={td}>{c.reviewed&&<span style={{fontSize:'11px',color:'#2e7d32',fontWeight:600}}>✓</span>}</td>
                </tr>
              );
            })}</tbody>
          </table>}

        </div>
      </main>

      {/* ENTITY MODALS */}
      {selU&&<Modal title={selU.name} subtitle={selU.id} onClose={()=>setSelU(null)}>
        <DR label="User ID" value={<span style={{fontFamily:'monospace',fontSize:'12px',color:'#6b7280'}}>{selU.id}</span>}/>
        <DR label="Tawk.to ID" value={<span style={{fontFamily:'monospace',fontSize:'12px',color:'#6b7280'}}>{selU.tawk_id}</span>}/>
        <DR label="Email" value={selU.email}/><DR label="Role" value={selU.role}/><DR label="Status" value={<Badge status={selU.status}/>}/><DR label="Joined" value={selU.joined}/><DR label="Transactions" value={String(selU.transactions)}/>
        <div style={{display:'flex',gap:'8px',marginTop:'24px',flexWrap:'wrap'}}>
          <Btn variant="primary" label="Edit Profile" onClick={()=>toast('Edit → Sharetribe API')}/>
          <Btn variant={selU.status==='suspended'?'success':'danger'} label={selU.status==='suspended'?'Unsuspend':'Suspend'} onClick={()=>{const n=selU.status==='suspended'?'active':'suspended';setUsers(users.map(u=>u.id===selU.id?{...u,status:n}:u));setSelU({...selU,status:n});toast(`User ${n}.`);}}/>
          <Btn label="Open in Tawk.to" onClick={()=>toast('Opening Tawk.to → '+selU.tawk_id)}/>
          <Btn label="View Conversations" onClick={()=>{setSelU(null);changeTab('conversations');setTabSearch(selU.name);}}/>
        </div>
      </Modal>}

      {selL&&<Modal title={selL.title} subtitle={selL.id} onClose={()=>setSelL(null)}>
        <DR label="Listing ID" value={<span style={{fontFamily:'monospace',fontSize:'12px',color:'#6b7280'}}>{selL.id}</span>}/>
        <DR label="Vendor" value={selL.vendor}/><DR label="Category" value={selL.category}/><DR label="Price" value={`$${selL.price.toLocaleString()}`}/><DR label="Status" value={<Badge status={selL.status}/>}/><DR label="Created" value={selL.created}/>
        <div style={{display:'flex',gap:'8px',marginTop:'24px',flexWrap:'wrap'}}>
          <Btn variant="primary" label="Edit Listing" onClick={()=>toast('Edit → Sharetribe API')}/>
          <Btn variant="success" label="Approve" onClick={()=>{setListings(listings.map(l=>l.id===selL.id?{...l,status:'active'}:l));setSelL({...selL,status:'active'});toast('Approved.');}}/>
          <Btn variant={selL.status==='suspended'?'success':'danger'} label={selL.status==='suspended'?'Unsuspend':'Suspend'} onClick={()=>{const n=selL.status==='suspended'?'active':'suspended';setListings(listings.map(l=>l.id===selL.id?{...l,status:n}:l));setSelL({...selL,status:n});toast(`Listing ${n}.`);}}/>
        </div>
      </Modal>}

      {selT&&<Modal title={'Transaction · '+selT.id} subtitle={selT.stripe_id} onClose={()=>setSelT(null)}>
        <DR label="Transaction ID" value={<span style={{fontFamily:'monospace',fontSize:'12px',color:'#6b7280'}}>{selT.id}</span>}/>
        <DR label="Stripe Payment ID" value={<span style={{fontFamily:'monospace',fontSize:'12px',color:'#6b7280'}}>{selT.stripe_id}</span>}/>
        <DR label="Buyer" value={selT.buyer}/><DR label="Seller" value={selT.seller}/><DR label="Amount" value={`$${selT.amount.toLocaleString()}`}/><DR label="Status" value={<Badge status={selT.status}/>}/><DR label="Date" value={selT.date}/><DR label="Dispute" value={selT.disputed?<Badge status="disputed"/>:'None'}/>
        <div style={{display:'flex',gap:'8px',marginTop:'24px',flexWrap:'wrap'}}>
          <Btn variant="primary" label="View in Stripe" onClick={()=>toast('Opening Stripe → '+selT.stripe_id)}/>
          <Btn variant="danger" label="Issue Refund" onClick={()=>{setTransactions(transactions.map(t=>t.id===selT.id?{...t,status:'refunded'}:t));setSelT({...selT,status:'refunded'});toast('Refund issued.');}}/>
          <Btn variant="success" label="Resolve Dispute" onClick={()=>{setTransactions(transactions.map(t=>t.id===selT.id?{...t,status:'completed',disputed:false}:t));setSelT({...selT,status:'completed',disputed:false});toast('Dispute resolved.');}}/>
        </div>
      </Modal>}

      {selR&&<Modal title={'Review by '+selR.author} subtitle={selR.id} onClose={()=>setSelR(null)}>
        <DR label="Author" value={selR.author}/><DR label="Target" value={selR.target}/><DR label="Rating" value={<span style={{color:selR.rating>=4?'#2e7d32':'#c62828'}}>{'★'.repeat(selR.rating)}{'☆'.repeat(5-selR.rating)}</span>}/><DR label="Flagged" value={selR.flagged?<Badge status="flagged"/>:'No'}/>
        <div style={{margin:'16px 0',padding:'16px',backgroundColor:'#f9fafb',borderRadius:'8px',fontSize:'14px',color:'#374151',lineHeight:1.7,border:'1px solid #f3f4f6'}}>{selR.content}</div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
          <Btn variant={selR.flagged?'default':'warning'} label={selR.flagged?'Unflag':'Flag'} onClick={()=>{setReviews(reviews.map(r=>r.id===selR.id?{...r,flagged:!r.flagged}:r));setSelR({...selR,flagged:!selR.flagged});toast('Updated.');}}/>
          <Btn variant="danger" label="Remove" onClick={()=>{setReviews(reviews.filter(r=>r.id!==selR.id));setSelR(null);toast('Review removed.');}}/>
        </div>
      </Modal>}

      {selC&&<ConvModal conv={selC} onClose={()=>setSelC(null)} onReviewed={markRev} toast={toast} setTab={changeTab} setSearch={setTabSearch}/>}
      {showReports&&<ReportsModal data={activeData} onClose={()=>setShowReports(false)}/>}

      <footer style={{backgroundColor:'#0f1428',padding:'22px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'40px'}}>
        <Logo white/>
        <span style={{color:'#4b5563',fontSize:'12px'}}>Support Console · Internal Use Only</span>
      </footer>
    </div>
  );
}
