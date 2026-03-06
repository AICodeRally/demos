import { defineDemo } from '@/components/demo-shell';
import { Beer } from 'lucide-react';

export default defineDemo({
  client: {
    name: 'Andrews Distributing',
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
        { label: 'Territory Design', href: '/proofline/strategy/territories', icon: 'Map' },
        { label: 'Quota Waterfall', href: '/proofline/strategy/quotas', icon: 'GitBranch' },
        { label: 'Accounts', href: '/proofline/strategy/accounts', icon: 'Building2' },
        { label: 'Brand Mix', href: '/proofline/strategy/mix', icon: 'Sliders' },
        { label: 'Scenarios', href: '/proofline/strategy/scenarios', icon: 'Shuffle' },
      ],
    },
    {
      section: 'Act 3 \u2014 Sales Operations',
      color: '#2563EB',
      items: [
        { label: 'Day Planner', href: '/proofline/ops/day-planner', icon: 'MapPin' },
        { label: 'Dispatch', href: '/proofline/ops/dispatch', icon: 'Truck' },
        { label: 'Field Intel', href: '/proofline/ops/field-intel', icon: 'Radar' },
        { label: 'Compliance', href: '/proofline/ops/compliance', icon: 'ShieldCheck' },
        { label: 'Inventory', href: '/proofline/ops/inventory', icon: 'Warehouse' },
        { label: 'Manager', href: '/proofline/ops/manager', icon: 'Users' },
        { label: 'AI Intelligence', href: '/proofline/ops/ai', icon: 'Brain' },
      ],
    },
    {
      section: 'Act 4 \u2014 Sales Compensation',
      color: '#10B981',
      items: [
        { label: 'Comp Plan', href: '/proofline/comp/plan', icon: 'Trophy' },
        { label: 'EMCO Gates', href: '/proofline/comp/emco', icon: 'ShieldCheck' },
        { label: 'Kickers', href: '/proofline/comp/kickers', icon: 'Zap' },
        { label: 'Calculator', href: '/proofline/comp/calculator', icon: 'Calculator' },
        { label: 'Visibility', href: '/proofline/comp/visibility', icon: 'TrendingUp' },
        { label: '13-Week Story', href: '/proofline/comp/story', icon: 'LineChart' },
        { label: 'Inquiries', href: '/proofline/comp/inquiries', icon: 'MessageCircleQuestion' },
        { label: 'CEO Impact', href: '/proofline/comp/impact', icon: 'BarChart3' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Andrews Distributing',
    poweredBy: 'AICR',
  },
});
