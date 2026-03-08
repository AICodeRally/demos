'use client';

import { useState } from 'react';
import {
  BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  FileText, Calendar, Clock,
  Download, Share2, Play, Eye, Star, Filter, Plus,
  FileSpreadsheet, LayoutDashboard, Printer, Mail,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

/* ── KPI Card ──────────────────────────────────────────────── */

function KpiCard({ title, value, subtitle, icon: Icon, trend, trendUp }: {
  title: string; value: string; subtitle: string;
  icon: React.ElementType; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--prizym-text-muted)' }}>{title}</span>
        <Icon className="h-4 w-4 text-amber-500" />
      </div>
      <p className="text-2xl font-bold mt-1" style={{ color: 'var(--prizym-text-primary)' }}>{value}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{subtitle}</span>
      </div>
    </div>
  );
}

/* ── Inline Data ───────────────────────────────────────────── */

type Report = {
  id: string;
  name: string;
  description: string;
  category: string;
  lastRun: string;
  schedule: string;
  format: 'PDF' | 'Excel' | 'Dashboard' | 'CSV';
  recipients: number;
  starred: boolean;
  status: 'ready' | 'generating' | 'scheduled';
};

const REPORTS: Report[] = [
  {
    id: 'rpt-1', name: 'Quota Attainment Summary',
    description: 'Comprehensive attainment report with rep-level breakdown, team rollups, and quarter-over-quarter trends. Includes distribution analysis and peer benchmarks.',
    category: 'Performance', lastRun: 'Mar 7, 2026', schedule: 'Weekly (Mon 8AM)',
    format: 'PDF', recipients: 12, starred: true, status: 'ready',
  },
  {
    id: 'rpt-2', name: 'Commission Statement',
    description: 'Individual commission calculations with tier breakdowns, accelerator details, and YTD earnings. Sent directly to each rep with manager CC.',
    category: 'Compensation', lastRun: 'Mar 1, 2026', schedule: 'Monthly (1st)',
    format: 'Excel', recipients: 8, starred: true, status: 'ready',
  },
  {
    id: 'rpt-3', name: 'Territory Analysis',
    description: 'Territory performance heatmap with account distribution, revenue concentration, and coverage gaps. Includes rebalancing recommendations.',
    category: 'Territory', lastRun: 'Mar 5, 2026', schedule: 'Bi-weekly',
    format: 'Dashboard', recipients: 5, starred: false, status: 'ready',
  },
  {
    id: 'rpt-4', name: 'Pipeline Health Report',
    description: 'Pipeline velocity metrics, stage conversion rates, deal aging analysis, and coverage ratios by segment. Highlights stalled deals and at-risk opportunities.',
    category: 'Pipeline', lastRun: 'Mar 8, 2026', schedule: 'Daily (6AM)',
    format: 'Dashboard', recipients: 15, starred: true, status: 'generating',
  },
  {
    id: 'rpt-5', name: 'Executive Brief',
    description: 'One-page executive summary with KPI scorecard, top wins, key risks, and forward-looking forecast. Board-ready formatting with charts.',
    category: 'Executive', lastRun: 'Mar 3, 2026', schedule: 'Monthly (3rd)',
    format: 'PDF', recipients: 4, starred: true, status: 'ready',
  },
  {
    id: 'rpt-6', name: 'Win/Loss Analysis',
    description: 'Detailed win/loss breakdown by competitor, deal size, and sales stage. Includes root cause analysis and trend identification.',
    category: 'Competitive', lastRun: 'Feb 28, 2026', schedule: 'Monthly (last day)',
    format: 'PDF', recipients: 8, starred: false, status: 'ready',
  },
  {
    id: 'rpt-7', name: 'Rep Activity Report',
    description: 'Activity metrics per rep including calls, emails, meetings, and proposal submissions. Correlates activity levels with attainment outcomes.',
    category: 'Performance', lastRun: 'Mar 7, 2026', schedule: 'Weekly (Fri 5PM)',
    format: 'CSV', recipients: 10, starred: false, status: 'scheduled',
  },
  {
    id: 'rpt-8', name: 'Forecast Variance Report',
    description: 'Compares AI forecasts against actual results. Tracks forecast accuracy by rep, team, and territory. Identifies systematic over/under-forecasting.',
    category: 'Forecasting', lastRun: 'Mar 6, 2026', schedule: 'Weekly (Mon 9AM)',
    format: 'Excel', recipients: 6, starred: false, status: 'ready',
  },
];

const USAGE_DATA = [
  { day: 'Mon', views: 45 },
  { day: 'Tue', views: 38 },
  { day: 'Wed', views: 52 },
  { day: 'Thu', views: 41 },
  { day: 'Fri', views: 63 },
  { day: 'Sat', views: 12 },
  { day: 'Sun', views: 8 },
];

const RECENT_ACTIVITY = [
  { action: 'Generated', report: 'Pipeline Health Report', user: 'System (Auto)', time: '2 min ago' },
  { action: 'Viewed', report: 'Quota Attainment Summary', user: 'Sarah Chen', time: '15 min ago' },
  { action: 'Downloaded', report: 'Commission Statement', user: 'Marcus Johnson', time: '1h ago' },
  { action: 'Shared', report: 'Executive Brief', user: 'VP Sales', time: '3h ago' },
  { action: 'Edited', report: 'Territory Analysis', user: 'Ops Manager', time: '5h ago' },
];

const FORMAT_ICONS: Record<string, React.ElementType> = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  Dashboard: LayoutDashboard,
  CSV: FileText,
};

const FORMAT_COLORS: Record<string, string> = {
  PDF: 'text-red-600 bg-red-500/10',
  Excel: 'text-emerald-600 bg-emerald-500/10',
  Dashboard: 'text-blue-400 bg-blue-500/10',
  CSV: 'text-slate-400 bg-slate-500/10',
};

/* ── Page ──────────────────────────────────────────────────── */

export default function CustomReportsPage() {
  const [filter, setFilter] = useState<string>('all');
  const starred = REPORTS.filter(r => r.starred).length;
  const scheduled = REPORTS.filter(r => r.schedule !== 'On Demand').length;
  const categories = ['all', ...new Set(REPORTS.map(r => r.category))];
  const filteredReports = filter === 'all' ? REPORTS : REPORTS.filter(r => r.category === filter);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Custom Reports</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Build and schedule custom reports with flexible data connections and visualizations.
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-xs bg-amber-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard title="Saved Reports" value={String(REPORTS.length)} subtitle="Active templates" icon={FileText} trend="+2 this month" trendUp />
        <KpiCard title="Scheduled" value={String(scheduled)} subtitle="Auto-generating" icon={Calendar} trend="100% on time" trendUp />
        <KpiCard title="Last Generated" value="2 min ago" subtitle="Pipeline Health" icon={Clock} trend="Auto" trendUp />
        <KpiCard title="Shared" value="259" subtitle="Total distributions" icon={Share2} trend="+18%" trendUp />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Report Usage Chart */}
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Report Views This Week</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Daily report access across all users</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={USAGE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }} />
              <Bar dataKey="views" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-3" style={{ color: 'var(--prizym-text-primary)' }}>Recent Activity</h2>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 last:border-0 last:pb-0" style={{ borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--prizym-border-default)' : 'none' }}>
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  a.action === 'Generated' ? 'bg-emerald-400'
                  : a.action === 'Viewed' ? 'bg-blue-400'
                  : a.action === 'Downloaded' ? 'bg-amber-400'
                  : a.action === 'Shared' ? 'bg-purple-400'
                  : 'bg-slate-400'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: 'var(--prizym-text-primary)' }}>
                    <span className="font-medium">{a.user}</span>
                    <span style={{ color: 'var(--prizym-text-muted)' }}> {a.action.toLowerCase()} </span>
                    <span className="font-medium">{a.report}</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" style={{ color: 'var(--prizym-text-muted)' }} />
        <div className="flex gap-1.5">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                filter === c ? 'bg-amber-500 text-black font-medium' : ''
              }`}
              style={filter !== c ? { background: 'var(--prizym-card-bg)', color: 'var(--prizym-text-muted)', border: '1px solid var(--prizym-border-default)' } : undefined}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {filteredReports.map(r => {
          const FormatIcon = FORMAT_ICONS[r.format] || FileText;
          const formatColor = FORMAT_COLORS[r.format] || 'text-slate-400 bg-slate-500/10';

          return (
            <div key={r.id} className="rounded-xl p-5 hover:border-amber-500/30 transition-colors" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-lg ${formatColor.split(' ')[1]} flex items-center justify-center`}>
                    <FormatIcon className={`h-4 w-4 ${formatColor.split(' ')[0]}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{r.name}</h3>
                      {r.starred && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{r.category}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  r.status === 'ready' ? 'bg-emerald-500/10 text-emerald-600'
                  : r.status === 'generating' ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {r.status === 'ready' ? 'Ready' : r.status === 'generating' ? 'Generating...' : 'Scheduled'}
                </span>
              </div>

              <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--prizym-text-muted)' }}>{r.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div className="p-2 rounded" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
                  <p style={{ color: 'var(--prizym-text-muted)' }}>Last Run</p>
                  <p className="font-medium mt-0.5" style={{ color: 'var(--prizym-text-primary)' }}>{r.lastRun}</p>
                </div>
                <div className="p-2 rounded" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
                  <p style={{ color: 'var(--prizym-text-muted)' }}>Schedule</p>
                  <p className="font-medium mt-0.5" style={{ color: 'var(--prizym-text-primary)' }}>{r.schedule}</p>
                </div>
                <div className="p-2 rounded" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
                  <p style={{ color: 'var(--prizym-text-muted)' }}>Format</p>
                  <p className="font-medium mt-0.5" style={{ color: 'var(--prizym-text-primary)' }}>{r.format}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--prizym-text-muted)' }}>
                  <Mail className="h-3 w-3" /> {r.recipients} recipients
                </span>
                <div className="flex gap-1.5">
                  <button className="text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1" style={{ background: 'var(--prizym-card-bg)', color: 'var(--prizym-text-muted)', border: '1px solid var(--prizym-border-default)' }}>
                    <Eye className="h-3 w-3" /> Preview
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1" style={{ background: 'var(--prizym-card-bg)', color: 'var(--prizym-text-muted)', border: '1px solid var(--prizym-border-default)' }}>
                    <Download className="h-3 w-3" /> Export
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors flex items-center gap-1">
                    <Play className="h-3 w-3" /> Run
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Create Templates */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Printer className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Quick Create from Template</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: 'Blank Report', desc: 'Start from scratch with a drag-and-drop builder', icon: Plus },
            { name: 'From Existing', desc: 'Clone and modify an existing report template', icon: FileText },
            { name: 'AI Generated', desc: 'Describe what you need and AI builds the report', icon: Star },
          ].map(t => (
            <button key={t.name} className="p-4 rounded-lg border border-dashed hover:border-amber-500/50 transition-colors text-left group" style={{ borderColor: 'var(--prizym-border-default)' }}>
              <t.icon className="h-5 w-5 group-hover:text-amber-500 transition-colors mb-2" style={{ color: 'var(--prizym-text-muted)' }} />
              <h3 className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{t.name}</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--prizym-text-muted)' }}>{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
