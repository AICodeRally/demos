'use client';

import { useState, useMemo } from 'react';
import { StatCard } from '@/components/demos/wellspring';
import { WELLS, type WellStatus } from '@/data/wellspring/wells';

/* ── Constants ────────────────────────────────────────── */

const PAD_OPTIONS = [
  { id: 'all', label: 'All Pads' },
  { id: 'pad-a', label: 'Mustang' },
  { id: 'pad-b', label: 'Rattlesnake' },
  { id: 'pad-c', label: 'Sidewinder' },
  { id: 'pad-d', label: 'Diamondback' },
];

const STATUS_COLORS: Record<WellStatus, string> = {
  flowing: '#16A34A',
  'shut-in': '#6B7280',
  workover: '#D97706',
  'new-completion': '#7C3AED',
  inactive: '#9CA3AF',
};

const LIFT_LABELS: Record<string, string> = {
  'rod-pump': 'Rod Pump',
  esp: 'ESP',
  'gas-lift': 'Gas Lift',
  'natural-flow': 'Natural Flow',
};

const PAD_LABELS: Record<string, string> = {
  'pad-a': 'Mustang',
  'pad-b': 'Rattlesnake',
  'pad-c': 'Sidewinder',
  'pad-d': 'Diamondback',
};

export default function WellStatusBoardPage() {
  const [padFilter, setPadFilter] = useState('all');

  const filtered = useMemo(
    () =>
      padFilter === 'all'
        ? WELLS
        : WELLS.filter((w) => w.padId === padFilter),
    [padFilter],
  );

  const flowing = filtered.filter((w) => w.status === 'flowing').length;
  const totalOil = filtered.reduce((s, w) => s + w.oilBpd, 0);
  const totalGas = filtered.reduce((s, w) => s + w.gasMcfd, 0);
  const avgWaterCut =
    filtered.filter((w) => w.status === 'flowing').length > 0
      ? (
          (filtered
            .filter((w) => w.status === 'flowing')
            .reduce((s, w) => s + w.waterCut, 0) /
            filtered.filter((w) => w.status === 'flowing').length) *
          100
        ).toFixed(0)
      : '0';

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase mb-1"
          style={{ color: '#B45309' }}
        >
          Act 3 &middot; Production Operations
        </div>
        <h1
          className="text-3xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          Well Status Board
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          {filtered.length} wells &middot;{' '}
          {padFilter === 'all'
            ? 'All pads'
            : PAD_LABELS[padFilter]}{' '}
          &middot; Real-time SCADA status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Flowing"
          value={`${flowing}/${filtered.length}`}
          trend="flat"
          trendValue="active"
        />
        <StatCard
          label="Total Oil"
          value={`${totalOil.toLocaleString()} bopd`}
          trend="up"
          trendValue="+2.4%"
        />
        <StatCard
          label="Total Gas"
          value={`${totalGas.toLocaleString()} Mcfd`}
          trend="up"
          trendValue="+1.8%"
        />
        <StatCard
          label="Avg Water Cut"
          value={`${avgWaterCut}%`}
          trend="up"
          trendValue="+0.5%"
          color="#DC2626"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {PAD_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setPadFilter(opt.id)}
            className="text-[11px] px-4 py-2 rounded-lg transition-colors"
            style={{
              background:
                padFilter === opt.id ? '#B45309' : '#1E2530',
              color: padFilter === opt.id ? '#FFFFFF' : '#94A3B8',
              border:
                padFilter === opt.id
                  ? '1px solid #D97706'
                  : '1px solid #334155',
              fontWeight: padFilter === opt.id ? 700 : 400,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: '#252B36' }}>
                {[
                  'Well Name',
                  'Pad',
                  'Status',
                  'Oil (bpd)',
                  'Gas (Mcfd)',
                  'Water Cut',
                  'Lift Type',
                  'Last Gauge',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[10px] uppercase tracking-wider font-semibold font-semibold"
                    style={{ color: '#94A3B8', borderBottom: '1px solid #334155' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((well) => (
                <tr
                  key={well.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid #252B36' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = '#252B36')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <td className="px-4 py-2.5">
                    <div
                      className="text-[12px] font-semibold"
                      style={{ color: '#F1F5F9' }}
                    >
                      {well.name}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: '#64748B' }}
                    >
                      {well.id}
                    </div>
                  </td>
                  <td
                    className="px-4 py-2.5 text-[11px]"
                    style={{ color: '#CBD5E1' }}
                  >
                    {PAD_LABELS[well.padId]}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: STATUS_COLORS[well.status],
                        }}
                      />
                      <span
                        className="text-[11px] capitalize"
                        style={{ color: '#CBD5E1' }}
                      >
                        {well.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-2.5 text-[12px] font-semibold"
                    style={{
                      color:
                        well.oilBpd > 0 ? '#16A34A' : '#475569',
                    }}
                  >
                    {well.oilBpd > 0
                      ? well.oilBpd.toLocaleString()
                      : '--'}
                  </td>
                  <td
                    className="px-4 py-2.5 text-[12px] font-semibold"
                    style={{
                      color:
                        well.gasMcfd > 0 ? '#EA580C' : '#475569',
                    }}
                  >
                    {well.gasMcfd > 0
                      ? well.gasMcfd.toLocaleString()
                      : '--'}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-12 h-1.5 rounded-full overflow-hidden"
                        style={{ background: '#334155' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${well.waterCut * 100}%`,
                            background:
                              well.waterCut > 0.45
                                ? '#DC2626'
                                : well.waterCut > 0.35
                                  ? '#D97706'
                                  : '#2563EB',
                          }}
                        />
                      </div>
                      <span
                        className="text-[11px]"
                        style={{
                          color:
                            well.waterCut > 0.45
                              ? '#EF4444'
                              : '#CBD5E1',
                        }}
                      >
                        {(well.waterCut * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-2.5 text-[11px]"
                    style={{ color: '#CBD5E1' }}
                  >
                    {LIFT_LABELS[well.liftType]}
                  </td>
                  <td
                    className="px-4 py-2.5 text-[11px]"
                    style={{ color: '#64748B' }}
                  >
                    {well.lastGauge}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
