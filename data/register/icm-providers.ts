/* ICM (Incentive Compensation Management) provider catalog.
   REGISTER is ICM-agnostic — this catalog drives the global provider
   selector. Each page swaps its copy + endpoints based on selection. */

export type IcmProviderId =
  | 'varicent' | 'captivateiq' | 'xactly' | 'spiff' | 'performio'
  | 'sap-commissions' | 'everstage' | 'anaplan' | 'custom';

export interface IcmProvider {
  id: IcmProviderId;
  name: string;
  shortName: string;
  color: string;
  /** API endpoint host used in demo streaming log */
  endpointHost: string;
  /** Protocol shown in publish fan-out */
  protocol: string;
  /** Round-trip latency for publish demo */
  avgLatencyMs: number;
  /** One-line positioning for the provider card */
  positioning: string;
  /** Integration modality — shown in D365 integration flow */
  syncMode: string;
}

export const ICM_PROVIDERS: IcmProvider[] = [
  {
    id: 'varicent',
    name: 'Varicent',
    shortName: 'Varicent',
    color: '#3B82F6',
    endpointHost: 'api.varicent.com',
    protocol: 'REST + Signed Webhook',
    avgLatencyMs: 1200,
    positioning: 'Enterprise ICM — deep payroll integration',
    syncMode: 'Daily batch + push updates',
  },
  {
    id: 'captivateiq',
    name: 'CaptivateIQ',
    shortName: 'CaptivateIQ',
    color: '#A855F7',
    endpointHost: 'api.captivateiq.com',
    protocol: 'REST + GraphQL',
    avgLatencyMs: 800,
    positioning: 'Modern ICM — spreadsheet-first, built for RevOps',
    syncMode: 'Real-time + scheduled',
  },
  {
    id: 'xactly',
    name: 'Xactly Incent',
    shortName: 'Xactly',
    color: '#F97316',
    endpointHost: 'api.xactlycorp.com',
    protocol: 'REST + SOAP',
    avgLatencyMs: 1400,
    positioning: 'Established ICM — SPM Insights + benchmarking',
    syncMode: 'Batch + near-real-time',
  },
  {
    id: 'spiff',
    name: 'Spiff',
    shortName: 'Spiff',
    color: '#EC4899',
    endpointHost: 'api.spiff.com',
    protocol: 'REST',
    avgLatencyMs: 600,
    positioning: 'Salesforce-native ICM — designer-friendly',
    syncMode: 'Event-driven via Salesforce',
  },
  {
    id: 'performio',
    name: 'Performio',
    shortName: 'Performio',
    color: '#06B6D4',
    endpointHost: 'api.performio.co',
    protocol: 'REST + CSV batch',
    avgLatencyMs: 1100,
    positioning: 'Mid-market ICM — strong reporting library',
    syncMode: 'Scheduled batch',
  },
  {
    id: 'sap-commissions',
    name: 'SAP Commissions',
    shortName: 'SAP Comm.',
    color: '#0F172A',
    endpointHost: 'api.sapcommissions.com',
    protocol: 'OData + REST',
    avgLatencyMs: 1800,
    positioning: 'Enterprise ICM — tightly integrated with SAP ERP',
    syncMode: 'OData near-real-time',
  },
  {
    id: 'everstage',
    name: 'Everstage',
    shortName: 'Everstage',
    color: '#10B981',
    endpointHost: 'api.everstage.com',
    protocol: 'REST + Webhooks',
    avgLatencyMs: 700,
    positioning: 'AI-first ICM — no-code plan designer',
    syncMode: 'Real-time',
  },
  {
    id: 'anaplan',
    name: 'Anaplan ICM',
    shortName: 'Anaplan',
    color: '#14B8A6',
    endpointHost: 'api.anaplan.com',
    protocol: 'REST + Connected Planning',
    avgLatencyMs: 1600,
    positioning: 'Connected Planning — deep plan modeling',
    syncMode: 'Batch sync',
  },
  {
    id: 'custom',
    name: 'Custom / In-house',
    shortName: 'Custom',
    color: '#64748B',
    endpointHost: 'icm.internal',
    protocol: 'Tenant-defined',
    avgLatencyMs: 1000,
    positioning: 'Homegrown ICM — REGISTER acts as the design layer on top',
    syncMode: 'Configurable',
  },
];

export const DEFAULT_ICM_ID: IcmProviderId = 'varicent';

export function getIcm(id: IcmProviderId | string | null | undefined): IcmProvider {
  return ICM_PROVIDERS.find((p) => p.id === id) ?? ICM_PROVIDERS[0];
}
