import { defineDemo } from '@/components/shell';
import { Mountain } from 'lucide-react';

export default defineDemo({
  slug: 'ridgeline',
  darkMode: false,
  client: {
    name: 'SRS Distribution',
    tagline: 'Specialty Trade Distribution RevOps',
    region: '48 States — 982 Branches',
    logo: Mountain,
  },
  product: {
    name: 'RIDGELINE',
    badge: 'Interactive Demo',
  },
  theme: 'clean-light',
  colors: {
    primary: '#1E3A5F',
    accent: '#2563EB',
  },
  nav: [
    {
      section: 'Act 1 \u2014 Executive Strategy',
      color: '#1E3A5F',
      items: [
        { label: 'Division Overview', href: '/ridgeline/strategy/overview', icon: 'Building2' },
        { label: 'Market Position', href: '/ridgeline/strategy/market', icon: 'Globe' },
        { label: 'Org Hierarchy', href: '/ridgeline/strategy/hierarchy', icon: 'GitBranch' },
      ],
    },
    {
      section: 'Act 2 \u2014 Territory & Branch Ops',
      color: '#2563EB',
      items: [
        { label: 'Branch Performance', href: '/ridgeline/territory/branches', icon: 'MapPin' },
        { label: 'Territory Map', href: '/ridgeline/territory/map', icon: 'Map' },
        { label: 'Effective Dating', href: '/ridgeline/territory/dating', icon: 'CalendarRange' },
      ],
    },
    {
      section: 'Act 3 \u2014 Sales Comp & Incentives',
      color: '#10B981',
      items: [
        { label: 'Comp Plans', href: '/ridgeline/comp/plans', icon: 'Trophy' },
        { label: 'Attainment Tiers', href: '/ridgeline/comp/tiers', icon: 'TrendingUp' },
        { label: 'SPIFFs & Promos', href: '/ridgeline/comp/spiffs', icon: 'Zap' },
        { label: 'Calculator', href: '/ridgeline/comp/calculator', icon: 'Calculator' },
      ],
    },
    {
      section: 'Act 4 \u2014 RevOps Control Plane',
      color: '#F59E0B',
      items: [
        { label: 'Disputes & Inquiries', href: '/ridgeline/revops/disputes', icon: 'MessageSquare' },
        { label: 'Vendor Rebates', href: '/ridgeline/revops/rebates', icon: 'Receipt' },
        { label: 'Audit Trail', href: '/ridgeline/revops/audit', icon: 'Shield' },
        { label: 'Reconciliation', href: '/ridgeline/revops/reconciliation', icon: 'CheckCircle' },
      ],
    },
    {
      section: 'Act 5 \u2014 Platform Architecture',
      color: '#7C3AED',
      items: [
        { label: 'Integration Map', href: '/ridgeline/platform/integrations', icon: 'Cable' },
        { label: 'Data Feeds', href: '/ridgeline/platform/feeds', icon: 'Database' },
        { label: 'Microservices', href: '/ridgeline/platform/services', icon: 'Layers' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 SRS Distribution',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Specialty Trade Distribution',
    tagline: 'RevOps & SPM for specialty trade distribution — territory, comp, branch operations',
    color: '#1E3A5F',
  },
});
