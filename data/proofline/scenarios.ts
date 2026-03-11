// Lone Star Distribution — Scenario Modeling Presets
// 3 pre-built scenarios for the Scenario Modeling page (/strategy/scenarios)
// Each scenario adjusts growth rates, BBI thresholds, Laredo ramp, and spirits targets

import type { SupplierGroup } from './brands';

export type ScenarioId = 'conservative' | 'stretch' | 'aggressive';

export interface ScenarioSupplierAdjustment {
  supplier: SupplierGroup;
  growthRate: number;       // YoY growth rate (e.g., 0.03 = 3%)
  mixTarget: number;        // target portfolio share
  notes: string;
}

export interface ScenarioHometown {
  hometownId: string;
  caseGrowth: number;       // % growth vs. current quarter
  revenueGrowth: number;
  newAccounts: number;       // net new accounts expected
  spiritsPenetration: number; // target % of accounts carrying spirits
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  label: string;
  description: string;
  color: string;

  // High-level targets
  revenueTarget: number;     // annual revenue target ($)
  caseTarget: number;        // annual case target
  yoyGrowth: number;         // overall YoY growth %

  // BBI adjustments
  bbiThresholds: {
    core: number;
    import: number;
    emerging: number;
    combined: number;
  };

  // Supplier mix targets
  supplierAdjustments: ScenarioSupplierAdjustment[];

  // Hometown projections
  hometownProjections: ScenarioHometown[];

  // Laredo ramp (new 2024 acquisition)
  laredoRamp: {
    yearEndRoutes: number;       // target routes by year-end
    yearEndAccounts: number;     // target accounts
    yearEndCases: number;        // quarterly case target
    integrationPct: number;      // % integration complete (systems, branding)
  };

  // Spirits integration
  spiritsTarget: {
    portfolioShare: number;      // target Sazerac portfolio share
    accountPenetration: number;  // % of total accounts carrying spirits
    revenueTarget: number;       // quarterly spirits revenue target
    newSkuCount: number;         // new Sazerac SKUs to introduce
  };

  // Risk factors
  risks: string[];

  // Cumulative quarterly revenue projection (Q1-Q4)
  quarterlyProjection: [number, number, number, number];
}

export const SCENARIOS: Scenario[] = [
  // ═══════════════════════════════════════════
  // CONSERVATIVE — Protect and grow base
  // ═══════════════════════════════════════════
  {
    id: 'conservative',
    name: 'Conservative',
    label: 'Protect & Grow',
    description: 'Protect core Molson Coors and import business. Moderate spirits ramp. Laredo integration at natural pace. Focus on margin improvement over volume growth.',
    color: '#34D399',  // green — safe

    revenueTarget: 175000000,    // $175M (+1.4% YoY)
    caseTarget: 1420000,
    yoyGrowth: 0.014,

    bbiThresholds: {
      core: 0.85,
      import: 0.80,
      emerging: 0.65,      // relaxed from 0.70
      combined: 0.88,      // relaxed from 0.90
    },

    supplierAdjustments: [
      { supplier: 'molson-coors', growthRate: 0.01, mixTarget: 0.39, notes: 'Maintain core. Miller Lite steady, Coors Light slight push.' },
      { supplier: 'constellation', growthRate: 0.02, mixTarget: 0.28, notes: 'Corona/Modelo organic growth. No incremental spend.' },
      { supplier: 'heineken', growthRate: 0.01, mixTarget: 0.15, notes: 'Hold share. Dos Equis seasonal push only.' },
      { supplier: 'craft', growthRate: 0.02, mixTarget: 0.11, notes: 'Shiner steady. Limited craft expansion.' },
      { supplier: 'sazerac', growthRate: 0.08, mixTarget: 0.05, notes: 'Natural spirits ramp. No forced distribution.' },
      { supplier: 'fmb-rtd', growthRate: -0.02, mixTarget: 0.02, notes: 'Category declining. Reduce inventory investment.' },
    ],

    hometownProjections: [
      { hometownId: 'dal', caseGrowth: 0.015, revenueGrowth: 0.02, newAccounts: 15, spiritsPenetration: 0.22 },
      { hometownId: 'aln', caseGrowth: 0.03, revenueGrowth: 0.035, newAccounts: 12, spiritsPenetration: 0.18 },
      { hometownId: 'ftw', caseGrowth: 0.01, revenueGrowth: 0.015, newAccounts: 10, spiritsPenetration: 0.20 },
      { hometownId: 'ens', caseGrowth: 0.005, revenueGrowth: 0.01, newAccounts: 3, spiritsPenetration: 0.10 },
      { hometownId: 'crp', caseGrowth: 0.01, revenueGrowth: 0.015, newAccounts: 8, spiritsPenetration: 0.15 },
      { hometownId: 'lar', caseGrowth: 0.05, revenueGrowth: 0.06, newAccounts: 20, spiritsPenetration: 0.08 },
    ],

    laredoRamp: {
      yearEndRoutes: 4,
      yearEndAccounts: 1250,
      yearEndCases: 82000,
      integrationPct: 0.75,
    },

    spiritsTarget: {
      portfolioShare: 0.055,
      accountPenetration: 0.15,
      revenueTarget: 1900000,
      newSkuCount: 4,
    },

    risks: [
      'Seltzer/FMB category contraction may exceed forecast',
      'Laredo integration delays could slow South TX growth',
      'Miller Lite share pressure from regional craft surge',
    ],

    quarterlyProjection: [42000000, 44500000, 46700000, 41800000],
  },

  // ═══════════════════════════════════════════
  // STRETCH — Balanced growth
  // ═══════════════════════════════════════════
  {
    id: 'stretch',
    name: 'Stretch',
    label: 'Balanced Growth',
    description: 'CEO mandate target. Push all supplier groups. Accelerate Laredo. Sazerac to 8% portfolio. Balance volume growth with margin improvement.',
    color: '#F59E0B',  // amber — moderate risk

    revenueTarget: 180000000,    // $180M (+4% YoY, CEO mandate)
    caseTarget: 1460000,
    yoyGrowth: 0.04,

    bbiThresholds: {
      core: 0.85,
      import: 0.80,
      emerging: 0.70,
      combined: 0.90,
    },

    supplierAdjustments: [
      { supplier: 'molson-coors', growthRate: 0.02, mixTarget: 0.37, notes: 'Push Blue Moon premium + Peroni growth. Miller/Coors defend share.' },
      { supplier: 'constellation', growthRate: 0.04, mixTarget: 0.28, notes: 'Corona Cinco de Mayo blitz. Modelo gaining on Miller Lite.' },
      { supplier: 'heineken', growthRate: 0.03, mixTarget: 0.15, notes: 'Dos Equis football push. Heineken premiumization.' },
      { supplier: 'craft', growthRate: 0.05, mixTarget: 0.11, notes: 'Shiner steady. Firestone Walker and Rahr growth accounts.' },
      { supplier: 'sazerac', growthRate: 0.25, mixTarget: 0.07, notes: 'Aggressive spirits push. 8% portfolio target by Q4. New W-permit accounts.' },
      { supplier: 'fmb-rtd', growthRate: 0.00, mixTarget: 0.02, notes: 'Hold. Twisted Tea stable, Truly declining.' },
    ],

    hometownProjections: [
      { hometownId: 'dal', caseGrowth: 0.03, revenueGrowth: 0.04, newAccounts: 30, spiritsPenetration: 0.30 },
      { hometownId: 'aln', caseGrowth: 0.06, revenueGrowth: 0.07, newAccounts: 25, spiritsPenetration: 0.25 },
      { hometownId: 'ftw', caseGrowth: 0.03, revenueGrowth: 0.04, newAccounts: 22, spiritsPenetration: 0.28 },
      { hometownId: 'ens', caseGrowth: 0.02, revenueGrowth: 0.025, newAccounts: 8, spiritsPenetration: 0.15 },
      { hometownId: 'crp', caseGrowth: 0.03, revenueGrowth: 0.035, newAccounts: 15, spiritsPenetration: 0.22 },
      { hometownId: 'lar', caseGrowth: 0.15, revenueGrowth: 0.18, newAccounts: 45, spiritsPenetration: 0.12 },
    ],

    laredoRamp: {
      yearEndRoutes: 5,
      yearEndAccounts: 1500,
      yearEndCases: 95000,
      integrationPct: 0.90,
    },

    spiritsTarget: {
      portfolioShare: 0.08,
      accountPenetration: 0.25,
      revenueTarget: 3200000,
      newSkuCount: 8,
    },

    risks: [
      'Sazerac integration requires W-permit coaching across all 6 hometowns',
      'Laredo accelerated ramp may strain training capacity',
      'Constellation import pricing pressure from Heineken',
      'Route density in Allen may require 7th route by Q3',
    ],

    quarterlyProjection: [43000000, 45700000, 48400000, 42900000],
  },

  // ═══════════════════════════════════════════
  // AGGRESSIVE — Maximum growth
  // ═══════════════════════════════════════════
  {
    id: 'aggressive',
    name: 'Aggressive',
    label: 'Maximum Growth',
    description: 'Push beyond CEO mandate. Add routes in growth markets. Sazerac to 10% portfolio. Open 5th Laredo route. Maximum new account acquisition. Trade spend up 15%.',
    color: '#F87171',  // red — high risk

    revenueTarget: 190000000,    // $190M (+10% YoY)
    caseTarget: 1520000,
    yoyGrowth: 0.10,

    bbiThresholds: {
      core: 0.87,        // tightened
      import: 0.83,      // tightened
      emerging: 0.75,    // tightened
      combined: 0.92,    // tightened
    },

    supplierAdjustments: [
      { supplier: 'molson-coors', growthRate: 0.04, mixTarget: 0.35, notes: 'Blue Moon and Peroni premiumization. New Coors Banquet push.' },
      { supplier: 'constellation', growthRate: 0.06, mixTarget: 0.27, notes: 'Modelo overtakes Miller Lite in TX. Maximum Cinco placement.' },
      { supplier: 'heineken', growthRate: 0.05, mixTarget: 0.15, notes: 'Heineken Silver launch. Dos Equis Amber expansion.' },
      { supplier: 'craft', growthRate: 0.08, mixTarget: 0.12, notes: 'Texas Ale Project expansion. Yuengling DFW push.' },
      { supplier: 'sazerac', growthRate: 0.40, mixTarget: 0.10, notes: '10% portfolio target. Full spirits program rollout. Cocktail program partnerships.' },
      { supplier: 'fmb-rtd', growthRate: 0.02, mixTarget: 0.01, notes: 'Topo Chico Hard Seltzer test market. Minimize category exposure.' },
    ],

    hometownProjections: [
      { hometownId: 'dal', caseGrowth: 0.05, revenueGrowth: 0.07, newAccounts: 50, spiritsPenetration: 0.40 },
      { hometownId: 'aln', caseGrowth: 0.10, revenueGrowth: 0.12, newAccounts: 40, spiritsPenetration: 0.35 },
      { hometownId: 'ftw', caseGrowth: 0.05, revenueGrowth: 0.06, newAccounts: 35, spiritsPenetration: 0.35 },
      { hometownId: 'ens', caseGrowth: 0.04, revenueGrowth: 0.05, newAccounts: 12, spiritsPenetration: 0.20 },
      { hometownId: 'crp', caseGrowth: 0.05, revenueGrowth: 0.06, newAccounts: 25, spiritsPenetration: 0.30 },
      { hometownId: 'lar', caseGrowth: 0.25, revenueGrowth: 0.30, newAccounts: 80, spiritsPenetration: 0.18 },
    ],

    laredoRamp: {
      yearEndRoutes: 6,          // add 2 routes (4→6)
      yearEndAccounts: 1800,
      yearEndCases: 115000,
      integrationPct: 1.00,      // full integration
    },

    spiritsTarget: {
      portfolioShare: 0.10,
      accountPenetration: 0.35,
      revenueTarget: 5000000,
      newSkuCount: 14,
    },

    risks: [
      'Route additions require $2.4M capex (trucks, tablets, training)',
      'Aggressive Sazerac targets may dilute beer focus and hurt core gates',
      'Laredo 6-route plan depends on Southern Distributing warehouse expansion completion',
      'Trade spend increase 15% requires CFO approval — not yet secured',
      'Headcount adds 8 reps + 1 manager — 4-month training lead time',
      'Allen 8-route expansion requires zoning adjustment with Plano market',
    ],

    quarterlyProjection: [44800000, 48600000, 52400000, 44200000],
  },
];

// ─── Helpers ────────────────────────────────────

export const getScenarioById = (id: ScenarioId): Scenario | undefined =>
  SCENARIOS.find(s => s.id === id);

export const getScenarioProjection = (id: ScenarioId, hometownId: string): ScenarioHometown | undefined => {
  const scenario = getScenarioById(id);
  return scenario?.hometownProjections.find(h => h.hometownId === hometownId);
};

// Calculate cumulative annual revenue from quarterly projection
export const getAnnualRevenue = (scenario: Scenario): number =>
  scenario.quarterlyProjection.reduce((sum, q) => sum + q, 0);

// Compare two scenarios
export interface ScenarioComparison {
  revenueGap: number;
  caseGap: number;
  growthGap: number;
  riskDelta: number;        // more risks = higher number
}

export const compareScenarios = (a: ScenarioId, b: ScenarioId): ScenarioComparison | null => {
  const scenA = getScenarioById(a);
  const scenB = getScenarioById(b);
  if (!scenA || !scenB) return null;
  return {
    revenueGap: scenB.revenueTarget - scenA.revenueTarget,
    caseGap: scenB.caseTarget - scenA.caseTarget,
    growthGap: scenB.yoyGrowth - scenA.yoyGrowth,
    riskDelta: scenB.risks.length - scenA.risks.length,
  };
};
