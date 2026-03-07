import { DAY_PLANS } from '@/data/proofline';
import StopDetailClient from './client';

export function generateStaticParams() {
  return DAY_PLANS.flatMap((plan) => plan.stops.map((stop) => ({ id: stop.id })));
}

export default function StopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <StopDetailClient params={params} />;
}
