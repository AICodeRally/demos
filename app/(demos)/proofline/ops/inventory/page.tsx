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
    const cases = Math.round(baseFactor * share * (0.8 + Math.random() * 0.4));
    return { supplier: s, cases, share };
  });
  const total = suppliers.reduce((s, x) => s + x.cases, 0);
  return { suppliers, total };
}

/* ── Urgency config ──────────────────────────── */
const URGENCY_COLORS: Record<string, { color: string; bg: string }> = {
  high:   { color: '#F87171', bg: 'rgba(248,113,113,0.08)' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  low:    { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
};

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  increase: { label: 'INCREASE', color: '#22C55E' },
  reduce:   { label: 'REDUCE', color: '#F87171' },
  maintain: { label: 'MAINTAIN', color: '#718096' },
};

/* ── Spirits Cage (regulatory) ───────────────── */
const SPIRITS_CAGE = [
  { brand: 'Buffalo Trace', cases: 420, daysOnHand: 4, status: 'low' as const, note: 'Sazerac allocation limited — lock in Q2 POs' },
  { brand: 'Eagle Rare', cases: 180, daysOnHand: 6, status: 'ok' as const, note: 'Allocated. No reorder until April' },
  { brand: 'Fireball', cases: 650, daysOnHand: 8, status: 'high' as const, note: 'Post-holiday overhang — redistribute to South TX' },
  { brand: 'Jack Daniel\'s Tennessee', cases: 340, daysOnHand: 5, status: 'ok' as const, note: 'Tracking to plan' },
  { brand: 'Maker\'s Mark', cases: 210, daysOnHand: 3, status: 'low' as const, note: 'Below safety stock — expedite order' },
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
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>
          Inventory Management
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
          {HOMETOWNS.length} warehouses &middot; {BRAND_FAMILIES.length} brands &middot; Real-time stock levels
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6 items-stretch">
        <LightKpiCard label="Total On-Hand" value={fmtK(totalCases)} accent="#2563EB" sub="Cases across all WHs" />
        <LightKpiCard label="Low Stock Alerts" value={String(lowStockCount)} accent={lowStockCount > 0 ? '#F87171' : '#22C55E'} sub="High urgency items" />
        <LightKpiCard label="Spirits Cage" value={fmt(spiritsTotal)} accent="#F87171" sub="Cases in regulated storage" />
        <LightKpiCard label="Returns Pending" value={fmt(returnsTotal)} accent="#F59E0B" sub={`${RETURNS_PENDING.length} items`} />
        <LightKpiCard label="Warehouses" value={String(HOMETOWNS.length)} accent="#2563EB" sub={`${fmtK(HOMETOWNS.reduce((s, h) => s + h.sqft, 0))} sq ft total`} />
      </div>

      {/* Hometown Filter */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[13px] font-mono" style={{ color: '#718096' }}>Warehouse:</span>
        <button
          onClick={() => setSelectedHometown('all')}
          className="text-[13px] font-mono px-3 py-1 rounded-lg border transition-colors"
          style={{
            borderColor: selectedHometown === 'all' ? '#2563EB' : '#E2E8F0',
            background: selectedHometown === 'all' ? 'rgba(37,99,235,0.08)' : 'white',
            color: selectedHometown === 'all' ? '#2563EB' : '#718096',
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
              borderColor: selectedHometown === h.id ? '#2563EB' : '#E2E8F0',
              background: selectedHometown === h.id ? 'rgba(37,99,235,0.08)' : 'white',
              color: selectedHometown === h.id ? '#2563EB' : '#718096',
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
                  <span className="text-[13px] font-bold" style={{ color: '#1A1A2E' }}>
                    {hometown.name}
                  </span>
                  <span className="text-xs font-mono" style={{ color: '#A0AEC0' }}>
                    {fmtK(hometown.sqft)} sq ft
                  </span>
                </div>
                <span className="text-[12px] font-mono font-bold" style={{ color: '#1A1A2E' }}>
                  {fmtK(total)} cases
                </span>
              </div>

              {/* Stacked bar */}
              <div className="flex h-5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
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
                    <span className="text-xs font-mono" style={{ color: '#A0AEC0' }}>
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
              <div key={rec.brandId} className="flex items-start gap-4 px-4 py-3 rounded-lg border" style={{ borderColor: '#E2E8F0' }}>
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
                    <span className="text-[12px] font-bold" style={{ color: '#1A1A2E' }}>
                      {brand?.name ?? rec.brandId}
                    </span>
                    <span className="text-xs font-bold font-mono" style={{ color: act.color }}>
                      {act.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-1 text-xs font-mono" style={{ color: '#718096' }}>
                    <span>Current: <strong>{rec.currentDaysOnHand}d</strong> on-hand</span>
                    <span>Target: <strong>{rec.recommendedDaysOnHand}d</strong></span>
                    <span className="font-bold" style={{ color: rec.currentDaysOnHand < rec.recommendedDaysOnHand ? '#F87171' : '#22C55E' }}>
                      {rec.currentDaysOnHand < rec.recommendedDaysOnHand ? '↓' : '↑'} {Math.abs(rec.currentDaysOnHand - rec.recommendedDaysOnHand)}d gap
                    </span>
                  </div>
                  <p className="text-[13px]" style={{ color: '#718096' }}>{rec.reason}</p>
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
              <tr style={{ color: '#718096' }}>
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
                  <tr key={item.brand} className={i % 2 === 0 ? 'bg-[#F8FAFC]' : ''}>
                    <td className="py-2 pl-2 font-semibold" style={{ color: '#1A1A2E' }}>{item.brand}</td>
                    <td className="py-2 text-right font-mono" style={{ color: '#1A1A2E' }}>{fmt(item.cases)}</td>
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
                    <td className="py-2 pr-2 text-[13px]" style={{ color: '#718096' }}>{item.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs font-mono" style={{ color: '#A0AEC0' }}>
          Spirits stored in TABC-compliant locked cage. Separate regulatory tracking required. W-permit and P-permit accounts only.
        </div>
      </LightSectionCard>

      {/* Returns Pending */}
      <LightSectionCard title="Returns Pending" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: '#718096' }}>
                <th className="text-left font-medium pb-3 pl-2">Warehouse</th>
                <th className="text-left font-medium pb-3">Brand</th>
                <th className="text-right font-medium pb-3">Cases</th>
                <th className="text-left font-medium pb-3">Reason</th>
                <th className="text-right font-medium pb-3 pr-2">Days Pending</th>
              </tr>
            </thead>
            <tbody>
              {RETURNS_PENDING.map((ret, i) => (
                <tr key={`${ret.hometown}-${ret.brand}`} className={i % 2 === 0 ? 'bg-[#F8FAFC]' : ''}>
                  <td className="py-2 pl-2 font-semibold" style={{ color: '#1A1A2E' }}>{ret.hometown}</td>
                  <td className="py-2 font-mono" style={{ color: '#718096' }}>{ret.brand}</td>
                  <td className="py-2 text-right font-mono font-bold" style={{ color: '#1A1A2E' }}>{ret.cases}</td>
                  <td className="py-2 text-[13px]" style={{ color: '#718096' }}>{ret.reason}</td>
                  <td className="py-2 text-right pr-2 font-mono" style={{ color: ret.daysPending >= 5 ? '#F87171' : '#718096' }}>
                    {ret.daysPending}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: '#A0AEC0' }}>
        Inventory levels simulated from quarterly case data. AI recommendations based on seasonal forecast, velocity trends, and supplier allocation constraints.
        Spirits cage tracked separately per TABC regulatory requirements. Days on-hand = current stock &divide; weekly run rate.
      </div>
    
    </>
  );
}
