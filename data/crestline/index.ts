// data/crestline/index.ts
// Crestline Department Stores — Mock Data

// === TYPES ===

export interface StoreFormat {
  id: string;
  name: string;
  count: number;
  avgRevenue: string;
  avgStaff: number;
  avgASP: number;
  compModel: string;
  color: string;
}

export interface District {
  name: string;
  dm: string;
  stores: number;
  revenue: Record<string, number>;
  quota: number;
  attainment: number;
}

export interface SellingDepartment {
  id: string;
  name: string;
  baseRate: number;
  premiumRate: number;
  color: string;
}

export interface Associate {
  id: string;
  name: string;
  storeId: string;
  district: string;
  format: string;
  achieverTier: 'none' | 'silver' | 'gold' | 'platinum';
  ytdSales: number;
  ytdTarget: number;
  mtdSales: number;
  mtdTarget: number;
  tenure: number;
  department: string;
  // SPH & Draw fields (Nordstrom-style retail comp mechanics)
  hourlyDraw: number;           // $/hr base rate (floor — associate earns whichever is higher)
  scheduledHours: number;       // hours scheduled this period
  sellingHours: number;         // hours on floor actively selling
  sph: number;                  // Sales Per Hour = net sales ÷ selling hours
  mtdReturns: number;           // returns this month (reduce net sales & SPH)
  creditCardSignups: number;    // store credit card referrals this period
}

export interface DrawConfig {
  format: string;
  hourlyDraw: number;           // base hourly rate
  commissionThresholdSPH: number; // SPH needed to "make commission" (beat draw)
  description: string;
}

export interface SphBenchmark {
  department: string;
  floor: number;         // minimum acceptable SPH
  target: number;        // expected SPH
  top10Pct: number;      // top performer SPH
  color: string;
}

export interface Product {
  id: string;
  name: string;
  department: string;
  price: number;
  margin: number;
  category: string;
  tags: string[];
}

export interface CommissionComponent {
  id: string;
  label: string;
  type: 'percent_of' | 'tiered' | 'fixed_per_match' | 'calendar_bonus' | 'carry_forward';
  description: string;
  philStep: number;
}

export interface CalcSnapshot {
  periodId: string;
  periodLabel: string;
  repId: string;
  repName: string;
  components: { componentId: string; label: string; amount: number }[];
  total: number;
  achieverTier: string;
  department: string;
  store: string;
  frozenAt: string;
}

export interface Dispute {
  id: string;
  repName: string;
  periodLabel: string;
  type: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated' | 'denied';
  amount: number;
  description: string;
  filedDate: string;
  resolvedDate?: string;
}

export interface MonthlyRevenue {
  month: string;
  flagship: number;
  standard: number;
  rack: number;
  counter: number;
}

// === CONSTANTS ===

export const BRAND = {
  name: 'Crestline',
  subtitle: 'Department Stores',
  tagline: 'Premium Retail, Intelligent Compensation',
  stores: 200,
  revenue: '$2.8B',
  associates: 3200,
  formats: 4,
  districts: 8,
};

export const COLORS = {
  primary: '#1a1f3d',
  accent: '#c9a84c',
  flagship: '#7c3aed',
  standard: '#2563eb',
  rack: '#059669',
  counter: '#d946ef',
  silver: '#94a3b8',
  gold: '#c9a84c',
  platinum: '#a78bfa',
};

// === FORMATS ===

export const FORMATS: StoreFormat[] = [
  { id: 'flagship', name: 'Flagship', count: 25, avgRevenue: '$8.4M', avgStaff: 45, avgASP: 420, compModel: 'Tiered + Achiever Accelerators', color: COLORS.flagship },
  { id: 'standard', name: 'Standard', count: 100, avgRevenue: '$3.2M', avgStaff: 22, avgASP: 280, compModel: 'Tiered Commission', color: COLORS.standard },
  { id: 'rack', name: 'Rack', count: 50, avgRevenue: '$1.8M', avgStaff: 12, avgASP: 85, compModel: 'Flat + Volume Bonus', color: COLORS.rack },
  { id: 'counter', name: 'Counter', count: 25, avgRevenue: '$1.2M', avgStaff: 6, avgASP: 65, compModel: 'Base + Counter Lead Bonus', color: COLORS.counter },
];

// === DISTRICTS ===

export const DISTRICTS: District[] = [
  { name: 'Northeast', dm: 'Catherine Park', stores: 28, revenue: { flagship: 52, standard: 78, rack: 22, counter: 8 }, quota: 168, attainment: 95 },
  { name: 'Southeast', dm: 'David Chen', stores: 26, revenue: { flagship: 48, standard: 72, rack: 20, counter: 7 }, quota: 155, attainment: 95 },
  { name: 'Midwest', dm: 'Sarah Williams', stores: 24, revenue: { flagship: 38, standard: 64, rack: 18, counter: 6 }, quota: 132, attainment: 95 },
  { name: 'Southwest', dm: 'James Rodriguez', stores: 22, revenue: { flagship: 42, standard: 58, rack: 16, counter: 5 }, quota: 128, attainment: 95 },
  { name: 'Pacific NW', dm: 'Lisa Tanaka', stores: 30, revenue: { flagship: 58, standard: 84, rack: 24, counter: 9 }, quota: 182, attainment: 96 },
  { name: 'Mountain', dm: 'Robert Foster', stores: 18, revenue: { flagship: 28, standard: 48, rack: 14, counter: 4 }, quota: 98, attainment: 96 },
  { name: 'Mid-Atlantic', dm: 'Karen Mitchell', stores: 28, revenue: { flagship: 50, standard: 76, rack: 22, counter: 8 }, quota: 164, attainment: 95 },
  { name: 'Great Lakes', dm: 'Marcus Johnson', stores: 24, revenue: { flagship: 36, standard: 60, rack: 18, counter: 5 }, quota: 124, attainment: 96 },
];

// === SELLING DEPARTMENTS ===

export const SELLING_DEPTS: SellingDepartment[] = [
  { id: 'cosmetics', name: 'Cosmetics & Fragrance', baseRate: 0.06, premiumRate: 0.08, color: '#d946ef' },
  { id: 'designer', name: 'Designer Apparel', baseRate: 0.05, premiumRate: 0.07, color: '#7c3aed' },
  { id: 'shoes', name: 'Shoes', baseRate: 0.045, premiumRate: 0.065, color: '#2563eb' },
  { id: 'accessories', name: 'Accessories & Handbags', baseRate: 0.055, premiumRate: 0.075, color: '#c9a84c' },
  { id: 'home', name: 'Home', baseRate: 0.04, premiumRate: 0.06, color: '#059669' },
];

// === ASSOCIATES ===

export const ASSOCIATES: Associate[] = [
  { id: 'a1', name: 'Elena Vasquez', storeId: 'F-001', district: 'Pacific NW', format: 'flagship', achieverTier: 'platinum', ytdSales: 892000, ytdTarget: 750000, mtdSales: 78000, mtdTarget: 65000, tenure: 8, department: 'designer', hourlyDraw: 20, scheduledHours: 152, sellingHours: 138, sph: 565, mtdReturns: 2340, creditCardSignups: 12 },
  { id: 'a2', name: 'Marcus Chen', storeId: 'F-003', district: 'Northeast', format: 'flagship', achieverTier: 'gold', ytdSales: 745000, ytdTarget: 720000, mtdSales: 62000, mtdTarget: 60000, tenure: 5, department: 'shoes', hourlyDraw: 20, scheduledHours: 148, sellingHours: 130, sph: 477, mtdReturns: 1850, creditCardSignups: 8 },
  { id: 'a3', name: 'Diana Okafor', storeId: 'S-015', district: 'Southeast', format: 'standard', achieverTier: 'silver', ytdSales: 410000, ytdTarget: 380000, mtdSales: 35000, mtdTarget: 32000, tenure: 3, department: 'cosmetics', hourlyDraw: 17, scheduledHours: 140, sellingHours: 118, sph: 297, mtdReturns: 980, creditCardSignups: 6 },
  { id: 'a4', name: 'James Park', storeId: 'F-002', district: 'Mid-Atlantic', format: 'flagship', achieverTier: 'gold', ytdSales: 680000, ytdTarget: 700000, mtdSales: 58000, mtdTarget: 58000, tenure: 6, department: 'accessories', hourlyDraw: 20, scheduledHours: 152, sellingHours: 134, sph: 433, mtdReturns: 2100, creditCardSignups: 9 },
  { id: 'a5', name: 'Sarah Kim', storeId: 'S-042', district: 'Midwest', format: 'standard', achieverTier: 'none', ytdSales: 285000, ytdTarget: 350000, mtdSales: 24000, mtdTarget: 29000, tenure: 1, department: 'home', hourlyDraw: 17, scheduledHours: 120, sellingHours: 92, sph: 261, mtdReturns: 1420, creditCardSignups: 2 },
  { id: 'a6', name: 'Roberto Diaz', storeId: 'R-008', district: 'Southwest', format: 'rack', achieverTier: 'silver', ytdSales: 195000, ytdTarget: 180000, mtdSales: 18000, mtdTarget: 15000, tenure: 4, department: 'shoes', hourlyDraw: 15, scheduledHours: 136, sellingHours: 120, sph: 150, mtdReturns: 640, creditCardSignups: 5 },
  { id: 'a7', name: 'Aisha Thompson', storeId: 'C-005', district: 'Pacific NW', format: 'counter', achieverTier: 'gold', ytdSales: 320000, ytdTarget: 300000, mtdSales: 28000, mtdTarget: 25000, tenure: 7, department: 'cosmetics', hourlyDraw: 18, scheduledHours: 144, sellingHours: 132, sph: 212, mtdReturns: 560, creditCardSignups: 14 },
  { id: 'a8', name: 'Tyler Morrison', storeId: 'S-028', district: 'Great Lakes', format: 'standard', achieverTier: 'none', ytdSales: 310000, ytdTarget: 340000, mtdSales: 26000, mtdTarget: 28000, tenure: 2, department: 'designer', hourlyDraw: 17, scheduledHours: 132, sellingHours: 104, sph: 250, mtdReturns: 1680, creditCardSignups: 3 },
  { id: 'a9', name: 'Priya Sharma', storeId: 'F-005', district: 'Northeast', format: 'flagship', achieverTier: 'platinum', ytdSales: 920000, ytdTarget: 800000, mtdSales: 82000, mtdTarget: 67000, tenure: 10, department: 'accessories', hourlyDraw: 20, scheduledHours: 156, sellingHours: 142, sph: 577, mtdReturns: 1950, creditCardSignups: 11 },
  { id: 'a10', name: 'Chris Nakamura', storeId: 'R-012', district: 'Mountain', format: 'rack', achieverTier: 'none', ytdSales: 145000, ytdTarget: 160000, mtdSales: 12000, mtdTarget: 13000, tenure: 1, department: 'home', hourlyDraw: 15, scheduledHours: 124, sellingHours: 96, sph: 125, mtdReturns: 820, creditCardSignups: 1 },
];

// === PRODUCT CATALOG ===

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Chanel No. 5 Eau de Parfum', department: 'cosmetics', price: 142, margin: 0.62, category: 'fragrance', tags: ['premium', 'gift'] },
  { id: 'p2', name: 'La Mer Moisturizing Cream', department: 'cosmetics', price: 345, margin: 0.68, category: 'skincare', tags: ['premium', 'luxury'] },
  { id: 'p3', name: 'MAC Lipstick Set', department: 'cosmetics', price: 48, margin: 0.55, category: 'makeup', tags: ['counter'] },
  { id: 'p4', name: 'Burberry Trench Coat', department: 'designer', price: 2290, margin: 0.45, category: 'outerwear', tags: ['premium', 'luxury'] },
  { id: 'p5', name: 'Theory Blazer', department: 'designer', price: 495, margin: 0.48, category: 'suiting', tags: ['premium'] },
  { id: 'p6', name: 'Vince Cashmere Sweater', department: 'designer', price: 385, margin: 0.52, category: 'knitwear', tags: ['premium'] },
  { id: 'p7', name: 'Christian Louboutin Pumps', department: 'shoes', price: 795, margin: 0.42, category: 'designer shoes', tags: ['premium', 'luxury'] },
  { id: 'p8', name: 'Cole Haan Oxford', department: 'shoes', price: 180, margin: 0.50, category: 'dress shoes', tags: [] },
  { id: 'p9', name: 'Nike Air Max 90', department: 'shoes', price: 130, margin: 0.40, category: 'athletic', tags: [] },
  { id: 'p10', name: 'UGG Classic Boot', department: 'shoes', price: 180, margin: 0.45, category: 'casual', tags: ['seasonal'] },
  { id: 'p11', name: 'Louis Vuitton Neverfull', department: 'accessories', price: 1960, margin: 0.38, category: 'handbags', tags: ['premium', 'luxury'] },
  { id: 'p12', name: 'Tory Burch Crossbody', department: 'accessories', price: 348, margin: 0.50, category: 'handbags', tags: ['premium'] },
  { id: 'p13', name: 'David Yurman Bracelet', department: 'accessories', price: 650, margin: 0.55, category: 'jewelry', tags: ['premium', 'luxury'] },
  { id: 'p14', name: 'Ray-Ban Aviator', department: 'accessories', price: 163, margin: 0.52, category: 'sunglasses', tags: [] },
  { id: 'p15', name: 'Casper Wave Hybrid', department: 'home', price: 2695, margin: 0.42, category: 'bedding', tags: ['premium'] },
  { id: 'p16', name: 'Le Creuset Dutch Oven', department: 'home', price: 380, margin: 0.48, category: 'kitchen', tags: ['premium', 'gift'] },
  { id: 'p17', name: 'Dyson Airwrap', department: 'home', price: 599, margin: 0.35, category: 'beauty tech', tags: ['premium'] },
  { id: 'p18', name: 'Barefoot Dreams Throw', department: 'home', price: 148, margin: 0.58, category: 'bedding', tags: ['gift'] },
  { id: 'p19', name: 'Jo Malone Candle Set', department: 'cosmetics', price: 195, margin: 0.65, category: 'fragrance', tags: ['gift', 'counter'] },
  { id: 'p20', name: 'Gucci Belt', department: 'accessories', price: 490, margin: 0.40, category: 'accessories', tags: ['premium', 'luxury'] },
];

// === COMMISSION CONFIG (5 streams, Phil steps 2-6) ===

export const COMMISSION_COMPONENTS: CommissionComponent[] = [
  { id: 'basic', label: 'Basic Commission', type: 'percent_of', description: 'Selling dept rate applied to commissionable sales, using merch hierarchy and comp plan as of business date.', philStep: 2 },
  { id: 'premium', label: 'Premium Commission', type: 'tiered', description: 'Additive rate when Achiever threshold is met. Silver 1.5%, Gold 2.5%, Platinum 3.5%.', philStep: 3 },
  { id: 'counter-lead', label: 'Counter Lead Bonus', type: 'calendar_bonus', description: 'Calculated on 4-5-4 retail calendar (not semi-monthly payroll). Based on commissionable sales, line assignment, and individual goals.', philStep: 4 },
  { id: 'scorecard', label: 'Achiever Scorecard', type: 'tiered', description: 'Uses commissionable sales, line assignment, payroll stores, and individual/total sales goals. Includes percentile ranking.', philStep: 5 },
  { id: 'negative-balance', label: 'Negative Balance Carry-Forward', type: 'carry_forward', description: 'Negative commission results accumulate and offset future periods. Requires immutable frozen records.', philStep: 6 },
];

// === ACHIEVER TIERS ===

export const ACHIEVER_TIERS = [
  { id: 'none', label: 'Not Qualified', threshold: 0, additiveRate: 0, color: '#64748b' },
  { id: 'silver', label: 'Silver', threshold: 80, additiveRate: 0.015, color: COLORS.silver },
  { id: 'gold', label: 'Gold', threshold: 100, additiveRate: 0.025, color: COLORS.gold },
  { id: 'platinum', label: 'Platinum', threshold: 120, additiveRate: 0.035, color: COLORS.platinum },
];

// === MONTHLY REVENUE (12 months, $M) ===

export const MONTHLY_REVENUE: MonthlyRevenue[] = [
  { month: 'Mar', flagship: 16.2, standard: 24.8, rack: 7.1, counter: 2.3 },
  { month: 'Apr', flagship: 15.8, standard: 23.5, rack: 6.8, counter: 2.1 },
  { month: 'May', flagship: 17.1, standard: 25.2, rack: 7.4, counter: 2.4 },
  { month: 'Jun', flagship: 16.5, standard: 24.1, rack: 7.0, counter: 2.2 },
  { month: 'Jul', flagship: 15.2, standard: 22.8, rack: 6.5, counter: 2.0 },
  { month: 'Aug', flagship: 18.4, standard: 27.6, rack: 8.2, counter: 2.8 },
  { month: 'Sep', flagship: 17.8, standard: 26.4, rack: 7.8, counter: 2.6 },
  { month: 'Oct', flagship: 16.9, standard: 25.0, rack: 7.2, counter: 2.3 },
  { month: 'Nov', flagship: 22.5, standard: 33.8, rack: 10.2, counter: 3.5 },
  { month: 'Dec', flagship: 28.1, standard: 42.2, rack: 12.8, counter: 4.4 },
  { month: 'Jan', flagship: 14.8, standard: 22.1, rack: 6.2, counter: 1.9 },
  { month: 'Feb', flagship: 15.5, standard: 23.0, rack: 6.6, counter: 2.1 },
];

// === FLOOR ZONES (department store layout) ===

export const FLOOR_ZONES = [
  { id: 'cosmetics', name: 'Cosmetics & Fragrance', x: 10, y: 60, w: 25, h: 35, color: '#d946ef', reps: 3 },
  { id: 'designer', name: 'Designer Apparel', x: 40, y: 10, w: 30, h: 40, color: '#7c3aed', reps: 4 },
  { id: 'shoes', name: 'Shoes', x: 40, y: 55, w: 30, h: 40, color: '#2563eb', reps: 3 },
  { id: 'accessories', name: 'Accessories & Handbags', x: 75, y: 10, w: 20, h: 40, color: '#c9a84c', reps: 2 },
  { id: 'home', name: 'Home', x: 75, y: 55, w: 20, h: 40, color: '#059669', reps: 2 },
];

// === TRANSACTIONS (live feed sample) ===

export const TRANSACTIONS = [
  { time: '2:34 PM', rep: 'Elena Vasquez', items: ['Burberry Trench Coat', 'Gucci Belt'], total: 2780, commission: 153, method: 'Credit' },
  { time: '2:28 PM', rep: 'Aisha Thompson', items: ['Chanel No. 5', 'Jo Malone Candle Set'], total: 337, commission: 22, method: 'Credit' },
  { time: '2:15 PM', rep: 'Marcus Chen', items: ['Christian Louboutin Pumps'], total: 795, commission: 36, method: 'Credit' },
  { time: '2:08 PM', rep: 'Priya Sharma', items: ['Louis Vuitton Neverfull', 'Tory Burch Crossbody'], total: 2308, commission: 138, method: 'Financing' },
  { time: '1:52 PM', rep: 'Diana Okafor', items: ['La Mer Cream', 'MAC Lipstick Set'], total: 393, commission: 24, method: 'Credit' },
  { time: '1:45 PM', rep: 'James Park', items: ['David Yurman Bracelet', 'Ray-Ban Aviator'], total: 813, commission: 47, method: 'Credit' },
  { time: '1:30 PM', rep: 'Tyler Morrison', items: ['Theory Blazer', 'Vince Sweater'], total: 880, commission: 44, method: 'Debit' },
  { time: '1:18 PM', rep: 'Roberto Diaz', items: ['Nike Air Max 90', 'UGG Classic Boot'], total: 310, commission: 14, method: 'Cash' },
  { time: '1:05 PM', rep: 'Sarah Kim', items: ['Le Creuset Dutch Oven', 'Barefoot Dreams Throw'], total: 528, commission: 21, method: 'Credit' },
  { time: '12:48 PM', rep: 'Chris Nakamura', items: ['Dyson Airwrap'], total: 599, commission: 24, method: 'Debit' },
];

// === 4-5-4 RETAIL CALENDAR ===

export const RETAIL_CALENDAR_454 = [
  { period: 'P1', weeks: 4, start: '2026-02-01', end: '2026-02-28', type: 'payroll' as const },
  { period: 'P2', weeks: 5, start: '2026-03-01', end: '2026-04-04', type: 'counter-lead' as const },
  { period: 'P3', weeks: 4, start: '2026-04-05', end: '2026-05-02', type: 'payroll' as const },
  { period: 'P4', weeks: 4, start: '2026-05-03', end: '2026-05-30', type: 'payroll' as const },
  { period: 'P5', weeks: 5, start: '2026-05-31', end: '2026-07-04', type: 'counter-lead' as const },
  { period: 'P6', weeks: 4, start: '2026-07-05', end: '2026-08-01', type: 'payroll' as const },
  { period: 'P7', weeks: 4, start: '2026-08-02', end: '2026-08-29', type: 'payroll' as const },
  { period: 'P8', weeks: 5, start: '2026-08-30', end: '2026-10-03', type: 'counter-lead' as const },
  { period: 'P9', weeks: 4, start: '2026-10-04', end: '2026-10-31', type: 'payroll' as const },
  { period: 'P10', weeks: 4, start: '2026-11-01', end: '2026-11-28', type: 'payroll' as const },
  { period: 'P11', weeks: 5, start: '2026-11-29', end: '2027-01-02', type: 'counter-lead' as const },
  { period: 'P12', weeks: 4, start: '2027-01-03', end: '2027-01-30', type: 'payroll' as const },
];

export const PAYROLL_CALENDAR = [
  { period: 'PP1', start: '2026-02-01', end: '2026-02-15', type: 'semi-monthly' as const },
  { period: 'PP2', start: '2026-02-16', end: '2026-02-28', type: 'semi-monthly' as const },
  { period: 'PP3', start: '2026-03-01', end: '2026-03-15', type: 'semi-monthly' as const },
  { period: 'PP4', start: '2026-03-16', end: '2026-03-31', type: 'semi-monthly' as const },
  { period: 'PP5', start: '2026-04-01', end: '2026-04-15', type: 'semi-monthly' as const },
  { period: 'PP6', start: '2026-04-16', end: '2026-04-30', type: 'semi-monthly' as const },
];

// === RETRO CORRECTION SNAPSHOTS ===

export const CALC_SNAPSHOTS: CalcSnapshot[] = [
  {
    periodId: 'PP3', periodLabel: 'Mar 1-15', repId: 'a1', repName: 'Elena Vasquez',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 3250 },
      { componentId: 'premium', label: 'Premium Commission', amount: 2730 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 450 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 6430, achieverTier: 'platinum', department: 'Designer Apparel', store: 'F-001', frozenAt: '2026-03-16T06:00:00Z',
  },
  {
    periodId: 'PP4', periodLabel: 'Mar 16-31', repId: 'a1', repName: 'Elena Vasquez',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 3480 },
      { componentId: 'premium', label: 'Premium Commission', amount: 2920 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 510 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 6910, achieverTier: 'platinum', department: 'Designer Apparel', store: 'F-001', frozenAt: '2026-04-01T06:00:00Z',
  },
  {
    periodId: 'PP3', periodLabel: 'Mar 1-15 (CORRECTED)', repId: 'a1', repName: 'Elena Vasquez',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 3450 },
      { componentId: 'premium', label: 'Premium Commission', amount: 2900 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 480 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 6830, achieverTier: 'platinum', department: 'Designer Apparel', store: 'F-001', frozenAt: '2026-04-02T14:30:00Z',
  },
];

// === DISPUTES ===

export const DISPUTES: Dispute[] = [
  { id: 'd1', repName: 'Marcus Chen', periodLabel: 'Feb 16-28', type: 'Rate Dispute', status: 'resolved', amount: 245, description: 'Selling dept rate applied at 4.5% instead of 5% after transfer from Home to Shoes mid-period.', filedDate: '2026-03-02', resolvedDate: '2026-03-05' },
  { id: 'd2', repName: 'Elena Vasquez', periodLabel: 'Mar 1-15', type: 'Receipt-Linked Return', status: 'investigating', amount: 380, description: 'Return credited at current dept rate instead of original business date rate per receipt recall policy.', filedDate: '2026-03-18' },
  { id: 'd3', repName: 'Aisha Thompson', periodLabel: 'P2 (4-5-4)', type: 'Counter Lead Bonus', status: 'open', amount: 520, description: 'Counter Lead Bonus not calculated for 5-week period P2. System used semi-monthly calendar instead of 4-5-4.', filedDate: '2026-04-06' },
  { id: 'd4', repName: 'James Park', periodLabel: 'Mar 16-31', type: 'Achiever Tier', status: 'escalated', amount: 1250, description: 'YTD sales crossed Gold threshold on Mar 22 but additive rate not applied until Apr 1. Requesting retro adjustment.', filedDate: '2026-04-02' },
  { id: 'd5', repName: 'Sarah Kim', periodLabel: 'Feb 1-15', type: 'Split Credit', status: 'denied', amount: 85, description: 'Requested full credit for assisted sale. Manager confirmed 50/50 split with Tyler Morrison was correct.', filedDate: '2026-02-18', resolvedDate: '2026-02-22' },
];

// === RTWC ENGINE (pure functions) ===

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  department: string;
  tags: string[];
}

export interface RtwcResult {
  components: { id: string; label: string; amount: number; rate?: number }[];
  total: number;
  currentTier: string;
  nextTier: { label: string; threshold: number; remaining: number } | null;
  // Draw comparison
  drawEarnings: number;      // what the rep would earn at draw rate
  beatsDrawBy: number;       // commission - draw (positive = making commission)
  effectiveSph: number;      // SPH for this sale
}

export interface WhatIfResult {
  baseline: number;
  projected: number;
  delta: number;
  deltaPercent: number;
  componentDeltas: { id: string; label: string; delta: number }[];
  tierCrossed: boolean;
  newTier?: string;
}

export function calculateCommission(items: SaleItem[], rep: Associate): RtwcResult {
  const saleTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const dept = SELLING_DEPTS.find(d => d.id === rep.department);
  const baseRate = dept?.baseRate ?? 0.04;

  const tierInfo = ACHIEVER_TIERS.find(t => t.id === rep.achieverTier);
  const additiveRate = tierInfo?.additiveRate ?? 0;

  const basic = saleTotal * baseRate;
  const premium = saleTotal * additiveRate;
  const counterLead = rep.format === 'counter' ? saleTotal * 0.01 : 0;
  const scorecard = rep.achieverTier !== 'none' ? saleTotal * 0.005 : 0;

  const components = [
    { id: 'basic', label: 'Basic Commission', amount: Math.round(basic * 100) / 100, rate: baseRate },
    { id: 'premium', label: 'Premium (Achiever)', amount: Math.round(premium * 100) / 100, rate: additiveRate },
    { id: 'counter-lead', label: 'Counter Lead Bonus', amount: Math.round(counterLead * 100) / 100, rate: 0.01 },
    { id: 'scorecard', label: 'Scorecard Bonus', amount: Math.round(scorecard * 100) / 100, rate: 0.005 },
  ].filter(c => c.amount > 0);

  const total = components.reduce((s, c) => s + c.amount, 0);
  const nextTierData = ACHIEVER_TIERS.find(t => t.threshold > (tierInfo?.threshold ?? 0));

  // Draw comparison: what would this rep earn at their hourly draw?
  // Assume 1 hour of selling time per sale for RTWC purposes
  const drawEarnings = rep.hourlyDraw;
  const beatsDrawBy = Math.round((total - drawEarnings) * 100) / 100;
  const effectiveSph = saleTotal; // SPH = sale total when selling time is 1 hour

  return {
    components,
    total: Math.round(total * 100) / 100,
    currentTier: rep.achieverTier,
    nextTier: nextTierData ? {
      label: nextTierData.label,
      threshold: nextTierData.threshold,
      remaining: Math.max(0, Math.round(rep.ytdTarget * (nextTierData.threshold / 100) - rep.ytdSales - saleTotal)),
    } : null,
    drawEarnings,
    beatsDrawBy,
    effectiveSph,
  };
}

export function whatIf(items: SaleItem[], rep: Associate): WhatIfResult {
  const baseline = calculateCommission([], rep);
  const projected = calculateCommission(items, rep);

  const componentDeltas = projected.components.map(pc => {
    const bc = baseline.components.find(b => b.id === pc.id);
    return { id: pc.id, label: pc.label, delta: pc.amount - (bc?.amount ?? 0) };
  });

  const tierCrossed = projected.currentTier !== baseline.currentTier;

  return {
    baseline: baseline.total,
    projected: projected.total,
    delta: projected.total - baseline.total,
    deltaPercent: baseline.total > 0 ? (projected.total - baseline.total) / baseline.total : 0,
    componentDeltas,
    tierCrossed,
    newTier: tierCrossed ? projected.currentTier : undefined,
  };
}

// === PRODUCT MIX BY DEPARTMENT ===

export const PRODUCT_MIX = [
  { department: 'Cosmetics & Fragrance', pct: 22, revenue: 616, color: '#d946ef' },
  { department: 'Designer Apparel', pct: 28, revenue: 784, color: '#7c3aed' },
  { department: 'Shoes', pct: 20, revenue: 560, color: '#2563eb' },
  { department: 'Accessories & Handbags', pct: 18, revenue: 504, color: '#c9a84c' },
  { department: 'Home', pct: 12, revenue: 336, color: '#059669' },
];

// === WORKFORCE DATA ===

export const WORKFORCE = {
  flagship: { total: 1125, revenuePerAssoc: 187000, avgTenure: 5.2, turnover: 0.18 },
  standard: { total: 2200, revenuePerAssoc: 145000, avgTenure: 3.8, turnover: 0.24 },
  rack: { total: 600, revenuePerAssoc: 150000, avgTenure: 2.1, turnover: 0.35 },
  counter: { total: 150, revenuePerAssoc: 200000, avgTenure: 6.5, turnover: 0.12 },
};

// === SPIFF PROGRAMS ===

export const SPIFFS = [
  { name: 'Designer Launch SPIFF', amount: 75, trigger: 'New Burberry Spring line — per unit sold', active: true, expires: '2026-04-30' },
  { name: 'Fragrance Gift Set Bonus', amount: 25, trigger: 'Any fragrance gift set over $100', active: true, expires: '2026-03-31' },
  { name: 'Loyalty Sign-Up', amount: 10, trigger: 'New Crestline Rewards enrollment at POS', active: true, expires: null },
];

// === DRAW VS COMMISSION CONFIG (Nordstrom-style) ===

export const DRAW_CONFIG: DrawConfig[] = [
  { format: 'Flagship', hourlyDraw: 20, commissionThresholdSPH: 340, description: 'Draw at $20/hr — commission kicks in when SPH exceeds ~$340 (varies by dept rate)' },
  { format: 'Standard', hourlyDraw: 17, commissionThresholdSPH: 290, description: 'Draw at $17/hr — lower threshold due to lower ASP; commission beats draw above ~$290 SPH' },
  { format: 'Rack', hourlyDraw: 15, commissionThresholdSPH: 375, description: 'Draw at $15/hr — flat rate means higher volume needed; SPH must exceed ~$375 to beat draw' },
  { format: 'Counter', hourlyDraw: 18, commissionThresholdSPH: 300, description: 'Draw at $18/hr — Counter Lead Bonus helps; SPH ~$300 typically crosses threshold' },
];

// === SPH BENCHMARKS BY DEPARTMENT ===

export const SPH_BENCHMARKS: SphBenchmark[] = [
  { department: 'Cosmetics & Fragrance', floor: 180, target: 280, top10Pct: 420, color: '#d946ef' },
  { department: 'Designer Apparel', floor: 250, target: 400, top10Pct: 620, color: '#7c3aed' },
  { department: 'Shoes', floor: 200, target: 340, top10Pct: 520, color: '#2563eb' },
  { department: 'Accessories & Handbags', floor: 220, target: 360, top10Pct: 580, color: '#c9a84c' },
  { department: 'Home', floor: 160, target: 260, top10Pct: 380, color: '#059669' },
];

// === RETURNS DATA (net sales impact) ===

export const RETURNS_IMPACT = {
  mtdGrossSales: 2920000,
  mtdReturns: 91200,
  mtdNetSales: 2828800,
  returnRate: 0.031,
  avgReturnValue: 285,
  topReturnReasons: [
    { reason: 'Fit/Size', pct: 38, color: '#7c3aed' },
    { reason: 'Changed Mind', pct: 24, color: '#2563eb' },
    { reason: 'Defect/Damage', pct: 15, color: '#EF4444' },
    { reason: 'Gift Return', pct: 14, color: '#c9a84c' },
    { reason: 'Other', pct: 9, color: '#94A3B8' },
  ],
  byDepartment: [
    { dept: 'Designer Apparel', grossSales: 817600, returns: 32700, returnRate: 0.040, netImpact: -1635, color: '#7c3aed' },
    { dept: 'Shoes', grossSales: 584000, returns: 22800, returnRate: 0.039, netImpact: -1026, color: '#2563eb' },
    { dept: 'Cosmetics & Fragrance', grossSales: 642400, returns: 12850, returnRate: 0.020, netImpact: -771, color: '#d946ef' },
    { dept: 'Accessories & Handbags', grossSales: 525600, returns: 15770, returnRate: 0.030, netImpact: -867, color: '#c9a84c' },
    { dept: 'Home', grossSales: 350400, returns: 7010, returnRate: 0.020, netImpact: -280, color: '#059669' },
  ],
};

// === CREDIT CARD & LOYALTY METRICS ===

export const LOYALTY_METRICS = {
  mtdSignups: 284,
  targetSignups: 320,
  conversionRate: 0.068,
  avgSpendLoyalty: 842,
  avgSpendNonLoyalty: 485,
  topPerformers: [
    { name: 'Aisha Thompson', signups: 14, store: 'C-005' },
    { name: 'Elena Vasquez', signups: 12, store: 'F-001' },
    { name: 'Priya Sharma', signups: 11, store: 'F-005' },
    { name: 'James Park', signups: 9, store: 'F-002' },
    { name: 'Marcus Chen', signups: 8, store: 'F-003' },
  ],
};

// === SELLING-TIME EFFICIENCY ===

export const SELLING_EFFICIENCY = {
  companyAvg: { sellingPct: 0.78, nonSellingPct: 0.22 },
  byFormat: [
    { format: 'Flagship', sellingPct: 0.82, nonSellingPct: 0.18, avgSph: 480 },
    { format: 'Standard', sellingPct: 0.76, nonSellingPct: 0.24, avgSph: 310 },
    { format: 'Rack', sellingPct: 0.74, nonSellingPct: 0.26, avgSph: 185 },
    { format: 'Counter', sellingPct: 0.88, nonSellingPct: 0.12, avgSph: 240 },
  ],
  nonSellingBreakdown: [
    { activity: 'Restocking/Recovery', pct: 35, color: '#2563eb' },
    { activity: 'POS/Admin', pct: 25, color: '#7c3aed' },
    { activity: 'Training/Meetings', pct: 20, color: '#c9a84c' },
    { activity: 'Breaks', pct: 15, color: '#059669' },
    { activity: 'Other', pct: 5, color: '#94A3B8' },
  ],
};
