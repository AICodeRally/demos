/* ══════════════════════════════════════════════════════════
   PROOFLINE Route Data — Route DAL-03 (Dallas)

   Rep: Marcus Reyes
   Territory: Dallas / Fort Worth
   8 stops with delivery manifests, AI insights, visit history
   ══════════════════════════════════════════════════════════ */

/* ── Stop Types ──────────────────────────────────────────── */

export type StopType = 'warehouse' | 'key-account' | 'chain-drop' | 'presell' | 'new-account';

export const STOP_TYPE_COLORS: Record<StopType, string> = {
  'warehouse': '#94a3b8',
  'key-account': '#C6A052',
  'chain-drop': '#3b82f6',
  'presell': '#22c55e',
  'new-account': '#a855f7',
};

export const STOP_TYPE_LABELS: Record<StopType, string> = {
  'warehouse': 'Warehouse',
  'key-account': 'Key Account',
  'chain-drop': 'Chain Drop',
  'presell': 'Presell',
  'new-account': 'New Account',
};

/* ── TABC Status ─────────────────────────────────────────── */

export type TABCStatus = 'verified' | 'expiring' | 'flagged';

/* ── Visit History ───────────────────────────────────────── */

export interface VisitRecord {
  date: string;
  cases: number;
  revenue: number;
  notes: string;
  trend: 'up' | 'down' | 'flat';
}

/* ── AI Suggestion ───────────────────────────────────────── */

export type StrategyTag = 'margin-priority' | 'mix-shift' | 'new-pipeline' | 'placement' | 'volume-tier';

export const STRATEGY_TAG_CONFIG: Record<StrategyTag, { label: string; color: string; icon: string }> = {
  'margin-priority': { label: 'MARGIN PRIORITY', color: '#C6A052', icon: '💎' },
  'mix-shift':       { label: 'MIX SHIFT',       color: '#a855f7', icon: '🔄' },
  'new-pipeline':    { label: 'NEW ACCOUNT',      color: '#22c55e', icon: '🚀' },
  'placement':       { label: 'PLACEMENT',        color: '#3b82f6', icon: '📍' },
  'volume-tier':     { label: 'VOLUME TIER',      color: '#f59e0b', icon: '📦' },
};

export interface AISuggestion {
  id: string;
  product: string;
  productId: string;
  cases: number;
  commissionDelta: number;
  reasoning: string;
  source: string;
  tags: string[];
  strategy: StrategyTag;
  coachingPlay: string;
  marginDelta: number; // margin % impact
}

/* ── Intelligence ────────────────────────────────────────── */

export interface StopIntelligence {
  insights: string[];
  competitiveIntel: string;
  contactName: string;
  contactPhone: string;
  tabcStatus: TABCStatus;
  tabcExpiry: string;
  tabcLicenseNo: string;
}

/* ── Manifest Item ───────────────────────────────────────── */

export interface ManifestItem {
  productId: string;
  name: string;
  cases: number;
  sku: string;
  promo?: string;
}

/* ── Route Stop ──────────────────────────────────────────── */

export interface RouteStop {
  id: string;
  sequence: number;
  accountName: string;
  type: StopType;
  arrivalTime: string;
  address: string;
  lat: number;
  lng: number;
  manifest: ManifestItem[];
  talkingPoints: string[];
  displayInstructions?: string;
  history: VisitRecord[];
  intelligence: StopIntelligence;
  aiSuggestions: AISuggestion[];
}

/* ── Route Metadata ──────────────────────────────────────── */

export const ROUTE_META = {
  routeId: 'DAL-03',
  repName: 'Marcus Reyes',
  repId: 'ls-rep-001',
  territory: 'Dallas',
  date: '2026-03-09',
  vehicleId: 'TX-4827',
  loadedCases: 187,
};

/* ── GPS coordinates (DFW area, simplified for SVG) ──────── */
/* Normalized to 0-100 coordinate space for SVG rendering    */

/* ── 8 Route Stops ───────────────────────────────────────── */

export const ROUTE_STOPS: RouteStop[] = [
  // ── Stop 1: Load-out (Warehouse) ──────────────────────
  {
    id: 'stop-1',
    sequence: 1,
    accountName: 'Lone Star Distribution Center',
    type: 'warehouse',
    arrivalTime: '7:00 AM',
    address: '4200 Singleton Blvd, Dallas, TX 75212',
    lat: 32.805, lng: -96.870,
    manifest: [],
    talkingPoints: [
      'Verify Patron Silver allocation (limited spring shipment)',
      'Check Cinco de Mayo display kits are loaded',
      'Confirm cold chain for craft beer pallets',
    ],
    displayInstructions: undefined,
    history: [],
    intelligence: {
      insights: [
        'Today\'s load: 187 cases across 7 accounts',
        'Spring allocation: 24 cases Patron Silver (priority for key accounts)',
        'New product sample: Revolver Blood & Honey seasonal',
      ],
      competitiveIntel: 'Republic National Distributing ran a promo blitz in 75201 zip last week — expect requests for price matching.',
      contactName: 'Warehouse Manager',
      contactPhone: '(214) 555-0100',
      tabcStatus: 'verified',
      tabcExpiry: '2027-12-31',
      tabcLicenseNo: 'WH-001-DFW',
    },
    aiSuggestions: [],
  },

  // ── Stop 2: Beverage Barn (Key Account) ───────────────
  {
    id: 'stop-2',
    sequence: 2,
    accountName: 'Beverage Barn',
    type: 'key-account',
    arrivalTime: '8:00 AM',
    address: '8531 Greenville Ave, Dallas, TX 75231',
    lat: 32.835, lng: -96.785,
    manifest: [
      { productId: 'ls-005', name: 'Patron Silver Tequila 750ml', cases: 6, sku: 'PAT-SLV-750', promo: 'Cinco de Mayo Special' },
      { productId: 'ls-001', name: 'Buffalo Trace Bourbon 750ml', cases: 4, sku: 'BUF-TRC-750' },
      { productId: 'ls-007', name: 'Corona Extra 24pk', cases: 12, sku: 'COR-EXT-24' },
      { productId: 'ls-008', name: 'Modelo Especial 24pk', cases: 8, sku: 'MOD-ESP-24' },
      { productId: 'ls-012', name: 'Shiner Bock 12pk', cases: 6, sku: 'SHN-BOC-12' },
    ],
    talkingPoints: [
      'Patron tasting event this Saturday — need end-cap display',
      'Discuss expanding Buffalo Trace shelf space (competitor de-listed)',
      'Cinco de Mayo promo: buy 10 Patron, get free display rack',
    ],
    displayInstructions: 'Set Patron end-cap display near entrance. Use Cinco de Mayo POP materials from kit.',
    history: [
      { date: '2026-03-02', cases: 32, revenue: 1840, notes: 'Regular delivery, good placement', trend: 'up' },
      { date: '2026-02-23', cases: 28, revenue: 1620, notes: 'Requested more craft options', trend: 'up' },
      { date: '2026-02-16', cases: 30, revenue: 1740, notes: 'New cooler section opened', trend: 'flat' },
      { date: '2026-02-09', cases: 26, revenue: 1510, notes: 'Super Bowl cleanup delivery', trend: 'down' },
    ],
    intelligence: {
      insights: [
        'Nielsen: Patron Silver up 40% in 75231 zip (Q1 2026)',
        'CRM: Owner mentioned expanding spirits section by April',
        'Foot traffic up 18% since new parking lot completed',
      ],
      competitiveIntel: 'Breakthru Beverage placed a Maker\'s Mark display last week — counter with Buffalo Trace prominence.',
      contactName: 'Dave Nguyen (Owner)',
      contactPhone: '(214) 555-0201',
      tabcStatus: 'verified',
      tabcExpiry: '2027-06-15',
      tabcLicenseNo: 'BV-2847-DAL',
    },
    aiSuggestions: [
      {
        id: 'sug-2a',
        product: 'Patron Silver Tequila 750ml',
        productId: 'ls-005',
        cases: 4,
        commissionDelta: 47,
        reasoning: 'Nielsen: +40% Patron sales in 75231. Cinco promo active. High margin ($18/cs).',
        source: 'Nielsen Scan Data + CRM',
        tags: ['spirits', 'premium'],
        strategy: 'margin-priority',
        coachingPlay: 'Lead with Cinco tasting event. Dave expanded spirits section — Patron fills the gap. Mention 3cs last year, push to 6.',
        marginDelta: 2.1,
      },
      {
        id: 'sug-2b',
        product: 'Hennessy VS Cognac 750ml',
        productId: 'ls-006',
        cases: 3,
        commissionDelta: 29,
        reasoning: 'No cognac on shelf currently. Demographic data shows strong demand in area.',
        source: 'TABC Database + Demographics',
        tags: ['spirits', 'premium'],
        strategy: 'margin-priority',
        coachingPlay: 'Empty cognac shelf = zero competition. Position next to premium whiskeys. Demo neighborhood skews upscale.',
        marginDelta: 1.8,
      },
    ],
  },

  // ── Stop 3: Total Wine (Chain Drop) ───────────────────
  {
    id: 'stop-3',
    sequence: 3,
    accountName: 'Total Wine & More',
    type: 'chain-drop',
    arrivalTime: '9:00 AM',
    address: '10740 Preston Rd, Dallas, TX 75230',
    lat: 32.860, lng: -96.810,
    manifest: [
      { productId: 'ls-003', name: "Tito's Handmade Vodka 1.75L", cases: 24, sku: 'TIT-HMV-175' },
      { productId: 'ls-009', name: 'Miller Lite 24pk', cases: 36, sku: 'MIL-LTE-24' },
      { productId: 'ls-010', name: 'Coors Light 24pk', cases: 36, sku: 'CRS-LGT-24' },
      { productId: 'ls-016', name: 'Topo Chico Mineral Water 12pk', cases: 12, sku: 'TOP-CHI-12' },
    ],
    talkingPoints: [
      'Volume play: chain minimum is 108 cases for tier pricing',
      'Tito\'s reset happening next week — confirm shelf space',
      'New craft section needs Shiner and Deep Ellum representation',
    ],
    displayInstructions: 'Stock to planogram. No custom displays for chain drops.',
    history: [
      { date: '2026-03-02', cases: 96, revenue: 3120, notes: 'Standard chain drop', trend: 'flat' },
      { date: '2026-02-23', cases: 108, revenue: 3480, notes: 'Hit volume threshold', trend: 'up' },
      { date: '2026-02-16', cases: 84, revenue: 2740, notes: 'Below threshold — missed bonus', trend: 'down' },
      { date: '2026-02-09', cases: 96, revenue: 3120, notes: 'Regular delivery', trend: 'flat' },
    ],
    intelligence: {
      insights: [
        'Chain HQ mandate: increase Texas craft by 15% in Q2',
        'Tito\'s is #1 vodka in DFW market — protect shelf space',
        'Store manager open to end-cap promo for Cinco de Mayo',
      ],
      competitiveIntel: 'RNDC just won exclusive on Clase Azul at this location. Focus on Patron as premium tequila.',
      contactName: 'Store Manager (Corp HQ)',
      contactPhone: '(214) 555-0302',
      tabcStatus: 'verified',
      tabcExpiry: '2027-09-30',
      tabcLicenseNo: 'TW-1074-DAL',
    },
    aiSuggestions: [
      {
        id: 'sug-3a',
        product: 'Deep Ellum IPA 6pk',
        productId: 'ls-013',
        cases: 12,
        commissionDelta: 18,
        reasoning: 'Chain mandate: +15% Texas craft. Deep Ellum trending in DFW. First-mover advantage.',
        source: 'Chain HQ Directive + Market Data',
        tags: ['regional', 'premium'],
        strategy: 'mix-shift',
        coachingPlay: 'Use chain HQ mandate as leverage — "your corporate wants 15% craft." Position Deep Ellum as the local hero brand.',
        marginDelta: 3.4,
      },
      {
        id: 'sug-3b',
        product: 'Karbach Love Street 12pk',
        productId: 'ls-014',
        cases: 12,
        commissionDelta: 16,
        reasoning: 'Pairs with Deep Ellum for Texas craft set. Karbach has strong brand recognition.',
        source: 'Category Analysis',
        tags: ['regional'],
        strategy: 'mix-shift',
        coachingPlay: 'Bundle with Deep Ellum — "Texas craft set." Love Street is approachable for craft newbies. Shelf-talker included.',
        marginDelta: 2.8,
      },
    ],
  },

  // ── Stop 4: Lone Star Liquor (Presell) ────────────────
  {
    id: 'stop-4',
    sequence: 4,
    accountName: 'Lone Star Liquor',
    type: 'presell',
    arrivalTime: '10:00 AM',
    address: '2941 Elm St, Dallas, TX 75226',
    lat: 32.890, lng: -96.830,
    manifest: [
      { productId: 'ls-004', name: 'Crown Royal Canadian 750ml', cases: 4, sku: 'CRN-RYL-750' },
      { productId: 'ls-002', name: 'Fireball Cinnamon Whisky 750ml', cases: 6, sku: 'FRB-CIN-750' },
      { productId: 'ls-006', name: 'Hennessy VS Cognac 750ml', cases: 3, sku: 'HEN-VS-750' },
    ],
    talkingPoints: [
      'Owner is spirits enthusiast — discuss new Buffalo Trace allocation',
      'Presell opportunity: Patron tasting event partnership',
      'Check inventory on Fireball — historically fast mover here',
    ],
    displayInstructions: 'Spirits counter display with tasting notes cards.',
    history: [
      { date: '2026-03-02', cases: 14, revenue: 580, notes: 'Good spirits mix, asked about bourbon', trend: 'up' },
      { date: '2026-02-23', cases: 12, revenue: 490, notes: 'Regular order', trend: 'flat' },
      { date: '2026-02-16', cases: 10, revenue: 410, notes: 'Light week — winter storm', trend: 'down' },
      { date: '2026-02-09', cases: 16, revenue: 660, notes: 'Super Bowl bump', trend: 'up' },
    ],
    intelligence: {
      insights: [
        'Owner expanding bourbon section — opportunity for Buffalo Trace',
        'Deep Ellum neighborhood foot traffic up 25% since new restaurants opened',
        'Fireball outsells by 3x vs. category average at this location',
      ],
      competitiveIntel: 'Glazer\'s placed a Jack Daniel\'s floor display. Counter with Crown Royal premium positioning.',
      contactName: 'Miguel Santos (Owner)',
      contactPhone: '(214) 555-0404',
      tabcStatus: 'verified',
      tabcExpiry: '2026-11-15',
      tabcLicenseNo: 'LS-2941-DAL',
    },
    aiSuggestions: [
      {
        id: 'sug-4a',
        product: 'Buffalo Trace Bourbon 750ml',
        productId: 'ls-001',
        cases: 4,
        commissionDelta: 22,
        reasoning: 'Owner expanding bourbon. Buffalo Trace has allocation advantage — limited availability creates urgency.',
        source: 'CRM Notes + Allocation Data',
        tags: ['spirits', 'premium'],
        strategy: 'margin-priority',
        coachingPlay: 'Lead with scarcity — "I got you 4 cases from spring allocation." Miguel is a bourbon enthusiast. This sells itself.',
        marginDelta: 2.4,
      },
    ],
  },

  // ── Stop 5: Joe's Icehouse (Key Account) ──────────────
  {
    id: 'stop-5',
    sequence: 5,
    accountName: "Joe's Icehouse",
    type: 'key-account',
    arrivalTime: '11:00 AM',
    address: '4100 Maple Ave, Dallas, TX 75219',
    lat: 32.920, lng: -96.765,
    manifest: [
      { productId: 'ls-009', name: 'Miller Lite 24pk', cases: 12, sku: 'MIL-LTE-24' },
      { productId: 'ls-007', name: 'Corona Extra 24pk', cases: 8, sku: 'COR-EXT-24' },
      { productId: 'ls-011', name: 'Blue Moon Belgian White 12pk', cases: 4, sku: 'BLU-MON-12' },
      { productId: 'ls-019', name: 'Tres Agaves Margarita Mix 1L', cases: 6, sku: 'TRS-AGV-MRG' },
      { productId: 'ls-016', name: 'Topo Chico Mineral Water 12pk', cases: 4, sku: 'TOP-CHI-12' },
    ],
    talkingPoints: [
      'Patio season starting — discuss outdoor cooler placement',
      'Margarita mix is flying — suggest premium mixer upgrade',
      'Live music nights: need Blue Moon and Corona for Wednesday events',
    ],
    displayInstructions: 'Bar-back stock. Place Corona cold in walk-in. Margarita mix behind bar.',
    history: [
      { date: '2026-03-02', cases: 30, revenue: 820, notes: 'Patio opened early this year', trend: 'up' },
      { date: '2026-02-23', cases: 24, revenue: 670, notes: 'Regular order', trend: 'flat' },
      { date: '2026-02-16', cases: 22, revenue: 610, notes: 'Slow week — rain', trend: 'down' },
      { date: '2026-02-09', cases: 34, revenue: 940, notes: 'Super Bowl party orders', trend: 'up' },
    ],
    intelligence: {
      insights: [
        'Bar revenue up 30% since patio reopened (March warmth)',
        'Owner mentioned interest in premium cocktail program',
        'Wednesday live music draws 200+ patrons — peak order night',
      ],
      competitiveIntel: 'Heineken rep offered a tap handle deal. We need to defend Miller Lite + Corona handles.',
      contactName: "Joe Martinez (Owner)",
      contactPhone: '(214) 555-0505',
      tabcStatus: 'expiring',
      tabcExpiry: '2026-04-30',
      tabcLicenseNo: 'JI-4100-DAL',
    },
    aiSuggestions: [
      {
        id: 'sug-5a',
        product: 'Fever-Tree Tonic Water 8pk',
        productId: 'ls-018',
        cases: 4,
        commissionDelta: 12,
        reasoning: 'Owner interested in premium cocktails. Fever-Tree is #1 premium mixer. $4/margin per case.',
        source: 'CRM + Category Trends',
        tags: ['premium'],
        strategy: 'mix-shift',
        coachingPlay: 'Joe wants a cocktail program — Fever-Tree IS the cocktail program. "Premium G&Ts are $14 each, your margin doubles."',
        marginDelta: 4.2,
      },
      {
        id: 'sug-5b',
        product: 'Patron Silver Tequila 750ml',
        productId: 'ls-005',
        cases: 2,
        commissionDelta: 32,
        reasoning: 'Margarita mix volume suggests tequila demand. Patron premium positioning for cocktail menu.',
        source: 'Sales Velocity Analysis',
        tags: ['spirits', 'premium'],
        strategy: 'margin-priority',
        coachingPlay: 'They already buy margarita mix — "you\'re making $5 margaritas with well tequila. Patron margaritas sell for $14." Revenue per pour pitch.',
        marginDelta: 3.1,
      },
    ],
  },

  // ── Stop 6: The Depot (New Account) ───────────────────
  {
    id: 'stop-6',
    sequence: 6,
    accountName: 'The Depot',
    type: 'new-account',
    arrivalTime: '12:30 PM',
    address: '2614 Commerce St, Dallas, TX 75226',
    lat: 32.950, lng: -96.820,
    manifest: [
      { productId: 'ls-003', name: "Tito's Handmade Vodka 1.75L", cases: 4, sku: 'TIT-HMV-175' },
      { productId: 'ls-005', name: 'Patron Silver Tequila 750ml', cases: 2, sku: 'PAT-SLV-750', promo: 'Spring Launch' },
      { productId: 'ls-009', name: 'Miller Lite 24pk', cases: 6, sku: 'MIL-LTE-24' },
      { productId: 'ls-007', name: 'Corona Extra 24pk', cases: 6, sku: 'COR-EXT-24' },
    ],
    talkingPoints: [
      'NEW ACCOUNT — First delivery! Build relationship.',
      'Opening night is March 15 — ensure full stock',
      'Discuss exclusive Lone Star draft program',
      'Introduce Cinco de Mayo promo opportunity early',
    ],
    displayInstructions: 'Full bar setup. Place spirits on top shelf. Beer in walk-in cooler. Get photo for CRM.',
    history: [],
    intelligence: {
      insights: [
        'New bar opening in Deep Ellum — high foot traffic area',
        'Owner previously ran successful bar in Austin (10 years)',
        'Target demographic: 25-40 professionals, craft cocktail focused',
      ],
      competitiveIntel: 'No existing distributor relationship — first-mover advantage. RNDC is also pitching.',
      contactName: 'Alex Kim (Owner)',
      contactPhone: '(214) 555-0606',
      tabcStatus: 'verified',
      tabcExpiry: '2028-03-01',
      tabcLicenseNo: 'TD-2614-DAL',
    },
    aiSuggestions: [
      {
        id: 'sug-6a',
        product: 'Hennessy VS Cognac 750ml',
        productId: 'ls-006',
        cases: 2,
        commissionDelta: 34,
        reasoning: 'New account bonus ($100) + spirits SPIFF ($25x2). Premium cocktail bar needs cognac for menu.',
        source: 'New Account Program',
        tags: ['spirits', 'premium', 'new-account'],
        strategy: 'new-pipeline',
        coachingPlay: 'First delivery = first impression. Hennessy on the top shelf says "we understand your bar." New account bonus stacks with SPIFF.',
        marginDelta: 3.8,
      },
      {
        id: 'sug-6b',
        product: 'Deep Ellum IPA 6pk',
        productId: 'ls-013',
        cases: 4,
        commissionDelta: 8,
        reasoning: 'Located IN Deep Ellum — local craft is table stakes. Builds community connection.',
        source: 'Geo-Intelligence',
        tags: ['regional', 'premium'],
        strategy: 'mix-shift',
        coachingPlay: 'They\'re literally IN Deep Ellum. "Your customers will ask for it by name. It\'s a local identity play."',
        marginDelta: 3.4,
      },
      {
        id: 'sug-6c',
        product: 'Blue Moon Belgian White 12pk',
        productId: 'ls-011',
        cases: 3,
        commissionDelta: 11,
        reasoning: 'Crossover appeal for craft cocktail crowd. High margin craft beer with national recognition.',
        source: 'Category Strategy',
        tags: ['premium'],
        strategy: 'mix-shift',
        coachingPlay: 'Bridge pick — "not everyone wants an IPA. Blue Moon is the craft beer for people who don\'t drink craft beer." Safe bet for new venue.',
        marginDelta: 2.6,
      },
    ],
  },

  // ── Stop 7: Fiesta Mart (Chain Drop) ──────────────────
  {
    id: 'stop-7',
    sequence: 7,
    accountName: 'Fiesta Mart',
    type: 'chain-drop',
    arrivalTime: '1:30 PM',
    address: '3535 W Oak Cliff Blvd, Dallas, TX 75211',
    lat: 32.975, lng: -96.855,
    manifest: [
      { productId: 'ls-007', name: 'Corona Extra 24pk', cases: 24, sku: 'COR-EXT-24', promo: 'Cinco de Mayo Special' },
      { productId: 'ls-008', name: 'Modelo Especial 24pk', cases: 24, sku: 'MOD-ESP-24', promo: 'Cinco de Mayo Special' },
      { productId: 'ls-002', name: 'Fireball Cinnamon Whisky 750ml', cases: 6, sku: 'FRB-CIN-750' },
      { productId: 'ls-019', name: 'Tres Agaves Margarita Mix 1L', cases: 8, sku: 'TRS-AGV-MRG', promo: 'Cinco de Mayo Special' },
    ],
    talkingPoints: [
      'Cinco de Mayo end-cap: Corona + Modelo + Margarita Mix bundle',
      'Check planogram compliance from last delivery',
      'Manager interested in weekend sampling events',
    ],
    displayInstructions: 'Build Cinco de Mayo end-cap at front of store. Use POP materials from kit. Stack Corona/Modelo 3-high.',
    history: [
      { date: '2026-03-02', cases: 56, revenue: 1640, notes: 'Solid chain drop, good placement', trend: 'up' },
      { date: '2026-02-23', cases: 48, revenue: 1410, notes: 'Planogram reset', trend: 'flat' },
      { date: '2026-02-16', cases: 52, revenue: 1530, notes: 'Regular delivery', trend: 'flat' },
      { date: '2026-02-09', cases: 60, revenue: 1760, notes: 'Super Bowl feature', trend: 'up' },
    ],
    intelligence: {
      insights: [
        'Hispanic demographic: Corona and Modelo outsell 5:1 vs. domestic',
        'Cinco de Mayo is #2 beer holiday — start building displays now',
        'Store manager approved sampling budget for April',
      ],
      competitiveIntel: 'Modelo is gaining share vs. Corona in this demographic. Push Modelo Especial prominently.',
      contactName: 'Rosa Gutierrez (Dept Manager)',
      contactPhone: '(214) 555-0707',
      tabcStatus: 'verified',
      tabcExpiry: '2027-07-31',
      tabcLicenseNo: 'FM-3535-DAL',
    },
    aiSuggestions: [
      {
        id: 'sug-7a',
        product: 'Patron Silver Tequila 750ml',
        productId: 'ls-005',
        cases: 4,
        commissionDelta: 47,
        reasoning: 'Cinco de Mayo bundle: Patron + Margarita Mix cross-sell. Nielsen: Patron up 55% in this zip.',
        source: 'Nielsen + Seasonal Calendar',
        tags: ['spirits', 'premium'],
        strategy: 'placement',
        coachingPlay: 'Cinco end-cap is already approved. Add Patron to the Corona+Modelo bundle — "complete the display." Rosa will say yes.',
        marginDelta: 2.9,
      },
    ],
  },

  // ── Stop 8: Sam's Discount Liquor (Presell) ──────────
  {
    id: 'stop-8',
    sequence: 8,
    accountName: "Sam's Discount Liquor",
    type: 'presell',
    arrivalTime: '2:30 PM',
    address: '6162 Lemmon Ave, Dallas, TX 75209',
    lat: 33.010, lng: -96.790,
    manifest: [
      { productId: 'ls-002', name: 'Fireball Cinnamon Whisky 750ml', cases: 12, sku: 'FRB-CIN-750' },
      { productId: 'ls-009', name: 'Miller Lite 24pk', cases: 12, sku: 'MIL-LTE-24' },
      { productId: 'ls-010', name: 'Coors Light 24pk', cases: 12, sku: 'CRS-LGT-24' },
      { productId: 'ls-012', name: 'Shiner Bock 12pk', cases: 8, sku: 'SHN-BOC-12' },
    ],
    talkingPoints: [
      'Volume play: hit 44+ cases for tier bump',
      'Fireball is #1 seller — ensure prominent placement',
      'Discuss summer seasonal: Shiner Ruby Redbird pre-order',
    ],
    displayInstructions: 'Stack Fireball floor display near register. Domestic beer in cooler facing.',
    history: [
      { date: '2026-03-02', cases: 40, revenue: 980, notes: 'Close to volume tier — push next visit', trend: 'up' },
      { date: '2026-02-23', cases: 36, revenue: 880, notes: 'Regular order', trend: 'flat' },
      { date: '2026-02-16', cases: 38, revenue: 930, notes: 'Added Shiner to regular', trend: 'up' },
      { date: '2026-02-09', cases: 42, revenue: 1030, notes: 'Fireball promo did well', trend: 'up' },
    ],
    intelligence: {
      insights: [
        'Volume-driven account: price sensitivity high, focus on case deals',
        'Fireball outsells all other spirits 4:1 at this location',
        'Owner responds well to volume tier incentive pitch',
      ],
      competitiveIntel: 'Southern Glazer\'s is pushing Smirnoff at aggressive pricing. Defend Fireball position.',
      contactName: 'Sam Patel (Owner)',
      contactPhone: '(214) 555-0808',
      tabcStatus: 'flagged',
      tabcExpiry: '2026-03-15',
      tabcLicenseNo: 'SD-6162-DAL',
    },
    aiSuggestions: [
      {
        id: 'sug-8a',
        product: 'Fireball Cinnamon Whisky 750ml',
        productId: 'ls-002',
        cases: 6,
        commissionDelta: 15,
        reasoning: 'Push to 50 total cases this delivery → unlocks 4% volume tier. Fireball is guaranteed sell-through.',
        source: 'Tier Optimization + Sales Velocity',
        tags: ['spirits'],
        strategy: 'volume-tier',
        coachingPlay: 'Sam\'s at 44 cases — 6 more hits the tier bump. "Sam, 6 more Fireball gets you to 50 — your price drops next month." Easy yes.',
        marginDelta: 1.2,
      },
      {
        id: 'sug-8b',
        product: 'Revolver Blood & Honey 6pk',
        productId: 'ls-015',
        cases: 4,
        commissionDelta: 10,
        reasoning: 'New product — sampling opportunity. Texas craft is growing 22% YoY in discount segment.',
        source: 'Market Research + New Product Launch',
        tags: ['regional', 'premium'],
        strategy: 'mix-shift',
        coachingPlay: 'Sampling opportunity — "let me leave 4 cases, I\'ll set up a tasting next Saturday." Craft is growing 22% even in discount stores.',
        marginDelta: 3.1,
      },
    ],
  },
];

