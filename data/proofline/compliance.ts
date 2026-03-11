// Lone Star Distribution — Display Compliance & TABC Status Data
// Used by: /ops/compliance, stop cards in day planner, account details

// ─── TABC License Types ─────────────────────────

export type TABCLicenseCode = 'BB' | 'BG' | 'MB' | 'P' | 'W' | 'BQ';
export type TABCStatus = 'active' | 'expiring' | 'expired' | 'suspended' | 'pending';

export interface TABCLicense {
  code: TABCLicenseCode;
  label: string;
  description: string;
  allowsSpirits: boolean;
}

export const TABC_LICENSE_TYPES: TABCLicense[] = [
  { code: 'BB', label: 'Beer Retailer\'s Off-Premise', description: 'Sell beer for off-premise consumption (grocery, convenience, liquor store)', allowsSpirits: false },
  { code: 'BG', label: 'Beer Retailer\'s On-Premise', description: 'Sell beer for on-premise consumption (bars, restaurants)', allowsSpirits: false },
  { code: 'MB', label: 'Mixed Beverage', description: 'Sell all alcoholic beverages for on-premise consumption', allowsSpirits: true },
  { code: 'P', label: 'Package Store', description: 'Sell distilled spirits, wine, and beer for off-premise consumption', allowsSpirits: true },
  { code: 'W', label: 'Wine & Beer Retailer', description: 'Sell wine and beer (14% ABV or less) for off-premise consumption', allowsSpirits: false },
  { code: 'BQ', label: 'Beer Retailer\'s On/Off-Premise', description: 'Combined on-premise and off-premise beer sales', allowsSpirits: false },
];

// ─── Display Compliance ─────────────────────────

export type ComplianceStatus = 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';

export interface DisplayCompliance {
  accountId: string;
  routeId: string;
  lastAuditDate: string;
  overallScore: number;         // 0-100
  status: ComplianceStatus;
  coldVaultShare: number;       // % of cold vault facings
  coldVaultTarget: number;      // target %
  endcapCount: number;
  endcapTarget: number;
  posDisplays: number;          // point-of-sale displays active
  posTarget: number;
  shelfCompliance: number;      // % of planogram compliance
  photoVerified: boolean;
  lastPhotoDate: string | null;
  issues: ComplianceIssue[];
}

export interface ComplianceIssue {
  type: 'cold-vault' | 'endcap' | 'pos' | 'shelf' | 'pricing' | 'rotation' | 'damage';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  dueDate: string | null;
}

// ─── Sample Display Compliance Data ─────────────
// Top accounts from day plans + key chain accounts

export const DISPLAY_COMPLIANCE: DisplayCompliance[] = [
  // ── Marcus Reyes (DAL-03) accounts ──
  {
    accountId: 'ACC-A001', routeId: 'DAL-03',
    lastAuditDate: '2026-02-25', overallScore: 92, status: 'compliant',
    coldVaultShare: 0.42, coldVaultTarget: 0.40, endcapCount: 3, endcapTarget: 2,
    posDisplays: 5, posTarget: 4, shelfCompliance: 0.94, photoVerified: true, lastPhotoDate: '2026-02-25',
    issues: [
      { type: 'rotation', severity: 'info', description: 'Blue Moon seasonal 6-pack needs front rotation — back stock building', dueDate: '2026-03-07' },
    ],
  },
  {
    accountId: 'ACC-A003', routeId: 'DAL-03',
    lastAuditDate: '2026-02-24', overallScore: 87, status: 'compliant',
    coldVaultShare: 0.38, coldVaultTarget: 0.40, endcapCount: 2, endcapTarget: 2,
    posDisplays: 3, posTarget: 3, shelfCompliance: 0.88, photoVerified: true, lastPhotoDate: '2026-02-24',
    issues: [
      { type: 'cold-vault', severity: 'warning', description: 'Cold vault share 38% vs 40% target. Redtail craft taking 2 facings.', dueDate: '2026-03-04' },
      { type: 'shelf', severity: 'info', description: 'Modelo Negra out of stock — shelf tag present but empty. Restock needed.', dueDate: null },
    ],
  },
  {
    accountId: 'ACC-C001', routeId: 'DAL-03',
    lastAuditDate: '2026-02-21', overallScore: 78, status: 'partial',
    coldVaultShare: 0.30, coldVaultTarget: 0.35, endcapCount: 0, endcapTarget: 0,
    posDisplays: 2, posTarget: 3, shelfCompliance: 0.75, photoVerified: false, lastPhotoDate: '2026-02-07',
    issues: [
      { type: 'pos', severity: 'warning', description: 'Missing 1 tap handle display. Blue Moon seasonal handle not installed.', dueDate: '2026-03-04' },
      { type: 'cold-vault', severity: 'warning', description: 'Cold vault share below target. Local craft IPA taking 2 doors.', dueDate: '2026-03-04' },
      { type: 'shelf', severity: 'info', description: 'Bar back shelf needs reorganization — Coors Light behind Heineken.', dueDate: null },
    ],
  },
  {
    accountId: 'ACC-D001', routeId: 'DAL-03',
    lastAuditDate: '2026-02-20', overallScore: 62, status: 'non-compliant',
    coldVaultShare: 0.34, coldVaultTarget: 0.40, endcapCount: 0, endcapTarget: 1,
    posDisplays: 1, posTarget: 2, shelfCompliance: 0.65, photoVerified: false, lastPhotoDate: '2026-01-28',
    issues: [
      { type: 'cold-vault', severity: 'critical', description: 'Cold vault share 34% vs 40% target. AB InBev competitor product in Lone Star-allocated space.', dueDate: '2026-03-04' },
      { type: 'endcap', severity: 'warning', description: 'Corona floor display removed by store manager. Need reset.', dueDate: '2026-03-04' },
      { type: 'pricing', severity: 'warning', description: 'Miller Lite 12-pack priced $1 above competitor — needs price adjustment', dueDate: null },
      { type: 'pos', severity: 'info', description: 'POS header card faded — replace with Q1 spring creative', dueDate: null },
    ],
  },
  {
    accountId: 'ACC-A002', routeId: 'DAL-03',
    lastAuditDate: '2026-02-26', overallScore: 95, status: 'compliant',
    coldVaultShare: 0.45, coldVaultTarget: 0.40, endcapCount: 4, endcapTarget: 3,
    posDisplays: 6, posTarget: 4, shelfCompliance: 0.96, photoVerified: true, lastPhotoDate: '2026-02-26',
    issues: [],
  },

  // ── Rosa Gutierrez (LAR-02) accounts ──
  {
    accountId: 'ACC-C020', routeId: 'LAR-02',
    lastAuditDate: '2026-02-22', overallScore: 88, status: 'compliant',
    coldVaultShare: 0.52, coldVaultTarget: 0.45, endcapCount: 2, endcapTarget: 2,
    posDisplays: 3, posTarget: 3, shelfCompliance: 0.90, photoVerified: true, lastPhotoDate: '2026-02-22',
    issues: [
      { type: 'rotation', severity: 'info', description: 'Corona Light 12-pack code date approaching — rotate by March 15', dueDate: '2026-03-15' },
    ],
  },
  {
    accountId: 'ACC-C021', routeId: 'LAR-02',
    lastAuditDate: '2026-02-19', overallScore: 71, status: 'partial',
    coldVaultShare: 0.40, coldVaultTarget: 0.45, endcapCount: 1, endcapTarget: 2,
    posDisplays: 2, posTarget: 3, shelfCompliance: 0.72, photoVerified: false, lastPhotoDate: '2026-02-05',
    issues: [
      { type: 'endcap', severity: 'warning', description: 'Missing Modelo endcap — space taken by Bud Light display (competitor territory violation)', dueDate: '2026-03-04' },
      { type: 'pos', severity: 'warning', description: 'Missing bilingual POS materials — English-only signage in 85% Hispanic market', dueDate: '2026-03-04' },
      { type: 'shelf', severity: 'info', description: 'Tecate shelf allocation needs expansion — highest velocity brand in this store', dueDate: null },
    ],
  },

  // ── Jake Williams (FTW-05) accounts ──
  {
    accountId: 'ACC-C030', routeId: 'FTW-05',
    lastAuditDate: '2026-02-23', overallScore: 84, status: 'compliant',
    coldVaultShare: 0.36, coldVaultTarget: 0.35, endcapCount: 1, endcapTarget: 1,
    posDisplays: 4, posTarget: 3, shelfCompliance: 0.86, photoVerified: true, lastPhotoDate: '2026-02-23',
    issues: [
      { type: 'shelf', severity: 'info', description: 'Rahr & Sons IPA placement behind Firestone Walker — swap for better visibility', dueDate: null },
    ],
  },
  {
    accountId: 'ACC-C031', routeId: 'FTW-05',
    lastAuditDate: '2026-02-20', overallScore: 91, status: 'compliant',
    coldVaultShare: 0.44, coldVaultTarget: 0.40, endcapCount: 2, endcapTarget: 2,
    posDisplays: 5, posTarget: 4, shelfCompliance: 0.92, photoVerified: true, lastPhotoDate: '2026-02-20',
    issues: [],
  },
];

// ─── TABC Account Status ────────────────────────

export interface AccountTABCStatus {
  accountId: string;
  licenseCode: TABCLicenseCode;
  licenseNumber: string;
  status: TABCStatus;
  expirationDate: string;
  lastVerified: string;
  allowsSpirits: boolean;
  notes: string | null;
}

export const ACCOUNT_TABC_STATUS: AccountTABCStatus[] = [
  // ── Dallas accounts ──
  { accountId: 'ACC-A001', licenseCode: 'P', licenseNumber: 'P-481726', status: 'active', expirationDate: '2027-03-15', lastVerified: '2026-02-25', allowsSpirits: true, notes: 'Full package store license. Sazerac authorized.' },
  { accountId: 'ACC-A002', licenseCode: 'P', licenseNumber: 'P-392841', status: 'active', expirationDate: '2026-11-30', lastVerified: '2026-02-26', allowsSpirits: true, notes: 'Full package store. Top spirits volume in district.' },
  { accountId: 'ACC-A003', licenseCode: 'BB', licenseNumber: 'BB-559102', status: 'active', expirationDate: '2026-09-20', lastVerified: '2026-02-24', allowsSpirits: false, notes: 'Beer only. Cannot sell Sazerac products.' },
  { accountId: 'ACC-C001', licenseCode: 'MB', licenseNumber: 'MB-723456', status: 'active', expirationDate: '2026-12-01', lastVerified: '2026-02-21', allowsSpirits: true, notes: 'Mixed beverage license. Cocktail program eligible.' },
  { accountId: 'ACC-C002', licenseCode: 'P', licenseNumber: 'P-891234', status: 'active', expirationDate: '2027-06-15', lastVerified: '2026-02-18', allowsSpirits: true, notes: 'New account. Package store license issued Feb 2026.' },
  { accountId: 'ACC-C003', licenseCode: 'MB', licenseNumber: 'MB-445678', status: 'active', expirationDate: '2026-08-15', lastVerified: '2026-02-15', allowsSpirits: true, notes: 'Hotel bar. Buffalo Trace Old Fashioned program approved.' },
  { accountId: 'ACC-D001', licenseCode: 'BQ', licenseNumber: 'BQ-667890', status: 'active', expirationDate: '2026-07-31', lastVerified: '2026-02-20', allowsSpirits: false, notes: 'Beer/wine only convenience store.' },
  { accountId: 'ACC-D002', licenseCode: 'BQ', licenseNumber: 'BQ-778901', status: 'active', expirationDate: '2026-10-15', lastVerified: '2026-02-18', allowsSpirits: false, notes: 'Convenience store chain. Beer only.' },
  { accountId: 'ACC-A006', licenseCode: 'BB', licenseNumber: 'BB-223456', status: 'active', expirationDate: '2026-12-31', lastVerified: '2026-02-22', allowsSpirits: false, notes: 'Grocery chain. Beer and wine only.' },

  // ── Expiring / flagged accounts ──
  { accountId: 'ACC-C010', licenseCode: 'MB', licenseNumber: 'MB-334567', status: 'expiring', expirationDate: '2026-03-31', lastVerified: '2026-02-15', allowsSpirits: true, notes: 'LICENSE EXPIRING IN 30 DAYS. Renewal application filed. Follow up with owner.' },
  { accountId: 'ACC-C015', licenseCode: 'BG', licenseNumber: 'BG-556789', status: 'suspended', expirationDate: '2026-05-15', lastVerified: '2026-02-10', allowsSpirits: false, notes: 'SUSPENDED — TABC violation (minor sold alcohol). 30-day suspension. No deliveries until April 1.' },
  { accountId: 'ACC-D020', licenseCode: 'W', licenseNumber: 'W-889012', status: 'expired', expirationDate: '2026-02-15', lastVerified: '2026-02-20', allowsSpirits: false, notes: 'EXPIRED. Do not deliver. Owner notified. Must renew before next delivery.' },

  // ── Laredo accounts (border compliance) ──
  { accountId: 'ACC-C020', licenseCode: 'MB', licenseNumber: 'MB-112233', status: 'active', expirationDate: '2027-01-15', lastVerified: '2026-02-22', allowsSpirits: true, notes: 'Border district. Additional federal liquor license on file.' },
  { accountId: 'ACC-C021', licenseCode: 'BG', licenseNumber: 'BG-445566', status: 'active', expirationDate: '2026-08-30', lastVerified: '2026-02-19', allowsSpirits: false, notes: 'On-premise beer only. Apply for MB upgrade to enable Sazerac.' },

  // ── Fort Worth accounts ──
  { accountId: 'ACC-C030', licenseCode: 'MB', licenseNumber: 'MB-778899', status: 'active', expirationDate: '2026-11-15', lastVerified: '2026-02-23', allowsSpirits: true, notes: 'Craft beer bar with spirits program. Buffalo Trace featured.' },
  { accountId: 'ACC-C031', licenseCode: 'P', licenseNumber: 'P-990011', status: 'active', expirationDate: '2027-02-28', lastVerified: '2026-02-20', allowsSpirits: true, notes: 'Package store in Stockyards district. High spirits velocity.' },
];

// ─── Compliance Summary by Hometown ─────────────

export interface HometownComplianceSummary {
  hometownId: string;
  totalAccounts: number;
  compliantAccounts: number;
  partialAccounts: number;
  nonCompliantAccounts: number;
  avgScore: number;
  avgColdVaultShare: number;
  tabcIssues: number;          // accounts with TABC problems
  lastFullAudit: string;
  topIssue: string;
}

export const HOMETOWN_COMPLIANCE: HometownComplianceSummary[] = [
  { hometownId: 'dal', totalAccounts: 2910, compliantAccounts: 2328, partialAccounts: 437, nonCompliantAccounts: 145, avgScore: 84, avgColdVaultShare: 0.39, tabcIssues: 12, lastFullAudit: '2026-02-15', topIssue: 'Cold vault share erosion from craft competition' },
  { hometownId: 'aln', totalAccounts: 1680, compliantAccounts: 1378, partialAccounts: 235, nonCompliantAccounts: 67, avgScore: 87, avgColdVaultShare: 0.41, tabcIssues: 5, lastFullAudit: '2026-02-18', topIssue: 'New suburban accounts need initial planogram setup' },
  { hometownId: 'ftw', totalAccounts: 2781, compliantAccounts: 2225, partialAccounts: 389, nonCompliantAccounts: 167, avgScore: 82, avgColdVaultShare: 0.37, tabcIssues: 14, lastFullAudit: '2026-02-12', topIssue: 'Stockyards district bars below cold vault targets' },
  { hometownId: 'ens', totalAccounts: 890, compliantAccounts: 756, partialAccounts: 98, nonCompliantAccounts: 36, avgScore: 86, avgColdVaultShare: 0.43, tabcIssues: 3, lastFullAudit: '2026-02-20', topIssue: 'Rural accounts have irregular audit cadence' },
  { hometownId: 'crp', totalAccounts: 1840, compliantAccounts: 1472, partialAccounts: 276, nonCompliantAccounts: 92, avgScore: 83, avgColdVaultShare: 0.40, tabcIssues: 8, lastFullAudit: '2026-02-14', topIssue: 'Beach district seasonal accounts need spring reset' },
  { hometownId: 'lar', totalAccounts: 1120, compliantAccounts: 784, partialAccounts: 246, nonCompliantAccounts: 90, avgScore: 76, avgColdVaultShare: 0.35, tabcIssues: 18, lastFullAudit: '2026-02-08', topIssue: 'Post-acquisition — 30% of accounts not yet on Lone Star planogram. Border compliance documentation gaps.' },
];

// ─── Helpers ────────────────────────────────────

export const getComplianceByAccount = (accountId: string): DisplayCompliance | undefined =>
  DISPLAY_COMPLIANCE.find(d => d.accountId === accountId);

export const getTABCByAccount = (accountId: string): AccountTABCStatus | undefined =>
  ACCOUNT_TABC_STATUS.find(t => t.accountId === accountId);

export const getComplianceByRoute = (routeId: string): DisplayCompliance[] =>
  DISPLAY_COMPLIANCE.filter(d => d.routeId === routeId);

export const getHometownCompliance = (hometownId: string): HometownComplianceSummary | undefined =>
  HOMETOWN_COMPLIANCE.find(h => h.hometownId === hometownId);

export const getLicenseInfo = (code: TABCLicenseCode): TABCLicense | undefined =>
  TABC_LICENSE_TYPES.find(l => l.code === code);

// Count accounts with TABC issues
export const countTABCIssues = (): { expiring: number; expired: number; suspended: number } => {
  let expiring = 0, expired = 0, suspended = 0;
  for (const a of ACCOUNT_TABC_STATUS) {
    if (a.status === 'expiring') expiring++;
    if (a.status === 'expired') expired++;
    if (a.status === 'suspended') suspended++;
  }
  return { expiring, expired, suspended };
};
