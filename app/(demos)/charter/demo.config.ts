import { defineDemo } from '@/components/shell';
import { Landmark } from 'lucide-react';

export default defineDemo({
  slug: 'charter',
  client: {
    name: 'Lakeshore Credit Union',
    tagline: 'Member-Owned Since 1968',
    region: '3 Counties \u00B7 18 Branches',
    logo: Landmark,
  },
  product: {
    name: 'CHARTER',
    badge: 'Interactive Demo',
  },
  theme: 'charter-stone',
  colors: {
    primary: '#475569',
    accent: '#B87333',
  },
  nav: [
    {
      section: 'Act 1 \u2014 Institution & Deposits',
      color: '#B87333',
      items: [
        { label: 'Executive Dashboard', href: '/charter/inst/dashboard', icon: 'LayoutDashboard' },
        { label: 'Branch Network', href: '/charter/inst/branches', icon: 'MapPin' },
        { label: 'Deposit Portfolio', href: '/charter/inst/deposits', icon: 'Wallet' },
        { label: 'Member Growth', href: '/charter/inst/members', icon: 'Users' },
        { label: 'Balance Sheet', href: '/charter/inst/balance-sheet', icon: 'Scale' },
      ],
    },
    {
      section: 'Act 2 \u2014 Lending & Underwriting',
      color: '#64748B',
      items: [
        { label: 'Loan Pipeline', href: '/charter/lending/pipeline', icon: 'GitBranch' },
        { label: 'Portfolio Health', href: '/charter/lending/portfolio', icon: 'HeartPulse' },
        { label: 'Underwriting Analytics', href: '/charter/lending/underwriting', icon: 'SearchCheck' },
        { label: 'Mortgage Center', href: '/charter/lending/mortgage', icon: 'Home' },
        { label: 'SBA & Commercial', href: '/charter/lending/commercial', icon: 'Building2' },
      ],
    },
    {
      section: 'Act 3 \u2014 Payments & Digital',
      color: '#0D9488',
      items: [
        { label: 'Payment Operations', href: '/charter/digital/payments', icon: 'ArrowLeftRight' },
        { label: 'Digital Banking', href: '/charter/digital/banking', icon: 'Smartphone' },
        { label: 'Card Services', href: '/charter/digital/cards', icon: 'CreditCard' },
        { label: 'FedNow Dashboard', href: '/charter/digital/fednow', icon: 'Zap' },
        { label: 'Fraud Detection', href: '/charter/digital/fraud', icon: 'ShieldAlert' },
        { label: 'Migration Tracker', href: '/charter/digital/migration', icon: 'ArrowRightLeft' },
      ],
    },
    {
      section: 'Act 4 \u2014 Compliance & Governance',
      color: '#6B8F71',
      items: [
        { label: 'Compliance Dashboard', href: '/charter/compliance/dashboard', icon: 'ClipboardCheck' },
        { label: 'NCUA Exam Readiness', href: '/charter/compliance/exam', icon: 'FileCheck' },
        { label: 'Risk Management', href: '/charter/compliance/risk', icon: 'AlertTriangle' },
        { label: 'Regulatory Reporting', href: '/charter/compliance/reporting', icon: 'FileBarChart' },
        { label: 'Audit Trail', href: '/charter/compliance/audit', icon: 'ScrollText' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Lakeshore Credit Union',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Credit Unions',
    tagline: 'Member-owned financial intelligence for community institutions',
    color: '#B8976A',
  },
});
