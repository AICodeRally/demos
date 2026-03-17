import { defineDemo } from '@/components/shell';
import { Shield } from 'lucide-react';

export default defineDemo({
  slug: 'aegis',
  client: {
    name: 'Ironclad Crisis Group',
    tagline: 'Privilege-First Crisis Defense',
    region: 'National',
    logo: Shield,
  },
  product: {
    name: 'AEGIS',
    badge: 'Interactive Demo',
  },
  theme: 'aegis-ivory',
  colors: {
    primary: '#8B7355',
    accent: '#6B5B45',
  },
  nav: [
    {
      section: 'Act 1 \u2014 Firm & Readiness',
      color: '#8B7355',
      items: [
        { label: 'Practice Overview', href: '/aegis/firm/overview', icon: 'Building2' },
        { label: 'Client Portfolio', href: '/aegis/firm/clients', icon: 'Users' },
        { label: 'Readiness Scores', href: '/aegis/firm/readiness', icon: 'Shield' },
        { label: 'Playbook Library', href: '/aegis/firm/playbooks', icon: 'BookOpen' },
        { label: 'Threat Landscape', href: '/aegis/firm/threats', icon: 'Radar' },
      ],
    },
    {
      section: 'Act 2 \u2014 Detection & Mobilization',
      color: '#DC2626',
      items: [
        { label: 'Incident Intake', href: '/aegis/crisis/intake', icon: 'AlertTriangle' },
        { label: 'Triage Dashboard', href: '/aegis/crisis/triage', icon: 'Activity' },
        { label: 'Team Assembly', href: '/aegis/crisis/team', icon: 'UserPlus' },
        { label: 'War Room', href: '/aegis/crisis/warroom', icon: 'Lock' },
        { label: 'Legal Hold', href: '/aegis/crisis/hold', icon: 'FileWarning' },
      ],
    },
    {
      section: 'Act 3 \u2014 Active Response',
      color: '#7C3AED',
      items: [
        { label: 'Command Center', href: '/aegis/response/command', icon: 'Monitor' },
        { label: 'Evidence Vault', href: '/aegis/response/evidence', icon: 'Database' },
        { label: 'Communications', href: '/aegis/response/comms', icon: 'Radio' },
        { label: 'Regulatory Tracker', href: '/aegis/response/regulatory', icon: 'Scale' },
        { label: 'Task Board', href: '/aegis/response/tasks', icon: 'KanbanSquare' },
        { label: 'Incident Timeline', href: '/aegis/response/timeline', icon: 'Clock' },
      ],
    },
    {
      section: 'Act 4 \u2014 Resolution & Intelligence',
      color: '#059669',
      items: [
        { label: 'Remediation Plan', href: '/aegis/resolution/remediation', icon: 'Wrench' },
        { label: 'After-Action Review', href: '/aegis/resolution/aar', icon: 'ClipboardCheck' },
        { label: 'Financial Impact', href: '/aegis/resolution/financials', icon: 'DollarSign' },
        { label: 'Client Report', href: '/aegis/resolution/report', icon: 'FileText' },
        { label: 'CEO Dashboard', href: '/aegis/resolution/ceo', icon: 'BarChart3' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Ironclad Crisis Group',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Crisis Management',
    tagline: 'Privilege-first crisis defense for law firms and corporate counsel',
    color: '#D4A574',
  },
});
