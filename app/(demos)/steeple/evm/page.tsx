'use client';

import { StatCard, ChartCard, EdgeBadge } from '@/components/demos/steeple';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { events, eventStats } from '@/data/steeple';

// Get upcoming events (next 10)
const now = new Date();
const upcomingEvents = events
  .filter(e => new Date(e.date) >= now)
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 10);

// Calculate event type distribution
const typeDistribution = events.reduce((acc, event) => {
  const existing = acc.find(item => item.type === event.type);
  if (existing) {
    existing.count += 1;
  } else {
    acc.push({ type: event.type, count: 1 });
  }
  return acc;
}, [] as { type: string; count: number }[]);

// Calculate volunteer totals
const totalVolunteersNeeded = upcomingEvents.reduce((sum, e) => sum + e.volunteers, 0);
const committedVolunteers = Math.floor(totalVolunteersNeeded * 0.72); // 72% committed

// Event type colors
const typeColors: Record<string, string> = {
  service: '#2563EB',
  program: '#7C3AED',
  community: '#059669',
  youth: '#D97706',
  special: '#DC2626',
};

const pieColors = typeDistribution.map(item => typeColors[item.type]);

// Type badge component
function TypeBadge({ type }: { type: string }) {
  const color = typeColors[type] || '#6B7280';
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

export default function EventsPage() {
  return (

      <div className="space-y-8">
        {/* Facility Conflict Alert */}
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">Facility Conflict Detected</p>
              <p className="text-sm text-amber-700">Fellowship Hall double-booked Apr 12 — Easter Prep vs Youth Event</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Events"
            value={eventStats.totalEvents}
            icon={Calendar}
            color="#7C3AED"
          />
          <StatCard
            title="This Month"
            value={eventStats.thisMonth}
            icon={Clock}
            color="#2563EB"
          />
          <StatCard
            title="Volunteers Needed"
            value={eventStats.volunteersNeeded}
            icon={Users}
            color="#059669"
          />
          <StatCard
            title="Rooms Booked"
            value={eventStats.roomsBooked}
            icon={MapPin}
            color="#D97706"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Event Type Breakdown */}
          <ChartCard title="Event Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }: { type?: string; percent?: number }) => `${type}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Volunteer Summary */}
          <ChartCard title="Volunteer Summary">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Volunteer Coverage</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {committedVolunteers} / {totalVolunteersNeeded}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-emerald-600 h-3 rounded-full transition-all"
                    style={{ width: `${(committedVolunteers / totalVolunteersNeeded) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((committedVolunteers / totalVolunteersNeeded) * 100)}% of volunteer positions filled
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                  <span className="text-sm font-medium text-green-900">Committed</span>
                  <span className="text-lg font-bold text-green-900">{committedVolunteers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                  <span className="text-sm font-medium text-orange-900">Still Needed</span>
                  <span className="text-lg font-bold text-orange-900">
                    {totalVolunteersNeeded - committedVolunteers}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                  <span className="text-sm font-medium text-purple-900">Total Positions</span>
                  <span className="text-lg font-bold text-purple-900">{totalVolunteersNeeded}</span>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Upcoming Events Calendar */}
        <ChartCard title="Upcoming Events">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Event Check-In</span>
            <EdgeBadge variant="offline" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, idx) => {
              const eventDate = new Date(event.date);
              const dateStr = eventDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const registered = Math.round(event.expectedAttendance * 0.71);
              const capacityPct = Math.round((registered / event.expectedAttendance) * 100);
              const waitlistCount = (event.expectedAttendance % 5) + 1;

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)] hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)] transition-all"
                >
                  {/* Date Badge */}
                  <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#522398] to-[#6B3FA0] px-3 py-2 min-w-[80px]">
                    <span className="text-xs font-medium text-white uppercase">
                      {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {eventDate.getDate()}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{event.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.time} - {event.endTime}
                        </p>
                      </div>
                      <TypeBadge type={event.type} />
                    </div>

                    <div className="flex items-center flex-wrap gap-3 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{event.expectedAttendance} expected</span>
                      </div>
                      {event.volunteers > 0 && (
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-[#522398]">
                          {event.volunteers} volunteers
                        </span>
                      )}
                    </div>

                    {/* Capacity & Waitlist Indicator */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{registered}/{event.expectedAttendance} registered</span>
                        {event.expectedAttendance > 200 && (
                          <span className="text-amber-600 font-medium">{waitlistCount} waitlisted</span>
                        )}
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: `${capacityPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

  );
}
