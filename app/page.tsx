import Link from 'next/link';
import { demoRegistry, type DemoRegistryEntry } from '@/data/demo-registry';

function DemoCard({ demo }: { demo: DemoRegistryEntry }) {
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

      {/* Product Demos */}
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
              <p className="text-sm text-[#888]">{demoRegistry.length} industry solutions</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoRegistry.map((demo) => (
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
          <div className="border-t border-[#222] pt-6 flex items-center justify-center">
            <p className="text-base text-[#ccc]">
              &copy; {new Date().getFullYear()} AI Code Rally &middot; Powered by{' '}
              <span className="bg-gradient-to-r from-[#f97316] to-[#fbbf24] bg-clip-text font-bold text-transparent">AICR</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
