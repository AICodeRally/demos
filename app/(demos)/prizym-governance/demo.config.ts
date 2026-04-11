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
  // Section colors MUST be Tailwind-300-level brights that DON'T match the
  // BG gradient (purple #8b5cf6 → cyan #06b6d4). We stick to warm tones
  // (amber/gold/orange/coral/rose/yellow) plus one mint for variety so
  // every section pops against the cool gradient.
  nav: [
    {
      section: 'Home',
      color: '#fdba74', // orange-300 — distinct against purple→cyan gradient
      items: [
        { label: 'My Workspace', href: '/prizym-governance', icon: 'Home' },
      ],
    },
    {
      section: 'Documents',
      color: '#6ee7b7', // emerald-300 mint
      items: [
        { label: 'Documents Library', href: '/prizym-governance/documents', icon: 'FileText' },
      ],
    },
    {
      section: 'Tools',
      color: '#fcd34d', // amber-300 gold
      items: [
        { label: 'ASC 606 Calculator', href: '/prizym-governance/tools/asc606-calculator', icon: 'Calculator' },
        { label: '88-Checkpoint Framework', href: '/prizym-governance/tools/framework', icon: 'Grid3x3' },
        { label: 'Committees', href: '/prizym-governance/tools/committees', icon: 'Users' },
      ],
    },
    {
      section: 'Compliance',
      color: '#fda4af', // rose-300
      items: [
        { label: 'Obligations', href: '/prizym-governance/compliance/obligations', icon: 'Scale' },
        { label: 'Control Status', href: '/prizym-governance/compliance/controls', icon: 'ShieldCheck' },
        { label: 'Reports', href: '/prizym-governance/compliance/reports', icon: 'BarChart3' },
        { label: 'Audit Readiness', href: '/prizym-governance/compliance/audit', icon: 'ClipboardCheck' },
      ],
    },
    {
      section: 'Workflows',
      color: '#fca5a5', // red-300 coral
      items: [
        { label: 'Actions Queue', href: '/prizym-governance/workflows/actions', icon: 'CheckSquare' },
        { label: 'Cases', href: '/prizym-governance/workflows/cases', icon: 'Briefcase' },
        { label: 'Calendar', href: '/prizym-governance/workflows/calendar', icon: 'Calendar' },
        { label: 'Audit Trail', href: '/prizym-governance/workflows/audit-trail', icon: 'History' },
      ],
    },
    {
      section: 'AI',
      color: '#fde047', // yellow-300
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
