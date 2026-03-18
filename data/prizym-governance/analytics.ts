/**
 * Prizym Governance — Analytics & Metrics (Static Demo)
 */

export interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  status: 'good' | 'warning' | 'critical';
}

export interface CategoryMetric {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export const GOVERNANCE_KPIS: MetricData[] = [
  { label: 'SLA Compliance Rate', value: 94, unit: '%', trend: 'up', trendValue: 3, status: 'good' },
  { label: 'Avg Approval Time', value: 8.5, unit: 'days', trend: 'down', trendValue: 12, status: 'good' },
  { label: 'Case Resolution Time', value: 11.2, unit: 'days', trend: 'down', trendValue: 8, status: 'good' },
  { label: 'Policy Coverage', value: 90, unit: '%', trend: 'neutral', trendValue: 0, status: 'warning' },
  { label: 'Active Cases', value: 4, unit: 'cases', trend: 'down', trendValue: 20, status: 'good' },
  { label: 'Pending Approvals', value: 3, unit: 'items', trend: 'up', trendValue: 50, status: 'warning' },
  { label: 'Committee Meetings', value: 12, unit: 'YTD', trend: 'up', trendValue: 20, status: 'good' },
  { label: 'Document Updates', value: 18, unit: 'this month', trend: 'up', trendValue: 28, status: 'good' },
];

export const CASE_VOLUME_BY_TYPE: CategoryMetric[] = [
  { category: 'Exceptions', count: 12, percentage: 35, color: '#f59e0b' },
  { category: 'Disputes', count: 8, percentage: 24, color: '#ec4899' },
  { category: 'Territory Changes', count: 7, percentage: 21, color: '#8b5cf6' },
  { category: 'Quota Adjustments', count: 5, percentage: 15, color: '#3b82f6' },
  { category: 'Plan Modifications', count: 2, percentage: 5, color: '#10b981' },
];

export const APPROVAL_DECISIONS: CategoryMetric[] = [
  { category: 'Approved', count: 52, percentage: 74, color: '#10b981' },
  { category: 'Approved with Conditions', count: 12, percentage: 17, color: '#eab308' },
  { category: 'Rejected', count: 4, percentage: 6, color: '#dc2626' },
  { category: 'Needs More Info', count: 2, percentage: 3, color: '#6b7280' },
];

export const RISK_DISTRIBUTION: CategoryMetric[] = [
  { category: 'Critical', count: 6, percentage: 15, color: '#dc2626' },
  { category: 'High', count: 12, percentage: 30, color: '#f97316' },
  { category: 'Medium', count: 14, percentage: 35, color: '#eab308' },
  { category: 'Low', count: 8, percentage: 20, color: '#6b7280' },
];

export const TOP_PERFORMERS = [
  { name: 'Sarah Chen', role: 'VP Sales Compensation', decisions: 28, avgDays: 6.2 },
  { name: 'Amanda Foster', role: 'VP Sales Operations', decisions: 24, avgDays: 7.5 },
  { name: 'Michael Rodriguez', role: 'CFO', decisions: 18, avgDays: 8.1 },
  { name: 'Patricia Garcia', role: 'Director of Finance', decisions: 16, avgDays: 5.8 },
  { name: 'Lisa Park', role: 'Sales Compensation Manager', decisions: 14, avgDays: 4.2 },
];

export const RECENT_HIGHLIGHTS = [
  { id: 'h1', date: '2025-12-17', title: 'SLA Compliance Improved', description: 'Approval SLA compliance reached 97%, up 3% from last month', type: 'success' as const },
  { id: 'h2', date: '2025-12-15', title: 'Policy Coverage Gap Identified', description: 'ARR Recognition policy gap flagged in governance matrix review', type: 'warning' as const },
  { id: 'h3', date: '2025-12-12', title: 'Large Windfall Approved', description: 'CRB approved $2.5M deal with commission cap at $180K', type: 'info' as const },
  { id: 'h4', date: '2025-12-09', title: 'Committee Meeting Completed', description: 'SGCC Q4 meeting: 4 policies approved, 1 tabled for revision', type: 'info' as const },
];

export const POLICY_COVERAGE_HEALTH = {
  total: 20,
  fullCoverage: 18,
  gaps: 2,
  coveragePercentage: 90,
  criticalGaps: 0,
  highPriorityGaps: 2,
};
