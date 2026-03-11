'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  HOMETOWNS,
  BRAND_FAMILIES,
  SUPPLIER_COLORS,
  getBrandsBySupplier,
  INVENTORY_RECOMMENDATIONS,
  type SupplierGroup,
  type Hometown,
} from '@/data/proofline';
import { fmt, fmtM, fmtK, pct } from '@/lib/utils';

/** Seeded pseudo-random: deterministic per string seed */
const seededRandom = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

/* ── Supplier display names ──────────────────── */
const SUPPLIER_NAMES: Record<SupplierGroup, string> = {
  'molson-coors': 'Molson Coors',
  'constellation': 'Constellation',
  'heineken': 'Heineken',
  'craft': 'Craft / Regional',
  'sazerac': 'Sazerac',
  'fmb-rtd': 'FMB / RTD',
};

const SUPPLIERS: SupplierGroup[] = ['molson-coors', 'constellation', 'heineken', 'craft', 'sazerac', 'fmb-rtd'];

/* ── Simulated warehouse inventory per hometown ─ */
function getWarehouseInventory(hometown: Hometown) {
  // Base inventory proportional to hometown quarterly cases
  const baseFactor = hometown.cases / 13; // ~weekly
  const suppliers = SUPPLIERS.map(s => {
    const brands = getBrandsBySupplier(s);
    const supplierCases = brands.reduce((sum, b) => sum + b.casesQ, 0);
    const totalCases = BRAND_FAMILIES.reduce((sum, b) => sum + b.casesQ, 0);
    const share = supplierCases / totalCases;
    const rng = seededRandom(s + hometown.id)();
    const cases = Math.round(baseFactor * share * (0.8 + rng * 0.4));
    return { supplier: s, cases, share };
  });
  const total = suppliers.reduce((s, x) => s + x.cases, 0);
  return { suppliers, total };
}

/* ── Keg Tracking Data ─────────────────────────── */
const KEG_SUMMARY = {
  totalOut: 842,
  totalReturned: 714,
  depositValue: 42100,
  aging30Plus: 48,
  agingValue: 2400,
};

const KEG_BY_SIZE = [
  { size: '1/2 bbl', out: 340, returned: 295, aging: 18, depositPer: 50 },
  { size: '1/4 bbl', out: 210, returned: 185, aging: 12, depositPer: 40 },
  { size: '1/6 bbl', out: 292, returned: 234, aging: 18, depositPer: 30 },
];

const KEG_AGING_BUCKETS = [
  { label: '0-14 days', count: 580, color: '#22C55E' },
  { label: '15-30 days', count: 214, color: '#F59E0B' },
  { label: '31-60 days', count: 36, color: '#F87171' },
  { label: '60+ days', count: 12, color: '#DC2626' },
];

/* ── Urgency config ──────────────────────────── */
const URGENCY_COLORS: Record<string, { color: string; bg: string }> = {
  high:   { color: '#F87171', bg: 'rgba(248,113,113,0.08)' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  low:    { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
};

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  increase: { label: 'INCREASE', color: '#22C55E' },
  reduce:   { label: 'REDUCE', color: '#F87171' },
  maintain: { label: 'MAINTAIN', color: 'var(--pl-text-muted)' },
};

/* ── Spirits Cage (regulatory) ───────────────── */
const SPIRITS_CAGE = [
  { brand: 'Buffalo Trace', cases: 420, daysOnHand: 4, status: 'low' as const, note: 'Sazerac allocation limited — lock in Q2 POs' },
  { brand: 'Eagle Rare', cases: 180, daysOnHand: 6, status: 'ok' as const, note: 'Allocated. No reorder until April' },
  { brand: 'Fireball', cases: 650, daysOnHand: 8, status: 'high' as const, note: 'Post-holiday overhang — redistribute to South TX' },
  { brand: 'Southern Comfort', cases: 340, daysOnHand: 5, status: 'ok' as const, note: 'Tracking to plan' },
  { brand: 'Wheatley Vodka', cases: 210, daysOnHand: 3, status: 'low' as const, note: 'Below safety stock — expedite order' },
  { brand: 'Sazerac Rye', cases: 95, daysOnHand: 7, status: 'ok' as const, note: 'Niche volume. On-premise focus accounts only' },
];

/* ── Returns Pending ─────────────────────────── */
const RETURNS_PENDING = [
  { hometown: 'Dallas', brand: 'Truly Hard Seltzer', cases: 84, reason: 'Code date approaching (Mar 15)', daysPending: 3 },
  { hometown: 'Ennis', brand: 'Truly Hard Seltzer', cases: 42, reason: 'Code date approaching (Mar 15)', daysPending: 5 },
  { hometown: 'Fort Worth', brand: 'Blue Moon Spring', cases: 28, reason: 'Seasonal — end of rotation', daysPending: 2 },
  { hometown: 'Corpus Christi', brand: 'Vizzy', cases: 36, reason: 'Code date (Mar 20) — low velocity', daysPending: 7 },
  { hometown: 'Dallas', brand: 'Keystone Light', cases: 18, reason: 'Damaged — warehouse incident', daysPending: 1 },
  { hometown: 'Laredo', brand: 'Peroni', cases: 22, reason: 'Low demand — reallocate to DFW', daysPending: 4 },
];

export default function InventoryPage() {
  const [selectedHometown, setSelectedHometown] = useState<string>('all');

  // Build inventory for all hometowns
  const inventories = HOMETOWNS.map(h => ({ hometown: h, ...getWarehouseInventory(h) }));
  const totalCases = inventories.reduce((s, inv) => s + inv.total, 0);
  const lowStockCount = INVENTORY_RECOMMENDATIONS.filter(r => r.urgency === 'high').length;
  const spiritsTotal = SPIRITS_CAGE.reduce((s, x) => s + x.cases, 0);
  const returnsTotal = RETURNS_PENDING.reduce((s, x) => s + x.cases, 0);

  const filtered = selectedHometown === 'all' ? inventories : inventories.filter(i => i.hometown.id === selectedHometown);

  return (
    <>
    
      <ActNavigation currentAct={3} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Inventory &middot; Warehouse Operations
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Inventory Management
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {HOMETOWNS.length} warehouses &middot; {BRAND_FAMILIES.length} brands &middot; Real-time stock levels
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Total On-Hand" value={fmtK(totalCases)} accent="#2563EB" sub="Cases across all WHs" stagger={0} />
        <LightKpiCard label="Low Stock Alerts" value={String(lowStockCount)} accent={lowStockCount > 0 ? '#F87171' : '#22C55E'} sub="High urgency items" stagger={1} />
        <LightKpiCard label="Spirits Cage" value={fmt(spiritsTotal)} accent="#F87171" sub="Cases in regulated storage" stagger={2} />
        <LightKpiCard label="Returns Pending" value={fmt(returnsTotal)} accent="#F59E0B" sub={`${RETURNS_PENDING.length} items`} stagger={3} />
        <LightKpiCard label="Warehouses" value={String(HOMETOWNS.length)} accent="#2563EB" sub={`${fmtK(HOMETOWNS.reduce((s, h) => s + h.sqft, 0))} sq ft total`} stagger={4} />
      </div>

      {/* Hometown Filter */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[13px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Warehouse:</span>
        <button
          onClick={() => setSelectedHometown('all')}
          className="text-[13px] font-mono px-3 py-1 rounded-lg border transition-colors"
          style={{
            borderColor: selectedHometown === 'all' ? '#2563EB' : 'var(--pl-border)',
            background: selectedHometown === 'all' ? 'rgba(37,99,235,0.08)' : 'var(--pl-card)',
            color: selectedHometown === 'all' ? '#2563EB' : 'var(--pl-text-muted)',
            fontWeight: selectedHometown === 'all' ? 700 : 400,
          }}
        >
          All
        </button>
        {HOMETOWNS.map(h => (
          <button
            key={h.id}
            onClick={() => setSelectedHometown(h.id)}
            className="text-[13px] font-mono px-3 py-1 rounded-lg border transition-colors"
            style={{
              borderColor: selectedHometown === h.id ? '#2563EB' : 'var(--pl-border)',
              background: selectedHometown === h.id ? 'rgba(37,99,235,0.08)' : 'var(--pl-card)',
              color: selectedHometown === h.id ? '#2563EB' : 'var(--pl-text-muted)',
              fontWeight: selectedHometown === h.id ? 700 : 400,
            }}
          >
            {h.name.replace(' HQ', '')}
          </button>
        ))}
      </div>

      {/* Warehouse Levels — Stacked bar by supplier */}
      <LightSectionCard title="Warehouse Levels by Supplier" className="mb-6">
        <div className="space-y-4">
          {filtered.map(({ hometown, suppliers, total }) => (
            <div key={hometown.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>
                    {hometown.name}
                  </span>
                  <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
                    {fmtK(hometown.sqft)} sq ft
                  </span>
                </div>
                <span className="text-[12px] font-mono font-bold" style={{ color: 'var(--pl-text)' }}>
                  {fmtK(total)} cases
                </span>
              </div>

              {/* Stacked bar */}
              <div className="flex h-5 rounded-full overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                {suppliers.map(s => (
                  <div
                    key={s.supplier}
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(s.cases / total) * 100}%`,
                      background: SUPPLIER_COLORS[s.supplier],
                      minWidth: s.cases > 0 ? 2 : 0,
                    }}
                    title={`${SUPPLIER_NAMES[s.supplier]}: ${fmtK(s.cases)} cases`}
                  />
                ))}
              </div>

              {/* Legend row */}
              <div className="flex items-center gap-3 mt-1">
                {suppliers.filter(s => s.cases > 0).map(s => (
                  <div key={s.supplier} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: SUPPLIER_COLORS[s.supplier] }} />
                    <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
                      {SUPPLIER_NAMES[s.supplier].split(' ')[0]} {fmtK(s.cases)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* Low Stock Alerts */}
      <LightSectionCard title="AI Inventory Recommendations" className="mb-6">
        <div className="space-y-2">
          {INVENTORY_RECOMMENDATIONS.map(rec => {
            const brand = BRAND_FAMILIES.find(b => b.id === rec.brandId);
            const urg = URGENCY_COLORS[rec.urgency];
            const act = ACTION_LABELS[rec.action];
            return (
              <div key={rec.brandId} className="flex items-start gap-4 px-4 py-3 rounded-lg border" style={{ borderColor: 'var(--pl-border)' }}>
                <div className="flex-shrink-0 mt-0.5">
                  <span
                    className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                    style={{ background: urg.bg, color: urg.color }}
                  >
                    {rec.urgency.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>
                      {brand?.name ?? rec.brandId}
                    </span>
                    <span className="text-xs font-bold font-mono" style={{ color: act.color }}>
                      {act.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-1 text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                    <span>Current: <strong>{rec.currentDaysOnHand}d</strong> on-hand</span>
                    <span>Target: <strong>{rec.recommendedDaysOnHand}d</strong></span>
                    <span className="font-bold" style={{ color: rec.currentDaysOnHand < rec.recommendedDaysOnHand ? '#F87171' : '#22C55E' }}>
                      {rec.currentDaysOnHand < rec.recommendedDaysOnHand ? '↓' : '↑'} {Math.abs(rec.currentDaysOnHand - rec.recommendedDaysOnHand)}d gap
                    </span>
                  </div>
                  <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>{rec.reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Spirits Cage */}
      <LightSectionCard title="Spirits Cage — Regulated Inventory" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: 'var(--pl-text-muted)' }}>
                <th className="text-left font-medium pb-3 pl-2">Brand</th>
                <th className="text-right font-medium pb-3">Cases</th>
                <th className="text-right font-medium pb-3">Days On-Hand</th>
                <th className="text-left font-medium pb-3">Status</th>
                <th className="text-left font-medium pb-3 pr-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {SPIRITS_CAGE.map((item, i) => {
                const statusColor = item.status === 'low' ? '#F87171' : item.status === 'high' ? '#F59E0B' : '#22C55E';
                return (
                  <tr key={item.brand} className={i % 2 === 0 ? '' : ''} style={{ background: i % 2 === 0 ? 'var(--pl-stripe)' : undefined }}>
                    <td className="py-2 pl-2 font-semibold" style={{ color: 'var(--pl-text)' }}>{item.brand}</td>
                    <td className="py-2 text-right font-mono" style={{ color: 'var(--pl-text)' }}>{fmt(item.cases)}</td>
                    <td className="py-2 text-right font-mono font-bold" style={{ color: statusColor }}>
                      {item.daysOnHand}d
                    </td>
                    <td className="py-2">
                      <span
                        className="text-xs font-bold font-mono px-1.5 py-0.5 rounded uppercase"
                        style={{
                          background: item.status === 'low' ? 'rgba(248,113,113,0.08)' : item.status === 'high' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)',
                          color: statusColor,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 pr-2 text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>{item.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
          Spirits stored in TABC-compliant locked cage. Separate regulatory tracking required. W-permit and P-permit accounts only.
        </div>
      </LightSectionCard>

      {/* Returns Pending */}
      <LightSectionCard title="Returns Pending" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: 'var(--pl-text-muted)' }}>
                <th className="text-left font-medium pb-3 pl-2">Warehouse</th>
                <th className="text-left font-medium pb-3">Brand</th>
                <th className="text-right font-medium pb-3">Cases</th>
                <th className="text-left font-medium pb-3">Reason</th>
                <th className="text-right font-medium pb-3 pr-2">Days Pending</th>
              </tr>
            </thead>
            <tbody>
              {RETURNS_PENDING.map((ret, i) => (
                <tr key={`${ret.hometown}-${ret.brand}`} className={i % 2 === 0 ? '' : ''} style={{ background: i % 2 === 0 ? 'var(--pl-stripe)' : undefined }}>
                  <td className="py-2 pl-2 font-semibold" style={{ color: 'var(--pl-text)' }}>{ret.hometown}</td>
                  <td className="py-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{ret.brand}</td>
                  <td className="py-2 text-right font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{ret.cases}</td>
                  <td className="py-2 text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>{ret.reason}</td>
                  <td className="py-2 text-right pr-2 font-mono" style={{ color: ret.daysPending >= 5 ? '#F87171' : 'var(--pl-text-muted)' }}>
                    {ret.daysPending}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Inventory levels simulated from quarterly case data. AI recommendations based on seasonal forecast, velocity trends, and supplier allocation constraints.
        Spirits cage tracked separately per TABC regulatory requirements. Days on-hand = current stock &divide; weekly run rate.
      </div>

      {/* ═══════ KEG TRACKING ═══════ */}
      <LightSectionCard title="KEG TRACKING — DEPOSIT MANAGEMENT" className="mt-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <LightKpiCard label="Kegs Out" value={String(KEG_SUMMARY.totalOut)} accent="#3B82F6" />
          <LightKpiCard label="Kegs Returned" value={String(KEG_SUMMARY.totalReturned)} accent="#22C55E" />
          <LightKpiCard label="Deposit Value" value={`$${(KEG_SUMMARY.depositValue / 1000).toFixed(1)}K`} accent="#F59E0B" />
          <LightKpiCard label="Aging >30d" value={String(KEG_SUMMARY.aging30Plus)} accent="#F87171" sub={`$${KEG_SUMMARY.agingValue.toLocaleString()} at risk`} />
          <LightKpiCard label="Return Rate" value={`${((KEG_SUMMARY.totalReturned / KEG_SUMMARY.totalOut) * 100).toFixed(0)}%`} accent="#22C55E" />
        </div>

        {/* Keg by size table */}
        <div className="mb-6">
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--pl-text-muted)' }}>
            BY KEG SIZE
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                  {['Keg Size', 'Out', 'Returned', 'Outstanding', 'Aging >30d', 'Deposit/Unit', 'Deposit Exposure'].map(h => (
                    <th key={h} className="text-left pb-2 pr-4 text-xs uppercase tracking-wider font-bold"
                      style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KEG_BY_SIZE.map((keg) => {
                  const outstanding = keg.out - keg.returned;
                  const exposure = outstanding * keg.depositPer;
                  return (
                    <tr key={keg.size} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{keg.size}</td>
                      <td className="py-1.5 pr-4" style={{ color: '#3B82F6' }}>{keg.out}</td>
                      <td className="py-1.5 pr-4" style={{ color: '#22C55E' }}>{keg.returned}</td>
                      <td className="py-1.5 pr-4 font-bold" style={{ color: '#F59E0B' }}>{outstanding}</td>
                      <td className="py-1.5 pr-4" style={{ color: '#F87171' }}>{keg.aging}</td>
                      <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>${keg.depositPer}</td>
                      <td className="py-1.5 pr-4 font-bold" style={{ color: '#F59E0B' }}>${exposure.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aging Distribution */}
        <div className="text-xs font-bold font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--pl-text-muted)' }}>
          AGING DISTRIBUTION
        </div>
        <div className="grid grid-cols-4 gap-3">
          {KEG_AGING_BUCKETS.map((bucket) => (
            <div key={bucket.label} className="p-3 rounded-lg text-center" style={{
              background: `${bucket.color}08`,
              border: `1px solid ${bucket.color}20`,
            }}>
              <div className="text-2xl font-bold font-mono" style={{ color: bucket.color }}>{bucket.count}</div>
              <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>{bucket.label}</div>
            </div>
          ))}
        </div>
      </LightSectionCard>

    </>
  );
}
