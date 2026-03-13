'use client';

import { ActNavigation, SectionCard, KpiCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { FUND, DEPLOYMENT_TIMELINE } from '@/data/meridian';
import { fmt } from '@/lib/utils';

export default function CapitalDeploymentPage() {
  const pctDeployed = FUND.calledCapital / FUND.committedCapital;
  const dryPowder = FUND.uncalledCapital;
  const w = 700, h = 220;
  const pad = { top: 30, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxCum = FUND.committedCapital / 1e6;
  const barW = chartW / DEPLOYMENT_TIMELINE.length - 2;

  return (
    <>
      <ActNavigation currentAct={1} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Deploy Pace', value: 'Ahead', status: 'green', detail: '70% vs 60% target' },
          { label: 'Dry Powder', value: `$${(dryPowder / 1e6).toFixed(0)}M`, status: 'amber', detail: 'Uncalled capital' },
          { label: 'Call Cadence', value: 'Quarterly', status: 'green', detail: 'On schedule' },
          { label: 'Period Used', value: '3 of 5 yrs', status: 'green', detail: 'Investment period' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#D4A847' }}>
          Capital Management &middot; Deployment Pace
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Capital Deployment & Dry Powder
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          Year 3 of {FUND.investmentPeriod}-year investment period &middot; {(pctDeployed * 100).toFixed(0)}% called
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Disciplined Capital Deployment at Accelerated Pace"
        insight="Fund IV is tracking 10 percentage points ahead of target deployment pace, reflecting strong deal flow and IC conviction. Remaining dry powder is earmarked for 2-3 bolt-on acquisitions and one new healthcare services platform."
        accentColor="#D4A847"
        implications={[
          'Accelerated pace driven by two platform deals closing ahead of schedule in Q3 — no compromise on underwriting discipline.',
          'Bolt-on pipeline of 5 identified targets across existing platforms supports full deployment within investment period.',
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Called Capital" value={`$${(FUND.calledCapital / 1e9).toFixed(2)}B`} accent="#D4A847" sub={`${(pctDeployed * 100).toFixed(0)}% of commitments`} variant="primary" delta="+10%" deltaDirection="up" stagger={0} />
        <KpiCard label="Dry Powder" value={`$${(dryPowder / 1e6).toFixed(0)}M`} accent="#3B82F6" sub="Uncalled commitments" variant="primary" stagger={1} />
        <KpiCard label="Investments" value="7" accent="#10B981" sub="Platform acquisitions" stagger={2} />
        <KpiCard label="Bolt-Ons" value="16" accent="#8B5CF6" sub="Add-on acquisitions" delta="+4 YTD" deltaDirection="up" stagger={3} />
      </div>

      {/* Deployment Chart */}
      <SectionCard title="Capital Call & Deployment Timeline ($M)" variant="hero" accentColor="#D4A847">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
          {/* Grid */}
          {[0, 500, 1000, 1500, 2000, 2500].map((v) => (
            <g key={v}>
              <line x1={pad.left} y1={pad.top + chartH - (v / maxCum) * chartH} x2={w - pad.right} y2={pad.top + chartH - (v / maxCum) * chartH} stroke="var(--mr-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={pad.left - 8} y={pad.top + chartH - (v / maxCum) * chartH + 4} textAnchor="end" fontSize="10" fill="var(--mr-text-faint)" style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</text>
            </g>
          ))}

          {/* Cumulative line */}
          <polyline
            points={DEPLOYMENT_TIMELINE.map((d, i) => `${pad.left + i * (chartW / DEPLOYMENT_TIMELINE.length) + barW / 2},${pad.top + chartH - (d.cumDeployed / maxCum) * chartH}`).join(' ')}
            fill="none" stroke="#D4A847" strokeWidth="2.5"
          />
          {DEPLOYMENT_TIMELINE.map((d, i) => (
            <circle key={d.quarter} cx={pad.left + i * (chartW / DEPLOYMENT_TIMELINE.length) + barW / 2} cy={pad.top + chartH - (d.cumDeployed / maxCum) * chartH} r={3} fill="#D4A847" />
          ))}

          {/* Called bars */}
          {DEPLOYMENT_TIMELINE.map((d, i) => {
            const x = pad.left + i * (chartW / DEPLOYMENT_TIMELINE.length);
            const barH = (d.called / maxCum) * chartH;
            return (
              <g key={d.quarter}>
                <rect x={x + 1} y={pad.top + chartH - barH} width={barW * 0.45} height={barH} rx={2} fill="#3B82F6" opacity={0.6} />
                <rect x={x + barW * 0.5} y={pad.top + chartH - (d.deployed / maxCum) * chartH} width={barW * 0.45} height={(d.deployed / maxCum) * chartH} rx={2} fill="#10B981" opacity={0.6} />
                {i % 2 === 0 && (
                  <text x={x + barW / 2} y={h - 8} textAnchor="middle" fontSize="9" fill="var(--mr-text-faint)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {d.quarter.replace('20', "'")}
                  </text>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <rect x={w - 180} y={8} width={8} height={8} rx={2} fill="#3B82F6" opacity={0.6} />
          <text x={w - 168} y={16} fontSize="10" fill="var(--mr-text-muted)">Called</text>
          <rect x={w - 120} y={8} width={8} height={8} rx={2} fill="#10B981" opacity={0.6} />
          <text x={w - 108} y={16} fontSize="10" fill="var(--mr-text-muted)">Deployed</text>
          <rect x={w - 55} y={8} width={16} height={2} fill="#D4A847" />
          <text x={w - 35} y={16} fontSize="10" fill="var(--mr-text-muted)">Cum</text>
        </svg>
      </SectionCard>

      {/* Deployment breakdown */}
      <SectionCard title="Investment Period Utilization" meta="Year 3 of 5">
        <div className="mb-4">
          <div className="flex justify-between text-xs tabular-nums mb-2" style={{ color: 'var(--mr-text-muted)' }}>
            <span>Deployed: ${(FUND.calledCapital / 1e9).toFixed(2)}B</span>
            <span>Remaining: ${(FUND.uncalledCapital / 1e6).toFixed(0)}M</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden" style={{ background: 'var(--mr-chart-bar-track)' }}>
            <div className="h-full rounded-full" style={{ width: `${pctDeployed * 100}%`, background: 'linear-gradient(90deg, #D4A847, #10B981)' }} />
          </div>
          <div className="text-xs tabular-nums mt-1 text-center" style={{ color: 'var(--mr-text-faint)' }}>
            {(pctDeployed * 100).toFixed(0)}% of committed capital called &middot; Year 3 of {FUND.investmentPeriod}-year investment period
          </div>
        </div>
      </SectionCard>

      <div className="rounded-xl px-6 py-4 animate-mr-fade-in" style={{ background: 'rgba(212,168,71,0.06)', borderLeft: '3px solid #D4A847', animationDelay: '400ms' }}>
        <div className="text-xs font-bold mb-1" style={{ color: '#D4A847' }}>PACE COMMENTARY</div>
        <p className="text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
          Fund IV is tracking ahead of plan with 70% deployed in 3 years vs. 60% target pace. Remaining dry powder of ${fmt(FUND.uncalledCapital / 1e6)}M
          reserved for 2-3 bolt-on acquisitions across existing platforms and one new platform investment in healthcare services.
        </p>
      </div>
    </>
  );
}
