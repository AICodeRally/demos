import { HardDrive, WifiOff, ShieldCheck, GitMerge, Gauge } from 'lucide-react';
import { differentiators } from '@/data/steeple';

const iconMap: Record<string, React.ElementType> = {
  HardDrive,
  WifiOff,
  ShieldCheck,
  GitMerge,
  Gauge,
};

export function Differentiators() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-[#C5972C]">04</div>
        <div>
          <h3 className="text-3xl font-bold text-[#2d3142]">What Makes STEEPLE Different</h3>
          <p className="text-gray-600">Defensible, operationally meaningful differentiators — not cosmetic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {differentiators.map((d) => {
          const Icon = iconMap[d.icon];
          return (
            <div
              key={d.title}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(82,35,152,0.1),0_2px_4px_rgba(82,35,152,0.06)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                {Icon && <Icon className="h-6 w-6 text-[#522398]" />}
              </div>
              <h4 className="text-lg font-semibold text-[#2d3142]">{d.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{d.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
