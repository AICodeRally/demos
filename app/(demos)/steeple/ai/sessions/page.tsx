'use client';

import { StatCard, SessionCard, EdgeBadge } from '@/components/demos/steeple';
import { aiSessions } from '@/data/steeple';
import { Bot, Zap, CheckCircle, BarChart3 } from 'lucide-react';

const activeSessions = aiSessions.filter((s) => s.status === 'ACTIVE').length;
const completedToday = aiSessions.filter((s) => s.status === 'COMPLETED').length;
const avgTurns = Math.round(
  aiSessions.reduce((sum, s) => sum + s.turns, 0) / aiSessions.length
);

export default function SessionsPage() {
  return (

      <div className="space-y-6">
        <div className="flex justify-end">
          <EdgeBadge variant="sync" />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Sessions"
            value={48}
            icon={Bot}
            color="#8B5CF6"
          />
          <StatCard
            title="Active Now"
            value={activeSessions}
            icon={Zap}
            color="#10B981"
          />
          <StatCard
            title="Completed Today"
            value={completedToday}
            icon={CheckCircle}
            color="#059669"
          />
          <StatCard
            title="Avg Turns"
            value={avgTurns}
            icon={BarChart3}
            color="#D97706"
          />
        </div>

        {/* Session list */}
        <div className="grid gap-4 sm:grid-cols-2">
          {aiSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>

  );
}
