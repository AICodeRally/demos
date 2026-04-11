import { defineDemo } from '@/components/shell';

export default defineDemo({
  slug: 'prizym-governance',
  client: {
    name: 'Prizym Sales Planning Suite',
    region: 'Enterprise SPM',
  },
  product: {
    name: 'Sales Governance Manager (SGM)',
    badge: 'Interactive Demo',
  },
  darkMode: true,
  theme: 'sgm-compliance',
  showThemeToggle: false,
  colors: {
    primary: '#0891b2',
    accent: '#10b981',
  },
  nav: [
    {
      section: 'Home',
      color: '#0891b2',
      items: [
        { label: 'My Workspace', href: '/prizym-governance', icon: 'Home' },
      ],
    },
    {
      section: 'Documents',
      color: '#1e40af',
      items: [
        { label: 'Documents Library', href: '/prizym-governance/documents', icon: 'FileText' },
      ],
    },
    {
      section: 'Tools',
      color: '#0891b2',
      items: [
        { label: 'ASC 606 Calculator', href: '/prizym-governance/tools/asc606-calculator', icon: 'Calculator' },
        { label: '88-Checkpoint Framework', href: '/prizym-governance/tools/framework', icon: 'Grid3x3' },
        { label: 'Governance Frameworks', href: '/prizym-governance/tools/frameworks', icon: 'Network' },
        { label: 'Committees', href: '/prizym-governance/tools/committees', icon: 'Users' },
      ],
    },
    {
      section: 'Compliance',
      color: '#10b981',
      items: [
        { label: 'Obligations', href: '/prizym-governance/compliance/obligations', icon: 'Scale' },
        { label: 'Control Status', href: '/prizym-governance/compliance/controls', icon: 'ShieldCheck' },
        { label: 'Reports', href: '/prizym-governance/compliance/reports', icon: 'BarChart3' },
        { label: 'Audit Readiness', href: '/prizym-governance/compliance/audit', icon: 'ClipboardCheck' },
      ],
    },
    {
      section: 'Workflows',
      color: '#0ea5e9',
      items: [
        { label: 'Actions Queue', href: '/prizym-governance/workflows/actions', icon: 'CheckSquare' },
        { label: 'Cases', href: '/prizym-governance/workflows/cases', icon: 'Briefcase' },
        { label: 'Calendar', href: '/prizym-governance/workflows/calendar', icon: 'Calendar' },
        { label: 'Audit Trail', href: '/prizym-governance/workflows/audit-trail', icon: 'History' },
      ],
    },
    {
      section: 'AI',
      color: '#8b5cf6',
      items: [
        { label: 'AskSGM Workspace', href: '/prizym-governance/asksgm', icon: 'Sparkles' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Prizym Sales Planning Suite — Sales Governance Manager',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Sales Performance Management',
    tagline: 'Sales Governance Manager (SGM) — part of the Prizym Sales Planning Suite',
    color: '#06b6d4',
  },
});
