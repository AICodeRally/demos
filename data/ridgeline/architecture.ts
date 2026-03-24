// Ridgeline Supply Co. — Platform Architecture Data
// Microservices, integration systems, and data feed topology

export interface IntegrationSystem {
  id: string;
  name: string;
  category: 'erp' | 'wms' | 'crm' | 'spm' | 'bi' | 'portal' | 'hr' | 'finance';
  vendor: string;
  status: 'connected' | 'degraded' | 'offline' | 'planned';
  description: string;
  dataFlows: string[];
  lastSync: string;
  syncFrequency: string;
  recordVolume: string;
}

export interface DataFeed {
  id: string;
  name: string;
  sourceSystem: string;
  targetSystem: string;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  frequency: string;
  format: string;
  status: 'healthy' | 'delayed' | 'error' | 'disabled';
  lastRun: string;
  avgRecords: number;
  avgDuration: string;
  description: string;
}

export interface Microservice {
  id: string;
  name: string;
  purpose: string;
  technology: string;
  port: number;
  status: 'running' | 'degraded' | 'stopped';
  dependencies: string[];
  endpoints: { method: string; path: string; description: string }[];
}

export const INTEGRATION_SYSTEMS: IntegrationSystem[] = [
  {
    id: 'sys-erp',
    name: 'SAP S/4HANA',
    category: 'erp',
    vendor: 'SAP',
    status: 'connected',
    description: 'Core ERP — order management, pricing, invoicing, AR, purchasing. Multi-entity across Ridgeline Core and Summit divisions.',
    dataFlows: ['Orders', 'Invoices', 'Credit Memos', 'Returns', 'Product Master', 'Customer Master'],
    lastSync: '2026-03-23T06:00:00Z',
    syncFrequency: 'Every 15 min',
    recordVolume: '~45K records/day',
  },
  {
    id: 'sys-wms',
    name: 'Manhattan WMS',
    category: 'wms',
    vendor: 'Manhattan Associates',
    status: 'connected',
    description: 'Warehouse management — receiving, putaway, pick/pack/ship, cycle counts, transfer logic across 982 branches.',
    dataFlows: ['Shipment Confirmations', 'Inventory Levels', 'Transfer Orders'],
    lastSync: '2026-03-23T05:45:00Z',
    syncFrequency: 'Real-time (event)',
    recordVolume: '~120K events/day',
  },
  {
    id: 'sys-spm',
    name: 'Legacy ICM Platform',
    category: 'spm',
    vendor: 'Legacy ICM',
    status: 'connected',
    description: 'Incentive compensation management — plan configuration, commission calculations, payout processing, dispute tracking.',
    dataFlows: ['Transaction Feed (in)', 'Territory Master (in)', 'Payout Results (out)', 'Dispute Status (out)'],
    lastSync: '2026-03-23T06:15:00Z',
    syncFrequency: 'Daily batch + intra-day delta',
    recordVolume: '~15K transactions/day',
  },
  {
    id: 'sys-crm',
    name: 'Salesforce',
    category: 'crm',
    vendor: 'Salesforce',
    status: 'connected',
    description: 'Customer relationship management — contractor accounts, inside/field activity, opportunity pipeline.',
    dataFlows: ['Account Updates', 'Opportunity Pipeline', 'Activity Logs'],
    lastSync: '2026-03-23T05:30:00Z',
    syncFrequency: 'Every 30 min',
    recordVolume: '~8K records/day',
  },
  {
    id: 'sys-portal',
    name: 'Roof Hub',
    category: 'portal',
    vendor: 'Ridgeline (Internal)',
    status: 'connected',
    description: 'B2B contractor portal — ordering, invoice history, delivery tracking, live pricing from local branches.',
    dataFlows: ['Digital Orders', 'Self-Service Returns', 'Pricing Requests'],
    lastSync: '2026-03-23T06:10:00Z',
    syncFrequency: 'Real-time',
    recordVolume: '~6K orders/day',
  },
  {
    id: 'sys-bi',
    name: 'Power BI',
    category: 'bi',
    vendor: 'Microsoft',
    status: 'connected',
    description: 'Business intelligence — branch profitability dashboards, territory analytics, forecast-to-actual.',
    dataFlows: ['Aggregated Metrics (in)', 'Executive Dashboards (out)'],
    lastSync: '2026-03-23T04:00:00Z',
    syncFrequency: 'Daily refresh',
    recordVolume: '~2M rows/refresh',
  },
  {
    id: 'sys-hr',
    name: 'Workday',
    category: 'hr',
    vendor: 'Workday',
    status: 'connected',
    description: 'HR system — employee records, org hierarchy, compensation bands, headcount planning.',
    dataFlows: ['Employee Master', 'Org Changes', 'Comp Band Updates'],
    lastSync: '2026-03-23T02:00:00Z',
    syncFrequency: 'Daily',
    recordVolume: '~1.5K changes/day',
  },
  {
    id: 'sys-finance',
    name: 'Oracle Financials',
    category: 'finance',
    vendor: 'Oracle',
    status: 'connected',
    description: 'Financial system — GL posting, accrual management, payroll interface, SOX compliance.',
    dataFlows: ['Payout Postings (in)', 'Accrual Entries (out)', 'GL Reconciliation'],
    lastSync: '2026-03-23T06:00:00Z',
    syncFrequency: 'Daily + month-end batch',
    recordVolume: '~5K journal entries/day',
  },
];

export const DATA_FEEDS: DataFeed[] = [
  {
    id: 'feed-001',
    name: 'ERP → Legacy ICM Transaction Feed',
    sourceSystem: 'sys-erp',
    targetSystem: 'sys-spm',
    direction: 'inbound',
    frequency: 'Daily 6:00 AM CT + intra-day delta at 2:00 PM',
    format: 'CSV (pipe-delimited)',
    status: 'healthy',
    lastRun: '2026-03-23T06:15:00Z',
    avgRecords: 14820,
    avgDuration: '12 min',
    description: 'Core transaction feed: order_id, rep_id, branch_id, product_id, net_amount, gross_margin, txn_type, business_date.',
  },
  {
    id: 'feed-002',
    name: 'Workday → Legacy ICM Employee Sync',
    sourceSystem: 'sys-hr',
    targetSystem: 'sys-spm',
    direction: 'inbound',
    frequency: 'Daily 2:00 AM CT',
    format: 'XML',
    status: 'healthy',
    lastRun: '2026-03-23T02:30:00Z',
    avgRecords: 340,
    avgDuration: '3 min',
    description: 'Employee master: hire/term dates, role changes, territory assignments, plan eligibility. Effective-dated.',
  },
  {
    id: 'feed-003',
    name: 'Legacy ICM → Payroll Export',
    sourceSystem: 'sys-spm',
    targetSystem: 'sys-finance',
    direction: 'outbound',
    frequency: 'Monthly (3rd business day)',
    format: 'Fixed-width flat file',
    status: 'healthy',
    lastRun: '2026-03-05T16:00:00Z',
    avgRecords: 847,
    avgDuration: '8 min',
    description: 'Approved payout batch: rep_id, gross_incentive, net_incentive, plan_id, period, approval_chain.',
  },
  {
    id: 'feed-004',
    name: 'WMS → ERP Shipment Confirmation',
    sourceSystem: 'sys-wms',
    targetSystem: 'sys-erp',
    direction: 'inbound',
    frequency: 'Real-time (event-driven)',
    format: 'JSON webhook',
    status: 'healthy',
    lastRun: '2026-03-23T06:12:00Z',
    avgRecords: 4200,
    avgDuration: '<1 sec per event',
    description: 'Shipment events trigger invoice creation and commission crediting in the transaction chain.',
  },
  {
    id: 'feed-005',
    name: 'Roof Hub → ERP Digital Orders',
    sourceSystem: 'sys-portal',
    targetSystem: 'sys-erp',
    direction: 'inbound',
    frequency: 'Real-time',
    format: 'REST API',
    status: 'healthy',
    lastRun: '2026-03-23T06:10:00Z',
    avgRecords: 6100,
    avgDuration: 'Real-time',
    description: 'Contractor portal orders flow into ERP for fulfillment. Channel attribution tracked for comp crediting.',
  },
  {
    id: 'feed-006',
    name: 'ERP → BI Data Warehouse',
    sourceSystem: 'sys-erp',
    targetSystem: 'sys-bi',
    direction: 'outbound',
    frequency: 'Daily 4:00 AM CT',
    format: 'SQL/ETL',
    status: 'healthy',
    lastRun: '2026-03-23T04:45:00Z',
    avgRecords: 2100000,
    avgDuration: '45 min',
    description: 'Full dimension + fact table refresh for branch profitability, territory analytics, and executive dashboards.',
  },
  {
    id: 'feed-007',
    name: 'Legacy ICM → Dispute Status Feed',
    sourceSystem: 'sys-spm',
    targetSystem: 'sys-portal',
    direction: 'outbound',
    frequency: 'Every 4 hours',
    format: 'JSON API',
    status: 'delayed',
    lastRun: '2026-03-23T02:00:00Z',
    avgRecords: 45,
    avgDuration: '2 min',
    description: 'Dispute resolution status pushed to rep-facing portal. Currently running 4 hours behind SLA.',
  },
];

export const MICROSERVICES: Microservice[] = [
  {
    id: 'ms-gateway',
    name: 'API Gateway',
    purpose: 'HTTP routing, auth, rate limiting for all RevOps API traffic',
    technology: 'Go + grpc-gateway',
    port: 8080,
    status: 'running',
    dependencies: [],
    endpoints: [
      { method: 'GET', path: '/health', description: 'Health check' },
      { method: 'POST', path: '/auth/token', description: 'JWT token exchange' },
    ],
  },
  {
    id: 'ms-territory',
    name: 'Territory Service',
    purpose: 'Effective-dated territory management, assignment resolution, hierarchy rollups',
    technology: 'Go + gRPC',
    port: 9001,
    status: 'running',
    dependencies: ['ms-gateway'],
    endpoints: [
      { method: 'GET', path: '/territories/{id}', description: 'Get territory with effective date' },
      { method: 'POST', path: '/territories/resolve', description: 'Resolve territory for txn crediting' },
      { method: 'PUT', path: '/territories/{id}/reassign', description: 'Reassign with effective dating' },
    ],
  },
  {
    id: 'ms-commission',
    name: 'Commission Engine',
    purpose: 'Commission calculation, tier resolution, payout computation',
    technology: 'Go + gRPC',
    port: 9002,
    status: 'running',
    dependencies: ['ms-gateway', 'ms-territory'],
    endpoints: [
      { method: 'POST', path: '/commissions/calculate', description: 'Calculate commission for transaction batch' },
      { method: 'GET', path: '/commissions/preview/{repId}', description: 'Preview payout for period' },
      { method: 'POST', path: '/commissions/approve', description: 'Approve payout batch' },
    ],
  },
  {
    id: 'ms-dispute',
    name: 'Dispute Service',
    purpose: 'Dispute intake, routing, SLA tracking, resolution workflow',
    technology: 'Go + gRPC',
    port: 9003,
    status: 'running',
    dependencies: ['ms-gateway', 'ms-commission'],
    endpoints: [
      { method: 'POST', path: '/disputes', description: 'Submit new dispute' },
      { method: 'GET', path: '/disputes/{id}', description: 'Get dispute status' },
      { method: 'PUT', path: '/disputes/{id}/resolve', description: 'Resolve dispute' },
      { method: 'GET', path: '/disputes/metrics', description: 'Dispute SLA metrics' },
    ],
  },
  {
    id: 'ms-rebate',
    name: 'Rebate Attribution',
    purpose: 'Vendor rebate tracking, tier progression, attribution to branches',
    technology: 'Go + gRPC',
    port: 9004,
    status: 'running',
    dependencies: ['ms-gateway'],
    endpoints: [
      { method: 'GET', path: '/rebates/{vendorId}', description: 'Vendor rebate status' },
      { method: 'GET', path: '/rebates/performance', description: 'Rebate performance summary' },
      { method: 'POST', path: '/rebates/attribute', description: 'Attribute purchase to rebate program' },
    ],
  },
  {
    id: 'ms-audit',
    name: 'Audit Trail',
    purpose: 'Immutable event log for SOX compliance, approval chains, evidence recording',
    technology: 'Go + gRPC + NATS',
    port: 9005,
    status: 'running',
    dependencies: ['ms-gateway'],
    endpoints: [
      { method: 'POST', path: '/audit/events', description: 'Record audit event' },
      { method: 'GET', path: '/audit/events', description: 'Query audit trail' },
      { method: 'GET', path: '/audit/evidence/{entityId}', description: 'Evidence chain for entity' },
    ],
  },
  {
    id: 'ms-reconcile',
    name: 'Reconciliation Engine',
    purpose: 'Transaction-to-payout reconciliation, accrual variance detection, close-cycle automation',
    technology: 'Go + gRPC',
    port: 9006,
    status: 'running',
    dependencies: ['ms-gateway', 'ms-commission', 'ms-audit'],
    endpoints: [
      { method: 'POST', path: '/reconcile/run', description: 'Execute reconciliation cycle' },
      { method: 'GET', path: '/reconcile/variance', description: 'Accrual variance report' },
      { method: 'GET', path: '/reconcile/status', description: 'Reconciliation status' },
    ],
  },
  {
    id: 'ms-etl',
    name: 'Data Integration Hub',
    purpose: 'ELT orchestration, feed monitoring, data validation gates, schema matching',
    technology: 'Go + NATS JetStream',
    port: 9007,
    status: 'running',
    dependencies: ['ms-gateway', 'ms-audit'],
    endpoints: [
      { method: 'GET', path: '/feeds', description: 'List all data feeds' },
      { method: 'GET', path: '/feeds/{id}/status', description: 'Feed health status' },
      { method: 'POST', path: '/feeds/{id}/trigger', description: 'Manual feed trigger' },
      { method: 'GET', path: '/feeds/{id}/validation', description: 'Validation results' },
    ],
  },
];
