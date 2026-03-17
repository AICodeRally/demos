import { defineDemo } from '@/components/shell';
import { Landmark } from 'lucide-react';

export default defineDemo({
  slug: 'meridian',
  cockpit: true,
  darkMode: true,
  client: {
    name: 'Granite Peak Capital',
    tagline: 'Carried Interest & Fund Compensation',
    region: 'M&A / Growth Equity',
    logo: Landmark,
  },
  product: {
    name: 'MERIDIAN',
    badge: 'Interactive Demo',
  },
  theme: 'midnight',
  colors: {
    primary: '#D4A847',
    accent: '#3B82F6',
  },
  nav: [
    {
      section: 'Act 1 \u2014 Fund Overview',
      color: '#D4A847',
      items: [
        { label: 'LP Letter & Strategy', href: '/meridian/fund/strategy', icon: 'Target' },
        { label: 'Fund Structure & Terms', href: '/meridian/fund/terms', icon: 'FileText' },
        { label: 'Capital Deployment', href: '/meridian/fund/deployment', icon: 'TrendingUp' },
      ],
    },
    {
      section: 'Act 2 \u2014 Deal Pipeline',
      color: '#8B5CF6',
      items: [
        { label: 'Active Pipeline', href: '/meridian/deals/pipeline', icon: 'GitBranch' },
        { label: 'Due Diligence', href: '/meridian/deals/diligence', icon: 'Search' },
        { label: 'Sector Analysis', href: '/meridian/deals/sectors', icon: 'PieChart' },
        { label: 'Deal Screening', href: '/meridian/deals/screening', icon: 'Filter' },
      ],
    },
    {
      section: 'Act 3 \u2014 Portfolio Companies',
      color: '#2563EB',
      items: [
        { label: 'Portfolio Overview', href: '/meridian/portfolio/overview', icon: 'LayoutGrid' },
        { label: 'Value Creation', href: '/meridian/portfolio/value-creation', icon: 'Sparkles' },
        { label: 'Operating KPIs', href: '/meridian/portfolio/kpis', icon: 'BarChart3' },
        { label: 'Exit Planning', href: '/meridian/portfolio/exits', icon: 'DoorOpen' },
      ],
    },
    {
      section: 'Act 4 \u2014 Waterfall & Distributions',
      color: '#10B981',
      items: [
        { label: 'Distribution Waterfall', href: '/meridian/waterfall/distribution', icon: 'Layers' },
        { label: 'Hurdle & Catch-Up', href: '/meridian/waterfall/hurdle', icon: 'ArrowUpRight' },
        { label: 'Capital Accounts', href: '/meridian/waterfall/capital', icon: 'Wallet' },
        { label: 'Clawback Analysis', href: '/meridian/waterfall/clawback', icon: 'RotateCcw' },
        { label: 'Structure Comparison', href: '/meridian/waterfall/structures', icon: 'GitCompare' },
      ],
    },
    {
      section: 'Act 5 \u2014 Carry Allocation',
      color: '#0EA5E9',
      items: [
        { label: 'Team Carry Pool', href: '/meridian/carry/pool', icon: 'Users' },
        { label: 'Vesting & Retention', href: '/meridian/carry/vesting', icon: 'Clock' },
        { label: 'Co-Invest Program', href: '/meridian/carry/coinvest', icon: 'Handshake' },
        { label: 'Individual Statements', href: '/meridian/carry/statements', icon: 'Receipt' },
        { label: 'Tax & Accounting', href: '/meridian/carry/tax', icon: 'Calculator' },
        { label: 'LPA Governance', href: '/meridian/carry/governance', icon: 'Scale' },
      ],
    },
    {
      section: 'Act 6 \u2014 Analytics & Platform',
      color: '#F97316',
      items: [
        { label: 'Fund Analytics', href: '/meridian/platform/analytics', icon: 'LineChart' },
        { label: 'Compliance & Reporting', href: '/meridian/platform/compliance', icon: 'ShieldCheck' },
        { label: 'Platform Architecture', href: '/meridian/platform/architecture', icon: 'Shield' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Granite Peak Capital',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Private Equity',
    tagline: 'Carried interest compensation and fund waterfall for M&A-focused PE firms',
    color: '#D4A847',
  },
});
