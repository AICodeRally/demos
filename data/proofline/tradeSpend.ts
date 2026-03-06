export interface PromoBudget {
  brandId: string;
  brandName: string;
  allocated: number;
  spent: number;
  remaining: number;
  program: string;
}

export interface TABCCheckItem {
  id: string;
  name: string;
  description: string;
  status: 'green' | 'amber' | 'red';
  lastAudit: string;
}

export interface SupplierProgram {
  supplier: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  targetPct: number;
  currentPct: number;
  incentiveValue: number;
}

export interface CashDiscipline {
  codCollectionRate: number;
  delinquentAccounts: number;
  creditExposure: number;
  avgDaysCashOutstanding: number;
  licenseBreakdown: Array<{ type: string; accounts: number; exposure: number }>;
}

export const PROMO_BUDGETS: PromoBudget[] = [
  { brandId: 'bud', brandName: 'Bud Light', allocated: 820000, spent: 645000, remaining: 175000, program: 'Summer Dominance — cooler placements, endcap resets, POS materials' },
  { brandId: 'mic', brandName: 'Michelob Ultra', allocated: 540000, spent: 412000, remaining: 128000, program: 'Fitness & Lifestyle — gym partnerships, 5K sponsorships, wellness events' },
  { brandId: 'mod', brandName: 'Modelo Especial', allocated: 680000, spent: 520000, remaining: 160000, program: 'Fighting Spirit — cultural events, soccer sponsorships, mural campaigns' },
  { brandId: 'stel', brandName: 'Stella Artois', allocated: 380000, spent: 285000, remaining: 95000, program: 'Premium Dining — white-tablecloth placements, restaurant week sponsorships' },
  { brandId: 'shi', brandName: 'Shiner Spirits', allocated: 420000, spent: 310000, remaining: 110000, program: 'Texas Proud — local bar activations, rodeo sponsorships, tasting events' },
  { brandId: 'topo', brandName: 'Topo Chico Hard Seltzer', allocated: 350000, spent: 228000, remaining: 122000, program: 'Summer Refresh — pool party events, convenience store cooler resets' },
  { brandId: 'kar', brandName: 'Karbach Brewing', allocated: 280000, spent: 195000, remaining: 85000, program: 'Craft Curious — taproom partnerships, seasonal flight programs' },
  { brandId: 'cut', brandName: 'Cutwater Spirits', allocated: 220000, spent: 142000, remaining: 78000, program: 'Ready-to-Drink Revolution — liquor store displays, sampling events' },
];

export const TABC_CHECKLIST: TABCCheckItem[] = [
  {
    id: 'tabc-01',
    name: 'Age Verification',
    description: 'TABC Section 106.01 — All delivery personnel must verify purchaser is 21+ with valid government-issued ID. Training current for all 24 sellers.',
    status: 'green',
    lastAudit: '2026-02-15',
  },
  {
    id: 'tabc-02',
    name: 'Happy Hour Pricing',
    description: 'TABC Rule 45.104 — No reduced-price promotions during restricted hours (prohibited "happy hour" pricing enforcement). All on-premise accounts in compliance.',
    status: 'green',
    lastAudit: '2026-02-15',
  },
  {
    id: 'tabc-03',
    name: 'Credit Terms Compliance',
    description: 'TABC Section 102.32 — Cash or cash-equivalent collection within statutory period. No credit extensions beyond permitted terms. COD collection rate 97.3%.',
    status: 'green',
    lastAudit: '2026-02-15',
  },
  {
    id: 'tabc-04',
    name: 'Delinquency List Check',
    description: 'TABC Rule 45.81 — Weekly cross-reference against TABC delinquency list. No deliveries to delinquent accounts. 3 accounts currently flagged and blocked.',
    status: 'green',
    lastAudit: '2026-02-15',
  },
  {
    id: 'tabc-05',
    name: 'Inducement Rules',
    description: 'TABC Section 102.07 — No gifts, loans, or equipment to retailers exceeding permitted limits. All POS materials and cooler placements within regulatory thresholds.',
    status: 'green',
    lastAudit: '2026-02-15',
  },
];

export const SUPPLIER_PROGRAMS: SupplierProgram[] = [
  { supplier: 'AB InBev', tier: 'Gold', targetPct: 0.90, currentPct: 0.92, incentiveValue: 840000 },
  { supplier: 'Constellation', tier: 'Silver', targetPct: 0.80, currentPct: 0.78, incentiveValue: 320000 },
  { supplier: 'Molson Coors', tier: 'Bronze', targetPct: 0.70, currentPct: 0.65, incentiveValue: 180000 },
];

export const CASH_DISCIPLINE: CashDiscipline = {
  codCollectionRate: 0.973,
  delinquentAccounts: 3,
  creditExposure: 142000,
  avgDaysCashOutstanding: 18,
  licenseBreakdown: [
    { type: 'On-Premise (TABC Mixed Beverage)', accounts: 892, exposure: 68000 },
    { type: 'Off-Premise (TABC Package Store)', accounts: 1240, exposure: 52000 },
    { type: 'Off-Premise (TABC Wine & Beer)', accounts: 1648, exposure: 22000 },
  ],
};
