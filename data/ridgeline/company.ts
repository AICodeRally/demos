// SRS Distribution — Company Structure
// Based on real SRS data: 800+ locations across 48 states, multi-entity

export interface Division {
  id: string;
  name: string;
  shortName: string;
  branchCount: number;
  employeeCount: number;
  annualRevenue: number; // millions
  color: string;
}

export interface Region {
  id: string;
  name: string;
  divisionId: string;
  states: string[];
  branchCount: number;
  color: string;
}

export const COMPANY = {
  name: 'SRS Distribution',
  tagline: 'Specialty Trade Distribution',
  parentCompany: 'The Home Depot',
  founded: 2008,
  hq: 'McKinney, TX',
  totalBranches: 982,
  totalEmployees: 14200,
  totalStates: 48,
  annualRevenue: 12800, // $12.8B
  verticals: ['Roofing', 'Landscaping', 'Pool Supplies', 'Building Products'],
  fiscalYear: 'FY2026',
  currentICMVendor: 'Varicent',
};

export const DIVISIONS: Division[] = [
  {
    id: 'srs-core',
    name: 'SRS Roofing & Building Products',
    shortName: 'SRS Core',
    branchCount: 551,
    employeeCount: 8200,
    annualRevenue: 7800,
    color: '#1E3A5F',
  },
  {
    id: 'heritage',
    name: 'Heritage Building Products',
    shortName: 'Heritage',
    branchCount: 431,
    employeeCount: 6000,
    annualRevenue: 5000,
    color: '#7C3AED',
  },
];

export const REGIONS: Region[] = [
  // SRS Core regions
  { id: 'south-central', name: 'South Central', divisionId: 'srs-core', states: ['TX', 'OK', 'AR', 'LA'], branchCount: 87, color: '#2563EB' },
  { id: 'southeast', name: 'Southeast', divisionId: 'srs-core', states: ['FL', 'GA', 'AL', 'MS', 'SC', 'NC'], branchCount: 94, color: '#10B981' },
  { id: 'northeast', name: 'Northeast', divisionId: 'srs-core', states: ['NY', 'NJ', 'PA', 'CT', 'MA', 'ME', 'NH', 'VT'], branchCount: 78, color: '#F59E0B' },
  { id: 'midwest', name: 'Midwest', divisionId: 'srs-core', states: ['IL', 'OH', 'IN', 'MI', 'WI', 'MN', 'MO', 'IA'], branchCount: 82, color: '#EF4444' },
  { id: 'west', name: 'West', divisionId: 'srs-core', states: ['CA', 'AZ', 'NV', 'CO', 'UT', 'WA', 'OR'], branchCount: 110, color: '#8B5CF6' },
  { id: 'mountain', name: 'Mountain', divisionId: 'srs-core', states: ['MT', 'WY', 'ID', 'NM', 'ND', 'SD', 'NE', 'KS'], branchCount: 100, color: '#06B6D4' },
  // Heritage regions
  { id: 'heritage-east', name: 'Heritage East', divisionId: 'heritage', states: ['NY', 'PA', 'VA', 'MD', 'DC', 'DE'], branchCount: 108, color: '#D946EF' },
  { id: 'heritage-central', name: 'Heritage Central', divisionId: 'heritage', states: ['OH', 'IN', 'KY', 'TN', 'WV'], branchCount: 96, color: '#F97316' },
  { id: 'heritage-south', name: 'Heritage South', divisionId: 'heritage', states: ['FL', 'GA', 'SC', 'NC', 'AL'], branchCount: 112, color: '#14B8A6' },
  { id: 'heritage-west', name: 'Heritage West', divisionId: 'heritage', states: ['TX', 'CO', 'AZ', 'NM', 'OK'], branchCount: 115, color: '#EC4899' },
];

export function getDivisionById(id: string): Division | undefined {
  return DIVISIONS.find((d) => d.id === id);
}

export function getRegionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}
