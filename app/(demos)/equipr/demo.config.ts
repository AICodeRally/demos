import { defineDemo } from '@/components/shell';

export default defineDemo({
  slug: 'equipr',
  client: {
    name: 'Blue Horizons Equipment Solutions',
    tagline: '',
  },
  product: {
    name: 'EQUIPR',
    badge: 'ARA Show 2026',
  },
  theme: 'clean-light',
  colors: {
    primary: '#1E3A5F',
    accent: '#2563EB',
  },
  nav: [
    {
      section: 'Fleet Overview',
      items: [
        { label: 'Dashboard', href: '/equipr/dashboard', icon: 'LayoutDashboard' },
        { label: 'Inventory', href: '/equipr/inventory', icon: 'Package' },
        { label: 'Calendar', href: '/equipr/calendar', icon: 'Calendar' },
      ],
    },
    {
      section: 'Operations',
      items: [
        { label: 'Reservations', href: '/equipr/reservations', icon: 'ClipboardList' },
        { label: 'Dispatch', href: '/equipr/dispatch', icon: 'Truck' },
        { label: 'Inspections', href: '/equipr/inspections', icon: 'ClipboardCheck' },
        { label: 'Contracts', href: '/equipr/contracts', icon: 'FileSignature' },
      ],
    },
    {
      section: 'AI Intelligence',
      items: [
        { label: 'Predictive Maintenance', href: '/equipr/ai/maintenance', icon: 'Activity' },
        { label: 'Dynamic Pricing', href: '/equipr/ai/pricing', icon: 'DollarSign' },
        { label: 'Damage Detection', href: '/equipr/ai/damage', icon: 'ScanSearch' },
        { label: 'Workforce Intel', href: '/equipr/ai/workforce', icon: 'GraduationCap' },
      ],
    },
    {
      section: 'Rate Governance',
      items: [
        { label: 'Rate Scorecard', href: '/equipr/rates/scorecard', icon: 'BarChart3' },
        { label: 'Leakage Analysis', href: '/equipr/rates/leakage', icon: 'TrendingDown' },
      ],
    },
    {
      section: 'Sales Performance',
      items: [
        { label: 'Territory Planner', href: '/equipr/sales/territory', icon: 'Map' },
        { label: 'Sales Intelligence', href: '/equipr/sales/intel', icon: 'Zap' },
        { label: 'Comp & Rate Impact', href: '/equipr/sales/comp', icon: 'Trophy' },
      ],
    },
    {
      section: 'Admin',
      items: [
        { label: 'Settings', href: '/equipr/settings', icon: 'Settings' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Blue Horizons Group',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Equipment Rental',
    tagline: 'AI-powered fleet intelligence and utilization analytics for rental operations',
    color: '#E87040',
  },
});
