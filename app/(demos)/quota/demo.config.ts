import { defineDemo } from '@/components/demo-shell';

export default defineDemo({
  client: {
    name: 'Blue Horizons Group',
    tagline: 'Intelligent Sales Performance Management',
  },
  product: {
    name: 'QUOTA',
    badge: 'SQM Platform',
  },
  theme: 'clean-light',
  colors: {
    primary: '#f59e0b',
    accent: '#ef4444',
  },
  nav: [
    {
      section: 'Executive Command Center',
      items: [
        { label: 'Performance Dashboard', href: '/quota/executive-command-center/performance-dashboard', icon: 'LayoutDashboard' },
        { label: 'Revenue Overview', href: '/quota/executive-command-center/revenue-overview', icon: 'DollarSign' },
        { label: 'Territory Heatmap', href: '/quota/executive-command-center/territory-heatmap', icon: 'Map' },
        { label: 'Team Scorecards', href: '/quota/executive-command-center/team-scorecards', icon: 'Users' },
        { label: 'Executive Alerts', href: '/quota/executive-command-center/executive-alerts', icon: 'Bell' },
      ],
    },
    {
      section: 'Sales Operations',
      items: [
        { label: 'Quota Assignment', href: '/quota/sales-operations/quota-assignment', icon: 'Target' },
        { label: 'Performance Tracking', href: '/quota/sales-operations/performance-tracking', icon: 'TrendingUp' },
        { label: 'Commission Calculations', href: '/quota/sales-operations/commission-calculations', icon: 'Calculator' },
        { label: 'Pipeline Management', href: '/quota/sales-operations/pipeline-management', icon: 'GitBranch' },
        { label: 'Territory Planning', href: '/quota/sales-operations/territory-planning', icon: 'MapPin' },
        { label: 'Goal Setting', href: '/quota/sales-operations/goal-setting', icon: 'Flag' },
      ],
    },
    {
      section: 'Intelligence & Analytics',
      items: [
        { label: 'Predictive Forecasting', href: '/quota/intelligence-analytics/predictive-forecasting', icon: 'TrendingUp' },
        { label: 'Performance Analytics', href: '/quota/intelligence-analytics/performance-analytics', icon: 'BarChart3' },
        { label: 'Quota Attainment', href: '/quota/intelligence-analytics/quota-attainment-insights', icon: 'Target' },
        { label: 'AI Recommendations', href: '/quota/intelligence-analytics/ai-recommendations', icon: 'Sparkles' },
        { label: 'Custom Reports', href: '/quota/intelligence-analytics/custom-reports', icon: 'FileText' },
        { label: 'Competitive Intel', href: '/quota/intelligence-analytics/competitive-intelligence', icon: 'Shield' },
      ],
    },
    {
      section: 'Administration',
      items: [
        { label: 'System Config', href: '/quota/administration-control/system-configuration', icon: 'Settings' },
        { label: 'User Management', href: '/quota/administration-control/user-management', icon: 'Users' },
        { label: 'Compensation Plans', href: '/quota/administration-control/compensation-plans', icon: 'Coins' },
        { label: 'Audit & Compliance', href: '/quota/administration-control/audit-compliance', icon: 'ShieldCheck' },
        { label: 'Integration Hub', href: '/quota/administration-control/integration-hub', icon: 'Plug' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Blue Horizons Group',
    poweredBy: 'AICR',
  },
});
