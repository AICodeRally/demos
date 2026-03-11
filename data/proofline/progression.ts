export interface WeekSnapshot {
  week: number;
  avgAttainment: number;
  sellersAtRisk: number;
  totalPayout: number;
  topPerformer: string;
  milestone?: string;
  milestoneDetail?: string;
}

export const PROGRESSION: WeekSnapshot[] = [
  {
    week: 1,
    avgAttainment: 0.06,
    sellersAtRisk: 0,
    totalPayout: 45000,
    topPerformer: 'M. Davis',
    milestone: 'Day 1 Launch',
    milestoneDetail: 'All 24 comp plans activated. Sellers see targets, gates, and earning potential from day one.',
  },
  {
    week: 2,
    avgAttainment: 0.13,
    sellersAtRisk: 0,
    totalPayout: 105000,
    topPerformer: 'M. Davis',
  },
  {
    week: 3,
    avgAttainment: 0.20,
    sellersAtRisk: 1,
    totalPayout: 195000,
    topPerformer: 'T. Washington',
  },
  {
    week: 4,
    avgAttainment: 0.28,
    sellersAtRisk: 2,
    totalPayout: 380000,
    topPerformer: 'T. Washington',
    milestone: 'Early Leaders',
    milestoneDetail: 'Top performers emerge. BBI gates starting to differentiate seller behavior.',
  },
  {
    week: 5,
    avgAttainment: 0.36,
    sellersAtRisk: 2,
    totalPayout: 510000,
    topPerformer: 'M. Davis',
  },
  {
    week: 6,
    avgAttainment: 0.45,
    sellersAtRisk: 3,
    totalPayout: 680000,
    topPerformer: 'T. Washington',
  },
  {
    week: 7,
    avgAttainment: 0.55,
    sellersAtRisk: 4,
    totalPayout: 920000,
    topPerformer: 'J. Martinez',
    milestone: 'Mid-Quarter Review',
    milestoneDetail: '68% attainment average. 4 sellers flagged for coaching. Kicker evaluation begins.',
  },
  {
    week: 8,
    avgAttainment: 0.63,
    sellersAtRisk: 4,
    totalPayout: 1120000,
    topPerformer: 'M. Davis',
  },
  {
    week: 9,
    avgAttainment: 0.72,
    sellersAtRisk: 3,
    totalPayout: 1380000,
    topPerformer: 'T. Washington',
  },
  {
    week: 10,
    avgAttainment: 0.78,
    sellersAtRisk: 3,
    totalPayout: 1680000,
    topPerformer: 'M. Davis',
    milestone: 'Kicker Live',
    milestoneDetail: 'Shiner Spirits kicker launched Aug 1. Laredo acquisition ramp tracking to plan.',
  },
  {
    week: 11,
    avgAttainment: 0.86,
    sellersAtRisk: 2,
    totalPayout: 2080000,
    topPerformer: 'T. Washington',
  },
  {
    week: 12,
    avgAttainment: 0.94,
    sellersAtRisk: 1,
    totalPayout: 2600000,
    topPerformer: 'M. Davis',
  },
  {
    week: 13,
    avgAttainment: 1.03,
    sellersAtRisk: 1,
    totalPayout: 3200000,
    topPerformer: 'T. Washington',
    milestone: 'Quarter Close',
    milestoneDetail: '103% attainment. $3.2M total payout. Revenue target exceeded by $1.4M.',
  },
];
