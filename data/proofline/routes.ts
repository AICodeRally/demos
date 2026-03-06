// Andrews Distributing — 36 Routes across 6 Hometowns
// Dallas (8), Allen (6), Fort Worth (8), Ennis (4), Corpus Christi (6), Laredo (4)

export interface Route {
  id: string;             // DAL-03
  hometownId: string;     // dal, aln, ftw, ens, crp, lar
  sellerId: string;       // matches seller.id
  mgr: string;            // district manager name
  attain: number;         // quarterly attainment (1.0 = 100%)
  rev: number;            // quarterly revenue ($)
  cases: number;          // quarterly cases
  displays: number;       // active display count
  pods: number;           // PODs placed
  weeklyAttainment: number[]; // 13-week cumulative attainment
  onTimeRate: number;     // delivery on-time %
  shrinkage: number;      // shrinkage %
  displayCompliance: number;  // display compliance %
  channel: 'on-prem' | 'off-prem' | 'mixed';
  stopsPerDay: number;
  spiritsAccounts: number;  // number of accounts carrying spirits
  accounts: number;       // total accounts on route
}

export const ROUTES: Route[] = [
  // ═══════════════════════════════════════════════════
  // DALLAS HQ — 8 routes (DAL-01 through DAL-08)
  // Metro urban, densest coverage. Manager: Sarah Chen
  // ═══════════════════════════════════════════════════
  {
    id: 'DAL-01', hometownId: 'dal', sellerId: 'SEL-DAL-01', mgr: 'Sarah Chen',
    attain: 1.04, rev: 1263000, cases: 42100, displays: 38, pods: 142, accounts: 412,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.33, 0.42, 0.52, 0.62, 0.71, 0.80, 0.88, 0.94, 1.00, 1.04],
    onTimeRate: 0.97, shrinkage: 0.005, displayCompliance: 0.96,
    channel: 'mixed', stopsPerDay: 18, spiritsAccounts: 12,
  },
  {
    id: 'DAL-02', hometownId: 'dal', sellerId: 'SEL-DAL-02', mgr: 'Sarah Chen',
    attain: 0.98, rev: 1194000, cases: 39800, displays: 31, pods: 128, accounts: 388,
    weeklyAttainment: [0.07, 0.14, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.83, 0.90, 0.95, 0.98],
    onTimeRate: 0.95, shrinkage: 0.008, displayCompliance: 0.91,
    channel: 'off-prem', stopsPerDay: 16, spiritsAccounts: 8,
  },
  {
    id: 'DAL-03', hometownId: 'dal', sellerId: 'SEL-DAL-03', mgr: 'Sarah Chen',
    attain: 1.01, rev: 1155000, cases: 38500, displays: 34, pods: 135, accounts: 362,
    weeklyAttainment: [0.08, 0.15, 0.23, 0.31, 0.40, 0.50, 0.59, 0.68, 0.77, 0.85, 0.92, 0.97, 1.01],
    onTimeRate: 0.96, shrinkage: 0.006, displayCompliance: 0.93,
    channel: 'mixed', stopsPerDay: 17, spiritsAccounts: 14,
  },
  {
    id: 'DAL-04', hometownId: 'dal', sellerId: 'SEL-DAL-04', mgr: 'Sarah Chen',
    attain: 1.07, rev: 1236000, cases: 41200, displays: 41, pods: 156, accounts: 340,
    weeklyAttainment: [0.09, 0.18, 0.27, 0.36, 0.46, 0.56, 0.66, 0.75, 0.84, 0.92, 0.98, 1.04, 1.07],
    onTimeRate: 0.98, shrinkage: 0.003, displayCompliance: 0.97,
    channel: 'off-prem', stopsPerDay: 19, spiritsAccounts: 10,
  },
  {
    id: 'DAL-05', hometownId: 'dal', sellerId: 'SEL-DAL-05', mgr: 'Sarah Chen',
    attain: 0.94, rev: 1092000, cases: 36400, displays: 22, pods: 98, accounts: 338,
    weeklyAttainment: [0.06, 0.12, 0.19, 0.26, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.82, 0.89, 0.94],
    onTimeRate: 0.91, shrinkage: 0.015, displayCompliance: 0.82,
    channel: 'on-prem', stopsPerDay: 14, spiritsAccounts: 6,
  },
  {
    id: 'DAL-06', hometownId: 'dal', sellerId: 'SEL-DAL-06', mgr: 'Sarah Chen',
    attain: 1.08, rev: 1296000, cases: 43200, displays: 40, pods: 150, accounts: 405,
    weeklyAttainment: [0.09, 0.18, 0.28, 0.37, 0.47, 0.57, 0.67, 0.76, 0.85, 0.93, 1.00, 1.05, 1.08],
    onTimeRate: 0.98, shrinkage: 0.004, displayCompliance: 0.95,
    channel: 'off-prem', stopsPerDay: 20, spiritsAccounts: 11,
  },
  {
    id: 'DAL-07', hometownId: 'dal', sellerId: 'SEL-DAL-07', mgr: 'Sarah Chen',
    attain: 0.92, rev: 1056000, cases: 35200, displays: 20, pods: 88, accounts: 375,
    weeklyAttainment: [0.05, 0.11, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.64, 0.72, 0.80, 0.87, 0.92],
    onTimeRate: 0.89, shrinkage: 0.022, displayCompliance: 0.78,
    channel: 'on-prem', stopsPerDay: 13, spiritsAccounts: 4,
  },
  {
    id: 'DAL-08', hometownId: 'dal', sellerId: 'SEL-DAL-08', mgr: 'Sarah Chen',
    attain: 0.87, rev: 885000, cases: 29500, displays: 16, pods: 72, accounts: 290,
    weeklyAttainment: [0.05, 0.10, 0.15, 0.21, 0.28, 0.35, 0.43, 0.51, 0.60, 0.69, 0.77, 0.83, 0.87],
    onTimeRate: 0.88, shrinkage: 0.025, displayCompliance: 0.76,
    channel: 'off-prem', stopsPerDay: 11, spiritsAccounts: 3,
  },

  // ═══════════════════════════════════════════════════
  // ALLEN — 6 routes (ALN-01 through ALN-06)
  // Collin County suburban growth. Manager: Lisa Park
  // Skews craft — higher craft/regional mix
  // ═══════════════════════════════════════════════════
  {
    id: 'ALN-01', hometownId: 'aln', sellerId: 'SEL-ALN-01', mgr: 'Lisa Park',
    attain: 1.02, rev: 858000, cases: 28600, displays: 26, pods: 108, accounts: 320,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.32, 0.41, 0.50, 0.59, 0.68, 0.77, 0.85, 0.93, 0.98, 1.02],
    onTimeRate: 0.96, shrinkage: 0.007, displayCompliance: 0.92,
    channel: 'off-prem', stopsPerDay: 16, spiritsAccounts: 9,
  },
  {
    id: 'ALN-02', hometownId: 'aln', sellerId: 'SEL-ALN-02', mgr: 'Lisa Park',
    attain: 0.99, rev: 762000, cases: 25400, displays: 24, pods: 98, accounts: 290,
    weeklyAttainment: [0.07, 0.14, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.83, 0.90, 0.96, 0.99],
    onTimeRate: 0.95, shrinkage: 0.008, displayCompliance: 0.90,
    channel: 'mixed', stopsPerDay: 15, spiritsAccounts: 7,
  },
  {
    id: 'ALN-03', hometownId: 'aln', sellerId: 'SEL-ALN-03', mgr: 'Lisa Park',
    attain: 1.05, rev: 930000, cases: 31000, displays: 32, pods: 125, accounts: 310,
    weeklyAttainment: [0.09, 0.17, 0.26, 0.35, 0.44, 0.54, 0.64, 0.73, 0.82, 0.90, 0.97, 1.02, 1.05],
    onTimeRate: 0.97, shrinkage: 0.005, displayCompliance: 0.94,
    channel: 'off-prem', stopsPerDay: 18, spiritsAccounts: 11,
  },
  {
    id: 'ALN-04', hometownId: 'aln', sellerId: 'SEL-ALN-04', mgr: 'Lisa Park',
    attain: 0.96, rev: 618000, cases: 20600, displays: 19, pods: 82, accounts: 260,
    weeklyAttainment: [0.06, 0.13, 0.20, 0.27, 0.36, 0.44, 0.53, 0.62, 0.71, 0.79, 0.86, 0.92, 0.96],
    onTimeRate: 0.93, shrinkage: 0.011, displayCompliance: 0.85,
    channel: 'on-prem', stopsPerDay: 14, spiritsAccounts: 5,
  },
  {
    id: 'ALN-05', hometownId: 'aln', sellerId: 'SEL-ALN-05', mgr: 'Lisa Park',
    attain: 1.01, rev: 810000, cases: 27000, displays: 28, pods: 110, accounts: 280,
    weeklyAttainment: [0.08, 0.15, 0.23, 0.31, 0.40, 0.50, 0.59, 0.68, 0.77, 0.85, 0.92, 0.97, 1.01],
    onTimeRate: 0.95, shrinkage: 0.007, displayCompliance: 0.91,
    channel: 'mixed', stopsPerDay: 16, spiritsAccounts: 8,
  },
  {
    id: 'ALN-06', hometownId: 'aln', sellerId: 'SEL-ALN-06', mgr: 'Lisa Park',
    attain: 0.93, rev: 898800, cases: 19800, displays: 18, pods: 76, accounts: 220,
    weeklyAttainment: [0.06, 0.12, 0.18, 0.25, 0.33, 0.41, 0.49, 0.57, 0.65, 0.74, 0.82, 0.88, 0.93],
    onTimeRate: 0.92, shrinkage: 0.012, displayCompliance: 0.84,
    channel: 'on-prem', stopsPerDay: 13, spiritsAccounts: 4,
  },

  // ═══════════════════════════════════════════════════
  // FORT WORTH — 8 routes (FTW-01 through FTW-08)
  // West metro, 532K sq ft solar-powered. Manager: Carlos Mendoza
  // ═══════════════════════════════════════════════════
  {
    id: 'FTW-01', hometownId: 'ftw', sellerId: 'SEL-FTW-01', mgr: 'Carlos Mendoza',
    attain: 1.02, rev: 1146000, cases: 38200, displays: 29, pods: 118, accounts: 395,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.32, 0.41, 0.50, 0.59, 0.68, 0.77, 0.85, 0.93, 0.98, 1.02],
    onTimeRate: 0.96, shrinkage: 0.007, displayCompliance: 0.92,
    channel: 'mixed', stopsPerDay: 17, spiritsAccounts: 10,
  },
  {
    id: 'FTW-02', hometownId: 'ftw', sellerId: 'SEL-FTW-02', mgr: 'Carlos Mendoza',
    attain: 0.99, rev: 1104000, cases: 36800, displays: 27, pods: 112, accounts: 370,
    weeklyAttainment: [0.07, 0.14, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.83, 0.90, 0.96, 0.99],
    onTimeRate: 0.95, shrinkage: 0.009, displayCompliance: 0.90,
    channel: 'off-prem', stopsPerDay: 16, spiritsAccounts: 7,
  },
  {
    id: 'FTW-03', hometownId: 'ftw', sellerId: 'SEL-FTW-03', mgr: 'Carlos Mendoza',
    attain: 0.96, rev: 1035000, cases: 34500, displays: 24, pods: 105, accounts: 342,
    weeklyAttainment: [0.06, 0.13, 0.20, 0.27, 0.36, 0.44, 0.53, 0.62, 0.71, 0.79, 0.86, 0.92, 0.96],
    onTimeRate: 0.93, shrinkage: 0.012, displayCompliance: 0.86,
    channel: 'on-prem', stopsPerDay: 15, spiritsAccounts: 6,
  },
  {
    id: 'FTW-04', hometownId: 'ftw', sellerId: 'SEL-FTW-04', mgr: 'Carlos Mendoza',
    attain: 1.00, rev: 975000, cases: 32500, displays: 30, pods: 121, accounts: 313,
    weeklyAttainment: [0.07, 0.15, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.84, 0.91, 0.96, 1.00],
    onTimeRate: 0.94, shrinkage: 0.008, displayCompliance: 0.89,
    channel: 'off-prem', stopsPerDay: 16, spiritsAccounts: 8,
  },
  {
    id: 'FTW-05', hometownId: 'ftw', sellerId: 'SEL-FTW-05', mgr: 'Carlos Mendoza',
    attain: 1.05, rev: 1185000, cases: 39500, displays: 36, pods: 138, accounts: 380,
    weeklyAttainment: [0.09, 0.17, 0.26, 0.35, 0.44, 0.54, 0.64, 0.73, 0.82, 0.90, 0.97, 1.02, 1.05],
    onTimeRate: 0.97, shrinkage: 0.005, displayCompliance: 0.94,
    channel: 'mixed', stopsPerDay: 19, spiritsAccounts: 16,
  },
  {
    id: 'FTW-06', hometownId: 'ftw', sellerId: 'SEL-FTW-06', mgr: 'Carlos Mendoza',
    attain: 0.95, rev: 1026000, cases: 34200, displays: 23, pods: 96, accounts: 355,
    weeklyAttainment: [0.06, 0.12, 0.19, 0.26, 0.34, 0.42, 0.51, 0.59, 0.68, 0.76, 0.84, 0.90, 0.95],
    onTimeRate: 0.92, shrinkage: 0.014, displayCompliance: 0.83,
    channel: 'off-prem', stopsPerDay: 14, spiritsAccounts: 5,
  },
  {
    id: 'FTW-07', hometownId: 'ftw', sellerId: 'SEL-FTW-07', mgr: 'Carlos Mendoza',
    attain: 0.93, rev: 954000, cases: 31800, displays: 21, pods: 90, accounts: 328,
    weeklyAttainment: [0.06, 0.11, 0.18, 0.25, 0.32, 0.40, 0.49, 0.57, 0.66, 0.74, 0.82, 0.88, 0.93],
    onTimeRate: 0.90, shrinkage: 0.018, displayCompliance: 0.80,
    channel: 'on-prem', stopsPerDay: 12, spiritsAccounts: 4,
  },
  {
    id: 'FTW-08', hometownId: 'ftw', sellerId: 'SEL-FTW-08', mgr: 'Carlos Mendoza',
    attain: 0.88, rev: 852000, cases: 28400, displays: 17, pods: 78, accounts: 298,
    weeklyAttainment: [0.05, 0.10, 0.16, 0.22, 0.29, 0.37, 0.45, 0.53, 0.62, 0.70, 0.78, 0.84, 0.88],
    onTimeRate: 0.88, shrinkage: 0.024, displayCompliance: 0.77,
    channel: 'off-prem', stopsPerDay: 10, spiritsAccounts: 2,
  },

  // ═══════════════════════════════════════════════════
  // ENNIS — 4 routes (ENS-01 through ENS-04)
  // Rural/semi-urban Ellis County. Manager: Tommy Nguyen
  // ═══════════════════════════════════════════════════
  {
    id: 'ENS-01', hometownId: 'ens', sellerId: 'SEL-ENS-01', mgr: 'Tommy Nguyen',
    attain: 1.01, rev: 672000, cases: 24000, displays: 22, pods: 94, accounts: 265,
    weeklyAttainment: [0.08, 0.15, 0.23, 0.31, 0.40, 0.50, 0.59, 0.68, 0.77, 0.85, 0.92, 0.97, 1.01],
    onTimeRate: 0.95, shrinkage: 0.009, displayCompliance: 0.89,
    channel: 'off-prem', stopsPerDay: 15, spiritsAccounts: 5,
  },
  {
    id: 'ENS-02', hometownId: 'ens', sellerId: 'SEL-ENS-02', mgr: 'Tommy Nguyen',
    attain: 0.97, rev: 588000, cases: 21000, displays: 18, pods: 76, accounts: 240,
    weeklyAttainment: [0.06, 0.13, 0.20, 0.27, 0.36, 0.44, 0.53, 0.62, 0.71, 0.79, 0.86, 0.92, 0.97],
    onTimeRate: 0.93, shrinkage: 0.012, displayCompliance: 0.86,
    channel: 'mixed', stopsPerDay: 14, spiritsAccounts: 3,
  },
  {
    id: 'ENS-03', hometownId: 'ens', sellerId: 'SEL-ENS-03', mgr: 'Tommy Nguyen',
    attain: 0.93, rev: 532000, cases: 19000, displays: 15, pods: 64, accounts: 210,
    weeklyAttainment: [0.06, 0.11, 0.18, 0.25, 0.32, 0.40, 0.49, 0.57, 0.66, 0.74, 0.82, 0.88, 0.93],
    onTimeRate: 0.91, shrinkage: 0.015, displayCompliance: 0.82,
    channel: 'off-prem', stopsPerDay: 12, spiritsAccounts: 2,
  },
  {
    id: 'ENS-04', hometownId: 'ens', sellerId: 'SEL-ENS-04', mgr: 'Tommy Nguyen',
    attain: 0.90, rev: 515200, cases: 18400, displays: 14, pods: 58, accounts: 175,
    weeklyAttainment: [0.05, 0.10, 0.16, 0.23, 0.30, 0.38, 0.46, 0.54, 0.63, 0.72, 0.80, 0.86, 0.90],
    onTimeRate: 0.90, shrinkage: 0.017, displayCompliance: 0.80,
    channel: 'on-prem', stopsPerDay: 11, spiritsAccounts: 2,
  },

  // ═══════════════════════════════════════════════════
  // CORPUS CHRISTI — 6 routes (CRP-01 through CRP-06)
  // Coastal, founding territory. Manager: Maria Santos
  // ═══════════════════════════════════════════════════
  {
    id: 'CRP-01', hometownId: 'crp', sellerId: 'SEL-CRP-01', mgr: 'Maria Santos',
    attain: 1.03, rev: 876000, cases: 29200, displays: 28, pods: 112, accounts: 360,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.32, 0.41, 0.51, 0.60, 0.69, 0.78, 0.86, 0.93, 0.99, 1.03],
    onTimeRate: 0.96, shrinkage: 0.008, displayCompliance: 0.91,
    channel: 'mixed', stopsPerDay: 17, spiritsAccounts: 8,
  },
  {
    id: 'CRP-02', hometownId: 'crp', sellerId: 'SEL-CRP-02', mgr: 'Maria Santos',
    attain: 0.98, rev: 804000, cases: 26800, displays: 25, pods: 100, accounts: 325,
    weeklyAttainment: [0.07, 0.14, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.83, 0.90, 0.95, 0.98],
    onTimeRate: 0.95, shrinkage: 0.009, displayCompliance: 0.89,
    channel: 'off-prem', stopsPerDay: 16, spiritsAccounts: 6,
  },
  {
    id: 'CRP-03', hometownId: 'crp', sellerId: 'SEL-CRP-03', mgr: 'Maria Santos',
    attain: 1.00, rev: 768000, cases: 25600, displays: 23, pods: 96, accounts: 310,
    weeklyAttainment: [0.07, 0.15, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.84, 0.91, 0.96, 1.00],
    onTimeRate: 0.94, shrinkage: 0.010, displayCompliance: 0.88,
    channel: 'on-prem', stopsPerDay: 16, spiritsAccounts: 7,
  },
  {
    id: 'CRP-04', hometownId: 'crp', sellerId: 'SEL-CRP-04', mgr: 'Maria Santos',
    attain: 0.95, rev: 708000, cases: 23600, displays: 20, pods: 84, accounts: 295,
    weeklyAttainment: [0.06, 0.12, 0.19, 0.26, 0.34, 0.42, 0.51, 0.59, 0.68, 0.76, 0.84, 0.90, 0.95],
    onTimeRate: 0.92, shrinkage: 0.013, displayCompliance: 0.84,
    channel: 'off-prem', stopsPerDay: 14, spiritsAccounts: 4,
  },
  {
    id: 'CRP-05', hometownId: 'crp', sellerId: 'SEL-CRP-05', mgr: 'Maria Santos',
    attain: 0.91, rev: 648000, cases: 21600, displays: 17, pods: 72, accounts: 280,
    weeklyAttainment: [0.05, 0.11, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.64, 0.73, 0.80, 0.86, 0.91],
    onTimeRate: 0.90, shrinkage: 0.017, displayCompliance: 0.80,
    channel: 'on-prem', stopsPerDay: 12, spiritsAccounts: 3,
  },
  {
    id: 'CRP-06', hometownId: 'crp', sellerId: 'SEL-CRP-06', mgr: 'Maria Santos',
    attain: 0.88, rev: 660000, cases: 22000, displays: 15, pods: 64, accounts: 270,
    weeklyAttainment: [0.05, 0.10, 0.16, 0.22, 0.29, 0.37, 0.45, 0.53, 0.62, 0.70, 0.78, 0.84, 0.88],
    onTimeRate: 0.89, shrinkage: 0.019, displayCompliance: 0.78,
    channel: 'off-prem', stopsPerDay: 11, spiritsAccounts: 2,
  },

  // ═══════════════════════════════════════════════════
  // LAREDO — 4 routes (LAR-01 through LAR-04)
  // Border market, highest import mix. Manager: Roberto Garza
  // ═══════════════════════════════════════════════════
  {
    id: 'LAR-01', hometownId: 'lar', sellerId: 'SEL-LAR-01', mgr: 'Roberto Garza',
    attain: 1.03, rev: 700000, cases: 20000, displays: 18, pods: 72, accounts: 310,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.32, 0.41, 0.51, 0.60, 0.69, 0.78, 0.86, 0.93, 0.99, 1.03],
    onTimeRate: 0.94, shrinkage: 0.009, displayCompliance: 0.90,
    channel: 'mixed', stopsPerDay: 15, spiritsAccounts: 6,
  },
  {
    id: 'LAR-02', hometownId: 'lar', sellerId: 'SEL-LAR-02', mgr: 'Roberto Garza',
    attain: 0.97, rev: 630000, cases: 18000, displays: 14, pods: 58, accounts: 285,
    weeklyAttainment: [0.06, 0.13, 0.20, 0.27, 0.36, 0.44, 0.53, 0.62, 0.71, 0.79, 0.86, 0.92, 0.97],
    onTimeRate: 0.92, shrinkage: 0.013, displayCompliance: 0.85,
    channel: 'off-prem', stopsPerDay: 13, spiritsAccounts: 5,
  },
  {
    id: 'LAR-03', hometownId: 'lar', sellerId: 'SEL-LAR-03', mgr: 'Roberto Garza',
    attain: 0.91, rev: 525000, cases: 15000, displays: 11, pods: 44, accounts: 260,
    weeklyAttainment: [0.05, 0.11, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.64, 0.73, 0.80, 0.86, 0.91],
    onTimeRate: 0.90, shrinkage: 0.018, displayCompliance: 0.80,
    channel: 'on-prem', stopsPerDay: 11, spiritsAccounts: 3,
  },
  {
    id: 'LAR-04', hometownId: 'lar', sellerId: 'SEL-LAR-04', mgr: 'Roberto Garza',
    attain: 1.06, rev: 665000, cases: 19000, displays: 20, pods: 78, accounts: 265,
    weeklyAttainment: [0.09, 0.17, 0.26, 0.35, 0.45, 0.55, 0.65, 0.74, 0.83, 0.91, 0.98, 1.03, 1.06],
    onTimeRate: 0.96, shrinkage: 0.006, displayCompliance: 0.93,
    channel: 'off-prem', stopsPerDay: 16, spiritsAccounts: 7,
  },
];

// Computed helpers
export const getRoutesByHometown = (hometownId: string): Route[] =>
  ROUTES.filter(r => r.hometownId === hometownId);

export const getRouteById = (id: string): Route | undefined =>
  ROUTES.find(r => r.id === id);
