'use client';

import { TERRITORIES, TERRITORY_METRICS, REGIONS, getTerritoryMetrics } from '@/data/ridgeline';
import { fmtM, fmt } from '@/lib/utils';

const activeTerritories = TERRITORIES.filter((t) => t.status === 'active');

export default function TerritoryMapPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
        >
          <span className="text-3xl text-white">&#128506;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
            Act 2 &middot; Territory & Branch Ops
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Territory Map
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {activeTerritories.length} active territories &middot; Effective-dated assignments
          </p>
        </div>
      </div>

      {/* Territory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {activeTerritories.map((t) => {
          const metrics = getTerritoryMetrics(t.id, 'Q1-2026');
          const m = metrics[0];
          const region = REGIONS.find((r) => r.id === t.regionId);
          return (
            <div
              key={t.id}
              className="rounded-xl border p-5"
              style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderLeft: `4px solid ${region?.color ?? '#94A3B8'}`, boxShadow: 'var(--rl-shadow)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-bold" style={{ color: 'var(--rl-text)' }}>{t.name}</h3>
                  <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>
                    {t.managerRole} &middot; {t.branchIds.length} branches &middot; {t.geography.join(', ')}
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: t.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: t.status === 'active' ? '#10B981' : '#F59E0B',
                  }}
                >
                  {t.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Annual Quota</div>
                  <div className="text-lg font-bold" style={{ color: 'var(--rl-text)' }}>${fmtM(t.annualQuota)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>YTD Actual</div>
                  <div className="text-lg font-bold" style={{ color: 'var(--rl-text)' }}>${fmtM(t.ytdActual)}</div>
                </div>
              </div>

              {m && (
                <div className="flex gap-3 text-[11px] pt-3" style={{ borderTop: '1px solid var(--rl-border)' }}>
                  <span style={{ color: 'var(--rl-text-muted)' }}>
                    Q1 Attainment: <strong style={{ color: m.attainment >= 100 ? '#10B981' : '#F59E0B' }}>{m.attainment}%</strong>
                  </span>
                  <span style={{ color: 'var(--rl-text-muted)' }}>Margin: <strong>{m.margin}%</strong></span>
                  <span style={{ color: 'var(--rl-text-muted)' }}>New: +{m.newAccountsWon} / -{m.accountsLost}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Archived Territory */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Archived Territories (Post-Acquisition Consolidation)
        </h2>
        {TERRITORIES.filter((t) => t.status === 'archived').map((t) => (
          <div
            key={t.id}
            className="rounded-lg border p-4 opacity-60"
            style={{ borderColor: 'var(--rl-border)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--rl-text)' }}>{t.name}</span>
                <span className="text-[11px] ml-2" style={{ color: 'var(--rl-text-muted)' }}>
                  {t.effectiveStart} &mdash; {t.effectiveEnd}
                </span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">archived</span>
            </div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--rl-text-muted)' }}>
              Consolidated into South Central Region. Quota achieved: ${fmtM(t.ytdActual)} / ${fmtM(t.annualQuota)} ({((t.ytdActual / t.annualQuota) * 100).toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
