'use client';

import { StatCard, CrisisTimeline } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const PHASE_MARKERS = [
  { label: 'Detection', range: 'T+0h to T+1h', color: '#78716C', active: false },
  { label: 'Mobilization', range: 'T+1h to T+4h', color: '#DC2626', active: false },
  { label: 'Active Response', range: 'T+4h to present', color: '#7C3AED', active: true },
  { label: 'Resolution', range: 'upcoming', color: '#059669', active: false },
];

const PIVOT_TITLES = new Set([
  'CEO Statement Released',
  'Containment Achieved',
  'SEC Form 8-K Filed',
]);

const TIMELINE_EVENTS = [
  { time: 'T+0:00', title: 'Breach Detected', description: 'Anomalous data exfiltration detected by SIEM — customer database targeted', type: 'cyber' as const },
  { time: 'T+0:15', title: 'CISO Notification', description: 'CISO office notified, initial assessment begun — scope unknown', type: 'internal' as const },
  { time: 'T+0:47', title: 'Ironclad Engaged', description: 'Retainer activated, privilege umbrella established for all response communications', type: 'legal' as const, privileged: true },
  { time: 'T+1:15', title: 'Forensics Deployed', description: 'Cyber IR team begins forensic analysis of compromised systems', type: 'cyber' as const },
  { time: 'T+1:30', title: 'Scope Identified', description: '2.3M customer records confirmed exposed — PII including SSNs and financial data', type: 'cyber' as const },
  { time: 'T+2:00', title: 'Regulatory Assessment', description: 'SEC, CCPA, SHIELD Act obligations identified — multi-jurisdiction filing required', type: 'regulatory' as const, privileged: true },
  { time: 'T+2:30', title: 'Media Monitoring Activated', description: 'First media reports detected — Reuters, Bloomberg, WSJ covering the breach', type: 'media' as const },
  { time: 'T+3:00', title: 'Team Assembled', description: 'Full 6-person response team mobilized — Sarah, Marcus, Diana, James, Raj, Emily', type: 'internal' as const },
  { time: 'T+3:30', title: 'War Room Active', description: 'Secure command center established with AES-256 encrypted communications', type: 'internal' as const },
  { time: 'T+4:00', title: 'Evidence Preservation', description: 'Legal hold notices issued to 8 custodians — evidence vault initialized', type: 'legal' as const, privileged: true },
  { time: 'T+6:00', title: 'CEO Statement Released', description: 'Initial public statement — full cooperation pledged, customer protection measures announced', type: 'media' as const },
  { time: 'T+8:00', title: 'Containment Achieved', description: 'Breach vector identified (compromised API key) and sealed — all endpoints hardened', type: 'cyber' as const },
  { time: 'T+12:00', title: 'SEC Communication', description: 'Initial notification to SEC Division of Enforcement — Form 8-K preparation begun', type: 'regulatory' as const, privileged: true },
  { time: 'T+14:00', title: 'Customer Notification Drafted', description: '2.3M customer notification letter prepared under privilege — credit monitoring offered', type: 'legal' as const, privileged: true },
  { time: 'T+18:00', title: 'California AG Notified', description: 'CCPA breach notification filed with California Attorney General', type: 'regulatory' as const },
  { time: 'T+24:00', title: 'First Press Conference', description: 'CEO + Ironclad counsel joint statement — remediation timeline disclosed', type: 'media' as const },
  { time: 'T+30:00', title: 'Insurance Claim Filed', description: 'Cyber liability claim submitted to carrier — $10M policy coverage', type: 'internal' as const },
  { time: 'T+36:00', title: 'Forensic Report Complete', description: 'Full forensic analysis delivered under privilege — root cause documented', type: 'cyber' as const, privileged: true },
  { time: 'T+42:00', title: 'SEC Form 8-K Filed', description: 'Material event disclosure submitted to SEC — full transparency demonstrated', type: 'regulatory' as const },
  { time: 'T+48:00', title: 'Board Briefing', description: 'Full board update — containment confirmed, remediation plan presented, liability capped', type: 'legal' as const, privileged: true },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function IncidentTimeline() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Incident Timeline</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Chronological event log &mdash; Meridian Dynamics response
        </p>
      </div>

      {/* 3 StatCards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Events" value="20" color="#8B7355" />
        <StatCard label="Hours Elapsed" value="48+" color="#7C3AED" />
        <StatCard label="Current Phase" value="Active Response" color="#7C3AED" />
      </div>

      {/* Phase Markers */}
      <div className="flex gap-3 mb-8">
        {PHASE_MARKERS.map((phase) => (
          <div
            key={phase.label}
            className="flex-1 rounded-lg px-4 py-3 text-center"
            style={{
              backgroundColor: phase.active ? `${phase.color}12` : '#F5F5F4',
              border: phase.active ? `2px solid ${phase.color}` : '1px solid #E7E5E4',
              opacity: phase.label === 'Resolution' ? 0.5 : 1,
            }}
          >
            <p
              className="text-[12px] font-bold"
              style={{ color: phase.active ? phase.color : '#1C1917' }}
            >
              {phase.label}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#A8A29E' }}>
              {phase.range}
            </p>
          </div>
        ))}
      </div>

      {/* Full CrisisTimeline — wrapped with pivot highlights */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-2" style={{ color: '#1C1917' }}>Full Response Timeline</h2>
        <p className="text-[10px] mb-5" style={{ color: '#A8A29E' }}>
          Gold-bordered events are pivot points — critical moments that changed the trajectory
        </p>

        {/* Custom render: wrap CrisisTimeline events with pivot highlighting */}
        <div className="relative flex flex-col">
          {TIMELINE_EVENTS.map((event, i) => {
            const isPivot = PIVOT_TITLES.has(event.title);
            const typeColors: Record<string, string> = {
              legal: '#7C3AED',
              cyber: '#2563EB',
              media: '#EA580C',
              regulatory: '#DC2626',
              internal: '#78716C',
            };
            const typeLabels: Record<string, string> = {
              legal: 'Legal',
              cyber: 'Cyber',
              media: 'Media',
              regulatory: 'Regulatory',
              internal: 'Internal',
            };
            const color = typeColors[event.type] ?? '#78716C';
            const isLast = i === TIMELINE_EVENTS.length - 1;

            return (
              <div
                key={i}
                className="flex gap-4"
                style={{
                  minHeight: 72,
                  borderLeft: isPivot ? '3px solid #8B7355' : '3px solid transparent',
                  paddingLeft: isPivot ? 12 : 12,
                  backgroundColor: isPivot ? '#8B735508' : 'transparent',
                  borderRadius: isPivot ? 8 : 0,
                  marginBottom: isPivot ? 4 : 0,
                }}
              >
                {/* Left: time */}
                <div className="w-[72px] shrink-0 pt-[2px] text-right">
                  <span className="text-[11px] font-mono leading-tight" style={{ color: '#57534E' }}>
                    {event.time}
                  </span>
                </div>

                {/* Center: line + node */}
                <div className="relative flex flex-col items-center w-[24px] shrink-0">
                  <div
                    className="z-10 flex items-center justify-center rounded-full"
                    style={{
                      width: isPivot ? 20 : 16,
                      height: isPivot ? 20 : 16,
                      backgroundColor: isPivot ? '#8B7355' : color,
                      marginTop: 2,
                      boxShadow: isPivot ? '0 0 0 3px #8B735530' : 'none',
                    }}
                  >
                    <div
                      className="rounded-full"
                      style={{ width: 6, height: 6, backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  {!isLast && (
                    <div
                      className="flex-1"
                      style={{ width: 2, backgroundColor: '#E7E5E4', marginTop: 2 }}
                    />
                  )}
                </div>

                {/* Right: content */}
                <div className="flex-1 pb-5 pt-[1px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[13px] font-semibold leading-tight"
                      style={{ color: '#1C1917' }}
                    >
                      {event.title}
                    </span>

                    <span
                      className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {typeLabels[event.type] ?? event.type}
                    </span>

                    {isPivot && (
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: '#8B735515', color: '#8B7355' }}
                      >
                        Pivot Point
                      </span>
                    )}

                    {event.privileged && (
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
                        style={{ backgroundColor: '#7C3AED15', color: '#7C3AED' }}
                      >
                        Privileged
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#57534E' }}>
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
