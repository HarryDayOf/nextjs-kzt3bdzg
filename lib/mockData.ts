import type { User, Listing, Transaction, Review, Conversation, Note, AuditEntry, AlertConfig, ConsoleUser } from './types';

export const MOCK_CONSOLE_USERS: ConsoleUser[] = [
  { id: 'cu_1', name: 'Harry McLaughlin', email: 'harry@dayof.com', role: 'admin', active: true, joined: '2024-09-01', lastLogin: '2025-02-25T08:30:00Z' },
  { id: 'cu_2', name: 'Genner Castillo', email: 'genner@dayof.com', role: 'cs', active: true, joined: '2024-10-15', lastLogin: '2025-02-25T09:10:00Z' },
  { id: 'cu_3', name: 'Haines', email: 'haines@dayof.com', role: 'leadership', active: true, joined: '2024-09-01', lastLogin: '2025-02-24T14:00:00Z' },
  { id: 'cu_4', name: 'Abhi', email: 'abhi@dayof.com', role: 'admin', active: true, joined: '2024-11-01', lastLogin: '2025-02-23T11:00:00Z' },
  { id: 'cu_5', name: 'Fabeha', email: 'fabeha@dayof.com', role: 'readonly', active: true, joined: '2024-11-01', lastLogin: '2025-02-20T10:00:00Z' },
];

export const MOCK_USERS: User[] = [
  { id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', name: 'Sarah Chen', email: 'sarah.chen@bloomday.co', role: 'vendor', status: 'active', joined: '2024-11-01', listings: 3, transactions: 12, tawk_id: 'tawk_6f3a2c1e', revenue: 4600, tier: 'verified', responseRate: 94, bookingRate: 68, cancellationRate: 2, avgRating: 4.9, repeatFlags: 0 },
  { id: 'b2e91d73-3f0c-4a8e-b654-9d7c1a3e5f28', name: 'Marcus Webb', email: 'marcus.webb@gmail.com', role: 'couple', status: 'active', joined: '2025-01-15', listings: 0, transactions: 2, tawk_id: 'tawk_b2e91d73', revenue: 0, tier: 'standard', responseRate: 0, bookingRate: 0, cancellationRate: 0, avgRating: 0, repeatFlags: 0 },
  { id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', name: 'Bloom & Co Florals', email: 'hello@bloomco.com', role: 'vendor', status: 'suspended', joined: '2024-09-10', listings: 7, transactions: 31, tawk_id: 'tawk_a4f78c29', revenue: 18200, tier: 'probation', responseRate: 61, bookingRate: 41, cancellationRate: 18, avgRating: 2.1, repeatFlags: 3 },
  { id: 'c7d45e81-2a9f-4b3c-96e7-5f1d8a0b2e34', name: 'Jordan & Priya Ellis', email: 'jordan.priya@icloud.com', role: 'couple', status: 'active', joined: '2025-02-01', listings: 0, transactions: 1, tawk_id: 'tawk_c7d45e81', revenue: 0, tier: 'standard', responseRate: 0, bookingRate: 0, cancellationRate: 0, avgRating: 0, repeatFlags: 0 },
  { id: 'e9b12f47-7c3d-4e5a-b891-0a6c2f8d4e73', name: 'Magnolia Events', email: 'info@magnoliaevents.com', role: 'vendor', status: 'pending', joined: '2025-02-20', listings: 0, transactions: 0, tawk_id: 'tawk_e9b12f47', revenue: 0, tier: 'new', responseRate: 0, bookingRate: 0, cancellationRate: 0, avgRating: 0, repeatFlags: 0 },
  { id: 'f1a23b45-6c78-9d01-e234-5f67a8b9c0d1', name: 'The Sound Co.', email: 'booking@thesoundco.com', role: 'vendor', status: 'active', joined: '2024-10-05', listings: 4, transactions: 22, tawk_id: 'tawk_f1a23b45', revenue: 12400, tier: 'featured', responseRate: 88, bookingRate: 72, cancellationRate: 4, avgRating: 4.7, repeatFlags: 0 },
];

export const MOCK_LISTINGS: Listing[] = [
  { id: 'lst_4Hx9K2mPqR7vYnWd', title: 'Full-Day Wedding Photography', vendor: 'Sarah Chen', vendor_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', price: 3200, status: 'active', category: 'Photography', created: '2024-11-05', views: 412, inquiries: 38, bookings: 12 },
  { id: 'lst_7Tz3J8nLwS1uXkBe', title: 'Garden Floral Package', vendor: 'Bloom & Co Florals', vendor_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', price: 1800, status: 'suspended', category: 'Florals', created: '2024-09-15', views: 188, inquiries: 22, bookings: 7 },
  { id: 'lst_2Rp6F4hQcM9yVjAg', title: 'Luxury Floral Design', vendor: 'Bloom & Co Florals', vendor_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', price: 4500, status: 'active', category: 'Florals', created: '2024-10-01', views: 291, inquiries: 19, bookings: 4 },
  { id: 'lst_9Kd1N7bUoE3wCfHs', title: 'DJ + MC Package', vendor: 'Magnolia Events', vendor_id: 'e9b12f47-7c3d-4e5a-b891-0a6c2f8d4e73', price: 2200, status: 'pending_review', category: 'Entertainment', created: '2025-02-20', views: 0, inquiries: 0, bookings: 0 },
  { id: 'lst_5Mv8G2tIpZ6xDrWq', title: 'Elopement Photography', vendor: 'Sarah Chen', vendor_id: '6f3a2c1e-84b7-4d9f-a312-1c8e5f2b7a04', price: 1400, status: 'active', category: 'Photography', created: '2024-12-01', views: 203, inquiries: 31, bookings: 9 },
  { id: 'lst_3Qr8H5kNpM2wBjCs', title: 'Full Band Experience', vendor: 'The Sound Co.', vendor_id: 'f1a23b45-6c78-9d01-e234-5f67a8b9c0d1', price: 4800, status: 'active', category: 'Entertainment', created: '2024-10-10', views: 344, inquiries: 41, bookings: 18 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'txn_3Ks9Lx2mPqR7vYnW', stripe_id: 'pi_3OqK2LHj8mTxNpQr1sBv7Ydc', buyer: 'Marcus Webb', buyer_id: 'b2e91d73', seller: 'Sarah Chen', seller_id: '6f3a2c1e', listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', amount: 3200, status: 'completed', date: '2025-01-20', disputed: false },
  { id: 'txn_8Fh4Tz3J7nLwS1uX', stripe_id: 'pi_8FhK9MNj2xRsWpLq4tYv3Bec', buyer: 'Jordan & Priya Ellis', buyer_id: 'c7d45e81', seller: 'Bloom & Co Florals', seller_id: 'a4f78c29', listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', amount: 4500, status: 'disputed', date: '2025-02-10', disputed: true, dispute_reason: 'Vendor failed to deliver as described. Completely different arrangement than agreed.', dispute_opened: '2025-02-12' },
  { id: 'txn_1Rp5F4hQcM9yVjAg', stripe_id: 'pi_1RpN7KLj4mQsXoWr9vBt2Ydh', buyer: 'Marcus Webb', buyer_id: 'b2e91d73', seller: 'Bloom & Co Florals', seller_id: 'a4f78c29', listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', amount: 1800, status: 'refunded', date: '2024-12-15', disputed: false },
  { id: 'txn_6Mv7G2tIpZ4xDrWq', stripe_id: 'pi_6MvK3NHj9xPsRqLt2wYv8Bdf', buyer: 'Jordan & Priya Ellis', buyer_id: 'c7d45e81', seller: 'Sarah Chen', seller_id: '6f3a2c1e', listing: 'Elopement Photography', listing_id: 'lst_5Mv8G2tIpZ6xDrWq', amount: 1400, status: 'pending', date: '2025-02-22', disputed: false },
  { id: 'txn_2Px4Qw8Ry6Tz0Uv', stripe_id: 'pi_2PxL5NKj7mQsRoWt9vBt1Ydh', buyer: 'Marcus Webb', buyer_id: 'b2e91d73', seller: 'The Sound Co.', seller_id: 'f1a23b45', listing: 'Full Band Experience', listing_id: 'lst_3Qr8H5kNpM2wBjCs', amount: 4800, status: 'completed', date: '2025-02-01', disputed: false },
  { id: 'txn_5Lm3Kn7Jo1Ip9Hq', stripe_id: 'pi_5LmK8NHj3mQsRoWt6vBt2Ydh', buyer: 'Jordan & Priya Ellis', buyer_id: 'c7d45e81', seller: 'Bloom & Co Florals', seller_id: 'a4f78c29', listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', amount: 1800, status: 'completed', date: '2025-01-05', disputed: false },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'rev_2Ks8Lx9mPqR4vYnW', author: 'Marcus Webb', author_id: 'b2e91d73', target: 'Sarah Chen', target_id: '6f3a2c1e', listing: 'Full-Day Wedding Photography', listing_id: 'lst_4Hx9K2mPqR7vYnWd', rating: 5, content: 'Absolutely incredible work. Sarah was calm, professional, and the photos exceeded everything we hoped for.', date: '2025-02-01', flagged: false },
  { id: 'rev_9Fh3Tz4J8nLwS7uX', author: 'Jordan & Priya Ellis', author_id: 'c7d45e81', target: 'Bloom & Co Florals', target_id: 'a4f78c29', listing: 'Luxury Floral Design', listing_id: 'lst_2Rp6F4hQcM9yVjAg', rating: 1, content: 'They ghosted us two weeks before the wedding. Complete disaster. Do not book.', date: '2025-02-15', flagged: true },
  { id: 'rev_4Rp6F1hQcM8yVjAg', author: 'Marcus Webb', author_id: 'b2e91d73', target: 'Bloom & Co Florals', target_id: 'a4f78c29', listing: 'Garden Floral Package', listing_id: 'lst_7Tz3J8nLwS1uXkBe', rating: 2, content: 'Arrangements were not what was agreed upon. Had to request a refund.', date: '2025-01-02', flagged: false },
  { id: 'rev_7Gh2Ji6Kl0Mn4Op', author: 'Jordan & Priya Ellis', author_id: 'c7d45e81', target: 'The Sound Co.', target_id: 'f1a23b45', listing: 'Full Band Experience', listing_id: 'lst_3Qr8H5kNpM2wBjCs', rating: 5, content: 'Incredible energy all night. The band read the room perfectly. Every guest was on the floor.', date: '2025-02-08', flagged: false },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
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

export const MOCK_NOTES: Note[] = [
  { id: 'note_1', entity_type: 'user', entity_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', author: 'Genner Castillo', author_role: 'cs', text: 'Suspended after third off-platform solicitation attempt. Vendor was warned twice before action. Do not reinstate without leadership approval.', ts: '2025-02-10T14:30:00Z', pinned: true },
  { id: 'note_2', entity_type: 'user', entity_id: 'a4f78c29-9e1b-4c6d-8a53-2f0e7b4d1c96', author: 'Harry McLaughlin', author_role: 'admin', text: 'Vendor reached out directly claiming misunderstanding. Not reinstating at this time. Escalated to Haines for final call.', ts: '2025-02-12T09:15:00Z' },
  { id: 'note_3', entity_type: 'transaction', entity_id: 'txn_8Fh4Tz3J7nLwS1uX', author: 'Genner Castillo', author_role: 'cs', text: 'Both parties contacted. Buyer provided photos showing wrong arrangement. Vendor claims buyer changed scope verbally. Awaiting vendor response by Feb 20.', ts: '2025-02-14T11:00:00Z', pinned: true },
];

export const MOCK_AUDIT: AuditEntry[] = [
  { id: 'aud_1', actor: 'Genner Castillo', actor_role: 'cs', action: 'Suspended user', entity_type: 'user', entity_id: 'a4f78c29', entity_label: 'Bloom & Co Florals', detail: 'Third policy violation. Status: active → suspended', ts: '2025-02-10T14:28:00Z' },
  { id: 'aud_2', actor: 'Genner Castillo', actor_role: 'cs', action: 'Added note', entity_type: 'user', entity_id: 'a4f78c29', entity_label: 'Bloom & Co Florals', detail: 'Internal note added re: suspension reason', ts: '2025-02-10T14:30:00Z' },
  { id: 'aud_3', actor: 'Harry McLaughlin', actor_role: 'admin', action: 'Added note', entity_type: 'user', entity_id: 'a4f78c29', entity_label: 'Bloom & Co Florals', detail: 'Note re: vendor outreach, escalated to leadership', ts: '2025-02-12T09:15:00Z' },
  { id: 'aud_4', actor: 'Genner Castillo', actor_role: 'cs', action: 'Opened dispute', entity_type: 'transaction', entity_id: 'txn_8Fh4Tz3J7nLwS1uX', entity_label: 'txn_8Fh4Tz3J...', detail: 'Dispute opened. $4,500 on hold pending resolution', ts: '2025-02-12T10:00:00Z' },
  { id: 'aud_5', actor: 'Genner Castillo', actor_role: 'cs', action: 'Added note', entity_type: 'transaction', entity_id: 'txn_8Fh4Tz3J7nLwS1uX', entity_label: 'txn_8Fh4Tz3J...', detail: 'Dispute notes added, awaiting vendor response', ts: '2025-02-14T11:00:00Z' },
  { id: 'aud_6', actor: 'Harry McLaughlin', actor_role: 'admin', action: 'Flagged review', entity_type: 'review', entity_id: 'rev_9Fh3Tz4J8nLwS7uX', entity_label: 'Review by Jordan & Priya Ellis', detail: 'Review flagged for moderation review', ts: '2025-02-16T08:00:00Z' },
];

export const MOCK_ALERT_CONFIGS: AlertConfig[] = [
  { id: 'alt_1', label: 'New dispute opened', enabled: true, channel: 'slack' },
  { id: 'alt_2', label: 'High-risk conversation (score ≥60)', enabled: true, threshold: 60, channel: 'slack' },
  { id: 'alt_3', label: 'Vendor dispute rate >10%', enabled: true, threshold: 10, channel: 'email' },
  { id: 'alt_4', label: 'New flagged review', enabled: true, channel: 'console' },
  { id: 'alt_5', label: 'Vendor in pending >5 days', enabled: false, threshold: 5, channel: 'email' },
  { id: 'alt_6', label: 'Weekly digest report', enabled: true, channel: 'email' },
  { id: 'alt_7', label: 'Listing inactive 90+ days', enabled: false, threshold: 90, channel: 'console' },
];

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
