'use client';

import { useState, useCallback } from 'react';

const GATEWAY_URL = 'https://api.aicoderally.com';

interface TryItPanelProps {
  method: string;
  path: string;
  rpcName: string;
  defaultBody?: string;
  description?: string;
  authToken?: string;
}

export function TryItPanel({ method, path, rpcName, defaultBody, description, authToken }: TryItPanelProps) {
  const [body, setBody] = useState(defaultBody ?? '{}');
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [mode, setMode] = useState<'live' | 'mock'>('mock');

  const mockResponses: Record<string, unknown> = {
    Decide: {
      decision: 'ALLOW',
      reason: 'Action permitted by policy BALANCED_GOVERNANCE',
      policyId: 'pol_demo_001',
      evaluatedAt: new Date().toISOString(),
      gates: [
        { gate: 'budget_limit', passed: true },
        { gate: 'approval_required', passed: true },
        { gate: 'risk_threshold', passed: true },
      ],
    },
    SimulatePolicy: {
      wouldAllow: true,
      matchedPolicies: ['BALANCED_GOVERNANCE', 'AI_USAGE_MODERATE'],
      riskScore: 35,
      gatesEvaluated: 4,
      gatesPassed: 4,
      simulatedAt: new Date().toISOString(),
    },
    Query: {
      results: [
        { chunkId: 'chunk_001', score: 0.94, text: 'The governance framework requires all AI-generated content to pass through a review pipeline before publication...', source: 'governance-handbook.pdf' },
        { chunkId: 'chunk_002', score: 0.87, text: 'Tenant isolation is enforced at the database level using row-level security policies and application-layer guards...', source: 'architecture-guide.md' },
        { chunkId: 'chunk_003', score: 0.81, text: 'Rate limiting is applied per-tenant with configurable thresholds for API calls, AI completions, and document processing...', source: 'ops-runbook.md' },
      ],
      totalChunks: 1247,
      queryTimeMs: 42,
    },
    Complete: {
      text: 'Based on the sales compensation data, Q1 attainment across the team averaged 87% with top performers exceeding 120% of quota. The accelerator tiers are correctly applied above the 100% threshold.',
      model: 'claude-sonnet-4-5-20250514',
      provider: 'anthropic',
      tokensUsed: { input: 156, output: 89 },
      costUsd: 0.0034,
      latencyMs: 1240,
    },
    EvaluateBenchmark: {
      score: 72,
      grade: 'B',
      dimensions: [
        { name: 'Plan Complexity', score: 85, benchmark: 70 },
        { name: 'Component Count', score: 65, benchmark: 50 },
        { name: 'Rule Coverage', score: 78, benchmark: 75 },
        { name: 'Quota Alignment', score: 60, benchmark: 80 },
      ],
      recommendations: [
        'Consider simplifying accelerator tiers — current plan has 6 tiers vs. industry median of 4',
        'Quota-to-OTE ratio of 8:1 is above the 5:1 benchmark for this role type',
      ],
      evaluatedAt: new Date().toISOString(),
    },
    ListPolicies: {
      policies: [
        { id: 'pol_001', name: 'BALANCED_GOVERNANCE', type: 'preset', enabled: true, ruleCount: 12 },
        { id: 'pol_002', name: 'AI_USAGE_MODERATE', type: 'custom', enabled: true, ruleCount: 8 },
        { id: 'pol_003', name: 'DEPLOYMENT_SAFE', type: 'immutable', enabled: true, ruleCount: 5 },
      ],
      total: 3,
    },
    ListFrameworks: {
      frameworks: [
        { id: 'fw_001', name: 'SPARCC SPM Framework', version: '2.0', moduleCount: 25 },
        { id: 'fw_002', name: 'STEEPLE Church Ops', version: '1.0', moduleCount: 18 },
        { id: 'fw_003', name: 'LUMEN Nonprofit Suite', version: '1.0', moduleCount: 14 },
      ],
      total: 3,
    },
    GetProviderStatus: {
      providers: [
        { name: 'anthropic', status: 'healthy', latencyP50Ms: 890, latencyP99Ms: 2400, modelsAvailable: 3 },
        { name: 'openai', status: 'healthy', latencyP50Ms: 650, latencyP99Ms: 1800, modelsAvailable: 4 },
      ],
      checkedAt: new Date().toISOString(),
    },
    // audit-svc
    RecordEvent: {
      eventId: 'evt_20260312_001',
      recorded: true,
      immutable: true,
      timestamp: new Date().toISOString(),
      hash: 'sha256:a1b2c3d4e5f6...',
    },
    // pulse-svc
    CreateCoachingCard: {
      cardId: 'card_001',
      status: 'created',
      severity: 'high',
      assignedTo: 'manager:sales_director',
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    // document-svc
    AnalyzeDocument: {
      documentId: 'doc_001',
      structure: {
        sections: 4,
        tables: 1,
        lists: 3,
      },
      entities: [
        { type: 'currency', value: '$125,000', label: 'Base Salary' },
        { type: 'currency', value: '$250,000', label: 'OTE' },
        { type: 'currency', value: '$2,000,000', label: 'Quota' },
        { type: 'percentage', value: '6.25%', label: 'Commission Rate' },
      ],
      gaps: [
        'No cap on accelerator payouts — consider adding a maximum multiplier',
        'Clawback window (90 days) is below industry standard (180 days)',
      ],
      analysisTimeMs: 340,
    },
    // knowledge-svc Ingest
    Ingest: {
      documentId: 'doc_demo_001',
      chunksCreated: 3,
      embeddingsGenerated: 3,
      totalTokens: 412,
      status: 'indexed',
      ingestedAt: new Date().toISOString(),
    },
    // identity-svc
    ValidateToken: {
      valid: true,
      claims: {
        sub: 'user_001',
        tenant_id: 'demo-tenant',
        roles: ['admin', 'analyst'],
        permissions: ['read:plans', 'write:plans', 'read:reports'],
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    },
    ResolvePermissions: {
      userId: 'user_001',
      tenantId: 'demo-tenant',
      resource: 'compensation_plan',
      effectivePermissions: ['read', 'write', 'approve', 'export'],
      sources: [
        { permission: 'read', source: 'role:admin', type: 'role' },
        { permission: 'write', source: 'role:admin', type: 'role' },
        { permission: 'approve', source: 'direct_grant', type: 'direct' },
        { permission: 'export', source: 'role:analyst', type: 'role' },
      ],
    },
    // usage-svc
    Record: {
      eventId: 'usage_evt_001',
      recorded: true,
      metric: 'ai.tokens',
      value: 1500,
      bucketKey: '2026-03-12',
      runningTotal: 45230,
    },
    // oversight-svc
    CreateApproval: {
      approvalId: 'apr_001',
      status: 'pending',
      requester: 'agent:healing-chief',
      approvers: ['user:ops_lead', 'user:platform_admin'],
      slaDeadline: new Date(Date.now() + 15 * 60000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    ListApprovals: {
      approvals: [
        { id: 'apr_001', action: 'deploy.production', status: 'pending', requester: 'agent:healing-chief', severity: 'high', createdAt: new Date(Date.now() - 300000).toISOString() },
        { id: 'apr_002', action: 'schema.migrate', status: 'approved', requester: 'user:dev_lead', severity: 'medium', resolvedAt: new Date(Date.now() - 7200000).toISOString() },
      ],
      total: 2,
    },
    // dispute-svc
    CreateCase: {
      caseId: 'case_001',
      status: 'open',
      title: 'Q1 Accelerator Calculation Dispute',
      category: 'commission_calculation',
      amountDisputed: 4250.00,
      assignedTo: 'manager:comp_admin',
      sla: { responseBy: new Date(Date.now() + 48 * 3600000).toISOString() },
      createdAt: new Date().toISOString(),
    },
    // scoping-svc
    Estimate: {
      estimateId: 'est_001',
      clientName: 'Acme Corp',
      engagementType: 'spm_implementation',
      modules: ['compensation', 'territory', 'quota', 'analytics'],
      complexity: 'medium',
      estimates: {
        totalWeeks: 12,
        totalHours: 480,
        phases: [
          { name: 'Discovery', weeks: 2, hours: 80 },
          { name: 'Configuration', weeks: 4, hours: 160 },
          { name: 'Integration', weeks: 3, hours: 120 },
          { name: 'UAT & Go-Live', weeks: 3, hours: 120 },
        ],
      },
      pricing: { low: 96000, mid: 120000, high: 144000, currency: 'USD' },
    },
    // deploy-svc
    Lookup: {
      path: 'apps/aicr',
      found: true,
      config: {
        vercelProject: 'aicr-platform',
        domain: 'app.aicoderally.com',
        deployPolicy: 'pr-merge',
        framework: 'nextjs',
        category: 'platform',
      },
    },
    ValidateManifest: {
      valid: true,
      entries: 24,
      warnings: [
        { path: 'sandbox/tendr', message: 'No recent deployment detected' },
      ],
      duplicateDomains: [],
      missingProjects: [],
      checkedAt: new Date().toISOString(),
    },
    // storage-svc
    Upload: {
      fileId: 'file_001',
      signedUrl: 'https://storage.aicoderally.com/demo-tenant/file_001?token=demo...',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      metadata: { filename: 'q1-comp-plan.pdf', contentType: 'application/pdf', sizeBytes: 245000 },
    },
    // email-svc
    Send: {
      messageId: 'msg_001',
      status: 'queued',
      template: 'approval_request',
      to: 'manager@example.com',
      estimatedDelivery: new Date(Date.now() + 30000).toISOString(),
    },
    // prizym-svc
    ValidateFormula: {
      valid: true,
      parsedTokens: 12,
      variables: ['attainment', 'base_rate'],
      complexity: 'medium',
      estimatedEvalTimeMs: 0.3,
      warnings: [],
    },
    ExecuteBehavior: {
      behaviorId: 'beh_accelerator_001',
      result: {
        commission: 9375,
        effectiveRate: 1.5,
        tierApplied: 'accelerator_tier_2',
        breakdown: {
          baseCommission: 6250,
          acceleratorBonus: 3125,
          attainmentMultiplier: 1.15,
        },
      },
      executionTimeMs: 2.1,
    },
    // eval-svc
    CreateSuite: {
      suiteId: 'suite_001',
      name: 'Comp Plan Analysis Suite',
      testCaseCount: 2,
      model: 'claude-sonnet-4-5-20250514',
      status: 'created',
      createdAt: new Date().toISOString(),
    },
    // research-svc
    GeneratePrompt: {
      promptId: 'prompt_001',
      template: 'gap_analysis',
      pack: 'sparcc',
      generatedPrompt: 'You are an expert compensation analyst. Analyze the following compensation plan document for gaps in: accelerators, clawbacks, and quota methodology. Compare against industry best practices for the technology sector...',
      tokenEstimate: 340,
      variables: { document_type: 'compensation_plan', industry: 'technology' },
    },
    // demo-svc
    Analyze: {
      scaffoldId: 'scaffold_001',
      industry: 'pharmaceutical',
      recommendations: {
        modules: ['territory_management', 'quota_planning', 'incentive_compensation', 'field_analytics'],
        dataModels: ['medical_rep', 'district', 'product_line', 'prescription_data'],
        compComponents: ['base_salary', 'target_bonus', 'contest_spiff', 'managed_care_override'],
      },
      complexity: 'high',
      estimatedPages: 18,
    },
    // eventbus-svc
    Publish: {
      messageId: 'nats_msg_001',
      subject: 'aicr.deal.stage_changed',
      stream: 'AICR_EVENTS',
      sequence: 42847,
      publishedAt: new Date().toISOString(),
    },
  };

  const execute = useCallback(async () => {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    const start = Date.now();

    if (mode === 'mock') {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 200 + Math.random() * 600));
      const mockData = mockResponses[rpcName] ?? { ok: true, message: `${rpcName} executed successfully` };
      setResponse(JSON.stringify(mockData, null, 2));
      setStatus(200);
      setLatency(Date.now() - start);
      setLoading(false);
      return;
    }

    // Live mode — call actual gateway
    try {
      const url = `${GATEWAY_URL}${path}`;
      const opts: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
      };
      if (method !== 'GET' && body.trim() !== '{}') {
        opts.body = body;
      }
      const res = await fetch(url, opts);
      const text = await res.text();
      setStatus(res.status);
      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        setResponse(text);
      }
    } catch (err) {
      setStatus(0);
      setResponse(`Network error: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLatency(Date.now() - start);
    setLoading(false);
  }, [mode, method, path, body, rpcName, authToken]);

  return (
    <div className="rounded-xl border border-[#1a2a2e] bg-[#0d1517] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1a2a2e] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#06b6d4]">Try It</span>
          <code className="text-xs text-[#555]">{method} {path}</code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('mock')}
            className={`rounded-l px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'mock'
                ? 'bg-[#06b6d4]/20 text-[#06b6d4]'
                : 'bg-[#111] text-[#555] hover:text-[#888]'
            }`}
          >
            Mock
          </button>
          <button
            onClick={() => setMode('live')}
            className={`rounded-r px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'live'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-[#111] text-[#555] hover:text-[#888]'
            }`}
          >
            Live
          </button>
        </div>
      </div>

      {description && (
        <p className="px-4 pt-3 text-xs text-[#666]">{description}</p>
      )}

      {/* Request Body */}
      {method !== 'GET' && (
        <div className="px-4 pt-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#555]">
            Request Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={Math.min(body.split('\n').length + 1, 12)}
            className="w-full rounded-lg border border-[#1a2a2e] bg-[#0a1012] p-3 font-mono text-sm text-[#ccc] focus:border-[#06b6d4]/50 focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
      )}

      {/* Execute Button */}
      <div className="px-4 py-3">
        <button
          onClick={execute}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#06b6d4] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0891b2] disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
              </svg>
              Executing...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
              </svg>
              Execute {rpcName}
            </>
          )}
        </button>
      </div>

      {/* Response */}
      {response !== null && (
        <div className="border-t border-[#1a2a2e] px-4 py-3">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555]">Response</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              status && status >= 200 && status < 300
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {status}
            </span>
            {latency !== null && (
              <span className="text-xs text-[#555]">{latency}ms</span>
            )}
            {mode === 'mock' && (
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">MOCK</span>
            )}
          </div>
          <pre className="max-h-80 overflow-auto rounded-lg border border-[#1a2a2e] bg-[#0a1012] p-3 font-mono text-sm text-[#ccc] leading-relaxed">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
