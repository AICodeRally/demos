import { defineDemo } from '@/components/shell';

export default defineDemo({
  slug: 'crestline',
  client: {
    name: 'Crestline',
    tagline: 'Department Stores',
    region: 'National — 200 Stores',
  },
  product: {
    name: 'CRESTLINE SPM',
    badge: 'Interactive Demo',
  },
  theme: 'midnight',
  darkMode: true,
  colors: {
    primary: '#1a1f3d',
    accent: '#c9a84c',
  },
  nav: [
    {
      section: 'Strategic Context',
      color: '#64748B',
      items: [
        { label: 'Build vs. Buy Analysis', href: '/crestline/build-vs-buy', icon: 'Scale' },
      ],
    },
    {
      section: 'Act 1 — Corporate Strategy',
      color: '#1a1f3d',
      items: [
        { label: 'Company Overview', href: '/crestline/corp/overview', icon: 'Building2' },
        { label: 'Store Portfolio', href: '/crestline/corp/portfolio', icon: 'Map' },
        { label: 'Market Position', href: '/crestline/corp/market', icon: 'Globe' },
        { label: 'Seasonal Strategy', href: '/crestline/corp/seasonal', icon: 'Calendar' },
        { label: 'Brand Partners', href: '/crestline/corp/brands', icon: 'Handshake' },
      ],
    },
    {
      section: 'Act 2 — Sales Strategy',
      color: '#c9a84c',
      items: [
        { label: 'District Planning', href: '/crestline/strategy/districts', icon: 'MapPin' },
        { label: 'Targets & Quotas', href: '/crestline/strategy/targets', icon: 'Target' },
        { label: 'Product Mix', href: '/crestline/strategy/mix', icon: 'Sliders' },
        { label: 'Workforce Model', href: '/crestline/strategy/workforce', icon: 'Users' },
        { label: 'Promotions & SPIFFs', href: '/crestline/strategy/promotions', icon: 'Megaphone' },
      ],
    },
    {
      section: 'Act 3 — Store Operations',
      color: '#7c3aed',
      items: [
        { label: 'Floor Dashboard', href: '/crestline/ops/floor', icon: 'LayoutGrid' },
        { label: 'POS Analytics', href: '/crestline/ops/pos', icon: 'CreditCard' },
        { label: 'RTWC — What-If', href: '/crestline/ops/rtwc', icon: 'Calculator' },
        { label: 'Customer Journey', href: '/crestline/ops/customer', icon: 'Footprints' },
        { label: 'Manager Console', href: '/crestline/ops/manager', icon: 'Monitor' },
        { label: 'Contests & Boards', href: '/crestline/ops/contests', icon: 'Trophy' },
      ],
    },
    {
      section: 'Act 4 — Sales Compensation',
      color: '#059669',
      items: [
        { label: 'Commission Engine', href: '/crestline/comp/engine', icon: 'Cpu' },
        { label: 'Rate Tables', href: '/crestline/comp/rates', icon: 'Table2' },
        { label: 'Achiever Program', href: '/crestline/comp/achiever', icon: 'Award' },
        { label: 'Dual Calendar', href: '/crestline/comp/calendar', icon: 'CalendarRange' },
        { label: 'Retro Corrections', href: '/crestline/comp/retro', icon: 'RotateCcw' },
        { label: 'Disputes & Audit', href: '/crestline/comp/disputes', icon: 'Shield' },
        { label: 'Payroll Output', href: '/crestline/comp/payroll', icon: 'FileOutput' },
        { label: 'Statements', href: '/crestline/comp/statements', icon: 'Receipt' },
      ],
    },
  ],
  footer: {
    copyright: '© 2026 Crestline Department Stores',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Department Store Retail',
    tagline: 'Premium retail compensation for multi-format department stores',
    color: '#c9a84c',
  },
});
