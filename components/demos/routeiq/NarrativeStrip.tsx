import { PulseCard } from './PulseCard';
import { OpsChiefInsight } from './OpsChiefInsight';
import { AskForgePrompt } from './AskForgePrompt';
import { PULSE_FLAGS } from '@/data/routeiq/pulse-flags';
import { OPSCHIEF_INSIGHTS } from '@/data/routeiq/opschief-insights';
import { ASKFORGE_QA } from '@/data/routeiq/askforge-qa';

interface Props {
  section: string;
  title?: string;
  subtitle?: string;
}

export function NarrativeStrip({ section, title, subtitle }: Props) {
  const flags = PULSE_FLAGS[section] ?? [];
  const insights = OPSCHIEF_INSIGHTS[section] ?? [];
  const qa = ASKFORGE_QA[section] ?? [];

  return (
    <section className="flex flex-col gap-6">
      {(title || subtitle) && (
        <header className="flex flex-col gap-1">
          {title && (
            <h1 className="text-2xl font-bold" style={{ color: 'var(--rq-text)' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm" style={{ color: 'var(--rq-text-muted)' }}>
              {subtitle}
            </p>
          )}
        </header>
      )}

      {flags.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-pulse)' }}>
            ① Pulse — the system observes
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {flags.map((f) => (
              <PulseCard key={f.id} flag={f} />
            ))}
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-opschief)' }}>
            ② OpsChief — the system explains
          </div>
          <div className="flex flex-col gap-4">
            {insights.map((i) => (
              <OpsChiefInsight key={i.id} insight={i} />
            ))}
          </div>
        </div>
      )}

      {qa.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-askforge)' }}>
            ③ AskForge — you act
          </div>
          <AskForgePrompt qa={qa} />
        </div>
      )}
    </section>
  );
}
