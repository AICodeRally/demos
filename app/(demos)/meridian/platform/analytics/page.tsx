'use client';

import { ActNavigation, SectionCard, KpiCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { FUND_PERFORMANCE, FUND } from '@/data/meridian';

const JCURVE = [
  { year: 0, irr: 0 },
  { year: 0.5, irr: -0.08 },
  { year: 1, irr: -0.12 },
  { year: 1.5, irr: -0.06 },
  { year: 2, irr: 0.02 },
  { year: 2.5, irr: 0.08 },
  { year: 3, irr: 0.14 },
  { year: 3.5, irr: 0.186 },
];

export default function FundAnalyticsPage() {
  const w = 700, h = 220;
  const pad = { top: 30, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const minIRR = -0.15, maxIRR = 0.25;
  const toX = (yr: number) => pad.left + (yr / 4) * chartW;
  const toY = (irr: number) => pad.top + chartH - ((irr - minIRR) / (maxIRR - minIRR)) * chartH;
  const zeroY = toY(0);

  return (
    <>
      <ActNavigation currentAct={6} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Net IRR', value: '18.6%', status: 'green', detail: 'Top quartile (Q1)' },
          { label: 'J-Curve', value: 'Inflected', status: 'green', detail: 'Positive since Year 2' },
          { label: 'Peer Rank', value: 'Top 15%', status: 'green', detail: 'Vintage 2022 cohort' },
          { label: 'Benchmark', value: '+5.4%', status: 'green', detail: 'PME alpha vs S&P 500' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#F97316' }}>
          Act 6 &middot; Analytics &amp; Platform
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Fund Analytics Dashboard
        </h1>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Outperformance Through Operational Alpha"
        insight="Fund IV's top-quartile positioning is driven by EBITDA expansion at the portfolio level, not financial engineering. Early J-curve inflection at Year 2 (vs. typical Year 3-4) reflects faster value creation from our operational playbook and bolt-on acquisition strategy."
        accentColor="#F97316"
        implications={[
          'PME alpha of +5.4% over S&P 500 demonstrates genuine skill premium — net of fees, Fund IV is generating 1.4x the public market equivalent.',
          'DPI of 0.55x at Year 3.5 is well ahead of median (0.32x) — driven by early exits of Apex Logistics and partial realizations.',
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <KpiCard label="Net IRR" value={`${(FUND_PERFORMANCE.netIRR * 100).toFixed(1)}%`} accent="#10B981" sub="Top quartile" variant="primary" delta="+3.2%" deltaDirection="up" stagger={0} />
        <KpiCard label="Net TVPI" value={`${FUND_PERFORMANCE.netTVPI.toFixed(2)}x`} accent="#3B82F6" sub="Total value / paid-in" variant="primary" stagger={1} />
        <KpiCard label="DPI" value={`${FUND_PERFORMANCE.netDPI.toFixed(2)}x`} accent="#8B5CF6" sub="Distributions / paid-in" stagger={2} />
        <KpiCard label="PME Alpha" value={`+${(FUND_PERFORMANCE.pmeAlpha * 100).toFixed(1)}%`} accent="#D4A847" sub="vs S&P 500" stagger={3} />
        <KpiCard label="Quartile" value="Q1" accent="#F97316" sub={`Vintage ${FUND.vintage}`} stagger={4} />
      </div>

      {/* J-Curve */}
      <SectionCard title="J-Curve — Net IRR Progression" variant="hero" accentColor="#F97316">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
          {/* Grid */}
          {[-0.1, 0, 0.1, 0.2].map((v) => (
            <g key={v}>
              <line x1={pad.left} y1={toY(v)} x2={w - pad.right} y2={toY(v)} stroke="var(--mr-chart-grid)" strokeWidth="1" strokeDasharray={v === 0 ? 'none' : '4 4'} />
              <text x={pad.left - 8} y={toY(v) + 4} textAnchor="end" fontSize="10" fill="var(--mr-text-faint)" fontFamily="var(--mr-font)">{(v * 100).toFixed(0)}%</text>
            </g>
          ))}

          {/* Zero line highlighted */}
          <line x1={pad.left} y1={zeroY} x2={w - pad.right} y2={zeroY} stroke="var(--mr-text-faint)" strokeWidth="1.5" />

          {/* Area fill */}
          <path
            d={`M${toX(0)},${zeroY} ${JCURVE.map((p) => `L${toX(p.year)},${toY(p.irr)}`).join(' ')} L${toX(3.5)},${zeroY} Z`}
            fill="url(#jcurve-gradient)" opacity={0.3}
          />
          <defs>
            <linearGradient id="jcurve-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Line */}
          <polyline
            points={JCURVE.map((p) => `${toX(p.year)},${toY(p.irr)}`).join(' ')}
            fill="none" stroke="#D4A847" strokeWidth="2.5"
          />
          {JCURVE.map((p) => (
            <circle key={p.year} cx={toX(p.year)} cy={toY(p.irr)} r={4} fill={p.irr >= 0 ? '#10B981' : '#EF4444'} stroke="var(--mr-card)" strokeWidth="2" />
          ))}

          {/* Current position */}
          <text x={toX(3.5) + 8} y={toY(0.186) + 4} fontSize="11" fontWeight="bold" fill="#D4A847" fontFamily="var(--mr-font)">18.6% Net IRR</text>

          {/* X axis */}
          {[0, 1, 2, 3].map((yr) => (
            <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fontSize="10" fill="var(--mr-text-faint)" fontFamily="var(--mr-font)">Year {yr}</text>
          ))}
        </svg>
        <div className="text-[12px] mt-2" style={{ color: 'var(--mr-text-faint)' }}>
          Typical PE J-curve: negative IRR in early years due to management fees and unrealized investments. Fund IV crossed positive IRR at year 2.
        </div>
      </SectionCard>

      {/* Peer Comparison */}
      <SectionCard title="Vintage 2022 Peer Comparison" meta="Cambridge Associates benchmark">
        <div className="space-y-2">
          {[
            { fund: 'Granite Peak IV', irr: 18.6, tvpi: 1.62, dpi: 0.55, quartile: 'Q1', highlight: true },
            { fund: 'Peer Median (2022)', irr: 12.4, tvpi: 1.35, dpi: 0.32, quartile: 'Q2', highlight: false },
            { fund: 'Top Quartile Threshold', irr: 16.0, tvpi: 1.50, dpi: 0.45, quartile: 'Q1', highlight: false },
            { fund: 'Bottom Quartile', irr: 6.8, tvpi: 1.12, dpi: 0.18, quartile: 'Q4', highlight: false },
          ].map((p) => (
            <div
              key={p.fund}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl transition-all hover:shadow-md animate-mr-fade-in"
              style={{
                background: p.highlight ? 'rgba(212,168,71,0.08)' : 'var(--mr-card-alt)',
                border: `1px solid ${p.highlight ? '#D4A847' : 'var(--mr-border)'}`,
              }}
            >
              <div className="flex-1">
                <span className="text-[14px] font-bold" style={{ color: p.highlight ? '#D4A847' : 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>{p.fund}</span>
              </div>
              <div className="flex gap-4">
                <div className="text-center w-20"><div className="text-[10px] uppercase tracking-[1px] font-semibold" style={{ color: 'var(--mr-text-faint)' }}>Net IRR</div><div className="text-[14px] font-bold tabular-nums" style={{ color: 'var(--mr-text)' }}>{p.irr}%</div></div>
                <div className="text-center w-20"><div className="text-[10px] uppercase tracking-[1px] font-semibold" style={{ color: 'var(--mr-text-faint)' }}>TVPI</div><div className="text-[14px] font-bold tabular-nums" style={{ color: 'var(--mr-text)' }}>{p.tvpi}x</div></div>
                <div className="text-center w-20"><div className="text-[10px] uppercase tracking-[1px] font-semibold" style={{ color: 'var(--mr-text-faint)' }}>DPI</div><div className="text-[14px] font-bold tabular-nums" style={{ color: 'var(--mr-text)' }}>{p.dpi}x</div></div>
                <div className="w-12 flex items-center justify-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: p.quartile === 'Q1' ? '#10B98115' : '#6B728015', color: p.quartile === 'Q1' ? '#10B981' : '#6B7280' }}>
                    {p.quartile}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
