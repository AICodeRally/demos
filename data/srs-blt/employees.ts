// SRS Distribution — BLT Employee & Hierarchy Data
// Based on actual BLT structure: 551 SRS + 431 Heritage branches

export type Role = 'SVP' | 'RVP' | 'RSM' | 'RM' | 'DM' | 'BD' | 'BM' | 'ABM' | 'ASM';

export interface Persona {
  id: string;
  name: string;
  title: string;
  type: 'admin' | 'field';
  defaultView: string;
  description: string;
  employeeRole?: Role;
}

export interface Employee {
  id: string;
  name: string;
  role: Role;
  division: 'SRS' | 'Heritage';
  reportsToId: string | null;
  homeBranchId: string | null;
  planType: string;
  incentiveTarget: number;
  branchCount: number;
  ebitdaActual: number;
  ebitdaPlan: number;
  salesActual: number;
  salesPlan: number;
  attainment: number;
}

export const PERSONAS: Persona[] = [
  { id: 'jack-egan', name: 'Jack Egan', title: 'Finance Admin', type: 'admin', defaultView: '/srs-blt/hierarchy', description: 'Hierarchy mgmt, aggregation, full BLT view' },
  { id: 'holley-morris', name: 'Holley Morris', title: 'Comp Manager', type: 'admin', defaultView: '/srs-blt/hierarchy', description: 'Scorecard profiles, plan assignments, audit' },
  { id: 'susan-boyer', name: 'Susan Boyer', title: 'Regional Sales Manager', type: 'field', defaultView: '/srs-blt/portal', description: 'My branches, projected payout, history', employeeRole: 'RM' },
  { id: 'paul-whelan', name: 'Paul Whelan', title: 'SVP — West Division', type: 'field', defaultView: '/srs-blt/portal', description: 'Region overview, all roll-ups', employeeRole: 'SVP' },
];

// Condensed hierarchy — representative employees across both divisions
export const EMPLOYEES: Employee[] = [
  // SVPs
  { id: 'e-001', name: 'Paul Whelan', role: 'SVP', division: 'SRS', reportsToId: null, homeBranchId: null, planType: 'SVP Incentive', incentiveTarget: 450000, branchCount: 138, ebitdaActual: 42800000, ebitdaPlan: 41200000, salesActual: 285000000, salesPlan: 278000000, attainment: 104 },
  { id: 'e-002', name: 'Mark Ridley', role: 'SVP', division: 'SRS', reportsToId: null, homeBranchId: null, planType: 'SVP Incentive', incentiveTarget: 450000, branchCount: 126, ebitdaActual: 38200000, ebitdaPlan: 39500000, salesActual: 256000000, salesPlan: 262000000, attainment: 97 },
  { id: 'e-003', name: 'Diana Torres', role: 'SVP', division: 'Heritage', reportsToId: null, homeBranchId: null, planType: 'SVP Incentive', incentiveTarget: 420000, branchCount: 145, ebitdaActual: 35600000, ebitdaPlan: 34800000, salesActual: 238000000, salesPlan: 231000000, attainment: 103 },
  { id: 'e-004', name: 'Robert Chen', role: 'SVP', division: 'Heritage', reportsToId: null, homeBranchId: null, planType: 'SVP Incentive', incentiveTarget: 420000, branchCount: 132, ebitdaActual: 31200000, ebitdaPlan: 33100000, salesActual: 215000000, salesPlan: 224000000, attainment: 94 },

  // RVPs under Paul Whelan (SRS)
  { id: 'e-010', name: 'James Hartford', role: 'RVP', division: 'SRS', reportsToId: 'e-001', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 280000, branchCount: 46, ebitdaActual: 14800000, ebitdaPlan: 14200000, salesActual: 98000000, salesPlan: 95000000, attainment: 104 },
  { id: 'e-011', name: 'Karen Mitchell', role: 'RVP', division: 'SRS', reportsToId: 'e-001', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 280000, branchCount: 48, ebitdaActual: 15200000, ebitdaPlan: 14600000, salesActual: 101000000, salesPlan: 97000000, attainment: 104 },
  { id: 'e-012', name: 'David Park', role: 'RVP', division: 'SRS', reportsToId: 'e-001', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 280000, branchCount: 44, ebitdaActual: 12800000, ebitdaPlan: 12400000, salesActual: 86000000, salesPlan: 86000000, attainment: 103 },

  // RVPs under Mark Ridley (SRS)
  { id: 'e-013', name: 'Lisa Bergstrom', role: 'RVP', division: 'SRS', reportsToId: 'e-002', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 280000, branchCount: 42, ebitdaActual: 13100000, ebitdaPlan: 13600000, salesActual: 88000000, salesPlan: 91000000, attainment: 96 },
  { id: 'e-014', name: 'Tom Nakamura', role: 'RVP', division: 'SRS', reportsToId: 'e-002', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 280000, branchCount: 44, ebitdaActual: 12600000, ebitdaPlan: 12800000, salesActual: 84000000, salesPlan: 85000000, attainment: 99 },
  { id: 'e-015', name: 'Angela Washington', role: 'RVP', division: 'SRS', reportsToId: 'e-002', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 280000, branchCount: 40, ebitdaActual: 12500000, ebitdaPlan: 13100000, salesActual: 84000000, salesPlan: 86000000, attainment: 95 },

  // RVPs under Diana Torres (Heritage)
  { id: 'e-020', name: 'Michael Brennan', role: 'RVP', division: 'Heritage', reportsToId: 'e-003', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 260000, branchCount: 50, ebitdaActual: 12200000, ebitdaPlan: 11800000, salesActual: 82000000, salesPlan: 79000000, attainment: 103 },
  { id: 'e-021', name: 'Sarah Kowalski', role: 'RVP', division: 'Heritage', reportsToId: 'e-003', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 260000, branchCount: 48, ebitdaActual: 12000000, ebitdaPlan: 11700000, salesActual: 80000000, salesPlan: 78000000, attainment: 103 },
  { id: 'e-022', name: 'Frank DeLuca', role: 'RVP', division: 'Heritage', reportsToId: 'e-003', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 260000, branchCount: 47, ebitdaActual: 11400000, ebitdaPlan: 11300000, salesActual: 76000000, salesPlan: 74000000, attainment: 101 },

  // RVPs under Robert Chen (Heritage)
  { id: 'e-023', name: 'Patricia Gomez', role: 'RVP', division: 'Heritage', reportsToId: 'e-004', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 260000, branchCount: 45, ebitdaActual: 10800000, ebitdaPlan: 11400000, salesActual: 74000000, salesPlan: 77000000, attainment: 95 },
  { id: 'e-024', name: 'William Tanaka', role: 'RVP', division: 'Heritage', reportsToId: 'e-004', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 260000, branchCount: 44, ebitdaActual: 10200000, ebitdaPlan: 10900000, salesActual: 71000000, salesPlan: 74000000, attainment: 94 },
  { id: 'e-025', name: 'Jennifer Okafor', role: 'RVP', division: 'Heritage', reportsToId: 'e-004', homeBranchId: null, planType: 'RVP Incentive', incentiveTarget: 260000, branchCount: 43, ebitdaActual: 10200000, ebitdaPlan: 10800000, salesActual: 70000000, salesPlan: 73000000, attainment: 94 },

  // RSMs under James Hartford (SRS)
  { id: 'e-030', name: 'Susan Boyer', role: 'RM', division: 'SRS', reportsToId: 'e-010', homeBranchId: 'b-001', planType: 'RM Scorecard', incentiveTarget: 120000, branchCount: 12, ebitdaActual: 3800000, ebitdaPlan: 3600000, salesActual: 25000000, salesPlan: 24000000, attainment: 106 },
  { id: 'e-031', name: 'Ray Donovan', role: 'RM', division: 'SRS', reportsToId: 'e-010', homeBranchId: 'b-010', planType: 'RM Scorecard', incentiveTarget: 120000, branchCount: 11, ebitdaActual: 3500000, ebitdaPlan: 3400000, salesActual: 23000000, salesPlan: 23000000, attainment: 103 },
  { id: 'e-032', name: 'Anita Patel', role: 'RM', division: 'SRS', reportsToId: 'e-010', homeBranchId: 'b-020', planType: 'RM Scorecard', incentiveTarget: 120000, branchCount: 11, ebitdaActual: 3700000, ebitdaPlan: 3500000, salesActual: 25000000, salesPlan: 24000000, attainment: 106 },
  { id: 'e-033', name: 'Chris Hawkins', role: 'RM', division: 'SRS', reportsToId: 'e-010', homeBranchId: 'b-030', planType: 'RM Scorecard', incentiveTarget: 120000, branchCount: 12, ebitdaActual: 3800000, ebitdaPlan: 3700000, salesActual: 25000000, salesPlan: 24000000, attainment: 103 },

  // BMs under Susan Boyer
  { id: 'e-040', name: 'Derek Martinez', role: 'BM', division: 'SRS', reportsToId: 'e-030', homeBranchId: 'b-001', planType: 'BM Scorecard', incentiveTarget: 45000, branchCount: 1, ebitdaActual: 380000, ebitdaPlan: 350000, salesActual: 2500000, salesPlan: 2400000, attainment: 109 },
  { id: 'e-041', name: 'Nicole Foster', role: 'BM', division: 'SRS', reportsToId: 'e-030', homeBranchId: 'b-002', planType: 'BM Scorecard', incentiveTarget: 45000, branchCount: 1, ebitdaActual: 310000, ebitdaPlan: 300000, salesActual: 2100000, salesPlan: 2000000, attainment: 103 },
  { id: 'e-042', name: 'Tyler Washington', role: 'BM', division: 'SRS', reportsToId: 'e-030', homeBranchId: 'b-003', planType: 'BM Scorecard', incentiveTarget: 45000, branchCount: 1, ebitdaActual: 290000, ebitdaPlan: 310000, salesActual: 1900000, salesPlan: 2100000, attainment: 94 },
  { id: 'e-043', name: 'Amanda Chen', role: 'BM', division: 'SRS', reportsToId: 'e-030', homeBranchId: 'b-004', planType: 'BM Scorecard', incentiveTarget: 45000, branchCount: 1, ebitdaActual: 340000, ebitdaPlan: 320000, salesActual: 2300000, salesPlan: 2200000, attainment: 106 },
];

export function getDirectReports(employeeId: string): Employee[] {
  return EMPLOYEES.filter((e) => e.reportsToId === employeeId);
}

export function getEmployeesByRole(role: Role): Employee[] {
  return EMPLOYEES.filter((e) => e.role === role);
}

export function getEmployeesByDivision(division: 'SRS' | 'Heritage'): Employee[] {
  return EMPLOYEES.filter((e) => e.division === division);
}

export function getEmployeeById(id: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.id === id);
}

export const ROLE_COLORS: Record<Role, string> = {
  SVP: '#7C3AED', RVP: '#2563EB', RSM: '#0891B2', RM: '#10B981',
  DM: '#F59E0B', BD: '#EF4444', BM: '#06B6D4', ABM: '#94A3B8', ASM: '#EC4899',
};

export const ROLE_LABELS: Record<Role, string> = {
  SVP: 'Senior Vice President', RVP: 'Regional Vice President', RSM: 'Regional Sales Manager',
  RM: 'Regional Manager', DM: 'District Manager', BD: 'Branch Director',
  BM: 'Branch Manager', ABM: 'Asst Branch Manager', ASM: 'Area Sales Manager',
};
