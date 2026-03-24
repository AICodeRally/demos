// Ridgeline Supply Co. — Audit Trail Data
// Immutable audit events for SOX compliance and operational traceability

export type AuditAction =
  | 'plan_published'
  | 'territory_changed'
  | 'quota_adjusted'
  | 'payout_approved'
  | 'payout_reversed'
  | 'dispute_opened'
  | 'dispute_resolved'
  | 'spiff_activated'
  | 'spiff_expired'
  | 'rebate_tier_changed'
  | 'employee_reassigned'
  | 'branch_integrated'
  | 'rate_change'
  | 'data_feed_error';

export interface AuditEvent {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  details: string;
  metadata: Record<string, string | number>;
  approvedBy: string | null;
  severity: 'info' | 'warning' | 'critical';
}

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud-001',
    action: 'plan_published',
    entityType: 'comp_plan',
    entityId: 'plan-fy2026-rsm',
    actor: 'Holley Morris',
    actorRole: 'Comp Manager',
    timestamp: '2026-01-02T09:00:00Z',
    details: 'FY2026 Regional Sales Manager Plan published. 4 components, 40% incentive target.',
    metadata: { planVersion: 3, affectedReps: 12, effectiveDate: '2026-01-01' },
    approvedBy: 'Paul Whelan',
    severity: 'info',
  },
  {
    id: 'aud-002',
    action: 'territory_changed',
    entityType: 'territory',
    entityId: 't-rsm-001',
    actor: 'Jack Egan',
    actorRole: 'Finance Admin',
    timestamp: '2026-01-15T14:30:00Z',
    details: 'TX North territory expanded: 3 Summit branches integrated (b-016, b-017, b-018 reassigned from Summit East).',
    metadata: { branchesAdded: 3, branchesRemoved: 0, effectiveDate: '2026-02-01' },
    approvedBy: 'David Kessler',
    severity: 'warning',
  },
  {
    id: 'aud-003',
    action: 'quota_adjusted',
    entityType: 'quota',
    entityId: 'quota-e-rm-001-q1',
    actor: 'Jack Egan',
    actorRole: 'Finance Admin',
    timestamp: '2026-02-25T10:15:00Z',
    details: 'Q1 quota pro-rated for Michael Torres. Summit branch integration added $4.2M to territory mid-quarter.',
    metadata: { previousQuota: 12000000, newQuota: 15200000, reason: 'territory_expansion' },
    approvedBy: 'Susan Boyer',
    severity: 'warning',
  },
  {
    id: 'aud-004',
    action: 'payout_approved',
    entityType: 'payout',
    entityId: 'pay-feb-2026',
    actor: 'Holley Morris',
    actorRole: 'Comp Manager',
    timestamp: '2026-03-05T16:00:00Z',
    details: 'February 2026 payout batch approved. 847 reps, $2.34M total incentive. Legacy ICM calc verified.',
    metadata: { repCount: 847, totalAmount: 2340000, exceptions: 12, manualOverrides: 3 },
    approvedBy: 'Paul Whelan',
    severity: 'info',
  },
  {
    id: 'aud-005',
    action: 'payout_reversed',
    entityType: 'payout',
    entityId: 'pay-item-e-bm-003-feb',
    actor: 'Holley Morris',
    actorRole: 'Comp Manager',
    timestamp: '2026-03-08T11:00:00Z',
    details: 'Nathan Cole February SPIFF reversed. Product category mapping error in Legacy ICM feed — Premium shingles miscoded as GAF.',
    metadata: { originalAmount: 1850, reversedAmount: 1850, reason: 'data_feed_error' },
    approvedBy: null,
    severity: 'critical',
  },
  {
    id: 'aud-006',
    action: 'dispute_opened',
    entityType: 'dispute',
    entityId: 'disp-003',
    actor: 'Nathan Cole',
    actorRole: 'BM',
    timestamp: '2026-03-05T08:30:00Z',
    details: 'Dispute filed: return reversal clawback exceeds original payout. Customer return was 30%, clawback applied at 100%.',
    metadata: { disputeAmount: 12300, orderId: 'RL-91204', returnPct: 30 },
    approvedBy: null,
    severity: 'critical',
  },
  {
    id: 'aud-007',
    action: 'spiff_activated',
    entityType: 'spiff',
    entityId: 'spiff-001',
    actor: 'Holley Morris',
    actorRole: 'Comp Manager',
    timestamp: '2026-04-01T00:00:00Z',
    details: 'GAF Storm Season Push SPIFF activated. $2.50/square for BM, ABM, BD roles. Budget: $450K.',
    metadata: { payoutPerUnit: 2.50, totalBudget: 450000, eligibleRoles: 3, duration: '90 days' },
    approvedBy: 'David Kessler',
    severity: 'info',
  },
  {
    id: 'aud-008',
    action: 'data_feed_error',
    entityType: 'integration',
    entityId: 'feed-icm-daily',
    actor: 'System',
    actorRole: 'Automated',
    timestamp: '2026-03-12T06:15:00Z',
    details: 'Legacy ICM daily transaction feed failed validation. 247 records with null branch_id. ERP sync delay detected.',
    metadata: { recordsTotal: 14820, recordsFailed: 247, errorType: 'null_branch_id', feedName: 'erp-to-icm' },
    approvedBy: null,
    severity: 'critical',
  },
  {
    id: 'aud-009',
    action: 'branch_integrated',
    entityType: 'branch',
    entityId: 'b-016',
    actor: 'Jack Egan',
    actorRole: 'Finance Admin',
    timestamp: '2026-01-15T09:00:00Z',
    details: 'Summit Philadelphia (SM-0401) integrated into Ridgeline Core reporting. Comp plan migration: Summit BM Plan → Ridgeline BM Plan.',
    metadata: { previousDivision: 'summit', newDivision: 'ridgeline-core', planMigrated: 'true' },
    approvedBy: 'Margaret Chen',
    severity: 'warning',
  },
  {
    id: 'aud-010',
    action: 'rate_change',
    entityType: 'comp_plan',
    entityId: 'plan-fy2026-bm',
    actor: 'Holley Morris',
    actorRole: 'Comp Manager',
    timestamp: '2026-02-01T10:00:00Z',
    details: 'BM Plan Outstanding tier rate increased from 1.40x to 1.50x. Retroactive to Q1 start.',
    metadata: { previousRate: '1.40', newRate: '1.50', tierLevel: 4, retroactive: 'true' },
    approvedBy: 'Paul Whelan',
    severity: 'warning',
  },
  {
    id: 'aud-011',
    action: 'employee_reassigned',
    entityType: 'employee',
    entityId: 'e-bm-002',
    actor: 'Susan Boyer',
    actorRole: 'RSM',
    timestamp: '2026-02-10T13:00:00Z',
    details: 'Rachel Kim reassigned from Fort Worth (b-003) to Dallas North (b-002). Territory credit split applied for transition period.',
    metadata: { previousBranch: 'b-003', newBranch: 'b-002', transitionDays: 30 },
    approvedBy: 'David Kessler',
    severity: 'info',
  },
  {
    id: 'aud-012',
    action: 'rebate_tier_changed',
    entityType: 'rebate',
    entityId: 'reb-001',
    actor: 'System',
    actorRole: 'Automated',
    timestamp: '2026-03-01T00:00:00Z',
    details: 'GAF Volume Rebate tier upgraded: Base → Silver. YTD purchases crossed $5M threshold.',
    metadata: { previousTier: 'Base', newTier: 'Silver', ytdPurchases: 5120000, newRate: 3.5 },
    approvedBy: null,
    severity: 'info',
  },
];

export function getAuditEventsByEntity(entityType: string, entityId?: string): AuditEvent[] {
  return AUDIT_EVENTS.filter(
    (e) => e.entityType === entityType && (!entityId || e.entityId === entityId)
  );
}

export function getRecentAuditEvents(limit = 10): AuditEvent[] {
  return [...AUDIT_EVENTS].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
}
