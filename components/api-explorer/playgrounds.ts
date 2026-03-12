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

  'identity-svc': [
    {
      rpcName: 'ValidateToken',
      description: 'Validate a JWT token and return the decoded claims (tenant, roles, permissions).',
      defaultBody: JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-token',
      }, null, 2),
    },
    {
      rpcName: 'ResolvePermissions',
      description: 'Resolve the effective permissions for a user within a tenant, merging role-based and direct grants.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        user_id: 'user_001',
        resource: 'compensation_plan',
      }, null, 2),
    },
  ],

  'usage-svc': [
    {
      rpcName: 'Record',
      description: 'Record a usage event (API call, AI tokens, storage bytes). Feeds into metering and billing.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        metric: 'ai.tokens',
        value: 1500,
        metadata: {
          model: 'claude-sonnet-4-5-20250514',
          provider: 'anthropic',
          workflow_id: 'wf_heal_001',
        },
      }, null, 2),
    },
    {
      rpcName: 'Query',
      description: 'Query aggregated usage data with time range and grouping. Powers dashboards and billing reports.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        metric: 'ai.tokens',
        start_time: '2026-03-01T00:00:00Z',
        end_time: '2026-03-12T23:59:59Z',
        group_by: 'day',
      }, null, 2),
    },
  ],

  'oversight-svc': [
    {
      rpcName: 'CreateApproval',
      description: 'Create an approval request. Supports multi-level approval chains with SLA deadlines.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        requester: 'agent:healing-chief',
        action: 'deploy.production',
        resource: 'pulse-svc',
        severity: 'high',
        sla_minutes: 15,
        context: {
          reason: 'Auto-heal detected degraded service, requesting permission to restart',
        },
      }, null, 2),
    },
    {
      rpcName: 'ListApprovals',
      description: 'List pending and resolved approvals for a tenant.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        status: 'pending',
      }, null, 2),
    },
  ],

  'dispute-svc': [
    {
      rpcName: 'CreateCase',
      description: 'Open a dispute case for commission calculation disagreements. Tracks evidence and resolution.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        title: 'Q1 Accelerator Calculation Dispute',
        description: 'Commission accelerator was not applied for deals closed in the last week of Q1. Attainment was 105% but rate remained at base.',
        claimant: 'user:rep_001',
        category: 'commission_calculation',
        amount_disputed: 4250.00,
        evidence: [
          { type: 'deal', id: 'deal_042', note: 'Closed 2026-03-28, $180K' },
          { type: 'deal', id: 'deal_045', note: 'Closed 2026-03-30, $95K' },
        ],
      }, null, 2),
    },
  ],

  'scoping-svc': [
    {
      rpcName: 'Estimate',
      description: 'Generate a scoping estimate for a new engagement. Considers complexity, modules, and timeline.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        client_name: 'Acme Corp',
        engagement_type: 'spm_implementation',
        modules: ['compensation', 'territory', 'quota', 'analytics'],
        headcount: 250,
        complexity: 'medium',
        timeline_weeks: 12,
      }, null, 2),
    },
  ],

  'deploy-svc': [
    {
      rpcName: 'Lookup',
      description: 'Look up deployment configuration for a path from the deploy manifest.',
      defaultBody: JSON.stringify({
        path: 'apps/aicr',
      }, null, 2),
    },
    {
      rpcName: 'ValidateManifest',
      description: 'Validate the deploy manifest for consistency (duplicate domains, missing projects, etc).',
      defaultBody: JSON.stringify({
        manifest_path: '/deploy-manifest.json',
      }, null, 2),
    },
  ],

  'storage-svc': [
    {
      rpcName: 'Upload',
      description: 'Upload a file to tenant-scoped storage. Returns a signed URL for retrieval.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        filename: 'q1-comp-plan.pdf',
        content_type: 'application/pdf',
        size_bytes: 245000,
        metadata: {
          uploaded_by: 'user:todd',
          category: 'compensation_plan',
        },
      }, null, 2),
    },
  ],

  'email-svc': [
    {
      rpcName: 'Send',
      description: 'Send a transactional email using a template. Supports variable substitution and tracking.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        template: 'approval_request',
        to: 'manager@example.com',
        variables: {
          requester_name: 'HealingChief Agent',
          action: 'Restart pulse-svc',
          severity: 'HIGH',
          sla_deadline: '15 minutes',
          approve_url: 'https://app.aicoderally.com/gocc/approvals/apr_001',
        },
      }, null, 2),
    },
  ],

  'prizym-svc': [
    {
      rpcName: 'ValidateFormula',
      description: 'Validate a compensation formula expression. Checks syntax, references, and circular dependencies.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        formula: 'IF(attainment > 1.0, base_rate * 1.5 * (attainment - 1.0) + base_rate, base_rate * attainment)',
        variables: {
          attainment: 'number',
          base_rate: 'currency',
        },
      }, null, 2),
    },
    {
      rpcName: 'ExecuteBehavior',
      description: 'Execute a compensation behavior graph node. Processes input through the rule engine.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        behavior_id: 'beh_accelerator_001',
        inputs: {
          attainment: 1.15,
          base_rate: 6250,
          deal_count: 12,
        },
      }, null, 2),
    },
  ],

  'eval-svc': [
    {
      rpcName: 'CreateSuite',
      description: 'Create an evaluation suite for AI regression testing. Defines test cases and expected outputs.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        name: 'Comp Plan Analysis Suite',
        model: 'claude-sonnet-4-5-20250514',
        test_cases: [
          {
            input: 'What is the commission rate at 100% attainment?',
            expected_output: '6.25%',
            context: 'Standard AE plan with $2M quota, $250K OTE',
          },
          {
            input: 'Calculate commission for $2.4M in bookings',
            expected_output: 'approximately $18,750',
            context: '120% attainment, 1.5x accelerator applies above 100%',
          },
        ],
      }, null, 2),
    },
  ],

  'research-svc': [
    {
      rpcName: 'GeneratePrompt',
      description: 'Generate a domain-specific prompt using the prompt factory. Applies pack context and templates.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        pack: 'sparcc',
        template: 'gap_analysis',
        variables: {
          document_type: 'compensation_plan',
          industry: 'technology',
          focus_areas: ['accelerators', 'clawbacks', 'quota_methodology'],
        },
      }, null, 2),
    },
  ],

  'demo-svc': [
    {
      rpcName: 'Analyze',
      description: 'Analyze a business domain to generate demo scaffold recommendations.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        industry: 'pharmaceutical',
        company_type: 'enterprise',
        use_case: 'field_sales_compensation',
        target_roles: ['medical_rep', 'district_manager', 'regional_vp'],
      }, null, 2),
    },
  ],

  'eventbus-svc': [
    {
      rpcName: 'Publish',
      description: 'Publish an event to the NATS JetStream bus. Consumers receive events via subscriptions.',
      defaultBody: JSON.stringify({
        tenant_id: 'demo-tenant',
        subject: 'aicr.deal.stage_changed',
        payload: {
          deal_id: 'deal_042',
          old_stage: 'negotiation',
          new_stage: 'closed_won',
          amount: 180000,
          changed_by: 'user:rep_001',
          changed_at: new Date().toISOString(),
        },
      }, null, 2),
    },
  ],
};
