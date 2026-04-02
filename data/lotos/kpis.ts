export interface MonthlyKpi {
  month: string;
  unitsSold: number;
  turnRate: number;
  grossPerUnit: number;
  avgDaysToFund: number;
  reconCycleTime: number;
  avgDaysOnLot: number;
  fniPenetration: number;
  totalRevenue: number;
}

export const MONTHLY_KPIS: MonthlyKpi[] = [
  { month: '2025-05', unitsSold: 48, turnRate: 8.2, grossPerUnit: 3800, avgDaysToFund: 6.2, reconCycleTime: 5.8, avgDaysOnLot: 32, fniPenetration: 58, totalRevenue: 182400 },
  { month: '2025-06', unitsSold: 52, turnRate: 8.8, grossPerUnit: 4100, avgDaysToFund: 5.8, reconCycleTime: 5.5, avgDaysOnLot: 30, fniPenetration: 60, totalRevenue: 213200 },
  { month: '2025-07', unitsSold: 55, turnRate: 9.4, grossPerUnit: 4200, avgDaysToFund: 5.5, reconCycleTime: 5.2, avgDaysOnLot: 28, fniPenetration: 62, totalRevenue: 231000 },
  { month: '2025-08', unitsSold: 50, turnRate: 8.5, grossPerUnit: 3900, avgDaysToFund: 5.8, reconCycleTime: 5.4, avgDaysOnLot: 30, fniPenetration: 60, totalRevenue: 195000 },
  { month: '2025-09', unitsSold: 53, turnRate: 9.0, grossPerUnit: 4050, avgDaysToFund: 5.2, reconCycleTime: 4.8, avgDaysOnLot: 27, fniPenetration: 64, totalRevenue: 214650 },
  { month: '2025-10', unitsSold: 56, turnRate: 9.5, grossPerUnit: 4300, avgDaysToFund: 4.8, reconCycleTime: 4.5, avgDaysOnLot: 25, fniPenetration: 66, totalRevenue: 240800 },
  { month: '2025-11', unitsSold: 48, turnRate: 8.2, grossPerUnit: 3700, avgDaysToFund: 5.5, reconCycleTime: 5.0, avgDaysOnLot: 29, fniPenetration: 62, totalRevenue: 177600 },
  { month: '2025-12', unitsSold: 42, turnRate: 7.2, grossPerUnit: 3500, avgDaysToFund: 6.0, reconCycleTime: 5.5, avgDaysOnLot: 34, fniPenetration: 58, totalRevenue: 147000 },
  { month: '2026-01', unitsSold: 45, turnRate: 7.7, grossPerUnit: 3600, avgDaysToFund: 5.8, reconCycleTime: 5.2, avgDaysOnLot: 32, fniPenetration: 60, totalRevenue: 162000 },
  { month: '2026-02', unitsSold: 51, turnRate: 8.7, grossPerUnit: 4000, avgDaysToFund: 5.0, reconCycleTime: 4.6, avgDaysOnLot: 26, fniPenetration: 65, totalRevenue: 204000 },
  { month: '2026-03', unitsSold: 58, turnRate: 9.9, grossPerUnit: 4500, avgDaysToFund: 4.5, reconCycleTime: 4.2, avgDaysOnLot: 24, fniPenetration: 68, totalRevenue: 261000 },
  { month: '2026-04', unitsSold: 15, turnRate: 10.2, grossPerUnit: 4650, avgDaysToFund: 4.2, reconCycleTime: 3.8, avgDaysOnLot: 22, fniPenetration: 70, totalRevenue: 69750 },
];

export const KPI_TARGETS = {
  turnRate: { target: 10, label: 'Turn Rate', unit: 'x/yr' },
  grossPerUnit: { target: 4000, label: 'Gross / Unit', unit: '$' },
  avgDaysToFund: { target: 5, label: 'Days to Fund', unit: 'days', lowerIsBetter: true },
  reconCycleTime: { target: 5, label: 'Recon Cycle', unit: 'days', lowerIsBetter: true },
  avgDaysOnLot: { target: 30, label: 'Avg Days on Lot', unit: 'days', lowerIsBetter: true },
  fniPenetration: { target: 70, label: 'F&I Penetration', unit: '%' },
};
