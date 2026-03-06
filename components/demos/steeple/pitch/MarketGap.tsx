import { marketSegments, marketStats } from '@/data/steeple';

const borderColors = ['#C5972C', '#7C3AED', '#522398'];

export function MarketGap() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-[#C5972C]">02</div>
        <div>
          <h3 className="text-3xl font-bold text-[#2d3142]">The Market Gap</h3>
          <p className="text-gray-600">A product must be simultaneously simple for small churches and scalable for large ones</p>
        </div>
      </div>

      {/* Key stats */}
      <div className="mb-8 flex flex-col sm:flex-row gap-6">
        <div className="flex-1 rounded-xl bg-purple-50 p-6 text-center">
          <div className="text-4xl font-bold text-[#522398]">{marketStats[7].value}</div>
          <p className="mt-1 text-sm text-gray-600">{marketStats[7].label}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-gray-400">{marketStats[7].source}</p>
        </div>
        <div className="flex-1 rounded-xl bg-purple-50 p-6 text-center">
          <div className="text-4xl font-bold text-[#522398]">{marketStats[8].value}</div>
          <p className="mt-1 text-sm text-gray-600">{marketStats[8].label}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-gray-400">{marketStats[8].source}</p>
        </div>
      </div>

      {/* Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {marketSegments.map((seg, i) => (
          <div
            key={seg.name}
            className="rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]"
            style={{ borderLeft: `4px solid ${borderColors[i]}` }}
          >
            <h4 className="text-xl font-semibold text-[#2d3142]">{seg.name}</h4>
            <p className="mt-1 text-sm text-gray-500">{seg.size} · {seg.staffing}</p>
            <ul className="mt-4 space-y-2">
              {seg.painPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: borderColors[i] }} />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-sm italic text-gray-500">
                <span className="font-semibold not-italic" style={{ color: borderColors[i] }}>Edge Relevance:</span>{' '}
                {seg.edgeRelevance}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
