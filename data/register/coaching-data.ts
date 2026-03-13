// data/register/coaching-data.ts

export interface RepProfile {
  id: string;
  name: string;
  role: string;
  store: string;
  shift: string;
  avatar: string; // initials
  metrics: {
    attachRate: number;
    floorAvgAttach: number;
    financingPitch: number;
    floorAvgFinancing: number;
    asp: number;
    floorAvgAsp: number;
    unitsSold: number;
    shiftRevenue: number;
  };
}

export interface CoachingScenario {
  repId: string;
  weakness: string;
  weaknessLabel: string;
  lastSale: {
    items: { name: string; price: number; category: string }[];
    total: number;
    attachRate: number;
    financingUsed: boolean;
  };
  recommendation: {
    action: string;
    products: { name: string; price: number }[];
    commissionDelta: number;
    script: string[];
  };
  preloadedCart: {
    customer: { type: 'walk-in' | 'returning'; sleepPref: string; budget: string };
    items: { name: string; price: number; category: string }[];
  };
  aiSuggestion: string;
}

export interface ShiftSale {
  id: string;
  time: string;
  items: { name: string; price: number }[];
  total: number;
  attachRate: number;
  financingUsed: boolean;
}

export const REPS: RepProfile[] = [
  {
    id: 'casey',
    name: 'Casey Miller',
    role: 'Floor Associate',
    store: 'Flagship #12 — Galleria',
    shift: 'Morning (8am–4pm)',
    avatar: 'CM',
    metrics: {
      attachRate: 12,
      floorAvgAttach: 31,
      financingPitch: 55,
      floorAvgFinancing: 64,
      asp: 1780,
      floorAvgAsp: 1890,
      unitsSold: 4,
      shiftRevenue: 7120,
    },
  },
  {
    id: 'raj',
    name: 'Raj Patel',
    role: 'Senior Floor Associate',
    store: 'Flagship #12 — Galleria',
    shift: 'Morning (8am–4pm)',
    avatar: 'RP',
    metrics: {
      attachRate: 29,
      floorAvgAttach: 31,
      financingPitch: 28,
      floorAvgFinancing: 64,
      asp: 2100,
      floorAvgAsp: 1890,
      unitsSold: 3,
      shiftRevenue: 6300,
    },
  },
  {
    id: 'james',
    name: 'James Wu',
    role: 'Floor Associate',
    store: 'Flagship #12 — Galleria',
    shift: 'Morning (8am–4pm)',
    avatar: 'JW',
    metrics: {
      attachRate: 34,
      floorAvgAttach: 31,
      financingPitch: 71,
      floorAvgFinancing: 64,
      asp: 1420,
      floorAvgAsp: 1890,
      unitsSold: 5,
      shiftRevenue: 7100,
    },
  },
];

export const COACHING_SCENARIOS: CoachingScenario[] = [
  {
    repId: 'casey',
    weakness: 'attach_rate',
    weaknessLabel: 'Low Attach Rate',
    lastSale: {
      items: [{ name: 'Harmony Queen Hybrid', price: 1899, category: 'Mattresses' }],
      total: 1899,
      attachRate: 0,
      financingUsed: false,
    },
    recommendation: {
      action: 'Bundle adjustable base + mattress protector with every mattress sale',
      products: [
        { name: 'ErgoMotion Adjustable Base', price: 799 },
        { name: 'CoolGuard Mattress Protector', price: 149 },
      ],
      commissionDelta: 89,
      script: [
        'Casey, your mattress knowledge is strong — customers love your product demos.',
        'The opportunity is in what happens after they choose the mattress.',
        'Try this: "Now that you\'ve found your perfect mattress, let me show you how to get the most out of it."',
        'Lead with the adjustable base demo — let them feel the zero-gravity position.',
        'The protector is a natural add: "This keeps your warranty fully protected."',
      ],
    },
    preloadedCart: {
      customer: { type: 'walk-in', sleepPref: 'Side sleeper, runs hot', budget: '$1,500–$2,500' },
      items: [{ name: 'Harmony Queen Hybrid', price: 1899, category: 'Mattresses' }],
    },
    aiSuggestion: 'Add adjustable base + protector = +$89 commission',
  },
  {
    repId: 'raj',
    weakness: 'financing_pitch',
    weaknessLabel: 'Low Financing Pitch Rate',
    lastSale: {
      items: [
        { name: 'Luxe King Pillow-Top', price: 2499, category: 'Mattresses' },
        { name: 'Premium Pillow Set', price: 189, category: 'Sleep Accessories' },
      ],
      total: 2688,
      attachRate: 100,
      financingUsed: false,
    },
    recommendation: {
      action: 'Introduce financing early — reframe price as monthly investment',
      products: [],
      commissionDelta: 0,
      script: [
        'Raj, your product knowledge and attach rates are excellent.',
        'The gap is in how you present pricing — you\'re losing customers who love the product but hesitate at the total.',
        'Try leading with monthly cost: "This mattress is $69/month — less than your streaming subscriptions combined."',
        '72% of customers spending $2,500+ choose 36-month financing when it\'s presented upfront.',
        'Your commission stays the same regardless of how they pay — financing just helps them say yes.',
      ],
    },
    preloadedCart: {
      customer: { type: 'returning', sleepPref: 'Back sleeper, firm preference', budget: '$2,000–$3,000' },
      items: [{ name: 'Luxe King Pillow-Top', price: 2499, category: 'Mattresses' }],
    },
    aiSuggestion: 'Show 36-mo at $69/mo — 72% close rate for $2,500+ sales',
  },
  {
    repId: 'james',
    weakness: 'low_asp',
    weaknessLabel: 'Below-Average ASP',
    lastSale: {
      items: [
        { name: 'Essential Twin Firm', price: 699, category: 'Mattresses' },
        { name: 'Basic Pillow', price: 39, category: 'Sleep Accessories' },
        { name: 'Standard Protector', price: 69, category: 'Protection Plans' },
      ],
      total: 807,
      attachRate: 67,
      financingUsed: false,
    },
    recommendation: {
      action: 'Guide customers to mid-tier — demonstrate value gap between budget and mid-range',
      products: [{ name: 'Comfort Queen Medium', price: 1299 }],
      commissionDelta: 51,
      script: [
        'James, your attach rates and financing are the best on the floor — really strong fundamentals.',
        'The opportunity is in the initial mattress selection. You\'re letting customers anchor on budget options.',
        'Try the "step-up" demo: Let them try the budget, then immediately try the mid-tier.',
        '"Feel the difference? That\'s the upgraded foam core. Most customers tell me this is where the value is."',
        'Moving from Twin Firm ($699) to Queen Medium ($1,299) adds $51 to your commission on this one sale.',
      ],
    },
    preloadedCart: {
      customer: { type: 'walk-in', sleepPref: 'Not sure yet', budget: 'Budget-conscious' },
      items: [{ name: 'Essential Twin Firm', price: 699, category: 'Mattresses' }],
    },
    aiSuggestion: 'Upgrade to Queen Medium = +$340 revenue, +$51 commission',
  },
];

export const SHIFT_SALES: ShiftSale[] = [
  {
    id: 'S-1041',
    time: '9:15 AM',
    items: [
      { name: 'Harmony Queen Hybrid', price: 1899 },
      { name: 'Standard Protector', price: 69 },
    ],
    total: 1968,
    attachRate: 50,
    financingUsed: true,
  },
  {
    id: 'S-1042',
    time: '10:30 AM',
    items: [{ name: 'Essential Full Firm', price: 849 }],
    total: 849,
    attachRate: 0,
    financingUsed: false,
  },
  {
    id: 'S-1043',
    time: '11:45 AM',
    items: [
      { name: 'Luxe King Pillow-Top', price: 2499 },
      { name: 'ErgoMotion Adjustable Base', price: 799 },
      { name: 'CoolGuard Protector', price: 149 },
      { name: 'Premium Pillow Set', price: 189 },
    ],
    total: 3636,
    attachRate: 100,
    financingUsed: true,
  },
  {
    id: 'S-1044',
    time: '1:20 PM',
    items: [
      { name: 'Comfort Queen Medium', price: 1299 },
      { name: 'Basic Protector', price: 69 },
    ],
    total: 1368,
    attachRate: 50,
    financingUsed: false,
  },
  {
    id: 'S-1045',
    time: '2:45 PM',
    items: [{ name: 'Essential Twin Firm', price: 699 }],
    total: 699,
    attachRate: 0,
    financingUsed: false,
  },
];

/* ── Rep status colors for traffic-light cards ─────────── */

export type StatusColor = 'green' | 'amber' | 'red';

export interface RepStatus {
  repId: string;
  statusColor: StatusColor;
  statusLabel: string;
  shiftAttainment: number; // pct of daily target
}

export const REP_STATUSES: RepStatus[] = [
  { repId: 'casey', statusColor: 'red', statusLabel: 'Below Target', shiftAttainment: 62 },
  { repId: 'raj', statusColor: 'amber', statusLabel: 'Near Target', shiftAttainment: 84 },
  { repId: 'james', statusColor: 'amber', statusLabel: 'Near Target', shiftAttainment: 79 },
];

export function getRepStatus(repId: string): RepStatus | undefined {
  return REP_STATUSES.find((s) => s.repId === repId);
}

/* ── Coaching cards for live feed ──────────────────────── */

export type CoachingPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface CoachingCard {
  id: string;
  repId: string;
  priority: CoachingPriority;
  title: string;
  dataPoints: string[];
  suggestedAction: string;
  commissionImpact: string;
  timestamp: string;
}

export const COACHING_CARDS: CoachingCard[] = [
  {
    id: 'cc-1',
    repId: 'casey',
    priority: 'urgent',
    title: 'Attach rate critically low — missed 4 consecutive upsells',
    dataPoints: [
      'Attach rate: 12% (floor avg 31%)',
      'Last 4 sales: mattress-only, no accessories',
      '$356 in missed commissions today',
    ],
    suggestedAction: 'Shadow Sarah J. for next 2 ups — demonstrate adjustable base demo technique',
    commissionImpact: '+$89/sale with base + protector bundle',
    timestamp: '2:15 PM',
  },
  {
    id: 'cc-2',
    repId: 'raj',
    priority: 'high',
    title: 'Financing pitch rate dropping — 3 lost closes this week',
    dataPoints: [
      'Financing pitch: 28% (floor avg 64%)',
      'Lost $7,200 in potential sales from price objections',
      '72% close rate when financing presented on $2,500+ sales',
    ],
    suggestedAction: 'Lead with monthly cost framing: "$69/mo — less than streaming subscriptions"',
    commissionImpact: 'Recover $324 in weekly lost commissions',
    timestamp: '1:45 PM',
  },
  {
    id: 'cc-3',
    repId: 'james',
    priority: 'medium',
    title: 'ASP below floor average — defaulting to budget tier',
    dataPoints: [
      'ASP: $1,420 (floor avg $1,890)',
      'Step-up demo not used in last 6 sales',
      'Strong fundamentals: attach 34%, financing 71%',
    ],
    suggestedAction: 'Use step-up demo: budget mattress → mid-tier side-by-side, let customer feel difference',
    commissionImpact: '+$51/sale moving from Twin Firm to Queen Medium',
    timestamp: '12:30 PM',
  },
  {
    id: 'cc-4',
    repId: 'casey',
    priority: 'medium',
    title: 'New SPIFF opportunity — Adjustable Base push active',
    dataPoints: [
      'March SPIFF: $25/unit for ErgoMotion bases',
      'Casey has sold 0 bases this month',
      'Floor avg: 2.1 bases/rep this month',
    ],
    suggestedAction: 'Pair every mattress demo with adjustable base trial — demo zero-gravity position',
    commissionImpact: '+$25 SPIFF bonus per base sold',
    timestamp: '11:00 AM',
  },
];

export function getRepById(id: string): RepProfile | undefined {
  return REPS.find((r) => r.id === id);
}

export function getScenarioByRepId(repId: string): CoachingScenario | undefined {
  return COACHING_SCENARIOS.find((s) => s.repId === repId);
}
