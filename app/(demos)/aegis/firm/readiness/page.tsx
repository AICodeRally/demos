'use client';

import { useState } from 'react';
import { RadarChart, HeatMap, SeverityGauge, AreaChart } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const DIMENSIONS = ['Cyber Preparedness', 'Legal Framework', 'Comms Plan', 'Business Continuity', 'Regulatory Compliance', 'Training & Drills'];
const DIMENSION_SHORT = ['Cyber', 'Legal', 'Comms', 'BizCon', 'Regulatory', 'Training'];

interface ClientReadiness {
  name: string;
  scores: number[];
  color: string;
}

const CLIENT_DATA: ClientReadiness[] = [
  { name: 'Meridian Dynamics', scores: [92, 88, 78, 85, 90, 82], color: '#2563EB' },
  { name: 'Apex Financial', scores: [84, 92, 82, 76, 88, 70], color: '#8B7355' },
  { name: 'HealthCore Systems', scores: [78, 86, 90, 72, 94, 68], color: '#059669' },
  { name: 'TerraEnergy Corp', scores: [62, 70, 58, 80, 72, 54], color: '#EA580C' },
];

const HEATMAP_ROWS = CLIENT_DATA.map((c) => c.name);
const HEATMAP_DATA = CLIENT_DATA.map((c) => c.scores);

const READINESS_TREND = [
  { label: 'Mar', value: 64 },
  { label: 'Apr', value: 66 },
  { label: 'May', value: 65 },
  { label: 'Jun', value: 68 },
  { label: 'Jul', value: 70 },
  { label: 'Aug', value: 69 },
  { label: 'Sep', value: 71 },
  { label: 'Oct', value: 72 },
  { label: 'Nov', value: 73 },
  { label: 'Dec', value: 74 },
  { label: 'Jan', value: 72 },
  { label: 'Feb', value: 75 },
];

const RECOMMENDATIONS = [
  { client: 'Meridian Dynamics', text: 'Needs updated breach notification playbook — current version predates SEC 2025 cyber rules.', priority: 'high' },
  { client: 'TerraEnergy Corp', text: 'Training & Drills score critically low (54). Recommend tabletop exercise within 30 days.', priority: 'critical' },
  { client: 'Apex Financial', text: 'Business continuity plan lacks cloud failover procedures for primary trading systems.', priority: 'medium' },
];

const PRIORITY_STYLES: Record<string, { border: string; badge: string; badgeBg: string }> = {
  critical: { border: '#DC2626', badge: '#DC2626', badgeBg: '#FEF2F2' },
  high: { border: '#F59E0B', badge: '#D97706', badgeBg: '#FFFBEB' },
  medium: { border: '#8B7355', badge: '#8B7355', badgeBg: '#FAF5F0' },
};

/* ── Page ─────────────────────────────────────────────────── */

export default function ReadinessScores() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = CLIENT_DATA[selectedIdx];

  const radarAxes = DIMENSIONS.map((label, i) => ({
    label,
    value: selected.scores[i],
  }));

  // Compute portfolio average
  const portfolioAvg = Math.round(
    CLIENT_DATA.flatMap((c) => c.scores).reduce((a, b) => a + b, 0) /
      (CLIENT_DATA.length * DIMENSIONS.length),
  );

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Readiness Scores</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Client preparedness across 6 crisis dimensions</p>
      </div>

      {/* Client Selector */}
      <div className="flex gap-2 mb-6">
        {CLIENT_DATA.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setSelectedIdx(i)}
            className="rounded-lg px-4 py-2 text-xs font-medium transition-all"
            style={{
              backgroundColor: selectedIdx === i ? c.color : '#F5F5F4',
              color: selectedIdx === i ? '#FFFFFF' : '#57534E',
              border: `1px solid ${selectedIdx === i ? c.color : '#E7E5E4'}`,
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Radar + Score Breakdown */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: '#1C1917' }}>{selected.name} &mdash; Readiness Profile</h2>
          <div className="flex justify-center">
            <RadarChart axes={radarAxes} color={selected.color} size={320} />
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Dimension Scores</h2>
          <div className="flex flex-col gap-3">
            {DIMENSIONS.map((dim, i) => {
              const score = selected.scores[i];
              const barColor = score >= 80 ? '#059669' : score >= 60 ? '#F59E0B' : '#DC2626';
              return (
                <div key={dim}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#57534E' }}>{dim}</span>
                    <span className="text-xs font-bold" style={{ color: '#1C1917' }}>{score}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#F1F5F9' }}>
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid #E7E5E4' }}>
            <span className="text-xs font-medium" style={{ color: '#A8A29E' }}>Client Average</span>
            <span className="text-lg font-bold" style={{ color: selected.color }}>
              {Math.round(selected.scores.reduce((a, b) => a + b, 0) / selected.scores.length)}
            </span>
          </div>
        </div>
      </div>

      {/* HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Cross-Client Readiness Heat Map</h2>
        <HeatMap
          rows={HEATMAP_ROWS}
          cols={DIMENSION_SHORT}
          data={HEATMAP_DATA}
          colorScale={{ low: '#DC2626', mid: '#F59E0B', high: '#059669' }}
        />
      </div>

      {/* Gauge + Trend */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl bg-white border p-6 flex flex-col items-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Portfolio Readiness</h2>
          <SeverityGauge
            value={portfolioAvg}
            max={100}
            label="Portfolio Average"
            size={180}
            zones={[
              { threshold: 40, color: '#DC2626' },
              { threshold: 60, color: '#F59E0B' },
              { threshold: 80, color: '#8B7355' },
              { threshold: 100, color: '#059669' },
            ]}
          />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>12-Month Readiness Trend</h2>
          <AreaChart data={READINESS_TREND} color="#8B7355" height={200} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Recommendations</h2>
        <div className="flex flex-col gap-3">
          {RECOMMENDATIONS.map((rec, i) => {
            const ps = PRIORITY_STYLES[rec.priority];
            return (
              <div key={i} className="rounded-xl p-4" style={{ borderLeft: `4px solid ${ps.border}`, backgroundColor: '#FAFAF9' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm" style={{ color: '#1C1917' }}>{rec.client}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: ps.badgeBg, color: ps.badge }}>{rec.priority}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#57534E' }}>{rec.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
