export interface KioskWaypoint {
  /** CSS selector or element ID (prefixed with #) to scroll to */
  selector: string;
  /** Seconds to pause on this waypoint */
  pause: number;
  /** Title shown in kiosk banner */
  title: string;
  /** Description shown in kiosk banner (larger text for talk track) */
  description: string;
}

export interface TourStep {
  path: string;
  title: string;
  description: string;
  position: 'top-right' | 'bottom-right' | 'center';
  highlight?: string;
  duration?: number;
  /** Skip auto-scroll for this step (e.g., when a modal is shown) */
  noScroll?: boolean;
  waypoints?: KioskWaypoint[];
}

export const TOUR_STEPS: TourStep[] = [
  {
    path: '/sales/territory',
    title: 'Territory Day Planner',
    description:
      'AI-optimized daily route: one drive, seven stops, $485K in pipeline. Every stop enriched with last visit notes, AI insights, and equipment needs.',
    position: 'top-right' as const,
    duration: 45,
    waypoints: [
      {
        selector: '#kiosk-kpis',
        pause: 3,
        title: 'Route Overview',
        description: '7 stops, $485K pipeline, 2h 45m drive \u2014 all AI-optimized from 6 data sources.',
      },
      {
        selector: '#kiosk-map',
        pause: 5,
        title: 'AI-Optimized Route',
        description: 'AI analyzed Dodge permits, CRM history, telematics, and maps to plan today\'s route. 42 miles saved vs. naive ordering.',
      },
      {
        selector: '#kiosk-stop-1',
        pause: 4,
        title: 'Stop 1 \u2014 Primary Job Site',
        description: 'ABC Construction: $180K revenue potential. Curtain wall phase starts in 12 days \u2014 window to lock aerial equipment before SunState quotes.',
      },
      {
        selector: '#kiosk-stop-2',
        pause: 3,
        title: 'Stop 2 \u2014 Opportunity',
        description: 'Meridian Homes: just 4 miles from primary. $65K in pending quotes, 3 active rentals expiring soon.',
      },
      {
        selector: '#kiosk-stop-3',
        pause: 3,
        title: 'Stop 3 \u2014 Follow-Up',
        description: 'Desert Ridge Development: excavation crew needs additional compact equipment. Last visit identified expansion opportunity.',
      },
      {
        selector: '#kiosk-stop-4',
        pause: 3,
        title: 'Stop 4 \u2014 Drive-By',
        description: 'Kiewit I-17 Interchange: $120K highway project. Dodge data shows they\'re renting from competitor \u2014 drop off a rate card.',
      },
      {
        selector: '#kiosk-stop-5',
        pause: 3,
        title: 'Stop 5 \u2014 Opportunity',
        description: 'Valley Solar Farm: new 200-acre installation, 18 boom lifts needed. First mover advantage \u2014 no current rental vendor.',
      },
      {
        selector: '#kiosk-stop-6',
        pause: 3,
        title: 'Stop 6 \u2014 Follow-Up',
        description: 'Penta Building Group: contract renewal window closes Friday. Current spend $8K/month \u2014 upsell opportunity on telehandlers.',
      },
      {
        selector: '#kiosk-stop-7',
        pause: 3,
        title: 'Stop 7 \u2014 Branch Return',
        description: 'Back to Scottsdale branch. Route complete \u2014 118 miles, 7 customer touchpoints, $485K pipeline covered.',
      },
      {
        selector: '#kiosk-summary',
        pause: 5,
        title: 'The Result',
        description: 'One drive. Seven opportunities. $485K in pipeline. Without AI, Marcus visits 1 customer and drives 42 extra miles.',
      },
    ],
  },
  {
    path: '/sales/intel',
    title: 'Predictive Sales Intelligence',
    description:
      'AI fuses Dodge Construction data, weather, permits, telematics, and CRM to give reps their top 10 revenue moves every morning. Reactive to predictive.',
    position: 'top-right' as const,
    duration: 12,
    noScroll: true,
  },
  {
    path: '/sales/comp',
    title: 'Comp & Rate Impact',
    description:
      'Sales compensation tied directly to rate compliance. Reps who hold rates earn more.',
    position: 'top-right',
    noScroll: true,
  },
  {
    path: '/rates/scorecard',
    title: 'Rate Governance Scorecard',
    description:
      'Track margin targets vs. actuals across every equipment category. Identify where reps are discounting.',
    position: 'top-right',
    duration: 10,
    noScroll: true,
  },
  {
    path: '/rates/leakage',
    title: 'Rate Leakage Analysis',
    description:
      'The wow factor \u2014 $47K in rate leakage identified across 23 contracts. AI recommends corrective actions.',
    position: 'top-right',
    duration: 12,
    noScroll: true,
  },
  {
    path: '/settings',
    title: 'Connected Integrations',
    description:
      'Six industry systems connected: Wynne, Point of Rental, Trackunit, SmartEquip, Rouse Analytics, and ARA Benchmarks.',
    position: 'top-right',
    noScroll: true,
  },
];

export const DEFAULT_STEP_DURATION = 14;
