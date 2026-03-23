'use client';

import { useState } from 'react';
import { MICROSERVICES } from '@/data/ridgeline';

const statusColors: Record<string, string> = { running: '#10B981', degraded: '#F59E0B', stopped: '#EF4444' };
const statusIcons: Record<string, string> = { running: '\u2705', degraded: '\u26A0\uFE0F', stopped: '\uD83D\uDED1' };
const methodColors: Record<string, string> = { GET: '#2563EB', POST: '#10B981', PUT: '#F59E0B', DELETE: '#EF4444' };

const running = MICROSERVICES.filter((s) => s.status === 'running').length;
const totalEndpoints = MICROSERVICES.reduce((s, svc) => s + svc.endpoints.length, 0);

export default function MicroservicesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes nodePop { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes edgeDraw { from { stroke-dashoffset: 100 } to { stroke-dashoffset: 0 } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes statusPulse { 0%, 100% { box-shadow: 0 0 6px rgba(16,185,129,0.15) } 50% { box-shadow: 0 0 14px rgba(16,185,129,0.3) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
          <span className="text-3xl text-white">&#128203;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#7C3AED' }}>Act 5 &middot; Platform Architecture</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>Microservices</h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {MICROSERVICES.length} services &middot; {totalEndpoints} endpoints &middot; Go + gRPC + NATS
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Services', value: String(MICROSERVICES.length), color: '#7C3AED', icon: '\uD83D\uDCE6' },
          { label: 'Running', value: String(running), color: '#10B981', icon: '\u2705' },
          { label: 'Endpoints', value: String(totalEndpoints), color: '#2563EB', icon: '\uD83D\uDD17' },
          { label: 'Tech Stack', value: 'Go+gRPC', color: '#F59E0B', icon: '\u26A1' },
        ].map((kpi, i) => (
          <div key={kpi.label} className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)', animation: `fadeUp ${0.3 + i * 0.1}s ease-out` }}>
            <div className="text-xl mb-1">{kpi.icon}</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Service Dependency DAG — SVG */}
      <div className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Service Dependency Graph &mdash; Hover for info, click for detail
        </div>

        <svg viewBox="0 0 600 320" className="w-full">
          {/* Layout: Gateway top center, then 2 rows of services */}
          {(() => {
            // Position each service
            const positions: Record<string, { x: number; y: number }> = {
              'ms-gateway': { x: 300, y: 40 },
              'ms-territory': { x: 100, y: 140 },
              'ms-commission': { x: 250, y: 140 },
              'ms-dispute': { x: 400, y: 140 },
              'ms-rebate': { x: 500, y: 140 },
              'ms-audit': { x: 150, y: 240 },
              'ms-reconcile': { x: 350, y: 240 },
              'ms-etl': { x: 500, y: 240 },
            };

            return (
              <>
                {/* Dependency edges */}
                {MICROSERVICES.map((svc, si) =>
                  svc.dependencies.map((dep, di) => {
                    const from = positions[dep];
                    const to = positions[svc.id];
                    if (!from || !to) return null;
                    const isHighlight = hoveredId === svc.id || hoveredId === dep || expandedId === svc.id;
                    return (
                      <line key={`${svc.id}-${dep}`}
                        x1={from.x} y1={from.y + 20} x2={to.x} y2={to.y - 20}
                        stroke={isHighlight ? '#7C3AED' : 'var(--rl-border)'}
                        strokeWidth={isHighlight ? 2.5 : 1.5}
                        strokeDasharray="100"
                        markerEnd="url(#arrowhead)"
                        style={{ animation: `edgeDraw 0.5s ease-out ${(si + di) * 0.08}s both` }}
                      />
                    );
                  })
                )}

                {/* Arrowhead marker */}
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="var(--rl-text-muted)" />
                  </marker>
                </defs>

                {/* Service nodes */}
                {MICROSERVICES.map((svc, i) => {
                  const pos = positions[svc.id];
                  if (!pos) return null;
                  const isGateway = svc.id === 'ms-gateway';
                  const color = statusColors[svc.status];
                  const isHovered = hoveredId === svc.id;
                  const isExpanded = expandedId === svc.id;
                  const active = isHovered || isExpanded;
                  const nodeW = isGateway ? 100 : 80;
                  const nodeH = isGateway ? 36 : 30;

                  return (
                    <g key={svc.id}
                      style={{ cursor: 'pointer', animation: `nodePop 0.4s ease-out ${0.2 + i * 0.06}s both` }}
                      onMouseEnter={() => setHoveredId(svc.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setExpandedId(expandedId === svc.id ? null : svc.id)}
                    >
                      {/* Glow */}
                      {active && (
                        <rect x={pos.x - nodeW / 2 - 4} y={pos.y - nodeH / 2 - 4} width={nodeW + 8} height={nodeH + 8}
                          rx="12" fill="none" stroke={isGateway ? '#7C3AED' : color} strokeWidth="2" opacity="0.3" />
                      )}

                      {/* Node box */}
                      <rect x={pos.x - nodeW / 2} y={pos.y - nodeH / 2} width={nodeW} height={nodeH}
                        rx="8"
                        fill={active ? (isGateway ? '#7C3AED' : color) : 'var(--rl-card)'}
                        stroke={isGateway ? '#7C3AED' : color}
                        strokeWidth={active ? 2.5 : 1.5}
                      />

                      {/* Service name */}
                      <text x={pos.x} y={pos.y - 2} textAnchor="middle" fontSize={isGateway ? '8' : '7'} fontWeight="700"
                        fill={active ? 'white' : 'var(--rl-text)'}>
                        {svc.name.replace(' Service', '').replace(' Engine', '').replace(' Hub', '')}
                      </text>

                      {/* Port */}
                      <text x={pos.x} y={pos.y + 9} textAnchor="middle" fontSize="5.5"
                        fill={active ? 'rgba(255,255,255,0.8)' : 'var(--rl-text-muted)'}>
                        :{svc.port}
                      </text>

                      {/* Status dot */}
                      <circle cx={pos.x + nodeW / 2 - 6} cy={pos.y - nodeH / 2 + 6} r="3.5"
                        fill={color} stroke="var(--rl-card)" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </>
            );
          })()}
        </svg>
      </div>

      {/* Service Detail Cards */}
      <div className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.6s ease-out' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] uppercase tracking-[1.5px] font-semibold" style={{ color: 'var(--rl-text-muted)' }}>
            Service Registry
          </div>
          <div className="flex gap-1.5">
            {(['running', 'degraded', 'stopped'] as const).map((s) => (
              <span key={s} className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${statusColors[s]}15`, color: statusColors[s] }}>
                {statusIcons[s]} {MICROSERVICES.filter((svc) => svc.status === s).length}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {MICROSERVICES.map((svc, i) => {
            const isExpanded = expandedId === svc.id;
            const color = statusColors[svc.status];
            const isGateway = svc.id === 'ms-gateway';

            return (
              <button key={svc.id} onClick={() => setExpandedId(isExpanded ? null : svc.id)} className="w-full text-left"
                style={{ animation: `fadeUp ${0.3 + i * 0.05}s ease-out` }}>
                <div className="rounded-xl border p-4 transition-all"
                  style={{
                    borderColor: isExpanded ? (isGateway ? '#7C3AED' : color) : 'var(--rl-border)',
                    borderLeft: `4px solid ${isGateway ? '#7C3AED' : color}`,
                    background: isExpanded ? `${isGateway ? '#7C3AED' : color}05` : 'transparent',
                    animation: svc.status === 'running' ? 'statusPulse 3s ease-in-out infinite' : 'none',
                  }}>

                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: isGateway ? '#7C3AED' : color }}>
                        {svc.port}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{svc.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
                            {svc.status}
                          </span>
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{svc.technology}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--rl-text)' }}>{svc.endpoints.length} endpoints</div>
                      <div className="text-[9px]" style={{ color: isGateway ? '#7C3AED' : color }}>
                        {isExpanded ? '\u25B2 Less' : '\u25BC Detail'}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>{svc.purpose}</p>

                  {/* Dependencies */}
                  {svc.dependencies.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[9px]" style={{ color: 'var(--rl-text-muted)' }}>Depends on:</span>
                      {svc.dependencies.map((dep) => {
                        const depSvc = MICROSERVICES.find((s) => s.id === dep);
                        return (
                          <span key={dep} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--rl-stripe)', color: 'var(--rl-text)' }}>
                            {depSvc?.name.replace(' Service', '').replace(' Engine', '') || dep}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Expanded: Endpoints */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: '1px solid var(--rl-border)', animation: 'fadeUp 0.2s ease-out' }}>
                      <div className="text-[10px] uppercase font-semibold mb-1" style={{ color: 'var(--rl-text-muted)' }}>API Endpoints</div>
                      {svc.endpoints.map((ep, ei) => (
                        <div key={ei} className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'var(--rl-stripe)', animation: `slideIn ${0.1 + ei * 0.05}s ease-out` }}>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded text-white shrink-0"
                            style={{ background: methodColors[ep.method] || '#94A3B8', minWidth: '36px', textAlign: 'center' }}>
                            {ep.method}
                          </span>
                          <span className="text-[11px] font-mono font-semibold" style={{ color: 'var(--rl-text)' }}>{ep.path}</span>
                          <span className="text-[10px] ml-auto" style={{ color: 'var(--rl-text-muted)' }}>{ep.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Architecture Note */}
      <div className="rounded-xl px-6 py-4 mt-6" style={{ background: 'rgba(124,58,237,0.06)', borderLeft: '3px solid #7C3AED', animation: 'fadeUp 0.8s ease-out' }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>
          <strong style={{ color: 'var(--rl-text)' }}>Architecture:</strong> Event-driven microservices &mdash; gRPC for synchronous RPCs, NATS JetStream for async event streaming.
          All services are containerized Go binaries with health checks, structured logging, and OpenTelemetry tracing. The API Gateway handles HTTP routing, JWT auth, and rate limiting.
        </p>
      </div>
    </>
  );
}
