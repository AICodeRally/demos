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

export function getRepById(id: string): RepProfile | undefined {
  return REPS.find((r) => r.id === id);
}

export function getScenarioByRepId(repId: string): CoachingScenario | undefined {
  return COACHING_SCENARIOS.find((s) => s.repId === repId);
}
