// Lone Star Distribution — Manager Coaching Cards & Rep Coaching History
// Used by: /ops/manager (Tab 1: Coaching Dashboard), /ops/manager/rep/[id]
// Manager: Sarah Chen, Dallas District (8 reps)

// ─── Coaching Card Types ────────────────────────

export type CoachingCategory =
  | 'performance'     // attainment, revenue, cases
  | 'compliance'      // display, TABC, planogram
  | 'spirits'         // Sazerac integration
  | 'retention'       // at-risk behavior, missed stops
  | 'development'     // mentoring, skill building
  | 'recognition';    // positive reinforcement

export type CoachingPriority = 'urgent' | 'high' | 'medium' | 'low';
export type CoachingStatus = 'new' | 'acknowledged' | 'in-progress' | 'resolved';

export interface CoachingCard {
  id: string;
  sellerId: string;
  sellerName: string;
  routeId: string;
  category: CoachingCategory;
  priority: CoachingPriority;
  status: CoachingStatus;
  title: string;
  description: string;
  dataPoints: string[];         // supporting evidence
  suggestedAction: string;
  createdAt: string;
  dueDate: string | null;
  aiGenerated: boolean;
  source: 'ai-insight' | 'manager-created' | 'system-alert' | 'peer-comparison';
}

// ─── Live Coaching Cards (Sarah Chen's Dashboard) ──

export const COACHING_CARDS: CoachingCard[] = [
  // ── Marcus Reyes (DAL-03) ──
  {
    id: 'CC-001',
    sellerId: 'SEL-DAL-03', sellerName: 'Marcus Reyes', routeId: 'DAL-03',
    category: 'spirits', priority: 'medium', status: 'in-progress',
    title: 'Marcus at stop 4 — Cedar Springs Tap House',
    description: 'Marcus is at Cedar Springs Tap House (stop 4 of 12). Blue Moon pitch success rate 67% at this account. Last 3 visits: 2 successful, 1 rejected (manager preferred local craft).',
    dataPoints: [
      'Blue Moon pitch success: 67% (2/3 visits)',
      'Account has 8 taps — Lone Star holds 3, target is 5',
      'Redtail craft delivery spotted Tuesday AM',
      'Seasonal keg pricing available through March 31',
    ],
    suggestedAction: 'Suggest leading with Blue Moon seasonal keg pricing ($89 vs standard $109). Pair with Firestone Walker 805 for craft credibility. If tap conversation stalls, pivot to Sazerac cocktail — owner expressed interest in Old Fashioned program.',
    createdAt: '2026-03-04T09:42:00Z',
    dueDate: null,
    aiGenerated: true,
    source: 'ai-insight',
  },
  {
    id: 'CC-002',
    sellerId: 'SEL-DAL-07', sellerName: 'Jackie Wu', routeId: 'DAL-07',
    category: 'retention', priority: 'urgent', status: 'new',
    title: 'Jackie missed stop 3 — Total Wine',
    description: 'Jackie (DAL-07) missed stop 3 (Total Wine Park Lane) — 2nd missed key account this month. Previous miss was Spec\'s on Feb 18. Total Wine is a Tier A account ($22K/week revenue).',
    dataPoints: [
      '2 missed key accounts in February (Feb 18 + today)',
      'Total Wine Park Lane: $22.5K weekly revenue, Tier A',
      'Jackie\'s on-time rate dropped to 78% (district avg 91%)',
      'CRM notes show no reason logged for either miss',
      'Jackie has been a Tier 2 rep for 18 months — this is unusual',
    ],
    suggestedAction: 'Reschedule alert sent to Jackie. Schedule 1:1 meeting this week — explore root cause. Could be personal issue, route inefficiency, or disengagement. Review last 4 weeks of CRM notes. Consider route ride-along Thursday.',
    createdAt: '2026-03-04T10:15:00Z',
    dueDate: '2026-03-06',
    aiGenerated: true,
    source: 'system-alert',
  },
  {
    id: 'CC-003',
    sellerId: 'SEL-DAL-01', sellerName: 'Derek Thompson', routeId: 'DAL-01',
    category: 'recognition', priority: 'low', status: 'acknowledged',
    title: 'Derek closed first spirits account — Deep Ellum Bottle Shop',
    description: 'Derek (DAL-01) just closed Deep Ellum Bottle Shop as a new spirits account. Buffalo Trace + Fireball initial order: 12 cases. This is his 12th spirits account — highest in the district.',
    dataPoints: [
      'Deep Ellum Bottle Shop: new account, P-license confirmed',
      'Initial spirits order: 8cs Buffalo Trace + 4cs Fireball ($1,200)',
      'Derek now has 12 spirits accounts (district avg: 8)',
      'Derek has been a Tier 1 rep for 3 consecutive quarters',
    ],
    suggestedAction: 'Recognize Derek in team huddle tomorrow. Consider pairing him with Tier 3/4 reps as spirits mentor. Nominate for Q1 Spirits Pioneer recognition. Share success story with other district managers.',
    createdAt: '2026-03-04T11:30:00Z',
    dueDate: null,
    aiGenerated: true,
    source: 'ai-insight',
  },
  {
    id: 'CC-004',
    sellerId: 'SEL-DAL-06', sellerName: 'Ana Morales', routeId: 'DAL-06',
    category: 'performance', priority: 'high', status: 'new',
    title: 'Ana running 25 min behind — construction on I-30',
    description: 'Ana (DAL-06) running 25 minutes behind schedule due to I-30 construction detour. Currently at stop 4 (scheduled for stop 5). 2 stops may need rescheduling to maintain delivery windows.',
    dataPoints: [
      'Current delay: 25 minutes behind route schedule',
      'I-30 westbound closed between Sylvan and Hampton (TXDOT work)',
      'Stop 6 (Kroger #4418) has 2:00 PM delivery window — may miss',
      'Stop 8 (Tom Thumb #122) closes receiving at 4:30 PM',
      'Ana\'s weekly on-time rate will drop below 85% if 2+ stops miss window',
    ],
    suggestedAction: 'Send Ana alternate route avoiding I-30. Consider swapping stops 6 and 7 to hit Kroger delivery window. If stop 8 is at risk, coordinate with Derek (DAL-01) for coverage — his route is adjacent and he finishes early.',
    createdAt: '2026-03-04T11:45:00Z',
    dueDate: '2026-03-04',
    aiGenerated: true,
    source: 'system-alert',
  },
  {
    id: 'CC-005',
    sellerId: 'SEL-DAL-08', sellerName: 'Brian Mitchell', routeId: 'DAL-08',
    category: 'compliance', priority: 'high', status: 'new',
    title: 'Brian\'s display compliance dropped to 71%',
    description: 'Brian (DAL-08) display compliance has dropped from 88% to 71% over the last 3 weeks. 4 key accounts are now non-compliant. His route has the lowest compliance in the Dallas district.',
    dataPoints: [
      'Display compliance: 71% (was 88% three weeks ago)',
      '4 accounts moved from compliant to non-compliant',
      'Photo verification rate: 45% (district avg: 82%)',
      'Brian has not submitted compliance photos in 8 days',
      'Cold vault share on route: 34% (target: 40%)',
    ],
    suggestedAction: 'Schedule compliance ride-along with Brian this week. Review photo verification requirements. Check if issue is time management (rushing through stops) or disengagement. Consider whether route needs rebalancing — DAL-08 has 15% more accounts than average.',
    createdAt: '2026-03-03T16:00:00Z',
    dueDate: '2026-03-07',
    aiGenerated: true,
    source: 'peer-comparison',
  },
  {
    id: 'CC-006',
    sellerId: 'SEL-DAL-05', sellerName: 'Tyler Brooks', routeId: 'DAL-05',
    category: 'development', priority: 'medium', status: 'in-progress',
    title: 'Tyler ready for Tier 2 promotion assessment',
    description: 'Tyler (DAL-05) has been at Tier 3 for 6 months but his last 4 weeks show Tier 2-level performance. Attainment trending from 0.82 to 0.91. Spirits accounts growing.',
    dataPoints: [
      '4-week rolling attainment: 91% (Tier 2 threshold: 90%)',
      'Spirits accounts: 6 → 9 in last quarter',
      'EMCO gates: Core 86%, Import 81%, Emerging 72% — all unlocked',
      'Display compliance: 85% (up from 78%)',
      'Zero missed stops in February',
    ],
    suggestedAction: 'Schedule formal Tier promotion review. Tyler has met all criteria for 4 consecutive weeks. Prepare promotion paperwork. Pair with Derek for final mentoring on spirits execution. Announce at next team meeting if approved.',
    createdAt: '2026-03-02T09:00:00Z',
    dueDate: '2026-03-10',
    aiGenerated: false,
    source: 'manager-created',
  },
];

// ─── Weekly Coaching Agenda ─────────────────────

export interface CoachingAgendaItem {
  sellerId: string;
  sellerName: string;
  routeId: string;
  meetingType: '1:1' | 'ride-along' | 'review' | 'skip';
  scheduledDate: string;
  focusTopics: string[];
  attainmentGap: number;     // distance from 100% (negative = above target)
  urgency: CoachingPriority;
}

export const WEEKLY_COACHING_AGENDA: CoachingAgendaItem[] = [
  {
    sellerId: 'SEL-DAL-07', sellerName: 'Jackie Wu', routeId: 'DAL-07',
    meetingType: '1:1', scheduledDate: '2026-03-05',
    focusTopics: ['Missed key accounts (2 in February)', 'On-time rate decline', 'Personal check-in'],
    attainmentGap: 0.09,
    urgency: 'urgent',
  },
  {
    sellerId: 'SEL-DAL-08', sellerName: 'Brian Mitchell', routeId: 'DAL-08',
    meetingType: 'ride-along', scheduledDate: '2026-03-06',
    focusTopics: ['Display compliance (71%)', 'Photo verification training', 'Cold vault reset technique'],
    attainmentGap: 0.13,
    urgency: 'high',
  },
  {
    sellerId: 'SEL-DAL-05', sellerName: 'Tyler Brooks', routeId: 'DAL-05',
    meetingType: 'review', scheduledDate: '2026-03-07',
    focusTopics: ['Tier 2 promotion assessment', 'Spirits account growth plan', 'Q2 goal setting'],
    attainmentGap: 0.09,
    urgency: 'medium',
  },
  {
    sellerId: 'SEL-DAL-06', sellerName: 'Ana Morales', routeId: 'DAL-06',
    meetingType: '1:1', scheduledDate: '2026-03-05',
    focusTopics: ['Route timing optimization', 'I-30 construction alternate routes', 'Import mix growth'],
    attainmentGap: 0.05,
    urgency: 'medium',
  },
  {
    sellerId: 'SEL-DAL-03', sellerName: 'Marcus Reyes', routeId: 'DAL-03',
    meetingType: 'skip', scheduledDate: '2026-03-07',
    focusTopics: ['Day planner showcase feedback', 'Deep Ellum territory growth'],
    attainmentGap: -0.01,
    urgency: 'low',
  },
  {
    sellerId: 'SEL-DAL-01', sellerName: 'Derek Thompson', routeId: 'DAL-01',
    meetingType: 'skip', scheduledDate: '2026-03-07',
    focusTopics: ['Spirits mentoring program', 'Q1 recognition nomination'],
    attainmentGap: -0.04,
    urgency: 'low',
  },
  {
    sellerId: 'SEL-DAL-04', sellerName: 'Monica Davis', routeId: 'DAL-04',
    meetingType: 'skip', scheduledDate: '2026-03-07',
    focusTopics: ['Q2 territory planning', 'Cinco de Mayo Corona kicker prep'],
    attainmentGap: -0.07,
    urgency: 'low',
  },
  {
    sellerId: 'SEL-DAL-02', sellerName: 'Kim Tran', routeId: 'DAL-02',
    meetingType: '1:1', scheduledDate: '2026-03-06',
    focusTopics: ['Spirits account growth (8 → target 12)', 'Uptown off-premise opportunity', 'Import mix push'],
    attainmentGap: 0.02,
    urgency: 'medium',
  },
];

// ─── Rep Coaching History ───────────────────────

export interface CoachingHistoryEntry {
  id: string;
  sellerId: string;
  date: string;
  type: '1:1' | 'ride-along' | 'team-meeting' | 'recognition' | 'corrective' | 'review';
  summary: string;
  outcomes: string[];
  nextSteps: string[];
  managerNotes: string | null;
}

// Sample history for Marcus Reyes (DAL-03) — the showcase rep
export const COACHING_HISTORY_DAL_03: CoachingHistoryEntry[] = [
  {
    id: 'CH-001', sellerId: 'SEL-DAL-03', date: '2026-02-28', type: '1:1',
    summary: 'Quarterly review — strong Q1 performance. Import mix leading district. Spirits pioneer recognition.',
    outcomes: ['Attainment at 101% — on track for Tier 1', 'Import mix at 30% (target 28%)', 'Spirits accounts grew from 10 to 14'],
    nextSteps: ['Target 2 more spirits accounts in Deep Ellum corridor', 'Prepare for Cinco de Mayo Corona kicker', 'Consider mentor pairing with Tyler (DAL-05)'],
    managerNotes: 'Marcus is consistently our most balanced performer. Strong across all EMCO gates. Could be ready for district trainer role.',
  },
  {
    id: 'CH-002', sellerId: 'SEL-DAL-03', date: '2026-02-14', type: 'ride-along',
    summary: 'Full-day ride-along on Valentine\'s Day route. Observed on-premise execution and Sazerac pitch.',
    outcomes: ['Observed 10 of 12 stops', 'Marcus pitched Sazerac successfully at 3 on-premise accounts', 'Identified Deep Ellum Bottle Shop as new account opportunity'],
    nextSteps: ['Deep Ellum Bottle Shop new account visit scheduled for Feb 25', 'Practice Buffalo Trace Old Fashioned program pitch'],
    managerNotes: 'Impressed with Marcus\'s on-premise relationship skills. Natural spirits seller. Account owners trust him.',
  },
  {
    id: 'CH-003', sellerId: 'SEL-DAL-03', date: '2026-01-31', type: 'team-meeting',
    summary: 'January team huddle. Marcus shared Cedar Springs Tap House success story — gained 2 tap handles from Redtail competitor.',
    outcomes: ['Team learned presell + seasonal pricing combo technique', 'Three other reps committed to trying same approach'],
    nextSteps: ['Marcus to present at district-wide meeting in February'],
    managerNotes: null,
  },
  {
    id: 'CH-004', sellerId: 'SEL-DAL-03', date: '2026-01-15', type: 'recognition',
    summary: 'Recognized as Q4 2025 Import Mix Champion — highest Corona/Modelo volume per route in district.',
    outcomes: ['$500 bonus + certificate', 'Featured in company newsletter'],
    nextSteps: ['Continue import excellence', 'Set Q1 spirits target of 15 accounts'],
    managerNotes: 'Well-deserved recognition. Marcus sets the standard for balanced portfolio execution.',
  },
];

// ─── District Performance Summary ───────────────

export interface DistrictRepSnapshot {
  sellerId: string;
  sellerName: string;
  routeId: string;
  currentStop: number;     // which stop they're at (simulated live)
  totalStops: number;
  casesDelivered: number;
  casesTarget: number;
  revenueToday: number;
  onTimeRate: number;
  attainment: number;
  status: 'on-track' | 'behind' | 'ahead' | 'issue';
  statusColor: 'green' | 'amber' | 'red';
}

export const DALLAS_DISTRICT_LIVE: DistrictRepSnapshot[] = [
  { sellerId: 'SEL-DAL-01', sellerName: 'Derek Thompson', routeId: 'DAL-01', currentStop: 7, totalStops: 11, casesDelivered: 420, casesTarget: 480, revenueToday: 18200, onTimeRate: 0.95, attainment: 1.04, status: 'ahead', statusColor: 'green' },
  { sellerId: 'SEL-DAL-02', sellerName: 'Kim Tran', routeId: 'DAL-02', currentStop: 6, totalStops: 10, casesDelivered: 310, casesTarget: 380, revenueToday: 14500, onTimeRate: 0.92, attainment: 0.98, status: 'on-track', statusColor: 'green' },
  { sellerId: 'SEL-DAL-03', sellerName: 'Marcus Reyes', routeId: 'DAL-03', currentStop: 4, totalStops: 12, casesDelivered: 280, casesTarget: 360, revenueToday: 34800, onTimeRate: 0.94, attainment: 1.01, status: 'on-track', statusColor: 'green' },
  { sellerId: 'SEL-DAL-04', sellerName: 'Monica Davis', routeId: 'DAL-04', currentStop: 8, totalStops: 11, casesDelivered: 490, casesTarget: 500, revenueToday: 21400, onTimeRate: 0.97, attainment: 1.07, status: 'ahead', statusColor: 'green' },
  { sellerId: 'SEL-DAL-05', sellerName: 'Tyler Brooks', routeId: 'DAL-05', currentStop: 5, totalStops: 10, casesDelivered: 220, casesTarget: 320, revenueToday: 10800, onTimeRate: 0.88, attainment: 0.91, status: 'on-track', statusColor: 'green' },
  { sellerId: 'SEL-DAL-06', sellerName: 'Ana Morales', routeId: 'DAL-06', currentStop: 4, totalStops: 11, casesDelivered: 195, casesTarget: 340, revenueToday: 9200, onTimeRate: 0.82, attainment: 0.95, status: 'behind', statusColor: 'amber' },
  { sellerId: 'SEL-DAL-07', sellerName: 'Jackie Wu', routeId: 'DAL-07', currentStop: 3, totalStops: 10, casesDelivered: 145, casesTarget: 350, revenueToday: 6800, onTimeRate: 0.78, attainment: 0.91, status: 'issue', statusColor: 'red' },
  { sellerId: 'SEL-DAL-08', sellerName: 'Brian Mitchell', routeId: 'DAL-08', currentStop: 5, totalStops: 10, casesDelivered: 200, casesTarget: 310, revenueToday: 8900, onTimeRate: 0.85, attainment: 0.87, status: 'behind', statusColor: 'amber' },
];

// ─── Helpers ────────────────────────────────────

export const getCoachingCardsBySeller = (sellerId: string): CoachingCard[] =>
  COACHING_CARDS.filter(c => c.sellerId === sellerId);

export const getCoachingCardsByPriority = (priority: CoachingPriority): CoachingCard[] =>
  COACHING_CARDS.filter(c => c.priority === priority);

export const getUrgentCards = (): CoachingCard[] =>
  COACHING_CARDS.filter(c => c.priority === 'urgent' || c.priority === 'high');

export const getAgendaForSeller = (sellerId: string): CoachingAgendaItem | undefined =>
  WEEKLY_COACHING_AGENDA.find(a => a.sellerId === sellerId);

export const getCoachingHistory = (sellerId: string): CoachingHistoryEntry[] => {
  // Currently only have detailed history for Marcus Reyes
  if (sellerId === 'SEL-DAL-03') return COACHING_HISTORY_DAL_03;
  return [];
};

export const getLiveSnapshot = (sellerId: string): DistrictRepSnapshot | undefined =>
  DALLAS_DISTRICT_LIVE.find(r => r.sellerId === sellerId);

// Compute district-level KPIs from live data
export const getDistrictSummary = () => {
  const reps = DALLAS_DISTRICT_LIVE;
  const totalCasesDelivered = reps.reduce((s, r) => s + r.casesDelivered, 0);
  const totalCasesTarget = reps.reduce((s, r) => s + r.casesTarget, 0);
  const totalRevenue = reps.reduce((s, r) => s + r.revenueToday, 0);
  const avgOnTimeRate = reps.reduce((s, r) => s + r.onTimeRate, 0) / reps.length;
  const avgAttainment = reps.reduce((s, r) => s + r.attainment, 0) / reps.length;
  const issueCount = reps.filter(r => r.status === 'issue').length;
  const behindCount = reps.filter(r => r.status === 'behind').length;

  return {
    totalCasesDelivered,
    totalCasesTarget,
    totalRevenue,
    avgOnTimeRate: Math.round(avgOnTimeRate * 100) / 100,
    avgAttainment: Math.round(avgAttainment * 100) / 100,
    stopsCompleted: reps.reduce((s, r) => s + r.currentStop, 0),
    totalStops: reps.reduce((s, r) => s + r.totalStops, 0),
    issueCount,
    behindCount,
    onTrackCount: reps.filter(r => r.status === 'on-track' || r.status === 'ahead').length,
  };
};
