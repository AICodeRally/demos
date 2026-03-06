'use client';


import { RATE_CATEGORIES } from '@/data/equipr/rates';

/* ── Helpers ──────────────────────────────────────────────── */

function gapColor(gap: number): { text: string; bg: string } {
  if (gap >= -2) return { text: '#10B981', bg: 'rgba(16,185,129,0.12)' };
  if (gap >= -5) return { text: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
  return { text: '#EF4444', bg: 'rgba(239,68,68,0.15)' };
}

function trendIcon(trend: 'up' | 'down' | 'flat') {
  if (trend === 'up') return <span style={{ color: '#10B981' }}>{'\u25B2'}</span>;
  if (trend === 'down') return <span style={{ color: '#EF4444' }}>{'\u25BC'}</span>;
  return <span style={{ color: '#64748B' }}>{'\u25AC'}</span>;
}

function fmtDollar(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

/* ── Summary KPIs ─────────────────────────────────────────── */

const avgTarget = Math.round(
  RATE_CATEGORIES.reduce((s, c) => s + c.targetMargin, 0) / RATE_CATEGORIES.length,
);
const avgActual = Math.round(
  RATE_CATEGORIES.reduce((s, c) => s + c.actualMargin, 0) / RATE_CATEGORIES.length,
);
const avgGap = avgActual - avgTarget;

/* ── Source Badge ─────────────────────────────────────────── */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>•</span>
      <span>Synced {synced}</span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function RateScorecardPage() {
  return (
    <>
      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{
            color: 'var(--prizym-text-primary)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Rate Scorecard
        </h1>
        <p
          className="text-[13px] mt-0.5"
          style={{ color: 'var(--prizym-text-secondary)' }}
        >
          Margin targets vs. actuals by equipment category
        </p>
        <SourceBadge source="Wynne Systems + Rouse Analytics" synced="Q4 2025 benchmarks" />
      </div>

      {/* ── Summary Strip ────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Overall Target */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#2563EB' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Overall Target
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {avgTarget}%
          </div>
        </div>

        {/* Overall Actual */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#F59E0B' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Overall Actual
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {avgActual}%
          </div>
        </div>

        {/* Gap */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#EF4444' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Gap
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#EF4444',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {avgGap} pts
          </div>
        </div>
      </div>

      {/* ── Main Table ───────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden mb-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        {/* Table Header */}
        <div
          className="grid gap-2 px-5 py-3 text-[10px] uppercase tracking-[1.5px] font-mono"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1.2fr 0.8fr 1fr 1fr 1.2fr',
            background: '#F3F4F6',
            color: 'var(--prizym-text-muted)',
            borderBottom: '1px solid var(--prizym-border-default)',
          }}
        >
          <div>Category</div>
          <div className="text-right">Target</div>
          <div className="text-right">Actual</div>
          <div className="text-center">Gap</div>
          <div className="text-center">Trend</div>
          <div className="text-right">Floor</div>
          <div className="text-right">Avg Rate</div>
          <div className="text-right">Revenue</div>
        </div>

        {/* Table Rows */}
        {RATE_CATEGORIES.map((row, i) => {
          const gc = gapColor(row.gap);
          return (
            <div
              key={row.category}
              className="grid gap-2 px-5 py-3.5 items-center text-[13px]"
              style={{
                gridTemplateColumns: '2fr 1fr 1fr 1.2fr 0.8fr 1fr 1fr 1.2fr',
                background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                borderBottom:
                  i < RATE_CATEGORIES.length - 1
                    ? '1px solid rgba(0,0,0,0.06)'
                    : 'none',
              }}
            >
              {/* Category */}
              <div
                className="font-semibold"
                style={{ color: 'var(--prizym-text-primary)' }}
              >
                {row.category}
              </div>

              {/* Target */}
              <div
                className="text-right font-mono"
                style={{ color: 'var(--prizym-text-secondary)' }}
              >
                {row.targetMargin}%
              </div>

              {/* Actual */}
              <div
                className="text-right font-mono"
                style={{ color: 'var(--prizym-text-primary)' }}
              >
                {row.actualMargin}%
              </div>

              {/* Gap */}
              <div className="flex justify-center">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-bold font-mono"
                  style={{
                    color: gc.text,
                    background: gc.bg,
                  }}
                >
                  {row.gap >= 0 ? '\u25B2' : '\u25BC'} {row.gap >= 0 ? '+' : ''}{row.gap}pts
                </span>
              </div>

              {/* Trend */}
              <div className="text-center text-base">{trendIcon(row.trend)}</div>

              {/* Floor Rate */}
              <div
                className="text-right font-mono"
                style={{ color: 'var(--prizym-text-secondary)' }}
              >
                ${row.floorDaily}/day
              </div>

              {/* Avg Rate */}
              <div
                className="text-right font-mono"
                style={{ color: 'var(--prizym-text-primary)' }}
              >
                ${row.avgDaily}/day
              </div>

              {/* Revenue */}
              <div
                className="text-right font-mono font-semibold"
                style={{ color: 'var(--prizym-text-primary)' }}
              >
                {fmtDollar(row.totalRevenue)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Rate Governance Rules ────────────────────────── */}
      <div
        className="rounded-xl p-5"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="h-5 w-5 rounded flex items-center justify-center text-[11px]"
            style={{ background: 'rgba(37,99,235,0.15)', color: '#2563EB' }}
          >
            {'\u2696'}
          </div>
          <h3
            className="text-[13px] font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Rate Governance Rules
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Discounts > 10% require manager approval',
            'Below-floor pricing blocked without VP override',
            'Delivery fee waivers logged and flagged weekly',
            'Weekend rates must meet weekday floor minimum',
          ].map((rule) => (
            <div
              key={rule}
              className="flex items-start gap-2.5 px-4 py-3 rounded-lg"
              style={{
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.12)',
              }}
            >
              <div
                className="mt-0.5 h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: '#2563EB' }}
              />
              <span
                className="text-[12px]"
                style={{ color: 'var(--prizym-text-secondary)' }}
              >
                {rule}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
