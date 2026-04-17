import { Zap, BarChart3, Plug, ArrowRight, DollarSign, Code2, MonitorSmartphone } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: Zap,
    color: '#6366f1',
    title: 'Sub-50ms Calculation',
    desc: 'Pure calculation engine with no database dependency. Commission updates as fast as you can add items.',
  },
  {
    icon: BarChart3,
    color: '#22c55e',
    title: 'Tier Gamification',
    desc: 'Visual progress bars show how close reps are to the next tier. "Just $3,200 more to unlock 6%!"',
  },
  {
    icon: Plug,
    color: '#a855f7',
    title: 'ICM Adapters',
    desc: 'Pull comp plans from Varicent, Xactly, CaptivateIQ, or any ICM. Config-driven — zero code changes per client.',
  },
];

const STEPS = [
  { title: 'Connect ICM', desc: 'Link your compensation system via adapter' },
  { title: 'Embed Widget', desc: 'Drop an iframe into your POS UI' },
  { title: 'Build Sale', desc: 'As items are scanned, PostMessage sends data' },
  { title: 'See Earnings', desc: 'Commission preview updates in real-time' },
];

const INDUSTRIES = [
  { name: 'Summit Sleep Co.', industry: 'Retail / Furniture', color: '#ef4444', id: 'tablet' },
  { name: 'Acme Electronics', industry: 'Consumer Electronics', color: '#f59e0b', id: 'acme-electronics' },
  { name: 'Premier Motors', industry: 'Auto Dealership', color: '#d4a017', id: 'premier-motors' },
  { name: 'Summit Shield', industry: 'Insurance Agency', color: '#10b981', id: 'summit-shield' },
  { name: 'CloudStack AI', industry: 'SaaS / Tech Sales', color: '#06b6d4', id: 'cloudstack-ai' },
  { name: 'MedVance', industry: 'Pharma / Med Device', color: '#14b8a6', id: 'medvance' },
];

const EMBED_CODE = `<iframe
  src="https://demo.swic-summit.aicoderally.com/widget?client=tablet&theme=dark"
  width="400"
  height="600"
  style="border: none; border-radius: 16px;"
/>`;

const POSTMESSAGE_CODE = `// POS → SWIC Widget
iframe.contentWindow.postMessage({
  type: 'swic:addItem',
  item: {
    id: 'ls-005',
    name: 'Patron Silver Tequila 750ml',
    price: 48,
    cost: 30,
    category: 'Spirits',
    tags: ['spirits', 'premium'],
    quantity: 4
  }
}, '*');

// SWIC Widget → POS
window.addEventListener('message', (e) => {
  if (e.data.type === 'swic:commissionUpdate') {
    console.log('Commission:', e.data.total);
    console.log('Components:', e.data.components);
  }
});`;

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg-light">
      {/* Nav */}
      <nav className="glass-nav sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)' }}
            >
              <span className="text-white font-black text-xs tracking-tight">SW</span>
            </div>
            <div>
              <span className="text-sm font-black tracking-tight">
                <span style={{ color: '#6366f1' }}>SW</span>
                <span style={{ color: '#a855f7' }}>IC</span>
              </span>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--page-muted)' }}>
                What-If Calculator
              </p>
            </div>
          </div>
          <Link
            href="/swic/simulator"
            className="py-2 px-5 text-sm flex items-center gap-2 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 2px 12px #6366f140',
            }}
          >
            Launch Simulator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{
            background: 'linear-gradient(135deg, #6366f112, #a855f712)',
            border: '1px solid #6366f120',
            color: '#6366f1',
          }}
        >
          <Zap className="w-3.5 h-3.5" />
          Real-time commission visibility for 7 industries
        </div>
        <h1 className="text-5xl md:text-6xl font-black leading-[1.1] max-w-3xl mx-auto tracking-tight">
          Your sales reps deserve to know what they&apos;re{' '}
          <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #a855f7, #22c55e)' }}>
            earning
          </span>
        </h1>
        <p className="text-lg mt-6 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--page-muted)' }}>
          SWIC plugs into any POS system and shows commission estimates in real-time
          as reps build a sale. No more waiting until month-end. Works with any ICM.
        </p>
        <div className="mt-10">
          <Link
            href="/swic/simulator"
            className="inline-flex items-center gap-2.5 py-3.5 px-8 text-base rounded-xl font-bold transition-all hover:scale-[1.03] active:scale-[0.98] text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
              boxShadow: '0 4px 20px #6366f150, 0 0 40px #a855f715',
            }}
          >
            <DollarSign className="w-5 h-5" />
            Try the POS Simulator
          </Link>
        </div>
      </section>

      {/* Industry Showcase */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-center mb-3 tracking-tight">Built for Every Industry</h2>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--page-muted)' }}>
          6 demo clients. 5 rule types. One config-driven engine.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDUSTRIES.map((ind) => (
            <Link
              key={ind.id}
              href={`/simulator?client=${ind.id}`}
              className="glass-hover rounded-xl p-4 text-center transition-all duration-300 group"
              style={{ borderTop: `2px solid ${ind.color}30` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mx-auto mb-3 transition-transform group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${ind.color}, ${ind.color}cc)` }}
              >
                {ind.name.charAt(0)}
              </div>
              <h4 className="text-xs font-bold mb-0.5 truncate">{ind.name}</h4>
              <p className="text-[10px]" style={{ color: 'var(--page-muted)' }}>{ind.industry}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass-hover rounded-2xl p-6 transition-all duration-300"
                style={{ borderTop: `2px solid ${f.color}30` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}12` }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--page-muted)' }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Widget Embed Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: embed info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MonitorSmartphone className="w-5 h-5" style={{ color: '#6366f1' }} />
              <h2 className="text-2xl font-black tracking-tight">Embeddable Widget</h2>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--page-muted)' }}>
              Drop SWIC into any POS system with a single iframe. Commission data flows via PostMessage API —
              no backend integration required. The widget listens for sale items and pushes commission updates back.
            </p>

            {/* Embed code */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4" style={{ color: '#22c55e' }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--page-muted)' }}>
                  Embed Code
                </span>
              </div>
              <pre
                className="glass rounded-xl p-4 text-xs font-mono overflow-x-auto"
                style={{ color: '#22c55e', lineHeight: 1.6 }}
              >
                {EMBED_CODE}
              </pre>
            </div>

            {/* PostMessage API */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4" style={{ color: '#a855f7' }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--page-muted)' }}>
                  PostMessage API
                </span>
              </div>
              <pre
                className="glass rounded-xl p-4 text-[10px] font-mono overflow-x-auto"
                style={{ color: '#a5b4fc', lineHeight: 1.5 }}
              >
                {POSTMESSAGE_CODE}
              </pre>
            </div>
          </div>

          {/* Right: live widget preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--page-muted)' }}>
                Live Preview
              </span>
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: '1px solid var(--glass-border)',
                boxShadow: '0 8px 40px rgba(99, 102, 241, 0.15)',
                height: 580,
              }}
            >
              <iframe
                src="/widget?client=tablet&theme=dark"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="SWIC Widget Preview"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Varicent Integration */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="glass-hover rounded-2xl p-8 text-center" style={{ borderTop: '2px solid #6366f130' }}>
          <h2 className="text-xl font-black tracking-tight mb-3">Connects to Your ICM</h2>
          <p className="text-sm max-w-xl mx-auto mb-6" style={{ color: 'var(--page-muted)' }}>
            SWIC adapters pull comp plan structures, rate tables, and YTD attainment from your compensation system.
            The simulator includes a live toggle for Varicent sandbox environments.
          </p>
          <div className="flex items-center justify-center gap-6">
            {['Varicent', 'Xactly', 'CaptivateIQ', 'SAP'].map((name) => (
              <div
                key={name}
                className="glass-pill px-4 py-2 rounded-xl text-xs font-semibold"
                style={{ color: 'var(--page-muted)' }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-center mb-12 tracking-tight">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {STEPS.map((item, i) => (
            <div key={item.title} className="text-center">
              <div
                className="w-11 h-11 rounded-xl font-black text-lg flex items-center justify-center mx-auto mb-4 text-white"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  boxShadow: '0 2px 10px #6366f130',
                }}
              >
                {i + 1}
              </div>
              <h4 className="font-bold mb-1.5">{item.title}</h4>
              <p className="text-sm" style={{ color: 'var(--page-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <Link
          href="/swic/simulator"
          className="inline-flex items-center gap-2.5 py-3.5 px-8 text-base rounded-xl font-bold transition-all hover:scale-[1.03] active:scale-[0.98] text-white"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
            boxShadow: '0 4px 20px #6366f150',
          }}
        >
          <DollarSign className="w-5 h-5" />
          Try the POS Simulator
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-xs" style={{ color: 'var(--page-muted)', borderTop: '1px solid var(--glass-border)' }}>
        <span className="font-black tracking-tight">
          <span style={{ color: '#6366f1' }}>SW</span>
          <span style={{ color: '#a855f7' }}>IC</span>
        </span>
        {' '}is a product of{' '}
        <span className="font-semibold" style={{ color: 'var(--page-text)' }}>AI Code Rally</span>
        {' '}&middot;{' '}
        <span>7 industries &middot; 5 rule types &middot; Varicent adapter</span>
      </footer>
    </div>
  );
}
