'use client';

import { useMemo } from 'react';
import type { Stop } from '@/data/proofline/day-plans';

interface RouteMapProps {
  stops: Stop[];
  activeStop: string | null;
  onStopClick: (id: string) => void;
  onStopHover: (id: string | null) => void;
}

const STOP_COLORS: Record<string, string> = {
  'load-out': '#C6A052',
  'key-account': '#2563EB',
  'chain-drop': '#7C3AED',
  'presell': '#B87333',
  'new-account': '#22D3EE',
  'compliance': '#EF4444',
  'problem-resolution': '#F97316',
  'presell-spirits': '#A855F7',
  'merchandising': '#10B981',
  'drive-by': '#6B7280',
  'windshield': '#6B7280',
  'return': '#C6A052',
};

/* ── Region detection + road networks ─────────────────── */

type Region = 'dallas' | 'fort-worth' | 'laredo';

function detectRegion(stops: Stop[]): Region {
  const avgLng = stops.reduce((s, st) => s + st.lng, 0) / stops.length;
  const avgLat = stops.reduce((s, st) => s + st.lat, 0) / stops.length;
  if (avgLat < 30) return 'laredo';
  if (avgLng < -97) return 'fort-worth';
  return 'dallas';
}

interface RoadDef {
  type: 'line' | 'curve';
  label: string;
  coords: string;
  weight: 'highway' | 'road';
}

interface AreaLabel {
  text: string;
  x: number;
  y: number;
  size?: number;
}

interface RegionData {
  roads: RoadDef[];
  areas: AreaLabel[];
}

const REGIONS: Record<Region, RegionData> = {
  dallas: {
    roads: [
      { type: 'line', label: 'I-35E', coords: '100,0,120,500', weight: 'highway' },
      { type: 'line', label: 'US-75', coords: '440,0,420,500', weight: 'highway' },
      { type: 'curve', label: 'I-30', coords: 'M 0 420 Q 300 390 600 410', weight: 'highway' },
      { type: 'curve', label: 'LBJ 635', coords: 'M 0 80 Q 300 60 600 90', weight: 'highway' },
      { type: 'line', label: 'NW Hwy', coords: '60,240,540,240', weight: 'road' },
      { type: 'line', label: 'Mockingbird', coords: '60,340,540,340', weight: 'road' },
    ],
    areas: [
      { text: 'NORTH DALLAS', x: 300, y: 140, size: 14 },
      { text: 'HIGHLAND PARK', x: 280, y: 300, size: 12 },
      { text: 'DEEP ELLUM', x: 460, y: 380, size: 11 },
      { text: 'OAK LAWN', x: 140, y: 300, size: 11 },
    ],
  },
  'fort-worth': {
    roads: [
      { type: 'line', label: 'I-35W', coords: '280,0,300,500', weight: 'highway' },
      { type: 'curve', label: 'I-30', coords: 'M 0 140 Q 300 110 600 160', weight: 'highway' },
      { type: 'curve', label: 'I-20', coords: 'M 0 420 Q 300 400 600 430', weight: 'highway' },
      { type: 'curve', label: '820', coords: 'M 140 50 Q 60 260 160 460', weight: 'road' },
      { type: 'line', label: 'Camp Bowie', coords: '60,280,500,280', weight: 'road' },
    ],
    areas: [
      { text: 'DOWNTOWN FW', x: 300, y: 200, size: 13 },
      { text: 'CULTURAL DISTRICT', x: 150, y: 260, size: 11 },
      { text: 'TCU', x: 340, y: 360, size: 11 },
      { text: 'NEAR SOUTHSIDE', x: 300, y: 440, size: 11 },
    ],
  },
  laredo: {
    roads: [
      { type: 'line', label: 'I-35', coords: '300,0,280,500', weight: 'highway' },
      { type: 'curve', label: 'Loop 20', coords: 'M 100 120 Q 40 260 120 430 Q 300 500 480 430 Q 560 260 500 120', weight: 'highway' },
      { type: 'line', label: 'US-83', coords: '60,60,500,400', weight: 'road' },
      { type: 'line', label: 'Mines Rd', coords: '60,180,540,180', weight: 'road' },
    ],
    areas: [
      { text: 'DOWNTOWN', x: 280, y: 340, size: 13 },
      { text: 'NORTH LAREDO', x: 300, y: 120, size: 12 },
      { text: 'MINES RD', x: 160, y: 200, size: 11 },
    ],
  },
};

/* ── Coordinate mapping ───────────────────────────────── */

function getBounds(stops: Stop[]) {
  const lats = stops.map(s => s.lat);
  const lngs = stops.map(s => s.lng);
  const latPad = (Math.max(...lats) - Math.min(...lats)) * 0.15 || 0.02;
  const lngPad = (Math.max(...lngs) - Math.min(...lngs)) * 0.15 || 0.02;
  return {
    latMin: Math.min(...lats) - latPad,
    latMax: Math.max(...lats) + latPad,
    lngMin: Math.min(...lngs) - lngPad,
    lngMax: Math.max(...lngs) + lngPad,
  };
}

function toSvg(lat: number, lng: number, bounds: ReturnType<typeof getBounds>): { x: number; y: number } {
  const x = 40 + ((lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 520;
  const y = 460 - ((lat - bounds.latMin) / (bounds.latMax - bounds.latMin)) * 420;
  return { x: Math.max(30, Math.min(570, x)), y: Math.max(30, Math.min(470, y)) };
}

/* ── Component ────────────────────────────────────────── */

export function RouteMap({ stops, activeStop, onStopClick, onStopHover }: RouteMapProps) {
  const region = useMemo(() => detectRegion(stops), [stops]);
  const regionData = REGIONS[region];
  const bounds = useMemo(() => getBounds(stops), [stops]);

  const points = useMemo(
    () => stops.map(s => ({ ...toSvg(s.lat, s.lng, bounds), stop: s })),
    [stops, bounds],
  );

  // Build route path
  const pathD = useMemo(
    () => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '),
    [points],
  );

  return (
    <svg
      viewBox="0 0 600 500"
      className="w-full h-auto rounded-xl"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <defs>
        <style>{`
          @keyframes dashFlow {
            to { stroke-dashoffset: 0; }
          }
          .proofline-route-animated {
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

      {/* Background — light map style */}
      <rect x="0" y="0" width="600" height="500" rx="16" fill="#EDF2F7" />

      {/* Road network */}
      {regionData.roads.map((road) => {
        const isHwy = road.weight === 'highway';
        const opacity = isHwy ? 0.6 : 0.4;
        const width = isHwy ? 2.5 : 1.5;
        const dash = isHwy ? undefined : '4 3';
        const strokeColor = isHwy ? '#94A3B8' : '#CBD5E1';

        if (road.type === 'line') {
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
                x={x1 < 100 ? x1 + 4 : x2 - 4}
                y={y1 < 100 ? y1 + 14 : y2 - 6}
                fontSize="8"
                fill="#94A3B8"
                fontFamily="monospace"
                textAnchor={x1 < 100 ? 'start' : 'end'}
              >
                {road.label}
              </text>
            </g>
          );
        }
        return (
          <g key={road.label}>
            <path
              d={road.coords}
              fill="none"
              stroke={strokeColor}
              strokeWidth={width}
              opacity={opacity}
              strokeDasharray={dash}
            />
            <text
              x={300} y={road.label === 'I-30' ? (region === 'dallas' ? 405 : 125) : 75}
              fontSize="8"
              fill="#94A3B8"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {road.label}
            </text>
          </g>
        );
      })}

      {/* Area labels */}
      {regionData.areas.map((area) => (
        <text
          key={area.text}
          x={area.x}
          y={area.y}
          fontSize={area.size ?? 12}
          fill="#CBD5E1"
          fontWeight="700"
          textAnchor="middle"
          style={{ letterSpacing: '2px' }}
        >
          {area.text}
        </text>
      ))}

      {/* Route line — static background */}
      <path
        d={pathD}
        fill="none"
        stroke="#C6A052"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
      />

      {/* Route line — animated dashed overlay */}
      <path
        d={pathD}
        fill="none"
        stroke="#C6A052"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
        className="proofline-route-animated"
      />

      {/* Stop markers */}
      {points.map(({ x, y, stop }) => {
        const isActive = activeStop === stop.id;
        const color = STOP_COLORS[stop.type] ?? '#6B7280';
        const isReturn = stop.type === 'return' || stop.type === 'load-out';

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
                cx={x}
                cy={y}
                r={18}
                fill={color}
                opacity={0.3}
                style={{ animation: 'pulsePin 1.5s ease-in-out infinite' }}
              />
            )}

            {/* Main circle */}
            <circle
              cx={x}
              cy={y}
              r={isActive ? 16 : 13}
              fill={color}
              stroke="white"
              strokeWidth={isActive ? 3 : 2}
              style={{
                filter: isActive
                  ? `drop-shadow(0 0 8px ${color})`
                  : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                transition: 'r 0.2s ease, filter 0.2s ease',
              }}
            />

            {/* Sequence number or home icon */}
            {isReturn ? (
              <path
                d={`M ${x - 5} ${y + 1} L ${x} ${y - 5} L ${x + 5} ${y + 1} L ${x + 5} ${y + 5} L ${x - 5} ${y + 5} Z`}
                fill="white"
                opacity={0.95}
                style={{ pointerEvents: 'none' }}
              />
            ) : (
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize={isActive ? 13 : 11}
                fontWeight="bold"
                fill="white"
                style={{ pointerEvents: 'none' }}
              >
                {stop.sequence}
              </text>
            )}

            {/* Stop name label */}
            <text
              x={x}
              y={y + (isActive ? 30 : 27)}
              textAnchor="middle"
              fontSize={isActive ? 9 : 8}
              fontWeight={isActive ? 700 : 600}
              fill="#475569"
              style={{
                pointerEvents: 'none',
                transition: 'font-size 0.2s ease',
              }}
            >
              {stop.accountName.length > 16
                ? stop.accountName.substring(0, 14) + '...'
                : stop.accountName}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      {Array.from(new Set(stops.map(s => s.type))).map((type, i) => (
        <g key={type} transform={`translate(16, ${430 + i * 14})`}>
          <circle cx="5" cy="-2" r="3.5" fill={STOP_COLORS[type] ?? '#6B7280'} />
          <text x="14" y="1" fontSize="8" fill="#94A3B8" fontFamily="monospace">
            {type.replace(/-/g, ' ')}
          </text>
        </g>
      ))}
    </svg>
  );
}
