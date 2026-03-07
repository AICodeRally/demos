'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  ACCOUNTS,
  HOMETOWNS,
  TOTAL_ACCOUNTS,
  getAccountsByTier,
  getAccountsByHometown,
  type AccountTier,
  type AccountType,
} from '@/data/proofline';
import { fmt, fmtM, fmtK, pct } from '@/lib/utils';

/* ── Tier config ──────────────────────────────── */
const TIER_CONFIG: Record<AccountTier, { label: string; color: string; bg: string; desc: string }> = {
  A: { label: 'Tier A', color: '#22C55E', bg: 'rgba(34,197,94,0.08)', desc: 'Major chains, key accounts' },
  B: { label: 'Tier B', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', desc: 'Regional grocery, large independents' },
  C: { label: 'Tier C', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', desc: 'Bars, restaurants, hotels' },
  D: { label: 'Tier D', color: '#718096', bg: 'rgba(113,128,150,0.08)', desc: 'Convenience, small independents' },
};

const TYPE_LABELS: Record<AccountType, string> = {
  'on-premise': 'On-Premise',
  'off-premise': 'Off-Premise',
  'chain': 'Chain',
  'independent': 'Independent',
};

const TABC_LABELS: Record<string, string> = {
  BB: 'Beer/Wine',
  BG: 'Grocery',
  MB: 'Mixed Bev',
  P: 'Package',
  W: 'Spirits',
  BQ: 'Beer Quota',
};

/* ── Tier Distribution Bar ─────────────────────── */
function TierDistribution() {
  const tiers: AccountTier[] = ['A', 'B', 'C', 'D'];
  const total = ACCOUNTS.length;
  const totalRev = ACCOUNTS.reduce((s, a) => s + a.weeklyRevenue * 52, 0);

  return (
    <>
    <div className="space-y-4">
      {tiers.map(tier => {
        const accounts = getAccountsByTier(tier);
        const count = accounts.length;
        const rev = accounts.reduce((s, a) => s + a.weeklyRevenue * 52, 0);
        const cfg = TIER_CONFIG[tier];

        return (
          <div key={tier}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
                <span className="text-[11px]" style={{ color: '#718096' }}>{cfg.desc}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span style={{ color: '#718096' }}>{count} accounts ({pct(count / total)})</span>
                <span className="font-bold" style={{ color: cfg.color }}>{fmtM(rev)} ({pct(rev / totalRev)})</span>
              </div>
            </div>
            {/* Stacked bar: count and revenue */}
            <div className="flex gap-2">
              <div className="flex-1 h-3 rounded-full" style={{ background: '#F1F5F9' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(count / total) * 100}%`, background: cfg.color, opacity: 0.4 }}
                />
              </div>
              <div className="flex-1 h-3 rounded-full" style={{ background: '#F1F5F9' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(rev / totalRev) * 100}%`, background: cfg.color }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-0.5">
              <span className="flex-1 text-[9px] font-mono text-center" style={{ color: '#A0AEC0' }}>% of accounts</span>
              <span className="flex-1 text-[9px] font-mono text-center" style={{ color: '#A0AEC0' }}>% of revenue</span>
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
}

export default function AccountSegmentationPage() {
  const [filterTier, setFilterTier] = useState<AccountTier | 'all'>('all');
  const [filterHometown, setFilterHometown] = useState<string>('all');

  const totalWeeklyRev = ACCOUNTS.reduce((s, a) => s + a.weeklyRevenue, 0);
  const totalMonthlyCases = ACCOUNTS.reduce((s, a) => s + a.monthlyCases, 0);
  const spiritsCount = ACCOUNTS.filter(a => a.spiritsCarrying).length;
  const avgDisplayCompliance = ACCOUNTS.reduce((s, a) => s + a.displayCompliance, 0) / ACCOUNTS.length;

  // Filter accounts
  const filtered = ACCOUNTS.filter(a => {
    if (filterTier !== 'all' && a.tier !== filterTier) return false;
    if (filterHometown !== 'all' && a.hometownId !== filterHometown) return false;
    return true;
  });

  // Hometown breakdown
  const hometownBreakdown = HOMETOWNS.map(h => {
    const accts = getAccountsByHometown(h.id);
    const aCount = accts.filter(a => a.tier === 'A').length;
    const rev = accts.reduce((s, a) => s + a.weeklyRevenue * 52, 0);
    const spirits = accts.filter(a => a.spiritsCarrying).length;
    return { ...h, acctCount: accts.length, aCount, annualRev: rev, spiritsCount: spirits };
  });

  return (
    <>
    
      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Account Segmentation &middot; 4-Tier Model
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: "'Space Grotesk', sans-serif" }}>
          Account Portfolio Analysis
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
          {fmt(ACCOUNTS.length)} representative accounts across {HOMETOWNS.length} hometowns &middot; Pareto-driven tiering
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Total Accounts" value={fmt(TOTAL_ACCOUNTS)} accent="#7C3AED" sub="Company-wide" />
        <LightKpiCard label="Weekly Revenue" value={fmtM(totalWeeklyRev * 52)} accent="#7C3AED" sub={`${fmtK(totalMonthlyCases * 12)} cases/yr`} />
        <LightKpiCard label="Spirits Penetration" value={pct(spiritsCount / ACCOUNTS.length)} accent="#F87171" sub={`${spiritsCount} of ${ACCOUNTS.length} sample`} />
        <LightKpiCard label="Avg Display" value={pct(avgDisplayCompliance)} accent="#2563EB" />
        <LightKpiCard
          label="Tier A Revenue Share"
          value={pct(getAccountsByTier('A').reduce((s, a) => s + a.weeklyRevenue, 0) / totalWeeklyRev)}
          accent="#22C55E"
          sub={`${getAccountsByTier('A').length} accounts`}
        />
      </div>

      {/* Tier Distribution */}
      <LightSectionCard title="Tier Distribution — Accounts vs Revenue" className="mb-6">
        <TierDistribution />
      </LightSectionCard>

      {/* Hometown Breakdown */}
      <LightSectionCard title="Account Distribution by Hometown" className="mb-6">
        <div className="grid grid-cols-3 gap-3">
          {hometownBreakdown.map(h => (
            <div
              key={h.id}
              className="rounded-lg border p-4"
              style={{ borderColor: '#E2E8F0' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold" style={{ color: '#1A1A2E' }}>
                  {h.name.replace(' HQ', '')}
                </span>
                <span className="text-[11px] font-mono" style={{ color: '#718096' }}>
                  {h.acctCount} accts
                </span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {(['A', 'B', 'C', 'D'] as AccountTier[]).map(tier => {
                  const tierAccts = getAccountsByHometown(h.id).filter(a => a.tier === tier);
                  const pctWidth = (tierAccts.length / h.acctCount) * 100;
                  return (
                    <div
                      key={tier}
                      className="h-2 rounded-full"
                      style={{ width: `${pctWidth}%`, background: TIER_CONFIG[tier].color, minWidth: pctWidth > 0 ? 4 : 0 }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: '#A0AEC0' }}>
                <span>{h.aCount} Tier A</span>
                <span>{fmtM(h.annualRev)}/yr</span>
                <span>{h.spiritsCount} spirits</span>
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono" style={{ color: '#718096' }}>Tier:</span>
          {(['all', 'A', 'B', 'C', 'D'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors"
              style={{
                borderColor: filterTier === t ? '#7C3AED' : '#E2E8F0',
                background: filterTier === t ? 'rgba(184,115,51,0.08)' : 'white',
                color: filterTier === t ? '#7C3AED' : '#718096',
                fontWeight: filterTier === t ? 700 : 400,
              }}
            >
              {t === 'all' ? 'All' : `Tier ${t}`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono" style={{ color: '#718096' }}>Hometown:</span>
          <select
            value={filterHometown}
            onChange={e => setFilterHometown(e.target.value)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg border"
            style={{ borderColor: '#E2E8F0', color: '#1A1A2E' }}
          >
            <option value="all">All Hometowns</option>
            {HOMETOWNS.map(h => (
              <option key={h.id} value={h.id}>{h.name.replace(' HQ', '')}</option>
            ))}
          </select>
        </div>
        <span className="text-[11px] font-mono ml-auto" style={{ color: '#A0AEC0' }}>
          Showing {filtered.length} of {ACCOUNTS.length}
        </span>
      </div>

      {/* Account Table */}
      <LightSectionCard title="Account Detail" className="mb-6">
        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-white">
              <tr style={{ color: '#718096' }}>
                <th className="text-left font-medium pb-3 pl-2">Account</th>
                <th className="text-left font-medium pb-3">Tier</th>
                <th className="text-left font-medium pb-3">Type</th>
                <th className="text-left font-medium pb-3">Route</th>
                <th className="text-left font-medium pb-3">TABC</th>
                <th className="text-right font-medium pb-3">Weekly Rev</th>
                <th className="text-right font-medium pb-3">Monthly Cases</th>
                <th className="text-right font-medium pb-3">Display</th>
                <th className="text-right font-medium pb-3 pr-2">Spirits</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((a, i) => {
                const tc = TIER_CONFIG[a.tier];
                return (
                  <tr key={a.id} className={i % 2 === 0 ? 'bg-[#F8FAFC]' : ''}>
                    <td className="py-2 pl-2">
                      <div className="text-[12px] font-semibold" style={{ color: '#1A1A2E' }}>{a.name}</div>
                      <div className="text-[10px] font-mono" style={{ color: '#A0AEC0' }}>{a.id}</div>
                    </td>
                    <td className="py-2">
                      <span
                        className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{ background: tc.bg, color: tc.color }}
                      >
                        {tc.label}
                      </span>
                    </td>
                    <td className="py-2 text-[12px]" style={{ color: '#718096' }}>{TYPE_LABELS[a.type]}</td>
                    <td className="py-2 text-[12px] font-mono" style={{ color: '#1A1A2E' }}>{a.routeId}</td>
                    <td className="py-2">
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          background: a.tabcLicense === 'W' || a.tabcLicense === 'MB' ? 'rgba(248,113,113,0.08)' : 'rgba(113,128,150,0.08)',
                          color: a.tabcLicense === 'W' || a.tabcLicense === 'MB' ? '#F87171' : '#718096',
                        }}
                      >
                        {TABC_LABELS[a.tabcLicense]}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono" style={{ color: '#1A1A2E' }}>${fmt(a.weeklyRevenue)}</td>
                    <td className="py-2 text-right font-mono" style={{ color: '#718096' }}>{fmt(a.monthlyCases)}</td>
                    <td className="py-2 text-right font-mono" style={{ color: a.displayCompliance >= 0.90 ? '#22C55E' : a.displayCompliance >= 0.80 ? '#F59E0B' : '#F87171' }}>
                      {pct(a.displayCompliance)}
                    </td>
                    <td className="py-2 text-right pr-2">
                      <span
                        className="text-[10px] font-bold font-mono"
                        style={{ color: a.spiritsCarrying ? '#22C55E' : '#CBD5E1' }}
                      >
                        {a.spiritsCarrying ? 'YES' : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length > 50 && (
            <div className="text-center py-3 text-[11px] font-mono" style={{ color: '#A0AEC0' }}>
              Showing 50 of {filtered.length} — scroll or filter to narrow
            </div>
          )}
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[11px] font-mono" style={{ color: '#A0AEC0' }}>
        4-tier model based on annual revenue contribution + strategic value. Tier A = top 12% of accounts driving ~45% of revenue.
        TABC license types determine spirits eligibility (W-permit, Mixed Bev).
      </div>
    
    </>
  );
}
