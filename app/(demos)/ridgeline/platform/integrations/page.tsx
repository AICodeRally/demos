'use client';

import { INTEGRATION_SYSTEMS } from '@/data/ridgeline';

const categoryColors: Record<string, string> = {
  erp: '#1E3A5F',
  wms: '#2563EB',
  crm: '#7C3AED',
  spm: '#10B981',
  bi: '#F59E0B',
  portal: '#06B6D4',
  hr: '#EC4899',
  finance: '#EF4444',
};

const statusColors: Record<string, string> = {
  connected: '#10B981',
  degraded: '#F59E0B',
  offline: '#EF4444',
  planned: '#94A3B8',
};

export default function IntegrationsPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
        >
          <span className="text-3xl text-white">&#128268;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#7C3AED' }}>
            Act 5 &middot; Platform Architecture
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Integration Map
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {INTEGRATION_SYSTEMS.length} systems &middot; {INTEGRATION_SYSTEMS.filter((s) => s.status === 'connected').length} connected
          </p>
        </div>
      </div>

      {/* System Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INTEGRATION_SYSTEMS.map((sys) => (
          <div
            key={sys.id}
            className="rounded-xl border p-5"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderLeft: `4px solid ${categoryColors[sys.category]}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold" style={{ color: 'var(--rl-text)' }}>{sys.name}</h3>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                    style={{ background: `${categoryColors[sys.category]}15`, color: categoryColors[sys.category] }}
                  >
                    {sys.category}
                  </span>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--rl-text-muted)' }}>{sys.vendor}</div>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${statusColors[sys.status]}15`, color: statusColors[sys.status] }}
              >
                {sys.status}
              </span>
            </div>

            <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--rl-text-muted)' }}>{sys.description}</p>

            <div className="mb-3">
              <div className="text-[10px] uppercase font-semibold mb-1" style={{ color: 'var(--rl-text-muted)' }}>Data Flows</div>
              <div className="flex flex-wrap gap-1">
                {sys.dataFlows.map((flow) => (
                  <span key={flow} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--rl-border)', color: 'var(--rl-text)' }}>
                    {flow}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
              <span>Sync: {sys.syncFrequency}</span>
              <span>Volume: {sys.recordVolume}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
