/**
 * Prizym Governance — Operate Quadrant Synthetic Data
 * Approvals queue, decisions log, calendar events, tasks, notifications.
 * Henry Schein-flavored dates aligned to 2026 fiscal year.
 */

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';
export type ApprovalPriority = 'high' | 'medium' | 'low';

export interface ApprovalItem {
  id: string;
  title: string;
  policyRef: string;
  requestor: string;
  requestedAt: string;
  amount?: number;
  status: ApprovalStatus;
  priority: ApprovalPriority;
  reviewer: string;
  summary: string;
  decisionDueBy: string;
  threadCount: number;
}

export const APPROVALS: ApprovalItem[] = [
  {
    id: 'apr-001',
    title: 'Q2 Windfall Review — West Region Enterprise Deal',
    policyRef: 'SCP-007',
    requestor: 'Marissa Chen (West RVP)',
    requestedAt: '2026-04-02',
    amount: 1_450_000,
    status: 'pending',
    priority: 'high',
    reviewer: 'Compensation Review Board (CRB)',
    summary:
      '$14.5M ARR multi-year enterprise deal triggers SCP-007 windfall review ($1M ARR threshold). Projected payout $247K to AE. CRB decision required within 10 business days.',
    decisionDueBy: '2026-04-16',
    threadCount: 6,
  },
  {
    id: 'apr-002',
    title: 'Q2 SPIF Request — New Dental Equipment Vertical',
    policyRef: 'SCP-008',
    requestor: 'David Park (VP Vertical Sales)',
    requestedAt: '2026-04-04',
    amount: 180_000,
    status: 'pending',
    priority: 'high',
    reviewer: 'SGCC + CFO',
    summary:
      '$180K quarterly SPIF to accelerate adoption in dental equipment line. Crosses $50K SGCC threshold and $50-250K CFO joint approval band per SCP-008.',
    decisionDueBy: '2026-04-12',
    threadCount: 4,
  },
  {
    id: 'apr-003',
    title: 'Mid-Year Quota Adjustment — Northeast Territory Merge',
    policyRef: 'SCP-002',
    requestor: 'Jennifer Ross (Sales Ops)',
    requestedAt: '2026-03-28',
    status: 'approved',
    priority: 'medium',
    reviewer: 'Sales Ops Leadership',
    summary:
      'Northeast territory consolidation after AE departure. Mid-year quota re-baseline for 3 remaining reps per SCP-002 mid-period change rules. Approved 2026-04-01.',
    decisionDueBy: '2026-04-05',
    threadCount: 8,
  },
  {
    id: 'apr-004',
    title: 'Clawback Waiver — Chargeback on Cancelled Lab Order',
    policyRef: 'SCP-009',
    requestor: 'Finance Controller',
    requestedAt: '2026-04-05',
    amount: 42_800,
    status: 'pending',
    priority: 'medium',
    reviewer: 'CRB',
    summary:
      '$42.8K commission clawback on cancelled Q1 lab equipment order. Rep requests waiver citing customer bankruptcy (force majeure). Needs CRB review under SCP-009 clawback policy.',
    decisionDueBy: '2026-04-20',
    threadCount: 3,
  },
  {
    id: 'apr-005',
    title: 'Territory Transition Credit — Acquired Reseller Accounts',
    policyRef: 'SCP-006',
    requestor: 'Kyle Morrison (Central RVP)',
    requestedAt: '2026-03-25',
    status: 'escalated',
    priority: 'high',
    reviewer: 'VP Sales → SGCC',
    summary:
      'Transition credits for 12 accounts moved from departing AE to new territory owner. Dispute over protection period (90 vs 120 days). Escalated to SGCC per SCP-006 §4.',
    decisionDueBy: '2026-04-10',
    threadCount: 11,
  },
  {
    id: 'apr-006',
    title: 'LOA Commission Treatment — Extended Medical Leave',
    policyRef: 'SCP-005',
    requestor: 'HR Business Partner',
    requestedAt: '2026-04-01',
    status: 'approved',
    priority: 'low',
    reviewer: 'HR + Sales Comp',
    summary:
      '8-week medical LOA for West Region AE. Standard pro-rata quota and commission treatment per SCP-005 applied. Approved 2026-04-03.',
    decisionDueBy: '2026-04-08',
    threadCount: 2,
  },
  {
    id: 'apr-007',
    title: '$312K ASC 606 Allocation Variance — Multi-Year SaaS Bundle',
    policyRef: 'SCP-018',
    requestor: 'Revenue Accounting',
    requestedAt: '2026-04-06',
    amount: 312_000,
    status: 'pending',
    priority: 'high',
    reviewer: 'Revenue Controller + External Audit',
    summary:
      'Bundle pricing creates $312K discount allocation difference under ASC 606 residual vs. relative SSP method. Commission timing impact ~$67K. Requires SCP-018 SOX control sign-off.',
    decisionDueBy: '2026-04-15',
    threadCount: 7,
  },
  {
    id: 'apr-008',
    title: 'Draw Recoverability Policy — 3 New Enterprise AE Hires',
    policyRef: 'SCP-003',
    requestor: 'Talent Acquisition',
    requestedAt: '2026-04-03',
    amount: 225_000,
    status: 'approved',
    priority: 'low',
    reviewer: 'Sales Comp',
    summary:
      'Standard 6-month recoverable draw structure for 3 enterprise AE hires per SCP-003. $75K per hire. Approved with standard 24-month recovery term.',
    decisionDueBy: '2026-04-10',
    threadCount: 1,
  },
];

export interface DecisionRecord {
  id: string;
  date: string;
  policyRef: string;
  title: string;
  decision: 'approved' | 'rejected' | 'modified';
  rationale: string;
  voters: string[];
  impactDollars?: number;
}

export const DECISIONS: DecisionRecord[] = [
  {
    id: 'dec-001',
    date: '2026-04-03',
    policyRef: 'SCP-005',
    title: 'LOA Commission Treatment — Extended Medical Leave',
    decision: 'approved',
    rationale:
      'Standard pro-rata treatment per SCP-005 §3. No precedent-setting deviation. Unanimous.',
    voters: ['HR VP', 'Sales Comp Lead', 'Finance Controller'],
  },
  {
    id: 'dec-002',
    date: '2026-04-01',
    policyRef: 'SCP-002',
    title: 'Northeast Territory Merge — Quota Adjustment',
    decision: 'modified',
    rationale:
      'Approved quota reduction but held back 15% buffer pending Q2 performance review. Modification noted in territory record.',
    voters: ['VP Sales', 'Sales Ops Director', 'Finance Controller'],
    impactDollars: 142_000,
  },
  {
    id: 'dec-003',
    date: '2026-03-22',
    policyRef: 'SCP-008',
    title: 'Q1 Pharma SPIF Payout Calculation',
    decision: 'approved',
    rationale:
      'Q1 Pharma SPIF results validated and approved. 34 reps qualified, $267K total payout. Within SCP-008 SGCC authority band.',
    voters: ['SGCC Chair', 'Sales Comp Lead', 'CFO delegate'],
    impactDollars: 267_000,
  },
  {
    id: 'dec-004',
    date: '2026-03-18',
    policyRef: 'SCP-010',
    title: 'California Wage Law Compliance Update',
    decision: 'approved',
    rationale:
      'Adopted new California AB-2288 commission statement requirements for 2026. Plan documents updated across all CA territories.',
    voters: ['Legal', 'HR VP', 'Sales Comp Lead'],
  },
  {
    id: 'dec-005',
    date: '2026-03-12',
    policyRef: 'SCP-007',
    title: 'Q1 Windfall Review — Medical Equipment Enterprise Deal',
    decision: 'modified',
    rationale:
      'Windfall cap applied at 135% of normal payout per SCP-007 option C. Remaining credit allocated to future quota relief.',
    voters: ['CRB Chair', 'CFO', 'VP Sales'],
    impactDollars: 189_000,
  },
  {
    id: 'dec-006',
    date: '2026-03-05',
    policyRef: 'SCP-001',
    title: 'Deal Crediting Dispute — Joint Account Coverage',
    decision: 'approved',
    rationale:
      'Split credit 60/40 between Named Account AE and Territory AE per SCP-001 shared coverage rules. Both reps notified.',
    voters: ['Sales Ops Director', 'VP Sales'],
  },
];

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'committee' | 'approval' | 'review' | 'training' | 'deadline';
  committee?: string;
  attendees: number;
  location: string;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-001',
    title: 'Compensation Review Board — April Meeting',
    date: '2026-04-10',
    time: '10:00 AM EDT',
    category: 'committee',
    committee: 'CRB',
    attendees: 9,
    location: 'Teams — CRB Channel',
  },
  {
    id: 'cal-002',
    title: 'Sales Governance Coordination Committee (SGCC)',
    date: '2026-04-12',
    time: '2:00 PM EDT',
    category: 'committee',
    committee: 'SGCC',
    attendees: 7,
    location: 'HQ Melville — Boardroom B',
  },
  {
    id: 'cal-003',
    title: 'Q2 SPIF Approval — Dental Vertical Review',
    date: '2026-04-12',
    time: '3:00 PM EDT',
    category: 'approval',
    committee: 'SGCC + CFO',
    attendees: 5,
    location: 'HQ Melville — Boardroom B',
  },
  {
    id: 'cal-004',
    title: 'Q1 Plan Performance Review — Sales Leadership',
    date: '2026-04-15',
    time: '9:00 AM EDT',
    category: 'review',
    attendees: 14,
    location: 'Teams — Sales Leadership',
  },
  {
    id: 'cal-005',
    title: 'ASC 606 Revenue Controller Sync',
    date: '2026-04-15',
    time: '1:00 PM EDT',
    category: 'review',
    attendees: 4,
    location: 'Teams — Revenue Accounting',
  },
  {
    id: 'cal-006',
    title: 'Windfall Review — West Region Enterprise Deal',
    date: '2026-04-16',
    time: '11:00 AM EDT',
    category: 'approval',
    committee: 'CRB',
    attendees: 9,
    location: 'Teams — CRB Channel',
  },
  {
    id: 'cal-007',
    title: 'New Hire Comp Plan Orientation',
    date: '2026-04-18',
    time: '10:00 AM EDT',
    category: 'training',
    attendees: 12,
    location: 'Teams — Sales Enablement',
  },
  {
    id: 'cal-008',
    title: 'Q2 Commission Payroll Cut-Off',
    date: '2026-04-22',
    time: '5:00 PM EDT',
    category: 'deadline',
    attendees: 0,
    location: 'System — Payroll',
  },
  {
    id: 'cal-009',
    title: 'SOX Control Testing — Q1 Walkthrough',
    date: '2026-04-24',
    time: '9:30 AM EDT',
    category: 'review',
    attendees: 6,
    location: 'Teams — Audit',
  },
  {
    id: 'cal-010',
    title: 'CRB Monthly — May Agenda Prep',
    date: '2026-04-28',
    time: '2:00 PM EDT',
    category: 'committee',
    committee: 'CRB',
    attendees: 4,
    location: 'Teams — CRB Channel',
  },
];

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export interface OperateTask {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  relatedPolicy?: string;
  description: string;
}

export const TASKS: OperateTask[] = [
  {
    id: 'tsk-001',
    title: 'Draft CRB presentation for $14.5M West Region windfall',
    owner: 'Marissa Chen',
    due: '2026-04-15',
    status: 'in_progress',
    priority: 'high',
    relatedPolicy: 'SCP-007',
    description:
      'Prepare deal economics, historical precedent analysis, and 3 payout option models for CRB April 16 review.',
  },
  {
    id: 'tsk-002',
    title: 'Update ASC 606 SOX walkthrough narrative',
    owner: 'Revenue Accounting',
    due: '2026-04-18',
    status: 'todo',
    priority: 'high',
    relatedPolicy: 'SCP-018',
    description:
      'Refresh SCP-018 control narrative for Q1 auditor walkthrough. Include new AI Credits breakage method.',
  },
  {
    id: 'tsk-003',
    title: 'Collect CA AB-2288 commission statement sign-offs',
    owner: 'Legal Team',
    due: '2026-04-12',
    status: 'blocked',
    priority: 'high',
    relatedPolicy: 'SCP-010',
    description:
      'Blocked on 3 California territory reps who have not acknowledged updated commission statement format.',
  },
  {
    id: 'tsk-004',
    title: 'Publish Q1 SPIF payout summary to sales leadership',
    owner: 'Sales Comp Lead',
    due: '2026-04-09',
    status: 'done',
    priority: 'medium',
    relatedPolicy: 'SCP-008',
    description:
      'Q1 Pharma SPIF summary published 2026-04-07: 34 reps, $267K payout, top performer recognition.',
  },
  {
    id: 'tsk-005',
    title: 'Reconcile Northeast territory quota re-baseline',
    owner: 'Sales Ops',
    due: '2026-04-14',
    status: 'in_progress',
    priority: 'medium',
    relatedPolicy: 'SCP-002',
    description:
      'Update CRM and comp system with modified quotas from 2026-04-01 SGCC decision. 3 reps affected.',
  },
  {
    id: 'tsk-006',
    title: 'Review draw recoverability for 3 new enterprise AE hires',
    owner: 'Sales Comp',
    due: '2026-04-20',
    status: 'todo',
    priority: 'low',
    relatedPolicy: 'SCP-003',
    description:
      'Standard 6-month recoverable draw setup. Await start dates from HR then finalize recovery schedules.',
  },
];

export interface Notification {
  id: string;
  type: 'approval' | 'decision' | 'deadline' | 'alert' | 'mention';
  title: string;
  body: string;
  at: string;
  read: boolean;
  relatedPolicy?: string;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'ntf-001',
    type: 'approval',
    title: 'Pending: West Region Windfall Review',
    body: 'CRB review requested for $14.5M deal. Decision due 2026-04-16.',
    at: '2026-04-08 09:12',
    read: false,
    relatedPolicy: 'SCP-007',
  },
  {
    id: 'ntf-002',
    type: 'alert',
    title: 'SOX control test upcoming',
    body: 'Q1 SCP-018 walkthrough scheduled for 2026-04-24. 3 controls need evidence attached.',
    at: '2026-04-08 08:45',
    read: false,
    relatedPolicy: 'SCP-018',
  },
  {
    id: 'ntf-003',
    type: 'decision',
    title: 'Approved: Mid-Year Quota Adjustment',
    body: 'Northeast territory merge quota adjustment approved with 15% performance buffer.',
    at: '2026-04-01 14:22',
    read: true,
    relatedPolicy: 'SCP-002',
  },
  {
    id: 'ntf-004',
    type: 'deadline',
    title: 'Commission payroll cut-off approaching',
    body: 'Q2 commission payroll cut-off is 2026-04-22 5:00 PM EDT.',
    at: '2026-04-08 07:30',
    read: false,
  },
  {
    id: 'ntf-005',
    type: 'mention',
    title: '@you in dispute thread dsp-012',
    body: 'Marissa Chen tagged you in the West Region windfall discussion.',
    at: '2026-04-07 16:05',
    read: true,
  },
  {
    id: 'ntf-006',
    type: 'alert',
    title: 'California commission statement compliance',
    body: '3 reps have not acknowledged updated CA AB-2288 commission statement format.',
    at: '2026-04-07 11:18',
    read: false,
    relatedPolicy: 'SCP-010',
  },
  {
    id: 'ntf-007',
    type: 'approval',
    title: 'Pending: Q2 Dental Vertical SPIF',
    body: '$180K SPIF request crosses SGCC+CFO approval band. Review meeting 2026-04-12.',
    at: '2026-04-04 10:02',
    read: true,
    relatedPolicy: 'SCP-008',
  },
];

export function getApprovalStats() {
  return {
    pending: APPROVALS.filter((a) => a.status === 'pending').length,
    approved: APPROVALS.filter((a) => a.status === 'approved').length,
    escalated: APPROVALS.filter((a) => a.status === 'escalated').length,
    highPriority: APPROVALS.filter((a) => a.priority === 'high').length,
  };
}
