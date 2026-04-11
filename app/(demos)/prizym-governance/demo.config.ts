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
  // Section colors MUST be Tailwind-300-level brights. The BG gradient runs
  // #1e40af → #0891b2 → #10b981 horizontally, so darker base tokens would
  // match the gradient and vanish on hover/active. Every color here was
  // picked to stay readable across the whole gradient.
  nav: [
    {
      section: 'Home',
      color: '#7dd3fc', // cyan-bright
      items: [
        { label: 'My Workspace', href: '/prizym-governance', icon: 'Home' },
      ],
    },
    {
      section: 'Documents',
      color: '#67e8f9', // design-bright (distinct pale cyan)
      items: [
        { label: 'Documents Library', href: '/prizym-governance/documents', icon: 'FileText' },
      ],
    },
    {
      section: 'Tools',
      color: '#fcd34d', // warning-bright (gold — pops on all 3 gradient stops)
      items: [
        { label: 'ASC 606 Calculator', href: '/prizym-governance/tools/asc606-calculator', icon: 'Calculator' },
        { label: '88-Checkpoint Framework', href: '/prizym-governance/tools/framework', icon: 'Grid3x3' },
        { label: 'Governance Frameworks', href: '/prizym-governance/tools/frameworks', icon: 'Network' },
        { label: 'Committees', href: '/prizym-governance/tools/committees', icon: 'Users' },
      ],
    },
    {
      section: 'Compliance',
      color: '#c4b5fd', // oversee-bright (lavender — distinct from the gradient's green end)
      items: [
        { label: 'Obligations', href: '/prizym-governance/compliance/obligations', icon: 'Scale' },
        { label: 'Control Status', href: '/prizym-governance/compliance/controls', icon: 'ShieldCheck' },
        { label: 'Reports', href: '/prizym-governance/compliance/reports', icon: 'BarChart3' },
        { label: 'Audit Readiness', href: '/prizym-governance/compliance/audit', icon: 'ClipboardCheck' },
      ],
    },
    {
      section: 'Workflows',
      color: '#fca5a5', // danger-bright (coral — warm contrast vs the cool gradient)
      items: [
        { label: 'Actions Queue', href: '/prizym-governance/workflows/actions', icon: 'CheckSquare' },
        { label: 'Cases', href: '/prizym-governance/workflows/cases', icon: 'Briefcase' },
        { label: 'Calendar', href: '/prizym-governance/workflows/calendar', icon: 'Calendar' },
        { label: 'Audit Trail', href: '/prizym-governance/workflows/audit-trail', icon: 'History' },
      ],
    },
    {
      section: 'AI',
      color: '#a5b4fc', // dispute-bright (pale indigo)
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
