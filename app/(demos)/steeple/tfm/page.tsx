'use client';


import { StatCard, ChartCard, EdgeBadge, MarketCallout } from '@/components/demos/steeple';
import {
  DollarSign,
  TrendingUp,
  Target,
  Percent,
  Download,
} from 'lucide-react';
import {
  weeklyTotals,
  fundAllocations,
  recentDonations,
  pledgeCampaigns,
  donationStats,
} from '@/data/steeple';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function TithingPage() {
  const last12Weeks = weeklyTotals.slice(-12);
  const first10Donations = recentDonations.slice(0, 10);

  const fundChartData = fundAllocations.map((fund) => ({
    name: fund.fund.replace(' Fund', '').replace(' Ministry', ''),
    value: fund.percentage,
    amount: fund.amount,
    color: fund.color,
  }));

  const weeklyChartData = last12Weeks.map((week) => ({
    week: `Wk ${week.week}`,
    date: week.date,
    total: week.total,
  }));

  const methodLabels: Record<string, string> = {
    online: 'Online',
    check: 'Check',
    cash: 'Cash',
    ach: 'ACH',
  };

  const fundColors: Record<string, string> = {
    'General Fund': 'bg-purple-50 text-[#522398]',
    'Missions Fund': 'bg-amber-50 text-amber-700',
    'Building Fund': 'bg-indigo-50 text-indigo-700',
    'Youth Ministry': 'bg-emerald-50 text-emerald-700',
    'Benevolence Fund': 'bg-rose-50 text-rose-700',
  };

  return (

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="YTD Total Giving"
            value={currencyFormatter.format(donationStats.ytdTotal)}
            icon={DollarSign}
            color="#2563EB"
          />
          <StatCard
            title="Monthly Giving"
            value={currencyFormatter.format(donationStats.mtdTotal)}
            icon={TrendingUp}
            color="#059669"
          />
          <StatCard
            title="Avg Weekly Giving"
            value={currencyFormatter.format(donationStats.avgWeeklyGiving)}
            change={5.8}
            icon={Target}
            color="#7C3AED"
          />
          <StatCard
            title="Pledge Fulfillment"
            value={`${donationStats.pledgeFulfillmentRate}%`}
            icon={Percent}
            color="#D97706"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Fund Allocation Chart */}
          <ChartCard title="Fund Allocation (YTD)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fundChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip
                  formatter={(value, _name, props) => [
                    `${value ?? 0}% (${currencyFormatter.format((props as any).payload.amount)})`,
                    'Allocation',
                  ]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {fundChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Weekly Giving Trend */}
          <ChartCard title="Weekly Giving Trend (Last 12 Weeks)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number | undefined) => [currencyFormatter.format(value ?? 0), 'Total']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${label} - ${payload[0].payload.date}`;
                    }
                    return label;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#522398"
                  strokeWidth={2}
                  dot={{ fill: '#522398', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Donations Table */}
        <ChartCard title="Recent Donations">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fund
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {first10Donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-[#faf8f4]">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {donation.memberName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {currencyFormatter.format(donation.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${fundColors[donation.fund] || 'bg-gray-50 text-gray-600'}`}>
                        {donation.fund}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className="inline-flex items-center rounded-full bg-[#522398]/10 px-2.5 py-0.5 text-xs font-medium text-[#522398]">
                        {methodLabels[donation.method]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {new Date(donation.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Pledge Campaigns */}
        <ChartCard title="Active Pledge Campaigns">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {pledgeCampaigns.map((campaign) => {
              const percentage = Math.round((campaign.raised / campaign.goal) * 100);
              const remaining = campaign.goal - campaign.raised;

              return (
                <div key={campaign.id} className="rounded-xl border border-gray-100 bg-[#faf8f4] p-4">
                  <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {currencyFormatter.format(campaign.raised)}
                    </span>
                    <span className="text-sm text-gray-600">
                      of {currencyFormatter.format(campaign.goal)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{percentage}% Complete</span>
                      <span>{campaign.pledgeCount} pledges</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-[#522398]"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Remaining: {currencyFormatter.format(remaining)}</span>
                    <span>
                      Ends: {new Date(campaign.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Batch Reconciliation */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
          <h3 className="text-lg font-semibold text-[#2d3142]">Batch Reconciliation</h3>
          <div className="mt-4 space-y-3">
            {[
              { id: '#247', entries: 23, total: '$4,280', status: 'Pending Review', statusColor: 'bg-amber-50 text-amber-700' },
              { id: '#246', entries: 31, total: '$6,120', status: 'Reconciled', statusColor: 'bg-emerald-50 text-emerald-700' },
              { id: '#245', entries: 18, total: '$3,450', status: 'In Review', statusColor: 'bg-purple-50 text-[#522398]' },
            ].map((batch) => (
              <div key={batch.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                <div>
                  <span className="font-semibold text-[#2d3142]">Batch {batch.id}</span>
                  <span className="ml-2 text-sm text-gray-500">{batch.entries} cash/check entries · {batch.total} total</span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${batch.statusColor}`}>{batch.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Giving Statement Preview */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#2d3142]">2025 Annual Giving Statement</h3>
              <p className="mt-1 text-sm text-gray-500">Michael & Jennifer Johnson · Total: $14,400.00</p>
            </div>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-semibold text-[#522398]">Preview</span>
          </div>
        </div>

        <MarketCallout
          stat="$146.5B"
          description="Religion is the #1 recipient of U.S. charitable giving"
          source="Giving USA, 2024"
        />
      </div>

  );
}
