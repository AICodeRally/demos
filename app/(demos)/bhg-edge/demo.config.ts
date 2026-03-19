import { defineDemo } from '@/components/shell';
import { BarChart3 } from 'lucide-react';

export default defineDemo({
  slug: 'bhg-edge',
  cockpit: { defaultOpen: true },
  darkMode: true,
  client: {
    name: 'Blue Horizons Group',
    tagline: 'SPM Operations Platform',
    region: 'Sales Performance Management',
    logo: BarChart3,
  },
  product: {
    name: 'BHG EDGE',
    badge: 'Rally Session',
  },
  theme: 'midnight',
  colors: {
    primary: '#1E40AF',
    accent: '#3B82F6',
  },
  nav: [
    {
      section: 'Sales',
      color: '#3B82F6',
      items: [
        { label: 'Dashboard', href: '/bhg-edge/dashboard', icon: 'LayoutDashboard' },
        { label: 'Pipeline', href: '/bhg-edge/pipeline', icon: 'GitBranch' },
        { label: 'Commissions', href: '/bhg-edge/commissions', icon: 'DollarSign' },
        { label: 'Territories', href: '/bhg-edge/territories', icon: 'Map' },
        { label: 'Forecasting', href: '/bhg-edge/forecasting', icon: 'TrendingUp' },
        { label: 'Playbooks', href: '/bhg-edge/playbooks', icon: 'BookOpen' },
      ],
    },
    {
      section: 'Services',
      color: '#10B981',
      items: [
        { label: 'ICM Delivery', href: '/bhg-edge/services', icon: 'Briefcase' },
        { label: 'Project Scoping', href: '/bhg-edge/scoping', icon: 'SlidersHorizontal' },
        { label: 'SOW Management', href: '/bhg-edge/sow', icon: 'FileText' },
        { label: 'Delivery', href: '/bhg-edge/delivery', icon: 'CheckSquare' },
      ],
    },
    {
      section: 'Operations',
      color: '#F59E0B',
      items: [
        { label: 'Reports', href: '/bhg-edge/reports', icon: 'BarChart3' },
        { label: 'Documents', href: '/bhg-edge/documents', icon: 'FolderOpen' },
        { label: 'Projects', href: '/bhg-edge/projects', icon: 'Kanban' },
      ],
    },
    {
      section: 'Marketing',
      color: '#EC4899',
      items: [
        { label: 'Marketing', href: '/bhg-edge/marketing', icon: 'Megaphone' },
        { label: 'Lead Gen', href: '/bhg-edge/lead-gen', icon: 'UserPlus' },
      ],
    },
    {
      section: 'Platform',
      color: '#64748B',
      items: [
        { label: 'Users', href: '/bhg-edge/users', icon: 'Users' },
        { label: 'Settings', href: '/bhg-edge/settings', icon: 'Settings' },
        { label: 'Security', href: '/bhg-edge/security', icon: 'Shield' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Blue Horizons Group',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Sales Performance Management',
    tagline: 'SPM consulting operations platform with ICM services delivery',
    color: '#1E40AF',
  },
});
