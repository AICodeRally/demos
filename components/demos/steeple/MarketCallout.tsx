import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketCalloutProps {
  stat: string;
  description: string;
  source: string;
  className?: string;
}

export function MarketCallout({ stat, description, source, className }: MarketCalloutProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-5',
        className
      )}
    >
      <div className="absolute right-3 top-3 opacity-10">
        <TrendingUp className="h-10 w-10 text-[#522398]" />
      </div>
      <div className="relative">
        <div className="text-2xl font-bold text-[#522398]">{stat}</div>
        <p className="mt-1 text-sm font-medium text-gray-700">{description}</p>
        <p className="mt-2 text-[10px] uppercase tracking-widest text-gray-400">
          Source: {source}
        </p>
      </div>
    </div>
  );
}
