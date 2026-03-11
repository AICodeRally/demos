// data/proofline/planning.ts
// Lone Star Distribution — Act 2 Sales Strategy Planning Data
// Coverage, quota cascade, roles, commission bands, attainment heatmap, fairness scores

export interface CoverageMetric {
  routeId: string;           // e.g. 'DAL-01'
  hometownId: string;        // e.g. 'dal'
  accountsPerRoute: number;
  revenuePerRoute: number;   // quarterly revenue ($)
  stopsPerDay: number;
  windshieldTimePct: number; // 0-1 scale (e.g. 0.28 = 28%)
  workloadIndex: number;     // 100 = balanced, >115 overloaded, <85 underutilized
  sellingTimePct: number;    // 0-1 scale
  adminTimePct: number;      // 0-1 scale
  drivingTimePct: number;    // 0-1 scale (sellingTime + drivingTime + adminTime = 1.0)
}

export interface CoveragePoint {
  accountId: string;
  accountName: string;
  tier: 'A' | 'B' | 'C' | 'D';
  annualRevenue: number;
  visitsPerMonth: number;
  casesPerMonth: number;
  routeId: string;
  hometownId: string;
  quadrant: 'well-covered' | 'over-served' | 'under-covered' | 'efficient';
}

export interface QuotaNode {
  id: string;
  label: string;
  level: 'company' | 'region' | 'hometown';
  parentId: string | null;
  topDownQuota: number;       // annual target ($)
  bottomUpForecast: number;   // annual bottom-up forecast ($)
  historicalAttainment: number; // trailing 4Q avg (0-1 scale)
  confidenceScore: number;    // 0-100
}

export interface SeasonalWeight {
  month: string;              // 'Jan' through 'Dec'
  weight: number;             // e.g. 0.065 = 6.5% of annual
  rationale: string;
}

export interface RoleDefinition {
  role: 'DSM' | 'KAM' | 'RSR' | 'Merchandiser';
  title: string;
  headcount: number;
  payMix: { base: number; variable: number }; // percentages summing to 100
  ote: number;                // on-target earnings ($)
  baseRange: [number, number]; // [min, max]
  primaryMetric: string;
  secondaryMetrics: string[];
  icon: string;               // lucide icon name
  description: string;
}

export interface CommissionBand {
  minAttainment: number;      // 0-1 scale (e.g. 0.50 = 50%)
  maxAttainment: number;
  rate: number;               // commission rate (e.g. 0.016 = 1.6%)
  multiplier: number;         // earnings multiplier
  label: string;
}

export interface AttainmentCell {
  hometownId: string;
  quarter: string;            // 'Q1-2024' through 'Q4-2025'
  attainment: number | null;  // null for pre-acquisition periods
}

export interface FairnessScore {
  hometownId: string;
  hometownName: string;
  score: number;              // 0-100
  factors: {
    capacity: number;
    growth: number;
    competition: number;
    mix: number;
    tenure: number;
  };
}

// ═══════════════════════════════════════════════════════════
// COVERAGE_METRICS — 36 routes
// ═══════════════════════════════════════════════════════════

export const COVERAGE_METRICS: CoverageMetric[] = [
  // ── Dallas HQ (DAL-01..08) ──
  { routeId: 'DAL-01', hometownId: 'dal', accountsPerRoute: 412, revenuePerRoute: 1263000, stopsPerDay: 18, windshieldTimePct: 0.24, workloadIndex: 112, sellingTimePct: 0.55, adminTimePct: 0.21, drivingTimePct: 0.24 },
  { routeId: 'DAL-02', hometownId: 'dal', accountsPerRoute: 388, revenuePerRoute: 1194000, stopsPerDay: 16, windshieldTimePct: 0.26, workloadIndex: 105, sellingTimePct: 0.52, adminTimePct: 0.22, drivingTimePct: 0.26 },
  { routeId: 'DAL-03', hometownId: 'dal', accountsPerRoute: 362, revenuePerRoute: 1155000, stopsPerDay: 17, windshieldTimePct: 0.25, workloadIndex: 108, sellingTimePct: 0.53, adminTimePct: 0.22, drivingTimePct: 0.25 },
  { routeId: 'DAL-04', hometownId: 'dal', accountsPerRoute: 340, revenuePerRoute: 1236000, stopsPerDay: 19, windshieldTimePct: 0.22, workloadIndex: 115, sellingTimePct: 0.55, adminTimePct: 0.23, drivingTimePct: 0.22 },
  { routeId: 'DAL-05', hometownId: 'dal', accountsPerRoute: 338, revenuePerRoute: 1092000, stopsPerDay: 15, windshieldTimePct: 0.28, workloadIndex: 102, sellingTimePct: 0.50, adminTimePct: 0.22, drivingTimePct: 0.28 },
  { routeId: 'DAL-06', hometownId: 'dal', accountsPerRoute: 390, revenuePerRoute: 1200000, stopsPerDay: 17, windshieldTimePct: 0.23, workloadIndex: 110, sellingTimePct: 0.55, adminTimePct: 0.22, drivingTimePct: 0.23 },
  { routeId: 'DAL-07', hometownId: 'dal', accountsPerRoute: 356, revenuePerRoute: 1038000, stopsPerDay: 16, windshieldTimePct: 0.30, workloadIndex: 104, sellingTimePct: 0.48, adminTimePct: 0.22, drivingTimePct: 0.30 },
  { routeId: 'DAL-08', hometownId: 'dal', accountsPerRoute: 324, revenuePerRoute: 999000, stopsPerDay: 15, windshieldTimePct: 0.27, workloadIndex: 103, sellingTimePct: 0.51, adminTimePct: 0.22, drivingTimePct: 0.27 },

  // ── Allen (ALN-01..06) ──
  { routeId: 'ALN-01', hometownId: 'aln', accountsPerRoute: 310, revenuePerRoute: 862800, stopsPerDay: 15, windshieldTimePct: 0.28, workloadIndex: 100, sellingTimePct: 0.52, adminTimePct: 0.20, drivingTimePct: 0.28 },
  { routeId: 'ALN-02', hometownId: 'aln', accountsPerRoute: 295, revenuePerRoute: 825600, stopsPerDay: 14, windshieldTimePct: 0.30, workloadIndex: 97, sellingTimePct: 0.50, adminTimePct: 0.20, drivingTimePct: 0.30 },
  { routeId: 'ALN-03', hometownId: 'aln', accountsPerRoute: 280, revenuePerRoute: 798000, stopsPerDay: 14, windshieldTimePct: 0.32, workloadIndex: 95, sellingTimePct: 0.48, adminTimePct: 0.20, drivingTimePct: 0.32 },
  { routeId: 'ALN-04', hometownId: 'aln', accountsPerRoute: 268, revenuePerRoute: 780000, stopsPerDay: 13, windshieldTimePct: 0.29, workloadIndex: 96, sellingTimePct: 0.49, adminTimePct: 0.22, drivingTimePct: 0.29 },
  { routeId: 'ALN-05', hometownId: 'aln', accountsPerRoute: 275, revenuePerRoute: 810400, stopsPerDay: 15, windshieldTimePct: 0.25, workloadIndex: 108, sellingTimePct: 0.52, adminTimePct: 0.23, drivingTimePct: 0.25 },
  { routeId: 'ALN-06', hometownId: 'aln', accountsPerRoute: 252, revenuePerRoute: 800000, stopsPerDay: 14, windshieldTimePct: 0.27, workloadIndex: 98, sellingTimePct: 0.51, adminTimePct: 0.22, drivingTimePct: 0.27 },

  // ── Fort Worth (FTW-01..08) ──
  { routeId: 'FTW-01', hometownId: 'ftw', accountsPerRoute: 380, revenuePerRoute: 1116000, stopsPerDay: 17, windshieldTimePct: 0.30, workloadIndex: 108, sellingTimePct: 0.48, adminTimePct: 0.22, drivingTimePct: 0.30 },
  { routeId: 'FTW-02', hometownId: 'ftw', accountsPerRoute: 365, revenuePerRoute: 1080000, stopsPerDay: 16, windshieldTimePct: 0.32, workloadIndex: 105, sellingTimePct: 0.46, adminTimePct: 0.22, drivingTimePct: 0.32 },
  { routeId: 'FTW-03', hometownId: 'ftw', accountsPerRoute: 350, revenuePerRoute: 1044000, stopsPerDay: 16, windshieldTimePct: 0.28, workloadIndex: 102, sellingTimePct: 0.50, adminTimePct: 0.22, drivingTimePct: 0.28 },
  { routeId: 'FTW-04', hometownId: 'ftw', accountsPerRoute: 342, revenuePerRoute: 1020000, stopsPerDay: 15, windshieldTimePct: 0.33, workloadIndex: 100, sellingTimePct: 0.45, adminTimePct: 0.22, drivingTimePct: 0.33 },
  { routeId: 'FTW-05', hometownId: 'ftw', accountsPerRoute: 330, revenuePerRoute: 990000, stopsPerDay: 15, windshieldTimePct: 0.29, workloadIndex: 98, sellingTimePct: 0.49, adminTimePct: 0.22, drivingTimePct: 0.29 },
  { routeId: 'FTW-06', hometownId: 'ftw', accountsPerRoute: 420, revenuePerRoute: 1170000, stopsPerDay: 20, windshieldTimePct: 0.35, workloadIndex: 122, sellingTimePct: 0.43, adminTimePct: 0.22, drivingTimePct: 0.35 },
  { routeId: 'FTW-07', hometownId: 'ftw', accountsPerRoute: 298, revenuePerRoute: 960000, stopsPerDay: 14, windshieldTimePct: 0.31, workloadIndex: 99, sellingTimePct: 0.47, adminTimePct: 0.22, drivingTimePct: 0.31 },
  { routeId: 'FTW-08', hometownId: 'ftw', accountsPerRoute: 296, revenuePerRoute: 897000, stopsPerDay: 14, windshieldTimePct: 0.34, workloadIndex: 98, sellingTimePct: 0.42, adminTimePct: 0.24, drivingTimePct: 0.34 },

  // ── Ennis (ENS-01..04) ──
  { routeId: 'ENS-01', hometownId: 'ens', accountsPerRoute: 285, revenuePerRoute: 624000, stopsPerDay: 12, windshieldTimePct: 0.38, workloadIndex: 92, sellingTimePct: 0.42, adminTimePct: 0.20, drivingTimePct: 0.38 },
  { routeId: 'ENS-02', hometownId: 'ens', accountsPerRoute: 270, revenuePerRoute: 588000, stopsPerDay: 11, windshieldTimePct: 0.40, workloadIndex: 88, sellingTimePct: 0.40, adminTimePct: 0.20, drivingTimePct: 0.40 },
  { routeId: 'ENS-03', hometownId: 'ens', accountsPerRoute: 260, revenuePerRoute: 570000, stopsPerDay: 11, windshieldTimePct: 0.35, workloadIndex: 95, sellingTimePct: 0.44, adminTimePct: 0.21, drivingTimePct: 0.35 },
  { routeId: 'ENS-04', hometownId: 'ens', accountsPerRoute: 245, revenuePerRoute: 552000, stopsPerDay: 10, windshieldTimePct: 0.42, workloadIndex: 85, sellingTimePct: 0.38, adminTimePct: 0.20, drivingTimePct: 0.42 },

  // ── Corpus Christi (CRP-01..06) ──
  { routeId: 'CRP-01', hometownId: 'crp', accountsPerRoute: 320, revenuePerRoute: 900000, stopsPerDay: 15, windshieldTimePct: 0.32, workloadIndex: 102, sellingTimePct: 0.48, adminTimePct: 0.20, drivingTimePct: 0.32 },
  { routeId: 'CRP-02', hometownId: 'crp', accountsPerRoute: 305, revenuePerRoute: 864000, stopsPerDay: 14, windshieldTimePct: 0.34, workloadIndex: 98, sellingTimePct: 0.46, adminTimePct: 0.20, drivingTimePct: 0.34 },
  { routeId: 'CRP-03', hometownId: 'crp', accountsPerRoute: 290, revenuePerRoute: 840000, stopsPerDay: 14, windshieldTimePct: 0.30, workloadIndex: 105, sellingTimePct: 0.48, adminTimePct: 0.22, drivingTimePct: 0.30 },
  { routeId: 'CRP-04', hometownId: 'crp', accountsPerRoute: 278, revenuePerRoute: 810000, stopsPerDay: 13, windshieldTimePct: 0.36, workloadIndex: 95, sellingTimePct: 0.42, adminTimePct: 0.22, drivingTimePct: 0.36 },
  { routeId: 'CRP-05', hometownId: 'crp', accountsPerRoute: 265, revenuePerRoute: 780000, stopsPerDay: 13, windshieldTimePct: 0.38, workloadIndex: 90, sellingTimePct: 0.40, adminTimePct: 0.22, drivingTimePct: 0.38 },
  { routeId: 'CRP-06', hometownId: 'crp', accountsPerRoute: 248, revenuePerRoute: 756000, stopsPerDay: 12, windshieldTimePct: 0.33, workloadIndex: 93, sellingTimePct: 0.45, adminTimePct: 0.22, drivingTimePct: 0.33 },

  // ── Laredo (LAR-01..04) ──
  { routeId: 'LAR-01', hometownId: 'lar', accountsPerRoute: 220, revenuePerRoute: 480000, stopsPerDay: 10, windshieldTimePct: 0.42, workloadIndex: 82, sellingTimePct: 0.38, adminTimePct: 0.20, drivingTimePct: 0.42 },
  { routeId: 'LAR-02', hometownId: 'lar', accountsPerRoute: 205, revenuePerRoute: 444000, stopsPerDay: 9, windshieldTimePct: 0.45, workloadIndex: 78, sellingTimePct: 0.35, adminTimePct: 0.20, drivingTimePct: 0.45 },
  { routeId: 'LAR-03', hometownId: 'lar', accountsPerRoute: 195, revenuePerRoute: 420000, stopsPerDay: 9, windshieldTimePct: 0.40, workloadIndex: 88, sellingTimePct: 0.38, adminTimePct: 0.22, drivingTimePct: 0.40 },
  { routeId: 'LAR-04', hometownId: 'lar', accountsPerRoute: 180, revenuePerRoute: 396000, stopsPerDay: 8, windshieldTimePct: 0.38, workloadIndex: 75, sellingTimePct: 0.40, adminTimePct: 0.22, drivingTimePct: 0.38 },
];

// ═══════════════════════════════════════════════════════════
// COVERAGE_POINTS — 60 representative accounts
// ═══════════════════════════════════════════════════════════

export const COVERAGE_POINTS: CoveragePoint[] = [
  // ── Dallas — 14 accounts ──
  { accountId: 'ACC-DAL-001', accountName: 'Uptown Sports Bar', tier: 'A', annualRevenue: 2400000, visitsPerMonth: 10, casesPerMonth: 820, routeId: 'DAL-01', hometownId: 'dal', quadrant: 'well-covered' },
  { accountId: 'ACC-DAL-002', accountName: 'Deep Ellum Tavern', tier: 'A', annualRevenue: 1800000, visitsPerMonth: 8, casesPerMonth: 640, routeId: 'DAL-01', hometownId: 'dal', quadrant: 'well-covered' },
  { accountId: 'ACC-DAL-003', accountName: 'Bishop Arts Wine Bar', tier: 'B', annualRevenue: 480000, visitsPerMonth: 7, casesPerMonth: 180, routeId: 'DAL-02', hometownId: 'dal', quadrant: 'over-served' },
  { accountId: 'ACC-DAL-004', accountName: 'Knox-Henderson Gastropub', tier: 'A', annualRevenue: 1500000, visitsPerMonth: 3, casesPerMonth: 510, routeId: 'DAL-03', hometownId: 'dal', quadrant: 'under-covered' },
  { accountId: 'ACC-DAL-005', accountName: 'Lakewood Liquor', tier: 'B', annualRevenue: 350000, visitsPerMonth: 4, casesPerMonth: 130, routeId: 'DAL-04', hometownId: 'dal', quadrant: 'efficient' },
  { accountId: 'ACC-DAL-006', accountName: 'Greenville Ave Pub', tier: 'A', annualRevenue: 1200000, visitsPerMonth: 9, casesPerMonth: 440, routeId: 'DAL-05', hometownId: 'dal', quadrant: 'well-covered' },
  { accountId: 'ACC-DAL-007', accountName: 'Lower Greenville Spirits', tier: 'C', annualRevenue: 120000, visitsPerMonth: 5, casesPerMonth: 48, routeId: 'DAL-06', hometownId: 'dal', quadrant: 'over-served' },
  { accountId: 'ACC-DAL-008', accountName: 'Oak Lawn Bistro', tier: 'B', annualRevenue: 520000, visitsPerMonth: 2, casesPerMonth: 195, routeId: 'DAL-07', hometownId: 'dal', quadrant: 'under-covered' },
  { accountId: 'ACC-DAL-009', accountName: 'Mockingbird Station Bar', tier: 'B', annualRevenue: 380000, visitsPerMonth: 5, casesPerMonth: 145, routeId: 'DAL-08', hometownId: 'dal', quadrant: 'efficient' },
  { accountId: 'ACC-DAL-010', accountName: 'Victory Park Lounge', tier: 'A', annualRevenue: 2800000, visitsPerMonth: 12, casesPerMonth: 950, routeId: 'DAL-01', hometownId: 'dal', quadrant: 'well-covered' },
  { accountId: 'ACC-DAL-011', accountName: 'Design District Kitchen', tier: 'C', annualRevenue: 95000, visitsPerMonth: 6, casesPerMonth: 38, routeId: 'DAL-03', hometownId: 'dal', quadrant: 'over-served' },
  { accountId: 'ACC-DAL-012', accountName: 'Preston Hollow Country Club', tier: 'A', annualRevenue: 3200000, visitsPerMonth: 4, casesPerMonth: 1080, routeId: 'DAL-04', hometownId: 'dal', quadrant: 'under-covered' },
  { accountId: 'ACC-DAL-013', accountName: 'SMU Boulevard Cafe', tier: 'C', annualRevenue: 150000, visitsPerMonth: 3, casesPerMonth: 55, routeId: 'DAL-06', hometownId: 'dal', quadrant: 'efficient' },
  { accountId: 'ACC-DAL-014', accountName: 'White Rock Beer Garden', tier: 'B', annualRevenue: 290000, visitsPerMonth: 6, casesPerMonth: 110, routeId: 'DAL-08', hometownId: 'dal', quadrant: 'well-covered' },

  // ── Allen — 9 accounts ──
  { accountId: 'ACC-ALN-001', accountName: 'Allen Premium Outlets Bar', tier: 'A', annualRevenue: 1600000, visitsPerMonth: 9, casesPerMonth: 560, routeId: 'ALN-01', hometownId: 'aln', quadrant: 'well-covered' },
  { accountId: 'ACC-ALN-002', accountName: 'Watters Creek Cantina', tier: 'B', annualRevenue: 420000, visitsPerMonth: 6, casesPerMonth: 160, routeId: 'ALN-02', hometownId: 'aln', quadrant: 'efficient' },
  { accountId: 'ACC-ALN-003', accountName: 'McKinney Wine Room', tier: 'A', annualRevenue: 980000, visitsPerMonth: 3, casesPerMonth: 340, routeId: 'ALN-03', hometownId: 'aln', quadrant: 'under-covered' },
  { accountId: 'ACC-ALN-004', accountName: 'Plano Sports Grill', tier: 'B', annualRevenue: 310000, visitsPerMonth: 8, casesPerMonth: 120, routeId: 'ALN-04', hometownId: 'aln', quadrant: 'over-served' },
  { accountId: 'ACC-ALN-005', accountName: 'Frisco Star Brewery', tier: 'A', annualRevenue: 2100000, visitsPerMonth: 10, casesPerMonth: 720, routeId: 'ALN-05', hometownId: 'aln', quadrant: 'well-covered' },
  { accountId: 'ACC-ALN-006', accountName: 'Prosper Market Liquor', tier: 'C', annualRevenue: 180000, visitsPerMonth: 4, casesPerMonth: 68, routeId: 'ALN-06', hometownId: 'aln', quadrant: 'efficient' },
  { accountId: 'ACC-ALN-007', accountName: 'Legacy West Food Hall', tier: 'A', annualRevenue: 1400000, visitsPerMonth: 8, casesPerMonth: 480, routeId: 'ALN-01', hometownId: 'aln', quadrant: 'well-covered' },
  { accountId: 'ACC-ALN-008', accountName: 'Celina Corner Store', tier: 'D', annualRevenue: 45000, visitsPerMonth: 2, casesPerMonth: 18, routeId: 'ALN-04', hometownId: 'aln', quadrant: 'efficient' },
  { accountId: 'ACC-ALN-009', accountName: 'Anna Gas & Go', tier: 'D', annualRevenue: 28000, visitsPerMonth: 1, casesPerMonth: 12, routeId: 'ALN-06', hometownId: 'aln', quadrant: 'efficient' },

  // ── Fort Worth — 12 accounts ──
  { accountId: 'ACC-FTW-001', accountName: 'Sundance Square Pub', tier: 'A', annualRevenue: 2200000, visitsPerMonth: 11, casesPerMonth: 760, routeId: 'FTW-01', hometownId: 'ftw', quadrant: 'well-covered' },
  { accountId: 'ACC-FTW-002', accountName: 'Stockyards Saloon', tier: 'A', annualRevenue: 1900000, visitsPerMonth: 9, casesPerMonth: 680, routeId: 'FTW-02', hometownId: 'ftw', quadrant: 'well-covered' },
  { accountId: 'ACC-FTW-003', accountName: 'Near Southside Taproom', tier: 'B', annualRevenue: 440000, visitsPerMonth: 7, casesPerMonth: 165, routeId: 'FTW-03', hometownId: 'ftw', quadrant: 'over-served' },
  { accountId: 'ACC-FTW-004', accountName: 'TCU Campus Bar', tier: 'B', annualRevenue: 560000, visitsPerMonth: 2, casesPerMonth: 210, routeId: 'FTW-04', hometownId: 'ftw', quadrant: 'under-covered' },
  { accountId: 'ACC-FTW-005', accountName: 'Clearfork Food Hall', tier: 'A', annualRevenue: 1700000, visitsPerMonth: 7, casesPerMonth: 590, routeId: 'FTW-05', hometownId: 'ftw', quadrant: 'well-covered' },
  { accountId: 'ACC-FTW-006', accountName: 'Westover Hills Market', tier: 'C', annualRevenue: 130000, visitsPerMonth: 6, casesPerMonth: 52, routeId: 'FTW-06', hometownId: 'ftw', quadrant: 'over-served' },
  { accountId: 'ACC-FTW-007', accountName: 'Alliance Town Center Grill', tier: 'B', annualRevenue: 380000, visitsPerMonth: 5, casesPerMonth: 140, routeId: 'FTW-07', hometownId: 'ftw', quadrant: 'efficient' },
  { accountId: 'ACC-FTW-008', accountName: 'Burleson Country Store', tier: 'D', annualRevenue: 55000, visitsPerMonth: 2, casesPerMonth: 22, routeId: 'FTW-08', hometownId: 'ftw', quadrant: 'efficient' },
  { accountId: 'ACC-FTW-009', accountName: 'Magnolia Avenue Wine Bar', tier: 'A', annualRevenue: 850000, visitsPerMonth: 3, casesPerMonth: 290, routeId: 'FTW-03', hometownId: 'ftw', quadrant: 'under-covered' },
  { accountId: 'ACC-FTW-010', accountName: 'Ridglea Hills Liquor', tier: 'C', annualRevenue: 200000, visitsPerMonth: 4, casesPerMonth: 78, routeId: 'FTW-05', hometownId: 'ftw', quadrant: 'efficient' },
  { accountId: 'ACC-FTW-011', accountName: 'Weatherford Rd Tavern', tier: 'D', annualRevenue: 38000, visitsPerMonth: 3, casesPerMonth: 15, routeId: 'FTW-07', hometownId: 'ftw', quadrant: 'over-served' },
  { accountId: 'ACC-FTW-012', accountName: 'Keller Town Center Bar', tier: 'B', annualRevenue: 470000, visitsPerMonth: 6, casesPerMonth: 175, routeId: 'FTW-01', hometownId: 'ftw', quadrant: 'well-covered' },

  // ── Ennis — 7 accounts ──
  { accountId: 'ACC-ENS-001', accountName: 'Ennis Main Street Grill', tier: 'B', annualRevenue: 340000, visitsPerMonth: 6, casesPerMonth: 130, routeId: 'ENS-01', hometownId: 'ens', quadrant: 'well-covered' },
  { accountId: 'ACC-ENS-002', accountName: 'Waxahachie Town Pub', tier: 'B', annualRevenue: 280000, visitsPerMonth: 5, casesPerMonth: 105, routeId: 'ENS-02', hometownId: 'ens', quadrant: 'efficient' },
  { accountId: 'ACC-ENS-003', accountName: 'Corsicana Depot Tavern', tier: 'C', annualRevenue: 160000, visitsPerMonth: 3, casesPerMonth: 62, routeId: 'ENS-03', hometownId: 'ens', quadrant: 'efficient' },
  { accountId: 'ACC-ENS-004', accountName: 'Midlothian Family Market', tier: 'D', annualRevenue: 65000, visitsPerMonth: 2, casesPerMonth: 25, routeId: 'ENS-04', hometownId: 'ens', quadrant: 'efficient' },
  { accountId: 'ACC-ENS-005', accountName: 'Cedar Hill Sports Bar', tier: 'A', annualRevenue: 720000, visitsPerMonth: 4, casesPerMonth: 260, routeId: 'ENS-01', hometownId: 'ens', quadrant: 'under-covered' },
  { accountId: 'ACC-ENS-006', accountName: 'Italy Country Store', tier: 'D', annualRevenue: 32000, visitsPerMonth: 4, casesPerMonth: 14, routeId: 'ENS-03', hometownId: 'ens', quadrant: 'over-served' },
  { accountId: 'ACC-ENS-007', accountName: 'Red Oak Convenience Plus', tier: 'C', annualRevenue: 110000, visitsPerMonth: 3, casesPerMonth: 42, routeId: 'ENS-02', hometownId: 'ens', quadrant: 'well-covered' },

  // ── Corpus Christi — 10 accounts ──
  { accountId: 'ACC-CRP-001', accountName: 'North Beach Resort Bar', tier: 'A', annualRevenue: 1800000, visitsPerMonth: 10, casesPerMonth: 620, routeId: 'CRP-01', hometownId: 'crp', quadrant: 'well-covered' },
  { accountId: 'ACC-CRP-002', accountName: 'Shoreline Blvd Cantina', tier: 'A', annualRevenue: 1300000, visitsPerMonth: 8, casesPerMonth: 450, routeId: 'CRP-02', hometownId: 'crp', quadrant: 'well-covered' },
  { accountId: 'ACC-CRP-003', accountName: 'Padre Island Surf Shop Bar', tier: 'B', annualRevenue: 480000, visitsPerMonth: 3, casesPerMonth: 180, routeId: 'CRP-03', hometownId: 'crp', quadrant: 'under-covered' },
  { accountId: 'ACC-CRP-004', accountName: 'Port Aransas Marina Grill', tier: 'A', annualRevenue: 950000, visitsPerMonth: 2, casesPerMonth: 330, routeId: 'CRP-04', hometownId: 'crp', quadrant: 'under-covered' },
  { accountId: 'ACC-CRP-005', accountName: 'Flour Bluff Package Store', tier: 'C', annualRevenue: 140000, visitsPerMonth: 5, casesPerMonth: 55, routeId: 'CRP-05', hometownId: 'crp', quadrant: 'over-served' },
  { accountId: 'ACC-CRP-006', accountName: 'Calallen Market', tier: 'D', annualRevenue: 48000, visitsPerMonth: 2, casesPerMonth: 20, routeId: 'CRP-06', hometownId: 'crp', quadrant: 'efficient' },
  { accountId: 'ACC-CRP-007', accountName: 'Staples St Sports Bar', tier: 'B', annualRevenue: 360000, visitsPerMonth: 6, casesPerMonth: 135, routeId: 'CRP-01', hometownId: 'crp', quadrant: 'well-covered' },
  { accountId: 'ACC-CRP-008', accountName: 'Robstown Junction Pub', tier: 'C', annualRevenue: 85000, visitsPerMonth: 4, casesPerMonth: 34, routeId: 'CRP-04', hometownId: 'crp', quadrant: 'over-served' },
  { accountId: 'ACC-CRP-009', accountName: 'Agua Dulce Gas & Go', tier: 'D', annualRevenue: 22000, visitsPerMonth: 1, casesPerMonth: 9, routeId: 'CRP-06', hometownId: 'crp', quadrant: 'efficient' },
  { accountId: 'ACC-CRP-010', accountName: 'Portland Bay Bistro', tier: 'B', annualRevenue: 410000, visitsPerMonth: 5, casesPerMonth: 155, routeId: 'CRP-02', hometownId: 'crp', quadrant: 'efficient' },

  // ── Laredo — 8 accounts ──
  { accountId: 'ACC-LAR-001', accountName: 'San Bernardo Ave Cantina', tier: 'A', annualRevenue: 680000, visitsPerMonth: 7, casesPerMonth: 240, routeId: 'LAR-01', hometownId: 'lar', quadrant: 'well-covered' },
  { accountId: 'ACC-LAR-002', accountName: 'Mall del Norte Food Court', tier: 'B', annualRevenue: 320000, visitsPerMonth: 5, casesPerMonth: 120, routeId: 'LAR-02', hometownId: 'lar', quadrant: 'well-covered' },
  { accountId: 'ACC-LAR-003', accountName: 'Mines Road Truck Stop', tier: 'C', annualRevenue: 170000, visitsPerMonth: 2, casesPerMonth: 65, routeId: 'LAR-03', hometownId: 'lar', quadrant: 'under-covered' },
  { accountId: 'ACC-LAR-004', accountName: 'Nuevo Laredo Bridge Market', tier: 'D', annualRevenue: 75000, visitsPerMonth: 3, casesPerMonth: 28, routeId: 'LAR-04', hometownId: 'lar', quadrant: 'efficient' },
  { accountId: 'ACC-LAR-005', accountName: 'Zaragoza Plaza Spirits', tier: 'B', annualRevenue: 250000, visitsPerMonth: 6, casesPerMonth: 95, routeId: 'LAR-01', hometownId: 'lar', quadrant: 'over-served' },
  { accountId: 'ACC-LAR-006', accountName: 'Laredo Energy Arena Bar', tier: 'A', annualRevenue: 520000, visitsPerMonth: 3, casesPerMonth: 185, routeId: 'LAR-02', hometownId: 'lar', quadrant: 'under-covered' },
  { accountId: 'ACC-LAR-007', accountName: 'Rio Bravo Junction', tier: 'D', annualRevenue: 18000, visitsPerMonth: 1, casesPerMonth: 8, routeId: 'LAR-03', hometownId: 'lar', quadrant: 'efficient' },
  { accountId: 'ACC-LAR-008', accountName: 'Webb County Fairgrounds', tier: 'C', annualRevenue: 98000, visitsPerMonth: 4, casesPerMonth: 38, routeId: 'LAR-04', hometownId: 'lar', quadrant: 'efficient' },
];

// ═══════════════════════════════════════════════════════════
// QUOTA_NODES — 9 nodes (company + 2 regions + 6 hometowns)
// ═══════════════════════════════════════════════════════════

export const QUOTA_NODES: QuotaNode[] = [
  { id: 'company',  label: 'Lone Star Distribution', level: 'company',  parentId: null,       topDownQuota: 44800000, bottomUpForecast: 43520000, historicalAttainment: 0.97, confidenceScore: 85 },
  { id: 'north-tx', label: 'North Texas',            level: 'region',   parentId: 'company',  topDownQuota: 32704000, bottomUpForecast: 31750000, historicalAttainment: 0.98, confidenceScore: 88 },
  { id: 'south-tx', label: 'South Texas',            level: 'region',   parentId: 'company',  topDownQuota: 12096000, bottomUpForecast: 11770000, historicalAttainment: 0.94, confidenceScore: 78 },
  { id: 'dal',      label: 'Dallas HQ',              level: 'hometown', parentId: 'north-tx', topDownQuota: 12800000, bottomUpForecast: 12400000, historicalAttainment: 1.01, confidenceScore: 92 },
  { id: 'aln',      label: 'Allen',                  level: 'hometown', parentId: 'north-tx', topDownQuota: 8200000,  bottomUpForecast: 7950000,  historicalAttainment: 0.99, confidenceScore: 90 },
  { id: 'ftw',      label: 'Fort Worth',             level: 'hometown', parentId: 'north-tx', topDownQuota: 8500000,  bottomUpForecast: 8300000,  historicalAttainment: 0.97, confidenceScore: 86 },
  { id: 'ens',      label: 'Ennis',                  level: 'hometown', parentId: 'north-tx', topDownQuota: 3204000,  bottomUpForecast: 3100000,  historicalAttainment: 0.93, confidenceScore: 80 },
  { id: 'crp',      label: 'Corpus Christi',         level: 'hometown', parentId: 'south-tx', topDownQuota: 8896000,  bottomUpForecast: 8600000,  historicalAttainment: 0.95, confidenceScore: 82 },
  { id: 'lar',      label: 'Laredo',                 level: 'hometown', parentId: 'south-tx', topDownQuota: 3200000,  bottomUpForecast: 1700000,  historicalAttainment: 0.82, confidenceScore: 47 },
];

// ═══════════════════════════════════════════════════════════
// SEASONAL_WEIGHTS — 12 months (sum = 1.000)
// ═══════════════════════════════════════════════════════════

export const SEASONAL_WEIGHTS: SeasonalWeight[] = [
  { month: 'Jan', weight: 0.065, rationale: 'Post-holiday lull, dry January effect' },
  { month: 'Feb', weight: 0.070, rationale: 'Super Bowl bump, Valentine\'s dinners' },
  { month: 'Mar', weight: 0.085, rationale: 'March Madness, spring break bars' },
  { month: 'Apr', weight: 0.080, rationale: 'Easter dip offset by patio season start' },
  { month: 'May', weight: 0.095, rationale: 'Cinco de Mayo blitz + Memorial Day ramp' },
  { month: 'Jun', weight: 0.105, rationale: 'Summer peak begins, pool party season' },
  { month: 'Jul', weight: 0.110, rationale: 'July 4th + peak summer, highest month' },
  { month: 'Aug', weight: 0.100, rationale: 'Late summer, back-to-school transition' },
  { month: 'Sep', weight: 0.085, rationale: 'NFL kickoff, football bars' },
  { month: 'Oct', weight: 0.080, rationale: 'October fests, Halloween events' },
  { month: 'Nov', weight: 0.065, rationale: 'Pre-holiday transition, Thanksgiving lull' },
  { month: 'Dec', weight: 0.060, rationale: 'Holiday wind-down, spirits holiday shift' },
];

// ═══════════════════════════════════════════════════════════
// ROLE_DEFINITIONS — 4 roles
// ═══════════════════════════════════════════════════════════

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'DSM', title: 'District Sales Manager', headcount: 6,
    payMix: { base: 70, variable: 30 }, ote: 135000, baseRange: [92000, 108000],
    primaryMetric: 'District Revenue Attainment',
    secondaryMetrics: ['Team Attainment Spread', 'BBI Compliance Rate', 'Turnover Rate', 'New Account Adds'],
    icon: 'Users',
    description: 'Owns P&L for a hometown territory. Coaches 4-8 RSRs, manages KAM relationships, and owns the BBI scorecard for the district.',
  },
  {
    role: 'KAM', title: 'Key Account Manager', headcount: 4,
    payMix: { base: 60, variable: 40 }, ote: 110000, baseRange: [60000, 72000],
    primaryMetric: 'Key Account Revenue Growth',
    secondaryMetrics: ['SKU Penetration', 'Renewal Rate', 'Share of Wallet', 'BBI Score'],
    icon: 'Building2',
    description: 'Manages top-tier chain and key accounts. Negotiates placements, manages supplier programs, and drives incremental SKU distribution.',
  },
  {
    role: 'RSR', title: 'Route Sales Representative', headcount: 36,
    payMix: { base: 60, variable: 40 }, ote: 72000, baseRange: [40000, 48000],
    primaryMetric: 'Route Revenue Attainment',
    secondaryMetrics: ['BBI Gate Score', 'Display Compliance', 'Spirits Penetration', 'Stops/Day'],
    icon: 'Truck',
    description: 'The field engine. Runs a route of 280-420 accounts, executes daily stops, manages displays, and drives volume through relationship selling.',
  },
  {
    role: 'Merchandiser', title: 'Merchandiser', headcount: 18,
    payMix: { base: 85, variable: 15 }, ote: 48000, baseRange: [38000, 43000],
    primaryMetric: 'Display Compliance',
    secondaryMetrics: ['Planogram Compliance', 'Out-of-Stock Rate', 'Cooler Reset Completion', 'POS Placement'],
    icon: 'Package',
    description: 'Ensures shelf presence and display compliance. Resets coolers, builds displays, and maintains planogram standards.',
  },
];

// ═══════════════════════════════════════════════════════════
// COMMISSION_BANDS — 6 bands (piecewise-linear accelerator)
// ═══════════════════════════════════════════════════════════

export const COMMISSION_BANDS: CommissionBand[] = [
  { minAttainment: 0.00, maxAttainment: 0.50, rate: 0.008, multiplier: 0.5,  label: 'Ramp' },
  { minAttainment: 0.50, maxAttainment: 0.80, rate: 0.012, multiplier: 0.75, label: 'Base' },
  { minAttainment: 0.80, maxAttainment: 1.00, rate: 0.016, multiplier: 1.0,  label: 'Target' },
  { minAttainment: 1.00, maxAttainment: 1.20, rate: 0.024, multiplier: 1.5,  label: 'Accelerator' },
  { minAttainment: 1.20, maxAttainment: 1.50, rate: 0.032, multiplier: 2.0,  label: 'Super Accelerator' },
  { minAttainment: 1.50, maxAttainment: 9.99, rate: 0.016, multiplier: 1.0,  label: 'Decelerator' },
];

// ═══════════════════════════════════════════════════════════
// ATTAINMENT_HEATMAP — 6 hometowns x 8 quarters
// ═══════════════════════════════════════════════════════════

export const ATTAINMENT_HEATMAP: AttainmentCell[] = [
  // Dallas
  { hometownId: 'dal', quarter: 'Q1-2024', attainment: 0.98 },
  { hometownId: 'dal', quarter: 'Q2-2024', attainment: 1.01 },
  { hometownId: 'dal', quarter: 'Q3-2024', attainment: 1.03 },
  { hometownId: 'dal', quarter: 'Q4-2024', attainment: 1.00 },
  { hometownId: 'dal', quarter: 'Q1-2025', attainment: 1.02 },
  { hometownId: 'dal', quarter: 'Q2-2025', attainment: 1.04 },
  { hometownId: 'dal', quarter: 'Q3-2025', attainment: 1.05 },
  { hometownId: 'dal', quarter: 'Q4-2025', attainment: 1.03 },
  // Allen
  { hometownId: 'aln', quarter: 'Q1-2024', attainment: 0.96 },
  { hometownId: 'aln', quarter: 'Q2-2024', attainment: 0.99 },
  { hometownId: 'aln', quarter: 'Q3-2024', attainment: 1.01 },
  { hometownId: 'aln', quarter: 'Q4-2024', attainment: 0.98 },
  { hometownId: 'aln', quarter: 'Q1-2025', attainment: 1.00 },
  { hometownId: 'aln', quarter: 'Q2-2025', attainment: 1.02 },
  { hometownId: 'aln', quarter: 'Q3-2025', attainment: 1.03 },
  { hometownId: 'aln', quarter: 'Q4-2025', attainment: 1.01 },
  // Fort Worth
  { hometownId: 'ftw', quarter: 'Q1-2024', attainment: 0.93 },
  { hometownId: 'ftw', quarter: 'Q2-2024', attainment: 0.95 },
  { hometownId: 'ftw', quarter: 'Q3-2024', attainment: 0.98 },
  { hometownId: 'ftw', quarter: 'Q4-2024', attainment: 0.96 },
  { hometownId: 'ftw', quarter: 'Q1-2025', attainment: 0.97 },
  { hometownId: 'ftw', quarter: 'Q2-2025', attainment: 0.99 },
  { hometownId: 'ftw', quarter: 'Q3-2025', attainment: 1.01 },
  { hometownId: 'ftw', quarter: 'Q4-2025', attainment: 0.99 },
  // Ennis
  { hometownId: 'ens', quarter: 'Q1-2024', attainment: 0.88 },
  { hometownId: 'ens', quarter: 'Q2-2024', attainment: 0.91 },
  { hometownId: 'ens', quarter: 'Q3-2024', attainment: 0.94 },
  { hometownId: 'ens', quarter: 'Q4-2024', attainment: 0.89 },
  { hometownId: 'ens', quarter: 'Q1-2025', attainment: 0.92 },
  { hometownId: 'ens', quarter: 'Q2-2025', attainment: 0.95 },
  { hometownId: 'ens', quarter: 'Q3-2025', attainment: 0.97 },
  { hometownId: 'ens', quarter: 'Q4-2025', attainment: 0.93 },
  // Corpus Christi
  { hometownId: 'crp', quarter: 'Q1-2024', attainment: 0.91 },
  { hometownId: 'crp', quarter: 'Q2-2024', attainment: 0.95 },
  { hometownId: 'crp', quarter: 'Q3-2024', attainment: 0.98 },
  { hometownId: 'crp', quarter: 'Q4-2024', attainment: 0.93 },
  { hometownId: 'crp', quarter: 'Q1-2025', attainment: 0.94 },
  { hometownId: 'crp', quarter: 'Q2-2025', attainment: 0.97 },
  { hometownId: 'crp', quarter: 'Q3-2025', attainment: 1.00 },
  { hometownId: 'crp', quarter: 'Q4-2025', attainment: 0.95 },
  // Laredo (Q1-24 and Q2-24 are null — pre-acquisition)
  { hometownId: 'lar', quarter: 'Q1-2024', attainment: null },
  { hometownId: 'lar', quarter: 'Q2-2024', attainment: null },
  { hometownId: 'lar', quarter: 'Q3-2024', attainment: 0.62 },
  { hometownId: 'lar', quarter: 'Q4-2024', attainment: 0.71 },
  { hometownId: 'lar', quarter: 'Q1-2025', attainment: 0.78 },
  { hometownId: 'lar', quarter: 'Q2-2025', attainment: 0.82 },
  { hometownId: 'lar', quarter: 'Q3-2025', attainment: 0.85 },
  { hometownId: 'lar', quarter: 'Q4-2025', attainment: 0.88 },
];

// ═══════════════════════════════════════════════════════════
// FAIRNESS_SCORES — 6 hometowns
// ═══════════════════════════════════════════════════════════

export const FAIRNESS_SCORES: FairnessScore[] = [
  { hometownId: 'dal', hometownName: 'Dallas HQ',       score: 88, factors: { capacity: 90, growth: 85, competition: 88, mix: 92, tenure: 85 } },
  { hometownId: 'aln', hometownName: 'Allen',            score: 91, factors: { capacity: 95, growth: 88, competition: 90, mix: 90, tenure: 92 } },
  { hometownId: 'ftw', hometownName: 'Fort Worth',       score: 74, factors: { capacity: 72, growth: 78, competition: 70, mix: 80, tenure: 70 } },
  { hometownId: 'ens', hometownName: 'Ennis',            score: 82, factors: { capacity: 85, growth: 75, competition: 88, mix: 82, tenure: 80 } },
  { hometownId: 'crp', hometownName: 'Corpus Christi',   score: 85, factors: { capacity: 88, growth: 82, competition: 85, mix: 85, tenure: 85 } },
  { hometownId: 'lar', hometownName: 'Laredo',           score: 47, factors: { capacity: 55, growth: 40, competition: 50, mix: 35, tenure: 55 } },
];

// ═══════════════════════════════════════════════════════════
// Helper functions
// ═══════════════════════════════════════════════════════════

export const getCoverageByRoute = (routeId: string): CoverageMetric | undefined =>
  COVERAGE_METRICS.find(c => c.routeId === routeId);

export const getCoverageByHometown = (hometownId: string): CoverageMetric[] =>
  COVERAGE_METRICS.filter(c => c.hometownId === hometownId);

export const getQuotaNodesByLevel = (level: QuotaNode['level']): QuotaNode[] =>
  QUOTA_NODES.filter(n => n.level === level);

export const getQuotaChildren = (parentId: string): QuotaNode[] =>
  QUOTA_NODES.filter(n => n.parentId === parentId);

export const getFairnessScore = (hometownId: string): FairnessScore | undefined =>
  FAIRNESS_SCORES.find(f => f.hometownId === hometownId);

export const getAttainmentHistory = (hometownId: string): AttainmentCell[] =>
  ATTAINMENT_HEATMAP.filter(a => a.hometownId === hometownId);

export const getRoleByType = (role: RoleDefinition['role']): RoleDefinition | undefined =>
  ROLE_DEFINITIONS.find(r => r.role === role);
