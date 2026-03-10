// Lone Star Distribution — PROOFLINE Data Barrel
// All data modules re-exported from a single entry point.
// Pages import from '@/data' which resolves here.

// ── Core Data ──────────────────────────────────
export {
  BRAND_FAMILIES,
  TOTAL_QUARTERLY_CASES as BRAND_TOTAL_CASES,
  TOTAL_QUARTERLY_REVENUE as BRAND_TOTAL_REVENUE,
  SUPPLIER_PORTFOLIO_SHARE,
  CATEGORY_COLORS,
  SUPPLIER_COLORS,
  getBrandsBySupplier,
  getBrandsByCategory,
  type BrandFamily,
  type SupplierGroup,
  type Category,
} from './brands';

export {
  HOMETOWNS,
  TOTAL_ROUTES,
  TOTAL_ACCOUNTS,
  TOTAL_QUARTERLY_CASES as HOMETOWN_TOTAL_CASES,
  TOTAL_QUARTERLY_REVENUE as HOMETOWN_TOTAL_REVENUE,
  getHometownById,
  type Hometown,
} from './hometowns';

export {
  ROUTES,
  getRoutesByHometown,
  getRouteById,
  type Route,
} from './routes';

export {
  SELLERS,
  MANAGERS,
  getSellerById,
  getSellerByRoute,
  getSellersByHometown,
  getManagerByHometown,
  getManagerById,
  type Seller,
  type Manager,
} from './sellers';

export {
  ACCOUNTS,
  getAccountById,
  getAccountsByRoute,
  getAccountsByHometown,
  getAccountsByTier,
  type Account,
  type AccountTier,
  type AccountType,
} from './accounts';

// ── Day Plans ──────────────────────────────────
export {
  DAY_PLANS,
  MARCUS_DAY_PLAN,
  STOP_TYPE_CONFIG,
  getDayPlanByRep,
  getStopById,
  type DayPlan,
  type Stop,
  type StopType,
  type AIInsight,
  type DataSource,
  type ManifestItem,
} from './day-plans';

// ── Compensation ───────────────────────────────
export {
  EMCO_GATES,
  COMP_TIERS,
  COMP_PLAN,
  SPIRITS_ADDER,
  KICKERS,
  getGateStatus,
  countUnlockedGates,
  getEffectiveMultiplier,
  estimateQuarterlyEarnings,
  getGateByName,
  getTierByLevel,
  type EmcoGate,
  type GateName,
  type GateStatus,
  type CompTier,
  type CompPlan,
  type SpiritsAdder,
  type Kicker,
} from './comp';

// ── Comp Management (Act 5) ─────────────────────
export {
  TRANSACTIONS,
  PAYMENTS,
  CLUB_TIERS,
  MGMT_INQUIRIES,
  STATUS_CONFIG,
  CATEGORY_LABELS,
  type Transaction,
  type CreditRule,
  type Payment,
  type PaymentType,
  type PaymentStatus,
  type ClubTierDef,
  type ClubTier,
  type Inquiry,
  type InquiryStatus,
  type InquiryCategory,
} from './mgmt';

// ── Scenarios ──────────────────────────────────
export {
  SCENARIOS,
  getScenarioById,
  getScenarioProjection,
  getAnnualRevenue,
  compareScenarios,
  type Scenario,
  type ScenarioId,
  type ScenarioComparison,
} from './scenarios';

// ── Forecasting ────────────────────────────────
export {
  BRAND_FORECASTS,
  SEASONAL_OVERLAYS,
  WEATHER_IMPACTS,
  INVENTORY_RECOMMENDATIONS,
  NEW_PRODUCT_FORECASTS,
  getForecastByBrand,
  getOverlaysForWeek,
  getWeatherForWeek,
  getAggregateForecast,
  type BrandForecast,
  type WeeklyForecast,
  type SeasonalOverlay,
  type WeatherImpact,
  type InventoryRecommendation,
  type NewProductForecast,
} from './forecasting';

// ── Compliance ─────────────────────────────────
export {
  TABC_LICENSE_TYPES,
  DISPLAY_COMPLIANCE,
  ACCOUNT_TABC_STATUS,
  HOMETOWN_COMPLIANCE,
  getComplianceByAccount,
  getTABCByAccount,
  getComplianceByRoute,
  getHometownCompliance,
  getLicenseInfo,
  countTABCIssues,
  type TABCLicenseCode,
  type TABCStatus,
  type TABCLicense,
  type ComplianceStatus,
  type DisplayCompliance,
  type ComplianceIssue,
  type AccountTABCStatus,
  type HometownComplianceSummary,
} from './compliance';

// ── Competitive Intelligence ───────────────────
export {
  COMPETITORS,
  COMPETITOR_SIGHTINGS,
  MARKET_SHARE_DFW,
  MARKET_SHARE_SOUTH_TX,
  PIPELINE_ACCOUNTS,
  getCompetitorById,
  getSightingsByRoute,
  getSightingsByCompetitor,
  getHighThreatSightings,
  getPipelineByHometown,
  getPipelineBySeller,
  getTotalPipelineRevenue,
  type Competitor,
  type SightingType,
  type CompetitorSighting,
  type MarketShareSegment,
  type PipelineAccount,
} from './competitive';

// ── Coaching ───────────────────────────────────
export {
  COACHING_CARDS,
  WEEKLY_COACHING_AGENDA,
  COACHING_HISTORY_DAL_03,
  DALLAS_DISTRICT_LIVE,
  getCoachingCardsBySeller,
  getCoachingCardsByPriority,
  getUrgentCards,
  getAgendaForSeller,
  getCoachingHistory,
  getLiveSnapshot,
  getDistrictSummary,
  type CoachingCard,
  type CoachingCategory,
  type CoachingPriority,
  type CoachingStatus,
  type CoachingAgendaItem,
  type CoachingHistoryEntry,
  type DistrictRepSnapshot,
} from './coaching';

// ── Kept files (legacy data) ───────────────────
export { PROGRESSION, type WeekSnapshot } from './progression';
export {
  ROUTE_EFFICIENCY, type RouteEfficiency,
  INVENTORY_POSITIONS, type InventoryPosition,
  DELIVERY_CALENDAR, type DeliveryDay,
} from './distribution';
export {
  PROMO_BUDGETS, type PromoBudget,
  TABC_CHECKLIST, type TABCCheckItem,
  SUPPLIER_PROGRAMS, type SupplierProgram,
  CASH_DISCIPLINE, type CashDiscipline,
} from './tradeSpend';
