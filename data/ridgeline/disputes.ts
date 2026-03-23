// SRS Distribution — Dispute & Inquiry Data
// Commission disputes, payout inquiries, chargeback resolutions

export type DisputeStatus = 'open' | 'under_review' | 'escalated' | 'resolved' | 'rejected';

export interface Dispute {
  id: string;
  repId: string;
  repName: string;
  type: 'commission_error' | 'territory_credit' | 'chargeback' | 'spiff_eligibility' | 'quota_adjustment' | 'return_reversal';
  status: DisputeStatus;
  amount: number;
  description: string;
  submittedDate: string;
  resolvedDate: string | null;
  assignedTo: string;
  branchId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  resolution: string | null;
}

export interface DisputeMetrics {
  totalOpen: number;
  totalResolved: number;
  avgResolutionDays: number;
  totalDisputedAmount: number;
  byType: { type: string; count: number; amount: number }[];
  byStatus: { status: DisputeStatus; count: number }[];
  slaCompliance: number;
}

export const DISPUTES: Dispute[] = [
  {
    id: 'disp-001',
    repId: 'e-bm-001',
    repName: 'Derek Lawson',
    type: 'commission_error',
    status: 'open',
    amount: 3420,
    description: 'Q1 commission on GAF shingle order #SRS-84721 not credited. Order shipped 3/12, invoice confirmed.',
    submittedDate: '2026-03-15',
    resolvedDate: null,
    assignedTo: 'Holley Morris',
    branchId: 'b-001',
    priority: 'medium',
    resolution: null,
  },
  {
    id: 'disp-002',
    repId: 'e-bm-002',
    repName: 'Rachel Kim',
    type: 'territory_credit',
    status: 'under_review',
    amount: 8750,
    description: 'Dallas North order credited to Fort Worth branch. Customer account #4821 is assigned to Dallas North territory.',
    submittedDate: '2026-03-10',
    resolvedDate: null,
    assignedTo: 'Jack Egan',
    branchId: 'b-002',
    priority: 'high',
    resolution: null,
  },
  {
    id: 'disp-003',
    repId: 'e-bm-003',
    repName: 'Nathan Cole',
    type: 'return_reversal',
    status: 'escalated',
    amount: 12300,
    description: 'Customer return processed but commission clawback exceeds original payout. Return was partial (30%), clawback was 100%.',
    submittedDate: '2026-03-05',
    resolvedDate: null,
    assignedTo: 'Susan Boyer',
    branchId: 'b-003',
    priority: 'critical',
    resolution: null,
  },
  {
    id: 'disp-004',
    repId: 'e-rsm-001',
    repName: 'Susan Boyer',
    type: 'spiff_eligibility',
    status: 'resolved',
    amount: 4200,
    description: 'GAF Storm Season SPIFF not applied to 3 qualifying orders. Eligibility confirmed per program rules.',
    submittedDate: '2026-02-28',
    resolvedDate: '2026-03-08',
    assignedTo: 'Holley Morris',
    branchId: 'b-001',
    priority: 'medium',
    resolution: 'SPIFF credit applied. Varicent data feed had a 48-hour lag on product category mapping.',
  },
  {
    id: 'disp-005',
    repId: 'e-rm-001',
    repName: 'Michael Torres',
    type: 'quota_adjustment',
    status: 'resolved',
    amount: 0,
    description: 'Q1 quota does not reflect Heritage branch integration. 3 new branches added to territory mid-quarter.',
    submittedDate: '2026-02-15',
    resolvedDate: '2026-02-25',
    assignedTo: 'Jack Egan',
    branchId: 'b-001',
    priority: 'high',
    resolution: 'Quota pro-rated from integration date. Effective-dated territory update applied retroactively.',
  },
  {
    id: 'disp-006',
    repId: 'e-bm-002',
    repName: 'Rachel Kim',
    type: 'chargeback',
    status: 'open',
    amount: 5680,
    description: 'Warranty claim on CertainTeed product triggered chargeback against my commission. Warranty is vendor responsibility.',
    submittedDate: '2026-03-18',
    resolvedDate: null,
    assignedTo: 'Jack Egan',
    branchId: 'b-002',
    priority: 'high',
    resolution: null,
  },
  {
    id: 'disp-007',
    repId: 'e-dm-001',
    repName: 'Carlos Mendez',
    type: 'commission_error',
    status: 'resolved',
    amount: 6100,
    description: 'Margin split calculation incorrect for blended order (roofing + insulation). Should use weighted margin.',
    submittedDate: '2026-02-20',
    resolvedDate: '2026-03-01',
    assignedTo: 'Holley Morris',
    branchId: 'b-001',
    priority: 'medium',
    resolution: 'Recalculated with weighted margin formula. Delta of $6,100 added to March payout.',
  },
  {
    id: 'disp-008',
    repId: 'e-bm-001',
    repName: 'Derek Lawson',
    type: 'commission_error',
    status: 'rejected',
    amount: 1200,
    description: 'Requesting commission on contractor referral. Claims verbal agreement with RSM.',
    submittedDate: '2026-01-30',
    resolvedDate: '2026-02-10',
    assignedTo: 'Susan Boyer',
    branchId: 'b-001',
    priority: 'low',
    resolution: 'No written referral program in place. Recommended for future SPIFF consideration.',
  },
];

export const DISPUTE_METRICS: DisputeMetrics = {
  totalOpen: 3,
  totalResolved: 4,
  avgResolutionDays: 9.5,
  totalDisputedAmount: 41650,
  byType: [
    { type: 'commission_error', count: 3, amount: 10720 },
    { type: 'territory_credit', count: 1, amount: 8750 },
    { type: 'chargeback', count: 1, amount: 5680 },
    { type: 'return_reversal', count: 1, amount: 12300 },
    { type: 'spiff_eligibility', count: 1, amount: 4200 },
    { type: 'quota_adjustment', count: 1, amount: 0 },
  ],
  byStatus: [
    { status: 'open', count: 3 },
    { status: 'under_review', count: 1 },
    { status: 'escalated', count: 1 },
    { status: 'resolved', count: 4 },
    { status: 'rejected', count: 1 },
  ],
  slaCompliance: 78.5,
};

export function getDisputesByStatus(status: DisputeStatus): Dispute[] {
  return DISPUTES.filter((d) => d.status === status);
}

export function getDisputesByRep(repId: string): Dispute[] {
  return DISPUTES.filter((d) => d.repId === repId);
}
