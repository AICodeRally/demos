'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ActNavigation, RouteMap, StopCard, MobilePreview, RepSelector, DataSourceBadge } from '@/components/demos/proofline';
import {
  DAY_PLANS,
  MARCUS_DAY_PLAN,
  type DayPlan,
  type Stop,
} from '@/data/proofline';
import { fmt, fmtM } from '@/lib/utils';

/* ── Detail Panel ─────────────────────────────── */
function DetailPanel({ stop }: { stop: Stop }) {
  const [tab, setTab] = useState<'plan' | 'history' | 'intel'>('plan');

  return (
    <>
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {([
          { id: 'plan' as const, label: 'Visit Plan' },
          { id: 'history' as const, label: 'History' },
          { id: 'intel' as const, label: 'Intelligence' },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="text-[13px] font-mono px-3 py-1.5 rounded-lg transition-colors"
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
      {tab === 'plan' && (
        <div className="space-y-4">
          {/* Delivery Manifest */}
          {stop.deliveryManifest.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>
                Delivery Manifest ({stop.deliveryManifest.reduce((s, m) => s + m.cases, 0)} cases)
              </div>
              <div className="space-y-1">
                {stop.deliveryManifest.map(item => (
                  <div key={item.sku} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--pl-border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px]" style={{ color: 'var(--pl-text)' }}>{item.brand}</span>
                      {item.promo && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                          {item.promo}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[13px] font-mono">
                      <span style={{ color: 'var(--pl-text-muted)' }}>{item.sku}</span>
                      <span className="font-bold" style={{ color: 'var(--pl-text)' }}>{item.cases}cs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Talking Points */}
          {stop.talkingPoints.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>Talking Points</div>
              <ul className="space-y-1.5">
                {stop.talkingPoints.map((tp, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: 'var(--pl-text-secondary)' }}>
                    <span className="text-[#C6A052] mt-0.5 shrink-0">&bull;</span>
                    <span className="leading-snug">{tp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Instructions */}
          {stop.displayInstructions && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(37,99,235,0.08)', borderLeft: '2px solid #2563EB' }}>
              <div className="text-xs uppercase tracking-wider font-mono mb-1" style={{ color: '#2563EB' }}>Display Instructions</div>
              <div className="text-[13px]" style={{ color: 'var(--pl-text-secondary)' }}>{stop.displayInstructions}</div>
              {stop.photoRequired && (
                <div className="mt-1.5 text-xs font-bold" style={{ color: '#F59E0B' }}>📸 Photo Required</div>
              )}
            </div>
          )}

          {/* Contact */}
          <div className="flex items-center gap-4 text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
            <span>Contact: <strong style={{ color: 'var(--pl-text-secondary)' }}>{stop.contactName}</strong></span>
            <span className="font-mono">{stop.contactPhone}</span>
          </div>
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div className="space-y-3">
          <div className="text-[13px] mb-3" style={{ color: 'var(--pl-text-muted)' }}>Last 4 deliveries to this account</div>
          {[
            { date: 'Feb 25', cases: 128, rev: 15400, notes: 'Standard delivery. Corona facing at 8 (target 12).' },
            { date: 'Feb 18', cases: 134, rev: 16100, notes: 'Added Modelo Negra. Robert requested spirits tasting info.' },
            { date: 'Feb 11', cases: 121, rev: 14500, notes: 'Corona short 12cs — warehouse issue. Resolved same-day.' },
            { date: 'Feb 4', cases: 115, rev: 13800, notes: 'Routine. Pacifico trial 6cs — sold through in 5 days.' },
          ].map((visit, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b" style={{ borderColor: 'var(--pl-border)' }}>
              <span className="text-xs font-mono w-14 shrink-0" style={{ color: 'var(--pl-text-faint)' }}>{visit.date}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 text-[13px]">
                  <span className="font-mono" style={{ color: 'var(--pl-text-secondary)' }}>{visit.cases}cs</span>
                  <span className="text-[#22C55E] font-mono">${fmt(visit.rev)}</span>
                </div>
                <div className="text-[13px] mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>{visit.notes}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Intelligence Tab */}
      {tab === 'intel' && (
        <div className="space-y-3">
          {/* AI Insights */}
          {stop.aiInsights.map((insight, i) => (
            <div
              key={i}
              className="rounded-lg p-3"
              style={{
                background: insight.priority === 'high' ? 'rgba(239,68,68,0.06)' :
                  insight.priority === 'medium' ? 'rgba(245,158,11,0.06)' : 'rgba(34,197,94,0.06)',
                borderLeft: `2px solid ${
                  insight.priority === 'high' ? '#EF4444' :
                    insight.priority === 'medium' ? '#F59E0B' : '#22C55E'
                }`,
              }}
            >
              <div className="text-[13px] leading-snug" style={{ color: 'var(--pl-text-secondary)' }}>{insight.insight}</div>
              <div className="mt-1.5">
                <DataSourceBadge source={insight.source} synced="2m ago" />
              </div>
            </div>
          ))}

          {/* Competitive Intel */}
          {stop.competitiveIntel && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(168,85,247,0.06)', borderLeft: '2px solid #A855F7' }}>
              <div className="text-xs uppercase tracking-wider font-mono mb-1" style={{ color: '#A855F7' }}>Competitive Intel</div>
              <div className="text-[13px]" style={{ color: 'var(--pl-text-secondary)' }}>{stop.competitiveIntel}</div>
            </div>
          )}

          {/* TABC */}
          {stop.tabcStatus && (
            <div className="flex items-center gap-2 text-[13px]">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: stop.tabcStatus === 'verified' ? '#22C55E' :
                    stop.tabcStatus === 'expiring' ? '#F59E0B' : '#EF4444',
                }}
              />
              <span style={{ color: 'var(--pl-text-muted)' }}>
                TABC: <strong style={{ color: 'var(--pl-text)' }}>{stop.tabcStatus}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}

export default function DayPlannerPage() {
  const [selectedRep, setSelectedRep] = useState(MARCUS_DAY_PLAN.repId);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [showMobile, setShowMobile] = useState(false);
  const [whatIfTab, setWhatIfTab] = useState(false);
  const [swappedPair, setSwappedPair] = useState<[number, number]>([-1, -1]);

  const plan: DayPlan = DAY_PLANS.find(p => p.repId === selectedRep) ?? MARCUS_DAY_PLAN;
  const activeStop = plan.stops.find(s => s.id === activeStopId) ?? null;

  const reps = DAY_PLANS.map(p => ({
    id: p.repId,
    name: p.repName,
    route: p.route,
    hometown: p.hometownName,
  }));

  // What-If Reorder: swap two stops to see mileage/time impact
  const handleWhatIfClick = useCallback((index: number) => {
    setSwappedPair(prev => {
      if (prev[0] === -1) return [index, -1];
      if (prev[0] === index) return [-1, -1]; // deselect
      return [prev[0], index];
    });
  }, []);

  const whatIfStops = (() => {
    const [a, b] = swappedPair;
    if (a >= 0 && b >= 0 && a < plan.stops.length && b < plan.stops.length) {
      const copy = [...plan.stops];
      [copy[a], copy[b]] = [copy[b], copy[a]];
      return copy;
    }
    return plan.stops;
  })();

  const handleStopClick = useCallback((id: string) => {
    setActiveStopId(prev => prev === id ? null : id);
  }, []);

  const handleStopHover = useCallback((id: string | null) => {
    // Hover is secondary to click on this layout
  }, []);

  // Close mobile modal on Escape
  useEffect(() => {
    if (!showMobile) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMobile(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showMobile]);

  return (
    <>

      <ActNavigation currentAct={3} />

      {/* Header Row */}
      <div className="mt-4 mb-4 flex items-start justify-between">
        <div>
          <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
            Day-in-the-Life &middot; Route Planner
          </div>
          <h1 className="text-xl font-extrabold" style={{ fontFamily: 'var(--pl-font)', color: 'var(--pl-text)' }}>
            {plan.repName} — {plan.route}
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>
            {plan.date} &middot; {plan.stops.length} stops &middot; {plan.totalMiles} miles &middot; {plan.totalDuration}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/proofline-route"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-mono font-bold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #C6A052, #a8842e)',
              color: '#0a0f1e',
              boxShadow: '0 1px 4px rgba(198,160,82,0.2)',
            }}
          >
            <span>🚚</span>
            <span>Rep Tablet</span>
          </Link>
          <div className="w-56">
            <RepSelector reps={reps} selected={selectedRep} onChange={setSelectedRep} />
          </div>
        </div>
      </div>

      {/* Optimization Badge */}
      <div
        className="rounded-lg px-4 py-2.5 mb-4 flex items-center justify-between"
        style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-bold text-[#22C55E]">Route Optimized</span>
          <span className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
            Saves <strong className="text-[#22C55E]">{plan.optimizationSavings.miles} miles</strong> and{' '}
            <strong className="text-[#22C55E]">{plan.optimizationSavings.minutes} min</strong> vs standard sequence
          </span>
        </div>
        <div className="flex items-center gap-4 text-[13px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
          <span>{plan.truckNumber}</span>
          <span>{fmt(plan.totalCases)} cases</span>
          <span className="text-[#22C55E] font-bold">${fmt(plan.totalRevenue)}</span>
        </div>
      </div>

      {/* What-If Toggle */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => { setWhatIfTab(false); setSwappedPair([-1, -1]); }}
          className="text-[13px] font-mono px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: !whatIfTab ? '#2563EB' : 'var(--pl-chart-bar-track)',
            color: !whatIfTab ? 'white' : 'var(--pl-text-muted)',
            fontWeight: !whatIfTab ? 700 : 400,
          }}
        >
          Planned Route
        </button>
        <button
          onClick={() => setWhatIfTab(true)}
          className="text-[13px] font-mono px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: whatIfTab ? '#2563EB' : 'var(--pl-chart-bar-track)',
            color: whatIfTab ? 'white' : 'var(--pl-text-muted)',
            fontWeight: whatIfTab ? 700 : 400,
          }}
        >
          What-If Reorder
        </button>
      </div>

      {/* What-If Reorder Panel */}
      {whatIfTab && (
        <div
          className="rounded-lg px-4 py-3 mb-4"
          style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)' }}
        >
          <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: '#2563EB' }}>
            Click two stops below to swap their order and see the impact
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plan.stops.map((stop, idx) => {
              const isSelected = swappedPair[0] === idx || swappedPair[1] === idx;
              return (
                <button
                  key={stop.id}
                  onClick={() => handleWhatIfClick(idx)}
                  className="text-[13px] font-mono px-2.5 py-1 rounded-lg border transition-colors"
                  style={{
                    borderColor: isSelected ? '#2563EB' : 'var(--pl-border)',
                    background: isSelected ? 'rgba(37,99,235,0.1)' : 'transparent',
                    color: isSelected ? '#2563EB' : 'var(--pl-text-muted)',
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {idx + 1}. {stop.accountName.split(' — ')[0].split(' #')[0]}
                </button>
              );
            })}
          </div>
          {swappedPair[0] >= 0 && swappedPair[1] >= 0 && (
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[13px] font-mono" style={{ color: '#2563EB' }}>
                Swapped stops {swappedPair[0] + 1} &harr; {swappedPair[1] + 1}
              </span>
              <button
                onClick={() => setSwappedPair([-1, -1])}
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}

      {/* Three-Column Layout */}
      <div className="grid grid-cols-12 gap-4" style={{ minHeight: 600 }}>
        {/* Left: Route Map */}
        <div className="col-span-4">
          <div
            className="rounded-xl p-3 sticky top-4"
            style={{ background: 'var(--pl-card)', border: '1px solid var(--pl-border)' }}
          >
            <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>
              Route Map &middot; {plan.hometownName}
            </div>
            <RouteMap
              stops={plan.stops}
              activeStop={activeStopId}
              onStopClick={handleStopClick}
              onStopHover={handleStopHover}
            />
          </div>
        </div>

        {/* Center: Stop List */}
        <div className="col-span-4">
          <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>
            Stops ({plan.stops.length})
          </div>
          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {plan.stops.map(stop => (
              <div key={stop.id}>
                <StopCard
                  stop={stop}
                  isActive={activeStopId === stop.id}
                  onClick={() => handleStopClick(stop.id)}
                />
                {/* View detail link */}
                {activeStopId === stop.id && (
                  <Link
                    href={`/proofline/ops/day-planner/stop/${stop.id}`}
                    className="block mt-1 text-center text-xs font-mono py-1.5 rounded-lg transition-colors hover:opacity-80"
                    style={{ color: '#2563EB' }}
                  >
                    Full Stop Detail &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail + Mobile */}
        <div className="col-span-4">
          {activeStop ? (
            <div>
              <div className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>
                Stop Detail
              </div>
              <div
                className="rounded-xl p-4 mb-4"
                style={{ background: 'var(--pl-card)', border: '1px solid var(--pl-border)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[15px] font-bold" style={{ color: 'var(--pl-text)' }}>{activeStop.accountName}</span>
                </div>
                <div className="flex items-center gap-3 mb-4 text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
                  <span>{activeStop.arrivalTime}</span>
                  <span>{activeStop.duration} min</span>
                  {activeStop.revenueOpportunity > 0 && (
                    <span className="text-[#22C55E] font-bold">${fmt(activeStop.revenueOpportunity)}</span>
                  )}
                </div>
                <DetailPanel stop={activeStop} />
              </div>

              {/* Mobile Preview Button */}
              <button
                onClick={() => setShowMobile(true)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-mono transition-all hover:opacity-80"
                style={{ border: '1px solid var(--pl-border)', color: 'var(--pl-text-muted)' }}
              >
                <span className="text-base">📱</span>
                <span>Rep&apos;s Mobile View</span>
              </button>

              {/* Bridge to Rep Tablet Demo */}
              <Link
                href="/proofline-route"
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-mono font-bold transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #C6A052, #a8842e)',
                  color: '#0a0f1e',
                  boxShadow: '0 2px 8px rgba(198,160,82,0.25)',
                }}
              >
                <span className="text-base">🚚</span>
                <span>Launch Rep Tablet View</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>&rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--pl-hover)' }}>
                <span className="text-3xl opacity-30">📍</span>
              </div>
              <div className="text-sm" style={{ color: 'var(--pl-text-faint)' }}>Select a stop</div>
              <div className="text-[13px] mt-1" style={{ color: 'var(--pl-text-faint)' }}>
                Click any stop on the map or list to view details
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Preview Modal */}
      {showMobile && activeStop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowMobile(false); }}
        >
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setShowMobile(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors z-10"
              style={{ background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)' }}
            >
              ✕
            </button>
            <MobilePreview
              currentStop={activeStop}
              repName={plan.repName}
              time={activeStop.arrivalTime}
            />
          </div>
        </div>
      )}

    </>
  );
}
