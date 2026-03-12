import { defineDemo } from '@/components/demo-shell';
import { Bed } from 'lucide-react';

export default defineDemo({
  client: {
    name: 'Summit Sleep Co.',
    tagline: 'Retail Revenue Operating System',
    region: 'National \u2014 200 Stores',
    logo: Bed,
  },
  product: {
    name: 'REGISTER',
    badge: 'Interactive Demo',
  },
  theme: 'register-slate',
  colors: {
    primary: '#1E3A5F',
    accent: '#06B6D4',
  },
  nav: [
    {
      section: 'Act 1 — Corporate Strategy',
      color: '#1E3A5F',
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
        { label: 'POS Analytics', href: '/register/ops/pos', icon: 'CreditCard' },
        { label: 'Customer Journey', href: '/register/ops/customer', icon: 'Footprints' },
        { label: 'Inventory', href: '/register/ops/inventory', icon: 'Warehouse' },
        { label: 'Manager Console', href: '/register/ops/manager', icon: 'Monitor' },
        { label: 'Contest Board', href: '/register/ops/contests', icon: 'Trophy' },
        { label: 'Rep Self-Assessment', href: '/register/ops/rep-assessment', icon: 'UserCheck' },
      ],
    },
    {
      section: 'Act 4 — Sales Planning',
      color: '#6366F1',
      items: [
        { label: 'Forecasting', href: '/register/planning/forecasting', icon: 'TrendingUp' },
        { label: 'Headcount', href: '/register/planning/headcount', icon: 'Users' },
        { label: 'Scheduling', href: '/register/planning/scheduling', icon: 'Calendar' },
        { label: 'Targets', href: '/register/planning/targets', icon: 'Target' },
      ],
    },
    {
      section: 'Act 5 — Sales Compensation',
      color: '#10B981',
      items: [
        { label: 'Comp Plan', href: '/register/comp/plan', icon: 'FileText' },
        { label: 'Measurements', href: '/register/comp/measurements', icon: 'BarChart3' },
        { label: 'Calculator', href: '/register/comp/calculator', icon: 'Calculator' },
        { label: 'Payouts', href: '/register/comp/payouts', icon: 'DollarSign' },
        { label: 'Disputes', href: '/register/comp/disputes', icon: 'AlertTriangle' },
        { label: 'Statements', href: '/register/comp/statements', icon: 'Receipt' },
        { label: 'Team Performance', href: '/register/comp/team', icon: 'BarChart3' },
        { label: 'Executive View', href: '/register/comp/executive', icon: 'TrendingUp' },
        { label: 'Reports', href: '/register/comp/reports', icon: 'PieChart' },
      ],
    },
    {
      section: 'Act 6 — Platform & Integrations',
      color: '#F59E0B',
      items: [
        { label: 'Architecture', href: '/register/platform/architecture', icon: 'Network' },
        { label: 'Varicent', href: '/register/platform/varicent', icon: 'Link' },
        { label: 'Product Overview', href: '/register/platform/product', icon: 'Package' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Summit Sleep Co.',
    poweredBy: 'AICR',
  },
});
