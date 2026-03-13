'use client';

import { StatCard, RadarChart, BarChart } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const RADAR_AXES = [
  { label: 'Response Speed', value: 92 },
  { label: 'Thoroughness', value: 85 },
  { label: 'Privilege Protection', value: 98 },
  { label: 'Communications', value: 82 },
  { label: 'Regulatory Compliance', value: 95 },
  { label: 'Cost Efficiency', value: 78 },
];

const BENCHMARK = [80, 75, 85, 70, 80, 65];

const RESPONSE_TIME_DATA = [
  { label: 'Detection', value: 0.5, color: '#059669' },
  { label: 'Mobilization', value: 2.4, color: '#059669' },
  { label: 'Containment', value: 8, color: '#059669' },
  { label: 'Disclosure', value: 18, color: '#059669' },
  { label: 'Reg Filing', value: 42, color: '#059669' },
  { label: 'Resolution', value: 336, color: '#059669' },
];

const INDUSTRY_AVG = [
  { label: 'Detection', value: 2.1 },
  { label: 'Mobilization', value: 6.8 },
  { label: 'Containment', value: 24 },
  { label: 'Disclosure', value: 48 },
  { label: 'Reg Filing', value: 96 },
  { label: 'Resolution', value: 1080 },
];

const WORKED = [
  'Privilege preservation at 98.6%',
  'Team assembly in 2.4 hours',
  'Containment in 8 hours',
  'All regulatory filings on time',
];

const IMPROVE = [
  'Media response could be faster (T+6h vs T+2h target)',
  'Customer notification process had manual bottlenecks',
  'Insurance claim documentation was incomplete initially',
];

const IMPROVEMENTS = [
  { title: 'Automate media response', impact: 'Projected: T+2h response (from T+6h)', effort: 'Medium' },
  { title: 'Streamline customer notification', impact: 'Projected: 50% faster processing', effort: 'Low' },
  { title: 'Pre-stage insurance templates', impact: 'Projected: 90% documentation completeness at T+0', effort: 'Low' },
  { title: 'Quarterly tabletop exercises', impact: 'Projected: 15% improvement in readiness scores', effort: 'High' },
];

const TEAM_PERF = [
  { name: 'Sarah Chen', tasks: 14, avgResponse: '1.2hr', score: 96 },
  { name: 'Marcus Webb', tasks: 12, avgResponse: '0.8hr', score: 94 },
  { name: 'James Park', tasks: 10, avgResponse: '1.5hr', score: 91 },
  { name: 'Diana Torres', tasks: 8, avgResponse: '2.1hr', score: 88 },
  { name: 'Raj Patel', tasks: 9, avgResponse: '1.8hr', score: 85 },
  { name: 'Emily Nakamura', tasks: 7, avgResponse: '2.4hr', score: 82 },
];

const EFFORT_COLORS: Record<string, string> = {
  Low: '#059669',
  Medium: '#EAB308',
  High: '#EA580C',
};

/* ── Page ─────────────────────────────────────────────────── */

export default function AfterActionReview() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>After-Action Review</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Response performance analysis and improvement recommendations
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Response Score" value="88/100" color="#059669" />
        <StatCard label="Vs. Benchmark" value="+12%" trend="up" trendValue="above avg" color="#059669" />
        <StatCard label="Improvements" value="6" color="#8B7355" />
        <StatCard label="Implementation" value="Q2 2026" color="#059669" />
      </div>

      {/* Radar Chart */}
      <div className="rounded-xl bg-white border p-5 mb-8 flex flex-col items-center" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1 self-start" style={{ color: '#1C1917' }}>Response Performance Scorecard</h2>
        <p className="text-[10px] mb-3 self-start" style={{ color: '#A8A29E' }}>Solid = Ironclad, Dashed = Industry Average</p>
        <RadarChart axes={RADAR_AXES} color="#059669" benchmarkData={BENCHMARK} />
      </div>

      {/* Response Time Comparison */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Response Time vs. Industry Average (hours)</h2>
        <p className="text-[10px] mb-4" style={{ color: '#A8A29E' }}>Resolution shown in days (Ironclad 14d vs Industry 45d)</p>
        <div className="space-y-3">
          {RESPONSE_TIME_DATA.map((item, i) => {
            const indMax = Math.max(item.value, INDUSTRY_AVG[i].value);
            const icPct = (item.value / indMax) * 100;
            const indPct = (INDUSTRY_AVG[i].value / indMax) * 100;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold" style={{ color: '#1C1917' }}>{item.label}</span>
                  <span className="text-[10px] tabular-nums" style={{ color: '#A8A29E' }}>
                    {item.value >= 24 ? `${Math.round(item.value / 24)}d` : `${item.value}hr`} vs {INDUSTRY_AVG[i].value >= 24 ? `${Math.round(INDUSTRY_AVG[i].value / 24)}d` : `${INDUSTRY_AVG[i].value}hr`}
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${icPct}%`, backgroundColor: '#059669' }} />
                </div>
                <div className="flex gap-1 mt-0.5">
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${indPct}%`, backgroundColor: '#A8A29E' }} />
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-full" style={{ backgroundColor: '#059669' }} />
              <span className="text-[10px]" style={{ color: '#57534E' }}>Ironclad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-full" style={{ backgroundColor: '#A8A29E' }} />
              <span className="text-[10px]" style={{ color: '#57534E' }}>Industry Average</span>
            </div>
          </div>
        </div>
      </div>

      {/* What Worked / What Needs Improvement */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>What Worked</h2>
          <div className="space-y-2">
            {WORKED.map((item, i) => (
              <div key={i} className="rounded-xl border-l-4 bg-white border p-3" style={{ borderLeftColor: '#059669', borderColor: '#E7E5E4' }}>
                <p className="text-[12px]" style={{ color: '#1C1917' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>What Needs Improvement</h2>
          <div className="space-y-2">
            {IMPROVE.map((item, i) => (
              <div key={i} className="rounded-xl border-l-4 bg-white border p-3" style={{ borderLeftColor: '#EA580C', borderColor: '#E7E5E4' }}>
                <p className="text-[12px]" style={{ color: '#1C1917' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Impact Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {IMPROVEMENTS.map((item) => (
          <div key={item.title} className="rounded-xl bg-white border p-4" style={{ borderColor: '#E7E5E4' }}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[12px] font-semibold" style={{ color: '#1C1917' }}>{item.title}</h3>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 ml-2"
                style={{ backgroundColor: `${EFFORT_COLORS[item.effort]}15`, color: EFFORT_COLORS[item.effort] }}
              >
                {item.effort}
              </span>
            </div>
            <p className="text-[11px]" style={{ color: '#059669' }}>{item.impact}</p>
          </div>
        ))}
      </div>

      {/* Team Performance Table */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Team Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['Team Member', 'Tasks Completed', 'Avg Response Time', 'Feedback Score'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_PERF.map((row) => (
                <tr key={row.name} style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <td className="py-2 px-2 font-semibold" style={{ color: '#1C1917' }}>{row.name}</td>
                  <td className="py-2 px-2 tabular-nums" style={{ color: '#57534E' }}>{row.tasks}</td>
                  <td className="py-2 px-2 tabular-nums" style={{ color: '#57534E' }}>{row.avgResponse}</td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F5F5F4' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.score}%`, backgroundColor: '#059669' }}
                        />
                      </div>
                      <span className="text-[10px] tabular-nums font-bold" style={{ color: '#059669' }}>{row.score}</span>
                    </div>
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
