export interface WeeklyTotal {
  week: number;
  date: string;
  total: number;
  online: number;
  cash: number;
  check: number;
}

export interface FundAllocation {
  fund: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface Donation {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  fund: string;
  method: 'online' | 'check' | 'cash' | 'ach';
  date: string;
}

export interface PledgeCampaign {
  id: string;
  name: string;
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  pledgeCount: number;
}

export const weeklyTotals: WeeklyTotal[] = [
  { week: 1, date: '2025-01-05', total: 32400, online: 22050, cash: 3240, check: 7110 },
  { week: 2, date: '2025-01-12', total: 34200, online: 23250, cash: 3420, check: 7530 },
  { week: 3, date: '2025-01-19', total: 33800, online: 22990, cash: 3380, check: 7430 },
  { week: 4, date: '2025-01-26', total: 35100, online: 23870, cash: 3510, check: 7720 },
  { week: 5, date: '2025-02-02', total: 36500, online: 24820, cash: 3650, check: 8030 },
  { week: 6, date: '2025-02-09', total: 34900, online: 23730, cash: 3490, check: 7680 },
  { week: 7, date: '2025-02-16', total: 35700, online: 24280, cash: 3570, check: 7850 },
  { week: 8, date: '2025-02-23', total: 33600, online: 22850, cash: 3360, check: 7390 },
  { week: 9, date: '2025-03-02', total: 36200, online: 24620, cash: 3620, check: 7960 },
  { week: 10, date: '2025-03-09', total: 35800, online: 24340, cash: 3580, check: 7880 },
  { week: 11, date: '2025-03-16', total: 34500, online: 23460, cash: 3450, check: 7590 },
  { week: 12, date: '2025-03-23', total: 37200, online: 25300, cash: 3720, check: 8180 },
  { week: 13, date: '2025-03-30', total: 35400, online: 24070, cash: 3540, check: 7790 },
  { week: 14, date: '2025-04-06', total: 42800, online: 29100, cash: 4280, check: 9420 },
  { week: 15, date: '2025-04-13', total: 48500, online: 32980, cash: 4850, check: 10670 },
  { week: 16, date: '2025-04-20', total: 52000, online: 35360, cash: 5200, check: 11440 },
  { week: 17, date: '2025-04-27', total: 38900, online: 26450, cash: 3890, check: 8560 },
  { week: 18, date: '2025-05-04', total: 36100, online: 24550, cash: 3610, check: 7940 },
  { week: 19, date: '2025-05-11', total: 34800, online: 23660, cash: 3480, check: 7660 },
  { week: 20, date: '2025-05-18', total: 35600, online: 24210, cash: 3560, check: 7830 },
  { week: 21, date: '2025-05-25', total: 33900, online: 23050, cash: 3390, check: 7460 },
  { week: 22, date: '2025-06-01', total: 37500, online: 25500, cash: 3750, check: 8250 },
  { week: 23, date: '2025-06-08', total: 36800, online: 25020, cash: 3680, check: 8100 },
  { week: 24, date: '2025-06-15', total: 35200, online: 23940, cash: 3520, check: 7740 },
  { week: 25, date: '2025-06-22', total: 34700, online: 23600, cash: 3470, check: 7630 },
  { week: 26, date: '2025-06-29', total: 33500, online: 22780, cash: 3350, check: 7370 },
  { week: 27, date: '2025-07-06', total: 31200, online: 21220, cash: 3120, check: 6860 },
  { week: 28, date: '2025-07-13', total: 30800, online: 20940, cash: 3080, check: 6780 },
  { week: 29, date: '2025-07-20', total: 32400, online: 22030, cash: 3240, check: 7130 },
  { week: 30, date: '2025-07-27', total: 31900, online: 21690, cash: 3190, check: 7020 },
  { week: 31, date: '2025-08-03', total: 33100, online: 22510, cash: 3310, check: 7280 },
  { week: 32, date: '2025-08-10', total: 32700, online: 22240, cash: 3270, check: 7190 },
  { week: 33, date: '2025-08-17', total: 34300, online: 23320, cash: 3430, check: 7550 },
  { week: 34, date: '2025-08-24', total: 33600, online: 22850, cash: 3360, check: 7390 },
  { week: 35, date: '2025-08-31', total: 35900, online: 24410, cash: 3590, check: 7900 },
  { week: 36, date: '2025-09-07', total: 36400, online: 24750, cash: 3640, check: 8010 },
  { week: 37, date: '2025-09-14', total: 35100, online: 23870, cash: 3510, check: 7720 },
  { week: 38, date: '2025-09-21', total: 34800, online: 23660, cash: 3480, check: 7660 },
  { week: 39, date: '2025-09-28', total: 36700, online: 24960, cash: 3670, check: 8070 },
  { week: 40, date: '2025-10-05', total: 37200, online: 25300, cash: 3720, check: 8180 },
  { week: 41, date: '2025-10-12', total: 35800, online: 24340, cash: 3580, check: 7880 },
  { week: 42, date: '2025-10-19', total: 34600, online: 23530, cash: 3460, check: 7610 },
  { week: 43, date: '2025-10-26', total: 35300, online: 24000, cash: 3530, check: 7770 },
  { week: 44, date: '2025-11-02', total: 36900, online: 25090, cash: 3690, check: 8120 },
  { week: 45, date: '2025-11-09', total: 38200, online: 25980, cash: 3820, check: 8400 },
  { week: 46, date: '2025-11-16', total: 37800, online: 25700, cash: 3780, check: 8320 },
  { week: 47, date: '2025-11-23', total: 34200, online: 23250, cash: 3420, check: 7530 },
  { week: 48, date: '2025-11-30', total: 39500, online: 26860, cash: 3950, check: 8690 },
  { week: 49, date: '2025-12-07', total: 41200, online: 28020, cash: 4120, check: 9060 },
  { week: 50, date: '2025-12-14', total: 43800, online: 29790, cash: 4380, check: 9630 },
  { week: 51, date: '2025-12-21', total: 56200, online: 38220, cash: 5620, check: 12360 },
  { week: 52, date: '2025-12-28', total: 38700, online: 26320, cash: 3870, check: 8510 },
];

export const fundAllocations: FundAllocation[] = [
  { fund: 'General Fund', amount: 1108350, percentage: 60, color: '#2563EB' },
  { fund: 'Building Fund', amount: 277087.50, percentage: 15, color: '#7C3AED' },
  { fund: 'Missions Fund', amount: 184725, percentage: 10, color: '#059669' },
  { fund: 'Youth Ministry', amount: 147780, percentage: 8, color: '#D97706' },
  { fund: 'Benevolence Fund', amount: 129307.50, percentage: 7, color: '#DC2626' },
];

export const recentDonations: Donation[] = [
  { id: 'd001', memberId: 'm001', memberName: 'Michael Johnson', amount: 1200, fund: 'General Fund', method: 'online', date: '2026-02-15' },
  { id: 'd002', memberId: 'm004', memberName: 'David Williams', amount: 850, fund: 'General Fund', method: 'ach', date: '2026-02-15' },
  { id: 'd003', memberId: 'm009', memberName: 'Robert Anderson', amount: 1500, fund: 'General Fund', method: 'online', date: '2026-02-15' },
  { id: 'd004', memberId: 'm014', memberName: 'Daniel Martinez', amount: 950, fund: 'Building Fund', method: 'online', date: '2026-02-15' },
  { id: 'd005', memberId: 'm018', memberName: 'Thomas White', amount: 1100, fund: 'General Fund', method: 'check', date: '2026-02-14' },
  { id: 'd006', memberId: 'm025', memberName: 'Joshua Robinson', amount: 1350, fund: 'Missions Fund', method: 'online', date: '2026-02-14' },
  { id: 'd007', memberId: 'm030', memberName: 'Ryan Young', amount: 900, fund: 'General Fund', method: 'online', date: '2026-02-14' },
  { id: 'd008', memberId: 'm035', memberName: 'Jason Scott', amount: 1250, fund: 'General Fund', method: 'ach', date: '2026-02-14' },
  { id: 'd009', memberId: 'm006', memberName: 'Carlos Garcia', amount: 700, fund: 'Youth Ministry', method: 'online', date: '2026-02-13' },
  { id: 'd010', memberId: 'm011', memberName: 'James Thompson', amount: 500, fund: 'General Fund', method: 'cash', date: '2026-02-13' },
  { id: 'd011', memberId: 'm016', memberName: 'Kevin Lee', amount: 400, fund: 'General Fund', method: 'online', date: '2026-02-13' },
  { id: 'd012', memberId: 'm021', memberName: 'Christopher Harris', amount: 800, fund: 'Building Fund', method: 'check', date: '2026-02-12' },
  { id: 'd013', memberId: 'm023', memberName: 'Matthew Clark', amount: 600, fund: 'General Fund', method: 'online', date: '2026-02-12' },
  { id: 'd014', memberId: 'm028', memberName: 'Andrew Walker', amount: 350, fund: 'General Fund', method: 'online', date: '2026-02-12' },
  { id: 'd015', memberId: 'm032', memberName: 'Brandon King', amount: 750, fund: 'Missions Fund', method: 'online', date: '2026-02-11' },
  { id: 'd016', memberId: 'm037', memberName: 'Benjamin Green', amount: 300, fund: 'General Fund', method: 'cash', date: '2026-02-11' },
  { id: 'd017', memberId: 'm039', memberName: 'Nathan Baker', amount: 950, fund: 'General Fund', method: 'check', date: '2026-02-11' },
  { id: 'd018', memberId: 'm042', memberName: 'Tyler Adams', amount: 550, fund: 'Youth Ministry', method: 'online', date: '2026-02-10' },
  { id: 'd019', memberId: 'm044', memberName: 'Eric Nelson', amount: 1000, fund: 'Building Fund', method: 'online', date: '2026-02-10' },
  { id: 'd020', memberId: 'm046', memberName: 'Aaron Mitchell', amount: 450, fund: 'General Fund', method: 'online', date: '2026-02-10' },
  { id: 'd021', memberId: 'm048', memberName: 'Mark Stevens', amount: 100, fund: 'General Fund', method: 'cash', date: '2026-02-09' },
  { id: 'd022', memberId: 'm002', memberName: 'Sarah Johnson', amount: 1200, fund: 'Benevolence Fund', method: 'online', date: '2026-02-09' },
  { id: 'd023', memberId: 'm005', memberName: 'Jennifer Williams', amount: 850, fund: 'General Fund', method: 'ach', date: '2026-02-09' },
  { id: 'd024', memberId: 'm010', memberName: 'Patricia Anderson', amount: 1500, fund: 'General Fund', method: 'online', date: '2026-02-08' },
  { id: 'd025', memberId: 'm015', memberName: 'Michelle Martinez', amount: 950, fund: 'Youth Ministry', method: 'online', date: '2026-02-08' },
  { id: 'd026', memberId: 'm019', memberName: 'Elizabeth White', amount: 1100, fund: 'General Fund', method: 'check', date: '2026-02-08' },
  { id: 'd027', memberId: 'm026', memberName: 'Amanda Robinson', amount: 1350, fund: 'Missions Fund', method: 'online', date: '2026-02-07' },
  { id: 'd028', memberId: 'm031', memberName: 'Nicole Young', amount: 900, fund: 'General Fund', method: 'online', date: '2026-02-07' },
  { id: 'd029', memberId: 'm036', memberName: 'Laura Scott', amount: 1250, fund: 'Building Fund', method: 'ach', date: '2026-02-07' },
  { id: 'd030', memberId: 'm045', memberName: 'Rebecca Nelson', amount: 1000, fund: 'General Fund', method: 'online', date: '2026-02-06' },
];

export const pledgeCampaigns: PledgeCampaign[] = [
  {
    id: 'pc001',
    name: 'Building Our Future',
    goal: 2000000,
    raised: 1400000,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    pledgeCount: 287,
  },
  {
    id: 'pc002',
    name: 'Missions 2026',
    goal: 500000,
    raised: 380000,
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    pledgeCount: 164,
  },
  {
    id: 'pc003',
    name: 'Youth Center Renovation',
    goal: 750000,
    raised: 290000,
    startDate: '2025-06-01',
    endDate: '2027-05-31',
    pledgeCount: 112,
  },
];

export const donationStats = {
  ytdTotal: 1847250,
  mtdTotal: 162400,
  avgWeeklyGiving: 35524,
  pledgeFulfillmentRate: 87,
  onlinePercentage: 68,
};
