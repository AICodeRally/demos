import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const hasChange = typeof change === 'number';
  const isPositive = change && change > 0;

  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#2d3142]">{value}</p>

          {hasChange && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              {isPositive ? (
                <>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-emerald-600">+{change}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-500">{change}%</span>
                </>
              )}
              <span className="text-gray-400">vs last period</span>
            </div>
          )}
        </div>

        <div
          className="rounded-xl p-3 transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: `${color}12` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
