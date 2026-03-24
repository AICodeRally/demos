'use client';

import { useState } from 'react';
import {
  TERRITORIES,
  TERRITORY_METRICS,
  getTerritoryMetrics,
} from '@/data/ridgeline';
import {
  REGIONS,
  DIVISIONS,
  COMPANY,
} from '@/data/ridgeline';
import { BRANCHES, getBranchesByRegion } from '@/data/ridgeline';
import { fmtM } from '@/lib/utils';

/* -- SVG US Region Coordinates -------------------------------- */
// Simplified polygon regions for Ridgeline's 4 active regions + Summit

const REGION_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  'south-central': {
    path: 'M 160 310 L 260 290 L 320 310 L 340 380 L 300 420 L 200 430 L 140 400 Z',
    labelX: 230, labelY: 360,
  },
  southeast: {
    path: 'M 340 310 L 440 280 L 500 310 L 510 390 L 460 420 L 340 400 Z',
    labelX: 420, labelY: 360,
  },
  west: {
    path: 'M 30 140 L 130 100 L 150 200 L 140 320 L 80 340 L 20 280 Z',
    labelX: 85, labelY: 220,
  },
  'summit-east': {
    path: 'M 440 140 L 540 120 L 570 200 L 550 280 L 480 290 L 430 240 Z',
    labelX: 495, labelY: 210,
  },
  northeast: {
    path: 'M 380 100 L 440 80 L 480 100 L 480 160 L 440 180 L 380 160 Z',
    labelX: 430, labelY: 135,
  },
  midwest: {
    path: 'M 240 120 L 340 100 L 380 140 L 370 220 L 320 250 L 240 230 L 220 170 Z',
    labelX: 300, labelY: 175,
  },
  mountain: {
    path: 'M 100 80 L 200 60 L 240 120 L 220 200 L 150 220 L 90 180 Z',
    labelX: 165, labelY: 145,
  },
  'summit-central': {
    path: 'M 340 180 L 430 170 L 440 240 L 420 280 L 340 290 L 320 250 Z',
    labelX: 380, labelY: 230,
  },
  'summit-south': {
    path: 'M 340 300 L 420 280 L 460 320 L 470 400 L 400 430 L 340 410 Z',
    labelX: 400, labelY: 360,
  },
  'summit-west': {
    path: 'M 140 280 L 240 260 L 260 310 L 240 380 L 180 400 L 130 360 Z',
    labelX: 195, labelY: 330,
  },
};

// Branch dot positions (approximate within region polygons)
const BRANCH_DOTS: Record<string, { x: number; y: number; name: string; revenue: number }[]> = {
  'south-central': [
    { x: 200, y: 335, name: 'Denver HQ', revenue: 18.4 },
    { x: 220, y: 350, name: 'Dallas North', revenue: 22.1 },
    { x: 190, y: 360, name: 'Fort Worth', revenue: 15.8 },
    { x: 240, y: 370, name: 'Austin', revenue: 19.7 },
    { x: 260, y: 390, name: 'Houston West', revenue: 24.3 },
    { x: 225, y: 400, name: 'San Antonio', revenue: 16.9 },
    { x: 175, y: 340, name: 'OKC', revenue: 13.2 },
    { x: 180, y: 380, name: 'Tulsa', revenue: 11.8 },
  ],
  southeast: [
    { x: 400, y: 330, name: 'Atlanta', revenue: 21.4 },
    { x: 430, y: 370, name: 'Orlando', revenue: 25.6 },
    { x: 410, y: 390, name: 'Tampa', revenue: 20.8 },
    { x: 460, y: 340, name: 'Charlotte', revenue: 17.6 },
  ],
  west: [
    { x: 60, y: 260, name: 'Phoenix', revenue: 23.8 },
    { x: 45, y: 200, name: 'LA', revenue: 28.9 },
    { x: 90, y: 180, name: 'Denver', revenue: 19.1 },
  ],
  'summit-east': [
    { x: 500, y: 190, name: 'Philly', revenue: 14.2 },
    { x: 520, y: 220, name: 'NoVA', revenue: 16.8 },
    { x: 530, y: 170, name: 'Long Island', revenue: 15.5 },
  ],
};

const activeTerritories = TERRITORIES.filter((t) => t.status === 'active');

export default function TerritoryMapPage() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  const selectedRegion = activeRegion ? REGIONS.find((r) => r.id === activeRegion) : null;
  const selectedDiv = selectedRegion ? DIVISIONS.find((d) => d.id === selectedRegion.divisionId) : null;
  const regionBranches = activeRegion ? getBranchesByRegion(activeRegion) : [];
  const regionTerritory = activeRegion
    ? activeTerritories.find((t) => t.regionId === activeRegion && (t.managerRole === 'RVP' || t.managerRole === 'SVP'))
    : null;
  const regionMetrics = regionTerritory ? getTerritoryMetrics(regionTerritory.id, 'Q1-2026')[0] : null;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-6 mt-6 mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
            Act 2 &middot; Territory &amp; Branch Ops
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Territory Command Map
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {COMPANY.totalBranches} branches &middot; {COMPANY.totalStates} states &middot; {REGIONS.length} regions &middot; Click a region to drill in
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes regionPulse {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.25; }
        }
        @keyframes branchPing {
          0% { r: 3; opacity: 0.9; }
          100% { r: 10; opacity: 0; }
        }
        @keyframes branchGlow {
          0%, 100% { filter: drop-shadow(0 0 2px var(--glow-color)); }
          50% { filter: drop-shadow(0 0 6px var(--glow-color)); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .region-hover:hover { opacity: 0.35 !important; cursor: pointer; }
        .detail-panel { animation: slideIn 0.3s ease-out; }
      `}</style>

      {/* Map + Detail Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* SVG Map — 3 cols */}
        <div
          className="lg:col-span-3 rounded-2xl border p-2 relative overflow-hidden"
          style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}
        >
          <svg viewBox="0 0 600 480" className="w-full" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glowStrong">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background texture */}
            <rect width="600" height="480" rx="12" fill="var(--rl-card)" />
            <rect width="600" height="480" rx="12" fill="url(#mapGrid)" opacity="0.03" />
            <defs>
              <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--rl-text)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Title */}
            <text x="300" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--rl-text-muted)" letterSpacing="3">
              RIDGELINE SUPPLY CO. — NATIONAL FOOTPRINT
            </text>

            {/* Region polygons */}
            {REGIONS.map((region) => {
              const geo = REGION_PATHS[region.id];
              if (!geo) return null;
              const isActive = activeRegion === region.id;
              const isSummit = region.divisionId === 'summit';
              return (
                <g key={region.id} onClick={() => setActiveRegion(isActive ? null : region.id)}>
                  {/* Fill */}
                  <path
                    d={geo.path}
                    fill={region.color}
                    className="region-hover"
                    style={{
                      opacity: isActive ? 0.35 : 0.15,
                      transition: 'opacity 0.3s ease',
                      cursor: 'pointer',
                      ...(isActive ? { animation: 'regionPulse 2s ease-in-out infinite' } : {}),
                    }}
                    filter={isActive ? 'url(#glowStrong)' : undefined}
                  />
                  {/* Border */}
                  <path
                    d={geo.path}
                    fill="none"
                    stroke={region.color}
                    strokeWidth={isActive ? 2.5 : 1.2}
                    strokeDasharray={isSummit ? '6 3' : 'none'}
                    style={{
                      opacity: isActive ? 0.9 : 0.4,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                  />
                  {/* Region label */}
                  <text
                    x={geo.labelX}
                    y={geo.labelY - 10}
                    textAnchor="middle"
                    fontSize={isActive ? '11' : '9'}
                    fontWeight="700"
                    fill={region.color}
                    style={{
                      opacity: isActive ? 1 : 0.6,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      pointerEvents: 'none',
                    }}
                  >
                    {region.name.toUpperCase()}
                  </text>
                  <text
                    x={geo.labelX}
                    y={geo.labelY + 4}
                    textAnchor="middle"
                    fontSize="8"
                    fill="var(--rl-text-muted)"
                    style={{ opacity: isActive ? 0.9 : 0.5, pointerEvents: 'none' }}
                  >
                    {region.branchCount} branches &bull; {region.states.join(', ')}
                  </text>
                </g>
              );
            })}

            {/* Branch dots (only for regions that have dot data) */}
            {Object.entries(BRANCH_DOTS).map(([regionId, dots]) =>
              dots.map((dot, i) => {
                const region = REGIONS.find((r) => r.id === regionId);
                const isRegionActive = activeRegion === regionId;
                const isBranchHovered = hoveredBranch === `${regionId}-${i}`;
                return (
                  <g
                    key={`${regionId}-${i}`}
                    onMouseEnter={() => setHoveredBranch(`${regionId}-${i}`)}
                    onMouseLeave={() => setHoveredBranch(null)}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveRegion(regionId)}
                  >
                    {/* Ping animation ring */}
                    {(isRegionActive || isBranchHovered) && (
                      <circle
                        cx={dot.x} cy={dot.y} r="3"
                        fill="none"
                        stroke={region?.color ?? '#fff'}
                        strokeWidth="1.5"
                        opacity="0.6"
                        style={{ animation: 'branchPing 1.5s ease-out infinite' }}
                      />
                    )}
                    {/* Dot */}
                    <circle
                      cx={dot.x} cy={dot.y}
                      r={isBranchHovered ? 5 : isRegionActive ? 4 : 3}
                      fill={region?.color ?? '#94A3B8'}
                      stroke="white"
                      strokeWidth={isBranchHovered ? 2 : 1}
                      style={{
                        filter: isBranchHovered ? `drop-shadow(0 0 6px ${region?.color})` : undefined,
                        transition: 'r 0.2s ease',
                      }}
                    />
                    {/* Label on hover */}
                    {isBranchHovered && (
                      <>
                        <rect
                          x={dot.x - 40} y={dot.y - 28}
                          width="80" height="20" rx="4"
                          fill="var(--rl-text)"
                          opacity="0.9"
                        />
                        <text
                          x={dot.x} y={dot.y - 15}
                          textAnchor="middle"
                          fontSize="9" fontWeight="700"
                          fill="var(--rl-card)"
                        >
                          {dot.name} &bull; ${dot.revenue}M
                        </text>
                      </>
                    )}
                  </g>
                );
              })
            )}

            {/* Division legend */}
            <g transform="translate(20, 440)">
              <rect x="-5" y="-12" width="200" height="42" rx="6" fill="var(--rl-stripe)" opacity="0.6" />
              <circle cx="8" cy="0" r="4" fill="#1E3A5F" />
              <text x="18" y="3" fontSize="9" fill="var(--rl-text-muted)">Ridgeline Core — {DIVISIONS[0].branchCount} branches</text>
              <circle cx="8" cy="18" r="4" fill="#7C3AED" />
              <line x1="4" y1="18" x2="12" y2="18" stroke="#7C3AED" strokeWidth="2" strokeDasharray="2 1" />
              <text x="18" y="21" fontSize="9" fill="var(--rl-text-muted)">Summit — {DIVISIONS[1].branchCount} branches (dashed = integrating)</text>
            </g>

            {/* Scale indicator */}
            <text x="580" y="470" textAnchor="end" fontSize="7" fill="var(--rl-text-muted)" opacity="0.4">
              Q1 2026 &bull; Effective-dated
            </text>
          </svg>
        </div>

        {/* Detail Panel — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {activeRegion && selectedRegion ? (
            <div className="detail-panel space-y-4">
              {/* Region Header Card */}
              <div
                className="rounded-2xl border p-5 relative overflow-hidden"
                style={{
                  background: 'var(--rl-card)',
                  borderColor: 'var(--rl-border)',
                  borderTop: `4px solid ${selectedRegion.color}`,
                  boxShadow: `0 4px 24px ${selectedRegion.color}20`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full"
                  style={{ background: selectedRegion.color, opacity: 0.04, transform: 'translate(30%, -30%)' }}
                />
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: selectedRegion.color }}
                  >
                    {selectedRegion.branchCount}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-extrabold" style={{ color: 'var(--rl-text)' }}>{selectedRegion.name}</h3>
                    <p className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>
                      {selectedDiv?.shortName} &middot; {selectedRegion.states.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                {regionMetrics && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Q1 Revenue', value: `$${fmtM(regionMetrics.revenue)}`, color: 'var(--rl-text)' },
                      { label: 'Attainment', value: `${regionMetrics.attainment}%`, color: regionMetrics.attainment >= 100 ? '#10B981' : '#EF4444' },
                      { label: 'Margin', value: `${regionMetrics.margin}%`, color: '#2563EB' },
                      { label: 'Net Accounts', value: `+${regionMetrics.newAccountsWon - regionMetrics.accountsLost}`, color: '#10B981' },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg p-3" style={{ background: 'var(--rl-stripe)' }}>
                        <div className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--rl-text-muted)' }}>{m.label}</div>
                        <div className="text-[18px] font-extrabold tabular-nums" style={{ color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Branch Leaderboard */}
              <div
                className="rounded-2xl border p-5"
                style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}
              >
                <h4 className="text-[10px] uppercase tracking-[2px] font-bold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
                  Branch EBITDA vs Plan
                </h4>
                <div className="space-y-3">
                  {regionBranches.sort((a, b) => (b.ebitda / b.ebitdaPlan) - (a.ebitda / a.ebitdaPlan)).map((b) => {
                    const pct = (b.ebitda / b.ebitdaPlan) * 100;
                    const isAbove = pct >= 100;
                    const barWidth = Math.min(pct, 130);
                    return (
                      <div key={b.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-semibold" style={{ color: 'var(--rl-text)' }}>{b.shortName}</span>
                          <span className="text-[12px] font-bold tabular-nums" style={{ color: isAbove ? '#10B981' : '#EF4444' }}>
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="relative h-5 rounded-full overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                          {/* 100% marker */}
                          <div
                            className="absolute top-0 bottom-0 w-px"
                            style={{ left: `${(100 / 130) * 100}%`, background: 'var(--rl-text-muted)', opacity: 0.3 }}
                          />
                          {/* Bar */}
                          <div
                            className="absolute top-0 bottom-0 left-0 rounded-full"
                            style={{
                              width: `${(barWidth / 130) * 100}%`,
                              background: isAbove
                                ? `linear-gradient(90deg, ${selectedRegion.color}, #10B981)`
                                : `linear-gradient(90deg, ${selectedRegion.color}, #EF4444)`,
                              transition: 'width 0.6s ease-out',
                              boxShadow: isAbove ? '0 0 8px rgba(16,185,129,0.3)' : undefined,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Territory Assignment */}
              {regionTerritory && (
                <div
                  className="rounded-xl border p-4 text-[11px]"
                  style={{ background: 'rgba(37,99,235,0.04)', borderColor: 'var(--rl-border)' }}
                >
                  <div className="font-bold mb-1" style={{ color: 'var(--rl-text)' }}>Territory Assignment</div>
                  <div style={{ color: 'var(--rl-text-muted)' }}>
                    {regionTerritory.name} &middot; {regionTerritory.managerRole} &middot; {regionTerritory.branchIds.length} branches
                  </div>
                  <div className="mt-1" style={{ color: 'var(--rl-text-muted)' }}>
                    Effective: {regionTerritory.effectiveStart} &mdash; {regionTerritory.effectiveEnd ?? 'Present'}
                  </div>
                  <div className="mt-1 font-semibold" style={{ color: '#2563EB' }}>
                    Quota: ${fmtM(regionTerritory.annualQuota)} &middot; YTD: ${fmtM(regionTerritory.ytdActual)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty state when no region selected */
            <div
              className="rounded-2xl border p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
              style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(37,99,235,0.08)' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
                </svg>
              </div>
              <h3 className="text-[16px] font-bold mb-2" style={{ color: 'var(--rl-text)' }}>Select a Region</h3>
              <p className="text-[12px] leading-relaxed max-w-[240px]" style={{ color: 'var(--rl-text-muted)' }}>
                Click any region on the map to see branch performance, EBITDA vs Plan bars, territory assignments, and Q1 metrics.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-[280px]">
                {DIVISIONS.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-lg p-3 text-center"
                    style={{ background: `${d.color}08`, border: `1px solid ${d.color}20` }}
                  >
                    <div className="text-[18px] font-extrabold" style={{ color: d.color }}>{d.branchCount}</div>
                    <div className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--rl-text-muted)' }}>{d.shortName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Region Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {REGIONS.filter((r) => REGION_PATHS[r.id]).map((region) => {
          const territory = activeTerritories.find((t) => t.regionId === region.id && (t.managerRole === 'RVP' || t.managerRole === 'SVP'));
          const metrics = territory ? getTerritoryMetrics(territory.id, 'Q1-2026')[0] : null;
          const isActive = activeRegion === region.id;
          return (
            <button
              key={region.id}
              onClick={() => setActiveRegion(isActive ? null : region.id)}
              className="rounded-xl border p-3 text-left transition-all"
              style={{
                background: isActive ? `${region.color}10` : 'var(--rl-card)',
                borderColor: isActive ? region.color : 'var(--rl-border)',
                boxShadow: isActive ? `0 0 12px ${region.color}20` : 'var(--rl-shadow)',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: region.color }} />
                <span className="text-[11px] font-bold truncate" style={{ color: 'var(--rl-text)' }}>
                  {region.name}
                </span>
              </div>
              <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                {region.branchCount} branches
              </div>
              {metrics && (
                <div className="text-[11px] font-bold mt-1" style={{ color: metrics.attainment >= 100 ? '#10B981' : '#F59E0B' }}>
                  {metrics.attainment}%
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Architecture Note */}
      <div className="rounded-lg px-6 py-4" style={{ background: 'rgba(37,99,235,0.05)', borderLeft: '3px solid #2563EB' }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--rl-text-secondary)' }}>
          <strong>Territory Architecture:</strong> Ridgeline operates a dual-division structure (Ridgeline Core + Summit) with {REGIONS.length} regions
          across {COMPANY.totalStates} states. Post-acquisition integration uses effective-dated territory assignments
          to prevent retro-rate errors during consolidation. Summit regions (dashed borders) are progressively merging
          into the unified reporting structure.
        </p>
      </div>
    </>
  );
}
