// OpsChief — the "explain" layer. Diagnoses WHY the flag happened and offers a recommendation.
// Each section gets 1-3 insights that connect multiple data points into a story.

export interface OpsChiefInsight {
  id: string;
  title: string;
  diagnosis: string;
  evidence: string[];
  recommendation: string;
  confidence: 'high' | 'medium' | 'low';
}

export const OPSCHIEF_INSIGHTS: Record<string, OpsChiefInsight[]> = {
  cockpit: [
    {
      id: 'ck-i1',
      title: 'Your plan is out of alignment with your capacity',
      diagnosis: 'Three correlated signals — forecast accuracy dropping, top-20% concentration climbing, and accelerator paying below-median reps — together suggest the comp plan is rewarding behavior the field can no longer deliver. You set a 100% attainment accelerator when 70% of reps land below 95%.',
      evidence: [
        '64% of revenue from top 20% of reps (up from 52% YoY)',
        'Accelerator threshold 100%, median attainment 78%',
        'Commit accuracy dropped 21 points in one quarter',
      ],
      recommendation: 'Drop the accelerator trigger to 85% and redirect the savings into a quota-coverage bonus for the bottom two quartiles. Models suggest this moves median attainment up 8–12 points within one period.',
      confidence: 'high',
    },
  ],
  demand: [
    {
      id: 'dm-i1',
      title: 'The conversion drop is a pricing process problem, not a lead quality problem',
      diagnosis: 'Inbound lead conversion dropped 18%, but the leads you\'re losing are the ones that sit longest in Stage 2 → 3. The bottleneck is a pricing approval queue — 32 deals pending sign-off — not lead fit.',
      evidence: [
        'Inbound conversion 18% below last quarter',
        'Stage 2 → 3 time up 9 days',
        '32 deals queued on pricing approval',
        'Deals with approval under 2 days convert at 41%; deals stuck 5+ days convert at 19%',
      ],
      recommendation: 'Move sub-$25K pricing decisions to an automated guardrail, and escalate only the 15%+ discount outliers. Estimated 6-day reduction in Stage 2 → 3 time.',
      confidence: 'high',
    },
  ],
  deals: [
    {
      id: 'dl-i1',
      title: 'Slippage is concentrated in two reps, not a regional problem',
      diagnosis: 'The West region looks bad in aggregate, but 72% of the slippage sits with two reps (both in KS). When you exclude them, West region slippage is in line with the company.',
      evidence: [
        'Mid-market >$50K slippage 2.3× normal (West region)',
        '72% of slipped deals owned by 2 KS reps',
        'Both reps show Stage 4 stall averaging 14 days',
        'Neither rep has been in a manager 1:1 in 6 weeks',
      ],
      recommendation: 'Intervene at the rep level, not the territory level. Schedule deal inspections for the 2 reps, not a regional process overhaul.',
      confidence: 'high',
    },
  ],
  margin: [
    {
      id: 'mg-i1',
      title: 'You\'re not losing revenue. You\'re leaking margin quietly.',
      diagnosis: 'Discounting is up 6 points but revenue is up 4.2% — the plan looks healthy on the top line. The leakage is almost invisible unless you look at list-to-net compression, which climbed from 9.8% to 11.2%. Most of the leak is promotional allowances, not invoice discounts.',
      evidence: [
        'Discount depth up 6.2 pts',
        'List-to-net compression up 1.4 pts',
        'Promotional allowances up $340K QoQ',
        '7 routes below 18% gross margin floor',
      ],
      recommendation: 'Cap promotional allowances at 3% of booked revenue per route. Simulation: +$1.2M margin over the quarter with no volume impact.',
      confidence: 'high',
    },
  ],
  capacity: [
    {
      id: 'cp-i1',
      title: 'Your plan assumes performance your system cannot produce',
      diagnosis: 'Quota was raised 12% YoY but headcount is flat and the top 20% is already carrying 64% of revenue. The remaining 80% of reps would need to grow 18% each to hit the number — historically they grow 4%.',
      evidence: [
        'Quota raised 12% YoY',
        'Headcount flat',
        'Top-20% concentration 64%',
        'Historical bottom-80% growth 4% annualized',
      ],
      recommendation: 'Rebalance KS / NE territories, reassign 9 un-covered high-potential accounts, and either add 2 reps or drop the quota to 8%. Without one of those, the plan is a math problem, not an execution problem.',
      confidence: 'high',
    },
  ],
  comp: [
    {
      id: 'cm-i1',
      title: 'You\'re not incentivizing behavior. You\'re funding randomness.',
      diagnosis: 'The accelerator is funded every quarter but is mechanically unreachable for most of the field. Only 8 of 60 reps have hit 100% in the last 4 quarters. The remaining 52 reps see the accelerator as theater. The plan costs you 1.3 points of comp-to-revenue and motivates no one.',
      evidence: [
        'Accelerator trigger 100% attainment',
        'Only 8 reps hit the trigger in 4 quarters',
        'Comp-to-revenue 6.1% → 7.4%',
        '52 reps below the trigger every quarter',
      ],
      recommendation: 'Drop the trigger to 85% and add a second-tier accelerator at 110%. Redistribute the saved dollars into a coverage bonus for 60–85% attainment. Simulation: median attainment +9 pts, top-20 concentration down 4 pts.',
      confidence: 'high',
    },
  ],
  forecast: [
    {
      id: 'fc-i1',
      title: 'Forecasts don\'t fail randomly. They fail systematically.',
      diagnosis: '4 reps consistently overcommit by 15%+. Stripping those reps from the forecast restores commit accuracy to 79%. The rest of the field is forecasting within 3 points of actual.',
      evidence: [
        '4 reps overcommit by 15%+ for 3 quarters running',
        'Rest of field within 3 pts of actual',
        'Excluding those 4 reps: commit accuracy 79%',
        'Rolling up-adjusted forecast would have been right within $200K last quarter',
      ],
      recommendation: 'Weight-adjust the 4 over-committers\' forecasts down 15% at roll-up. Coach individually on commit discipline.',
      confidence: 'high',
    },
  ],
  action: [
    {
      id: 'ac-i1',
      title: 'Insight without action is just expensive reporting',
      diagnosis: 'Last quarter, Pulse surfaced 91 flags. Managers actioned 12. This quarter we\'re running the execution layer — automated coaching pushes, pricing guardrails, pipeline interventions — the action rate is now 68%.',
      evidence: [
        '91 flags surfaced last quarter, 12 actioned',
        'Action layer live this quarter',
        '12 coaching pushes auto-sent in last 24h',
        '68% flag action rate this quarter',
      ],
      recommendation: 'Keep the guardrail-override queue at manager review — full automation here would erode accountability. Everything else stays auto.',
      confidence: 'medium',
    },
  ],
  system: [
    {
      id: 'sy-i1',
      title: 'Observe → Decide → Act',
      diagnosis: 'Pulse observes everything. OpsChief explains anything. AskForge acts on request. This is not RevOps reporting — it\'s a revenue operating system.',
      evidence: [
        'Pulse processed 847 signals in 24h',
        'OpsChief diagnostic accuracy 91%',
        'AskForge served 34 queries in 24h',
        '68% of flagged issues acted on this quarter',
      ],
      recommendation: 'Every failure point in the revenue flow gets observed, explained, and acted on — inside one system, on one surface.',
      confidence: 'high',
    },
  ],
};
