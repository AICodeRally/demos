'use client';

import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  HOMETOWNS,
  ROUTES,
  TOTAL_ROUTES,
  TOTAL_ACCOUNTS,
  type Hometown,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

/* ── Quota Data ─────────────────────────────── */
const COMPANY_ANNUAL_TARGET = 5_200_000_000;
const NORTH_TX_SHARE = 0.73;
const SOUTH_TX_SHARE = 0.27;

const NORTH_TX_IDS = ['dal', 'aln', 'ftw', 'ens'];

function getHometownQuota(h: Hometown): number {
  const isNorth = NORTH_TX_IDS.includes(h.id);
  const regionTarget = isNorth
    ? COMPANY_ANNUAL_TARGET * NORTH_TX_SHARE
    : COMPANY_ANNUAL_TARGET * SOUTH_TX_SHARE;

  const regionHometowns = HOMETOWNS.filter(ht =>
    isNorth ? NORTH_TX_IDS.includes(ht.id) : !NORTH_TX_IDS.includes(ht.id)
  );
  const totalRegionRev = regionHometowns.reduce((s, ht) => s + ht.rev, 0);
  return (h.rev / totalRegionRev) * regionTarget;
}

function getRouteQuota(routeRev: number, hometownRev: number, hometownQQuota: number): number {
  return (routeRev / hometownRev) * hometownQQuota;
}

/* ── Waterfall Bar ──────────────────────────── */
function WaterfallLevel({
  label,
  value,
  maxValue,
  color,
  sub,
  indent = 0,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  sub?: string;
  indent?: number;
}) {
  const widthPct = Math.max(2, (value / maxValue) * 100);

  return (
    <>
    <div className="flex items-center gap-3 py-1.5" style={{ paddingLeft: indent * 20 }}>
      <div className="w-40 shrink-0 text-right">
        <div className="text-[12px] font-semibold truncate" style={{ color: 'var(--pl-text)' }}>{label}</div>
        {sub && <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{sub}</div>}
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-6 rounded-md relative" style={{ background: 'var(--pl-chart-bar-track)' }}>
          <div
            className="h-full rounded-md transition-all duration-500"
            style={{ width: `${widthPct}%`, background: color, opacity: 0.8 }}
          />
        </div>
        <span className="text-[12px] font-mono font-bold w-20 text-right shrink-0" style={{ color }}>
          {value >= 1_000_000_000 ? `$${(value / 1e9).toFixed(2)}B` : `$${(value / 1e6).toFixed(0)}M`}
        </span>
      </div>
    </div>
    </>
  );
}

function Connector({ indent }: { indent: number }) {
  return (
    <>
    <div className="flex items-center py-0" style={{ paddingLeft: indent * 20 + 60 }}>
      <div className="w-px h-3" style={{ background: '#CBD5E1', marginLeft: 12 }} />
    </div>
    </>
  );
}

export default function QuotaWaterfallPage() {
  const northTarget = COMPANY_ANNUAL_TARGET * NORTH_TX_SHARE;
  const southTarget = COMPANY_ANNUAL_TARGET * SOUTH_TX_SHARE;
  const northHometowns = HOMETOWNS.filter(h => NORTH_TX_IDS.includes(h.id));
  const southHometowns = HOMETOWNS.filter(h => !NORTH_TX_IDS.includes(h.id));

  return (
    <>

      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Quota Waterfall &middot; FY2026
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Revenue Target Cascade
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          $5.2B company target flows to {HOMETOWNS.length} hometowns and {TOTAL_ROUTES} routes
        </p>
      </div>

      {/* Company-level KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <LightKpiCard label="Company Target" value="$5.2B" accent="#C6A052" sub="+4% YoY" />
        <LightKpiCard
          label="North Texas"
          value={`$${(northTarget / 1e9).toFixed(2)}B`}
          accent="#7C3AED"
          sub={`${pct(NORTH_TX_SHARE)} share · ${northHometowns.reduce((s, h) => s + h.routes, 0)} routes`}
        />
        <LightKpiCard
          label="South Texas"
          value={`$${(southTarget / 1e9).toFixed(2)}B`}
          accent="#2563EB"
          sub={`${pct(SOUTH_TX_SHARE)} share · ${southHometowns.reduce((s, h) => s + h.routes, 0)} routes`}
        />
        <LightKpiCard
          label="Avg Per Route"
          value={`$${(COMPANY_ANNUAL_TARGET / TOTAL_ROUTES / 1e6).toFixed(1)}M`}
          accent="var(--pl-text-muted)"
          sub={`${fmt(TOTAL_ACCOUNTS)} accounts`}
        />
      </div>

      {/* Waterfall */}
      <LightSectionCard title="Revenue Cascade: Company → Region → Hometown" className="mb-6">
        <WaterfallLevel
          label="Andrews Distributing"
          value={COMPANY_ANNUAL_TARGET}
          maxValue={COMPANY_ANNUAL_TARGET}
          color="#C6A052"
          sub="FY2026 Target"
        />
        <Connector indent={0} />

        {/* North TX */}
        <WaterfallLevel
          label="North Texas"
          value={northTarget}
          maxValue={COMPANY_ANNUAL_TARGET}
          color="#7C3AED"
          sub={`${northHometowns.length} hometowns`}
          indent={1}
        />
        <Connector indent={1} />
        {northHometowns.map((h) => (
          <WaterfallLevel
            key={h.id}
            label={h.name.replace(' HQ', '')}
            value={getHometownQuota(h)}
            maxValue={COMPANY_ANNUAL_TARGET}
            color="#7C3AED"
            sub={`${h.routes} routes · ${h.manager}`}
            indent={2}
          />
        ))}

        <div className="my-4 border-t" style={{ borderColor: 'var(--pl-chart-bar-track)' }} />

        {/* South TX */}
        <WaterfallLevel
          label="South Texas"
          value={southTarget}
          maxValue={COMPANY_ANNUAL_TARGET}
          color="#2563EB"
          sub={`${southHometowns.length} hometowns`}
          indent={1}
        />
        <Connector indent={1} />
        {southHometowns.map((h) => (
          <WaterfallLevel
            key={h.id}
            label={h.name}
            value={getHometownQuota(h)}
            maxValue={COMPANY_ANNUAL_TARGET}
            color="#2563EB"
            sub={`${h.routes} routes · ${h.manager}`}
            indent={2}
          />
        ))}
      </LightSectionCard>

      {/* Hometown Quota Table */}
      <LightSectionCard title="Hometown Quota Detail" className="mb-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ color: 'var(--pl-text-muted)' }}>
              <th className="text-left font-medium pb-3 pl-2">Hometown</th>
              <th className="text-left font-medium pb-3">Region</th>
              <th className="text-right font-medium pb-3">Annual Quota</th>
              <th className="text-right font-medium pb-3">Q Quota</th>
              <th className="text-right font-medium pb-3">Q Actual</th>
              <th className="text-right font-medium pb-3">Variance</th>
              <th className="text-right font-medium pb-3">Routes</th>
              <th className="text-right font-medium pb-3 pr-2">Avg/Route</th>
            </tr>
          </thead>
          <tbody>
            {HOMETOWNS.map((h, i) => {
              const annualQuota = getHometownQuota(h);
              const qQuota = annualQuota / 4;
              const qActual = h.rev;
              const variance = (qActual - qQuota) / qQuota;
              const isNorth = NORTH_TX_IDS.includes(h.id);

              return (
                <tr key={h.id} style={i % 2 === 0 ? { background: 'var(--pl-stripe)' } : undefined}>
                  <td className="py-2.5 pl-2 font-semibold" style={{ color: 'var(--pl-text)' }}>{h.name}</td>
                  <td className="py-2.5">
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: isNorth ? 'rgba(124,58,237,0.08)' : 'rgba(37,99,235,0.08)',
                        color: isNorth ? '#7C3AED' : '#2563EB',
                      }}
                    >
                      {isNorth ? 'North TX' : 'South TX'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono" style={{ color: 'var(--pl-text)' }}>{fmtM(annualQuota)}</td>
                  <td className="py-2.5 text-right font-mono" style={{ color: 'var(--pl-text-muted)' }}>{fmtM(qQuota)}</td>
                  <td className="py-2.5 text-right font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{fmtM(qActual)}</td>
                  <td className="py-2.5 text-right font-mono font-bold" style={{ color: variance >= 0 ? '#22C55E' : '#F87171' }}>
                    {variance >= 0 ? '+' : ''}{(variance * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 text-right font-mono" style={{ color: 'var(--pl-text-muted)' }}>{h.routes}</td>
                  <td className="py-2.5 text-right pr-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{fmtM(annualQuota / h.routes)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </LightSectionCard>

      {/* Top/Bottom Routes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LightSectionCard title="Top 10 Routes by Attainment">
          <div className="space-y-2">
            {[...ROUTES].sort((a, b) => b.attain - a.attain).slice(0, 10).map((r, i) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="text-[10px] font-mono w-4 text-right" style={{ color: 'var(--pl-text-faint)' }}>{i + 1}</span>
                <span className="text-[12px] font-bold font-mono w-16" style={{ color: 'var(--pl-text)' }}>{r.id}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--pl-chart-bar-track)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(r.attain * 100, 110)}%`, background: '#22C55E' }} />
                </div>
                <span className="text-[11px] font-mono font-bold w-12 text-right" style={{ color: '#22C55E' }}>{pct(r.attain)}</span>
              </div>
            ))}
          </div>
        </LightSectionCard>

        <LightSectionCard title="Bottom 5 Routes (At Risk)">
          <div className="space-y-2">
            {[...ROUTES].sort((a, b) => a.attain - b.attain).slice(0, 5).map((r, i) => {
              const h = HOMETOWNS.find(ht => ht.id === r.hometownId);
              const hQuota = h ? getHometownQuota(h) : 0;
              const rQuota = h ? getRouteQuota(r.rev, h.rev, hQuota / 4) : 0;
              const gap = rQuota - r.rev;
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono w-4 text-right" style={{ color: 'var(--pl-text-faint)' }}>{i + 1}</span>
                  <span className="text-[12px] font-bold font-mono w-16" style={{ color: 'var(--pl-text)' }}>{r.id}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--pl-chart-bar-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${r.attain * 100}%`, background: '#F87171' }} />
                  </div>
                  <span className="text-[11px] font-mono font-bold w-12 text-right" style={{ color: '#F87171' }}>{pct(r.attain)}</span>
                  <span className="text-[10px] font-mono w-16 text-right" style={{ color: '#F87171' }}>-{fmtM(Math.abs(gap))}</span>
                </div>
              );
            })}
          </div>
        </LightSectionCard>
      </div>

      {/* Methodology */}
      <div className="text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Quota allocation: Company target → 73/27 North/South split → hometown share by revenue contribution → route share within hometown.
      </div>

    </>
  );
}
