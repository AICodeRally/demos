import type { PlanTemplate } from './types';


/**
 * ASC 606 Revenue Recognition Plan Templates
 * 3 system templates covering contract clauses, journal entries, and SOW language patterns
 */

const DEFAULT_TENANT_ID = 'demo-tenant-001';
const CREATED_BY = 'BHG Consulting';
const NOW = new Date('2026-02-18T12:00:00Z');

// =============================================================================
// TPL-ASC-001: Contract Clause Patterns (ASC 606)
// =============================================================================

export const asc606Template1: PlanTemplate = {
  id: 'tpl-asc-001-id',
  tenantId: DEFAULT_TENANT_ID,
  code: 'TPL-ASC-001',
  name: 'Contract Clause Patterns (ASC 606)',
  description:
    '6 contract clause patterns that support clean ASC 606 accounting outcomes. Each pattern includes the desired accounting outcome, recommended drafting language, and what it prevents.',
  planType: 'GOVERNANCE_PLAN',
  category: 'Revenue Recognition',
  tags: ['asc-606', 'contract', 'revenue', 'clause-patterns'],
  version: '1.0.0',
  status: 'ACTIVE',
  source: 'SYSTEM',
  isSystemTemplate: true,
  clonedFromId: undefined,
  owner: CREATED_BY,
  createdBy: CREATED_BY,
  createdAt: NOW,
  lastUpdated: NOW,
  effectiveDate: NOW,
  usageCount: 0,
  metadata: {
    clauseCount: 6,
    clauses: [
      'Clear separability of onboarding',
      'Nonrefundable upfront fee clarity',
      'Customer acceptance criteria',
      'Credits treatment',
      'Marketplace agent language',
      'Hardware transfer point',
    ],
  },
  tier: 'gold-standard' as const,
};

// =============================================================================
// TPL-ASC-002: Journal Entry Templates (ASC 606)
// =============================================================================

export const asc606Template2: PlanTemplate = {
  id: 'tpl-asc-002-id',
  tenantId: DEFAULT_TENANT_ID,
  code: 'TPL-ASC-002',
  name: 'Journal Entry Templates (ASC 606)',
  description:
    '6 journal entry templates covering the full BHG bundle lifecycle under ASC 606. Includes debit/credit entries for each recognition event from invoice through delivery.',
  planType: 'COMPENSATION_PLAN',
  category: 'Revenue Recognition',
  tags: ['asc-606', 'journal-entries', 'revenue', 'accounting'],
  version: '1.0.0',
  status: 'ACTIVE',
  source: 'SYSTEM',
  isSystemTemplate: true,
  clonedFromId: undefined,
  owner: CREATED_BY,
  createdBy: CREATED_BY,
  createdAt: NOW,
  lastUpdated: NOW,
  effectiveDate: NOW,
  usageCount: 0,
  metadata: {
    entryCount: 6,
    journalEntries: [
      'Invoice upfront',
      'Monthly subscription',
      'AI credits consumed',
      'Onboarding delivered',
      'Hardware delivered',
      'Marketplace fee',
    ],
  },
  tier: 'gold-standard' as const,
};

// =============================================================================
// TPL-ASC-003: SOW Language Patterns (ASC 606)
// =============================================================================

export const asc606Template3: PlanTemplate = {
  id: 'tpl-asc-003-id',
  tenantId: DEFAULT_TENANT_ID,
  code: 'TPL-ASC-003',
  name: 'SOW Language Patterns (ASC 606)',
  description:
    'SOW language patterns for each performance obligation type that support clean ASC 606 outcomes. Covers subscription services, onboarding, AI credits, hardware, and marketplace transactions.',
  planType: 'GOVERNANCE_PLAN',
  category: 'Revenue Recognition',
  tags: ['asc-606', 'sow', 'contracts', 'language-patterns'],
  version: '1.0.0',
  status: 'ACTIVE',
  source: 'SYSTEM',
  isSystemTemplate: true,
  clonedFromId: undefined,
  owner: CREATED_BY,
  createdBy: CREATED_BY,
  createdAt: NOW,
  lastUpdated: NOW,
  effectiveDate: NOW,
  usageCount: 0,
  metadata: {
    patternCount: 5,
    sowAreas: [
      'Subscription services (ratable recognition)',
      'Onboarding and implementation (point-in-time)',
      'AI credits and usage-based billing',
      'Hardware and physical delivery terms',
      'Marketplace and agent vs. principal determination',
    ],
  },
  tier: 'gold-standard' as const,
};

// =============================================================================
// Aggregate Export
// =============================================================================

export const asc606Templates: PlanTemplate[] = [
  asc606Template1,
  asc606Template2,
  asc606Template3,
];
