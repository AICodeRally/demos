'use client';

import { StatCard, WaterfallChart, BarChart } from '@/components/demos/crestline';
import { COLORS } from '@/data/crestline';
import { CheckCircle, ShieldCheck } from 'lucide-react';

/* ── Waterfall: X-in-X-out reconciliation ── */
const RECONCILIATION_WATERFALL = [
  { label: 'Comm. Sales', value: 4200000, type: 'total' as const },
  { label: 'Basic', value: 210000, type: 'add' as const },
  { label: 'Premium', value: 84000, type: 'add' as const },
  { label: 'Counter Lead', value: 12000, type: 'add' as const },
  { label: 'Scorecard', value: 21000, type: 'add' as const },
  { label: 'Adjustments', value: 3000, type: 'subtract' as const },
  { label: 'Total Payout', value: 324000, type: 'total' as const },
];

/* ── Guarantee floor data ── */
const GUARANTEE_TABLE = [
  { name: 'Sarah Kim', commission: 1240, guarantee: 1450, floorApplied: true, payout: 1450 },
  { name: 'Chris Nakamura', commission: 980, guarantee: 1200, floorApplied: true, payout: 1200 },
  { name: 'Tyler Morrison', commission: 2100, guarantee: 1400, floorApplied: false, payout: 2100 },
];

/* ── Hours-to-commission reconciliation ── */
const HOURS_RECONCILIATION = [
  { name: 'Sarah Kim', sellingHours: 80, hourlyRate: 18.13, minGuarantee: 1450, actualCommission: 1240, delta: -210 },
  { name: 'Chris Nakamura', sellingHours: 76, hourlyRate: 15.79, minGuarantee: 1200, actualCommission: 980, delta: -220 },
  { name: 'Tyler Morrison', sellingHours: 82, hourlyRate: 17.07, minGuarantee: 1400, actualCommission: 2100, delta: 700 },
  { name: 'Diana Okafor', sellingHours: 78, hourlyRate: 16.67, minGuarantee: 1300, actualCommission: 1850, delta: 550 },
  { name: 'Roberto Diaz', sellingHours: 72, hourlyRate: 16.39, minGuarantee: 1180, actualCommission: 1420, delta: 240 },
];

/* ── Integration timeline steps ── */
const TIMELINE_STEPS = [
  { label: 'Commission Calc', offset: 'T+0', color: '#2563eb' },
  { label: 'Guarantee Check', offset: 'T+1hr', color: '#7c3aed' },
  { label: 'EIB Export', offset: 'T+2hr', color: '#d946ef' },
  { label: 'Payroll Submit', offset: 'T+4hr', color: '#059669' },
];

/* ── Integration status indicators ── */
const STATUS_ITEMS = [
  { label: 'EIB Feed Ready', ok: true },
  { label: 'Payroll Batch Processed', ok: true },
  { label: 'Guarantee Calc Complete', ok: true },
  { label: 'Statements Generated', ok: true },
];

export default function PayrollOutput() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>
          Payroll Output & Reconciliation
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          X-in-X-out reconciliation, guarantee floors, and Workday integration — Phil Step 10
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Payout" value="$324K" trend="up" trendValue="+4.2% vs last period" color={COLORS.accent} sparkline={[290, 298, 305, 312, 318, 324]} />
        <StatCard label="Guarantees Applied" value="12" trend="down" trendValue="-3 vs last period" color="#d946ef" sparkline={[18, 16, 15, 14, 15, 12]} />
        <StatCard label="Avg Commission" value="$2,840" trend="up" trendValue="+$120" color="#7c3aed" sparkline={[2540, 2620, 2680, 2720, 2780, 2840]} />
        <StatCard label="Processing Time" value="2.1 hrs" trend="down" trendValue="-0.4 hrs" color="#059669" sparkline={[3.2, 2.9, 2.8, 2.5, 2.3, 2.1]} />
      </div>

      {/* X-in-X-out Reconciliation Waterfall */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>
            X-in-X-out Reconciliation
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--pl-text-muted)' }}>
            $4.2M commissionable sales flowing through 5 streams to $324K total payout
          </p>
          <WaterfallChart data={RECONCILIATION_WATERFALL} height={300} />
        </div>

        {/* Flow breakdown cards */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Payout Flow Breakdown
          </p>
          <div className="space-y-2">
            {[
              { label: 'Total Commissionable Sales', amount: '$4,200,000', pct: '', color: '#1a1f3d', bg: 'var(--pl-bg)' },
              { label: 'Basic Commission', amount: '$210,000', pct: '5.0%', color: '#2563eb', bg: '#eff6ff' },
              { label: 'Premium Commission', amount: '$84,000', pct: '2.0%', color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'Counter Lead Bonus', amount: '$12,000', pct: '0.3%', color: '#d946ef', bg: '#fdf4ff' },
              { label: 'Scorecard Bonus', amount: '$21,000', pct: '0.5%', color: '#059669', bg: '#ecfdf5' },
              { label: 'Adjustments', amount: '-$3,000', pct: '', color: '#DC2626', bg: '#fef2f2' },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg px-4 py-2.5"
                style={{ backgroundColor: row.bg }}
              >
                <div className="flex items-center gap-3">
                  {i > 0 && i < 5 && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
                  )}
                  {i === 0 && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />}
                  {i === 5 && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />}
                  <span className="text-xs font-medium" style={{ color: row.color }}>{row.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  {row.pct && (
                    <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{row.pct}</span>
                  )}
                  <span className="text-sm font-bold font-mono" style={{ color: row.color }}>{row.amount}</span>
                </div>
              </div>
            ))}
            {/* Total */}
            <div
              className="flex items-center justify-between rounded-lg px-4 py-3 mt-1"
              style={{ backgroundColor: COLORS.primary }}
            >
              <span className="text-xs font-bold text-white">Total Payout</span>
              <span className="text-base font-bold font-mono" style={{ color: COLORS.accent }}>$324,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee Calculation */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>
            Guarantee Floor Calculation
          </p>
          <span
            className="text-[10px] font-mono px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
          >
            hourly_minimum_enforcement
          </span>
        </div>
        <p className="text-xs mb-5" style={{ color: 'var(--pl-text-muted)' }}>
          When commission falls below the hourly minimum, the guarantee floor kicks in automatically
        </p>

        <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ color: 'var(--pl-text-muted)' }}>
              <th className="text-left pb-3 font-medium">Associate</th>
              <th className="text-right pb-3 font-medium">Commission Earned</th>
              <th className="text-right pb-3 font-medium">Hourly Guarantee</th>
              <th className="text-center pb-3 font-medium">Floor Applied</th>
              <th className="text-right pb-3 font-medium">Final Payout</th>
            </tr>
          </thead>
          <tbody>
            {GUARANTEE_TABLE.map((row, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--pl-stripe)' }}>
                <td className="py-3">
                  <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{row.name}</span>
                </td>
                <td className="py-3 text-right font-mono" style={{ color: row.floorApplied ? '#DC2626' : 'var(--pl-text-secondary)' }}>
                  ${row.commission.toLocaleString()}
                </td>
                <td className="py-3 text-right font-mono" style={{ color: 'var(--pl-text-secondary)' }}>
                  ${row.guarantee.toLocaleString()}
                </td>
                <td className="py-3 text-center">
                  {row.floorApplied ? (
                    <span
                      className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                    >
                      YES
                    </span>
                  ) : (
                    <span
                      className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
                    >
                      NO
                    </span>
                  )}
                </td>
                <td className="py-3 text-right font-mono font-bold" style={{ color: 'var(--pl-text)' }}>
                  ${row.payout.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Hours-to-Commission Reconciliation */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>
          Hours-to-Commission Reconciliation
        </p>
        <p className="text-xs mb-5" style={{ color: 'var(--pl-text-muted)' }}>
          Selling hours from Workday mapped against commission output — delta determines guarantee eligibility
        </p>

        <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ color: 'var(--pl-text-muted)' }}>
              <th className="text-left pb-3 font-medium">Associate</th>
              <th className="text-right pb-3 font-medium">Selling Hours</th>
              <th className="text-right pb-3 font-medium">Hourly Rate</th>
              <th className="text-right pb-3 font-medium">Min Guarantee</th>
              <th className="text-right pb-3 font-medium">Actual Commission</th>
              <th className="text-right pb-3 font-medium">Delta</th>
            </tr>
          </thead>
          <tbody>
            {HOURS_RECONCILIATION.map((row, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--pl-stripe)' }}>
                <td className="py-3">
                  <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{row.name}</span>
                </td>
                <td className="py-3 text-right font-mono" style={{ color: 'var(--pl-text-secondary)' }}>{row.sellingHours}</td>
                <td className="py-3 text-right font-mono" style={{ color: 'var(--pl-text-secondary)' }}>${row.hourlyRate.toFixed(2)}</td>
                <td className="py-3 text-right font-mono" style={{ color: 'var(--pl-text-secondary)' }}>${row.minGuarantee.toLocaleString()}</td>
                <td className="py-3 text-right font-mono" style={{ color: 'var(--pl-text-secondary)' }}>${row.actualCommission.toLocaleString()}</td>
                <td className="py-3 text-right font-mono font-bold" style={{ color: row.delta < 0 ? '#DC2626' : '#059669' }}>
                  {row.delta < 0 ? '-' : '+'}${Math.abs(row.delta).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="mt-4 rounded-lg px-4 py-2.5" style={{ backgroundColor: '#FEF3C7' }}>
          <p className="text-[11px]" style={{ color: '#92400e' }}>
            <span className="font-bold">Note:</span> Negative deltas trigger automatic guarantee floor. Selling hours sourced from Workday time management feed (EIB import).
          </p>
        </div>
      </div>

      {/* Payroll Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Status Panel */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>
              Payroll Integration Status
            </p>
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1d4ed8' }} />
              Workday Integration
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {STATUS_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
                style={{ backgroundColor: '#ecfdf5' }}
              >
                <CheckCircle size={16} style={{ color: '#059669' }} />
                <span className="text-xs font-medium" style={{ color: '#059669' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--pl-bg)' }}>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p style={{ color: 'var(--pl-text-muted)' }}>Records Processed</p>
                <p className="font-bold text-base" style={{ color: 'var(--pl-text)' }}>3,247</p>
              </div>
              <div>
                <p style={{ color: 'var(--pl-text-muted)' }}>Errors</p>
                <p className="font-bold text-base" style={{ color: '#059669' }}>0</p>
              </div>
              <div>
                <p style={{ color: 'var(--pl-text-muted)' }}>Batch ID</p>
                <p className="font-mono font-medium" style={{ color: 'var(--pl-text-secondary)' }}>CL-2026-PP04-001</p>
              </div>
              <div>
                <p style={{ color: 'var(--pl-text-muted)' }}>Last Run</p>
                <p className="font-mono font-medium" style={{ color: 'var(--pl-text-secondary)' }}>Mar 31, 06:00 UTC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Timeline */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-5" style={{ color: 'var(--pl-text)' }}>
            Integration Timeline
          </p>

          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                {/* Timeline track */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: step.color }}
                  >
                    {i + 1}
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className="w-0.5 h-12" style={{ backgroundColor: 'var(--pl-border)' }} />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1 pb-6">
                  <p className="text-xs font-bold" style={{ color: 'var(--pl-text)' }}>{step.label}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: step.color }}>{step.offset}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total processing bar */}
          <div className="mt-4 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--pl-stripe)' }}>
            <div className="h-2 rounded-lg" style={{ width: '100%', background: `linear-gradient(90deg, #2563eb, #7c3aed, #d946ef, #059669)` }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>T+0</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: '#059669' }}>T+4hr (complete)</span>
          </div>
        </div>
      </div>

      {/* Commission Distribution Bar Chart */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>
          Payout Distribution by Component
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-muted)' }}>
          How $324K total payout breaks down across commission streams
        </p>
        <BarChart
          data={[
            { label: 'Basic Commission', value: 210, color: '#2563eb' },
            { label: 'Premium Commission', value: 84, color: '#7c3aed' },
            { label: 'Scorecard Bonus', value: 21, color: '#059669' },
            { label: 'Counter Lead', value: 12, color: '#d946ef' },
            { label: 'Adjustments', value: 3, color: '#DC2626' },
          ]}
          unit="K"
          color={COLORS.accent}
        />
      </div>

      {/* Build vs Buy Callout */}
      <div
        className="rounded-xl border-2 p-6 flex items-start gap-4"
        style={{ borderColor: COLORS.accent, backgroundColor: `${COLORS.accent}08` }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${COLORS.accent}20` }}
        >
          <ShieldCheck size={20} style={{ color: COLORS.accent }} />
        </div>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--pl-text)' }}>Payroll Integrity</p>
          <p className="text-sm" style={{ color: 'var(--pl-text-secondary)' }}>
            The X-in-X-out reconciliation ensures <span className="font-semibold" style={{ color: 'var(--pl-text)' }}>every dollar is traceable</span> from
            commissionable sale to payroll submission. Guarantee floors are calculated automatically using Workday selling hours,
            eliminating the manual spreadsheet process that previously required <span className="font-semibold" style={{ color: 'var(--pl-text)' }}>12 hours of payroll admin time</span> per cycle.
            EIB feeds are generated in Workday-native format, ready for direct import.
          </p>
        </div>
      </div>
    </>
  );
}
