'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Info,
  Bell, ArrowUpRight, ArrowDownRight, Filter,
  Clock, ChevronRight, XCircle, AlertOctagon,
  TrendingDown, Target, Zap,
} from 'lucide-react';
import { ALERTS, REPS, TERRITORIES } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';

/* ── Alert types & config ──────────────────────────────────────── */
type AlertType = 'risk' | 'success' | 'warning' | 'info';

const alertConfig: Record<AlertType, {
  border: string; bg: string; text: string; icon: React.ElementType; label: string;
}> = {
  risk: { border: 'border-red-500/40', bg: 'bg-red-500/5', text: 'text-red-600', icon: ShieldAlert, label: 'CRITICAL' },
  success: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/5', text: 'text-emerald-600', icon: CheckCircle2, label: 'SUCCESS' },
  warning: { border: 'border-amber-500/40', bg: 'bg-amber-500/5', text: 'text-amber-400', icon: AlertTriangle, label: 'WARNING' },
  info: { border: 'border-blue-500/40', bg: 'bg-blue-500/5', text: 'text-blue-400', icon: Info, label: 'INFO' },
};

/* ── Extended alerts with more detail ─────────────────────────── */
const extendedAlerts = [
  ...ALERTS,
  { id: 'a6', type: 'risk' as const, title: 'Enterprise team below 90% pace', desc: 'Sarah Chen and Emily Rodriguez both tracking under quota', time: '3h ago' },
  { id: 'a7', type: 'warning' as const, title: 'Forecast accuracy dropped to 72%', desc: 'Down from 85% in Q4 — review methodology', time: '1d ago' },
  { id: 'a8', type: 'success' as const, title: 'Alex Nguyen closed $180K deal', desc: 'Mountain territory — largest SMB deal in Q1', time: '5h ago' },
  { id: 'a9', type: 'info' as const, title: 'Monthly territory review due Mar 15', desc: 'All managers must submit plans by EOD', time: '3d ago' },
  { id: 'a10', type: 'warning' as const, title: 'Commission processing deadline in 5 days', desc: 'Q4 spiffs and accelerators pending final approval', time: '2d ago' },
  { id: 'a11', type: 'risk' as const, title: 'Southwest territory — 85% quota at risk', desc: 'Rachel Torres pipeline below 2x coverage', time: '6h ago' },
  { id: 'a12', type: 'success' as const, title: 'Mid-Market team hit 105% collective', desc: 'Best performing team for 3rd consecutive month', time: '8h ago' },
];

const typeCounts = {
  risk: extendedAlerts.filter(a => a.type === 'risk').length,
  warning: extendedAlerts.filter(a => a.type === 'warning').length,
  success: extendedAlerts.filter(a => a.type === 'success').length,
  info: extendedAlerts.filter(a => a.type === 'info').length,
};

const pieData = [
  { name: 'Critical', value: typeCounts.risk, fill: '#ef4444' },
  { name: 'Warning', value: typeCounts.warning, fill: '#f59e0b' },
  { name: 'Success', value: typeCounts.success, fill: '#10b981' },
  { name: 'Info', value: typeCounts.info, fill: '#3b82f6' },
];

const weeklyTrend = [
  { day: 'Mon', risk: 2, warning: 1, success: 3, info: 1 },
  { day: 'Tue', risk: 1, warning: 3, success: 1, info: 2 },
  { day: 'Wed', risk: 3, warning: 2, success: 2, info: 0 },
  { day: 'Thu', risk: 1, warning: 1, success: 4, info: 1 },
  { day: 'Fri', risk: 2, warning: 2, success: 1, info: 2 },
  { day: 'Sat', risk: 0, warning: 0, success: 1, info: 0 },
  { day: 'Sun', risk: 1, warning: 1, success: 0, info: 1 },
];

/* ── Quick actions ────────────────────────────────────────────── */
const quickActions = [
  { icon: TrendingDown, label: 'Review at-risk reps', desc: '3 reps below 85% attainment', color: 'text-red-600', bg: 'bg-red-500/10' },
  { icon: Target, label: 'Approve Q2 quota plans', desc: '8 plans pending review', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Zap, label: 'Process accelerators', desc: '4 reps earned accelerator tier', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
];

/* ── KPI card ─────────────────────────────────────────────────── */
function KPI({ label, value, sub, icon: Icon, trend, trendUp, accent }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; trend: string; trendUp: boolean; accent?: string;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-2" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{label}</span>
        <Icon className={`h-4 w-4 ${accent ?? 'text-amber-400'}`} />
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>{value}</p>
      <div className="flex items-center gap-1.5">
        {trendUp
          ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          : <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />
        }
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>{trend}</span>
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{sub}</span>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function ExecutiveAlertsPage() {
  const [activeFilter, setActiveFilter] = useState<AlertType | 'all'>('all');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const filteredAlerts = extendedAlerts
    .filter(a => !dismissedIds.has(a.id))
    .filter(a => activeFilter === 'all' || a.type === activeFilter);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Executive Alerts</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Critical notifications for quota risks, pipeline gaps, and performance anomalies.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
          <Bell className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-medium" style={{ color: 'var(--prizym-text-secondary)' }}>{extendedAlerts.length - dismissedIds.size} active</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI
          label="Active Alerts" value={String(extendedAlerts.length - dismissedIds.size)} sub="total"
          icon={Bell} trend="+3 today" trendUp={false} accent="text-amber-400"
        />
        <KPI
          label="Critical" value={String(typeCounts.risk)} sub="need action"
          icon={AlertOctagon} trend="+1 vs yesterday" trendUp={false} accent="text-red-600"
        />
        <KPI
          label="Warnings" value={String(typeCounts.warning)} sub="monitoring"
          icon={AlertTriangle} trend="stable" trendUp accent="text-amber-400"
        />
        <KPI
          label="Resolved Today" value={String(typeCounts.success)} sub="wins"
          icon={CheckCircle2} trend="+2 resolved" trendUp accent="text-emerald-600"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {(['all', 'risk', 'warning', 'success', 'info'] as const).map(filter => {
          const isActive = activeFilter === filter;
          const count = filter === 'all'
            ? extendedAlerts.length - dismissedIds.size
            : extendedAlerts.filter(a => a.type === filter && !dismissedIds.has(a.id)).length;
          const cfg = filter !== 'all' ? alertConfig[filter] : null;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
                  : 'border border-transparent hover:opacity-80'
              }`}
              style={isActive ? undefined : { background: 'var(--prizym-card-bg)', borderColor: 'var(--prizym-border-default)', color: 'var(--prizym-text-muted)' }}
            >
              {cfg && <cfg.icon className={`h-3 w-3 ${cfg.text}`} />}
              {filter === 'all' ? 'All Alerts' : cfg?.label}
              <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                isActive ? 'bg-amber-500/30 text-amber-600' : ''
              }`} style={isActive ? undefined : { background: 'var(--prizym-border-default)', color: 'var(--prizym-text-muted)' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content: Alerts + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Alert Cards */}
        <div className="lg:col-span-2 space-y-3">
          {filteredAlerts.length === 0 && (
            <div className="rounded-xl p-8 text-center" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm" style={{ color: 'var(--prizym-text-muted)' }}>No alerts matching this filter.</p>
            </div>
          )}
          {filteredAlerts.map(alert => {
            const cfg = alertConfig[alert.type];
            const Icon = cfg.icon;
            return (
              <div
                key={alert.id}
                className={`rounded-xl border-l-4 ${cfg.border} ${cfg.bg} p-4 group transition`}
                style={{ border: '1px solid var(--prizym-border-default)', borderLeftWidth: '4px', borderLeftColor: undefined }}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-xl p-2 ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.text}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>&middot;</span>
                          <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--prizym-text-muted)' }}>
                            <Clock className="h-2.5 w-2.5" /> {alert.time}
                          </span>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{alert.title}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--prizym-text-muted)' }}>{alert.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                        <button className="rounded p-1 hover:opacity-70 transition" title="View">
                          <ChevronRight className="h-3.5 w-3.5" style={{ color: 'var(--prizym-text-muted)' }} />
                        </button>
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="rounded p-1 hover:opacity-70 transition"
                          title="Dismiss"
                        >
                          <XCircle className="h-3.5 w-3.5" style={{ color: 'var(--prizym-text-muted)' }} />
                        </button>
                      </div>
                    </div>

                    {/* Action buttons for risk alerts */}
                    {alert.type === 'risk' && (
                      <div className="mt-3 flex items-center gap-2">
                        <button className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-500/30 transition">
                          Investigate
                        </button>
                        <button className="rounded-lg px-3 py-1 text-[10px] font-semibold transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-muted)' }}>
                          Assign
                        </button>
                        <button className="rounded-lg px-3 py-1 text-[10px] font-semibold transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-muted)' }}>
                          Snooze
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Alert Distribution Pie */}
          <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--prizym-text-secondary)' }}>Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
                        {payload[0].name}: {payload[0].value}
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--prizym-text-secondary)' }}>Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyTrend} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
                        <p className="font-medium mb-1">{label}</p>
                        {payload.map((p: any, i: number) => (
                          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="risk" name="Critical" stackId="a" fill="#ef4444" barSize={16} />
                <Bar dataKey="warning" name="Warning" stackId="a" fill="#f59e0b" />
                <Bar dataKey="success" name="Success" stackId="a" fill="#10b981" />
                <Bar dataKey="info" name="Info" stackId="a" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--prizym-text-secondary)' }}>Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="w-full text-left rounded-xl p-3 hover:opacity-90 transition group"
                  style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${action.bg}`}>
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{action.label}</p>
                      <p className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>{action.desc}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:opacity-80 transition" style={{ color: 'var(--prizym-text-muted)' }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* At-Risk Reps Section */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Reps Requiring Attention</h2>
        </div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {REPS.filter(r => r.actual / r.quota < 0.92).map(rep => {
            const att = (rep.actual / rep.quota) * 100;
            const gap = rep.quota - rep.actual;
            return (
              <div key={rep.id} className="rounded-xl p-4" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{rep.name}</p>
                  <span className={`text-xs font-bold ${att >= 85 ? 'text-amber-400' : 'text-red-600'}`}>
                    {fmtPct(att)}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--prizym-text-muted)' }}>{rep.territory} &middot; {rep.team}</p>
                <div className="h-1.5 rounded-full mb-2 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${att}%`,
                      backgroundColor: att >= 85 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <p className="text-[10px] text-red-600">{fmtDollar(gap)} needed to hit quota</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--prizym-text-muted)' }}>
        <span>Alert engine v2.1 &middot; Next scan in 14 min</span>
        <span>{dismissedIds.size > 0 ? `${dismissedIds.size} dismissed this session` : 'No alerts dismissed'}</span>
      </div>
    </>
  );
}
