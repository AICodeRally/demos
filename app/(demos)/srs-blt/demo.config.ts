import { defineDemo } from '@/components/shell';
import { Building2 } from 'lucide-react';

export default defineDemo({
  slug: 'srs-blt',
  darkMode: false,
  client: {
    name: 'SRS Distribution',
    tagline: 'Branch Leadership Team',
    region: '48 States — 982 Branches',
    logo: Building2,
  },
  product: {
    name: 'SRS BLT',
    badge: 'Interactive Demo',
  },
  theme: 'clean-light',
  colors: {
    primary: '#0F2942',
    accent: '#059669',
  },
  nav: [
    {
      section: 'Branch Operations',
      color: '#0F2942',
      items: [
        { label: 'Persona Select', href: '/srs-blt', icon: 'Users' },
        { label: 'Org Hierarchy', href: '/srs-blt/hierarchy', icon: 'GitBranch' },
        { label: 'Branch Portal', href: '/srs-blt/portal', icon: 'Building2' },
      ],
    },
    {
      section: 'Compensation',
      color: '#059669',
      items: [
        { label: 'Comp Plans', href: '/srs-blt/comp', icon: 'Trophy' },
      ],
    },
    {
      section: 'Governance',
      color: '#7C3AED',
      items: [
        { label: 'Timeline', href: '/srs-blt/timeline', icon: 'CalendarRange' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 SRS Distribution',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Specialty Trade Distribution',
    tagline: 'Branch Leadership Team — 982 branches, dual divisions, persona-based comp & territory management',
    color: '#0F2942',
  },
});
