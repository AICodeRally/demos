export interface RevenueItem {
  category: string;
  amount: number;
  color: string;
}

export interface LoeItem {
  category: string;
  amount: number;
  perBoe: number;
}

export interface DeclineCurvePoint {
  month: string;
  actual?: number;
  forecast?: number;
  type: 'actual' | 'forecast';
}

export interface PadEconomics {
  padId: string;
  padName: string;
  grossRevenue: number;
  royalties: number;
  severanceTax: number;
  loe: number;
  netOperatingIncome: number;
  capitalExpended: number;
  irr: number;
  paybackMonths: number;
  boePd: number;
  revenuePerBoe: number;
  loePerBoe: number;
}

// Monthly revenue waterfall (February 2026)
export const REVENUE_WATERFALL: RevenueItem[] = [
  { category: 'Oil Sales', amount: 1842000, color: '#B45309' },
  { category: 'Gas Sales', amount: 384000, color: '#6B7280' },
  { category: 'NGL Sales', amount: 198000, color: '#0D9488' },
  { category: 'Royalties', amount: -605000, color: '#DC2626' },
  { category: 'Severance Tax', amount: -109000, color: '#7C3AED' },
  { category: 'Ad Valorem Tax', amount: -42000, color: '#7C3AED' },
  { category: 'LOE', amount: -492000, color: '#C2A04E' },
  { category: 'Net Operating Income', amount: 1176000, color: '#059669' },
];

// LOE breakdown per month
export const LOE_BREAKDOWN: LoeItem[] = [
  { category: 'Pumping & lifting', amount: 142000, perBoe: 2.56 },
  { category: 'Workover & maintenance', amount: 98000, perBoe: 1.77 },
  { category: 'Chemicals & treating', amount: 52000, perBoe: 0.94 },
  { category: 'Compression', amount: 41000, perBoe: 0.74 },
  { category: 'Water disposal', amount: 68000, perBoe: 1.23 },
  { category: 'Electricity', amount: 38000, perBoe: 0.69 },
  { category: 'Supervision & labor', amount: 32000, perBoe: 0.58 },
  { category: 'Insurance & G&A', amount: 21000, perBoe: 0.38 },
];

// 24-month actuals + 36-month forecast (total field BOE/d)
export const DECLINE_CURVE: DeclineCurvePoint[] = [
  // Actuals (last 24 months)
  { month: '2024-04', actual: 2180, type: 'actual' },
  { month: '2024-05', actual: 2150, type: 'actual' },
  { month: '2024-06', actual: 2120, type: 'actual' },
  { month: '2024-07', actual: 2095, type: 'actual' },
  { month: '2024-08', actual: 2060, type: 'actual' },
  { month: '2024-09', actual: 2035, type: 'actual' },
  { month: '2024-10', actual: 2010, type: 'actual' },
  { month: '2024-11', actual: 1980, type: 'actual' },
  { month: '2024-12', actual: 1955, type: 'actual' },
  { month: '2025-01', actual: 1930, type: 'actual' },
  { month: '2025-02', actual: 1905, type: 'actual' },
  { month: '2025-03', actual: 1885, type: 'actual' },
  { month: '2025-04', actual: 1860, type: 'actual' },
  { month: '2025-05', actual: 1840, type: 'actual' },
  { month: '2025-06', actual: 1920, type: 'actual' }, // Diamondback pad online
  { month: '2025-07', actual: 2050, type: 'actual' },
  { month: '2025-08', actual: 2010, type: 'actual' },
  { month: '2025-09', actual: 1985, type: 'actual' },
  { month: '2025-10', actual: 1960, type: 'actual' },
  { month: '2025-11', actual: 1940, type: 'actual' },
  { month: '2025-12', actual: 1910, type: 'actual' },
  { month: '2026-01', actual: 1880, type: 'actual' },
  { month: '2026-02', actual: 1847, type: 'actual' },
  { month: '2026-03', actual: 1855, type: 'actual' }, // New completion boost
  // Forecast (next 36 months)
  { month: '2026-04', forecast: 1830, type: 'forecast' },
  { month: '2026-05', forecast: 1810, type: 'forecast' },
  { month: '2026-06', forecast: 1785, type: 'forecast' },
  { month: '2026-07', forecast: 1760, type: 'forecast' },
  { month: '2026-08', forecast: 1740, type: 'forecast' },
  { month: '2026-09', forecast: 1715, type: 'forecast' },
  { month: '2026-10', forecast: 1690, type: 'forecast' },
  { month: '2026-11', forecast: 1670, type: 'forecast' },
  { month: '2026-12', forecast: 1650, type: 'forecast' },
  { month: '2027-01', forecast: 1625, type: 'forecast' },
  { month: '2027-02', forecast: 1605, type: 'forecast' },
  { month: '2027-03', forecast: 1585, type: 'forecast' },
  { month: '2027-04', forecast: 1565, type: 'forecast' },
  { month: '2027-05', forecast: 1545, type: 'forecast' },
  { month: '2027-06', forecast: 1525, type: 'forecast' },
  { month: '2027-07', forecast: 1510, type: 'forecast' },
  { month: '2027-08', forecast: 1490, type: 'forecast' },
  { month: '2027-09', forecast: 1475, type: 'forecast' },
  { month: '2027-10', forecast: 1460, type: 'forecast' },
  { month: '2027-11', forecast: 1445, type: 'forecast' },
  { month: '2027-12', forecast: 1430, type: 'forecast' },
  { month: '2028-01', forecast: 1415, type: 'forecast' },
  { month: '2028-02', forecast: 1400, type: 'forecast' },
  { month: '2028-03', forecast: 1385, type: 'forecast' },
  { month: '2028-04', forecast: 1375, type: 'forecast' },
  { month: '2028-05', forecast: 1360, type: 'forecast' },
  { month: '2028-06', forecast: 1345, type: 'forecast' },
  { month: '2028-07', forecast: 1330, type: 'forecast' },
  { month: '2028-08', forecast: 1320, type: 'forecast' },
  { month: '2028-09', forecast: 1305, type: 'forecast' },
  { month: '2028-10', forecast: 1295, type: 'forecast' },
  { month: '2028-11', forecast: 1280, type: 'forecast' },
  { month: '2028-12', forecast: 1270, type: 'forecast' },
  { month: '2029-01', forecast: 1255, type: 'forecast' },
  { month: '2029-02', forecast: 1245, type: 'forecast' },
  { month: '2029-03', forecast: 1235, type: 'forecast' },
];

// Per-pad economics (Feb 2026)
export const PAD_ECONOMICS: PadEconomics[] = [
  {
    padId: 'pad-a',
    padName: 'Mustang Pad',
    grossRevenue: 412000,
    royalties: 103000,
    severanceTax: 19000,
    loe: 148000,
    netOperatingIncome: 142000,
    capitalExpended: 12800000,
    irr: 0.32,
    paybackMonths: 28,
    boePd: 342,
    revenuePerBoe: 40.12,
    loePerBoe: 14.41,
  },
  {
    padId: 'pad-b',
    padName: 'Rattlesnake Pad',
    grossRevenue: 524000,
    royalties: 118000,
    severanceTax: 24000,
    loe: 128000,
    netOperatingIncome: 254000,
    capitalExpended: 14200000,
    irr: 0.38,
    paybackMonths: 24,
    boePd: 468,
    revenuePerBoe: 37.28,
    loePerBoe: 9.11,
  },
  {
    padId: 'pad-c',
    padName: 'Sidewinder Pad',
    grossRevenue: 618000,
    royalties: 124000,
    severanceTax: 28000,
    loe: 112000,
    netOperatingIncome: 354000,
    capitalExpended: 16500000,
    irr: 0.42,
    paybackMonths: 22,
    boePd: 552,
    revenuePerBoe: 37.28,
    loePerBoe: 6.76,
  },
  {
    padId: 'pad-d',
    padName: 'Diamondback Pad',
    grossRevenue: 870000,
    royalties: 163000,
    severanceTax: 39000,
    loe: 104000,
    netOperatingIncome: 564000,
    capitalExpended: 18800000,
    irr: 0.48,
    paybackMonths: 18,
    boePd: 685,
    revenuePerBoe: 42.28,
    loePerBoe: 5.05,
  },
];
