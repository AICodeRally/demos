'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  BRAND_FORECASTS,
  SEASONAL_OVERLAYS,
  WEATHER_IMPACTS,
  INVENTORY_RECOMMENDATIONS,
  BRAND_FAMILIES,
  SUPPLIER_COLORS,
  type BrandForecast,
} from '@/data/proofline';
import { fmt, fmtK, pct } from '@/lib/utils';

/* ── Forecast Area Chart (SVG with confidence bands) */
function ForecastChart({ forecast }: { forecast: BrandForecast }) {
  const w = 680, h = 200, px = 50, py = 20;
  const plotW = w - px * 2, plotH = h - py * 2;
  const weeks = forecast.weeklyForecasts;

  const allVals = weeks.flatMap(wk => [wk.actual ?? wk.forecast, wk.lower, wk.upper]);
  const maxVal = Math.max(...allVals) * 1.05;
  const minVal = Math.min(...allVals) * 0.95;
  const range = maxVal - minVal;

  const toX = (i: number) => px + (i / 12) * plotW;
  const toY = (v: number) => py + plotH - ((v - minVal) / range) * plotH;

  // Confidence band polygon
  const bandTop = weeks.map((wk, i) => `${toX(i)},${toY(wk.upper)}`).join(' ');
  const bandBot = [...weeks].reverse().map((wk, i) => `${toX(12 - i)},${toY(wk.lower)}`).join(' ');
  const bandPoly = `${bandTop} ${bandBot}`;

  // Forecast line
  const forecastPath = weeks.map((wk, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(wk.forecast)}`).join(' ');

  // Actual line (up to week 8)
  const actualWeeks = weeks.filter(wk => wk.actual !== null);
  const actualPath = actualWeeks.map((wk, i) => `${i === 0 ? 'M' : 'L'}${toX(wk.week - 1)},${toY(wk.actual!)}`).join(' ');

  const color = SUPPLIER_COLORS[forecast.supplier] ?? '#2563EB';

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1.0].map(frac => {
        const val = minVal + frac * range;
        const y = toY(val);
        return (
          <g key={frac}>
            <line x1={px} y1={y} x2={w - px} y2={y} stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
            <text x={px - 4} y={y + 3} textAnchor="end" fontSize="8" fill="var(--pl-text-faint)" fontFamily="monospace">
              {fmtK(val)}
            </text>
          </g>
        );
      })}

      {/* Confidence band */}
      <polygon points={bandPoly} fill={color} opacity={0.08} />

      {/* Forecast/actual separator */}
      <line x1={toX(7.5)} y1={py} x2={toX(7.5)} y2={py + plotH} stroke="var(--pl-text-faint)" strokeWidth="0.5" strokeDasharray="3 2" />
      <text x={toX(7.5)} y={py - 4} textAnchor="middle" fontSize="7" fill="var(--pl-text-faint)" fontFamily="monospace">Now</text>

      {/* Forecast line */}
      <path d={forecastPath} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />

      {/* Actual line */}
      <path d={actualPath} fill="none" stroke={color} strokeWidth="2.5" />

      {/* Actual dots */}
      {actualWeeks.map(wk => (
        <circle key={wk.week} cx={toX(wk.week - 1)} cy={toY(wk.actual!)} r={3.5} fill={color} />
      ))}

      {/* Forecast dots */}
      {weeks.filter(wk => wk.actual === null).map(wk => (
        <circle key={wk.week} cx={toX(wk.week - 1)} cy={toY(wk.forecast)} r={3} fill="white" stroke={color} strokeWidth="1.5" />
      ))}

      {/* Week labels */}
      {weeks.map((wk, i) => (
        <text key={i} x={toX(i)} y={h - 2} textAnchor="middle" fontSize="7" fill="var(--pl-text-faint)" fontFamily="monospace">
          W{wk.week}
        </text>
      ))}

      {/* Seasonal overlay indicators */}
      {SEASONAL_OVERLAYS.filter(o => o.affectedBrands.includes(forecast.brandId)).map(o => (
        <rect
          key={o.eventName}
          x={toX(o.startWeek - 1)}
          y={py}
          width={toX(o.endWeek - 1) - toX(o.startWeek - 1) + (plotW / 12)}
          height={plotH}
          fill="#F59E0B"
          opacity={0.06}
        />
      ))}
    </svg>
    </>
  );
}

export default function DemandForecastingPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>(BRAND_FORECASTS[0].brandId);
  const [showOverlays, setShowOverlays] = useState(true);

  const brand = BRAND_FORECASTS.find(b => b.brandId === selectedBrand) ?? BRAND_FORECASTS[0];
  const avgAccuracy = BRAND_FORECASTS.reduce((s, b) => s + b.forecastAccuracy, 0) / BRAND_FORECASTS.length;
  const totalTarget = BRAND_FORECASTS.reduce((s, b) => s + b.quarterTarget, 0);
  const totalPace = BRAND_FORECASTS.reduce((s, b) => s + b.currentPace, 0);

  return (
    <>
    
      <ActNavigation currentAct={3} />

      {/* Breadcrumb */}
      <div className="mt-4 flex items-center gap-2 text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        <Link href="/proofline-andrews/ops/ai" style={{ color: '#2563EB' }}>AI Intelligence Hub</Link>
        <span>/</span>
        <span>Demand Forecasting</span>
      </div>

      {/* Header */}
      <div className="mt-4 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Demand Forecasting &middot; 13-Week Outlook
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Brand-Level Forecast
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {BRAND_FORECASTS.length} brands &middot; Week 9 of 13 &middot; 80% confidence bands &middot; {pct(1 - avgAccuracy)} accuracy
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Q Target" value={fmtK(totalTarget)} accent="#2563EB" sub="Total cases" />
        <LightKpiCard label="Current Pace" value={fmtK(totalPace)} accent={totalPace >= totalTarget ? '#22C55E' : '#F59E0B'} sub={pct(totalPace / totalTarget)} />
        <LightKpiCard label="Accuracy (MAPE)" value={`${(avgAccuracy * 100).toFixed(1)}%`} accent="#22C55E" sub="Lower is better" />
        <LightKpiCard label="Active Overlays" value={String(SEASONAL_OVERLAYS.filter(o => o.startWeek <= 9 && o.endWeek >= 9).length)} accent="#F59E0B" />
        <LightKpiCard label="Weather Factor" value={WEATHER_IMPACTS.find(w => w.week === 9)?.type ?? 'normal'} accent="#3B82F6" />
      </div>

      {/* Brand Selector */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-[11px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Brand:</span>
        {BRAND_FORECASTS.map(b => {
          const color = SUPPLIER_COLORS[b.supplier] ?? 'var(--pl-text-muted)';
          return (
            <button
              key={b.brandId}
              onClick={() => setSelectedBrand(b.brandId)}
              className="text-[11px] font-mono px-3 py-1 rounded-lg border transition-colors"
              style={{
                borderColor: selectedBrand === b.brandId ? color : 'var(--pl-border)',
                background: selectedBrand === b.brandId ? `${color}12` : 'var(--pl-card)',
                color: selectedBrand === b.brandId ? color : 'var(--pl-text-muted)',
                fontWeight: selectedBrand === b.brandId ? 700 : 400,
              }}
            >
              {b.brandName}
            </button>
          );
        })}
      </div>

      {/* Forecast Chart */}
      <LightSectionCard title={`${brand.brandName} — 13-Week Forecast`} className="mb-6">
        <div className="flex items-center gap-4 mb-2 text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
          <span>Solid = actual · Dashed = forecast · Shaded = 80% confidence · Yellow = seasonal overlay</span>
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className="px-2 py-0.5 rounded border transition-colors"
            style={{
              borderColor: showOverlays ? '#F59E0B' : 'var(--pl-border)',
              color: showOverlays ? '#F59E0B' : 'var(--pl-text-faint)',
            }}
          >
            Overlays: {showOverlays ? 'ON' : 'OFF'}
          </button>
        </div>
        <ForecastChart forecast={brand} />

        {/* Brand metrics */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'var(--pl-border)' }}>
          <div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Quarter Target</div>
            <div className="text-[16px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{fmtK(brand.quarterTarget)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Current Pace</div>
            <div className="text-[16px] font-bold font-mono" style={{ color: brand.currentPace >= brand.quarterTarget ? '#22C55E' : '#F59E0B' }}>
              {fmtK(brand.currentPace)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Accuracy (MAPE)</div>
            <div className="text-[16px] font-bold font-mono" style={{ color: brand.forecastAccuracy <= 0.04 ? '#22C55E' : '#F59E0B' }}>
              {(brand.forecastAccuracy * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Trend</div>
            <div className="text-[16px] font-bold font-mono" style={{ color: brand.trend === 'up' ? '#22C55E' : brand.trend === 'down' ? '#F87171' : 'var(--pl-text-muted)' }}>
              {brand.trend === 'up' ? '↑ Up' : brand.trend === 'down' ? '↓ Down' : '→ Flat'}
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="mt-4 rounded-lg p-3" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.1)' }}>
          <div className="text-[10px] font-bold font-mono mb-1" style={{ color: '#2563EB' }}>AI RECOMMENDATION</div>
          <p className="text-[11px]" style={{ color: 'var(--pl-text)' }}>{brand.aiRecommendation}</p>
        </div>
      </LightSectionCard>

      {/* Weather Impacts */}
      <LightSectionCard title="Weather Impact Projections" className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          {WEATHER_IMPACTS.map(wi => {
            const typeColor = wi.type === 'heat-wave' ? '#F87171' : wi.type === 'cold-snap' ? '#3B82F6' : wi.type === 'storm' ? 'var(--pl-text-muted)' : '#22C55E';
            return (
              <div key={wi.week} className="rounded-lg border p-3" style={{ borderColor: 'var(--pl-border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: `${typeColor}12`, color: typeColor }}>
                    W{wi.week}
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{wi.type.replace('-', ' ')}</span>
                  <span className="text-[10px] font-mono" style={{ color: wi.tempDelta > 0 ? '#F87171' : '#3B82F6' }}>
                    {wi.tempDelta > 0 ? '+' : ''}{wi.tempDelta}°F
                  </span>
                  <span className="text-[10px] font-bold font-mono ml-auto" style={{ color: wi.volumeImpact > 0 ? '#22C55E' : '#F87171' }}>
                    {wi.volumeImpact > 0 ? '+' : ''}{(wi.volumeImpact * 100).toFixed(0)}% vol
                  </span>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>{wi.description}</p>
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* All Brands Summary */}
      <LightSectionCard title="All Brands — Forecast Summary" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: 'var(--pl-text-muted)' }}>
                <th className="text-left font-medium pb-3 pl-2">Brand</th>
                <th className="text-right font-medium pb-3">Q Target</th>
                <th className="text-right font-medium pb-3">Pace</th>
                <th className="text-right font-medium pb-3">MAPE</th>
                <th className="text-left font-medium pb-3">Trend</th>
                <th className="text-left font-medium pb-3 pr-2">AI Note</th>
              </tr>
            </thead>
            <tbody>
              {BRAND_FORECASTS.map((b, i) => {
                const color = SUPPLIER_COLORS[b.supplier];
                return (
                  <tr
                    key={b.brandId}
                    className={`cursor-pointer ${selectedBrand === b.brandId ? 'ring-1 ring-blue-200' : ''}`}
                    style={{ background: i % 2 === 0 ? 'var(--pl-stripe)' : undefined }}
                    onClick={() => setSelectedBrand(b.brandId)}
                  >
                    <td className="py-2 pl-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span className="font-semibold" style={{ color: 'var(--pl-text)' }}>{b.brandName}</span>
                      </div>
                    </td>
                    <td className="py-2 text-right font-mono" style={{ color: 'var(--pl-text)' }}>{fmtK(b.quarterTarget)}</td>
                    <td className="py-2 text-right font-mono" style={{ color: b.currentPace >= b.quarterTarget ? '#22C55E' : '#F59E0B' }}>
                      {fmtK(b.currentPace)} ({pct(b.currentPace / b.quarterTarget)})
                    </td>
                    <td className="py-2 text-right font-mono" style={{ color: b.forecastAccuracy <= 0.04 ? '#22C55E' : '#F59E0B' }}>
                      {(b.forecastAccuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-2 font-mono font-bold" style={{ color: b.trend === 'up' ? '#22C55E' : b.trend === 'down' ? '#F87171' : 'var(--pl-text-muted)' }}>
                      {b.trend === 'up' ? '↑' : b.trend === 'down' ? '↓' : '→'}
                    </td>
                    <td className="py-2 pr-2 text-[10px] max-w-[200px] truncate" style={{ color: 'var(--pl-text-muted)' }}>
                      {b.aiRecommendation.slice(0, 60)}...
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        ARIMA + XGBoost ensemble model. 80% confidence bands from 1000 simulation runs. Seasonal decomposition using X-13ARIMA-SEATS.
        Weather data from NOAA API (DFW, Corpus Christi, Laredo stations). Retrained weekly.
      </div>
    
    </>
  );
}
