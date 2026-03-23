// SRS Distribution — Branch Data
// Modeled after real BLT data: 551 SRS + 431 Heritage branches

export type BranchStatus = 'ACTIVE' | 'DISCONTINUED';

export interface Branch {
  id: string;
  number: string;
  name: string;
  shortName: string;
  regionId: string;
  divisionId: string;
  status: BranchStatus;
  state: string;
  city: string;
  branchManagerId: string;
  annualRevenue: number;
  ebitda: number;
  ebitdaPlan: number;
  employeeCount: number;
}

// Representative sample of branches (full dataset would be 982)
export const BRANCHES: Branch[] = [
  // SRS Core — South Central
  { id: 'b-001', number: 'SRS-0101', name: 'McKinney Roofing Supply', shortName: 'McKinney', regionId: 'south-central', divisionId: 'srs-core', status: 'ACTIVE', state: 'TX', city: 'McKinney', branchManagerId: 'e-bm-001', annualRevenue: 18400000, ebitda: 2760000, ebitdaPlan: 2580000, employeeCount: 24 },
  { id: 'b-002', number: 'SRS-0102', name: 'Dallas North Building Products', shortName: 'Dallas North', regionId: 'south-central', divisionId: 'srs-core', status: 'ACTIVE', state: 'TX', city: 'Dallas', branchManagerId: 'e-bm-002', annualRevenue: 22100000, ebitda: 3315000, ebitdaPlan: 3100000, employeeCount: 31 },
  { id: 'b-003', number: 'SRS-0103', name: 'Fort Worth Supply Center', shortName: 'Fort Worth', regionId: 'south-central', divisionId: 'srs-core', status: 'ACTIVE', state: 'TX', city: 'Fort Worth', branchManagerId: 'e-bm-003', annualRevenue: 15800000, ebitda: 2370000, ebitdaPlan: 2450000, employeeCount: 19 },
  { id: 'b-004', number: 'SRS-0104', name: 'Austin Roofing & Exteriors', shortName: 'Austin', regionId: 'south-central', divisionId: 'srs-core', status: 'ACTIVE', state: 'TX', city: 'Austin', branchManagerId: 'e-bm-004', annualRevenue: 19700000, ebitda: 2955000, ebitdaPlan: 2800000, employeeCount: 26 },
  { id: 'b-005', number: 'SRS-0105', name: 'Houston Westside Distribution', shortName: 'Houston West', regionId: 'south-central', divisionId: 'srs-core', status: 'ACTIVE', state: 'TX', city: 'Houston', branchManagerId: 'e-bm-005', annualRevenue: 24300000, ebitda: 3645000, ebitdaPlan: 3400000, employeeCount: 34 },
  { id: 'b-006', number: 'SRS-0106', name: 'San Antonio Building Supply', shortName: 'San Antonio', regionId: 'south-central', divisionId: 'srs-core', status: 'ACTIVE', state: 'TX', city: 'San Antonio', branchManagerId: 'e-bm-006', annualRevenue: 16900000, ebitda: 2535000, ebitdaPlan: 2600000, employeeCount: 22 },
  { id: 'b-007', number: 'SRS-0107', name: 'Oklahoma City Roofing', shortName: 'OKC', regionId: 'south-central', divisionId: 'srs-core', status: 'ACTIVE', state: 'OK', city: 'Oklahoma City', branchManagerId: 'e-bm-007', annualRevenue: 13200000, ebitda: 1980000, ebitdaPlan: 2050000, employeeCount: 17 },
  { id: 'b-008', number: 'SRS-0108', name: 'Tulsa Building Products', shortName: 'Tulsa', regionId: 'south-central', divisionId: 'srs-core', status: 'ACTIVE', state: 'OK', city: 'Tulsa', branchManagerId: 'e-bm-008', annualRevenue: 11800000, ebitda: 1770000, ebitdaPlan: 1800000, employeeCount: 15 },
  // SRS Core — Southeast
  { id: 'b-009', number: 'SRS-0201', name: 'Atlanta Metro Supply', shortName: 'Atlanta', regionId: 'southeast', divisionId: 'srs-core', status: 'ACTIVE', state: 'GA', city: 'Atlanta', branchManagerId: 'e-bm-009', annualRevenue: 21400000, ebitda: 3210000, ebitdaPlan: 3000000, employeeCount: 29 },
  { id: 'b-010', number: 'SRS-0202', name: 'Orlando Roofing Center', shortName: 'Orlando', regionId: 'southeast', divisionId: 'srs-core', status: 'ACTIVE', state: 'FL', city: 'Orlando', branchManagerId: 'e-bm-010', annualRevenue: 25600000, ebitda: 3840000, ebitdaPlan: 3600000, employeeCount: 36 },
  { id: 'b-011', number: 'SRS-0203', name: 'Tampa Bay Distribution', shortName: 'Tampa', regionId: 'southeast', divisionId: 'srs-core', status: 'ACTIVE', state: 'FL', city: 'Tampa', branchManagerId: 'e-bm-011', annualRevenue: 20800000, ebitda: 3120000, ebitdaPlan: 2900000, employeeCount: 28 },
  { id: 'b-012', number: 'SRS-0204', name: 'Charlotte Building Supply', shortName: 'Charlotte', regionId: 'southeast', divisionId: 'srs-core', status: 'ACTIVE', state: 'NC', city: 'Charlotte', branchManagerId: 'e-bm-012', annualRevenue: 17600000, ebitda: 2640000, ebitdaPlan: 2500000, employeeCount: 23 },
  // SRS Core — West
  { id: 'b-013', number: 'SRS-0301', name: 'Phoenix Roofing Supply', shortName: 'Phoenix', regionId: 'west', divisionId: 'srs-core', status: 'ACTIVE', state: 'AZ', city: 'Phoenix', branchManagerId: 'e-bm-013', annualRevenue: 23800000, ebitda: 3570000, ebitdaPlan: 3350000, employeeCount: 32 },
  { id: 'b-014', number: 'SRS-0302', name: 'Los Angeles Exterior Products', shortName: 'LA', regionId: 'west', divisionId: 'srs-core', status: 'ACTIVE', state: 'CA', city: 'Los Angeles', branchManagerId: 'e-bm-014', annualRevenue: 28900000, ebitda: 4335000, ebitdaPlan: 4100000, employeeCount: 38 },
  { id: 'b-015', number: 'SRS-0303', name: 'Denver Building Products', shortName: 'Denver', regionId: 'west', divisionId: 'srs-core', status: 'ACTIVE', state: 'CO', city: 'Denver', branchManagerId: 'e-bm-015', annualRevenue: 19100000, ebitda: 2865000, ebitdaPlan: 2700000, employeeCount: 25 },
  // Heritage — East
  { id: 'b-016', number: 'HER-0401', name: 'Heritage Philadelphia', shortName: 'Philly', regionId: 'heritage-east', divisionId: 'heritage', status: 'ACTIVE', state: 'PA', city: 'Philadelphia', branchManagerId: 'e-bm-016', annualRevenue: 14200000, ebitda: 2130000, ebitdaPlan: 2000000, employeeCount: 18 },
  { id: 'b-017', number: 'HER-0402', name: 'Heritage Northern Virginia', shortName: 'NoVA', regionId: 'heritage-east', divisionId: 'heritage', status: 'ACTIVE', state: 'VA', city: 'Fairfax', branchManagerId: 'e-bm-017', annualRevenue: 16800000, ebitda: 2520000, ebitdaPlan: 2400000, employeeCount: 21 },
  { id: 'b-018', number: 'HER-0403', name: 'Heritage Long Island', shortName: 'LI', regionId: 'heritage-east', divisionId: 'heritage', status: 'ACTIVE', state: 'NY', city: 'Hauppauge', branchManagerId: 'e-bm-018', annualRevenue: 15500000, ebitda: 2325000, ebitdaPlan: 2200000, employeeCount: 20 },
  // Heritage — South
  { id: 'b-019', number: 'HER-0501', name: 'Heritage Jacksonville', shortName: 'Jax', regionId: 'heritage-south', divisionId: 'heritage', status: 'ACTIVE', state: 'FL', city: 'Jacksonville', branchManagerId: 'e-bm-019', annualRevenue: 13600000, ebitda: 2040000, ebitdaPlan: 1950000, employeeCount: 17 },
  { id: 'b-020', number: 'HER-0502', name: 'Heritage Nashville', shortName: 'Nashville', regionId: 'heritage-south', divisionId: 'heritage', status: 'ACTIVE', state: 'TN', city: 'Nashville', branchManagerId: 'e-bm-020', annualRevenue: 12400000, ebitda: 1860000, ebitdaPlan: 1800000, employeeCount: 16 },
  // Discontinued branch example
  { id: 'b-021', number: 'SRS-0109', name: 'Waco Supply (Closed)', shortName: 'Waco', regionId: 'south-central', divisionId: 'srs-core', status: 'DISCONTINUED', state: 'TX', city: 'Waco', branchManagerId: 'e-bm-001', annualRevenue: 0, ebitda: 0, ebitdaPlan: 0, employeeCount: 0 },
];

export function getBranchById(id: string): Branch | undefined {
  return BRANCHES.find((b) => b.id === id);
}

export function getBranchesByRegion(regionId: string): Branch[] {
  return BRANCHES.filter((b) => b.regionId === regionId && b.status === 'ACTIVE');
}

export function getBranchesByDivision(divisionId: string): Branch[] {
  return BRANCHES.filter((b) => b.divisionId === divisionId && b.status === 'ACTIVE');
}

export function getActiveBranches(): Branch[] {
  return BRANCHES.filter((b) => b.status === 'ACTIVE');
}
