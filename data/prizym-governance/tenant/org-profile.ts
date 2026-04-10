// Synthetic tenant profile for the SGM Gold Standard demo. Northwind
// Distribution is an invented demo company — not a real engagement.

export interface OrgProfile {
  name: string;
  shortName: string;
  industry: string;
  subIndustry: string;
  entityType: 'Public (SOX)' | 'Private' | 'PE-backed';
  headquarters: string;
  region: 'Americas' | 'EMEA' | 'APAC' | 'Global';
  employees: number;
  salesHeadcount: number;
  revenueUsd: number;
  fiscalYearEnd: string; // MM-DD
  sponsor: {
    name: string;
    title: string;
  };
  assessmentOwner: {
    name: string;
    title: string;
  };
  engagementStartedAt: string; // ISO
  plansInScope: number;
  countriesInScope: number;
  notes: string;
}

export const demoOrgProfile: OrgProfile = {
  name: 'Northwind Distribution',
  shortName: 'Northwind',
  industry: 'Healthcare Distribution',
  subIndustry: 'Medical, Dental & Animal Health Supply',
  entityType: 'Public (SOX)',
  headquarters: 'Seattle, WA',
  region: 'Global',
  employees: 22400,
  salesHeadcount: 3800,
  revenueUsd: 11_200_000_000,
  fiscalYearEnd: '12-31',
  sponsor: {
    name: 'Avery Caldwell',
    title: 'SVP, Global Sales Operations',
  },
  assessmentOwner: {
    name: 'Jordan Pace',
    title: 'Director, Sales Compensation',
  },
  engagementStartedAt: '2026-03-02T00:00:00.000Z',
  plansInScope: 14,
  countriesInScope: 32,
  notes:
    'Multi-region SOX-governed compensation program across Dental, Medical, and Animal Health lines of business. Prior governance maturity concentrated in Design and Oversee quadrants; Operate and Dispute are the known gap areas.',
};
