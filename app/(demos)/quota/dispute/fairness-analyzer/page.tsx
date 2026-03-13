'use client';

import {
  Scale, TrendingUp, AlertTriangle, Target, ArrowUpRight,
  ArrowDownRight, MapPin, Info,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ReferenceArea, ScatterChart, Scatter, Line, LineChart, Area, AreaChart,
  ResponsiveContainer, Cell,
} from 'recharts';

/* ------------------------------------------------------------------ */
/*  Demo Data                                                          */
/* ------------------------------------------------------------------ */

const territories = [
  { name: 'Northeast', ratio: 0.92, marketPotential: 12.4, quota: 11.4 },
  { name: 'Southeast', ratio: 0.88, marketPotential: 10.8, quota: 9.5 },
  { name: 'Mid-Atlantic', ratio: 0.95, marketPotential: 14.2, quota: 13.5 },
  { name: 'Midwest', ratio: 0.84, marketPotential: 9.6, quota: 8.1 },
  { name: 'Great Lakes', ratio: 1.02, marketPotential: 11.1, quota: 11.3 },
  { name: 'Southwest', ratio: 1.28, marketPotential: 8.3, quota: 10.6 },
  { name: 'Mountain', ratio: 0.78, marketPotential: 6.5, quota: 5.1 },
  { name: 'Pacific NW', ratio: 0.91, marketPotential: 7.8, quota: 7.1 },
  { name: 'SoCal', ratio: 1.05, marketPotential: 13.6, quota: 14.3 },
  { name: 'NorCal', ratio: 0.97, marketPotential: 10.2, quota: 9.9 },
  { name: 'Central', ratio: 0.82, marketPotential: 7.4, quota: 6.1 },
  { name: 'South Central', ratio: 0.63, marketPotential: 8.9, quota: 5.6 },
];

// Compute stats
const ratios = territories.map(t => t.ratio);
const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
const variance = ratios.reduce((a, b) => a + (b - mean) ** 2, 0) / ratios.length;
const stdDev = Math.sqrt(variance);
const qfi = 1 - (stdDev / mean);

const trendData = [
  { quarter: "Q1'25", qfi: 0.72 },
  { quarter: "Q2'25", qfi: 0.76 },
  { quarter: "Q3'25", qfi: 0.79 },
  { quarter: "Q4'25", qfi: 0.82 },
  { quarter: "Q1'26", qfi: 0.84 },
  { quarter: "Q2'26", qfi: 0.87 },
];

// Outliers: > 2σ from mean
const outliers = territories
  .map(t => ({
    ...t,
    deviation: (t.ratio - mean) / stdDev,
  }))
  .filter(t => Math.abs(t.deviation) > 1.8)
  .sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation));

function getBarColor(ratio: number) {
  const dev = Math.abs(ratio - mean) / stdDev;
  if (dev <= 1) return '#22c55e';
  if (dev <= 2) return '#f59e0b';
  return '#ef4444';
}

function getQfiStatus(score: number) {
  if (score >= 0.85) return { label: 'Excellent', color: '#22c55e', bg: '#dcfce7' };
  if (score >= 0.70) return { label: 'Acceptable', color: '#f59e0b', bg: '#fef9c3' };
  return { label: 'Action Required', color: '#ef4444', bg: '#fee2e2' };
}

/* ------------------------------------------------------------------ */
/*  QFI Gauge Component                                                */
/* ------------------------------------------------------------------ */

function QfiGauge({ score }: { score: number }) {
  const status = getQfiStatus(score);
  // Semicircle gauge — SVG arc
  const radius = 80;
  const cx = 100;
  const cy = 95;
  const startAngle = Math.PI;
  const endAngle = 0;

  function arcPoint(angle: number) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy - radius * Math.sin(angle),
    };
  }

  function arcPath(from: number, to: number) {
    const start = arcPoint(from);
    const end = arcPoint(to);
    const largeArc = from - to > Math.PI ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  // Zone boundaries (mapped to angles: 0 = right, π = left)
  // Score 0 = left (π), score 1 = right (0)
  const scoreAngle = Math.PI * (1 - Math.min(1, Math.max(0, score)));
  const needleEnd = arcPoint(scoreAngle);

  return (
    <svg viewBox="0 0 200 110" className="w-full max-w-[260px] mx-auto">
      {/* Red zone: 0 – 0.70 */}
      <path
        d={arcPath(Math.PI, Math.PI * 0.30)}
        fill="none"
        stroke="#fee2e2"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* Amber zone: 0.70 – 0.85 */}
      <path
        d={arcPath(Math.PI * 0.30, Math.PI * 0.15)}
        fill="none"
        stroke="#fef9c3"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* Green zone: 0.85 – 1.0 */}
      <path
        d={arcPath(Math.PI * 0.15, 0)}
        fill="none"
        stroke="#dcfce7"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* Active arc up to score */}
      <path
        d={arcPath(Math.PI, scoreAngle)}
        fill="none"
        stroke={status.color}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needleEnd.x}
        y2={needleEnd.y}
        stroke={status.color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={4} fill={status.color} />
      {/* Labels */}
      <text x={16} y={105} fontSize={9} fill="#9ca3af">0</text>
      <text x={180} y={105} fontSize={9} fill="#9ca3af">1.0</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom Tooltips                                                    */
/* ------------------------------------------------------------------ */

function BarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof territories[0] }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
        color: 'var(--prizym-text-primary)',
      }}
    >
      <p className="font-semibold mb-1">{d.name}</p>
      <p>Ratio: {d.ratio.toFixed(2)}</p>
      <p>Deviation: {(((d.ratio - mean) / stdDev)).toFixed(1)}σ</p>
    </div>
  );
}

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof territories[0] }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
        color: 'var(--prizym-text-primary)',
      }}
    >
      <p className="font-semibold mb-1">{d.name}</p>
      <p>Market Potential: ${d.marketPotential}M</p>
      <p>Assigned Quota: ${d.quota}M</p>
      <p>Ratio: {d.ratio.toFixed(2)}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function FairnessAnalyzerPage() {
  const status = getQfiStatus(qfi);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Scale className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
              Fairness Analyzer
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
              Quota Fairness Index &mdash; measuring equity across territories and reps
            </p>
          </div>
        </div>
      </div>

      {/* ── QFI Score Hero Card ── */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Gauge */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <QfiGauge score={qfi} />
          </div>

          {/* Score details */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--prizym-text-muted)' }}>
              Quota Fairness Index
            </p>
            <div className="flex items-baseline gap-3 justify-center md:justify-start mb-2">
              <span className="text-5xl font-extrabold tabular-nums" style={{ color: 'var(--prizym-text-primary)' }}>
                {qfi.toFixed(2)}
              </span>
              <span
                className="text-sm font-semibold px-2.5 py-1 rounded-full"
                style={{ background: status.bg, color: status.color }}
              >
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-center md:justify-start mb-4">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">+0.03 from last quarter</span>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Mean (μ)</p>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--prizym-text-primary)' }}>
                  {mean.toFixed(3)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Std Dev (σ)</p>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--prizym-text-primary)' }}>
                  {stdDev.toFixed(3)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>σ / μ</p>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--prizym-text-primary)' }}>
                  {(stdDev / mean).toFixed(3)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Territories</p>
                <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--prizym-text-primary)' }}>
                  {territories.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formula callout */}
        <div
          className="mt-4 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs"
          style={{
            background: '#f8fafc',
            border: '1px solid var(--prizym-border-default)',
            color: 'var(--prizym-text-secondary)',
          }}
        >
          <Info className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--prizym-text-muted)' }} />
          <span>
            <strong>QFI = 1 - (σ / μ)</strong> where σ = standard deviation and μ = mean of (quota / market_potential) across all territories.
            QFI &gt; 0.85 = Excellent &bull; 0.70–0.85 = Acceptable &bull; &lt; 0.70 = Action Required
          </span>
        </div>
      </div>

      {/* ── Territory Fairness Distribution ── */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
              Territory Fairness Distribution
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
              Quota / Market Potential ratio per territory with σ deviation bands
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--prizym-text-muted)' }}>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm inline-block" style={{ background: '#22c55e' }} /> Within 1σ</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm inline-block" style={{ background: '#f59e0b' }} /> 1–2σ</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm inline-block" style={{ background: '#ef4444' }} /> &gt;2σ</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={territories} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[0.4, 1.5]}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ value: 'Quota / Potential', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#9ca3af' }}
            />
            <Tooltip content={<BarTooltip />} />
            {/* ±2σ band */}
            <ReferenceArea
              y1={mean - 2 * stdDev}
              y2={mean + 2 * stdDev}
              fill="#fef9c3"
              fillOpacity={0.3}
            />
            {/* ±1σ band */}
            <ReferenceArea
              y1={mean - stdDev}
              y2={mean + stdDev}
              fill="#dcfce7"
              fillOpacity={0.35}
            />
            {/* Mean line */}
            <ReferenceLine
              y={mean}
              stroke="#6366f1"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              label={{ value: `μ = ${mean.toFixed(2)}`, position: 'right', fontSize: 10, fill: '#6366f1' }}
            />
            <Bar dataKey="ratio" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {territories.map((t, i) => (
                <Cell key={i} fill={getBarColor(t.ratio)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Outlier Detection ── */}
      {outliers.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-base font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
              Outlier Detection
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: '#fee2e2', color: '#991b1b' }}
            >
              {outliers.length} {outliers.length === 1 ? 'territory' : 'territories'} outside 2σ
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {outliers.map(o => {
              const above = o.deviation > 0;
              return (
                <div
                  key={o.name}
                  className="rounded-xl p-4 relative overflow-hidden"
                  style={{
                    background: 'var(--prizym-card-bg)',
                    border: '1px solid var(--prizym-border-default)',
                    boxShadow: 'var(--prizym-shadow-card)',
                    borderLeft: `4px solid ${above ? '#ef4444' : '#f59e0b'}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" style={{ color: above ? '#ef4444' : '#f59e0b' }} />
                    <h3 className="text-sm font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
                      {o.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 mb-3 text-xs">
                    <span style={{ color: 'var(--prizym-text-secondary)' }}>
                      Ratio: <strong>{o.ratio.toFixed(2)}</strong>
                    </span>
                    <span
                      className="flex items-center gap-0.5 font-semibold"
                      style={{ color: above ? '#ef4444' : '#f59e0b' }}
                    >
                      {above ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(o.deviation).toFixed(1)}σ {above ? 'above' : 'below'} mean
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--prizym-text-muted)' }}>
                    {above
                      ? `Quota exceeds market potential. Recommended: Reduce quota by $${Math.round((o.ratio - mean) * o.marketPotential * 100) / 100}M or reassign ${Math.max(2, Math.round(o.deviation))} accounts from adjacent territory.`
                      : `Quota significantly below market potential. Recommended: Increase quota by $${Math.round((mean - o.ratio) * o.marketPotential * 100) / 100}M to capture untapped opportunity.`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Two-column: Peer Comparison + Fairness Trend ── */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        {/* Peer Comparison Scatter */}
        <div
          className="md:col-span-2 rounded-xl p-5"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div className="mb-4">
            <h2 className="text-base font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
              Peer Comparison
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
              Market potential vs. assigned quota &mdash; dotted line = perfect fairness (quota = potential)
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="marketPotential"
                type="number"
                domain={[4, 16]}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                label={{ value: 'Market Potential ($M)', position: 'bottom', fontSize: 11, fill: '#9ca3af', offset: 0 }}
              />
              <YAxis
                dataKey="quota"
                type="number"
                domain={[4, 16]}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                label={{ value: 'Assigned Quota ($M)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#9ca3af' }}
              />
              <Tooltip content={<ScatterTooltip />} />
              {/* Perfect fairness line */}
              <ReferenceLine
                segment={[{ x: 4, y: 4 }, { x: 16, y: 16 }]}
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                label={{ value: 'Perfect Fairness', position: 'insideTopLeft', fontSize: 10, fill: '#6366f1' }}
              />
              <Scatter data={territories} fill="#6366f1">
                {territories.map((t, i) => {
                  const dev = Math.abs(t.ratio - mean) / stdDev;
                  const color = dev <= 1 ? '#22c55e' : dev <= 2 ? '#f59e0b' : '#ef4444';
                  return <Cell key={i} fill={color} stroke={color} strokeWidth={1} r={6} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Fairness Trend */}
        <div
          className="rounded-xl p-5"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h2 className="text-base font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
                Fairness Trend
              </h2>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
              QFI over last 6 quarters
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id="qfiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis domain={[0.6, 1.0]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              {/* Threshold lines */}
              <ReferenceLine y={0.85} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={0.70} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1} />
              <Area
                type="monotone"
                dataKey="qfi"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#qfiGradient)"
                dot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          {/* Threshold legend */}
          <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--prizym-text-muted)' }}>
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-4 inline-block" style={{ background: '#22c55e' }} /> 0.85 Excellent
            </span>
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-4 inline-block" style={{ background: '#f59e0b' }} /> 0.70 Acceptable
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
