export interface CasingProgram {
  section: string;
  size: string;
  depth: number;
  weight: number;
  grade: string;
}

export interface DepthTimePoint {
  day: number;
  depth: number;
  rop: number;
  phase: string;
}

export interface ActiveWell {
  id: string;
  name: string;
  padId: string;
  rigName: string;
  rigContractor: string;
  currentDepth: number;
  targetDepth: number;
  currentPhase: string;
  spudDate: string;
  estimatedTdDate: string;
  avgRop: number;
  currentRop: number;
  mudWeight: number;
  mudType: string;
  casingProgram: CasingProgram[];
  depthTime: DepthTimePoint[];
  timeBreakdown: {
    drilling: number;
    tripping: number;
    casing: number;
    logging: number;
    other: number;
  };
  dailyCost: number;
  totalCostToDate: number;
  authorizedBudget: number;
}

export const ACTIVE_DRILLING: ActiveWell[] = [
  {
    id: 'drill-01',
    name: 'PBR Federal 24-1H',
    padId: 'pad-d',
    rigName: 'Rig 47',
    rigContractor: 'Patterson-UTI',
    currentDepth: 8420,
    targetDepth: 12800,
    currentPhase: 'Lateral — Wolfcamp A',
    spudDate: '2026-02-10',
    estimatedTdDate: '2026-03-18',
    avgRop: 285,
    currentRop: 310,
    mudWeight: 10.2,
    mudType: 'Oil-based mud',
    casingProgram: [
      { section: 'Conductor', size: '20"', depth: 120, weight: 94, grade: 'J-55' },
      { section: 'Surface', size: '13-3/8"', depth: 1800, weight: 68, grade: 'K-55' },
      { section: 'Intermediate', size: '9-5/8"', depth: 5200, weight: 47, grade: 'P-110' },
      { section: 'Production', size: '5-1/2"', depth: 12800, weight: 23, grade: 'P-110' },
    ],
    depthTime: [
      { day: 1, depth: 120, rop: 120, phase: 'Conductor' },
      { day: 2, depth: 480, rop: 180, phase: 'Surface hole' },
      { day: 3, depth: 1200, rop: 240, phase: 'Surface hole' },
      { day: 4, depth: 1800, rop: 200, phase: 'Surface casing' },
      { day: 5, depth: 1800, rop: 0, phase: 'Casing / WOC' },
      { day: 6, depth: 2400, rop: 200, phase: 'Intermediate' },
      { day: 7, depth: 3100, rop: 233, phase: 'Intermediate' },
      { day: 8, depth: 3800, rop: 233, phase: 'Intermediate' },
      { day: 9, depth: 4500, rop: 233, phase: 'Intermediate' },
      { day: 10, depth: 5200, rop: 233, phase: 'Intermediate casing' },
      { day: 11, depth: 5200, rop: 0, phase: 'Casing / WOC' },
      { day: 12, depth: 5500, rop: 100, phase: 'Curve' },
      { day: 13, depth: 5900, rop: 133, phase: 'Curve' },
      { day: 14, depth: 6400, rop: 167, phase: 'Curve' },
      { day: 15, depth: 6900, rop: 167, phase: 'Curve build' },
      { day: 16, depth: 7200, rop: 100, phase: 'Lateral entry' },
      { day: 17, depth: 7500, rop: 300, phase: 'Lateral' },
      { day: 18, depth: 7800, rop: 300, phase: 'Lateral' },
      { day: 19, depth: 8100, rop: 300, phase: 'Lateral' },
      { day: 20, depth: 8420, rop: 320, phase: 'Lateral' },
    ],
    timeBreakdown: {
      drilling: 62,
      tripping: 14,
      casing: 10,
      logging: 6,
      other: 8,
    },
    dailyCost: 82000,
    totalCostToDate: 1640000,
    authorizedBudget: 3200000,
  },
  {
    id: 'drill-02',
    name: 'Rattlesnake 17-1H',
    padId: 'pad-b',
    rigName: 'Rig 22',
    rigContractor: 'Helmerich & Payne',
    currentDepth: 4850,
    targetDepth: 11600,
    currentPhase: 'Intermediate — drilling ahead',
    spudDate: '2026-02-18',
    estimatedTdDate: '2026-03-25',
    avgRop: 248,
    currentRop: 265,
    mudWeight: 9.8,
    mudType: 'Water-based mud',
    casingProgram: [
      { section: 'Conductor', size: '20"', depth: 100, weight: 94, grade: 'J-55' },
      { section: 'Surface', size: '13-3/8"', depth: 1650, weight: 68, grade: 'K-55' },
      { section: 'Intermediate', size: '9-5/8"', depth: 5400, weight: 47, grade: 'P-110' },
      { section: 'Production', size: '5-1/2"', depth: 11600, weight: 23, grade: 'P-110' },
    ],
    depthTime: [
      { day: 1, depth: 100, rop: 100, phase: 'Conductor' },
      { day: 2, depth: 420, rop: 160, phase: 'Surface hole' },
      { day: 3, depth: 1050, rop: 210, phase: 'Surface hole' },
      { day: 4, depth: 1650, rop: 200, phase: 'Surface casing' },
      { day: 5, depth: 1650, rop: 0, phase: 'Casing / WOC' },
      { day: 6, depth: 2200, rop: 183, phase: 'Intermediate' },
      { day: 7, depth: 2800, rop: 200, phase: 'Intermediate' },
      { day: 8, depth: 3400, rop: 200, phase: 'Intermediate' },
      { day: 9, depth: 3950, rop: 183, phase: 'Intermediate' },
      { day: 10, depth: 4350, rop: 133, phase: 'Intermediate' },
      { day: 11, depth: 4600, rop: 250, phase: 'Intermediate' },
      { day: 12, depth: 4850, rop: 250, phase: 'Intermediate' },
    ],
    timeBreakdown: {
      drilling: 58,
      tripping: 16,
      casing: 12,
      logging: 5,
      other: 9,
    },
    dailyCost: 78000,
    totalCostToDate: 936000,
    authorizedBudget: 2800000,
  },
];
