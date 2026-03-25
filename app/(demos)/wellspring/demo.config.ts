import { defineDemo } from '@/components/shell';
import { Droplets } from 'lucide-react';

export default defineDemo({
  slug: 'wellspring',
  client: {
    name: 'Permian Basin Resources',
    tagline: 'Delaware Basin \u00B7 Est. 2014',
    region: '60 Wells \u00B7 4 Pads',
    logo: Droplets,
  },
  product: {
    name: 'WELLSPRING',
    badge: 'Interactive Demo',
  },
  theme: 'midnight',
  colors: {
    primary: '#1A1D23',
    accent: '#B45309',
  },
  nav: [
    {
      section: 'Act 1 \u2014 The Landman',
      color: '#C2A04E',
      items: [
        { label: 'Lease Portfolio', href: '/wellspring/land/leases', icon: 'MapPin' },
        { label: 'Mineral Rights', href: '/wellspring/land/minerals', icon: 'Layers' },
        { label: 'RRC Permits', href: '/wellspring/land/permits', icon: 'FileCheck' },
        { label: 'Prospect Pipeline', href: '/wellspring/land/prospects', icon: 'Target' },
      ],
    },
    {
      section: 'Act 2 \u2014 Drilling Superintendent',
      color: '#6B7280',
      items: [
        { label: 'Pad Schedule', href: '/wellspring/drilling/pads', icon: 'CalendarDays' },
        { label: 'Daily Drilling Report', href: '/wellspring/drilling/ddr', icon: 'FileBarChart' },
        { label: 'Rig Dashboard', href: '/wellspring/drilling/rig', icon: 'Gauge' },
        { label: 'Well Program', href: '/wellspring/drilling/program', icon: 'Layers' },
      ],
    },
    {
      section: 'Act 3 \u2014 Production Foreman',
      color: '#B45309',
      items: [
        { label: 'Day Planner', href: '/wellspring/production/day-planner', icon: 'Truck' },
        { label: 'Production Dashboard', href: '/wellspring/production/dashboard', icon: 'LayoutDashboard' },
        { label: 'Well Status Board', href: '/wellspring/production/wells', icon: 'Activity' },
        { label: 'SCADA Alarms', href: '/wellspring/production/alarms', icon: 'AlertTriangle' },
      ],
    },
    {
      section: 'Act 4 \u2014 Operations Manager',
      color: '#0D9488',
      items: [
        { label: 'Field Dashboard', href: '/wellspring/ops/dashboard', icon: 'LayoutDashboard' },
        { label: 'Well Economics', href: '/wellspring/ops/economics', icon: 'DollarSign' },
        { label: 'Pad Comparison', href: '/wellspring/ops/pads', icon: 'BarChart3' },
        { label: 'Resource Planning', href: '/wellspring/ops/resources', icon: 'Users' },
      ],
    },
    {
      section: 'Act 5 \u2014 HSE Officer',
      color: '#DC2626',
      items: [
        { label: 'Inspection Route', href: '/wellspring/hse/inspections', icon: 'ShieldCheck' },
        { label: 'Safety Dashboard', href: '/wellspring/hse/dashboard', icon: 'HeartPulse' },
        { label: 'Flare Monitoring', href: '/wellspring/hse/flares', icon: 'Flame' },
        { label: 'Environmental', href: '/wellspring/hse/environmental', icon: 'TreePine' },
      ],
    },
    {
      section: 'Act 6 \u2014 Royalty Accountant',
      color: '#7C3AED',
      items: [
        { label: 'Revenue Allocation', href: '/wellspring/royalty/allocation', icon: 'GitBranch' },
        { label: 'Owner Payments', href: '/wellspring/royalty/payments', icon: 'CreditCard' },
        { label: 'Production Accounting', href: '/wellspring/royalty/accounting', icon: 'Calculator' },
        { label: 'Tax & Compliance', href: '/wellspring/royalty/tax', icon: 'FileText' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Permian Basin Resources',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Oil & Gas',
    tagline: 'Field operations intelligence for upstream oil and gas producers',
    color: '#D97706',
  },
});
