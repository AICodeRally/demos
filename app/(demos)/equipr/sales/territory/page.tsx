'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  ROUTE_SUMMARY,
  ROUTE_STOPS,
  ROUTE_DATA_SOURCES,
  STOP_TYPE_META,
} from '@/data/equipr/territory-day';
import type { RouteStop } from '@/data/equipr/territory-day';
import {
  Map,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  PhoneCall,
  Eye,
  Navigation,
  Database,
  Phone,
  Wrench,
  CalendarClock,
  MessageSquare,
  Smartphone,
  X,
  Battery,
  Signal,
  Wifi,
  MapPinned,
  Home,
} from 'lucide-react';

/* -- Helpers ------------------------------------------------- */

function fmtK(n: number): string {
  return `$${(n / 1e3).toFixed(0)}K`;
}

function fmtDollar(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

const STOP_ICONS: Record<RouteStop['type'], React.ReactNode> = {
  primary: <MapPin size={14} />,
  opportunity: <Sparkles size={14} />,
  'follow-up': <PhoneCall size={14} />,
  'drive-by': <Eye size={14} />,
};

/* -- SVG Map Pin Positions ----------------------------------- */

// Approximate positions within a 600x500 viewBox
// Scottsdale is east, Cave Creek far north, Phoenix west/center
const PIN_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 420, y: 300 },  // ABC Construction, Scottsdale (east-center)
  2: { x: 380, y: 330 },  // Meridian Homes, Scottsdale (near stop 1, slightly SW)
  3: { x: 310, y: 140 },  // Desert Ridge, N Phoenix (north-center)
  4: { x: 200, y: 100 },  // Kiewit I-17, Happy Valley (northwest)
  5: { x: 360, y: 50 },   // Valley Solar, Cave Creek (far north)
  6: { x: 370, y: 200 },  // Penta Building, N Scottsdale (center-north)
  7: { x: 430, y: 340 },  // Branch Return, Scottsdale (east-center near start)
};

/* -- Source Badge -------------------------------------------- */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>&bull;</span>
      <span>{synced}</span>
    </div>
  );
}

/* -- SVG Route Map ------------------------------------------ */

function RouteMapSVG({
  activeStop,
  onStopClick,
  onStopHover,
}: {
  activeStop: number | null;
  onStopClick: (id: number) => void;
  onStopHover: (id: number | null) => void;
}) {
  // Build the route polyline path
  const routePoints = ROUTE_STOPS.map((s) => PIN_POSITIONS[s.id]);
  const pathD = routePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <svg
      viewBox="0 0 600 500"
      className="w-full h-full"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <defs>
        {/* Animated dash for route line */}
        <style>{`
          @keyframes dashFlow {
            to { stroke-dashoffset: 0; }
          }
          .route-line-animated {
            stroke-dasharray: 8 6;
            stroke-dashoffset: 200;
            animation: dashFlow 4s linear infinite;
          }
          @keyframes pulsePin {
            0%, 100% { r: 18; opacity: 0.3; }
            50% { r: 26; opacity: 0.08; }
          }
        `}</style>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="600" height="500" rx="16" fill="var(--prizym-card-bg)" />

      {/* Grid lines for road-like effect */}
      {/* I-17 (vertical, west side) */}
      <line x1="160" y1="0" x2="160" y2="500" stroke="var(--prizym-border-default)" strokeWidth="3" opacity="0.5" />
      <text x="148" y="488" fontSize="9" fill="var(--prizym-text-muted)" fontFamily="monospace" opacity="0.6" textAnchor="end">I-17</text>

      {/* Loop 101 (curved-ish, east side) */}
      <path
        d="M 500 60 Q 520 250 480 460"
        fill="none"
        stroke="var(--prizym-border-default)"
        strokeWidth="3"
        opacity="0.5"
      />
      <text x="508" y="250" fontSize="9" fill="var(--prizym-text-muted)" fontFamily="monospace" opacity="0.6">101</text>

      {/* Loop 202 (horizontal, south) */}
      <path
        d="M 80 400 Q 300 380 540 410"
        fill="none"
        stroke="var(--prizym-border-default)"
        strokeWidth="3"
        opacity="0.5"
      />
      <text x="300" y="415" fontSize="9" fill="var(--prizym-text-muted)" fontFamily="monospace" opacity="0.6" textAnchor="middle">Loop 202</text>

      {/* Camelback Rd (horizontal, center) */}
      <line x1="80" y1="310" x2="520" y2="310" stroke="var(--prizym-border-default)" strokeWidth="1.5" opacity="0.35" strokeDasharray="4 3" />
      <text x="76" y="306" fontSize="8" fill="var(--prizym-text-muted)" fontFamily="monospace" opacity="0.5" textAnchor="end">Camelback</text>

      {/* Scottsdale Rd (vertical, center-east) */}
      <line x1="380" y1="20" x2="380" y2="480" stroke="var(--prizym-border-default)" strokeWidth="1.5" opacity="0.35" strokeDasharray="4 3" />
      <text x="388" y="478" fontSize="8" fill="var(--prizym-text-muted)" fontFamily="monospace" opacity="0.5">Scottsdale Rd</text>

      {/* Happy Valley Rd (horizontal, north) */}
      <line x1="80" y1="110" x2="520" y2="110" stroke="var(--prizym-border-default)" strokeWidth="1" opacity="0.25" strokeDasharray="3 4" />
      <text x="76" y="106" fontSize="8" fill="var(--prizym-text-muted)" fontFamily="monospace" opacity="0.4" textAnchor="end">Happy Valley</text>

      {/* Area labels */}
      <text x="430" y="270" fontSize="13" fill="var(--prizym-text-muted)" fontWeight="600" opacity="0.2" textAnchor="middle">SCOTTSDALE</text>
      <text x="150" y="280" fontSize="13" fill="var(--prizym-text-muted)" fontWeight="600" opacity="0.2" textAnchor="middle">PHOENIX</text>
      <text x="350" y="35" fontSize="11" fill="var(--prizym-text-muted)" fontWeight="600" opacity="0.2" textAnchor="middle">CAVE CREEK</text>
      <text x="310" y="165" fontSize="11" fill="var(--prizym-text-muted)" fontWeight="600" opacity="0.2" textAnchor="middle">DESERT RIDGE</text>

      {/* Route line (static background) */}
      <path
        d={pathD}
        fill="none"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.15"
      />

      {/* Route line (animated dashed overlay) */}
      <path
        d={pathD}
        fill="none"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
        className="route-line-animated"
      />

      {/* Stop markers */}
      {ROUTE_STOPS.map((stop) => {
        const pos = PIN_POSITIONS[stop.id];
        const meta = STOP_TYPE_META[stop.type];
        const isActive = activeStop === stop.id;
        const isBranch = stop.id === 7;

        return (
          <g
            key={stop.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onStopClick(stop.id)}
            onMouseEnter={() => onStopHover(stop.id)}
            onMouseLeave={() => onStopHover(null)}
          >
            {/* Active pulse ring */}
            {isActive && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                fill={meta.color}
                opacity="0.3"
                style={{
                  animation: 'pulsePin 1.5s ease-in-out infinite',
                }}
              />
            )}

            {/* Main circle */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? 16 : 14}
              fill={meta.color}
              stroke="white"
              strokeWidth={isActive ? 3 : 2}
              style={{
                filter: isActive ? `drop-shadow(0 0 8px ${meta.color})` : `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`,
                transition: 'r 0.2s ease, filter 0.2s ease',
              }}
            />

            {/* Stop number or home icon */}
            {isBranch ? (
              <>
                {/* Home icon (simplified SVG path) */}
                <path
                  d={`M ${pos.x - 6} ${pos.y + 1} L ${pos.x} ${pos.y - 6} L ${pos.x + 6} ${pos.y + 1} L ${pos.x + 6} ${pos.y + 6} L ${pos.x - 6} ${pos.y + 6} Z`}
                  fill="white"
                  opacity="0.95"
                />
              </>
            ) : (
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill="white"
                style={{ pointerEvents: 'none' }}
              >
                {stop.id}
              </text>
            )}

            {/* Stop name label */}
            <text
              x={pos.x}
              y={pos.y + (isActive ? 30 : 28)}
              textAnchor="middle"
              fontSize={isActive ? '10' : '9'}
              fontWeight={isActive ? '700' : '600'}
              fill="var(--prizym-text-secondary)"
              style={{ pointerEvents: 'none', transition: 'font-size 0.2s ease' }}
            >
              {stop.name.split(' — ')[0].length > 18
                ? stop.name.split(' — ')[0].substring(0, 16) + '...'
                : stop.name.split(' — ')[0]}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      {(Object.entries(STOP_TYPE_META) as [RouteStop['type'], typeof STOP_TYPE_META[RouteStop['type']]][]).map(([type, meta], i) => (
        <g key={type} transform={`translate(20, ${430 + i * 16})`}>
          <circle cx="6" cy="-3" r="4" fill={meta.color} />
          <text x="16" y="0" fontSize="9" fill="var(--prizym-text-muted)" fontFamily="monospace">{meta.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* -- Mobile Phone Preview Modal ----------------------------- */

function MobilePreviewModal({
  stop,
  stops,
  onClose,
  autoCycle,
}: {
  stop: RouteStop;
  stops?: RouteStop[];
  onClose: () => void;
  autoCycle?: boolean;
}) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const [displayStop, setDisplayStop] = useState(stop);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (!autoCycle || !stops || stops.length <= 1) return;

    let idx = 0;
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        idx = (idx + 1) % Math.min(stops.length, 3);
        setDisplayStop(stops[idx]);
        setFadeIn(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoCycle, stops]);

  const meta = STOP_TYPE_META[displayStop.type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* iPhone frame */}
      <div
        className="relative flex flex-col"
        style={{
          width: 375,
          height: 700,
          borderRadius: 40,
          background: '#1a1a1a',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.1)',
          padding: 8,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
          style={{
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <X size={16} color="#333" />
        </button>

        {/* Phone screen */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            borderRadius: 32,
            background: '#ffffff',
          }}
        >
          {/* Notch area */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1" style={{ background: '#f8f9fa' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>9:41</span>
            <div
              style={{
                width: 80,
                height: 24,
                borderRadius: 12,
                background: '#1a1a1a',
              }}
            />
            <div className="flex items-center gap-1">
              <Signal size={11} color="#333" />
              <Wifi size={11} color="#333" />
              <Battery size={11} color="#333" />
            </div>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between px-4 py-2" style={{ background: '#f8f9fa', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded flex items-center justify-center"
                style={{ background: '#2563EB' }}
              >
                <MapPin size={11} color="white" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', fontFamily: "'Space Grotesk', sans-serif" }}>EQUIPR</span>
            </div>
            <span style={{ fontSize: 10, color: '#6b7280' }}>Today&apos;s Route</span>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-3" style={{ WebkitOverflowScrolling: 'touch', opacity: fadeIn ? 1 : 0, transition: 'opacity 300ms ease' }}>
            {/* Stop number + badge */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: meta.color, fontSize: 14, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {displayStop.id}
              </div>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: meta.bgColor, color: meta.color }}
              >
                {STOP_ICONS[displayStop.type]}
                {meta.label}
              </span>
            </div>

            {/* Customer name */}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>
              {displayStop.name}
            </h3>

            {/* Address with maps icon */}
            <div
              className="flex items-center gap-1.5 mb-3 px-2.5 py-2 rounded-lg"
              style={{ background: '#f0f4ff', cursor: 'pointer' }}
            >
              <MapPinned size={13} color="#2563EB" />
              <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 500 }}>{displayStop.address}</span>
            </div>

            {/* AI Briefing */}
            {displayStop.aiInsight && (
              <div className="mb-3 rounded-lg px-3 py-2.5" style={{ background: '#f0f7ff', border: '1px solid #dbeafe' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={11} color="#2563EB" />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#2563EB', letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>AI Briefing</span>
                </div>
                <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{displayStop.aiInsight}</p>
              </div>
            )}

            {/* Last Visit */}
            {displayStop.lastVisit && displayStop.lastVisitNotes && (
              <div className="mb-3 rounded-lg px-3 py-2.5" style={{ background: '#fffbeb', border: '1px solid #fef3c7' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <CalendarClock size={11} color="#D97706" />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#D97706', letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>Last Visit &mdash; {displayStop.lastVisit}</span>
                </div>
                <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{displayStop.lastVisitNotes}</p>
              </div>
            )}

            {/* Equipment chips */}
            {displayStop.equipmentNeeds && displayStop.equipmentNeeds.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-1.5">
                  <Wrench size={10} color="#6b7280" />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' as const }}>Equipment Needs</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {displayStop.equipmentNeeds.map((eq) => (
                    <span
                      key={eq}
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: `${meta.color}15`,
                        color: meta.color,
                        border: `1px solid ${meta.color}30`,
                      }}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Revenue */}
            {displayStop.revenuePotential !== undefined && displayStop.revenuePotential > 0 && (
              <div className="mb-3 text-center py-2 rounded-lg" style={{ background: '#ecfdf5', border: '1px solid #d1fae5' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 2 }}>Revenue Potential</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>{fmtDollar(displayStop.revenuePotential)}</div>
                {displayStop.currentRentals !== undefined && displayStop.currentRentals > 0 && (
                  <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                    {displayStop.currentRentals} active rental{displayStop.currentRentals !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}

            {/* Contact + CTA buttons */}
            {displayStop.contactName && (
              <div className="mb-3">
                <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 4 }}>Contact</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 8 }}>{displayStop.contactName}</div>

                <div className="flex gap-2">
                  {/* Call button */}
                  <div
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                    style={{ background: '#10B981', cursor: 'pointer' }}
                  >
                    <Phone size={14} color="white" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Call</span>
                  </div>
                  {/* Navigate button */}
                  <div
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                    style={{ background: '#2563EB', cursor: 'pointer' }}
                  >
                    <Navigation size={14} color="white" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Navigate</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Home indicator */}
          <div className="flex items-center justify-center py-2" style={{ background: '#f8f9fa' }}>
            <div style={{ width: 120, height: 4, borderRadius: 2, background: '#d1d5db' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function TerritoryDayPage() {
  return (
    <Suspense fallback={null}>
      <TerritoryDayContent />
    </Suspense>
  );
}

function TerritoryDayContent() {
  const summary = ROUTE_SUMMARY;
  const searchParams = useSearchParams();
  const [activeStop, setActiveStop] = useState<number | null>(null);
  const [mobilePreviewStop, setMobilePreviewStop] = useState<RouteStop | null>(null);
  const stopRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Auto-open mobile preview when ?mobile=1 (used by kiosk tour)
  useEffect(() => {
    if (searchParams.get('mobile') === '1' && !mobilePreviewStop) {
      const timer = setTimeout(() => {
        setMobilePreviewStop(ROUTE_STOPS[0]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, mobilePreviewStop]);

  const scrollToStop = useCallback((id: number) => {
    const el = stopRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleMapStopClick = useCallback(
    (id: number) => {
      setActiveStop(id);
      scrollToStop(id);
    },
    [scrollToStop],
  );

  const handleMapStopHover = useCallback((id: number | null) => {
    setActiveStop(id);
  }, []);

  const handleCardHover = useCallback((id: number | null) => {
    setActiveStop(id);
  }, []);

  const handleCardClick = useCallback((id: number) => {
    setActiveStop(id);
  }, []);

  return (
    <>
      {/* -- Header ------------------------------------------ */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Map size={22} style={{ color: '#2563EB' }} />
            <h1
              className="text-2xl font-bold"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Territory Day Planner
            </h1>
          </div>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            AI-optimized route for {summary.rep} &mdash; {summary.date}
          </p>
          <SourceBadge source="Dodge + CRM + Telematics + Permits + Maps" synced="Optimized 6:15 AM" />
        </div>
        <div
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(37,99,235,0.12)',
            color: '#2563EB',
            border: '1px solid rgba(37,99,235,0.25)',
          }}
        >
          Today
        </div>
      </div>

      {/* =====================================================
          Zone 2: Route Summary KPIs (4 cards)
          ===================================================== */}
      <div id="kiosk-kpis" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Stops */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#2563EB' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Total Stops
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: '#2563EB',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {summary.totalStops}
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5 flex items-center gap-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            <MapPin size={11} /> AI-optimized route
          </div>
        </div>

        {/* Revenue Potential */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid rgba(16,185,129,0.25)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#10B981' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Revenue Potential
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: '#10B981',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {fmtK(summary.revenuePotentialTotal)}
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5 flex items-center gap-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            <DollarSign size={11} /> across {summary.totalStops} stops
          </div>
        </div>

        {/* Total Drive Time */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#8B5CF6' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Total Drive Time
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: '#8B5CF6',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {summary.totalDriveTime}
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5 flex items-center gap-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            <Clock size={11} /> {summary.totalMiles} miles
          </div>
        </div>

        {/* Route Optimization */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid rgba(6,182,212,0.25)',
            boxShadow: '0 0 16px rgba(6,182,212,0.06), var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#0891B2' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Route Optimization
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: '#0891B2',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              42 mi saved
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5 flex items-center gap-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            <Sparkles size={11} /> 55 min saved vs. naive route
          </div>
        </div>
      </div>

      {/* =====================================================
          Zone 3: Route Intelligence Bar
          ===================================================== */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Navigation size={15} style={{ color: '#2563EB' }} />
            <span
              className="text-[13px] font-semibold"
              style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Primary: {summary.primaryJob}
            </span>
            <span
              className="text-[12px]"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              + 6 additional stops along your route
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {ROUTE_DATA_SOURCES.map((src) => (
              <div
                key={src.name}
                className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md"
                style={{
                  background: 'rgba(37,99,235,0.06)',
                  color: '#2563EB',
                  border: '1px solid rgba(37,99,235,0.12)',
                }}
              >
                <Database size={9} />
                <span className="font-semibold">{src.name}</span>
                <span style={{ opacity: 0.6 }}>{src.records}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          Zone 4: Map + Timeline Split Layout
          ===================================================== */}
      <div className="mb-6">
        <h2
          className="text-[15px] font-bold mb-4"
          style={{
            color: 'var(--prizym-text-primary)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Today&apos;s Route
        </h2>

        <div id="kiosk-map" className="flex flex-col lg:flex-row gap-6">
          {/* Left: SVG Map (sticky on desktop) */}
          <div className="lg:w-[45%] shrink-0">
            <div
              className="lg:sticky lg:top-4 rounded-xl overflow-hidden"
              style={{
                background: 'var(--prizym-card-bg)',
                border: '1px solid var(--prizym-border-default)',
                boxShadow: 'var(--prizym-shadow-card)',
              }}
            >
              <RouteMapSVG
                activeStop={activeStop}
                onStopClick={handleMapStopClick}
                onStopHover={handleMapStopHover}
              />
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              {ROUTE_STOPS.map((stop, idx) => {
                const meta = STOP_TYPE_META[stop.type];
                const isLast = idx === ROUTE_STOPS.length - 1;
                const isActive = activeStop === stop.id;

                return (
                  <div
                    key={stop.id}
                    id={`kiosk-stop-${stop.id}`}
                    ref={(el) => { stopRefs.current[stop.id] = el; }}
                    className="relative"
                    onMouseEnter={() => handleCardHover(stop.id)}
                    onMouseLeave={() => handleCardHover(null)}
                    onClick={() => handleCardClick(stop.id)}
                  >
                    {/* Drive-time connector between stops */}
                    {idx > 0 && (
                      <div className="flex items-center ml-[19px] mb-0">
                        {/* Vertical connector line */}
                        <div
                          className="w-[2px] h-8"
                          style={{ background: 'var(--prizym-border-default)' }}
                        />
                        <div
                          className="ml-4 flex items-center gap-2 text-[11px] py-1"
                          style={{ color: 'var(--prizym-text-muted)' }}
                        >
                          <Clock size={10} />
                          <span>{stop.driveTime}</span>
                          <span style={{ opacity: 0.4 }}>&bull;</span>
                          <span>{stop.distance}</span>
                        </div>
                      </div>
                    )}

                    {/* Stop card row */}
                    <div className="flex gap-4">
                      {/* Timeline node */}
                      <div className="flex flex-col items-center" style={{ minWidth: 40 }}>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0 transition-shadow duration-200"
                          style={{
                            background: meta.color,
                            fontFamily: "'Space Grotesk', sans-serif",
                            boxShadow: isActive
                              ? `0 0 20px ${meta.bgColor}, 0 0 40px ${meta.bgColor}`
                              : `0 0 12px ${meta.bgColor}`,
                            transform: isActive ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          }}
                        >
                          {stop.id === 7 ? <Home size={16} /> : stop.id}
                        </div>
                        {/* Vertical line below node */}
                        {!isLast && (
                          <div
                            className="w-[2px] flex-1 mt-0"
                            style={{ background: 'var(--prizym-border-default)' }}
                          />
                        )}
                      </div>

                      {/* Stop card */}
                      <div
                        className="rounded-xl p-5 flex-1 mb-4 transition-all duration-200"
                        style={{
                          background: 'var(--prizym-card-bg)',
                          border: isActive
                            ? `2px solid ${meta.color}`
                            : `1px solid ${meta.color}30`,
                          boxShadow: isActive
                            ? `0 0 20px ${meta.color}15, var(--prizym-shadow-card)`
                            : 'var(--prizym-shadow-card)',
                        }}
                      >
                        {/* Stop identity — prominent for kiosk viewing */}
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[14px] font-bold"
                            style={{
                              color: meta.color,
                              fontFamily: "'Space Grotesk', sans-serif",
                            }}
                          >
                            {stop.id === 7 ? 'Return' : `Stop ${stop.id}`} — {meta.label}
                          </span>
                        </div>

                        {/* Card header: type badge + tags + mobile preview button */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                            style={{
                              background: meta.bgColor,
                              color: meta.color,
                            }}
                          >
                            {STOP_ICONS[stop.type]}
                            {meta.label}
                          </span>
                          {stop.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                              style={{
                                background: 'rgba(0,0,0,0.04)',
                                color: 'var(--prizym-text-muted)',
                                border: '1px solid var(--prizym-border-default)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {/* Mobile Preview button */}
                          <button
                            className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md transition-colors duration-150"
                            style={{
                              background: 'rgba(37,99,235,0.08)',
                              color: '#2563EB',
                              border: '1px solid rgba(37,99,235,0.2)',
                              cursor: 'pointer',
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(37,99,235,0.15)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}
                            onClick={(e) => { e.stopPropagation(); setMobilePreviewStop(stop); }}
                          >
                            <Smartphone size={12} />
                            Mobile Preview
                          </button>
                        </div>

                        {/* Name + Address */}
                        <h3
                          className="text-[16px] font-bold mb-0.5"
                          style={{
                            color: 'var(--prizym-text-primary)',
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {stop.name}
                        </h3>
                        <p
                          className="text-[12px] mb-2"
                          style={{ color: 'var(--prizym-text-muted)' }}
                        >
                          {stop.address}
                        </p>

                        {/* Reason */}
                        <p
                          className="text-[13px] mb-3 leading-relaxed"
                          style={{ color: 'var(--prizym-text-secondary)' }}
                        >
                          {stop.reason}
                        </p>

                        {/* AI Insight Box */}
                        {stop.aiInsight && (
                          <div
                            className="rounded-lg px-4 py-3 mb-3"
                            style={{
                              background: 'rgba(37,99,235,0.06)',
                              border: '1px solid rgba(37,99,235,0.15)',
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <Sparkles size={14} style={{ color: '#2563EB', marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <div
                                  className="text-[10px] uppercase tracking-[1.5px] font-bold tabular-nums mb-1"
                                  style={{ color: '#2563EB' }}
                                >
                                  AI Insight
                                </div>
                                <p
                                  className="text-[12px] leading-relaxed"
                                  style={{ color: 'var(--prizym-text-secondary)' }}
                                >
                                  {stop.aiInsight}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Last Visit Context */}
                        {stop.lastVisit && stop.lastVisitNotes && (
                          <div
                            className="rounded-lg px-4 py-3 mb-3"
                            style={{
                              background: 'rgba(245,158,11,0.06)',
                              border: '1px solid rgba(245,158,11,0.15)',
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <CalendarClock size={14} style={{ color: '#F59E0B', marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <div
                                  className="text-[10px] uppercase tracking-[1.5px] font-bold tabular-nums mb-1"
                                  style={{ color: '#D97706' }}
                                >
                                  Last Visit &mdash; {stop.lastVisit}
                                </div>
                                <p
                                  className="text-[12px] leading-relaxed"
                                  style={{ color: 'var(--prizym-text-secondary)' }}
                                >
                                  {stop.lastVisitNotes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bottom row: Revenue + Contact + Equipment */}
                        <div className="flex items-start gap-6 flex-wrap">
                          {/* Revenue Potential */}
                          {stop.revenuePotential !== undefined && stop.revenuePotential > 0 && (
                            <div>
                              <div
                                className="text-[10px] uppercase tracking-[1px] font-semibold mb-0.5"
                                style={{ color: 'var(--prizym-text-muted)' }}
                              >
                                Revenue Potential
                              </div>
                              <span
                                className="text-[18px] font-bold tabular-nums"
                                style={{ color: '#10B981' }}
                              >
                                {fmtDollar(stop.revenuePotential)}
                              </span>
                              {(stop.currentRentals !== undefined && stop.currentRentals > 0) && (
                                <span
                                  className="text-[10px] ml-2"
                                  style={{ color: 'var(--prizym-text-muted)' }}
                                >
                                  {stop.currentRentals} active rental{stop.currentRentals !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Contact */}
                          {stop.contactName && (
                            <div>
                              <div
                                className="text-[10px] uppercase tracking-[1px] font-semibold mb-0.5"
                                style={{ color: 'var(--prizym-text-muted)' }}
                              >
                                Contact
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageSquare size={12} style={{ color: 'var(--prizym-text-muted)' }} />
                                <span
                                  className="text-[12px] font-semibold"
                                  style={{ color: 'var(--prizym-text-primary)' }}
                                >
                                  {stop.contactName}
                                </span>
                                {stop.contactPhone && (
                                  <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
                                    <Phone size={10} />
                                    {stop.contactPhone}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Equipment Needs */}
                        {stop.equipmentNeeds && stop.equipmentNeeds.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Wrench size={11} style={{ color: 'var(--prizym-text-muted)' }} />
                              <span
                                className="text-[10px] uppercase tracking-[1px] font-semibold"
                                style={{ color: 'var(--prizym-text-muted)' }}
                              >
                                Equipment Needs
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {stop.equipmentNeeds.map((eq) => (
                                <span
                                  key={eq}
                                  className="text-[10px] font-semibold px-2.5 py-1 rounded-md"
                                  style={{
                                    background: `${meta.color}10`,
                                    color: meta.color,
                                    border: `1px solid ${meta.color}20`,
                                  }}
                                >
                                  {eq}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          Zone 5: Day Summary Banner
          ===================================================== */}
      <div
        id="kiosk-summary"
        className="rounded-xl p-6 relative overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid rgba(37,99,235,0.35)',
          boxShadow: '0 0 30px rgba(37,99,235,0.08), var(--prizym-shadow-card)',
        }}
      >
        {/* Gradient accent left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{
            background: 'linear-gradient(to bottom, #2563EB, #0891B2)',
          }}
        />

        <div className="pl-4">
          <h3
            className="text-[18px] font-bold mb-1"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            One drive. Seven opportunities. {fmtK(summary.revenuePotentialTotal)} in pipeline.
          </h3>
          <p
            className="text-[13px] mb-5 leading-relaxed"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Without AI route optimization, Marcus would have visited 1 customer and driven 42 extra miles.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryStatCard
              label="Stops"
              value={String(summary.totalStops)}
              color="#2563EB"
            />
            <SummaryStatCard
              label="Miles"
              value={String(summary.totalMiles)}
              color="#8B5CF6"
            />
            <SummaryStatCard
              label="Drive Time"
              value={summary.totalDriveTime}
              color="#0891B2"
            />
            <SummaryStatCard
              label="Pipeline"
              value={fmtK(summary.revenuePotentialTotal)}
              color="#10B981"
            />
          </div>

          {/* Punchline */}
          <div
            className="mt-5 px-4 py-3 rounded-lg"
            style={{
              background: 'rgba(37,99,235,0.06)',
              border: '1px solid rgba(37,99,235,0.15)',
            }}
          >
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: 'var(--prizym-text-secondary)' }}
            >
              &ldquo;I have a job 50 miles away &mdash; who else should I talk to on my drive?&rdquo;
              {' '}AI answered with{' '}
              <span className="font-bold" style={{ color: '#2563EB' }}>
                6 additional revenue opportunities
              </span>
              , enriched with last-visit context, competitive intel, and real-time telematics.
              Every trip becomes a territory sweep.
            </p>
          </div>
        </div>
      </div>

      {/* -- Mobile Preview Modal ------------------------------ */}
      {mobilePreviewStop && (
        <MobilePreviewModal
          stop={mobilePreviewStop}
          stops={ROUTE_STOPS.slice(0, 3)}
          onClose={() => setMobilePreviewStop(null)}
          autoCycle={searchParams.get('mobile') === '1'}
        />
      )}
    </>
  );
}

/* ============================================================
   Helper Components
   ============================================================ */

function SummaryStatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ background: `${color}08`, border: `1px solid ${color}20` }}
    >
      <div
        className="text-[10px] uppercase tracking-[1px] font-semibold mb-0.5"
        style={{ color: 'var(--prizym-text-muted)' }}
      >
        {label}
      </div>
      <span
        className="text-[18px] font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}
