// AskForge — the "act" layer. Natural-language questions the user can ask the system,
// with canned answers that would resolve or advance the failure point.

export interface AskForgeQA {
  id: string;
  question: string;
  answer: string;
  action?: { label: string; impact: string };
}

export const ASKFORGE_QA: Record<string, AskForgeQA[]> = {
  cockpit: [
    {
      id: 'ck-q1',
      question: 'What\'s the #1 thing I should fix this week?',
      answer: 'The comp accelerator. It\'s the failure point touching the most other metrics — forecast accuracy, top-20% concentration, and cost of sales all trace back to it. Dropping the trigger to 85% is a 30-minute configuration change.',
      action: { label: 'Open comp plan editor', impact: 'Simulated: +$1.8M margin, median attainment +9 pts' },
    },
  ],
  demand: [
    {
      id: 'dm-q1',
      question: 'Why is inbound conversion down?',
      answer: 'Pricing approvals are the bottleneck, not lead quality. Moving sub-$25K decisions to an automated guardrail cuts 6 days out of Stage 2 → 3. Leads that convert in under 2 days convert at 41%; leads stuck 5+ days convert at 19%.',
      action: { label: 'Enable pricing auto-guardrail', impact: 'Estimated: +11% conversion, −6 days stage time' },
    },
  ],
  deals: [
    {
      id: 'dl-q1',
      question: 'Why are deals slipping in West region?',
      answer: 'They\'re not — 72% of the regional slippage sits with 2 KS reps. Exclude them and the region looks normal. The intervention is at the rep level: schedule deal inspections for those 2, not a regional process.',
      action: { label: 'Create rep 1:1 agenda', impact: 'Recovers ~$820K at-risk revenue' },
    },
  ],
  margin: [
    {
      id: 'mg-q1',
      question: 'How much margin would we recover with a 2% discount cap?',
      answer: '+$1.2M over the quarter with no volume impact, assuming historical win-rate elasticity. The leakage is mostly in promotional allowances (not invoice discounts), so a blanket discount cap wouldn\'t address it. A 3% cap on promotional allowances would.',
      action: { label: 'Propose promo cap change', impact: '+$1.2M margin, no volume impact' },
    },
  ],
  capacity: [
    {
      id: 'cp-q1',
      question: 'What happens if we rebalance territories?',
      answer: 'Moving 9 un-covered accounts from KS (overloaded) to NE (slack capacity) and adding 2 reps rebalances the plan to a 3% growth requirement across the bottom 80%, which matches historical growth. Without rebalancing, the bottom 80% would need 18% growth — which has never happened.',
      action: { label: 'Simulate rebalance', impact: 'Plan becomes mathematically achievable' },
    },
  ],
  comp: [
    {
      id: 'cm-q1',
      question: 'What if we dropped the accelerator to 85%?',
      answer: '31 additional reps would clear the trigger. Median attainment would rise 9 points (to 87%). Comp-to-revenue stays flat because the saved accelerator dollars get redistributed into the coverage bonus. Top-20% concentration drops 4 points as middle reps produce more.',
      action: { label: 'Run full simulation', impact: '+$2.1M revenue, same cost, 31 reps at plan' },
    },
    {
      id: 'cm-q2',
      question: 'Show me the payout curve with the change.',
      answer: 'The curve becomes two-step: base 5% → accelerated 7.5% at 85% → super-accelerated 9.5% at 110%. The shape rewards the middle 60% of the field (where motivation matters most) without over-paying the top 5 earners.',
      action: { label: 'Open payout calculator', impact: 'Try the new curve interactively' },
    },
  ],
  forecast: [
    {
      id: 'fc-q1',
      question: 'Which deals are most likely to slip?',
      answer: '18 deals flagged at-risk this quarter. 12 are in KS/NE mid-market, stalled in Stage 4/5. The 4 systematic over-committers own 7 of the 18. Weight-adjusting their forecast down 15% restores roll-up accuracy to 79%.',
      action: { label: 'Push at-risk list to managers', impact: 'Recovers ~$2.4M forecasted pipeline' },
    },
  ],
  action: [
    {
      id: 'ac-q1',
      question: 'Create an action plan for the underperforming West region',
      answer: '3-part plan: (1) Deal inspection for the 2 KS reps, (2) Territory rebalance moving 9 accounts from KS to NE, (3) Coverage bonus activated for bottom two quartiles. Estimated impact: +$3M in-quarter + $1.8M margin recovery. Push to managers now?',
      action: { label: 'Push plan to West region managers', impact: 'Manager tablets receive plan in real time' },
    },
  ],
  system: [
    {
      id: 'sy-q1',
      question: 'How does this tie together?',
      answer: 'Pulse observes every revenue signal across pipeline, deals, margin, capacity, comp, and forecast — 847 signals in 24h. OpsChief explains anomalies in plain language with evidence and recommendation. AskForge accepts natural-language queries and pushes actions into the execution layer. Every failure point is one surface away.',
    },
  ],
};
