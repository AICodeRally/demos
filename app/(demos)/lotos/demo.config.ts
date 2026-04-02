import { defineDemo } from '@/components/shell';
import { Car } from 'lucide-react';

export default defineDemo({
  slug: 'lotos',
  client: {
    name: 'Sora Auto',
    tagline: 'Dealer Operating System for velocity, cashflow, and compliance',
    region: 'Southwest',
    logo: Car,
  },
  product: {
    name: 'LotOS',
    badge: 'Interactive Demo',
  },
  theme: 'clean-light',
  colors: {
    primary: '#1E3A5F',
    accent: '#E85D2C',
  },
  nav: [
    {
      section: 'Act 1 — The Lot',
      color: '#1E3A5F',
      items: [
        { label: 'Dashboard', href: '/lotos/lot/dashboard', icon: 'LayoutDashboard' },
        { label: 'Inventory', href: '/lotos/lot/inventory', icon: 'Package' },
        { label: 'Recon', href: '/lotos/lot/recon', icon: 'Wrench' },
        { label: 'Marketplace Sync', href: '/lotos/lot/marketplace', icon: 'Globe' },
      ],
    },
    {
      section: 'Act 2 — Sales Floor',
      color: '#2563EB',
      items: [
        { label: 'CRM', href: '/lotos/sales/crm', icon: 'Users' },
        { label: 'Lead Pipeline', href: '/lotos/sales/pipeline', icon: 'Filter' },
        { label: 'Appointments', href: '/lotos/sales/appointments', icon: 'Calendar' },
        { label: 'Test Drive Log', href: '/lotos/sales/test-drives', icon: 'ClipboardList' },
      ],
    },
    {
      section: 'Act 3 — Deal Desk',
      color: '#E85D2C',
      items: [
        { label: 'Desking Tool', href: '/lotos/deals/desking', icon: 'Calculator' },
        { label: 'F&I Menu', href: '/lotos/deals/fni', icon: 'Shield' },
        { label: 'Lender Matching', href: '/lotos/deals/lenders', icon: 'Landmark' },
        { label: 'Contracting', href: '/lotos/deals/contracting', icon: 'FileSignature' },
      ],
    },
    {
      section: 'Act 4 — Back Office',
      color: '#7C3AED',
      items: [
        { label: 'Accounting', href: '/lotos/office/accounting', icon: 'Receipt' },
        { label: 'Floorplan Tracker', href: '/lotos/office/floorplan', icon: 'Banknote' },
        { label: 'Title & DMV', href: '/lotos/office/title-dmv', icon: 'FileText' },
        { label: 'Compliance', href: '/lotos/office/compliance', icon: 'ShieldCheck' },
      ],
    },
    {
      section: 'Act 5 — Command Center',
      color: '#059669',
      items: [
        { label: 'KPI Dashboard', href: '/lotos/command/kpis', icon: 'BarChart3' },
        { label: 'AI Pricing Engine', href: '/lotos/command/pricing', icon: 'TrendingUp' },
        { label: 'Cashflow Forecast', href: '/lotos/command/cashflow', icon: 'DollarSign' },
        { label: 'Aging Report', href: '/lotos/command/aging', icon: 'Clock' },
      ],
    },
    {
      section: 'Act 6 — AskLotOS',
      color: '#DC2626',
      items: [
        { label: 'AskLotOS Chat', href: '/lotos/intelligence/chat', icon: 'MessageSquare' },
        { label: 'Deal Optimizer', href: '/lotos/intelligence/deal-optimizer', icon: 'Zap' },
        { label: 'Acquisition Scorer', href: '/lotos/intelligence/acquisition', icon: 'Target' },
        { label: 'Market Intelligence', href: '/lotos/intelligence/market-intel', icon: 'Radar' },
      ],
    },
  ],
  footer: {
    copyright: '© 2026 Sora Auto',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Automotive — Independent Dealer',
    tagline: 'Dealer Operating System for velocity, cashflow, and compliance',
    color: '#E85D2C',
  },
});
