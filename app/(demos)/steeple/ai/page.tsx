'use client';

import { StatCard, OrbCard, PulseCard, CoachingCard, SpineEntryRow } from '@/components/demos/steeple';
import { orbs, pulseCards, coachingCards, spineEntries } from '@/data/steeple';
import { Sparkles, Radio, Activity, Shield } from 'lucide-react';
import Link from 'next/link';

const topPulse = pulseCards.filter(
  (c) => c.urgency === 'critical' || c.urgency === 'high'
).slice(0, 3);

const topCoaching = coachingCards.slice(0, 2);
const recentSpine = spineEntries.slice(0, 5);

export default function AIHubPage() {
  return (

      <div className="space-y-6">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl p-8 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #522398 0%, #06B6D4 100%)',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-white/15 p-2.5">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                AI-Powered Ministry Intelligence
              </h2>
            </div>
            <p className="max-w-2xl text-white/80">
              Five AI surfaces working together to monitor church health,
              surface actionable insights, answer questions from your data,
              maintain an immutable audit trail, and automate routine tasks —
              so your team can focus on ministry.
            </p>
          </div>
        </div>

        {/* Orbs grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {orbs.map((orb) => (
            <OrbCard key={orb.id} orb={orb} />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="AI Queries Today"
            value={42}
            icon={Sparkles}
            color="#2563EB"
          />
          <StatCard
            title="Active Insights"
            value={12}
            icon={Radio}
            color="#D97706"
          />
          <StatCard
            title="Health Score"
            value="87/100"
            icon={Activity}
            color="#7C3AED"
          />
          <StatCard
            title="Evidence Records"
            value="2.4K"
            icon={Shield}
            color="#059669"
          />
        </div>

        {/* Split panel: Pulse + Coaching */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Pulse Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2d3142]">
                Critical & High Insights
              </h3>
              <Link
                href="/steeple/ai/pulse"
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="space-y-3">
              {topPulse.map((card) => (
                <PulseCard key={card.id} card={card} />
              ))}
            </div>
          </div>

          {/* Top Coaching Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2d3142]">
                AI Coaching
              </h3>
              <Link
                href="/steeple/ai/pulse"
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="space-y-3">
              {topCoaching.map((card) => (
                <CoachingCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent AI Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2d3142]">
              Recent AI Activity
            </h3>
            <Link
              href="/steeple/ai/spine"
              className="text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              Full Audit Trail &rarr;
            </Link>
          </div>
          <div className="space-y-2">
            {recentSpine.map((entry) => (
              <SpineEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </div>

  );
}
