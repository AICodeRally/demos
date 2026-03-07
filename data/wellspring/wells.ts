export type WellStatus = 'flowing' | 'shut-in' | 'workover' | 'new-completion' | 'inactive';
export type LiftType = 'rod-pump' | 'esp' | 'gas-lift' | 'natural-flow';

export interface Well {
  id: string;
  name: string;
  padId: string;
  status: WellStatus;
  liftType: LiftType;
  oilBpd: number;
  gasMcfd: number;
  waterBpd: number;
  waterCut: number;
  lastGauge: string;
  spudDate: string;
  tdDate: string;
  totalDepth: number;
  lateralLength: number;
  targetZone: string;
}

// ---------- Mustang Pad (pad-a) — 18 wells, mature, mostly rod-pump ----------
const mustangWells: Well[] = [
  { id: 'M-01', name: 'Mustang 1-1H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 42, gasMcfd: 78, waterBpd: 31, waterCut: 0.42, lastGauge: '2026-03-03', spudDate: '2019-06-12', tdDate: '2019-07-14', totalDepth: 11240, lateralLength: 7480, targetZone: 'Wolfcamp A' },
  { id: 'M-02', name: 'Mustang 2-1H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 38, gasMcfd: 65, waterBpd: 28, waterCut: 0.42, lastGauge: '2026-03-03', spudDate: '2019-06-18', tdDate: '2019-07-20', totalDepth: 11180, lateralLength: 7450, targetZone: 'Wolfcamp A' },
  { id: 'M-03', name: 'Mustang 3-1H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 51, gasMcfd: 92, waterBpd: 35, waterCut: 0.41, lastGauge: '2026-03-02', spudDate: '2019-07-01', tdDate: '2019-08-03', totalDepth: 11320, lateralLength: 7520, targetZone: 'Wolfcamp A' },
  { id: 'M-04', name: 'Mustang 4-2H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 35, gasMcfd: 58, waterBpd: 26, waterCut: 0.43, lastGauge: '2026-03-03', spudDate: '2019-07-10', tdDate: '2019-08-12', totalDepth: 11400, lateralLength: 7600, targetZone: 'Wolfcamp B' },
  { id: 'M-05', name: 'Mustang 5-2H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 29, gasMcfd: 48, waterBpd: 24, waterCut: 0.45, lastGauge: '2026-03-02', spudDate: '2019-07-22', tdDate: '2019-08-24', totalDepth: 11280, lateralLength: 7500, targetZone: 'Wolfcamp B' },
  { id: 'M-06', name: 'Mustang 6-2H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 44, gasMcfd: 81, waterBpd: 30, waterCut: 0.40, lastGauge: '2026-03-03', spudDate: '2019-08-05', tdDate: '2019-09-08', totalDepth: 11350, lateralLength: 7550, targetZone: 'Wolfcamp A' },
  { id: 'M-07', name: 'Mustang 7-2H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 33, gasMcfd: 55, waterBpd: 22, waterCut: 0.40, lastGauge: '2026-03-01', spudDate: '2019-08-18', tdDate: '2019-09-20', totalDepth: 11200, lateralLength: 7460, targetZone: 'Wolfcamp A' },
  { id: 'M-08', name: 'Mustang 8-2H', padId: 'pad-a', status: 'shut-in', liftType: 'rod-pump', oilBpd: 0, gasMcfd: 0, waterBpd: 0, waterCut: 0.55, lastGauge: '2026-02-20', spudDate: '2019-09-01', tdDate: '2019-10-04', totalDepth: 11150, lateralLength: 7420, targetZone: 'Wolfcamp B' },
  { id: 'M-09', name: 'Mustang 9-2H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 26, gasMcfd: 42, waterBpd: 20, waterCut: 0.43, lastGauge: '2026-03-03', spudDate: '2019-09-15', tdDate: '2019-10-18', totalDepth: 11290, lateralLength: 7490, targetZone: 'Wolfcamp A' },
  { id: 'M-10', name: 'Mustang 10-3H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 31, gasMcfd: 52, waterBpd: 25, waterCut: 0.45, lastGauge: '2026-03-02', spudDate: '2020-01-10', tdDate: '2020-02-12', totalDepth: 11420, lateralLength: 7640, targetZone: 'Wolfcamp A' },
  { id: 'M-11', name: 'Mustang 11-3H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 37, gasMcfd: 63, waterBpd: 27, waterCut: 0.42, lastGauge: '2026-03-03', spudDate: '2020-01-25', tdDate: '2020-02-28', totalDepth: 11380, lateralLength: 7580, targetZone: 'Wolfcamp B' },
  { id: 'M-12', name: 'Mustang 12-3H', padId: 'pad-a', status: 'flowing', liftType: 'esp', oilBpd: 58, gasMcfd: 105, waterBpd: 38, waterCut: 0.40, lastGauge: '2026-03-03', spudDate: '2020-02-08', tdDate: '2020-03-12', totalDepth: 11500, lateralLength: 7700, targetZone: 'Wolfcamp A' },
  { id: 'M-13', name: 'Mustang 13-3H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 24, gasMcfd: 39, waterBpd: 19, waterCut: 0.44, lastGauge: '2026-03-02', spudDate: '2020-02-22', tdDate: '2020-03-26', totalDepth: 11260, lateralLength: 7470, targetZone: 'Wolfcamp B' },
  { id: 'M-14', name: 'Mustang 14-3H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 46, gasMcfd: 84, waterBpd: 32, waterCut: 0.41, lastGauge: '2026-03-03', spudDate: '2020-03-10', tdDate: '2020-04-12', totalDepth: 11340, lateralLength: 7540, targetZone: 'Wolfcamp A' },
  { id: 'M-15', name: 'Mustang 15-3H', padId: 'pad-a', status: 'shut-in', liftType: 'rod-pump', oilBpd: 0, gasMcfd: 0, waterBpd: 0, waterCut: 0.58, lastGauge: '2026-02-15', spudDate: '2020-03-25', tdDate: '2020-04-28', totalDepth: 11180, lateralLength: 7430, targetZone: 'Wolfcamp B' },
  { id: 'M-16', name: 'Mustang 16-3H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 40, gasMcfd: 72, waterBpd: 29, waterCut: 0.42, lastGauge: '2026-03-03', spudDate: '2020-04-08', tdDate: '2020-05-11', totalDepth: 11360, lateralLength: 7560, targetZone: 'Wolfcamp A' },
  { id: 'M-17', name: 'Mustang 17-3H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 28, gasMcfd: 46, waterBpd: 21, waterCut: 0.43, lastGauge: '2026-03-02', spudDate: '2020-04-22', tdDate: '2020-05-25', totalDepth: 11220, lateralLength: 7460, targetZone: 'Wolfcamp B' },
  { id: 'M-18', name: 'Mustang 18-3H', padId: 'pad-a', status: 'flowing', liftType: 'rod-pump', oilBpd: 34, gasMcfd: 57, waterBpd: 25, waterCut: 0.42, lastGauge: '2026-03-03', spudDate: '2020-05-05', tdDate: '2020-06-08', totalDepth: 11300, lateralLength: 7500, targetZone: 'Wolfcamp A' },
];

// ---------- Rattlesnake Pad (pad-b) — 16 wells, mid-life, mix ESP/rod-pump ----------
const rattlesnakeWells: Well[] = [
  { id: 'R-01', name: 'Rattlesnake 1-1H', padId: 'pad-b', status: 'flowing', liftType: 'esp', oilBpd: 72, gasMcfd: 135, waterBpd: 42, waterCut: 0.37, lastGauge: '2026-03-03', spudDate: '2021-03-15', tdDate: '2021-04-18', totalDepth: 11600, lateralLength: 9200, targetZone: 'Wolfcamp A' },
  { id: 'R-02', name: 'Rattlesnake 2-1H', padId: 'pad-b', status: 'flowing', liftType: 'esp', oilBpd: 68, gasMcfd: 128, waterBpd: 40, waterCut: 0.37, lastGauge: '2026-03-03', spudDate: '2021-03-22', tdDate: '2021-04-25', totalDepth: 11580, lateralLength: 9180, targetZone: 'Wolfcamp A' },
  { id: 'R-03', name: 'Rattlesnake 3-1H', padId: 'pad-b', status: 'flowing', liftType: 'rod-pump', oilBpd: 48, gasMcfd: 88, waterBpd: 34, waterCut: 0.41, lastGauge: '2026-03-02', spudDate: '2021-04-05', tdDate: '2021-05-08', totalDepth: 11520, lateralLength: 9100, targetZone: 'Wolfcamp B' },
  { id: 'R-04', name: 'Rattlesnake 4-1H', padId: 'pad-b', status: 'flowing', liftType: 'rod-pump', oilBpd: 45, gasMcfd: 82, waterBpd: 32, waterCut: 0.42, lastGauge: '2026-03-03', spudDate: '2021-04-18', tdDate: '2021-05-21', totalDepth: 11480, lateralLength: 9050, targetZone: 'Wolfcamp B' },
  { id: 'R-05', name: 'Rattlesnake 5-1H', padId: 'pad-b', status: 'flowing', liftType: 'esp', oilBpd: 65, gasMcfd: 122, waterBpd: 38, waterCut: 0.37, lastGauge: '2026-03-03', spudDate: '2021-05-01', tdDate: '2021-06-04', totalDepth: 11640, lateralLength: 9250, targetZone: 'Wolfcamp A' },
  { id: 'R-06', name: 'Rattlesnake 6-2H', padId: 'pad-b', status: 'flowing', liftType: 'rod-pump', oilBpd: 41, gasMcfd: 75, waterBpd: 30, waterCut: 0.42, lastGauge: '2026-03-02', spudDate: '2021-05-15', tdDate: '2021-06-18', totalDepth: 11500, lateralLength: 9080, targetZone: 'Wolfcamp B' },
  { id: 'R-07', name: 'Rattlesnake 7-1H', padId: 'pad-b', status: 'flowing', liftType: 'esp', oilBpd: 61, gasMcfd: 115, waterBpd: 36, waterCut: 0.37, lastGauge: '2026-03-03', spudDate: '2021-05-28', tdDate: '2021-07-01', totalDepth: 11620, lateralLength: 9220, targetZone: 'Wolfcamp A' },
  { id: 'R-08', name: 'Rattlesnake 8-2H', padId: 'pad-b', status: 'flowing', liftType: 'rod-pump', oilBpd: 39, gasMcfd: 70, waterBpd: 29, waterCut: 0.43, lastGauge: '2026-03-02', spudDate: '2021-06-10', tdDate: '2021-07-13', totalDepth: 11460, lateralLength: 9020, targetZone: 'Wolfcamp B' },
  { id: 'R-09', name: 'Rattlesnake 9-2H', padId: 'pad-b', status: 'workover', liftType: 'esp', oilBpd: 0, gasMcfd: 0, waterBpd: 0, waterCut: 0.48, lastGauge: '2026-02-25', spudDate: '2021-06-24', tdDate: '2021-07-27', totalDepth: 11550, lateralLength: 9150, targetZone: 'Wolfcamp A' },
  { id: 'R-10', name: 'Rattlesnake 10-2H', padId: 'pad-b', status: 'flowing', liftType: 'esp', oilBpd: 59, gasMcfd: 108, waterBpd: 35, waterCut: 0.37, lastGauge: '2026-03-03', spudDate: '2021-07-08', tdDate: '2021-08-11', totalDepth: 11610, lateralLength: 9210, targetZone: 'Wolfcamp A' },
  { id: 'R-11', name: 'Rattlesnake 11-2H', padId: 'pad-b', status: 'flowing', liftType: 'rod-pump', oilBpd: 43, gasMcfd: 79, waterBpd: 31, waterCut: 0.42, lastGauge: '2026-03-03', spudDate: '2021-07-22', tdDate: '2021-08-25', totalDepth: 11470, lateralLength: 9040, targetZone: 'Wolfcamp B' },
  { id: 'R-12', name: 'Rattlesnake 12-2H', padId: 'pad-b', status: 'flowing', liftType: 'esp', oilBpd: 55, gasMcfd: 101, waterBpd: 33, waterCut: 0.38, lastGauge: '2026-03-02', spudDate: '2021-08-05', tdDate: '2021-09-08', totalDepth: 11590, lateralLength: 9190, targetZone: 'Wolfcamp A' },
  { id: 'R-13', name: 'Rattlesnake 13-2H', padId: 'pad-b', status: 'flowing', liftType: 'rod-pump', oilBpd: 36, gasMcfd: 62, waterBpd: 27, waterCut: 0.43, lastGauge: '2026-03-03', spudDate: '2021-08-18', tdDate: '2021-09-21', totalDepth: 11440, lateralLength: 9000, targetZone: 'Wolfcamp B' },
  { id: 'R-14', name: 'Rattlesnake 14-2H', padId: 'pad-b', status: 'flowing', liftType: 'esp', oilBpd: 63, gasMcfd: 118, waterBpd: 37, waterCut: 0.37, lastGauge: '2026-03-03', spudDate: '2021-09-01', tdDate: '2021-10-04', totalDepth: 11630, lateralLength: 9230, targetZone: 'Wolfcamp A' },
  { id: 'R-15', name: 'Rattlesnake 15-2H', padId: 'pad-b', status: 'flowing', liftType: 'rod-pump', oilBpd: 40, gasMcfd: 73, waterBpd: 30, waterCut: 0.43, lastGauge: '2026-03-02', spudDate: '2021-09-15', tdDate: '2021-10-18', totalDepth: 11450, lateralLength: 9010, targetZone: 'Wolfcamp B' },
  { id: 'R-16', name: 'Rattlesnake 16-2H', padId: 'pad-b', status: 'flowing', liftType: 'esp', oilBpd: 57, gasMcfd: 104, waterBpd: 34, waterCut: 0.37, lastGauge: '2026-03-03', spudDate: '2021-09-28', tdDate: '2021-11-01', totalDepth: 11600, lateralLength: 9200, targetZone: 'Wolfcamp A' },
];

// ---------- Sidewinder Pad (pad-c) — 14 wells, newer, gas-lift dominant ----------
const sidewinderWells: Well[] = [
  { id: 'S-01', name: 'Sidewinder 1-1H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 95, gasMcfd: 210, waterBpd: 48, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-01-10', tdDate: '2023-02-12', totalDepth: 12100, lateralLength: 10200, targetZone: 'Wolfcamp A' },
  { id: 'S-02', name: 'Sidewinder 2-1H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 88, gasMcfd: 195, waterBpd: 45, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-01-24', tdDate: '2023-02-26', totalDepth: 12050, lateralLength: 10150, targetZone: 'Wolfcamp A' },
  { id: 'S-03', name: 'Sidewinder 3-1H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 92, gasMcfd: 202, waterBpd: 46, waterCut: 0.33, lastGauge: '2026-03-02', spudDate: '2023-02-07', tdDate: '2023-03-12', totalDepth: 12080, lateralLength: 10180, targetZone: 'Wolfcamp A' },
  { id: 'S-04', name: 'Sidewinder 4-1H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 82, gasMcfd: 180, waterBpd: 42, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-02-21', tdDate: '2023-03-26', totalDepth: 12020, lateralLength: 10100, targetZone: 'Wolfcamp B' },
  { id: 'S-05', name: 'Sidewinder 5-2H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 98, gasMcfd: 218, waterBpd: 50, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-03-08', tdDate: '2023-04-10', totalDepth: 12140, lateralLength: 10250, targetZone: 'Wolfcamp A' },
  { id: 'S-06', name: 'Sidewinder 6-2H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 85, gasMcfd: 188, waterBpd: 43, waterCut: 0.34, lastGauge: '2026-03-02', spudDate: '2023-03-22', tdDate: '2023-04-24', totalDepth: 12060, lateralLength: 10160, targetZone: 'Wolfcamp B' },
  { id: 'S-07', name: 'Sidewinder 7-2H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 91, gasMcfd: 200, waterBpd: 47, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-04-05', tdDate: '2023-05-08', totalDepth: 12090, lateralLength: 10190, targetZone: 'Wolfcamp A' },
  { id: 'S-08', name: 'Sidewinder 8-2H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 78, gasMcfd: 172, waterBpd: 40, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-04-18', tdDate: '2023-05-21', totalDepth: 12000, lateralLength: 10080, targetZone: 'Wolfcamp B' },
  { id: 'S-09', name: 'Sidewinder 9-2H', padId: 'pad-c', status: 'flowing', liftType: 'rod-pump', oilBpd: 52, gasMcfd: 95, waterBpd: 35, waterCut: 0.40, lastGauge: '2026-03-02', spudDate: '2023-05-01', tdDate: '2023-06-04', totalDepth: 11900, lateralLength: 9900, targetZone: 'Wolfcamp B' },
  { id: 'S-10', name: 'Sidewinder 10-2H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 87, gasMcfd: 192, waterBpd: 44, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-05-15', tdDate: '2023-06-18', totalDepth: 12070, lateralLength: 10170, targetZone: 'Wolfcamp A' },
  { id: 'S-11', name: 'Sidewinder 11-2H', padId: 'pad-c', status: 'new-completion', liftType: 'gas-lift', oilBpd: 165, gasMcfd: 380, waterBpd: 55, waterCut: 0.25, lastGauge: '2026-03-03', spudDate: '2025-11-01', tdDate: '2025-12-05', totalDepth: 12200, lateralLength: 10400, targetZone: 'Wolfcamp A' },
  { id: 'S-12', name: 'Sidewinder 12-2H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 90, gasMcfd: 198, waterBpd: 46, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-06-01', tdDate: '2023-07-04', totalDepth: 12110, lateralLength: 10220, targetZone: 'Wolfcamp A' },
  { id: 'S-13', name: 'Sidewinder 13-2H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 83, gasMcfd: 184, waterBpd: 43, waterCut: 0.34, lastGauge: '2026-03-02', spudDate: '2023-06-15', tdDate: '2023-07-18', totalDepth: 12040, lateralLength: 10130, targetZone: 'Wolfcamp B' },
  { id: 'S-14', name: 'Sidewinder 14-2H', padId: 'pad-c', status: 'flowing', liftType: 'gas-lift', oilBpd: 94, gasMcfd: 208, waterBpd: 48, waterCut: 0.34, lastGauge: '2026-03-03', spudDate: '2023-06-28', tdDate: '2023-08-01', totalDepth: 12120, lateralLength: 10230, targetZone: 'Wolfcamp A' },
];

// ---------- Diamondback Pad (pad-d) — 12 wells, newest, natural-flow/ESP, high IP ----------
const diamondbackWells: Well[] = [
  { id: 'D-01', name: 'Diamondback 1-1H', padId: 'pad-d', status: 'flowing', liftType: 'natural-flow', oilBpd: 180, gasMcfd: 420, waterBpd: 52, waterCut: 0.22, lastGauge: '2026-03-03', spudDate: '2025-06-01', tdDate: '2025-07-04', totalDepth: 12800, lateralLength: 10800, targetZone: 'Wolfcamp A' },
  { id: 'D-02', name: 'Diamondback 2-1H', padId: 'pad-d', status: 'flowing', liftType: 'natural-flow', oilBpd: 172, gasMcfd: 398, waterBpd: 50, waterCut: 0.23, lastGauge: '2026-03-03', spudDate: '2025-06-15', tdDate: '2025-07-18', totalDepth: 12750, lateralLength: 10750, targetZone: 'Wolfcamp A' },
  { id: 'D-03', name: 'Diamondback 3-1H', padId: 'pad-d', status: 'flowing', liftType: 'natural-flow', oilBpd: 168, gasMcfd: 385, waterBpd: 48, waterCut: 0.22, lastGauge: '2026-03-02', spudDate: '2025-06-28', tdDate: '2025-08-01', totalDepth: 12720, lateralLength: 10700, targetZone: 'Wolfcamp A' },
  { id: 'D-04', name: 'Diamondback 4-2H', padId: 'pad-d', status: 'flowing', liftType: 'esp', oilBpd: 145, gasMcfd: 330, waterBpd: 55, waterCut: 0.28, lastGauge: '2026-03-03', spudDate: '2025-07-10', tdDate: '2025-08-12', totalDepth: 12680, lateralLength: 10650, targetZone: 'Wolfcamp B' },
  { id: 'D-05', name: 'Diamondback 5-2H', padId: 'pad-d', status: 'flowing', liftType: 'natural-flow', oilBpd: 158, gasMcfd: 365, waterBpd: 46, waterCut: 0.23, lastGauge: '2026-03-03', spudDate: '2025-07-22', tdDate: '2025-08-25', totalDepth: 12760, lateralLength: 10760, targetZone: 'Wolfcamp A' },
  { id: 'D-06', name: 'Diamondback 6-2H', padId: 'pad-d', status: 'flowing', liftType: 'esp', oilBpd: 138, gasMcfd: 315, waterBpd: 52, waterCut: 0.27, lastGauge: '2026-03-02', spudDate: '2025-08-05', tdDate: '2025-09-08', totalDepth: 12650, lateralLength: 10600, targetZone: 'Wolfcamp B' },
  { id: 'D-07', name: 'Diamondback 7-2H', padId: 'pad-d', status: 'flowing', liftType: 'natural-flow', oilBpd: 162, gasMcfd: 375, waterBpd: 47, waterCut: 0.22, lastGauge: '2026-03-03', spudDate: '2025-08-18', tdDate: '2025-09-21', totalDepth: 12740, lateralLength: 10720, targetZone: 'Wolfcamp A' },
  { id: 'D-08', name: 'Diamondback 8-2H', padId: 'pad-d', status: 'flowing', liftType: 'esp', oilBpd: 132, gasMcfd: 302, waterBpd: 50, waterCut: 0.27, lastGauge: '2026-03-03', spudDate: '2025-09-01', tdDate: '2025-10-04', totalDepth: 12620, lateralLength: 10580, targetZone: 'Wolfcamp B' },
  { id: 'D-09', name: 'Diamondback 9-2H', padId: 'pad-d', status: 'flowing', liftType: 'natural-flow', oilBpd: 155, gasMcfd: 358, waterBpd: 45, waterCut: 0.22, lastGauge: '2026-03-02', spudDate: '2025-09-15', tdDate: '2025-10-18', totalDepth: 12730, lateralLength: 10710, targetZone: 'Wolfcamp A' },
  { id: 'D-10', name: 'Diamondback 10-2H', padId: 'pad-d', status: 'flowing', liftType: 'esp', oilBpd: 128, gasMcfd: 295, waterBpd: 48, waterCut: 0.27, lastGauge: '2026-03-03', spudDate: '2025-09-28', tdDate: '2025-11-01', totalDepth: 12600, lateralLength: 10560, targetZone: 'Wolfcamp B' },
  { id: 'D-11', name: 'Diamondback 11-2H', padId: 'pad-d', status: 'flowing', liftType: 'natural-flow', oilBpd: 148, gasMcfd: 342, waterBpd: 44, waterCut: 0.23, lastGauge: '2026-03-03', spudDate: '2025-10-10', tdDate: '2025-11-12', totalDepth: 12710, lateralLength: 10690, targetZone: 'Wolfcamp A' },
  { id: 'D-12', name: 'Diamondback 12-2H', padId: 'pad-d', status: 'flowing', liftType: 'esp', oilBpd: 125, gasMcfd: 288, waterBpd: 46, waterCut: 0.27, lastGauge: '2026-03-03', spudDate: '2025-10-22', tdDate: '2025-11-25', totalDepth: 12580, lateralLength: 10540, targetZone: 'Wolfcamp B' },
];

export const WELLS: Well[] = [
  ...mustangWells,
  ...rattlesnakeWells,
  ...sidewinderWells,
  ...diamondbackWells,
];
