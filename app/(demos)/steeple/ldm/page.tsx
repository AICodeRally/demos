'use client';

import { StatCard, ChartCard, EdgeBadge } from '@/components/demos/steeple';
import {
  UserCog,
  Users,
  Clock,
  Award,
  Heart,
  DollarSign,
  Briefcase,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  PhoneCall,
  Home,
  UserPlus,
  Hospital,
} from 'lucide-react';
import {
  ministryTeams,
  volunteerLeaderboard,
  trainingRecords,
  ministryStats,
} from '@/data/steeple';

const statusColors: Record<string, string> = {
  current: '#059669',
  expiring: '#D97706',
  expired: '#DC2626',
};

// Mock data for new sections
const careActivities = [
  { id: 1, type: 'Hospital Visit', description: 'Member #142', date: '2026-02-16', pastor: 'Rev. Johnson' },
  { id: 2, type: 'Bereavement Follow-up', description: 'Family #89', date: '2026-02-16', pastor: 'Rev. Martinez' },
  { id: 3, type: 'Counseling Session', description: 'Member #203', date: '2026-02-15', pastor: 'Rev. Johnson' },
  { id: 4, type: 'Home Visit', description: 'Elderly Member #45', date: '2026-02-15', pastor: 'Deacon Smith' },
  { id: 5, type: 'New Member Check-in', description: 'New Family #312', date: '2026-02-14', pastor: 'Rev. Martinez' },
];

const carePipeline = [
  { type: 'Hospital Visits', count: 8, icon: Hospital, color: '#DC2626' },
  { type: 'Counseling Sessions', count: 12, icon: PhoneCall, color: '#7C3AED' },
  { type: 'Home Visits', count: 15, icon: Home, color: '#059669' },
  { type: 'New Member Check-ins', count: 18, icon: UserPlus, color: '#2563EB' },
];

const departmentBudgets = [
  { name: 'Worship', allocated: 45000, spent: 31200, color: '#7C3AED' },
  { name: 'Youth', allocated: 32000, spent: 21800, color: '#2563EB' },
  { name: 'Missions', allocated: 28000, spent: 18600, color: '#059669' },
  { name: 'Children\'s', allocated: 22000, spent: 14500, color: '#D97706' },
  { name: 'Facilities', allocated: 65000, spent: 43800, color: '#DC2626' },
  { name: 'Admin', allocated: 38000, spent: 24200, color: '#6B7280' },
];

const totalBudget = departmentBudgets.reduce((sum, dept) => sum + dept.allocated, 0);
const totalSpent = departmentBudgets.reduce((sum, dept) => sum + dept.spent, 0);

const staffMembers = [
  { id: 1, name: 'Rev. David Johnson', title: 'Senior Pastor', years: 8, email: 'd.johnson@church.org', responsibilities: 12 },
  { id: 2, name: 'Rev. Maria Martinez', title: 'Associate Pastor', years: 5, email: 'm.martinez@church.org', responsibilities: 9 },
  { id: 3, name: 'Jake Williams', title: 'Youth Pastor', years: 3, email: 'j.williams@church.org', responsibilities: 7 },
  { id: 4, name: 'Sarah Chen', title: 'Worship Director', years: 6, email: 's.chen@church.org', responsibilities: 8 },
  { id: 5, name: 'Emily Rodriguez', title: 'Children\'s Director', years: 4, email: 'e.rodriguez@church.org', responsibilities: 6 },
  { id: 6, name: 'Michael Thompson', title: 'Admin Director', years: 7, email: 'm.thompson@church.org', responsibilities: 11 },
  { id: 7, name: 'Tom Anderson', title: 'Facilities Manager', years: 9, email: 't.anderson@church.org', responsibilities: 5 },
  { id: 8, name: 'Lisa Park', title: 'Communications Coordinator', years: 2, email: 'l.park@church.org', responsibilities: 8 },
];

const churchGoals = [
  { name: 'Sunday Attendance', target: 850, actual: 812, unit: '', trend: 'down' },
  { name: 'Small Group Participation', target: 60, actual: 42, unit: '%', trend: 'up' },
  { name: 'Volunteer Ratio', target: 4.0, actual: 4.4, unit: ':1', trend: 'down', reverse: true },
  { name: 'Giving Per Capita', target: 900, actual: 861, unit: '$', trend: 'up' },
  { name: 'New Members/Month', target: 25, actual: 23, unit: '', trend: 'down' },
];

const bgCheckStatuses = [
  { label: 'Cleared', className: 'bg-emerald-50 text-emerald-700' },
  { label: 'Cleared', className: 'bg-emerald-50 text-emerald-700' },
  { label: 'Pending', className: 'bg-amber-50 text-amber-700' },
  { label: 'Cleared', className: 'bg-emerald-50 text-emerald-700' },
  { label: 'Expired', className: 'bg-red-50 text-red-600' },
  { label: 'Cleared', className: 'bg-emerald-50 text-emerald-700' },
  { label: 'Cleared', className: 'bg-emerald-50 text-emerald-700' },
  { label: 'Pending', className: 'bg-amber-50 text-amber-700' },
];

const volunteerQualifications: Record<number, string[]> = {
  1: ['Background Cleared', 'First Aid'],
  2: ['Background Cleared', 'Child Safety'],
  3: ['Child Safety'],
  4: ['First Aid', 'Background Cleared'],
  5: ['Child Safety', 'First Aid', 'Background Cleared'],
  6: ['Background Cleared'],
  7: ['First Aid'],
  8: ['Child Safety', 'Background Cleared'],
};

const qualificationColors: Record<string, string> = {
  'First Aid': 'bg-blue-50 text-blue-700',
  'Child Safety': 'bg-purple-50 text-purple-700',
  'Background Cleared': 'bg-emerald-50 text-emerald-700',
};

export default function LeadershipPage() {
  return (

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Teams"
            value={ministryStats.activeTeams}
            icon={UserCog}
            color="#2563EB"
          />
          <StatCard
            title="Total Volunteers"
            value={ministryStats.totalVolunteers}
            icon={Users}
            color="#059669"
          />
          <StatCard
            title="Monthly Hours"
            value={ministryStats.totalHoursMonthly.toLocaleString()}
            icon={Clock}
            color="#7C3AED"
          />
          <StatCard
            title="Certifications Current"
            value={ministryStats.certificationsCurrent}
            icon={Award}
            color="#D97706"
          />
        </div>

        {/* Pastoral Care Dashboard */}
        <ChartCard title={<span className="flex items-center gap-3">Pastoral Care Dashboard <EdgeBadge variant="sealed" /></span>}>
          <div className="space-y-6">
            {/* Care Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-50 p-2">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Cases</p>
                    <p className="text-2xl font-semibold text-gray-900">23</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent Response</p>
                  <p className="text-2xl font-semibold text-gray-900">4 hrs</p>
                  <p className="text-xs text-gray-500 mt-1">Average time</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                <div>
                  <p className="text-sm font-medium text-gray-600">Standard Response</p>
                  <p className="text-2xl font-semibold text-gray-900">24 hrs</p>
                  <p className="text-xs text-gray-500 mt-1">Average time</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-semibold text-gray-900">53</p>
                  <p className="text-xs text-gray-500 mt-1">Total visits</p>
                </div>
              </div>
            </div>

            {/* Care Pipeline */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Care Pipeline (This Month)</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {carePipeline.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.type} className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg p-2" style={{ backgroundColor: `${item.color}20` }}>
                            <Icon className="h-5 w-5" style={{ color: item.color }} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">{item.type}</p>
                            <p className="text-xl font-semibold text-gray-900">{item.count}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Care Activities */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Care Activities</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Pastor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {careActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-[#faf8f4]">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {activity.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {activity.description}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {activity.pastor}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Department Budgets */}
        <ChartCard title="Department Budgets">
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#522398]/10 p-2">
                    <DollarSign className="h-5 w-5 text-[#522398]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${(totalBudget / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Annual</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Spent YTD</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${(totalSpent / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {((totalSpent / totalBudget) * 100).toFixed(0)}% of budget
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-50 p-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Remaining</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${((totalBudget - totalSpent) / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Budget Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departmentBudgets.map((dept) => {
                const percentSpent = (dept.spent / dept.allocated) * 100;
                const remaining = dept.allocated - dept.spent;
                return (
                  <div
                    key={dept.name}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)] hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)] transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-semibold text-gray-900">{dept.name}</h4>
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Allocated</span>
                        <span className="font-medium text-gray-900">
                          ${(dept.allocated / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent</span>
                        <span className="font-medium text-gray-900">
                          ${(dept.spent / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining</span>
                        <span className="font-medium text-green-600">
                          ${(remaining / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{percentSpent.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(percentSpent, 100)}%`,
                              backgroundColor: dept.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartCard>

        {/* Staff Directory */}
        <ChartCard title="Staff Directory">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {staffMembers.map((staff, index) => (
              <div
                key={staff.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)] hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)] transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-[#522398]/10 p-2">
                    <Briefcase className="h-5 w-5 text-[#522398]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {staff.name}
                    </h4>
                    <p className="text-xs text-gray-600">{staff.title}</p>
                  </div>
                  {bgCheckStatuses[index] && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${bgCheckStatuses[index].className}`}>
                      {bgCheckStatuses[index].label}
                    </span>
                  )}
                </div>
                {/* Pastoral care case count for pastors/elders */}
                {(staff.title.includes('Pastor') || staff.title.includes('Associate')) && (
                  <div className="mb-2">
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">3 active cases</span>
                  </div>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Years of Service</span>
                    <span className="font-medium text-gray-900">{staff.years}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Responsibilities</span>
                    <span className="font-medium text-gray-900">{staff.responsibilities}</span>
                  </div>
                  {/* Volunteer Qualification Tags */}
                  {volunteerQualifications[staff.id] && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {volunteerQualifications[staff.id].map((qual) => (
                        <span key={qual} className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${qualificationColors[qual] || 'bg-gray-50 text-gray-600'}`}>
                          {qual}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600 truncate">{staff.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Goals & KPIs */}
        <ChartCard title="Church Goals & KPIs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {churchGoals.map((goal) => {
              const percentage = goal.reverse
                ? (goal.target / goal.actual) * 100
                : (goal.actual / goal.target) * 100;
              const isOnTrack = percentage >= 95;
              const getTrendIcon = () => {
                if (goal.trend === 'up') return TrendingUp;
                if (goal.trend === 'down') return TrendingDown;
                return Minus;
              };
              const TrendIcon = getTrendIcon();
              const trendColor = goal.trend === 'up' ? '#059669' : goal.trend === 'down' ? '#DC2626' : '#6B7280';

              return (
                <div
                  key={goal.name}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)] hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)] transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`rounded-lg p-2 ${isOnTrack ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                      <Target className={`h-5 w-5 ${isOnTrack ? 'text-green-600' : 'text-amber-600'}`} />
                    </div>
                    <TrendIcon className="h-4 w-4 ml-auto" style={{ color: trendColor }} />
                  </div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">{goal.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Target</span>
                      <span className="font-medium text-gray-900">
                        {goal.unit === '$' && goal.unit}
                        {goal.name === 'Volunteer Ratio' ? '1:' : ''}
                        {goal.target}
                        {goal.unit !== '$' && goal.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Actual</span>
                      <span className={`font-semibold ${isOnTrack ? 'text-green-600' : 'text-amber-600'}`}>
                        {goal.unit === '$' && goal.unit}
                        {goal.name === 'Volunteer Ratio' ? '1:' : ''}
                        {goal.actual}
                        {goal.unit !== '$' && goal.unit}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.min(percentage, 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isOnTrack ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Ministry Teams */}
        <ChartCard title="Ministry Teams">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {ministryTeams.map((team) => (
              <div
                key={team.id}
                className="relative rounded-xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(82,35,152,0.06)] hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)] transition-shadow overflow-hidden"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: team.color }}
                />
                <div className="pl-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900">{team.name}</h4>
                      <p className="mt-1 text-sm text-gray-600">{team.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Leader</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">{team.leader}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Members</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">{team.memberCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Monthly Hours</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">{team.volunteerHours}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Meetings</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">{team.meetingSchedule}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Volunteer Leaderboard */}
        <ChartCard title="Top Volunteers (This Month)">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {volunteerLeaderboard.map((volunteer, index) => (
                  <tr key={volunteer.id} className="hover:bg-[#faf8f4]">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#522398]/8">
                        <span className="font-semibold text-[#522398]">{index + 1}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {volunteer.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className="inline-flex items-center rounded-full bg-[#522398]/10 px-2.5 py-0.5 text-xs font-medium text-[#522398]">
                        {volunteer.hours} hrs
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {volunteer.team}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {volunteer.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Training & Certifications */}
        <ChartCard title="Training & Certifications">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Certification
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Expires
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {trainingRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[#faf8f4]">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {record.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {record.certification}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {new Date(record.completedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {new Date(record.expiresDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white capitalize"
                        style={{ backgroundColor: statusColors[record.status] }}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

  );
}
