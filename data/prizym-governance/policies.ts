/**
 * Prizym Governance — Policy Data (Static Demo)
 * 17 SCP policies + 3 demo policies from synthetic data
 */

export interface Policy {
  id: string;
  code: string;
  title: string;
  category: string;
  status: 'APPROVED' | 'DRAFT' | 'UNDER_REVIEW' | 'draft' | 'superseded';
  version: string;
  effectiveDate: string | null;
  owner: string;
  description: string;
}

// Gold-standard SCP policies (from governance document library)
export const SCP_POLICIES: Policy[] = [
  { id: 'scp-001', code: 'SCP-001', title: 'Sales Crediting Policy', category: 'Crediting', status: 'APPROVED', version: '2.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Deal crediting rules for new logo, named accounts, renewals, and multi-rep splits. Includes SE allocation rules.' },
  { id: 'scp-002', code: 'SCP-002', title: 'Quota Setting & Mid-Period Change Policy', category: 'Quota Management', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Annual quota setting methodology, mid-year adjustment rules, and quota appeal process.' },
  { id: 'scp-003', code: 'SCP-003', title: 'Payment Timing & Draw Policy', category: 'Payments', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Finance', description: 'Commission payment schedule, draw eligibility, and repayment terms for new hires.' },
  { id: 'scp-004', code: 'SCP-004', title: 'Termination & Severance Policy', category: 'Employment', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'HR', description: 'Commission treatment on voluntary termination, involuntary termination, and severance scenarios.' },
  { id: 'scp-005', code: 'SCP-005', title: 'Leave of Absence Policy', category: 'Employment', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'HR', description: 'Commission treatment during medical leave, parental leave, and extended absences.' },
  { id: 'scp-006', code: 'SCP-006', title: 'Territory Change Policy', category: 'Territory Management', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Rules for territory reassignments, protection periods, and transition credits.' },
  { id: 'scp-007', code: 'SCP-007', title: 'Windfall & Large Deal Policy', category: 'Large Deals', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'CRB', description: 'Windfall identification criteria ($1M ARR, $100K+ payout) and CRB review process with 6 decision options.' },
  { id: 'scp-008', code: 'SCP-008', title: 'SPIF Governance Policy', category: 'SPIFs', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'SPIF approval thresholds: <$50K (SGCC), $50-250K (SGCC+CFO), >$250K (SGCC+CEO).' },
  { id: 'scp-009', code: 'SCP-009', title: 'Clawback & Recovery Policy', category: 'Compliance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Finance', description: 'Overpayment recovery procedures, clawback triggers, and repayment schedules.' },
  { id: 'scp-010', code: 'SCP-010', title: 'Multi-State Wage Law Compliance Policy', category: 'Legal Compliance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Legal', description: 'State-specific wage law compliance (CA, NY, MA) for commission payments and deductions.' },
  { id: 'scp-011', code: 'SCP-011', title: 'Section 409A Compliance Policy', category: 'Tax Compliance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Legal', description: 'IRS Section 409A compliance for deferred commission and long-term incentives.' },
  { id: 'scp-012', code: 'SCP-012', title: 'Data Retention Policy', category: 'Data Governance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Legal', description: '7-year retention for compensation records, calculations, and dispute documentation.' },
  { id: 'scp-013', code: 'SCP-013', title: 'Version Control & Document Management Policy', category: 'Governance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Document versioning standards, approval workflows, and superseded document handling.' },
  { id: 'scp-014', code: 'SCP-014', title: 'Standard Terms & Conditions', category: 'Legal', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Legal', description: 'Master T&Cs for all compensation plans including at-will employment language.' },
  { id: 'scp-015', code: 'SCP-015', title: 'Cap & Threshold Guidelines', category: 'Plan Design', status: 'DRAFT', version: '0.9', effectiveDate: null, owner: 'Sales Compensation', description: 'Financial limits, acceleration caps, and attainment thresholds by role.' },
  { id: 'scp-016', code: 'SCP-016', title: 'Draws & Guarantees Policy', category: 'Payments', status: 'DRAFT', version: '0.8', effectiveDate: null, owner: 'Finance', description: 'Draw request process, guarantee terms, and repayment obligations.' },
  { id: 'scp-017', code: 'SCP-017', title: 'Mid-Period Plan Change Policy', category: 'Plan Changes', status: 'UNDER_REVIEW', version: '0.9', effectiveDate: null, owner: 'Sales Compensation', description: 'Rules for making plan changes mid-year including grandfathering and transition rules.' },
];

// Demo-tier policies
export const DEMO_POLICIES: Policy[] = [
  { id: 'demo-pol-001', code: 'DEMO-001', title: 'Territory Overlap Resolution Policy', category: 'Territory', status: 'draft', version: '0.9.0', effectiveDate: null, owner: 'Sales Operations', description: 'Guidelines for resolving territory overlap conflicts.' },
  { id: 'demo-pol-002', code: 'DEMO-002', title: 'New Hire Quota Ramp Policy', category: 'Quota', status: 'draft', version: '0.5.0', effectiveDate: null, owner: 'Sales Operations', description: 'Quota ramp schedule for new sales representatives.' },
  { id: 'demo-pol-003', code: 'DEMO-003', title: 'Standard Commission Rate Policy (Superseded)', category: 'Compensation', status: 'superseded', version: '2.0.0', effectiveDate: '2025-09-01', owner: 'Sales Compensation', description: 'Previous version of commission rate policy — for demo purposes.' },
];

export const ALL_POLICIES = [...SCP_POLICIES, ...DEMO_POLICIES];

export function getPolicyStats() {
  const approved = ALL_POLICIES.filter(p => p.status === 'APPROVED').length;
  const draft = ALL_POLICIES.filter(p => p.status === 'DRAFT' || p.status === 'draft').length;
  const review = ALL_POLICIES.filter(p => p.status === 'UNDER_REVIEW').length;
  return { total: ALL_POLICIES.length, approved, draft, review, superseded: ALL_POLICIES.length - approved - draft - review };
}
