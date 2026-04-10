import { defineDemo } from '@/components/shell';
import { Shield } from 'lucide-react';

export default defineDemo({
  slug: 'prizym-governance',
  client: {
    name: 'Prizym Suite',
    tagline: 'Sales Compensation Governance Platform',
    region: 'Enterprise SPM',
    logo: Shield,
  },
  product: {
    name: 'PRIZYM GOVERNANCE',
    badge: 'Interactive Demo',
  },
  darkMode: true,
  theme: 'prizym-navy',
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
      section: 'Assessment',
      color: '#8b5cf6',
      items: [
        { label: 'Take Assessment', href: '/prizym-governance/assess/wizard', icon: 'ClipboardCheck' },
        { label: 'Scoping', href: '/prizym-governance/assess/scoping', icon: 'SlidersHorizontal' },
        { label: 'Results', href: '/prizym-governance/assess/results', icon: 'BarChart2' },
      ],
    },
    {
      section: 'Design',
      color: '#06b6d4',
      items: [
        { label: 'Comp Plans', href: '/prizym-governance/plans', icon: 'FileText' },
        { label: 'Plan Templates', href: '/prizym-governance/templates', icon: 'LayoutTemplate' },
        { label: 'Frameworks', href: '/prizym-governance/frameworks', icon: 'Network' },
      ],
    },
    {
      section: 'Operate',
      color: '#3b82f6',
      items: [
        { label: 'Policy Library', href: '/prizym-governance/policies', icon: 'BookOpen' },
        { label: 'Document Library', href: '/prizym-governance/documents', icon: 'FolderOpen' },
        { label: 'Audit Trail', href: '/prizym-governance/audit', icon: 'History' },
      ],
    },
    {
      section: 'Oversee',
      color: '#8b5cf6',
      items: [
        { label: 'Committees', href: '/prizym-governance/committees', icon: 'Users' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Prizym Suite — Sales Compensation Governance',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Sales Performance Management',
    tagline: 'Enterprise governance platform for sales compensation programs — policies, plans, approvals, and audit trails',
    color: '#06b6d4',
  },
});
