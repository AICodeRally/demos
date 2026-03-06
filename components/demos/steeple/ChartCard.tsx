import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06)]',
        className
      )}
    >
      <h3 className="text-lg font-semibold tracking-tight text-[#2d3142]">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
