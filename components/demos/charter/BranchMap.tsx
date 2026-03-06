'use client';

import { useState } from 'react';

interface Branch {
  id: string;
  name: string;
  x: number;
  y: number;
  county: string;
  deposits: string;
  members: number;
  status: 'flagship' | 'standard' | 'express';
}

interface BranchMapProps {
  branches: Branch[];
  width?: number;
  height?: number;
}

const COUNTY_COLORS: Record<string, string> = {
  Lakeshore: '#475569',
  Bayfield: '#B87333',
  Ashland: '#6B8F71',
};

const STATUS_RADIUS: Record<Branch['status'], number> = {
  flagship: 10,
  standard: 7,
  express: 5,
};

export function BranchMap({ branches, width = 600, height = 360 }: BranchMapProps) {
  const [hovered, setHovered] = useState<Branch | null>(null);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: height }}>
        {/* County regions */}
        <path
          d="M 50 80 Q 120 40 220 60 Q 280 80 300 160 Q 280 240 200 260 Q 120 270 60 220 Q 30 160 50 80 Z"
          fill="#475569" fillOpacity="0.08" stroke="#475569" strokeOpacity="0.2" strokeWidth="1"
        />
        <text x="160" y="280" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="500">Lakeshore County</text>

        <path
          d="M 280 50 Q 360 30 440 60 Q 480 100 470 180 Q 450 230 380 240 Q 310 230 280 170 Q 270 100 280 50 Z"
          fill="#B87333" fillOpacity="0.08" stroke="#B87333" strokeOpacity="0.2" strokeWidth="1"
        />
        <text x="380" y="255" textAnchor="middle" fill="#B87333" fontSize="11" fontWeight="500">Bayfield County</text>

        <path
          d="M 420 120 Q 490 90 560 120 Q 580 180 560 240 Q 520 280 460 270 Q 410 250 400 190 Q 400 150 420 120 Z"
          fill="#6B8F71" fillOpacity="0.08" stroke="#6B8F71" strokeOpacity="0.2" strokeWidth="1"
        />
        <text x="490" y="290" textAnchor="middle" fill="#6B8F71" fontSize="11" fontWeight="500">Ashland County</text>

        {/* Branch dots */}
        {branches.map((b) => (
          <g key={b.id}>
            <circle
              cx={b.x} cy={b.y}
              r={STATUS_RADIUS[b.status]}
              fill={COUNTY_COLORS[b.county] ?? '#475569'}
              fillOpacity={hovered?.id === b.id ? 1 : 0.7}
              stroke="#fff" strokeWidth="2"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHovered(b)}
              onMouseLeave={() => setHovered(null)}
            />
            {b.status === 'flagship' && (
              <circle
                cx={b.x} cy={b.y}
                r={STATUS_RADIUS[b.status] + 4}
                fill="none"
                stroke={COUNTY_COLORS[b.county] ?? '#475569'}
                strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 2"
              />
            )}
          </g>
        ))}
      </svg>

      {hovered && (
        <div
          className="absolute z-10 rounded-lg bg-white border p-3 shadow-lg pointer-events-none"
          style={{
            left: `${(hovered.x / width) * 100}%`,
            top: `${(hovered.y / height) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)',
            borderColor: '#D6D3D1',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{hovered.name}</p>
          <p className="text-xs" style={{ color: '#57534E' }}>{hovered.county} County · {hovered.status}</p>
          <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>
            {hovered.deposits} deposits · {hovered.members.toLocaleString()} members
          </p>
        </div>
      )}

      <div className="flex justify-center gap-6 mt-4">
        {Object.entries(COUNTY_COLORS).map(([county, color]) => (
          <div key={county} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs" style={{ color: '#57534E' }}>{county}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
