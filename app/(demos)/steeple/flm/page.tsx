'use client';

import { StatCard, ChartCard, EdgeBadge } from '@/components/demos/steeple';
import {
  Building,
  CheckCircle,
  Wrench,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  rooms,
  maintenanceTickets,
  equipment,
  facilityStats,
} from '@/data/steeple';

const statusColors: Record<string, string> = {
  available: '#059669',
  'in-use': '#2563EB',
  maintenance: '#DC2626',
};

const priorityColors: Record<string, string> = {
  low: '#6B7280',
  medium: '#D97706',
  high: '#DC2626',
  urgent: '#991B1B',
};

const ticketStatusColors: Record<string, string> = {
  open: '#DC2626',
  'in-progress': '#D97706',
  completed: '#059669',
  scheduled: '#2563EB',
};

const conditionColors: Record<string, string> = {
  excellent: '#059669',
  good: '#2563EB',
  fair: '#D97706',
  poor: '#DC2626',
};

export default function FacilitiesPage() {
  return (

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Rooms"
            value={facilityStats.totalRooms}
            icon={Building}
            color="#2563EB"
          />
          <StatCard
            title="Available"
            value={facilityStats.available}
            icon={CheckCircle}
            color="#059669"
          />
          <StatCard
            title="In Maintenance"
            value={facilityStats.inMaintenance}
            icon={Wrench}
            color="#DC2626"
          />
          <StatCard
            title="Utilization"
            value={`${facilityStats.utilizationRate}%`}
            icon={TrendingUp}
            color="#7C3AED"
          />
        </div>

        {/* Room Directory */}
        <ChartCard title="Room Directory">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)] hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)] transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900">{room.name}</h4>
                    <p className="mt-1 text-xs text-gray-500">{room.floor}</p>
                  </div>
                  <span
                    className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium text-white capitalize"
                    style={{ backgroundColor: statusColors[room.status] }}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{room.capacity}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-[#522398]/8 px-2 py-0.5 text-xs font-medium text-[#522398] capitalize">
                    {room.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Maintenance Tickets */}
        <ChartCard title="Maintenance Tickets">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Issue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Room
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Assigned To
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reported
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {maintenanceTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[#faf8f4]">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs">
                      {ticket.issue}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {ticket.location}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white capitalize"
                        style={{ backgroundColor: priorityColors[ticket.priority] }}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white capitalize"
                        style={{ backgroundColor: ticketStatusColors[ticket.status] }}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {ticket.assignedTo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {new Date(ticket.reportedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Equipment Inventory */}
        <ChartCard title="Equipment Inventory">
          <div className="space-y-3">
            {equipment.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-100 bg-white p-4 hover:bg-[#faf8f4] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white capitalize"
                        style={{ backgroundColor: conditionColors[item.condition] }}
                      >
                        {item.condition}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{item.category}</span>
                      <span>•</span>
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>
                        Last serviced:{' '}
                        {new Date(item.lastServiced).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Booking Approval Workflow */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2d3142]">Booking Requests</h3>
            <EdgeBadge variant="lan" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { room: 'Fellowship Hall', requester: 'Youth Ministry', date: 'Apr 12, 2pm-5pm', status: 'Confirmed', statusColor: 'bg-emerald-50 text-emerald-700' },
              { room: 'Room 204', requester: "Women's Bible Study", date: 'Apr 15, 10am-12pm', status: 'Approved', statusColor: 'bg-blue-50 text-blue-700' },
              { room: 'Main Sanctuary', requester: 'Community Concert', date: 'Apr 20, 6pm-9pm', status: 'Requested', statusColor: 'bg-amber-50 text-amber-700' },
            ].map((booking) => (
              <div key={booking.room + booking.date} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                <div>
                  <span className="font-semibold text-[#2d3142]">{booking.room}</span>
                  <span className="ml-2 text-sm text-gray-500">{booking.requester} &middot; {booking.date}</span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${booking.statusColor}`}>{booking.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Conflicts */}
        <div className="space-y-3">
          {[
            { alert: 'Projector A double-booked Sun 10am', severity: 'border-amber-200 bg-amber-50' },
            { alert: 'Parking Lot B reserved for construction Apr 14-18', severity: 'border-red-200 bg-red-50' },
          ].map((conflict) => (
            <div key={conflict.alert} className={`rounded-lg border-2 ${conflict.severity} p-3 text-sm font-medium text-gray-700`}>
              {conflict.alert}
            </div>
          ))}
        </div>

        {/* Setup Checklist — Sunday Service */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
          <h3 className="text-lg font-semibold text-[#2d3142]">Sunday Setup Checklist</h3>
          <div className="mt-4 space-y-2.5">
            {[
              { task: 'Set up 200 chairs in Main Sanctuary', done: true },
              { task: 'Test sound system + mic check', done: true },
              { task: 'Print 300 bulletins', done: false },
              { task: 'Stage communion elements', done: false },
              { task: 'Verify child check-in kiosks', done: false },
            ].map((item) => (
              <label key={item.task} className="flex items-center gap-3 text-sm">
                <div className={`h-4 w-4 shrink-0 rounded border ${item.done ? 'bg-[#522398] border-[#522398]' : 'border-gray-300'} flex items-center justify-center`}>
                  {item.done && <span className="text-white text-[10px]">&#x2713;</span>}
                </div>
                <span className={item.done ? 'text-gray-400 line-through' : 'text-gray-700'}>{item.task}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

  );
}
