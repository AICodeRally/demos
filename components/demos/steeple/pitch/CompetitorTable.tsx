import { Check } from 'lucide-react';
import { competitors, competitorFeatures } from '@/data/steeple';

export function CompetitorTable() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-[#C5972C]">03</div>
        <div>
          <h3 className="text-3xl font-bold text-[#2d3142]">Competitive Landscape</h3>
          <p className="text-gray-600">Six established players — none with edge-first architecture</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Feature</th>
              {competitors.map((c) => (
                <th key={c.name} className="px-3 py-3 text-center font-medium text-gray-500 whitespace-nowrap">{c.name}</th>
              ))}
              <th className="px-3 py-3 text-center font-bold text-[#522398] bg-purple-50 whitespace-nowrap">STEEPLE</th>
            </tr>
          </thead>
          <tbody>
            {competitorFeatures.map((feature, idx) => (
              <tr key={feature} className={idx >= 6 ? 'bg-amber-50/50' : idx % 2 === 0 ? 'bg-gray-50/30' : ''}>
                <td className={`px-4 py-2.5 font-medium ${idx >= 6 ? 'text-[#522398] font-semibold' : 'text-gray-700'}`}>
                  {feature}
                </td>
                {competitors.map((c) => (
                  <td key={c.name} className="px-3 py-2.5 text-center">
                    {c.features[feature] ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center bg-purple-50">
                  <Check className="mx-auto h-4 w-4 text-[#522398]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitor summary cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.map((c) => (
          <div key={c.name} className="rounded-lg border border-gray-100 bg-white p-4">
            <h5 className="font-semibold text-[#2d3142]">{c.name}</h5>
            <p className="mt-1 text-xs text-gray-500">{c.pricingSignal}</p>
            <p className="mt-2 text-sm text-gray-600">{c.strengths}</p>
            <p className="mt-2 text-xs font-medium text-amber-600">Gap: {c.edgeGap}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
