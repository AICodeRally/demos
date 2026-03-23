'use client';

import { MICROSERVICES } from '@/data/ridgeline';

const statusColors: Record<string, string> = {
  running: '#10B981',
  degraded: '#F59E0B',
  stopped: '#EF4444',
};

export default function MicroservicesPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
        >
          <span className="text-3xl text-white">&#128203;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#7C3AED' }}>
            Act 5 &middot; Platform Architecture
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Microservices
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {MICROSERVICES.length} services &middot; Go + gRPC + NATS
          </p>
        </div>
      </div>

      {/* Service Status Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(['running', 'degraded', 'stopped'] as const).map((status) => {
          const count = MICROSERVICES.filter((s) => s.status === status).length;
          return (
            <div
              key={status}
              className="rounded-xl border p-4 text-center"
              style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${statusColors[status]}`, boxShadow: 'var(--rl-shadow)' }}
            >
              <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1 capitalize" style={{ color: 'var(--rl-text-muted)' }}>{status}</div>
              <div className="text-2xl font-extrabold" style={{ color: statusColors[status] }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Service Dependency Graph (text representation) */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Service Topology
        </h2>
        <div className="flex flex-col items-center gap-2">
          {/* Gateway */}
          <div className="rounded-lg border-2 px-6 py-2 text-[12px] font-bold" style={{ borderColor: '#7C3AED', color: '#7C3AED' }}>
            API Gateway (:8080)
          </div>
          <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>&darr;</div>
          {/* Core Services */}
          <div className="flex gap-3 flex-wrap justify-center">
            {MICROSERVICES.filter((s) => s.id !== 'ms-gateway').map((svc) => (
              <div
                key={svc.id}
                className="rounded-lg border px-3 py-2 text-center"
                style={{ borderColor: 'var(--rl-border)', minWidth: '120px' }}
              >
                <div className="text-[11px] font-bold" style={{ color: 'var(--rl-text)' }}>{svc.name}</div>
                <div className="text-[9px]" style={{ color: 'var(--rl-text-muted)' }}>:{svc.port}</div>
                <div className="w-2 h-2 rounded-full mx-auto mt-1" style={{ background: statusColors[svc.status] }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Detail */}
      <div className="space-y-4">
        {MICROSERVICES.map((svc) => (
          <div
            key={svc.id}
            className="rounded-xl border p-5"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderLeft: `4px solid ${statusColors[svc.status]}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold" style={{ color: 'var(--rl-text)' }}>{svc.name}</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--rl-stripe)', color: 'var(--rl-text-muted)' }}>
                    :{svc.port}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${statusColors[svc.status]}15`, color: statusColors[svc.status] }}>
                    {svc.status}
                  </span>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--rl-text-muted)' }}>{svc.technology}</div>
              </div>
            </div>

            <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--rl-text-muted)' }}>{svc.purpose}</p>

            {svc.dependencies.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] uppercase font-semibold mb-1" style={{ color: 'var(--rl-text-muted)' }}>Dependencies</div>
                <div className="flex gap-1">
                  {svc.dependencies.map((dep) => {
                    const depSvc = MICROSERVICES.find((s) => s.id === dep);
                    return (
                      <span key={dep} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--rl-border)', color: 'var(--rl-text)' }}>
                        {depSvc?.name ?? dep}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] uppercase font-semibold mb-2" style={{ color: 'var(--rl-text-muted)' }}>Endpoints</div>
              <div className="space-y-1">
                {svc.endpoints.map((ep, i) => (
                  <div key={i} className="flex items-center gap-3 text-[11px]">
                    <span
                      className="font-mono font-bold px-1.5 py-0.5 rounded text-white text-[9px]"
                      style={{ background: ep.method === 'GET' ? '#2563EB' : ep.method === 'POST' ? '#10B981' : '#F59E0B', minWidth: '36px', textAlign: 'center' }}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono" style={{ color: 'var(--rl-text)' }}>{ep.path}</span>
                    <span style={{ color: 'var(--rl-text-muted)' }}>&mdash; {ep.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Note */}
      <div className="rounded-lg px-6 py-4 mt-6" style={{ background: 'rgba(124,58,237,0.06)', borderLeft: '3px solid #7C3AED' }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--rl-text-secondary)' }}>
          <strong>Architecture Pattern:</strong> Event-driven microservices with gRPC for synchronous RPCs and NATS JetStream
          for async event streaming. All services are containerized Go binaries with health checks, structured logging, and
          OpenTelemetry tracing. The API Gateway handles HTTP routing, authentication, and rate limiting.
        </p>
      </div>
    </>
  );
}
