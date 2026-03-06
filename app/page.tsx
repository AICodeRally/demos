import Link from 'next/link';

const demos = [
  {
    name: 'AEGIS',
    slug: 'aegis',
    industry: 'Crisis Management',
    tagline: 'Privilege-First Crisis Defense',
    color: '#D4A574',
    pages: 22,
  },
  {
    name: 'CHARTER',
    slug: 'charter',
    industry: 'Credit Unions',
    tagline: 'Member-Owned Financial Intelligence',
    color: '#8B7355',
    pages: 22,
  },
  {
    name: 'EQUIPR',
    slug: 'equipr',
    industry: 'Equipment Rental',
    tagline: 'AI-Powered Fleet Intelligence',
    color: '#F59E0B',
    pages: 19,
  },
  {
    name: 'ROUTEIQ',
    slug: 'routeiq',
    industry: 'Beverage Distribution',
    tagline: 'Revenue Operating System',
    color: '#C8956C',
    pages: 28,
  },
  {
    name: 'REGISTER',
    slug: 'register',
    industry: 'Retail Operations',
    tagline: 'Retail Revenue Operating System',
    color: '#64748B',
    pages: 22,
  },
  {
    name: 'STEEPLE',
    slug: 'steeple',
    industry: 'Church Management',
    tagline: 'Church Management Platform',
    color: '#522398',
    pages: 15,
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            AI Code Rally
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Demo Platform
          </h1>
          <p className="mt-3 text-lg text-white/50">
            Interactive product demos — click any card to launch
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo) => (
            <Link
              key={demo.slug}
              href={`/${demo.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-xl"
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 30% 20%, ${demo.color}08 0%, transparent 60%)`,
                }}
              />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="text-2xl font-bold tracking-wide"
                    style={{ color: demo.color }}
                  >
                    {demo.name}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      background: `${demo.color}15`,
                      color: `${demo.color}CC`,
                    }}
                  >
                    {demo.pages} pages
                  </span>
                </div>
                <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/30">
                  {demo.industry}
                </div>
                <p className="text-sm text-white/60">{demo.tagline}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-white/40 transition-colors group-hover:text-white/70">
                  Launch demo
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

        <div className="mt-16 text-center text-[11px] uppercase tracking-[0.15em] text-white/20">
          Powered by Prizym &bull; AI Code Rally
        </div>
      </div>
    </main>
  );
}
