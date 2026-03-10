'use client';

import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  COMPETITORS,
  COMPETITOR_SIGHTINGS,
  MARKET_SHARE_DFW,
  MARKET_SHARE_SOUTH_TX,
  PIPELINE_ACCOUNTS,
  getHighThreatSightings,
  getTotalPipelineRevenue,
} from '@/data/proofline';
import { fmt, fmtK, pct } from '@/lib/utils';
import { useState } from 'react';

/* ── Sighting type config ────────────────────── */
const SIGHTING_COLORS: Record<string, string> = {
  delivery: '#F87171',
  display: '#F59E0B',
  pricing: '#A855F7',
  'new-placement': '#2563EB',
  sampling: '#22C55E',
  promo: '#EC4899',
};
const SIGHTING_LABELS: Record<string, string> = {
  delivery: 'Delivery',
  display: 'Display',
  pricing: 'Pricing',
  'new-placement': 'New Placement',
  sampling: 'Sampling',
  promo: 'Promotion',
};

/* ── Threat badge ────────────────────────────── */
function ThreatBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const cfg = {
    high: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'HIGH' },
    medium: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'MED' },
    low: { bg: 'rgba(160,174,192,0.1)', color: 'var(--pl-text-faint)', label: 'LOW' },
  }[level];
  return (
    <>
    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
    </>
  );
}

/* ── Permit status badge ─────────────────────── */
function PermitBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    filed: { bg: 'rgba(160,174,192,0.1)', color: 'var(--pl-text-faint)', label: 'FILED' },
    approved: { bg: 'rgba(37,99,235,0.1)', color: '#2563EB', label: 'APPROVED' },
    inspection: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'INSPECTION' },
    ready: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'READY' },
  };
  const c = cfg[status] ?? cfg.filed;
  return (
    <>
    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
    </>
  );
}

/* ── Competitor Sightings Map (SVG) ──────────── */
function SightingsMap() {
  // Simplified DFW + South TX map with sighting markers
  // Map bounds: lat 27.0-33.5, lng -100.5 to -96.0
  const mapW = 700, mapH = 340;
  const latMin = 27.0, latMax = 33.5, lngMin = -100.5, lngMax = -96.0;

  const toX = (lng: number) => ((lng - lngMin) / (lngMax - lngMin)) * mapW;
  const toY = (lat: number) => mapH - ((lat - latMin) / (latMax - latMin)) * mapH;

  // City reference points
  const cities = [
    { name: 'Dallas', lat: 32.78, lng: -96.80 },
    { name: 'Fort Worth', lat: 32.75, lng: -97.33 },
    { name: 'Laredo', lat: 27.50, lng: -99.51 },
    { name: 'Allen', lat: 33.10, lng: -96.67 },
    { name: 'Corpus Christi', lat: 27.80, lng: -97.40 },
  ];

  return (
    <>
    <svg viewBox={`0 0 ${mapW} ${mapH}`} className="w-full" style={{ height: 340 }}>
      {/* Background */}
      <rect width={mapW} height={mapH} fill="var(--pl-card-alt)" rx="8" />

      {/* Grid lines */}
      {[28, 29, 30, 31, 32, 33].map(lat => (
        <line key={lat} x1={0} y1={toY(lat)} x2={mapW} y2={toY(lat)} stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
      ))}
      {[-100, -99, -98, -97].map(lng => (
        <line key={lng} x1={toX(lng)} y1={0} x2={toX(lng)} y2={mapH} stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
      ))}

      {/* City markers */}
      {cities.map(c => (
        <g key={c.name}>
          <circle cx={toX(c.lng)} cy={toY(c.lat)} r={3} fill="#CBD5E0" />
          <text x={toX(c.lng) + 6} y={toY(c.lat) + 3} fontSize="9" fill="var(--pl-text-faint)" fontFamily="monospace">
            {c.name}
          </text>
        </g>
      ))}

      {/* Andrews territory zones */}
      <circle cx={toX(-96.80)} cy={toY(32.78)} r={60} fill="rgba(37,99,235,0.04)" stroke="rgba(37,99,235,0.15)" strokeWidth="1" strokeDasharray="4 2" />
      <circle cx={toX(-97.33)} cy={toY(32.75)} r={40} fill="rgba(37,99,235,0.04)" stroke="rgba(37,99,235,0.15)" strokeWidth="1" strokeDasharray="4 2" />
      <circle cx={toX(-99.51)} cy={toY(27.50)} r={30} fill="rgba(37,99,235,0.04)" stroke="rgba(37,99,235,0.15)" strokeWidth="1" strokeDasharray="4 2" />

      {/* Sighting markers with pulse animation */}
      {COMPETITOR_SIGHTINGS.map((s, i) => {
        const cx = toX(s.lng);
        const cy = toY(s.lat);
        const color = SIGHTING_COLORS[s.type] ?? 'var(--pl-text-muted)';
        return (
          <g key={s.id}>
            {/* Pulse ring for high threat */}
            {s.threatLevel === 'high' && (
              <circle cx={cx} cy={cy} r={12} fill="none" stroke={color} strokeWidth="1" opacity="0.4">
                <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Main marker */}
            <circle cx={cx} cy={cy} r={s.threatLevel === 'high' ? 7 : 5} fill={color} opacity="0.85" />
            <circle cx={cx} cy={cy} r={2} fill="white" />
            {/* Label */}
            <text
              x={cx + (i % 2 === 0 ? 10 : -10)}
              y={cy - 8}
              fontSize="8"
              fill={color}
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor={i % 2 === 0 ? 'start' : 'end'}
            >
              {s.competitorName.split(' ').slice(0, 2).join(' ')}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${mapW - 160}, 12)`}>
        <rect width={150} height={78} fill="var(--pl-card)" stroke="var(--pl-border)" strokeWidth="0.5" rx="4" opacity="0.95" />
        <text x={8} y={16} fontSize="8" fontWeight="bold" fill="var(--pl-text)" fontFamily="monospace">SIGHTING TYPES</text>
        {Object.entries(SIGHTING_COLORS).slice(0, 5).map(([type, color], i) => (
          <g key={type} transform={`translate(8, ${24 + i * 11})`}>
            <circle cx={4} cy={0} r={3} fill={color} />
            <text x={12} y={3} fontSize="7" fill="var(--pl-text-muted)" fontFamily="monospace">
              {SIGHTING_LABELS[type]}
            </text>
          </g>
        ))}
      </g>
    </svg>
    </>
  );
}

/* ── Market Share Chart (SVG stacked bars) ────── */
function MarketShareChart({ data, region }: { data: typeof MARKET_SHARE_DFW; region: string }) {
  const barH = 24, gap = 8, labelW = 100, chartW = 400;
  const totalH = data.length * (barH + gap);

  return (
    <>
    <div>
      <div className="text-[11px] font-bold font-mono mb-2" style={{ color: 'var(--pl-text)' }}>{region}</div>
      <svg viewBox={`0 0 ${labelW + chartW + 80} ${totalH}`} className="w-full" style={{ height: totalH }}>
        {data.map((seg, i) => {
          const y = i * (barH + gap);
          const shares = [
            { label: 'Andrews', value: seg.andrewsShare, color: '#2563EB' },
            { label: 'BEK', value: seg.benEKeithShare, color: '#F87171' },
            { label: 'SE', value: seg.silverEagleShare, color: '#F59E0B' },
            { label: 'Other', value: seg.otherShare, color: '#CBD5E0' },
          ].filter(s => s.value > 0);

          let xOff = labelW;
          const trendColor = seg.trend === 'gaining' ? '#22C55E' : seg.trend === 'losing' ? '#F87171' : 'var(--pl-text-faint)';
          const trendArrow = seg.trend === 'gaining' ? '\u2191' : seg.trend === 'losing' ? '\u2193' : '\u2192';

          return (
            <g key={seg.category}>
              {/* Category label */}
              <text x={0} y={y + barH / 2 + 4} fontSize="10" fill="var(--pl-text)" fontFamily="monospace" fontWeight="bold">
                {seg.category}
              </text>

              {/* Stacked bar */}
              {shares.map(s => {
                const w = s.value * chartW;
                const x = xOff;
                xOff += w;
                return (
                  <g key={s.label}>
                    <rect x={x} y={y} width={w} height={barH} fill={s.color} rx={2} opacity="0.85" />
                    {w > 30 && (
                      <text x={x + w / 2} y={y + barH / 2 + 4} fontSize="8" fill="white" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                        {(s.value * 100).toFixed(0)}%
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Trend indicator */}
              <text x={labelW + chartW + 8} y={y + barH / 2 + 4} fontSize="11" fill={trendColor} fontFamily="monospace" fontWeight="bold">
                {trendArrow}
              </text>
              <text x={labelW + chartW + 22} y={y + barH / 2 + 3} fontSize="8" fill={trendColor} fontFamily="monospace">
                {seg.trend.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
    </>
  );
}

export default function FieldIntelPage() {
  const [activeTab, setActiveTab] = useState<'sightings' | 'market' | 'pipeline'>('sightings');

  const highThreats = getHighThreatSightings();
  const pipelineRevenue = getTotalPipelineRevenue();
  const pipelineCases = PIPELINE_ACCOUNTS.reduce((s, p) => s + p.estimatedWeeklyCases * 52, 0);
  const avgAndrewsShareDFW = MARKET_SHARE_DFW.reduce((s, m) => s + m.andrewsShare, 0) / MARKET_SHARE_DFW.length;
  const gainingCategories = [...MARKET_SHARE_DFW, ...MARKET_SHARE_SOUTH_TX].filter(m => m.trend === 'gaining').length;

  const tabs = [
    { id: 'sightings' as const, label: 'Competitor Sightings' },
    { id: 'market' as const, label: 'Market Share' },
    { id: 'pipeline' as const, label: 'New Account Pipeline' },
  ];

  return (
    <>

      <ActNavigation currentAct={3} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Field Intelligence &middot; Competitive Ops
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Field Intelligence Center
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {COMPETITOR_SIGHTINGS.length} sightings &middot; {COMPETITORS.length} tracked competitors &middot; {PIPELINE_ACCOUNTS.length} pipeline accounts
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Active Sightings" value={String(COMPETITOR_SIGHTINGS.length)} accent="#F87171" sub={`${highThreats.length} high threat`} />
        <LightKpiCard label="DFW Avg Share" value={pct(avgAndrewsShareDFW)} accent="#2563EB" sub="Andrews position" />
        <LightKpiCard label="Gaining Categories" value={`${gainingCategories}/10`} accent="#22C55E" sub="Across both markets" />
        <LightKpiCard label="Pipeline Revenue" value={`$${(pipelineRevenue / 1e6).toFixed(1)}M`} accent="#F59E0B" sub={`${fmt(pipelineCases)} cases/yr`} />
        <LightKpiCard label="Tracked Competitors" value={String(COMPETITORS.length)} accent="#A855F7" sub="Active monitoring" />
      </div>

      {/* Upcoming Market Events */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.03)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
              HIGH IMPACT
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>June 14 – July 13, 2026</span>
          </div>
          <h4 className="text-[14px] font-bold mb-1" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
            FIFA World Cup — AT&amp;T Stadium
          </h4>
          <p className="text-[11px] mb-2" style={{ color: 'var(--pl-text-muted)' }}>
            9 matches in Arlington. Estimated +35% volume surge in DFW metro across all beer categories.
            Corona, Modelo, and Heineken projected highest lift. Pre-positioning starts W18.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span style={{ color: '#22C55E' }}>+35% projected volume</span>
            <span style={{ color: '#F59E0B' }}>9 match days</span>
            <span style={{ color: '#2563EB' }}>All DFW routes affected</span>
          </div>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: 'rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.03)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(168,85,247,0.1)', color: '#A855F7' }}>
              MAJOR EVENT
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>October 2026</span>
          </div>
          <h4 className="text-[14px] font-bold mb-1" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
            F1 Grand Prix — Arlington
          </h4>
          <p className="text-[11px] mb-2" style={{ color: 'var(--pl-text-muted)' }}>
            Premium spirits and import beer surge expected. Texas Live (#1 Miller Lite draft account nationally)
            projects 3x normal volume. VIP hospitality packages drive ultra-premium mix.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span style={{ color: '#22C55E' }}>+25% premium imports</span>
            <span style={{ color: '#A855F7' }}>Spirits 2x uplift</span>
            <span style={{ color: '#2563EB' }}>Texas Live focal point</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-lg text-[12px] font-mono font-bold transition-colors"
            style={{
              background: activeTab === t.id ? '#2563EB' : 'var(--pl-chart-bar-track)',
              color: activeTab === t.id ? 'white' : 'var(--pl-text-muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Sightings Tab ────────────────────────── */}
      {activeTab === 'sightings' && (
        <>
          {/* Sightings Map */}
          <LightSectionCard title="Competitor Activity Map" className="mb-4">
            <SightingsMap />
          </LightSectionCard>

          {/* Sightings Feed */}
          <LightSectionCard title="Recent Sightings" className="mb-4">
            <div className="space-y-3">
              {COMPETITOR_SIGHTINGS.map(s => (
                <div
                  key={s.id}
                  className="rounded-lg border p-4"
                  style={{ borderColor: s.threatLevel === 'high' ? 'rgba(248,113,113,0.3)' : 'var(--pl-border)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ThreatBadge level={s.threatLevel} />
                      <span
                        className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{ background: `${SIGHTING_COLORS[s.type]}15`, color: SIGHTING_COLORS[s.type] }}
                      >
                        {SIGHTING_LABELS[s.type]}
                      </span>
                      <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{s.competitorName}</span>
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{s.date} {s.time}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{s.accountName}</span>
                    <span className="text-[10px]" style={{ color: 'var(--pl-text-faint)' }}>{s.location}</span>
                  </div>

                  <p className="text-[11px] mb-2" style={{ color: 'var(--pl-text-secondary)' }}>{s.description}</p>

                  {s.brandsSighted.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {s.brandsSighted.map(b => (
                        <span key={b} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--pl-chart-bar-track)', color: 'var(--pl-text-muted)' }}>
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {s.actionTaken && (
                    <div className="rounded-md px-3 py-2 mt-2" style={{ background: 'rgba(37,99,235,0.04)', borderLeft: '3px solid #2563EB' }}>
                      <div className="text-[9px] font-bold font-mono mb-0.5" style={{ color: '#2563EB' }}>ACTION TAKEN</div>
                      <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>{s.actionTaken}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* Competitor Profiles */}
          <LightSectionCard title="Competitor Profiles" className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              {COMPETITORS.map(c => (
                <div key={c.id} className="rounded-lg border p-4" style={{ borderColor: 'var(--pl-border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{c.name}</h4>
                    <ThreatBadge level={c.threat} />
                  </div>
                  <div className="text-[10px] font-mono mb-2" style={{ color: 'var(--pl-text-muted)' }}>
                    {c.type.toUpperCase()} &middot; {c.territory} &middot; ~{(c.estimatedShare * 100).toFixed(0)}% TX share
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="text-[9px] font-bold font-mono mb-1" style={{ color: '#22C55E' }}>STRENGTHS</div>
                      {c.strengths.slice(0, 3).map((s, i) => (
                        <div key={i} className="text-[10px] mb-0.5" style={{ color: 'var(--pl-text-secondary)' }}>+ {s}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[9px] font-bold font-mono mb-1" style={{ color: '#F87171' }}>WEAKNESSES</div>
                      {c.weaknesses.slice(0, 3).map((w, i) => (
                        <div key={i} className="text-[10px] mb-0.5" style={{ color: 'var(--pl-text-secondary)' }}>- {w}</div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {c.keyBrands.map(b => (
                      <span key={b} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--pl-chart-bar-track)', color: 'var(--pl-text-muted)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ─── Market Share Tab ─────────────────────── */}
      {activeTab === 'market' && (
        <>
          {/* Share legend */}
          <div className="flex gap-4 mb-4">
            {[
              { label: 'Andrews', color: '#2563EB' },
              { label: 'Ben E. Keith', color: '#F87171' },
              { label: 'Silver Eagle', color: '#F59E0B' },
              { label: 'Other', color: '#CBD5E0' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: l.color }} />
                <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          <LightSectionCard title="Market Share by Category" className="mb-4">
            <div className="space-y-6">
              <MarketShareChart data={MARKET_SHARE_DFW} region="DFW Metro (Dallas / Fort Worth / Allen)" />
              <div className="border-t" style={{ borderColor: 'var(--pl-border)' }} />
              <MarketShareChart data={MARKET_SHARE_SOUTH_TX} region="South Texas (Laredo / Corpus Christi / McAllen)" />
            </div>
          </LightSectionCard>

          {/* Category deep-dive table */}
          <LightSectionCard title="Category Intelligence Notes" className="mb-6">
            <div className="space-y-2">
              {[...MARKET_SHARE_DFW, ...MARKET_SHARE_SOUTH_TX].map((seg, i) => {
                const region = i < MARKET_SHARE_DFW.length ? 'DFW' : 'STX';
                const trendColor = seg.trend === 'gaining' ? '#22C55E' : seg.trend === 'losing' ? '#F87171' : 'var(--pl-text-faint)';
                return (
                  <div key={`${region}-${seg.category}`} className="flex items-start gap-3 px-3 py-2 rounded-lg" style={{ background: 'var(--pl-card-alt)' }}>
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ background: trendColor + '15', color: trendColor }}>
                      {seg.trend.toUpperCase()}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold" style={{ color: 'var(--pl-text)' }}>{seg.category}</span>
                      <span className="text-[10px] font-mono ml-2" style={{ color: 'var(--pl-text-faint)' }}>{region}</span>
                      <span className="text-[10px] font-bold font-mono ml-2" style={{ color: '#2563EB' }}>{(seg.andrewsShare * 100).toFixed(0)}% Andrews</span>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>{seg.notes}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ─── Pipeline Tab ─────────────────────────── */}
      {activeTab === 'pipeline' && (
        <>
          {/* Pipeline summary */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {(['filed', 'approved', 'inspection', 'ready'] as const).map(status => {
              const count = PIPELINE_ACCOUNTS.filter(p => p.permitStatus === status).length;
              return (
                <div key={status} className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--pl-border)' }}>
                  <PermitBadge status={status} />
                  <div className="text-[20px] font-bold font-mono mt-1" style={{ color: 'var(--pl-text)' }}>{count}</div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>accounts</div>
                </div>
              );
            })}
          </div>

          {/* Pipeline cards */}
          <LightSectionCard title="New Account Pipeline" className="mb-4">
            <div className="space-y-3">
              {PIPELINE_ACCOUNTS.map(p => (
                <div key={p.id} className="rounded-lg border p-4" style={{ borderColor: 'var(--pl-border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <PermitBadge status={p.permitStatus} />
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--pl-chart-bar-track)', color: 'var(--pl-text-muted)' }}>
                          {p.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{p.name}</h4>
                      <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{p.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[16px] font-bold font-mono" style={{ color: '#2563EB' }}>{p.estimatedWeeklyCases}</div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>cases/wk</div>
                      <div className="text-[11px] font-bold font-mono" style={{ color: '#22C55E' }}>${fmt(p.estimatedWeeklyRevenue)}</div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>revenue/wk</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2 text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                    <span>Opens: <strong style={{ color: 'var(--pl-text)' }}>{p.expectedOpenDate}</strong></span>
                    <span>Hometown: <strong style={{ color: 'var(--pl-text)' }}>{p.hometownId.toUpperCase()}</strong></span>
                    {p.assignedSeller && <span>Seller: <strong style={{ color: 'var(--pl-text)' }}>{p.assignedSeller}</strong></span>}
                  </div>

                  <p className="text-[11px] mb-2" style={{ color: 'var(--pl-text-secondary)' }}>{p.notes}</p>

                  {p.competitorInterest && (
                    <div className="rounded-md px-3 py-2" style={{ background: 'rgba(248,113,113,0.04)', borderLeft: '3px solid #F87171' }}>
                      <div className="text-[9px] font-bold font-mono mb-0.5" style={{ color: '#F87171' }}>COMPETITOR INTEREST</div>
                      <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>{p.competitorInterest}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* Pipeline revenue projection */}
          <LightSectionCard title="Revenue Projection" className="mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(37,99,235,0.04)' }}>
                <div className="text-[10px] font-bold font-mono mb-1" style={{ color: '#2563EB' }}>ANNUAL CASES</div>
                <div className="text-[22px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{fmtK(pipelineCases)}</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>from {PIPELINE_ACCOUNTS.length} new accounts</div>
              </div>
              <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(34,197,94,0.04)' }}>
                <div className="text-[10px] font-bold font-mono mb-1" style={{ color: '#22C55E' }}>ANNUAL REVENUE</div>
                <div className="text-[22px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>${(pipelineRevenue / 1e3).toFixed(0)}K</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>projected at current pricing</div>
              </div>
              <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(245,158,11,0.04)' }}>
                <div className="text-[10px] font-bold font-mono mb-1" style={{ color: '#F59E0B' }}>AVG WEEKLY/ACCOUNT</div>
                <div className="text-[22px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>
                  {(PIPELINE_ACCOUNTS.reduce((s, p) => s + p.estimatedWeeklyCases, 0) / PIPELINE_ACCOUNTS.length).toFixed(0)}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>cases per account</div>
              </div>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Methodology */}
      <div className="text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Field intelligence sourced from route sales reps via mobile sighting reports. Competitive market share estimates based on
        IRI/Nielsen syndicated data + Andrews internal shipment analysis. Pipeline accounts tracked from TABC permit filings and
        commercial real estate monitoring. Updated weekly.
      </div>

    </>
  );
}
