'use client';

import Link from 'next/link';
import {
  HeartPulse,
  Radio,
  MessageSquareText,
  Lightbulb,
} from 'lucide-react';
import type { OrbDef } from '@/data/equipr/ai-platform';

const iconMap: Record<string, typeof HeartPulse> = {
  HeartPulse,
  Radio,
  MessageSquareText,
  Lightbulb,
};

const statusColors: Record<OrbDef['status'], string> = {
  online: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',
};

export function OrbCard({ orb }: { orb: OrbDef }) {
  const Icon = iconMap[orb.icon] ?? HeartPulse;
  const dotColor = statusColors[orb.status];

  return (
    <Link
      href={orb.href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(37,99,235,0.06)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(37,99,235,0.12)]"
    >
      {/* Gradient top border */}
      <div
        className="h-1"
        style={{
          background: `linear-gradient(to right, ${orb.color}, ${orb.colorEnd})`,
        }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Icon + status */}
        <div className="flex items-center justify-between">
          <div
            className="rounded-lg p-2.5"
            style={{ backgroundColor: `${orb.color}12` }}
          >
            <Icon className="h-5 w-5" style={{ color: orb.color }} />
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: dotColor,
                boxShadow: `0 0 6px ${dotColor}60`,
              }}
            />
            <span className="text-[11px] font-medium text-gray-500">
              {orb.statusText}
            </span>
          </div>
        </div>

        {/* Name + description */}
        <h3 className="mt-3 text-sm font-semibold text-[#2d3142]">
          {orb.name}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">{orb.description}</p>

        {/* Stat */}
        <div className="mt-auto pt-4">
          <div className="text-2xl font-bold font-mono text-[#2d3142]">
            {orb.stat}
          </div>
          <div className="text-[11px] font-medium text-gray-400">
            {orb.statLabel}
          </div>
        </div>
      </div>
    </Link>
  );
}
