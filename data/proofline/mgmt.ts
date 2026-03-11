// Lone Star Distribution — Sales Comp Management Data
// Act 5 module data: transactions (crediting), payments, club tiers, inquiries (enhanced)

// ─── Types ───────────────────────────────────────

export type CreditRule = 'primary' | 'split-50-50' | 'split-70-30' | 'territory-override';
export type PaymentType = 'Base' | 'Variable' | 'Commission' | 'Bonus';
export type PaymentStatus = 'Pending' | 'Approved' | 'Deposited' | 'Held';
export type ClubTier = 'Gold' | 'Silver' | 'Bronze' | 'Tracking';
export type InquiryStatus = 'open' | 'under-review' | 'resolved' | 'escalated';
export type InquiryCategory =
  | 'data-error'
  | 'gate-dispute'
  | 'territory-credit'
  | 'kicker-eligibility'
  | 'other';

// ─── Transactions (Crediting Tab) ───────────────

export interface Transaction {
  id: string;
  date: string;
  accountName: string;
  product: string;         // brand name
  category: string;        // Core / Import / Emerging
  cases: number;
  revenue: number;
  creditedRep: string;
  routeId: string;
  rule: CreditRule;
  confidence: number;      // 0–1 confidence score on crediting rule
  splitWith?: string;      // other rep name if split
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-2026-0301', date: '2026-03-01',
    accountName: 'Cedar Springs Tap House', product: 'Coors Light', category: 'Core',
    cases: 24, revenue: 684, creditedRep: 'Marcus Reyes', routeId: 'DAL-03',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0302', date: '2026-03-01',
    accountName: 'El Mercado #3', product: 'Corona Extra', category: 'Import',
    cases: 28, revenue: 924, creditedRep: 'Rosa Gutierrez', routeId: 'LAR-02',
    rule: 'territory-override', confidence: 0.84,
  },
  {
    id: 'TXN-2026-0303', date: '2026-03-02',
    accountName: 'Total Wine Allen', product: 'Blue Moon', category: 'Core',
    cases: 48, revenue: 1536, creditedRep: 'David Sharma', routeId: 'ALN-01',
    rule: 'primary', confidence: 0.97,
  },
  {
    id: 'TXN-2026-0304', date: '2026-03-02',
    accountName: 'Henderson Sports Bar', product: 'Modelo Especial', category: 'Import',
    cases: 36, revenue: 1188, creditedRep: 'Derek Thompson', routeId: 'DAL-01',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0305', date: '2026-03-03',
    accountName: 'Spec\'s Fort Worth Central', product: 'Firestone Walker 805', category: 'Emerging',
    cases: 18, revenue: 720, creditedRep: 'Jake Williams', routeId: 'FTW-05',
    rule: 'primary', confidence: 0.91,
  },
  {
    id: 'TXN-2026-0306', date: '2026-03-03',
    accountName: 'Alamo Drafthouse', product: 'Vizzy Hard Seltzer', category: 'Emerging',
    cases: 22, revenue: 770, creditedRep: 'Kim Tran', routeId: 'DAL-02',
    rule: 'primary', confidence: 0.98,
  },
  {
    id: 'TXN-2026-0307', date: '2026-03-04',
    accountName: 'HEB Laredo #12', product: 'Heineken Original', category: 'Import',
    cases: 60, revenue: 2100, creditedRep: 'Rosa Gutierrez', routeId: 'LAR-02',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0308', date: '2026-03-04',
    accountName: 'Whataburger North Dallas (Chain)', product: 'Miller Lite', category: 'Core',
    cases: 96, revenue: 2688, creditedRep: 'Marcus Reyes', routeId: 'DAL-03',
    rule: 'split-70-30', confidence: 0.88, splitWith: 'Derek Thompson',
  },
  {
    id: 'TXN-2026-0309', date: '2026-03-05',
    accountName: 'HEB Allen', product: 'Dos Equis Lager', category: 'Import',
    cases: 42, revenue: 1386, creditedRep: 'David Sharma', routeId: 'ALN-01',
    rule: 'primary', confidence: 0.96,
  },
  {
    id: 'TXN-2026-0310', date: '2026-03-05',
    accountName: 'Ranger Creek Taproom', product: 'Lone Star', category: 'Core',
    cases: 30, revenue: 720, creditedRep: 'Jake Williams', routeId: 'FTW-05',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0311', date: '2026-03-06',
    accountName: 'Kroger Laredo', product: 'Pacifico Clara', category: 'Import',
    cases: 54, revenue: 1782, creditedRep: 'Rosa Gutierrez', routeId: 'LAR-02',
    rule: 'primary', confidence: 0.97,
  },
  {
    id: 'TXN-2026-0312', date: '2026-03-06',
    accountName: 'Bar Louie Allen', product: 'Woodford Reserve', category: 'Emerging',
    cases: 6, revenue: 1140, creditedRep: 'David Sharma', routeId: 'ALN-01',
    rule: 'primary', confidence: 0.95,
  },
  {
    id: 'TXN-2026-0313', date: '2026-03-07',
    accountName: 'Chili\'s Hurst (Chain)', product: 'Coors Banquet', category: 'Core',
    cases: 84, revenue: 2352, creditedRep: 'Jake Williams', routeId: 'FTW-05',
    rule: 'split-50-50', confidence: 0.79, splitWith: 'Maria Santos',
  },
  {
    id: 'TXN-2026-0314', date: '2026-03-07',
    accountName: 'The Rustic Dallas', product: 'Corona Light', category: 'Import',
    cases: 32, revenue: 1024, creditedRep: 'Derek Thompson', routeId: 'DAL-01',
    rule: 'primary', confidence: 0.98,
  },
  {
    id: 'TXN-2026-0315', date: '2026-03-08',
    accountName: 'Academy Sports Fort Worth', product: 'Vizzy Hard Seltzer', category: 'Emerging',
    cases: 48, revenue: 1728, creditedRep: 'Jake Williams', routeId: 'FTW-05',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0316', date: '2026-03-08',
    accountName: 'Mi Tierra Corpus Christi', product: 'Modelo Negra', category: 'Import',
    cases: 20, revenue: 680, creditedRep: 'Miguel Vega', routeId: 'CRP-01',
    rule: 'primary', confidence: 0.97,
  },
  {
    id: 'TXN-2026-0317', date: '2026-03-09',
    accountName: 'Costco Allen', product: 'Miller High Life', category: 'Core',
    cases: 120, revenue: 3000, creditedRep: 'David Sharma', routeId: 'ALN-01',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0318', date: '2026-03-09',
    accountName: 'Target Dallas Park Cities', product: 'Saint Arnold Brewing', category: 'Emerging',
    cases: 24, revenue: 984, creditedRep: 'Kim Tran', routeId: 'DAL-02',
    rule: 'primary', confidence: 0.93,
  },
];

// ─── Payment Ledger ──────────────────────────────

export interface Payment {
  id: string;
  date: string;
  repName: string;
  routeId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  payCycle: string;       // e.g., "2026-02-01 – 2026-02-14"
  note?: string;
}

export const PAYMENTS: Payment[] = [
  // Pay cycle 1: Feb 1–14
  { id: 'PAY-001', date: '2026-02-14', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Base', amount: 3461.54, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-002', date: '2026-02-14', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Commission', amount: 1284.00, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-003', date: '2026-02-14', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Base', amount: 3076.92, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-004', date: '2026-02-14', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Commission', amount: 940.00, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-005', date: '2026-02-14', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Base', amount: 2884.62, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-006', date: '2026-02-14', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Commission', amount: 812.00, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-007', date: '2026-02-14', repName: 'Rosa Gutierrez', routeId: 'LAR-02', type: 'Base', amount: 2884.62, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-008', date: '2026-02-14', repName: 'David Sharma', routeId: 'ALN-01', type: 'Base', amount: 3076.92, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-009', date: '2026-02-14', repName: 'Jake Williams', routeId: 'FTW-05', type: 'Base', amount: 2692.31, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  // Pay cycle 2: Feb 15–28
  { id: 'PAY-010', date: '2026-02-28', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Base', amount: 3461.54, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-011', date: '2026-02-28', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Variable', amount: 2100.00, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-012', date: '2026-02-28', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Bonus', amount: 1500.00, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28', note: 'Q1 Kicker — Emerging Push' },
  { id: 'PAY-013', date: '2026-02-28', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Base', amount: 3076.92, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-014', date: '2026-02-28', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Variable', amount: 1620.00, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-015', date: '2026-02-28', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Base', amount: 2884.62, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-016', date: '2026-02-28', repName: 'Rosa Gutierrez', routeId: 'LAR-02', type: 'Base', amount: 2884.62, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-017', date: '2026-02-28', repName: 'Rosa Gutierrez', routeId: 'LAR-02', type: 'Commission', amount: 760.00, status: 'Held', payCycle: '2026-02-15 – 2026-02-28', note: 'Territory dispute pending (INQ-002)' },
  { id: 'PAY-018', date: '2026-02-28', repName: 'David Sharma', routeId: 'ALN-01', type: 'Base', amount: 3076.92, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-019', date: '2026-02-28', repName: 'David Sharma', routeId: 'ALN-01', type: 'Variable', amount: 1840.00, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-020', date: '2026-02-28', repName: 'Jake Williams', routeId: 'FTW-05', type: 'Base', amount: 2692.31, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  // Pay cycle 3: Mar 1–14 (current — pending/approved)
  { id: 'PAY-021', date: '2026-03-14', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Base', amount: 3461.54, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-022', date: '2026-03-14', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Commission', amount: 1560.00, status: 'Pending', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-023', date: '2026-03-14', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Base', amount: 3076.92, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-024', date: '2026-03-14', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Base', amount: 2884.62, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-025', date: '2026-03-14', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Bonus', amount: 2800.00, status: 'Pending', payCycle: '2026-03-01 – 2026-03-14', note: 'Kicker eligibility escalated (INQ-004) — awaiting VP review' },
  { id: 'PAY-026', date: '2026-03-14', repName: 'Rosa Gutierrez', routeId: 'LAR-02', type: 'Base', amount: 2884.62, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-027', date: '2026-03-14', repName: 'David Sharma', routeId: 'ALN-01', type: 'Base', amount: 3076.92, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-028', date: '2026-03-14', repName: 'Jake Williams', routeId: 'FTW-05', type: 'Base', amount: 2692.31, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-029', date: '2026-03-14', repName: 'Jake Williams', routeId: 'FTW-05', type: 'Commission', amount: 980.00, status: 'Pending', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-030', date: '2026-03-14', repName: 'Miguel Vega', routeId: 'CRP-01', type: 'Base', amount: 2692.31, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
];

// ─── Presidents Club Tiers ────────────────────────

export interface ClubTierDef {
  tier: ClubTier;
  label: string;
  threshold: number;   // annual attainment % floor
  color: string;
  payout: string;      // description of reward
}

export const CLUB_TIERS: ClubTierDef[] = [
  {
    tier: 'Gold',
    label: 'Gold Club',
    threshold: 1.20,
    color: '#F59E0B',
    payout: 'Cancun trip for 2 + $2,500 cash + Gold ring',
  },
  {
    tier: 'Silver',
    label: 'Silver Club',
    threshold: 1.10,
    color: '#94A3B8',
    payout: 'Las Vegas trip for 2 + $1,500 cash',
  },
  {
    tier: 'Bronze',
    label: 'Bronze Club',
    threshold: 1.05,
    color: '#CD7F32',
    payout: '$750 cash + recognition dinner',
  },
  {
    tier: 'Tracking',
    label: 'On Pace',
    threshold: 0.90,
    color: '#0EA5E9',
    payout: 'Pace qualification — final Q4 push required',
  },
];

// ─── Enhanced Inquiries ───────────────────────────
// Same data as existing comp/inquiries/page.tsx inline data,
// moved here for shared access across Act 5 modules.

export interface Inquiry {
  id: string;
  repName: string;
  routeId: string;
  category: InquiryCategory;
  subject: string;
  description: string;
  submittedDate: string;
  status: InquiryStatus;
  reviewerName: string | null;
  resolution: string | null;
  resolvedDate: string | null;
  impactAmount: number | null;
}

export const MGMT_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-001', repName: 'Marcus Reyes', routeId: 'DAL-03', category: 'data-error',
    subject: 'Missing cases from Cedar Springs Tap House delivery',
    description: 'Feb 18 delivery of 12 cases Corona Extra not credited to my route. POD attached. Store confirmed receipt. Affects my Import gate by 2pp.',
    submittedDate: '2026-02-20', status: 'resolved', reviewerName: 'Sarah Chen',
    resolution: '12 cases Corona Extra credited. Import gate recalculated from 82% to 84%. No tier impact.',
    resolvedDate: '2026-02-22', impactAmount: 340,
  },
  {
    id: 'INQ-002', repName: 'Rosa Gutierrez', routeId: 'LAR-02', category: 'territory-credit',
    subject: 'El Mercado delivery credited to LAR-01 instead of LAR-02',
    description: 'El Mercado #3 is on my route (LAR-02) but Feb 23 delivery of 28 cases was credited to Fernando on LAR-01. This account has been mine since Laredo integration.',
    submittedDate: '2026-02-25', status: 'under-review', reviewerName: 'Roberto Garza',
    resolution: null, resolvedDate: null, impactAmount: 820,
  },
  {
    id: 'INQ-003', repName: 'Jake Williams', routeId: 'FTW-05', category: 'gate-dispute',
    subject: 'Emerging gate calculation missing Firestone Walker cases',
    description: 'My emerging gate shows 68% but Firestone Walker 805 cases from 3 accounts are not counting toward craft. These are craft brands and should be in my emerging category.',
    submittedDate: '2026-02-26', status: 'open', reviewerName: null,
    resolution: null, resolvedDate: null, impactAmount: 1200,
  },
  {
    id: 'INQ-004', repName: 'Kim Tran', routeId: 'DAL-02', category: 'kicker-eligibility',
    subject: 'Cinco de Mayo kicker should include Pacifico',
    description: 'Kicker definition says "Corona + Modelo volume" but I have 40 incremental cases of Pacifico which is also a Constellation import. Should Pacifico count toward the Cinco de Mayo kicker?',
    submittedDate: '2026-02-27', status: 'escalated', reviewerName: 'Sarah Chen',
    resolution: null, resolvedDate: null, impactAmount: 2800,
  },
  {
    id: 'INQ-005', repName: 'Derek Thompson', routeId: 'DAL-01', category: 'data-error',
    subject: 'Duplicate credit for Henderson Ave delivery',
    description: 'I was credited twice for a Feb 15 delivery to Henderson Ave. Overstated my revenue by $450. Flagging proactively — want my numbers accurate.',
    submittedDate: '2026-02-18', status: 'resolved', reviewerName: 'Sarah Chen',
    resolution: 'Duplicate removed. Revenue adjusted. No tier or gate impact. Noted for proactive integrity — positive coaching note added.',
    resolvedDate: '2026-02-19', impactAmount: -450,
  },
  {
    id: 'INQ-006', repName: 'David Sharma', routeId: 'ALN-01', category: 'territory-credit',
    subject: 'New Total Wine account should be on ALN-01 not ALN-03',
    description: 'Total Wine at Allen Premium Outlets was assigned to ALN-03 but it is in my territory ZIP code. I had initial meeting with store manager and submitted new account request.',
    submittedDate: '2026-02-28', status: 'open', reviewerName: null,
    resolution: null, resolvedDate: null, impactAmount: 3600,
  },
];

export const STATUS_CONFIG: Record<InquiryStatus, { bg: string; color: string; label: string }> = {
  'open': { bg: 'rgba(37,99,235,0.1)', color: '#2563EB', label: 'OPEN' },
  'under-review': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'REVIEWING' },
  'resolved': { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'RESOLVED' },
  'escalated': { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'ESCALATED' },
};

export const CATEGORY_LABELS: Record<InquiryCategory, string> = {
  'data-error': 'Data Error',
  'gate-dispute': 'Gate Dispute',
  'territory-credit': 'Territory Credit',
  'kicker-eligibility': 'Kicker Eligibility',
  'other': 'Other',
};
