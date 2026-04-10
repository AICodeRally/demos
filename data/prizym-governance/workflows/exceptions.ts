export type ExceptionStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type ExceptionType =
  | 'territory_waiver'
  | 'quota_appeal'
  | 'clawback_waiver'
  | 'asc606_treatment'
  | 'windfall_deviation'
  | 'plan_interpretation';

export interface PolicyException {
  id: string;
  caseNumber: string;
  type: ExceptionType;
  title: string;
  policyRef: string;
  requestedBy: string;
  requestedAt: string;
  status: ExceptionStatus;
  approver: string;
  approvedAt?: string;
  expiresAt?: string;
  amountImpact?: number;
  justification: string;
  dealContext?: string;
}

export const EXCEPTIONS: PolicyException[] = [
  {
    id: 'exc-001', caseNumber: 'EXC-2026-012',
    type: 'territory_waiver',
    title: 'Territory Protection Waiver — Pacific NW Healthcare Account',
    policyRef: 'SCP-006',
    requestedBy: 'AE-4471 (Pacific NW)',
    requestedAt: '2026-04-02',
    status: 'pending',
    approver: 'VP Sales',
    amountImpact: 420_000,
    justification: 'Account originally covered under Pacific NW territory. Customer moved HQ to Central region in Q1 but requested continuity of rep. Requesting 6-month waiver from SCP-006 territory reassignment rules to preserve customer relationship through annual renewal.',
    dealContext: '$420K ARR renewal, existing 3-year customer, high churn risk if rep changes mid-cycle.',
  },
  {
    id: 'exc-002', caseNumber: 'EXC-2026-011',
    type: 'clawback_waiver',
    title: 'Clawback Waiver — Customer Bankruptcy Force Majeure',
    policyRef: 'SCP-009',
    requestedBy: 'AE-2156 (Enterprise)',
    requestedAt: '2026-03-28',
    status: 'pending',
    approver: 'CRB',
    amountImpact: 67_800,
    justification: 'Customer filed Chapter 11 within 45 days of close. Rep requests force majeure exception to standard SCP-009 clawback. Precedent-setting — if granted, will inform future bankruptcy-related clawback decisions.',
    dealContext: 'Q1 lab equipment order, $678K TCV, commission $67.8K, cancelled 2026-03-12.',
  },
  {
    id: 'exc-003', caseNumber: 'EXC-2026-010',
    type: 'asc606_treatment',
    title: 'ASC 606 Treatment Exception — Multi-Element Bundle',
    policyRef: 'SCP-018',
    requestedBy: 'Revenue Accounting',
    requestedAt: '2026-04-06',
    status: 'pending',
    approver: 'Revenue Controller + External Audit',
    amountImpact: 312_000,
    justification: 'Multi-year SaaS bundle with non-distinct onboarding creates ambiguity in PO allocation. Requesting approval to use residual method vs. relative SSP, which would create $312K allocation variance and $67K commission timing impact. Needs SOX sign-off.',
    dealContext: 'Enterprise SaaS 3-year deal, $4.2M TCV.',
  },
  {
    id: 'exc-004', caseNumber: 'EXC-2026-009',
    type: 'windfall_deviation',
    title: 'Windfall Cap Deviation — West Region Enterprise Deal',
    policyRef: 'SCP-007',
    requestedBy: 'Marissa Chen (West RVP)',
    requestedAt: '2026-04-02',
    status: 'pending',
    approver: 'CRB',
    amountImpact: 247_000,
    justification: 'SCP-007 default windfall treatment is 135% cap. Requesting full payout (no cap) for the $14.5M West Region deal, arguing that standard windfall criteria don\'t apply because rep was primary driver from first contact through close.',
    dealContext: '$14.5M ARR enterprise deal, projected payout $247K.',
  },
  {
    id: 'exc-005', caseNumber: 'EXC-2026-008',
    type: 'quota_appeal',
    title: 'Mid-Year Quota Relief — Territory Consolidation',
    policyRef: 'SCP-002',
    requestedBy: 'Kyle Morrison (Central RVP)',
    requestedAt: '2026-03-25',
    status: 'approved',
    approver: 'SGCC',
    approvedAt: '2026-04-01',
    expiresAt: '2026-09-30',
    amountImpact: 142_000,
    justification: 'Territory consolidation after departing AE left 3 reps with disproportionate account coverage. Approved 15% mid-year quota relief through Q3 to allow re-baseline.',
  },
  {
    id: 'exc-006', caseNumber: 'EXC-2026-007',
    type: 'plan_interpretation',
    title: 'LOA Pro-Rata Interpretation — SPIF Eligibility Edge Case',
    policyRef: 'SCP-005, SCP-008',
    requestedBy: 'HR Business Partner',
    requestedAt: '2026-03-15',
    status: 'approved',
    approver: 'Sales Comp Lead',
    approvedAt: '2026-03-22',
    expiresAt: '2026-06-22',
    amountImpact: 12_500,
    justification: 'Rep returned from medical LOA mid-SPIF period. Approved 51.1% pro-rata SPIF payout based on days active (46/90).',
  },
  {
    id: 'exc-007', caseNumber: 'EXC-2026-006',
    type: 'territory_waiver',
    title: 'Joint Coverage Exception — Named Account Overlap',
    policyRef: 'SCP-001, SCP-006',
    requestedBy: 'Healthcare Named AE',
    requestedAt: '2026-02-20',
    status: 'expired',
    approver: 'VP Sales',
    approvedAt: '2026-02-28',
    expiresAt: '2026-03-31',
    amountImpact: 89_000,
    justification: 'Temporary joint coverage waiver for a healthcare vertical account during transition from Territory to Named Account coverage. Expired 2026-03-31, no renewal requested.',
  },
];

export function getExceptionStats() {
  return {
    pending: EXCEPTIONS.filter(e => e.status === 'pending').length,
    approved: EXCEPTIONS.filter(e => e.status === 'approved').length,
    rejected: EXCEPTIONS.filter(e => e.status === 'rejected').length,
    expired: EXCEPTIONS.filter(e => e.status === 'expired').length,
    totalImpact: EXCEPTIONS.reduce((sum, e) => sum + (e.amountImpact ?? 0), 0),
  };
}
