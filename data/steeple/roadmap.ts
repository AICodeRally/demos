export interface RoadmapPhase {
  horizon: string;
  months: string;
  productMilestones: string[];
  techMilestones: string[];
  team: string;
  costRange: string;
  color: string;
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    horizon: 'Foundation',
    months: '3–6 months',
    productMilestones: [
      'People & households with tags',
      'Events & occurrences',
      'Basic attendance capture',
      'Volunteer rosters',
      'Edge-first check-in MVP',
      'Basic email communications',
    ],
    techMilestones: [
      'PWA shell with offline caching',
      'Local DB (IndexedDB)',
      'Sync v1 (delta + conflict rules)',
      'Device provisioning for kiosks',
    ],
    team: '4–6 FTE',
    costRange: '$0.6M – $1.4M',
    color: '#C5972C',
  },
  {
    horizon: 'Growth',
    months: '6–12 months',
    productMilestones: [
      'Giving ledger (cash/check + statements)',
      'Facilities & resources + approvals',
      'Congregant self-service profiles',
      'Role-based access control',
      'Audit logging',
    ],
    techMilestones: [
      'Edge Hub (optional on-prem)',
      'LAN-first multi-station sync',
      'Encryption at rest',
      'Sealed pastoral notes v1',
      'Reporting engine v1',
    ],
    team: '8–12 FTE',
    costRange: '$2.0M – $4.5M',
    color: '#7C3AED',
  },
  {
    horizon: 'Scale',
    months: '12–24 months',
    productMilestones: [
      'Full digital giving (card/ACH)',
      'Advanced batch tools',
      'Pathways & follow-up automation',
      'Integrated background checks',
      'Multi-campus governance',
      'AI-powered insights',
    ],
    techMilestones: [
      'Privacy-preserving sync tiering',
      'CRDT for live rosters & boards',
      'ML anomaly detection',
      'E2E encryption evaluation (MLS-inspired)',
    ],
    team: '12–18 FTE',
    costRange: '$6M – $12M',
    color: '#522398',
  },
];

export interface GCUAlignmentCard {
  title: string;
  icon: string;
  points: string[];
}

export const gcuAlignmentCards: GCUAlignmentCard[] = [
  {
    title: 'Academic Pipeline',
    icon: 'GraduationCap',
    points: [
      'CS students build real-world edge computing, CRDT algorithms, and PWA architecture',
      'Business students study SaaS pricing models, go-to-market strategy, and church market economics',
      'Capstone projects and internship programs tied to a shipping product',
    ],
  },
  {
    title: 'Faith Mission',
    icon: 'Heart',
    points: [
      'Faith-aligned product serving 380,000+ U.S. congregations',
      'Stewardship of church data with privacy-first architecture',
      'Helping churches focus on ministry instead of IT problems',
    ],
  },
  {
    title: 'University Brand',
    icon: 'Award',
    points: [
      '"Supported by Grand Canyon University" on every STEEPLE installation',
      'GCU brand reaches every church adopting the platform',
      'Demonstrates GCU\'s commitment to faith-based innovation',
    ],
  },
];
