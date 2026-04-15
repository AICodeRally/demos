import { Brain, CheckCircle2 } from 'lucide-react';
import type { OpsChiefInsight as OpsChiefInsightType } from '@/data/routeiq/opschief-insights';

const CONFIDENCE_COLORS = {
  high: '#059669',
  medium: '#D97706',
  low: '#64748B',
} as const;

export function OpsChiefInsight({ insight }: { insight: OpsChiefInsightType }) {
  return (
    <article
      className="rq-opschief-card rq-animate-fade-in flex flex-col gap-4 rounded-xl border p-5"
      style={{
        background: 'var(--rq-card)',
        borderColor: 'var(--rq-border)',
        borderLeftColor: 'var(--rq-opschief)',
        borderLeftWidth: 4,
      }}
    >
      <header className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
          style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--rq-opschief)' }}
        >
          <Brain className="h-3 w-3" />
          OPSCHIEF
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>
          DIAGNOSIS
        </span>
        <span
          className="ml-auto font-mono text-[11px] font-bold uppercase tracking-wider"
          style={{ color: CONFIDENCE_COLORS[insight.confidence] }}
        >
          {insight.confidence} confidence
        </span>
      </header>

      <h3 className="text-lg font-bold leading-snug" style={{ color: 'var(--rq-text)' }}>
        {insight.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--rq-text-secondary)' }}>
        {insight.diagnosis}
      </p>

      <div className="rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>
          Evidence
        </div>
        <ul className="flex flex-col gap-1.5">
          {insight.evidence.map((e) => (
            <li key={e} className="flex items-start gap-2 text-sm" style={{ color: 'var(--rq-text-muted)' }}>
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--rq-opschief)' }} />
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="rounded-lg border-l-2 p-3"
        style={{
          background: 'rgba(139,92,246,0.06)',
          borderLeftColor: 'var(--rq-opschief)',
        }}
      >
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-opschief)' }}>
          Recommendation
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--rq-text)' }}>
          {insight.recommendation}
        </p>
      </div>
    </article>
  );
}
