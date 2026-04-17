/* ═══════════════════════════════════════════════════════════
   Selling Motion — spatial analytics data
   Think: MLB Statcast × NBA shot charts × Opta heatmaps, applied
   to a retail floor. Layout is a 100×70 grid (SVG viewBox).
   Origin top-left; entry is bottom-right.
   ═══════════════════════════════════════════════════════════ */

export type ZoneId =
  | 'entry' | 'window-display' | 'cloudrest-bay' | 'harmony-bay' | 'essential-bay'
  | 'adj-base-theater' | 'pillow-station' | 'accessories' | 'checkout' | 'back-of-house';

export interface FloorZone {
  id: ZoneId;
  label: string;
  shortLabel: string;
  /** SVG polygon — points in "x,y x,y ..." string, on 100×70 grid */
  polygon: string;
  /** anchor point for labels + rep dot, [x, y] */
  anchor: [number, number];
  kind: 'bay' | 'feature' | 'service' | 'corridor' | 'entry';
  productFocus: string;
}

export const FLOOR_ZONES: FloorZone[] = [
  {
    id: 'entry',
    label: 'Entry & Greeting',
    shortLabel: 'Entry',
    polygon: '78,58 100,58 100,70 78,70',
    anchor: [89, 64],
    kind: 'entry',
    productFocus: 'Greeter script · first impression',
  },
  {
    id: 'window-display',
    label: 'Window Display',
    shortLabel: 'Window',
    polygon: '0,0 100,0 100,6 0,6',
    anchor: [50, 3],
    kind: 'feature',
    productFocus: 'Seasonal headline product',
  },
  {
    id: 'cloudrest-bay',
    label: 'CloudRest Bay — Premium Hybrid',
    shortLabel: 'CloudRest',
    polygon: '4,12 32,12 32,32 4,32',
    anchor: [18, 22],
    kind: 'bay',
    productFocus: 'CloudRest Hybrid (Q/K) · $2,499–$3,299',
  },
  {
    id: 'harmony-bay',
    label: 'Harmony Bay — Memory Foam',
    shortLabel: 'Harmony',
    polygon: '36,12 64,12 64,32 36,32',
    anchor: [50, 22],
    kind: 'bay',
    productFocus: 'Harmony Memory Foam (Q/K) · $1,799–$2,399',
  },
  {
    id: 'essential-bay',
    label: 'Essential Bay — Value Firm',
    shortLabel: 'Essential',
    polygon: '68,12 96,12 96,32 68,32',
    anchor: [82, 22],
    kind: 'bay',
    productFocus: 'Essential / DreamLift · $699–$1,499',
  },
  {
    id: 'adj-base-theater',
    label: 'Adjustable Base Theater',
    shortLabel: 'Adj Base',
    polygon: '54,38 88,38 88,54 54,54',
    anchor: [71, 46],
    kind: 'feature',
    productFocus: 'ErgoMotion Pro · demo bed · $1,499–$1,999',
  },
  {
    id: 'pillow-station',
    label: 'Pillow Station',
    shortLabel: 'Pillow',
    polygon: '4,38 28,38 28,54 4,54',
    anchor: [16, 46],
    kind: 'feature',
    productFocus: 'Premium Pillows · Protectors',
  },
  {
    id: 'accessories',
    label: 'Sheets &amp; Accessories',
    shortLabel: 'Sheets',
    polygon: '32,38 50,38 50,54 32,54',
    anchor: [41, 46],
    kind: 'feature',
    productFocus: 'Sheet sets · Protectors · Frames',
  },
  {
    id: 'checkout',
    label: 'Checkout / POS',
    shortLabel: 'Checkout',
    polygon: '4,58 72,58 72,68 4,68',
    anchor: [38, 63],
    kind: 'service',
    productFocus: 'Close · financing · warranty attach',
  },
  {
    id: 'back-of-house',
    label: 'Back of House',
    shortLabel: 'BOH',
    polygon: '88,38 96,38 96,54 88,54',
    anchor: [92, 46],
    kind: 'corridor',
    productFocus: 'Inventory · training room',
  },
];

export type MotionLens = 'me' | 'team' | 'top';
export type MotionMetric = 'closeRate' | 'attachRate' | 'avgBasket' | 'dwellMin' | 'upsellHit';

/* Numeric range targets for color scaling per metric */
export const METRIC_META: Record<MotionMetric, {
  label: string; unit: string; min: number; max: number; format: (n: number) => string;
}> = {
  closeRate:   { label: 'Close Rate',       unit: '%',   min: 0,   max: 65,   format: (n) => `${n}%` },
  attachRate:  { label: 'Attach Rate',      unit: '%',   min: 0,   max: 80,   format: (n) => `${n}%` },
  avgBasket:   { label: 'Avg Basket',       unit: '$',   min: 400, max: 4000, format: (n) => `$${(n/1000).toFixed(1)}K` },
  dwellMin:    { label: 'Dwell Time',       unit: 'min', min: 1,   max: 12,   format: (n) => `${n} min` },
  upsellHit:   { label: 'Upsell Hit Rate',  unit: '%',   min: 0,   max: 70,   format: (n) => `${n}%` },
};

export const LENS_META: Record<MotionLens, { label: string; accent: string; sublabel: string }> = {
  me:   { label: 'My 30 days',       accent: 'var(--register-primary)', sublabel: 'Casey Miller' },
  team: { label: 'Store average',    accent: 'var(--register-accent)',  sublabel: 'Galleria team (6 reps)' },
  top:  { label: 'Top performer',    accent: 'var(--register-warning)', sublabel: 'Sarah Lin · 142% quota' },
};

/* Zone × metric × lens → value */
export const ZONE_METRICS: Record<MotionLens, Record<MotionMetric, Record<ZoneId, number>>> = {
  me: {
    closeRate:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 47, 'harmony-bay': 28, 'essential-bay': 34, 'adj-base-theater': 41, 'pillow-station': 12, 'accessories': 18, 'checkout': 58, 'back-of-house': 0 },
    attachRate: { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 24, 'harmony-bay': 16, 'essential-bay': 22, 'adj-base-theater': 62, 'pillow-station': 38, 'accessories': 45, 'checkout': 68, 'back-of-house': 0 },
    avgBasket:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 2780, 'harmony-bay': 2100, 'essential-bay': 1180, 'adj-base-theater': 3240, 'pillow-station': 140, 'accessories': 280, 'checkout': 2640, 'back-of-house': 0 },
    dwellMin:   { 'entry': 0.5, 'window-display': 0.3, 'cloudrest-bay': 7, 'harmony-bay': 4, 'essential-bay': 3, 'adj-base-theater': 6, 'pillow-station': 2, 'accessories': 2, 'checkout': 5, 'back-of-house': 0 },
    upsellHit:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 22, 'harmony-bay': 18, 'essential-bay': 30, 'adj-base-theater': 68, 'pillow-station': 10, 'accessories': 40, 'checkout': 55, 'back-of-house': 0 },
  },
  team: {
    closeRate:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 38, 'harmony-bay': 41, 'essential-bay': 36, 'adj-base-theater': 34, 'pillow-station': 22, 'accessories': 24, 'checkout': 52, 'back-of-house': 0 },
    attachRate: { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 28, 'harmony-bay': 34, 'essential-bay': 26, 'adj-base-theater': 52, 'pillow-station': 42, 'accessories': 48, 'checkout': 62, 'back-of-house': 0 },
    avgBasket:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 2540, 'harmony-bay': 2320, 'essential-bay': 1080, 'adj-base-theater': 2980, 'pillow-station': 150, 'accessories': 300, 'checkout': 2480, 'back-of-house': 0 },
    dwellMin:   { 'entry': 0.5, 'window-display': 0.4, 'cloudrest-bay': 5, 'harmony-bay': 6, 'essential-bay': 3, 'adj-base-theater': 5, 'pillow-station': 2, 'accessories': 2, 'checkout': 4, 'back-of-house': 0 },
    upsellHit:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 24, 'harmony-bay': 26, 'essential-bay': 28, 'adj-base-theater': 52, 'pillow-station': 14, 'accessories': 38, 'checkout': 48, 'back-of-house': 0 },
  },
  top: {
    closeRate:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 54, 'harmony-bay': 58, 'essential-bay': 42, 'adj-base-theater': 51, 'pillow-station': 34, 'accessories': 38, 'checkout': 64, 'back-of-house': 0 },
    attachRate: { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 36, 'harmony-bay': 48, 'essential-bay': 34, 'adj-base-theater': 74, 'pillow-station': 64, 'accessories': 72, 'checkout': 78, 'back-of-house': 0 },
    avgBasket:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 3180, 'harmony-bay': 2890, 'essential-bay': 1340, 'adj-base-theater': 3620, 'pillow-station': 180, 'accessories': 360, 'checkout': 3080, 'back-of-house': 0 },
    dwellMin:   { 'entry': 0.4, 'window-display': 0.3, 'cloudrest-bay': 6, 'harmony-bay': 8, 'essential-bay': 2, 'adj-base-theater': 5, 'pillow-station': 3, 'accessories': 2, 'checkout': 4, 'back-of-house': 0 },
    upsellHit:  { 'entry': 0,  'window-display': 0,  'cloudrest-bay': 34, 'harmony-bay': 42, 'essential-bay': 32, 'adj-base-theater': 68, 'pillow-station': 32, 'accessories': 58, 'checkout': 65, 'back-of-house': 0 },
  },
};

/* Baseball-style insight callouts */

export interface MotionInsight {
  id: string;
  headline: string;
  body: string;
  zoneId: ZoneId | null;
  analogy: 'spray' | 'shift' | 'pitch' | 'matchup' | 'pinch';
  impact: 'opportunity' | 'warning' | 'strength';
}

export const MOTION_INSIGHTS: MotionInsight[] = [
  {
    id: 'm-1',
    headline: 'Pillow Station is your cold zone',
    body: 'You close 47% at CloudRest Bay but only 12% at Pillow Station. Move pillow attach to checkout capture — top performers close 34% there because the customer is already committed.',
    zoneId: 'pillow-station',
    analogy: 'spray',
    impact: 'opportunity',
  },
  {
    id: 'm-2',
    headline: 'Shift toward Harmony Bay for lunch traffic',
    body: 'Today 11:30–1:30 traffic concentrates at Harmony Bay (couples shopping together). Top performer Sarah owns this window with 58% close. Position yourself at Harmony start of lunch.',
    zoneId: 'harmony-bay',
    analogy: 'shift',
    impact: 'opportunity',
  },
  {
    id: 'm-3',
    headline: 'Adj Base Theater is your strikeout pitch',
    body: 'ErgoMotion upsell lands 68% when you lead from the Adj Base Theater vs 22% at Checkout. You already win here — protect the cadence.',
    zoneId: 'adj-base-theater',
    analogy: 'pitch',
    impact: 'strength',
  },
  {
    id: 'm-4',
    headline: 'Matchup: Researchers dwell at Harmony',
    body: 'Customers who arrive with phones out (researchers) spend 5× longer at Harmony Memory Foam. Lead with 10-year warranty + trial period — converts 54% vs 28% default script.',
    zoneId: 'harmony-bay',
    analogy: 'matchup',
    impact: 'opportunity',
  },
  {
    id: 'm-5',
    headline: 'Closing at Checkout is leaving money on table',
    body: 'Your last 4 deals all closed at Checkout — avg basket $2,640. Deals closed AT the display average $3,180 because Adj Base + Protector attach sits in the line of sight.',
    zoneId: 'checkout',
    analogy: 'pinch',
    impact: 'warning',
  },
];

export interface MotionEvent {
  ts: string;
  zoneId: ZoneId;
  dwellMin: number;
  outcome: 'closed' | 'browsing' | 'handed-off' | 'lost';
  detail: string;
  value: number | null;
}

export const TODAY_PLAY_BY_PLAY: MotionEvent[] = [
  { ts: '9:42 AM',  zoneId: 'entry',             dwellMin: 0.5, outcome: 'browsing',   detail: 'Greeting — couple, 40s, first visit',                                value: null },
  { ts: '9:43 AM',  zoneId: 'harmony-bay',       dwellMin: 8,   outcome: 'handed-off', detail: 'Couple browsing — handed off to Raj (Spanish-preferred)',           value: null },
  { ts: '10:08 AM', zoneId: 'cloudrest-bay',     dwellMin: 6,   outcome: 'closed',     detail: 'Solo shopper — CloudRest Queen + Protector',                          value: 2648 },
  { ts: '10:15 AM', zoneId: 'checkout',          dwellMin: 4,   outcome: 'closed',     detail: 'Protector attach added at POS — +$10 SPIFF',                         value: 99 },
  { ts: '10:44 AM', zoneId: 'adj-base-theater',  dwellMin: 12,  outcome: 'closed',     detail: 'Couple — ErgoMotion Pro demo, financing',                            value: 1999 },
  { ts: '11:05 AM', zoneId: 'pillow-station',    dwellMin: 3,   outcome: 'lost',       detail: 'Customer left — "just browsing" — no pitch attempted',              value: null },
  { ts: '11:22 AM', zoneId: 'essential-bay',     dwellMin: 4,   outcome: 'closed',     detail: 'DreamLift Firm Queen — price-led buyer',                              value: 1499 },
  { ts: '11:28 AM', zoneId: 'checkout',          dwellMin: 3,   outcome: 'closed',     detail: 'No attach — missed protector + sheets',                              value: null },
  { ts: '12:05 PM', zoneId: 'harmony-bay',       dwellMin: 14,  outcome: 'closed',     detail: 'King Harmony + sheets + pillows — Bundle Bonus hit',                value: 3097 },
  { ts: '12:30 PM', zoneId: 'adj-base-theater',  dwellMin: 9,   outcome: 'browsing',   detail: 'Demo walkthrough — customer taking photos, said will return',      value: null },
  { ts: '1:22 PM',  zoneId: 'adj-base-theater',  dwellMin: 7,   outcome: 'closed',     detail: 'ErgoMotion Adj Base Pro solo — SPIFF hit',                            value: 1999 },
  { ts: '2:47 PM',  zoneId: 'cloudrest-bay',     dwellMin: 11,  outcome: 'closed',     detail: 'Kim Family — Queen Hybrid + Protector',                               value: 2648 },
];

/* Recommended motion — the "defensive shift" */
export interface ShiftRecommendation {
  timeWindow: string;
  suggestedZone: ZoneId;
  reason: string;
  expectedLift: string;
}

export const SHIFT_RECS: ShiftRecommendation[] = [
  { timeWindow: 'Now · 3:00–4:30 PM',   suggestedZone: 'adj-base-theater', reason: 'Afternoon solo shoppers peak here. Demo bed stops walk-bys.',          expectedLift: '+$420 avg basket' },
  { timeWindow: '4:30–6:00 PM',         suggestedZone: 'harmony-bay',      reason: 'Couples shopping after work. Top performer owns this window.',         expectedLift: '+18% close rate' },
  { timeWindow: '6:00–close',           suggestedZone: 'checkout',         reason: 'Last-push attach window. Accessories + warranty at decision point.',   expectedLift: '+$160 attach avg' },
];
