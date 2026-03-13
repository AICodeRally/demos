'use client';

import { StatCard, BarChart, DonutChart, SeverityGauge } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const EXEC_CARDS = [
  {
    title: 'Incident Summary',
    body: 'Data breach affecting 2.3M customer records discovered March 1, 2026. Breach vector: compromised API key in legacy payment gateway.',
    borderColor: '#8B7355',
  },
  {
    title: 'Actions Taken',
    body: 'Full crisis response mobilized within 2.4 hours. Evidence preservation, regulatory notification, media management, and forensic analysis executed under attorney-client privilege.',
    borderColor: '#7C3AED',
  },
  {
    title: 'Outcomes Achieved',
    body: 'Containment in 8 hours. All 5 regulatory filings on time. Media sentiment recovered from -72 to +14. Stock impact limited to -1.2% (from initial -8%).',
    borderColor: '#059669',
  },
  {
    title: 'Recommendations',
    body: 'Upgrade encryption infrastructure ($1.2M). Implement continuous monitoring ($400K). Quarterly tabletop exercises. Update incident response playbook.',
    borderColor: '#DC2626',
  },
];

const MILESTONES = [
  { label: 'Detection', time: 'T+0', color: '#8B7355' },
  { label: 'Containment', time: 'T+8h', color: '#7C3AED' },
  { label: 'Disclosure', time: 'T+18h', color: '#DC2626' },
  { label: 'Resolution', time: 'T+14d', color: '#059669' },
];

const OUTCOME_BARS = [
  { label: 'Regulatory Filings', value: 100 },
  { label: 'Evidence Preserved', value: 100 },
  { label: 'Sentiment Recovery', value: 120 },
  { label: 'Stock Recovery', value: 85 },
];

const DONUT_SEGMENTS = [
  { label: 'Privileged', value: 834, color: '#7C3AED' },
  { label: 'Work Product', value: 223, color: '#8B7355' },
  { label: 'Disclosed', value: 190, color: '#A8A29E' },
];

const NEXT_STEPS = [
  { priority: 'Critical', label: 'Complete encryption upgrade by Q2 2026', color: '#DC2626' },
  { priority: 'High', label: 'Implement real-time threat monitoring', color: '#EA580C' },
  { priority: 'Medium', label: 'Update all crisis playbooks with Meridian learnings', color: '#EAB308' },
  { priority: 'Low', label: 'Schedule annual tabletop exercises for all retainer clients', color: '#059669' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function ClientReport() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Client Report</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Board-ready executive summary — Meridian Dynamics incident
        </p>
      </div>

      {/* 4 Executive Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {EXEC_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-white border border-l-4 p-5"
            style={{ borderColor: '#E7E5E4', borderLeftColor: card.borderColor }}
          >
            <h3 className="text-[14px] font-bold mb-2" style={{ color: '#1C1917' }}>{card.title}</h3>
            <p className="text-[11px] leading-relaxed" style={{ color: '#57534E' }}>{card.body}</p>
          </div>
        ))}
      </div>

      {/* Horizontal Milestone Timeline */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Response Timeline</h2>
        <div className="flex items-center justify-between relative px-4">
          {/* Connecting line */}
          <div className="absolute left-8 right-8 top-3 h-0.5" style={{ backgroundColor: '#E7E5E4' }} />
          {MILESTONES.map((m) => (
            <div key={m.label} className="flex flex-col items-center relative z-10">
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: m.color, backgroundColor: '#FFFFFF' }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
              </div>
              <span className="text-[11px] font-semibold mt-2" style={{ color: '#1C1917' }}>{m.label}</span>
              <span className="text-[10px]" style={{ color: '#A8A29E' }}>{m.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: Outcome Metrics + Privilege Log */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>Outcome Metrics (%)</h2>
          <BarChart data={OUTCOME_BARS} color="#059669" maxVal={120} unit="%" />
        </div>
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-3 self-start" style={{ color: '#1C1917' }}>Privilege Log Summary</h2>
          <DonutChart
            segments={DONUT_SEGMENTS}
            centerLabel="Total"
            centerValue="1,247"
          />
          <div className="flex items-center gap-4 mt-3">
            {DONUT_SEGMENTS.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px]" style={{ color: '#57534E' }}>{s.label} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Board Confidence Score */}
      <div className="rounded-xl bg-white border p-5 mb-8 flex flex-col items-center" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-3 self-start" style={{ color: '#1C1917' }}>Board Confidence Score</h2>
        <SeverityGauge
          value={91}
          max={100}
          label="Board Confidence"
          zones={[
            { threshold: 40, color: '#DC2626' },
            { threshold: 60, color: '#EA580C' },
            { threshold: 80, color: '#EAB308' },
            { threshold: 100, color: '#059669' },
          ]}
        />
      </div>

      {/* Next Steps */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Next Steps</h2>
        <div className="grid grid-cols-2 gap-3">
          {NEXT_STEPS.map((step) => (
            <div
              key={step.label}
              className="rounded-xl border border-l-4 p-3"
              style={{ borderColor: '#E7E5E4', borderLeftColor: step.color }}
            >
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1.5"
                style={{ backgroundColor: `${step.color}15`, color: step.color }}
              >
                {step.priority}
              </span>
              <p className="text-[11px]" style={{ color: '#1C1917' }}>{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
