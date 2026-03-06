export interface MarketStat {
  value: string;
  label: string;
  source: string;
  year: string;
}

export const marketStats: MarketStat[] = [
  { value: '$146.5B', label: 'Annual giving to religion in the U.S.', source: 'Giving USA', year: '2024' },
  { value: '23%', label: 'Share of all U.S. charitable giving that goes to religion', source: 'National Philanthropic Trust', year: '2024' },
  { value: '$398M', label: 'Church management software market size', source: 'Industry Analysis', year: '2025' },
  { value: '$1.6B', label: 'Projected ChMS market size by 2032', source: 'Industry Analysis', year: '2032' },
  { value: '86%', label: 'Church leaders who say technology is vital for fostering connection', source: 'State of Church Technology', year: '2025' },
  { value: '~80%', label: 'Year-over-year increase in AI adoption among churches', source: 'State of Church Technology', year: '2025' },
  { value: '380K+', label: 'Congregations in the United States', source: 'Hartford Institute', year: '2023' },
  { value: '60', label: 'Median regular worship participants per congregation', source: 'Hartford Institute FACT Data', year: '2023' },
  { value: '70%', label: 'Churchgoers who attend the largest 10% of congregations', source: 'Hartford Institute FACT Data', year: '2023' },
];

export interface MarketSegment {
  name: string;
  size: string;
  staffing: string;
  painPoints: string[];
  edgeRelevance: string;
}

export const marketSegments: MarketSegment[] = [
  {
    name: 'Small',
    size: '1–150 participants',
    staffing: 'Mostly volunteer-run; part-time admin common',
    painPoints: [
      'Contact lists and basic attendance',
      'Simple giving without complexity',
      'Kid check-in with minimal setup',
      'Communication without dedicated tools',
    ],
    edgeRelevance: 'Very High — minimal IT, fragile connectivity; offline weekend workflows reduce stress',
  },
  {
    name: 'Medium',
    size: '150–800 participants',
    staffing: 'Small staff team; multiple ministries; rising governance',
    painPoints: [
      'Groups and volunteer scheduling',
      'Multi-event coordination',
      'Reporting for leadership boards',
      'Background checks for volunteers',
    ],
    edgeRelevance: 'High — multiple check-in stations, facilities booking, burst load on Sundays',
  },
  {
    name: 'Large / Multi-site',
    size: '800+ participants or multi-campus',
    staffing: 'Specialized roles; governance and data security expectations',
    painPoints: [
      'Multi-campus giving designations',
      'Role-based access and process automation',
      'Integrations and analytics',
      'Compliance and auditability',
    ],
    edgeRelevance: 'Extremely High — weekend-scale ops require local resiliency; privacy + auditability central',
  },
];

export interface Competitor {
  name: string;
  pricingSignal: string;
  strengths: string;
  edgeGap: string;
  features: Record<string, boolean>;
}

export const competitorFeatures = [
  'People & profiles',
  'Giving & receipts',
  'Check-in',
  'Volunteer scheduling',
  'Facilities mgmt',
  'Multi-campus',
  'Edge-first / offline',
  'Privacy-tiered sync',
  'LAN-first operations',
  'Sealed pastoral data',
] as const;

export const competitors: Competitor[] = [
  {
    name: 'Planning Center',
    pricingSignal: 'Modular pricing by usage',
    strengths: 'Transparent module pricing; robust ecosystem; strong congregant apps',
    edgeGap: 'Network-dependent; no offline-first architecture',
    features: {
      'People & profiles': true, 'Giving & receipts': true, 'Check-in': true,
      'Volunteer scheduling': true, 'Facilities mgmt': true, 'Multi-campus': true,
      'Edge-first / offline': false, 'Privacy-tiered sync': false,
      'LAN-first operations': false, 'Sealed pastoral data': false,
    },
  },
  {
    name: 'Breeze',
    pricingSignal: 'Flat $72/mo all features',
    strengths: 'Simple pricing; ease-of-use optimized',
    edgeGap: 'No edge-first; limited multi-site governance',
    features: {
      'People & profiles': true, 'Giving & receipts': true, 'Check-in': true,
      'Volunteer scheduling': true, 'Facilities mgmt': false, 'Multi-campus': false,
      'Edge-first / offline': false, 'Privacy-tiered sync': false,
      'LAN-first operations': false, 'Sealed pastoral data': false,
    },
  },
  {
    name: 'ChurchSuite',
    pricingSignal: 'Solo from £9/mo',
    strengths: 'Strong admin workflows; volunteer rota tooling',
    edgeGap: 'No edge-first; LAN check-in not a wedge',
    features: {
      'People & profiles': true, 'Giving & receipts': true, 'Check-in': true,
      'Volunteer scheduling': true, 'Facilities mgmt': false, 'Multi-campus': true,
      'Edge-first / offline': false, 'Privacy-tiered sync': false,
      'LAN-first operations': false, 'Sealed pastoral data': false,
    },
  },
  {
    name: 'ChurchTrac',
    pricingSignal: 'From $9/mo by people count',
    strengths: 'Aggressive value positioning; operational check-in guidance',
    edgeGap: 'No edge-first; no privacy tiering',
    features: {
      'People & profiles': true, 'Giving & receipts': true, 'Check-in': true,
      'Volunteer scheduling': true, 'Facilities mgmt': true, 'Multi-campus': false,
      'Edge-first / offline': false, 'Privacy-tiered sync': false,
      'LAN-first operations': false, 'Sealed pastoral data': false,
    },
  },
  {
    name: 'Pushpay',
    pricingSignal: 'Demo/quote pricing',
    strengths: 'Enterprise-friendly; PCI-DSS L1; 80+ integrations',
    edgeGap: 'Quote-based barriers; no local-first posture',
    features: {
      'People & profiles': true, 'Giving & receipts': true, 'Check-in': true,
      'Volunteer scheduling': true, 'Facilities mgmt': true, 'Multi-campus': true,
      'Edge-first / offline': false, 'Privacy-tiered sync': false,
      'LAN-first operations': false, 'Sealed pastoral data': false,
    },
  },
  {
    name: 'ACS / Realm',
    pricingSignal: 'Realm Inform from $49/mo',
    strengths: 'Mature church admin; pastoral pathway tooling; integrated screening',
    edgeGap: 'Not offline-first; attendance/quote-driven pricing',
    features: {
      'People & profiles': true, 'Giving & receipts': true, 'Check-in': true,
      'Volunteer scheduling': true, 'Facilities mgmt': true, 'Multi-campus': true,
      'Edge-first / offline': false, 'Privacy-tiered sync': false,
      'LAN-first operations': false, 'Sealed pastoral data': false,
    },
  },
];

export interface Differentiator {
  title: string;
  description: string;
  icon: string;
}

export const differentiators: Differentiator[] = [
  {
    title: 'Local-First Data Ownership',
    description: 'Data lives primarily on local devices, supports offline work, and syncs for collaboration. Churches control their own data with selective sync policies.',
    icon: 'HardDrive',
  },
  {
    title: 'Offline-First Weekend Operations',
    description: 'Check-in, attendance, volunteer rosters, and facilities boards work without internet. The highest-stress workflows happen during short bursts where connectivity failures cause outsized disruption.',
    icon: 'WifiOff',
  },
  {
    title: 'Privacy-Tiered Sync',
    description: 'Not all records sync the same way. Operational data (rosters, events) syncs freely. Confidential care data (pastoral notes, counseling) uses sealed access with minimized replication.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Real-Time Collaboration Without Central Fragility',
    description: 'CRDTs enable live rosters, facility boards, and multi-station check-in queues to converge without a constantly-available central server.',
    icon: 'GitMerge',
  },
  {
    title: 'Low-Bandwidth by Design',
    description: 'Delta-based sync, compression, batching, and graceful degradation. Churches in older buildings, rural areas, or event venues get reliable operations.',
    icon: 'Gauge',
  },
];

export interface PricingTier {
  name: string;
  target: string;
  deployment: string;
  priceSignal: string;
  features: string[];
  highlighted?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    target: 'Small (1–150)',
    deployment: 'Cloud-hybrid',
    priceSignal: 'Low monthly',
    features: ['People & households', 'Groups & events', 'Basic giving (cash/check)', 'Email communications', 'Basic reporting'],
  },
  {
    name: 'Growth',
    target: 'Small / Medium',
    deployment: 'Cloud + optional Edge Hub',
    priceSignal: 'Mid monthly + hub add-on',
    features: ['Everything in Starter', 'Full check-in system', 'Volunteer scheduling', 'Facilities management', 'Advanced reporting', 'Offline-first PWA'],
    highlighted: true,
  },
  {
    name: 'Multi-site',
    target: 'Large (800+)',
    deployment: 'Cloud + Edge Hubs per campus',
    priceSignal: 'Higher + per-campus hub',
    features: ['Everything in Growth', 'Campus governance', 'Advanced RBAC', 'Analytics & insights', 'Background check integration', 'Sealed pastoral data'],
  },
  {
    name: 'Enterprise',
    target: 'Denominations',
    deployment: 'Private cloud + managed hubs',
    priceSignal: 'Annual contract',
    features: ['Everything in Multi-site', 'Multi-org governance', 'Shared templates', 'Benchmarking across orgs', 'Dedicated support', 'Custom integrations'],
  },
];
