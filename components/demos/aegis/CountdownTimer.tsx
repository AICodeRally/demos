'use client';

interface CountdownTimerProps {
  deadline: string; // ISO date string
  label: string;
  urgencyDays?: number; // threshold for "urgent" (default 3)
}

// Fixed reference "now" for demo purposes: March 3, 2026 12:00 UTC
const DEMO_NOW = new Date('2026-03-03T12:00:00Z');

function getTimeRemaining(deadline: string): {
  totalMs: number;
  days: number;
  hours: number;
  display: string;
  isPast: boolean;
} {
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - DEMO_NOW.getTime();

  if (diffMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, display: 'Overdue', isPast: true };
  }

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  let display: string;
  if (days > 0) {
    display = `${days}d ${hours}h`;
  } else {
    display = `${hours}h`;
  }

  return { totalMs: diffMs, days, hours, display, isPast: false };
}

function getUrgencyColor(
  days: number,
  isPast: boolean,
): { color: string; bg: string } {
  if (isPast) return { color: '#DC2626', bg: '#DC2626' };
  if (days < 1) return { color: '#DC2626', bg: '#DC2626' }; // red
  if (days < 3) return { color: '#EA580C', bg: '#EA580C' }; // orange
  if (days < 7) return { color: '#D97706', bg: '#D97706' }; // yellow/amber
  return { color: '#059669', bg: '#059669' }; // green
}

export function CountdownTimer({
  deadline,
  label,
  urgencyDays = 3,
}: CountdownTimerProps) {
  const remaining = getTimeRemaining(deadline);
  const urgency = getUrgencyColor(remaining.days, remaining.isPast);

  // Progress: assume a 14-day total window for the bar
  // Fill from right to left as deadline approaches
  const totalWindowDays = 14;
  const daysLeft = remaining.days + remaining.hours / 24;
  const progressPct = remaining.isPast
    ? 100
    : Math.min(((totalWindowDays - daysLeft) / totalWindowDays) * 100, 100);

  // Suppress the unused variable lint error by referencing urgencyDays
  // in the urgency threshold display
  const isUrgent = remaining.days < urgencyDays;

  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{
        backgroundColor: 'white',
        border: '1px solid #E7E5E4',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[12px]"
          style={{ color: '#57534E' }}
        >
          {label}
        </span>
        <span
          className="text-[13px] font-mono font-bold"
          style={{ color: urgency.color }}
        >
          {remaining.display}
          {isUrgent && !remaining.isPast && (
            <span className="ml-1 text-[10px] font-normal opacity-70">
              urgent
            </span>
          )}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-[6px] w-full rounded-full overflow-hidden"
        style={{ backgroundColor: '#F1F5F9' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            backgroundColor: urgency.bg,
          }}
        />
      </div>
    </div>
  );
}
