// Lone Star Distribution — Competitive Intelligence & Market Share Data
// Used by: /ops/field-intel, stop card competitive intel, manager dashboard

// ─── Competitor Profiles ────────────────────────

export interface Competitor {
  id: string;
  name: string;
  type: 'distributor' | 'dsd' | 'broadline';
  territory: string;       // geographic coverage
  keyBrands: string[];
  estimatedShare: number;  // Texas market share %
  threat: 'high' | 'medium' | 'low';
  strengths: string[];
  weaknesses: string[];
}

export const COMPETITORS: Competitor[] = [
  {
    id: 'bek',
    name: 'Ben E. Keith Beverages',
    type: 'distributor',
    territory: 'North Texas, Oklahoma, Arkansas',
    keyBrands: ['AB InBev (Bud Light, Budweiser, Michelob Ultra)', 'Diageo', 'Bacardi', 'Various Craft'],
    estimatedShare: 0.32,
    threat: 'high',
    strengths: [
      'Largest beer distributor in Texas by territory',
      'Strong AB InBev relationship — exclusive territories',
      'Deep DFW on-premise penetration',
      'Legacy food distribution network (Ben E. Keith Foods)',
      'Aggressive craft portfolio (120+ craft brands)',
    ],
    weaknesses: [
      'AB InBev losing share to Modelo/Corona nationally',
      'Bud Light volume still recovering from 2023 boycott',
      'Less focused — food division splits management attention',
      'Slower technology adoption than Lone Star',
    ],
  },
  {
    id: 'se',
    name: 'Silver Eagle Distributors',
    type: 'distributor',
    territory: 'Houston, San Antonio, South Texas',
    keyBrands: ['AB InBev', 'Mark Anthony (White Claw)', 'Boston Beer (Sam Adams)'],
    estimatedShare: 0.28,
    threat: 'medium',
    strengths: [
      'Dominant in Houston and San Antonio — markets Lone Star does not serve',
      'Strong AB InBev execution',
      'White Claw exclusivity in territory',
      'Larger warehouse footprint than Lone Star in South TX',
    ],
    weaknesses: [
      'Minimal overlap with Lone Star territory (limited direct competition)',
      'No spirits portfolio',
      'Dependent on AB InBev volume which is declining',
      'No DFW presence',
    ],
  },
  {
    id: 'glazers',
    name: 'Glazer\'s Beer & Beverage',
    type: 'distributor',
    territory: 'Texas statewide (spirits + wine focused)',
    keyBrands: ['Diageo', 'Beam Suntory', 'Brown-Forman', 'Pernod Ricard'],
    estimatedShare: 0.15,
    threat: 'medium',
    strengths: [
      'Dominant spirits distributor in Texas',
      'Deep on-premise relationships for spirits',
      'Wine portfolio Lone Star cannot match',
      'Statewide coverage',
    ],
    weaknesses: [
      'Beer is secondary business — limited beer focus',
      'Lone Star Sazerac deal cuts into spirits territory',
      'Higher delivery costs (spirits = lower volume per stop)',
      'Less DSD expertise than beer distributors',
    ],
  },
  {
    id: 'republic',
    name: 'Republic National Distributing Company',
    type: 'broadline',
    territory: 'Texas statewide (wine & spirits)',
    keyBrands: ['Various wine portfolios', 'Spirits imports'],
    estimatedShare: 0.08,
    threat: 'low',
    strengths: [
      'Premium wine portfolio (>2,000 SKUs)',
      'Strong in upscale restaurant and hotel channel',
    ],
    weaknesses: [
      'Not a beer competitor',
      'Limited overlap with Lone Star product mix',
      'Consolidation rumors creating uncertainty',
    ],
  },
];

// ─── Competitive Sightings ──────────────────────

export type SightingType = 'delivery' | 'display' | 'pricing' | 'new-placement' | 'sampling' | 'promo';

export interface CompetitorSighting {
  id: string;
  competitorId: string;
  competitorName: string;
  type: SightingType;
  date: string;
  time: string;
  reportedBy: string;      // seller ID
  routeId: string;
  accountId: string | null;
  accountName: string;
  location: string;
  description: string;
  brandsSighted: string[];
  threatLevel: 'high' | 'medium' | 'low';
  actionTaken: string | null;
  lat: number;
  lng: number;
}

export const COMPETITOR_SIGHTINGS: CompetitorSighting[] = [
  // ── Recent Dallas sightings ──
  {
    id: 'CS-001',
    competitorId: 'bek', competitorName: 'Ben E. Keith',
    type: 'delivery', date: '2026-02-25', time: '07:15 AM',
    reportedBy: 'SEL-DAL-03', routeId: 'DAL-03',
    accountId: 'ACC-C001', accountName: 'Cedar Springs Tap House',
    location: 'Cedar Springs Rd, Dallas',
    description: 'Ben E. Keith delivery truck spotted at Cedar Springs Tap House at 7:15 AM. Delivering craft kegs — appeared to be local Dallas craft (Peticolas, Lakewood). Owner said they are considering adding 2 more craft taps.',
    brandsSighted: ['Peticolas Velvet Hammer', 'Lakewood Temptress'],
    threatLevel: 'medium',
    actionTaken: 'Marcus pitched Blue Moon Belgian White and Firestone Walker 805 as alternatives. Owner agreed to taste test next visit.',
    lat: 32.8025, lng: -96.8097,
  },
  {
    id: 'CS-002',
    competitorId: 'bek', competitorName: 'Ben E. Keith',
    type: 'display', date: '2026-02-24', time: '02:30 PM',
    reportedBy: 'SEL-DAL-05', routeId: 'DAL-05',
    accountId: 'ACC-D001', accountName: '7-Eleven #2847',
    location: 'Ross Ave, Dallas',
    description: 'Bud Light floor display installed in Lone Star cold vault space. 24-pack pricing at $19.99 (below our Miller Lite at $21.49). Display appears to have been placed over the weekend.',
    brandsSighted: ['Bud Light', 'Michelob Ultra'],
    threatLevel: 'high',
    actionTaken: 'Flagged for immediate reset. Store manager contacted — confirmed Ben E. Keith rep placed without authorization. Display will be removed by Friday.',
    lat: 32.7860, lng: -96.7880,
  },
  {
    id: 'CS-003',
    competitorId: 'bek', competitorName: 'Ben E. Keith',
    type: 'new-placement', date: '2026-02-22', time: '11:00 AM',
    reportedBy: 'SEL-DAL-01', routeId: 'DAL-01',
    accountId: null, accountName: 'The Henderson (new restaurant)',
    location: 'Henderson Ave, Dallas',
    description: 'New upscale restaurant opening March 15. Ben E. Keith beer trailer spotted during construction. They appear to be setting up the bar program. This is in Lone Star territory — we should be the primary distributor.',
    brandsSighted: ['AB InBev portfolio'],
    threatLevel: 'high',
    actionTaken: 'Derek submitted new account request. Sales manager Sarah Chen scheduling meet with restaurant group owner. Will pitch full Lone Star portfolio including Sazerac cocktail program.',
    lat: 32.8215, lng: -96.7785,
  },
  {
    id: 'CS-004',
    competitorId: 'bek', competitorName: 'Ben E. Keith',
    type: 'pricing', date: '2026-02-20', time: '09:45 AM',
    reportedBy: 'SEL-DAL-07', routeId: 'DAL-07',
    accountId: null, accountName: 'Kroger #4520',
    location: 'Lemmon Ave, Dallas',
    description: 'Michelob Ultra 18-pack priced at $16.99 — $2 below our Coors Light 18-pack. In-store signage promoting "Ultra Zone" with branded cooler wraps. Aggressive shelf promotion.',
    brandsSighted: ['Michelob Ultra'],
    threatLevel: 'medium',
    actionTaken: null,
    lat: 32.8102, lng: -96.8155,
  },

  // ── Laredo border sightings ──
  {
    id: 'CS-005',
    competitorId: 'se', competitorName: 'Silver Eagle',
    type: 'delivery', date: '2026-02-23', time: '06:30 AM',
    reportedBy: 'SEL-LAR-02', routeId: 'LAR-02',
    accountId: null, accountName: 'El Mercado #3 — International Bridge',
    location: 'Convent Ave, Laredo',
    description: 'Silver Eagle truck delivering Bud Light and Modelo (AB InBev licensed) to account near International Bridge. This is contested territory post-Southern Distributing acquisition. Need to verify franchise rights.',
    brandsSighted: ['Bud Light', 'Budweiser'],
    threatLevel: 'high',
    actionTaken: 'Rosa flagged for legal review. Territory rights for this ZIP code are under dispute from Southern Distributing transition. Manager Roberto Garza escalating to regional VP.',
    lat: 27.5010, lng: -99.5065,
  },
  {
    id: 'CS-006',
    competitorId: 'glazers', competitorName: 'Glazer\'s',
    type: 'sampling', date: '2026-02-21', time: '05:00 PM',
    reportedBy: 'SEL-LAR-01', routeId: 'LAR-01',
    accountId: null, accountName: 'Border Town Bar & Grill',
    location: 'San Bernardo Ave, Laredo',
    description: 'Glazer\'s spirits rep doing Jack Daniel\'s tasting event at Border Town. 50+ attendees. Counter-programming our Sazerac push. Owner said Glazer\'s offered 20% case discount for Q1 commitments.',
    brandsSighted: ['Jack Daniel\'s', 'Woodford Reserve', 'Gentleman Jack'],
    threatLevel: 'medium',
    actionTaken: 'Scheduled Buffalo Trace tasting event for March 8. Rosa coordinating with Sazerac territory manager for co-funded sampling.',
    lat: 27.5055, lng: -99.5100,
  },

  // ── Fort Worth sightings ──
  {
    id: 'CS-007',
    competitorId: 'bek', competitorName: 'Ben E. Keith',
    type: 'promo', date: '2026-02-24', time: '10:00 AM',
    reportedBy: 'SEL-FTW-05', routeId: 'FTW-05',
    accountId: null, accountName: 'Stockyards Entertainment District',
    location: 'E Exchange Ave, Fort Worth',
    description: 'Ben E. Keith sponsoring "Stockyards Brews" weekend event March 8-9. Sampling stations for Michelob Ultra, Bud Light, and 6 craft brands. Banner ads around the district. Lone Star was not invited to co-sponsor.',
    brandsSighted: ['Michelob Ultra', 'Bud Light', 'Various Craft'],
    threatLevel: 'medium',
    actionTaken: 'Jake coordinating with Fort Worth events team. Planning Coors Light + Blue Moon counter-event at nearby Billy Bob\'s Texas for same weekend.',
    lat: 32.7879, lng: -97.3457,
  },
];

// ─── Market Share Data ──────────────────────────

export interface MarketShareSegment {
  category: string;
  loneStarShare: number;
  benEKeithShare: number;
  silverEagleShare: number;
  otherShare: number;
  trend: 'gaining' | 'stable' | 'losing';
  notes: string;
}

export const MARKET_SHARE_DFW: MarketShareSegment[] = [
  { category: 'Domestic Beer', loneStarShare: 0.42, benEKeithShare: 0.45, silverEagleShare: 0.0, otherShare: 0.13, trend: 'stable', notes: 'Miller Lite and Coors Light hold steady vs Bud Light recovery. Lone Star gaining in convenience channel.' },
  { category: 'Import Beer', loneStarShare: 0.58, benEKeithShare: 0.30, silverEagleShare: 0.0, otherShare: 0.12, trend: 'gaining', notes: 'Corona + Modelo dominance. Gaining 1.2% annually. Laredo acquisition adds import volume.' },
  { category: 'Craft Beer', loneStarShare: 0.35, benEKeithShare: 0.48, silverEagleShare: 0.0, otherShare: 0.17, trend: 'losing', notes: 'Ben E. Keith has 120+ craft brands vs Lone Star 30+. Local craft (Deep Ellum, Peticolas) going BEK.' },
  { category: 'Spirits', loneStarShare: 0.08, benEKeithShare: 0.0, silverEagleShare: 0.0, otherShare: 0.92, trend: 'gaining', notes: 'New category for Lone Star (Sazerac 2024). Glazer\'s dominates. Lone Star spirits share up from 0% to 8% in 18 months.' },
  { category: 'FMB/RTD', loneStarShare: 0.38, benEKeithShare: 0.42, silverEagleShare: 0.0, otherShare: 0.20, trend: 'stable', notes: 'Truly and Twisted Tea vs White Claw (BEK exclusive). Category declining 8% YoY.' },
];

export const MARKET_SHARE_SOUTH_TX: MarketShareSegment[] = [
  { category: 'Domestic Beer', loneStarShare: 0.38, benEKeithShare: 0.0, silverEagleShare: 0.42, otherShare: 0.20, trend: 'gaining', notes: 'Corpus Christi heritage territory. Laredo acquisition growing Lone Star presence.' },
  { category: 'Import Beer', loneStarShare: 0.62, benEKeithShare: 0.0, silverEagleShare: 0.25, otherShare: 0.13, trend: 'gaining', notes: 'Corona/Modelo/Tecate dominant in border market. Lone Star has natural advantage with Hispanic consumer base.' },
  { category: 'Craft Beer', loneStarShare: 0.28, benEKeithShare: 0.0, silverEagleShare: 0.35, otherShare: 0.37, trend: 'stable', notes: 'Smaller craft market in South TX. Shiner Bock is dominant regional brand (Lone Star exclusive).' },
  { category: 'Spirits', loneStarShare: 0.05, benEKeithShare: 0.0, silverEagleShare: 0.0, otherShare: 0.95, trend: 'gaining', notes: 'Sazerac just entering South TX market. Tequila and mezcal competition from established importers.' },
  { category: 'FMB/RTD', loneStarShare: 0.32, benEKeithShare: 0.0, silverEagleShare: 0.45, otherShare: 0.23, trend: 'losing', notes: 'White Claw (Silver Eagle) strong in South TX convenience. Category overall declining.' },
];

// ─── New Account Pipeline ───────────────────────

export interface PipelineAccount {
  id: string;
  name: string;
  type: 'restaurant' | 'bar' | 'retail' | 'hotel' | 'entertainment';
  hometownId: string;
  address: string;
  expectedOpenDate: string;
  permitStatus: 'filed' | 'approved' | 'inspection' | 'ready';
  estimatedWeeklyCases: number;
  estimatedWeeklyRevenue: number;
  competitorInterest: string | null;
  assignedSeller: string | null;  // seller ID
  notes: string;
  lat: number;
  lng: number;
}

export const PIPELINE_ACCOUNTS: PipelineAccount[] = [
  {
    id: 'PIPE-001', name: 'The Henderson (upscale restaurant)', type: 'restaurant',
    hometownId: 'dal', address: '2428 Henderson Ave, Dallas, TX 75206',
    expectedOpenDate: '2026-03-15', permitStatus: 'approved',
    estimatedWeeklyCases: 35, estimatedWeeklyRevenue: 2800,
    competitorInterest: 'Ben E. Keith spotted delivering during construction',
    assignedSeller: 'SEL-DAL-01', notes: 'Upscale dining. Target for full portfolio including Sazerac cocktail program. Owner is James Whitfield (JW Restaurant Group, 4 locations).',
    lat: 32.8215, lng: -96.7785,
  },
  {
    id: 'PIPE-002', name: 'Deep Ellum Food Hall', type: 'entertainment',
    hometownId: 'dal', address: '2800 Main St, Dallas, TX 75226',
    expectedOpenDate: '2026-04-01', permitStatus: 'filed',
    estimatedWeeklyCases: 80, estimatedWeeklyRevenue: 6400,
    competitorInterest: null,
    assignedSeller: 'SEL-DAL-03', notes: '15-vendor food hall with central bar. MB permit filed. Ideal for diverse portfolio showcase. Marcus Reyes has relationship with developer.',
    lat: 32.7837, lng: -96.7834,
  },
  {
    id: 'PIPE-003', name: 'Magnolia Hotel Rooftop Bar', type: 'hotel',
    hometownId: 'ftw', address: '405 Main St, Fort Worth, TX 76102',
    expectedOpenDate: '2026-05-15', permitStatus: 'filed',
    estimatedWeeklyCases: 25, estimatedWeeklyRevenue: 3200,
    competitorInterest: 'Glazer\'s pitching Diageo spirits program',
    assignedSeller: 'SEL-FTW-05', notes: 'Boutique hotel rooftop bar. Premium on-premise. Jake Williams pitching Blue Moon + Peroni + Sazerac cocktail menu.',
    lat: 32.7541, lng: -97.3329,
  },
  {
    id: 'PIPE-004', name: 'Border Brewing Co.', type: 'bar',
    hometownId: 'lar', address: '1201 Iturbide St, Laredo, TX 78040',
    expectedOpenDate: '2026-06-01', permitStatus: 'inspection',
    estimatedWeeklyCases: 15, estimatedWeeklyRevenue: 1200,
    competitorInterest: null,
    assignedSeller: 'SEL-LAR-02', notes: 'First craft brewery in Laredo. Applying for BG license. Will also carry Lone Star brands on-premise. Rosa Gutierrez building relationship.',
    lat: 27.5028, lng: -99.5012,
  },
  {
    id: 'PIPE-005', name: 'Allen Premium Outlets Expansion', type: 'retail',
    hometownId: 'aln', address: '820 W Stacy Rd, Allen, TX 75013',
    expectedOpenDate: '2026-04-15', permitStatus: 'approved',
    estimatedWeeklyCases: 45, estimatedWeeklyRevenue: 3600,
    competitorInterest: null,
    assignedSeller: 'SEL-ALN-03', notes: 'New Total Wine & More at Allen outlet expansion. BB + P licenses approved. High-volume off-premise account. Initial order projected at 200 cases.',
    lat: 33.1210, lng: -96.6742,
  },
];

// ─── Helpers ────────────────────────────────────

export const getCompetitorById = (id: string): Competitor | undefined =>
  COMPETITORS.find(c => c.id === id);

export const getSightingsByRoute = (routeId: string): CompetitorSighting[] =>
  COMPETITOR_SIGHTINGS.filter(s => s.routeId === routeId);

export const getSightingsByCompetitor = (competitorId: string): CompetitorSighting[] =>
  COMPETITOR_SIGHTINGS.filter(s => s.competitorId === competitorId);

export const getHighThreatSightings = (): CompetitorSighting[] =>
  COMPETITOR_SIGHTINGS.filter(s => s.threatLevel === 'high');

export const getPipelineByHometown = (hometownId: string): PipelineAccount[] =>
  PIPELINE_ACCOUNTS.filter(p => p.hometownId === hometownId);

export const getPipelineBySeller = (sellerId: string): PipelineAccount[] =>
  PIPELINE_ACCOUNTS.filter(p => p.assignedSeller === sellerId);

// Total pipeline revenue potential
export const getTotalPipelineRevenue = (): number =>
  PIPELINE_ACCOUNTS.reduce((sum, p) => sum + p.estimatedWeeklyRevenue * 52, 0);
