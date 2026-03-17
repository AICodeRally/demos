import { defineDemo } from '@/components/shell';

export default defineDemo({
  slug: 'quota',
  layout: 'topnav',
  suite: { name: 'PRIZYM', tagline: 'RevOps Suite' },
  module: { code: 'QTA', name: 'QUOTA', description: 'Quota Planning and Attainment' },
  gradient: { start: '#F59E0B', mid: '#F97316', end: '#EF4444' },
  theme: 'prizym-navy',
  nav: [
    {
      section: 'Quota Design',
      items: [
        { label: 'Design Center', href: '/quota/design', icon: 'Compass' },
        { label: 'Allocation Frameworks', href: '/quota/design/allocation-frameworks', icon: 'GitBranch' },
        { label: 'Scenario Simulator', href: '/quota/design/scenario-simulator', icon: 'FlaskConical' },
        { label: 'Quota Forces Model', href: '/quota/design/quota-forces', icon: 'Orbit' },
        { label: 'Ramp Designer', href: '/quota/design/ramp-designer', icon: 'TrendingUp' },
      ],
    },
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
      section: 'Dispute & Fairness',
      items: [
        { label: 'Dispute Console', href: '/quota/dispute/console', icon: 'Scale' },
        { label: 'Fairness Analyzer', href: '/quota/dispute/fairness-analyzer', icon: 'BarChart3' },
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
    copyright: '\u00A9 2026 Prizym',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Prizym RevOps',
    tagline: 'Quota planning and attainment for the modern CRO',
    color: '#f59e0b',
  },
});
