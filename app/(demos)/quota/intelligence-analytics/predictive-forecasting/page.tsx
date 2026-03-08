'use client';

import {
  AreaChart, Area, BarChart, Bar, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  Brain, TrendingUp, Target, Zap, ArrowUpRight, ArrowDownRight,
  Sparkles, Activity, ChevronRight,
} from 'lucide-react';
import { MONTHLY_TREND } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';

/* ── KPI Card ──────────────────────────────────────────────── */

function KpiCard({ title, value, subtitle, icon: Icon, trend, trendUp }: {
  title: string; value: string; subtitle: string;
  icon: React.ElementType; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
        <Icon className="h-4 w-4 text-amber-500" />
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  );
}

/* ── Inline Data ───────────────────────────────────────────── */

const FORECAST_DATA = [
  ...MONTHLY_TREND.map(m => ({ month: m.month, actual: m.revenue, forecast: null as number | null })),
  { month: 'Mar', actual: null as number | null, forecast: 2_620_000 },
  { month: 'Apr', actual: null, forecast: 2_780_000 },
  { month: 'May', actual: null, forecast: 2_950_000 },
];

const SCENARIOS = [
  { scenario: 'Best Case', q1: 8_350_000, q2: 9_100_000, annual: 34_200_000, confidence: 25, color: 'text-emerald-400' },
  { scenario: 'Base Case', q1: 7_250_000, q2: 7_800_000, annual: 30_100_000, confidence: 60, color: 'text-amber-400' },
  { scenario: 'Worst Case', q1: 6_100_000, q2: 6_400_000, annual: 25_800_000, confidence: 15, color: 'text-red-400' },
];

const FEATURE_IMPORTANCE = [
  { feature: 'Pipeline Coverage', importance: 92 },
  { feature: 'Historical Win Rate', importance: 85 },
  { feature: 'Deal Velocity', importance: 78 },
  { feature: 'Rep Tenure', importance: 65 },
  { feature: 'Territory Density', importance: 58 },
  { feature: 'Seasonal Patterns', importance: 52 },
  { feature: 'Product Mix', importance: 44 },
];

const MODEL_METRICS = [
  { label: 'Training Data', value: '36 months' },
  { label: 'Model Type', value: 'Ensemble (XGBoost + LSTM)' },
  { label: 'Last Retrained', value: 'Mar 1, 2026' },
  { label: 'MAPE', value: '4.2%' },
  { label: 'R-Squared', value: '0.94' },
  { label: 'Features Used', value: '23' },
];

const CONFIDENCE_BANDS = [
  { month: 'Mar', low: 2_380_000, mid: 2_620_000, high: 2_860_000 },
  { month: 'Apr', low: 2_450_000, mid: 2_780_000, high: 3_110_000 },
  { month: 'May', low: 2_500_000, mid: 2_950_000, high: 3_400_000 },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function PredictiveForecastingPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Predictive Forecasting</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered revenue forecasting with confidence intervals and scenario modeling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full font-medium">
            <Sparkles className="h-3 w-3" /> AI Model v3.2 Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard title="Forecast Accuracy" value="95.8%" subtitle="Last 4 quarters" icon={Target} trend="+2.1%" trendUp />
        <KpiCard title="Predicted Q1 Close" value={fmtDollar(7_250_000)} subtitle="Base case estimate" icon={TrendingUp} trend="+4.8%" trendUp />
        <KpiCard title="Confidence Level" value="87%" subtitle="Model certainty" icon={Brain} trend="+3%" trendUp />
        <KpiCard title="Upside Potential" value={fmtDollar(1_100_000)} subtitle="Above base case" icon={Zap} trend="Best case delta" />
      </div>

      {/* Main Chart - Revenue Trend + Forecast */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Revenue Trend & AI Forecast</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Actual revenue with 3-month AI projection</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Actual</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500/40" /> Forecast</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis tickFormatter={(v: number) => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
              formatter={(v: any) => [fmtDollar(v), '']}
              labelStyle={{ color: '#888' }}
            />
            <Area type="monotone" dataKey="actual" stroke="#f59e0b" fill="url(#forecastGrad)" strokeWidth={2} connectNulls={false} />
            <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2 }} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Confidence Bands */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-1">Confidence Bands</h2>
          <p className="text-xs text-muted-foreground mb-4">90% prediction interval for forecast months</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={CONFIDENCE_BANDS} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#888', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
                formatter={(v: any) => [fmtDollar(v), '']}
              />
              <Area type="monotone" dataKey="high" stroke="transparent" fill="#f59e0b" fillOpacity={0.1} />
              <Area type="monotone" dataKey="mid" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
              <Area type="monotone" dataKey="low" stroke="transparent" fill="#0a0a0a" fillOpacity={1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Importance */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-1">Model Feature Importance</h2>
          <p className="text-xs text-muted-foreground mb-4">Top predictive signals driving the forecast</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#888', fontSize: 11 }} />
              <YAxis type="category" dataKey="feature" tick={{ fill: '#888', fontSize: 11 }} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
                formatter={(v: any) => [`${v}%`, 'Importance']}
              />
              <Bar dataKey="importance" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Analysis Table */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <h2 className="font-semibold mb-1">Scenario Analysis</h2>
        <p className="text-xs text-muted-foreground mb-4">Three-case revenue projection with confidence-weighted probabilities</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Scenario</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Q1 Forecast</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Q2 Forecast</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Annual Projection</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Confidence</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Probability</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIOS.map(s => (
                <tr key={s.scenario} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className={`py-3 px-4 font-medium ${s.color}`}>{s.scenario}</td>
                  <td className="py-3 px-4 text-right">{fmtDollar(s.q1)}</td>
                  <td className="py-3 px-4 text-right">{fmtDollar(s.q2)}</td>
                  <td className="py-3 px-4 text-right font-medium">{fmtDollar(s.annual)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${s.confidence}%` }} />
                      </div>
                      <span className="text-muted-foreground">{s.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      s.confidence >= 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      {s.confidence}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold">Model Performance</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {MODEL_METRICS.map(m => (
            <div key={m.label} className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className="text-sm font-semibold">{m.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <ChevronRight className="h-3 w-3" />
          <span>Model automatically retrains monthly with latest CRM data. Next retrain scheduled Apr 1, 2026.</span>
        </div>
      </div>
    </>
  );
}
