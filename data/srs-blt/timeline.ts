// SRS Distribution — Effective-Dated Timeline Events
// Models territory assignments, plan changes, and branch events

export type EventType = 'assignment' | 'plan_change' | 'branch_event' | 'territory_change' | 'promotion';

export interface TimelineEvent {
  id: string;
  date: string;
  effectiveStart: string;
  effectiveEnd: string | null;
  type: EventType;
  title: string;
  description: string;
  employeeId: string | null;
  branchId: string | null;
  division: 'SRS' | 'Heritage' | 'Both';
  impact: 'low' | 'medium' | 'high';
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  // Q1 2026 events
  { id: 'te-001', date: '2026-01-15', effectiveStart: '2026-02-01', effectiveEnd: null, type: 'assignment', title: 'Susan Boyer → South Central RM', description: 'Assigned 12 branches in TX/OK region. Replaces retiring RM (Mike Davis).', employeeId: 'e-030', branchId: null, division: 'SRS', impact: 'high' },
  { id: 'te-002', date: '2026-01-20', effectiveStart: '2026-02-01', effectiveEnd: null, type: 'plan_change', title: 'FY26 SVP Plan Published', description: 'SVP incentive targets increased 5% YoY. New EBITDA threshold added at 97%.', employeeId: null, branchId: null, division: 'Both', impact: 'high' },
  { id: 'te-003', date: '2026-02-01', effectiveStart: '2026-02-01', effectiveEnd: null, type: 'branch_event', title: 'SRS Boise (Greenfield) Opens', description: 'New greenfield location in Mountain region. Initial ramp plan: 6-month protected quota.', employeeId: null, branchId: 'b-060', division: 'SRS', impact: 'medium' },
  { id: 'te-004', date: '2026-02-10', effectiveStart: '2026-03-01', effectiveEnd: null, type: 'territory_change', title: 'TX Gulf Credit Region Split', description: 'TX-Gulf split into TX-Gulf-North and TX-Gulf-South. Affects 14 branches and 3 RMs.', employeeId: null, branchId: null, division: 'SRS', impact: 'high' },
  { id: 'te-005', date: '2026-02-15', effectiveStart: '2026-02-15', effectiveEnd: null, type: 'promotion', title: 'Derek Martinez → ABM Dallas North', description: 'Promoted from inside sales to Assistant Branch Manager. 90-day transition plan.', employeeId: 'e-040', branchId: 'b-001', division: 'SRS', impact: 'low' },

  // Heritage integration events
  { id: 'te-006', date: '2026-01-05', effectiveStart: '2026-01-15', effectiveEnd: null, type: 'branch_event', title: 'Heritage Reno Merged → Heritage Phoenix', description: 'Heritage Reno consolidated into Heritage Phoenix. Staff relocated, inventory transferred.', employeeId: null, branchId: 'b-061', division: 'Heritage', impact: 'high' },
  { id: 'te-007', date: '2026-02-20', effectiveStart: '2026-03-01', effectiveEnd: null, type: 'plan_change', title: 'Heritage RVP Bonus Pool Updated', description: 'Heritage RVP bonus pool increased by $200K to align with SRS parity initiative.', employeeId: null, branchId: null, division: 'Heritage', impact: 'medium' },
  { id: 'te-008', date: '2026-03-01', effectiveStart: '2026-03-01', effectiveEnd: '2026-06-30', type: 'assignment', title: 'Frank DeLuca → Southeast Heritage RVP', description: 'Temporary assignment covering Sarah Kowalski parental leave. 47 branches.', employeeId: 'e-022', branchId: null, division: 'Heritage', impact: 'medium' },
  { id: 'te-009', date: '2026-03-05', effectiveStart: '2026-04-01', effectiveEnd: null, type: 'territory_change', title: 'Mid-Atlantic Region Expansion', description: 'Adding 6 Heritage branches from Northeast region to Mid-Atlantic. Better geographic alignment.', employeeId: null, branchId: null, division: 'Heritage', impact: 'medium' },
  { id: 'te-010', date: '2026-03-10', effectiveStart: '2026-03-15', effectiveEnd: null, type: 'branch_event', title: 'SRS Nashville Acquisition Complete', description: 'Acquired Baker Supply Co. Nashville location. Rebranded as SRS Nashville. Heritage staff retained.', employeeId: null, branchId: null, division: 'SRS', impact: 'high' },

  // Comp-related events
  { id: 'te-011', date: '2026-01-30', effectiveStart: '2026-02-01', effectiveEnd: '2026-04-30', type: 'plan_change', title: 'Q1 SPIFF: Roofing Shingle Promo', description: 'Double commission rate on GAF HDZ Timberline shingles. All SRS branches eligible.', employeeId: null, branchId: null, division: 'SRS', impact: 'medium' },
  { id: 'te-012', date: '2026-02-28', effectiveStart: '2026-03-01', effectiveEnd: null, type: 'plan_change', title: 'BM Scorecard v2 Published', description: 'Updated BM scorecard: added safety metric (10% weight), reduced inventory weight to 15%.', employeeId: null, branchId: null, division: 'Both', impact: 'high' },
];

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  assignment: '#2563EB',
  plan_change: '#10B981',
  branch_event: '#F59E0B',
  territory_change: '#7C3AED',
  promotion: '#EC4899',
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  assignment: 'Assignment',
  plan_change: 'Plan Change',
  branch_event: 'Branch Event',
  territory_change: 'Territory Change',
  promotion: 'Promotion',
};

export const IMPACT_COLORS: Record<string, string> = {
  low: '#94A3B8',
  medium: '#F59E0B',
  high: '#EF4444',
};

export function getEventsByType(type: EventType): TimelineEvent[] {
  return TIMELINE_EVENTS.filter((e) => e.type === type);
}

export function getEventsByDivision(division: 'SRS' | 'Heritage' | 'Both'): TimelineEvent[] {
  return TIMELINE_EVENTS.filter((e) => e.division === division || e.division === 'Both');
}
