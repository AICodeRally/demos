'use client';


import { MarketOpportunity } from '@/components/demos/steeple/pitch/MarketOpportunity';
import { MarketGap } from '@/components/demos/steeple/pitch/MarketGap';
import { CompetitorTable } from '@/components/demos/steeple/pitch/CompetitorTable';
import { Differentiators } from '@/components/demos/steeple/pitch/Differentiators';
import { PricingVision } from '@/components/demos/steeple/pitch/PricingVision';
import { RoadmapTimeline } from '@/components/demos/steeple/pitch/RoadmapTimeline';
import { GCUAlignment } from '@/components/demos/steeple/pitch/GCUAlignment';

export default function PitchPage() {
  return (

      <div className="space-y-16">
        {/* Hero intro */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#2d3142]">
            STEEPLE Investment Opportunity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            An edge-first church management platform — built for worship-weekend
            reliability, privacy-first stewardship, and the 380,000+
            congregations across America.
          </p>
        </div>

        <MarketOpportunity />
        <MarketGap />
        <CompetitorTable />
        <Differentiators />
        <PricingVision />
        <RoadmapTimeline />
        <GCUAlignment />
      </div>

  );
}
