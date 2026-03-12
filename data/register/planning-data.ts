// data/register/planning-data.ts
import type { FormatId } from './store-data';

export interface ForecastPoint {
  month: string;
  actual: number;
  forecast: number;
  lower: number;
  upper: number;
}

export interface HeadcountRow {
  store: string;
  format: FormatId;
  current: number;
  optimal: number;
  gap: number;
  weekdayNeed: number;
  weekendNeed: number;
}

export interface ShiftBlock {
  id: string;
  rep: string;
  day: string;
  start: number; // hour 0-23
  end: number;
  role: 'floor' | 'lead' | 'closer';
}

export interface StoreTarget {
  store: string;
  format: FormatId;
  monthlyTarget: number;
  ytdActual: number;
  attainment: number;
  trend: 'up' | 'down' | 'flat';
  topCategory: string;
}

export const FORECAST_DATA: Record<FormatId, ForecastPoint[]> = {
  flagship: [
    { month: 'Jan', actual: 4200, forecast: 4100, lower: 3800, upper: 4400 },
    { month: 'Feb', actual: 3800, forecast: 3900, lower: 3600, upper: 4200 },
    { month: 'Mar', actual: 4500, forecast: 4300, lower: 4000, upper: 4600 },
    { month: 'Apr', actual: 4100, forecast: 4200, lower: 3900, upper: 4500 },
    { month: 'May', actual: 5200, forecast: 5000, lower: 4700, upper: 5300 },
    { month: 'Jun', actual: 5800, forecast: 5500, lower: 5200, upper: 5800 },
    { month: 'Jul', actual: 0, forecast: 5200, lower: 4800, upper: 5600 },
    { month: 'Aug', actual: 0, forecast: 4800, lower: 4400, upper: 5200 },
    { month: 'Sep', actual: 0, forecast: 5600, lower: 5200, upper: 6000 },
    { month: 'Oct', actual: 0, forecast: 5100, lower: 4700, upper: 5500 },
    { month: 'Nov', actual: 0, forecast: 6800, lower: 6400, upper: 7200 },
    { month: 'Dec', actual: 0, forecast: 7200, lower: 6800, upper: 7600 },
  ],
  standard: [
    { month: 'Jan', actual: 2800, forecast: 2700, lower: 2400, upper: 3000 },
    { month: 'Feb', actual: 2500, forecast: 2600, lower: 2300, upper: 2900 },
    { month: 'Mar', actual: 3000, forecast: 2900, lower: 2600, upper: 3200 },
    { month: 'Apr', actual: 2700, forecast: 2800, lower: 2500, upper: 3100 },
    { month: 'May', actual: 3500, forecast: 3300, lower: 3000, upper: 3600 },
    { month: 'Jun', actual: 3900, forecast: 3700, lower: 3400, upper: 4000 },
    { month: 'Jul', actual: 0, forecast: 3500, lower: 3100, upper: 3900 },
    { month: 'Aug', actual: 0, forecast: 3200, lower: 2800, upper: 3600 },
    { month: 'Sep', actual: 0, forecast: 3700, lower: 3300, upper: 4100 },
    { month: 'Oct', actual: 0, forecast: 3400, lower: 3000, upper: 3800 },
    { month: 'Nov', actual: 0, forecast: 4500, lower: 4100, upper: 4900 },
    { month: 'Dec', actual: 0, forecast: 4800, lower: 4400, upper: 5200 },
  ],
  outlet: [
    { month: 'Jan', actual: 1800, forecast: 1700, lower: 1500, upper: 1900 },
    { month: 'Feb', actual: 1600, forecast: 1650, lower: 1450, upper: 1850 },
    { month: 'Mar', actual: 1900, forecast: 1800, lower: 1600, upper: 2000 },
    { month: 'Apr', actual: 1750, forecast: 1780, lower: 1580, upper: 1980 },
    { month: 'May', actual: 2200, forecast: 2100, lower: 1900, upper: 2300 },
    { month: 'Jun', actual: 2500, forecast: 2400, lower: 2200, upper: 2600 },
    { month: 'Jul', actual: 0, forecast: 2200, lower: 2000, upper: 2400 },
    { month: 'Aug', actual: 0, forecast: 2000, lower: 1800, upper: 2200 },
    { month: 'Sep', actual: 0, forecast: 2300, lower: 2100, upper: 2500 },
    { month: 'Oct', actual: 0, forecast: 2100, lower: 1900, upper: 2300 },
    { month: 'Nov', actual: 0, forecast: 2800, lower: 2600, upper: 3000 },
    { month: 'Dec', actual: 0, forecast: 3000, lower: 2800, upper: 3200 },
  ],
  'shop-in-shop': [
    { month: 'Jan', actual: 900, forecast: 880, lower: 750, upper: 1010 },
    { month: 'Feb', actual: 820, forecast: 850, lower: 720, upper: 980 },
    { month: 'Mar', actual: 950, forecast: 920, lower: 790, upper: 1050 },
    { month: 'Apr', actual: 880, forecast: 900, lower: 770, upper: 1030 },
    { month: 'May', actual: 1100, forecast: 1050, lower: 920, upper: 1180 },
    { month: 'Jun', actual: 1250, forecast: 1200, lower: 1070, upper: 1330 },
    { month: 'Jul', actual: 0, forecast: 1100, lower: 970, upper: 1230 },
    { month: 'Aug', actual: 0, forecast: 1000, lower: 870, upper: 1130 },
    { month: 'Sep', actual: 0, forecast: 1150, lower: 1020, upper: 1280 },
    { month: 'Oct', actual: 0, forecast: 1050, lower: 920, upper: 1180 },
    { month: 'Nov', actual: 0, forecast: 1400, lower: 1270, upper: 1530 },
    { month: 'Dec', actual: 0, forecast: 1500, lower: 1370, upper: 1630 },
  ],
};

export const HEADCOUNT_DATA: HeadcountRow[] = [
  { store: 'Flagship #12 — Galleria', format: 'flagship', current: 18, optimal: 22, gap: 4, weekdayNeed: 6, weekendNeed: 10 },
  { store: 'Flagship #8 — Midtown', format: 'flagship', current: 16, optimal: 20, gap: 4, weekdayNeed: 5, weekendNeed: 9 },
  { store: 'Standard #45 — Westside', format: 'standard', current: 10, optimal: 12, gap: 2, weekdayNeed: 3, weekendNeed: 6 },
  { store: 'Standard #67 — Lakewood', format: 'standard', current: 11, optimal: 12, gap: 1, weekdayNeed: 3, weekendNeed: 6 },
  { store: 'Outlet #3 — Premium', format: 'outlet', current: 6, optimal: 8, gap: 2, weekdayNeed: 2, weekendNeed: 4 },
  { store: 'Outlet #7 — Clearance', format: 'outlet', current: 5, optimal: 6, gap: 1, weekdayNeed: 2, weekendNeed: 3 },
  { store: 'SiS #14 — Nordstrom', format: 'shop-in-shop', current: 3, optimal: 4, gap: 1, weekdayNeed: 1, weekendNeed: 2 },
  { store: "SiS #22 — Macy's", format: 'shop-in-shop', current: 2, optimal: 3, gap: 1, weekdayNeed: 1, weekendNeed: 2 },
];

export const SHIFT_SCHEDULE: ShiftBlock[] = [
  { id: 's1', rep: 'Casey M.', day: 'Mon', start: 8, end: 16, role: 'floor' },
  { id: 's2', rep: 'Raj P.', day: 'Mon', start: 10, end: 18, role: 'floor' },
  { id: 's3', rep: 'James W.', day: 'Mon', start: 12, end: 20, role: 'closer' },
  { id: 's4', rep: 'Sarah L.', day: 'Mon', start: 8, end: 16, role: 'lead' },
  { id: 's5', rep: 'Casey M.', day: 'Tue', start: 8, end: 16, role: 'floor' },
  { id: 's6', rep: 'Raj P.', day: 'Tue', start: 10, end: 18, role: 'floor' },
  { id: 's7', rep: 'James W.', day: 'Tue', start: 12, end: 20, role: 'closer' },
  { id: 's8', rep: 'Sarah L.', day: 'Tue', start: 8, end: 16, role: 'lead' },
  { id: 's9', rep: 'Casey M.', day: 'Wed', start: 10, end: 18, role: 'floor' },
  { id: 's10', rep: 'Raj P.', day: 'Wed', start: 8, end: 16, role: 'floor' },
  { id: 's11', rep: 'Mike T.', day: 'Wed', start: 12, end: 20, role: 'closer' },
  { id: 's12', rep: 'Sarah L.', day: 'Wed', start: 8, end: 16, role: 'lead' },
  { id: 's13', rep: 'Casey M.', day: 'Thu', start: 8, end: 16, role: 'floor' },
  { id: 's14', rep: 'Raj P.', day: 'Thu', start: 10, end: 18, role: 'floor' },
  { id: 's15', rep: 'James W.', day: 'Thu', start: 8, end: 16, role: 'floor' },
  { id: 's16', rep: 'Sarah L.', day: 'Thu', start: 12, end: 20, role: 'lead' },
  { id: 's17', rep: 'Casey M.', day: 'Fri', start: 10, end: 18, role: 'floor' },
  { id: 's18', rep: 'Raj P.', day: 'Fri', start: 10, end: 18, role: 'floor' },
  { id: 's19', rep: 'James W.', day: 'Fri', start: 12, end: 20, role: 'closer' },
  { id: 's20', rep: 'Sarah L.', day: 'Fri', start: 8, end: 16, role: 'lead' },
  { id: 's21', rep: 'Casey M.', day: 'Sat', start: 9, end: 17, role: 'floor' },
  { id: 's22', rep: 'Raj P.', day: 'Sat', start: 9, end: 17, role: 'floor' },
  { id: 's23', rep: 'James W.', day: 'Sat', start: 9, end: 17, role: 'closer' },
  { id: 's24', rep: 'Mike T.', day: 'Sat', start: 9, end: 17, role: 'floor' },
  { id: 's25', rep: 'Sarah L.', day: 'Sat', start: 9, end: 17, role: 'lead' },
  { id: 's26', rep: 'Anna K.', day: 'Sat', start: 11, end: 19, role: 'floor' },
  { id: 's27', rep: 'Casey M.', day: 'Sun', start: 10, end: 18, role: 'floor' },
  { id: 's28', rep: 'James W.', day: 'Sun', start: 10, end: 18, role: 'closer' },
  { id: 's29', rep: 'Mike T.', day: 'Sun', start: 10, end: 18, role: 'floor' },
  { id: 's30', rep: 'Sarah L.', day: 'Sun', start: 10, end: 18, role: 'lead' },
];

export const STORE_TARGETS: Record<FormatId, StoreTarget[]> = {
  flagship: [
    { store: 'Flagship #12 — Galleria', format: 'flagship', monthlyTarget: 420000, ytdActual: 2380000, attainment: 94, trend: 'up', topCategory: 'Mattresses' },
    { store: 'Flagship #8 — Midtown', format: 'flagship', monthlyTarget: 380000, ytdActual: 2150000, attainment: 94, trend: 'flat', topCategory: 'Adj. Bases' },
    { store: 'Flagship #3 — Downtown', format: 'flagship', monthlyTarget: 350000, ytdActual: 1920000, attainment: 91, trend: 'down', topCategory: 'Mattresses' },
    { store: 'Flagship #15 — Riverside', format: 'flagship', monthlyTarget: 400000, ytdActual: 2500000, attainment: 104, trend: 'up', topCategory: 'Bundles' },
  ],
  standard: [
    { store: 'Standard #45 — Westside', format: 'standard', monthlyTarget: 180000, ytdActual: 1020000, attainment: 94, trend: 'up', topCategory: 'Mattresses' },
    { store: 'Standard #67 — Lakewood', format: 'standard', monthlyTarget: 165000, ytdActual: 880000, attainment: 89, trend: 'down', topCategory: 'Mattresses' },
    { store: 'Standard #23 — Oakdale', format: 'standard', monthlyTarget: 175000, ytdActual: 1050000, attainment: 100, trend: 'up', topCategory: 'Adj. Bases' },
  ],
  outlet: [
    { store: 'Outlet #3 — Premium', format: 'outlet', monthlyTarget: 120000, ytdActual: 680000, attainment: 94, trend: 'flat', topCategory: 'Clearance' },
    { store: 'Outlet #7 — Clearance', format: 'outlet', monthlyTarget: 95000, ytdActual: 510000, attainment: 89, trend: 'down', topCategory: 'Clearance' },
  ],
  'shop-in-shop': [
    { store: 'SiS #14 — Nordstrom', format: 'shop-in-shop', monthlyTarget: 65000, ytdActual: 390000, attainment: 100, trend: 'up', topCategory: 'Premium' },
    { store: "SiS #22 — Macy's", format: 'shop-in-shop', monthlyTarget: 55000, ytdActual: 295000, attainment: 89, trend: 'flat', topCategory: 'Mattresses' },
  ],
};
