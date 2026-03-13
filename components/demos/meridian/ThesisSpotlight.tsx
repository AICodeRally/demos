interface ThesisSpotlightProps {
  headline: string;
  insight: string;
  implications: string[];
  accentColor?: string;
}

export function ThesisSpotlight({ headline, insight, implications, accentColor = '#D4A847' }: ThesisSpotlightProps) {
  return (
    <div
      className="rounded-xl p-6 mb-6 animate-mr-fade-in"
      style={{
        background: `linear-gradient(135deg, ${accentColor}08, ${accentColor}03)`,
        border: `1px solid ${accentColor}20`,
        boxShadow: 'var(--mr-shadow-premium)',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-1 shrink-0 rounded-full self-stretch"
          style={{ background: accentColor }}
        />
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[2px] font-semibold mb-2" style={{ color: accentColor }}>
            Investment Thesis
          </div>
          <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
            {headline}
          </h3>
          <p className="text-[14px] leading-relaxed mb-4" style={{ color: 'var(--mr-text-secondary)' }}>
            {insight}
          </p>
          <div className="flex gap-3">
            {implications.map((imp, i) => (
              <div
                key={i}
                className="flex-1 p-3 rounded-lg"
                style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}15` }}
              >
                <div className="text-[10px] uppercase tracking-[1px] font-semibold mb-1" style={{ color: accentColor }}>
                  Implication {i + 1}
                </div>
                <div className="text-[12px] leading-relaxed" style={{ color: 'var(--mr-text-muted)' }}>
                  {imp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
