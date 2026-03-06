import { Check } from 'lucide-react';
import { pricingTiers } from '@/data/steeple';

export function PricingVision() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-[#C5972C]">05</div>
        <div>
          <h3 className="text-3xl font-bold text-[#2d3142]">Product & Pricing Vision</h3>
          <p className="text-gray-600">Aligned to church size segments — simple entry, scalable growth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-xl border bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)] ${
              tier.highlighted
                ? 'border-[#522398] ring-2 ring-[#522398]/20'
                : 'border-gray-100'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#522398] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </div>
            )}
            <h4 className="text-xl font-bold text-[#2d3142]">{tier.name}</h4>
            <div className="mt-2 inline-block rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#522398]">
              {tier.target}
            </div>
            <p className="mt-3 text-xs text-gray-500">{tier.deployment}</p>
            <div className="mt-4 text-lg font-bold text-[#522398]">{tier.priceSignal}</div>
            <ul className="mt-4 space-y-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
