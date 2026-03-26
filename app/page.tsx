import Link from 'next/link';
import { demoRegistry, type DemoRegistryEntry } from '@/data/demo-registry';

const PRIVATE_RALLY_DEMO_SLUGS = new Set<string>([]);

const SPM_DEMO_SLUGS = new Set([
  'prizym-governance',
  'quota',
  'swic',
]);

const TOOL_DEMO_SLUGS = new Set(['on-the-clock']);

function groupDemos() {
  const visibleDemos = demoRegistry.filter((demo) => !PRIVATE_RALLY_DEMO_SLUGS.has(demo.slug));

  const spmApplicationDemos = visibleDemos.filter((demo) => SPM_DEMO_SLUGS.has(demo.slug));
  const toolDemos = visibleDemos.filter((demo) => TOOL_DEMO_SLUGS.has(demo.slug));
  const revOsIndustryDemos = visibleDemos.filter(
    (demo) => !SPM_DEMO_SLUGS.has(demo.slug) && !TOOL_DEMO_SLUGS.has(demo.slug),
  );

  return { visibleDemos, revOsIndustryDemos, spmApplicationDemos, toolDemos };
}

function splitName(name: string): { primary: string; subtitle: string | null } {
  const dashIdx = name.indexOf(' — ');
  if (dashIdx !== -1) return { primary: name.slice(0, dashIdx), subtitle: name.slice(dashIdx + 3) };
  return { primary: name, subtitle: null };
}

function DemoCard({ demo }: { demo: DemoRegistryEntry }) {
  const { primary, subtitle } = splitName(demo.name);

  return (
    <Link
      href={`/${demo.slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        height: 420,
        overflow: 'hidden',
        borderRadius: 16,
        border: '1px solid #222',
        background: '#111',
        transition: 'border-color 0.3s, background 0.3s',
      }}
    >
      {/* Header band */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 128,
          padding: '0 24px',
          position: 'relative',
          background: `linear-gradient(135deg, ${demo.color}20 0%, ${demo.color}05 100%)`,
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.06,
            backgroundImage: `linear-gradient(${demo.color} 1px, transparent 1px), linear-gradient(90deg, ${demo.color} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <span
          style={{
            color: demo.color,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.05em',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {primary}
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.05em',
              color: '#999',
              marginTop: 4,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: demo.color,
            margin: '0 0 6px 0',
          }}
        >
          {demo.industry}
        </p>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: '#d7d7d7',
            margin: '0 0 16px 0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {demo.tagline}
        </p>

        <div style={{ marginTop: 'auto' }}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 8,
              padding: '10px 0',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              background: `linear-gradient(135deg, ${demo.color}, ${demo.color}cc)`,
            }}
          >
            Launch Demo
            <svg
              style={{ width: 16, height: 16 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DemoSection({
  title,
  subtitle,
  demos,
}: {
  title: string;
  subtitle: string;
  demos: DemoRegistryEntry[];
}) {
  return (
    <section style={{ padding: '0 5vw 56px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h2>
          <p style={{ fontSize: 14, color: '#8d8d8d', margin: '4px 0 0' }}>{subtitle}</p>
        </div>

        {demos.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gap: 24,
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            }}
          >
            {demos.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              height: 360,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              border: '1px dashed #2c2c2c',
              background: '#101010',
              padding: '0 24px',
              textAlign: 'center',
              color: '#8d8d8d',
            }}
          >
            Tool demos are planned and will appear here.
          </div>
        )}
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  const { visibleDemos, revOsIndustryDemos, spmApplicationDemos, toolDemos } = groupDemos();

  return (
    <main style={{ minHeight: '100vh', background: '#090909', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '80px 0 48px',
        }}
      >
        {/* Gradient bg */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #f9731620 0%, #f9731608 35%, transparent 70%)',
          }}
        />
        {/* Grid bg */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 16px' }}>
            <span
              style={{
                background: 'linear-gradient(to bottom, #fbbf24, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Demo
            </span>{' '}
            Showcase
          </h1>
          <p style={{ maxWidth: 720, margin: '0 auto', fontSize: 'clamp(18px, 2.5vw, 20px)', fontWeight: 300, lineHeight: 1.6, color: '#cfcfcf' }}>
            Unified catalog of industry, application, and tool experiences.
          </p>
          <p style={{ maxWidth: 720, margin: '8px auto 0', fontSize: 14, color: '#8d8d8d' }}>
            {visibleDemos.length} public demos in the showcase.
          </p>
          <div
            style={{
              width: 288,
              height: 1,
              margin: '32px auto 0',
              background: 'linear-gradient(90deg, transparent, #f97316 20%, #fbbf24 80%, transparent)',
            }}
          />
        </div>
      </section>

      <DemoSection
        title="RevOS Industry Demos"
        subtitle="Vertical solutions built for specific industries"
        demos={revOsIndustryDemos}
      />

      <DemoSection
        title="SPM Application Demos"
        subtitle="Prizym suite — compensation, governance, quotas, and what-if modeling"
        demos={spmApplicationDemos}
      />

      <DemoSection
        title="Tool Demos"
        subtitle="Standalone tools and interactive experiences"
        demos={toolDemos}
      />

      {/* Footer */}
      <footer style={{ position: 'relative', background: '#090909', padding: '40px 0 32px' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 2,
            background: 'linear-gradient(90deg, #f97316, #fbbf24)',
          }}
        />
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 24px 0', textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: '#ccc', margin: 0 }}>
            &copy; {new Date().getFullYear()} AI Code Rally &middot; Powered by{' '}
            <span
              style={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #f97316, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AICR
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
}
