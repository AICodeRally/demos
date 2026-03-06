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
            className="text-[11px] font-mono px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: tab === t.id ? '#2563EB' : '#F1F5F9',
              color: tab === t.id ? 'white' : '#718096',
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
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono mb-2">
                Delivery Manifest ({stop.deliveryManifest.reduce((s, m) => s + m.cases, 0)} cases)
              </div>
              <div className="space-y-1">
                {stop.deliveryManifest.map(item => (
                  <div key={item.sku} className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-slate-800">{item.brand}</span>
                      {item.promo && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                          {item.promo}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono">
                      <span style={{ color: '#718096' }}>{item.sku}</span>
                      <span className="text-slate-800 font-bold">{item.cases}cs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Talking Points */}
          {stop.talkingPoints.length > 0 && (
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono mb-2">Talking Points</div>
              <ul className="space-y-1.5">
                {stop.talkingPoints.map((tp, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-slate-600">
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
              <div className="text-[9px] uppercase tracking-wider text-blue-400 font-mono mb-1">Display Instructions</div>
              <div className="text-[11px] text-slate-600">{stop.displayInstructions}</div>
              {stop.photoRequired && (
                <div className="mt-1.5 text-[10px] font-bold text-amber-400">📸 Photo Required</div>
              )}
            </div>
          )}

          {/* Contact */}
          <div className="flex items-center gap-4 text-[11px]" style={{ color: '#718096' }}>
            <span>Contact: <strong className="text-slate-600">{stop.contactName}</strong></span>
            <span className="font-mono">{stop.contactPhone}</span>
          </div>
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div className="space-y-3">
          <div className="text-[11px] mb-3" style={{ color: '#718096' }}>Last 4 deliveries to this account</div>
          {[
            { date: 'Feb 25', cases: 128, rev: 15400, notes: 'Standard delivery. Corona facing at 8 (target 12).' },
            { date: 'Feb 18', cases: 134, rev: 16100, notes: 'Added Modelo Negra. Robert requested spirits tasting info.' },
            { date: 'Feb 11', cases: 121, rev: 14500, notes: 'Corona short 12cs — warehouse issue. Resolved same-day.' },
            { date: 'Feb 4', cases: 115, rev: 13800, notes: 'Routine. Pacifico trial 6cs — sold through in 5 days.' },
          ].map((visit, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 w-14 shrink-0">{visit.date}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-600 font-mono">{visit.cases}cs</span>
                  <span className="text-emerald-500 font-mono">${fmt(visit.rev)}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{visit.notes}</div>
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
              <div className="text-[11px] text-slate-600 leading-snug">{insight.insight}</div>
              <div className="mt-1.5">
                <DataSourceBadge source={insight.source} synced="2m ago" />
              </div>
            </div>
          ))}

          {/* Competitive Intel */}
          {stop.competitiveIntel && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(168,85,247,0.06)', borderLeft: '2px solid #A855F7' }}>
              <div className="text-[9px] uppercase tracking-wider text-purple-400 font-mono mb-1">Competitive Intel</div>
              <div className="text-[11px] text-slate-600">{stop.competitiveIntel}</div>
            </div>
          )}

          {/* TABC */}
          {stop.tabcStatus && (
            <div className="flex items-center gap-2 text-[11px]">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: stop.tabcStatus === 'verified' ? '#22C55E' :
                    stop.tabcStatus === 'expiring' ? '#F59E0B' : '#EF4444',
                }}
              />
              <span style={{ color: '#718096' }}>
                TABC: <strong className="text-slate-800">{stop.tabcStatus}</strong>
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

  const plan: DayPlan = DAY_PLANS.find(p => p.repId === selectedRep) ?? MARCUS_DAY_PLAN;
  const activeStop = plan.stops.find(s => s.id === activeStopId) ?? null;

  const reps = DAY_PLANS.map(p => ({
    id: p.repId,
    name: p.repName,
    route: p.route,
    hometown: p.hometownName,
  }));

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
          <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
            Day-in-the-Life &middot; Route Planner
          </div>
          <h1 className="text-xl font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A2E' }}>
            {plan.repName} — {plan.route}
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: '#718096' }}>
            {plan.date} &middot; {plan.stops.length} stops &middot; {plan.totalMiles} miles &middot; {plan.totalDuration}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <span className="text-[12px] font-bold text-emerald-500">Route Optimized</span>
          <span className="text-[11px]" style={{ color: '#718096' }}>
            Saves <strong className="text-emerald-500">{plan.optimizationSavings.miles} miles</strong> and{' '}
            <strong className="text-emerald-500">{plan.optimizationSavings.minutes} min</strong> vs standard sequence
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono" style={{ color: '#718096' }}>
          <span>{plan.truckNumber}</span>
          <span>{fmt(plan.totalCases)} cases</span>
          <span className="text-emerald-500 font-bold">${fmt(plan.totalRevenue)}</span>
        </div>
      </div>

      {/* Three-Column Layout */}
      <div className="grid grid-cols-12 gap-4" style={{ minHeight: 600 }}>
        {/* Left: Route Map */}
        <div className="col-span-4">
          <div
            className="rounded-xl p-3 sticky top-4"
            style={{ background: 'white', border: '1px solid #E2E8F0' }}
          >
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">
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
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">
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
                    className="block mt-1 text-center text-[10px] font-mono py-1.5 rounded-lg transition-colors hover:bg-slate-50"
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
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-2">
                Stop Detail
              </div>
              <div
                className="rounded-xl p-4 mb-4"
                style={{ background: 'white', border: '1px solid #E2E8F0' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[15px] font-bold" style={{ color: '#1A1A2E' }}>{activeStop.accountName}</span>
                </div>
                <div className="flex items-center gap-3 mb-4 text-[11px]" style={{ color: '#718096' }}>
                  <span>{activeStop.arrivalTime}</span>
                  <span>{activeStop.duration} min</span>
                  {activeStop.revenueOpportunity > 0 && (
                    <span className="text-emerald-500 font-bold">${fmt(activeStop.revenueOpportunity)}</span>
                  )}
                </div>
                <DetailPanel stop={activeStop} />
              </div>

              {/* Mobile Preview Button */}
              <button
                onClick={() => setShowMobile(true)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-mono transition-all hover:bg-slate-50"
                style={{ border: '1px solid #E2E8F0', color: '#718096' }}
              >
                <span className="text-base">📱</span>
                <span>Rep&apos;s Mobile View</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <span className="text-3xl opacity-30">📍</span>
              </div>
              <div className="text-sm" style={{ color: '#A0AEC0' }}>Select a stop</div>
              <div className="text-[11px] mt-1" style={{ color: '#CBD5E0' }}>
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

