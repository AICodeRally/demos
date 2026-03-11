'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';

const ACCENT = '#0EA5E9';

const FEEDS = [
  { name: 'Orders', source: 'SAP ERP', records: 48200, lastSync: '2h ago', health: 'Healthy' },
  { name: 'Accounts', source: 'Salesforce CRM', records: 4847, lastSync: '6h ago', health: 'Healthy' },
  { name: 'Roster', source: 'ADP HR', records: 36, lastSync: '24h ago', health: 'Healthy' },
  { name: 'Territories', source: 'Internal', records: 6, lastSync: 'Weekly', health: 'Healthy' },
];

const PIPELINE_STEPS = ['Source', 'Validate', 'Stage', 'Load'];

const PRODUCT_HIERARCHY = [
  { brand: 'Coors Light', category: 'Domestic Beer', supplierGroup: 'Molson Coors', gate: 'Core' },
  { brand: 'Miller Lite', category: 'Domestic Beer', supplierGroup: 'Molson Coors', gate: 'Core' },
  { brand: 'Blue Moon', category: 'Craft Beer', supplierGroup: 'Molson Coors', gate: 'Emerging' },
  { brand: 'Corona Extra', category: 'Import Beer', supplierGroup: 'Constellation', gate: 'Import' },
  { brand: 'Modelo Especial', category: 'Import Beer', supplierGroup: 'Constellation', gate: 'Import' },
  { brand: 'Heineken', category: 'Import Beer', supplierGroup: 'Heineken', gate: 'Import' },
  { brand: 'Dos Equis', category: 'Import Beer', supplierGroup: 'Heineken', gate: 'Import' },
  { brand: "Tito's Vodka", category: 'Spirits', supplierGroup: 'Fifth Generation', gate: 'Emerging' },
  { brand: 'High Noon', category: 'FMB/Seltzer', supplierGroup: 'E&J Gallo', gate: 'Emerging' },
  { brand: 'White Claw', category: 'FMB/Seltzer', supplierGroup: 'Mark Anthony', gate: 'Emerging' },
];

const ACCOUNT_DIST = [
  { type: 'On-Premise Chain', count: 812, pct: 16.8 },
  { type: 'On-Premise Independent', count: 1204, pct: 24.8 },
  { type: 'Off-Premise Chain', count: 1621, pct: 33.4 },
  { type: 'Off-Premise Independent', count: 1210, pct: 25.0 },
];

const CREDIT_RULES = [
  { rule: 'Primary Rep', description: 'Single rep owns account — 100% credit', frequency: 'Most common' },
  { rule: 'Split Credit', description: 'Two reps share account — 50/50 default, adjustable', frequency: 'Multi-route accounts' },
  { rule: 'Territory Overlap', description: 'Route boundary conflict — resolved by seniority + volume', frequency: 'Rare, ~2% of txns' },
  { rule: 'New Rep Proration', description: 'Mid-period hire — credit prorated to start date', frequency: 'Hire events' },
];

const TRANSACTIONS = [
  { date: 'Mar 8', account: 'HEB Kirby', product: 'Coors Light 24pk', cases: 48, revenue: 1296, rep: 'Marcus Webb', rule: 'Primary', confidence: 99 },
  { date: 'Mar 8', account: 'Total Wine 183', product: 'Corona Extra 12pk', cases: 72, revenue: 2160, rep: 'Sofia Reyes', rule: 'Primary', confidence: 99 },
  { date: 'Mar 7', account: 'Whataburger Loop 410', product: 'Bud Light Lime 6pk', cases: 24, revenue: 576, rep: 'James Park / Kenji Morales', rule: 'Split', confidence: 94 },
  { date: 'Mar 7', account: 'Central Market Bev', product: 'High Noon Variety', cases: 36, revenue: 1188, rep: 'Elena Vargas', rule: 'Primary', confidence: 99 },
  { date: 'Mar 7', account: 'Q Sports Bar Downtown', product: 'Modelo Especial Draft', cases: 18, revenue: 594, rep: 'Diego Santos', rule: 'Primary', confidence: 98 },
  { date: 'Mar 6', account: 'Costco 290', product: 'Heineken 24pk', cases: 120, revenue: 3960, rep: 'Priya Nair', rule: 'Primary', confidence: 99 },
  { date: 'Mar 6', account: "Spec's Bandera", product: "Tito's Vodka 1.75L", cases: 30, revenue: 2250, rep: 'Raj Patel', rule: 'Primary', confidence: 99 },
  { date: 'Mar 6', account: 'Twin Peaks Bitters', product: 'White Claw 12pk', cases: 24, revenue: 696, rep: 'Ana Lima / Carlos Reyes', rule: 'Split', confidence: 91 },
  { date: 'Mar 5', account: 'Fiesta Mart Austin', product: 'Coors Banquet 18pk', cases: 60, revenue: 1560, rep: 'Marcus Webb', rule: 'Primary', confidence: 99 },
  { date: 'Mar 5', account: 'Aloft Hotel SAT', product: 'Blue Moon 6pk', cases: 12, revenue: 384, rep: 'Kenji Morales', rule: 'Primary', confidence: 97 },
  { date: 'Mar 5', account: 'Kroger IH-35', product: 'Dos Equis Lager 24pk', cases: 84, revenue: 2352, rep: 'Sofia Reyes', rule: 'Primary', confidence: 99 },
  { date: 'Mar 4', account: "Chili's Nacogdoches", product: 'Dos Equis Amber Draft', cases: 8, revenue: 280, rep: 'Diego Santos / Ana Lima', rule: 'Split', confidence: 88 },
  { date: 'Mar 4', account: 'H-E-B Plus Laredo', product: 'Miller Lite 30pk', cases: 96, revenue: 2688, rep: 'Carlos Reyes', rule: 'Primary', confidence: 99 },
  { date: 'Mar 3', account: 'Walmart Supercenter 78', product: 'Corona Light 12pk', cases: 108, revenue: 3024, rep: 'Priya Nair', rule: 'Primary', confidence: 99 },
  { date: 'Mar 3', account: "Rudy's BBQ Leon Springs", product: 'Shiner Bock Draft', cases: 20, revenue: 620, rep: 'Elena Vargas', rule: 'Primary', confidence: 98 },
];

const GATE_COLORS: Record<string, string> = {
  Core: '#2563EB',
  Import: '#7C3AED',
  Emerging: '#F59E0B',
};

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<'ingestion' | 'classification' | 'crediting'>('ingestion');

  const tabs = [
    { key: 'ingestion', label: 'Ingestion' },
    { key: 'classification', label: 'Classification' },
    { key: 'crediting', label: 'Crediting' },
  ] as const;

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Tab Bar */}
      <div className="flex gap-0 border-b mb-6" style={{ borderColor: 'var(--pl-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
            style={{
              color: activeTab === t.key ? ACCENT : 'var(--pl-text-muted)',
              borderBottom: activeTab === t.key ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -1,
              background: 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Ingestion Tab */}
      {activeTab === 'ingestion' && (
        <>
          <LightSectionCard title="DATA PIPELINE">
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 min-w-[100px]">
                  <div className="flex-1 flex flex-col items-center gap-2 px-3 py-4 rounded-lg"
                    style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}30` }}>
                    <div className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                      STEP {i + 1}
                    </div>
                    <div className="text-sm font-bold" style={{ color: 'var(--pl-text)' }}>{step}</div>
                    <div className="text-xs font-mono text-center" style={{ color: 'var(--pl-text-muted)' }}>
                      {step === 'Source' && 'Pull from ERP/CRM/HR/Territories'}
                      {step === 'Validate' && 'Schema check, null guard, dedup'}
                      {step === 'Stage' && 'Normalize, enrich, classify'}
                      {step === 'Load' && 'Write to ICM ledger, trigger credits'}
                    </div>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="flex-shrink-0 px-1 text-lg font-bold" style={{ color: ACCENT }}>&rarr;</div>
                  )}
                </div>
              ))}
            </div>
          </LightSectionCard>

          <LightSectionCard title="DATA FEEDS">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FEEDS.map(feed => (
                <div key={feed.name} className="p-3 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono uppercase" style={{ color: 'var(--pl-text)' }}>{feed.name}</span>
                    <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>
                      {feed.health}
                    </span>
                  </div>
                  <div className="text-xs font-mono mb-1" style={{ color: 'var(--pl-text-muted)' }}>{feed.source}</div>
                  <div className="text-lg font-bold font-mono" style={{ color: ACCENT }}>
                    {feed.records.toLocaleString()}
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>records &middot; synced {feed.lastSync}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LightKpiCard label="Records Ingested (MTD)" value="2.4M" accent={ACCENT} />
            <LightKpiCard label="Validation Pass Rate" value="99.3%" accent={ACCENT} />
            <LightKpiCard label="Avg Processing Time" value="4.2 min" accent={ACCENT} />
            <LightKpiCard label="Error Count (MTD)" value="18" accent={ACCENT} sub="-12% vs last month" />
          </div>
        </>
      )}

      {/* Classification Tab */}
      {activeTab === 'classification' && (
        <>
          <LightSectionCard title="PRODUCT HIERARCHY">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Brand', 'Category', 'Supplier Group', 'Gate'].map(h => (
                      <th key={h} className="text-left pb-2 pr-4 text-xs uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCT_HIERARCHY.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{row.brand}</td>
                      <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{row.category}</td>
                      <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{row.supplierGroup}</td>
                      <td className="py-1.5">
                        <span className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ background: `${GATE_COLORS[row.gate]}18`, color: GATE_COLORS[row.gate] }}>
                          {row.gate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          <LightSectionCard title="ACCOUNT TYPE DISTRIBUTION — 4,847 ACCOUNTS">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ACCOUNT_DIST.map(a => (
                <div key={a.type} className="p-3 rounded-lg text-center" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="text-2xl font-bold font-mono mb-1" style={{ color: ACCENT }}>{a.count.toLocaleString()}</div>
                  <div className="text-xs font-bold font-mono mb-1" style={{ color: 'var(--pl-text)' }}>{a.type}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>{a.pct}% of accounts</div>
                  <div className="mt-2 rounded-full overflow-hidden" style={{ height: 4, background: 'var(--pl-chart-bar-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          <LightSectionCard title="TERRITORY ASSIGNMENT SUMMARY">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono" style={{ color: ACCENT }}>6</div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Hometowns</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>SA / Austin / Laredo / Victoria / Corpus Christi / New Braunfels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono" style={{ color: ACCENT }}>36</div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Routes</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>6 routes per hometown average</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono" style={{ color: ACCENT }}>36</div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Sales Reps</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>1 rep per route, no overlap</div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg text-xs font-mono" style={{ background: `${ACCENT}0A`, border: `1px solid ${ACCENT}20`, color: 'var(--pl-text-muted)' }}>
              Assignment logic: Account ZIP &rarr; Route boundary lookup &rarr; Primary rep assignment. Multi-route accounts resolved by highest historical volume rep. Territory changes take effect on the first of the following month.
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Crediting Tab */}
      {activeTab === 'crediting' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Credits Processed (MTD)" value="48,218" accent={ACCENT} />
            <LightKpiCard label="Split Credit %" value="3.1%" accent={ACCENT} />
            <LightKpiCard label="Disputed Credits" value="7" accent={ACCENT} delta={-3} />
            <LightKpiCard label="Avg Resolution Time" value="1.4 days" accent={ACCENT} />
          </div>

          <LightSectionCard title="CREDITING RULES">
            <div className="grid gap-3">
              {CREDIT_RULES.map(rule => (
                <div key={rule.rule} className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold font-mono"
                    style={{ background: `${ACCENT}18`, color: ACCENT, whiteSpace: 'nowrap' }}>
                    {rule.rule}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text)' }}>{rule.description}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>Applied: {rule.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          <LightSectionCard title="RECENT CREDIT TRANSACTIONS">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Date', 'Account', 'Product', 'Cases', 'Revenue', 'Credited Rep', 'Rule', 'Conf.'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-xs uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((tx, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{tx.date}</td>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{tx.account}</td>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{tx.product}</td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: 'var(--pl-text)' }}>{tx.cases}</td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: ACCENT }}>${tx.revenue.toLocaleString()}</td>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text)' }}>{tx.rep}</td>
                      <td className="py-1.5 pr-3">
                        <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                          style={{
                            background: tx.rule === 'Split' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                            color: tx.rule === 'Split' ? '#F59E0B' : '#22C55E',
                          }}>
                          {tx.rule}
                        </span>
                      </td>
                      <td className="py-1.5 text-right" style={{ color: tx.confidence >= 95 ? '#22C55E' : '#F59E0B' }}>{tx.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}
    </>
  );
}
