'use client';

import { useState } from 'react';
import { StatCard, SpineEntryRow, EdgeBadge } from '@/components/demos/steeple';
import { spineEntries } from '@/data/steeple';
import type { SpineEntryData } from '@/data/steeple/ai-platform';
import { Shield, Calendar, Layers, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpineCategory = SpineEntryData['category'] | 'all';

const categoryFilters: { label: string; value: SpineCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Financial', value: 'financial' },
  { label: 'Membership', value: 'membership' },
  { label: 'Governance', value: 'governance' },
  { label: 'Facility', value: 'facility' },
  { label: 'Communication', value: 'communication' },
];

export default function SpinePage() {
  const [category, setCategory] = useState<SpineCategory>('all');

  const filtered =
    category === 'all'
      ? spineEntries
      : spineEntries.filter((e) => e.category === category);

  return (

      <div className="space-y-6">
        <div className="flex justify-end">
          <EdgeBadge variant="sealed" />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Records"
            value="2,412"
            icon={Shield}
            color="#059669"
          />
          <StatCard
            title="This Week"
            value={47}
            icon={Calendar}
            color="#7C3AED"
          />
          <StatCard
            title="Categories"
            value={5}
            icon={Layers}
            color="#2563EB"
          />
          <StatCard
            title="Compliance Score"
            value="95%"
            icon={CheckCircle}
            color="#059669"
          />
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
            Category
          </span>
          {categoryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setCategory(f.value)}
              className={cn(
                'rounded-full px-3 py-1 text-[11px] font-semibold transition-all',
                category === f.value
                  ? 'bg-[#522398] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Spine entries */}
        <div className="space-y-2">
          {filtered.map((entry) => (
            <SpineEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

  );
}
