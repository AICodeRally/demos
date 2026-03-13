'use client';

import { ActNavigation, SectionCard, KpiCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { PIPELINE } from '@/data/meridian';

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

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Pipeline Health', value: `${PIPELINE.length} Active`, status: 'green', detail: 'Across 4 stages' },
          { label: 'Conviction', value: 'High', status: 'green', detail: '2 in LOI/Exclusivity' },
          { label: 'Capital Available', value: '$450M', status: 'amber', detail: 'Unfunded for deployment' },
          { label: 'Deal Velocity', value: '2.1/mo', status: 'green', detail: 'New opportunities sourced' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#8B5CF6' }}>
          Act 2 &middot; Deal Pipeline
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Active Deal Pipeline
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          {PIPELINE.length} active opportunities &middot; ${(totalEV / 1e9).toFixed(1)}B aggregate enterprise value
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Deploying into Complexity-Driven Sectors"
        insight="Current pipeline is weighted toward healthcare services and industrial technology — sectors where regulatory complexity and operational fragmentation create barriers to entry and premium exit multiples for scaled platforms."
        accentColor="#8B5CF6"
        implications={[
          'IC conviction is highest on platform deals with identified bolt-on targets — 3 pipeline deals have pre-identified acquisition roadmaps.',
          'Average target EBITDA margin of 22% with 400-600bps expansion potential through operational playbook and procurement leverage.',
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Active Deals" value={String(PIPELINE.length)} accent="#8B5CF6" sub="In pipeline" variant="primary" stagger={0} />
        <KpiCard label="Total EV" value={`$${(totalEV / 1e9).toFixed(1)}B`} accent="#D4A847" sub="Enterprise value" variant="primary" stagger={1} />
        <KpiCard label="Equity Required" value={`$${(totalEquity / 1e9).toFixed(2)}B`} accent="#3B82F6" sub="Total equity checks" stagger={2} />
        <KpiCard label="Prob-Weighted" value={`$${(weightedProb / 1e6).toFixed(0)}M`} accent="#10B981" sub="Expected deployment" delta="+12%" deltaDirection="up" stagger={3} />
      </div>

      {/* Pipeline Stage Funnel */}
      <SectionCard title="Pipeline by Stage" variant="hero" accentColor="#8B5CF6">
        <div className="space-y-3">
          {(['LOI / Exclusivity', 'IC Review', 'Deep DD', 'Initial DD', 'Screening'] as const).map((stage) => {
            const deals = PIPELINE.filter((d) => d.stage === stage);
            if (deals.length === 0) return null;
            const stageEV = deals.reduce((s, d) => s + d.ev, 0);
            return (
              <div key={stage} className="flex items-center gap-3">
                <div className="w-36 shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded" style={{ background: `${STAGE_COLORS[stage]}15`, color: STAGE_COLORS[stage] }}>
                    {stage}
                  </span>
                </div>
                <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all"
                    style={{ width: `${Math.max((stageEV / totalEV) * 100, 8)}%`, background: STAGE_COLORS[stage] }}
                  >
                    <span className="text-xs font-bold text-white whitespace-nowrap">{deals.length} deal{deals.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="w-20 text-right text-xs font-bold tabular-nums" style={{ color: STAGE_COLORS[stage] }}>
                  ${(stageEV / 1e6).toFixed(0)}M
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Deal Cards */}
      <SectionCard title="Deal Detail" meta={`${PIPELINE.length} opportunities`}>
        <div className="space-y-4">
          {PIPELINE.map((deal, i) => (
            <div
              key={deal.id}
              className="rounded-xl border p-5 transition-all hover:shadow-lg animate-mr-fade-in"
              style={{
                borderColor: `${STAGE_COLORS[deal.stage]}30`,
                background: 'var(--mr-card-alt)',
                animationDelay: `${i * 60}ms`,
              }}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[16px] font-bold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>{deal.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${STAGE_COLORS[deal.stage]}15`, color: STAGE_COLORS[deal.stage] }}>
                      {deal.stage}
                    </span>
                  </div>
                  <div className="text-[12px]" style={{ color: 'var(--mr-text-muted)' }}>
                    {deal.sector} &middot; {deal.subSector} &middot; {deal.source} &middot; Lead: {deal.dealLead}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold" style={{ color: '#D4A847', fontFamily: 'var(--mr-font)' }}>${(deal.ev / 1e6).toFixed(0)}M</div>
                  <div className="text-[12px]" style={{ color: 'var(--mr-text-faint)' }}>{deal.evEbitda.toFixed(1)}x EV/EBITDA</div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                {[
                  { l: 'Revenue', v: `$${(deal.revenue / 1e6).toFixed(0)}M` },
                  { l: 'EBITDA', v: `$${(deal.ebitda / 1e6).toFixed(1)}M` },
                  { l: 'Margin', v: `${(deal.ebitdaMargin * 100).toFixed(1)}%` },
                  { l: 'Equity Check', v: `$${(deal.equityCheck / 1e6).toFixed(0)}M` },
                  { l: 'Probability', v: `${(deal.probability * 100).toFixed(0)}%` },
                ].map((m) => (
                  <div key={m.l} className="text-center p-2 rounded-lg" style={{ background: 'var(--mr-card)' }}>
                    <div className="text-[10px] uppercase tracking-[1px] font-semibold" style={{ color: 'var(--mr-text-faint)' }}>{m.l}</div>
                    <div className="text-[14px] font-bold tabular-nums" style={{ color: 'var(--mr-text)' }}>{m.v}</div>
                  </div>
                ))}
              </div>

              <div className="text-[13px] mb-2 leading-relaxed" style={{ color: 'var(--mr-text-secondary)' }}>
                <strong>Thesis:</strong> {deal.thesis}
              </div>
              <div className="flex flex-wrap gap-1">
                {deal.risks.map((r) => (
                  <span key={r} className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
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
