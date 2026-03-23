'use client';

import { useState } from 'react';
import { INTEGRATION_SYSTEMS } from '@/data/ridgeline';

const categoryColors: Record<string, string> = {
  erp: '#1E3A5F', wms: '#2563EB', crm: '#7C3AED', spm: '#10B981',
  bi: '#F59E0B', portal: '#06B6D4', hr: '#EC4899', finance: '#EF4444',
};
const categoryIcons: Record<string, string> = {
  erp: '\u2699\uFE0F', wms: '\uD83C\uDFED', crm: '\uD83D\uDCCB', spm: '\uD83D\uDCB0',
  bi: '\uD83D\uDCCA', portal: '\uD83C\uDF10', hr: '\uD83D\uDC65', finance: '\uD83C\uDFE6',
};
const statusColors: Record<string, string> = {
  connected: '#10B981', degraded: '#F59E0B', offline: '#EF4444', planned: '#94A3B8',
};

const connected = INTEGRATION_SYSTEMS.filter((s) => s.status === 'connected').length;
const totalFlows = INTEGRATION_SYSTEMS.reduce((s, sys) => s + sys.dataFlows.length, 0);

export default function IntegrationsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Hub-and-spoke SVG layout
  const systems = INTEGRATION_SYSTEMS;
  const cx = 200, cy = 200, r = 140;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes hubPulse { 0%, 100% { r: 28 } 50% { r: 32 } }
        @keyframes spokeGrow { from { opacity: 0; stroke-dashoffset: 200 } to { opacity: 1; stroke-dashoffset: 0 } }
        @keyframes nodePop { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes flowDot { 0% { offset-distance: 0% } 100% { offset-distance: 100% } }
        @keyframes ringPulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 0.6 } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
          <span className="text-3xl text-white">&#128268;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#7C3AED' }}>Act 5 &middot; Platform Architecture</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>Integration Map</h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {systems.length} systems &middot; {connected} connected &middot; {totalFlows} data flows &middot; Click nodes for detail
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Systems', value: String(systems.length), color: '#7C3AED', icon: '\uD83D\uDD17' },
          { label: 'Connected', value: String(connected), color: '#10B981', icon: '\u2705' },
          { label: 'Data Flows', value: String(totalFlows), color: '#2563EB', icon: '\uD83D\uDD00' },
          { label: 'Daily Events', value: '~200K', color: '#F59E0B', icon: '\u26A1' },
        ].map((kpi, i) => (
          <div key={kpi.label} className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)', animation: `fadeUp ${0.3 + i * 0.1}s ease-out` }}>
            <div className="text-xl mb-1">{kpi.icon}</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Hub-and-Spoke SVG Topology */}
      <div className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          System Topology &mdash; Hover for sync info, click for detail
        </div>

        <svg viewBox="0 0 400 400" className="w-full max-w-[500px] mx-auto">
          {/* Outer ring */}
          <circle cx={cx} cy={cy} r={r + 20} fill="none" stroke="var(--rl-border)" strokeWidth="1" strokeDasharray="4 4" style={{ animation: 'ringPulse 3s ease-in-out infinite' }} />

          {/* Spokes + Nodes */}
          {systems.map((sys, i) => {
            const angle = (i / systems.length) * 2 * Math.PI - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            const color = categoryColors[sys.category];
            const isHovered = hoveredId === sys.id;
            const isExpanded = expandedId === sys.id;
            const nodeR = isHovered || isExpanded ? 26 : 22;

            return (
              <g key={sys.id}>
                {/* Spoke line */}
                <line x1={cx} y1={cy} x2={x} y2={y}
                  stroke={isHovered || isExpanded ? color : `${color}40`}
                  strokeWidth={isHovered || isExpanded ? 2.5 : 1.5}
                  strokeDasharray="200"
                  style={{ animation: `spokeGrow 0.6s ease-out ${i * 0.08}s both` }} />

                {/* Node circle */}
                <g
                  style={{ cursor: 'pointer', animation: `nodePop 0.4s ease-out ${0.3 + i * 0.08}s both` }}
                  onMouseEnter={() => setHoveredId(sys.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setExpandedId(expandedId === sys.id ? null : sys.id)}
                >
                  {/* Glow ring on hover */}
                  {(isHovered || isExpanded) && (
                    <circle cx={x} cy={y} r={nodeR + 6} fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
                  )}
                  <circle cx={x} cy={y} r={nodeR} fill={isHovered || isExpanded ? color : `${color}20`}
                    stroke={color} strokeWidth="2" />
                  {/* Status dot */}
                  <circle cx={x + nodeR * 0.6} cy={y - nodeR * 0.6} r="4"
                    fill={statusColors[sys.status]} stroke="var(--rl-card)" strokeWidth="1.5" />
                  {/* Label */}
                  <text x={x} y={y + 2} textAnchor="middle" fontSize="7" fontWeight="700"
                    fill={isHovered || isExpanded ? 'white' : color}>
                    {sys.category.toUpperCase()}
                  </text>
                </g>

                {/* System name outside */}
                <text
                  x={cx + (r + 42) * Math.cos(angle)}
                  y={cy + (r + 42) * Math.sin(angle)}
                  textAnchor="middle" fontSize="6.5" fontWeight="600"
                  fill="var(--rl-text-muted)"
                >
                  {sys.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Center hub */}
          <circle cx={cx} cy={cy} r="30" fill="var(--rl-card)" stroke="#7C3AED" strokeWidth="3" />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="7" fontWeight="800" fill="#7C3AED">RevOps</text>
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="5.5" fill="var(--rl-text-muted)">Control Plane</text>
        </svg>

        {/* Hover / Selected Detail */}
        {(hoveredId || expandedId) && (() => {
          const sys = systems.find((s) => s.id === (expandedId || hoveredId));
          if (!sys) return null;
          const color = categoryColors[sys.category];
          return (
            <div className="mt-4 rounded-xl border p-4 transition-all" style={{ borderColor: color, borderLeft: `4px solid ${color}`, animation: 'fadeUp 0.2s ease-out' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{categoryIcons[sys.category]}</span>
                <span className="text-[14px] font-bold" style={{ color: 'var(--rl-text)' }}>{sys.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${statusColors[sys.status]}15`, color: statusColors[sys.status] }}>
                  {sys.status}
                </span>
              </div>
              <p className="text-[12px] mb-3" style={{ color: 'var(--rl-text-muted)' }}>{sys.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {sys.dataFlows.map((flow) => (
                  <span key={flow} className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}10`, color }}>
                    {flow}
                  </span>
                ))}
              </div>
              <div className="flex gap-6 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                <span>Sync: <strong style={{ color: 'var(--rl-text)' }}>{sys.syncFrequency}</strong></span>
                <span>Volume: <strong style={{ color: 'var(--rl-text)' }}>{sys.recordVolume}</strong></span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Category Legend + Status Distribution */}
      <div className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.7s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Integration Categories
        </div>

        <div className="space-y-2">
          {systems.map((sys, i) => {
            const color = categoryColors[sys.category];
            const isActive = expandedId === sys.id;
            return (
              <button key={sys.id} onClick={() => setExpandedId(isActive ? null : sys.id)} className="w-full text-left">
                <div className="flex items-center gap-3 rounded-xl border p-3 transition-all"
                  style={{ borderColor: isActive ? color : 'var(--rl-border)', borderLeft: `4px solid ${color}`, background: isActive ? `${color}05` : 'transparent', animation: `fadeUp ${0.4 + i * 0.06}s ease-out` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${color}15` }}>
                    {categoryIcons[sys.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{sys.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase" style={{ background: `${color}15`, color }}>{sys.category}</span>
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>{sys.vendor} &middot; {sys.syncFrequency}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-[10px] font-bold tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>{sys.recordVolume}</div>
                    <div className="w-3 h-3 rounded-full" style={{ background: statusColors[sys.status] }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
