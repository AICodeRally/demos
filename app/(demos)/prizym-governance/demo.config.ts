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
    primary: '#0ea5e9', // forge SGM gradient start (cyan-500)
    accent: '#8b5cf6',  // forge SGM gradient end (violet-500)
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
      color: '#f0abfc', // fuchsia-300 (matches new success accent)
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
        { label: 'Compliance Center', href: '/prizym-governance/compliance', icon: 'Scale' },
        { label: 'Reports', href: '/prizym-governance/compliance/reports', icon: 'BarChart3' },
      ],
    },
    {
      section: 'Workflows',
      color: '#fca5a5', // red-300 coral
      items: [
        { label: 'Workflows Center', href: '/prizym-governance/workflows', icon: 'CheckSquare' },
        { label: 'Calendar', href: '/prizym-governance/workflows/calendar', icon: 'Calendar' },
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
    color: '#0ea5e9',
  },
});
