import type { ResolvedDemoConfig } from '../config/types';

interface Props {
  config: ResolvedDemoConfig;
}

export function Footer({ config }: Props) {
  return (
    <footer className="border-t border-[var(--sem-border-subtle)] bg-[var(--comp-footer-bg)] px-6 py-4">
      {config.nav.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-wider">
          {config.nav.map(section => (
            <a
              key={section.section}
              href={section.items[0]?.href ?? '#'}
              className="transition-colors hover:text-[var(--sem-text-primary)]"
              style={{ color: section.color ?? 'var(--sem-text-muted)' }}
            >
              {section.section}
            </a>
          ))}
        </div>
      )}
      <div className="text-center text-xs text-[var(--sem-text-muted)]">
        {config.footer.copyright} · Powered by{' '}
        <span className="font-semibold text-[var(--palette-accent-500)]">
          {config.footer.poweredBy}
        </span>
      </div>
    </footer>
  );
}
