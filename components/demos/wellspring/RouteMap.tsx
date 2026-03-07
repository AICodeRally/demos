'use client';

import { useMemo } from 'react';
import type { Stop, StopType } from '@/data/wellspring/day-plans';

interface RouteMapProps {
  stops: Stop[];
  activeStop: string | null;
  onStopClick: (stopId: string) => void;
  onStopHover?: (stopId: string | null) => void;
}

const STOP_COLORS: Record<StopType, string> = {
  'yard-departure': '#6B7280',
  'producing-well': '#16A34A',
  'alarm-response': '#DC2626',
  'tank-battery': '#EA580C',
  'chemical-injection': '#2563EB',
  'new-completion': '#7C3AED',
  'permit-site': '#C2A04E',
  'workover': '#D97706',
  'drive-by': '#9CA3AF',
  'yard-return': '#6B7280',
};

/* ── Coordinate mapping ───────────────────────────────── */

const MAP_BOUNDS = {
  latMin: 31.25,
  latMax: 31.55,
  lngMin: -103.75,
  lngMax: -103.25,
};

function toSvg(lat: number, lng: number): { x: number; y: number } {
  const x = 50 + ((lng - MAP_BOUNDS.lngMin) / (MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin)) * 700;
  const y = 450 - ((lat - MAP_BOUNDS.latMin) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * 400;
  return { x: Math.max(30, Math.min(770, x)), y: Math.max(30, Math.min(470, y)) };
}

/* ── Road definitions ─────────────────────────────────── */

interface RoadDef {
  label: string;
  type: 'line' | 'curve';
  coords: string;
  weight: 'highway' | 'county';
}

const ROADS: RoadDef[] = [
  // Highway 285 — runs roughly N-S through the basin
  { label: 'Hwy 285', type: 'line', coords: '400,20,380,480', weight: 'highway' },
  // Highway 17 — runs roughly E-W
  { label: 'Hwy 17', type: 'line', coords: '50,250,750,260', weight: 'highway' },
  // County roads
  { label: 'CR 302', type: 'line', coords: '200,150,550,200', weight: 'county' },
  { label: 'CR 204', type: 'line', coords: '100,350,500,320', weight: 'county' },
  { label: 'FM 652', type: 'line', coords: '250,120,260,400', weight: 'county' },
  { label: 'FM 1776', type: 'line', coords: '500,100,520,420', weight: 'county' },
  { label: 'CR 401', type: 'line', coords: '560,140,700,300', weight: 'county' },
  { label: 'CR 218', type: 'line', coords: '300,80,340,380', weight: 'county' },
];

const AREA_LABELS = [
  { text: 'REEVES COUNTY', x: 620, y: 120, size: 12 },
  { text: 'PECOS COUNTY', x: 250, y: 420, size: 12 },
  { text: 'DELAWARE BASIN', x: 400, y: 60, size: 10 },
];

/* ── Component ────────────────────────────────────────── */

export function RouteMap({ stops, activeStop, onStopClick, onStopHover }: RouteMapProps) {
  const points = useMemo(
    () => stops.map((s) => ({ ...toSvg(s.lat, s.lng), stop: s })),
    [stops],
  );

  const pathD = useMemo(
    () => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '),
    [points],
  );

  // County boundary — rough dividing line between Reeves (east) and Pecos (west)
  const countyLine = 'M 430 20 L 420 480';

  return (
    <svg
      viewBox="0 0 800 500"
      className="w-full h-auto rounded-xl"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <defs>
        <style>{`
          @keyframes wellspringDash {
            to { stroke-dashoffset: 0; }
          }
          .wellspring-route-animated {
            stroke-dasharray: 8 6;
            stroke-dashoffset: 200;
            animation: wellspringDash 4s linear infinite;
          }
          @keyframes wellspringPulse {
            0%, 100% { r: 18; opacity: 0.35; }
            50% { r: 28; opacity: 0.08; }
          }
        `}</style>
      </defs>

      {/* Background — dark basin terrain */}
      <rect x="0" y="0" width="800" height="500" rx="16" fill="#252B36" />

      {/* Subtle terrain texture — grid lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={`hg-${i}`}
          x1="0" y1={i * 50} x2="800" y2={i * 50}
          stroke="#2D3748" strokeWidth="0.5" opacity="0.4"
        />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <line
          key={`vg-${i}`}
          x1={i * 50} y1="0" x2={i * 50} y2="500"
          stroke="#2D3748" strokeWidth="0.5" opacity="0.4"
        />
      ))}

      {/* County boundary */}
      <path
        d={countyLine}
        fill="none"
        stroke="#475569"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        opacity="0.5"
      />

      {/* Roads */}
      {ROADS.map((road) => {
        const isHwy = road.weight === 'highway';
        const strokeColor = isHwy ? '#475569' : '#374151';
        const width = isHwy ? 2 : 1;
        const dash = isHwy ? undefined : '3 3';
        const opacity = isHwy ? 0.7 : 0.45;

        const [x1, y1, x2, y2] = road.coords.split(',').map(Number);
        return (
          <g key={road.label}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={strokeColor}
              strokeWidth={width}
              opacity={opacity}
              strokeDasharray={dash}
            />
            <text
              x={x1 + (x2 - x1) * 0.15}
              y={y1 + (y2 - y1) * 0.15 - 4}
              fontSize="7"
              fill="#64748B"
              fontFamily="monospace"
              opacity="0.7"
            >
              {road.label}
            </text>
          </g>
        );
      })}

      {/* Area labels */}
      {AREA_LABELS.map((area) => (
        <text
          key={area.text}
          x={area.x}
          y={area.y}
          fontSize={area.size}
          fill="#475569"
          fontWeight="700"
          textAnchor="middle"
          style={{ letterSpacing: '3px' }}
        >
          {area.text}
        </text>
      ))}

      {/* Pecos Equipment Yard label */}
      <text x="680" y="230" fontSize="8" fill="#64748B" fontFamily="monospace" textAnchor="middle">
        Pecos Equipment Yard
      </text>

      {/* Route line — static background */}
      <path
        d={pathD}
        fill="none"
        stroke="#B45309"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
      />

      {/* Route line — animated dashed overlay */}
      <path
        d={pathD}
        fill="none"
        stroke="#B45309"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
        className="wellspring-route-animated"
      />

      {/* Stop markers */}
      {points.map(({ x, y, stop }) => {
        const isActive = activeStop === stop.id;
        const color = STOP_COLORS[stop.type];
        const isYard = stop.type === 'yard-departure' || stop.type === 'yard-return';

        return (
          <g
            key={stop.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onStopClick(stop.id)}
            onMouseEnter={() => onStopHover?.(stop.id)}
            onMouseLeave={() => onStopHover?.(null)}
          >
            {/* Active pulse ring */}
            {isActive && (
              <circle
                cx={x}
                cy={y}
                r={18}
                fill={color}
                opacity={0.35}
                style={{ animation: 'wellspringPulse 1.5s ease-in-out infinite' }}
              />
            )}

            {/* Alarm glow for alarm-response stops */}
            {stop.type === 'alarm-response' && (
              <circle cx={x} cy={y} r={20} fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Main dot — squares for pad locations, circles for yards */}
            {isYard ? (
              <rect
                x={x - (isActive ? 10 : 8)}
                y={y - (isActive ? 10 : 8)}
                width={isActive ? 20 : 16}
                height={isActive ? 20 : 16}
                rx="3"
                fill={color}
                stroke="#1E2530"
                strokeWidth={isActive ? 3 : 2}
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 10px ${color})`
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                  transition: 'all 0.2s ease',
                }}
              />
            ) : (
              <circle
                cx={x}
                cy={y}
                r={isActive ? 14 : 11}
                fill={color}
                stroke="#1E2530"
                strokeWidth={isActive ? 3 : 2}
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 10px ${color})`
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                  transition: 'r 0.2s ease, filter 0.2s ease',
                }}
              />
            )}

            {/* Sequence number */}
            <text
              x={x}
              y={y + (isActive ? 5 : 4)}
              textAnchor="middle"
              fontSize={isActive ? 12 : 10}
              fontWeight="bold"
              fill="white"
              style={{ pointerEvents: 'none' }}
            >
              {stop.sequence}
            </text>

            {/* Well name label */}
            <text
              x={x}
              y={y + (isActive ? 28 : 24)}
              textAnchor="middle"
              fontSize={isActive ? 9 : 7.5}
              fontWeight={isActive ? 700 : 600}
              fill="#94A3B8"
              style={{
                pointerEvents: 'none',
                transition: 'font-size 0.2s ease',
              }}
            >
              {stop.wellName.length > 20
                ? stop.wellName.substring(0, 18) + '...'
                : stop.wellName}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      {Array.from(new Set(stops.map((s) => s.type))).map((type, i) => (
        <g key={type} transform={`translate(16, ${360 + i * 14})`}>
          <circle cx="5" cy="-2" r="3.5" fill={STOP_COLORS[type]} />
          <text x="14" y="1" fontSize="7.5" fill="#64748B" fontFamily="monospace">
            {type.replace(/-/g, ' ')}
          </text>
        </g>
      ))}
    </svg>
  );
}
