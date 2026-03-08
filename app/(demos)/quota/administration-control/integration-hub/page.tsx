'use client';

import {
  Plug, CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  ArrowUpRight, ArrowDownRight, Clock, Database, Activity,
  Settings, ChevronRight, Zap, Cloud,
  BarChart3, Users as UsersIcon, Mail, MessageSquare,
} from 'lucide-react';

/* ── Data ──────────────────────────────────────────────────────── */
type IntegrationStatus = 'Connected' | 'Disconnected' | 'Error';

interface Integration {
  id: number;
  name: string;
  icon: React.ElementType;
  status: IntegrationStatus;
  description: string;
  lastSync: string;
  recordsSynced: string;
  errors: number;
  dataTypes: string[];
  syncInterval: string;
  version: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 1, name: 'Salesforce CRM', icon: Cloud, status: 'Connected',
    description: 'Bidirectional deal, contact, and opportunity sync',
    lastSync: '3 min ago', recordsSynced: '24,831', errors: 0,
    dataTypes: ['Deals', 'Contacts', 'Opportunities', 'Activities'],
    syncInterval: 'Real-time (webhook)', version: 'API v59.0',
  },
  {
    id: 2, name: 'SAP ERP', icon: Database, status: 'Connected',
    description: 'Financial data, GL entries, and revenue recognition',
    lastSync: '15 min ago', recordsSynced: '8,412', errors: 0,
    dataTypes: ['GL Entries', 'Cost Centers', 'Revenue', 'Invoices'],
    syncInterval: 'Every 15 min', version: 'S/4HANA Cloud',
  },
  {
    id: 3, name: 'Workday HCM', icon: UsersIcon, status: 'Connected',
    description: 'Org hierarchy, employee data, and role mappings',
    lastSync: '1 hr ago', recordsSynced: '1,247', errors: 2,
    dataTypes: ['Employees', 'Org Chart', 'Roles', 'Comp Data'],
    syncInterval: 'Every 1 hr', version: 'REST v40.1',
  },
  {
    id: 4, name: 'Slack', icon: MessageSquare, status: 'Connected',
    description: 'Notifications, alerts, and team channel updates',
    lastSync: '1 min ago', recordsSynced: '3,456', errors: 0,
    dataTypes: ['Notifications', 'Alerts', 'Reports'],
    syncInterval: 'Real-time (webhook)', version: 'API v2',
  },
  {
    id: 5, name: 'Email (SMTP)', icon: Mail, status: 'Connected',
    description: 'Transactional emails, digests, and dispute notifications',
    lastSync: '8 min ago', recordsSynced: '12,089', errors: 1,
    dataTypes: ['Alerts', 'Digests', 'Dispute Notices', 'Reports'],
    syncInterval: 'Event-driven', version: 'SMTP/TLS 1.3',
  },
  {
    id: 6, name: 'Tableau', icon: BarChart3, status: 'Disconnected',
    description: 'Advanced analytics and executive reporting dashboards',
    lastSync: 'Never', recordsSynced: '0', errors: 0,
    dataTypes: ['Quota Data', 'Commission Data', 'Pipeline'],
    syncInterval: 'Not configured', version: 'REST v3.19',
  },
];

const SYNC_SCHEDULE = [
  { source: 'Salesforce CRM', type: 'Deals', direction: 'Bi-directional', frequency: 'Real-time', lastRun: '09:42:18', status: 'success' as const, records: '142' },
  { source: 'Salesforce CRM', type: 'Contacts', direction: 'Inbound', frequency: 'Every 5 min', lastRun: '09:40:00', status: 'success' as const, records: '28' },
  { source: 'SAP ERP', type: 'GL Entries', direction: 'Inbound', frequency: 'Every 15 min', lastRun: '09:30:00', status: 'success' as const, records: '89' },
  { source: 'SAP ERP', type: 'Revenue', direction: 'Inbound', frequency: 'Every 15 min', lastRun: '09:30:00', status: 'success' as const, records: '34' },
  { source: 'Workday HCM', type: 'Org Chart', direction: 'Inbound', frequency: 'Every 1 hr', lastRun: '09:00:00', status: 'warning' as const, records: '12' },
  { source: 'Workday HCM', type: 'Employees', direction: 'Inbound', frequency: 'Every 1 hr', lastRun: '09:00:00', status: 'error' as const, records: '0' },
  { source: 'Slack', type: 'Notifications', direction: 'Outbound', frequency: 'Real-time', lastRun: '09:41:55', status: 'success' as const, records: '7' },
  { source: 'Email', type: 'Alerts', direction: 'Outbound', frequency: 'Event-driven', lastRun: '09:38:12', status: 'success' as const, records: '3' },
];

/* ── Components ────────────────────────────────────────────────── */
function KPI({ label, value, icon: Icon, trend, trendUp }: {
  label: string; value: string; icon: React.ElementType; trend: string; trendUp: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</span>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <div className="flex items-center gap-1.5">
        {trendUp
          ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
          : <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />}
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>{trend}</span>
        <span className="text-xs text-white/40">vs last week</span>
      </div>
    </div>
  );
}

function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const config: Record<IntegrationStatus, { color: string; Icon: React.ElementType }> = {
    Connected: { color: 'bg-emerald-500/20 text-emerald-400', Icon: CheckCircle2 },
    Disconnected: { color: 'bg-white/10 text-white/40', Icon: XCircle },
    Error: { color: 'bg-red-500/20 text-red-400', Icon: AlertTriangle },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.color}`}>
      <c.Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function SyncStatusDot({ status }: { status: 'success' | 'warning' | 'error' }) {
  const colors = { success: 'bg-emerald-400', warning: 'bg-amber-400', error: 'bg-red-400' };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status]}`} />;
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function IntegrationHubPage() {
  const connectedCount = INTEGRATIONS.filter(i => i.status === 'Connected').length;
  const totalErrors = INTEGRATIONS.reduce((s, i) => s + i.errors, 0);
  const successRate = Math.round(((SYNC_SCHEDULE.filter(s => s.status === 'success').length) / SYNC_SCHEDULE.length) * 100);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Integration Hub</h1>
          <p className="text-sm text-white/50 mt-1">
            Connect, monitor, and manage data flows across your enterprise systems.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition">
          <Plug className="h-3 w-3" /> Add Integration
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI label="Connected Systems" value={`${connectedCount}/${INTEGRATIONS.length}`} icon={Plug} trend="+1" trendUp />
        <KPI label="Sync Success Rate" value={`${successRate}%`} icon={Activity} trend="-2%" trendUp={false} />
        <KPI label="Last Sync" value="1 min ago" icon={Clock} trend="On schedule" trendUp />
        <KPI label="Records Today" value="50,035" icon={Database} trend="+12%" trendUp />
      </div>

      {/* Integration Cards */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-6">
        {INTEGRATIONS.map(integ => {
          const IconComp = integ.icon;
          return (
            <div key={integ.id} className={`rounded-xl border p-5 transition group ${integ.status === 'Connected' ? 'border-white/10 bg-white/5 hover:border-amber-500/30' : integ.status === 'Disconnected' ? 'border-white/5 bg-white/[0.02] opacity-60' : 'border-red-500/20 bg-red-500/5'}`}>
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${integ.status === 'Connected' ? 'bg-amber-500/10' : 'bg-white/5'}`}>
                    <IconComp className={`h-5 w-5 ${integ.status === 'Connected' ? 'text-amber-400' : 'text-white/30'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{integ.name}</h3>
                    <p className="text-[10px] text-white/30 font-mono">{integ.version}</p>
                  </div>
                </div>
                <IntegrationStatusBadge status={integ.status} />
              </div>

              <p className="text-xs text-white/50 mb-3">{integ.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg bg-white/5 p-2 text-center">
                  <p className="text-[10px] text-white/30">Last Sync</p>
                  <p className="text-xs font-medium text-white">{integ.lastSync}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2 text-center">
                  <p className="text-[10px] text-white/30">Records</p>
                  <p className="text-xs font-medium text-white">{integ.recordsSynced}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2 text-center">
                  <p className="text-[10px] text-white/30">Errors</p>
                  <p className={`text-xs font-medium ${integ.errors > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{integ.errors}</p>
                </div>
              </div>

              {/* Data Types */}
              <div className="flex flex-wrap gap-1 mb-3">
                {integ.dataTypes.map(dt => (
                  <span key={dt} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">{dt}</span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-white/30">
                  <Zap className="h-3 w-3" />
                  {integ.syncInterval}
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded hover:bg-white/10 transition" title="Sync Now">
                    <RefreshCw className="h-3.5 w-3.5 text-white/30" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-white/10 transition" title="Settings">
                    <Settings className="h-3.5 w-3.5 text-white/30" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-white/10 transition" title="Details">
                    <ChevronRight className="h-3.5 w-3.5 text-white/30" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync Schedule Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Sync Schedule & Status</h2>
          <button className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition">
            <RefreshCw className="h-3 w-3" /> Sync All Now
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="pb-3 text-xs font-medium text-white/40">Source</th>
                <th className="pb-3 text-xs font-medium text-white/40">Data Type</th>
                <th className="pb-3 text-xs font-medium text-white/40">Direction</th>
                <th className="pb-3 text-xs font-medium text-white/40">Frequency</th>
                <th className="pb-3 text-xs font-medium text-white/40">Last Run</th>
                <th className="pb-3 text-xs font-medium text-white/40 text-right">Records</th>
                <th className="pb-3 text-xs font-medium text-white/40 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {SYNC_SCHEDULE.map((s, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-2.5 text-xs text-white/70 font-medium">{s.source}</td>
                  <td className="py-2.5 text-xs text-white/60">{s.type}</td>
                  <td className="py-2.5">
                    <span className={`text-[10px] rounded-full px-2 py-0.5 ${s.direction === 'Bi-directional' ? 'bg-purple-500/20 text-purple-400' : s.direction === 'Inbound' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {s.direction}
                    </span>
                  </td>
                  <td className="py-2.5 text-xs text-white/50">{s.frequency}</td>
                  <td className="py-2.5 text-xs text-white/40 font-mono">{s.lastRun}</td>
                  <td className="py-2.5 text-xs text-white/60 text-right font-mono">{s.records}</td>
                  <td className="py-2.5 text-center"><SyncStatusDot status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sync Summary */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <SyncStatusDot status="success" />
              <span className="text-xs text-white/50">Healthy ({SYNC_SCHEDULE.filter(s => s.status === 'success').length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SyncStatusDot status="warning" />
              <span className="text-xs text-white/50">Warning ({SYNC_SCHEDULE.filter(s => s.status === 'warning').length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SyncStatusDot status="error" />
              <span className="text-xs text-white/50">Error ({SYNC_SCHEDULE.filter(s => s.status === 'error').length})</span>
            </div>
          </div>
          <span className="text-xs text-white/30">Total errors today: {totalErrors}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/30">API rate limits: Salesforce 15K/hr | SAP 5K/hr | Workday 10K/hr</p>
        <div className="flex items-center gap-4">
          <button className="text-xs text-white/40 hover:text-white/70 transition">API Keys</button>
          <button className="text-xs text-white/40 hover:text-white/70 transition">Webhook Logs</button>
          <button className="text-xs text-amber-400 hover:text-amber-300 font-medium transition">View All Activity</button>
        </div>
      </div>
    </>
  );
}
