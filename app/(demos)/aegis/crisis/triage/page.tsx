'use client';

import {
  StatCard,
  SeverityGauge,
  BubbleChart,
  WaterfallChart,
  CountdownTimer,
  PrivilegeBadge,
} from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const STAKEHOLDER_BUBBLES = [
  { x: 90, y: 85, size: 35, color: '#DC2626', label: 'SEC' },
  { x: 70, y: 75, size: 25, color: '#DC2626', label: 'State AGs' },
  { x: 85, y: 60, size: 40, color: '#EA580C', label: 'Customers' },
  { x: 60, y: 90, size: 20, color: '#7C3AED', label: 'Board' },
  { x: 80, y: 50, size: 30, color: '#EA580C', label: 'Media' },
  { x: 40, y: 70, size: 15, color: '#059669', label: 'Insurance' },
];

interface RegRow {
  jurisdiction: string;
  law: string;
  deadline: string;
  triggered: 'Yes' | 'Assessing';
  countdownDeadline: string;
}

const REGULATORY_TRIGGERS: RegRow[] = [
  { jurisdiction: 'Federal (SEC)', law: 'Reg S-P', deadline: '4 business days', triggered: 'Yes', countdownDeadline: '2026-03-07T02:47:00Z' },
  { jurisdiction: 'California', law: 'CCPA', deadline: '72 hours', triggered: 'Yes', countdownDeadline: '2026-03-04T02:47:00Z' },
  { jurisdiction: 'New York', law: 'SHIELD Act', deadline: '60 days', triggered: 'Yes', countdownDeadline: '2026-04-30T02:47:00Z' },
  { jurisdiction: 'Massachusetts', law: '201 CMR 17', deadline: '30 days', triggered: 'Yes', countdownDeadline: '2026-03-31T02:47:00Z' },
  { jurisdiction: 'GDPR (EU)', law: 'Art. 33', deadline: '72 hours', triggered: 'Assessing', countdownDeadline: '2026-03-04T02:47:00Z' },
];

const WATERFALL_DATA = [
  { label: 'Initial Breach', value: 2.3, type: 'add' as const },
  { label: 'Reg. Notice', value: 4.2, type: 'add' as const },
  { label: 'Media Exposure', value: 3.8, type: 'add' as const },
  { label: 'Litigation Risk', value: 6.2, type: 'add' as const },
  { label: 'Stock Impact', value: 5.5, type: 'add' as const },
  { label: 'Total Exposure', value: 22.0, type: 'total' as const },
];

const CLASSIFICATION = [
  { label: 'Incident Type', value: 'Cyber Breach', badgeBg: '#EFF6FF', badgeColor: '#2563EB' },
  { label: 'Severity', value: 'Critical', badgeBg: '#FEF2F2', badgeColor: '#DC2626' },
  { label: 'Privilege Status', value: 'Activated', badgeBg: '#F5F3FF', badgeColor: '#7C3AED', showPrivilege: true },
  { label: 'Regulatory Scope', value: 'Federal + 3 States', badgeBg: '#FFFBEB', badgeColor: '#D97706' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function TriageDashboard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Triage Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Multi-dimensional risk assessment &mdash; Meridian Dynamics</p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Est. Exposure" value="$22M" color="#DC2626" sparkline={[8, 12, 15, 18, 20, 22]} />
        <StatCard label="Jurisdictions" value="4" color="#7C3AED" />
        <StatCard label="Stakeholder Groups" value="6" color="#8B7355" />
        <StatCard label="Response Window" value="72hr" color="#DC2626" sparkline={[72, 64, 56, 48, 40, 32]} />
      </div>

      {/* Two-column: SeverityGauge + BubbleChart */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Legal Exposure</h2>
          <div className="flex justify-center">
            <SeverityGauge value={78} max={100} label="Legal Exposure" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#F5F5F4' }}>
              <p className="text-lg font-bold" style={{ color: '#DC2626' }}>4</p>
              <p className="text-[10px]" style={{ color: '#57534E' }}>Active Jurisdictions</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#F5F5F4' }}>
              <p className="text-lg font-bold" style={{ color: '#7C3AED' }}>7</p>
              <p className="text-[10px]" style={{ color: '#57534E' }}>Regulatory Triggers</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: '#1C1917' }}>Stakeholder Impact Matrix</h2>
          <BubbleChart data={STAKEHOLDER_BUBBLES} xLabel="Urgency" yLabel="Influence" height={280} />
        </div>
      </div>

      {/* Regulatory Trigger Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Regulatory Trigger Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['Jurisdiction', 'Law', 'Deadline', 'Triggered', 'Countdown'].map((h) => (
                  <th key={h} className="text-left pb-3 font-semibold text-[11px] uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REGULATORY_TRIGGERS.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < REGULATORY_TRIGGERS.length - 1 ? '1px solid #F5F5F4' : 'none' }}>
                  <td className="py-3 font-medium" style={{ color: '#1C1917' }}>{r.jurisdiction}</td>
                  <td className="py-3" style={{ color: '#57534E' }}>{r.law}</td>
                  <td className="py-3" style={{ color: '#57534E' }}>{r.deadline}</td>
                  <td className="py-3">
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: r.triggered === 'Yes' ? '#FEF2F2' : '#FFFBEB',
                        color: r.triggered === 'Yes' ? '#DC2626' : '#D97706',
                      }}
                    >
                      {r.triggered}
                    </span>
                  </td>
                  <td className="py-3" style={{ minWidth: 200 }}>
                    <CountdownTimer deadline={r.countdownDeadline} label={r.law} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Waterfall: Risk Cascade */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Risk Cascade ($M)</h2>
        <WaterfallChart data={WATERFALL_DATA} height={280} />
      </div>

      {/* Classification Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CLASSIFICATION.map((c) => (
          <div key={c.label} className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: '#A8A29E' }}>{c.label}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: c.badgeBg, color: c.badgeColor }}
              >
                {c.value}
              </span>
              {c.showPrivilege && <PrivilegeBadge size="sm" />}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
