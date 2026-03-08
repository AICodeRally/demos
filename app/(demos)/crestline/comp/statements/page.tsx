'use client';

import { useState } from 'react';
import { StatCard, BarChart } from '@/components/demos/crestline';
import { ASSOCIATES, CALC_SNAPSHOTS, COMMISSION_COMPONENTS, SELLING_DEPTS, COLORS } from '@/data/crestline';
import { FileText, ChevronDown, ArrowUp, ArrowDown, Minus, Printer } from 'lucide-react';

/* ── Period definitions ── */
const PERIODS = [
  { id: 'PP3', label: 'PP3 Mar 1-15' },
  { id: 'PP4', label: 'PP4 Mar 16-31' },
  { id: 'PP5', label: 'PP5 Apr 1-15' },
];

/* ── Extended snapshot data for all reps (PP3 + PP4) ── */
const ALL_SNAPSHOTS = [
  ...CALC_SNAPSHOTS,
  // PP5 for Elena
  {
    periodId: 'PP5', periodLabel: 'Apr 1-15', repId: 'a1', repName: 'Elena Vasquez',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 3580 },
      { componentId: 'premium', label: 'Premium Commission', amount: 3010 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 530 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 7120, achieverTier: 'platinum', department: 'Designer Apparel', store: 'F-001', frozenAt: '2026-04-16T06:00:00Z',
  },
  // Marcus Chen
  {
    periodId: 'PP3', periodLabel: 'Mar 1-15', repId: 'a2', repName: 'Marcus Chen',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 2790 },
      { componentId: 'premium', label: 'Premium Commission', amount: 1550 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 310 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 4650, achieverTier: 'gold', department: 'Shoes', store: 'F-003', frozenAt: '2026-03-16T06:00:00Z',
  },
  {
    periodId: 'PP4', periodLabel: 'Mar 16-31', repId: 'a2', repName: 'Marcus Chen',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 2920 },
      { componentId: 'premium', label: 'Premium Commission', amount: 1620 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 340 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 4880, achieverTier: 'gold', department: 'Shoes', store: 'F-003', frozenAt: '2026-04-01T06:00:00Z',
  },
  {
    periodId: 'PP5', periodLabel: 'Apr 1-15', repId: 'a2', repName: 'Marcus Chen',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 3010 },
      { componentId: 'premium', label: 'Premium Commission', amount: 1690 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 360 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 5060, achieverTier: 'gold', department: 'Shoes', store: 'F-003', frozenAt: '2026-04-16T06:00:00Z',
  },
  // Diana Okafor
  {
    periodId: 'PP3', periodLabel: 'Mar 1-15', repId: 'a3', repName: 'Diana Okafor',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 2100 },
      { componentId: 'premium', label: 'Premium Commission', amount: 525 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 175 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 2800, achieverTier: 'silver', department: 'Cosmetics & Fragrance', store: 'S-015', frozenAt: '2026-03-16T06:00:00Z',
  },
  {
    periodId: 'PP4', periodLabel: 'Mar 16-31', repId: 'a3', repName: 'Diana Okafor',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 2240 },
      { componentId: 'premium', label: 'Premium Commission', amount: 560 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 190 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 2990, achieverTier: 'silver', department: 'Cosmetics & Fragrance', store: 'S-015', frozenAt: '2026-04-01T06:00:00Z',
  },
  {
    periodId: 'PP5', periodLabel: 'Apr 1-15', repId: 'a3', repName: 'Diana Okafor',
    components: [
      { componentId: 'basic', label: 'Basic Commission', amount: 2310 },
      { componentId: 'premium', label: 'Premium Commission', amount: 580 },
      { componentId: 'scorecard', label: 'Achiever Scorecard', amount: 200 },
      { componentId: 'negative-balance', label: 'Carry-Forward', amount: 0 },
    ],
    total: 3090, achieverTier: 'silver', department: 'Cosmetics & Fragrance', store: 'S-015', frozenAt: '2026-04-16T06:00:00Z',
  },
];

/* ── Sales summary data by rep+period ── */
const SALES_SUMMARIES: Record<string, Record<string, { gross: number; returns: number; net: number }>> = {
  a1: {
    PP3: { gross: 68400, returns: 3400, net: 65000 },
    PP4: { gross: 73200, returns: 3600, net: 69600 },
    PP5: { gross: 76100, returns: 4100, net: 72000 },
  },
  a2: {
    PP3: { gross: 64800, returns: 2800, net: 62000 },
    PP4: { gross: 67500, returns: 2500, net: 65000 },
    PP5: { gross: 70200, returns: 3200, net: 67000 },
  },
  a3: {
    PP3: { gross: 37500, returns: 2500, net: 35000 },
    PP4: { gross: 39800, returns: 2300, net: 37500 },
    PP5: { gross: 41200, returns: 2700, net: 38500 },
  },
};

/* ── SPIFF data ── */
const SPIFF_DATA: Record<string, Record<string, { label: string; amount: number }[]>> = {
  a1: {
    PP3: [{ label: 'Designer Launch SPIFF', amount: 150 }],
    PP4: [{ label: 'Designer Launch SPIFF', amount: 225 }],
    PP5: [{ label: 'Designer Launch SPIFF', amount: 75 }],
  },
  a2: {
    PP3: [],
    PP4: [{ label: 'Loyalty Sign-Up', amount: 30 }],
    PP5: [{ label: 'Loyalty Sign-Up', amount: 20 }],
  },
  a3: {
    PP3: [{ label: 'Fragrance Gift Set Bonus', amount: 50 }],
    PP4: [{ label: 'Fragrance Gift Set Bonus', amount: 75 }],
    PP5: [],
  },
};

/* ── Payout history (6 periods) ── */
const PAYOUT_HISTORY: Record<string, { label: string; value: number }[]> = {
  a1: [
    { label: 'PP1', value: 5980 },
    { label: 'PP2', value: 6210 },
    { label: 'PP3', value: 6430 },
    { label: 'PP4', value: 6910 },
    { label: 'PP5', value: 7120 },
    { label: 'PP6', value: 6930 },
  ],
  a2: [
    { label: 'PP1', value: 4280 },
    { label: 'PP2', value: 4410 },
    { label: 'PP3', value: 4650 },
    { label: 'PP4', value: 4880 },
    { label: 'PP5', value: 5060 },
    { label: 'PP6', value: 4920 },
  ],
  a3: [
    { label: 'PP1', value: 2580 },
    { label: 'PP2', value: 2690 },
    { label: 'PP3', value: 2800 },
    { label: 'PP4', value: 2990 },
    { label: 'PP5', value: 3090 },
    { label: 'PP6', value: 2940 },
  ],
};

/* ── Tier badge colors ── */
const TIER_STYLES: Record<string, { bg: string; fg: string; label: string }> = {
  none: { bg: '#F1F5F9', fg: '#64748b', label: 'Not Qualified' },
  silver: { bg: '#f1f5f9', fg: '#64748b', label: 'Silver' },
  gold: { bg: '#fef3c7', fg: '#92400e', label: 'Gold' },
  platinum: { bg: '#f3e8ff', fg: '#7c3aed', label: 'Platinum' },
};

/* ── YTD totals ── */
const YTD_TOTALS: Record<string, number> = {
  a1: 38580,
  a2: 28200,
  a3: 17090,
};

/* ── Rank ── */
const RANK: Record<string, string> = {
  a1: '#1 of 10',
  a2: '#3 of 10',
  a3: '#6 of 10',
};

function fmt(n: number): string {
  return `$${n.toLocaleString()}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function Statements() {
  const [selectedRepId, setSelectedRepId] = useState('a1');
  const [selectedPeriod, setSelectedPeriod] = useState('PP3');

  const rep = ASSOCIATES.find(a => a.id === selectedRepId)!;
  const selectableReps = ASSOCIATES.filter(a => ['a1', 'a2', 'a3'].includes(a.id));

  // Find snapshot for current selection (use latest non-CORRECTED for this period+rep)
  const snapshot = ALL_SNAPSHOTS
    .filter(s => s.repId === selectedRepId && s.periodId === selectedPeriod && !s.periodLabel.includes('CORRECTED'))
    .pop();

  // Comparison snapshot (previous period)
  const periodIdx = PERIODS.findIndex(p => p.id === selectedPeriod);
  const prevPeriod = periodIdx > 0 ? PERIODS[periodIdx - 1].id : null;
  const prevSnapshot = prevPeriod
    ? ALL_SNAPSHOTS.filter(s => s.repId === selectedRepId && s.periodId === prevPeriod && !s.periodLabel.includes('CORRECTED')).pop()
    : null;

  const sales = SALES_SUMMARIES[selectedRepId]?.[selectedPeriod] ?? { gross: 0, returns: 0, net: 0 };
  const prevSales = prevPeriod ? SALES_SUMMARIES[selectedRepId]?.[prevPeriod] : null;

  const spiffs = SPIFF_DATA[selectedRepId]?.[selectedPeriod] ?? [];
  const spiffTotal = spiffs.reduce((s, sp) => s + sp.amount, 0);

  const tierStyle = TIER_STYLES[rep.achieverTier] ?? TIER_STYLES.none;

  const payoutHistory = PAYOUT_HISTORY[selectedRepId] ?? [];
  const ytdTotal = YTD_TOTALS[selectedRepId] ?? 0;
  const rank = RANK[selectedRepId] ?? '#- of 10';
  const avgPerPeriod = payoutHistory.length > 0
    ? Math.round(payoutHistory.reduce((s, p) => s + p.value, 0) / payoutHistory.length)
    : 0;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>
          Commission Statements
        </h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Immutable statement records replacing CiC+ — Phil Step 13
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Current Period Payout"
          value={snapshot ? fmt(snapshot.total) : '--'}
          color={COLORS.accent}
          sparkline={payoutHistory.map(p => p.value)}
        />
        <StatCard label="YTD Total" value={fmt(ytdTotal)} trend="up" trendValue="on pace" color="#7c3aed" />
        <StatCard label="Avg Per Period" value={fmt(avgPerPeriod)} color="#2563eb" />
        <StatCard label="Rank" value={rank} color="#059669" />
      </div>

      {/* Selectors */}
      <div className="flex items-center gap-4 mb-6">
        {/* Rep selector */}
        <div className="relative">
          <select
            value={selectedRepId}
            onChange={e => setSelectedRepId(e.target.value)}
            className="appearance-none rounded-lg border pl-4 pr-10 py-2.5 text-sm font-medium cursor-pointer"
            style={{ borderColor: '#E2E8F0', color: COLORS.primary, backgroundColor: '#FFFFFF' }}
          >
            {selectableReps.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94a3b8' }} />
        </div>

        {/* Period tabs */}
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: '#F1F5F9' }}>
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPeriod(p.id)}
              className="px-4 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                backgroundColor: selectedPeriod === p.id ? '#FFFFFF' : 'transparent',
                color: selectedPeriod === p.id ? COLORS.primary : '#94a3b8',
                boxShadow: selectedPeriod === p.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Statement Card (2 cols) */}
        <div
          className="col-span-2 rounded-xl bg-white border p-8"
          style={{ borderColor: '#E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
        >
          {/* Statement Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b" style={{ borderColor: '#E2E8F0' }}>
            <div>
              <p className="text-lg font-bold" style={{ color: COLORS.primary }}>
                Commission Statement — {PERIODS.find(p => p.id === selectedPeriod)?.label}
              </p>
              <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Crestline Department Stores</p>
            </div>
            <div className="flex items-center gap-2">
              <Printer size={14} style={{ color: '#94a3b8' }} />
              <span className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>print-ready</span>
            </div>
          </div>

          {/* Rep Info */}
          <div className="grid grid-cols-4 gap-4 mb-6 pb-4 border-b" style={{ borderColor: '#F1F5F9' }}>
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#94a3b8' }}>Associate</p>
              <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>{rep.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#94a3b8' }}>Store</p>
              <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>{rep.storeId}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#94a3b8' }}>Department</p>
              <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                {SELLING_DEPTS.find(d => d.id === rep.department)?.name ?? rep.department}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#94a3b8' }}>Achiever Tier</p>
              <span
                className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-0.5"
                style={{ backgroundColor: tierStyle.bg, color: tierStyle.fg }}
              >
                {tierStyle.label}
              </span>
            </div>
          </div>

          {/* Section 1: Sales Summary */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>
              1. Sales Summary
            </p>
            <div className="space-y-1">
              {[
                { label: 'Gross Sales', value: sales.gross },
                { label: 'Returns', value: -sales.returns },
                { label: 'Net Commissionable Sales', value: sales.net, bold: true },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 px-3 rounded"
                  style={{ backgroundColor: row.bold ? '#F8FAFC' : 'transparent' }}
                >
                  <span
                    className={`text-xs ${row.bold ? 'font-bold' : 'font-medium'}`}
                    style={{ color: row.bold ? COLORS.primary : '#475569' }}
                  >
                    {row.label}
                  </span>
                  <span
                    className={`text-xs font-mono ${row.bold ? 'font-bold' : ''}`}
                    style={{ color: row.value < 0 ? '#DC2626' : COLORS.primary }}
                  >
                    {row.value < 0 ? `-${fmt(Math.abs(row.value))}` : fmt(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Commission Breakdown */}
          {snapshot && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>
                2. Commission Breakdown
              </p>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ color: '#94a3b8' }}>
                    <th className="text-left pb-2 font-medium">Component</th>
                    <th className="text-right pb-2 font-medium">Rate</th>
                    <th className="text-right pb-2 font-medium">Commissionable</th>
                    <th className="text-right pb-2 font-medium">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.components.map((comp, i) => {
                    const compDef = COMMISSION_COMPONENTS.find(c => c.id === comp.componentId);
                    const dept = SELLING_DEPTS.find(d => d.id === rep.department);
                    let rate = '--';
                    if (comp.componentId === 'basic') rate = `${((dept?.baseRate ?? 0.05) * 100).toFixed(1)}%`;
                    else if (comp.componentId === 'premium') {
                      const tierRates: Record<string, string> = { silver: '1.5%', gold: '2.5%', platinum: '3.5%' };
                      rate = tierRates[rep.achieverTier] ?? '0%';
                    }
                    else if (comp.componentId === 'scorecard') rate = '0.5%';
                    else if (comp.componentId === 'negative-balance') rate = '--';

                    return (
                      <tr key={i} className="border-t" style={{ borderColor: '#F1F5F9' }}>
                        <td className="py-2">
                          <span className="font-medium" style={{ color: COLORS.primary }}>{comp.label}</span>
                        </td>
                        <td className="py-2 text-right font-mono" style={{ color: '#475569' }}>{rate}</td>
                        <td className="py-2 text-right font-mono" style={{ color: '#475569' }}>{fmt(sales.net)}</td>
                        <td className="py-2 text-right font-mono font-semibold" style={{ color: comp.amount > 0 ? COLORS.primary : '#94a3b8' }}>
                          {fmt(comp.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Section 3: Adjustments */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>
              3. Adjustments & SPIFFs
            </p>
            {spiffs.length > 0 ? (
              <div className="space-y-1">
                {spiffs.map((sp, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded" style={{ backgroundColor: '#ecfdf5' }}>
                    <span className="text-xs font-medium" style={{ color: '#059669' }}>{sp.label}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: '#059669' }}>+{fmt(sp.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs px-3" style={{ color: '#94a3b8' }}>No adjustments or SPIFFs this period</p>
            )}
          </div>

          {/* Section 4: Total */}
          <div className="border-t-2 pt-4" style={{ borderColor: COLORS.primary }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>
              4. Total
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-1.5 px-3">
                <span className="text-xs font-medium" style={{ color: '#475569' }}>Gross Commission</span>
                <span className="text-xs font-mono" style={{ color: COLORS.primary }}>{snapshot ? fmt(snapshot.total) : '--'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3">
                <span className="text-xs font-medium" style={{ color: '#475569' }}>SPIFFs</span>
                <span className="text-xs font-mono" style={{ color: spiffTotal > 0 ? '#059669' : '#94a3b8' }}>
                  {spiffTotal > 0 ? `+${fmt(spiffTotal)}` : '$0'}
                </span>
              </div>
              <div
                className="flex items-center justify-between py-3 px-4 rounded-lg"
                style={{ backgroundColor: COLORS.primary }}
              >
                <span className="text-sm font-bold text-white">Net Payout</span>
                <span className="text-xl font-bold font-mono" style={{ color: COLORS.accent }}>
                  {snapshot ? fmt(snapshot.total + spiffTotal) : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
            <div className="flex items-center gap-2">
              <FileText size={12} style={{ color: '#94a3b8' }} />
              <span className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>
                Statement generated {snapshot ? fmtDate(snapshot.frozenAt) : '--'} — Immutable record
              </span>
            </div>
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
            >
              FROZEN
            </span>
          </div>
        </div>

        {/* Historical Comparison (1 col) */}
        <div className="space-y-6">
          {/* Period Comparison */}
          {prevSnapshot && snapshot && (
            <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E2E8F0' }}>
              <p className="text-xs font-semibold mb-4" style={{ color: COLORS.primary }}>
                Period Comparison
              </p>

              <div className="space-y-3">
                {snapshot.components.map((comp, i) => {
                  const prevComp = prevSnapshot.components.find(c => c.componentId === comp.componentId);
                  const prevAmt = prevComp?.amount ?? 0;
                  const delta = comp.amount - prevAmt;
                  const pct = prevAmt > 0 ? ((delta / prevAmt) * 100).toFixed(1) : '0.0';

                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium" style={{ color: COLORS.primary }}>{comp.label}</span>
                        <div className="flex items-center gap-1">
                          {delta > 0 && <ArrowUp size={10} style={{ color: '#059669' }} />}
                          {delta < 0 && <ArrowDown size={10} style={{ color: '#DC2626' }} />}
                          {delta === 0 && <Minus size={10} style={{ color: '#94a3b8' }} />}
                          <span
                            className="text-[10px] font-mono font-semibold"
                            style={{ color: delta > 0 ? '#059669' : delta < 0 ? '#DC2626' : '#94a3b8' }}
                          >
                            {delta > 0 ? '+' : ''}{pct}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 text-[10px] font-mono" style={{ color: '#475569' }}>
                        <span>{prevSnapshot.periodId}: {fmt(prevAmt)}</span>
                        <span style={{ color: '#CBD5E1' }}>|</span>
                        <span>{snapshot.periodId}: {fmt(comp.amount)}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Total comparison */}
                <div className="border-t pt-3 mt-2" style={{ borderColor: '#F1F5F9' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: COLORS.primary }}>Total</span>
                    <div className="flex items-center gap-1">
                      {snapshot.total > prevSnapshot.total && <ArrowUp size={12} style={{ color: '#059669' }} />}
                      {snapshot.total < prevSnapshot.total && <ArrowDown size={12} style={{ color: '#DC2626' }} />}
                      <span
                        className="text-xs font-bold font-mono"
                        style={{ color: snapshot.total >= prevSnapshot.total ? '#059669' : '#DC2626' }}
                      >
                        {snapshot.total >= prevSnapshot.total ? '+' : ''}
                        {fmt(snapshot.total - prevSnapshot.total)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-[10px] font-mono mt-1" style={{ color: '#475569' }}>
                    <span>{prevSnapshot.periodId}: {fmt(prevSnapshot.total)}</span>
                    <span style={{ color: '#CBD5E1' }}>|</span>
                    <span className="font-semibold">{snapshot.periodId}: {fmt(snapshot.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payout History Chart */}
          <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-xs font-semibold mb-4" style={{ color: COLORS.primary }}>
              Payout History (6 Periods)
            </p>
            <BarChart
              data={payoutHistory.map(p => ({
                label: p.label,
                value: p.value,
                color: p.label === selectedPeriod ? COLORS.accent : '#CBD5E1',
              }))}
              unit=""
              color={COLORS.accent}
            />
            <p className="text-[10px] mt-3 text-center" style={{ color: '#94a3b8' }}>
              {rep.name} — Semi-monthly payroll periods
            </p>
          </div>
        </div>
      </div>

      {/* CiC+ Replacement Callout */}
      <div
        className="rounded-xl border-2 p-6 flex items-start gap-4"
        style={{ borderColor: COLORS.accent, backgroundColor: `${COLORS.accent}08` }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${COLORS.accent}20` }}
        >
          <FileText size={20} style={{ color: COLORS.accent }} />
        </div>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: COLORS.primary }}>Replacing CiC+</p>
          <p className="text-sm" style={{ color: '#475569' }}>
            This portal replaces <span className="font-semibold" style={{ color: COLORS.primary }}>Crestline&apos;s legacy CiC+ system</span> with
            immutable, frozen statement records. Each statement is generated at period close, cryptographically timestamped,
            and cannot be modified — only superseded by a corrected version. Associates get{' '}
            <span className="font-semibold" style={{ color: COLORS.primary }}>real-time visibility</span> into their commission breakdown,
            historical trends, and SPIFF earnings without waiting for payroll to process.
          </p>
        </div>
      </div>
    </>
  );
}
