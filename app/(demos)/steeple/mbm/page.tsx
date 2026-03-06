'use client';

import { StatCard, ChartCard, EdgeBadge } from '@/components/demos/steeple';
import {
  Users,
  UserPlus,
  UserCheck,
  TrendingUp,
  Search,
  Mail,
  Calendar,
  MapPin,
  UsersRound,
  Heart,
  Trophy,
  Clock,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { members, memberStats } from '@/data/steeple';
import { useState } from 'react';

// Lifecycle stage badges for member progression tracking
const lifecycleStages: Record<string, { label: string; className: string }> = {
  visitor: { label: 'Visitor', className: 'bg-gray-100 text-gray-600' },
  regular: { label: 'Regular', className: 'bg-blue-50 text-blue-700' },
  member: { label: 'Member', className: 'bg-purple-50 text-[#522398]' },
  leader: { label: 'Leader', className: 'bg-amber-50 text-[#C5972C]' },
};

// Map memberType to lifecycle stage
function getLifecycleStage(memberType: string, index: number): keyof typeof lifecycleStages {
  if (['elder', 'deacon', 'staff'].includes(memberType)) return 'leader';
  if (memberType === 'visitor') return 'visitor';
  // Alternate between 'member' and 'regular' for plain members
  return index % 3 === 0 ? 'regular' : 'member';
}

// Engagement health scores (mock, cycled by member index)
const engagementScores = [85, 72, 91, 45, 68, 88, 34, 76, 93, 58];

function getEngagementColor(score: number): string {
  if (score >= 70) return 'text-emerald-600 border-emerald-200 bg-emerald-50';
  if (score >= 40) return 'text-amber-600 border-amber-200 bg-amber-50';
  return 'text-red-500 border-red-200 bg-red-50';
}

// Status colors
const statusColors: Record<string, string> = {
  active: '#059669',
  inactive: '#6B7280',
  visitor: '#D97706',
};

// Role badge colors
const roleColors: Record<string, string> = {
  member: '#6B7280',
  visitor: '#D97706',
  staff: '#2563EB',
  elder: '#7C3AED',
  deacon: '#059669',
};

// Calculate status distribution
const statusDistribution = [
  { name: 'Active', value: memberStats.activeMembers, color: statusColors.active },
  { name: 'Visitors', value: memberStats.visitors, color: statusColors.visitor },
  { name: 'Inactive', value: memberStats.totalMembers - memberStats.activeMembers - memberStats.visitors, color: statusColors.inactive },
];

// Mock membership growth data (last 6 months)
const membershipGrowth = [
  { month: 'Sep', members: 2089 },
  { month: 'Oct', members: 2103 },
  { month: 'Nov', members: 2118 },
  { month: 'Dec', members: 2125 },
  { month: 'Jan', members: 2138 },
  { month: 'Feb', members: 2147 },
];

// Mock visitor pipeline data
const visitorPipeline = [
  { stage: 'First Visit', count: 32, color: '#D97706' },
  { stage: 'Follow-up Call', count: 24, color: '#F59E0B' },
  { stage: 'Attended Again', count: 18, color: '#FBBF24' },
  { stage: 'Newcomers Class', count: 15, color: '#84CC16' },
  { stage: 'Application', count: 13, color: '#22C55E' },
  { stage: 'Member', count: 11, color: '#059669' },
];

const visitorExamples = [
  { name: 'Sarah Johnson', stage: 'First Visit', date: '2/15/26' },
  { name: 'Michael Chen', stage: 'Follow-up Call', date: '2/12/26' },
  { name: 'Emily Rodriguez', stage: 'Attended Again', date: '2/8/26' },
  { name: 'David Kim', stage: 'First Visit', date: '2/14/26' },
  { name: 'Jessica Martinez', stage: 'Newcomers Class', date: '2/5/26' },
  { name: 'Robert Taylor', stage: 'Application', date: '2/1/26' },
  { name: 'Amanda White', stage: 'Follow-up Call', date: '2/10/26' },
  { name: 'James Wilson', stage: 'Attended Again', date: '2/7/26' },
  { name: 'Lisa Anderson', stage: 'Member', date: '1/30/26' },
  { name: 'Christopher Lee', stage: 'Newcomers Class', date: '2/3/26' },
];

// Mock small groups data
const smallGroups = [
  {
    name: "Men's Bible Study",
    leader: 'Pastor David',
    day: 'Tuesday',
    time: '6:30 AM',
    location: 'Fellowship Hall',
    current: 12,
    capacity: 15,
    topic: 'Book of James',
    type: "Men's",
  },
  {
    name: "Women's Prayer Circle",
    leader: 'Sarah Mitchell',
    day: 'Wednesday',
    time: '9:00 AM',
    location: 'Room 201',
    current: 18,
    capacity: 20,
    topic: 'Prayer & Worship',
    type: "Women's",
  },
  {
    name: 'Young Adults Fellowship',
    leader: 'Marcus Johnson',
    day: 'Friday',
    time: '7:00 PM',
    location: 'Youth Center',
    current: 24,
    capacity: 30,
    topic: 'Life & Faith',
    type: 'Young Adults',
  },
  {
    name: 'Couples Connection',
    leader: 'Mike & Amy Chen',
    day: 'Saturday',
    time: '6:00 PM',
    location: 'Home Rotation',
    current: 8,
    capacity: 10,
    topic: 'Marriage Enrichment',
    type: 'Couples',
  },
  {
    name: 'Parents Support Group',
    leader: 'Jennifer White',
    day: 'Thursday',
    time: '7:00 PM',
    location: 'Room 105',
    current: 15,
    capacity: 18,
    topic: 'Parenting Wisdom',
    type: 'Parents',
  },
  {
    name: 'Sunday Morning Study',
    leader: 'Elder Robert',
    day: 'Sunday',
    time: '9:00 AM',
    location: 'Classroom A',
    current: 22,
    capacity: 25,
    topic: 'Romans Deep Dive',
    type: 'Bible Study',
  },
  {
    name: 'Celebrate Recovery',
    leader: 'Chris Taylor',
    day: 'Monday',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    current: 14,
    capacity: 20,
    topic: 'Addiction & Healing',
    type: 'Recovery',
  },
  {
    name: 'Northside Neighbors',
    leader: 'Lisa Anderson',
    day: 'Wednesday',
    time: '7:30 PM',
    location: 'Anderson Home',
    current: 10,
    capacity: 12,
    topic: 'Community & Service',
    type: 'Neighborhood',
  },
];

// Mock family units data
const topFamilies = [
  { name: 'The Johnson Family', members: 5, score: 98, engagement: 'Exceptional' },
  { name: 'The Martinez Family', members: 4, score: 95, engagement: 'Exceptional' },
  { name: 'The Chen Family', members: 3, score: 92, engagement: 'High' },
  { name: 'The Williams Family', members: 6, score: 89, engagement: 'High' },
  { name: 'The Anderson Family', members: 4, score: 87, engagement: 'High' },
];

const newFamilies = [
  { name: 'The Rodriguez Family', joined: '2/12/26', members: 4 },
  { name: 'The Kim Family', joined: '2/10/26', members: 3 },
  { name: 'The Taylor Family', joined: '2/8/26', members: 5 },
  { name: 'The White Family', joined: '2/5/26', members: 2 },
  { name: 'The Garcia Family', joined: '2/3/26', members: 4 },
  { name: 'The Lee Family', joined: '2/2/26', members: 3 },
  { name: 'The Thomas Family', joined: '2/1/26', members: 4 },
  { name: 'The Moore Family', joined: '1/29/26', members: 2 },
];

// Mock engagement heatmap data (4 weeks x 7 days)
const heatmapData = [
  { week: 'Week 1', Sun: 85, Mon: 12, Tue: 18, Wed: 45, Thu: 22, Fri: 15, Sat: 25 },
  { week: 'Week 2', Sun: 88, Mon: 10, Tue: 20, Wed: 48, Thu: 19, Fri: 17, Sat: 28 },
  { week: 'Week 3', Sun: 82, Mon: 15, Tue: 16, Wed: 42, Thu: 24, Fri: 14, Sat: 22 },
  { week: 'Week 4', Sun: 90, Mon: 13, Tue: 19, Wed: 50, Thu: 21, Fri: 18, Sat: 30 },
];

// Role badge component
function RoleBadge({ role }: { role: string }) {
  const color = roleColors[role] || '#6B7280';
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] || '#6B7280';
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Attendance rate bar component
function AttendanceBar({ rate }: { rate: number }) {
  let color = '#DC2626'; // red
  if (rate >= 80) color = '#059669'; // green
  else if (rate >= 60) color = '#D97706'; // orange

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${rate}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 min-w-[3ch] text-right">
        {rate}%
      </span>
    </div>
  );
}

// Heatmap cell component
function HeatmapCell({ value, day }: { value: number; day: string }) {
  let bgColor = '#F3F4F6'; // very light gray
  let textColor = '#6B7280';

  if (value >= 70) {
    bgColor = '#047857'; // strong green with warmer tone
    textColor = '#FFFFFF';
  } else if (value >= 40) {
    bgColor = '#10B981'; // medium green with warmer tone
    textColor = '#FFFFFF';
  } else if (value >= 20) {
    bgColor = '#86EFAC'; // light green with warmer tone
    textColor = '#065F46';
  } else if (value >= 10) {
    bgColor = '#D1FAE5'; // very light green
    textColor = '#065F46';
  }

  return (
    <div
      className="flex items-center justify-center h-12 rounded font-medium text-sm transition-all hover:scale-105"
      style={{ backgroundColor: bgColor, color: textColor }}
      title={`${day}: ${value}% attendance`}
    >
      {value}%
    </div>
  );
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter members by search term
  const filteredMembers = members
    .filter(member => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        member.firstName.toLowerCase().includes(search) ||
        member.lastName.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search)
      );
    })
    .slice(0, 20);

  // Calculate small groups participation
  const totalInGroups = smallGroups.reduce((sum, g) => sum + g.current, 0);
  const groupParticipationRate = Math.round((totalInGroups / memberStats.activeMembers) * 100);

  return (

      <div className="space-y-8">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Members"
            value={memberStats.totalMembers.toLocaleString()}
            change={3.2}
            icon={Users}
            color="#059669"
          />
          <StatCard
            title="Active Members"
            value={memberStats.activeMembers.toLocaleString()}
            icon={UserCheck}
            color="#2563EB"
          />
          <StatCard
            title="Visitors"
            value={memberStats.visitors}
            icon={UserPlus}
            color="#D97706"
          />
          <StatCard
            title="New This Month"
            value={memberStats.newThisMonth}
            change={15.8}
            icon={TrendingUp}
            color="#7C3AED"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Membership Growth */}
          <ChartCard title="Membership Growth">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={membershipGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[2050, 2200]}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [(value ?? 0).toLocaleString(), 'Members']}
                />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="#522398"
                  strokeWidth={2}
                  dot={{ fill: '#522398', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Member Status Breakdown */}
          <ChartCard title="Member Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }: { name?: string; value?: number; percent?: number }) =>
                    `${name}: ${(value ?? 0).toLocaleString()} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Visitor Follow-up Pipeline */}
        <ChartCard title="Visitor Follow-up Pipeline">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-gray-600">Conversion Rate: First Visit → Member</span>
              <span className="font-semibold text-green-600">34%</span>
            </div>

            {/* Funnel Visualization */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical"
                data={visitorPipeline}
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="stage"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={110}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {visitorPipeline.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Visitor Examples */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Visitors</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {visitorExamples.map((visitor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#faf8f4] rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#522398] to-[#6B3FA0] flex items-center justify-center text-white text-xs font-semibold">
                      {visitor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{visitor.name}</div>
                      <div className="text-xs text-gray-500">{visitor.stage}</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{visitor.date}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Small Groups Section */}
        <ChartCard title="Small Groups">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                Group Participation Rate: <span className="font-semibold text-gray-900">{groupParticipationRate}%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Target: 60% | Current: {totalInGroups.toLocaleString()} members in groups</div>
            </div>
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{smallGroups.length}</span>
              <span className="text-sm text-gray-600">Active Groups</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {smallGroups.map((group, idx) => {
              const capacityPercent = Math.round((group.current / group.capacity) * 100);
              let capacityColor = '#059669'; // green
              if (capacityPercent >= 90) capacityColor = '#DC2626'; // red
              else if (capacityPercent >= 75) capacityColor = '#D97706'; // orange

              return (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-white shadow-[0_1px_3px_rgba(82,35,152,0.06)]"
                >
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{group.name}</h4>
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: '#2563EB15',
                        color: '#2563EB',
                      }}
                    >
                      {group.type}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span className="font-medium text-gray-900">{group.leader}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{group.day}s, {group.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{group.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      <span className="italic">{group.topic}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-semibold" style={{ color: capacityColor }}>
                        {group.current}/{group.capacity}
                      </span>
                    </div>
                    <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${capacityPercent}%`,
                          backgroundColor: capacityColor,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Family Units Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Families */}
          <ChartCard title="Top Engaged Families">
            <div className="mb-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">847</div>
                <div className="text-xs text-gray-600">Family Units</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">2.5</div>
                <div className="text-xs text-gray-600">Avg Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-xs text-gray-600">New This Month</div>
              </div>
            </div>

            <div className="space-y-3">
              {topFamilies.map((family, idx) => {
                const colors = ['#F59E0B', '#94A3B8', '#CD7F32', '#6B7280', '#9CA3AF'];
                const medals = ['🥇', '🥈', '🥉', '', ''];

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-[#faf8f4] rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{medals[idx] || <Trophy className="h-5 w-5 text-gray-400" />}</div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{family.name}</div>
                        <div className="text-xs text-gray-500">{family.members} members</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: colors[idx] }}>
                        {family.score}
                      </div>
                      <div className="text-xs text-gray-500">{family.engagement}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* New Families */}
          <ChartCard title="New Families This Month">
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
              {newFamilies.map((family, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{family.name}</div>
                      <div className="text-xs text-gray-600">{family.members} members</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Joined</div>
                    <div className="text-sm font-medium text-gray-900">{family.joined}</div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Engagement Heatmap */}
        <ChartCard title="Attendance Patterns (Last 4 Weeks)">
          <div className="mb-4 text-sm text-gray-600">
            Peak attendance: <span className="font-semibold text-gray-900">Sunday AM (86% avg)</span> |
            Secondary peak: <span className="font-semibold text-gray-900">Wednesday PM (46% avg)</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Days header */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="text-xs font-semibold text-gray-600 text-right pr-2">Week</div>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs font-semibold text-gray-600 text-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Heatmap rows */}
              {heatmapData.map((week, idx) => (
                <div key={idx} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="text-xs text-gray-600 text-right pr-2 flex items-center justify-end">
                    {week.week}
                  </div>
                  <HeatmapCell value={week.Sun} day="Sunday" />
                  <HeatmapCell value={week.Mon} day="Monday" />
                  <HeatmapCell value={week.Tue} day="Tuesday" />
                  <HeatmapCell value={week.Wed} day="Wednesday" />
                  <HeatmapCell value={week.Thu} day="Thursday" />
                  <HeatmapCell value={week.Fri} day="Friday" />
                  <HeatmapCell value={week.Sat} day="Saturday" />
                </div>
              ))}

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-6 justify-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gray-100"></div>
                    <span className="text-gray-600">0-10%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-100"></div>
                    <span className="text-gray-600">10-20%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-300"></div>
                    <span className="text-gray-600">20-40%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-500"></div>
                    <span className="text-gray-600">40-70%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-700"></div>
                    <span className="text-gray-600">70%+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Members Directory */}
        <ChartCard title="Members Directory">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#522398] focus:border-transparent"
                />
              </div>
              <EdgeBadge variant="local" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-900">Lifecycle</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="pb-3 text-center text-sm font-semibold text-gray-900">Health</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-900">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member, idx) => {
                  const joinDate = new Date(member.joinDate);
                  const joinDateStr = joinDate.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  });
                  const stage = getLifecycleStage(member.memberType, idx);
                  const stageConfig = lifecycleStages[stage];
                  const healthScore = engagementScores[idx % engagementScores.length];
                  const healthColor = getEngagementColor(healthScore);

                  return (
                    <tr key={member.id} className="hover:bg-[#faf8f4]">
                      <td className="py-4">
                        <div className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate max-w-[200px]">{member.email}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <RoleBadge role={member.memberType} />
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${stageConfig.className}`}>
                          {stageConfig.label}
                        </span>
                      </td>
                      <td className="py-4">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${healthColor}`}>
                          {healthScore}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {joinDateStr}
                      </td>
                      <td className="py-4">
                        <AttendanceBar rate={member.attendanceRate} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {searchTerm && filteredMembers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No members found matching "{searchTerm}"
            </div>
          )}

          {!searchTerm && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing 20 of {members.length} members
            </div>
          )}
        </ChartCard>
        {/* Household View */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
          <h3 className="text-lg font-semibold text-[#2d3142]">Household View</h3>
          <div className="mt-4 space-y-4">
            {[
              { family: 'Johnson Family', members: ['Michael Johnson', 'Jennifer Johnson', 'Emily Johnson', 'Jake Johnson'], count: 4 },
              { family: 'Williams Family', members: ['Sarah Williams', 'David Williams'], count: 2 },
              { family: 'Anderson Family', members: ['Robert Anderson', 'Mary Anderson', 'Thomas Anderson'], count: 3 },
            ].map((household) => (
              <div key={household.family} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#2d3142]">{household.family}</h4>
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#522398]">{household.count} members</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {household.members.map((name) => (
                    <span key={name} className="rounded-lg bg-gray-50 px-2.5 py-1 text-sm text-gray-600">{name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

  );
}
