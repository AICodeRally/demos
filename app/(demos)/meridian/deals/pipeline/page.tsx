'use client';

import { ActNavigation, SectionCard, KpiCard } from '@/components/demos/meridian';
import { PIPELINE } from '@/data/meridian';
import { fmt } from '@/lib/utils';

const STAGE_COLORS: Record<string, string> = {
  'Screening': '#6B7280',
  'Initial DD': '#F59E0B',
  'Deep DD': '#8B5CF6',
  'IC Review': '#3B82F6',
  'LOI / Exclusivity': '#10B981',
  'Signed': '#D4A847',
  'Closed': '#22C55E',
  'Passed': '#EF4444',
};

export default function PipelinePage() {
  const totalEV = PIPELINE.reduce((s, d) => s + d.ev, 0);
  const totalEquity = PIPELINE.reduce((s, d) => s + d.equityCheck, 0);
  const weightedProb = PIPELINE.reduce((s, d) => s + d.equityCheck * d.probability, 0);

  return (
    <>
      <ActNavigation currentAct={2} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#8B5CF6' }}>
          Act 2 &middot; Deal Pipeline
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Active Deal Pipeline
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          {PIPELINE.length} active opportunities &middot; ${(totalEV / 1e9).toFixed(1)}B aggregate enterprise value
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <KpiCard label="Active Deals" value={String(PIPELINE.length)} accent="#8B5CF6" sub="In pipeline" stagger={0} />
        <KpiCard label="Total EV" value={`$${(totalEV / 1e9).toFixed(1)}B`} accent="#D4A847" sub="Enterprise value" stagger={1} />
        <KpiCard label="Equity Required" value={`$${(totalEquity / 1e9).toFixed(2)}B`} accent="#3B82F6" sub="Total equity checks" stagger={2} />
        <KpiCard label="Prob-Weighted" value={`$${(weightedProb / 1e6).toFixed(0)}M`} accent="#10B981" sub="Expected deployment" stagger={3} />
      </div>

      {/* Pipeline Stage Funnel */}
      <SectionCard title="Pipeline by Stage">
        <div className="space-y-2">
          {(['LOI / Exclusivity', 'IC Review', 'Deep DD', 'Initial DD', 'Screening'] as const).map((stage) => {
            const deals = PIPELINE.filter((d) => d.stage === stage);
            if (deals.length === 0) return null;
            const stageEV = deals.reduce((s, d) => s + d.ev, 0);
            return (
              <div key={stage} className="flex items-center gap-3">
                <div className="w-36 shrink-0">
                  <span className="text-xs font-bold font-mono px-2 py-1 rounded" style={{ background: `${STAGE_COLORS[stage]}15`, color: STAGE_COLORS[stage] }}>
                    {stage}
                  </span>
                </div>
                <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div className="h-full rounded-full flex items-center px-2" style={{ width: `${(stageEV / totalEV) * 100}%`, background: STAGE_COLORS[stage], minWidth: 40 }}>
                    <span className="text-xs font-bold font-mono text-white">{deals.length} deal{deals.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="w-20 text-right text-xs font-mono font-bold" style={{ color: STAGE_COLORS[stage] }}>
                  ${(stageEV / 1e6).toFixed(0)}M
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Deal Cards */}
      <SectionCard title="Deal Detail">
        <div className="space-y-4">
          {PIPELINE.map((deal) => (
            <div key={deal.id} className="rounded-lg border p-4" style={{ borderColor: `${STAGE_COLORS[deal.stage]}30`, background: 'var(--mr-card-alt)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[15px] font-bold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>{deal.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${STAGE_COLORS[deal.stage]}15`, color: STAGE_COLORS[deal.stage] }}>
                      {deal.stage}
                    </span>
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--mr-text-muted)' }}>
                    {deal.sector} &middot; {deal.subSector} &middot; {deal.source} &middot; Lead: {deal.dealLead}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono" style={{ color: '#D4A847' }}>${(deal.ev / 1e6).toFixed(0)}M</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>{deal.evEbitda.toFixed(1)}x EV/EBITDA</div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-3">
                {[
                  { l: 'Revenue', v: `$${(deal.revenue / 1e6).toFixed(0)}M` },
                  { l: 'EBITDA', v: `$${(deal.ebitda / 1e6).toFixed(1)}M` },
                  { l: 'Margin', v: `${(deal.ebitdaMargin * 100).toFixed(1)}%` },
                  { l: 'Equity Check', v: `$${(deal.equityCheck / 1e6).toFixed(0)}M` },
                  { l: 'Probability', v: `${(deal.probability * 100).toFixed(0)}%` },
                ].map((m) => (
                  <div key={m.l} className="text-center">
                    <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>{m.l}</div>
                    <div className="text-sm font-bold font-mono" style={{ color: 'var(--mr-text)' }}>{m.v}</div>
                  </div>
                ))}
              </div>

              <div className="text-[12px] mb-2" style={{ color: 'var(--mr-text-secondary)' }}>
                <strong>Thesis:</strong> {deal.thesis}
              </div>
              <div className="flex flex-wrap gap-1">
                {deal.risks.map((r) => (
                  <span key={r} className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
