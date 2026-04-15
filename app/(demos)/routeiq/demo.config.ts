import { defineDemo } from '@/components/shell';
import { Crown } from 'lucide-react';

export default defineDemo({
  slug: 'routeiq',
  darkMode: true,
  client: {
    name: 'Royal Distributing',
    tagline: 'Revenue Operating System',
    region: 'Multi-State — HQ Kansas City, MO',
    logo: Crown,
  },
  product: {
    name: 'ROUTEIQ',
    badge: 'Interactive Demo',
  },
  theme: 'midnight',
  colors: {
    primary: '#4338CA',
    accent: '#F59E0B',
  },
  nav: [
    {
      section: 'Observe',
      color: '#4338CA',
      items: [
        { label: 'Cockpit', href: '/routeiq/cockpit', icon: 'Gauge' },
        { label: 'Demand Engine', href: '/routeiq/demand', icon: 'TrendingUp' },
      ],
    },
    {
      section: 'Execute',
      color: '#7C3AED',
      items: [
        { label: 'Deal Execution', href: '/routeiq/deals', icon: 'Target' },
        { label: 'Pricing & Margin', href: '/routeiq/margin', icon: 'Coins' },
      ],
    },
    {
      section: 'Plan',
      color: '#0EA5E9',
      items: [
        { label: 'Capacity & Coverage', href: '/routeiq/capacity', icon: 'Users' },
        { label: 'Comp & Behavior', href: '/routeiq/comp', icon: 'Trophy' },
        { label: 'Payout Calculator', href: '/routeiq/comp/calculator', icon: 'Calculator' },
        { label: '13-Week Story', href: '/routeiq/comp/story', icon: 'LineChart' },
      ],
    },
    {
      section: 'Trust',
      color: '#10B981',
      items: [
        { label: 'Forecast & Risk', href: '/routeiq/forecast', icon: 'Compass' },
      ],
    },
    {
      section: 'Act',
      color: '#F59E0B',
      items: [
        { label: 'Execution Layer', href: '/routeiq/action', icon: 'Zap' },
        { label: 'Field Tablet', href: '/routeiq/tablet', icon: 'Tablet' },
      ],
    },
    {
      section: 'System',
      color: '#EC4899',
      items: [
        { label: 'System View', href: '/routeiq/system', icon: 'Network' },
      ],
    },
  ],
  footer: {
    copyright: '© 2026 Royal Distributing',
    poweredBy: 'AICR',
  },
  meta: {
    industry: 'Beverage Distribution',
    tagline: 'Revenue operating system for multi-state F&B distribution — organized by failure points, not tools',
    color: '#4338CA',
  },
});
