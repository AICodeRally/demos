// =============================================================================
// EQUIPR AI Platform — Mock Data
// Equipment-rental-contextualized AI surfaces (Fleet Health, Pulse, Ask EQUIPR, Coaching)
// =============================================================================

// ---------------------------------------------------------------------------
// Orb Definitions
// ---------------------------------------------------------------------------

export interface OrbDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  colorEnd: string;
  status: 'online' | 'warning' | 'critical';
  statusText: string;
  stat: string;
  statLabel: string;
  href: string;
}

export const orbs: OrbDef[] = [
  { id: 'ops', name: 'Fleet Health', description: 'Real-time fleet monitoring & diagnostics', icon: 'HeartPulse', color: '#7C3AED', colorEnd: '#EC4899', status: 'online', statusText: 'Monitoring', stat: '94', statLabel: 'Health Score', href: '/ai/ops' },
  { id: 'pulse', name: 'Pulse Insights', description: 'AI-curated alerts & recommendations', icon: 'Radio', color: '#D97706', colorEnd: '#F59E0B', status: 'online', statusText: 'Streaming', stat: '18', statLabel: 'Active Insights', href: '/ai/pulse' },
  { id: 'ask', name: 'Ask EQUIPR', description: 'AI assistant for fleet operations', icon: 'MessageSquareText', color: '#2563EB', colorEnd: '#06B6D4', status: 'online', statusText: 'Ready', stat: '234', statLabel: 'Queries This Week', href: '/ai/ask' },
  { id: 'coaching', name: 'AI Coaching', description: 'Strategic recommendations & actions', icon: 'Lightbulb', color: '#059669', colorEnd: '#10B981', status: 'online', statusText: 'Active', stat: '8', statLabel: 'Open Recommendations', href: '/ai/pulse' },
];

// ---------------------------------------------------------------------------
// Pulse Cards
// ---------------------------------------------------------------------------

export type PulseUrgency = 'critical' | 'high' | 'medium' | 'low';
export type PulseCardType = 'alert' | 'insight' | 'suggestion';

export interface PulseCardData {
  id: string;
  urgency: PulseUrgency;
  cardType: PulseCardType;
  title: string;
  summary: string;
  whyItMatters: string;
  impact: string;
  source: string;
  actions: string[];
  icon: string;
  createdAt: string;
}

export const pulseCards: PulseCardData[] = [
  {
    id: 'pc-01',
    urgency: 'critical',
    cardType: 'alert',
    title: 'CAT 320 Excavator engine hours approaching service interval',
    summary: 'Unit EX-320-07 has 4,982 engine hours. Service interval is 5,000 hours. At current utilization it will cross the threshold in 3 days.',
    whyItMatters: 'Running past the 5,000-hour interval voids the extended warranty and risks a field breakdown. Cost of an unplanned repair averages $18K vs $3.2K for scheduled service.',
    impact: '$18K potential unplanned repair cost',
    source: 'Maintenance Module',
    actions: ['Schedule preventive service', 'Pull unit from active rentals', 'Notify maintenance team'],
    icon: 'AlertTriangle',
    createdAt: '2026-02-26T07:15:00Z',
  },
  {
    id: 'pc-02',
    urgency: 'critical',
    cardType: 'alert',
    title: '3 boom lifts sitting idle at Mesa yard for 14+ days',
    summary: 'JLG 600S units BL-600-03, BL-600-05, and BL-600-08 have been parked at the Mesa yard since Feb 12 with no reservations booked.',
    whyItMatters: 'Each idle boom lift costs $480/day in depreciation and opportunity cost. 14 days of idle time across 3 units = $20,160 in lost revenue potential.',
    impact: '$20.2K revenue loss over 14 days',
    source: 'Fleet Module',
    actions: ['Relocate to Scottsdale yard', 'Create promotional rate', 'Contact top aerial customers'],
    icon: 'CircleDollarSign',
    createdAt: '2026-02-26T06:30:00Z',
  },
  {
    id: 'pc-03',
    urgency: 'high',
    cardType: 'alert',
    title: 'Rate leakage alert: $4.2K in unauthorized discounts this week',
    summary: '7 rental contracts were issued below floor pricing this week. Largest single discount: 22% off on a CAT 330 to Southwest Grading (no volume agreement in place).',
    whyItMatters: 'Unauthorized discounts erode margin and set precedent for future negotiations. This week\'s leakage is 38% above the 4-week average.',
    impact: '$4,200 in margin erosion this week',
    source: 'Rate Module',
    actions: ['Review flagged contracts', 'Enforce floor pricing policy', 'Schedule rep coaching'],
    icon: 'TrendingDown',
    createdAt: '2026-02-26T08:00:00Z',
  },
  {
    id: 'pc-04',
    urgency: 'high',
    cardType: 'insight',
    title: 'Competitor Sunbelt raised aerial rates 8% — repricing opportunity',
    summary: 'Market intelligence detected Sunbelt\'s posted daily rates for 40-60ft boom lifts increased from $450 to $486. Our current rate: $425/day.',
    whyItMatters: 'With the market leader pricing higher, we have room to raise rates without competitive disadvantage. An $40/day increase across 12 aerial units = $14.4K/month.',
    impact: '$14.4K/month potential revenue uplift',
    source: 'Rate Module',
    actions: ['Adjust aerial rate card', 'Update online pricing', 'Brief sales team on new positioning'],
    icon: 'ArrowUpRight',
    createdAt: '2026-02-25T14:00:00Z',
  },
  {
    id: 'pc-05',
    urgency: 'high',
    cardType: 'alert',
    title: 'GPS signal lost on 2 skid steers for 48+ hours',
    summary: 'Telematics reports no GPS signal from units SS-325-04 (last seen: Tempe job site) and SS-325-09 (last seen: Gilbert yard) since Feb 24 at 3:00 PM.',
    whyItMatters: 'Extended GPS signal loss could indicate theft, equipment moved off-site without authorization, or telematics hardware failure. Each skid steer is valued at $65K.',
    impact: '$130K in at-risk asset value',
    source: 'Fleet Module',
    actions: ['Dispatch field tech to last known location', 'Contact customer on active rental', 'File theft report if not located'],
    icon: 'MapPinOff',
    createdAt: '2026-02-26T05:00:00Z',
  },
  {
    id: 'pc-06',
    urgency: 'medium',
    cardType: 'insight',
    title: 'Inspection compliance at 91% — target is 95%',
    summary: '8 of 87 active rental units are missing their pre-delivery or return inspection within the required 24-hour window. Most gaps are on weekend deliveries.',
    whyItMatters: 'Missed inspections increase damage dispute risk and liability exposure. Last quarter, 3 damage claims totaling $14K had no inspection documentation.',
    impact: '9% inspection gap, $14K dispute exposure',
    source: 'Safety Module',
    actions: ['Assign weekend inspection coverage', 'Enable mobile inspection app', 'Review missed units'],
    icon: 'ClipboardCheck',
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'pc-07',
    urgency: 'medium',
    cardType: 'alert',
    title: 'Reservation conflict: CAT 330 double-booked for March 5-7',
    summary: 'Unit EX-330-02 is reserved by both Desert Ridge Construction (confirmed Feb 20) and Pinnacle Grading (confirmed Feb 24) for the same dates.',
    whyItMatters: 'Double-bookings damage customer trust and force expensive last-minute substitutions or external re-rentals. Average re-rent cost is $400/day above our rate.',
    impact: '$1,200 potential re-rent cost',
    source: 'Reservation Module',
    actions: ['Contact Pinnacle Grading to reschedule', 'Offer substitute unit', 'Fix booking system conflict check'],
    icon: 'CalendarX',
    createdAt: '2026-02-25T09:00:00Z',
  },
  {
    id: 'pc-08',
    urgency: 'medium',
    cardType: 'insight',
    title: 'Fuel consumption anomaly on Volvo A30G — 23% above baseline',
    summary: 'Articulated hauler AH-A30-01 is consuming 18.4 gal/hr vs the 15.0 gal/hr baseline. Pattern started 10 days ago and correlates with increased idle time.',
    whyItMatters: 'Excessive fuel consumption may indicate engine issues, operator misuse, or a calibration problem. At current rates, the anomaly costs an extra $82/day in fuel.',
    impact: '$82/day excess fuel cost',
    source: 'Fleet Module',
    actions: ['Schedule diagnostic check', 'Review operator behavior data', 'Compare with fleet baseline'],
    icon: 'Fuel',
    createdAt: '2026-02-24T16:00:00Z',
  },
  {
    id: 'pc-09',
    urgency: 'medium',
    cardType: 'suggestion',
    title: 'Customer satisfaction trending up: 4.7/5.0 this month',
    summary: 'Average post-rental survey score rose from 4.4 to 4.7 over the past 30 days. Delivery timeliness (4.8) and equipment condition (4.9) scored highest.',
    whyItMatters: 'High satisfaction drives repeat business and referrals. Customers rating 4.5+ have a 78% rebooking rate vs 34% for those below 4.0.',
    impact: 'Projected 78% rebooking rate',
    source: 'Reservation Module',
    actions: ['Share results with team', 'Recognize top delivery crews', 'Identify low-score accounts for follow-up'],
    icon: 'ThumbsUp',
    createdAt: '2026-02-24T12:00:00Z',
  },
  {
    id: 'pc-10',
    urgency: 'low',
    cardType: 'suggestion',
    title: 'Weekend utilization opportunity: 34 units idle Saturday-Sunday',
    summary: 'Analysis of the past 4 weekends shows an average of 34 units sitting idle. Weekend utilization is 41% vs 78% on weekdays.',
    whyItMatters: 'A weekend promotional rate (e.g., 3-day weekend special at 2-day pricing) could activate even 10 of those units, generating an estimated $8.5K/weekend.',
    impact: '$8.5K/weekend potential revenue',
    source: 'Fleet Module',
    actions: ['Design weekend rate promotion', 'Target landscaping contractors', 'Enable online weekend booking'],
    icon: 'Calendar',
    createdAt: '2026-02-23T10:00:00Z',
  },
  {
    id: 'pc-11',
    urgency: 'low',
    cardType: 'insight',
    title: 'New OSHA safety bulletin affects boom lift inspections',
    summary: 'OSHA Notice 2026-03 updates fall protection inspection requirements for aerial work platforms over 40ft. Effective April 1, 2026.',
    whyItMatters: 'Non-compliance can result in $15,876 per-violation penalties. We have 18 boom lifts affected. Current inspection checklist needs 3 additional items.',
    impact: '18 units need updated inspection protocol',
    source: 'Safety Module',
    actions: ['Update inspection checklist', 'Train field inspectors', 'Document compliance plan'],
    icon: 'ShieldCheck',
    createdAt: '2026-02-22T14:00:00Z',
  },
  {
    id: 'pc-12',
    urgency: 'low',
    cardType: 'suggestion',
    title: 'Telematics data shows optimal delivery route saves 18 min/trip',
    summary: 'GPS route analysis of the past 60 deliveries to the Chandler/Gilbert area identifies an alternative route via AZ-202 that avoids I-10 congestion.',
    whyItMatters: 'With 8-12 deliveries per week to that zone, saving 18 minutes per trip frees up approximately 3 driver-hours per week — enough for 1-2 additional deliveries.',
    impact: '3 hrs/week freed up, 1-2 extra deliveries',
    source: 'Dispatch Module',
    actions: ['Update default route in dispatch system', 'Brief drivers on new route', 'Monitor fuel savings'],
    icon: 'Route',
    createdAt: '2026-02-21T09:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Coaching Cards
// ---------------------------------------------------------------------------

export type CoachingCategory = 'revenue' | 'operations' | 'safety' | 'efficiency' | 'growth';

export interface CoachingCardData {
  id: string;
  category: CoachingCategory;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  recommendation: string;
  expectedImpact: string;
  actionSteps: string[];
  metrics: string;
  icon: string;
  color: string;
}

export const coachingCards: CoachingCardData[] = [
  {
    id: 'cc-01',
    category: 'revenue',
    priority: 'HIGH',
    title: 'Relocate 3 idle boom lifts from Mesa to Scottsdale',
    recommendation: 'Three JLG 600S boom lifts have been idle at the Mesa yard for 14+ days while the Scottsdale yard has had 4 unfulfilled aerial requests this month. Relocating these units would immediately serve demand.',
    expectedImpact: 'Recover $6,700/week in rental revenue from currently idle assets',
    actionSteps: [
      'Schedule transport for BL-600-03, BL-600-05, BL-600-08 to Scottsdale yard',
      'Notify Scottsdale dispatch of incoming availability',
      'Contact the 4 customers who had unfulfilled aerial requests',
      'Update fleet location in reservation system',
    ],
    metrics: 'Current Mesa aerial utilization: 42% | Scottsdale demand fill rate: 71%',
    icon: 'Truck',
    color: '#2563EB',
  },
  {
    id: 'cc-02',
    category: 'revenue',
    priority: 'HIGH',
    title: 'Implement dynamic pricing on excavators — demand signals show 15% upside',
    recommendation: 'Excavator demand is 22% above seasonal average. Combined with Sunbelt\'s 8% rate increase, there is a clear window to raise excavator rates by 12-15% without impacting booking velocity.',
    expectedImpact: 'Projected $18.2K/month additional margin across 14 excavator units',
    actionSteps: [
      'Analyze booking velocity at current vs. proposed rates',
      'Set new rate card effective March 1 for all excavator classes',
      'Grandfather existing reservations at current rates',
      'Monitor booking pace weekly and adjust if velocity drops below 85%',
    ],
    metrics: 'Current excavator utilization: 88% | Avg daily rate: $1,450 | Proposed: $1,668',
    icon: 'DollarSign',
    color: '#059669',
  },
  {
    id: 'cc-03',
    category: 'operations',
    priority: 'MEDIUM',
    title: 'Cross-train 4 junior techs on hydraulic systems',
    recommendation: '41% of all maintenance work orders involve hydraulic systems, but only 2 of 6 technicians are certified. This bottleneck extends average repair time by 1.8 days when the certified techs are unavailable.',
    expectedImpact: 'Reduce hydraulic repair backlog by 60% and cut average downtime from 3.2 to 1.4 days',
    actionSteps: [
      'Enroll 4 junior techs in CAT Hydraulic Systems certification (2-week course)',
      'Pair each trainee with a certified tech for 2 weeks of ride-along',
      'Update work order routing to include newly certified techs',
      'Track first-time fix rate for newly certified techs over 90 days',
    ],
    metrics: 'Current certified techs: 2/6 | Hydraulic work orders: 41% of total | Avg wait: 1.8 days',
    icon: 'Wrench',
    color: '#D97706',
  },
  {
    id: 'cc-04',
    category: 'efficiency',
    priority: 'MEDIUM',
    title: 'Switch to predictive oil analysis — save $12K/yr in unnecessary changes',
    recommendation: 'Current policy changes oil every 500 hours regardless of condition. Oil analysis data from the past 6 months shows 68% of changes are premature. A predictive approach based on oil sample testing can safely extend intervals to 750 hours.',
    expectedImpact: 'Save $12,400/year in parts and labor while improving uptime by 2%',
    actionSteps: [
      'Partner with Polaris Labs for monthly oil sample kits ($8/sample)',
      'Install sampling ports on top 30 revenue units',
      'Train techs on sample collection procedure',
      'Set condition-based thresholds to trigger oil changes',
    ],
    metrics: 'Current interval: 500 hrs | Proposed: 750 hrs (condition-based) | Annual savings: $12.4K',
    icon: 'Beaker',
    color: '#8B5CF6',
  },
  {
    id: 'cc-05',
    category: 'growth',
    priority: 'LOW',
    title: 'Launch contractor loyalty program — top 20 accounts = 62% of revenue',
    recommendation: 'Analysis shows the top 20 accounts generate 62% of total rental revenue. A tiered loyalty program (Bronze/Silver/Gold) with guaranteed availability, priority delivery, and modest rate discounts would lock in long-term commitments.',
    expectedImpact: 'Increase top-20 account retention from 84% to 95%, protecting $1.8M in annual revenue',
    actionSteps: [
      'Define 3 loyalty tiers with clear benefits and qualification criteria',
      'Build simple tracking dashboard for account managers',
      'Pilot with top 5 accounts for 90 days',
      'Roll out to top 20 with branded loyalty cards and welcome kits',
    ],
    metrics: 'Top-20 revenue: $1.8M/yr (62%) | Current retention: 84% | Target: 95%',
    icon: 'Award',
    color: '#C5972C',
  },
];

// ---------------------------------------------------------------------------
// Fleet Health Dimensions
// ---------------------------------------------------------------------------

export interface HealthDimension {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  details: string;
}

export const healthDimensions: HealthDimension[] = [
  { name: 'Fleet Readiness', score: 94, trend: 'up', color: '#2563EB', details: '82 of 87 units available for dispatch. 5 in scheduled maintenance.' },
  { name: 'Utilization', score: 72, trend: 'up', color: '#7C3AED', details: 'Time utilization at 72%, up from 68% last month. Dollar utilization at 78%.' },
  { name: 'Maintenance Compliance', score: 91, trend: 'stable', color: '#D97706', details: '91% of PMs completed on schedule. 4 units within 100 hours of next interval.' },
  { name: 'Safety Score', score: 96, trend: 'stable', color: '#059669', details: 'Zero lost-time incidents in 180 days. All inspections current except 8 weekend gaps.' },
  { name: 'Revenue per Unit', score: 88, trend: 'up', color: '#0891B2', details: 'Avg RPU $1,634/month, up 6.2% from $1,539 last quarter. Excavators leading at $2,180.' },
  { name: 'Customer Satisfaction', score: 85, trend: 'up', color: '#EC4899', details: 'Post-rental NPS at 4.7/5.0. Delivery timeliness and equipment condition scored highest.' },
];

export const healthTrendData = [
  { week: 'W1', score: 88 },
  { week: 'W2', score: 89 },
  { week: 'W3', score: 88 },
  { week: 'W4', score: 90 },
  { week: 'W5', score: 91 },
  { week: 'W6', score: 90 },
  { week: 'W7', score: 91 },
  { week: 'W8', score: 92 },
  { week: 'W9', score: 91 },
  { week: 'W10', score: 93 },
  { week: 'W11', score: 93 },
  { week: 'W12', score: 94 },
];

export const healthAlerts = [
  { severity: 'critical' as const, title: 'CAT 320 Excavator approaching 5,000-hour service interval', detail: 'Unit EX-320-07 at 4,982 hours. Must be pulled from active rentals within 3 days.', time: '2h ago' },
  { severity: 'warning' as const, title: 'GPS signal lost on 2 skid steers', detail: 'Units SS-325-04 and SS-325-09 offline for 48+ hours. Last seen in Tempe and Gilbert.', time: '6h ago' },
  { severity: 'info' as const, title: 'Quarterly DOT inspection due for 4 transport trucks', detail: 'Trucks TR-01, TR-02, TR-04, TR-06 need DOT inspection by March 15. Schedule with Phoenix Truck Center.', time: '1d ago' },
  { severity: 'info' as const, title: 'Telematics firmware update available for 12 units', detail: 'JohnDeere Connected machines have v4.2 firmware ready. Update adds fuel efficiency reporting.', time: '2d ago' },
];

// ---------------------------------------------------------------------------
// Ask EQUIPR (Pre-filled Demo Conversation)
// ---------------------------------------------------------------------------

export interface AskMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; docId?: string }[];
  mode: string;
}

export const askConversation: AskMessage[] = [
  {
    id: 'ask-01',
    role: 'user',
    content: 'What excavators do we have available next week?',
    mode: '.fleet',
  },
  {
    id: 'ask-02',
    role: 'assistant',
    content: 'Here\'s the excavator availability for March 2-8:\n\n| Unit | Model | Location | Status | Available |\n|------|-------|----------|--------|-----------|\n| EX-320-05 | CAT 320 | Scottsdale | Ready | Mar 2-8 |\n| EX-320-09 | CAT 320 | Mesa | Ready | Mar 3-8 |\n| EX-330-01 | CAT 330 | Scottsdale | Ready | Mar 2-8 |\n| EX-330-03 | CAT 330 | Chandler | Ready | Mar 4-8 |\n| EX-345-02 | CAT 345 | Mesa | PM Due Mar 5 | Mar 6-8 |\n\n**5 of 14 excavators** are available next week. The remaining 9 are on active rentals. Note that EX-345-02 has a scheduled PM on March 5 — it will be available from March 6 onward.\n\nWould you like me to check demand signals or create a reservation?',
    sources: [
      { title: 'Fleet Availability Dashboard', docId: 'FLT-AVAIL-2026W10' },
      { title: 'Maintenance Schedule', docId: 'MAINT-SCHED-MAR' },
    ],
    mode: '.fleet',
  },
  {
    id: 'ask-03',
    role: 'user',
    content: 'What\'s the rental history for Desert Ridge Construction?',
    mode: '.fleet',
  },
  {
    id: 'ask-04',
    role: 'assistant',
    content: '**Desert Ridge Construction — Account Summary**\n\n| Metric | Value |\n|--------|-------|\n| Account Since | June 2023 |\n| Total Revenue (LTM) | $184,200 |\n| Active Rentals | 3 units |\n| Avg Monthly Spend | $15,350 |\n| Payment Terms | Net 30 |\n| On-Time Payment | 94% |\n| Satisfaction Score | 4.8/5.0 |\n\n**Preferred Equipment:**\n- CAT 320/330 Excavators (62% of rentals)\n- JLG 600S Boom Lifts (24% of rentals)\n- Skid Steers (14% of rentals)\n\n**Current Rentals:**\n1. CAT 330 (EX-330-02) — Pinnacle Rd job site, due back Mar 7\n2. JLG 600S (BL-600-12) — Shea Blvd project, due back Mar 3\n3. CAT 325 Skid Steer (SS-325-06) — Month-to-month\n\nDesert Ridge is our **#4 account by revenue** and has a 100% rebooking rate over the past 12 months. They\'re a strong candidate for the Gold loyalty tier.',
    sources: [
      { title: 'Customer Account Profile', docId: 'CUST-DRC-001' },
      { title: 'Rental History Report', docId: 'RPT-DRC-LTM' },
    ],
    mode: '.fleet',
  },
  {
    id: 'ask-05',
    role: 'user',
    content: 'Which units should we move to meet demand next week?',
    mode: '.ops',
  },
  {
    id: 'ask-06',
    role: 'assistant',
    content: 'Based on demand signals and current fleet positioning, here\'s my recommended redistribution:\n\n**Move TO Scottsdale** (high demand, 4 unfulfilled requests):\n- BL-600-03 (JLG 600S) from Mesa — idle 14 days\n- BL-600-05 (JLG 600S) from Mesa — idle 14 days\n- SS-325-11 (Skid Steer) from Chandler — idle 8 days\n\n**Move TO Gilbert** (new subdivision project starting Mar 3):\n- CP-150-02 (Compactor) from Mesa — idle 6 days\n- EX-320-09 (CAT 320) from Mesa — idle 3 days\n\n**Estimated Revenue Impact:**\n- Scottsdale moves: +$6,700/week (fills known demand)\n- Gilbert moves: +$3,900/week (pre-positions for confirmed project)\n- **Total: +$10,600/week** in recovered revenue\n\n**Transport Cost:** $1,200 (5 loads x $240/load via our flatbed)\n**Net Gain:** $9,400/week\n\nShall I create the transport orders and update the dispatch board?',
    sources: [
      { title: 'Demand Signals Dashboard', docId: 'DEMAND-W10' },
      { title: 'Fleet Location Map', docId: 'FLT-LOC-CURRENT' },
      { title: 'Transport Cost Matrix', docId: 'TRANS-COST-AZ' },
    ],
    mode: '.ops',
  },
  {
    id: 'ask-07',
    role: 'user',
    content: 'Yes, create the transport orders. Also, what\'s our rate position on excavators vs competitors?',
    mode: '.rates',
  },
  {
    id: 'ask-08',
    role: 'assistant',
    content: 'Transport orders created:\n- **TO-2026-0284**: Mesa to Scottsdale (3 units, scheduled Mar 1 AM)\n- **TO-2026-0285**: Mesa/Chandler to Gilbert (2 units, scheduled Mar 2 AM)\n\nNow, here\'s the competitive rate analysis for excavators:\n\n| Class | Our Rate | Sunbelt | United | H&E | Market Avg |\n|-------|----------|---------|--------|-----|------------|\n| 20-ton (CAT 320) | $1,350/day | $1,458 | $1,380 | $1,295 | $1,371 |\n| 30-ton (CAT 330) | $1,650/day | $1,782 | $1,700 | $1,590 | $1,681 |\n| 45-ton (CAT 345) | $2,200/day | $2,376 | $2,250 | $2,100 | $2,232 |\n\n**Key insight:** We\'re priced **4-8% below market average** across all excavator classes. With Sunbelt\'s recent 8% increase and our 88% utilization rate, there\'s clear room to raise rates by 10-12% without impacting demand.\n\nA 12% increase across 14 excavator units would generate an estimated **$18.2K/month** in additional margin. Want me to model the impact at different price points?',
    sources: [
      { title: 'Competitive Rate Intelligence', docId: 'COMP-RATES-FEB26' },
      { title: 'Excavator Fleet Performance', docId: 'FLT-EXC-PERF' },
      { title: 'Pricing Strategy Model', docId: 'PRICE-MODEL-Q1' },
    ],
    mode: '.rates',
  },
];

// ---------------------------------------------------------------------------
// Ask Mode Definitions
// ---------------------------------------------------------------------------

export const askModes = [
  { id: '.fleet', label: '.fleet', description: 'Fleet & inventory questions' },
  { id: '.rates', label: '.rates', description: 'Pricing & rate governance' },
  { id: '.ops', label: '.ops', description: 'Operations & dispatch' },
  { id: '.safety', label: '.safety', description: 'Safety & compliance' },
];
