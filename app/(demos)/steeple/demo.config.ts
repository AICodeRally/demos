import { defineDemo } from '@/components/shell';
import { Church } from 'lucide-react';

export default defineDemo({
  slug: 'steeple',
  client: {
    name: 'Grace Community Church',
    tagline: 'Church Management Platform',
    region: 'National',
    logo: Church,
  },
  product: {
    name: 'STEEPLE',
    badge: 'Interactive Demo',
  },
  theme: 'clean-light',
  colors: {
    primary: '#522398',
    accent: '#C5972C',
  },
  nav: [
    {
      section: 'Ministry',
      color: '#522398',
      items: [
        { label: 'Ministry Overview', href: '/steeple', icon: 'LayoutDashboard' },
        { label: 'Stewardship & Finance', href: '/steeple/tfm', icon: 'DollarSign' },
        { label: 'Events & Gatherings', href: '/steeple/evm', icon: 'Calendar' },
        { label: 'Congregation & Families', href: '/steeple/mbm', icon: 'Users' },
        { label: 'Outreach & Communications', href: '/steeple/com', icon: 'MessageSquare' },
        { label: 'Campus & Facilities', href: '/steeple/flm', icon: 'Building' },
        { label: 'Leadership & Ministry', href: '/steeple/ldm', icon: 'UserCog' },
        { label: 'Insights & Analytics', href: '/steeple/rpm', icon: 'BarChart3' },
      ],
    },
    {
      section: 'AI Platform',
      color: '#06B6D4',
      items: [
        { label: 'AI Hub', href: '/steeple/ai', icon: 'Brain' },
        { label: 'Ministry Health', href: '/steeple/ai/ops', icon: 'Activity' },
        { label: 'Ministry Pulse', href: '/steeple/ai/pulse', icon: 'Radio' },
        { label: 'Ask Steeple', href: '/steeple/ai/ask', icon: 'Sparkles' },
        { label: 'Audit Trail', href: '/steeple/ai/spine', icon: 'Shield' },
        { label: 'AI Sessions', href: '/steeple/ai/sessions', icon: 'Bot' },
      ],
    },
    {
      section: 'Partnership',
      color: '#C5972C',
      items: [
        { label: 'GCU Partnership', href: '/steeple/pitch', icon: 'Handshake' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Grace Community Church',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Church Management',
    tagline: 'Full-spectrum church management and ministry platform',
    color: '#8b5cf6',
  },
});
