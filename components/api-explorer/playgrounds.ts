/**
 * Playground configurations — defines which RPCs get interactive "Try It" panels
 * and what default request bodies to show.
 */

export interface PlaygroundConfig {
  rpcName: string;
  description: string;
  defaultBody: string;
}

export const playgrounds: Record<string, PlaygroundConfig[]> = {
  'policy-svc': [
    {
      rpcName: 'Decide',
      description: 'Evaluate whether an action is allowed by governance policies. Returns ALLOW, DENY, or REQUIRE_APPROVAL.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        action: 'deploy.production',
        actor: 'agent:healing-chief',
        context: {
          severity: 'medium',
          service: 'pulse-svc',
          change_type: 'config_update',
        },
      }, null, 2),
    },
    {
      rpcName: 'SimulatePolicy',
      description: 'Run a what-if scenario without recording the decision. Great for testing policy changes before applying them.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        action: 'ai.completion',
        actor: 'user:todd@aicoderally.com',
        context: {
          model: 'claude-sonnet-4-5-20250514',
          estimated_tokens: 50000,
          purpose: 'document_analysis',
        },
      }, null, 2),
    },
    {
      rpcName: 'ListPolicies',
      description: 'Return all policies configured for a tenant.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
      }, null, 2),
    },
  ],

  'knowledge-svc': [
    {
      rpcName: 'Query',
      description: 'Semantic search over knowledge base chunks. Returns ranked results with similarity scores.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        query: 'How does tenant isolation work in the platform?',
        top_k: 5,
        min_score: 0.7,
      }, null, 2),
    },
    {
      rpcName: 'Ingest',
      description: 'Ingest content into the knowledge base. Content is chunked and embedded for semantic search.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        source_id: 'src_demo_001',
        content: 'The AICR platform enforces tenant isolation at multiple layers: database (row-level security), API (JWT tenant claims), and UI (tenant context switching). Each tenant has its own data partition and cannot access other tenants\' data.',
        metadata: {
          title: 'Tenant Isolation Guide',
          type: 'documentation',
        },
      }, null, 2),
    },
  ],

  'ai-gateway-svc': [
    {
      rpcName: 'Complete',
      description: 'Route an AI completion through the gateway. Automatically selects provider, tracks cost, and applies rate limits.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        model: 'claude-sonnet-4-5-20250514',
        messages: [
          { role: 'user', content: 'Summarize the key benefits of AI-assisted sales compensation management in 2 sentences.' },
        ],
        max_tokens: 200,
      }, null, 2),
    },
    {
      rpcName: 'GetProviderStatus',
      description: 'Check the health and latency of configured AI providers.',
      defaultBody: '{}',
    },
  ],

  'design-svc': [
    {
      rpcName: 'EvaluateBenchmark',
      description: 'Score a compensation plan against industry benchmarks. Returns dimension scores and recommendations.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        plan: {
          name: 'Enterprise AE Plan',
          role_type: 'account_executive',
          ote: 250000,
          base_salary: 125000,
          quota: 2000000,
          accelerator_tiers: 6,
          components: ['base', 'commission', 'spiff', 'mbo', 'override', 'clawback'],
        },
      }, null, 2),
    },
    {
      rpcName: 'ListFrameworks',
      description: 'Browse available design frameworks and their module counts.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
      }, null, 2),
    },
  ],

  'audit-svc': [
    {
      rpcName: 'RecordEvent',
      description: 'Record an immutable audit event. Events cannot be modified or deleted after creation.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        event_type: 'policy.decision',
        actor: 'agent:healing-chief',
        action: 'auto_fix',
        resource: 'health-event:evt-001',
        metadata: {
          severity: 'medium',
          fixer: 'dependency',
          result: 'success',
        },
      }, null, 2),
    },
  ],

  'pulse-svc': [
    {
      rpcName: 'CreateCoachingCard',
      description: 'Create a coaching card from a change intelligence signal. Cards surface actionable insights.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        title: 'Stalled Deal Detected',
        body: 'Deal "Enterprise License - Acme Corp" has been in Negotiation stage for 45 days without activity. Average time in this stage is 12 days.',
        severity: 'high',
        source: 'deal_velocity_detector',
        metadata: {
          deal_id: 'deal_001',
          days_stalled: 45,
          stage: 'negotiation',
        },
      }, null, 2),
    },
  ],

  'document-svc': [
    {
      rpcName: 'AnalyzeDocument',
      description: 'Upload and analyze a document. Extracts structure, entities, and key findings.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        content: 'SALES COMPENSATION PLAN - FY2026\n\nBase Salary: $125,000\nOTE: $250,000\nQuota: $2,000,000\nCommission Rate: 6.25% (at 100% attainment)\nAccelerators:\n  - 100-120%: 1.5x rate\n  - 120-150%: 2.0x rate\n  - 150%+: 2.5x rate\nClawback: 90-day window on churned deals\nDraw: Non-recoverable for first 90 days',
        document_type: 'compensation_plan',
        analysis_options: {
          extract_entities: true,
          identify_gaps: true,
        },
      }, null, 2),
    },
  ],
};
