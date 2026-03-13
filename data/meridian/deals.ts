/* ═══════════════════════════════════════════════════════
   MERIDIAN — Deal Pipeline & Due Diligence
   ═══════════════════════════════════════════════════════ */

export type DealStage = 'Screening' | 'Initial DD' | 'Deep DD' | 'IC Review' | 'LOI / Exclusivity' | 'Signed' | 'Closed' | 'Passed';

export interface Deal {
  id: string;
  name: string;
  sector: string;
  subSector: string;
  stage: DealStage;
  ev: number; // enterprise value
  evEbitda: number;
  revenue: number;
  ebitda: number;
  ebitdaMargin: number;
  revenueGrowth: number;
  equityCheck: number;
  leverage: number; // turns of EBITDA
  source: 'Proprietary' | 'Auction' | 'Bank Process' | 'Relationship';
  dealLead: string;
  dateEntered: string;
  targetClose?: string;
  probability: number;
  thesis: string;
  risks: string[];
}

export const PIPELINE: Deal[] = [
  {
    id: 'GPC-IV-D01',
    name: 'MedVista Health Partners',
    sector: 'Healthcare',
    subSector: 'Physician Practice Management',
    stage: 'LOI / Exclusivity',
    ev: 480_000_000,
    evEbitda: 12.5,
    revenue: 320_000_000,
    ebitda: 38_400_000,
    ebitdaMargin: 0.12,
    revenueGrowth: 0.18,
    equityCheck: 285_000_000,
    leverage: 5.1,
    source: 'Proprietary',
    dealLead: 'Victoria Chen',
    dateEntered: '2025-09-15',
    targetClose: '2026-04-30',
    probability: 0.75,
    thesis: 'Platform acquisition for multi-specialty physician practice roll-up. 14 bolt-on targets identified in Southeast corridor.',
    risks: ['Physician retention post-close', 'Payor mix concentration (UHC 38%)', 'Integration complexity across 6 states'],
  },
  {
    id: 'GPC-IV-D02',
    name: 'Apex Industrial Sensors',
    sector: 'Industrial Tech',
    subSector: 'IoT / Automation',
    stage: 'Deep DD',
    ev: 340_000_000,
    evEbitda: 14.2,
    revenue: 180_000_000,
    ebitda: 23_900_000,
    ebitdaMargin: 0.133,
    revenueGrowth: 0.24,
    equityCheck: 210_000_000,
    leverage: 5.4,
    source: 'Bank Process',
    dealLead: 'Marcus Webb',
    dateEntered: '2025-11-01',
    targetClose: '2026-06-15',
    probability: 0.45,
    thesis: 'Corporate carve-out from Fortune 200 conglomerate. Complexity discount (~2x turns below comps). Strong IP moat.',
    risks: ['TSA dependency for 18 months', 'Customer concentration (top 3 = 52%)', 'Capex cycle timing'],
  },
  {
    id: 'GPC-IV-D03',
    name: 'Pinnacle Insurance Group',
    sector: 'Financial Services',
    subSector: 'Insurance Brokerage',
    stage: 'IC Review',
    ev: 620_000_000,
    evEbitda: 16.8,
    revenue: 245_000_000,
    ebitda: 36_900_000,
    ebitdaMargin: 0.151,
    revenueGrowth: 0.12,
    equityCheck: 350_000_000,
    leverage: 7.3,
    source: 'Relationship',
    dealLead: 'James Hartwell',
    dateEntered: '2025-10-20',
    targetClose: '2026-05-30',
    probability: 0.60,
    thesis: 'P&C and employee benefits brokerage with 94% revenue retention. 8 tuck-in targets in Midwest.',
    risks: ['High leverage at entry', 'Regulatory changes in insurance distribution', 'Key producer concentration'],
  },
  {
    id: 'GPC-IV-D04',
    name: 'TerraData Analytics',
    sector: 'Technology',
    subSector: 'Data & Analytics',
    stage: 'Initial DD',
    ev: 275_000_000,
    evEbitda: 18.3,
    revenue: 95_000_000,
    ebitda: 15_000_000,
    ebitdaMargin: 0.158,
    revenueGrowth: 0.32,
    equityCheck: 175_000_000,
    leverage: 6.7,
    source: 'Auction',
    dealLead: 'Sarah Kim',
    dateEntered: '2026-01-10',
    probability: 0.30,
    thesis: 'Vertical SaaS for energy sector analytics. 140% NDR, 87% gross margins. Cross-sell opportunity with existing portfolio.',
    risks: ['Customer size (avg ACV $180K)', 'Competitive intensity from hyperscalers', 'Founder transition risk'],
  },
  {
    id: 'GPC-IV-D05',
    name: 'Horizon Logistics',
    sector: 'Industrials',
    subSector: 'Supply Chain / Logistics',
    stage: 'Screening',
    ev: 190_000_000,
    evEbitda: 9.5,
    revenue: 420_000_000,
    ebitda: 20_000_000,
    ebitdaMargin: 0.048,
    revenueGrowth: 0.08,
    equityCheck: 120_000_000,
    leverage: 3.5,
    source: 'Proprietary',
    dealLead: 'Marcus Webb',
    dateEntered: '2026-02-01',
    probability: 0.15,
    thesis: 'Asset-light 3PL with cold chain specialization. Margin expansion through tech-enabled routing and warehouse automation.',
    risks: ['Low margins require significant operating improvement', 'Driver market tightness', 'Customer churn in spot market'],
  },
  {
    id: 'GPC-IV-D06',
    name: 'ClearView Wealth Management',
    sector: 'Financial Services',
    subSector: 'Wealth Management',
    stage: 'Screening',
    ev: 510_000_000,
    evEbitda: 15.0,
    revenue: 198_000_000,
    ebitda: 34_000_000,
    ebitdaMargin: 0.172,
    revenueGrowth: 0.14,
    equityCheck: 300_000_000,
    leverage: 6.2,
    source: 'Bank Process',
    dealLead: 'James Hartwell',
    dateEntered: '2026-02-15',
    probability: 0.20,
    thesis: 'RIA aggregator with $18B AUM. Fee-based recurring revenue. Advisor succession pipeline creates organic growth.',
    risks: ['AUM sensitivity to market drawdowns', 'Advisor retention post-acquisition', 'Regulatory scrutiny on RIA consolidation'],
  },
];

export const SECTOR_ALLOCATION = [
  { sector: 'Healthcare Services', deployed: 680, target: 800, pct: 0.35, color: '#10B981' },
  { sector: 'Industrial Tech', deployed: 420, target: 500, pct: 0.22, color: '#3B82F6' },
  { sector: 'Financial Services', deployed: 380, target: 550, pct: 0.20, color: '#8B5CF6' },
  { sector: 'Technology', deployed: 290, target: 400, pct: 0.15, color: '#F59E0B' },
  { sector: 'Industrials', deployed: 155, target: 250, pct: 0.08, color: '#EF4444' },
];

export const DD_CHECKLIST = [
  { category: 'Financial', items: ['Quality of earnings', 'Working capital analysis', 'Tax structure review', 'Debt capacity assessment'], weight: 0.25 },
  { category: 'Commercial', items: ['Customer diligence calls (20+)', 'Market sizing & TAM', 'Competitive positioning', 'Pricing power analysis'], weight: 0.20 },
  { category: 'Operations', items: ['Management assessment', 'IT infrastructure', 'Supply chain resilience', 'Capex requirements'], weight: 0.20 },
  { category: 'Legal & Regulatory', items: ['Material contracts review', 'IP & patents', 'Regulatory compliance', 'Litigation review'], weight: 0.15 },
  { category: 'ESG & HR', items: ['Employee satisfaction', 'DEI metrics', 'Environmental compliance', 'Key person dependencies'], weight: 0.10 },
  { category: 'Integration', items: ['100-day plan', 'Synergy identification', 'Technology integration', 'Culture assessment'], weight: 0.10 },
];
