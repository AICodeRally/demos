// data/register/ai-insights.ts — Centralized AI insight text for all 22 pages

export interface AIInsight {
  text: string;
  label?: string;
  actionLabel?: string;
}

export const AI_INSIGHTS: Record<string, AIInsight> = {
  'corp/overview': {
    text: '3 underperforming stores identified — recommend format conversion to Outlet for Store #47, #112, #189. Projected +$2.1M annual revenue.',
  },
  'corp/portfolio': {
    text: 'Outlet stores within 5mi of Flagship locations cannibalize 12% revenue. Consider territory-based pricing differentiation.',
  },
  'corp/seasonal': {
    text: "Presidents' Day weekend projected +22% traffic. Recommend activating Adjustable Base SPIFF 48 hours early to maximize attach rate.",
  },
  'strategy/districts': {
    text: 'Recommend realigning District 7 — Stores #88 and #91 are geographically closer to District 4 and share the same customer demographic.',
  },
  'strategy/mix': {
    text: 'Adjustable base attach rate drops 40% when floor model is not powered on. 3 stores have unplugged demo units.',
  },
  'strategy/promotions': {
    text: 'Last 3 March SPIFFs underperformed vs. February. Recommend shifting $50K from flat SPIFF to bundle accelerator for higher ROI.',
  },
  'ops/floor': {
    text: 'Traffic spike predicted 2-4pm based on mall foot traffic data. Recommend pulling Marcus from break room to floor coverage.',
  },
  'ops/contests': {
    text: "Marcus is $2,400 from Tier 2 — one more Sleep System Bundle unlocks the accelerator bonus. He's your best conversion opportunity today.",
  },
  'comp/calculator': {
    text: 'At current pace, this rep reaches Tier 3 (Gold) by March 22. One additional $3K+ sale this week would accelerate by 4 days.',
  },
  'comp/team': {
    text: '23% of reps are in the "dead zone" between Bronze and Silver. Lower Tier 2 threshold from $25K to $22K — estimated +$8K monthly payout, +$340K revenue.',
  },
  'comp/executive': {
    text: 'Comp spend tracking 2.1% above Q1 budget. Primary driver: Flagship overpayment on Platinum tier. Recommend raising Flagship targets by 8%.',
  },
  'comp/admin': {
    text: 'Proposed tier change affects 47 reps across 12 stores. Net impact: +$12K monthly payout, projected +$89K incremental revenue from improved motivation.',
    label: 'AI Impact Analysis',
  },
};

export function getInsight(routeSlug: string): AIInsight | undefined {
  return AI_INSIGHTS[routeSlug];
}
