/**
 * Prizym Governance — Dispute Quadrant Synthetic Data
 * Commission disputes, cases, resolution tracking
 */

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'escalated';
export type DisputeCategory = 'crediting' | 'quota' | 'payment' | 'territory' | 'clawback' | 'plan_interpretation';

export interface DisputeCase {
  id: string;
  caseNumber: string;
  title: string;
  category: DisputeCategory;
  status: DisputeStatus;
  filedBy: string;
  filedAt: string;
  amountDisputed: number;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  daysOpen: number;
  slaDays: number;
  summary: string;
  relatedPolicy: string;
  thread: Array<{ author: string; at: string; note: string }>;
}

export const DISPUTE_CASES: DisputeCase[] = [
  {
    id: 'dsp-001',
    caseNumber: 'DSP-2026-042',
    title: 'Split Credit Dispute — Pacific Northwest Territory',
    category: 'crediting',
    status: 'under_review',
    filedBy: 'AE-4471 (Pacific NW)',
    filedAt: '2026-04-02',
    amountDisputed: 42_300,
    assignedTo: 'Sales Ops Director',
    priority: 'high',
    daysOpen: 7,
    slaDays: 14,
    summary:
      'Rep disputes 60/40 split credit on $420K ARR account. Claims 100% of meeting activity was rep-led vs. joint account team coverage. Requesting 100% credit per SCP-001.',
    relatedPolicy: 'SCP-001',
    thread: [
      { author: 'AE-4471', at: '2026-04-02', note: 'Filed dispute. Have meeting logs from Q1 showing I led every call.' },
      { author: 'Sales Ops Director', at: '2026-04-03', note: 'Acknowledged. Pulling Gong transcripts + CRM activity for comparison.' },
      { author: 'Named Account AE', at: '2026-04-05', note: 'Counter-argument: I sourced this account in 2024 and retained stewardship through Q1.' },
    ],
  },
  {
    id: 'dsp-002',
    caseNumber: 'DSP-2026-041',
    title: 'Quota Appeal — Mid-Year Territory Realignment',
    category: 'quota',
    status: 'open',
    filedBy: 'AE-3892 (Central)',
    filedAt: '2026-04-04',
    amountDisputed: 28_500,
    assignedTo: 'Sales Comp Lead',
    priority: 'medium',
    daysOpen: 5,
    slaDays: 21,
    summary:
      'Mid-year territory consolidation resulted in 18% quota increase without proportional account coverage adjustment. Appeals under SCP-002 mid-period change rules.',
    relatedPolicy: 'SCP-002',
    thread: [
      { author: 'AE-3892', at: '2026-04-04', note: 'Quota jumped from $2.8M to $3.3M but I only received 40% of the departed rep accounts.' },
    ],
  },
  {
    id: 'dsp-003',
    caseNumber: 'DSP-2026-040',
    title: 'Clawback Dispute — Customer Bankruptcy Chargeback',
    category: 'clawback',
    status: 'escalated',
    filedBy: 'AE-2156 (Enterprise)',
    filedAt: '2026-03-28',
    amountDisputed: 67_800,
    assignedTo: 'CRB',
    priority: 'high',
    daysOpen: 12,
    slaDays: 30,
    summary:
      'Rep disputes full clawback of commission on cancelled Q1 order. Claims force majeure exception should apply due to customer Chapter 11 filing. Escalated to CRB under SCP-009.',
    relatedPolicy: 'SCP-009',
    thread: [
      { author: 'AE-2156', at: '2026-03-28', note: 'Deal was solid at close. Customer bankruptcy filed 45 days later — outside my control.' },
      { author: 'Finance Controller', at: '2026-03-30', note: 'SCP-009 states clawback applies to all chargebacks. No force majeure clause exists.' },
      { author: 'AE-2156', at: '2026-04-02', note: 'Requesting escalation to CRB. This will set precedent for future bankruptcy events.' },
      { author: 'CRB Chair', at: '2026-04-04', note: 'Accepted for CRB April 16 agenda. Legal opinion requested.' },
    ],
  },
  {
    id: 'dsp-004',
    caseNumber: 'DSP-2026-039',
    title: 'Payment Timing — 45-Day vs. 30-Day Commission Cycle',
    category: 'payment',
    status: 'resolved',
    filedBy: 'AE-5203 (West)',
    filedAt: '2026-03-20',
    amountDisputed: 0,
    assignedTo: 'Finance Team',
    priority: 'low',
    daysOpen: 15,
    slaDays: 21,
    summary:
      'Rep claimed commission payment delayed 15 days beyond SCP-003 timing. Investigation showed routing bank holiday delay. Resolved with retroactive interest.',
    relatedPolicy: 'SCP-003',
    thread: [
      { author: 'AE-5203', at: '2026-03-20', note: 'Q1 commission arrived 15 days late. Violates SCP-003 payment timing.' },
      { author: 'Finance Team', at: '2026-03-25', note: 'Bank routing delay confirmed. Retroactive interest added per SCP-003 §4.' },
      { author: 'AE-5203', at: '2026-04-04', note: 'Resolution accepted. Closing dispute.' },
    ],
  },
  {
    id: 'dsp-005',
    caseNumber: 'DSP-2026-038',
    title: 'Territory Boundary — Healthcare Vertical Overlap',
    category: 'territory',
    status: 'under_review',
    filedBy: 'AE-1824 (Healthcare Named)',
    filedAt: '2026-03-25',
    amountDisputed: 135_000,
    assignedTo: 'VP Sales',
    priority: 'high',
    daysOpen: 14,
    slaDays: 21,
    summary:
      'Overlapping coverage between Healthcare Named Account and Central Territory reps. $135K deal closed. Dispute over who gets primary credit.',
    relatedPolicy: 'SCP-006',
    thread: [
      { author: 'AE-1824', at: '2026-03-25', note: 'Account is on my named list since January 2026. Central rep engaged first but I am the named owner.' },
      { author: 'AE-3741', at: '2026-03-27', note: 'I identified, engaged, and closed this deal. Named list change was announced after I started pursuit.' },
      { author: 'VP Sales', at: '2026-04-01', note: 'Reviewing timeline and CRM history. Decision by 2026-04-15.' },
    ],
  },
  {
    id: 'dsp-006',
    caseNumber: 'DSP-2026-037',
    title: 'Plan Interpretation — SPIF Eligibility for LOA Return',
    category: 'plan_interpretation',
    status: 'resolved',
    filedBy: 'HR Business Partner',
    filedAt: '2026-03-15',
    amountDisputed: 12_500,
    assignedTo: 'Sales Comp Lead',
    priority: 'medium',
    daysOpen: 10,
    slaDays: 14,
    summary:
      'Rep returning from medical LOA during Q1 Pharma SPIF period. SCP-005 + SCP-008 interpretation needed on pro-rata SPIF eligibility.',
    relatedPolicy: 'SCP-005, SCP-008',
    thread: [
      { author: 'HR BP', at: '2026-03-15', note: 'Rep returned from LOA on 2026-02-14. SPIF period was 2026-01-01 to 2026-03-31.' },
      { author: 'Sales Comp Lead', at: '2026-03-22', note: 'Pro-rata SPIF eligibility confirmed: 46 days active / 90 day period = 51.1% pro-rata payout.' },
      { author: 'HR BP', at: '2026-03-25', note: 'Resolution accepted. Rep notified.' },
    ],
  },
];

export function getDisputeStats() {
  return {
    open: DISPUTE_CASES.filter(d => d.status === 'open').length,
    underReview: DISPUTE_CASES.filter(d => d.status === 'under_review').length,
    escalated: DISPUTE_CASES.filter(d => d.status === 'escalated').length,
    resolved: DISPUTE_CASES.filter(d => d.status === 'resolved').length,
    totalDisputed: DISPUTE_CASES.reduce((sum, d) => sum + d.amountDisputed, 0),
  };
}
