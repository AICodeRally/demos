'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';

const ACCENT = '#F97316';

/* ── Connector definitions ─────────────────────── */
interface Connector {
  name: string;
  category: 'erp' | 'crm' | 'analytics' | 'hr' | 'data' | 'bi';
  description: string;
  status: 'live' | 'configured' | 'available';
  lastSync?: string;
  records?: number;
  direction: 'inbound' | 'outbound' | 'bidirectional';
}

const CONNECTORS: Connector[] = [
  // ERP / Back Office
  { name: 'SAP ERP', category: 'erp', description: 'Order management, invoicing, product master data', status: 'live', lastSync: '2h ago', records: 48200, direction: 'inbound' },
  { name: 'Oracle NetSuite', category: 'erp', description: 'Financial ledger, GL posting, accruals', status: 'configured', direction: 'outbound' },

  // CRM
  { name: 'Salesforce', category: 'crm', description: 'Account hierarchy, opportunity pipeline, contact data', status: 'live', lastSync: '6h ago', records: 4847, direction: 'bidirectional' },
  { name: 'HubSpot', category: 'crm', description: 'Marketing attribution, lead scoring, campaign data', status: 'available', direction: 'inbound' },

  // Data Platform
  { name: 'Snowflake', category: 'data', description: 'Data warehouse — centralized sales & comp analytics', status: 'live', lastSync: '1h ago', records: 2400000, direction: 'bidirectional' },
  { name: 'Alteryx', category: 'data', description: 'ETL workflows — data blending, cleansing, territory mapping', status: 'live', lastSync: '4h ago', records: 186000, direction: 'inbound' },
  { name: 'Databricks', category: 'data', description: 'ML pipelines — attainment forecasting, anomaly detection', status: 'configured', direction: 'bidirectional' },

  // HR / Payroll
  { name: 'ADP Workforce', category: 'hr', description: 'Payroll integration — variable pay export, tax withholding', status: 'live', lastSync: '24h ago', records: 36, direction: 'outbound' },
  { name: 'Workday', category: 'hr', description: 'HRIS — org chart, job levels, compensation bands', status: 'available', direction: 'inbound' },

  // Analytics / BI
  { name: 'Tableau', category: 'bi', description: 'Executive dashboards — comp expense, attainment heatmaps', status: 'live', lastSync: '30m ago', records: 12400, direction: 'outbound' },
  { name: 'Power BI', category: 'bi', description: 'Self-service analytics — territory deep-dives, what-if models', status: 'configured', direction: 'outbound' },
  { name: 'Looker', category: 'bi', description: 'Embedded analytics — rep-facing performance scorecards', status: 'available', direction: 'outbound' },
];

const CATEGORY_LABELS: Record<string, string> = {
  erp: 'ERP / Back Office',
  crm: 'CRM',
  data: 'Data Platform',
  hr: 'HR & Payroll',
  bi: 'Analytics & BI',
  analytics: 'Analytics',
};

const CATEGORY_ORDER = ['erp', 'crm', 'data', 'hr', 'bi'] as const;

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  live: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'LIVE' },
  configured: { bg: 'rgba(37,99,235,0.1)', color: '#2563EB', label: 'CONFIGURED' },
  available: { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8', label: 'AVAILABLE' },
};

const DIRECTION_LABELS: Record<string, string> = {
  inbound: '← Inbound',
  outbound: 'Outbound →',
  bidirectional: '↔ Bidirectional',
};

/* ── Data Flow Architecture ─────────────────────── */
const FLOW_LAYERS = [
  { label: 'Source Systems', items: ['SAP ERP', 'Salesforce', 'ADP', 'Alteryx'], color: '#94A3B8' },
  { label: 'Integration Hub', items: ['API Gateway', 'ETL Engine', 'Event Bus', 'Schema Registry'], color: ACCENT },
  { label: 'PROOFLINE Core', items: ['Data Layer', 'Measurements', 'Rewards', 'Payments'], color: '#0EA5E9' },
  { label: 'Outbound', items: ['Snowflake', 'Tableau', 'Power BI', 'ADP Payroll'], color: '#10B981' },
];

/* ── Recent Sync Events ─────────────────────────── */
const SYNC_EVENTS = [
  { time: '10:14 AM', source: 'SAP ERP', event: 'Order batch ingested', records: 1247, status: 'success' },
  { time: '10:02 AM', source: 'Salesforce', event: 'Account sync completed', records: 23, status: 'success' },
  { time: '9:45 AM', source: 'Alteryx', event: 'Territory mapping refreshed', records: 4847, status: 'success' },
  { time: '9:30 AM', source: 'Snowflake', event: 'Comp analytics push', records: 186000, status: 'success' },
  { time: '9:15 AM', source: 'Tableau', event: 'Dashboard data export', records: 12400, status: 'success' },
  { time: '8:00 AM', source: 'ADP Workforce', event: 'Payroll file generated', records: 36, status: 'success' },
  { time: '7:30 AM', source: 'Databricks', event: 'Forecast model retrain', records: 48200, status: 'warning' },
];

/* ── API Metrics ────────────────────────────────── */
const API_METRICS = [
  { endpoint: '/api/orders', calls24h: 12480, avgMs: 42, errorRate: 0.02 },
  { endpoint: '/api/accounts', calls24h: 3200, avgMs: 38, errorRate: 0.0 },
  { endpoint: '/api/comp/credits', calls24h: 8640, avgMs: 56, errorRate: 0.05 },
  { endpoint: '/api/comp/payments', calls24h: 720, avgMs: 124, errorRate: 0.0 },
  { endpoint: '/api/analytics/push', calls24h: 480, avgMs: 890, errorRate: 0.1 },
];

export default function IntegrationsPage() {
  const [filter, setFilter] = useState<string>('all');

  const liveCount = CONNECTORS.filter(c => c.status === 'live').length;
  const configuredCount = CONNECTORS.filter(c => c.status === 'configured').length;
  const totalRecords = CONNECTORS.filter(c => c.records).reduce((s, c) => s + c.records!, 0);

  const filtered = filter === 'all' ? CONNECTORS : CONNECTORS.filter(c => c.category === filter);
  const grouped = CATEGORY_ORDER
    .filter(cat => filter === 'all' || cat === filter)
    .map(cat => ({ category: cat, connectors: filtered.filter(c => c.category === cat) }))
    .filter(g => g.connectors.length > 0);

  return (
    <>
      <ActNavigation currentAct={6} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <LightKpiCard label="Live Connectors" value={String(liveCount)} accent={ACCENT} sub={`of ${CONNECTORS.length} total`} />
        <LightKpiCard label="Configured" value={String(configuredCount)} accent={ACCENT} sub="ready to activate" />
        <LightKpiCard label="Records Synced (24h)" value={totalRecords >= 1000000 ? `${(totalRecords / 1000000).toFixed(1)}M` : `${(totalRecords / 1000).toFixed(0)}K`} accent={ACCENT} />
        <LightKpiCard label="Uptime (30d)" value="99.97%" accent={ACCENT} />
      </div>

      {/* Architecture Diagram */}
      <LightSectionCard title="DATA FLOW ARCHITECTURE">
        <div className="flex gap-0 overflow-x-auto pb-2">
          {FLOW_LAYERS.map((layer, li) => (
            <div key={layer.label} className="flex items-center flex-1 min-w-[140px]">
              <div className="flex-1 flex flex-col gap-2 p-3 rounded-lg"
                style={{ background: `${layer.color}0A`, border: `1px solid ${layer.color}30` }}>
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-center"
                  style={{ color: layer.color }}>
                  {layer.label}
                </div>
                {layer.items.map(item => (
                  <div key={item} className="text-[10px] font-mono text-center py-1 rounded"
                    style={{ background: `${layer.color}12`, color: 'var(--pl-text)' }}>
                    {item}
                  </div>
                ))}
              </div>
              {li < FLOW_LAYERS.length - 1 && (
                <div className="flex-shrink-0 px-1.5 text-lg font-bold" style={{ color: ACCENT }}>&rarr;</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-lg text-[10px] font-mono"
          style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20`, color: 'var(--pl-text-muted)' }}>
          All data flows through the Integration Hub — a centralized API gateway with schema validation, rate limiting, and full audit trail. Source systems push via webhooks or scheduled ETL; outbound systems pull via REST/GraphQL or receive event-driven pushes.
        </div>
      </LightSectionCard>

      {/* Filter Bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button onClick={() => setFilter('all')}
          className="px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider transition-colors"
          style={{
            background: filter === 'all' ? `${ACCENT}18` : 'var(--pl-card-alt)',
            color: filter === 'all' ? ACCENT : 'var(--pl-text-muted)',
            border: `1px solid ${filter === 'all' ? ACCENT : 'var(--pl-border)'}`,
          }}>
          All ({CONNECTORS.length})
        </button>
        {CATEGORY_ORDER.map(cat => {
          const count = CONNECTORS.filter(c => c.category === cat).length;
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider transition-colors whitespace-nowrap"
              style={{
                background: filter === cat ? `${ACCENT}18` : 'var(--pl-card-alt)',
                color: filter === cat ? ACCENT : 'var(--pl-text-muted)',
                border: `1px solid ${filter === cat ? ACCENT : 'var(--pl-border)'}`,
              }}>
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Connector Cards */}
      {grouped.map(group => (
        <LightSectionCard key={group.category} title={CATEGORY_LABELS[group.category]?.toUpperCase() ?? group.category.toUpperCase()}>
          <div className="grid gap-3">
            {group.connectors.map(conn => {
              const s = STATUS_STYLES[conn.status];
              return (
                <div key={conn.name} className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[60px]">
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    <span className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
                      {DIRECTION_LABELS[conn.direction]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{conn.name}</span>
                      {conn.records && (
                        <span className="text-xs font-bold font-mono" style={{ color: ACCENT }}>
                          {conn.records >= 1000000
                            ? `${(conn.records / 1000000).toFixed(1)}M`
                            : conn.records >= 1000
                              ? `${(conn.records / 1000).toFixed(0)}K`
                              : String(conn.records)} records
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{conn.description}</div>
                    {conn.lastSync && (
                      <div className="text-[9px] font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>Last sync: {conn.lastSync}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </LightSectionCard>
      ))}

      {/* Sync Activity Log */}
      <LightSectionCard title="SYNC ACTIVITY LOG — TODAY">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Time', 'Source', 'Event', 'Records', 'Status'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-[10px] uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SYNC_EVENTS.map((evt, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{evt.time}</td>
                  <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{evt.source}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{evt.event}</td>
                  <td className="py-1.5 pr-4 text-right" style={{ color: ACCENT }}>{evt.records.toLocaleString()}</td>
                  <td className="py-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={{
                        background: evt.status === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                        color: evt.status === 'success' ? '#22C55E' : '#F59E0B',
                      }}>
                      {evt.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* API Health */}
      <LightSectionCard title="API HEALTH — LAST 24H">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Endpoint', 'Calls', 'Avg Latency', 'Error Rate'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-[10px] uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {API_METRICS.map((api, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                  <td className="py-1.5 pr-4 font-bold" style={{ color: ACCENT }}>{api.endpoint}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text)' }}>{api.calls24h.toLocaleString()}</td>
                  <td className="py-1.5 pr-4" style={{ color: api.avgMs < 100 ? '#22C55E' : api.avgMs < 500 ? '#F59E0B' : '#F87171' }}>
                    {api.avgMs}ms
                  </td>
                  <td className="py-1.5">
                    <span style={{ color: api.errorRate === 0 ? '#22C55E' : api.errorRate < 0.1 ? '#F59E0B' : '#F87171' }}>
                      {api.errorRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#22C55E' }}>25,520</div>
            <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Total API Calls (24h)</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#22C55E' }}>67ms</div>
            <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Avg Response Time</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#22C55E' }}>0.03%</div>
            <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Error Rate</div>
          </div>
        </div>
      </LightSectionCard>
    </>
  );
}
