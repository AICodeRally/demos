// Ridgeline Supply Co. — Employee Hierarchy
// Role hierarchy: SVP → RVP → RSM → RM → DM → BD → BM → ABM

export type EmployeeRole = 'SVP' | 'RVP' | 'RSM' | 'RM' | 'DM' | 'BD' | 'BM' | 'ABM' | 'ASM';

export const ROLE_HIERARCHY: EmployeeRole[] = ['SVP', 'RVP', 'RSM', 'RM', 'DM', 'BD', 'BM', 'ABM'];

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  title: string;
  reportsToId: string | null;
  regionId: string | null;
  divisionId: string;
  planType: string;
  incentiveTarget: number; // decimal (e.g., 0.40 = 40% of base)
  baseSalary: number;
  branchCount: number;
  attainment: number; // current quarter attainment %
  ebitdaVsPlan: number; // %
  salesVsPlan: number; // %
  hireDate: string;
}

// Named personas for demo + expanded hierarchy
export const EMPLOYEES: Employee[] = [
  // SVP
  { id: 'e-svp-001', name: 'Paul Whelan', role: 'SVP', title: 'SVP — Ridgeline Core Division', reportsToId: null, regionId: null, divisionId: 'ridgeline-core', planType: 'Executive Incentive Plan', incentiveTarget: 0.60, baseSalary: 285000, branchCount: 551, attainment: 103.2, ebitdaVsPlan: 106.8, salesVsPlan: 104.1, hireDate: '2019-03-15' },
  { id: 'e-svp-002', name: 'Margaret Chen', role: 'SVP', title: 'SVP — Summit Division', reportsToId: null, regionId: null, divisionId: 'summit', planType: 'Executive Incentive Plan', incentiveTarget: 0.60, baseSalary: 275000, branchCount: 431, attainment: 98.7, ebitdaVsPlan: 101.2, salesVsPlan: 97.4, hireDate: '2020-07-01' },

  // RVP
  { id: 'e-rvp-001', name: 'David Kessler', role: 'RVP', title: 'RVP — South Central', reportsToId: 'e-svp-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Regional VP Incentive Plan', incentiveTarget: 0.50, baseSalary: 215000, branchCount: 87, attainment: 107.4, ebitdaVsPlan: 109.2, salesVsPlan: 106.8, hireDate: '2018-01-10' },
  { id: 'e-rvp-002', name: 'Lisa Tran', role: 'RVP', title: 'RVP — Southeast', reportsToId: 'e-svp-001', regionId: 'southeast', divisionId: 'ridgeline-core', planType: 'Regional VP Incentive Plan', incentiveTarget: 0.50, baseSalary: 210000, branchCount: 94, attainment: 104.1, ebitdaVsPlan: 105.6, salesVsPlan: 103.2, hireDate: '2019-06-15' },
  { id: 'e-rvp-003', name: 'James Morrison', role: 'RVP', title: 'RVP — West', reportsToId: 'e-svp-001', regionId: 'west', divisionId: 'ridgeline-core', planType: 'Regional VP Incentive Plan', incentiveTarget: 0.50, baseSalary: 220000, branchCount: 110, attainment: 101.8, ebitdaVsPlan: 103.4, salesVsPlan: 102.1, hireDate: '2017-09-01' },
  { id: 'e-rvp-004', name: 'Karen Blackwood', role: 'RVP', title: 'RVP — Summit East', reportsToId: 'e-svp-002', regionId: 'summit-east', divisionId: 'summit', planType: 'Regional VP Incentive Plan', incentiveTarget: 0.50, baseSalary: 205000, branchCount: 108, attainment: 99.3, ebitdaVsPlan: 100.8, salesVsPlan: 98.1, hireDate: '2021-02-01' },

  // RSM
  { id: 'e-rsm-001', name: 'Susan Boyer', role: 'RSM', title: 'Regional Sales Manager — TX North', reportsToId: 'e-rvp-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Regional Sales Manager Plan', incentiveTarget: 0.40, baseSalary: 165000, branchCount: 28, attainment: 108.2, ebitdaVsPlan: 110.4, salesVsPlan: 107.6, hireDate: '2020-03-15' },
  { id: 'e-rsm-002', name: 'Robert Vasquez', role: 'RSM', title: 'Regional Sales Manager — TX South', reportsToId: 'e-rvp-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Regional Sales Manager Plan', incentiveTarget: 0.40, baseSalary: 160000, branchCount: 24, attainment: 104.6, ebitdaVsPlan: 106.1, salesVsPlan: 103.8, hireDate: '2021-08-01' },
  { id: 'e-rsm-003', name: 'Jennifer Park', role: 'RSM', title: 'Regional Sales Manager — FL', reportsToId: 'e-rvp-002', regionId: 'southeast', divisionId: 'ridgeline-core', planType: 'Regional Sales Manager Plan', incentiveTarget: 0.40, baseSalary: 162000, branchCount: 32, attainment: 105.8, ebitdaVsPlan: 107.2, salesVsPlan: 104.9, hireDate: '2019-11-15' },

  // RM
  { id: 'e-rm-001', name: 'Michael Torres', role: 'RM', title: 'Regional Manager — DFW Metro', reportsToId: 'e-rsm-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Regional Manager Bonus Plan', incentiveTarget: 0.35, baseSalary: 135000, branchCount: 12, attainment: 112.1, ebitdaVsPlan: 114.3, salesVsPlan: 110.5, hireDate: '2021-04-01' },
  { id: 'e-rm-002', name: 'Angela Williams', role: 'RM', title: 'Regional Manager — Houston Metro', reportsToId: 'e-rsm-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Regional Manager Bonus Plan', incentiveTarget: 0.35, baseSalary: 132000, branchCount: 10, attainment: 106.8, ebitdaVsPlan: 108.2, salesVsPlan: 105.4, hireDate: '2022-01-15' },

  // DM
  { id: 'e-dm-001', name: 'Carlos Mendez', role: 'DM', title: 'District Manager — DFW North', reportsToId: 'e-rm-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'District Manager Bonus Plan', incentiveTarget: 0.30, baseSalary: 110000, branchCount: 6, attainment: 115.4, ebitdaVsPlan: 117.2, salesVsPlan: 113.8, hireDate: '2022-06-01' },
  { id: 'e-dm-002', name: 'Patricia Okonkwo', role: 'DM', title: 'District Manager — DFW South', reportsToId: 'e-rm-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'District Manager Bonus Plan', incentiveTarget: 0.30, baseSalary: 108000, branchCount: 6, attainment: 109.2, ebitdaVsPlan: 111.4, salesVsPlan: 108.1, hireDate: '2023-01-15' },

  // BD
  { id: 'e-bd-001', name: 'Steven Park', role: 'BD', title: 'Branch Director — North Texas', reportsToId: 'e-dm-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Branch Director Bonus Plan', incentiveTarget: 0.25, baseSalary: 95000, branchCount: 3, attainment: 118.6, ebitdaVsPlan: 120.1, salesVsPlan: 116.4, hireDate: '2023-03-01' },

  // BM
  { id: 'e-bm-001', name: 'Derek Lawson', role: 'BM', title: 'Branch Manager — Denver HQ', reportsToId: 'e-bd-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Branch Manager Bonus Plan', incentiveTarget: 0.20, baseSalary: 82000, branchCount: 1, attainment: 107.0, ebitdaVsPlan: 106.9, salesVsPlan: 105.2, hireDate: '2023-06-15' },
  { id: 'e-bm-002', name: 'Rachel Kim', role: 'BM', title: 'Branch Manager — Dallas North', reportsToId: 'e-bd-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Branch Manager Bonus Plan', incentiveTarget: 0.20, baseSalary: 85000, branchCount: 1, attainment: 112.3, ebitdaVsPlan: 113.8, salesVsPlan: 110.9, hireDate: '2022-09-01' },
  { id: 'e-bm-003', name: 'Nathan Cole', role: 'BM', title: 'Branch Manager — Fort Worth', reportsToId: 'e-bd-001', regionId: 'south-central', divisionId: 'ridgeline-core', planType: 'Branch Manager Bonus Plan', incentiveTarget: 0.20, baseSalary: 80000, branchCount: 1, attainment: 96.7, ebitdaVsPlan: 96.7, salesVsPlan: 95.1, hireDate: '2024-01-10' },

  // Admin personas
  { id: 'e-admin-001', name: 'Jack Egan', role: 'ASM', title: 'Finance Admin', reportsToId: null, regionId: null, divisionId: 'ridgeline-core', planType: 'Area Sales Manager Plan', incentiveTarget: 0.25, baseSalary: 95000, branchCount: 0, attainment: 0, ebitdaVsPlan: 0, salesVsPlan: 0, hireDate: '2020-01-15' },
  { id: 'e-admin-002', name: 'Holley Morris', role: 'ASM', title: 'Comp Manager', reportsToId: null, regionId: null, divisionId: 'ridgeline-core', planType: 'Area Sales Manager Plan', incentiveTarget: 0.25, baseSalary: 92000, branchCount: 0, attainment: 0, ebitdaVsPlan: 0, salesVsPlan: 0, hireDate: '2021-03-01' },
];

export function getEmployeeById(id: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.id === id);
}

export function getEmployeesByRole(role: EmployeeRole): Employee[] {
  return EMPLOYEES.filter((e) => e.role === role);
}

export function getDirectReports(managerId: string): Employee[] {
  return EMPLOYEES.filter((e) => e.reportsToId === managerId);
}

export function getRoleHierarchy(): { role: EmployeeRole; count: number; avgAttainment: number }[] {
  return ROLE_HIERARCHY.map((role) => {
    const emps = getEmployeesByRole(role);
    const avg = emps.length > 0 ? emps.reduce((s, e) => s + e.attainment, 0) / emps.length : 0;
    return { role, count: emps.length, avgAttainment: Math.round(avg * 10) / 10 };
  });
}
