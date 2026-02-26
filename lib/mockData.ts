import type { Conversation, Note, AuditEntry } from './types';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1', participants: ['Bloom & Co Photography', 'Sarah + James'],
    participant_ids: ['v_1', 'c_1'], listing: 'Full-Day Wedding Photography', listing_id: 'lst_1',
    txn_id: 'txn_1', message_count: 6, reviewed: false, status: 'flagged',
    last_message: "I can do it cheaper if you pay me on Venmo directly",
    messages: [
      { id: 'm1', sender: 'Sarah + James', role: 'couple', text: 'Hi! We love your portfolio. Are you available June 14th?', ts: '2026-02-20T10:00:00Z' },
      { id: 'm2', sender: 'Bloom & Co Photography', role: 'vendor', text: 'Yes! June 14th works great. My package includes 8 hours of coverage.', ts: '2026-02-20T10:30:00Z' },
      { id: 'm3', sender: 'Sarah + James', role: 'couple', text: 'Great, what is the total cost?', ts: '2026-02-20T11:00:00Z' },
      { id: 'm4', sender: 'Bloom & Co Photography', role: 'vendor', text: 'The listing price is $3,200 but I can do it cheaper if you pay me on Venmo directly and we skip the platform fees.', ts: '2026-02-20T11:15:00Z' },
      { id: 'm5', sender: 'Sarah + James', role: 'couple', text: 'How much cheaper are we talking?', ts: '2026-02-20T11:30:00Z' },
      { id: 'm6', sender: 'Bloom & Co Photography', role: 'vendor', text: 'Save on fees — maybe $200. Just text me at 704-555-0192.', ts: '2026-02-20T11:45:00Z' },
    ],
  },
  {
    id: 'conv_2', participants: ['Charleston Florals', 'Emily + Mark'],
    participant_ids: ['v_2', 'c_2'], listing: 'Garden Floral Package', listing_id: 'lst_2',
    message_count: 4, reviewed: false, status: 'flagged',
    last_message: "Send the deposit to my PayPal",
    messages: [
      { id: 'm1', sender: 'Emily + Mark', role: 'couple', text: 'We are interested in the garden package for our October wedding.', ts: '2026-02-21T09:00:00Z' },
      { id: 'm2', sender: 'Charleston Florals', role: 'vendor', text: 'Wonderful! October is beautiful for florals. What is your color palette?', ts: '2026-02-21T09:30:00Z' },
      { id: 'm3', sender: 'Emily + Mark', role: 'couple', text: 'Blush and ivory. How do we book?', ts: '2026-02-21T10:00:00Z' },
      { id: 'm4', sender: 'Charleston Florals', role: 'vendor', text: 'Send the deposit to my PayPal at florist@gmail.com and we are all set!', ts: '2026-02-21T10:15:00Z' },
    ],
  },
  {
    id: 'conv_3', participants: ['Soundwave DJ', 'Jessica + Tom'],
    participant_ids: ['v_3', 'c_3'], listing: 'DJ + MC Package', listing_id: 'lst_3',
    txn_id: 'txn_3', message_count: 5, reviewed: true, status: 'flagged',
    last_message: "Can I get your WhatsApp to send the timeline?",
    messages: [
      { id: 'm1', sender: 'Jessica + Tom', role: 'couple', text: 'We are so excited about your DJ set. Can you do a mix of 80s and current hits?', ts: '2026-02-18T14:00:00Z' },
      { id: 'm2', sender: 'Soundwave DJ', role: 'vendor', text: 'Absolutely! That is my specialty. I will create a custom playlist for you.', ts: '2026-02-18T14:30:00Z' },
      { id: 'm3', sender: 'Jessica + Tom', role: 'couple', text: 'Amazing. We have a detailed timeline to share.', ts: '2026-02-18T15:00:00Z' },
      { id: 'm4', sender: 'Soundwave DJ', role: 'vendor', text: 'Perfect. Can I get your WhatsApp to send you the contract and timeline? My number is 843-555-0198.', ts: '2026-02-18T15:15:00Z' },
      { id: 'm5', sender: 'Jessica + Tom', role: 'couple', text: 'Sure, we will reach out there.', ts: '2026-02-18T15:30:00Z' },
    ],
  },
  {
    id: 'conv_4', participants: ['Magnolia Catering', 'Rachel + David'],
    participant_ids: ['v_4', 'c_4'], listing: 'Farm-to-Table Catering', listing_id: 'lst_4',
    txn_id: 'txn_4', message_count: 3, reviewed: false, status: 'clean',
    last_message: "We can accommodate all dietary restrictions listed.",
    messages: [
      { id: 'm1', sender: 'Rachel + David', role: 'couple', text: 'Hello! We have several guests with dietary restrictions. Can you accommodate?', ts: '2026-02-22T11:00:00Z' },
      { id: 'm2', sender: 'Magnolia Catering', role: 'vendor', text: 'Of course! Please share the list and we will build the menu around it.', ts: '2026-02-22T11:30:00Z' },
      { id: 'm3', sender: 'Rachel + David', role: 'couple', text: 'Great, here is the list. Two vegan, one gluten-free, one nut allergy.', ts: '2026-02-22T12:00:00Z' },
    ],
  },
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n_1', entity_type: 'conversation', entity_id: 'conv_1',
    author: 'Admin', author_role: 'admin',
    text: 'Vendor has been warned once before about off-platform payment requests. Escalate if it happens again.',
    ts: '2026-02-20T12:00:00Z', pinned: true,
  },
  {
    id: 'n_2', entity_type: 'conversation', entity_id: 'conv_3',
    author: 'CS Team', author_role: 'cs',
    text: 'Reviewed and flagged. Vendor contacted via email about WhatsApp solicitation policy.',
    ts: '2026-02-19T09:00:00Z',
  },
];

export const MOCK_AUDIT: AuditEntry[] = [
  {
    id: 'a_1', actor: 'Admin', actor_role: 'admin', action: 'mark_reviewed',
    entity_type: 'conversation', entity_id: 'conv_3', entity_label: 'Soundwave DJ + Jessica + Tom',
    detail: 'Marked as reviewed', ts: '2026-02-19T09:30:00Z',
  },
  {
    id: 'a_2', actor: 'CS Team', actor_role: 'cs', action: 'add_note',
    entity_type: 'conversation', entity_id: 'conv_3', entity_label: 'Soundwave DJ + Jessica + Tom',
    detail: 'Added note', ts: '2026-02-19T09:00:00Z',
  },
  {
    id: 'a_3', actor: 'Admin', actor_role: 'admin', action: 'add_note',
    entity_type: 'conversation', entity_id: 'conv_1', entity_label: 'Bloom & Co Photography + Sarah + James',
    detail: 'Added pinned note', ts: '2026-02-20T12:00:00Z',
  },
];
