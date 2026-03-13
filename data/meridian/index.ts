/* ═══════════════════════════════════════════════════════
   MERIDIAN — Data Barrel
   Central re-export for all PE demo data
   ═══════════════════════════════════════════════════════ */

export {
  FUND,
  LPS,
  FUND_PERFORMANCE,
  DEPLOYMENT_TIMELINE,
  STRATEGIC_PRIORITIES,
  type FundTerms,
  type LP,
} from './fund';

export {
  PIPELINE,
  SECTOR_ALLOCATION,
  DD_CHECKLIST,
  type Deal,
  type DealStage,
} from './deals';

export {
  PORTFOLIO,
  VALUE_CREATION_LEVERS,
  EXIT_PIPELINE,
  type PortfolioCompany,
  type ExitStrategy,
} from './portfolio';

export {
  WATERFALL_TIERS,
  WATERFALL_SUMMARY,
  DISTRIBUTION_HISTORY,
  CAPITAL_ACCOUNTS,
  CLAWBACK_SCENARIOS,
  type WaterfallTier,
  type DistributionEvent,
} from './waterfall';

export {
  TEAM,
  CARRY_POOL_SUMMARY,
  VESTING_SCHEDULE,
  COINVEST_PROGRAM,
  type TeamMember,
} from './carry';
