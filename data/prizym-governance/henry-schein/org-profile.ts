// Synthetic tenant profile for the Gold Standard demo. Henry Schein is
// used as the plausible prospect persona — this data is invented for
// the showcase, not sourced from any real HS engagement.

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

export const henryScheinOrgProfile: OrgProfile = {
  name: 'Henry Schein Industries',
  shortName: 'Henry Schein',
  industry: 'Healthcare Distribution',
  subIndustry: 'Medical & Dental Practice Solutions',
  entityType: 'Public (SOX)',
  headquarters: 'Melville, NY',
  region: 'Global',
  employees: 23500,
  salesHeadcount: 4200,
  revenueUsd: 12_600_000_000,
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
