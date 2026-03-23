// RIDGELINE — SRS Distribution RevOps & SPM Demo Data Barrel
// All data modules re-exported from a single entry point.

export {
  COMPANY,
  DIVISIONS,
  REGIONS,
  getDivisionById,
  getRegionById,
  type Division,
  type Region,
} from './company';

export {
  BRANCHES,
  getBranchById,
  getBranchesByRegion,
  getBranchesByDivision,
  getActiveBranches,
  type Branch,
  type BranchStatus,
} from './branches';

export {
  EMPLOYEES,
  getEmployeeById,
  getEmployeesByRole,
  getDirectReports,
  getRoleHierarchy,
  ROLE_HIERARCHY,
  type Employee,
  type EmployeeRole,
} from './employees';

export {
  COMP_PLANS,
  COMP_TIERS,
  SPIFF_PROGRAMS,
  getCompPlanByRole,
  getTierByAttainment,
  getActiveSpiffs,
  type CompPlan,
  type CompTier,
  type SpiffProgram,
} from './compensation';

export {
  TERRITORIES,
  TERRITORY_METRICS,
  getTerritoryById,
  getTerritoriesByRegion,
  getTerritoryMetrics,
  type Territory,
  type TerritoryMetric,
} from './territories';

export {
  DISPUTES,
  DISPUTE_METRICS,
  getDisputesByStatus,
  getDisputesByRep,
  type Dispute,
  type DisputeStatus,
  type DisputeMetrics,
} from './disputes';

export {
  VENDOR_REBATES,
  REBATE_PERFORMANCE,
  getRebatesByVendor,
  getRebatePerformance,
  type VendorRebate,
  type RebatePerformance,
} from './rebates';

export {
  AUDIT_EVENTS,
  getAuditEventsByEntity,
  getRecentAuditEvents,
  type AuditEvent,
  type AuditAction,
} from './audit';

export {
  INTEGRATION_SYSTEMS,
  DATA_FEEDS,
  MICROSERVICES,
  type IntegrationSystem,
  type DataFeed,
  type Microservice,
} from './architecture';
