import { marketStats } from '@/data/steeple';

export function MarketOpportunity() {
  const highlights = [
    marketStats[0], // $146.5B
    { value: '$398M → $1.6B', label: 'Church management software market growth, 2025–2032', source: 'Industry Analysis', year: '2025–2032' },
    marketStats[4], // 86%
    marketStats[6], // 380K+
  ];

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-[#C5972C]">01</div>
        <div>
          <h3 className="text-3xl font-bold text-[#2d3142]">The Opportunity</h3>
          <p className="text-gray-600">Religion is the single largest recipient of U.S. charitable giving</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((stat, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
            <div className="text-4xl font-bold text-[#522398]">{stat.value}</div>
            <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-400">
              {stat.source}, {stat.year}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
