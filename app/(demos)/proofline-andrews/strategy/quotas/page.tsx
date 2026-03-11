'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard, GaugeDial } from '@/components/demos/proofline';
import {
  HOMETOWNS, ROUTES, TOTAL_ROUTES,
  QUOTA_NODES, SEASONAL_WEIGHTS, ATTAINMENT_HEATMAP, FAIRNESS_SCORES,
  getQuotaNodesByLevel, getQuotaChildren, getFairnessScore, getAttainmentHistory,
  getRoutesByHometown,
  type QuotaNode,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

/* ── Waterfall SVG Constants ─────────────────── */
const WF_W = 900;
const WF_H = 500;
const COL_X = [50, 320, 590] as const;
const BLOCK_W = 210;

function getNodeColor(node: QuotaNode): string {
  if (node.level === 'company') return '#C6A052';
  if (node.parentId === 'north-tx' || node.id === 'north-tx') return '#7C3AED';
  return '#2563EB';
}

export default function QuotaPlanningPage() {
  const [selectedHometown, setSelectedHometown] = useState<string | null>(null);

  const companyNode = QUOTA_NODES.find(n => n.level === 'company')!;
  const regionNodes = getQuotaNodesByLevel('region');
  const hometownNodes = getQuotaNodesByLevel('hometown');

  /* ── Waterfall layout computation ──────── */
  const totalRegionQuota = regionNodes.reduce((s, n) => s + n.topDownQuota, 0);
  const totalHometownQuota = hometownNodes.reduce((s, n) => s + n.topDownQuota, 0);

  // Column 1: Company block centered
  const companyY = 60;
  const companyH = WF_H - 120;

  // Column 2: Region blocks proportional
  const regionGap = 20;
  const regionAvailH = WF_H - 120;
  const regionBlocks = regionNodes.map((node, i) => {
    const share = node.topDownQuota / companyNode.topDownQuota;
    const h = Math.max(24, share * regionAvailH - regionGap);
    const prevH = regionNodes.slice(0, i).reduce((s, n) => {
      const sh = n.topDownQuota / companyNode.topDownQuota;
      return s + Math.max(24, sh * regionAvailH - regionGap) + regionGap;
    }, 0);
    return { node, x: COL_X[1], y: companyY + prevH, w: BLOCK_W, h };
  });

  // Column 3: Hometown blocks proportional
  const htGap = 8;
  const htAvailH = WF_H - 120;
  const htBlocks = hometownNodes.map((node, i) => {
    const share = node.topDownQuota / companyNode.topDownQuota;
    const h = Math.max(24, share * htAvailH * 1.5);
    const prevH = hometownNodes.slice(0, i).reduce((s, n) => {
      const sh = n.topDownQuota / companyNode.topDownQuota;
      return s + Math.max(24, sh * htAvailH * 1.5) + htGap;
    }, 0);
    return { node, x: COL_X[2], y: companyY + prevH, w: BLOCK_W, h };
  });

  /* ── Heatmap constants ─────────────────── */
  const quarters = ['Q1-2024', 'Q2-2024', 'Q3-2024', 'Q4-2024', 'Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025'];
  const quarterLabels = ["Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25"];
  const hometownOrder = ['dal', 'aln', 'ftw', 'ens', 'crp', 'lar'];
  const hometownNames: Record<string, string> = { dal: 'Dallas', aln: 'Allen', ftw: 'Ft Worth', ens: 'Ennis', crp: 'Corpus', lar: 'Laredo' };
  const CELL_W = 52;
  const CELL_H = 32;
  const CELL_GAP = 3;
  const HM_LEFT = 70;
  const HM_TOP = 30;

  function heatColor(val: number | null): string {
    if (val === null) return '#374151';
    if (val < 0.70) return '#DC2626';
    if (val < 0.85) return '#F87171';
    if (val < 0.95) return '#F59E0B';
    if (val < 1.00) return '#FDE68A';
    if (val < 1.05) return '#86EFAC';
    return '#22C55E';
  }

  function heatTextColor(val: number | null): string {
    if (val === null) return '#FFFFFF';
    if (val < 0.70) return '#FFFFFF';
    if (val < 0.85) return '#FFFFFF';
    return 'var(--pl-text)';
  }

  /* ── Seasonal chart constants ──────────── */
  const SC_W = 500;
  const SC_H = 200;
  const SC_PAD = { top: 20, right: 20, bottom: 30, left: 45 };
  const SC_PLOT_W = SC_W - SC_PAD.left - SC_PAD.right;
  const SC_PLOT_H = SC_H - SC_PAD.top - SC_PAD.bottom;
  const scMaxY = 0.12;
  const scMinY = 0;
  const flatRef = 1 / 12;

  function scX(i: number): number {
    return SC_PAD.left + (i / 11) * SC_PLOT_W;
  }
  function scY(w: number): number {
    return SC_PAD.top + SC_PLOT_H - ((w - scMinY) / (scMaxY - scMinY)) * SC_PLOT_H;
  }

  const seasonalLine = SEASONAL_WEIGHTS.map((sw, i) => `${i === 0 ? 'M' : 'L'} ${scX(i)},${scY(sw.weight)}`).join(' ');
  const seasonalArea = `${seasonalLine} L ${scX(11)},${scY(0)} L ${scX(0)},${scY(0)} Z`;
  const peakIdx = SEASONAL_WEIGHTS.reduce((best, sw, i) => sw.weight > SEASONAL_WEIGHTS[best].weight ? i : best, 0);
  const troughIdx = SEASONAL_WEIGHTS.reduce((best, sw, i) => sw.weight < SEASONAL_WEIGHTS[best].weight ? i : best, 0);

  /* ── Selected hometown route detail ────── */
  const selectedRoutes = selectedHometown ? getRoutesByHometown(selectedHometown) : [];
  const selectedNode = selectedHometown ? htBlocks.find(b => b.node.id === selectedHometown) : null;

  return (
    <>
      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Quota Planning &middot; FY2026
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Revenue Target Cascade
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          $44.8M territory target flows to {HOMETOWNS.length} hometowns and {TOTAL_ROUTES} routes
        </p>
      </div>

      {/* ── Section A — Vertical Waterfall "The Cascade" ── */}
      <LightSectionCard title="The Cascade: Company → Region → Hometown" className="mb-6">
        <svg viewBox={`0 0 ${WF_W} ${WF_H}`} className="w-full" style={{ height: 480 }}>
          {/* Column labels */}
          <text x={COL_X[0] + BLOCK_W / 2} y={40} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="11" fontFamily="monospace" fontWeight="600">COMPANY</text>
          <text x={COL_X[1] + BLOCK_W / 2} y={40} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="11" fontFamily="monospace" fontWeight="600">REGION</text>
          <text x={COL_X[2] + BLOCK_W / 2} y={40} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="11" fontFamily="monospace" fontWeight="600">HOMETOWN</text>

          {/* Company block */}
          <rect x={COL_X[0]} y={companyY} width={BLOCK_W} height={companyH} rx={6}
            fill="#C6A052" fillOpacity={0.15 + (companyNode.confidenceScore / 100) * 0.35}
            stroke="#C6A052" strokeOpacity={0.4} strokeWidth={1.5} />
          <text x={COL_X[0] + BLOCK_W / 2} y={companyY + companyH / 2 - 8} textAnchor="middle"
            fill="var(--pl-text)" fontSize="11" fontWeight="700">{companyNode.label}</text>
          <text x={COL_X[0] + BLOCK_W / 2} y={companyY + companyH / 2 + 10} textAnchor="middle"
            fill="#C6A052" fontSize="10" fontFamily="monospace">{fmtM(companyNode.topDownQuota)}</text>

          {/* Connection lines: company → regions */}
          {regionBlocks.map(rb => {
            const x1 = COL_X[0] + BLOCK_W;
            const y1 = companyY + companyH / 2;
            const x2 = rb.x;
            const y2 = rb.y + rb.h / 2;
            return (
              <path key={`conn-company-${rb.node.id}`}
                d={`M ${x1},${y1} C ${x1 + 60},${y1} ${x2 - 60},${y2} ${x2},${y2}`}
                fill="none" stroke="var(--pl-chart-grid)" strokeWidth={1} strokeDasharray="4 3" />
            );
          })}

          {/* Region blocks */}
          {regionBlocks.map(rb => {
            const color = getNodeColor(rb.node);
            return (
              <g key={rb.node.id}>
                <rect x={rb.x} y={rb.y} width={rb.w} height={rb.h} rx={6}
                  fill={color} fillOpacity={0.15 + (rb.node.confidenceScore / 100) * 0.35}
                  stroke={color} strokeOpacity={0.4} strokeWidth={1.5} />
                <text x={rb.x + rb.w / 2} y={rb.y + rb.h / 2 - 8} textAnchor="middle"
                  fill="var(--pl-text)" fontSize="11" fontWeight="700">{rb.node.label}</text>
                <text x={rb.x + rb.w / 2} y={rb.y + rb.h / 2 + 10} textAnchor="middle"
                  fill={color} fontSize="10" fontFamily="monospace">{fmtM(rb.node.topDownQuota)}</text>
              </g>
            );
          })}

          {/* Connection lines: regions → hometowns */}
          {htBlocks.map(hb => {
            const parent = regionBlocks.find(rb => rb.node.id === hb.node.parentId);
            if (!parent) return null;
            const x1 = parent.x + parent.w;
            const y1 = parent.y + parent.h / 2;
            const x2 = hb.x;
            const y2 = hb.y + hb.h / 2;
            return (
              <path key={`conn-${hb.node.parentId}-${hb.node.id}`}
                d={`M ${x1},${y1} C ${x1 + 60},${y1} ${x2 - 60},${y2} ${x2},${y2}`}
                fill="none" stroke="var(--pl-chart-grid)" strokeWidth={1} strokeDasharray="4 3" />
            );
          })}

          {/* Hometown blocks (clickable) */}
          {htBlocks.map(hb => {
            const color = getNodeColor(hb.node);
            const isSelected = selectedHometown === hb.node.id;
            return (
              <g key={hb.node.id}
                onClick={() => setSelectedHometown(selectedHometown === hb.node.id ? null : hb.node.id)}
                style={{ cursor: 'pointer' }}
              >
                <rect x={hb.x} y={hb.y} width={hb.w} height={hb.h} rx={6}
                  fill={color} fillOpacity={0.15 + (hb.node.confidenceScore / 100) * 0.35}
                  stroke={isSelected ? '#C6A052' : color} strokeOpacity={isSelected ? 1 : 0.4}
                  strokeWidth={isSelected ? 2.5 : 1.5} />
                <text x={hb.x + hb.w / 2} y={hb.y + hb.h / 2 - 4} textAnchor="middle"
                  fill="var(--pl-text)" fontSize="11" fontWeight="700">{hb.node.label}</text>
                <text x={hb.x + hb.w / 2} y={hb.y + hb.h / 2 + 10} textAnchor="middle"
                  fill={color} fontSize="10" fontFamily="monospace">{fmtM(hb.node.topDownQuota)}</text>
              </g>
            );
          })}
        </svg>

        {/* Route detail panel when hometown selected */}
        {selectedHometown && selectedRoutes.length > 0 && (
          <div className="mt-3 p-4 rounded-lg border" style={{ borderColor: '#C6A052', background: 'rgba(198,160,82,0.04)' }}>
            <div className="text-[13px] font-bold font-mono mb-2" style={{ color: '#C6A052' }}>
              Route Detail — {htBlocks.find(b => b.node.id === selectedHometown)?.node.label ?? selectedHometown}
            </div>
            <div className="grid grid-cols-4 gap-2 text-[12px] font-mono">
              {selectedRoutes.map(r => (
                <div key={r.id} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--pl-card)' }}>
                  <span className="font-bold" style={{ color: 'var(--pl-text)' }}>{r.id}</span>
                  <span style={{ color: 'var(--pl-text-muted)' }}>{fmtM(r.rev)}/Q</span>
                  <span style={{ color: r.attain >= 1.0 ? '#22C55E' : r.attain >= 0.95 ? '#F59E0B' : '#F87171' }}>
                    {pct(r.attain)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </LightSectionCard>

      {/* ── 2-column: Gap Analysis + Heatmap/Seasonal ── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Section B — Top-Down vs Bottom-Up Reconciliation */}
        <LightSectionCard title="Top-Down vs Bottom-Up Gap Analysis">
          <div className="space-y-3">
            {hometownNodes.map((node) => {
              const gap = node.topDownQuota - node.bottomUpForecast;
              const gapPct = gap / node.topDownQuota;
              const gapColor = gapPct > 0.10 ? '#F87171' : gapPct > 0.05 ? '#F59E0B' : '#22C55E';
              const maxQuota = companyNode.topDownQuota;
              const isLaredo = node.id === 'lar';

              return (
                <div key={node.id}
                  className="pb-3"
                  style={{
                    borderLeft: isLaredo ? '3px dashed #C6A052' : undefined,
                    paddingLeft: isLaredo ? 12 : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{node.label}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{ color: gapColor, background: gapColor === '#F87171' ? 'rgba(248,113,113,0.1)' : gapColor === '#F59E0B' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)' }}
                      >
                        {gap >= 0 ? '+' : '-'}${(Math.abs(gap) / 1e6).toFixed(1)}M ({gap >= 0 ? '+' : '-'}{(Math.abs(gapPct) * 100).toFixed(1)}%)
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--pl-stripe)', color: 'var(--pl-text-muted)' }}>
                        Conf: {node.confidenceScore}
                      </span>
                    </div>
                  </div>
                  {/* Top-down bar */}
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[9px] font-mono w-8" style={{ color: 'var(--pl-text-faint)' }}>TD</span>
                    <div className="flex-1 h-[14px] rounded-sm" style={{ background: 'var(--pl-chart-bar-track)' }}>
                      <div className="h-full rounded-sm" style={{
                        width: `${(node.topDownQuota / maxQuota) * 100}%`,
                        background: '#C6A052',
                        opacity: 0.7,
                      }} />
                    </div>
                    <span className="text-[10px] font-mono w-14 text-right" style={{ color: '#C6A052' }}>{fmtM(node.topDownQuota)}</span>
                  </div>
                  {/* Bottom-up bar */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono w-8" style={{ color: 'var(--pl-text-faint)' }}>BU</span>
                    <div className="flex-1 h-[14px] rounded-sm" style={{ background: 'var(--pl-chart-bar-track)' }}>
                      <div className="h-full rounded-sm" style={{
                        width: `${(node.bottomUpForecast / maxQuota) * 100}%`,
                        background: '#3B82F6',
                        opacity: 0.7,
                      }} />
                    </div>
                    <span className="text-[10px] font-mono w-14 text-right" style={{ color: '#3B82F6' }}>{fmtM(node.bottomUpForecast)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Bar legend */}
          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
            <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm" style={{ background: '#C6A052', opacity: 0.7 }} />Top-Down</div>
            <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm" style={{ background: '#3B82F6', opacity: 0.7 }} />Bottom-Up</div>
          </div>
        </LightSectionCard>

        {/* Right column: Heatmap + Seasonal */}
        <div className="space-y-4">
          {/* Section C — Historical Attainment Heatmap */}
          <LightSectionCard title="Historical Attainment Heatmap (8 Quarters)">
            <svg viewBox={`0 0 500 260`} className="w-full">
              {/* Column labels */}
              {quarterLabels.map((q, ci) => (
                <text key={q} x={HM_LEFT + ci * (CELL_W + CELL_GAP) + CELL_W / 2} y={HM_TOP - 8}
                  textAnchor="middle" fill="var(--pl-text-muted)" fontSize="10" fontFamily="monospace">{q}</text>
              ))}

              {/* Row labels + cells */}
              {hometownOrder.map((htId, ri) => {
                const history = getAttainmentHistory(htId);
                return (
                  <g key={htId}>
                    <text x={HM_LEFT - 8} y={HM_TOP + ri * (CELL_H + CELL_GAP) + CELL_H / 2 + 4}
                      textAnchor="end" fill="var(--pl-text-muted)" fontSize="11" fontFamily="monospace">{hometownNames[htId]}</text>
                    {quarters.map((q, ci) => {
                      const cell = history.find(c => c.quarter === q);
                      const val = cell?.attainment ?? null;
                      const bg = heatColor(val);
                      const textCol = heatTextColor(val);
                      const cellX = HM_LEFT + ci * (CELL_W + CELL_GAP);
                      const cellY = HM_TOP + ri * (CELL_H + CELL_GAP);
                      return (
                        <g key={`${htId}-${q}`}>
                          <rect x={cellX} y={cellY} width={CELL_W} height={CELL_H} rx={3} fill={bg} />
                          <text x={cellX + CELL_W / 2} y={cellY + CELL_H / 2 + 4}
                            textAnchor="middle" fill={textCol} fontSize="10" fontFamily="monospace" fontWeight="600">
                            {val === null ? 'N/A' : `${Math.round(val * 100)}%`}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </LightSectionCard>

          {/* Section — Seasonal Weighting Area Chart */}
          <LightSectionCard title="Seasonal Revenue Weighting">
            <svg viewBox={`0 0 ${SC_W} ${SC_H}`} className="w-full">
              {/* Y-axis gridlines */}
              {[0.02, 0.04, 0.06, 0.08, 0.10, 0.12].map(v => (
                <g key={v}>
                  <line x1={SC_PAD.left} y1={scY(v)} x2={SC_W - SC_PAD.right} y2={scY(v)}
                    stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
                  <text x={SC_PAD.left - 6} y={scY(v) + 3} textAnchor="end"
                    fill="var(--pl-text-faint)" fontSize="9" fontFamily="monospace">{(v * 100).toFixed(0)}%</text>
                </g>
              ))}

              {/* Flat reference line */}
              <line x1={SC_PAD.left} y1={scY(flatRef)} x2={SC_W - SC_PAD.right} y2={scY(flatRef)}
                stroke="var(--pl-text-muted)" strokeWidth={1} strokeDasharray="6 3" />

              {/* Area fill */}
              <path d={seasonalArea} fill="#C6A052" fillOpacity={0.08} />

              {/* Line */}
              <path d={seasonalLine} fill="none" stroke="#C6A052" strokeWidth={2} />

              {/* Data points */}
              {SEASONAL_WEIGHTS.map((sw, i) => (
                <circle key={i} cx={scX(i)} cy={scY(sw.weight)} r={3} fill="#C6A052" />
              ))}

              {/* X-axis month labels */}
              {SEASONAL_WEIGHTS.map((sw, i) => (
                <text key={i} x={scX(i)} y={SC_H - 8} textAnchor="middle"
                  fill="var(--pl-text-muted)" fontSize="9" fontFamily="monospace">{sw.month}</text>
              ))}

              {/* Peak label */}
              <text x={scX(peakIdx)} y={scY(SEASONAL_WEIGHTS[peakIdx].weight) - 10} textAnchor="middle"
                fill="#C6A052" fontSize="10" fontFamily="monospace" fontWeight="700">
                {SEASONAL_WEIGHTS[peakIdx].month}: {(SEASONAL_WEIGHTS[peakIdx].weight * 100).toFixed(1)}%
              </text>

              {/* Trough label */}
              <text x={scX(troughIdx)} y={scY(SEASONAL_WEIGHTS[troughIdx].weight) + 16} textAnchor="middle"
                fill="var(--pl-text-muted)" fontSize="10" fontFamily="monospace" fontWeight="700">
                {SEASONAL_WEIGHTS[troughIdx].month}: {(SEASONAL_WEIGHTS[troughIdx].weight * 100).toFixed(1)}%
              </text>
            </svg>
          </LightSectionCard>
        </div>
      </div>

      {/* ── Section D — Quota Fairness Gauges ────────── */}
      <LightSectionCard title="Quota Fairness Index" className="mb-6">
        <div className="grid grid-cols-6 gap-3">
          {FAIRNESS_SCORES.map(fs => {
            const lowestFactor = Object.entries(fs.factors).sort(([, a], [, b]) => a - b)[0];
            return (
              <GaugeDial
                key={fs.hometownId}
                score={fs.score}
                label={fs.hometownName}
                subLabel={`${lowestFactor[0]}: ${lowestFactor[1]}`}
              />
            );
          })}
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Quota cascade: $44.8M company target allocated by region weight and hometown revenue share. Fairness index weights capacity, growth, competition, mix, and tenure factors.
      </div>
    </>
  );
}
