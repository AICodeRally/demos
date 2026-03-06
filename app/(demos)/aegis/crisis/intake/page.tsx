'use client';

import { SeverityGauge, ConfidenceBand, PrivilegeBadge } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const EXPOSURE_BAND = [
  { label: 'Q1', value: 14, low: 12, high: 18 },
  { label: 'Q2', value: 18, low: 13, high: 24 },
  { label: 'Q3', value: 22, low: 15, high: 32 },
  { label: 'Q4', value: 25, low: 16, high: 38 },
  { label: 'Q5', value: 28, low: 18, high: 40 },
  { label: 'Q6', value: 24, low: 14, high: 42 },
  { label: 'Q7', value: 26, low: 15, high: 44 },
  { label: 'Q8', value: 22, low: 12, high: 47 },
];

const INCIDENT_DETAILS = [
  { label: 'Type', value: 'Cyber Breach — Data Exfiltration' },
  { label: 'Reported By', value: 'CISO Office, Meridian Dynamics' },
  { label: 'Timestamp', value: '2026-03-01 02:47 UTC' },
  { label: 'Systems Affected', value: 'Customer DB, Payment Gateway, CRM' },
  { label: 'Records Exposed', value: '2,300,000' },
];

const BLAST_RADIUS = [
  { ring: 'outer', label: 'Media / Partners / Investors', color: '#FEFCE8', borderColor: '#EAB308', size: 320 },
  { ring: 'middle', label: 'Customers / Regulators', color: '#FFF7ED', borderColor: '#EA580C', size: 220 },
  { ring: 'inner', label: 'Board / CEO', color: '#FEF2F2', borderColor: '#DC2626', size: 120 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function IncidentIntake() {
  return (
    <>
      {/* RED ALERT BANNER */}
      <div
        className="mb-6 rounded-xl px-6 py-4 flex items-center gap-4"
        style={{
          backgroundColor: 'rgba(220, 38, 38, 0.10)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
        }}
      >
        {/* Pulsing red dot */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: '#DC2626' }}
          />
          <span
            className="relative inline-flex h-3 w-3 rounded-full"
            style={{ backgroundColor: '#DC2626' }}
          />
        </span>
        <span className="text-sm font-bold tracking-wide" style={{ color: '#DC2626' }}>
          INCIDENT REPORTED — Meridian Dynamics — Data Breach — 2.3M Records — CRITICAL
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Incident Intake</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Active incident classification and initial assessment</p>
      </div>

      {/* Two-column: SeverityGauge + ConfidenceBand */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Severity Score</h2>
          <div className="flex justify-center">
            <SeverityGauge
              value={92}
              max={100}
              label="CRITICAL"
              zones={[
                { threshold: 25, color: '#059669' },
                { threshold: 50, color: '#EAB308' },
                { threshold: 75, color: '#EA580C' },
                { threshold: 100, color: '#DC2626' },
              ]}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            {[
              { range: '0-25', color: '#059669', label: 'Low' },
              { range: '25-50', color: '#EAB308', label: 'Medium' },
              { range: '50-75', color: '#EA580C', label: 'High' },
              { range: '75-100', color: '#DC2626', label: 'Critical' },
            ].map((z) => (
              <div key={z.range} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: z.color }} />
                <span className="text-[10px]" style={{ color: '#A8A29E' }}>{z.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: '#1C1917' }}>Financial Exposure Estimate</h2>
          <p className="text-[11px] mb-3" style={{ color: '#A8A29E' }}>Range: $12M — $47M (central: $22-28M)</p>
          <ConfidenceBand data={EXPOSURE_BAND} color="#DC2626" height={180} />
        </div>
      </div>

      {/* Stakeholder Blast Radius */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-6" style={{ color: '#1C1917' }}>Stakeholder Blast Radius</h2>
        <div className="flex justify-center">
          <div className="relative" style={{ width: 340, height: 340 }}>
            {BLAST_RADIUS.map((ring) => (
              <div
                key={ring.ring}
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: ring.size,
                  height: ring.size,
                  top: (340 - ring.size) / 2,
                  left: (340 - ring.size) / 2,
                  backgroundColor: ring.color,
                  border: `2px solid ${ring.borderColor}`,
                }}
              >
                {ring.ring === 'inner' && (
                  <span className="text-[11px] font-semibold text-center px-2" style={{ color: '#DC2626' }}>
                    Board / CEO
                  </span>
                )}
              </div>
            ))}
            {/* Middle ring label — positioned on the ring edge */}
            <span
              className="absolute text-[10px] font-medium text-center"
              style={{ color: '#EA580C', top: 36, left: '50%', transform: 'translateX(-50%)' }}
            >
              Customers / Regulators
            </span>
            {/* Outer ring label — positioned on the ring edge */}
            <span
              className="absolute text-[10px] font-medium text-center"
              style={{ color: '#A16207', top: 8, left: '50%', transform: 'translateX(-50%)' }}
            >
              Media / Partners / Investors
            </span>
          </div>
        </div>
      </div>

      {/* Two-column: Incident Detail + Playbook */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Incident Detail Card */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Incident Details</h2>
          <div className="space-y-3">
            {INCIDENT_DETAILS.map((d) => (
              <div key={d.label} className="flex justify-between items-start gap-4">
                <span className="text-xs font-medium shrink-0" style={{ color: '#A8A29E' }}>{d.label}</span>
                <span className="text-xs text-right" style={{ color: '#1C1917' }}>{d.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center gap-4 pt-2" style={{ borderTop: '1px solid #F5F5F4' }}>
              <span className="text-xs font-medium" style={{ color: '#A8A29E' }}>Initial Classification</span>
              <span
                className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
              >
                CRITICAL
              </span>
            </div>
          </div>
        </div>

        {/* Auto-Matched Playbook */}
        <div
          className="rounded-xl bg-white p-6"
          style={{ border: '1px solid #E7E5E4', borderLeft: '4px solid #8B7355' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Auto-Matched Playbook</h2>
            <PrivilegeBadge size="md" />
          </div>
          <p className="text-base font-bold mb-3" style={{ color: '#1C1917' }}>Cyber Breach Response v3.2</p>

          {/* Match confidence */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px]" style={{ color: '#57534E' }}>Match confidence</span>
              <span className="text-[12px] font-bold" style={{ color: '#8B7355' }}>94%</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#F5F5F4' }}>
              <div className="h-full rounded-full" style={{ width: '94%', backgroundColor: '#8B7355' }} />
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]" style={{ color: '#57534E' }}>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold" style={{ color: '#1C1917' }}>12</span> phases
            </span>
            <span className="flex items-center gap-1.5">
              avg <span className="font-semibold" style={{ color: '#1C1917' }}>14.2 days</span> to resolution
            </span>
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #F5F5F4' }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: '#A8A29E' }}>Playbook Actions</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {['Immediate evidence preservation', 'Stakeholder notification cascade', 'Forensic analysis initiation'].map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center rounded-full text-[9px] font-bold"
                    style={{ width: 18, height: 18, backgroundColor: '#F5F5F4', color: '#8B7355' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[11px]" style={{ color: '#57534E' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Severity scale bar */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#A8A29E' }}>Impact Scale</h2>
        <div className="flex items-center gap-1">
          {Array.from({ length: 20 }).map((_, i) => {
            const isActive = i < Math.round(92 / 5);
            return (
              <div
                key={i}
                className="flex-1 h-3 rounded-sm"
                style={{
                  backgroundColor: isActive
                    ? i < 5 ? '#059669' : i < 10 ? '#EAB308' : i < 15 ? '#EA580C' : '#DC2626'
                    : '#F5F5F4',
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px]" style={{ color: '#059669' }}>Low</span>
          <span className="text-[10px]" style={{ color: '#EAB308' }}>Medium</span>
          <span className="text-[10px]" style={{ color: '#EA580C' }}>High</span>
          <span className="text-[10px] font-bold" style={{ color: '#DC2626' }}>Critical (92)</span>
        </div>
      </div>
    </>
  );
}
