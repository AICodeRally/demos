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
        { label: 'FY2026 Strategy', href: '/proofline/strategy/mandate', icon: 'Target' },
        { label: 'Brand Portfolio', href: '/proofline/strategy/portfolio', icon: 'Package' },
        { label: 'Market Position', href: '/proofline/strategy/market', icon: 'Globe' },
      ],
    },
    {
      section: 'Act 2 \u2014 Sales Strategy',
      color: '#7C3AED',
      items: [
        { label: 'Territory & Coverage', href: '/proofline/strategy/territories', icon: 'Map' },
        { label: 'Quota Planning', href: '/proofline/strategy/quotas', icon: 'GitBranch' },
        { label: 'Roles & Mechanics', href: '/proofline/strategy/roles', icon: 'Users' },
        { label: 'Brand Mix & Scenarios', href: '/proofline/strategy/mix', icon: 'Sliders' },
      ],
    },
    {
      section: 'Act 3 \u2014 Sales Operations',
      color: '#2563EB',
      items: [
        { label: 'Manager', href: '/proofline/ops/manager', icon: 'Users' },
        { label: 'Day Planner', href: '/proofline/ops/day-planner', icon: 'MapPin' },
        { label: 'Dispatch', href: '/proofline/ops/dispatch', icon: 'Truck' },
        { label: 'Field Intel', href: '/proofline/ops/field-intel', icon: 'Radar' },
        { label: 'Inventory', href: '/proofline/ops/inventory', icon: 'Warehouse' },
        { label: 'Compliance', href: '/proofline/ops/compliance', icon: 'ShieldCheck' },
        { label: 'AI Intelligence', href: '/proofline/ops/ai', icon: 'Brain' },
      ],
    },
    {
      section: 'Act 4 \u2014 Sales Comp Planning',
      color: '#10B981',
      items: [
        { label: 'Comp Plan', href: '/proofline/comp/plan', icon: 'Trophy' },
        { label: 'Kickers', href: '/proofline/comp/kickers', icon: 'Zap' },
        { label: 'Opportunity Bonus', href: '/proofline/comp/opportunities', icon: 'Star' },
        { label: 'Calculator', href: '/proofline/comp/calculator', icon: 'Calculator' },
        { label: '13-Week Story', href: '/proofline/comp/story', icon: 'LineChart' },
        { label: 'CEO Impact', href: '/proofline/comp/impact', icon: 'BarChart3' },
      ],
    },
    {
      section: 'Act 5 \u2014 Sales Comp Management',
      color: '#0EA5E9',
      items: [
        { label: 'Data', href: '/proofline/comp/mgmt/data', icon: 'Database' },
        { label: 'Measurements', href: '/proofline/comp/mgmt/measurements', icon: 'BarChart3' },
        { label: 'Rewards', href: '/proofline/comp/mgmt/rewards', icon: 'Award' },
        { label: 'Payments', href: '/proofline/comp/mgmt/payments', icon: 'Wallet' },
        { label: 'Inquiries', href: '/proofline/comp/mgmt/inquiries', icon: 'MessageSquare' },
        { label: 'Reports', href: '/proofline/comp/mgmt/reports', icon: 'FileBarChart' },
      ],
    },
    {
      section: 'Act 6 \u2014 Platform & Integrations',
      color: '#F97316',
      items: [
        { label: 'Integrations', href: '/proofline/integrations', icon: 'Cable' },
        { label: 'Product Architecture', href: '/proofline/integrations/product-architecture', icon: 'Layers' },
        { label: 'Platform Architecture', href: '/proofline/integrations/platform-architecture', icon: 'Shield' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Lone Star Distribution',
    poweredBy: 'AICR',
  },
});
