/* ═══════════════════════════════════════════════════════
   MERIDIAN — Carry Allocation & Team Economics
   ═══════════════════════════════════════════════════════ */

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  level: 'Partner' | 'Managing Director' | 'Principal' | 'Vice President' | 'Associate';
  carryPoints: number; // basis points of total carry pool
  vestingStartDate: string;
  vestingSchedule: number; // years
  vestedPct: number;
  unvestedPct: number;
  estimatedCarry: number; // at current NAV
  baseSalary: number;
  bonus: number;
  totalComp: number;
  coinvestCommitment: number;
  coinvestDeployed: number;
  dealsLed: string[];
  boardSeats: string[];
}

export const TEAM: TeamMember[] = [
  {
    id: 'TM-01',
    name: 'James Hartwell',
    title: 'Founder & Managing Partner',
    level: 'Partner',
    carryPoints: 3000, // 30% of carry pool
    vestingStartDate: '2022-01-01',
    vestingSchedule: 5,
    vestedPct: 0.80,
    unvestedPct: 0.20,
    estimatedCarry: 100_410_000,
    baseSalary: 750_000,
    bonus: 1_500_000,
    totalComp: 2_250_000,
    coinvestCommitment: 25_000_000,
    coinvestDeployed: 17_500_000,
    dealsLed: ['Heritage Benefits Group', 'Pinnacle Insurance Group', 'ClearView Wealth Mgmt'],
    boardSeats: ['Heritage Benefits Group', 'Summit Behavioral Health'],
  },
  {
    id: 'TM-02',
    name: 'Victoria Chen',
    title: 'Partner, Healthcare',
    level: 'Partner',
    carryPoints: 2500, // 25%
    vestingStartDate: '2022-01-01',
    vestingSchedule: 5,
    vestedPct: 0.80,
    unvestedPct: 0.20,
    estimatedCarry: 83_675_000,
    baseSalary: 650_000,
    bonus: 1_200_000,
    totalComp: 1_850_000,
    coinvestCommitment: 18_000_000,
    coinvestDeployed: 12_600_000,
    dealsLed: ['NorthStar Physician Partners', 'MedVista Health Partners', 'Summit Behavioral Health'],
    boardSeats: ['NorthStar Physician Partners', 'Pacific Coast Logistics'],
  },
  {
    id: 'TM-03',
    name: 'Marcus Webb',
    title: 'Partner, Industrials',
    level: 'Partner',
    carryPoints: 2000, // 20%
    vestingStartDate: '2022-06-01',
    vestingSchedule: 5,
    vestedPct: 0.72,
    unvestedPct: 0.28,
    estimatedCarry: 66_940_000,
    baseSalary: 600_000,
    bonus: 1_000_000,
    totalComp: 1_600_000,
    coinvestCommitment: 15_000_000,
    coinvestDeployed: 10_500_000,
    dealsLed: ['Sentinel Security', 'Atlas Manufacturing', 'Apex Industrial Sensors', 'Horizon Logistics'],
    boardSeats: ['Sentinel Security Technologies', 'Atlas Manufacturing Solutions'],
  },
  {
    id: 'TM-04',
    name: 'Sarah Kim',
    title: 'Managing Director, Technology',
    level: 'Managing Director',
    carryPoints: 1200, // 12%
    vestingStartDate: '2023-01-01',
    vestingSchedule: 5,
    vestedPct: 0.60,
    unvestedPct: 0.40,
    estimatedCarry: 40_164_000,
    baseSalary: 500_000,
    bonus: 750_000,
    totalComp: 1_250_000,
    coinvestCommitment: 8_000_000,
    coinvestDeployed: 5_600_000,
    dealsLed: ['Cascade Data Systems', 'TerraData Analytics'],
    boardSeats: ['Cascade Data Systems'],
  },
  {
    id: 'TM-05',
    name: 'Robert Alvarez',
    title: 'Principal',
    level: 'Principal',
    carryPoints: 700, // 7%
    vestingStartDate: '2023-06-01',
    vestingSchedule: 5,
    vestedPct: 0.52,
    unvestedPct: 0.48,
    estimatedCarry: 23_429_000,
    baseSalary: 375_000,
    bonus: 400_000,
    totalComp: 775_000,
    coinvestCommitment: 4_000_000,
    coinvestDeployed: 2_800_000,
    dealsLed: ['Pacific Coast Logistics'],
    boardSeats: [],
  },
  {
    id: 'TM-06',
    name: 'Emily Zhang',
    title: 'Vice President',
    level: 'Vice President',
    carryPoints: 400, // 4%
    vestingStartDate: '2024-01-01',
    vestingSchedule: 5,
    vestedPct: 0.40,
    unvestedPct: 0.60,
    estimatedCarry: 13_388_000,
    baseSalary: 300_000,
    bonus: 250_000,
    totalComp: 550_000,
    coinvestCommitment: 2_000_000,
    coinvestDeployed: 1_400_000,
    dealsLed: [],
    boardSeats: [],
  },
  {
    id: 'TM-07',
    name: 'Daniel Torres',
    title: 'Associate',
    level: 'Associate',
    carryPoints: 200, // 2%
    vestingStartDate: '2024-06-01',
    vestingSchedule: 5,
    vestedPct: 0.32,
    unvestedPct: 0.68,
    estimatedCarry: 6_694_000,
    baseSalary: 225_000,
    bonus: 150_000,
    totalComp: 375_000,
    coinvestCommitment: 500_000,
    coinvestDeployed: 350_000,
    dealsLed: [],
    boardSeats: [],
  },
];

export const CARRY_POOL_SUMMARY = {
  totalCarryPool: 334_700_000,
  allocatedPoints: 10000,
  reservePool: 0, // fully allocated
  vestingCliff: 1, // year
  vestingPeriod: 5, // years
  accelerationTriggers: ['Fund liquidation', 'Key person event', 'Change of control'],
  clawbackEscrow: 0.30, // 30% of carry distributions held in escrow
};

export const VESTING_SCHEDULE = [
  { year: 1, pct: 0.20, label: 'Year 1 — Cliff' },
  { year: 2, pct: 0.40, label: 'Year 2' },
  { year: 3, pct: 0.60, label: 'Year 3' },
  { year: 4, pct: 0.80, label: 'Year 4' },
  { year: 5, pct: 1.00, label: 'Year 5 — Fully Vested' },
];

export const COINVEST_PROGRAM = {
  totalCommitment: 72_500_000,
  deployed: 50_750_000,
  minCommitmentByLevel: {
    Partner: 5_000_000,
    'Managing Director': 2_000_000,
    Principal: 1_000_000,
    'Vice President': 500_000,
    Associate: 250_000,
  } as Record<string, number>,
  terms: 'Co-invest at same terms as fund. No management fee. No carry on co-invest. Pro-rata distributions.',
  taxAdvantage: 'Long-term capital gains treatment on co-invest returns (vs ordinary income on carry)',
};
