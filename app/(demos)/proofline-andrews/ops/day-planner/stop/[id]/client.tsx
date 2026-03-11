'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ActNavigation, DataSourceBadge } from '@/components/demos/proofline';
import { getStopById, DAY_PLANS, type Stop } from '@/data/proofline';
import { fmt } from '@/lib/utils';

/* ── OOS Alert Data ────────────────────────────── */
const OOS_ALERTS = [
  { product: 'Miller Lite 24pk', shelf: true, facings: 0, lastDelivery: 'Mar 5', priority: 'high' as const },
  { product: 'Blue Moon 6pk', shelf: true, facings: 0, lastDelivery: 'Mar 3', priority: 'medium' as const },
];

/* -- Stop type colors -- */
const STOP_COLORS: Record<string, string> = {
  'load-out': '#C6A052', 'key-account': '#2563EB', 'chain-drop': '#7C3AED',
  'presell': '#7C3AED', 'new-account': '#0891B2', 'compliance': '#EF4444',
  'problem-resolution': '#F97316', 'presell-spirits': '#A855F7',
  'merchandising': '#10B981', 'drive-by': '#6B7280', 'windshield': '#6B7280', 'return': '#C6A052',
};

export default function StopDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const stop = getStopById(id);
  const [tab, setTab] = useState<'visit' | 'history' | 'intel'>('visit');

  const plan = DAY_PLANS.find(p => p.stops.some(s => s.id === id));

  if (!stop || !plan) {
    return (
      <>
        <div className="text-center py-20">
          <h1 className="text-xl font-bold" style={{ color: 'var(--pl-text)' }}>Stop not found</h1>
          <Link href="/proofline-andrews/ops/day-planner" className="text-[13px] font-semibold mt-2 block" style={{ color: '#2563EB' }}>
            Back to Day Planner
          </Link>
        </div>
      </>
    );
  }

  const color = STOP_COLORS[stop.type] ?? '#6B7280';
  const totalCases = stop.deliveryManifest.reduce((s, m) => s + m.cases, 0);
  const prevStop = plan.stops.find(s => s.sequence === stop.sequence - 1);
  const nextStop = plan.stops.find(s => s.sequence === stop.sequence + 1);

  return (
    <>
      <ActNavigation currentAct={3} />

      {/* Breadcrumb */}
      <div className="mt-4 flex items-center gap-2 mb-4">
        <Link href="/proofline-andrews/ops/day-planner" className="text-[13px] font-mono hover:underline" style={{ color: '#2563EB' }}>
          Day Planner
        </Link>
        <span className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>/</span>
        <span className="text-[13px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{plan.repName} &mdash; {plan.route}</span>
        <span className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>/</span>
        <span className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Stop {stop.sequence}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: `${color}20`, color }}
            >
              {stop.sequence}
            </span>
            <span
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: `${color}20`, color }}
            >
              {stop.type.replace(/-/g, ' ')}
            </span>
            {stop.tabcStatus && (
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  background: stop.tabcStatus === 'verified' ? 'rgba(34,197,94,0.1)' :
                    stop.tabcStatus === 'expiring' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                  color: stop.tabcStatus === 'verified' ? '#22C55E' :
                    stop.tabcStatus === 'expiring' ? '#F59E0B' : '#EF4444',
                }}
              >
                TABC {stop.tabcStatus}
              </span>
            )}
            {stop.photoRequired && (
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                Photo Required
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
            {stop.accountName}
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>{stop.address}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Arrival</div>
          <div className="text-xl font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{stop.arrivalTime}</div>
          <div className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>{stop.duration} min &middot; {stop.contactName}</div>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Cases', value: fmt(totalCases), color: '#C6A052' },
          { label: 'Revenue', value: `$${fmt(stop.revenueOpportunity)}`, color: '#22C55E' },
          { label: 'SKUs', value: String(stop.deliveryManifest.length), color: '#2563EB' },
          { label: 'AI Insights', value: String(stop.aiInsights.length), color: '#A855F7' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-lg border p-3" style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
            <div className="text-xs uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-faint)' }}>{kpi.label}</div>
            <div className="text-lg font-bold font-mono mt-1" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-4">
        {([
          { id: 'visit' as const, label: 'Visit Plan' },
          { id: 'history' as const, label: 'Account History' },
          { id: 'intel' as const, label: 'Intelligence' },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="text-[12px] font-mono px-4 py-2 rounded-lg transition-colors"
            style={{
              background: tab === t.id ? '#2563EB' : 'var(--pl-chart-bar-track)',
              color: tab === t.id ? 'white' : 'var(--pl-text-muted)',
              fontWeight: tab === t.id ? 700 : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Visit Plan Tab */}
      {tab === 'visit' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-5" style={{ background: 'var(--pl-card)', border: '1px solid var(--pl-border)' }}>
            <div className="text-xs uppercase tracking-wider font-mono mb-3" style={{ color: 'var(--pl-text-faint)' }}>
              Delivery Manifest &mdash; {totalCases} cases, {stop.deliveryManifest.length} SKUs
            </div>
            <div className="space-y-1">
              {stop.deliveryManifest.map(item => (
                <div key={item.sku} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--pl-border)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px]" style={{ color: 'var(--pl-text)' }}>{item.brand}</span>
                    {item.promo && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>{item.promo}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[13px] font-mono">
                    <span style={{ color: 'var(--pl-text-faint)' }}>{item.sku}</span>
                    <span className="font-bold w-10 text-right" style={{ color: 'var(--pl-text)' }}>{item.cases}cs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* OOS Alerts */}
            {OOS_ALERTS.length > 0 && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: '#F87171' }}>
                  OOS Alerts ({OOS_ALERTS.length})
                </div>
                {OOS_ALERTS.map((alert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 mb-2 rounded-lg"
                    style={{
                      background: 'rgba(248,113,113,0.06)',
                      border: '1px solid rgba(248,113,113,0.2)',
                    }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>!</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold" style={{ color: 'var(--pl-text)' }}>
                        OOS: {alert.product}
                      </div>
                      <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                        Shelf tag present, {alert.facings} facings &middot; Last delivery: {alert.lastDelivery}
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold uppercase px-2 py-0.5 rounded"
                      style={{
                        background: alert.priority === 'high' ? 'rgba(248,113,113,0.15)' : 'rgba(245,158,11,0.15)',
                        color: alert.priority === 'high' ? '#F87171' : '#F59E0B',
                      }}
                    >
                      {alert.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl p-5" style={{ background: 'var(--pl-card)', border: '1px solid var(--pl-border)' }}>
              <div className="text-xs uppercase tracking-wider font-mono mb-3" style={{ color: 'var(--pl-text-faint)' }}>Talking Points</div>
              <ul className="space-y-2">
                {stop.talkingPoints.map((tp, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: 'var(--pl-text-secondary)' }}>
                    <span className="text-[#C6A052] mt-0.5 shrink-0">&bull;</span>
                    <span className="leading-snug">{tp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {stop.displayInstructions && (
              <div className="rounded-xl p-5" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
                <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: '#2563EB' }}>Display Instructions</div>
                <div className="text-[12px] leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>{stop.displayInstructions}</div>
                {stop.photoRequired && (
                  <button className="mt-3 text-[13px] font-bold px-4 py-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(37,99,235,0.2)', color: '#2563EB' }}>
                    Capture Photo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account History Tab */}
      {tab === 'history' && (
        <div className="rounded-xl p-5" style={{ background: 'var(--pl-card)', border: '1px solid var(--pl-border)' }}>
          <div className="text-xs uppercase tracking-wider font-mono mb-4" style={{ color: 'var(--pl-text-faint)' }}>Last 12 Visits</div>
          <div className="space-y-0">
            {[
              { date: 'Feb 25', cases: 128, rev: 15400, type: 'Delivery', note: 'Standard. Corona facing at 8.' },
              { date: 'Feb 18', cases: 134, rev: 16100, type: 'Delivery', note: 'Added Modelo Negra. Spirits inquiry.' },
              { date: 'Feb 11', cases: 121, rev: 14500, type: 'Delivery', note: 'Corona short 12cs \u2014 resolved same day.' },
              { date: 'Feb 4', cases: 115, rev: 13800, type: 'Delivery', note: 'Pacifico trial 6cs \u2014 sold through in 5 days.' },
              { date: 'Jan 28', cases: 130, rev: 15600, type: 'Delivery', note: 'Blue Moon seasonal endcap installed.' },
              { date: 'Jan 21', cases: 112, rev: 13400, type: 'Delivery', note: 'Regular delivery. All placements verified.' },
              { date: 'Jan 14', cases: 118, rev: 14200, type: 'Presell', note: 'Presell visit \u2014 Cinco de Mayo planning with Robert.' },
              { date: 'Jan 7', cases: 125, rev: 15000, type: 'Delivery', note: 'New Year reset complete.' },
              { date: 'Dec 31', cases: 142, rev: 17000, type: 'Delivery', note: 'Holiday surge. Fireball +40%.' },
              { date: 'Dec 24', cases: 155, rev: 18600, type: 'Delivery', note: 'Christmas Eve \u2014 max load.' },
              { date: 'Dec 17', cases: 138, rev: 16500, type: 'Delivery', note: 'Holiday build. Buffalo Trace sold through.' },
              { date: 'Dec 10', cases: 120, rev: 14400, type: 'Delivery', note: 'Standard. Began spirits section expansion.' },
            ].map((visit, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b" style={{ borderColor: 'var(--pl-border)' }}>
                <span className="text-xs font-mono w-14 shrink-0" style={{ color: 'var(--pl-text-faint)' }}>{visit.date}</span>
                <span
                  className="text-xs font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: visit.type === 'Presell' ? 'rgba(184,115,51,0.1)' : 'rgba(37,99,235,0.1)',
                    color: visit.type === 'Presell' ? '#7C3AED' : '#2563EB',
                  }}
                >
                  {visit.type}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-[13px] font-mono">
                    <span style={{ color: 'var(--pl-text-secondary)' }}>{visit.cases}cs</span>
                    <span style={{ color: '#22C55E' }}>${fmt(visit.rev)}</span>
                  </div>
                  <div className="text-[13px] mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>{visit.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intelligence Tab */}
      {tab === 'intel' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-5" style={{ background: 'var(--pl-card)', border: '1px solid var(--pl-border)' }}>
            <div className="text-xs uppercase tracking-wider font-mono mb-3" style={{ color: 'var(--pl-text-faint)' }}>AI Insights</div>
            <div className="space-y-3">
              {stop.aiInsights.map((insight, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3"
                  style={{
                    background: insight.priority === 'high' ? 'rgba(239,68,68,0.06)' :
                      insight.priority === 'medium' ? 'rgba(245,158,11,0.06)' : 'rgba(34,197,94,0.06)',
                    borderLeft: `2px solid ${
                      insight.priority === 'high' ? '#EF4444' : insight.priority === 'medium' ? '#F59E0B' : '#22C55E'
                    }`,
                  }}
                >
                  <div className="text-[12px] leading-snug" style={{ color: 'var(--pl-text-secondary)' }}>{insight.insight}</div>
                  <div className="mt-2"><DataSourceBadge source={insight.source} synced="2m ago" /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {stop.competitiveIntel && (
              <div className="rounded-xl p-5" style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)' }}>
                <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: '#A855F7' }}>Competitive Intel</div>
                <div className="text-[12px] leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>{stop.competitiveIntel}</div>
              </div>
            )}

            {stop.tabcStatus && (
              <div className="rounded-xl p-5" style={{ background: 'var(--pl-card)', border: '1px solid var(--pl-border)' }}>
                <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>TABC Compliance</div>
                <div className="flex items-center gap-2 text-[13px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: stop.tabcStatus === 'verified' ? '#22C55E' :
                        stop.tabcStatus === 'expiring' ? '#F59E0B' : '#EF4444',
                    }}
                  />
                  <span className="font-semibold capitalize" style={{ color: 'var(--pl-text)' }}>{stop.tabcStatus}</span>
                </div>
                <div className="text-[13px] mt-2" style={{ color: 'var(--pl-text-faint)' }}>
                  License verified against TABC database. Next audit scheduled March 15.
                </div>
              </div>
            )}

            <div className="rounded-xl p-5" style={{ background: 'var(--pl-card)', border: '1px solid var(--pl-border)' }}>
              <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>Contact</div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--pl-text)' }}>{stop.contactName}</div>
              <div className="text-[13px] font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>{stop.contactPhone}</div>
            </div>
          </div>
        </div>
      )}

      {/* Prev/Next Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--pl-border)' }}>
        {prevStop ? (
          <Link
            href={`/proofline-andrews/ops/day-planner/stop/${prevStop.id}`}
            className="text-[13px] font-mono px-3 py-1.5 rounded-lg border hover:opacity-80 transition-colors"
            style={{ borderColor: 'var(--pl-border)', color: 'var(--pl-text-secondary)' }}
          >
            &larr; Stop {prevStop.sequence}: {prevStop.accountName.split(' \u2014 ')[0].split(' #')[0]}
          </Link>
        ) : <div />}
        {nextStop ? (
          <Link
            href={`/proofline-andrews/ops/day-planner/stop/${nextStop.id}`}
            className="text-[13px] font-mono px-3 py-1.5 rounded-lg border hover:opacity-80 transition-colors"
            style={{ borderColor: 'var(--pl-border)', color: 'var(--pl-text-secondary)' }}
          >
            Stop {nextStop.sequence}: {nextStop.accountName.split(' \u2014 ')[0].split(' #')[0]} &rarr;
          </Link>
        ) : <div />}
      </div>
    </>
  );
}
