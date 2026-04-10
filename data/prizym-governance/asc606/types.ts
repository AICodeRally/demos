/**
 * Minimal type definitions for ASC 606 governance content.
 * These mirror the shapes from aicr-platform-ver's lib/contracts
 * but drop Zod and CRUD/filter concerns — the demo only needs reads.
 */

export type PlanType = 'COMPENSATION_PLAN' | 'GOVERNANCE_PLAN' | 'POLICY_CREATION_PLAN';
export type ContentTier = 'gold-standard' | 'client' | 'demo';
export type DataClass = 'reference' | 'demo' | 'client' | 'tenant';

export interface GovernanceFramework {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  category: 'METHODOLOGY' | 'STANDARDS' | 'COMPLIANCE' | 'BEST_PRACTICES' | 'REGULATORY' | 'INDUSTRY_SPECIFIC';
  content: string;
  version: string;
  status: 'DRAFT' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';
  isGlobal: boolean;
  isMandatory: boolean;
  applicableTo?: PlanType[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tier: ContentTier;
  dataClass: DataClass;
}

export type PolicyStatus = 'draft' | 'published' | 'superseded' | 'retired';

export interface Policy {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  category?: string;
  dataClass: DataClass;
  version: string;
  status: PolicyStatus;
  effectiveDate: Date;
  expirationDate?: Date;
  content: string;
  parentPolicyId?: string;
  supersededByPolicyId?: string;
  approvalRequired?: boolean;
  approvalWorkflowId?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface PlanTemplate {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string;
  planType: PlanType;
  category?: string;
  tags?: string[];
  version: string;
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED';
  source: 'SYSTEM' | 'USER_CREATED' | 'CLONED';
  isSystemTemplate: boolean;
  clonedFromId?: string;
  owner: string;
  createdBy: string;
  createdAt: Date;
  lastUpdated: Date;
  effectiveDate?: Date;
  usageCount: number;
  metadata?: Record<string, unknown>;
  tier: ContentTier;
}
