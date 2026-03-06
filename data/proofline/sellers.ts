// Andrews Distributing — 36 Sellers + 6 District Managers
// Each seller maps to exactly one route. Each manager maps to one hometown.

import type { SupplierGroup } from './brands';

export interface Seller {
  id: string;
  name: string;
  routeId: string;
  hometown: string;       // hometown ID
  tenure: number;         // months
  tier: 1 | 2 | 3 | 4;   // comp tier (1=top, 4=developing)
  attainment: number;     // quarterly attainment (1.0 = 100%)
  weeklyAttainment: number[]; // 13-week cumulative attainment
  brandMix: Record<SupplierGroup, number>; // % of volume by supplier
  spiritsAccounts: number;
  atRisk: boolean;
  coachingNote: string;
  emcoGates: {
    core: number;         // Molson Coors domestic %
    import: number;       // Constellation + Heineken %
    emerging: number;     // Craft + spirits + FMB %
    combined: number;     // All categories blended %
  };
}

export interface Manager {
  id: string;
  name: string;
  hometown: string;       // hometown ID
  hometownName: string;
  directReports: string[]; // seller IDs
  tenure: number;         // months
  districtKPIs: {
    avgAttainment: number;
    totalCases: number;
    totalRevenue: number;
    spiritsPenetration: number;  // % of accounts carrying spirits
    displayCompliance: number;
  };
}

export const SELLERS: Seller[] = [
  // ═══════════════════════════════════════════════════
  // DALLAS HQ — 8 sellers. Manager: Sarah Chen
  // ═══════════════════════════════════════════════════
  {
    id: 'SEL-DAL-01', name: 'Derek Thompson', routeId: 'DAL-01', hometown: 'dal', tenure: 48, tier: 1,
    attainment: 1.04,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.33, 0.42, 0.52, 0.62, 0.71, 0.80, 0.88, 0.94, 1.00, 1.04],
    brandMix: { 'molson-coors': 0.40, 'constellation': 0.26, 'heineken': 0.14, 'craft': 0.10, 'sazerac': 0.07, 'fmb-rtd': 0.03 },
    spiritsAccounts: 12, atRisk: false,
    coachingNote: 'Consistent top performer. Strong spirits adoption. Candidate for mentor pairing.',
    emcoGates: { core: 0.92, import: 0.84, emerging: 0.78, combined: 0.93 },
  },
  {
    id: 'SEL-DAL-02', name: 'Kim Tran', routeId: 'DAL-02', hometown: 'dal', tenure: 36, tier: 2,
    attainment: 0.98,
    weeklyAttainment: [0.07, 0.14, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.83, 0.90, 0.95, 0.98],
    brandMix: { 'molson-coors': 0.42, 'constellation': 0.25, 'heineken': 0.15, 'craft': 0.09, 'sazerac': 0.05, 'fmb-rtd': 0.04 },
    spiritsAccounts: 8, atRisk: false,
    coachingNote: 'Solid performer. Opportunity to grow spirits accounts in Uptown off-premise.',
    emcoGates: { core: 0.88, import: 0.82, emerging: 0.72, combined: 0.91 },
  },
  {
    id: 'SEL-DAL-03', name: 'Marcus Reyes', routeId: 'DAL-03', hometown: 'dal', tenure: 42, tier: 2,
    attainment: 1.01,
    weeklyAttainment: [0.08, 0.15, 0.23, 0.31, 0.40, 0.50, 0.59, 0.68, 0.77, 0.85, 0.92, 0.97, 1.01],
    brandMix: { 'molson-coors': 0.36, 'constellation': 0.30, 'heineken': 0.14, 'craft': 0.10, 'sazerac': 0.07, 'fmb-rtd': 0.03 },
    spiritsAccounts: 14, atRisk: false,
    coachingNote: 'Day planner showcase rep. Strong import mix and spirits pioneer. Deep Ellum territory is key growth area.',
    emcoGates: { core: 0.87, import: 0.86, emerging: 0.76, combined: 0.92 },
  },
  {
    id: 'SEL-DAL-04', name: 'Monica Davis', routeId: 'DAL-04', hometown: 'dal', tenure: 60, tier: 1,
    attainment: 1.07,
    weeklyAttainment: [0.09, 0.18, 0.27, 0.36, 0.46, 0.56, 0.66, 0.75, 0.84, 0.92, 0.98, 1.04, 1.07],
    brandMix: { 'molson-coors': 0.41, 'constellation': 0.27, 'heineken': 0.14, 'craft': 0.09, 'sazerac': 0.06, 'fmb-rtd': 0.03 },
    spiritsAccounts: 10, atRisk: false,
    coachingNote: 'Top seller company-wide. 5 years tenure. Best display compliance in district.',
    emcoGates: { core: 0.94, import: 0.85, emerging: 0.75, combined: 0.95 },
  },
  {
    id: 'SEL-DAL-05', name: 'Andre Patel', routeId: 'DAL-05', hometown: 'dal', tenure: 14, tier: 3,
    attainment: 0.94,
    weeklyAttainment: [0.06, 0.12, 0.19, 0.26, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.82, 0.89, 0.94],
    brandMix: { 'molson-coors': 0.44, 'constellation': 0.24, 'heineken': 0.13, 'craft': 0.08, 'sazerac': 0.04, 'fmb-rtd': 0.07 },
    spiritsAccounts: 6, atRisk: true,
    coachingNote: 'Below target at week 7, recommend territory review. Struggling with Emerging portfolio placement in Deep Ellum accounts.',
    emcoGates: { core: 0.86, import: 0.78, emerging: 0.64, combined: 0.88 },
  },
  {
    id: 'SEL-DAL-06', name: 'Ana Washington', routeId: 'DAL-06', hometown: 'dal', tenure: 54, tier: 1,
    attainment: 1.08,
    weeklyAttainment: [0.09, 0.18, 0.28, 0.37, 0.47, 0.57, 0.67, 0.76, 0.85, 0.93, 1.00, 1.05, 1.08],
    brandMix: { 'molson-coors': 0.39, 'constellation': 0.28, 'heineken': 0.15, 'craft': 0.10, 'sazerac': 0.05, 'fmb-rtd': 0.03 },
    spiritsAccounts: 11, atRisk: false,
    coachingNote: 'Highest attainment in Dallas district. Excellent relationship with key accounts.',
    emcoGates: { core: 0.93, import: 0.87, emerging: 0.74, combined: 0.94 },
  },
  {
    id: 'SEL-DAL-07', name: 'Jackie Hernandez', routeId: 'DAL-07', hometown: 'dal', tenure: 8, tier: 4,
    attainment: 0.92,
    weeklyAttainment: [0.05, 0.11, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.64, 0.72, 0.80, 0.87, 0.92],
    brandMix: { 'molson-coors': 0.46, 'constellation': 0.22, 'heineken': 0.12, 'craft': 0.08, 'sazerac': 0.03, 'fmb-rtd': 0.09 },
    spiritsAccounts: 4, atRisk: true,
    coachingNote: 'New hire ramp — needs mentoring on Emerging portfolio. Pair with Ana Washington for ride-alongs. Missed 2 key account stops this month.',
    emcoGates: { core: 0.85, import: 0.74, emerging: 0.58, combined: 0.85 },
  },
  {
    id: 'SEL-DAL-08', name: 'Nathan Chowdhury', routeId: 'DAL-08', hometown: 'dal', tenure: 3, tier: 4,
    attainment: 0.87,
    weeklyAttainment: [0.05, 0.10, 0.15, 0.21, 0.28, 0.35, 0.43, 0.51, 0.60, 0.69, 0.77, 0.83, 0.87],
    brandMix: { 'molson-coors': 0.48, 'constellation': 0.20, 'heineken': 0.12, 'craft': 0.07, 'sazerac': 0.02, 'fmb-rtd': 0.11 },
    spiritsAccounts: 3, atRisk: true,
    coachingNote: 'Newest hire on the team. Underperforming on stops per day. Recommend structured onboarding plan with daily check-ins.',
    emcoGates: { core: 0.83, import: 0.70, emerging: 0.52, combined: 0.82 },
  },

  // ═══════════════════════════════════════════════════
  // ALLEN — 6 sellers. Manager: Lisa Park
  // Collin County suburban growth. Skews craft.
  // ═══════════════════════════════════════════════════
  {
    id: 'SEL-ALN-01', name: 'David Sharma', routeId: 'ALN-01', hometown: 'aln', tenure: 32, tier: 2,
    attainment: 1.02,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.32, 0.41, 0.50, 0.59, 0.68, 0.77, 0.85, 0.93, 0.98, 1.02],
    brandMix: { 'molson-coors': 0.34, 'constellation': 0.24, 'heineken': 0.13, 'craft': 0.18, 'sazerac': 0.06, 'fmb-rtd': 0.05 },
    spiritsAccounts: 9, atRisk: false,
    coachingNote: 'Strong craft portfolio. Leading the Allen craft-forward initiative.',
    emcoGates: { core: 0.87, import: 0.81, emerging: 0.80, combined: 0.91 },
  },
  {
    id: 'SEL-ALN-02', name: 'Tyler Pham', routeId: 'ALN-02', hometown: 'aln', tenure: 18, tier: 2,
    attainment: 0.99,
    weeklyAttainment: [0.07, 0.14, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.83, 0.90, 0.96, 0.99],
    brandMix: { 'molson-coors': 0.35, 'constellation': 0.25, 'heineken': 0.14, 'craft': 0.16, 'sazerac': 0.05, 'fmb-rtd': 0.05 },
    spiritsAccounts: 7, atRisk: false,
    coachingNote: 'Good suburban territory management. Growing import accounts.',
    emcoGates: { core: 0.86, import: 0.82, emerging: 0.76, combined: 0.90 },
  },
  {
    id: 'SEL-ALN-03', name: 'Lauren Foster', routeId: 'ALN-03', hometown: 'aln', tenure: 44, tier: 1,
    attainment: 1.05,
    weeklyAttainment: [0.09, 0.17, 0.26, 0.35, 0.44, 0.54, 0.64, 0.73, 0.82, 0.90, 0.97, 1.02, 1.05],
    brandMix: { 'molson-coors': 0.33, 'constellation': 0.23, 'heineken': 0.13, 'craft': 0.20, 'sazerac': 0.07, 'fmb-rtd': 0.04 },
    spiritsAccounts: 11, atRisk: false,
    coachingNote: 'Top Allen performer. Highest craft mix in company. Spirits adoption leader in suburban markets.',
    emcoGates: { core: 0.90, import: 0.83, emerging: 0.84, combined: 0.93 },
  },
  {
    id: 'SEL-ALN-04', name: 'Jason Owens', routeId: 'ALN-04', hometown: 'aln', tenure: 8, tier: 3,
    attainment: 0.96,
    weeklyAttainment: [0.06, 0.13, 0.20, 0.27, 0.36, 0.44, 0.53, 0.62, 0.71, 0.79, 0.86, 0.92, 0.96],
    brandMix: { 'molson-coors': 0.38, 'constellation': 0.24, 'heineken': 0.14, 'craft': 0.14, 'sazerac': 0.04, 'fmb-rtd': 0.06 },
    spiritsAccounts: 5, atRisk: true,
    coachingNote: 'New hire, needs display training. Strong personality but needs mentoring on route efficiency.',
    emcoGates: { core: 0.85, import: 0.79, emerging: 0.70, combined: 0.88 },
  },
  {
    id: 'SEL-ALN-05', name: 'Rachel Kim', routeId: 'ALN-05', hometown: 'aln', tenure: 26, tier: 2,
    attainment: 1.01,
    weeklyAttainment: [0.08, 0.15, 0.23, 0.31, 0.40, 0.50, 0.59, 0.68, 0.77, 0.85, 0.92, 0.97, 1.01],
    brandMix: { 'molson-coors': 0.35, 'constellation': 0.25, 'heineken': 0.14, 'craft': 0.16, 'sazerac': 0.06, 'fmb-rtd': 0.04 },
    spiritsAccounts: 8, atRisk: false,
    coachingNote: 'Reliable performer. Good balance across all categories.',
    emcoGates: { core: 0.88, import: 0.82, emerging: 0.76, combined: 0.91 },
  },
  {
    id: 'SEL-ALN-06', name: 'Brandon Cooper', routeId: 'ALN-06', hometown: 'aln', tenure: 10, tier: 3,
    attainment: 0.93,
    weeklyAttainment: [0.06, 0.12, 0.18, 0.25, 0.33, 0.41, 0.49, 0.57, 0.65, 0.74, 0.82, 0.88, 0.93],
    brandMix: { 'molson-coors': 0.40, 'constellation': 0.23, 'heineken': 0.13, 'craft': 0.13, 'sazerac': 0.04, 'fmb-rtd': 0.07 },
    spiritsAccounts: 4, atRisk: false,
    coachingNote: 'Growing into territory. Needs to improve craft placement in new Frisco accounts.',
    emcoGates: { core: 0.85, import: 0.78, emerging: 0.68, combined: 0.87 },
  },

  // ═══════════════════════════════════════════════════
  // FORT WORTH — 8 sellers. Manager: Carlos Mendoza
  // ═══════════════════════════════════════════════════
  {
    id: 'SEL-FTW-01', name: 'Sean Wilson', routeId: 'FTW-01', hometown: 'ftw', tenure: 38, tier: 2,
    attainment: 1.02,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.32, 0.41, 0.50, 0.59, 0.68, 0.77, 0.85, 0.93, 0.98, 1.02],
    brandMix: { 'molson-coors': 0.40, 'constellation': 0.26, 'heineken': 0.15, 'craft': 0.10, 'sazerac': 0.06, 'fmb-rtd': 0.03 },
    spiritsAccounts: 10, atRisk: false,
    coachingNote: 'Solid mid-tier performer. Growing spirits in Sundance Square accounts.',
    emcoGates: { core: 0.89, import: 0.83, emerging: 0.74, combined: 0.91 },
  },
  {
    id: 'SEL-FTW-02', name: 'Luis Garcia', routeId: 'FTW-02', hometown: 'ftw', tenure: 30, tier: 2,
    attainment: 0.99,
    weeklyAttainment: [0.07, 0.14, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.83, 0.90, 0.96, 0.99],
    brandMix: { 'molson-coors': 0.39, 'constellation': 0.27, 'heineken': 0.15, 'craft': 0.10, 'sazerac': 0.05, 'fmb-rtd': 0.04 },
    spiritsAccounts: 7, atRisk: false,
    coachingNote: 'Good import balance. Opportunity to push spirits in West 7th District.',
    emcoGates: { core: 0.87, import: 0.84, emerging: 0.72, combined: 0.90 },
  },
  {
    id: 'SEL-FTW-03', name: 'Chris Brown', routeId: 'FTW-03', hometown: 'ftw', tenure: 22, tier: 3,
    attainment: 0.96,
    weeklyAttainment: [0.06, 0.13, 0.20, 0.27, 0.36, 0.44, 0.53, 0.62, 0.71, 0.79, 0.86, 0.92, 0.96],
    brandMix: { 'molson-coors': 0.42, 'constellation': 0.25, 'heineken': 0.14, 'craft': 0.09, 'sazerac': 0.04, 'fmb-rtd': 0.06 },
    spiritsAccounts: 6, atRisk: false,
    coachingNote: 'Improving. Needs to focus on display compliance in suburban grocery.',
    emcoGates: { core: 0.87, import: 0.80, emerging: 0.66, combined: 0.89 },
  },
  {
    id: 'SEL-FTW-04', name: 'Daniel Lee', routeId: 'FTW-04', hometown: 'ftw', tenure: 28, tier: 2,
    attainment: 1.00,
    weeklyAttainment: [0.07, 0.15, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.84, 0.91, 0.96, 1.00],
    brandMix: { 'molson-coors': 0.38, 'constellation': 0.27, 'heineken': 0.15, 'craft': 0.11, 'sazerac': 0.05, 'fmb-rtd': 0.04 },
    spiritsAccounts: 8, atRisk: false,
    coachingNote: 'Right at target. Consistent. Could push to Tier 1 with stronger spirits focus.',
    emcoGates: { core: 0.88, import: 0.83, emerging: 0.73, combined: 0.91 },
  },
  {
    id: 'SEL-FTW-05', name: 'Jake Williams', routeId: 'FTW-05', hometown: 'ftw', tenure: 45, tier: 1,
    attainment: 1.05,
    weeklyAttainment: [0.09, 0.17, 0.26, 0.35, 0.44, 0.54, 0.64, 0.73, 0.82, 0.90, 0.97, 1.02, 1.05],
    brandMix: { 'molson-coors': 0.34, 'constellation': 0.24, 'heineken': 0.13, 'craft': 0.16, 'sazerac': 0.09, 'fmb-rtd': 0.04 },
    spiritsAccounts: 16, atRisk: false,
    coachingNote: 'Day planner showcase rep. Craft + spirits pioneer. Highest spirits account count in company. Leading Sazerac placement initiative.',
    emcoGates: { core: 0.90, import: 0.82, emerging: 0.82, combined: 0.93 },
  },
  {
    id: 'SEL-FTW-06', name: 'Eduardo Ramirez', routeId: 'FTW-06', hometown: 'ftw', tenure: 18, tier: 3,
    attainment: 0.95,
    weeklyAttainment: [0.06, 0.12, 0.19, 0.26, 0.34, 0.42, 0.51, 0.59, 0.68, 0.76, 0.84, 0.90, 0.95],
    brandMix: { 'molson-coors': 0.43, 'constellation': 0.25, 'heineken': 0.14, 'craft': 0.08, 'sazerac': 0.04, 'fmb-rtd': 0.06 },
    spiritsAccounts: 5, atRisk: false,
    coachingNote: 'Mid-range performer. Strong domestic core but needs craft and spirits development.',
    emcoGates: { core: 0.88, import: 0.80, emerging: 0.64, combined: 0.89 },
  },
  {
    id: 'SEL-FTW-07', name: 'Will Kim', routeId: 'FTW-07', hometown: 'ftw', tenure: 10, tier: 3,
    attainment: 0.93,
    weeklyAttainment: [0.06, 0.11, 0.18, 0.25, 0.32, 0.40, 0.49, 0.57, 0.66, 0.74, 0.82, 0.88, 0.93],
    brandMix: { 'molson-coors': 0.44, 'constellation': 0.24, 'heineken': 0.13, 'craft': 0.09, 'sazerac': 0.03, 'fmb-rtd': 0.07 },
    spiritsAccounts: 4, atRisk: true,
    coachingNote: 'Inconsistent stop cadence — missing 2-3 accounts per day. Recommend route optimization review and time management coaching.',
    emcoGates: { core: 0.86, import: 0.78, emerging: 0.60, combined: 0.87 },
  },
  {
    id: 'SEL-FTW-08', name: 'Victor Okafor', routeId: 'FTW-08', hometown: 'ftw', tenure: 6, tier: 4,
    attainment: 0.88,
    weeklyAttainment: [0.05, 0.10, 0.16, 0.22, 0.29, 0.37, 0.45, 0.53, 0.62, 0.70, 0.78, 0.84, 0.88],
    brandMix: { 'molson-coors': 0.46, 'constellation': 0.22, 'heineken': 0.12, 'craft': 0.07, 'sazerac': 0.02, 'fmb-rtd': 0.11 },
    spiritsAccounts: 2, atRisk: true,
    coachingNote: 'New to Fort Worth market. High cases-per-stop shows selling ability, but low stop count indicates route unfamiliarity. GPS ride-along scheduled.',
    emcoGates: { core: 0.84, import: 0.72, emerging: 0.54, combined: 0.83 },
  },

  // ═══════════════════════════════════════════════════
  // ENNIS — 4 sellers. Manager: Tommy Nguyen
  // ═══════════════════════════════════════════════════
  {
    id: 'SEL-ENS-01', name: 'Ryan Drake', routeId: 'ENS-01', hometown: 'ens', tenure: 26, tier: 2,
    attainment: 1.01,
    weeklyAttainment: [0.08, 0.15, 0.23, 0.31, 0.40, 0.50, 0.59, 0.68, 0.77, 0.85, 0.92, 0.97, 1.01],
    brandMix: { 'molson-coors': 0.42, 'constellation': 0.24, 'heineken': 0.13, 'craft': 0.10, 'sazerac': 0.05, 'fmb-rtd': 0.06 },
    spiritsAccounts: 5, atRisk: false,
    coachingNote: 'Reliable rural route coverage. Good relationship with independent accounts.',
    emcoGates: { core: 0.88, import: 0.80, emerging: 0.72, combined: 0.90 },
  },
  {
    id: 'SEL-ENS-02', name: 'Sandra Ortiz', routeId: 'ENS-02', hometown: 'ens', tenure: 14, tier: 3,
    attainment: 0.97,
    weeklyAttainment: [0.06, 0.13, 0.20, 0.27, 0.36, 0.44, 0.53, 0.62, 0.71, 0.79, 0.86, 0.92, 0.97],
    brandMix: { 'molson-coors': 0.44, 'constellation': 0.23, 'heineken': 0.13, 'craft': 0.09, 'sazerac': 0.04, 'fmb-rtd': 0.07 },
    spiritsAccounts: 3, atRisk: false,
    coachingNote: 'Good improvement trajectory. Building import presence in Waxahachie corridor.',
    emcoGates: { core: 0.87, import: 0.78, emerging: 0.66, combined: 0.88 },
  },
  {
    id: 'SEL-ENS-03', name: 'Kevin Mills', routeId: 'ENS-03', hometown: 'ens', tenure: 10, tier: 3,
    attainment: 0.93,
    weeklyAttainment: [0.06, 0.11, 0.18, 0.25, 0.32, 0.40, 0.49, 0.57, 0.66, 0.74, 0.82, 0.88, 0.93],
    brandMix: { 'molson-coors': 0.46, 'constellation': 0.22, 'heineken': 0.12, 'craft': 0.08, 'sazerac': 0.03, 'fmb-rtd': 0.09 },
    spiritsAccounts: 2, atRisk: true,
    coachingNote: 'Below target 3 consecutive weeks. Rural territory coverage needs route optimization.',
    emcoGates: { core: 0.86, import: 0.76, emerging: 0.58, combined: 0.86 },
  },
  {
    id: 'SEL-ENS-04', name: 'Maria Flores', routeId: 'ENS-04', hometown: 'ens', tenure: 7, tier: 4,
    attainment: 0.90,
    weeklyAttainment: [0.05, 0.10, 0.16, 0.23, 0.30, 0.38, 0.46, 0.54, 0.63, 0.72, 0.80, 0.86, 0.90],
    brandMix: { 'molson-coors': 0.47, 'constellation': 0.21, 'heineken': 0.12, 'craft': 0.07, 'sazerac': 0.03, 'fmb-rtd': 0.10 },
    spiritsAccounts: 2, atRisk: true,
    coachingNote: 'New to distribution. Solid work ethic but needs training on import and craft selling.',
    emcoGates: { core: 0.84, import: 0.73, emerging: 0.54, combined: 0.84 },
  },

  // ═══════════════════════════════════════════════════
  // CORPUS CHRISTI — 6 sellers. Manager: Maria Santos
  // Coastal, founding territory
  // ═══════════════════════════════════════════════════
  {
    id: 'SEL-CRP-01', name: 'Miguel Vega', routeId: 'CRP-01', hometown: 'crp', tenure: 38, tier: 2,
    attainment: 1.03,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.32, 0.41, 0.51, 0.60, 0.69, 0.78, 0.86, 0.93, 0.99, 1.03],
    brandMix: { 'molson-coors': 0.36, 'constellation': 0.30, 'heineken': 0.16, 'craft': 0.08, 'sazerac': 0.06, 'fmb-rtd': 0.04 },
    spiritsAccounts: 8, atRisk: false,
    coachingNote: 'Veteran Corpus rep. Strong import presence in coastal accounts. Growing spirits in hotel/resort channel.',
    emcoGates: { core: 0.88, import: 0.86, emerging: 0.72, combined: 0.91 },
  },
  {
    id: 'SEL-CRP-02', name: 'Angela Rivera', routeId: 'CRP-02', hometown: 'crp', tenure: 22, tier: 2,
    attainment: 0.98,
    weeklyAttainment: [0.07, 0.14, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.83, 0.90, 0.95, 0.98],
    brandMix: { 'molson-coors': 0.37, 'constellation': 0.29, 'heineken': 0.15, 'craft': 0.09, 'sazerac': 0.05, 'fmb-rtd': 0.05 },
    spiritsAccounts: 6, atRisk: false,
    coachingNote: 'Reliable performer. Strong chain relationships. Growing import portfolio.',
    emcoGates: { core: 0.87, import: 0.84, emerging: 0.70, combined: 0.90 },
  },
  {
    id: 'SEL-CRP-03', name: 'Pedro Santos Jr.', routeId: 'CRP-03', hometown: 'crp', tenure: 30, tier: 2,
    attainment: 1.00,
    weeklyAttainment: [0.07, 0.15, 0.22, 0.30, 0.39, 0.48, 0.57, 0.66, 0.75, 0.84, 0.91, 0.96, 1.00],
    brandMix: { 'molson-coors': 0.38, 'constellation': 0.28, 'heineken': 0.15, 'craft': 0.09, 'sazerac': 0.06, 'fmb-rtd': 0.04 },
    spiritsAccounts: 7, atRisk: false,
    coachingNote: 'Consistent at target. Good spirits adoption in on-premise. Family legacy in the business.',
    emcoGates: { core: 0.88, import: 0.84, emerging: 0.74, combined: 0.91 },
  },
  {
    id: 'SEL-CRP-04', name: 'Elena Luna', routeId: 'CRP-04', hometown: 'crp', tenure: 12, tier: 3,
    attainment: 0.95,
    weeklyAttainment: [0.06, 0.12, 0.19, 0.26, 0.34, 0.42, 0.51, 0.59, 0.68, 0.76, 0.84, 0.90, 0.95],
    brandMix: { 'molson-coors': 0.40, 'constellation': 0.27, 'heineken': 0.14, 'craft': 0.08, 'sazerac': 0.04, 'fmb-rtd': 0.07 },
    spiritsAccounts: 4, atRisk: false,
    coachingNote: 'Progressing well. Good on-premise selling skills. Needs to build craft and spirits presence.',
    emcoGates: { core: 0.86, import: 0.82, emerging: 0.66, combined: 0.88 },
  },
  {
    id: 'SEL-CRP-05', name: 'James Herrera', routeId: 'CRP-05', hometown: 'crp', tenure: 6, tier: 3,
    attainment: 0.91,
    weeklyAttainment: [0.05, 0.11, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.64, 0.73, 0.80, 0.86, 0.91],
    brandMix: { 'molson-coors': 0.43, 'constellation': 0.26, 'heineken': 0.13, 'craft': 0.07, 'sazerac': 0.03, 'fmb-rtd': 0.08 },
    spiritsAccounts: 3, atRisk: true,
    coachingNote: 'Coastal territory, high travel time between stops. Needs route efficiency improvement.',
    emcoGates: { core: 0.85, import: 0.80, emerging: 0.60, combined: 0.86 },
  },
  {
    id: 'SEL-CRP-06', name: 'Vanessa Moreno', routeId: 'CRP-06', hometown: 'crp', tenure: 9, tier: 3,
    attainment: 0.88,
    weeklyAttainment: [0.05, 0.10, 0.16, 0.22, 0.29, 0.37, 0.45, 0.53, 0.62, 0.70, 0.78, 0.84, 0.88],
    brandMix: { 'molson-coors': 0.44, 'constellation': 0.25, 'heineken': 0.13, 'craft': 0.07, 'sazerac': 0.03, 'fmb-rtd': 0.08 },
    spiritsAccounts: 2, atRisk: true,
    coachingNote: 'Struggling with volume in rural coastal accounts. Consider territory realignment.',
    emcoGates: { core: 0.85, import: 0.79, emerging: 0.58, combined: 0.85 },
  },

  // ═══════════════════════════════════════════════════
  // LAREDO — 4 sellers. Manager: Roberto Garza
  // Border market, highest import mix
  // ═══════════════════════════════════════════════════
  {
    id: 'SEL-LAR-01', name: 'Fernando Reyes', routeId: 'LAR-01', hometown: 'lar', tenure: 52, tier: 2,
    attainment: 1.03,
    weeklyAttainment: [0.08, 0.16, 0.24, 0.32, 0.41, 0.51, 0.60, 0.69, 0.78, 0.86, 0.93, 0.99, 1.03],
    brandMix: { 'molson-coors': 0.28, 'constellation': 0.38, 'heineken': 0.18, 'craft': 0.06, 'sazerac': 0.05, 'fmb-rtd': 0.05 },
    spiritsAccounts: 6, atRisk: false,
    coachingNote: 'Veteran border market seller. Highest import mix in company. Key for Laredo integration.',
    emcoGates: { core: 0.86, import: 0.90, emerging: 0.68, combined: 0.91 },
  },
  {
    id: 'SEL-LAR-02', name: 'Rosa Gutierrez', routeId: 'LAR-02', hometown: 'lar', tenure: 24, tier: 2,
    attainment: 0.97,
    weeklyAttainment: [0.06, 0.13, 0.20, 0.27, 0.36, 0.44, 0.53, 0.62, 0.71, 0.79, 0.86, 0.92, 0.97],
    brandMix: { 'molson-coors': 0.26, 'constellation': 0.40, 'heineken': 0.18, 'craft': 0.06, 'sazerac': 0.05, 'fmb-rtd': 0.05 },
    spiritsAccounts: 5, atRisk: false,
    coachingNote: 'Day planner showcase rep. Bilingual (English/Spanish). Corona/Modelo specialist. Strongest import relationships in border market.',
    emcoGates: { core: 0.85, import: 0.92, emerging: 0.66, combined: 0.90 },
  },
  {
    id: 'SEL-LAR-03', name: 'Hugo Morales', routeId: 'LAR-03', hometown: 'lar', tenure: 16, tier: 3,
    attainment: 0.91,
    weeklyAttainment: [0.05, 0.11, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.64, 0.73, 0.80, 0.86, 0.91],
    brandMix: { 'molson-coors': 0.30, 'constellation': 0.36, 'heineken': 0.17, 'craft': 0.06, 'sazerac': 0.04, 'fmb-rtd': 0.07 },
    spiritsAccounts: 3, atRisk: false,
    coachingNote: 'Building into border market from Southern Distributing integration. Needs core brand development.',
    emcoGates: { core: 0.82, import: 0.88, emerging: 0.60, combined: 0.87 },
  },
  {
    id: 'SEL-LAR-04', name: 'Carlos Trevino', routeId: 'LAR-04', hometown: 'lar', tenure: 40, tier: 1,
    attainment: 1.06,
    weeklyAttainment: [0.09, 0.17, 0.26, 0.35, 0.45, 0.55, 0.65, 0.74, 0.83, 0.91, 0.98, 1.03, 1.06],
    brandMix: { 'molson-coors': 0.30, 'constellation': 0.36, 'heineken': 0.17, 'craft': 0.07, 'sazerac': 0.06, 'fmb-rtd': 0.04 },
    spiritsAccounts: 7, atRisk: false,
    coachingNote: 'Top Laredo performer. Best combined EMCO gate in border district. Strong spirits pipeline.',
    emcoGates: { core: 0.88, import: 0.90, emerging: 0.72, combined: 0.93 },
  },
];

// ═══════════════════════════════════════════════════
// 6 DISTRICT MANAGERS
// ═══════════════════════════════════════════════════
export const MANAGERS: Manager[] = [
  {
    id: 'MGR-DAL', name: 'Sarah Chen', hometown: 'dal', hometownName: 'Dallas HQ', tenure: 72,
    directReports: ['SEL-DAL-01', 'SEL-DAL-02', 'SEL-DAL-03', 'SEL-DAL-04', 'SEL-DAL-05', 'SEL-DAL-06', 'SEL-DAL-07', 'SEL-DAL-08'],
    districtKPIs: { avgAttainment: 0.989, totalCases: 305900, totalRevenue: 9177000, spiritsPenetration: 0.22, displayCompliance: 0.89 },
  },
  {
    id: 'MGR-ALN', name: 'Lisa Park', hometown: 'aln', hometownName: 'Allen', tenure: 48,
    directReports: ['SEL-ALN-01', 'SEL-ALN-02', 'SEL-ALN-03', 'SEL-ALN-04', 'SEL-ALN-05', 'SEL-ALN-06'],
    districtKPIs: { avgAttainment: 0.993, totalCases: 152400, totalRevenue: 4876800, spiritsPenetration: 0.26, displayCompliance: 0.89 },
  },
  {
    id: 'MGR-FTW', name: 'Carlos Mendoza', hometown: 'ftw', hometownName: 'Fort Worth', tenure: 60,
    directReports: ['SEL-FTW-01', 'SEL-FTW-02', 'SEL-FTW-03', 'SEL-FTW-04', 'SEL-FTW-05', 'SEL-FTW-06', 'SEL-FTW-07', 'SEL-FTW-08'],
    districtKPIs: { avgAttainment: 0.973, totalCases: 275900, totalRevenue: 8277000, spiritsPenetration: 0.19, displayCompliance: 0.86 },
  },
  {
    id: 'MGR-ENS', name: 'Tommy Nguyen', hometown: 'ens', hometownName: 'Ennis', tenure: 36,
    directReports: ['SEL-ENS-01', 'SEL-ENS-02', 'SEL-ENS-03', 'SEL-ENS-04'],
    districtKPIs: { avgAttainment: 0.953, totalCases: 82400, totalRevenue: 2307200, spiritsPenetration: 0.13, displayCompliance: 0.84 },
  },
  {
    id: 'MGR-CRP', name: 'Maria Santos', hometown: 'crp', hometownName: 'Corpus Christi', tenure: 54,
    directReports: ['SEL-CRP-01', 'SEL-CRP-02', 'SEL-CRP-03', 'SEL-CRP-04', 'SEL-CRP-05', 'SEL-CRP-06'],
    districtKPIs: { avgAttainment: 0.958, totalCases: 148800, totalRevenue: 4464000, spiritsPenetration: 0.16, displayCompliance: 0.85 },
  },
  {
    id: 'MGR-LAR', name: 'Roberto Garza', hometown: 'lar', hometownName: 'Laredo', tenure: 42,
    directReports: ['SEL-LAR-01', 'SEL-LAR-02', 'SEL-LAR-03', 'SEL-LAR-04'],
    districtKPIs: { avgAttainment: 0.993, totalCases: 72000, totalRevenue: 2520000, spiritsPenetration: 0.18, displayCompliance: 0.87 },
  },
];

// Computed helpers
export const getSellerById = (id: string): Seller | undefined =>
  SELLERS.find(s => s.id === id);

export const getSellerByRoute = (routeId: string): Seller | undefined =>
  SELLERS.find(s => s.routeId === routeId);

export const getSellersByHometown = (hometownId: string): Seller[] =>
  SELLERS.filter(s => s.hometown === hometownId);

export const getManagerByHometown = (hometownId: string): Manager | undefined =>
  MANAGERS.find(m => m.hometown === hometownId);

export const getManagerById = (id: string): Manager | undefined =>
  MANAGERS.find(m => m.id === id);
