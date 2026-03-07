import Link from 'next/link';

const demos = [
  {
    name: 'AEGIS',
    slug: 'aegis',
    industry: 'Crisis Management',
    tagline: 'Privilege-first crisis defense for law firms and corporate counsel',
    color: '#D4A574',
    bg: '#2a1f14',
    pages: 22,
  },
  {
    name: 'CHARTER',
    slug: 'charter',
    industry: 'Credit Unions',
    tagline: 'Member-owned financial intelligence for community institutions',
    color: '#8B7355',
    bg: '#1f1a12',
    pages: 22,
  },
  {
    name: 'EQUIPR',
    slug: 'equipr',
    industry: 'Equipment Rental',
    tagline: 'AI-powered fleet intelligence for rental operations',
    color: '#F59E0B',
    bg: '#1f1608',
    pages: 19,
  },
  {
    name: 'PROOFLINE',
    slug: 'proofline',
    industry: 'Beverage Distribution',
    tagline: 'Revenue operating system for beverage distributors and reps',
    color: '#C8956C',
    bg: '#1f1610',
    pages: 28,
  },
  {
    name: 'REGISTER',
    slug: 'register',
    industry: 'Retail Operations',
    tagline: 'Retail revenue intelligence from floor to boardroom',
    color: '#64748B',
    bg: '#141820',
    pages: 22,
  },
  {
    name: 'STEEPLE',
    slug: 'steeple',
    industry: 'Church Management',
    tagline: 'Full-spectrum church management and ministry platform',
    color: '#522398',
    bg: '#1a0e2e',
    pages: 15,
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* Hero */}
      <div
        className="px-6 pt-20 pb-16 lg:px-12"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #1e1b4b 100%)',
        }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#999]">
            AI Code Rally
          </p>
          <h1 className="text-5xl font-extrabold text-white lg:text-6xl">
            Demo Platform
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg font-light text-[#ccc]">
            Interactive product demos &mdash; click any card to launch a full experience
          </p>
          {/* Orange divider */}
          <div className="mx-auto mt-8 h-px w-48 bg-gradient-to-r from-transparent via-[#f97316] to-transparent" />
        </div>
      </div>

      {/* Demo Cards */}
      <div className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#888]">
            Products
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((demo) => (
              <Link
                key={demo.slug}
                href={`/${demo.slug}`}
                className="group overflow-hidden rounded-xl border border-[#e5e5e5] bg-white transition-all duration-300 hover:shadow-lg hover:border-[#ccc]"
                style={{ borderTopWidth: 3, borderTopColor: demo.color }}
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="text-xl font-bold tracking-wide"
                      style={{ color: demo.color }}
                    >
                      {demo.name}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        background: `${demo.color}15`,
                        color: demo.color,
                      }}
                    >
                      {demo.pages} pages
                    </span>
                  </div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#888]">
                    {demo.industry}
                  </div>
                  <p className="text-sm text-[#888] leading-relaxed">
                    {demo.tagline}
                  </p>
                </div>
                {/* Dark preview strip */}
                <div
                  className="flex items-center justify-between px-6 py-3 transition-colors"
                  style={{ backgroundColor: demo.bg }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: `${demo.color}99` }}
                  >
                    Interactive Demo
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs font-medium transition-transform group-hover:translate-x-1"
                    style={{ color: demo.color }}
                  >
                    Launch
                    <svg
                      className="h-3.5 w-3.5"
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
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#e5e5e5] px-6 py-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-xs text-[#888]">
            Powered by Prizym
          </span>
          <span className="text-xs font-medium text-[#1a1a1a]">
            AI Code Rally
          </span>
        </div>
      </div>
    </main>
  );
}
