import { defineDemo } from '@/components/shell';
import { HeartHandshake } from 'lucide-react';

export default defineDemo({
  slug: 'phoenix-intel',
  client: {
    name: 'The Phoenix Philanthropy Group',
    tagline: 'Advancement Intelligence Platform',
    region: 'National Nonprofit Consultancy',
    logo: HeartHandshake,
  },
  product: {
    name: 'PHOENIX INTEL',
    badge: 'Interactive Demo',
  },
  darkMode: true,
  theme: 'phoenix-sapphire',
  colors: {
    primary: '#3b6bf5',
    accent: '#c9942b',
  },
  nav: [
    {
      section: 'Business Development',
      color: '#3b6bf5',
      items: [
        { label: 'Dashboard', href: '/phoenix-intel/dashboard', icon: 'LayoutDashboard' },
        { label: 'Pipeline', href: '/phoenix-intel/pipeline', icon: 'GitBranch' },
        { label: 'Sales Process', href: '/phoenix-intel/sales-process', icon: 'ListChecks' },
        { label: 'Scoping / CPQ', href: '/phoenix-intel/scoping', icon: 'SlidersHorizontal' },
        { label: 'Proposals', href: '/phoenix-intel/proposals', icon: 'FileText' },
      ],
    },
    {
      section: 'Client Services',
      color: '#d4a030',
      items: [
        { label: 'Engagements', href: '/phoenix-intel/engagements', icon: 'Briefcase' },
        { label: 'Clients', href: '/phoenix-intel/clients', icon: 'Building2' },
        { label: 'Reports', href: '/phoenix-intel/reports', icon: 'BarChart3' },
      ],
    },
    {
      section: 'Services & Planning',
      color: '#10b981',
      items: [
        { label: 'Services Dashboard', href: '/phoenix-intel/assessments', icon: 'ClipboardCheck' },
        { label: 'Knowledge Base', href: '/phoenix-intel/knowledge', icon: 'BookOpen' },
        { label: 'AI Advisor', href: '/phoenix-intel/knowledge/ai-advisor', icon: 'Brain' },
      ],
    },
    {
      section: 'Operations',
      color: '#f59e0b',
      items: [
        { label: 'Overview', href: '/phoenix-intel/operations', icon: 'Settings' },
        { label: 'Time & Expense', href: '/phoenix-intel/operations/time-expense', icon: 'Clock' },
        { label: 'HR & Compliance', href: '/phoenix-intel/operations/hr', icon: 'UserCog' },
        { label: 'Finance', href: '/phoenix-intel/finance', icon: 'DollarSign' },
        { label: 'P&L', href: '/phoenix-intel/finance/pnl', icon: 'Receipt' },
      ],
    },
    {
      section: 'Marketing & Communications',
      color: '#ec4899',
      items: [
        { label: 'Marketing', href: '/phoenix-intel/marketing', icon: 'Megaphone' },
      ],
    },
    {
      section: 'Advancement Academy',
      color: '#7c3aed',
      items: [
        { label: 'Academy Home', href: '/phoenix-intel/training', icon: 'GraduationCap' },
        { label: 'Course Catalog', href: '/phoenix-intel/training/catalog', icon: 'BookOpen' },
        { label: 'Progress', href: '/phoenix-intel/training/progress', icon: 'CheckSquare' },
        { label: 'AI Builder', href: '/phoenix-intel/training/builder', icon: 'Wand2' },
        { label: 'AI Tutor', href: '/phoenix-intel/training/ai-tutor', icon: 'Sparkles' },
      ],
    },
    {
      section: 'About & Admin',
      color: '#64748b',
      items: [
        { label: 'About', href: '/phoenix-intel/about', icon: 'Info' },
        { label: 'Admin', href: '/phoenix-intel/admin', icon: 'Shield' },
        { label: 'Style Guide', href: '/phoenix-intel/style-guide', icon: 'Palette' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 The Phoenix Philanthropy Group',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Nonprofit Consultancy',
    tagline: 'Advancement intelligence platform for nonprofit fundraising consultants',
    color: '#3b6bf5',
  },
});
