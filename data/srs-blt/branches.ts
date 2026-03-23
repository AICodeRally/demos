// SRS Distribution — Branch Data
// Represents 982 branches across SRS Core (551) and Heritage (431) divisions

export type BranchStatus = 'ACTIVE' | 'DISCONTINUED' | 'MERGED' | 'GREENFIELD';

export interface Branch {
  id: string;
  number: string;
  name: string;
  region: string;
  division: 'SRS' | 'Heritage';
  creditRegion: string;
  state: string;
  status: BranchStatus;
  managerId: string | null;
  ebitdaActual: number;
  ebitdaPlan: number;
  salesActual: number;
  salesPlan: number;
}

// Representative sample of branches (full dataset is 982)
export const BRANCHES: Branch[] = [
  // SRS Core — Susan Boyer's branches
  { id: 'b-001', number: '1042', name: 'SRS Dallas North', region: 'South Central', division: 'SRS', creditRegion: 'TX-North', state: 'TX', status: 'ACTIVE', managerId: 'e-040', ebitdaActual: 380000, ebitdaPlan: 350000, salesActual: 2500000, salesPlan: 2400000 },
  { id: 'b-002', number: '1043', name: 'SRS Dallas South', region: 'South Central', division: 'SRS', creditRegion: 'TX-South', state: 'TX', status: 'ACTIVE', managerId: 'e-041', ebitdaActual: 310000, ebitdaPlan: 300000, salesActual: 2100000, salesPlan: 2000000 },
  { id: 'b-003', number: '1087', name: 'SRS Fort Worth', region: 'South Central', division: 'SRS', creditRegion: 'TX-North', state: 'TX', status: 'ACTIVE', managerId: 'e-042', ebitdaActual: 290000, ebitdaPlan: 310000, salesActual: 1900000, salesPlan: 2100000 },
  { id: 'b-004', number: '1112', name: 'SRS Austin', region: 'South Central', division: 'SRS', creditRegion: 'TX-Central', state: 'TX', status: 'ACTIVE', managerId: 'e-043', ebitdaActual: 340000, ebitdaPlan: 320000, salesActual: 2300000, salesPlan: 2200000 },
  { id: 'b-005', number: '1156', name: 'SRS San Antonio', region: 'South Central', division: 'SRS', creditRegion: 'TX-South', state: 'TX', status: 'ACTIVE', managerId: null, ebitdaActual: 280000, ebitdaPlan: 290000, salesActual: 1900000, salesPlan: 1900000 },
  { id: 'b-006', number: '1201', name: 'SRS Houston West', region: 'South Central', division: 'SRS', creditRegion: 'TX-Gulf', state: 'TX', status: 'ACTIVE', managerId: null, ebitdaActual: 420000, ebitdaPlan: 400000, salesActual: 2800000, salesPlan: 2700000 },
  { id: 'b-007', number: '1202', name: 'SRS Houston East', region: 'South Central', division: 'SRS', creditRegion: 'TX-Gulf', state: 'TX', status: 'ACTIVE', managerId: null, ebitdaActual: 390000, ebitdaPlan: 380000, salesActual: 2600000, salesPlan: 2500000 },
  { id: 'b-008', number: '1245', name: 'SRS Oklahoma City', region: 'South Central', division: 'SRS', creditRegion: 'OK', state: 'OK', status: 'ACTIVE', managerId: null, ebitdaActual: 260000, ebitdaPlan: 270000, salesActual: 1700000, salesPlan: 1800000 },
  { id: 'b-009', number: '1301', name: 'SRS Tulsa', region: 'South Central', division: 'SRS', creditRegion: 'OK', state: 'OK', status: 'ACTIVE', managerId: null, ebitdaActual: 220000, ebitdaPlan: 230000, salesActual: 1500000, salesPlan: 1500000 },

  // More SRS branches across regions
  { id: 'b-010', number: '2001', name: 'SRS Atlanta', region: 'Southeast', division: 'SRS', creditRegion: 'GA', state: 'GA', status: 'ACTIVE', managerId: null, ebitdaActual: 360000, ebitdaPlan: 340000, salesActual: 2400000, salesPlan: 2300000 },
  { id: 'b-011', number: '2015', name: 'SRS Charlotte', region: 'Southeast', division: 'SRS', creditRegion: 'NC', state: 'NC', status: 'ACTIVE', managerId: null, ebitdaActual: 310000, ebitdaPlan: 300000, salesActual: 2100000, salesPlan: 2000000 },
  { id: 'b-012', number: '2042', name: 'SRS Tampa', region: 'Southeast', division: 'SRS', creditRegion: 'FL-West', state: 'FL', status: 'ACTIVE', managerId: null, ebitdaActual: 400000, ebitdaPlan: 380000, salesActual: 2700000, salesPlan: 2600000 },
  { id: 'b-013', number: '2055', name: 'SRS Orlando', region: 'Southeast', division: 'SRS', creditRegion: 'FL-Central', state: 'FL', status: 'ACTIVE', managerId: null, ebitdaActual: 350000, ebitdaPlan: 340000, salesActual: 2400000, salesPlan: 2300000 },

  { id: 'b-020', number: '3001', name: 'SRS Phoenix', region: 'West', division: 'SRS', creditRegion: 'AZ', state: 'AZ', status: 'ACTIVE', managerId: null, ebitdaActual: 370000, ebitdaPlan: 350000, salesActual: 2500000, salesPlan: 2400000 },
  { id: 'b-021', number: '3015', name: 'SRS Denver', region: 'Mountain', division: 'SRS', creditRegion: 'CO', state: 'CO', status: 'ACTIVE', managerId: null, ebitdaActual: 340000, ebitdaPlan: 330000, salesActual: 2300000, salesPlan: 2200000 },
  { id: 'b-022', number: '3030', name: 'SRS Salt Lake City', region: 'Mountain', division: 'SRS', creditRegion: 'UT', state: 'UT', status: 'ACTIVE', managerId: null, ebitdaActual: 280000, ebitdaPlan: 280000, salesActual: 1900000, salesPlan: 1900000 },

  { id: 'b-030', number: '4001', name: 'SRS Chicago', region: 'Midwest', division: 'SRS', creditRegion: 'IL', state: 'IL', status: 'ACTIVE', managerId: null, ebitdaActual: 380000, ebitdaPlan: 370000, salesActual: 2600000, salesPlan: 2500000 },
  { id: 'b-031', number: '4020', name: 'SRS Detroit', region: 'Midwest', division: 'SRS', creditRegion: 'MI', state: 'MI', status: 'ACTIVE', managerId: null, ebitdaActual: 310000, ebitdaPlan: 320000, salesActual: 2100000, salesPlan: 2200000 },
  { id: 'b-032', number: '4035', name: 'SRS Minneapolis', region: 'Midwest', division: 'SRS', creditRegion: 'MN', state: 'MN', status: 'ACTIVE', managerId: null, ebitdaActual: 290000, ebitdaPlan: 290000, salesActual: 1900000, salesPlan: 1900000 },

  // Heritage branches
  { id: 'b-050', number: 'H-101', name: 'Heritage Roofing Atlanta', region: 'Southeast', division: 'Heritage', creditRegion: 'GA', state: 'GA', status: 'ACTIVE', managerId: null, ebitdaActual: 280000, ebitdaPlan: 270000, salesActual: 1900000, salesPlan: 1800000 },
  { id: 'b-051', number: 'H-115', name: 'Heritage Supply Nashville', region: 'Southeast', division: 'Heritage', creditRegion: 'TN', state: 'TN', status: 'ACTIVE', managerId: null, ebitdaActual: 240000, ebitdaPlan: 250000, salesActual: 1600000, salesPlan: 1700000 },
  { id: 'b-052', number: 'H-130', name: 'Heritage Building Birmingham', region: 'Southeast', division: 'Heritage', creditRegion: 'AL', state: 'AL', status: 'ACTIVE', managerId: null, ebitdaActual: 210000, ebitdaPlan: 220000, salesActual: 1400000, salesPlan: 1500000 },
  { id: 'b-053', number: 'H-201', name: 'Heritage Dallas', region: 'South Central', division: 'Heritage', creditRegion: 'TX-North', state: 'TX', status: 'ACTIVE', managerId: null, ebitdaActual: 300000, ebitdaPlan: 290000, salesActual: 2000000, salesPlan: 1900000 },
  { id: 'b-054', number: 'H-215', name: 'Heritage Phoenix', region: 'West', division: 'Heritage', creditRegion: 'AZ', state: 'AZ', status: 'ACTIVE', managerId: null, ebitdaActual: 260000, ebitdaPlan: 260000, salesActual: 1800000, salesPlan: 1800000 },
  { id: 'b-055', number: 'H-301', name: 'Heritage Chicago', region: 'Midwest', division: 'Heritage', creditRegion: 'IL', state: 'IL', status: 'ACTIVE', managerId: null, ebitdaActual: 270000, ebitdaPlan: 280000, salesActual: 1800000, salesPlan: 1900000 },
  { id: 'b-056', number: 'H-320', name: 'Heritage Columbus', region: 'Midwest', division: 'Heritage', creditRegion: 'OH', state: 'OH', status: 'ACTIVE', managerId: null, ebitdaActual: 230000, ebitdaPlan: 240000, salesActual: 1500000, salesPlan: 1600000 },
  { id: 'b-057', number: 'H-401', name: 'Heritage Seattle', region: 'Pacific NW', division: 'Heritage', creditRegion: 'WA', state: 'WA', status: 'ACTIVE', managerId: null, ebitdaActual: 310000, ebitdaPlan: 300000, salesActual: 2100000, salesPlan: 2000000 },
  { id: 'b-058', number: 'H-415', name: 'Heritage Portland', region: 'Pacific NW', division: 'Heritage', creditRegion: 'OR', state: 'OR', status: 'ACTIVE', managerId: null, ebitdaActual: 250000, ebitdaPlan: 260000, salesActual: 1700000, salesPlan: 1800000 },

  // Greenfield / special status
  { id: 'b-060', number: '5001', name: 'SRS Boise (Greenfield)', region: 'Mountain', division: 'SRS', creditRegion: 'ID', state: 'ID', status: 'GREENFIELD', managerId: null, ebitdaActual: 80000, ebitdaPlan: 150000, salesActual: 600000, salesPlan: 1000000 },
  { id: 'b-061', number: 'H-500', name: 'Heritage Reno (Merged)', region: 'West', division: 'Heritage', creditRegion: 'NV', state: 'NV', status: 'MERGED', managerId: null, ebitdaActual: 0, ebitdaPlan: 180000, salesActual: 0, salesPlan: 1200000 },
];

// Aggregate stats
export const BRANCH_STATS = {
  totalBranches: 982,
  srsBranches: 551,
  heritageBranches: 431,
  activeBranches: 948,
  greenfieldBranches: 18,
  mergedBranches: 12,
  discontinuedBranches: 4,
  states: 48,
  regions: 10,
};

export function getBranchesByDivision(division: 'SRS' | 'Heritage'): Branch[] {
  return BRANCHES.filter((b) => b.division === division);
}

export function getBranchesByRegion(region: string): Branch[] {
  return BRANCHES.filter((b) => b.region === region);
}

export const REGIONS = [
  { name: 'South Central', srsBranches: 89, heritageBranches: 62, states: ['TX', 'OK', 'AR', 'LA'] },
  { name: 'Southeast', srsBranches: 78, heritageBranches: 71, states: ['GA', 'FL', 'NC', 'SC', 'TN', 'AL', 'MS'] },
  { name: 'West', srsBranches: 68, heritageBranches: 55, states: ['CA', 'AZ', 'NV'] },
  { name: 'Midwest', srsBranches: 72, heritageBranches: 58, states: ['IL', 'MI', 'OH', 'IN', 'WI', 'MN'] },
  { name: 'Mountain', srsBranches: 52, heritageBranches: 38, states: ['CO', 'UT', 'ID', 'MT', 'WY'] },
  { name: 'Northeast', srsBranches: 61, heritageBranches: 48, states: ['NY', 'PA', 'NJ', 'CT', 'MA'] },
  { name: 'Pacific NW', srsBranches: 42, heritageBranches: 36, states: ['WA', 'OR'] },
  { name: 'Mid-Atlantic', srsBranches: 38, heritageBranches: 28, states: ['VA', 'MD', 'DC', 'DE'] },
  { name: 'Great Plains', srsBranches: 28, heritageBranches: 20, states: ['KS', 'NE', 'IA', 'MO'] },
  { name: 'New England', srsBranches: 23, heritageBranches: 15, states: ['ME', 'NH', 'VT', 'RI'] },
];
