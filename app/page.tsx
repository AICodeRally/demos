import Link from 'next/link';

const productDemos = [
  {
    name: 'AEGIS',
    slug: 'aegis',
    industry: 'Crisis Management',
    tagline: 'Privilege-first crisis defense for law firms and corporate counsel',
    color: '#D4A574',
  },
  {
    name: 'CHARTER',
    slug: 'charter',
    industry: 'Credit Unions',
    tagline: 'Member-owned financial intelligence for community institutions',
    color: '#8B7355',
  },
  {
    name: 'CRESTLINE',
    slug: 'crestline',
    industry: 'Department Store Retail',
    tagline: 'Premium retail compensation for multi-format department stores',
    color: '#c9a84c',
  },
  {
    name: 'EQUIPR',
    slug: 'equipr',
    industry: 'Equipment Rental',
    tagline: 'AI-powered fleet intelligence and utilization analytics for rental operations',
    color: '#F59E0B',
  },
  {
    name: 'ROUTEIQ',
    slug: 'routeiq',
    industry: 'Beverage Distribution',
    tagline: 'Revenue operating system for beverage distributors — territory, comp, route ops',
    color: '#C6A052',
  },
  {
    name: 'REGISTER',
    slug: 'register',
    industry: 'Retail Operations',
    tagline: 'Retail revenue intelligence from floor to boardroom — comp, scheduling, analytics',
    color: '#64748B',
  },
  {
    name: 'STEEPLE',
    slug: 'steeple',
    industry: 'Church Management',
    tagline: 'Full-spectrum church management and ministry platform',
    color: '#8b5cf6',
  },
  {
    name: 'WELLSPRING',
    slug: 'wellspring',
    industry: 'Oil & Gas',
    tagline: 'Field operations intelligence for upstream oil and gas producers',
    color: '#B45309',
  },
  {
    name: 'QUOTA',
    slug: 'quota',
    industry: 'Prizym RevOps',
    tagline: 'Quota planning and attainment for the modern CRO',
    color: '#f59e0b',
  },
];


function DemoCard({ demo }: { demo: typeof productDemos[0] }) {
  return (
    <Link
      href={`/${demo.slug}`}
      className="group overflow-hidden rounded-2xl border border-[#222] bg-[#111] transition-all duration-300 hover:border-[#333] hover:bg-[#141414]"
    >
      <div
        className="relative flex items-center justify-center px-6 py-8"
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
          className="relative text-3xl font-extrabold tracking-wider transition-transform duration-300 group-hover:scale-110"
          style={{ color: demo.color }}
        >
          {demo.name}
        </span>
      </div>
      <div className="p-6">
        <p
          className="mb-2 text-sm font-semibold uppercase tracking-wider"
          style={{ color: demo.color }}
        >
          {demo.industry}
        </p>
        <p className="mb-5 text-lg leading-relaxed text-[#e0e0e0]">
          {demo.tagline}
        </p>
        <div
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-base font-semibold text-white transition-all group-hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${demo.color}, ${demo.color}cc)`,
          }}
        >
          Launch Demo
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden pt-20 pb-12">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #f9731620 0%, #f9731608 30%, transparent 60%)',
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
          <p className="mx-auto max-w-2xl text-xl text-[#ccc] font-light leading-relaxed sm:text-2xl">
            Product demos &mdash; click any card to launch
          </p>
          <div
            className="mx-auto mt-8 h-[1px] w-64"
            style={{
              background:
                'linear-gradient(90deg, transparent, #f97316 20%, #fbbf24 80%, transparent)',
            }}
          />
        </div>
      </section>

      {/* ═══════════════ Product & Industry Demos ═══════════════ */}
      <section className="px-6 pb-16 pt-4 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] to-[#fbbf24]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Product Demos</h2>
              <p className="text-sm text-[#888]">{productDemos.length} industry solutions</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productDemos.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative pt-12 pb-8 bg-[#0a0a0a]">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)' }}
        />
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div>
              <span className="text-xl font-extrabold block mb-3">
                <span className="bg-gradient-to-b from-[#fbbf24] to-[#f97316] bg-clip-text text-transparent">AI</span>
                <span className="text-white">Code</span>
                <span className="bg-gradient-to-b from-[#fbbf24] to-[#f97316] bg-clip-text text-transparent">Rally</span>
              </span>
              <p className="text-lg text-[#ccc] leading-relaxed">
                Custom tools powered by AI. Built for your business. You own everything.
              </p>
            </div>
            <div>
              <p className="text-base uppercase tracking-wider text-[#ccc] font-semibold mb-3">Product</p>
              <nav className="flex flex-col gap-2 text-lg text-[#ccc]">
                <a href="https://aicoderally.com/studio" className="hover:text-white transition-colors">Studio</a>
                <a href="https://aicoderally.com/edge" className="hover:text-white transition-colors">Edge Platform</a>
                <a href="https://aicoderally.com/summit" className="hover:text-white transition-colors">Summit Modules</a>
                <a href="https://aicoderally.com/pricing" className="hover:text-white transition-colors">Pricing</a>
              </nav>
            </div>
            <div>
              <p className="text-base uppercase tracking-wider text-[#ccc] font-semibold mb-3">Company</p>
              <nav className="flex flex-col gap-2 text-lg text-[#ccc]">
                <a href="https://aicoderally.com/partners" className="hover:text-white transition-colors">Partners</a>
                <a href="https://aicoderally.com/intel" className="hover:text-white transition-colors">The Vibe Check</a>
                <a href="https://aicoderally.com/legal" className="hover:text-white transition-colors">Legal</a>
                <a href="https://aicoderally.com/#contact" className="hover:text-white transition-colors">Start Your Rally</a>
              </nav>
            </div>
          </div>
          <div className="border-t border-[#222] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-base text-[#ccc]">
              &copy; {new Date().getFullYear()} AI Code Rally &middot; Powered by{' '}
              <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text font-bold text-transparent">AICR</span>
            </p>
            <div className="flex items-center gap-5">
              <a href="https://www.linkedin.com/company/aicoderally" target="_blank" rel="noopener noreferrer" className="text-[#ccc] hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://twitter.com/aicoderally" target="_blank" rel="noopener noreferrer" className="text-[#ccc] hover:text-white transition-colors" aria-label="X (Twitter)">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="mailto:todd@aicoderally.com" className="text-[#ccc] hover:text-white transition-colors" aria-label="Email">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
