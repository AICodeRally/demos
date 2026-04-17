// summit/sparcc/modules/swic/src/data/summit-sleep-pos.ts

export interface POSProduct {
  id: string;
  name: string;
  category: 'mattress' | 'base' | 'accessory' | 'protection';
  comfort?: 'firm' | 'medium' | 'plush';
  size?: 'twin' | 'full' | 'queen' | 'king' | 'cal-king';
  price: number;
  commission: number;
  image?: string;
}

export interface BundleSuggestion {
  triggerCategory: string;
  triggerMinPrice: number;
  suggestion: POSProduct;
  reason: string;
  commissionLift: number;
  attachRateLift: number;
}

export interface FinancingTerm {
  months: number;
  label: string;
  apr: number;
  closeRateData: string;
}

export interface CustomerProfile {
  type: 'walk-in' | 'returning';
  sleepPref: string;
  budget: string;
}

export const MATTRESSES: POSProduct[] = [
  { id: 'mt-twin-firm', name: 'Essential Twin Firm', category: 'mattress', comfort: 'firm', size: 'twin', price: 699, commission: 28 },
  { id: 'mt-full-firm', name: 'Essential Full Firm', category: 'mattress', comfort: 'firm', size: 'full', price: 849, commission: 34 },
  { id: 'mt-queen-firm', name: 'Essential Queen Firm', category: 'mattress', comfort: 'firm', size: 'queen', price: 999, commission: 40 },
  { id: 'mt-king-firm', name: 'Essential King Firm', category: 'mattress', comfort: 'firm', size: 'king', price: 1199, commission: 48 },
  { id: 'mt-queen-med', name: 'Comfort Queen Medium', category: 'mattress', comfort: 'medium', size: 'queen', price: 1299, commission: 52 },
  { id: 'mt-king-med', name: 'Comfort King Medium', category: 'mattress', comfort: 'medium', size: 'king', price: 1499, commission: 60 },
  { id: 'mt-queen-hybrid', name: 'Harmony Queen Hybrid', category: 'mattress', comfort: 'medium', size: 'queen', price: 1899, commission: 76 },
  { id: 'mt-king-hybrid', name: 'Harmony King Hybrid', category: 'mattress', comfort: 'medium', size: 'king', price: 2199, commission: 88 },
  { id: 'mt-queen-plush', name: 'Luxe Queen Pillow-Top', category: 'mattress', comfort: 'plush', size: 'queen', price: 2299, commission: 92 },
  { id: 'mt-king-plush', name: 'Luxe King Pillow-Top', category: 'mattress', comfort: 'plush', size: 'king', price: 2499, commission: 100 },
  { id: 'mt-calking-plush', name: 'Luxe Cal-King Pillow-Top', category: 'mattress', comfort: 'plush', size: 'cal-king', price: 2599, commission: 104 },
];

export const BASES: POSProduct[] = [
  { id: 'base-queen', name: 'ErgoMotion Queen Adj. Base', category: 'base', size: 'queen', price: 799, commission: 40 },
  { id: 'base-king', name: 'ErgoMotion King Adj. Base', category: 'base', size: 'king', price: 999, commission: 50 },
  { id: 'base-split-king', name: 'ErgoMotion Split King Base', category: 'base', size: 'king', price: 1399, commission: 70 },
];

export const ACCESSORIES: POSProduct[] = [
  { id: 'acc-pillow-basic', name: 'Basic Pillow', category: 'accessory', price: 39, commission: 4 },
  { id: 'acc-pillow-premium', name: 'Premium Pillow Set', category: 'accessory', price: 189, commission: 19 },
  { id: 'acc-sheets-queen', name: 'Cooling Sheets (Queen)', category: 'accessory', price: 129, commission: 13 },
  { id: 'acc-sheets-king', name: 'Cooling Sheets (King)', category: 'accessory', price: 149, commission: 15 },
  { id: 'acc-topper', name: 'Memory Foam Topper', category: 'accessory', price: 249, commission: 25 },
];

export const PROTECTION: POSProduct[] = [
  { id: 'prot-basic', name: 'Standard Protector', category: 'protection', price: 69, commission: 14 },
  { id: 'prot-cool', name: 'CoolGuard Protector', category: 'protection', price: 149, commission: 30 },
  { id: 'prot-plan-5', name: '5-Year Protection Plan', category: 'protection', price: 199, commission: 40 },
  { id: 'prot-plan-10', name: '10-Year Protection Plan', category: 'protection', price: 349, commission: 70 },
];

export const ALL_PRODUCTS = [...MATTRESSES, ...BASES, ...ACCESSORIES, ...PROTECTION];

export const BUNDLE_SUGGESTIONS: BundleSuggestion[] = [
  {
    triggerCategory: 'mattress',
    triggerMinPrice: 1000,
    suggestion: BASES[0],
    reason: 'Customers who bought a mattress over $1,000 added an adjustable base 43% of the time',
    commissionLift: 40,
    attachRateLift: 43,
  },
  {
    triggerCategory: 'mattress',
    triggerMinPrice: 0,
    suggestion: PROTECTION[1],
    reason: 'Protects the warranty and adds $30 to your commission — 68% of customers say yes when asked',
    commissionLift: 30,
    attachRateLift: 68,
  },
  {
    triggerCategory: 'base',
    triggerMinPrice: 0,
    suggestion: ACCESSORIES[1],
    reason: 'Adjustable base buyers add premium pillows 55% of the time — complete the sleep system',
    commissionLift: 19,
    attachRateLift: 55,
  },
  {
    triggerCategory: 'mattress',
    triggerMinPrice: 2000,
    suggestion: ACCESSORIES[4],
    reason: 'Premium buyers love the topper upgrade — adds $25 commission with 38% attach rate',
    commissionLift: 25,
    attachRateLift: 38,
  },
];

export const FINANCING_TERMS: FinancingTerm[] = [
  { months: 0, label: 'Pay in Full', apr: 0, closeRateData: 'Baseline' },
  { months: 6, label: '6 Months', apr: 0, closeRateData: '+12% close rate' },
  { months: 12, label: '12 Months', apr: 0, closeRateData: '+24% close rate' },
  { months: 24, label: '24 Months', apr: 5.99, closeRateData: '+41% close rate' },
  { months: 36, label: '36 Months', apr: 7.99, closeRateData: '+72% close rate for $2,500+' },
  { months: 48, label: '48 Months', apr: 9.99, closeRateData: '+65% close rate for $3,000+' },
];

export const TIER_THRESHOLDS = [
  { tier: 'Bronze', minRevenue: 0, rate: 0.04, color: '#CD7F32' },
  { tier: 'Silver', minRevenue: 25000, rate: 0.045, color: '#C0C0C0' },
  { tier: 'Gold', minRevenue: 50000, rate: 0.05, color: '#FFD700' },
  { tier: 'Platinum', minRevenue: 75000, rate: 0.055, color: '#E5E4E2' },
];

export const COACHING_PRELOADS: Record<string, { customer: CustomerProfile; cartItemIds: string[] }> = {
  casey: {
    customer: { type: 'walk-in', sleepPref: 'Side sleeper, runs hot', budget: '$1,500–$2,500' },
    cartItemIds: ['mt-queen-hybrid'],
  },
  raj: {
    customer: { type: 'returning', sleepPref: 'Back sleeper, firm preference', budget: '$2,000–$3,000' },
    cartItemIds: ['mt-king-plush'],
  },
  james: {
    customer: { type: 'walk-in', sleepPref: 'Not sure yet', budget: 'Budget-conscious' },
    cartItemIds: ['mt-twin-firm'],
  },
};
