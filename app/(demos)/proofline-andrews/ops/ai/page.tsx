'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  BRAND_FORECASTS,
  SEASONAL_OVERLAYS,
  INVENTORY_RECOMMENDATIONS,
  getAggregateForecast,
  ROUTES,
  BRAND_FAMILIES,
} from '@/data/proofline';
import { fmt, fmtK, pct } from '@/lib/utils';

function useBasePrefix(): string {
  const pathname = usePathname();
  const match = pathname.match(/^\/([^/]+)/);
  return match ? `/${match[1]}` : '';
}

/* ── Quadrant Card ───────────────────────────── */
function QuadrantCard({
  title, subtitle, metric, metricLabel, insight, link, color, miniChartData,
}: {
  title: string; subtitle: string; metric: string; metricLabel: string;
  insight: string; link: string; color: string;
  miniChartData: number[];
}) {
  const prefix = useBasePrefix();
  // Simple sparkline
  const max = Math.max(...miniChartData);
  const min = Math.min(...miniChartData);
  const range = max - min || 1;
  const w = 160, h = 40;
  const path = miniChartData
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (miniChartData.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');

  return (
    <>
    <Link
      href={`${prefix}${link}`}
      className="block rounded-lg border p-5 hover:shadow-md transition-shadow group"
      style={{ borderColor: 'var(--pl-border)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs tracking-[2px] uppercase font-mono mb-1" style={{ color }}>
            {subtitle}
          </div>
          <h3 className="text-[16px] font-bold" style={{ color: 'var(--pl-text)' }}>{title}</h3>
        </div>
        <div className="text-right">
          <div className="text-[22px] font-bold font-mono" style={{ color }}>{metric}</div>
          <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{metricLabel}</div>
        </div>
      </div>

      {/* Mini chart */}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full mb-3" style={{ height: 40 }}>
        <path d={path} fill="none" stroke={color} strokeWidth="2" />
      </svg>

      <p className="text-[13px] mb-3" style={{ color: 'var(--pl-text-muted)' }}>{insight}</p>

      <div className="text-[13px] font-mono group-hover:underline" style={{ color }}>
        Explore &rarr;
      </div>
    </Link>
    </>
  );
}

export default function AiIntelligenceHubPage() {
  // Aggregate metrics
  const aggregateWeeks = Array.from({ length: 13 }, (_, i) => getAggregateForecast(i + 1));
  const currentAggregate = getAggregateForecast(9);
  const avgAccuracy = BRAND_FORECASTS.reduce((s, b) => s + b.forecastAccuracy, 0) / BRAND_FORECASTS.length;
  const upTrends = BRAND_FORECASTS.filter(b => b.trend === 'up').length;
  const highUrgency = INVENTORY_RECOMMENDATIONS.filter(r => r.urgency === 'high').length;
  const activeOverlays = SEASONAL_OVERLAYS.filter(o => o.startWeek <= 9 && o.endWeek >= 9);
  const avgOnTime = ROUTES.reduce((s, r) => s + r.onTimeRate, 0) / ROUTES.length;
  const portfolioGP = BRAND_FAMILIES.reduce((s, b) => s + b.revQ * b.gp, 0) / BRAND_FAMILIES.reduce((s, b) => s + b.revQ, 0);

  // Sparkline data from aggregate
  const casesSpark = aggregateWeeks.map(w => w.totalForecast);
  const routeEffSpark = [94, 93, 95, 94, 96, 95, 97, 96, 95, 94, 96, 95, 97]; // simulated
  const marginSpark = [0.24, 0.245, 0.25, 0.248, 0.252, 0.255, 0.258, 0.26, 0.262, 0.265, 0.268, 0.27, 0.272]; // simulated
  const priceSpark = [28.4, 28.5, 28.3, 28.6, 28.7, 28.5, 28.8, 28.9, 29.0, 29.1, 29.2, 29.3, 29.1]; // simulated $/case

  return (
    <>
    
      <ActNavigation currentAct={3} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          AI Intelligence Hub &middot; Powered by PROOFLINE AI
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          AI-Powered Intelligence
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {BRAND_FORECASTS.length} brands forecasted &middot; {SEASONAL_OVERLAYS.length} seasonal overlays &middot; {pct(1 - avgAccuracy)} forecast accuracy
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Forecast Accuracy" value={pct(1 - avgAccuracy)} accent="#22C55E" sub={`${(avgAccuracy * 100).toFixed(1)}% MAPE`} stagger={0} />
        <LightKpiCard label="Trending Up" value={`${upTrends}/${BRAND_FORECASTS.length}`} accent="#22C55E" sub="Brands accelerating" stagger={1} />
        <LightKpiCard label="Active Overlays" value={String(activeOverlays.length)} accent="#F59E0B" sub={activeOverlays[0]?.eventName ?? 'None'} stagger={2} />
        <LightKpiCard label="Stock Alerts" value={String(highUrgency)} accent={highUrgency > 0 ? '#F87171' : '#22C55E'} sub="High urgency" stagger={3} />
        <LightKpiCard label="Route Efficiency" value={pct(avgOnTime)} accent="#2563EB" sub="Avg on-time rate" stagger={4} />
      </div>

      {/* 4-Quadrant Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <QuadrantCard
          title="Demand Forecasting"
          subtitle="Predictive Analytics"
          metric={fmtK(currentAggregate.totalForecast)}
          metricLabel="Cases this week"
          insight={`${upTrends} brands trending up. Spring Break overlay active (+10% imports). Cinco de Mayo buildup starts week 10. ${pct(1 - avgAccuracy)} accuracy over last 8 weeks.`}
          link="/ops/ai/forecasting"
          color="#2563EB"
          miniChartData={casesSpark}
        />
        <QuadrantCard
          title="Price Optimization"
          subtitle="Revenue Maximization"
          metric={`$${priceSpark[priceSpark.length - 1].toFixed(1)}`}
          metricLabel="Avg $/case"
          insight={`Revenue per case trending +2.4% QoQ. Premium mix shift driving margin expansion. Modelo Especial and Corona commanding higher price points in suburban routes.`}
          link="/ops/ai/pricing"
          color="#2563EB"
          miniChartData={priceSpark}
        />
        <QuadrantCard
          title="Route Optimization"
          subtitle="Operational AI"
          metric={pct(avgOnTime)}
          metricLabel="On-time delivery"
          insight={`AI route optimization saving 12% fuel costs. I-30 construction rerouting active for 3 Dallas routes. Laredo border crossing time predictions reducing delays 18%.`}
          link="/ops/dispatch"
          color="#22C55E"
          miniChartData={routeEffSpark}
        />
        <QuadrantCard
          title="Portfolio Recommendations"
          subtitle="Mix Intelligence"
          metric={pct(portfolioGP)}
          metricLabel="Blended GP margin"
          insight={`AI recommends shifting 2pp from FMB/RTD to Sazerac spirits. Margin uplift potential: +$1.2M/yr. ${INVENTORY_RECOMMENDATIONS.filter(r => r.action === 'increase').length} brands need inventory increase.`}
          link="/strategy/mix"
          color="#F59E0B"
          miniChartData={marginSpark}
        />
      </div>

      {/* Active Seasonal Overlays */}
      <LightSectionCard title="Active & Upcoming Seasonal Overlays" className="mb-6">
        <div className="space-y-2">
          {SEASONAL_OVERLAYS.map(overlay => {
            const isActive = overlay.startWeek <= 9 && overlay.endWeek >= 9;
            const isPast = overlay.endWeek < 9;
            return (
              <div key={overlay.eventName} className="flex items-start gap-4 px-4 py-3 rounded-lg border" style={{ borderColor: isActive ? 'rgba(37,99,235,0.3)' : 'var(--pl-border)' }}>
                <span
                  className="text-xs font-bold font-mono px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{
                    background: isActive ? 'rgba(37,99,235,0.08)' : isPast ? 'rgba(113,128,150,0.08)' : 'rgba(245,158,11,0.08)',
                    color: isActive ? '#2563EB' : isPast ? 'var(--pl-text-faint)' : '#F59E0B',
                  }}
                >
                  {isActive ? 'ACTIVE' : isPast ? 'PAST' : 'UPCOMING'}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{overlay.eventName}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>W{overlay.startWeek}–W{overlay.endWeek}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: '#22C55E' }}>+{(overlay.impactPct * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>{overlay.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Governance & Security */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ borderColor: 'var(--pl-border)', background: 'rgba(37,99,235,0.02)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
            ENTERPRISE GOVERNANCE
          </span>
        </div>
        <h4 className="text-[14px] font-bold mb-2" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          AI Governance &amp; Data Security
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-bold font-mono mb-1" style={{ color: '#22C55E' }}>DATA OWNERSHIP</div>
            <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
              All data remains on your infrastructure. No training on client data. Outputs are auditable with full provenance trail.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold font-mono mb-1" style={{ color: '#2563EB' }}>HALLUCINATION PREVENTION</div>
            <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
              Every AI recommendation is grounded in your transactional data — IRI/Nielsen syndicated + internal shipment history. No fabricated insights.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold font-mono mb-1" style={{ color: '#A855F7' }}>STACK AGNOSTIC</div>
            <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
              Deploys alongside existing systems (Snowflake, route accounting, tablets). No rip-and-replace. Iterative rollout with IT oversight at every stage.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        PROOFLINE AI combines time-series forecasting (ARIMA + gradient boosting), seasonal decomposition, weather API integration,
        and competitive intelligence signals. Model retrained weekly on rolling 52-week data. MAPE = Mean Absolute Percentage Error.
      </div>
    
    </>
  );
}
