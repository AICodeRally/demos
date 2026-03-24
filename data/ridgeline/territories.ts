// Ridgeline Supply Co. — Territory Data
// Effective-dated territory assignments supporting acquisition rollups

import type { EmployeeRole } from './employees';

export interface Territory {
  id: string;
  name: string;
  regionId: string;
  divisionId: string;
  managerId: string;
  managerRole: EmployeeRole;
  branchIds: string[];
  effectiveStart: string;
  effectiveEnd: string | null;
  status: 'active' | 'pending' | 'archived';
  geography: string[];
  annualQuota: number;
  ytdActual: number;
}

export interface TerritoryMetric {
  territoryId: string;
  period: string;
  revenue: number;
  quota: number;
  attainment: number;
  margin: number;
  branchesAboveTarget: number;
  branchesBelowTarget: number;
  newAccountsWon: number;
  accountsLost: number;
}

export const TERRITORIES: Territory[] = [
  // SVP territories (division-level)
  {
    id: 't-svp-001',
    name: 'Ridgeline Core Division',
    regionId: 'all',
    divisionId: 'ridgeline-core',
    managerId: 'e-svp-001',
    managerRole: 'SVP',
    branchIds: ['b-001', 'b-002', 'b-003', 'b-004', 'b-005', 'b-006', 'b-007', 'b-008', 'b-009', 'b-010', 'b-011', 'b-012', 'b-013', 'b-014', 'b-015'],
    effectiveStart: '2026-01-01',
    effectiveEnd: null,
    status: 'active',
    geography: ['TX', 'OK', 'FL', 'GA', 'NC', 'AZ', 'CA', 'CO'],
    annualQuota: 7800000000,
    ytdActual: 2106000000,
  },
  // RVP territories (region-level)
  {
    id: 't-rvp-001',
    name: 'South Central Region',
    regionId: 'south-central',
    divisionId: 'ridgeline-core',
    managerId: 'e-rvp-001',
    managerRole: 'RVP',
    branchIds: ['b-001', 'b-002', 'b-003', 'b-004', 'b-005', 'b-006', 'b-007', 'b-008'],
    effectiveStart: '2026-01-01',
    effectiveEnd: null,
    status: 'active',
    geography: ['TX', 'OK', 'AR', 'LA'],
    annualQuota: 1420000000,
    ytdActual: 398000000,
  },
  {
    id: 't-rvp-002',
    name: 'Southeast Region',
    regionId: 'southeast',
    divisionId: 'ridgeline-core',
    managerId: 'e-rvp-002',
    managerRole: 'RVP',
    branchIds: ['b-009', 'b-010', 'b-011', 'b-012'],
    effectiveStart: '2026-01-01',
    effectiveEnd: null,
    status: 'active',
    geography: ['FL', 'GA', 'AL', 'MS', 'SC', 'NC'],
    annualQuota: 1560000000,
    ytdActual: 412000000,
  },
  {
    id: 't-rvp-003',
    name: 'West Region',
    regionId: 'west',
    divisionId: 'ridgeline-core',
    managerId: 'e-rvp-003',
    managerRole: 'RVP',
    branchIds: ['b-013', 'b-014', 'b-015'],
    effectiveStart: '2026-01-01',
    effectiveEnd: null,
    status: 'active',
    geography: ['CA', 'AZ', 'NV', 'CO', 'UT', 'WA', 'OR'],
    annualQuota: 1820000000,
    ytdActual: 478000000,
  },
  // RSM territories
  {
    id: 't-rsm-001',
    name: 'TX North',
    regionId: 'south-central',
    divisionId: 'ridgeline-core',
    managerId: 'e-rsm-001',
    managerRole: 'RSM',
    branchIds: ['b-001', 'b-002', 'b-003'],
    effectiveStart: '2026-01-01',
    effectiveEnd: null,
    status: 'active',
    geography: ['TX'],
    annualQuota: 560000000,
    ytdActual: 158000000,
  },
  {
    id: 't-rsm-002',
    name: 'TX South',
    regionId: 'south-central',
    divisionId: 'ridgeline-core',
    managerId: 'e-rsm-002',
    managerRole: 'RSM',
    branchIds: ['b-004', 'b-005', 'b-006'],
    effectiveStart: '2026-01-01',
    effectiveEnd: null,
    status: 'active',
    geography: ['TX'],
    annualQuota: 610000000,
    ytdActual: 167000000,
  },
  // Summit territory (pending — acquisition integration)
  {
    id: 't-rvp-004',
    name: 'Summit East Region',
    regionId: 'summit-east',
    divisionId: 'summit',
    managerId: 'e-rvp-004',
    managerRole: 'RVP',
    branchIds: ['b-016', 'b-017', 'b-018'],
    effectiveStart: '2026-01-01',
    effectiveEnd: null,
    status: 'active',
    geography: ['NY', 'PA', 'VA', 'MD', 'DC', 'DE'],
    annualQuota: 1250000000,
    ytdActual: 318000000,
  },
  // Archived territory (post-acquisition consolidation)
  {
    id: 't-legacy-001',
    name: 'Summit TX (Consolidated)',
    regionId: 'summit-west',
    divisionId: 'summit',
    managerId: 'e-rvp-001',
    managerRole: 'RVP',
    branchIds: [],
    effectiveStart: '2025-01-01',
    effectiveEnd: '2025-12-31',
    status: 'archived',
    geography: ['TX', 'OK'],
    annualQuota: 480000000,
    ytdActual: 492000000,
  },
];

export const TERRITORY_METRICS: TerritoryMetric[] = [
  // Q1 2026 metrics
  { territoryId: 't-rvp-001', period: 'Q1-2026', revenue: 398000000, quota: 355000000, attainment: 112.1, margin: 15.2, branchesAboveTarget: 6, branchesBelowTarget: 2, newAccountsWon: 47, accountsLost: 8 },
  { territoryId: 't-rvp-002', period: 'Q1-2026', revenue: 412000000, quota: 390000000, attainment: 105.6, margin: 14.8, branchesAboveTarget: 3, branchesBelowTarget: 1, newAccountsWon: 31, accountsLost: 5 },
  { territoryId: 't-rvp-003', period: 'Q1-2026', revenue: 478000000, quota: 455000000, attainment: 105.1, margin: 15.6, branchesAboveTarget: 2, branchesBelowTarget: 1, newAccountsWon: 38, accountsLost: 6 },
  { territoryId: 't-rvp-004', period: 'Q1-2026', revenue: 318000000, quota: 312500000, attainment: 101.8, margin: 14.1, branchesAboveTarget: 2, branchesBelowTarget: 1, newAccountsWon: 22, accountsLost: 4 },
  { territoryId: 't-rsm-001', period: 'Q1-2026', revenue: 158000000, quota: 140000000, attainment: 112.9, margin: 15.8, branchesAboveTarget: 2, branchesBelowTarget: 1, newAccountsWon: 18, accountsLost: 3 },
  { territoryId: 't-rsm-002', period: 'Q1-2026', revenue: 167000000, quota: 152500000, attainment: 109.5, margin: 15.1, branchesAboveTarget: 2, branchesBelowTarget: 1, newAccountsWon: 14, accountsLost: 2 },
  // Q4 2025 metrics (for trend comparison)
  { territoryId: 't-rvp-001', period: 'Q4-2025', revenue: 382000000, quota: 350000000, attainment: 109.1, margin: 14.9, branchesAboveTarget: 5, branchesBelowTarget: 3, newAccountsWon: 41, accountsLost: 11 },
  { territoryId: 't-rvp-002', period: 'Q4-2025', revenue: 395000000, quota: 385000000, attainment: 102.6, margin: 14.5, branchesAboveTarget: 2, branchesBelowTarget: 2, newAccountsWon: 28, accountsLost: 7 },
];

export function getTerritoryById(id: string): Territory | undefined {
  return TERRITORIES.find((t) => t.id === id);
}

export function getTerritoriesByRegion(regionId: string): Territory[] {
  return TERRITORIES.filter((t) => t.regionId === regionId && t.status === 'active');
}

export function getTerritoryMetrics(territoryId: string, period?: string): TerritoryMetric[] {
  return TERRITORY_METRICS.filter(
    (m) => m.territoryId === territoryId && (!period || m.period === period)
  );
}
