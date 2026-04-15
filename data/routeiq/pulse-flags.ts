// Pulse — the "detect" layer. Issues the system flags without being asked.
// Each section gets 2-4 flags that feel like live anomaly alerts.

export type PulseSeverity = 'info' | 'warning' | 'urgent';

export interface PulseFlag {
  id: string;
  severity: PulseSeverity;
  metric: string;
  headline: string;
  detail: string;
  delta?: string;
  since?: string;
}

export const PULSE_FLAGS: Record<string, PulseFlag[]> = {
  cockpit: [
    { id: 'ck-1', severity: 'urgent', metric: 'Forecast accuracy', headline: 'Commit accuracy dropped 82% → 61%', detail: 'Three consecutive quarters of reliable forecasts broken this period. Two states (OK, AR) driving most of the variance.', delta: '−21 pts', since: 'last 14 days' },
    { id: 'ck-2', severity: 'warning', metric: 'Discounting', headline: 'Average discount climbed 6% in the last 14 days', detail: 'Concentrated in the KC and Omaha DCs. Mid-market accounts getting end-of-quarter price concessions.', delta: '+6.2 pts' },
    { id: 'ck-3', severity: 'warning', metric: 'Deal slippage', headline: 'Mid-market deals over $50K slipping 2.3× normal rate', detail: 'Stage 3 → 4 is where they stall. Average 9 extra days in stage.', delta: '+9 days' },
    { id: 'ck-4', severity: 'info', metric: 'Capacity', headline: 'Top 20% of reps now producing 64% of revenue', detail: 'Up from 52% a year ago. Concentration risk worth watching.', delta: '+12 pts' },
  ],
  demand: [
    { id: 'dm-1', severity: 'urgent', metric: 'Inbound conversion', headline: 'Inbound leads converting 18% below last quarter', detail: 'Trade show leads are the softest cohort — converting half as well as referral.', delta: '−18%' },
    { id: 'dm-2', severity: 'warning', metric: 'Velocity', headline: 'Stage 2 → 3 bottleneck adding 9 days', detail: 'Pricing approvals holding up deals. ~32 deals queued for sign-off.', delta: '+9 days' },
    { id: 'dm-3', severity: 'info', metric: 'Coverage', headline: 'Pipeline coverage 2.8× — below the 3.0× target', detail: 'KC, Wichita, Tulsa all short of coverage. Des Moines above target.' },
  ],
  deals: [
    { id: 'dl-1', severity: 'urgent', metric: 'Slippage', headline: 'Mid-market deals >$50K slipping 2.3× normal rate', detail: 'West region (KS, NE) driving most of the slippage. Stage 4 is the stall point.', delta: '+130%' },
    { id: 'dl-2', severity: 'warning', metric: 'Win rate', headline: 'Win rate in Spirits category dropped to 38%', detail: 'Was 51% a year ago. Losing mostly to Republic National and Southern Glazer\'s.', delta: '−13 pts' },
    { id: 'dl-3', severity: 'info', metric: 'Push rate', headline: 'Quarterly push rate holding at 22% — industry benchmark is 18%', detail: 'Not an outlier yet, but trending up for 3 quarters.' },
  ],
  margin: [
    { id: 'mg-1', severity: 'urgent', metric: 'Discount depth', headline: 'Discounting increased 6% in the last 14 days', detail: 'Concentrated in KC and Omaha. Two reps responsible for 40% of the lift.', delta: '+6.2 pts' },
    { id: 'mg-2', severity: 'warning', metric: 'Margin per route', headline: '7 routes below 18% gross margin floor', detail: 'Mix-shift into low-margin mixers on those routes. Worth a portfolio conversation.' },
    { id: 'mg-3', severity: 'info', metric: 'List-to-net', headline: 'List-to-net compression averaging 11.2% — up from 9.8%', detail: 'Most leakage is in promotional allowances, not invoice discounts.' },
  ],
  capacity: [
    { id: 'cp-1', severity: 'urgent', metric: 'Concentration', headline: 'Top 20% of reps generating 64% of revenue', detail: 'Up from 52% YoY. When any of the top 12 reps leaves, capacity collapses.', delta: '+12 pts' },
    { id: 'cp-2', severity: 'warning', metric: 'Territory balance', headline: 'KS territory carrying 2.1× the account load of NE', detail: 'Two reps in KS burning out. NE has slack capacity but different product mix.' },
    { id: 'cp-3', severity: 'info', metric: 'Coverage gap', headline: '9 accounts with $500K+ potential in un-covered zips', detail: 'Mostly on-prem in greater KC metro fringe.' },
  ],
  comp: [
    { id: 'cm-1', severity: 'urgent', metric: 'Accelerator effectiveness', headline: 'Accelerator kicks in at 100% but 70% of reps land below 95%', detail: 'The accelerator is funding randomness — it pays 8 reps and motivates zero.', delta: '70%' },
    { id: 'cm-2', severity: 'warning', metric: 'Cost of sales', headline: 'Comp-to-revenue ratio climbed from 6.1% to 7.4%', detail: 'Discretionary kickers up, volume flat. The plan is getting more expensive per dollar booked.', delta: '+1.3 pts' },
    { id: 'cm-3', severity: 'info', metric: 'Attainment distribution', headline: 'Median attainment 78% — mean 91%', detail: 'Heavy right-skew. The top 5 reps earn 2.4× the comp of the median rep.' },
  ],
  forecast: [
    { id: 'fc-1', severity: 'urgent', metric: 'Commit accuracy', headline: 'Commit accuracy dropped 82% → 61%', detail: 'Three consecutive quarters of reliable forecasts broken this period.', delta: '−21 pts' },
    { id: 'fc-2', severity: 'warning', metric: 'Risk band', headline: '$4.2M currently in "at risk" band — 2.1× prior quarter', detail: '18 deals flagged. 12 are in KS/NE mid-market. Stage 4/5 stalled.' },
    { id: 'fc-3', severity: 'info', metric: 'Rep accuracy', headline: '4 reps consistently overcommit by 15%+', detail: 'Systematic over-optimism, not randomness. Coaching opportunity.' },
  ],
  action: [
    { id: 'ac-1', severity: 'info', metric: 'Auto-triggered', headline: '12 coaching pushes sent in the last 24h', detail: 'Alerts delivered to reps\' tablets in-route. 8 acknowledged, 4 pending.' },
    { id: 'ac-2', severity: 'warning', metric: 'Awaiting approval', headline: '3 pricing guardrail overrides awaiting manager sign-off', detail: 'All three in the West region. Exceed 15% standard discount ceiling.' },
    { id: 'ac-3', severity: 'info', metric: 'Campaign impact', headline: 'Last week\'s "spirits kicker push" lifted category mix 4.2%', detail: '11 reps activated, 9 drove measurable lift.' },
  ],
  system: [
    { id: 'sy-1', severity: 'info', metric: 'Signals observed', headline: 'Pulse processed 847 signals in the last 24h', detail: 'Surfaced 23 flags. 6 were actioned through AskForge; 17 closed without intervention.' },
    { id: 'sy-2', severity: 'info', metric: 'Insight accuracy', headline: 'OpsChief diagnostic accuracy running at 91%', detail: 'Measured against manager adjudication. Strongest in comp and margin, weakest in forecast.' },
  ],
};
