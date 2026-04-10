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
  theme: 'sgm-glass',
  colors: {
    primary: '#06b6d4',
    accent: '#8b5cf6',
  },
  nav: [
    {
      section: 'Overview',
      color: '#06b6d4',
      items: [
        { label: 'Home', href: '/prizym-governance', icon: 'Home' },
        { label: 'Dashboard', href: '/prizym-governance/dashboard', icon: 'LayoutDashboard' },
        { label: 'Analytics', href: '/prizym-governance/analytics', icon: 'BarChart3' },
      ],
    },
    {
      section: 'Design',
      color: '#06b6d4',
      items: [
        { label: 'Design Overview', href: '/prizym-governance/design', icon: 'Compass' },
        { label: 'Comp Plans', href: '/prizym-governance/plans', icon: 'FileText' },
        { label: 'Plan Templates', href: '/prizym-governance/templates', icon: 'LayoutTemplate' },
        { label: 'ASC 606 Calculator', href: '/prizym-governance/design/asc606-calculator', icon: 'Calculator' },
        { label: 'ASC 606 Library', href: '/prizym-governance/design/asc606-library', icon: 'Landmark' },
      ],
    },
    {
      section: 'Operate',
      color: '#3b82f6',
      items: [
        { label: 'Operate Overview', href: '/prizym-governance/operate', icon: 'Activity' },
        { label: 'Approvals', href: '/prizym-governance/operate/approvals', icon: 'CheckSquare' },
        { label: 'Decisions', href: '/prizym-governance/operate/decisions', icon: 'Gavel' },
        { label: 'Calendar', href: '/prizym-governance/operate/calendar', icon: 'Calendar' },
        { label: 'Tasks', href: '/prizym-governance/operate/tasks', icon: 'ListTodo' },
        { label: 'Notifications', href: '/prizym-governance/operate/notifications', icon: 'Bell' },
        { label: 'Committees', href: '/prizym-governance/committees', icon: 'Users' },
      ],
    },
    {
      section: 'Dispute',
      color: '#6366f1',
      items: [
        { label: 'Dispute Overview', href: '/prizym-governance/dispute', icon: 'Scale' },
        { label: 'Cases', href: '/prizym-governance/dispute/cases', icon: 'Briefcase' },
      ],
    },
    {
      section: 'Oversee',
      color: '#8b5cf6',
      items: [
        { label: 'Oversee Overview', href: '/prizym-governance/oversee', icon: 'Eye' },
        { label: 'Policy Library', href: '/prizym-governance/policies', icon: 'BookOpen' },
        { label: 'Compliance', href: '/prizym-governance/oversee/compliance', icon: 'ShieldCheck' },
        { label: 'Reports', href: '/prizym-governance/oversee/reports', icon: 'BarChart3' },
        { label: 'Pulse', href: '/prizym-governance/oversee/pulse', icon: 'Activity' },
        { label: 'Audit Trail', href: '/prizym-governance/audit', icon: 'History' },
      ],
    },
    {
      section: 'Library',
      color: '#0ea5e9',
      items: [
        { label: '88-Checkpoint Framework', href: '/prizym-governance/library/framework', icon: 'Grid3x3' },
        { label: 'Governance Frameworks', href: '/prizym-governance/frameworks', icon: 'Network' },
        { label: 'Documents', href: '/prizym-governance/documents', icon: 'FolderOpen' },
        { label: 'Links', href: '/prizym-governance/library/links', icon: 'Link2' },
        { label: 'Search', href: '/prizym-governance/library/search', icon: 'Search' },
      ],
    },
    {
      section: 'AI',
      color: '#ec4899',
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
