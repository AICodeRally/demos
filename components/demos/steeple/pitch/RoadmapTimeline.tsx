import { roadmapPhases } from '@/data/steeple';

export function RoadmapTimeline() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-[#C5972C]">06</div>
        <div>
          <h3 className="text-3xl font-bold text-[#2d3142]">Investment & Roadmap</h3>
          <p className="text-gray-600">Three horizons from MVP to full platform</p>
        </div>
      </div>

      <div className="relative space-y-8">
        {/* Connecting line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

        {roadmapPhases.map((phase, i) => (
          <div key={phase.horizon} className="relative flex gap-6">
            {/* Timeline dot */}
            <div
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white"
              style={{ backgroundColor: phase.color }}
            >
              <span className="text-xs font-bold text-white">{i + 1}</span>
            </div>

            {/* Card */}
            <div className="flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-xl font-bold text-[#2d3142]">{phase.horizon}</h4>
                <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600">{phase.months}</span>
                <span className="rounded-full px-3 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: phase.color }}>
                  {phase.costRange}
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-0.5 text-xs font-medium text-gray-500">{phase.team}</span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="mb-2 text-sm font-semibold text-[#522398]">Product Milestones</h5>
                  <ul className="space-y-1.5">
                    {phase.productMilestones.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: phase.color }} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="mb-2 text-sm font-semibold text-[#522398]">Technical Milestones</h5>
                  <ul className="space-y-1.5">
                    {phase.techMilestones.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: phase.color }} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total investment */}
      <div className="mt-8 rounded-xl bg-gradient-to-r from-[#522398] to-[#6B3FA0] p-6 text-center text-white">
        <p className="text-sm font-medium text-white/70">Total Investment Range (24 months)</p>
        <p className="mt-1 text-3xl font-bold">$0.6M – $12M</p>
        <p className="mt-2 text-sm text-white/70">Scaling from 4 FTE to 18 FTE across three horizons</p>
      </div>
    </section>
  );
}
