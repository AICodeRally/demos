/**
 * Prizym Governance — Oversee Quadrant Synthetic Data
 * Compliance, reports, pulse signals for the governance program
 */

export interface ComplianceControl {
  id: string;
  code: string;
  name: string;
  category: string;
  status: 'compliant' | 'at_risk' | 'non_compliant' | 'not_tested';
  lastTested: string;
  nextTest: string;
  owner: string;
  relatedPolicy: string;
  evidence: number;
}

export const COMPLIANCE_CONTROLS: ComplianceControl[] = [
  {
    id: 'ctl-001',
    code: 'SOX-001',
    name: 'Segregation of Duties — Commission Processing',
    category: 'SOX / ICFR',
    status: 'compliant',
    lastTested: '2026-03-28',
    nextTest: '2026-06-28',
    owner: 'Revenue Accounting',
    relatedPolicy: 'SCP-018',
    evidence: 12,
  },
  {
    id: 'ctl-002',
    code: 'SOX-002',
    name: 'Change Control — Comp Plan Parameters',
    category: 'SOX / ICFR',
    status: 'compliant',
    lastTested: '2026-03-30',
    nextTest: '2026-06-30',
    owner: 'Sales Comp',
    relatedPolicy: 'SCP-018',
    evidence: 8,
  },
  {
    id: 'ctl-003',
    code: 'SOX-003',
    name: 'Month-End Cut-Off — Revenue Recognition',
    category: 'SOX / ICFR',
    status: 'at_risk',
    lastTested: '2026-03-31',
    nextTest: '2026-04-30',
    owner: 'Revenue Accounting',
    relatedPolicy: 'SCP-018',
    evidence: 6,
  },
  {
    id: 'ctl-004',
    code: 'SOX-004',
    name: 'Reconciliation — Billed vs. Recognized Revenue',
    category: 'SOX / ICFR',
    status: 'compliant',
    lastTested: '2026-03-25',
    nextTest: '2026-06-25',
    owner: 'Revenue Controller',
    relatedPolicy: 'SCP-018',
    evidence: 15,
  },
  {
    id: 'ctl-005',
    code: 'SOX-005',
    name: 'Access Controls — Comp System',
    category: 'SOX / ICFR',
    status: 'compliant',
    lastTested: '2026-03-20',
    nextTest: '2026-06-20',
    owner: 'IT Security',
    relatedPolicy: 'SCP-018',
    evidence: 9,
  },
  {
    id: 'ctl-006',
    code: 'SOX-006',
    name: 'Manual Journal Entry Review — Commissions',
    category: 'SOX / ICFR',
    status: 'compliant',
    lastTested: '2026-03-31',
    nextTest: '2026-04-30',
    owner: 'Revenue Accounting',
    relatedPolicy: 'SCP-018',
    evidence: 11,
  },
  {
    id: 'ctl-007',
    code: 'WAGE-CA',
    name: 'California AB-2288 Commission Statement Format',
    category: 'Wage & Hour',
    status: 'at_risk',
    lastTested: '2026-03-15',
    nextTest: '2026-04-15',
    owner: 'Legal',
    relatedPolicy: 'SCP-010',
    evidence: 4,
  },
  {
    id: 'ctl-008',
    code: 'WAGE-NY',
    name: 'New York Labor Law 191 — Timing of Payment',
    category: 'Wage & Hour',
    status: 'compliant',
    lastTested: '2026-03-18',
    nextTest: '2026-06-18',
    owner: 'Legal',
    relatedPolicy: 'SCP-010',
    evidence: 7,
  },
  {
    id: 'ctl-009',
    code: 'TAX-409A',
    name: 'Section 409A — Deferred Commission Compliance',
    category: 'Tax',
    status: 'compliant',
    lastTested: '2026-02-28',
    nextTest: '2026-05-28',
    owner: 'Tax',
    relatedPolicy: 'SCP-011',
    evidence: 5,
  },
  {
    id: 'ctl-010',
    code: 'GOV-CRB',
    name: 'Compensation Review Board Quorum',
    category: 'Governance',
    status: 'compliant',
    lastTested: '2026-03-10',
    nextTest: '2026-06-10',
    owner: 'Board Secretary',
    relatedPolicy: 'SCP-007',
    evidence: 10,
  },
  {
    id: 'ctl-011',
    code: 'GOV-SGCC',
    name: 'Sales Governance Committee Charter',
    category: 'Governance',
    status: 'compliant',
    lastTested: '2026-03-12',
    nextTest: '2026-06-12',
    owner: 'SGCC Chair',
    relatedPolicy: 'SCP-008',
    evidence: 6,
  },
  {
    id: 'ctl-012',
    code: 'DATA-SOC2',
    name: 'SOC 2 Type II — Comp Data Controls',
    category: 'Data Security',
    status: 'not_tested',
    lastTested: '2025-12-31',
    nextTest: '2026-04-30',
    owner: 'Compliance Office',
    relatedPolicy: 'SCP-018',
    evidence: 0,
  },
];

export function getComplianceScore(): number {
  const weights = { compliant: 1.0, at_risk: 0.5, non_compliant: 0, not_tested: 0.3 };
  const total = COMPLIANCE_CONTROLS.reduce((sum, c) => sum + weights[c.status], 0);
  return Math.round((total / COMPLIANCE_CONTROLS.length) * 100);
}

export interface GovernanceReport {
  id: string;
  title: string;
  category: 'performance' | 'compliance' | 'audit' | 'operational';
  description: string;
  lastRun: string;
  schedule: string;
  owner: string;
  pageCount: number;
  format: string[];
}

export const REPORTS: GovernanceReport[] = [
  {
    id: 'rpt-001',
    title: 'Q1 2026 Commission Performance Summary',
    category: 'performance',
    description: 'Comprehensive Q1 commission payout analysis by territory, plan, and product line with YoY comparison.',
    lastRun: '2026-04-05',
    schedule: 'Quarterly',
    owner: 'Sales Comp',
    pageCount: 42,
    format: ['PDF', 'XLSX'],
  },
  {
    id: 'rpt-002',
    title: '88-Checkpoint Maturity Assessment',
    category: 'compliance',
    description: 'Full maturity scoring across all 88 SGM checkpoints with gap analysis and recommended actions.',
    lastRun: '2026-04-08',
    schedule: 'On-demand',
    owner: 'Governance Office',
    pageCount: 36,
    format: ['PDF'],
  },
  {
    id: 'rpt-003',
    title: 'Policy Coverage Matrix',
    category: 'compliance',
    description: '22 SCPs mapped against comp plans, territories, and role types. Coverage gaps and exceptions highlighted.',
    lastRun: '2026-04-01',
    schedule: 'Monthly',
    owner: 'Governance Office',
    pageCount: 18,
    format: ['PDF', 'XLSX'],
  },
  {
    id: 'rpt-004',
    title: 'ASC 606 Revenue Reconciliation',
    category: 'audit',
    description: 'Billed revenue vs. ASC 606 recognized revenue with commission impact analysis. SOX walkthrough ready.',
    lastRun: '2026-03-31',
    schedule: 'Monthly',
    owner: 'Revenue Accounting',
    pageCount: 24,
    format: ['PDF', 'XLSX'],
  },
  {
    id: 'rpt-005',
    title: 'CRB Decisions Log — YTD',
    category: 'audit',
    description: 'Complete record of Compensation Review Board decisions with rationale, voters, and dollar impact.',
    lastRun: '2026-04-08',
    schedule: 'Monthly',
    owner: 'CRB Secretary',
    pageCount: 14,
    format: ['PDF'],
  },
  {
    id: 'rpt-006',
    title: 'Windfall & Large Deal Analysis',
    category: 'performance',
    description: 'Deals >$1M ARR reviewed under SCP-007 with payout caps, CRB actions, and precedent tracking.',
    lastRun: '2026-04-02',
    schedule: 'Monthly',
    owner: 'Sales Ops',
    pageCount: 22,
    format: ['PDF', 'XLSX'],
  },
  {
    id: 'rpt-007',
    title: 'SPIF Program Effectiveness',
    category: 'performance',
    description: 'All active and completed SPIFs with ROI analysis, participant counts, and payout vs. budget variance.',
    lastRun: '2026-04-07',
    schedule: 'Monthly',
    owner: 'Sales Comp',
    pageCount: 16,
    format: ['PDF', 'XLSX'],
  },
  {
    id: 'rpt-008',
    title: 'Clawback & Recovery Summary',
    category: 'operational',
    description: 'Outstanding clawbacks, recovery status, waiver decisions, and bad-debt write-offs.',
    lastRun: '2026-04-04',
    schedule: 'Monthly',
    owner: 'Finance',
    pageCount: 12,
    format: ['PDF', 'XLSX'],
  },
  {
    id: 'rpt-009',
    title: 'Multi-State Wage Law Compliance Status',
    category: 'compliance',
    description: 'CA, NY, MA, IL compliance status for commission statements, payment timing, and deductions.',
    lastRun: '2026-03-28',
    schedule: 'Quarterly',
    owner: 'Legal',
    pageCount: 20,
    format: ['PDF'],
  },
];

export interface PulseSignal {
  id: string;
  category: 'health' | 'risk' | 'activity' | 'trend';
  title: string;
  value: string;
  delta?: string;
  direction: 'up' | 'down' | 'flat';
  positive: boolean;
  note: string;
}

export const PULSE_SIGNALS: PulseSignal[] = [
  {
    id: 'puls-001',
    category: 'health',
    title: 'Overall Maturity Score',
    value: '71%',
    delta: '+4 pts',
    direction: 'up',
    positive: true,
    note: 'Foundation Builder archetype, 8 quarter trend positive',
  },
  {
    id: 'puls-002',
    category: 'health',
    title: 'Compliance Score',
    value: '83%',
    delta: '-2 pts',
    direction: 'down',
    positive: false,
    note: '2 controls at-risk (SOX-003 cut-off, CA AB-2288)',
  },
  {
    id: 'puls-003',
    category: 'risk',
    title: 'Open High-Priority Risks',
    value: '4',
    delta: '+1',
    direction: 'up',
    positive: false,
    note: 'SOC 2 re-test overdue, CA wage law acknowledgments pending',
  },
  {
    id: 'puls-004',
    category: 'activity',
    title: 'Approvals Pending',
    value: '5',
    delta: '+2',
    direction: 'up',
    positive: false,
    note: '1 escalated to SGCC — West Region territory transition',
  },
  {
    id: 'puls-005',
    category: 'activity',
    title: 'Decisions YTD',
    value: '37',
    delta: '+6 MoM',
    direction: 'up',
    positive: true,
    note: 'Healthy decision velocity; CRB meeting cadence maintained',
  },
  {
    id: 'puls-006',
    category: 'trend',
    title: 'Policy Exception Rate',
    value: '4.2%',
    delta: '-0.8 pts',
    direction: 'down',
    positive: true,
    note: 'Exception rate trending down — plan design maturity improving',
  },
  {
    id: 'puls-007',
    category: 'trend',
    title: 'Commission Accuracy',
    value: '99.3%',
    delta: '+0.2 pts',
    direction: 'up',
    positive: true,
    note: 'YTD commission calculation accuracy vs. prior year 98.8%',
  },
  {
    id: 'puls-008',
    category: 'trend',
    title: 'Time-to-Approve (Median)',
    value: '5.2 days',
    delta: '-0.8 days',
    direction: 'down',
    positive: true,
    note: 'Faster CRB review cadence and async pre-read adoption',
  },
];
