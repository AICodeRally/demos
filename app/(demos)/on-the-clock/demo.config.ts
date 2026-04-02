import { defineDemo } from '@/components/shell';
import { Clock } from 'lucide-react';

export default defineDemo({
  slug: 'on-the-clock',
  layout: 'focus',
  client: {
    name: 'NFL Draft 2026',
    tagline: 'Interactive Draft Simulator',
    region: 'National',
    logo: Clock,
  },
  product: {
    name: 'On The Clock — 2026 NFL Draft Simulator',
    badge: 'Interactive Tool',
  },
  theme: 'midnight',
  colors: {
    primary: '#f59e0b',
    accent: '#0f172a',
  },
  nav: [],
  footer: {
    copyright: '© 2026 AI Code Rally',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Sports & Entertainment',
    tagline: 'Simulate the 2026 NFL Draft — spin the wheel, pick your players, build every team\'s roster',
    color: '#22C55E',
  },
});
