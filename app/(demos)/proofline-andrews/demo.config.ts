import { defineDemo } from '@/components/demo-shell';
import { Beer } from 'lucide-react';

export default defineDemo({
  darkMode: true,
  client: {
    name: 'Lone Star Distribution',
    tagline: 'Revenue Operating System',
    region: 'North & South Texas',
    logo: Beer,
  },
  product: {
    name: 'PROOFLINE',
    badge: 'Interactive Demo',
  },
  theme: 'barrel-brass',
  colors: {
    primary: '#C6A052',
    accent: '#B87333',
  },
  nav: [
    {
      section: 'Act 1 \u2014 Corporate Strategy',
      color: '#C6A052',
      items: [
        { label: 'FY2026 Strategy', href: '/proofline-andrews/strategy/mandate', icon: 'Target' },
        { label: 'Brand Portfolio', href: '/proofline-andrews/strategy/portfolio', icon: 'Package' },
        { label: 'Market Position', href: '/proofline-andrews/strategy/market', icon: 'Globe' },
      ],
    },
    {
      section: 'Act 2 \u2014 Sales Strategy',
      color: '#7C3AED',
      items: [
        { label: 'Territory & Coverage', href: '/proofline-andrews/strategy/territories', icon: 'Map' },
        { label: 'Quota Planning', href: '/proofline-andrews/strategy/quotas', icon: 'GitBranch' },
        { label: 'Roles & Mechanics', href: '/proofline-andrews/strategy/roles', icon: 'Users' },
        { label: 'Brand Mix & Scenarios', href: '/proofline-andrews/strategy/mix', icon: 'Sliders' },
      ],
    },
    {
      section: 'Act 3 \u2014 Sales Operations',
      color: '#2563EB',
      items: [
        { label: 'Manager', href: '/proofline-andrews/ops/manager', icon: 'Users' },
        { label: 'Day Planner', href: '/proofline-andrews/ops/day-planner', icon: 'MapPin' },
        { label: 'Dispatch', href: '/proofline-andrews/ops/dispatch', icon: 'Truck' },
        { label: 'Field Intel', href: '/proofline-andrews/ops/field-intel', icon: 'Radar' },
        { label: 'Inventory', href: '/proofline-andrews/ops/inventory', icon: 'Warehouse' },
        { label: 'Compliance', href: '/proofline-andrews/ops/compliance', icon: 'ShieldCheck' },
        { label: 'AI Intelligence', href: '/proofline-andrews/ops/ai', icon: 'Brain' },
      ],
    },
    {
      section: 'Act 4 \u2014 Sales Comp Planning',
      color: '#10B981',
      items: [
        { label: 'Comp Plan', href: '/proofline-andrews/comp/plan', icon: 'Trophy' },
        { label: 'Kickers', href: '/proofline-andrews/comp/kickers', icon: 'Zap' },
        { label: 'Calculator', href: '/proofline-andrews/comp/calculator', icon: 'Calculator' },
        { label: '13-Week Story', href: '/proofline-andrews/comp/story', icon: 'LineChart' },
        { label: 'CEO Impact', href: '/proofline-andrews/comp/impact', icon: 'BarChart3' },
      ],
    },
    {
      section: 'Act 5 \u2014 Sales Comp Management',
      color: '#0EA5E9',
      items: [
        { label: 'Data', href: '/proofline-andrews/comp/mgmt/data', icon: 'Database' },
        { label: 'Measurements', href: '/proofline-andrews/comp/mgmt/measurements', icon: 'BarChart3' },
        { label: 'Rewards', href: '/proofline-andrews/comp/mgmt/rewards', icon: 'Award' },
        { label: 'Payments', href: '/proofline-andrews/comp/mgmt/payments', icon: 'Wallet' },
        { label: 'Inquiries', href: '/proofline-andrews/comp/mgmt/inquiries', icon: 'MessageSquare' },
        { label: 'Reports', href: '/proofline-andrews/comp/mgmt/reports', icon: 'FileBarChart' },
      ],
    },
    {
      section: 'Act 6 \u2014 Platform & Integrations',
      color: '#F97316',
      items: [
        { label: 'Integrations', href: '/proofline-andrews/integrations', icon: 'Cable' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Lone Star Distribution',
    poweredBy: 'AICR',
  },
});
