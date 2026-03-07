'use client';

import { StatCard } from '@/components/demos/wellspring';
import { HSE_INSPECTION_ROUTE } from '@/data/wellspring';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pass: { bg: 'rgba(5, 150, 105, 0.15)', text: '#059669' },
  fail: { bg: 'rgba(220, 38, 38, 0.15)', text: '#DC2626' },
  pending: { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8' },
  na: { bg: 'rgba(100, 116, 139, 0.1)', text: '#64748B' },
};

const INSPECTION_COLORS: Record<string, string> = {
  'bop-test': '#DC2626',
  'flare-check': '#EA580C',
  'spill-kit': '#2563EB',
  'h2s-monitor': '#EAB308',
  'tank-environmental': '#0D9488',
  'wellhead-safety-valve': '#7C3AED',
};

export default function HseInspectionsPage() {
  const route = HSE_INSPECTION_ROUTE;

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#DC2626' }}
        >
          Act 5 &middot; HSE Officer
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Inspection Route
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          {route.officerName} &middot; {route.date} &middot; {route.region} &middot; {route.totalDuration}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Inspections Today" value="6" color="#DC2626" />
        <StatCard label="Passed" value="4" trend="up" trendValue="67%" color="#059669" />
        <StatCard label="Action Required" value="1" trend="flat" trendValue="follow-up" color="#EA580C" />
        <StatCard label="Due This Week" value="8" color="#DC2626" />
      </div>

      {/* Route Map (simplified SVG) */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#F1F5F9' }}>
          Inspection Route Map
        </h3>
        <svg
          viewBox="0 0 800 200"
          className="w-full h-auto"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <rect x="0" y="0" width="800" height="200" rx="12" fill="#252B36" />

          {/* Route line */}
          {route.stops.map((stop, i) => {
            if (i === 0) return null;
            const prevStop = route.stops[i - 1];
            const x1 = 60 + ((i - 1) / (route.stops.length - 1)) * 680;
            const x2 = 60 + (i / (route.stops.length - 1)) * 680;
            return (
              <line
                key={`line-${i}`}
                x1={x1} y1={100} x2={x2} y2={100}
                stroke="#DC2626" strokeWidth={2} opacity={0.3}
                strokeDasharray="6 4"
              />
            );
          })}

          {/* Stop markers */}
          {route.stops.map((stop, i) => {
            const x = 60 + (i / (route.stops.length - 1)) * 680;
            const color = INSPECTION_COLORS[stop.inspectionType] || '#DC2626';
            const isPriority = stop.priority === 'urgent';
            return (
              <g key={stop.id}>
                {isPriority && (
                  <circle cx={x} cy={100} r={20} fill={color} opacity={0.15}>
                    <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={x} cy={100} r={14}
                  fill={color}
                  stroke="#1E2530" strokeWidth={2}
                />
                <text
                  x={x} y={105}
                  textAnchor="middle"
                  fill="white" fontSize={11} fontWeight="bold"
                >
                  {stop.sequence}
                </text>
                <text
                  x={x} y={76}
                  textAnchor="middle"
                  fill="#CBD5E1" fontSize={9}
                >
                  {stop.arrivalTime}
                </text>
                <text
                  x={x} y={134}
                  textAnchor="middle"
                  fill="#94A3B8" fontSize={8}
                >
                  {stop.inspectionType.replace(/-/g, ' ')}
                </text>
                <text
                  x={x} y={148}
                  textAnchor="middle"
                  fill="#64748B" fontSize={7}
                >
                  {stop.duration}min
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Inspection Stop Cards */}
      <div className="space-y-4">
        {route.stops.map((stop) => {
          const color = INSPECTION_COLORS[stop.inspectionType] || '#DC2626';
          return (
            <div
              key={stop.id}
              className="rounded-xl border p-5"
              style={{
                backgroundColor: '#1E2530',
                borderColor: '#334155',
                borderLeft: `3px solid ${color}`,
              }}
            >
              {/* Stop Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${color}20`, color }}
                  >
                    {stop.sequence}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${color}20`, color }}
                      >
                        {stop.inspectionType.replace(/-/g, ' ')}
                      </span>
                      {stop.priority === 'urgent' && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600/20 text-red-400">
                          URGENT
                        </span>
                      )}
                      {stop.priority === 'follow-up' && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-600/20 text-amber-400">
                          FOLLOW-UP
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold mt-1" style={{ color: '#F1F5F9' }}>
                      {stop.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono" style={{ color: '#CBD5E1' }}>
                    {stop.arrivalTime}
                  </div>
                  <div className="text-[10px]" style={{ color: '#64748B' }}>
                    {stop.duration} min
                  </div>
                  <div className="text-[10px]" style={{ color: '#64748B' }}>
                    Last: {stop.lastInspected}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5">
                {stop.checks.map((check, ci) => {
                  const statusStyle = STATUS_COLORS[check.status];
                  return (
                    <div
                      key={ci}
                      className="flex items-center gap-2 rounded px-2 py-1.5"
                      style={{ backgroundColor: '#252B36' }}
                    >
                      <span
                        className="inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider shrink-0"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {check.status}
                      </span>
                      <span className="text-[11px]" style={{ color: '#CBD5E1' }}>
                        {check.item}
                      </span>
                      {check.notes && (
                        <span className="text-[10px] ml-auto" style={{ color: '#64748B' }}>
                          {check.notes}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
