// data/register/platform-data.ts

export interface IntegrationNode {
  id: string;
  name: string;
  type: 'core' | 'spoke';
  description: string;
  icon: string; // Lucide icon name
  color: string;
  syncFrequency: string;
  dataDirection: 'inbound' | 'outbound' | 'bidirectional';
  status: 'connected' | 'configured' | 'available';
  lastSync?: string;
  recordCount?: number;
}

export interface VaricentFieldMapping {
  prizymField: string;
  prizymSection: string;
  varicentField: string;
  varicentSection: string;
  syncStatus: 'synced' | 'pending' | 'not_mapped';
  lastUpdated: string;
}

export interface SyncEvent {
  id: string;
  timestamp: string;
  direction: 'push' | 'pull';
  recordCount: number;
  status: 'success' | 'warning' | 'error';
  detail: string;
}

export interface RoiMetric {
  label: string;
  before: string;
  after: string;
  improvement: string;
  icon: string;
}

export const INTEGRATION_NODES: IntegrationNode[] = [
  {
    id: 'prizym',
    name: 'PRIZYM',
    type: 'core',
    description: 'Revenue Operating System',
    icon: 'Hexagon',
    color: '#1E3A5F',
    syncFrequency: 'Core Hub',
    dataDirection: 'bidirectional',
    status: 'connected',
  },
  {
    id: 'pos',
    name: 'POS System',
    type: 'spoke',
    description: 'Transaction data, sale details, returns',
    icon: 'CreditCard',
    color: '#8B5CF6',
    syncFrequency: 'Real-time',
    dataDirection: 'inbound',
    status: 'connected',
    lastSync: '2 min ago',
    recordCount: 847342,
  },
  {
    id: 'hris',
    name: 'HRIS',
    type: 'spoke',
    description: 'Headcount, roles, territories, org structure',
    icon: 'Users',
    color: '#06B6D4',
    syncFrequency: 'Daily',
    dataDirection: 'inbound',
    status: 'connected',
    lastSync: '6 hours ago',
    recordCount: 4238,
  },
  {
    id: 'varicent',
    name: 'Varicent',
    type: 'spoke',
    description: 'Plan sync, calculation validation, comp admin',
    icon: 'Link',
    color: '#10B981',
    syncFrequency: 'Hourly',
    dataDirection: 'bidirectional',
    status: 'connected',
    lastSync: '34 min ago',
    recordCount: 12450,
  },
  {
    id: 'payroll',
    name: 'Payroll',
    type: 'spoke',
    description: 'Payout export, tax calculations, deductions',
    icon: 'DollarSign',
    color: '#F59E0B',
    syncFrequency: 'Bi-weekly',
    dataDirection: 'outbound',
    status: 'configured',
    lastSync: 'Mar 1, 2026',
    recordCount: 4200,
  },
  {
    id: 'bi',
    name: 'BI / Data Warehouse',
    type: 'spoke',
    description: 'Analytics feed, historical reporting, executive dashboards',
    icon: 'BarChart3',
    color: '#EF4444',
    syncFrequency: 'Daily',
    dataDirection: 'outbound',
    status: 'available',
  },
];

export const VARICENT_FIELD_MAPPINGS: VaricentFieldMapping[] = [
  { prizymField: 'Base Salary', prizymSection: 'Comp Plan', varicentField: 'Fixed Pay', varicentSection: 'Plan Components', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Per-Unit Commission', prizymSection: 'Comp Plan', varicentField: 'Credit Rule', varicentSection: 'Credits', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Volume Tier Rates', prizymSection: 'Comp Plan', varicentField: 'Rate Table', varicentSection: 'Incentives', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Attach Rate Accel.', prizymSection: 'Comp Plan', varicentField: 'Qualifier', varicentSection: 'Measurements', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Monthly Revenue', prizymSection: 'Measurements', varicentField: 'Period Measure', varicentSection: 'Measurements', syncStatus: 'synced', lastUpdated: '2026-03-11' },
  { prizymField: 'Units Sold', prizymSection: 'Measurements', varicentField: 'Credit Amount', varicentSection: 'Credits', syncStatus: 'synced', lastUpdated: '2026-03-11' },
  { prizymField: 'Attach Rate %', prizymSection: 'Measurements', varicentField: 'Qualifier Value', varicentSection: 'Measurements', syncStatus: 'synced', lastUpdated: '2026-03-11' },
  { prizymField: 'ASP', prizymSection: 'Measurements', varicentField: 'Derived Measure', varicentSection: 'Measurements', syncStatus: 'pending', lastUpdated: '2026-03-09' },
  { prizymField: 'SPIFF Awards', prizymSection: 'Payouts', varicentField: 'Bonus Payment', varicentSection: 'Incentives', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Dispute Status', prizymSection: 'Disputes', varicentField: 'Adjustment', varicentSection: 'Credits', syncStatus: 'not_mapped', lastUpdated: 'N/A' },
  { prizymField: 'Financing Flag', prizymSection: 'Measurements', varicentField: 'Custom Attribute', varicentSection: 'Credits', syncStatus: 'synced', lastUpdated: '2026-03-11' },
  { prizymField: 'Store Format', prizymSection: 'Territory', varicentField: 'Position Attribute', varicentSection: 'Plan Components', syncStatus: 'synced', lastUpdated: '2026-03-10' },
];

export const SYNC_LOG: SyncEvent[] = [
  { id: 'ev-1', timestamp: '2026-03-11 10:34:12', direction: 'push', recordCount: 847, status: 'success', detail: 'Daily measurement sync — revenue, units, attach rates' },
  { id: 'ev-2', timestamp: '2026-03-11 09:00:05', direction: 'pull', recordCount: 12, status: 'success', detail: 'Plan component update — Q2 tier adjustments' },
  { id: 'ev-3', timestamp: '2026-03-10 22:00:03', direction: 'push', recordCount: 4200, status: 'success', detail: 'End-of-day full sync — all rep measurements' },
  { id: 'ev-4', timestamp: '2026-03-10 18:30:00', direction: 'push', recordCount: 3, status: 'warning', detail: 'Dispute sync — 3 pending adjustments (ASP mapping incomplete)' },
  { id: 'ev-5', timestamp: '2026-03-10 14:00:08', direction: 'push', recordCount: 423, status: 'success', detail: 'Midday measurement sync — morning shift data' },
  { id: 'ev-6', timestamp: '2026-03-10 09:00:04', direction: 'pull', recordCount: 0, status: 'success', detail: 'Plan component check — no changes detected' },
  { id: 'ev-7', timestamp: '2026-03-09 22:00:02', direction: 'push', recordCount: 4200, status: 'success', detail: 'End-of-day full sync — all rep measurements' },
  { id: 'ev-8', timestamp: '2026-03-09 16:45:00', direction: 'push', recordCount: 1, status: 'error', detail: 'ASP derived measure sync failed — mapping incomplete' },
  { id: 'ev-9', timestamp: '2026-03-09 14:00:06', direction: 'push', recordCount: 398, status: 'success', detail: 'Midday measurement sync — morning shift data' },
  { id: 'ev-10', timestamp: '2026-03-09 09:00:03', direction: 'pull', recordCount: 8, status: 'success', detail: 'Plan component update — SPIFF calendar March entries' },
];

export const ROI_METRICS: RoiMetric[] = [
  { label: 'Comp Admin Hours / Month', before: '320 hrs', after: '45 hrs', improvement: '86% reduction', icon: 'Clock' },
  { label: 'Average Attach Rate', before: '24%', after: '38%', improvement: '+14 points', icon: 'TrendingUp' },
  { label: 'Dispute Resolution Time', before: '12 days', after: '2.4 days', improvement: '80% faster', icon: 'AlertTriangle' },
  { label: 'Rep Comp Visibility', before: 'Monthly statement', after: 'Real-time', improvement: 'Always current', icon: 'Eye' },
  { label: 'Coaching Effectiveness', before: 'Quarterly review', after: 'Daily AI insights', improvement: 'Continuous', icon: 'Brain' },
];

export const ACT_SUMMARY = [
  { act: 1, name: 'Corporate Strategy', icon: 'Building2', description: 'Portfolio management, market positioning, seasonal planning' },
  { act: 2, name: 'Sales Strategy', icon: 'Target', description: 'District planning, store targets, product mix optimization' },
  { act: 3, name: 'Store Operations', icon: 'Monitor', description: 'Floor management, POS analytics, manager coaching tools' },
  { act: 4, name: 'Sales Planning', icon: 'TrendingUp', description: 'AI forecasting, headcount, scheduling, target setting' },
  { act: 5, name: 'Sales Compensation', icon: 'DollarSign', description: 'Plan design, measurements, payouts, disputes, reporting' },
  { act: 6, name: 'Platform & Integrations', icon: 'Network', description: 'Architecture, Varicent sync, product overview' },
];
