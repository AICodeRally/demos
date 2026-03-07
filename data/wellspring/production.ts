export interface DailyProduction {
  date: string;
  oilBpd: number;
  gasMcfd: number;
  waterBpd: number;
  waterCut: number;
  runtime: number; // hours
}

export interface WellProduction {
  wellId: string;
  wellName: string;
  padId: string;
  history: DailyProduction[];
}

function generateHistory(
  baseOil: number,
  baseGas: number,
  baseWater: number,
  baseWaterCut: number,
  variance: number = 0.08,
): DailyProduction[] {
  const days: DailyProduction[] = [];
  const startDate = new Date('2026-02-02');
  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const oilMult = 1 + (Math.sin(i * 0.3) * variance) + (i % 7 === 0 ? -0.05 : 0);
    const gasMult = 1 + (Math.cos(i * 0.25) * variance);
    const waterMult = 1 + (Math.sin(i * 0.4 + 1) * variance * 0.5);
    const oil = Math.round(baseOil * oilMult);
    const water = Math.round(baseWater * waterMult);
    days.push({
      date: d.toISOString().slice(0, 10),
      oilBpd: oil,
      gasMcfd: Math.round(baseGas * gasMult),
      waterBpd: water,
      waterCut: parseFloat((water / (oil + water)).toFixed(3)),
      runtime: parseFloat((22 + Math.random() * 2).toFixed(1)),
    });
  }
  return days;
}

export const PRODUCTION: WellProduction[] = [
  // Mustang
  { wellId: 'M-01', wellName: 'Mustang 1-1H', padId: 'pad-a', history: generateHistory(42, 78, 31, 0.42) },
  { wellId: 'M-14', wellName: 'Mustang 14-3H', padId: 'pad-a', history: generateHistory(46, 84, 32, 0.41) },
  { wellId: 'M-12', wellName: 'Mustang 12-3H', padId: 'pad-a', history: generateHistory(58, 105, 38, 0.40) },
  // Rattlesnake
  { wellId: 'R-01', wellName: 'Rattlesnake 1-1H', padId: 'pad-b', history: generateHistory(72, 135, 42, 0.37) },
  { wellId: 'R-07', wellName: 'Rattlesnake 7-1H', padId: 'pad-b', history: generateHistory(61, 115, 36, 0.37) },
  // Sidewinder
  { wellId: 'S-01', wellName: 'Sidewinder 1-1H', padId: 'pad-c', history: generateHistory(95, 210, 48, 0.34) },
  { wellId: 'S-05', wellName: 'Sidewinder 5-2H', padId: 'pad-c', history: generateHistory(98, 218, 50, 0.34) },
  { wellId: 'S-11', wellName: 'Sidewinder 11-2H', padId: 'pad-c', history: generateHistory(165, 380, 55, 0.25, 0.12) },
  // Diamondback
  { wellId: 'D-01', wellName: 'Diamondback 1-1H', padId: 'pad-d', history: generateHistory(180, 420, 52, 0.22, 0.06) },
  { wellId: 'D-05', wellName: 'Diamondback 5-2H', padId: 'pad-d', history: generateHistory(158, 365, 46, 0.23, 0.06) },
];
