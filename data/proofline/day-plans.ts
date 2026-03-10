// Lone Star Distribution — 3 Pre-Built Route Day Plans
// Marcus Reyes (DAL-03, Tuesday, 12 stops)
// Rosa Gutierrez (LAR-02, Wednesday, 10 stops)
// Jake Williams (FTW-05, Monday, 11 stops)

export type StopType =
  | 'load-out' | 'key-account' | 'chain-drop' | 'presell'
  | 'new-account' | 'compliance' | 'problem-resolution'
  | 'presell-spirits' | 'merchandising' | 'drive-by'
  | 'windshield' | 'return';

export type DataSource = 'crm' | 'encompass' | 'tabc' | 'permits' | 'maps' | 'nielsen';

export interface AIInsight {
  source: DataSource;
  insight: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ManifestItem {
  brand: string;
  cases: number;
  sku: string;
  promo?: string;
}

export interface Stop {
  id: string;
  sequence: number;
  type: StopType;
  accountId: string;
  accountName: string;
  address: string;
  arrivalTime: string;    // "7:15 AM"
  duration: number;       // minutes
  deliveryManifest: ManifestItem[];
  talkingPoints: string[];
  aiInsights: AIInsight[];
  competitiveIntel: string | null;
  revenueOpportunity: number;
  contactName: string;
  contactPhone: string;
  displayInstructions: string | null;
  photoRequired: boolean;
  tabcStatus: 'verified' | 'expiring' | 'flagged' | null;
  lat: number;
  lng: number;
}

export interface DayPlan {
  repId: string;
  repName: string;
  date: string;           // "Tuesday, March 4, 2026"
  route: string;          // DAL-03
  hometown: string;       // dal
  hometownName: string;
  stops: Stop[];
  totalMiles: number;
  totalDuration: string;
  totalRevenue: number;
  totalCases: number;
  optimizationSavings: { miles: number; minutes: number };
  truckNumber: string;
}

// ═══════════════════════════════════════════════════════════════════
// MARCUS REYES — DAL-03, Tuesday, East Dallas
// 12 stops, 847 cases, ~$73.6K revenue
// ═══════════════════════════════════════════════════════════════════
export const MARCUS_DAY_PLAN: DayPlan = {
  repId: 'SEL-DAL-03',
  repName: 'Marcus Reyes',
  date: 'Tuesday, March 4, 2026',
  route: 'DAL-03',
  hometown: 'dal',
  hometownName: 'Dallas HQ',
  totalMiles: 47.2,
  totalDuration: '9h 15m',
  totalRevenue: 73600,
  totalCases: 847,
  optimizationSavings: { miles: 14, minutes: 35 },
  truckNumber: 'Truck #217',
  stops: [
    // Stop 1: Load-out
    {
      id: 'marcus-01', sequence: 1, type: 'load-out',
      accountId: 'WAREHOUSE-DAL', accountName: 'Dallas HQ Warehouse',
      address: '3500 Maple Ave, Dallas, TX 75219',
      arrivalTime: '6:00 AM', duration: 45,
      deliveryManifest: [
        { brand: 'Corona Extra', cases: 180, sku: 'COR-24-12oz' },
        { brand: 'Modelo Especial', cases: 145, sku: 'MOD-24-12oz' },
        { brand: 'Miller Lite', cases: 120, sku: 'MIL-24-12oz' },
        { brand: 'Coors Light', cases: 95, sku: 'CRS-24-12oz' },
        { brand: 'Blue Moon', cases: 48, sku: 'BLU-12-12oz' },
        { brand: 'Heineken', cases: 42, sku: 'HEI-24-12oz' },
        { brand: 'Dos Equis Lager', cases: 36, sku: 'DOS-24-12oz' },
        { brand: 'Shiner Bock', cases: 32, sku: 'SHI-24-12oz' },
        { brand: 'Buffalo Trace', cases: 24, sku: 'BT-6-750ml' },
        { brand: 'Fireball', cases: 18, sku: 'FB-12-750ml' },
        { brand: 'Truly', cases: 36, sku: 'TRU-12-12oz' },
        { brand: 'Twisted Tea', cases: 28, sku: 'TWT-12-12oz' },
        { brand: 'Firestone Walker', cases: 24, sku: 'FW-12-12oz' },
        { brand: 'Modelo Negra', cases: 19, sku: 'MNG-12-12oz' },
      ],
      talkingPoints: [
        'Pre-pull complete: 847 cases, 14 SKUs loaded on Truck #217',
        'Priority stops: Spec\'s Greenville (142cs Corona/Modelo + spirits), Total Wine Park Lane (shortage resolution)',
        'New account visit: Deep Ellum Bottle Shop — first order opportunity',
        'Merchandising: Tom Thumb #119 Cinco de Mayo endcap build',
      ],
      aiInsights: [
        { source: 'maps', insight: 'Optimal route saves 14 miles vs. standard sequence. I-30 construction delays — use Ross Ave alternate.', priority: 'high' },
        { source: 'encompass', insight: 'Truck #217 last inspection: Feb 28. Fuel at 82%. Load weight: 18,400 lbs (under 22K limit).', priority: 'low' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 0,
      contactName: 'Warehouse Team', contactPhone: '(214) 555-0100',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: null,
      lat: 32.8007, lng: -96.8167,
    },

    // Stop 2: Key Account — Spec's Liquors Greenville
    {
      id: 'marcus-02', sequence: 2, type: 'key-account',
      accountId: 'ACC-A001', accountName: "Spec's Liquors — Greenville Ave",
      address: '2105 Greenville Ave, Dallas, TX 75206',
      arrivalTime: '7:15 AM', duration: 40,
      deliveryManifest: [
        { brand: 'Corona Extra', cases: 72, sku: 'COR-24-12oz', promo: 'Cinco de Mayo display' },
        { brand: 'Modelo Especial', cases: 48, sku: 'MOD-24-12oz' },
        { brand: 'Modelo Negra', cases: 12, sku: 'MNG-12-12oz' },
        { brand: 'Pacifico', cases: 10, sku: 'PAC-12-12oz' },
        { brand: 'Buffalo Trace', cases: 12, sku: 'BT-6-750ml' },
        { brand: 'Fireball', cases: 6, sku: 'FB-12-750ml' },
        { brand: 'Southern Comfort', cases: 6, sku: 'SC-6-750ml' },
      ],
      talkingPoints: [
        'Deliver 142cs Corona/Modelo + 24cs Sazerac spirits',
        'Reset end-cap for Cinco de Mayo Corona display — POS materials in cab',
        'Present new Sazerac spirits program: Buffalo Trace Old Fashioned kit, tasting event March 15',
        'Review cold vault planogram — Corona facing count should be 12, currently 8',
      ],
      aiInsights: [
        { source: 'crm', insight: "Spec's Greenville has grown 23% YoY in Corona sales. This location is Robert's flagship — always ask about upcoming wine events for spirits cross-sell.", priority: 'high' },
        { source: 'nielsen', insight: 'ZIP 75206 Corona sales +18% vs. DMA average. Push 24-pack promo ($22.99) to capitalize on trend.', priority: 'high' },
        { source: 'encompass', insight: 'Last 4 deliveries avg 128cs. Today is 166cs — largest order in 6 months. Spirits category growing.', priority: 'medium' },
        { source: 'tabc', insight: 'P license verified, expires Dec 2026. All permits current.', priority: 'low' },
      ],
      competitiveIntel: 'Ben E. Keith delivered 3 pallets Tuesday last week — appears to be pushing Constellation directly. Monitor for pricing conflicts.',
      revenueOpportunity: 18200,
      contactName: 'Robert Chen', contactPhone: '(214) 555-0142',
      displayInstructions: 'Cinco de Mayo Corona end-cap: 2-tier Corona Extra (bottom), Corona Light + Modelo (top). POS banner + neck hangers. Photo required.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 32.8142, lng: -96.7706,
    },

    // Stop 3: Chain Drop — Kroger #4412
    {
      id: 'marcus-03', sequence: 3, type: 'chain-drop',
      accountId: 'ACC-A003', accountName: 'Kroger #4412 — Mockingbird',
      address: '3100 Mockingbird Ln, Dallas, TX 75205',
      arrivalTime: '8:10 AM', duration: 30,
      deliveryManifest: [
        { brand: 'Miller Lite', cases: 24, sku: 'MIL-24-12oz' },
        { brand: 'Coors Light', cases: 24, sku: 'CRS-24-12oz' },
        { brand: 'Corona Extra', cases: 18, sku: 'COR-24-12oz' },
        { brand: 'Modelo Especial', cases: 12, sku: 'MOD-24-12oz' },
        { brand: 'Truly', cases: 12, sku: 'TRU-12-12oz' },
        { brand: 'Shiner Bock', cases: 6, sku: 'SHI-24-12oz' },
      ],
      talkingPoints: [
        'Standing order: 96cs. Check shelf compliance — Aisle 7 planogram reset last week',
        'Cold vault restock: Miller/Coors should have 6 facings each, Corona 4',
        'Verify price tags match current promo pricing ($19.99 Miller Lite 24pk)',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'Kroger #4412 has 96cs standing order on 2-week cycle. On-time delivery 14 of last 15. One miss was weather-related.', priority: 'medium' },
        { source: 'crm', insight: 'David Park prefers quick drop-and-check. Avoid morning rush (before 8:30). Receiving dock: east side.', priority: 'low' },
        { source: 'nielsen', insight: 'Kroger stores in this ZIP index 112% for craft beer. Consider pitching Blue Moon endcap for next reset.', priority: 'medium' },
      ],
      competitiveIntel: 'Silver Eagle has Miller Lite promotional display in lobby — check pricing against ours.',
      revenueOpportunity: 8700,
      contactName: 'David Park', contactPhone: '(214) 555-0319',
      displayInstructions: 'Check cold vault facings. Ensure Miller/Coors at eye level. Straighten shelf talkers.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 32.8380, lng: -96.7934,
    },

    // Stop 4: Presell — Cedar Springs Tap House
    {
      id: 'marcus-04', sequence: 4, type: 'presell',
      accountId: 'ACC-C001', accountName: 'Cedar Springs Tap House',
      address: '4123 Cedar Springs Rd, Dallas, TX 75219',
      arrivalTime: '8:55 AM', duration: 35,
      deliveryManifest: [],
      talkingPoints: [
        '8 total taps — Lone Star currently has 3 (Miller Lite, Coors Light, Blue Moon). Target: 5 taps.',
        'Pitch Blue Moon Belgian White seasonal keg — spring seasonal now available',
        'Present Shiner Bock as 4th tap: "Texas craft that sells itself — 26% margin, guaranteed pulls"',
        'Discuss upcoming patio season — Corona bucket deal ($24/bucket of 5)',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Blue Moon pitch success rate is 67% at on-premise accounts this quarter. Lead with seasonal keg pricing ($129 vs. $149 standard).', priority: 'high' },
        { source: 'nielsen', insight: 'On-premise Blue Moon consumption up 15% in DFW metro. Cedar Springs corridor indexes 140% for craft/premium.', priority: 'medium' },
        { source: 'maps', insight: 'Patio season starts March — this location has 40-seat patio. High-value for bucket deals.', priority: 'medium' },
      ],
      competitiveIntel: 'Ben E. Keith sales rep spotted here Tuesday AM last month. They have 2 of 8 taps (Goose Island, Kona). Target the remaining 3 open taps.',
      revenueOpportunity: 4100,
      contactName: "Patrick O'Brien", contactPhone: '(214) 555-4001',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.8120, lng: -96.8070,
    },

    // Stop 5: New Account — Deep Ellum Bottle Shop
    {
      id: 'marcus-05', sequence: 5, type: 'new-account',
      accountId: 'ACC-C002', accountName: 'Deep Ellum Bottle Shop',
      address: '2626 Main St, Dallas, TX 75226',
      arrivalTime: '9:45 AM', duration: 45,
      deliveryManifest: [],
      talkingPoints: [
        'First visit — shop opened 3 weeks ago. Owner is craft + spirits enthusiast.',
        'Lead with craft portfolio: Firestone Walker 805, Rahr & Sons Blonde, Revolver Blood & Honey',
        'Present Sazerac spirits line: Buffalo Trace, Southern Comfort, Wheatley Vodka',
        'Discuss tasting event partnership — we provide product + POS, they provide venue + promotion',
        'Collect TABC license info and credit application',
      ],
      aiInsights: [
        { source: 'permits', insight: 'Building permit issued Jan 15, 2026 for "specialty bottle shop and bar." TABC MB license application pending — approval expected by March 10.', priority: 'high' },
        { source: 'maps', insight: 'Deep Ellum foot traffic up 22% since new DART station opened. Three new restaurants within 2 blocks.', priority: 'medium' },
        { source: 'crm', insight: 'First visit. Owner Zach Morrison previously managed craft section at Spec\'s — knows product. Lead with margins and local brands.', priority: 'high' },
      ],
      competitiveIntel: 'No existing distributor relationship — this is a greenfield account. Ben E. Keith and Silver Eagle have not visited yet per owner.',
      revenueOpportunity: 2800,
      contactName: 'Zach Morrison', contactPhone: '(214) 555-4112',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: null,
      lat: 32.7840, lng: -96.7830,
    },

    // Stop 6: Compliance — 7-Eleven #2847
    {
      id: 'marcus-06', sequence: 6, type: 'compliance',
      accountId: 'ACC-D001', accountName: '7-Eleven #2847 — Ross Ave',
      address: '3900 Ross Ave, Dallas, TX 75204',
      arrivalTime: '10:45 AM', duration: 20,
      deliveryManifest: [
        { brand: 'Corona Extra', cases: 12, sku: 'COR-12-12oz' },
        { brand: 'Miller Lite', cases: 12, sku: 'MIL-12-12oz' },
        { brand: 'Modelo Especial', cases: 8, sku: 'MOD-12-12oz' },
        { brand: 'Twisted Tea', cases: 6, sku: 'TWT-12-12oz' },
      ],
      talkingPoints: [
        'Display audit: Cold vault share at 34% — target is 40%. Need 2 more facings.',
        'Check POS materials — Corona shelf talker was missing last visit',
        'Verify cooler temperature compliance (36-38 degrees F)',
        'Quick order: restock cold vault singles + 6-packs',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'Cold vault share dropped from 38% to 34% — competitor filled 2 Lone Star facings with Hard Mountain Dew. Escalate to manager.', priority: 'high' },
        { source: 'crm', insight: 'Vijay prefers visits before 11 AM (shift change at 11). Quick in-and-out — he handles restock himself.', priority: 'low' },
      ],
      competitiveIntel: 'Hard Mountain Dew (PepsiCo/FIFCO) took 2 cold vault facings that were previously Corona and Miller Lite. Needs reclaim.',
      revenueOpportunity: 3200,
      contactName: 'Vijay Patel', contactPhone: '(214) 555-9001',
      displayInstructions: 'Reclaim 2 cold vault facings. Corona 12oz singles at eye level. Miller Lite 6-pack in door 2.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 32.7950, lng: -96.7890,
    },

    // Stop 7: Problem Resolution — Total Wine Park Lane
    {
      id: 'marcus-07', sequence: 7, type: 'problem-resolution',
      accountId: 'ACC-A002', accountName: 'Total Wine & More — Park Lane',
      address: '7990 Park Lane, Dallas, TX 75231',
      arrivalTime: '11:15 AM', duration: 45,
      deliveryManifest: [
        { brand: 'Miller Lite', cases: 48, sku: 'MIL-24-12oz' },
        { brand: 'Blue Moon', cases: 18, sku: 'BLU-12-12oz' },
      ],
      talkingPoints: [
        'PRIORITY: Resolve 12cs Miller Lite shortage from last delivery — credit memo needed',
        'Face-to-face apology from Jennifer re: short ship. Warehouse confirmed error.',
        'Deliver replacement 48cs Miller Lite + 18cs Blue Moon (compensation + regular order)',
        'Review upcoming spring seasonal display — Total Wine wants Blue Moon Belgian White feature',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Jennifer Martinez flagged shortage on Feb 28. She is a key contact — Total Wine Park Lane is top 3 account by revenue. Handle with priority.', priority: 'high' },
        { source: 'encompass', insight: 'Shortage traced to warehouse pick error — corrective action in place. Credit memo #CM-2026-0847 pre-approved for $288.', priority: 'high' },
        { source: 'crm', insight: 'Total Wine corporate reviewing Q2 planogram resets. Jennifer has input — position Blue Moon for premium shelf space.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 22500,
      contactName: 'Jennifer Martinez', contactPhone: '(214) 555-0287',
      displayInstructions: 'After resolving shortage, check spring seasonal end-cap availability. Blue Moon Belgian White 6-pack carton.',
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.8670, lng: -96.7710,
    },

    // Stop 8: Presell + Spirits — The Statler Hotel Bar
    {
      id: 'marcus-08', sequence: 8, type: 'presell-spirits',
      accountId: 'ACC-C003', accountName: 'The Statler Hotel Bar',
      address: '1914 Commerce St, Dallas, TX 75201',
      arrivalTime: '12:15 PM', duration: 40,
      deliveryManifest: [],
      talkingPoints: [
        'Sazerac tasting event scheduled: March 15, 6-8 PM. Confirm details with Victoria.',
        'Present Buffalo Trace Old Fashioned program: branded glassware, recipe cards, bar mats',
        'Pitch Wheatley Vodka as house pour replacement — 20% better margin than current',
        'Review Peroni draft opportunity — upscale Italian bar positioning',
        'Discuss summer cocktail menu featuring Southern Comfort',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Statler Hotel bar revenue up 31% since new F&B director started. Victoria James is driving spirits-forward cocktail menu. High-value for Sazerac portfolio.', priority: 'high' },
        { source: 'nielsen', insight: 'Upscale on-premise bourbon consumption +28% in Dallas CBD. Buffalo Trace is the #2 call bourbon behind Maker\'s Mark.', priority: 'high' },
        { source: 'tabc', insight: 'MB license verified. Hotel has catering permit — can host tasting events without separate permit.', priority: 'low' },
      ],
      competitiveIntel: 'Republic National (now Breakthru) supplies Maker\'s Mark and Woodford Reserve. Position Buffalo Trace as better margin alternative ($4/bottle lower cost).',
      revenueOpportunity: 6800,
      contactName: 'Victoria James', contactPhone: '(214) 555-4223',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.7800, lng: -96.7990,
    },

    // Stop 9: Merchandising — Tom Thumb #119 Lakewood
    {
      id: 'marcus-09', sequence: 9, type: 'merchandising',
      accountId: 'ACC-A006', accountName: 'Tom Thumb #119 — Lakewood',
      address: '6333 E Mockingbird Ln, Dallas, TX 75214',
      arrivalTime: '1:10 PM', duration: 35,
      deliveryManifest: [
        { brand: 'Modelo Especial', cases: 36, sku: 'MOD-24-12oz', promo: 'Cinco de Mayo endcap' },
        { brand: 'Corona Extra', cases: 24, sku: 'COR-24-12oz', promo: 'Cinco de Mayo endcap' },
        { brand: 'Modelo Negra', cases: 6, sku: 'MNG-12-12oz' },
        { brand: 'Pacifico', cases: 6, sku: 'PAC-12-12oz' },
      ],
      talkingPoints: [
        'Build Modelo Cinco de Mayo endcap — POS materials in cab (banner, case stacker, shelf talker)',
        'Position: Aisle 7 end facing checkout lanes. 3-tier case stack.',
        'Verify with store manager Sarah Kim — she approved endcap Feb 20',
        'Take before/after photos for compliance reporting',
      ],
      aiInsights: [
        { source: 'nielsen', insight: 'Modelo Especial +22% in Lakewood ZIP. Cinco de Mayo is the #1 import beer selling occasion — endcap at Tom Thumb drove 38% lift last year.', priority: 'high' },
        { source: 'crm', insight: 'Sarah Kim is supportive but wants minimal disruption during lunch rush (11:30-1:30). Arrive after 1 PM.', priority: 'medium' },
        { source: 'encompass', insight: 'Tom Thumb #119 avg monthly order: 185cs. This endcap should drive incremental 72cs over 4 weeks.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 5400,
      contactName: 'Sarah Kim', contactPhone: '(214) 555-0176',
      displayInstructions: 'Cinco de Mayo endcap: Modelo Especial base (24cs case stack), Corona Extra flanking. Banner header. Shelf talker with "$21.99/24pk" callout. Case stacker cardboard provided.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 32.8380, lng: -96.7470,
    },

    // Stop 10: Drive-By — QuikTrip #891
    {
      id: 'marcus-10', sequence: 10, type: 'drive-by',
      accountId: 'ACC-D002', accountName: 'QuikTrip #891 — Gaston Ave',
      address: '4206 Gaston Ave, Dallas, TX 75246',
      arrivalTime: '2:00 PM', duration: 10,
      deliveryManifest: [],
      talkingPoints: [
        'Quick cold vault check — verify Corona promo pricing ($8.99 6-pack) is displayed',
        'Check facing count: Corona should have 4 facings, Miller Lite 3',
        'Restock any empties from truck inventory if needed',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'QuikTrip #891 has consistent 75cs/month volume. Low-maintenance account — check and go.', priority: 'low' },
        { source: 'maps', insight: 'QuikTrip on route between Tom Thumb and Henderson Ave. 3-minute detour. Worth the check.', priority: 'low' },
      ],
      competitiveIntel: 'Monitor for ZOA Energy / Monster presence in cold vault — they\u2019ve been aggressive in DFW QuikTrips.',
      revenueOpportunity: 1900,
      contactName: 'Randy Foster', contactPhone: '(214) 555-9112',
      displayInstructions: 'Check cold vault facings and promo pricing only. No major reset.',
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.8020, lng: -96.7610,
    },

    // Stop 11: Windshield — New Construction Henderson Ave
    {
      id: 'marcus-11', sequence: 11, type: 'windshield',
      accountId: 'PIPELINE-001', accountName: 'New Construction — Henderson Ave',
      address: '2800 block Henderson Ave, Dallas, TX 75206',
      arrivalTime: '2:20 PM', duration: 5,
      deliveryManifest: [],
      talkingPoints: [
        'Spotted restaurant build-out — looks like mid-size casual dining (40-50 seats)',
        'Flag for pipeline: get permit details, estimated opening date',
        'Note in CRM for follow-up once TABC license filed',
      ],
      aiInsights: [
        { source: 'permits', insight: 'Building permit #BP-2026-0412 filed Feb 1. Tenant: "Henderson Social" — bar/restaurant concept. Estimated completion: May 2026.', priority: 'medium' },
        { source: 'maps', insight: 'Henderson Ave corridor has 3 new restaurants in past 6 months. High-growth on-premise zone.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 0,
      contactName: 'TBD — not yet contacted', contactPhone: '',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: null,
      lat: 32.8100, lng: -96.7720,
    },

    // Stop 12: Return — Dallas HQ
    {
      id: 'marcus-12', sequence: 12, type: 'return',
      accountId: 'WAREHOUSE-DAL', accountName: 'Dallas HQ Warehouse',
      address: '3500 Maple Ave, Dallas, TX 75219',
      arrivalTime: '2:45 PM', duration: 30,
      deliveryManifest: [],
      talkingPoints: [
        'Returns processing: check for any damaged/refused product',
        'Cash settlement: reconcile COD collections from today\'s route',
        'CRM notes: update all stop outcomes, new account info, pipeline leads',
        'Tomorrow\'s pre-pull: Review Wednesday route (DAL-03 West sector)',
        'Submit compliance photos from Spec\'s, Kroger, 7-Eleven, Tom Thumb',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'Day total: 847 cases delivered, $73.6K revenue. On-time rate: 100% (all stops within 15-min window).', priority: 'low' },
        { source: 'crm', insight: 'End-of-day CRM sync: 12 stops completed, 2 new leads (Deep Ellum Bottle Shop, Henderson Ave). Update pipeline.', priority: 'low' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 0,
      contactName: 'Warehouse Team', contactPhone: '(214) 555-0100',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: null,
      lat: 32.8007, lng: -96.8167,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// ROSA GUTIERREZ — LAR-02, Wednesday, Laredo
// 10 stops, heavy Corona/Modelo, bilingual contacts
// ═══════════════════════════════════════════════════════════════════
export const ROSA_DAY_PLAN: DayPlan = {
  repId: 'SEL-LAR-02',
  repName: 'Rosa Gutierrez',
  date: 'Wednesday, March 5, 2026',
  route: 'LAR-02',
  hometown: 'lar',
  hometownName: 'Laredo',
  totalMiles: 38.6,
  totalDuration: '8h 30m',
  totalRevenue: 52400,
  totalCases: 624,
  optimizationSavings: { miles: 8, minutes: 22 },
  truckNumber: 'Truck #342',
  stops: [
    {
      id: 'rosa-01', sequence: 1, type: 'load-out',
      accountId: 'WAREHOUSE-LAR', accountName: 'Laredo Distribution Center',
      address: '8200 Bob Bullock Loop, Laredo, TX 78043',
      arrivalTime: '6:15 AM', duration: 40,
      deliveryManifest: [
        { brand: 'Corona Extra', cases: 180, sku: 'COR-24-12oz' },
        { brand: 'Modelo Especial', cases: 145, sku: 'MOD-24-12oz' },
        { brand: 'Tecate', cases: 72, sku: 'TEC-24-12oz' },
        { brand: 'Dos Equis Lager', cases: 48, sku: 'DOS-24-12oz' },
        { brand: 'Miller Lite', cases: 42, sku: 'MIL-24-12oz' },
        { brand: 'Coors Light', cases: 36, sku: 'CRS-24-12oz' },
        { brand: 'Heineken', cases: 30, sku: 'HEI-24-12oz' },
        { brand: 'Modelo Negra', cases: 24, sku: 'MNG-12-12oz' },
        { brand: 'Buffalo Trace', cases: 12, sku: 'BT-6-750ml' },
        { brand: 'Fireball', cases: 12, sku: 'FB-12-750ml' },
        { brand: 'Truly', cases: 12, sku: 'TRU-12-12oz' },
        { brand: 'Twisted Tea', cases: 11, sku: 'TWT-12-12oz' },
      ],
      talkingPoints: [
        'Load: 624 cases, 12 SKUs. Heavy import load (78% Corona/Modelo/Tecate/Dos Equis)',
        'Priority: Spec\'s Laredo spirits order, La Posada Hotel seasonal program',
        'TABC note: Border compliance check this week — ensure all W permit accounts current',
      ],
      aiInsights: [
        { source: 'maps', insight: 'Route optimized for Laredo traffic patterns. Avoid I-35 construction zone near Uniroyal. Use McPherson Rd alternate.', priority: 'medium' },
        { source: 'encompass', insight: 'Laredo warehouse spirits cage: Buffalo Trace at 40% capacity. Fireball restocked yesterday.', priority: 'low' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 0,
      contactName: 'Laredo Warehouse', contactPhone: '(956) 555-0100',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: null,
      lat: 27.5700, lng: -99.4700,
    },
    {
      id: 'rosa-02', sequence: 2, type: 'key-account',
      accountId: 'ACC-A015', accountName: "Spec's Liquors — Laredo",
      address: '5710 San Dario Ave, Laredo, TX 78041',
      arrivalTime: '7:15 AM', duration: 35,
      deliveryManifest: [
        { brand: 'Corona Extra', cases: 60, sku: 'COR-24-12oz' },
        { brand: 'Modelo Especial', cases: 48, sku: 'MOD-24-12oz' },
        { brand: 'Tecate', cases: 24, sku: 'TEC-24-12oz' },
        { brand: 'Dos Equis Lager', cases: 18, sku: 'DOS-24-12oz' },
        { brand: 'Buffalo Trace', cases: 6, sku: 'BT-6-750ml' },
        { brand: 'Fireball', cases: 6, sku: 'FB-12-750ml' },
      ],
      talkingPoints: [
        'Deliver 150cs import + 12cs spirits. Alejandra prefers delivery before 8 AM.',
        'Cinco de Mayo pre-order push: 200cs Corona Extra for April 28 delivery',
        'Present Sazerac spirits tasting — pair with their existing tequila/mezcal section',
        'Discutir programa de Corona para Cinco de Mayo (bilingual approach)',
      ],
      aiInsights: [
        { source: 'crm', insight: "Spec's Laredo is the top spirits retailer in Webb County. Alejandra Fuentes has buying authority — she responds well to margin data.", priority: 'high' },
        { source: 'nielsen', insight: 'Laredo market indexes 180% for import beer vs. Texas average. Corona is the #1 brand by far.', priority: 'high' },
        { source: 'tabc', insight: 'P license verified. W permit current for spirits. Annual audit passed Jan 2026.', priority: 'low' },
      ],
      competitiveIntel: 'L&F Distributors (now Reyes Holdings) supplies some Constellation direct — monitor for pricing undercuts on Corona 24-pack.',
      revenueOpportunity: 13400,
      contactName: 'Alejandra Fuentes', contactPhone: '(956) 555-0244',
      displayInstructions: 'Reset Corona end-cap with Cinco de Mayo POS. Photo required.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 27.5336, lng: -99.4876,
    },
    {
      id: 'rosa-03', sequence: 3, type: 'chain-drop',
      accountId: 'ACC-A011', accountName: 'H-E-B Plus — Laredo',
      address: '4502 San Bernardo Ave, Laredo, TX 78041',
      arrivalTime: '8:05 AM', duration: 30,
      deliveryManifest: [
        { brand: 'Corona Extra', cases: 48, sku: 'COR-24-12oz' },
        { brand: 'Modelo Especial', cases: 36, sku: 'MOD-24-12oz' },
        { brand: 'Miller Lite', cases: 24, sku: 'MIL-24-12oz' },
        { brand: 'Tecate', cases: 18, sku: 'TEC-24-12oz' },
        { brand: 'Heineken', cases: 12, sku: 'HEI-24-12oz' },
      ],
      talkingPoints: [
        'Standard 138cs delivery. Ricardo prefers receiving before 8:30 AM.',
        'Check cold vault compliance — Modelo should have 6 door facings',
        'H-E-B spring reset coming week of March 10 — confirm Lone Star shelf space allocation',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'H-E-B Laredo is highest-volume H-E-B for import beer in South Texas. 420cs/month average.', priority: 'medium' },
        { source: 'crm', insight: 'Ricardo Salinas has final say on shelf resets. Build relationship — he also manages 3 other H-E-B locations.', priority: 'high' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 11200,
      contactName: 'Ricardo Salinas', contactPhone: '(956) 555-0199',
      displayInstructions: 'Check cold vault facings. Modelo eye level, Corona at knee height per planogram.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 27.5196, lng: -99.5006,
    },
    {
      id: 'rosa-04', sequence: 4, type: 'presell',
      accountId: 'ACC-C014', accountName: 'Taqueria La Mexicana',
      address: '1702 Santa Maria Ave, Laredo, TX 78040',
      arrivalTime: '8:50 AM', duration: 25,
      deliveryManifest: [],
      talkingPoints: [
        'On-premise presell: current order is 75cs/month, mostly Corona/Tecate.',
        'Pitch Modelo Negra for draft — "premium Mexican lager for food pairing"',
        'Discuss bucket deal: Corona + lime bucket, $20 per table',
        'Jose Luis prefiere hablar en espanol — toda la presentacion en espanol',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Jose Luis is a loyal Corona customer since Southern Distributing days. Lone Star acquired this account in 2024. Relationship is strong.', priority: 'medium' },
        { source: 'nielsen', insight: 'On-premise Mexican restaurants in border markets consume 3x more import beer than DFW average.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 1900,
      contactName: 'Jose Luis Ramirez', contactPhone: '(956) 555-5334',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 27.5010, lng: -99.5080,
    },
    {
      id: 'rosa-05', sequence: 5, type: 'presell-spirits',
      accountId: 'ACC-C013', accountName: 'La Posada Hotel',
      address: '1000 Zaragoza St, Laredo, TX 78040',
      arrivalTime: '9:30 AM', duration: 35,
      deliveryManifest: [],
      talkingPoints: [
        'Present Sazerac spirits program for hotel bar and restaurant',
        'Buffalo Trace Old Fashioned kit — branded glassware, bar mat, recipe cards',
        'Fireball shot program for cantina nights (Thursday-Saturday)',
        'Discuss Peroni for pool bar — Italian positioning for resort feel',
        'Elena quiere discutir programa de eventos para turismo de WBCA',
      ],
      aiInsights: [
        { source: 'crm', insight: 'La Posada hosts WBCA (Washington Birthday Celebration) events in February — huge opportunity. Year-round tourism from Mexico drives consistent volume.', priority: 'high' },
        { source: 'tabc', insight: 'MB license current. Hotel has mixed beverage permit + special events permit. Can host tastings.', priority: 'low' },
        { source: 'nielsen', insight: 'Hotel bars in border markets showing 35% YoY spirits growth. Bourbon is the fastest-growing category.', priority: 'medium' },
      ],
      competitiveIntel: 'Hotel currently uses local distributor for tequila. Position Sazerac spirits as complementary portfolio, not replacement.',
      revenueOpportunity: 3800,
      contactName: 'Elena Fernandez', contactPhone: '(956) 555-5223',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 27.4980, lng: -99.5120,
    },
    {
      id: 'rosa-06', sequence: 6, type: 'compliance',
      accountId: 'ACC-D007', accountName: 'Stripes #4427',
      address: '1520 Jacaman Rd, Laredo, TX 78041',
      arrivalTime: '10:20 AM', duration: 15,
      deliveryManifest: [
        { brand: 'Corona Extra', cases: 12, sku: 'COR-12-12oz' },
        { brand: 'Tecate', cases: 8, sku: 'TEC-12-12oz' },
        { brand: 'Miller Lite', cases: 6, sku: 'MIL-12-12oz' },
      ],
      talkingPoints: [
        'Cold vault audit: Lone Star should have 45% share of door facings',
        'Restock Corona singles + 6-packs. Verify pricing signs.',
        'Check for competitor encroachment in cooler',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'Stripes is a consistent 65cs/month account. Low-maintenance but important for market coverage.', priority: 'low' },
        { source: 'tabc', insight: 'BB license verified. Standard convenience store compliance.', priority: 'low' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 1600,
      contactName: 'Luis Trevino', contactPhone: '(956) 555-9667',
      displayInstructions: 'Check cold vault share. Photo for compliance.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 27.5300, lng: -99.4950,
    },
    {
      id: 'rosa-07', sequence: 7, type: 'chain-drop',
      accountId: 'ACC-B008', accountName: 'La Michoacana',
      address: '2301 Saunders St, Laredo, TX 78040',
      arrivalTime: '10:50 AM', duration: 25,
      deliveryManifest: [
        { brand: 'Corona Extra', cases: 36, sku: 'COR-24-12oz' },
        { brand: 'Modelo Especial', cases: 24, sku: 'MOD-24-12oz' },
        { brand: 'Tecate', cases: 18, sku: 'TEC-24-12oz' },
        { brand: 'Dos Equis Lager', cases: 12, sku: 'DOS-24-12oz' },
      ],
      talkingPoints: [
        'Standard 90cs delivery. Mostly import brands for this market.',
        'Jorge is interested in Modelo Negra — bring sample 6-pack',
        'Discuss Cinco de Mayo floor display opportunity',
      ],
      aiInsights: [
        { source: 'crm', insight: 'La Michoacana caters to bilingual families. 95% of sales are import brands. Minimal domestic opportunity.', priority: 'medium' },
        { source: 'encompass', insight: 'Consistent 150cs/month. Account has grown 15% since Lone Star acquisition of Southern.', priority: 'low' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 3800,
      contactName: 'Jorge Hernandez', contactPhone: '(956) 555-1577',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 27.5080, lng: -99.5030,
    },
    {
      id: 'rosa-08', sequence: 8, type: 'presell',
      accountId: 'ACC-C015', accountName: 'Siete Banderas',
      address: '800 San Bernardo Ave, Laredo, TX 78040',
      arrivalTime: '11:30 AM', duration: 30,
      deliveryManifest: [],
      talkingPoints: [
        'Present Corona bucket deal for outdoor seating area',
        'Discuss Modelo Negra draft installation — they have 6 taps, we have 2',
        'Maria Guadalupe is planning a Cinco de Mayo event — pitch Corona sponsorship',
        'Presentar programa de patrocinio para evento de Cinco de Mayo',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Siete Banderas is the go-to spot for local families. Weekend volume is 3x weekday. Focus on weekend-ready inventory.', priority: 'medium' },
        { source: 'nielsen', insight: 'On-premise corona consumption in Laredo is 2.5x the state average. Bucket deals drive 40% of on-premise Corona sales.', priority: 'high' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 2600,
      contactName: 'Maria Guadalupe Perez', contactPhone: '(956) 555-5445',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 27.5020, lng: -99.5070,
    },
    {
      id: 'rosa-09', sequence: 9, type: 'drive-by',
      accountId: 'ACC-D023', accountName: 'Stripes #4431',
      address: '4501 E Del Mar Blvd, Laredo, TX 78041',
      arrivalTime: '12:15 PM', duration: 10,
      deliveryManifest: [],
      talkingPoints: [
        'Quick cold vault check on route back. Verify Corona pricing.',
        'This location has been trending down — check for stock issues',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'Volume dropped 12% month-over-month. May be a shelf space issue or competitor encroachment.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 1200,
      contactName: 'Roberto Cantu', contactPhone: '(956) 555-1345',
      displayInstructions: 'Check for out-of-stocks. Photo if issues found.',
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 27.5400, lng: -99.4800,
    },
    {
      id: 'rosa-10', sequence: 10, type: 'return',
      accountId: 'WAREHOUSE-LAR', accountName: 'Laredo Distribution Center',
      address: '8200 Bob Bullock Loop, Laredo, TX 78043',
      arrivalTime: '12:45 PM', duration: 30,
      deliveryManifest: [],
      talkingPoints: [
        'Returns processing and cash settlement',
        'CRM updates: La Posada spirits program interest, Cinco de Mayo pre-orders',
        'Tomorrow pre-pull review: Thursday LAR-02 East sector',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'Day total: 624 cases, $52.4K revenue. Import mix: 78% (target: 75%). On track.', priority: 'low' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 0,
      contactName: 'Laredo Warehouse', contactPhone: '(956) 555-0100',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: null,
      lat: 27.5700, lng: -99.4700,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// JAKE WILLIAMS — FTW-05, Monday, Fort Worth West
// 11 stops, craft + spirits pioneer route
// ═══════════════════════════════════════════════════════════════════
export const JAKE_DAY_PLAN: DayPlan = {
  repId: 'SEL-FTW-05',
  repName: 'Jake Williams',
  date: 'Monday, March 3, 2026',
  route: 'FTW-05',
  hometown: 'ftw',
  hometownName: 'Fort Worth',
  totalMiles: 42.8,
  totalDuration: '9h 00m',
  totalRevenue: 64200,
  totalCases: 738,
  optimizationSavings: { miles: 11, minutes: 28 },
  truckNumber: 'Truck #185',
  stops: [
    {
      id: 'jake-01', sequence: 1, type: 'load-out',
      accountId: 'WAREHOUSE-FTW', accountName: 'Fort Worth Distribution Center',
      address: '6100 Will Rogers Blvd, Fort Worth, TX 76140',
      arrivalTime: '5:45 AM', duration: 45,
      deliveryManifest: [
        { brand: 'Miller Lite', cases: 120, sku: 'MIL-24-12oz' },
        { brand: 'Coors Light', cases: 96, sku: 'CRS-24-12oz' },
        { brand: 'Corona Extra', cases: 84, sku: 'COR-24-12oz' },
        { brand: 'Modelo Especial', cases: 72, sku: 'MOD-24-12oz' },
        { brand: 'Shiner Bock', cases: 60, sku: 'SHI-24-12oz' },
        { brand: 'Firestone Walker', cases: 48, sku: 'FW-12-12oz' },
        { brand: 'Rahr & Sons', cases: 36, sku: 'RAH-12-12oz' },
        { brand: 'Blue Moon', cases: 36, sku: 'BLU-12-12oz' },
        { brand: 'Buffalo Trace', cases: 36, sku: 'BT-6-750ml' },
        { brand: 'Fireball', cases: 24, sku: 'FB-12-750ml' },
        { brand: 'Southern Comfort', cases: 18, sku: 'SC-6-750ml' },
        { brand: 'Wheatley Vodka', cases: 12, sku: 'WV-6-750ml' },
        { brand: 'Revolver', cases: 48, sku: 'REV-12-12oz' },
        { brand: 'Truly', cases: 24, sku: 'TRU-12-12oz' },
        { brand: 'Heineken', cases: 24, sku: 'HEI-24-12oz' },
      ],
      talkingPoints: [
        'Load: 738 cases, 15 SKUs. Heavy craft + spirits load (25% of truck vs. 16% avg)',
        'Priority: Spec\'s FW spirits order, Beverage Depot craft feature, Rahr taproom restock',
        'New Sazerac placement opportunities at Rodeo Goat and Ellerbe Fine Foods',
      ],
      aiInsights: [
        { source: 'maps', insight: 'Monday traffic lighter than usual — Construction on I-30 cleared. Normal route sequence optimal.', priority: 'low' },
        { source: 'encompass', insight: 'Solar panels at FW warehouse generated 42% of power last month. Spirits cage at 65% capacity.', priority: 'low' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 0,
      contactName: 'FW Warehouse Team', contactPhone: '(817) 555-0100',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: null,
      lat: 32.6800, lng: -97.3500,
    },
    {
      id: 'jake-02', sequence: 2, type: 'key-account',
      accountId: 'ACC-A009', accountName: "Spec's Liquors — Fort Worth",
      address: '4750 Bryant Irvin Rd, Fort Worth, TX 76132',
      arrivalTime: '6:50 AM', duration: 40,
      deliveryManifest: [
        { brand: 'Buffalo Trace', cases: 18, sku: 'BT-6-750ml' },
        { brand: 'Fireball', cases: 12, sku: 'FB-12-750ml' },
        { brand: 'Southern Comfort', cases: 12, sku: 'SC-6-750ml' },
        { brand: 'Wheatley Vodka', cases: 6, sku: 'WV-6-750ml' },
        { brand: 'Firestone Walker', cases: 24, sku: 'FW-12-12oz' },
        { brand: 'Rahr & Sons', cases: 12, sku: 'RAH-12-12oz' },
        { brand: 'Revolver', cases: 12, sku: 'REV-12-12oz' },
        { brand: 'Corona Extra', cases: 36, sku: 'COR-24-12oz' },
        { brand: 'Shiner Bock', cases: 24, sku: 'SHI-24-12oz' },
      ],
      talkingPoints: [
        'Deliver 48cs spirits + 72cs craft + 36cs Corona. Amanda loves the craft portfolio.',
        'Present Wheatley Vodka as new addition — Buffalo Trace\'s craft vodka',
        'Discuss end-cap for "Fort Worth Craft" feature: Rahr, Revolver, Firestone Walker',
        'Buffalo Trace allocation: secured 18cs (limited release this quarter)',
      ],
      aiInsights: [
        { source: 'crm', insight: "Spec's FW is Jake's highest-revenue account. Amanda Brooks is a craft beer judge — she values quality over volume. Lead with story and ratings.", priority: 'high' },
        { source: 'nielsen', insight: 'Fort Worth craft beer market growing 18% YoY. Rahr & Sons and Revolver are the top 2 local brands.', priority: 'high' },
        { source: 'tabc', insight: 'P license verified, W permit current. All permits through Dec 2026.', priority: 'low' },
      ],
      competitiveIntel: 'Local craft brewery collective placing aggressive displays. Differentiate with established portfolio and local Fort Worth angle.',
      revenueOpportunity: 15900,
      contactName: 'Amanda Brooks', contactPhone: '(817) 555-0721',
      displayInstructions: 'Set up "Fort Worth Craft" end-cap: Rahr Blonde, Revolver Blood & Honey, Firestone 805. Shelf talkers with "Brewed in Texas" messaging.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 32.6890, lng: -97.4200,
    },
    {
      id: 'jake-03', sequence: 3, type: 'chain-drop',
      accountId: 'ACC-B022', accountName: 'Beverage Depot — Fort Worth',
      address: '4900 Camp Bowie Blvd, Fort Worth, TX 76107',
      arrivalTime: '7:45 AM', duration: 30,
      deliveryManifest: [
        { brand: 'Miller Lite', cases: 36, sku: 'MIL-24-12oz' },
        { brand: 'Coors Light', cases: 24, sku: 'CRS-24-12oz' },
        { brand: 'Shiner Bock', cases: 18, sku: 'SHI-24-12oz' },
        { brand: 'Buffalo Trace', cases: 6, sku: 'BT-6-750ml' },
        { brand: 'Firestone Walker', cases: 12, sku: 'FW-12-12oz' },
        { brand: 'Revolver', cases: 12, sku: 'REV-12-12oz' },
      ],
      talkingPoints: [
        '108cs delivery. Todd Reynolds wants more craft variety — present Firestone Walker IPA.',
        'Check spirits aisle for Buffalo Trace shelf space. Request eye-level placement.',
        'Discuss summer seasonal craft feature — rotating local breweries',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Todd Reynolds is a craft beer enthusiast. He runs "Craft Corner" tasting events monthly. Partnership opportunity.', priority: 'medium' },
        { source: 'encompass', insight: 'Beverage Depot craft category up 28% under Jake\'s management. Spirits growing from zero to 6cs/month.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 6100,
      contactName: 'Todd Reynolds', contactPhone: '(817) 555-2932',
      displayInstructions: 'Check craft beer section facing. Ensure Rahr and Revolver have shelf talkers.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 32.7380, lng: -97.3840,
    },
    {
      id: 'jake-04', sequence: 4, type: 'presell-spirits',
      accountId: 'ACC-C006', accountName: 'Rodeo Goat',
      address: '2836 Bledsoe St, Fort Worth, TX 76107',
      arrivalTime: '8:30 AM', duration: 30,
      deliveryManifest: [],
      talkingPoints: [
        'Present full Sazerac bar program: Buffalo Trace, Fireball, Southern Comfort, Wheatley Vodka',
        'Rodeo Goat has 12 taps — Lone Star has 4 (Miller Lite, Blue Moon, Shiner, Firestone). Target: 6.',
        'Pitch Revolver Blood & Honey as 5th tap — "Fort Worth\'s own, your customers will love it"',
        'Discuss branded bar mats and glassware for Buffalo Trace cocktails',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Kelly Austin recently expanded cocktail menu. She wants local spirits — perfect timing for Sazerac pitch.', priority: 'high' },
        { source: 'nielsen', insight: 'West 7th District on-premise craft/spirits growing 32% YoY. Rodeo Goat is the anchor establishment.', priority: 'high' },
      ],
      competitiveIntel: 'Deep Eddy Vodka (local Austin brand via Heaven Hill) has strong presence. Position Wheatley Vodka as craft-distilled alternative with Buffalo Trace pedigree.',
      revenueOpportunity: 3900,
      contactName: 'Kelly Austin', contactPhone: '(817) 555-4556',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.7450, lng: -97.3470,
    },
    {
      id: 'jake-05', sequence: 5, type: 'presell',
      accountId: 'ACC-C029', accountName: 'Rahr & Sons Brewing — Taproom',
      address: '701 Galveston Ave, Fort Worth, TX 76104',
      arrivalTime: '9:15 AM', duration: 25,
      deliveryManifest: [
        { brand: 'Rahr & Sons', cases: 24, sku: 'RAH-12-12oz' },
      ],
      talkingPoints: [
        'Taproom restock: 24cs Rahr & Sons variety (Blonde, Ugly Pug, Iron Thistle)',
        'Discuss upcoming Rahr anniversary party — Lone Star to provide Miller Lite and Coors Light for event',
        'Fritz wants to expand distribution to 3 more bars in West 7th — coordinate with route scheduling',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Fritz Rahr is a key craft partner. Rahr & Sons is exclusively distributed by Lone Star in Tarrant County.', priority: 'high' },
        { source: 'encompass', insight: 'Rahr taproom sells 60cs/month through taproom + to-go. Wholesale to other accounts adds 180cs/month.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 1800,
      contactName: 'Fritz Rahr', contactPhone: '(817) 555-6889',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.7340, lng: -97.3310,
    },
    {
      id: 'jake-06', sequence: 6, type: 'presell-spirits',
      accountId: 'ACC-C035', accountName: 'Ellerbe Fine Foods',
      address: '1501 W Magnolia Ave, Fort Worth, TX 76104',
      arrivalTime: '9:55 AM', duration: 30,
      deliveryManifest: [],
      talkingPoints: [
        'First spirits pitch — Ellerbe is a fine dining restaurant with full bar',
        'Present Buffalo Trace Old Fashioned program: premium positioning for their clientele',
        'Pitch Peroni as Italian beer complement to their Mediterranean-inspired menu',
        'Southern Comfort as dessert cocktail base — matches their pastry program',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Molly McCook is an award-winning chef. She values food pairing and storytelling. Lead with Buffalo Trace heritage story.', priority: 'high' },
        { source: 'nielsen', insight: 'Fine dining spirits consumption up 24% in Fort Worth. Bourbon cocktails are the #1 growth category.', priority: 'medium' },
        { source: 'tabc', insight: 'MB license verified. Full bar permit current.', priority: 'low' },
      ],
      competitiveIntel: 'Currently uses Woodford Reserve as their bourbon. Position Buffalo Trace as more approachable for cocktails ($8/bottle lower cost, similar quality profile).',
      revenueOpportunity: 2800,
      contactName: 'Molly McCook', contactPhone: '(817) 555-7445',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.7280, lng: -97.3540,
    },
    {
      id: 'jake-07', sequence: 7, type: 'chain-drop',
      accountId: 'ACC-D003', accountName: '7-Eleven #3104',
      address: '2900 W 7th St, Fort Worth, TX 76107',
      arrivalTime: '10:40 AM', duration: 15,
      deliveryManifest: [
        { brand: 'Miller Lite', cases: 18, sku: 'MIL-12-12oz' },
        { brand: 'Corona Extra', cases: 12, sku: 'COR-12-12oz' },
        { brand: 'Coors Light', cases: 12, sku: 'CRS-12-12oz' },
        { brand: 'Truly', cases: 8, sku: 'TRU-12-12oz' },
        { brand: 'Twisted Tea', cases: 6, sku: 'TWT-12-12oz' },
      ],
      talkingPoints: [
        'Quick drop: 56cs. Check cold vault compliance.',
        'West 7th 7-Eleven gets heavy foot traffic from bar district — verify singles inventory',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'This 7-Eleven is near West 7th entertainment district. Weekend singles volume is 3x weekday.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 2800,
      contactName: 'Sam Patel', contactPhone: '(817) 555-9223',
      displayInstructions: 'Check cold vault facings. Restock singles.',
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.7490, lng: -97.3510,
    },
    {
      id: 'jake-08', sequence: 8, type: 'merchandising',
      accountId: 'ACC-C008', accountName: 'Chat Room Pub',
      address: '1263 W Magnolia Ave, Fort Worth, TX 76104',
      arrivalTime: '11:10 AM', duration: 25,
      deliveryManifest: [
        { brand: 'Revolver', cases: 12, sku: 'REV-12-12oz' },
        { brand: 'Firestone Walker', cases: 12, sku: 'FW-12-12oz' },
        { brand: 'Shiner Bock', cases: 8, sku: 'SHI-24-12oz' },
        { brand: 'Blue Moon', cases: 6, sku: 'BLU-12-12oz' },
      ],
      talkingPoints: [
        'Restock craft cooler — Revolver and Firestone are their fastest movers',
        'Build new "Craft of Fort Worth" display with Revolver + Rahr bottles',
        'Photo documentation for craft program compliance',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Chat Room Pub is a Magnolia Ave staple. Craft-forward crowd. Ben Lawson personally tastes every new beer before adding it.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 2400,
      contactName: 'Ben Lawson', contactPhone: '(817) 555-4778',
      displayInstructions: 'Build "Craft of Fort Worth" display in cooler. Revolver + Rahr + Firestone Walker. Photo required.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 32.7270, lng: -97.3530,
    },
    {
      id: 'jake-09', sequence: 9, type: 'presell',
      accountId: 'ACC-C046', accountName: 'World of Beer',
      address: '855 Foch St, Fort Worth, TX 76107',
      arrivalTime: '11:50 AM', duration: 25,
      deliveryManifest: [],
      talkingPoints: [
        'World of Beer has 50 taps — Lone Star has 8. Target: 12.',
        'Pitch 4 new taps: Revolver Blood & Honey, Firestone Walker 805, Rahr Blonde, Yuengling',
        'Isaac wants more Texas craft — we have the deepest Texas portfolio',
        'Discuss monthly tap takeover events — Lone Star provides kegs at reduced rate for exposure',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Isaac Coleman rotates taps monthly. He tracks velocity — bring sales data on Revolver and Firestone from other WoB locations.', priority: 'high' },
        { source: 'nielsen', insight: 'World of Beer locations that feature local craft see 20% higher per-tap revenue. Texas brands outperform national craft.', priority: 'medium' },
      ],
      competitiveIntel: 'Manhattan Project (local, Deep Ellum Brewing distribution) has 4 taps. Pitch head-to-head with velocity data.',
      revenueOpportunity: 2700,
      contactName: 'Isaac Coleman', contactPhone: '(817) 555-8556',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: 'verified',
      lat: 32.7460, lng: -97.3480,
    },
    {
      id: 'jake-10', sequence: 10, type: 'chain-drop',
      accountId: 'ACC-A010', accountName: 'Total Wine & More — Fort Worth',
      address: '4862 S Hulen St, Fort Worth, TX 76132',
      arrivalTime: '12:30 PM', duration: 35,
      deliveryManifest: [
        { brand: 'Miller Lite', cases: 48, sku: 'MIL-24-12oz' },
        { brand: 'Coors Light', cases: 36, sku: 'CRS-24-12oz' },
        { brand: 'Corona Extra', cases: 36, sku: 'COR-24-12oz' },
        { brand: 'Modelo Especial', cases: 36, sku: 'MOD-24-12oz' },
        { brand: 'Heineken', cases: 24, sku: 'HEI-24-12oz' },
        { brand: 'Shiner Bock', cases: 18, sku: 'SHI-24-12oz' },
        { brand: 'Buffalo Trace', cases: 12, sku: 'BT-6-750ml' },
        { brand: 'Fireball', cases: 12, sku: 'FB-12-750ml' },
        { brand: 'Southern Comfort', cases: 6, sku: 'SC-6-750ml' },
        { brand: 'Wheatley Vodka', cases: 6, sku: 'WV-6-750ml' },
      ],
      talkingPoints: [
        'Major delivery: 234cs. Greg Patterson wants everything stocked before weekend rush.',
        'New spirits placement: Wheatley Vodka in "New Arrivals" section',
        'Buffalo Trace allocation secured — highlight as exclusive limited availability',
        'Discuss summer "Texas Craft" display concept with Greg',
      ],
      aiInsights: [
        { source: 'crm', insight: 'Greg Patterson manages both FW Total Wine locations. He has significant autonomy on displays and promotions. Key relationship for spirits growth.', priority: 'high' },
        { source: 'encompass', insight: 'Total Wine FW is the #2 revenue account in Fort Worth district. 680cs/month average. Growing 12% YoY.', priority: 'medium' },
        { source: 'nielsen', insight: 'Total Wine stores in DFW are the #1 channel for spirits discovery. Wheatley Vodka placement here could drive 50+ case/month run rate.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 19800,
      contactName: 'Greg Patterson', contactPhone: '(817) 555-0832',
      displayInstructions: 'Place Wheatley Vodka in "New Arrivals" end-cap. Buffalo Trace on feature shelf. Photo required.',
      photoRequired: true,
      tabcStatus: 'verified',
      lat: 32.6850, lng: -97.4050,
    },
    {
      id: 'jake-11', sequence: 11, type: 'return',
      accountId: 'WAREHOUSE-FTW', accountName: 'Fort Worth Distribution Center',
      address: '6100 Will Rogers Blvd, Fort Worth, TX 76140',
      arrivalTime: '1:20 PM', duration: 30,
      deliveryManifest: [],
      talkingPoints: [
        'Returns processing and cash settlement',
        'CRM updates: Rodeo Goat spirits interest, Ellerbe Fine Foods new program, World of Beer tap expansion',
        'Submit photos: Spec\'s FW craft display, Beverage Depot, Chat Room craft display, Total Wine Wheatley',
        'Tomorrow pre-pull: Tuesday FTW-05 East sector',
      ],
      aiInsights: [
        { source: 'encompass', insight: 'Day total: 738 cases, $64.2K revenue. Craft + spirits mix: 25% (vs. 16% company avg). Spirits accounts contacted: 4 new leads.', priority: 'low' },
        { source: 'crm', insight: 'Jake has opened 16 new spirits accounts this quarter — highest in company. On pace for spirits pioneer bonus.', priority: 'medium' },
      ],
      competitiveIntel: null,
      revenueOpportunity: 0,
      contactName: 'FW Warehouse Team', contactPhone: '(817) 555-0100',
      displayInstructions: null,
      photoRequired: false,
      tabcStatus: null,
      lat: 32.6800, lng: -97.3500,
    },
  ],
};

// Combined day plans array for easy access
export const DAY_PLANS: DayPlan[] = [MARCUS_DAY_PLAN, ROSA_DAY_PLAN, JAKE_DAY_PLAN];

// Helper functions
export const getDayPlanByRep = (repId: string): DayPlan | undefined =>
  DAY_PLANS.find(dp => dp.repId === repId);

export const getStopById = (stopId: string): Stop | undefined => {
  for (const plan of DAY_PLANS) {
    const stop = plan.stops.find(s => s.id === stopId);
    if (stop) return stop;
  }
  return undefined;
};

// Stop type display config
export const STOP_TYPE_CONFIG: Record<StopType, { label: string; color: string; icon: string }> = {
  'load-out': { label: 'Load-Out', color: '#6B7280', icon: 'Truck' },
  'key-account': { label: 'Key Account', color: '#F59E0B', icon: 'Star' },
  'chain-drop': { label: 'Chain Drop', color: '#3B82F6', icon: 'Building2' },
  'presell': { label: 'Presell', color: '#10B981', icon: 'MessageSquare' },
  'new-account': { label: 'New Account', color: '#A78BFA', icon: 'PlusCircle' },
  'compliance': { label: 'Compliance', color: '#EF4444', icon: 'ShieldCheck' },
  'problem-resolution': { label: 'Problem Resolution', color: '#F97316', icon: 'AlertTriangle' },
  'presell-spirits': { label: 'Presell + Spirits', color: '#F87171', icon: 'Wine' },
  'merchandising': { label: 'Merchandising', color: '#06B6D4', icon: 'Layout' },
  'drive-by': { label: 'Drive-By', color: '#9CA3AF', icon: 'Eye' },
  'windshield': { label: 'Windshield', color: '#D1D5DB', icon: 'Binoculars' },
  'return': { label: 'Return', color: '#6B7280', icon: 'Home' },
};
