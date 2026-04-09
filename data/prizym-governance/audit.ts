/**
 * Prizym Governance — Audit Trail (Static Demo)
 */

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: string;
  category: 'DOCUMENT' | 'APPROVAL' | 'CASE' | 'COMMITTEE' | 'POLICY' | 'ACCESS';
  actor: string;
  actorRole: string;
  targetName: string;
  action: string;
  description: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  committee?: 'SGCC' | 'CRB';
}

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'a-001', timestamp: '2025-12-17T11:00:00Z', eventType: 'CASE_UPDATED', category: 'CASE', actor: 'Amanda Foster', actorRole: 'VP Sales Operations', targetName: 'CASE-2025-1201', action: 'Escalated to CRB', description: 'Territory change case escalated to CRB for review. Recommending $30K quota relief.', impactLevel: 'HIGH', committee: 'CRB' },
  { id: 'a-002', timestamp: '2025-12-16T15:00:00Z', eventType: 'CASE_OPENED', category: 'CASE', actor: 'Thomas Anderson', actorRole: 'Account Executive', targetName: 'CASE-2025-1267', action: 'Exception Request Submitted', description: 'Draw repayment extension requested due to financial hardship. 3-month extension sought.', impactLevel: 'MEDIUM', committee: 'SGCC' },
  { id: 'a-003', timestamp: '2025-12-15T14:30:00Z', eventType: 'APPROVAL_DECIDED', category: 'APPROVAL', actor: 'Michael Rodriguez', actorRole: 'CFO (Vice Chair)', targetName: 'Mid-Period Plan Change Policy - v2.0', action: 'Approved', description: 'CFO approved Mid-Period Plan Change Policy v2.0. Financial impact is acceptable.', impactLevel: 'HIGH', committee: 'SGCC' },
  { id: 'a-004', timestamp: '2025-12-15T10:00:00Z', eventType: 'APPROVAL_SUBMITTED', category: 'APPROVAL', actor: 'Sarah Chen', actorRole: 'VP Sales Compensation', targetName: 'Mid-Period Plan Change Policy - v2.0', action: 'Submitted for SGCC Approval', description: 'New policy governing mid-year compensation plan changes submitted to SGCC for review.', impactLevel: 'HIGH', committee: 'SGCC' },
  { id: 'a-005', timestamp: '2025-12-14T09:00:00Z', eventType: 'CASE_OPENED', category: 'CASE', actor: 'Michael Torres', actorRole: 'VP Sales', targetName: 'CASE-2025-1256', action: 'Plan Modification Request', description: 'BDR to AE role transition requested for Christina Park, effective Jan 1.', impactLevel: 'MEDIUM', committee: 'SGCC' },
  { id: 'a-006', timestamp: '2025-12-12T09:00:00Z', eventType: 'APPROVAL_SUBMITTED', category: 'APPROVAL', actor: 'Amanda Foster', actorRole: 'VP Sales Operations', targetName: 'Windfall Deal - Acme Corp $2.5M ARR', action: 'Submitted to CRB', description: 'Large enterprise deal submitted for windfall review. $2.5M ARR, $180K commission payout.', impactLevel: 'CRITICAL', committee: 'CRB' },
  { id: 'a-007', timestamp: '2025-12-11T10:15:00Z', eventType: 'APPROVAL_DECIDED', category: 'APPROVAL', actor: 'Sarah Chen', actorRole: 'SGCC Chair', targetName: 'Q1 2026 New Product Launch SPIF', action: 'Approved', description: 'Product launch SPIF approved. $40K budget, $500 per qualified deal.', impactLevel: 'MEDIUM', committee: 'SGCC' },
  { id: 'a-008', timestamp: '2025-12-09T15:00:00Z', eventType: 'CASE_RESOLVED', category: 'CASE', actor: 'Lisa Park', actorRole: 'Sales Compensation Manager', targetName: 'CASE-2025-1245', action: 'Case Resolved - Approved', description: 'SPIF eligibility exception approved. $500 credit added to Q4 commission run.', impactLevel: 'LOW' },
  { id: 'a-009', timestamp: '2025-12-09T11:00:00Z', eventType: 'EXCEPTION_GRANTED', category: 'CASE', actor: 'Sarah Chen', actorRole: 'VP Sales Compensation', targetName: 'CASE-2025-1245', action: 'Exception Approved', description: 'Retroactive SPIF eligibility granted to Jennifer Martinez. Deal meets all criteria.', impactLevel: 'LOW' },
  { id: 'a-010', timestamp: '2025-12-08T09:30:00Z', eventType: 'CASE_OPENED', category: 'CASE', actor: 'Mark Stevens', actorRole: 'Regional Sales Manager', targetName: 'CASE-2025-1201', action: 'Territory Change Case Submitted', description: 'Mid-quarter territory reassignment case filed for Lisa Johnson. $30K quota adjustment requested.', impactLevel: 'HIGH', committee: 'CRB' },
  { id: 'a-011', timestamp: '2025-12-02T15:30:00Z', eventType: 'APPROVAL_DECIDED', category: 'APPROVAL', actor: 'Patricia Garcia', actorRole: 'Director of Finance', targetName: 'Windfall Deal - TechStart Inc', action: 'Approved with Cap', description: 'CRB approved windfall deal with commission cap at $80K (2x monthly target).', impactLevel: 'HIGH', committee: 'CRB' },
  { id: 'a-012', timestamp: '2025-11-28T14:00:00Z', eventType: 'DISPUTE_FILED', category: 'CASE', actor: 'Marcus Williams', actorRole: 'Account Executive', targetName: 'CASE-2025-1189', action: 'Commission Dispute Filed', description: 'Dispute filed regarding Q3 commission calculation on multi-year deal. $42K disputed.', impactLevel: 'MEDIUM', committee: 'CRB' },
  { id: 'a-013', timestamp: '2025-01-01T00:00:00Z', eventType: 'POLICY_EFFECTIVE', category: 'POLICY', actor: 'System', actorRole: 'System', targetName: 'GC-001 SGCC Charter', action: 'Policy Became Effective', description: 'Sales Compensation Governance Committee Charter became effective.', impactLevel: 'CRITICAL', committee: 'SGCC' },
];

export const IMPACT_COLORS: Record<string, string> = {
  CRITICAL: '#dc2626',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#6b7280',
};

export const CATEGORY_COLORS: Record<string, string> = {
  DOCUMENT: '#3b82f6',
  APPROVAL: '#8b5cf6',
  CASE: '#f59e0b',
  COMMITTEE: '#10b981',
  POLICY: '#06b6d4',
  ACCESS: '#64748b',
};
