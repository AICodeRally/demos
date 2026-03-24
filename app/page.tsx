import Link from 'next/link';
import { demoRegistry, type DemoRegistryEntry } from '@/data/demo-registry';

const PRIVATE_RALLY_DEMO_SLUGS = new Set([
  'bhg-edge',
  'proofline-andrews',
  'proofline-route',
  'phoenix-intel',
]);

const SPM_DEMO_SLUGS = new Set([
  'prizym-governance',
  'quota',
]);

const TOOL_DEMO_SLUGS = new Set<string>([]);

function groupDemos() {
  const visibleDemos = demoRegistry.filter((demo) => !PRIVATE_RALLY_DEMO_SLUGS.has(demo.slug));

  const spmApplicationDemos = visibleDemos.filter((demo) => SPM_DEMO_SLUGS.has(demo.slug));
  const toolDemos = visibleDemos.filter((demo) => TOOL_DEMO_SLUGS.has(demo.slug));
  const revOsIndustryDemos = visibleDemos.filter(
    (demo) => !SPM_DEMO_SLUGS.has(demo.slug) && !TOOL_DEMO_SLUGS.has(demo.slug),
  );

  return {
    visibleDemos,
    revOsIndustryDemos,
    spmApplicationDemos,
    toolDemos,
  };
}

function splitName(name: string): { primary: string; subtitle: string | null } {
  // "Prizym SGM — Sales Governance Manager" → primary: "Prizym SGM", subtitle: "Sales Governance Manager"
  const dashIdx = name.indexOf(' — ');
  if (dashIdx !== -1) return { primary: name.slice(0, dashIdx), subtitle: name.slice(dashIdx + 3) };
  return { primary: name, subtitle: null };
}

function DemoCard({ demo }: { demo: DemoRegistryEntry }) {
  const { primary, subtitle } = splitName(demo.name);

  return (
    <Link
      href={`/${demo.slug}`}
      className="group flex h-[380px] flex-col overflow-hidden rounded-2xl border border-[#222] bg-[#111] transition-all duration-300 hover:border-[#333] hover:bg-[#141414]"
    >
      <div
        className="relative flex h-32 flex-col items-center justify-center px-6"
        style={{
          background: `linear-gradient(135deg, ${demo.color}20 0%, ${demo.color}05 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(${demo.color} 1px, transparent 1px), linear-gradient(90deg, ${demo.color} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <span
          className="relative text-center text-xl font-extrabold tracking-wider transition-transform duration-300 group-hover:scale-105"
          style={{ color: demo.color }}
        >
          {primary}
        </span>
        {subtitle && (
          <span className="relative mt-1 text-center text-[11px] font-medium tracking-wide text-[#999]">
            {subtitle}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: demo.color }}>
          {demo.industry}
        </p>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-[#d7d7d7]">
          {demo.tagline}
        </p>

        <div className="mt-auto">
          <div
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all group-hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${demo.color}, ${demo.color}cc)`,
            }}
          >
            Launch Demo
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
    <section className="px-6 pb-14 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-[#8d8d8d]">{subtitle}</p>
        </div>

        {demos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} />
            ))}
          </div>
        ) : (
          <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-[#2c2c2c] bg-[#101010] px-6 text-center text-[#8d8d8d]">
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
    <main className="min-h-screen bg-[#090909]">
      <section className="relative flex items-center justify-center overflow-hidden pb-12 pt-20">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #f9731620 0%, #f9731608 35%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-12">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
            <span className="bg-gradient-to-b from-[#fbbf24] to-[#f97316] bg-clip-text text-transparent">
              Demo
            </span>{' '}
            Showcase
          </h1>
          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-[#cfcfcf] sm:text-xl">
            Unified catalog of industry, application, and tool experiences.
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-[#8d8d8d]">
            {visibleDemos.length} public demos in the showcase.
          </p>
          <div
            className="mx-auto mt-8 h-[1px] w-72"
            style={{ background: 'linear-gradient(90deg, transparent, #f97316 20%, #fbbf24 80%, transparent)' }}
          />
        </div>
      </section>

      <DemoSection
        title="RevOS Industry Demos"
        subtitle={`${revOsIndustryDemos.length} demos grouped by industry use case`}
        demos={revOsIndustryDemos}
      />

      <DemoSection
        title="SPM Application Demos"
        subtitle={`${spmApplicationDemos.length} demos focused on SPM applications`}
        demos={spmApplicationDemos}
      />

      <DemoSection
        title="Tool Demos"
        subtitle={toolDemos.length > 0 ? `${toolDemos.length} demos focused on tools` : 'To be added'}
        demos={toolDemos}
      />

      <footer className="relative bg-[#090909] pb-8 pt-10">
        <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)' }} />
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="flex items-center justify-center border-t border-[#222] pt-6">
            <p className="text-base text-[#ccc]">
              &copy; {new Date().getFullYear()} AI Code Rally &middot; Powered by{' '}
              <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text font-bold text-transparent">
                AICR
              </span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
