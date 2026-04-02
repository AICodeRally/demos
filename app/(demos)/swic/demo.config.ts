import { defineDemo } from '@/components/shell';

export default defineDemo({
  slug: 'swic',
  layout: 'focus',
  client: {
    name: 'Prizym Suite',
    tagline: '',
    region: 'Enterprise SPM',
  },
  product: {
    name: 'Prizym SWIC — Sales What-If Calculator',
    badge: 'Live Demo',
  },
  darkMode: true,
  theme: 'prizym-navy',
  colors: {
    primary: '#10b981',
    accent: '#06b6d4',
  },
  nav: [],
  footer: {
    copyright: '\u00A9 2026 Prizym Suite — Part of the Prizym RevOS suite of tools',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Sales Performance Management',
    tagline: 'Interactive what-if scenario modeling for sales compensation — test changes before they go live',
    color: '#10b981',
    externalUrl: 'https://demo.swic-summit.aicoderally.com',
  },
});
