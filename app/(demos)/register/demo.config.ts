import { defineDemo } from '@/components/shell';
import { Bed } from 'lucide-react';

export default defineDemo({
  slug: 'register',
  client: {
    name: 'Summit Sleep Co.',
    tagline: 'Retail Revenue OS',
    region: 'National \u2014 200 Stores',
    logo: Bed,
  },
  product: {
    name: 'REGISTER',
    badge: 'Interactive Demo',
  },
  darkMode: true,
  theme: 'register-slate',
  colors: {
    primary: '#1E3A5F',
    accent: '#06B6D4',
  },
  nav: [
    {
      section: 'Act 1 — Corporate Strategy',
      color: '#5B9BD5',
      items: [
        { label: 'Company Overview', href: '/register/corp/overview', icon: 'Building2' },
        { label: 'Store Portfolio', href: '/register/corp/portfolio', icon: 'Map' },
        { label: 'Market Position', href: '/register/corp/market', icon: 'Globe' },
        { label: 'Seasonal Strategy', href: '/register/corp/seasonal', icon: 'Calendar' },
        { label: 'Brand Partners', href: '/register/corp/brands', icon: 'Handshake' },
      ],
    },
    {
      section: 'Act 2 — Sales Strategy',
      color: '#06B6D4',
      items: [
        { label: 'District Planning', href: '/register/strategy/districts', icon: 'MapPin' },
        { label: 'Store Targets', href: '/register/strategy/targets', icon: 'Target' },
        { label: 'Product Mix', href: '/register/strategy/mix', icon: 'Sliders' },
        { label: 'Workforce Model', href: '/register/strategy/workforce', icon: 'Users' },
        { label: 'Promotion Calendar', href: '/register/strategy/promotions', icon: 'Megaphone' },
      ],
    },
    {
      section: 'Act 3 — Store Operations',
      color: '#8B5CF6',
      items: [
        { label: 'Floor Dashboard', href: '/register/ops/floor', icon: 'LayoutGrid' },
        { label: 'POS Terminal', href: '/register/ops/pos-terminal', icon: 'Tablet' },
        { label: 'Manager Console', href: '/register/ops/manager', icon: 'Monitor' },
        { label: 'Contest Board', href: '/register/ops/contests', icon: 'Trophy' },
      ],
    },
    {
      section: 'Act 4 — Sales Compensation',
      color: '#10B981',
      items: [
        { label: 'Comp Plan', href: '/register/comp/plan', icon: 'FileText' },
        { label: 'Calculator', href: '/register/comp/calculator', icon: 'Calculator' },
        { label: 'Statements', href: '/register/comp/statements', icon: 'Receipt' },
        { label: 'Team Performance', href: '/register/comp/team', icon: 'BarChart3' },
        { label: 'Executive View', href: '/register/comp/executive', icon: 'TrendingUp' },
        { label: 'Plan Designer', href: '/register/comp/admin', icon: 'Settings' },
      ],
    },
    {
      section: 'Act 5 — Platform & Integration',
      color: '#F59E0B',
      items: [
        { label: 'D365 Integration', href: '/register/platform/d365', icon: 'Link' },
        { label: 'Product Overview', href: '/register/platform/product', icon: 'Package' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Summit Sleep Co.',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Retail Operations',
    tagline: 'Retail revenue intelligence from floor to boardroom — comp, scheduling, analytics',
    color: '#8BA3BE',
  },
});
