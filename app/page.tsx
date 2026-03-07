import Link from 'next/link';

const demos = [
  {
    name: 'AEGIS',
    slug: 'aegis',
    industry: 'Crisis Management',
    tagline: 'Privilege-first crisis defense for law firms and corporate counsel',
    color: '#D4A574',
    pages: 22,
  },
  {
    name: 'CHARTER',
    slug: 'charter',
    industry: 'Credit Unions',
    tagline: 'Member-owned financial intelligence for community institutions',
    color: '#8B7355',
    pages: 22,
  },
  {
    name: 'EQUIPR',
    slug: 'equipr',
    industry: 'Equipment Rental',
    tagline: 'AI-powered fleet intelligence for rental operations',
    color: '#F59E0B',
    pages: 19,
  },
  {
    name: 'ROUTEIQ',
    slug: 'routeiq',
    industry: 'Beverage Distribution',
    tagline: 'Revenue operating system for beverage distributors and reps',
    color: '#C8956C',
    pages: 28,
  },
  {
    name: 'REGISTER',
    slug: 'register',
    industry: 'Retail Operations',
    tagline: 'Retail revenue intelligence from floor to boardroom',
    color: '#64748B',
    pages: 22,
  },
  {
    name: 'STEEPLE',
    slug: 'steeple',
    industry: 'Church Management',
    tagline: 'Full-spectrum church management and ministry platform',
    color: '#8b5cf6',
    pages: 15,
  },
  {
    name: 'WELLSPRING',
    slug: 'wellspring',
    industry: 'Oil & Gas',
    tagline: 'Field operations intelligence for upstream oil and gas producers',
    color: '#B45309',
    pages: 24,
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden pt-20 pb-12">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 40%, #f9731615 0%, transparent 70%)',
          }}
        />
        {/* Grid pattern */}
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
            <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">
              Demo
            </span>{' '}
            Platform
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-[#ccc] font-light leading-relaxed sm:text-2xl">
            Interactive product demos &mdash; click any card to launch a full experience
          </p>
          {/* Orange divider */}
          <div
            className="mx-auto mt-8 h-[1px] w-64"
            style={{
              background:
                'linear-gradient(90deg, transparent, #f97316 20%, #fbbf24 80%, transparent)',
            }}
          />
        </div>
      </section>

      {/* Demo Cards */}
      <section className="px-6 pb-16 pt-4 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-sm font-semibold uppercase tracking-[0.3em] text-[#ccc]">
            Products
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((demo) => (
              <Link
                key={demo.slug}
                href={`/${demo.slug}`}
                className="group overflow-hidden rounded-2xl border border-[#222] bg-[#111] transition-all duration-300 hover:border-[#333] hover:bg-[#141414]"
              >
                {/* Gradient placeholder area */}
                <div
                  className="relative flex items-center justify-center px-6 py-8"
                  style={{
                    background: `linear-gradient(135deg, ${demo.color}20 0%, ${demo.color}05 100%)`,
                  }}
                >
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: `linear-gradient(${demo.color} 1px, transparent 1px), linear-gradient(90deg, ${demo.color} 1px, transparent 1px)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  {/* Layer badge */}
                  <div className="absolute left-3 top-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: demo.color,
                        backgroundColor: `${demo.color}20`,
                        border: `1px solid ${demo.color}30`,
                      }}
                    >
                      {demo.pages} pages
                    </span>
                  </div>
                  {/* Name large */}
                  <span
                    className="relative text-3xl font-extrabold tracking-wider transition-transform duration-300 group-hover:scale-110"
                    style={{ color: demo.color }}
                  >
                    {demo.name}
                  </span>
                </div>

                {/* Content */}
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
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative pt-8 pb-6 bg-[#0a0a0a]">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, #f97316, #fbbf24)',
          }}
        />
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 lg:px-12">
          <span className="text-base text-[#ccc]">
            Powered by{' '}
            <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text font-bold text-transparent">
              Prizym
            </span>
          </span>
          <span className="text-base font-extrabold text-white">
            <span className="bg-gradient-to-r from-[#06b6d4] to-[#06b6d4] bg-clip-text text-transparent">
              AI
            </span>
            Code
            <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text text-transparent">
              Rally
            </span>
          </span>
        </div>
      </footer>
    </main>
  );
}
